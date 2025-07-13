# Code Search Fix Plan

## Current Implementation Analysis
The code search feature in `src/routes/chat/$url.tsx` is implemented in the 'search' tab of the left panel. It uses an input field for queries, supports natural language processing via Gemini API to transform queries into ast-grep rules, and displays results using the `CodeSearchResults` component. It handles vague queries with a hardcoded check for 'test' related terms. The search calls the `searchCode` function from `useInteractiveGrep` hook without passing the repo URL, which is incompatible with the new storage-based implementation in PR #7, preventing searches from working on the currently loaded project. Ast-grep is used for structural code searches to better find related files based on user prompts, but lacks proper integration with repo storage. Metadata display is conditionally shown only in development mode. Error handling is basic, and there's no specific mobile adaptation for the search tab.

## Goals
- Integrate with the new unstorage repo storage system from PR #7 by passing the repo URL to search calls and ensuring compatibility with loaded projects.
- Improve vague query handling to cover more common cases beyond just 'test', including patterns like 'api routes' or 'components'.
- Enhance error handling and add proper loading states, including API key validation for Gemini.
- Ensure the search feature works well on mobile devices, possibly by adding it to the mobile layout in `dashboard-layout.tsx`.
- Remove development-only restrictions on metadata display if appropriate.
- Add validation for API keys and better user feedback.
- Optimize performance and add caching where possible, including search result caching.
- Add validation for AI-generated ast-grep rules with fallbacks.

## High-Level Plan
1. **Update Search Calls:**
   - Modify all `searchCode` invocations to include the repo URL as the second parameter.

2. **Enhance Query Handling:**
   - Expand vague query detection and handling to include more intents like 'api', 'components', etc.
   - Improve fallback mechanisms for AI transformation failures.
   - Add validation for generated ast-grep rules in `~/utils/ast-grep-ai.ts`.

3. **Improve UI/UX:**
   - Add loading indicators during searches.
   - Enhance error messages with retry options.
   - Adapt the search tab for mobile views, possibly using a sheet or collapsible section.

4. **Integrate Storage Checks:**
   - Add checks to ensure repo data is stored before searching (using `useScrapedDataStore` and `repo-storage.ts`), with fallback to trigger scraping if needed.

5. **Testing and Optimization:**
   - Test with various query types and repo states, including freshly loaded vs. cached repos.
   - Optimize result rendering for large result sets.
   - Implement caching for search results to improve performance.

6. **Documentation and Cleanup:**
   - Update comments in code.
   - Remove unnecessary dev-only flags.

## Tickable Task List
- [ ] Read and analyze current `src/routes/chat/$url.tsx` implementation, focusing on the code search section.
- [ ] Update all `searchCode` calls to pass the repo URL as the second argument.
- [ ] Expand vague query handling to include more patterns (e.g., 'api routes', 'components').
- [ ] Add validation and fallback handling for AI-generated ast-grep rules in `~/utils/ast-grep-ai.ts`.
- [ ] Add loading state management in the search tab.
- [ ] Improve error handling with user-friendly messages and retry buttons.
- [ ] Implement mobile compatibility for the code search feature, integrating with mobile layout if needed.
- [ ] Add check for stored repo data before searching (via `useScrapedDataStore`), with fallback logic to trigger scraping.
- [ ] Remove or configure the isDevelopment check for metadata display.
- [ ] Implement caching mechanism for search results in `use-interactive-grep.ts`.
- [ ] Test the search with natural language, direct ast-grep, and vague queries across different repo states (e.g., newly loaded projects).
- [ ] Optimize result display for performance in `CodeSearchResults` component.
- [ ] Add code comments documenting the changes.
- [ ] Commit changes and create a pull request. 