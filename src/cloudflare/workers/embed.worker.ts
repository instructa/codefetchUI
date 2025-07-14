import { Vectorize } from '@cloudflare/vectorize';
import { Ai } from '@cloudflare/ai';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FileNode[];
}

interface EmbedJob {
  url: string;
  tree: FileNode;
}

const MAX_CHARS = 2_048; // truncate very large files

/**
 * Flatten repo tree and yield {id, text, metadata}.
 * Using file‑path as part of the id guarantees stable
 * updates and enables TTL replacement.
 */
function* flattenTree(url: string, node: FileNode): Generator<{
  id: string;
  text: string;
  metadata: Record<string, unknown>;
}> {
  if (node.type === 'file' && node.content) {
    const text = node.content.slice(0, MAX_CHARS);
    const id = `${url}:${node.path}`;
    yield {
      id,
      text,
      metadata: { url, path: node.path },
    };
  }
  if (node.children) {
    for (const child of node.children) {
      yield* flattenTree(url, child);
    }
  }
}

export default {
  // Cloudflare Queues worker entry‑point
  async queue(batch: MessageBatch<EmbedJob>, env: Record<string, any>): Promise<void> {
    const ai = new Ai(env);
    const vectorIndex = new Vectorize(env.CF_VECTORIZE_INDEX, env);

    for (const msg of batch.messages) {
      try {
        const { url, tree } = msg.body;
        const chunks = Array.from(flattenTree(url, tree));

        // Embed in small batches to avoid huge parallelism.
        const BATCH_SIZE = 32;
        for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
          const slice = chunks.slice(i, i + BATCH_SIZE);
          const texts = slice.map((c) => c.text);
          const vectors: number[][] = await ai.run(
            env.CF_AI_MODEL,
            { text: texts },
          );

          // Upsert embeddings.
          await vectorIndex.upsert(
            slice.map((c, idx) => ({
              id: c.id,
              values: vectors[idx],
              metadata: c.metadata,
              // Two‑hour TTL aligned with repo‑storage.
              expiresAt: Math.floor(Date.now() / 1000) + 7200,
            })),
          );
        }

        msg.ack();
      } catch (err) {
        console.error('[embed.worker] failed job', err);
        // let it retry later
        msg.retry();
      }
    }
  },
};