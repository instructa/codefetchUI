# Task: Update codefetch-sdk for Cloudflare Workers Compatibility

## Problem Statement

The `codefetch-sdk` package currently fails in Cloudflare Workers environments with the error:
```
Error in scrape API: Error: [unenv] fs.mkdir is not implemented yet!
```

This occurs because:
1. The SDK attempts to use Node.js `fs` module operations even when `noCache: true` is set
2. Cloudflare Workers don't support Node.js file system operations
3. The browser build doesn't export the main `fetch` function

## Required Changes

### 1. Environment Detection

Add environment detection to determine if running in a Worker/Edge environment:

```javascript
// utils/environment.js
export function isWorkerEnvironment() {
  return (
    typeof globalThis.process === 'undefined' && 
    typeof globalThis.require === 'undefined' &&
    typeof globalThis.fs === 'undefined'
  );
}

export function hasFileSystemAccess() {
  try {
    // Try to access fs module
    if (typeof require !== 'undefined') {
      require('fs');
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
```

### 2. Conditional File System Operations

Modify all functions that use `fs` to check environment first:

```javascript
// Current problematic code pattern
import fs from 'fs';

async function ensureCacheDir(cacheDir) {
  await fs.promises.mkdir(cacheDir, { recursive: true });
}

// Should become:
async function ensureCacheDir(cacheDir) {
  if (!hasFileSystemAccess()) {
    // Skip in Worker environment
    return;
  }
  
  const fs = await import('fs');
  await fs.promises.mkdir(cacheDir, { recursive: true });
}
```

### 3. Respect noCache Option

The `fetch` function should completely bypass cache operations when `noCache: true`:

```javascript
export async function fetch(options) {
  const { noCache = false, source, githubToken, ...otherOptions } = options;
  
  // Skip all cache operations if noCache is true OR in Worker environment
  if (noCache || isWorkerEnvironment()) {
    return fetchDirectly(options);
  }
  
  // Existing implementation with caching
  return fetchWithCache(options);
}

async function fetchDirectly(options) {
  // Direct implementation without any fs operations
  // Use GitHub API, web scraping, etc. directly
  const { source, githubToken } = options;
  
  if (isGitHubUrl(source)) {
    return fetchGitHubDirect(source, githubToken);
  }
  
  // Handle other sources...
}
```

### 4. Create Worker-Compatible Build

Add a new build target for Workers in the build configuration:

#### package.json exports:
```json
{
  "exports": {
    ".": {
      "browser": {
        "types": "./dist-browser/browser.d.mts",
        "default": "./dist-browser/browser.mjs"
      },
      "worker": {
        "types": "./dist-worker/worker.d.mts", 
        "default": "./dist-worker/worker.mjs"
      },
      "import": {
        "types": "./dist/index.d.mts",
        "default": "./dist/index.mjs"
      }
    },
    "./worker": {
      "types": "./dist-worker/worker.d.mts",
      "default": "./dist-worker/worker.mjs"
    }
  }
}
```

#### Build script updates:
```javascript
// build-worker.js
import esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  format: 'esm',
  platform: 'neutral', // Not 'node' or 'browser'
  conditions: ['worker'], // Custom condition
  define: {
    'process.env.NODE_ENV': '"production"',
    '__WORKER_BUILD__': 'true'
  },
  external: ['fs', 'path', 'crypto', 'child_process'], // Exclude Node modules
  outfile: 'dist-worker/worker.mjs',
});
```

### 5. Update Browser Build Exports

The browser build should export the `fetch` function:

```javascript
// Current browser exports (missing fetch)
export { 
  FetchResultImpl, 
  SUPPORTED_MODELS, 
  VALID_ENCODERS, 
  VALID_LIMITERS, 
  VALID_PROMPTS, 
  codegenPrompt, 
  countTokens, 
  detectLanguage, 
  fixPrompt, 
  generateMarkdownFromContent, 
  improvePrompt, 
  prompts, 
  testgenPrompt 
};

// Should include:
export { 
  fetch, // Add this
  FetchResultImpl, 
  // ... rest of exports
};
```

### 6. Implement Fallback Cache Strategies

For Worker environments, implement alternative caching strategies:

```javascript
class WorkerCache {
  constructor() {
    this.cache = caches.default; // Use Cloudflare Cache API
  }
  
  async get(key) {
    const response = await this.cache.match(key);
    if (response) {
      return await response.json();
    }
    return null;
  }
  
  async set(key, value, ttl = 3600) {
    const response = new Response(JSON.stringify(value), {
      headers: {
        'Cache-Control': `public, max-age=${ttl}`,
        'Content-Type': 'application/json',
      }
    });
    await this.cache.put(key, response);
  }
}

// Use appropriate cache based on environment
function getCache() {
  if (isWorkerEnvironment()) {
    return new WorkerCache();
  }
  return new FileSystemCache(); // Existing implementation
}
```

### 7. Testing Strategy

Add tests for Worker compatibility:

```javascript
// test/worker-compat.test.js
import { describe, it, expect, beforeAll } from 'vitest';

describe('Worker Compatibility', () => {
  beforeAll(() => {
    // Mock Worker environment
    global.process = undefined;
    global.require = undefined;
  });
  
  it('should work without fs when noCache is true', async () => {
    const result = await fetch({
      source: 'https://github.com/example/repo',
      noCache: true
    });
    
    expect(result).toBeDefined();
    expect(result.root).toBeDefined();
  });
  
  it('should detect Worker environment correctly', () => {
    expect(isWorkerEnvironment()).toBe(true);
  });
});
```

## Implementation Priority

1. **High Priority**
   - Environment detection
   - Conditional fs imports
   - Respect noCache option

2. **Medium Priority**
   - Worker-specific build
   - Browser build exports

3. **Low Priority**
   - Worker cache implementation
   - Comprehensive testing

## Breaking Changes

None expected. All changes should be backward compatible:
- Existing Node.js users continue to work as before
- `noCache: true` becomes properly functional
- New Worker build is opt-in via import path

## Migration Guide

For Cloudflare Workers users:

```javascript
// Option 1: Use noCache
import { fetch } from 'codefetch-sdk';

const result = await fetch({
  source: 'https://github.com/user/repo',
  noCache: true, // Forces Worker-compatible mode
});

// Option 2: Use Worker-specific import (after implementation)
import { fetch } from 'codefetch-sdk/worker';

const result = await fetch({
  source: 'https://github.com/user/repo',
  // noCache is implicit in worker build
});
```

## Success Criteria

1. No fs errors in Cloudflare Workers when `noCache: true`
2. All existing functionality preserved for Node.js environments
3. Browser build includes `fetch` export
4. Tests pass in both Node.js and Worker environments
5. Documentation updated with Worker usage examples 