import { createServerFileRoute } from '@tanstack/react-start/server';
import { getRepoData } from '~/server/repo-storage';
import { normaliseRule } from '~/utils/pattern-guard';

interface ContextItem {
  file: string;
  lines: [number, number];
  snippet: string;
  score: number;
}

interface GeneratedRule {
  pattern: string;
  language?: string[];
}

interface AiTransformResult {
  rule: {
    pattern: string;
    languages?: string[];
  };
  intent: 'search' | 'add' | 'modify';
  suggestedPaths?: string[];
}

function getLanguageFromFile(fileName: string): string | null {
  const ext = fileName.split('.').pop()?.toLowerCase();
  const langMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    mjs: 'javascript',
    cjs: 'javascript',
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
  return langMap[ext || ''] || null;
}

async function generateAstGrepRule(prompt: string): Promise<GeneratedRule | null> {
  // Check if the prompt is already an AI-transformed result
  try {
    const parsed = JSON.parse(prompt) as AiTransformResult;
    if (parsed.rule && parsed.rule.pattern) {
      return {
        pattern: parsed.rule.pattern,
        language: parsed.rule.languages,
      };
    }
  } catch {
    // Not JSON, continue with original logic
  }

  // For now, we'll use a simple pattern matching approach
  // In a real implementation, this would call an LLM API

  const patterns: Record<string, GeneratedRule> = {
    'async function': {
      pattern: 'async function',
      language: ['javascript', 'typescript'],
    },
    'react component': {
      pattern: 'function.*return.*<',
      language: ['javascript', 'typescript'],
    },
    usestate: {
      pattern: 'useState\\(',
      language: ['javascript', 'typescript'],
    },
    'api route': {
      pattern: 'router\\.',
      language: ['javascript', 'typescript'],
    },
    class: {
      pattern: 'class\\s+\\w+',
      language: ['javascript', 'typescript'],
    },
    import: {
      pattern: 'import.*from',
      language: ['javascript', 'typescript'],
    },
    export: {
      pattern: 'export',
      language: ['javascript', 'typescript'],
    },
    'arrow function': {
      pattern: '=>',
      language: ['javascript', 'typescript'],
    },
    'try catch': {
      pattern: 'try\\s*\\{',
      language: ['javascript', 'typescript'],
    },
  };

  // Simple keyword matching for demo purposes
  const lowerPrompt = prompt.toLowerCase();

  for (const [key, rule] of Object.entries(patterns)) {
    if (lowerPrompt.includes(key)) {
      return rule;
    }
  }

  // Default pattern: search for the prompt as literal text
  return {
    pattern: prompt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    language: ['javascript', 'typescript', 'python', 'go', 'rust'],
  };
}

async function processRepoFileWithPattern(
  file: any,
  pattern: string,
  allowedLanguages?: string[],
  parentPath: string = ''
): Promise<ContextItem[]> {
  const matches: ContextItem[] = [];

  // Build full path
  const fullPath = parentPath ? `${parentPath}/${file.name}` : file.name;

  if (file.type === 'file' && file.content) {
    const language = getLanguageFromFile(file.name);

    if (language && (!allowedLanguages || allowedLanguages.includes(language))) {
      try {
        // Use regex pattern matching instead of ast-grep
        const regex = new RegExp(pattern, 'gmi');
        const allMatches = [...(file.content.matchAll(regex) || [])];

        for (const match of allMatches) {
          if (match.index !== undefined) {
            // Find line numbers
            const lines = file.content.substring(0, match.index).split('\n');
            const startLine = lines.length;
            const matchLines = match[0].split('\n').length;
            const endLine = startLine + matchLines - 1;

            // Extract snippet with context
            const allLines = file.content.split('\n');
            const contextStart = Math.max(0, startLine - 3);
            const contextEnd = Math.min(allLines.length - 1, endLine + 2);
            const snippet = allLines.slice(contextStart, contextEnd + 1).join('\n');

            const contextItem: ContextItem = {
              file: fullPath,
              lines: [startLine, endLine],
              snippet: snippet,
              score: 1,
            };
            matches.push(contextItem);
          }
        }
      } catch (error) {
        console.error(`Error processing file ${fullPath}:`, error);
      }
    }
  } else if (file.type === 'directory' && file.children) {
    // Recursively process children
    for (const child of file.children) {
      const childMatches = await processRepoFileWithPattern(
        child,
        pattern,
        allowedLanguages,
        fullPath
      );
      matches.push(...childMatches);
    }
  }

  return matches;
}

export const ServerRoute = createServerFileRoute('/api/interactive-grep').methods({
  POST: async ({ request }) => {
    try {
      const body = await request.json();
      const { prompt, repoUrl } = body;

      if (!prompt || typeof prompt !== 'string') {
        return Response.json(
          { error: 'Invalid request. "prompt" field is required.' },
          { status: 400 }
        );
      }

      // Repository URL is required
      if (!repoUrl || typeof repoUrl !== 'string') {
        return Response.json(
          { error: 'Invalid request. "repoUrl" field is required.' },
          { status: 400 }
        );
      }

      // Get stored repository data
      const repoData = await getRepoData(repoUrl);
      if (!repoData) {
        return Response.json(
          { error: 'Repository data not found. Please fetch the repository first.' },
          { status: 404 }
        );
      }

      // Parse AI-transformed result if present
      let aiResult: AiTransformResult | null = null;
      try {
        const parsed = JSON.parse(prompt);
        if (parsed.rule && parsed.intent) {
          aiResult = parsed as AiTransformResult;
        }
      } catch {
        // Not AI-transformed, continue with normal flow
      }

      // Generate ast-grep rule from prompt
      const rule = await generateAstGrepRule(prompt);

      if (!rule) {
        return Response.json({ error: 'Failed to generate pattern from prompt.' }, { status: 500 });
      }

      const safeRule = normaliseRule(rule);

      // Create streaming response
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          // Send the generated rule as metadata first
          const metadata = {
            type: 'metadata',
            rule: rule.pattern,
            languages: rule.language || ['javascript', 'typescript'], // Ensure languages is always defined
            ...(aiResult && {
              intent: aiResult.intent,
              suggestedPaths: aiResult.suggestedPaths,
            }),
          };

          controller.enqueue(encoder.encode(JSON.stringify(metadata) + '\n'));

          // Process files and stream results
          let totalMatches = 0;
          let totalFiles = 0;

          // Search through repository data
          const matches = await processRepoFileWithPattern(
            repoData.root,
            safeRule.pattern,
            safeRule.languages || rule.language
          );

          for (const match of matches) {
            totalMatches++;
            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  type: 'match',
                  ...match,
                }) + '\n'
              )
            );
          }

          // Count total files in repo
          const countFiles = (node: any): number => {
            if (node.type === 'file') return 1;
            if (node.children) {
              return node.children.reduce((sum: number, child: any) => sum + countFiles(child), 0);
            }
            return 0;
          };
          totalFiles = countFiles(repoData.root);

          // If AI suggested paths for additions and no matches found
          if (aiResult?.suggestedPaths && totalMatches === 0 && aiResult.intent === 'add') {
            for (const suggestedPath of aiResult.suggestedPaths) {
              controller.enqueue(
                encoder.encode(
                  JSON.stringify({
                    type: 'suggestion',
                    path: suggestedPath,
                    reason: 'Suggested location for new file',
                  }) + '\n'
                )
              );
            }
          }

          // Send summary
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: 'summary',
                totalFiles: totalFiles,
                totalMatches,
                ...(aiResult && {
                  wasAiTransformed: true,
                  intent: aiResult.intent,
                }),
              }) + '\n'
            )
          );

          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'application/x-ndjson',
          'Cache-Control': 'no-cache',
        },
      });
    } catch (err) {
      console.error('[api/interactive-grep] failed:', err);
      return Response.json({ error: 'Interactive grep failed.' }, { status: 500 });
    }
  },
});
