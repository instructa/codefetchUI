# Code Style and Guideline Adherence Report

This document outlines findings from a codebase review based on the rules defined in `@main.mdc`. The goal is to identify areas for improvement and ensure consistency with our established best practices.

## Summary of Findings

*Overall, the codebase demonstrates good adherence to the established rules. Key strengths include consistent use of `pnpm`, TypeScript for routes, and modern React patterns. The following sections detail specific areas for improvement.*

---

## 1. Routing

The routing setup is solid and adheres to the core principles of the guidelines.

-   **File Types**: All UI-facing routes are correctly using the `.tsx` extension. API routes under `src/routes/api/` use the `.ts` extension, which is appropriate as they do not export React components.
-   **Exports**: There are no `default` exports in the `src/routes` directory, which aligns with the "no default exports" rule.
-   **`createFileRoute`**: The `createFileRoute` function is not being explicitly imported in any route file, correctly relying on the framework's auto-injection.

**Recommendation**: None. The current implementation is correct.

---

## 2. Imports

-   **Alias Imports**: The codebase generally uses alias imports (`~/`) correctly. However, a few instances of relative imports (`../`) were found.

**Recommendation**: Convert relative imports to alias imports for consistency.

**Files to Update**:
- `src/routes/__root.tsx`:
    - `import appCss from '../styles/app.css?url';` -> `import appCss from '~/styles/app.css?url';`
    - `import customCss from '../styles/custom.css?url';` -> `import customCss from '~/styles/custom.css?url';`

---

## 3. Environment Variables

The use of environment variables appears to follow the guidelines.

-   `process.env`: This is used in `src/routes/api/test-email.ts`. Since this is a server-side API route, this is the correct way to access environment variables.
-   `import.meta.env`: No usages of `import.meta.env` were found, but there are not many places in the current codebase where client-side environment variables are needed.

**Recommendation**: None. The current implementation is correct. A file at `src/data/dummy-data.ts` seems to contain a large amount of test-related code (from QUnit) and is generating noise in code searches. Consider removing this file if it is not actively used.

---

## 4. Project Structure & Code Style

The project generally follows the prescribed structure and style, with a few areas for improvement.

### What's Working Well

-   **Component Structure**: Presentational components in `src/components/` are stateless and focused on UI, as exemplified by `src/components/ui/button.tsx`.
-   **Hook Organization**: Shared hooks are correctly located in `src/hooks/`.
    -   `auth-hooks.ts`
    -   `use-mobile.ts`
    -   `use-streaming-scrape.ts`
-   **Store Organization**: Zustand stores are centralized in `src/lib/stores/`. While the rule specifies `src/stores`, the current organization is clear and consistent.
    -   `codefetch-filters.store.ts`
    -   `scraped-data.store.ts`
-   **Route Logic Colocation**: Route files correctly colocate components, loaders, and other route-specific logic, as seen in `src/routes/chat/$url.tsx`.
-   **Loader Functions**: Route loaders are correctly implemented as `async` arrow functions.
-   **Destructuring**: Props and hook results are consistently destructured at the top of components, improving readability.

### Areas for Improvement

-   **Named Exports**: The rule "Use named exports for every module" is not followed consistently. Several files use `export default`.
    -   **Recommendation**: Refactor the following files to use named exports.
    -   **Files to Update**:
        -   `src/server/auth.server.ts`
        -   `src/components/chat/assistant-chat.tsx`
        -   `src/components/gradient-orb.tsx`
        -   `src/components/layout/dashboard-layout.tsx`
        -   `src/db/repositories/profile.repo.ts`
        -   `src/db/repositories/user.repo.ts`

-   **`useState` Usage**: The use of `useState` seems appropriate for local component state. However, it's worth a reminder to always consider if state can be derived from a global store (Zustand/TanStack Query) before introducing new local state. The state management in `src/routes/chat/$url.tsx` for `openFiles` and `activeFileId` could potentially be moved to a store, but the current implementation is reasonable for local UI management.

-   **Non-blocking UI State**: No instances of `useTransition` or `useDeferValue` were found.
    -   **Recommendation**: Consider using these hooks for any UI updates that are not high-priority, which can help prevent jank and improve user experience, especially in data-heavy components.

---

## 5. Advanced Usage & Performance

The codebase could benefit from adopting several of the advanced patterns recommended in the guidelines to improve performance and user experience.

-   **TanStack Query**:
    -   `ensureQueryData`: Not currently used. **Recommendation**: Implement `ensureQueryData` in route loaders to pre-fetch data on the server, reducing client-side loading states and improving perceived performance.
    -   Suspense Queries: `useSuspenseQuery` and `useSuspenseInfiniteQuery` are not used. **Recommendation**: Adopt suspense-based queries to let React manage loading states declaratively, which can simplify component logic.

-   **TanStack Start**:
    -   `defer`: The `defer` helper is not used for streaming partial responses. **Recommendation**: For routes with large data requirements, use `defer` to stream data and improve the Time to First Byte (TTFB).
    -   Prefetching: No `preload` props on `<Link>` components or `usePrefetch` hooks were found. **Recommendation**: Add prefetching to important links to load data and code on hover, making navigation feel instantaneous.

-   **Zustand**:
    -   `shallow`: The `shallow` equality checker from `zustand/shallow` is not used in any store selectors. **Recommendation**: Use the `shallow` comparator in `useStore` selectors that return objects or arrays to prevent unnecessary re-renders when the underlying data hasn't changed meaningfully.

-   **React**:
    -   `HydrationBoundary`: Not used. **Recommendation**: Wrap components that are strictly client-side with `<HydrationBoundary>` to prevent them from being re-executed on the client after server-side rendering.

--- 