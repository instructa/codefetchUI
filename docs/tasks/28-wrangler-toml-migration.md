# Migration Plan: From alchemy.run.ts to wrangler.toml

This document outlines the step-by-step process to migrate the CodeFetch UI deployment from `alchemy.run.ts` to a standard `wrangler.toml` configuration. The goal is to gain more direct control over the Cloudflare environment and simplify the deployment process.

## Phase 1: Configuration and Setup

This phase involves creating the new configuration files and preparing the environment for the switch.

- [ ] **Task 1.1: Create `wrangler.toml`**
  - Create a new `wrangler.toml` file in the project root. This file will define all Cloudflare resources, environments, and build settings.

- [ ] **Task 1.2: Define Environments (`dev` and `prod`)**
  - Structure `wrangler.toml` to support both `dev` and `prod` environments using `[env.dev]` and `[env.prod]`. This will mirror the staging setup from `alchemy.run.ts`.

- [ ] **Task 1.3: Replicate Resource Definitions**
  - Translate all resource definitions from `alchemy.run.ts` into `wrangler.toml`. You will need to manually create these resources in your Cloudflare account and get their respective IDs.
  - **Resources to migrate:**
    - R2 Buckets: `state-store`, `uploads`
    - KV Namespaces: `sessions`, `cache`
    - D1 Databases: `main-db`, `analytics`, `auth-db`
    - Queues: `embed-queue`
    - Durable Objects: `QuotaDO`
    - AI Gateway: `ai-rpm`

- [ ] **Task 1.4: Configure Workers**
  - Define the main `codefetch-ui` worker and the separate `embed-worker` within `wrangler.toml`. This includes setting their entry points, compatibility flags, and build commands.

- [ ] **Task 1.5: Manage Secrets**
  - Create a `.env.example` file listing all the environment variables required for secrets.
  - Document the process for setting these secrets in Cloudflare using `npx wrangler secret put <SECRET_NAME>`.

- [ ] **Task 1.6: Update `package.json` Scripts**
  - Replace the `alchemy` scripts with `wrangler` commands for local development, building, and deploying.
    - `dev`: `npx wrangler dev`
    - `deploy`: `npx wrangler deploy`
    - `db:migrate`: `npx wrangler d1 migrations apply <DB_NAME>`

## Phase 2: Implementation and Testing

This phase involves populating the configuration files and testing the new setup locally.

- [ ] **Task 2.1: Populate `wrangler.toml` with Resource IDs**
  - Use the Cloudflare Dashboard or `wrangler` CLI to get the IDs for all KV namespaces and D1 databases and add them to `wrangler.toml`.

- [ ] **Task 2.2: Set Up Local Secrets**
  - Create a `.dev.vars` file for the `dev` environment to manage local secrets, which `wrangler dev` will use.

- [ ] **Task 2.3: Test Local Development**
  - Run `pnpm dev` to start the local server with `wrangler dev`.
  - Verify that the application runs correctly and connects to the local development resources (Miniflare).

- [ ] **Task 2.4: Test Database Migrations**
  - Run the database migration scripts against the local D1 databases to ensure the schema is correctly applied.

## Phase 3: Deployment

This phase involves deploying the application to Cloudflare's network using the new configuration.

- [ ] **Task 3.1: Deploy to `dev` Environment**
  - Set all required secrets for the `dev` environment using `npx wrangler secret put`.
  - Run `pnpm run deploy --env dev` (or equivalent script) to deploy the application to the development environment.
  - Thoroughly test the deployed `dev` application.

- [ ] **Task 3.2: Deploy to `prod` Environment**
  - Once the `dev` environment is confirmed to be stable, repeat the process for production.
  - Set all production secrets.
  - Run `pnpm run deploy --env prod` to deploy to production.
  - Perform final checks on the live application.

## Phase 4: Cleanup

- [ ] **Task 4.1: Remove `alchemy.run.ts`**
  - Once the `wrangler.toml` deployments are stable and verified, delete the `alchemy.run.ts` file.

- [ ] **Task 4.2: Uninstall Alchemy Dependencies**
  - Remove the `@alchemy/cli` and any related packages from `package.json`.

---
We will work through these tasks together. Let me know when you're ready to start with the first step. 