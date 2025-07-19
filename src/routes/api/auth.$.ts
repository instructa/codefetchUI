import { createServerFileRoute } from '@tanstack/react-start/server';
import { createAuth } from '~/server/auth.server';
import type { CloudflareEnv } from '../../types/env';

export const ServerRoute = createServerFileRoute('/api/auth/$' as any).methods({
  GET: async ({ request, context }) => {
    // In development, context might not have Cloudflare bindings
    const env = (context || {}) as CloudflareEnv;

    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth Route] Development mode - Context keys:', Object.keys(env));
      console.log('[Auth Route] Has AUTH_DB:', !!env.AUTH_DB);
    }

    const authInstance = createAuth(env);
    return authInstance.handler(request);
  },
  POST: async ({ request, context }) => {
    // In development, context might not have Cloudflare bindings
    const env = (context || {}) as CloudflareEnv;

    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth Route] Development mode - Context keys:', Object.keys(env));
      console.log('[Auth Route] Has AUTH_DB:', !!env.AUTH_DB);
    }

    const authInstance = createAuth(env);
    return authInstance.handler(request);
  },
});
