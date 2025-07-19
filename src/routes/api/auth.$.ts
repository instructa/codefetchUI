import { createServerFileRoute } from '@tanstack/react-start/server';
import { createAuth } from '~/server/auth.server';
import { env } from 'cloudflare:workers';

export const ServerRoute = createServerFileRoute('/api/auth/$' as any).methods({
  GET: async ({ request, context }) => {
    // Use the imported env directly
    console.log('[Auth Route] Has AUTH_DB:', !!env?.AUTH_DB);

    const authInstance = createAuth(env);
    return authInstance.handler(request);
  },
  POST: async ({ request, context }) => {
    // Use the imported env directly
    console.log('[Auth Route] Has AUTH_DB:', !!env?.AUTH_DB);

    const authInstance = createAuth(env);
    return authInstance.handler(request);
  },
});
