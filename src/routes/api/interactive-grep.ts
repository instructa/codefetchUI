import { createServerFileRoute } from '@tanstack/react-start/server';
import { parse } from '@ast-grep/napi';
import * as fs from 'fs/promises';
import * as path from 'path';
import glob from 'fast-glob';
import * as yaml from 'js-yaml';

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

const FEW_SHOT_EXAMPLES = `
You are an expert at converting natural language queries into ast-grep patterns.

Examples:
Query: "find all async functions"
Output:
\`\`\`yaml
pattern: |
  async function $FUNC($$$ARGS) { $$$BODY }
languages: [javascript, typescript]
\`\`\`

Query: "find all React components"  
Output:
\`\`\`yaml
pattern: |
  function $COMPONENT($$$ARGS) { 
    $$$BODY
    return $JSX
  }
languages: [javascript, typescript]
\`\`\`

Query: "find all useState hooks"
Output:
\`\`\`yaml
pattern: |
  const [$STATE, $SETTER] = useState($$$)
languages: [javascript, typescript]
\`\`\`

Query: "find all API routes"
Output:
\`\`\`yaml
pattern: |
  router.$METHOD($PATH, $$$)
languages: [javascript, typescript]
\`\`\`

Query: "find all class definitions"
Output:
\`\`\`yaml
pattern: |
  class $CLASS { $$$BODY }
languages: [javascript, typescript]
\`\`\`
`;

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

  // Default pattern if no match
  return {
    pattern: '$$$ANY',
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

async function processFileWithPattern(
  filePath: string,
  pattern: string,
  allowedLanguages?: string[]
): Promise<ContextItem[]> {
  const matches: ContextItem[] = [];

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const language = getLanguageFromFile(filePath);

    if (!language) return matches;

    // Check if this language is allowed
    if (allowedLanguages && !allowedLanguages.includes(language)) {
      return matches;
    }

    // Parse the file content with ast-grep
    const sg = parse(language, content);
    const root = sg.root();
    const nodes = root.findAll(pattern);

    for (const node of nodes) {
      const range = node.range();
      const match: ContextItem = {
        file: filePath,
        lines: [range.start.row + 1, range.end.row + 1],
        snippet: node.text(),
        score: 1,
      };
      matches.push(match);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }

  return matches;
}

export const ServerRoute = createServerFileRoute('/api/interactive-grep').methods({
  POST: async ({ request }) => {
    try {
      const body = await request.json();
      const { prompt } = body;

      if (!prompt || typeof prompt !== 'string') {
        return Response.json(
          { error: 'Invalid request. "prompt" field is required.' },
          { status: 400 }
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

      // Find all source files
      const sourceFiles = await glob(
        [
          'src/**/*.{ts,tsx,js,jsx,mjs,cjs}',
          '!**/node_modules/**',
          '!**/.git/**',
          '!**/dist/**',
          '!**/build/**',
        ],
        {
          cwd: process.cwd(),
          absolute: true,
        }
      );

      // Create streaming response
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          // Send the generated rule as metadata first
          const metadata = {
            type: 'metadata',
            rule: rule.pattern,
            languages: rule.language,
            ...(aiResult && {
              intent: aiResult.intent,
              suggestedPaths: aiResult.suggestedPaths,
            }),
          };

          controller.enqueue(encoder.encode(JSON.stringify(metadata) + '\n'));

          // Process files and stream results
          let totalMatches = 0;

          for (const file of sourceFiles) {
            const matches = await processFileWithPattern(file, rule.pattern, rule.language);

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
          }

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
                totalFiles: sourceFiles.length,
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
