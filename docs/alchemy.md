Overview
Alchemy is a TypeScript library that creates and manages cloud infrastructure when you run it. Instead of using a CLI or configuration files, you write a regular TypeScript program.

How it works
You start with an alchemy.run.ts file (or any other name you want) that contains your infrastructure code:

import alchemy from "alchemy";
import { Worker } from "alchemy/cloudflare";

// Create an app
const app = await alchemy("my-app");

// Create resources
const worker = await Worker("api", {
  entrypoint: "./src/api.ts"
});

// Clean up orphaned resources
await app.finalize();

Alchemy doesn’t have a traditional CLI tool like wrangler or terraform. Instead, it automatically parses CLI arguments when you run your TypeScript scripts:

Terminal window
bun ./alchemy.run.ts                # deploy to cloud
bun ./alchemy.run.ts --destroy      # tear down (destroy all resources)
bun ./alchemy.run.ts --read         # read-only mode
bun ./alchemy.run.ts --stage prod   # deploy to specific stage

# local dev & hot redeployment
bun --watch ./alchemy.run.ts        # hot redeployment to cloud
bun --watch ./alchemy.run.ts --dev  # local development with hot redeployment

Tip

See the CLI documentation for all available options and environment variables.

Embeddable
Since Alchemy is a TypeScript library, you can override any CLI arguments programmatically. Explicit options always take precedence over CLI arguments:

// CLI args are parsed automatically
const app = await alchemy("my-app");

// Override CLI args with explicit options
const app = await alchemy("my-app", {
  phase: "up",        // Overrides --destroy or --read
  stage: "prod",      // Overrides --stage
  quiet: false,       // Overrides --quiet
  password: "secret", // Overrides ALCHEMY_PASSWORD env var
  dev: true,          // Overrides --dev detection
});

This makes Alchemy embeddable in larger applications where you need programmatic control over infrastructure deployment.

Resources
Resources are async functions that create infrastructure. Each resource handles its own lifecycle:

// Create a KV namespace
const kv = await KVNamespace("cache", {
  title: "My Cache"
});

// Create a worker with the KV binding
const worker = await Worker("api", {
  entrypoint: "./src/worker.ts",
  bindings: {
    CACHE: kv
  }
});

State
By default, Alchemy tracks what it creates in .alchemy/ directory:

.alchemy/
  my-app/
    dev/
      cache.json
      api.json

You can also use a remote state store like Durable Objects, R2, S3, etc. See State for more information.

Phases
Your script can run in three phases:

up (default) - Create, update, or delete resources
read - Read existing resources without changes
destroy - Delete all resources
const app = await alchemy("my-app", {
  phase: "destroy" // or pass --destroy flag
});

Tip

See the Phases documentation for more information.

Scopes
Resources are organized in scopes - like folders for your infrastructure:

const app = await alchemy("my-app"); // app scope

// Resources here are in the app/dev scope
const db = await Database("main");

// Create a nested scope
await alchemy.run("backend", async () => {
  // Resources here are in app/dev/backend scope
  const api = await Worker("api");
});

Secrets
Alchemy provides built-in encryption for sensitive data like API keys, passwords, and credentials:

const app = await alchemy("my-app", {
  password: process.env.SECRET_PASSPHRASE, // Used to encrypt secrets
});

// Create encrypted secrets from environment variables
const apiKey = alchemy.secret(process.env.API_KEY);
const databaseUrl = alchemy.secret(process.env.DATABASE_URL);

Secrets are automatically encrypted when stored in state files and can be safely used in your infrastructure.

Tip

See the Secrets documentation for more information.

Bindings
Connect resources together:

const kv = await KVNamespace("data");
const queue = await Queue("tasks");

const worker = await Worker("processor", {
  entrypoint: "./processor.ts",
  bindings: {
    DATA: kv,      // KV namespace binding
    TASKS: queue,  // Queue binding
    API_KEY: alchemy.secret(process.env.API_KEY) // Secret
  }
});

Tip

Alchemy does not use code-generation for bindings. Instead, the runtime types of bindings can be inferred from the worker:

type Env = typeof worker.Env;

export default {
  fetch(request: Request, env: Env) {
    return new Response("Hello, world!");
  }
}

See the Type-safe Bindings documentation for more information.

Local Development
Run locally with hot reloading:

Terminal window
bun ./alchemy.run.ts --dev

Resources can run locally or connect to remote services:

const db = await D1Database("app-db", {
  dev: { remote: true } // Use real D1 in dev mode
});

Caution

Not all resources support local development. See the Local Development documentation for more information.

Resource Adoption
When creating a resource, Alchemy will fail if a resource with the same name already exists. You can opt in to adopt existing resources instead:

// Without adoption - fails if bucket already exists
const bucket = await R2Bucket("my-bucket", {
  name: "existing-bucket",
});

// With adoption - uses existing bucket if it exists
const bucket = await R2Bucket("my-bucket", {
  name: "existing-bucket",
  adopt: true,
});

This is useful when you want to manage existing infrastructure with Alchemy.

Tip

See the Resource Adoption documentation for more information.

Resource Replacement
Sometimes it’s impossible to update a resource (like renaming an R2 bucket). In these cases, Alchemy can replace the resource by:

Creating a new version of the resource
Updating all references to point to the new resource
Deleting the old resource during finalization
// If you change immutable properties, Alchemy will automatically
// trigger a replacement during the update phase
const bucket = await R2Bucket("data", {
  name: "new-bucket-name" // This will trigger replacement
});

The replacement happens seamlessly - downstream resources are updated to reference the new resource before the old one is deleted.

Tip

See the Resource Replacement documentation for more information.

Custom Resources
All resources in Alchemy are equal - they’re just async functions that handle create, update, and delete operations. This means you can easily create your own resources for any service or API:

export const MyResource = Resource(
  "my-service::MyResource",
  async function(this: Context<MyResource>, id: string, props: MyResourceProps): Promise<MyResource> {
    if (this.phase === "delete") {
      // Delete logic
      return this.destroy();
    } else if (this.phase === "update") {
      // Update logic
      return this({ ...props, id: this.output.id });
    } else {
      // Create logic
      return this({ ...props, id: "new-id" });
    }
  }
);

Resources handle their own lifecycle and can integrate with any API or service. All built-in Alchemy resources use the same pattern.

Tip

See the Resource documentation for detailed implementation guidance and Custom Resources for a step-by-step guide.

Testing
Test your own custom resources with Alchemy’s built-in test helper that :

import { alchemy, destroy } from "alchemy";
import "alchemy/test/vitest";

const test = alchemy.test(import.meta);

test("create worker", async (scope) => {
  try {
    const worker = await Worker("test-worker", {
      script: "export default { fetch() { return new Response('ok') } }"
    });
    const response = await fetch(worker.url);
    expect(response.status).toBe(200);
  } finally {
    await destroy(scope); // Clean up test resources
  }
});

Tip

See the Testing documentation for comprehensive test setup and best practices.

Available Providers
Cloudflare: Worker, KV, R2, D1, Queue, Durable Objects
AWS: S3, DynamoDB, Lambda, ECS, VPC
Others: Docker, GitHub, Stripe, Vercel, Neon, PlanetScale
Next Steps
Getting Started - Deploy your first worker
Concepts - Deep dive into how Alchemy works
Guides - Build real applications
Happy transmutation! ✨