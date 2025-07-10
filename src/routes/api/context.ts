import { createServerFileRoute } from '@tanstack/react-start/server';
import { AstGrep, type MatchRecord } from '@ast-grep/napi';

interface RankedMatch extends MatchRecord {
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

const scoreMatch = (m: MatchRecord, resource: string, buckets: string[]): number => {
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
      const sg = new AstGrep('.');
      const rawMatches = sg.scan({
        ruleDirs: ['.ast-grep/rules'],
        env: { RESOURCE: resource },
      });

      const buckets = bucketsForIntent(intent);
      const ranked: RankedMatch[] = rawMatches.map((m) => ({
        ...m,
        score: scoreMatch(m, resource, buckets),
      }));

      bumpDuplicateScores(ranked);

      // Stream NDJSON
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          ranked.forEach((m) => {
            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  file: m.path,
                  lines: [m.range.start.line + 1, m.range.end.line + 1],
                  snippet: m.match,
                  bucket: m.metadata?.bucket ?? null,
                  score: m.score,
                }) + '\n'
              )
            );
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
