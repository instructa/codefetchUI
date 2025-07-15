/// <reference types="vite/client" />
import '../.tanstack-start/server-routes/routeTree.gen';
import type {
  D1Database,
  DurableObjectNamespace,
  ExecutionContext,
  IncomingRequestCfProperties,
} from '@cloudflare/workers-types';

// Minimal shape of the experimental Cloudflare RateLimit binding
type RateLimit = { limit(key: string): Promise<{ allowed: boolean }> };

// Cloudflare environment bindings
interface CloudflareEnv {
  // Core bindings
  AUTH_DB: D1Database;
  AI_RATELIMIT: RateLimit;
  QUOTA_DO: DurableObjectNamespace<any>;
  AI_GATEWAY_URL: string;
  SESSION_COOKIE_NAME: string;
  MONTHLY_TOKEN_LIMIT: string;

  // Workers AI binding
  AI?: {
    run(
      model: string,
      input: any
    ): Promise<{
      data: number[][];
      [key: string]: any;
    }>;
  };

  // Environment variables
  CODEFETCH_API_KEY?: string;

  // Optional bindings (uncomment if you use them)
  // R2: R2Bucket;
  // CACHE: KVNamespace;
  // EMBED_QUEUE: Queue;
  // ANALYTICS: D1Database;
}

declare module '@tanstack/react-start/server' {
  interface RequestContext extends CloudflareEnv {
    // Additional context properties
    ctx?: ExecutionContext;
    cf?: IncomingRequestCfProperties;
  }
}
