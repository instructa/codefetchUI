import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { reactStartCookies } from 'better-auth/react-start';
import { createDB, HasDB } from './db';

import type { D1Database, DurableObjectNamespace } from '@cloudflare/workers-types';

type RateLimit = { limit(key: string): Promise<{ allowed: boolean }> };

export interface Env extends HasDB {
  AI_RATELIMIT: RateLimit;
  QUOTA_DO: DurableObjectNamespace<any>;
  AI_GATEWAY_URL: string;
  SESSION_COOKIE_NAME: string;
  MONTHLY_TOKEN_LIMIT: string;
}

export function buildAuthApp(env: Env) {
  const db = createDB(env);

  const auth = betterAuth({
    database: drizzleAdapter(db, { provider: 'sqlite' }),
    plugins: [
      reactStartCookies({
        cookieName: env.SESSION_COOKIE_NAME ?? 'cf_session',
        cookieOptions: {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          path: '/',
        },
      }),
    ],
    // Add your magic-link or other plugins here if needed
  });

  return { auth } as const;
}
