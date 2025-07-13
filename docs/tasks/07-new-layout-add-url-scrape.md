# Plan: Integrate Scraping Functionality into Chat View

This document outlines the plan to integrate the URL scraping and file viewing functionality from `/scrape/$url` into the main chat interface at `/chat/$url`.

## 1. Clarifying Questions & Answers

1.  **Scraping Trigger:** Should the scraping process for the URL in the route start automatically when the chat page loads, or should there be a manual trigger (e.g., a 'Scrape' button)?
    *   **Answer:** Automatically.

2.  **UI for Scraping State:** How should the scraping progress, metadata, and any potential errors be displayed in the new chat interface? Should they temporarily replace the right-hand panel (code/preview area), or be shown in a less intrusive way like a toast notification or a status bar?
    *   **Answer:** The existing UI from `/scrape/$url` will be adapted. Loading and error states will be displayed inside the right-hand panel's content area.

3.  **File Content Display:** For displaying the content of a selected file, is a simple read-only text view (like in the old scrape page) sufficient for now, or should I aim to integrate a more feature-rich code editor?
    *   **Answer:** A read-only text view is sufficient for now.

4.  **Cleanup:** After integrating the scraping functionality into the chat view, should I delete the now-redundant `/scrape` route and its associated files?
    *   **Answer:** No, keep the `/scrape` route.

## 2. High-Level Plan

The goal is to merge the data-loading logic of `scrape/$url.tsx` with the UI structure of `chat/$url.tsx`. The user will navigate to a `/chat/<encoded-url>` route, which will automatically trigger the scraping of the URL. The fetched file tree will populate the file explorer in the right-hand panel, and selecting a file will display its content.

## 3. Detailed Implementation Steps

### Phase 1: Data-Loading and State Management in Chat Route

1.  **Update `src/routes/chat/$url.tsx` Route Definition:**
    *   Copy the `validateSearch` and `loader` functions from `src/routes/scrape/$url.tsx`. This will handle URL decoding and validation.
    *   Add `pendingComponent` and `errorComponent` handlers inspired by `scrape/$url.tsx` for a better UX during initial load.

2.  **Integrate Scrape Hooks:**
    *   In the `ChatRoute` component, import and use the `useStreamingScrape` hook and the `useScrapedDataStore` zustand store.
    *   The scraping process will be initiated automatically within a `useEffect` hook, triggered by the URL from `useLoaderData`.
    *   Scraped data (file tree and file contents) will be stored in `useScrapedDataStore`.

### Phase 2: UI Integration in Right-Hand Panel

1.  **Handle Loading and Error States:**
    *   The right panel (Code/Preview area) will conditionally render UI based on the `isLoading` and `error` state from `useStreamingScrape`.
    *   The UI from `scrape/$url.tsx` will be adapted to show progress, metadata, and error messages within the right panel's "Code" tab.

2.  **Connect `FileTree` to Scraped Data:**
    *   The `FileTree` component in the "Code" tab will be supplied with the file tree data from `useScrapedDataStore`.
    *   The `FileTree` component will be updated to properly render the hierarchical data structure from the scraper.
    *   An `onFileSelect` callback will be passed to `FileTree` to handle file selection.

3.  **Display File Content:**
    *   When a file is selected in `FileTree`, the `handleFileOpen` function in `ChatRoute` will be called.
    *   This function will add the file to the `openFiles` state for the tabbed view and set the `activeFileId`.
    *   The content for the active file will be retrieved from `useScrapedDataStore` and displayed in a read-only `<pre>` block within the "Code" tab's editor area.

### Phase 3: Component Refactoring

1.  **Enhance `FileTree` Component:**
    *   The existing `FileTree` component is a placeholder and will be implemented to:
        *   Accept the tree data structure from `codefetch`.
        *   Recursively render nested files and folders.
        *   Manage folder expansion/collapse state.
        *   Trigger the `onFileSelect` callback when a file is clicked, passing the file's data.

2.  **Refactor `ChatRoute` Component:**
    *   The logic for the right panel's content (the "Code" tab) will be encapsulated within the `ChatRoute` component. This includes handling the loading/error states, the file tree, the file tabs, and the code view.

## 4. Tech Stack/Components Involved

*   **TanStack Router:** For `loader`, `validateSearch`, `pendingComponent`.
*   **React Hooks:** `useEffect`, `useState`, `useRef`.
*   **Zustand:** `useScrapedDataStore` for global state management of scraped data.
*   **Custom Hook:** `useStreamingScrape` for handling the streaming API response.
*   **Components:**
    *   `src/routes/chat/$url.tsx` (main component)
    *   `src/components/file-tree.tsx` (to be implemented)
    *   `src/components/ui/*` (Tabs, Button, Card, etc.)
*   **API Route:** `src/routes/api/scrape.ts` (backend, will be consumed). 