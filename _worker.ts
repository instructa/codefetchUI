import { createServerFn } from '@tanstack/react-start/server';
import { QuotaDO } from './src/server/quota-do';

import type {
  D1Database,
  DurableObjectNamespace,
  ExecutionContext,
} from '@cloudflare/workers-types';

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
const handleRequest = createServerFn();

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return handleRequest(request, env, ctx);
  },
};

export { QuotaDO };
