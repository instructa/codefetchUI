import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { honoCookies } from 'better-auth/hono';
import { Hono } from 'hono';
import { createDB, HasDB } from './db';

export interface Env extends HasDB {
  SESSION_COOKIE_NAME: string;
  // …keep the rest of your secret vars (RESEND_API_KEY, BETTER_AUTH_SECRET, etc.)
}

export function buildAuthApp(env: Env) {
  const app = new Hono<Env>();
  const db  = createDB(env);

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