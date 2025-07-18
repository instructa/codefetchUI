# Codefetch SDK v2.0.0 Upgrade Plan

## Executive Summary

This document outlines the upgrade path from codefetch-sdk v1.5.8-alpha.1 to v2.0.0, which includes significant improvements based on our feedback in documents 102 and 103. The new version addresses all critical issues identified, including TypeScript type exports, streaming support, enhanced error handling, and performance monitoring.

## Current State Analysis

### Current Version
- **Package**: `codefetch-sdk@https://pkg.pr.new/regenrek/codefetch/codefetch-sdk@11`
- **Import Paths Used**:
  - `codefetch-sdk/worker` - Used in src/routes/api/scrape.ts, src/lib/workers/preview.worker.ts, src/routes/chat/$url.tsx
  - `codefetch-sdk/server` - Used in tests/github-token-sdk.test.ts

### Current Usage Patterns
1. **API Route** (`src/routes/api/scrape.ts`):
   - Uses `fetchFromWeb` and `FetchResult` type from `/worker`
   - Streams responses using NDJSON format
   - Implements caching with Cloudflare Cache API

2. **Preview Worker** (`src/lib/workers/preview.worker.ts`):
   - Uses `generateMarkdownFromContent`, `countTokens`, and `FileContent` type
   - Converts internal FileNode to SDK FileContent format

3. **Chat UI** (`src/routes/chat/$url.tsx`):
   - Uses `countTokens` and `FileContent` type for token counting display

4. **Tests** (`tests/github-token-sdk.test.ts`):
   - Uses `fetch as codefetchFetch` from `/server` for Node.js environment

### Known Issues Being Addressed
1. ❌ **Missing Type Exports**: `TokenEncoder` type defined locally in `src/lib/stores/codefetch-filters.store.ts`
2. ❌ **No Streaming Support**: Currently loading entire content into memory
3. ❌ **Basic Error Handling**: Generic error messages without specific error types
4. ❌ **No Performance Metrics**: No visibility into SDK performance
5. ❌ **Limited Worker Support**: Missing Worker-specific optimizations

## v2.0.0 Changes Analysis

### Breaking Changes
- ⚠️ `streamGitHubTarball` → `fetchGitHubTarball` (Not currently used in codebase)

### New Features
1. ✅ **Markdown Streaming** (`createMarkdownStream`):
   - Enables memory-efficient processing of large repositories
   - Perfect for our streaming NDJSON API responses

2. ✅ **TypeScript Type Exports**:
   - Comprehensive Worker-specific types (should include `TokenEncoder`)
   - Better type safety throughout the application

3. ✅ **Performance Metrics**:
   - Track fetch duration, parse time, token counting performance
   - Useful for monitoring and optimization

4. ✅ **Enhanced Error Handling**:
   - Specific error types for different failure scenarios
   - Better debugging information

5. ✅ **Testing Infrastructure**:
   - MSW integration for offline testing
   - Pre-downloaded tokenizer fixtures

## Implementation Plan

### Phase 1: Dependency Update (Day 1)

1. **Update package.json**:
   ```bash
   pnpm remove codefetch-sdk
   pnpm add https://pkg.pr.new/regenrek/codefetch/codefetch-sdk@12
   ```

2. **Verify installation**:
   - Check node_modules structure
   - Verify TypeScript types are available
   - Ensure all import paths resolve correctly

### Phase 2: Type Migration (Day 1)

1. **Remove Local Type Definitions**:
   - Delete local `TokenEncoder` type from `src/lib/stores/codefetch-filters.store.ts`
   - Import `TokenEncoder` from `codefetch-sdk/worker` instead

2. **Update Type Imports**:
   ```typescript
   // src/lib/stores/codefetch-filters.store.ts
   import type { TokenEncoder } from 'codefetch-sdk/worker';
   
   // Remove lines 3-4 (local type definition)
   ```

3. **Verify Other Types**:
   - Check if `FetchResult`, `FileContent` types have been enhanced
   - Update any type assertions or casts that may be affected

### Phase 3: Streaming Implementation (Day 2)

1. **Update API Route** (`src/routes/api/scrape.ts`):
   - Implement `createMarkdownStream` for all repositories (no conditional logic)
   - Replace existing approach entirely with streaming

   ```typescript
   import { fetchFromWeb, createMarkdownStream, type FetchResult } from 'codefetch-sdk/worker';
   
   // Always use streaming for consistent behavior
   const stream = createMarkdownStream(files, options);
   // Convert to NDJSON stream for frontend compatibility
   ```

2. **Update Preview Worker** (`src/lib/workers/preview.worker.ts`):
   - Evaluate if streaming is beneficial for preview generation
   - May not be necessary if preview is already filtered

### Phase 4: Error Handling Enhancement (Day 2)

1. **Implement Specific Error Handling**:
   ```typescript
   // src/routes/api/scrape.ts
   import { FetchError, GitHubError, TokenLimitError } from 'codefetch-sdk/worker';
   
   try {
     const result = await fetchFromWeb(targetUrl, options);
   } catch (error) {
     if (error instanceof GitHubError) {
       // Handle GitHub-specific errors (rate limits, auth)
       return Response.json({ 
         error: 'GitHub API Error', 
         details: error.message,
         rateLimitRemaining: error.rateLimitRemaining 
       }, { status: error.status });
     }
     if (error instanceof TokenLimitError) {
       // Handle token limit errors
       return Response.json({ 
         error: 'Repository too large',
         limit: error.limit,
         used: error.used,
         files: error.files 
       }, { status: 413 });
     }
     // Generic error handling
   }
   ```

2. **Update Frontend Error Display**:
   - Enhance error messages in `use-streaming-scrape.ts`
   - Show specific error details to users

### Phase 5: Basic Logging (Day 3)

1. **Add Console Logging for Debugging**:
   ```typescript
   // src/routes/api/scrape.ts
   const result = await fetchFromWeb(targetUrl, options);
   
   // Simple logging for debugging purposes
   if (result.metrics) {
     console.log(`[Codefetch] Fetched ${targetUrl} in ${result.metrics.totalDuration}ms`);
   }
   ```

2. **Error Logging**:
   - Log specific error types to console for debugging
   - Use Cloudflare's built-in logging for production issues

### Phase 6: Testing Updates (Day 3)

1. **Update Existing Tests**:
   - Verify all tests pass with new SDK version
   - Update any mocked responses to match new formats

2. **Add New Tests**:
   - Test streaming functionality if implemented
   - Test new error types and handling
   - Test performance metrics collection

3. **MSW Integration**:
   - Set up MSW for testing if not already present
   - Use pre-downloaded tokenizer fixtures for offline testing

## Risk Assessment & Mitigation

### High Risk Areas
1. **Type Breaking Changes**:
   - Risk: `TokenEncoder` type structure might have changed
   - Mitigation: Thorough testing of all token counting functionality

2. **API Response Format Changes**:
   - Risk: `FetchResult` structure might be different
   - Mitigation: Add runtime validation, comprehensive logging

3. **Worker Environment Compatibility**:
   - Risk: New features might not work in all Worker environments
   - Mitigation: Test in both development and production Cloudflare Workers

### Medium Risk Areas
1. **Performance Impact**:
   - Risk: New features might add overhead
   - Mitigation: Monitor performance metrics, have rollback plan

2. **Memory Usage**:
   - Risk: Streaming implementation might have different memory characteristics
   - Mitigation: Load test with large repositories

### Low Risk Areas
1. **Test Infrastructure Changes**:
   - Risk: MSW might conflict with existing test setup
   - Mitigation: Isolated test environment setup

## Rollback Plan

1. **Keep Current Version Tag**:
   ```bash
   git tag pre-codefetch-v2-upgrade
   ```

2. **Quick Rollback** (Emergency Only):
   ```bash
   # Only if critical issues arise
   pnpm add https://pkg.pr.new/regenrek/codefetch/codefetch-sdk@11
   git revert HEAD
   ```

3. **Forward-Fix Strategy**:
   - Since we're committing to v2, prefer fixing issues rather than rolling back
   - Keep detailed logs during migration for quick debugging

## Success Criteria

1. **Functional Requirements**:
   - [ ] All existing functionality works without regression
   - [ ] TokenEncoder type imported successfully from SDK
   - [ ] No TypeScript compilation errors
   - [ ] All tests pass

2. **Performance Requirements**:
   - [ ] No increase in response time for small repositories
   - [ ] Reduced memory usage for large repositories with streaming
   - [ ] Basic performance logging works in development

3. **Developer Experience**:
   - [ ] Clearer error messages in development
   - [ ] Better TypeScript intellisense
   - [ ] Improved debugging capabilities

## Timeline

- **Day 1**: Dependency update, type migration (4 hours)
- **Day 2**: Streaming implementation, error handling (6 hours)
- **Day 3**: Testing and validation (3 hours)
- **Day 4**: Production deployment (1 hour)

Total estimated effort: 14 hours

## Post-Upgrade Tasks

1. **Documentation Updates**:
   - Update README with new SDK version
   - Document any new environment variables
   - Update API documentation if response format changes

2. **Basic Monitoring**:
   - Use Cloudflare's built-in Workers Analytics (free tier)
   - Check console logs via `wrangler tail` for debugging
   - Monitor error rates in Cloudflare dashboard

3. **Team Communication**:
   - Share upgrade results with team
   - Document any gotchas or surprises
   - Create knowledge base entry for future reference

## Conclusion

The codefetch SDK v2.0.0 upgrade addresses all critical issues identified in our previous feedback. The implementation plan prioritizes safety and gradual rollout while taking advantage of new features. With proper testing and monitoring, this upgrade should significantly improve the developer experience and application performance. 