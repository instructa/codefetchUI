/// <reference types="vite/client" />
import '../.tanstack-start/server-routes/routeTree.gen';

// Cloudflare environment bindings
interface CloudflareEnv {
  // Workers AI binding
  AI: {
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
  // DB: D1Database;
  // R2: R2Bucket;
  // CACHE: KVNamespace;
  // EMBED_QUEUE: Queue;
  // ANALYTICS: D1Database;
}

declare module '@tanstack/react-start/server' {
  interface RequestContext {
    cloudflare?: {
      env: CloudflareEnv;
      ctx?: ExecutionContext;
      cf?: IncomingRequestCfProperties;
    };
  }
}
