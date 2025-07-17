import { createServerFileRoute } from '@tanstack/react-start/server';
import { parse } from '@ast-grep/napi';
import * as path from 'path';
import { getRepoData } from '~/server/repo-storage';
// <add import>
import { normaliseRule } from '~/utils/pattern-guard';
// </add>

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
    kind?: string;
  };
  suggestedPaths?: string[];
  intent: 'refactor' | 'debug' | 'add' | 'find' | 'other';
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
      pattern: 'async function $FUNC($$$ARGS) { $$$BODY }',
      language: ['javascript', 'typescript'],
    },
    'react component': {
      pattern: 'function $COMPONENT($$$ARGS) { $$$BODY return $JSX }',
      language: ['javascript', 'typescript'],
    },
    usestate: {
      pattern: 'const [$STATE, $SETTER] = useState($$$)',
      language: ['javascript', 'typescript'],
    },
    'api route': {
      pattern: 'router.$METHOD($PATH, $$$)',
      language: ['javascript', 'typescript'],
    },
    class: {
      pattern: 'class $CLASS { $$$BODY }',
      language: ['javascript', 'typescript'],
    },
    import: {
      pattern: 'import $$$IMPORTS from $MODULE',
      language: ['javascript', 'typescript'],
    },
    export: {
      pattern: 'export $$$DECL',
      language: ['javascript', 'typescript'],
    },
    'arrow function': {
      pattern: 'const $FUNC = ($$$ARGS) => $BODY',
      language: ['javascript', 'typescript'],
    },
    'try catch': {
      pattern: 'try { $$$TRY } catch ($ERR) { $$$CATCH }',
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

  // Default pattern if no match - extract keywords and search for them
  const words = lowerPrompt.split(/\s+/).filter((word) => word.length > 2);
  const keyword = words.find((w) => !['want', 'need', 'find', 'show', 'get'].includes(w)) || 'code';

  return {
    pattern: keyword, // Search for the keyword as a literal string
    language: ['javascript', 'typescript'],
  };
}

function getLanguageFromFile(filePath: string): string | null {
  const ext = path.extname(filePath).toLowerCase();
  const langMap: Record<string, string> = {
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.mjs': 'javascript',
    '.cjs': 'javascript',
  };
  return langMap[ext] || null;
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
        // Parse the file content with ast-grep
        const sg = parse(language, file.content);
        const root = sg.root();
        const nodes = root.findAll(pattern);

        for (const node of nodes) {
          const range = node.range();
          // ast-grep uses 'line' property, not 'row'
          const match: ContextItem = {
            file: fullPath,
            lines: [(range.start as any).line + 1, (range.end as any).line + 1],
            snippet: node.text(),
            score: 1,
          };
          matches.push(match);
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
        return Response.json(
          { error: 'Failed to generate ast-grep rule from prompt.' },
          { status: 500 }
        );
      }

      // <add>
      const safeRule = normaliseRule(rule);
      // </add>

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
            // <add>
            safeRule.pattern,
            // </add>
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
