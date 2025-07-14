import { Hono } from 'hono';
import { buildAuthApp } from '../auth.cf';

// <add cf-type-import>
import type { D1Database, DurableObjectNamespace } from '@cloudflare/workers-types';
// </add>

// RateLimit alias already added below
type RateLimit = { limit(key: string): Promise<{ allowed: boolean }> };

export interface Env {
  AI_RATELIMIT: RateLimit;
  QUOTA_DO: DurableObjectNamespace;
  AI_GATEWAY_URL: string;
  // plus whatever else your worker exposes
  AUTH_DB: D1Database;
  SESSION_COOKIE_NAME: string;
  MONTHLY_TOKEN_LIMIT: string;
}

const ai = new Hono<Env>();

ai.post('/', async (c) => {
  // validate session
  const authApp = buildAuthApp(c.env);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore – we attached "auth" dynamically
  const session = await authApp.auth.api.getSession({ headers: c.req.raw.headers });

  if (!session?.user) return c.text('Unauthenticated', 401);

  /* ---------- short‑window rate‑limit (RPM/RPS) ---------- */
  const rate = await c.env.AI_RATELIMIT.limit(`user:${session.user.id}`);
  if (!rate.allowed) return c.text('Too many requests', 429);

  /* ---------- monthly quota check via Durable Object ---------- */
  const quotaRes = await c.env.QUOTA_DO.fetch(`https://quota/${session.user.id}`);
  if (quotaRes.status === 402) return c.text('Quota exceeded', 402);

  /* ---------- proxy request to Cloudflare AI Gateway ---------- */
  const gwRes = await fetch(`${c.env.AI_GATEWAY_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'cf-meta-user': session.user.id,
    },
    body: c.req.raw.body,
  });

  /* ---------- decrement monthly quota based on token usage ---------- */
  try {
    const usage = (await gwRes.clone().json()).usage?.total_tokens ?? 0;
    await c.env.QUOTA_DO.fetch(`https://quota/${session.user.id}/decrement`, {
      method: 'POST',
      body: JSON.stringify({ tokens: usage }),
    });
  } catch {
    /* ignore streamed / non‑JSON responses */
  }

  return gwRes;
});

export default ai;
