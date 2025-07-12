# Plan for Architectural Refactor: Performance, Stability, and Scalability

## 1. Background & Core Problems

Our current architecture has several critical issues that we must address to build a stable and scalable application:

1.  **Critical Bug**: A "Rendered more hooks than during the previous render" error in `CodeSearchResults` is breaking the UI. This is caused by a conditional hook call, which is a violation of the Rules of Hooks.
2.  **High Memory Usage on Client**: The entire scraped repository data is currently held in memory on the client. All filtering, markdown generation, and token counting happens in the user's browser. This is not scalable and leads to poor performance and crashes when handling large repositories.
3.  **High Risk of UI Freezing**: The heavy computations mentioned above are performed on the main thread, which can freeze the UI, creating a frustrating user experience. The current `useMemo` and `useEffect` chain in `ChatLayout` is a primary example of this risk, leading to potential infinite loops.
4.  **Duplicated Logic**: The user mentioned that repository data is already available in a KV store, yet our client-side logic re-processes scraped data. We must eliminate this duplication and use the KV store as the single source of truth for repository data.

## 2. The New Architecture: Server-Centric Processing

The fundamental solution is to **move all heavy computation from the client to the server**. The client's role will be to manage user input and display data, while the server, leveraging the KV store, will handle the processing.

This approach will:
- **Fix Memory Issues**: The client will no longer need to hold the entire repository in memory.
- **Eliminate UI Freezing**: The browser's main thread will be freed from expensive computations.
- **Use the KV Store**: We will treat the KV store as our backend data source for all repository content.
- **Simplify Client Logic**: Components will become much simpler, removing complex `useEffect`/`useMemo` chains and reducing the likelihood of bugs.

## 3. Detailed Implementation Plan

Here is a step-by-step plan designed for a developer to follow.

### Task 1: Immediate Bug Fix (Client-Side)
This must be done first to unblock the UI.

-   **File**: `src/components/code-search-results.tsx`
-   **Action**: Move the `useVirtualizer` hook and its `fileList` calculation to the top level of the `CodeSearchResults` component.
-   **Reason**: This ensures the hook is called unconditionally on every render, complying with React's Rules of Hooks and fixing the crash.

### Task 2: Centralize UI State in Zustand Stores (Client-Side)
To prepare for the larger refactor, we will centralize all relevant UI state into our existing stores.

-   **File**: `src/lib/stores/scraped-data.store.ts`
    -   **Action**: Add `manualSelections: { checked: Set<string>; unchecked: Set<string> }` to the store's state, initialized as empty sets.
    -   **Action**: Add a `setManualSelections` action to update this state.
-   **File**: `src/lib/stores/codefetch-filters.store.ts`
    -   **Action**: Add `selectedPrompt: string` to the state, with a default of `'none'`.
    -   **Action**: Add a `setSelectedPrompt` action.
-   **Reason**: This decouples the `ChatLayout` component from managing this state itself, making it easier to refactor in the next steps.

### Task 3: Create the Server-Side Preview API (Backend)
This is the core of the new architecture.

-   **File**: Create a new API route at `src/routes/api/generate-preview.ts`.
-   **Logic**:
    1.  The endpoint must accept a `POST` request.
    2.  The request body will be a JSON object containing the current state of all user inputs: `{ repoUrl: string, filters: object, manualSelections: object, selectedPrompt: string }`.
    3.  **Fetch from KV Store**: Using the `repoUrl`, the API will fetch the complete, corresponding repository data from our KV store. This replaces the client-side `scrapedData`. (This assumes a function like `getRepoFromKV(repoUrl)` exists or will be created within our server-side logic, likely interacting with `repo-storage.ts`).
    4.  **Perform Computations**: On the server, execute the exact same logic that used to run on the client:
        -   Use `filterFileTree()` with the data from the KV store and the filters/selections from the request body.
        -   Use `new FetchResultImpl(...).toMarkdown()` to generate the markdown string.
        -   Use `countTokens()` to get the token count.
    5.  **Return Result**: The API will return a JSON response containing the computed data: `{ previewMarkdown: string, tokenCount: number }`.

### Task 4: Create a New `usePreviewStore` (Client-Side)
This new store will manage the data fetched from our new API.

-   **File**: Create a new store at `src/lib/stores/preview.store.ts`.
-   **State**: The store will contain:
    -   `previewMarkdown: string`
    -   `tokenCount: number | null`
    -   `isGenerating: boolean` (to show loading states in the UI)
-   **Actions**:
    -   `generatePreview(repoUrl: string)`: This will be the primary action. It will:
        1.  Set `isGenerating` to `true`.
        2.  Get the latest state from `useCodefetchFilters` and `useScrapedDataStore`.
        3.  Make a `fetch` call to our new `/api/generate-preview` endpoint, sending the `repoUrl` and all filters/selections in the body.
        4.  On success, update `previewMarkdown` and `tokenCount` with the response and set `isGenerating` to `false`.
        5.  On failure, handle the error state appropriately.
-   **Subscriptions (The Smart Part)**:
    -   The store will use `zustand-subscribe` or a similar pattern to listen for changes in `useCodefetchFilters` and `useScrapedDataStore`.
    -   Whenever a filter, selection, or prompt changes, the subscription will automatically trigger the `generatePreview` action. This entirely replaces the fragile `useMemo`/`useEffect` chain in the component.

### Task 5: Refactor the UI to be a "Dumb" View Layer
Now we connect our simplified UI to our powerful new stores.

-   **File**: `src/routes/chat/$url.tsx` (the `ChatLayout` component)
-   **Actions**:
    -   **Remove all local state** related to `manualSelections`, `selectedPrompt`, `previewMarkdown`, and `tokenCount`.
    -   **Remove the complex `useMemo`** for `previewMarkdown` and the `useEffect` for `countTokens`.
    -   **Connect to Stores**:
        -   Read `previewMarkdown`, `tokenCount`, and `isGenerating` directly from `usePreviewStore`. Use `isGenerating` to show loading skeletons.
        -   User interactions will now call actions on the stores. For example, selecting a file in `SimpleFileTree` will call `useScrapedDataStore.getState().setManualSelections(...)`.
-   **Files**: `SimpleFileTree.tsx` and `CodefetchFilters.tsx`
-   **Actions**:
    -   Refactor these components to get their state (e.g., `manualSelections`, `selectedPrompt`) from the Zustand stores and to call the store actions on user input.

## Tickable Task List for Implementation

### Phase 1: Immediate Stabilization
-   [ ] **Task 1**: In `src/components/code-search-results.tsx`, move the `useVirtualizer` hook to the top level of the component to fix the critical hook error.

### Phase 2: Architectural Refactor
-   [ ] **Task 2.1**: Update `useScrapedDataStore` to include `manualSelections` state and a `setManualSelections` action.
-   [ ] **Task 2.2**: Update `useCodefetchFilters` to include `selectedPrompt` state and a `setSelectedPrompt` action.
-   [ ] **Task 3**: Create the new server-side API endpoint at `src/routes/api/generate-preview.ts` with all the specified logic (fetch from KV, compute, return).
-   [ ] **Task 4.1**: Create the new `usePreviewStore` at `src/lib/stores/preview.store.ts` with the required state and actions.
-   [ ] **Task 4.2**: Implement the subscription logic within `usePreviewStore` to automatically re-fetch the preview when filters or selections change.
-   [ ] **Task 5.1**: Refactor the `ChatLayout` component to remove local state/effects and connect it to the new `usePreviewStore`.
-   [ ] **Task 5.2**: Refactor `SimpleFileTree` and `CodefetchFilters` to be fully controlled by their respective Zustand stores.
-   [ ] **Task 6**: Thoroughly test the application to ensure the original UI behavior is preserved, performance is drastically improved with large repos, and all loading/error states are handled correctly. 