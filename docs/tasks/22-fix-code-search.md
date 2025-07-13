# Plan to Refactor and Optimize Code Context Generation

## Background

The application is currently facing several issues that impact both stability and performance, especially when dealing with large repositories:

1.  **React Hook Error**: A "Rendered more hooks than during the previous render" error in `CodeSearchResults` is caused by a conditional call to the `useVirtualizer` hook, violating the Rules of Hooks.
2.  **Potential Infinite Loop**: In `src/routes/chat/$url.tsx`, the `useMemo` hook for `previewMarkdown` depends on objects (`filters`, `manualSelections`). This can lead to unnecessary recalculations and trigger a `useEffect` that updates state, causing a potential infinite render loop.
3.  **Performance Bottlenecks**: The issues above are symptoms of a larger architectural problem. The `ChatLayout` component has become a bottleneck, managing complex local state and performing heavy computations (file tree filtering, markdown generation, token counting) directly on the main thread. This approach does not scale to large repositories and can lead to a sluggish, unresponsive UI.

## Goals

1.  **Eliminate All Hook-Related Errors**: Resolve the immediate hook violation and prevent future infinite loops by simplifying component logic.
2.  **Drastically Improve Performance**: Ensure the UI remains responsive and fast, even when processing large codebases, by offloading heavy work from the main thread.
3.  **Robust State Management**: Refactor the component-level state into our existing Zustand stores, creating a single source of truth and a more predictable, scalable architecture.
4.  **Adhere to Best Practices**: Reduce the reliance on complex `useEffect` and `useMemo` chains in components, favoring derived state and actions within stores.

## Implementation Plan

### 1. (Immediate) Fix `CodeSearchResults` Hook Violation

This is a critical bug that needs to be fixed first to stabilize the UI.

-   **Action**: In `src/components/code-search-results.tsx`, move the `useVirtualizer` hook and its related `fileList` calculation to the top level of the component. This ensures it is called unconditionally on every render, complying with the Rules of Hooks.

### 2. Refactor State into Zustand Stores

To simplify the `ChatLayout` component and centralize state, we will move local state into the appropriate stores.

-   **`useScrapedDataStore` (`src/lib/stores/scraped-data.store.ts`)**:
    -   **Action**: Add `manualSelections: { checked: Set<string>; unchecked: Set<string> }` to the store's state.
        - `checked`: File paths that are forced to be included regardless of filters
        - `unchecked`: File paths that are forced to be excluded regardless of filters
    -   **Action**: Add a `setManualSelections` action to update this state.
    -   **Note**: These selections represent file paths (not IDs) and override the automatic filtering logic.

-   **`useCodefetchFilters` (`src/lib/stores/codefetch-filters.store.ts`)**:
    -   **Action**: Add `selectedPrompt: string` to the store's state, with a default value of `'none'`.
    -   **Action**: Add a `setSelectedPrompt` action.

### 3. Offload Computation to a Browser Web Worker via a New `usePreviewStore`

This is the core of the performance optimization. We will create a new store to handle all expensive, derived state related to the markdown preview using a browser-side Web Worker.

-   **Action**: Create a new store at `src/lib/stores/preview.store.ts`.
-   **State**: The store will manage `previewMarkdown: string`, `tokenCount: number | null`, and `isGenerating: boolean`.
-   **Web Worker Implementation**:
    -   Create a Web Worker at `src/workers/preview.worker.ts` using Vite's native Web Worker support.
    -   The worker will be imported using: `new Worker('/src/workers/preview.worker.ts', { type: 'module' })`
    -   The store's primary action, `regeneratePreview`, will post a message to the Web Worker with serialized data.
    -   The Web Worker will receive the necessary data (the full scraped file tree, filters, selections, selected prompt, etc.) and perform all heavy lifting:
        1.  Filtering the file tree using the existing `filterFileTree` function.
        2.  Generating the markdown using `new FetchResultImpl(...).toMarkdown()`.
        3.  Applying the selected prompt template if not 'none'.
        4.  Counting the tokens using the `countTokens` function from `codefetch-sdk`.
    -   The worker will use `postMessage` to send results back to the main thread.
    -   **Important**: All data sent to the worker must be serializable (Sets will need to be converted to Arrays).

-   **Store Subscriptions**:
    -   The `usePreviewStore` will subscribe to changes in `useScrapedDataStore` and `useCodefetchFilters`.
    -   When relevant state changes (filters updated, manual selections changed, scraped data arrives, prompt selected), it will trigger `regeneratePreview`.
    -   Use Zustand's `subscribeWithSelector` to only react to specific state changes.

### 4. Update Components to Use the New Architecture

-   **`ChatLayout` (`src/routes/chat/$url.tsx`)**:
    -   **Action**: Remove the local states for `manualSelections` and `selectedPrompt`.
    -   **Action**: Remove the expensive `useMemo` for `previewMarkdown` (lines 261-318).
    -   **Action**: Remove the `useEffect` for `countTokens` (lines 320-340).
    -   **Action**: The component will now simply read `previewMarkdown`, `tokenCount`, and `isGenerating` directly from `usePreviewStore`.
    -   **Action**: Update button handlers to call store actions (e.g., `useScrapedDataStore.getState().setManualSelections()`).

-   **`SimpleFileTree` (`src/components/simple-file-tree.tsx`)**:
    -   **Action**: Update to read `manualSelections` from `useScrapedDataStore` instead of props.
    -   **Action**: Call `setManualSelections` action when selections change.

-   **`CodefetchFilters` (`src/components/codefetch-filters.tsx`)**:
    -   **Action**: Add a prompt selector UI element (using existing `Select` component).
    -   **Action**: Bind it to `selectedPrompt` state and `setSelectedPrompt` action from `useCodefetchFilters`.

### 5. Web Worker Implementation Details

-   **File**: `src/workers/preview.worker.ts`
-   **Message Protocol**:
    ```typescript
    // Main thread → Worker
    interface GeneratePreviewMessage {
      type: 'generate';
      data: {
        fileTree: any; // Serialized FileNode
        filters: any; // Serialized filter config
        manualSelectionsChecked: string[]; // Array instead of Set
        manualSelectionsUnchecked: string[]; // Array instead of Set
        selectedPrompt: string;
        url: string;
        tokenEncoder: string;
      };
    }

    // Worker → Main thread
    interface PreviewResultMessage {
      type: 'result';
      data: {
        markdown: string;
        tokenCount: number;
      };
    }
    ```

-   **Worker Setup**: Use dynamic imports for heavy dependencies to keep initial bundle small.
-   **Error Handling**: Wrap all worker operations in try-catch and post error messages back.

### 6. Migration Strategy

To ensure a smooth transition:

1. **Phase 1**: Implement stores and worker without removing existing logic.
2. **Phase 2**: Verify worker generates identical output to current implementation.
3. **Phase 3**: Switch components to use new store-based state.
4. **Phase 4**: Remove old component-level state and logic.

## Benefits of This Approach

1. **Instant Feedback**: No network latency - all computation happens client-side.
2. **Non-Blocking UI**: Heavy computation runs on a separate thread.
3. **Efficient Data Flow**: File tree data stays client-side after initial fetch.
4. **Consistent Architecture**: Markdown generation remains client-side as it is now.
5. **Scalable**: Can handle large repositories without freezing the UI.

## Future Enhancements

While not part of the immediate fix:

-   **Worker Pooling**: For extremely large repos, split work across multiple workers.
-   **Incremental Updates**: Only recompute changed portions of the preview.
-   **Optional Server Caching**: If users frequently return to the same repo/filter combinations, optionally cache results server-side.

## Updated Task List

-   [ ] **Bug Fix**: Move `useVirtualizer` in `CodeSearchResults` to the top level of the component.
-   [ ] **Store**: Add `manualSelections` state and `setManualSelections` action to `useScrapedDataStore`.
-   [ ] **Store**: Add `selectedPrompt` state and `setSelectedPrompt` action to `useCodefetchFilters`.
-   [ ] **Web Worker**: Create `src/workers/preview.worker.ts` with message handling.
-   [ ] **Web Worker**: Implement markdown generation and token counting logic in the worker.
-   [ ] **Store**: Create `src/lib/stores/preview.store.ts` with Web Worker integration.
-   [ ] **Store**: Implement `regeneratePreview` action that communicates with the worker.
-   [ ] **Store**: Set up subscriptions to other stores using `subscribeWithSelector`.
-   [ ] **Refactor**: Update `ChatLayout` to use stores instead of local state.
-   [ ] **Refactor**: Update `SimpleFileTree` to use `manualSelections` from store.
-   [ ] **UI**: Add prompt selector to `CodefetchFilters` component.
-   [ ] **Testing**: Verify identical output between old and new implementations.
-   [ ] **Cleanup**: Remove old local state and computation logic from components. 