# Codefetch SDK Improvements for Better Integration Support

## Overview

This document outlines the necessary improvements to the `codefetch-sdk` to enhance its integration with applications, particularly those using TypeScript and Cloudflare Workers. These recommendations are based on real-world integration challenges encountered while implementing the SDK in a production application.

## 1. TypeScript Type Definitions

### Current Issues
- Missing or incomplete TypeScript type definitions
- `FetchResult` type is not exported or doesn't match actual return value
- Ambiguity about return types (string vs object)

### Proposed Changes

```typescript
// Export clear interfaces for all return types
export interface FileContent {
  path: string;
  content: string;
  size: number;
  encoding?: string;
}

export interface FetchMetadata {
  source: string;
  timestamp: number;
  totalFiles?: number;
  totalSize?: number;
  gitRepo?: string;
  branch?: string;
  commit?: string;
}

export interface FetchResult {
  files: FileContent[];
  metadata: FetchMetadata;
  markdown?: string;  // If markdown is also returned
}

export interface FetchOptions {
  // For websites
  maxPages?: number;
  maxDepth?: number;
  
  // For GitHub repos
  maxFiles?: number;
  maxTokens?: number;
  extensions?: string[];
  excludeDirs?: string[];
  githubToken?: string;
  token?: string;  // Alias for githubToken
  
  // General options
  verbose?: number;
  format?: 'markdown' | 'json' | 'files';  // Output format option
}

// Clear function signatures
export function fetchFromWeb(url: string, options?: FetchOptions): Promise<FetchResult | string>;
```

## 2. Consistent Return Format

### Current Issues
- Sometimes returns a string (markdown), sometimes an object
- No clear way to specify desired output format
- Inconsistent behavior makes error handling difficult

### Proposed Changes

```typescript
// Option 1: Always return a consistent structure
export async function fetchFromWeb(url: string, options?: FetchOptions): Promise<FetchResult> {
  // Always return an object with consistent structure
  return {
    files: [...],
    metadata: {...},
    markdown: "..."  // Include markdown if requested
  };
}

// Option 2: Add format option to control output
export async function fetchFromWeb(url: string, options?: FetchOptions): Promise<FetchResult | string> {
  if (options?.format === 'markdown') {
    return markdownString;  // Return string only when explicitly requested
  }
  return {
    files: [...],
    metadata: {...}
  };
}

// Option 3: Separate functions for different outputs
export async function fetchAsMarkdown(url: string, options?: FetchOptions): Promise<string> { }
export async function fetchAsFiles(url: string, options?: FetchOptions): Promise<FetchResult> { }
```

## 3. Environment-Specific Exports

### Current Issues
- Unclear which import to use for different environments
- `@codefetch/sdk/worker` vs `@codefetch/sdk` confusion

### Proposed Changes

```json
// package.json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "node": "./dist/index.js",
      "browser": "./dist/browser.js",
      "worker": "./dist/worker.js",
      "default": "./dist/index.js"
    },
    "./worker": {
      "types": "./dist/worker.d.ts",
      "default": "./dist/worker.js"
    },
    "./node": {
      "types": "./dist/node.d.ts",
      "default": "./dist/node.js"
    }
  }
}
```

```typescript
// Automatic environment detection
export function fetchFromWeb(url: string, options?: FetchOptions): Promise<FetchResult> {
  const isWorker = typeof globalThis.caches !== 'undefined';
  const isNode = typeof process !== 'undefined' && process.versions?.node;
  
  if (isWorker) {
    return fetchFromWebWorker(url, options);
  } else if (isNode) {
    return fetchFromWebNode(url, options);
  } else {
    return fetchFromWebBrowser(url, options);
  }
}
```

## 4. Better Error Handling

### Current Issues
- Generic error messages
- No error codes or types
- Difficult to handle specific error cases

### Proposed Changes

```typescript
export enum FetchErrorCode {
  INVALID_URL = 'INVALID_URL',
  RATE_LIMITED = 'RATE_LIMITED',
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  REPO_TOO_LARGE = 'REPO_TOO_LARGE',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PARSE_ERROR = 'PARSE_ERROR',
}

export class FetchError extends Error {
  code: FetchErrorCode;
  statusCode?: number;
  details?: any;
  
  constructor(message: string, code: FetchErrorCode, statusCode?: number, details?: any) {
    super(message);
    this.name = 'FetchError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Usage
try {
  const result = await fetchFromWeb(url);
} catch (error) {
  if (error instanceof FetchError) {
    switch (error.code) {
      case FetchErrorCode.REPO_TOO_LARGE:
        // Handle large repo
        break;
      case FetchErrorCode.AUTH_REQUIRED:
        // Handle auth
        break;
    }
  }
}
```

## 5. Streaming Support

### Current Issues
- No native streaming support
- Large repositories load entirely into memory
- No progress feedback

### Proposed Changes

```typescript
export interface StreamOptions extends FetchOptions {
  onProgress?: (progress: ProgressEvent) => void;
  onFile?: (file: FileContent) => void;
  stream?: boolean;
}

export interface ProgressEvent {
  type: 'file' | 'page' | 'metadata';
  current: number;
  total?: number;
  file?: FileContent;
  metadata?: Partial<FetchMetadata>;
}

// Streaming API
export async function* fetchFromWebStream(
  url: string, 
  options?: StreamOptions
): AsyncGenerator<ProgressEvent> {
  // Yield progress events as they occur
  yield { type: 'metadata', current: 0, metadata: {...} };
  
  for (const file of files) {
    yield { type: 'file', current: index, total: totalFiles, file };
  }
}

// Alternative: Return a ReadableStream
export function fetchFromWebReadable(
  url: string, 
  options?: FetchOptions
): ReadableStream<ProgressEvent> {
  return new ReadableStream({
    async start(controller) {
      // Stream implementation
    }
  });
}
```

## 6. Cache Control

### Current Issues
- No built-in cache control
- Applications must implement their own caching

### Proposed Changes

```typescript
export interface CacheOptions {
  cache?: boolean | 'force-cache' | 'no-cache' | 'reload';
  cacheKey?: string;
  cacheTTL?: number;  // Time to live in seconds
  cacheStorage?: 'memory' | 'disk' | 'custom';
  customCache?: CacheInterface;
}

export interface CacheInterface {
  get(key: string): Promise<FetchResult | null>;
  set(key: string, value: FetchResult, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

// Extended options
export interface FetchOptions extends CacheOptions {
  // ... existing options
}
```

## 7. Documentation Improvements

### Required Documentation

1. **Environment-specific guides**
   - Node.js integration guide
   - Cloudflare Workers guide
   - Browser usage guide

2. **Migration guide**
   - From v1.x to v2.x
   - Breaking changes
   - Deprecation notices

3. **Examples repository**
   - TypeScript examples
   - JavaScript examples
   - Framework integrations (Next.js, Remix, etc.)

4. **API reference**
   - Complete type definitions
   - All options documented
   - Return value examples

5. **Error handling guide**
   - Common errors and solutions
   - Rate limiting strategies
   - Authentication setup

## 8. Testing Utilities

### Proposed Additions

```typescript
// Export testing utilities
export const mockFetchFromWeb = (response: FetchResult | string) => {
  return jest.fn().mockResolvedValue(response);
};

export const createMockFetchResult = (options?: Partial<FetchResult>): FetchResult => {
  return {
    files: [],
    metadata: {
      source: 'mock',
      timestamp: Date.now(),
      ...options?.metadata
    },
    ...options
  };
};

// Test helpers
export const testUrls = {
  smallRepo: 'https://github.com/vercel/ms',
  largeRepo: 'https://github.com/facebook/react',
  website: 'https://example.com',
  invalidUrl: 'not-a-url'
};
```

## 9. Performance Optimizations

### Proposed Improvements

1. **Parallel file fetching**
   ```typescript
   export interface PerformanceOptions {
     concurrency?: number;  // Max parallel requests
     chunkSize?: number;    // Files per chunk
     timeout?: number;      // Request timeout
   }
   ```

2. **Memory management**
   ```typescript
   export interface MemoryOptions {
     maxMemory?: number;    // Max memory usage in bytes
     gcInterval?: number;   // Garbage collection interval
   }
   ```

3. **Compression support**
   ```typescript
   export interface CompressionOptions {
     compress?: boolean;
     compressionLevel?: number;
   }
   ```

## 10. Backwards Compatibility

### Requirements

1. **Deprecation warnings**
   ```typescript
   // Old function with deprecation warning
   export function oldFetchFunction(url: string): Promise<any> {
     console.warn('oldFetchFunction is deprecated. Use fetchFromWeb instead.');
     return fetchFromWeb(url);
   }
   ```

2. **Version detection**
   ```typescript
   export const SDK_VERSION = '2.0.0';
   export const MINIMUM_COMPATIBLE_VERSION = '1.5.0';
   ```

3. **Feature flags**
   ```typescript
   export interface FeatureFlags {
     useNewParser?: boolean;
     enableStreaming?: boolean;
     strictTypes?: boolean;
   }
   ```

## Implementation Priority

1. **High Priority**
   - TypeScript type definitions
   - Consistent return format
   - Basic error handling

2. **Medium Priority**
   - Streaming support
   - Environment-specific exports
   - Documentation

3. **Low Priority**
   - Cache control
   - Testing utilities
   - Performance optimizations

## Conclusion

These improvements would significantly enhance the developer experience when integrating codefetch-sdk into production applications. The focus should be on type safety, consistency, and clear documentation to reduce integration friction and support common use cases out of the box. 