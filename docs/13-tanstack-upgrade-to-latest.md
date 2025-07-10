# TanStack Upgrade Plan: From Devinxi Alpha to Latest Stable

This document outlines the upgrade plan from TanStack Start Devinxi alpha (v1.121.0-alpha.x) to the latest stable version (v1.126.x).

## Current State Analysis

Based on the codebase analysis:
- Currently using @tanstack/react-start@1.121.0-alpha.25
- Already using Vite (not vinxi)
- Already migrated from app/ to src/
- Already using createServerFileRoute for API routes
- Has both app.config.ts and vite.config.ts (needs consolidation)

## Upgrade Plan

### 1. Backup and Create a New Git Branch

**Why:** Standard best practice to isolate changes and allow easy rollback.

**Steps:**
1. Commit any uncommitted changes (git status shows modified and untracked files)
2. Create a new branch: `git new feat/tanstack-upgrade`

**Verification:** Run `git status` to ensure a clean working directory. Test that the app still runs with `pnpm dev`.

**Risks:** None - this is non-destructive.

### 2. Update TanStack Packages to Latest Stable Versions

**Why:** Move from alpha versions to stable for bug fixes, stability, and new features.

**Steps:**
```bash
pnpm add @tanstack/react-start@latest
pnpm add @tanstack/react-router@latest
pnpm add @tanstack/react-router-devtools@latest
pnpm add @tanstack/react-query@latest
pnpm add @tanstack/react-query-devtools@latest
pnpm add @tanstack/react-table@latest
```

**Verification:** 
- Check package.json for updated versions (no "-alpha" suffix)
- Run `pnpm dev` and test routes and API endpoints

**Risks:** Potential breaking changes in stable versions. Check TanStack Start changelog for v1.121+ changes.

### 3. Remove app.config.ts and Integrate Config into vite.config.ts

**Why:** TanStack Start now uses vite.config.ts exclusively with the tanstackStart plugin.

**Steps:**
1. Delete app.config.ts: `git rm app.config.ts`
2. Update vite.config.ts to include cloudflare preset:

```typescript
import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import { defineConfig } from "vite"
import tsConfigPaths from "vite-tsconfig-paths"

export default defineConfig({
    server: {
        port: 3000
    },
    plugins: [
        tsConfigPaths({
            projects: ["./tsconfig.json"]
        }),
        tanstackStart({
            server: {
                preset: 'cloudflare',
                rollupConfig: {
                    external: ['node:async_hooks'],
                },
            },
        }),
        tailwindcss()
    ]
})
```

**Verification:** Run `pnpm build` and check for errors.

**Risks:** If cloudflare preset is critical for deployment, ensure it's properly configured.

### 4. Update Build Script in package.json

**Why:** Remove Nitro-specific configuration as TanStack Start is Vite-native.

**Steps:**
Change in package.json:
```json
"build": "vite build"
```

**Verification:** 
- Run `pnpm build`
- Check output in .output/
- Run `pnpm start` to test the built app

**Risks:** Deployment issues if infrastructure relies on Nitro-specific output.

### 5. Verify and Clean Up Router and Server Files

**Why:** Ensure no references to old Devinxi APIs remain.

**Steps:**
1. Verify src/router.tsx exists and is properly configured (✓ already done)
2. Search for any remaining vinxi/devinxi references
3. No action needed for client/ssr.tsx (they don't exist)

**Verification:** Run the app and test key routes.

**Risks:** Minimal, as this is mostly verification.

### 6. Test and Fix Any Breaking Changes

**Why:** Ensure all functionality works after upgrade.

**Steps:**
1. Run all tests:
   - `pnpm test`
   - `pnpm test:auth`
   - `pnpm test:scrape`
2. Manually test core features:
   - Authentication flows
   - API endpoints (/api/scrape, /api/context)
   - Chat routes
   - Database interactions
3. Fix any linter errors: `pnpm lint:fix`

**Verification:** All tests pass, app runs without errors.

**Risks:** Test failures or runtime errors - address before merging.

### 7. Commit, Merge, and Deploy

**Why:** Finalize the upgrade.

**Steps:**
1. Commit changes: `git commit -m "Upgrade TanStack Start to stable v1.126.x"`
2. Create PR and merge to main
3. Deploy to staging first if available
4. Deploy to production: `pnpm deploy:prod`

**Verification:** Monitor production logs for issues.

**Risks:** Production breakage - deploy to staging first if possible.

## Notes and Assumptions

- **Already Completed:** Vite migration, app/ to src/ rename, API to server route migration
- **Deployment:** alchemy.run.ts/docker-compose should handle Cloudflare specifics
- **TanStack Query:** Using stable v5.x (v6 may still be in development)
- **Time Estimate:** 1-2 hours if no major issues arise

## Potential Issues to Watch For

1. **Cloudflare Deployment:** Verify that removing NITRO_PRESET doesn't break deployment
2. **Type Changes:** Watch for any TypeScript errors after package updates
3. **Router API Changes:** Check for any deprecated routing APIs
4. **Build Output:** Ensure .output/ structure matches deployment expectations

## Resources

- [TanStack Start Documentation](https://tanstack.com/start/latest)
- [Migration Guide](./12-tanstack-upgrade.md)
- [TanStack Start Changelog](https://github.com/TanStack/router/releases) 