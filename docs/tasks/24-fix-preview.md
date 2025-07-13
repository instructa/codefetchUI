# Preview Generation Fix Plan

## Current Implementation Analysis
The preview feature is designed to provide a real-time markdown representation of the codebase based on user selections and filters. However, it is currently broken. The core issue is a broken communication channel between the user's actions (selecting files, changing filters) and the preview generation logic.

-   **State Management**: The application correctly uses Zustand stores (`useScrapedDataStore`, `useCodefetchFilters`, `usePreviewStore`) to manage the state of scraped data, filters, and the preview content itself.
-   **Web Worker**: Preview generation is offloaded to a web worker (`src/workers/preview.worker.ts`) to prevent UI blocking, which is a good practice.
-   **The Break**: The component responsible for orchestrating this process, `src/components/codefetch-filters.tsx`, is missing the logic to trigger the web worker. A crucial custom hook, `usePreviewGenerator`, which should bridge the stores and the worker, was absent from the codebase.

## Goals
-   Restore the real-time update functionality of the "Preview" tab.
-   Ensure that any change in file selection or filter settings immediately triggers a regeneration of the markdown preview.
-   Re-establish the communication between the main application thread and the preview web worker.
-   Ensure loading states are correctly displayed in the UI while the preview is being generated.

## High-Level Plan
1.  **Re-create the `usePreviewGenerator` Hook**: A dedicated hook will be created to manage the preview generation lifecycle. This hook will be responsible for initializing the web worker, watching for changes in relevant data stores, and communicating with the worker to generate previews.
2.  **Integrate the Hook**: The new hook will be called from within the `CodefetchFilters` component. Since this component is always active when the filter panel is visible, it is the ideal place to ensure the preview logic is running.

## Tickable Task List
-   [x] Create the file `src/hooks/use-preview-generator.ts`.
-   [x] Implement the `usePreviewGenerator` hook with logic to manage the preview worker and data store subscriptions.
-   [x] Import `usePreviewGenerator` into `src/components/codefetch-filters.tsx`.
-   [x] Call the `usePreviewGenerator()` hook at the top level of the `CodefetchFilters` component.
-   [ ] Verify that changing file selections in the file tree updates the "Preview" tab correctly.
-   [ ] Verify that modifying filters also triggers a preview update.
-   [ ] Confirm that loading indicators are properly displayed during preview regeneration.
-   [x] Commit the changes with a descriptive message. 