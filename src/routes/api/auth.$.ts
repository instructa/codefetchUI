import { createServerFileRoute } from '@tanstack/react-start/server';
import { createAuth } from '~/server/auth.server';
import type { worker } from '../../../alchemy.run';

// Infer the types from alchemy.run.ts
type Env = typeof worker.Env;

// Declare the global env variable that Cloudflare Workers provides
declare global {
  var __env__: Env | undefined;
}

export const ServerRoute = createServerFileRoute('/api/auth/$' as any).methods({
  GET: async ({ request, context }) => {
    // Try to get env from different sources
    const contextEnv = context as Env;
    const globalEnv =
      (globalThis as any).__env__ || (globalThis as any).env || (globalThis as any).Env;

    console.log('[Auth Route] Context has AUTH_DB:', !!contextEnv?.AUTH_DB);
    console.log('[Auth Route] Global env:', !!globalEnv);
    console.log('[Auth Route] Global env type:', typeof globalEnv);
    console.log('[Auth Route] Global env AUTH_DB:', !!globalEnv?.AUTH_DB);

    // Check process.env too (though unlikely in Workers)
    const processEnv = typeof process !== 'undefined' ? (process as any).env : undefined;
    console.log('[Auth Route] Process env:', !!processEnv);

    // Use whatever has AUTH_DB
    const env = globalEnv?.AUTH_DB ? globalEnv : contextEnv;

    if (!env?.AUTH_DB) {
      console.error('[Auth Route] Could not find AUTH_DB in any location');
      console.error('[Auth Route] Available global keys:', Object.keys(globalThis));
    }

    const authInstance = createAuth(env);
    return authInstance.handler(request);
  },
  POST: async ({ request, context }) => {
    // Try to get env from different sources
    const contextEnv = context as Env;
    const globalEnv =
      (globalThis as any).__env__ || (globalThis as any).env || (globalThis as any).Env;

    console.log('[Auth Route] Context has AUTH_DB:', !!contextEnv?.AUTH_DB);
    console.log('[Auth Route] Global env:', !!globalEnv);
    console.log('[Auth Route] Global env type:', typeof globalEnv);
    console.log('[Auth Route] Global env AUTH_DB:', !!globalEnv?.AUTH_DB);

    // Check process.env too (though unlikely in Workers)
    const processEnv = typeof process !== 'undefined' ? (process as any).env : undefined;
    console.log('[Auth Route] Process env:', !!processEnv);

    // Use whatever has AUTH_DB
    const env = globalEnv?.AUTH_DB ? globalEnv : contextEnv;

    if (!env?.AUTH_DB) {
      console.error('[Auth Route] Could not find AUTH_DB in any location');
      console.error('[Auth Route] Available global keys:', Object.keys(globalThis));
    }

    const authInstance = createAuth(env);
    return authInstance.handler(request);
  },
});
