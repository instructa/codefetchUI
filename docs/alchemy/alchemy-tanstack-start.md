Deploy a TanStack Start application to Cloudflare Pages with automatically configured defaults.

Minimal Example
import { TanStackStart } from "alchemy/cloudflare";

const app = await TanStackStart("my-app");

With Custom Build Command
import { TanStackStart } from "alchemy/cloudflare";

const app = await TanStackStart("my-app", {
  command: "bun run test && bun run build:production",
});

With Database Binding
import { TanStackStart, D1Database } from "alchemy/cloudflare";

const database = await D1Database("my-db", {
  name: "my-db",
});

const app = await TanStackStart("my-app", {
  bindings: {
    DB: database,
  },
});

With Environment Variables
import { TanStackStart } from "alchemy/cloudflare";

const app = await TanStackStart("my-app", {
  bindings: {
    API_KEY: alchemy.secret(process.env.API_KEY),
  },
  vars: {
    NODE_ENV: "production",
    APP_ENV: "staging",
  },
});

Bind to a Worker
import { Worker, TanStackStart } from "alchemy/cloudflare";

const app = await TanStackStart("my-app");

await Worker("my-worker", {
  name: "my-worker",
  script: "console.log('Hello, world!')",
  bindings: {
    APP: app,
  },
});

With Transform Hook
The transform hook allows you to customize the wrangler.json configuration. For example, adding a custom environment variable:

await TanStackStart("my-app", {
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

