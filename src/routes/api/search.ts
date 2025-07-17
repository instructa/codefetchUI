import { createServerFileRoute } from '@tanstack/react-start/server';
import { chooseEngine, type SearchEngine } from '~/utils/engine-select';
import { getRepoData } from '~/server/repo-storage';

interface Match {
  type: 'match';
  file: string;
  lines?: [number, number];
  snippet: string;
  score: number;
  origin: 'semantic' | 'ast';
}

interface Summary {
  type: 'summary';
  totalFiles: number;
  totalMatches: number;
}

interface Metadata {
  type: 'metadata';
  engine: string;
  rule?: string;
}

// Helper function to calculate cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Helper to get language from file extension
function getLang(filepath: string): string {
  const ext = filepath.split('.').pop()?.toLowerCase() || '';
  const langMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    rb: 'ruby',
    go: 'go',
    rs: 'rust',
    php: 'php',
    swift: 'swift',
  };
  return langMap[ext] || 'text';
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
  if (!context?.AI) {
    throw new Error('AI binding missing');
  }

  const repoData = await getRepoData(repoUrl);
  if (!repoData) throw new Error('Repo not scraped yet');

  try {
    // 1. Generate embedding for the query
    const queryEmbedding = await context.AI.run('@cf/baai/bge-base-en-v1.5', {
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

      const embeddings = await context.AI.run('@cf/baai/bge-base-en-v1.5', {
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

/* ---------- Simplified AST Search Implementation ---------- */
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

  // Simplified pattern matching without ast-grep
  const searchPatterns: Record<string, RegExp[]> = {
    function: [/function\s+\w+\s*\(/g, /const\s+\w+\s*=\s*\(/g, /=>\s*\{/g],
    class: [/class\s+\w+/g, /export\s+class\s+\w+/g],
    import: [/import\s+.*\s+from/g, /require\s*\(/g],
    export: [/export\s+/g],
    async: [/async\s+function/g, /async\s+\(/g, /async\s+=>/g],
  };

  // Try to match prompt with pattern types
  let patterns: RegExp[] = [];
  const lowerPrompt = prompt.toLowerCase();

  for (const [key, regexes] of Object.entries(searchPatterns)) {
    if (lowerPrompt.includes(key)) {
      patterns = regexes;
      break;
    }
  }

  // Default to searching for the prompt as literal text
  if (patterns.length === 0) {
    try {
      patterns = [new RegExp(prompt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')];
    } catch {
      patterns = [];
    }
  }

  emit({ type: 'metadata', engine: 'ast', rule: prompt } as Metadata);

  let totalMatches = 0;
  let totalFiles = 0;

  // traverse repo tree
  const processFile = async (node: any, parent: string) => {
    const fullPath = parent ? `${parent}/${node.name}` : node.name;

    if (node.type === 'file' && node.content) {
      totalFiles++;

      for (const pattern of patterns) {
        const matches = [...(node.content.matchAll(pattern) || [])];

        for (const match of matches) {
          if (match.index !== undefined) {
            // Find line numbers
            const lines = node.content.substring(0, match.index).split('\n');
            const startLine = lines.length;
            const matchLines = match[0].split('\n').length;
            const endLine = startLine + matchLines - 1;

            // Extract snippet with context
            const allLines = node.content.split('\n');
            const contextStart = Math.max(0, startLine - 2);
            const contextEnd = Math.min(allLines.length - 1, endLine + 2);
            const snippet = allLines.slice(contextStart, contextEnd + 1).join('\n');

            emit({
              type: 'match',
              file: fullPath,
              lines: [startLine, endLine],
              snippet: snippet,
              score: 1,
              origin: 'ast',
            } as Match);
            totalMatches++;
          }
        }
      }
    } else if (node.children) {
      for (const child of node.children) await processFile(child, fullPath);
    }
  };

  try {
    await processFile(repoData.root, '');
  } catch (err) {
    const msg = (err as Error).message ?? 'unknown error';
    emit({ type: 'warning', msg: 'Pattern search failed – fallback results shown' });

    const { logSearchError } = await import('~/server/analytics');
    await logSearchError(context.cloudflare?.env, {
      repo: repoUrl,
      engine: 'ast',
      pattern: prompt,
      error: msg,
    });
  }

  emit({ type: 'summary', totalFiles, totalMatches } as Summary);
}
