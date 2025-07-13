import { createServerFileRoute } from '@tanstack/react-start/server';
import { chooseEngine, type SearchEngine } from '~/utils/engine-select';
import { getRepoData } from '~/server/repo-storage';
import { parse } from '@ast-grep/napi';

interface Match {
  type: 'match';
  file: string;
  lines?: [number, number];
  snippet: string;
  score: number;
  origin: 'semantic' | 'ast';
}

interface Metadata {
  type: 'metadata';
  engine: SearchEngine;
  rule?: string;
}

interface Summary {
  type: 'summary';
  totalFiles: number;
  totalMatches: number;
}

export const ServerRoute = createServerFileRoute('/api/search' as any).methods({
  POST: async ({ request, context }) => {
    const { prompt, repoUrl, engine: engineArg } = await request.json();

    if (typeof prompt !== 'string' || !prompt.trim()) {
      return Response.json({ error: 'Prompt is required' }, { status: 400 });
    }
    if (!repoUrl || typeof repoUrl !== 'string') {
      return Response.json({ error: 'repoUrl is required' }, { status: 400 });
    }

    const engine: SearchEngine = engineArg || chooseEngine(prompt);

    try {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          // Emit metadata first
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'metadata', engine }) + '\n'));

          const emit = (obj: object) =>
            controller.enqueue(encoder.encode(JSON.stringify(obj) + '\n'));

          try {
            switch (engine) {
              case 'vector':
              case 'hybrid':
                await semanticSearch(prompt, repoUrl, context, emit);
                break;
              case 'ast':
                await astSearch(prompt, repoUrl, context, emit);
                break;
              default:
                await semanticSearch(prompt, repoUrl, context, emit);
            }
          } catch (err) {
            emit({ type: 'error', message: (err as Error).message });
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: { 'Content-Type': 'application/x-ndjson' },
      });
    } catch (err) {
      console.error('[api/search] fatal', err);
      return Response.json({ error: 'Search failed' }, { status: 500 });
    }
  },
});

/* ---------- Semantic Search Implementation ---------- */
async function semanticSearch(
  query: string,
  repoUrl: string,
  context: any,
  emit: (
    obj: Match | Summary | { type: 'error'; message: string } | { type: 'warning'; msg: string }
  ) => void
) {
  const env = context.cloudflare?.env;
  if (!env?.AI) {
    throw new Error('AI binding missing');
  }

  const repoData = await getRepoData(repoUrl);
  if (!repoData) throw new Error('Repo not scraped yet');

  try {
    // 1. Generate embedding for the query
    const queryEmbedding = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
      text: [query],
    });
    const queryVector = queryEmbedding.data[0];

    // 2. Collect all files and generate embeddings for them
    const files: Array<{ path: string; content: string }> = [];
    const collectFiles = (node: any, parent: string) => {
      const fullPath = parent ? `${parent}/${node.name}` : node.name;

      if (node.type === 'file' && node.content) {
        // Only process code files
        const ext = fullPath.split('.').pop()?.toLowerCase() || '';
        if (
          [
            'ts',
            'tsx',
            'js',
            'jsx',
            'py',
            'java',
            'cpp',
            'c',
            'h',
            'hpp',
            'cs',
            'rb',
            'go',
            'rs',
            'php',
            'swift',
          ].includes(ext)
        ) {
          files.push({ path: fullPath, content: node.content.substring(0, 1000) }); // Limit content size
        }
      } else if (node.children) {
        for (const child of node.children) {
          collectFiles(child, fullPath);
        }
      }
    };
    collectFiles(repoData.root, '');

    // 3. Generate embeddings for files (batch process)
    const fileEmbeddings: Array<{ path: string; vector: number[]; content: string }> = [];

    // Process in batches to avoid overwhelming the AI
    const batchSize = 10;
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const texts = batch.map((f) => f.content);

      const embeddings = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
        text: texts,
      });

      batch.forEach((file, idx) => {
        if (embeddings.data[idx]) {
          fileEmbeddings.push({
            path: file.path,
            vector: embeddings.data[idx],
            content: file.content,
          });
        }
      });
    }

    // 4. Calculate cosine similarity and find top matches
    const results = fileEmbeddings
      .map((file) => ({
        path: file.path,
        content: file.content,
        score: cosineSimilarity(queryVector, file.vector),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20); // Top 20 results

    // 5. Emit results
    let totalMatches = 0;
    for (const result of results) {
      if (result.score > 0.3) {
        // Threshold for relevance
        totalMatches++;
        emit({
          type: 'match',
          file: result.path,
          snippet: result.content.substring(0, 200) + '...',
          score: result.score,
          origin: 'semantic',
        } as Match);
      }
    }

    emit({ type: 'summary', totalFiles: files.length, totalMatches } as Summary);
  } catch (err) {
    console.error('Semantic search error:', err);
    emit({
      type: 'warning',
      msg: 'Semantic search failed. Try using AST search instead.',
    });
  }
}

/* ---------- AST Search Implementation ---------- */
async function astSearch(
  prompt: string,
  repoUrl: string,
  context: any,
  emit: (
    obj:
      | Match
      | Summary
      | Metadata
      | { type: 'error'; message: string }
      | { type: 'warning'; msg: string }
  ) => void
) {
  const repoData = await getRepoData(repoUrl);
  if (!repoData) throw new Error('Repo not scraped yet');

  // Normalise rule or derive from prompt
  const { normaliseRule } = await import('~/utils/pattern-guard');
  const ruleObj = normaliseRule(prompt);
  const pattern = ruleObj.pattern;
  const allowedLangs = ruleObj.languages;

  emit({ type: 'metadata', engine: 'ast', rule: pattern } as Metadata);

  let totalMatches = 0;
  let totalFiles = 0;

  // traverse repo tree
  const processFile = async (node: any, parent: string) => {
    const fullPath = parent ? `${parent}/${node.name}` : node.name;

    if (node.type === 'file' && node.content) {
      totalFiles++;
      const lang = getLang(fullPath);
      if (allowedLangs && !allowedLangs.includes(lang)) return;

      const sg = parse(lang, node.content);
      sg.root()
        .findAll(pattern)
        .forEach((n) => {
          const range: any = n.range();
          emit({
            type: 'match',
            file: fullPath,
            lines: [range.start.line + 1, range.end.line + 1],
            snippet: n.text(),
            score: 1,
            origin: 'ast',
          } as Match);
          totalMatches++;
        });
    } else if (node.children) {
      for (const child of node.children) await processFile(child, fullPath);
    }
  };

  try {
    await processFile(repoData.root, '');
  } catch (err) {
    const msg = (err as Error).message ?? 'unknown error';
    emit({ type: 'warning', msg: 'ast-grep failed – fallback results shown' });

    const { logSearchError } = await import('~/server/analytics');
    await logSearchError(context.cloudflare?.env, {
      repo: repoUrl,
      engine: 'ast',
      pattern,
      error: msg,
    });
  }

  emit({ type: 'summary', totalFiles, totalMatches } as Summary);
}

// Helper function to calculate cosine similarity
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}

function getLang(p: string): string {
  const ext = p.split('.').pop()?.toLowerCase() || '';
  if (ext === 'ts' || ext === 'tsx') return 'typescript';
  if (ext === 'js' || ext === 'jsx' || ext === 'mjs' || ext === 'cjs') return 'javascript';
  return 'javascript';
}
