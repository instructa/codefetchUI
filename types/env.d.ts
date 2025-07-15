/// <reference types="vite/client" />
import type { ExecutionContext, IncomingRequestCfProperties } from '@cloudflare/workers-types';
import type { worker } from '../alchemy.run.ts';

export type CloudflareEnv = typeof worker.Env;

/** Minimal shape of the experimental Cloudflare RateLimit binding */
type RateLimit = { limit(key: string): Promise<{ allowed: boolean }> };

declare global {
  type Env = CloudflareEnv;
}

declare module 'cloudflare:workers' {
  namespace Cloudflare {
    interface Env extends CloudflareEnv {}
  }
}

declare module '@tanstack/react-start/server' {
  interface RequestContext extends CloudflareEnv {
    ctx?: ExecutionContext;
    cf?: IncomingRequestCfProperties;
  }
}
