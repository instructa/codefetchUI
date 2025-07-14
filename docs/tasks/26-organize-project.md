# Refactoring Plan: Organize Project Structure (Detailed)

This document outlines a detailed plan to refactor the project structure, aligning it with TanStack Start and Alchemy best practices. The goal is to create a more logical, maintainable, and conventional codebase.

---

## Part 1: Consolidate API Routes

**Goal:** Unify all API logic under `src/routes/api/` using TanStack Start's file-based routing.

### 1.1. Move and Adapt Hono Route (`ai.ts`)

*   **File:** `src/server/routes/ai.ts`
*   **Action:** Move the file to `src/routes/api/ai.ts`.
*   **Refactoring Steps:**
    1.  The file already exports a Hono app as a `default` export, which TanStack Start can serve directly.
    2.  Update the relative import path for `buildAuthApp` inside `src/routes/api/ai.ts` from `../auth.cf` to `../../server/auth.cf`.

### 1.2. Move and Refactor Server Function (`getSession`)

*   **File:** `src/server/function/auth.server.func.ts`
*   **Action:** Move and transform this file into a new standard API route at `src/routes/api/session.ts`.
*   **Refactoring Steps:**
    1.  Create a new file `src/routes/api/session.ts`.
    2.  Instead of `createServerFn`, define a standard TanStack Start file route with a `GET` method handler.
    3.  Copy the logic from the existing `getSession` function into the `GET` handler.
    4.  Update any frontend code that currently calls `getSession()` to instead fetch data from the `GET /api/session` endpoint using TanStack Query's `useQuery`.

### 1.3. Cleanup Old API Directories

*   **Action:** After moving the files, delete the following now-empty directories:
    *   `src/server/function/`
    *   `src/server/routes/`

---

## Part 2: Reorganize Workers

**Goal:** Clearly separate client-side (web) workers from server-side (Cloudflare) workers.

### 2.1. Relocate Cloudflare Worker (`embed.worker.ts`)

*   **File:** `src/workers/embed.worker.ts`
*   **Action:** Move the file to a new, dedicated directory: `src/cloudflare/workers/embed.worker.ts`.
*   **Refactoring Steps:**
    1.  This worker is deployed separately. The code within the worker does not need to change.
    2.  The deployment script (`alchemy.run.ts`) will need to be updated to point to this new path (covered in Part 3).

### 2.2. Relocate Client-side Web Worker (`preview.worker.ts`)

*   **File:** `src/workers/preview.worker.ts`
*   **Action:** Move the file to `src/lib/workers/preview.worker.ts` to group it with other browser-focused utility code.
*   **Refactoring Steps:**
    1.  Search the codebase (likely in a hook like `use-preview-generator.ts`) for where this worker is instantiated.
    2.  Update the path in the `new Worker()` constructor to point to the new location. The path should be relative, e.g., `new Worker(new URL('../lib/workers/preview.worker.ts', import.meta.url))`.

### 2.3. Cleanup Old Worker Directory

*   **Action:** After moving the files, delete the now-empty `src/workers/` directory.

---

## Part 3: Simplify Deployment (`alchemy.run.ts`)

**Goal:** Update the deployment script to reflect the new, cleaner project structure.

*   **File:** `alchemy.run.ts`
*   **Refactoring Steps:**
    1.  The current `TanStackStart` construct for the main application is largely correct and will automatically pick up the new API routes in `src/routes/api/`.
    2.  Add a new `Worker` resource definition to deploy the `embed.worker.ts` from its new location in `src/cloudflare/workers/`.
    3.  Ensure the necessary bindings (like `EMBED_QUEUE`, `CF_VECTORIZE_INDEX`, etc.) are correctly provided to this new `Worker` resource.
    4.  Review the bindings for the main `TanStackStart` app and remove any that were only needed for the moved workers or old API routes if they are no longer required at the top level. 