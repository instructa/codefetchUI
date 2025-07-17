import { QuotaDO } from './src/server/quota-do';
// @ts-expect-error - generated file
import { app } from './.tanstack-start/server/server-runtime.js';

/**
 * Cloudflare Workers `_worker.ts` entry.
 *  – `/api/auth/**` routed via Better‑Auth (inside `buildAuthApp`)
 *  – `/api/ai/**` routed through AI Gateway with quota checks
 */
export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return app.fetch(request, { ...env, ctx });
  },
};

export { QuotaDO };
