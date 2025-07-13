# Ast-Grep Improvement with AI Task List

Below is a detailed plan for implementing the "Code Search" feature using ast-grep's JavaScript API (as described in `docs/ast-grep.md`), incorporating natural language prompt transformation via AI (using Gemini 2.0 Flash), integration with the file tree, and result filtering via `codefetch-filters.store.ts`. This plan assumes we're building on the existing components and hooks in the codebase (e.g., `CodeSearchResults`, `useInteractiveGrep`, and the scraped file tree from `useScrapedDataStore`). The goal is to handle user prompts like "I want to update my codebase with a new contact page" by transforming them into ast-grep queries, searching the file tree, identifying matches or suggested addition paths, and applying filters before display. I've structured the plan into phases for clarity, focusing on high-level steps, responsibilities, data flow, edge cases, and testing considerations. No code is included here— this is purely a planning document.

**Key Updates:**
- **Ast-Grep Usage**: Exclusively use ast-grep's JavaScript API (via `@ast-grep/napi`) for all searches and operations, as outlined in `docs/ast-grep.md`. This includes parsing source with `SgRoot`, traversing with `SgNode`, and using methods like `find`, `findAll`, `getMatch`, etc. No CLI usage.
- **AI Integration**: Use Gemini 2.0 Flash for prompt transformation due to its cost-effectiveness. Users can securely add their own Gemini API key via a settings UI, stored client-side in local storage (e.g., using `localStorage.setItem('geminiApiKey', key)`). All API calls to Gemini will be made directly from the client-side to ensure 100% security—we (the app developers) never access, store, or transmit the key. If no key is provided, fallback to a basic keyword search or prompt the user to add one. Emphasize in UI: "Your API key is stored locally and never sent to our servers."

### Phase 1: User Input and Prompt Transformation
- **Objective**: Capture the user's natural language prompt and convert it into an ast-grep-compatible format (e.g., a structural search pattern or rule) using AI.
- **Tasks**:
  - [ ] In the search input field (currently in `src/routes/chat/$url.tsx` around the form with `codeSearchQuery`), capture the user's raw prompt as a string.
  - [ ] Detect if the prompt is natural language (e.g., via simple heuristics like length &gt; 10 characters or lack of ast-grep syntax like `$VAR` or `kind: function_definition`). If it's not natural language, bypass transformation and use it directly as an ast-grep query.
    - [ ] Classify the prompt intent (e.g., as 'refactor', 'debug', 'add') using simple keyword matching or a lightweight AI call to tailor the subsequent transformation rules and improve accuracy for large repos.
  - [ ] If a Gemini API key is stored in local storage, make a client-side API call to Gemini 2.0 Flash to generate an ast-grep rule. The request should include:
     - Context from the current file tree (e.g., a summarized structure of scraped data from `useScrapedDataStore`).
     - Instructions for the AI: "Transform this user intent into an ast-grep YAML rule or pattern that can search for relevant code structures. For additions (e.g., new pages), suggest file paths based on common codebase patterns."
     - Example transformations: For "add a new contact page", AI might output a rule like `kind: class_definition, pattern: ContactPage` or suggest paths like `src/pages/contact.tsx` based on existing routes.
     - Security: Use `fetch` or a client-side library to call Gemini's API directly, passing the locally stored key in headers. Never send the key to our backend.
  - [ ] Handle AI response parsing: Extract the generated ast-grep rule (as YAML or JSON) and any suggested new paths (e.g., for additions where no match exists). If no key is set, show a modal prompting the user to enter one via a secure input (e.g., not logged or transmitted).
- **Data Flow**: User input → Check local storage for key → Client-side Gemini API call → Parsed ast-grep rule + optional path suggestions.
- **Edge Cases**: Empty prompts (show error), AI failures (fallback to keyword search), ambiguous prompts (prompt user for clarification), no API key (disable AI features or prompt for key entry).
- **Dependencies**: Integrate `@google/generative-ai` or similar client-side library for Gemini; new UI component for API key management (e.g., in settings tab).

### Phase 2: Ast-Grep Search Integration with File Tree
- **Objective**: Execute the transformed ast-grep query on the scraped file tree to find matches or identify insertion points for new content using only the JavaScript API.
- **Tasks**:
  - [ ] Extend `useInteractiveGrep` (or create a wrapper hook) to accept the AI-transformed rule. Use ast-grep's JS API: Parse each relevant file's content into `SgRoot`, then call `root.find` or `findAll` with the rule/pattern.
  - [ ] Scope the search to the current file tree from `useScrapedDataStore` (e.g., traverse `scrapedData.root` and apply ast-grep to files matching language/extensions).
  - [ ] For matching existing code: Use `SgNode.find`/`findAll` to scan for patterns (e.g., finding route definitions for a "contact page" update).
  - [ ] For additions (detected from prompt keywords like "add", "new", "create"): If no matches from `findAll`, use the AI-suggested paths or infer them from the tree (e.g., look for similar patterns like existing pages in `src/routes/` via tree traversal and propose `src/routes/contact.tsx`).
  - [ ] Collect results as a list of file objects (e.g., { path, matches: [{ line, snippet }] }) or suggested new paths (e.g., { suggestedPath, reason: "Matches existing route structure" }). Use `getMatch` or `getMultipleMatches` to extract details.
  - [ ] Stream results if the tree is large (integrate with existing streaming logic like `useStreamingScrape` for progress updates).
- **Data Flow**: Transformed rule + file tree → ast-grep JS API execution → Raw results (matches + suggestions).
- **Edge Cases**: Large file trees (limit to filtered subsets first), no matches (return suggestions only), binary/non-text files (skip automatically), or invalid ast-grep rules (fallback to error display with retry option).
- **Dependencies**: `@ast-grep/napi` for JS API; ensure compatibility with TypeScript/React files in the tree.

### Phase 3: Result Filtering and Processing
- **Objective**: Apply user-configured filters from `codefetch-filters.store.ts` to refine the search results before display.
- **Tasks**:
  - [ ] After ast-grep returns raw results, pass the list of matched/suggested files through `filterFileTree` (from `src/utils/filter-file-tree.ts`), using the current state from `useCodefetchFilters` (e.g., extensions, include/exclude patterns, maxTokens).
  - [ ] For token limits: If `maxTokens` is set, estimate tokens in results (using the selected `tokenEncoder`) and apply `tokenLimiter` (truncate or spread evenly).
  - [ ] Handle manual overrides: Integrate with existing manual selections (e.g., checked/unchecked sets in the file tree component) to further refine. Automatically update the store's `manualSelections` based on high-confidence results (e.g., set checked for matched files) to streamline selection for markdown generation.
  - [ ] Augment results with metadata (e.g., why a file matched, suggested edits for additions like "Insert new ContactPage component here").
  - [ ] If results are empty post-filtering, display a message like "No matches after filtering—adjust filters or try a new prompt."
  - [ ] For very large repositories, add a 'search limits' config in `codefetch-filters.store.ts` (e.g., max files to scan or depth limits) to prevent performance issues during ast-grep traversals.
- **Data Flow**: Raw ast-grep results → Apply filters from store → Filtered file list + metadata.
- **Edge Cases**: Filters excluding all results (suggest relaxing them), token overflow (warn user and truncate), or conflicts between ast-grep matches and filters (prioritize filters but log for debugging).
- **Dependencies**: Reuse `filterFileTree` and `useCodefetchFilters`; add token estimation utils if not present.

### Phase 4: Display and User Interaction
- **Objective**: Render the filtered results in the UI and allow interactive refinements.
- **Tasks**:
  - [ ] Update `CodeSearchResults` component to handle both matches and suggestions (e.g., separate sections for "Existing Matches" and "Suggested Additions").
  - [ ] Display results with previews (snippets from ast-grep), file paths, and actions (e.g., "Open in Editor", "Apply Suggestion").
  - [ ] Provide feedback loop: Allow users to refine the prompt directly from results (e.g., "Refine Search" button that pre-fills the input with the original prompt).
  - [ ] Integrate with existing tabs (e.g., auto-open matched files in the code tab).
- **Data Flow**: Filtered results → `CodeSearchResults` rendering → User actions (e.g., open file).
- **Edge Cases**: Loading states (show progress during AI/transform/search), errors (display user-friendly messages), mobile responsiveness (ensure results are scrollable).
- **Dependencies**: Enhance existing components like `CodeSearchResults` and tabs in `src/routes/chat/$url.tsx`.

### Phase 5: Testing and Validation
- **Objective**: Ensure the feature is robust and user-friendly.
- **Tasks**:
  - [ ] Unit tests: For AI transformation (mock API responses), ast-grep JS API integration (test patterns on sample trees), and filtering (edge cases like empty results).
  - [ ] Integration tests: End-to-end flow with sample prompts (e.g., addition vs. update scenarios).
  - [ ] Manual testing: Use real codebase trees; verify with prompts like "add contact page" (should suggest paths) vs. "find all routes" (should match existing).
  - [ ] Performance checks: Time searches on large trees; optimize by pre-filtering before ast-grep.
  - [ ] UX review: Gather feedback on prompt transformation accuracy and result usefulness, including API key setup flow.
- **Metrics for Success**: 90%+ accuracy in AI transformations (measured by manual review), search completion <5s for medium trees, no crashes on invalid inputs.

### Overall Timeline and Risks
- **Estimated Effort**: 1-2 weeks (Phase 1-2: 3-5 days for core logic; Phase 3-4: 2-3 days for integration; Phase 5: 2 days for testing).
- **Risks**: AI transformation inconsistency (mitigate with prompt engineering and fallback to manual ast-grep input); ast-grep JS API limitations on certain languages (add language detection); dependency on client-side Gemini calls (handle network errors gracefully); security concerns with local storage (advise users on risks like shared devices).
- **Next Steps**: Start with a prototype of Phase 1 (AI transformation with Gemini) using a mock key, then iterate based on feedback.

This plan ensures a seamless, AI-enhanced search experience while leveraging existing codebase elements. If any part needs clarification or adjustment, let me know! 