/// <reference types="vite/client" />
import type { ExecutionContext, IncomingRequestCfProperties } from '@cloudflare/workers-types';
import type { worker } from '../alchemy.run.ts';

export type CloudflareEnv = typeof worker.Env;

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
    // Additional context properties
    ctx?: ExecutionContext;
    cf?: IncomingRequestCfProperties;
  }
}
