import { createServerFileRoute } from '@tanstack/react-start/server';
import { createAuth } from '~/server/auth.server';
import type { CloudflareEnv } from '../../types/env';

export const ServerRoute = createServerFileRoute('/api/auth/$' as any).methods({
  GET: async ({ request, context }) => {
    const env = context as CloudflareEnv;
    const authInstance = createAuth(env);
    return authInstance.handler(request);
  },
  POST: async ({ request, context }) => {
    const env = context as CloudflareEnv;
    const authInstance = createAuth(env);
    return authInstance.handler(request);
  },
});
