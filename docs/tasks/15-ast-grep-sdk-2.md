# Plan to Fix ast-grep Panic in AI-Enhanced Code Search

## Issue Summary
The natural language query "i want to run tests" is transformed into an invalid ast-grep rule by the AI, causing a parser panic due to newlines and multi-node errors (e.g., `MultipleNode("\ntest($$$ARGS) { $$$BODY }")`). This prevents any matches from being found, even when test folders exist in the file tree. The plan focuses on improving rule generation, error handling, and search robustness without altering the existing codebase structure.

## Prerequisites
- Ensure Gemini API key is configured for testing AI transformations.
- Test with sample scraped data containing test folders (e.g., `tests/`, `__tests__/`, `*.test.ts` files).
- Verify ast-grep version compatibility (aim for latest stable to avoid known parser bugs).

## Tickable Task List

- [ ] **Refine AI Prompt in `transformPromptToAstGrepRule`**: Update the prompt in `~/utils/ast-grep-ai.ts` to enforce valid, single-line patterns without newlines or improper metavariables. Include examples of correct rules for matching test functions and directories (e.g., `rule: { kind: function_definition, pattern: test($$$) }` or path-based rules like `rule: { path: { regex: ".*test.*" } }`). Test with vague queries to ensure output is always parsable YAML.

- [ ] **Improve Natural Language Detection**: In `isNaturalLanguagePrompt`, add logic to detect and reroute overly vague queries (e.g., those without code-specific terms) to a simple file name search fallback using `searchFiles` from `scraped-data.store.ts`, bypassing AI to avoid invalid rules.

- [ ] **Add Validation for Generated Rules**: Before calling `searchCode`, add a function to validate the AI-generated rule (e.g., check for newlines, ensure single-node patterns, and test-parse with a lightweight ast-grep wrapper). If invalid, fallback to a default rule like searching for "test" in file paths.

- [ ] **Enhance Error Handling in `useInteractiveGrep` Hook**: Modify the hook to catch ast-grep panics (e.g., via try-catch in the API call) and return user-friendly errors (e.g., "Invalid search rule generated—try rephrasing your query or use direct syntax"). Display this in `<CodeSearchResults />` instead of "no match found."

- [ ] **Incorporate Better File Tree Context**: Expand `fileTreeContext` in `handleCodeSearch` to include a fuller, non-truncated summary of directories (e.g., list top-level folders like "tests/" explicitly) to help AI generate rules that target folders, not just code patterns.

- [ ] **Add Directory-Focused Rule Templates**: Create predefined ast-grep rule templates for common queries (e.g., for "tests", use `kind: directory, pattern: test`). If the query matches keywords like "run tests" or "test folders", select a template instead of full AI generation.

- [ ] **Test Filters Integration**: Ensure `codefetch-filters.store.ts` defaults don't exclude test files (e.g., add `.test.ts` to `COMMON_EXTENSIONS` if missing). Test applying `filterFileTree` before search to confirm test folders aren't filtered out unintentionally.

- [ ] **Manual Testing and Edge Cases**: Test the full flow with queries like "find test folders", "run jest tests", and direct syntax. Verify matches appear for known test directories in scraped data. Check for panics with multi-line AI outputs.

- [ ] **Documentation Update**: Add notes to the codebase (e.g., comments in `$url.tsx`) explaining query best practices, like using direct ast-grep syntax for reliability.

- [ ] **Performance and Cleanup**: Ensure changes don't increase latency (e.g., cap AI calls). Clean up any temporary logs or debug code added during fixes.

## Success Criteria
- Query "i want to run tests" returns matches for test folders without panics.
- Invalid rules are handled gracefully with fallbacks.
- Overall search accuracy improves for natural language inputs related to directories.

## Potential Risks
- AI generation might still produce edge-case invalids—monitor with logging.
- Changes to prompts could affect other query types; regression test broadly. 