import { createServerFileRoute } from '@tanstack/react-start/server';
import { createAuth } from '~/server/auth.server';
import type { worker } from '../../../alchemy.run';

// Infer the types from alchemy.run.ts
type Env = typeof worker.Env;

export const ServerRoute = createServerFileRoute('/api/auth/$' as any).methods({
  GET: async ({ request, context }) => {
    // Debug logging to understand context structure
    console.log('[Auth Route] Context type:', typeof context);
    console.log('[Auth Route] Context keys:', Object.keys(context || {}));
    console.log('[Auth Route] Context:', JSON.stringify(context, null, 2));

    // Try different ways to access the env
    const env1 = context as Env;
    const env2 = (context as any)?.env;
    const env3 = (context as any)?.cloudflare?.env;

    console.log('[Auth Route] env1 AUTH_DB:', !!env1?.AUTH_DB);
    console.log('[Auth Route] env2 AUTH_DB:', !!env2?.AUTH_DB);
    console.log('[Auth Route] env3 AUTH_DB:', !!env3?.AUTH_DB);

    // Use the one that has AUTH_DB
    const env = env3?.AUTH_DB ? env3 : env2?.AUTH_DB ? env2 : env1;

    console.log('[Auth Route] Final env AUTH_DB:', !!env?.AUTH_DB);

    const authInstance = createAuth(env);
    return authInstance.handler(request);
  },
  POST: async ({ request, context }) => {
    // Debug logging to understand context structure
    console.log('[Auth Route] Context type:', typeof context);
    console.log('[Auth Route] Context keys:', Object.keys(context || {}));
    console.log('[Auth Route] Context:', JSON.stringify(context, null, 2));

    // Try different ways to access the env
    const env1 = context as Env;
    const env2 = (context as any)?.env;
    const env3 = (context as any)?.cloudflare?.env;

    console.log('[Auth Route] env1 AUTH_DB:', !!env1?.AUTH_DB);
    console.log('[Auth Route] env2 AUTH_DB:', !!env2?.AUTH_DB);
    console.log('[Auth Route] env3 AUTH_DB:', !!env3?.AUTH_DB);

    // Use the one that has AUTH_DB
    const env = env3?.AUTH_DB ? env3 : env2?.AUTH_DB ? env2 : env1;

    console.log('[Auth Route] Final env AUTH_DB:', !!env?.AUTH_DB);

    const authInstance = createAuth(env);
    return authInstance.handler(request);
  },
});
