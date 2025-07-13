A Cloudflare Worker is a serverless function that runs on Cloudflare’s global network.

Minimal Example
Create a basic HTTP handler worker:

import { Worker } from "alchemy/cloudflare";

const worker = await Worker("api", {
  name: "api-worker",
  entrypoint: "./src/api.ts",
});

In your ./src/api.ts

export default {
  async fetch(request, env, ctx) {
    return new Response("OK");
  },
};

Bindings
Attach resources like KV, R2, or Durable Objects:

import {
  Worker,
  KVNamespace,
  DurableObjectNamespace,
} from "alchemy/cloudflare";

const kv = await KVNamespace("cache", { title: "cache-store" });
const users = new DurableObjectNamespace("users", { className: "Users" });

export const worker = await Worker("api", {
  name: "api-worker",
  entrypoint: "./src/api.ts",
  bindings: {
    CACHE: kv,
    USERS: users,
  },
});

Access in ./src/api.ts by importing cloudflare:workers:

import { env } from "cloudflare:workers";

export default {
  async fetch() {
    await env.CACHE.get("key");
  },
};

Or via the env parameter:

export default {
  async fetch(request, env) {
    await env.CACHE.get("key");
  },
};

Infer Worker Env Types
Binding types can be inferred from the worker in your alchemy.run.ts script:

import type { worker } from "../alchemy.run.ts";

export default {
  async fetch(request, env: typeof worker.Env) {
    await env.CACHE.get("key");
  },
};

Augment types of cloudflare:workers
To make the env in cloudflare:workers type-safe, create an env.ts file:

import type { worker } from "./alchemy.run.ts";

export type WorkerEnv = typeof worker.Env;

declare module "cloudflare:workers" {
  namespace Cloudflare {
    export interface Env extends WorkerEnv {}
  }
}

And register env.ts in your tsconfig.json’s types.

{
  "compilerOptions": {
    "types": ["@cloudflare/workers-types", "./src/env.ts"]
  }
}

Tip

See Bindings for more information.

Source Maps
Control whether source maps are uploaded with your worker for debugging:

import { Worker } from "alchemy/cloudflare";

const worker = await Worker("api", {
  name: "api-worker",
  entrypoint: "./src/api.ts",
  sourceMap: true, // Upload source maps (default: true)
});

// Disable source maps for production builds
const prodWorker = await Worker("prod-api", {
  name: "prod-api-worker",
  entrypoint: "./src/api.ts",
  sourceMap: false, // Don't upload source maps
});

Note

Source maps are enabled by default (sourceMap: true) and help with debugging by mapping minified code back to your original source files in the Cloudflare dashboard.

Static Assets
Serve static files from a directory:

import { Worker, Assets } from "alchemy/cloudflare";

const assets = await Assets("static", {
  path: "./public",
});

const worker = await Worker("frontend", {
  name: "frontend-worker",
  entrypoint: "./src/worker.ts",
  bindings: {
    ASSETS: assets,
  },
});

Cron Triggers
Schedule recurring tasks:

import { Worker } from "alchemy/cloudflare";

const worker = await Worker("cron", {
  name: "cron-worker",
  entrypoint: "./src/cron.ts",
  crons: ["0 0 * * *"], // Run daily at midnight
});

Bind to a Worker
Use a worker as a binding in another worker:

import { Worker } from "alchemy/cloudflare";

const api = await Worker("api", {
  name: "api-worker",
  entrypoint: "./src/api.ts",
});

const frontend = await Worker("frontend", {
  name: "frontend-worker",
  entrypoint: "./src/frontend.ts",
  bindings: {
    API: api,
  },
});

Self-Binding
A worker can bind to itself using Self or WorkerRef:

import { Worker, Self, WorkerRef } from "alchemy/cloudflare";

// Using Self
const workerWithSelf = await Worker("my-worker", {
  name: "my-worker",
  entrypoint: "./src/worker.ts",
  bindings: {
    SELF: Self,
  },
});

// Using WorkerRef with the worker's own ID
const workerWithRef = await Worker("my-worker", {
  name: "my-worker",
  entrypoint: "./src/worker.ts",
  bindings: {
    SELF: WorkerRef("my-worker"),
  },
});

Circular Worker Bindings
When workers need to bind to each other (circular dependency), use WorkerStub to break the cycle:

import { Worker, WorkerStub } from "alchemy/cloudflare";
import type { MyWorkerA } from "./src/worker-a.ts";
import type { MyWorkerB } from "./src/worker-B.ts";

// Create workerA that binds to workerB stub
const workerA = await Worker("workerA", {
  name: "worker-a",
  entrypoint: "./src/workerA.ts",
  rpc: type<MyWorkerA>,
  bindings: {
    // bind to a stub (empty worker)
    WORKER_B: await WorkerStub<MyWorkerB>("workerB", {
      name: "worker-b",
      rpc: type<MyWorkerB>,
    });,
  },
});

// Create workerB that binds to workerA
const workerB = await Worker("workerB", {
  name: "worker-b",
  entrypoint: "./src/workerB.ts",
  bindings: {
    WORKER_A: workerA,
  },
});

RPC
Create a Worker with RPC capabilities using WorkerEntrypoint and typed RPC interfaces:

import { Worker, type } from "alchemy/cloudflare";
import type MyRPC from "./src/rpc.ts";

// Create an RPC worker with typed interface
const rpcWorker = await Worker("rpc-service", {
  name: "rpc-service-worker",
  entrypoint: "./src/rpc.ts",
  rpc: type<MyRPC>,
});

// Use the RPC worker as a binding in another worker
const mainWorker = await Worker("main", {
  name: "main-worker",
  entrypoint: "./src/worker.ts",
  bindings: {
    RPC: rpcWorker,
  },
});

The RPC worker’s entrypoint should export a class extending WorkerEntrypoint:

src/rpc.ts
import { WorkerEntrypoint } from "cloudflare:workers";

export default class MyRPC extends WorkerEntrypoint {
  async getData(id: string): Promise<{ data: string }> {
    return { data: `Data for ${id}` };
  }

  async processItem(item: { name: string; value: number }): Promise<boolean> {
    // Process the item
    return true;
  }
}

Then the main worker can call RPC methods with full type safety:

src/worker.ts
export default {
  async fetch(request: Request, env: { RPC: MyRPC }): Promise<Response> {
    // Type-safe RPC calls
    const result = await env.RPC.getData("123");
    const success = await env.RPC.processItem({ name: "test", value: 42 });

    return new Response(JSON.stringify({ result, success }));
  },
};

Durable Object
Tip

See the Durable Object Guide for more information.

Cross-Script Durable Object
Share durable objects between workers by defining them in one worker and accessing them from another:

import { Worker, DurableObjectNamespace } from "alchemy/cloudflare";

// Worker that defines and owns the durable object
const dataWorker = await Worker("data-worker", {
  entrypoint: "./src/data.ts",
  bindings: {
    // Bind to its own durable object
    STORAGE: new DurableObjectNamespace("storage", {
      className: "DataStorage",
    }),
  },
});

// Worker that accesses the durable object from another worker
const apiWorker = await Worker("api-worker", {
  entrypoint: "./src/api.ts",
  bindings: {
    // Cross-script binding to the data worker's durable object
    SHARED_STORAGE: dataWorker.bindings.STORAGE,
  },
});

Routes
Create a worker and its routes in a single declaration:

import { Worker, Zone } from "alchemy/cloudflare";

const zone = await Zone("example-zone", {
  name: "example.com",
  type: "full",
});

const worker = await Worker("api", {
  name: "api-worker",
  entrypoint: "./src/api.ts",
  routes: [
    {
      pattern: "api.example.com/*",
      zoneId: zone.id,
    },
    {
      pattern: "admin.example.com/*",
      // will be inferred from `admin.example.com/*` with an API lookup
      // zoneId: zone.id,
    },
  ],
});

Tip

See the Route for more information.

Custom Domains
Bind custom domains directly to your worker for a simpler routing setup:

import { Worker } from "alchemy/cloudflare";

const worker = await Worker("api", {
  name: "api-worker",
  entrypoint: "./src/api.ts",
  domains: ["api.example.com", "admin.example.com"],
});

// Access the created domains
console.log(worker.domains); // Array of created CustomDomain resources

Tip

See the Routes and Domains Cloudflare docs to help decide between when to use a Route vs a Domain.

Workers for Platforms
Deploy workers to dispatch namespaces for multi-tenant architectures using Cloudflare’s Workers for Platforms:

import { Worker, DispatchNamespace } from "alchemy/cloudflare";

// Create a dispatch namespace
const tenants = await DispatchNamespace("tenants", {
  namespace: "customer-workers",
});

// Deploy a worker to the dispatch namespace
const tenantWorker = await Worker("tenant-app", {
  name: "tenant-app-worker",
  entrypoint: "./src/tenant.ts",
  namespace: tenants,
});

// Create a router that binds to the dispatch namespace
const router = await Worker("platform-router", {
  name: "main-router",
  entrypoint: "./src/router.ts",
  bindings: {
    TENANT_WORKERS: tenants,
  },
});

In your router, you can dynamically route to tenant workers:

src/router.ts
export default {
  async fetch(request: Request, env: { TENANT_WORKERS: DispatchNamespace }) {
    const url = new URL(request.url);
    const tenantId = url.hostname.split(".")[0];

    // Get the tenant's worker from the dispatch namespace
    const tenantWorker = env.TENANT_WORKERS.get(tenantId);

    // Forward the request to the tenant's worker
    return await tenantWorker.fetch(request);
  },
};

Note

Workers for Platforms enables multi-tenant architectures where each tenant can have isolated worker scripts with their own bindings and configuration.

Tip

See the Dispatch Namespace documentation for more details on Workers for Platforms.

Worker Versions
Deploy worker versions for testing and staging before promoting to production. Worker versions create isolated deployments with preview URLs that don’t affect your live worker.

import { Worker } from "alchemy/cloudflare";

// Create a versioned worker for testing
const previewWorker = await Worker("my-worker", {
  name: "my-worker",
  entrypoint: "./src/worker.ts",
  version: "pr-123", // Version label for display in the console
});

// Access the preview URL for testing
console.log(`Preview URL: ${previewWorker.url}`);
// Output: https://{version-hash}-my-worker.subdomain.workers.dev

Caution

Preview URLs cannot be generated for Workers with Durable Objects, see the Preview URL documentation to learn more.

Reference Worker by Name
Use WorkerRef to reference an existing worker by its service name rather than by resource instance. This is useful for worker-to-worker bindings when you need to reference a worker that already exists.

import { Worker, WorkerRef } from "alchemy/cloudflare";

const callerWorker = await Worker("caller", {
  bindings: {
    TARGET_WORKER: WorkerRef({
      // reference the worker by name (not created with Alchemy)
      service: "target-worker",
    }),
  },
});

Note

Learn more in the Route Documentation

Generating wrangler.json
Generate a wrangler.json configuration file for your worker with the WranglerJson resource:

import { Worker, WranglerJson } from "alchemy/cloudflare";

const worker = await Worker("api", {
  name: "api-worker",
  entrypoint: "./src/index.ts",
});

await WranglerJson("wrangler", {
  worker,
  transform: {
    wrangler: (spec) => ({
      ...spec,
      vars: {
        ...spec.vars,
        CUSTOM_VAR: "value",
      },
    }),
  },
});

Tip

See the WranglerJson documentation for more details on configuration options.

RPC Type
If you’re using a WorkerEntrypoint RPC, you can provide its type:

import { Worker, WorkerRef } from "alchemy/cloudflare";
import type { MyWorkerEntrypoint } from "./src/worker.ts";

const callerWorker = await Worker("caller", {
  name: "caller-worker",
  bindings: {
    TARGET_WORKER: WorkerRef<MyWorkerEntrypoint>({
      service: "target-worker",
      environment: "production", // Optional
      namespace: "main", // Optional
    }),
  },
});