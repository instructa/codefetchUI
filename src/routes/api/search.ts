import { createServerFileRoute } from '@tanstack/react-start/server';
import { Ai } from '@cloudflare/ai';
import { Vectorize } from '@cloudflare/vectorize';
import { chooseEngine, type SearchEngine } from '~/utils/engine-select';
import { normaliseRule } from '~/utils/pattern-guard';
import { getRepoData } from '~/server/repo-storage';
import { parse } from '@ast-grep/napi';
import { logSearchError } from '~/server/analytics';

interface Match {
  type: 'match';
  file: string;
  lines?: [number, number];
  snippet: string;
  score: number;
  origin: 'vector' | 'ast' | 'vector+sg';
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

export const ServerRoute = createServerFileRoute('/api/search').methods({
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
          controller.enqueue(
            encoder.encode(JSON.stringify({ type: 'metadata', engine }) + '\n'),
          );

          const emit = (obj: object) =>
            controller.enqueue(encoder.encode(JSON.stringify(obj) + '\n'));

          try {
            switch (engine) {
              case 'vector':
                await vectorSearch(prompt, repoUrl, context, emit);
                break;
              case 'ast':
                await astSearch(prompt, repoUrl, context, emit);
                break;
              case 'hybrid':
              default:
                await hybridSearch(prompt, repoUrl, context, emit);
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

/* ---------- Engine Implementations ---------- */
async function vectorSearch(
  query: string,
  repoUrl: string,
  context: any,
  emit: (obj: object) => void,
) {
  const env = context.cloudflare?.env;
  if (!env?.CF_VECTORIZE_INDEX) {
    throw new Error('Vector index binding missing');
  }

  // 1) Embed query
  const ai = new Ai(env);
  const [embedding] = await ai.run(env.CF_AI_MODEL, { text: [query] });

  // 2) Vector search (top 50)
  const index = new Vectorize(env.CF_VECTORIZE_INDEX, env);
  const { matches } = await index.query({
    topK: 50,
    vector: embedding,
    includeMetadata: true,
  });

  let totalMatches = 0;
  const seen = new Set<string>();
  for (const m of matches) {
    // metadata contains {url, path}
    if (m.metadata?.url !== repoUrl) continue;
    const key = m.metadata.path;
    if (seen.has(key)) continue; // dedupe
    seen.add(key);
    totalMatches++;

    emit({
      type: 'match',
      file: m.metadata.path,
      snippet: `…`, // snippet deferred until ast‑grep confirm
      score: m.score,
      origin: 'vector',
    } as Match);
  }

  emit({ type: 'summary', totalFiles: seen.size, totalMatches } as Summary);
}

async function astSearch(
  prompt: string,
  repoUrl: string,
  context: any,
  emit: (obj: object) => void,
) {
  const repoData = await getRepoData(repoUrl);
  if (!repoData) throw new Error('Repo not scraped yet');

  // Normalise rule or derive from prompt
  const ruleObj = normaliseRule(prompt);
  const pattern = ruleObj.pattern;
  const allowedLangs = ruleObj.languages;

  emit({ type: 'metadata', rule: pattern });

  let totalMatches = 0;
  let totalFiles = 0;

  // traverse repo tree
  const processFile = async (
    node: any,
    parent: string,
  ) => {
    const fullPath = parent ? `${parent}/${node.name}` : node.name;

    if (node.type === 'file' && node.content) {
      totalFiles++;
      const lang = getLang(fullPath);
      if (allowedLangs && !allowedLangs.includes(lang)) return;

      const sg = parse(lang, node.content);
      sg
        .root()
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

    await logSearchError(context.cloudflare?.env, {
      repo: repoUrl,
      engine: 'ast',
      pattern,
      error: msg,
    });
  }

  emit({ type: 'summary', totalFiles, totalMatches } as Summary);
}

async function hybridSearch(
  prompt: string,
  repoUrl: string,
  context: any,
  emit: (obj: object) => void,
) {
  // Phase 1: vector narrow
  const paths: string[] = [];
  await vectorSearch(prompt, repoUrl, context, (obj) => {
    if (obj.type === 'match' && obj.origin === 'vector') {
      paths.push(obj.file);
    }
  });

  // Phase 2: ast‑grep within narrowed set
  const repoData = await getRepoData(repoUrl);
  if (!repoData) throw new Error('Repo not scraped yet');

  const ruleObj = normaliseRule(prompt);
  const pattern = ruleObj.pattern;
  const allowedLangs = ruleObj.languages;

  let totalMatches = 0;
  let totalFiles = paths.length;

  const pathSet = new Set(paths);

  const processFile = async (node: any, parent: string) => {
    const fullPath = parent ? `${parent}/${node.name}` : node.name;

    if (node.type === 'file' && node.content && pathSet.has(fullPath)) {
      const lang = getLang(fullPath);
      if (allowedLangs && !allowedLangs.includes(lang)) return;

      const sg = parse(lang, node.content);
      sg
        .root()
        .findAll(pattern)
        .forEach((n) => {
          const range: any = n.range();
          emit({
            type: 'match',
            file: fullPath,
            lines: [range.start.line + 1, range.end.line + 1],
            snippet: n.text(),
            score: 2, // confidence boost
            origin: 'vector+sg',
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
    emit({ type: 'warning', msg: 'ast-grep failed – showing vector results only' });

    await logSearchError(context.cloudflare?.env, {
      repo: repoUrl,
      engine: 'hybrid',
      pattern,
      error: msg,
    });
  }

  emit({ type: 'summary', totalFiles, totalMatches } as Summary);
}

function getLang(p: string): string {
  const ext = p.split('.').pop()?.toLowerCase() || '';
  if (ext === 'ts' || ext === 'tsx') return 'typescript';
  if (ext === 'js' || ext === 'jsx' || ext === 'mjs' || ext === 'cjs')
    return 'javascript';
  return 'javascript';
}