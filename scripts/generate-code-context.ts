#!/usr/bin/env tsx
/**
 * Generate a ranked "code context" list for a given resource + intent.
 *
 * Usage:
 *   pnpm context:generate --resource weather --intent api
 */
import { AstGrep, MatchRecord } from '@ast-grep/napi';
import fs from 'fs';
import path from 'path';

interface Args {
  resource: string;
  intent: string;
}

function parseArgs(): Args {
  const [, , ...rest] = process.argv;
  const argMap = Object.fromEntries(
    rest.map((arg) => {
      const [k, v] = arg.replace(/^--/, '').split('=');
      return [k, v];
    })
  );

  if (!argMap.resource || !argMap.intent) {
    console.error('Usage: pnpm context:generate --resource <name> --intent <api|model|ui>');
    process.exit(1);
  }

  return { resource: argMap.resource, intent: argMap.intent };
}

function bucketsForIntent(intent: string): string[] {
  switch (intent) {
    case 'api':
      return ['api'];
    case 'model':
      return ['model'];
    case 'ui':
      return ['ui'];
    default:
      return ['api', 'model', 'ui']; // run all when unsure
  }
}

type RankedMatch = MatchRecord & { score: number };

function scoreMatch(m: MatchRecord, resource: string, buckets: string[]): number {
  let score = 0;
  if (m.path.includes(resource)) score += 3;
  if (m.metadata && buckets.includes(m.metadata.bucket as string)) score += 2;
  return score; // duplicate bump handled later
}

function bumpDuplicateScores(matches: RankedMatch[]): void {
  const seen = new Map<string, number>();
  matches.forEach((m) => {
    const count = (seen.get(m.path) ?? 0) + 1;
    seen.set(m.path, count);
    if (count > 1) m.score += 1;
  });
}

async function main() {
  const { resource, intent } = parseArgs();
  const buckets = bucketsForIntent(intent);

  const sg = new AstGrep('.');
  const rawMatches = sg.scan({
    ruleDirs: ['.ast-grep/rules'],
    env: { RESOURCE: resource },
  });

  const ranked: RankedMatch[] = rawMatches.map((m) => ({
    ...m,
    score: scoreMatch(m, resource, buckets),
  }));

  bumpDuplicateScores(ranked);

  const sorted = ranked.sort((a, b) => b.score - a.score);
  const output = sorted.map((m) => ({
    rule: m.rule,
    file: m.path,
    lines: [m.range.start.line + 1, m.range.end.line + 1],
    snippet: m.match,
    bucket: m.metadata?.bucket ?? null,
    score: m.score,
  }));

  const outPath = path.resolve('context.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(JSON.stringify(output, null, 2));
  console.log(`\nContext written to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
