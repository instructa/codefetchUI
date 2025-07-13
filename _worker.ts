import { Hono } from 'hono';
import { buildAuthApp } from './src/server/auth.cf';
import aiRoute from './src/server/routes/ai';
import { QuotaDO } from './src/server/quota-do';

/** Minimal shape of the experimental Cloudflare RateLimit binding */
type RateLimit = { limit(key: string): Promise<{ allowed: boolean }> };

export interface Env extends Record<string, unknown> {
  AUTH_DB: D1Database;
  AI_RATELIMIT: RateLimit;
  QUOTA_DO: DurableObjectNamespace;
  AI_GATEWAY_URL: string;
  SESSION_COOKIE_NAME: string;
  MONTHLY_TOKEN_LIMIT: string;
}

/**
 * Cloudflare Workers `_worker.ts` entry.
 *  – `/api/auth/**` routed via Better‑Auth (inside `buildAuthApp`)
 *  – `/api/ai/**` routed through AI Gateway with quota checks
 */
export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const app = buildAuthApp(env);
    app.route('/api/ai', aiRoute);
    return app.fetch(request, env, ctx);
  },
};

export { QuotaDO };