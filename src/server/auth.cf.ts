import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { honoCookies } from 'better-auth/hono';
import { Hono } from 'hono';
import { createDB, HasDB } from './db';

import type { D1Database, DurableObjectNamespace } from '@cloudflare/workers-types';

type RateLimit = { limit(key: string): Promise<{ allowed: boolean }> };

export interface Env extends HasDB {
  AI_RATELIMIT: RateLimit;
  QUOTA_DO: DurableObjectNamespace;
  AI_GATEWAY_URL: string;
  SESSION_COOKIE_NAME: string;
  MONTHLY_TOKEN_LIMIT: string;
}

export function buildAuthApp(env: Env) {
  const app = new Hono<Env>();
  const db = createDB(env);

  const auth = betterAuth({
    database: drizzleAdapter(db, { provider: 'd1' }),
    plugins: [
      honoCookies({
        cookieName: env.SESSION_COOKIE_NAME ?? 'cf_session',
        secure: true,
        sameSite: 'lax',
      }),
    ],
    // Re‑use your existing magic-link, email / password and social provider config here
  });

  // expose Better‑Auth routes under /api/auth
  app.route('/api/auth', auth.createRoute());

  // expose the auth instance for downstream use (AI route needs it)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  app.auth = auth;

  return app;
}
