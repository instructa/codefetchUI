
# Code Search AI and Fallback Mechanism Analysis

## 1. Problem Overview

When using the AI-enhanced "Code Search" feature, queries that result in an invalid `ast-grep` rule from the AI cause the system to trigger a fallback search. This fallback search is often too broad, returning a large number of irrelevant files, which appears to the user as if it's returning "all files".

The issue is triggered by an `Invalid metavariable syntax` error, which indicates a flaw in the AI-to-ast-grep-rule conversion process.

## 2. Root Cause Analysis

The problem stems from a combination of factors:

### a. Brittle AI-to-Rule Generation Logic

The core issue lies in `src/utils/ast-grep-ai.ts`.

1.  **Invalid Metavariable Generation**: The AI model (Gemini) is likely generating `ast-grep` patterns with lowercase or mixed-case metavariables (e.g., `$myVar` or `$variable`).
2.  **Overly Strict Validation**: The `validateAstGrepRule` function contains a strict regex (`/\$[^A-Z_$]/`) that only permits uppercase metavariables (e.g., `$MY_VAR`). This validation is not explicitly communicated as a constraint in the prompt to the AI, leading to frequent validation failures.
3.  **Fragile YAML Parsing**: The `transformPromptToAstGrepRule` function uses a primitive, line-by-line string-matching method to parse the YAML output from the AI. This parser is not robust and fails to correctly interpret complex or nested `ast-grep` rules (e.g., rules with `any`, `all`, `not` clauses), even though the AI prompt provides examples of such rules. This severely limits the expressiveness and accuracy of the AI-generated searches. A proper YAML parsing library like `js-yaml` is already a project dependency and should be used instead.

### b. Ineffective Fallback Mechanism

When the AI-generated rule fails validation, `createFallbackRule` is invoked.

1.  **Simplistic Keyword Extraction**: The fallback function extracts the first long word from the user's query and uses it as a literal search pattern.
2.  **Confusing User Experience**: This approach is too simplistic. A query like "find all controller logic" results in a search for the term `"controller"`, which can appear in comments, variable names, and documentation across many files, leading to a high volume of low-quality results. This is confusing and gives the impression that the search is broken.

### c. Redundant Code

The component at `src/routes/chat/$url.tsx` contains a redundant call to `validateAstGrepRule`. The `transformPromptToAstGrepRule` function already performs this validation and returns a fallback rule if necessary. This second validation adds complexity without providing any benefit.

## 3. Proposed Solution and Implementation Plan

To address these issues, a multi-pronged approach is required to make the AI search more robust, accurate, and reliable.

### a. Improve AI Prompt and Rule Parsing

1.  **Update the System Prompt**: Modify the system prompt in `transformPromptToAstGrepRule` to include an explicit instruction for the AI:
    > **"CRITICAL: All metavariables MUST be uppercase, using only letters and underscores (e.g., `$MY_VARIABLE`, not `$myVariable`)."**
2.  **Replace the YAML Parser**: Remove the manual string-based parser and replace it with the `js-yaml` library, which is already available in the project. This will enable the correct parsing of all valid `ast-grep` YAML structures, including complex nested rules.

    ```typescript
    // Before (in src/utils/ast-grep-ai.ts)
    // const lines = yamlContent.split('\n'); ...

    // After (in src/utils/ast-grep-ai.ts)
    import * as yaml from 'js-yaml';

    // ...
    const yamlContent = yamlMatch[1];
    const parsedYaml = yaml.load(yamlContent) as { rule?: AstGrepRule; pattern?: string; languages?: string[]; suggestedPaths?: string[] };

    let rule: AstGrepRule;
    if (parsedYaml.rule) {
      rule = { rule: parsedYaml.rule, languages: parsedYaml.languages };
    } else if (parsedYaml.pattern) {
      rule = { pattern: parsedYaml.pattern, languages: parsedYaml.languages };
    } else {
      throw new Error('Invalid YAML: must contain either a `rule` or `pattern` field.');
    }

    const suggestedPaths = parsedYaml.suggestedPaths;
    // ...
    ```

### b. Enhance the Fallback Strategy

Instead of returning broad, confusing results, the fallback mechanism should provide clear feedback.

1.  **Update `createFallbackRule`**: Modify the function to return a more specific pattern that is less likely to produce noise. A good alternative is to search for the keyword as a whole word.
2.  **Better yet, remove `createFallbackRule`**: A better UX would be to not have a fallback rule at all. If the AI cannot produce a valid rule, an error should be surfaced to the user in the UI.

### c. Refactor Component Logic

1.  **Remove Redundant Validation**: Delete the unnecessary `validateAstGrepRule` call within `handleCodeSearch` in `src/routes/chat/$url.tsx`. The responsibility for validation should reside solely within `transformPromptToAstGrepRule`.
2.  **Improve Error Handling**: Modify `handleCodeSearch` to catch errors from `transformPromptToAstGrepRule` and display a user-friendly error message in the UI, suggesting they rephrase their query. This is a much better experience than showing confusing results.

By implementing these changes, the AI code search will become significantly more reliable, the code will be more robust, and the user experience will be far less confusing when queries cannot be precisely understood.

## 4. Updated Solution Based on Modern Best Practices (2024/2025)

After researching how modern AI coding assistants handle similar challenges, here's an updated approach:

### a. Progressive Fallback Strategy (Following Cline/Cursor Patterns)

Instead of the simplistic `createFallbackRule`, implement a multi-tier fallback system:

1. **Primary**: AI-generated ast-grep rule
2. **Secondary**: Path/filename-based search when AI fails
   ```typescript
   // When AI rule generation fails, try path-based search
   function createPathBasedFallback(query: string): AstGrepRule {
     const keywords = extractKeywords(query); // e.g., "controllers" from "find all controllers"
     return {
       rule: {
         any: [
           { path: { regex: `.*/${keywords[0]}.*` } },
           { path: { regex: `.*/.*${keywords[0]}.*\\.\\w+$` } }
         ]
       },
       languages: ['javascript', 'typescript']
     };
   }
   ```
3. **Tertiary**: Use existing templates from `RULE_TEMPLATES` if keywords match
4. **Final**: Show clear error with suggestions rather than confusing results

### b. Relaxed Metavariable Validation

Based on ast-grep's actual flexibility and modern tool practices:

1. **Accept Both Cases**: Modify validation to accept both uppercase and lowercase metavariables
   ```typescript
   // Update the validation regex in validateAstGrepRule
   const metavarPattern = /\$[A-Za-z_][A-Za-z0-9_]*/g;
   
   // Transform lowercase to uppercase for ast-grep compatibility
   if (rule.pattern && rule.pattern.match(/\$[a-z]/)) {
     rule.pattern = rule.pattern.replace(/\$([a-z_][a-zA-Z0-9_]*)/g, (match, name) => 
       '$' + name.toUpperCase()
     );
   }
   ```

2. **Add Warning UI**: When lowercase metavariables are detected, show a non-blocking warning
3. **Update AI Prompt**: Still encourage uppercase but mention lowercase will be auto-converted

### c. Phased Rule Complexity Support

Implement a gradual approach to rule complexity:

**Phase 1 (Immediate)**: 
- Support simple patterns and template-based rules
- Limit AI to generating rules that match existing `RULE_TEMPLATES` structure
- Add whitelist of supported rule types: `pattern`, `kind`, `path.regex`

**Phase 2 (Next iteration)**:
- Add support for common combinations: `any`, `all` with simple rules
- Implement proper validation for each supported rule type
- Create "complexity score" to guide AI away from overly complex rules

**Phase 3 (Future)**:
- Full ast-grep rule support with comprehensive validation
- Advanced features like `has`, `inside`, `follows`, `precedes`

### d. Implementation Details

1. **Replace YAML Parser** (as originally suggested):
   ```typescript
   import * as yaml from 'js-yaml';
   
   // Add rule complexity validation
   function validateRuleComplexity(rule: any): boolean {
     const supportedRuleTypes = ['pattern', 'kind', 'path', 'any', 'all'];
     return isRuleTypeSupported(rule, supportedRuleTypes);
   }
   ```

2. **Improve Error Messages**:
   ```typescript
   // In handleCodeSearch, provide actionable feedback
   catch (error) {
     if (error.message.includes('metavariable')) {
       setCodeSearchError('Search pattern was too complex. Try simpler queries like "find test files" or "show async functions".');
     } else {
       setCodeSearchError(`Search failed: ${error.message}. Try rephrasing your query.`);
     }
   }
   ```

3. **Add Search History**: Track successful patterns to improve future AI responses

## 5. Summary of Key Changes

1. **Fallback Strategy**: Multi-tier system (AI → Path-based → Templates → Error) instead of broad keyword search
2. **Metavariable Handling**: Accept both cases, auto-transform to uppercase, warn but don't fail
3. **Rule Complexity**: Start simple, validate against whitelist, expand gradually
4. **User Experience**: Clear errors with suggestions, not confusing "all files" results
5. **Technical Debt**: Remove redundant validation, use proper YAML parser, centralize rule generation logic

This approach balances reliability with functionality, ensuring users get useful results even when the AI struggles, while maintaining a path toward more advanced features.

## 6. Implementation Task List

### Phase 1: Critical Fixes (Immediate Priority)

#### A. Fix YAML Parsing
- [ ] Import `js-yaml` in `src/utils/ast-grep-ai.ts`
- [ ] Replace manual YAML parsing in `transformPromptToAstGrepRule` with `yaml.load()`
- [ ] Add error handling for malformed YAML responses
- [ ] Test with various AI-generated YAML structures

#### B. Relax Metavariable Validation
- [ ] Update regex in `validateAstGrepRule` to accept `/\$[A-Za-z_][A-Za-z0-9_]*/`
- [ ] Add function to transform lowercase metavariables to uppercase
- [ ] Apply transformation before validation
- [ ] Add unit tests for both uppercase and lowercase metavariables

#### C. Remove Redundant Code
- [ ] Remove `validateAstGrepRule` call from `handleCodeSearch` in `src/routes/chat/$url.tsx`
- [ ] Ensure all validation happens within `transformPromptToAstGrepRule`
- [ ] Update error handling to catch validation errors from the single source

### Phase 2: Implement Progressive Fallback System

#### A. Create Path-Based Fallback
- [ ] Create `createPathBasedFallback` function in `src/utils/ast-grep-ai.ts`
- [ ] Implement `extractKeywords` helper function
- [ ] Add logic to generate path-based rules when AI fails
- [ ] Test with common queries like "find controllers", "test files", etc.

#### B. Integrate Template Matching
- [ ] Create `findBestTemplate` function that matches query keywords to `RULE_TEMPLATES`
- [ ] Add template matching as tertiary fallback
- [ ] Ensure templates are tried before showing errors
- [ ] Add logging to track which fallback level was used

#### C. Update Error Handling
- [ ] Replace `createFallbackRule` with new progressive fallback system
- [ ] Add specific error messages for different failure types
- [ ] Include query suggestions in error messages
- [ ] Create `setCodeSearchError` state handler if not exists

### Phase 3: Improve AI Prompt and Validation

#### A. Update AI System Prompt
- [ ] Add explicit metavariable format instructions (uppercase preferred, lowercase accepted)
- [ ] Add examples of path-based rules
- [ ] Limit initial examples to simple patterns
- [ ] Test prompt changes with various queries

#### B. Add Rule Complexity Validation
- [ ] Create `validateRuleComplexity` function
- [ ] Define `supportedRuleTypes` whitelist: `['pattern', 'kind', 'path', 'any', 'all']`
- [ ] Implement `isRuleTypeSupported` helper
- [ ] Add complexity validation after YAML parsing

### Phase 4: UI/UX Improvements

#### A. Add Warning System
- [ ] Create warning state in `src/routes/chat/$url.tsx`
- [ ] Display non-blocking warning when lowercase metavariables are detected
- [ ] Add warning for complex rules that were simplified
- [ ] Style warnings to be informative but not intrusive

#### B. Improve Loading States
- [ ] Add specific loading message during AI rule generation
- [ ] Show which fallback is being attempted
- [ ] Add progress indicator for multi-step search process

#### C. Add Search History (Optional)
- [ ] Create local storage for successful search patterns
- [ ] Add UI to show recent searches
- [ ] Use history to improve AI context in future searches

### Phase 5: Testing and Documentation

#### A. Unit Tests
- [ ] Test YAML parser with various rule structures
- [ ] Test metavariable validation (uppercase, lowercase, mixed)
- [ ] Test each fallback level independently
- [ ] Test error message generation

#### B. Integration Tests
- [ ] Test full search flow with AI success
- [ ] Test full search flow with AI failure → path fallback
- [ ] Test full search flow with all fallbacks → error
- [ ] Test with real repository data

#### C. Update Documentation
- [ ] Document new fallback behavior in code comments
- [ ] Update any user-facing documentation about search
- [ ] Add examples of supported query types
- [ ] Document the metavariable flexibility

### Implementation Order and Dependencies

1. **Start with Phase 1** - These are critical fixes that improve stability
2. **Then Phase 2** - Implement fallback system (depends on Phase 1.A for YAML parsing)
3. **Then Phase 3** - Improve AI generation (can be done in parallel with Phase 2)
4. **Then Phase 4** - UI improvements (depends on Phase 2 for warning triggers)
5. **Finally Phase 5** - Testing throughout, documentation at the end

### Estimated Effort

- Phase 1: 2-3 hours (mostly straightforward fixes)
- Phase 2: 4-6 hours (new logic, needs careful testing)
- Phase 3: 2-3 hours (prompt engineering, validation logic)
- Phase 4: 3-4 hours (UI work, state management)
- Phase 5: 3-4 hours (comprehensive testing)

**Total estimate: 14-20 hours of development time**

### Success Metrics

- [ ] No more "Invalid metavariable syntax" errors for reasonable queries
- [ ] Fallback searches return relevant results, not "all files"
- [ ] Clear error messages that help users reformulate queries
- [ ] AI successfully generates valid rules for 80%+ of queries
- [ ] User satisfaction with search results improves 