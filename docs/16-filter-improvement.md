# File Extension Filter Improvement Plan

## Current Implementation Analysis
From reviewing the codebase, the file extension filters are implemented in `src/components/codefetch-filters.tsx`. Currently, it uses a static array of popular file extensions. The UI displays them in a two-column layout, which takes up significant space. There's also a custom input for additional extensions.

## Goals
- Dynamically generate filter options based only on file extensions actually present in the scraped project's file tree.
- Prioritize extensions based on usage frequency (similar to GitHub's language bar visualization).
- Make the filter UI more dense to save space, changing from two columns to a single, compact list or tag-like display.
- Retain the custom extension input for flexibility.
- Ensure the changes integrate seamlessly with the existing scraped data store and file tree component.

## High-Level Plan
1. **Compute Dynamic Extensions:**
   - Create a utility function to traverse the `FileNode` tree from the scraped data store.
   - Extract unique file extensions from all file names.
   - Count the frequency of each extension to enable sorting/prioritization (e.g., most used first).
   - Store this data in the Zustand store for easy access.

2. **Update Store:**
   - Add state for dynamic extensions (array of {ext: string, count: number}) to `scraped-data.store.ts`.
   - Add a function to compute and set these extensions when scraped data loads.

3. **Modify Filters Component:**
   - In `codefetch-filters.tsx`, replace static extensions with dynamic ones from the store.
   - Sort the list by frequency descending, then alphabetically.
   - Update the UI to use a denser layout, such as a single-column list of checkboxes or a horizontal tag list.

4. **UI Density Improvements:**
   - Change from grid/two-column to a vertical list with smaller padding/margins.
   - Use compact components like badges or small toggles for each extension.
   - Ensure responsiveness for smaller screens.

5. **Integration and Testing:**
   - Update any dependent components (e.g., file-tree.tsx) if needed.
   - Add tests for the extension computation and filter rendering.
   - Verify with sample scraped data.

6. **Edge Cases:**
   - Handle projects with no files or unknown extensions.
   - Fallback to static list if no scraped data.
   - Limit displayed extensions if too many (e.g., top 10 + "more").

## Tickable Task List
- [ ] Research and confirm current implementation by reading `src/components/codefetch-filters.tsx` fully.
- [ ] Create utility function in `src/utils/filter-file-tree.ts` (or new file) to compute unique extensions and frequencies from FileNode tree.
- [ ] Update `scraped-data.store.ts` to include state for dynamicExtensions and a setter that computes them when scrapedData changes.
- [ ] Modify `codefetch-filters.tsx` to use dynamicExtensions instead of static list, sorting by frequency.
- [ ] Refactor the UI in `codefetch-filters.tsx` to a denser single-column list of checkboxes or toggles.
- [ ] Ensure custom extension input remains and integrates with the dynamic list (e.g., add to filters without duplicating).
- [ ] Add loading state or fallback if dynamic extensions are not yet computed.
- [ ] Test the computation with sample data, ensuring only used extensions show.
- [ ] Update any related components or routes that use filters.
- [ ] Write unit tests for the extension computation utility.
- [ ] Document the changes in the codebase with comments.
- [ ] Commit changes and create a pull request for review. 