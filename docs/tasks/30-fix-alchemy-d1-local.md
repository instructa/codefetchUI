# Plan: Fix Local D1 Database and Vite Integration

This document outlines a simplified approach to fix local D1 database access when using Alchemy's development mode.

## 1. Problem Diagnosis

The issue is that the codebase has unnecessary complexity trying to handle local D1 database paths manually. Since Alchemy handles D1 bindings automatically in both local and production environments, we don't need:
- Complex path lookups in `drizzle.config.ts`
- Development fallbacks in `auth.server.ts`
- Manual SQLite file discovery

## 2. Solution Overview

**Simplify everything and trust Alchemy to handle the D1 bindings automatically.**

## 3. Implementation Steps

### Step 1: Simplify `drizzle.config.ts`

Remove all the complex path lookup logic. Drizzle Kit only needs to know which schema to use for migration generation.

**File**: `drizzle.config.ts`

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

// The D1_TARGET environment variable determines which database schema to generate migrations for
const target = (process.env.D1_TARGET || 'main').toLowerCase() as 'main' | 'auth' | 'analytics';

const schemaMap: Record<typeof target, string> = {
  main: './src/db/schema/app.schema.ts',
  auth: './src/db/schema/auth.schema.ts',
  analytics: './src/db/schema/analytics.schema.ts',
};

export default defineConfig({
  schema: schemaMap[target],
  out: `./drizzle/${target}`,
  dialect: 'sqlite',
  // No dbCredentials needed - Alchemy handles the connection automatically
});
```

### Step 2: Simplify Auth Server

Remove the development fallback logic from `auth.server.ts`. Trust that Alchemy provides the D1 bindings.

**File**: `src/server/auth.server.ts`

Remove the entire `isDevelopment` check and in-memory SQLite fallback. The function should directly use `getAuthDb(env)` without any conditional logic.

### Step 3: Ensure Vite Plugin is Configured

The Cloudflare Vite plugin configuration is already correct in `vite.config.ts`:

```typescript
cloudflare({
  persistState: process.env.ALCHEMY_CLOUDFLARE_PERSIST_PATH
    ? {
        path: process.env.ALCHEMY_CLOUDFLARE_PERSIST_PATH,
      }
    : undefined,
}),
```

### Step 4: Update Database Generation Script

Keep the existing `scripts/db-generate-all.ts` as it correctly sets the `D1_TARGET` environment variable for each database.

## 4. How to Use

1. **Start Alchemy Dev**:
   ```bash
   alchemy dev
   ```
   Alchemy will automatically:
   - Create local D1 database instances
   - Set up the bindings
   - Start your Vite dev server
   - Make the D1 bindings available to your application

2. **Generate Migrations** (when schemas change):
   ```bash
   pnpm run db:generate:all
   ```

3. **Deploy to Production**:
   ```bash
   alchemy deploy --stage prod
   ```

## 5. Key Principles

1. **Trust Alchemy**: It handles D1 bindings automatically in both environments
2. **No Manual Paths**: Don't try to find SQLite files manually
3. **No Fallbacks**: If D1 bindings aren't available, something is wrong with the setup
4. **Keep It Simple**: The simpler the configuration, the fewer places for errors

## 6. Troubleshooting

If D1 databases aren't working:

1. **Check Alchemy is Running**: Ensure `alchemy dev` is running
2. **Check Bindings in Code**: Verify `env.DATABASE`, `env.AUTH_DB`, etc. are available
3. **Check Migrations**: Ensure migrations have been generated and are in the correct directories
4. **Restart Alchemy**: Sometimes a fresh start helps:
   ```bash
   # Stop alchemy dev (Ctrl+C)
   rm -rf .alchemy
   alchemy dev
   ```

## 7. Benefits

- **Simplicity**: No complex path resolution or fallback logic
- **Reliability**: Fewer moving parts means fewer potential failures
- **Portability**: Same code works in development and production
- **Maintainability**: Less code to maintain and debug

## 8. Implementation Summary

The following changes were made to simplify the D1 database setup:

1. **Simplified `drizzle.config.ts`**:
   - Removed all SQLite file path lookup logic
   - Removed Wrangler-specific configuration
   - Removed production vs development branching
   - Now just a simple schema selector based on `D1_TARGET` env var

2. **Simplified `src/server/auth.server.ts`**:
   - Removed the entire development mode check
   - Removed in-memory SQLite fallback
   - Now directly uses `getAuthDb(env)` trusting Alchemy provides bindings

3. **Kept `vite.config.ts` unchanged**:
   - The Cloudflare Vite plugin configuration was already correct
   - Uses `ALCHEMY_CLOUDFLARE_PERSIST_PATH` env var properly

4. **Verified existing setup**:
   - All migrations are present in `drizzle/` subdirectories
   - The `db:generate:all` script works correctly with simplified config
   - No changes needed to `alchemy.run.ts` - it's already correct

The key insight: **Alchemy handles D1 bindings magically** - we don't need to manage paths or create fallbacks. Just trust it works! 