import { createServerFileRoute } from '@tanstack/react-start/server';
import { parse } from '@ast-grep/napi';
import * as fs from 'fs/promises';
import * as path from 'path';
import glob from 'fast-glob';
import * as yaml from 'js-yaml';

interface AstGrepRule {
  id: string;
  languages: string[];
  message?: string;
  severity?: string;
  pattern: string;
  holes?: Record<string, any>;
  metadata?: {
    bucket?: string;
  };
}

interface ContextItem {
  file: string;
  lines: [number, number];
  snippet: string;
  bucket: string | null;
  score: number;
  rule?: string;
}

interface RankedMatch {
  path: string;
  match: string;
  range: {
    start: { line: number };
    end: { line: number };
  };
  metadata?: {
    bucket?: string;
  };
  rule?: string;
  score: number;
}

const bucketsForIntent = (intent: string): string[] => {
  switch (intent) {
    case 'api':
      return ['api'];
    case 'model':
      return ['model'];
    case 'ui':
      return ['ui'];
    default:
      return ['api', 'model', 'ui'];
  }
};

const scoreMatch = (m: RankedMatch, resource: string, buckets: string[]): number => {
  let score = 0;
  if (m.path.includes(resource)) score += 3;
  if (m.metadata && buckets.includes(m.metadata.bucket as string)) score += 2;
  return score;
};

const bumpDuplicateScores = (matches: RankedMatch[]) => {
  const seen = new Map<string, number>();
  matches.forEach((m) => {
    const count = (seen.get(m.path) ?? 0) + 1;
    seen.set(m.path, count);
    if (count > 1) m.score += 1;
  });
};

const loadRules = async (rulesDir: string): Promise<AstGrepRule[]> => {
  const rules: AstGrepRule[] = [];
  try {
    const ruleFiles = await glob('*.yml', { cwd: rulesDir, absolute: true });

    for (const ruleFile of ruleFiles) {
      const content = await fs.readFile(ruleFile, 'utf-8');
      const rule = yaml.load(content) as AstGrepRule;
      if (rule) {
        rules.push(rule);
      }
    }
  } catch (error) {
    console.error('Error loading rules:', error);
  }

  return rules;
};

const getLanguageFromFile = (filePath: string): string | null => {
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
};

const processFile = async (
  filePath: string,
  rules: AstGrepRule[],
  resource: string
): Promise<RankedMatch[]> => {
  const matches: RankedMatch[] = [];

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const language = getLanguageFromFile(filePath);

    if (!language) return matches;

    // Parse the file content with ast-grep
    const sg = parse(language, content);

    for (const rule of rules) {
      if (!rule.languages.includes(language)) continue;

      // Apply pattern with environment variables
      let pattern = rule.pattern;
      if (resource) {
        pattern = pattern.replace(/\$RESOURCE/g, resource);
      }

      // Find all matches for this rule
      const root = sg.root();
      const nodes = root.findAll(pattern);

      for (const node of nodes) {
        const range = node.range();
        const match: RankedMatch = {
          path: filePath,
          match: node.text(),
          range: {
            start: { line: range.start.row },
            end: { line: range.end.row },
          },
          metadata: rule.metadata,
          rule: rule.id,
          score: 0,
        };
        matches.push(match);
      }
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }

  return matches;
};

export const ServerRoute = createServerFileRoute('/api/context').methods({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const resource = url.searchParams.get('resource')?.trim();
    const intent = url.searchParams.get('intent')?.trim() || 'api';

    if (!resource) {
      return Response.json(
        { error: 'Query params "resource" and "intent" required.' },
        { status: 400 }
      );
    }

    try {
      // Load all rules from the rules directory
      const rulesDir = path.join(process.cwd(), '.ast-grep/rules');
      const rules = await loadRules(rulesDir);

      // Find all source files
      const sourceFiles = await glob(
        [
          'src/**/*.{ts,tsx,js,jsx,mjs,cjs}',
          'scripts/**/*.{ts,tsx,js,jsx,mjs,cjs}',
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

      // Process all files and collect matches
      const allMatches: RankedMatch[] = [];
      const buckets = bucketsForIntent(intent);

      for (const file of sourceFiles) {
        const fileMatches = await processFile(file, rules, resource);

        // Score and add matches
        fileMatches.forEach((match) => {
          match.score = scoreMatch(match, resource, buckets);
          allMatches.push(match);
        });
      }

      // Bump scores for duplicates
      bumpDuplicateScores(allMatches);

      // Sort by score
      allMatches.sort((a, b) => b.score - a.score);

      // Stream NDJSON
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          allMatches.forEach((m) => {
            const contextItem: ContextItem = {
              file: m.path,
              lines: [m.range.start.line + 1, m.range.end.line + 1],
              snippet: m.match,
              bucket: m.metadata?.bucket ?? null,
              score: m.score,
              rule: m.rule,
            };

            controller.enqueue(encoder.encode(JSON.stringify(contextItem) + '\n'));
          });
          controller.close();
        },
      });

      return new Response(stream, {
        headers: { 'Content-Type': 'application/x-ndjson' },
      });
    } catch (err) {
      console.error('[api/context] failed:', err);
      return Response.json({ error: 'Context generation failed.' }, { status: 500 });
    }
  },
});
