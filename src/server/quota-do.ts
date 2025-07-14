import type { DurableObjectState } from '@cloudflare/workers-types';

/**
 * Durable Object that keeps a running total of tokens used per user per month.
 *
 *   •  GET  /<userId>               → returns { used, remaining, limit }
 *   •  POST /<userId>/decrement     → body { tokens } – increments usage
 *
 * The monthly window is detected via `YYYY-MM` (UTC) and automatically rolls over.
 */
export class QuotaDO {
  constructor(private state: DurableObjectState, private env: { MONTHLY_TOKEN_LIMIT?: string }) {}

  async fetch(request: Request): Promise<Response> {
    const url      = new URL(request.url);
    const parts    = url.pathname.slice(1).split('/'); // '' already stripped
    const userId   = parts[0] || '';
    const action   = parts[1];                         // may be undefined
    const monthKey = new Date().toISOString().slice(0, 7); // "YYYY-MM"
    const key      = `${userId}:${monthKey}`;

    const limit    = parseInt(this.env.MONTHLY_TOKEN_LIMIT ?? '1000000', 10);

    if (!userId) return new Response('Bad request', { status: 400 });

    /* ---------- GET  /<userId> ---------- */
    if (request.method === 'GET' && !action) {
      const used       = (await this.state.storage.get<number>(key)) ?? 0;
      const remaining  = limit - used;
      const quotaJSON  = JSON.stringify({ used, remaining, limit });
      return new Response(quotaJSON, { status: remaining >= 0 ? 200 : 402 });
    }

    /* ---------- POST /<userId>/decrement ---------- */
    if (request.method === 'POST' && action === 'decrement') {
      let tokens = 0;
      try {
        ({ tokens = 0 } = await request.clone().json());
      } catch {
        /* ignore malformed body – treat as zero */
      }

      const current   = (await this.state.storage.get<number>(key)) ?? 0;
      const newTotal  = current + Number(tokens);
      await this.state.storage.put(key, newTotal);

      const remaining = limit - newTotal;
      return new Response(
        JSON.stringify({ used: newTotal, remaining, limit }),
        { status: 200 },
      );
    }

    return new Response('Not found', { status: 404 });
  }
}