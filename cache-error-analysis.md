# Codefetch SDK Cache Error Analysis

## Problem Summary
The codefetch SDK experiences ENOENT (file not found) errors when cached content paths exist in the cache metadata but the actual content files have been deleted from the filesystem.

## Root Cause
The cache implementation stores paths to content directories/files in its metadata, but these paths can become invalid if:
1. The temporary directory is cleaned up by the OS
2. Manual deletion of cache content
3. System crashes or interruptions during cache operations

## Critical Code Locations

### 1. Website Content Reading (sdk-web-fetch.ts)
**Location**: Lines 103-104
```typescript
const websiteContentPath = join(contentPath, "website-content.md");
const markdown = await readFile(websiteContentPath, "utf8");
```
**Issue**: No error handling for missing file

### 2. Website Content Reading (web-fetch.ts)
**Location**: Lines 121-124
```typescript
const websiteContentPath = join(contentPath, "website-content.md");
const markdown = await import("node:fs").then((fs) =>
  fs.promises.readFile(websiteContentPath, "utf8")
);
```
**Issue**: No error handling for missing file

### 3. Git Repository Directory Change (sdk-web-fetch.ts)
**Location**: Line 250
```typescript
process.chdir(contentPath);
```
**Issue**: No validation that directory exists before changing to it

### 4. Git Repository Directory Change (web-fetch.ts)
**Location**: Line 170
```typescript
process.chdir(contentPath);
```
**Issue**: No validation that directory exists before changing to it

## Cache Implementation Details

### Cache.get() Method (cache.ts)
- Returns `null` if cache entry doesn't exist or is invalid
- Returns `{ metadata, content }` where content is a path string
- Has try-catch for metadata reading but doesn't validate content existence

### Cache Storage Structure
- **Websites**: Content stored in `{cacheDir}/websites/{key}-{hash}/content/`
- **Git Repos**: Path to cloned repo stored in `{cacheDir}/repos/{key}-{hash}/repo-path.txt`

## Recommended Fix Locations

### Primary Fix: Add Content Validation in cache.get()
**File**: `/Users/timkernegger/projects/codefetch/packages/sdk/src/web/cache.ts`
**Method**: `get()` (lines 87-117)

Add validation before returning the cache entry:
```typescript
// After line 105 (for git repos)
const repoPath = await readFile(join(dir, "repo-path.txt"), "utf8");
// Validate the repo path exists
try {
  await stat(repoPath);
} catch {
  await this.delete(parsedUrl);
  return null;
}

// After line 111 (for websites)
const contentPath = join(dir, "content");
// Validate the content directory exists
try {
  await stat(contentPath);
} catch {
  await this.delete(parsedUrl);
  return null;
}
```

### Secondary Fixes: Add Error Handling at Usage Points

1. **sdk-web-fetch.ts** (lines 103-104):
```typescript
try {
  const websiteContentPath = join(contentPath, "website-content.md");
  const markdown = await readFile(websiteContentPath, "utf8");
} catch (error) {
  // Invalidate cache and re-fetch
  await cache.delete(parsedUrl);
  contentPath = null;
  // Re-fetch logic...
}
```

2. **web-fetch.ts** (lines 121-124):
```typescript
try {
  const websiteContentPath = join(contentPath, "website-content.md");
  const markdown = await import("node:fs").then((fs) =>
    fs.promises.readFile(websiteContentPath, "utf8")
  );
} catch (error) {
  // Invalidate cache and re-fetch
  await cache.delete(parsedUrl);
  contentPath = null;
  // Re-fetch logic...
}
```

3. **Both files** - Before `process.chdir()`:
```typescript
// Validate directory exists before changing to it
try {
  await stat(contentPath);
  process.chdir(contentPath);
} catch {
  // Invalidate cache and re-fetch
  await cache.delete(parsedUrl);
  contentPath = null;
  // Re-fetch logic...
}
```

## Best Solution: Fix in cache.get()
The most robust solution is to add content validation in the `cache.get()` method itself. This ensures:
1. Single point of validation
2. Automatic cache cleanup on corrupted entries
3. No need to modify multiple usage points
4. Consistent behavior across all cache consumers

## Implementation Priority
1. **High Priority**: Fix `cache.get()` to validate content existence
2. **Medium Priority**: Add try-catch blocks around file read operations
3. **Low Priority**: Add directory existence checks before `process.chdir()`