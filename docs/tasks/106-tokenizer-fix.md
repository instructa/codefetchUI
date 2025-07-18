# Codefetch SDK Tokenizer Performance Fix

## Executive Summary

The codefetch-sdk has a critical performance issue where tokenizer vocabulary files (p50k_base.json, cl100k_base.json, o200k_base.json) are repeatedly fetched on each tokenizer operation. These files are 1.5-3MB in size, causing significant performance degradation and bandwidth waste. This document outlines the issue and proposes SDK-level fixes.

## Problem Analysis

### Current Behavior
1. **Repeated Fetches**: Every call to `countTokens()` or `generateMarkdownFromContent()` triggers a new fetch of the tokenizer vocabulary file
2. **Large File Sizes**:
   - `p50k_base.json`: ~1.5MB (Davinci models)
   - `cl100k_base.json`: ~1.5MB (GPT-4, GPT-3.5)
   - `o200k_base.json`: ~3MB (GPT-4o models)
3. **No Caching**: The SDK doesn't cache tokenizer instances or vocabulary data
4. **Worker Isolation**: In web workers, each worker instance fetches its own copy

### Performance Impact
- **Network Overhead**: 1.5-3MB downloaded per tokenizer operation
- **Latency**: Each operation waits for network fetch to complete
- **Memory Waste**: Multiple copies of the same data in memory
- **User Experience**: Slow token counting and markdown generation

### Evidence from Application Logs
```
📊 p50k_base.json    200    fetch
📊 p50k_base.json    200    fetch    use-streaming-scrape.ts:45
📊 p50k_base.json    200    fetch    preview.worker.ts:124
📊 p50k_base.json    200    fetch    preview.worker.ts:124
```

## Root Cause

The SDK initializes a new tokenizer instance for each operation without any caching mechanism. This is particularly problematic in:

1. **Web Workers**: No shared memory between workers
2. **Serverless Environments**: Cold starts trigger fresh downloads
3. **Browser Applications**: Multiple components using tokenizers independently

## Proposed SDK Solutions

### 1. Tokenizer Instance Caching

Implement a singleton pattern for tokenizer instances at the module level:

```typescript
// sdk/src/tokenizer/cache.ts
import type { Tokenizer, TokenEncoder } from './types';

// Module-level cache for tokenizer instances
const tokenizerCache = new Map<TokenEncoder, Tokenizer>();
const initializationPromises = new Map<TokenEncoder, Promise<Tokenizer>>();

export async function getTokenizer(encoder: TokenEncoder): Promise<Tokenizer> {
  // Return cached instance if available
  if (tokenizerCache.has(encoder)) {
    return tokenizerCache.get(encoder)!;
  }

  // If initialization is in progress, wait for it
  if (initializationPromises.has(encoder)) {
    return initializationPromises.get(encoder)!;
  }

  // Start new initialization
  const initPromise = initializeTokenizer(encoder)
    .then(tokenizer => {
      tokenizerCache.set(encoder, tokenizer);
      initializationPromises.delete(encoder);
      return tokenizer;
    })
    .catch(error => {
      initializationPromises.delete(encoder);
      throw error;
    });

  initializationPromises.set(encoder, initPromise);
  return initPromise;
}
```

### 2. Vocabulary Data Caching

Cache the fetched vocabulary files to avoid repeated network requests:

```typescript
// sdk/src/tokenizer/vocabulary-cache.ts
const vocabularyCache = new Map<string, ArrayBuffer>();

async function fetchVocabulary(url: string): Promise<ArrayBuffer> {
  // Check memory cache first
  if (vocabularyCache.has(url)) {
    return vocabularyCache.get(url)!;
  }

  // Try browser cache if available
  if (typeof caches !== 'undefined') {
    try {
      const cache = await caches.open('codefetch-tokenizers');
      const cachedResponse = await cache.match(url);
      if (cachedResponse) {
        const data = await cachedResponse.arrayBuffer();
        vocabularyCache.set(url, data);
        return data;
      }
    } catch (e) {
      // Cache API not available or failed, continue
    }
  }

  // Fetch from network
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch vocabulary: ${response.statusText}`);
  }

  const data = await response.arrayBuffer();
  
  // Store in memory cache
  vocabularyCache.set(url, data);

  // Store in browser cache if available
  if (typeof caches !== 'undefined') {
    try {
      const cache = await caches.open('codefetch-tokenizers');
      await cache.put(url, new Response(data.slice(0))); // Clone the data
    } catch (e) {
      // Cache storage failed, not critical
    }
  }

  return data;
}
```

### 3. Pre-initialization API

Allow applications to pre-warm tokenizers during initialization:

```typescript
// sdk/src/tokenizer/preload.ts
export async function preloadTokenizer(encoder: TokenEncoder): Promise<void> {
  await getTokenizer(encoder);
}

export async function preloadAllTokenizers(): Promise<void> {
  const encoders: TokenEncoder[] = ['simple', 'p50k', 'cl100k', 'o200k'];
  await Promise.all(encoders.map(preloadTokenizer));
}

// Usage in application initialization
import { preloadTokenizer } from 'codefetch-sdk';

// Pre-load commonly used tokenizers
await preloadTokenizer('cl100k');
```

### 4. Worker-Specific Optimizations

For web workers, implement message passing for shared tokenizer data:

```typescript
// sdk/src/tokenizer/worker-bridge.ts
export class WorkerTokenizerBridge {
  private worker: Worker;
  private requests = new Map<string, (result: any) => void>();

  constructor() {
    // Create a shared worker for tokenizer operations
    this.worker = new Worker(new URL('./tokenizer.worker.js', import.meta.url));
    this.worker.onmessage = this.handleMessage.bind(this);
  }

  async countTokens(text: string, encoder: TokenEncoder): Promise<number> {
    const id = crypto.randomUUID();
    
    return new Promise((resolve) => {
      this.requests.set(id, resolve);
      this.worker.postMessage({ id, type: 'count', text, encoder });
    });
  }

  private handleMessage(event: MessageEvent) {
    const { id, result } = event.data;
    const resolver = this.requests.get(id);
    if (resolver) {
      resolver(result);
      this.requests.delete(id);
    }
  }
}
```

### 5. Lazy Loading Strategy

Only load tokenizers when actually needed:

```typescript
// sdk/src/tokenizer/lazy-loader.ts
export class LazyTokenizer {
  private tokenizer?: Tokenizer;
  private readonly encoder: TokenEncoder;

  constructor(encoder: TokenEncoder) {
    this.encoder = encoder;
  }

  async count(text: string): Promise<number> {
    if (!this.tokenizer) {
      this.tokenizer = await getTokenizer(this.encoder);
    }
    return this.tokenizer.encode(text).length;
  }
}
```

### 6. Bundle Common Vocabularies

For the 'simple' tokenizer, bundle the vocabulary directly:

```typescript
// sdk/src/tokenizer/bundled.ts
// For simple tokenizer, include vocabulary inline to avoid fetch
const SIMPLE_VOCAB = {
  // Bundled vocabulary data
};

export function getSimpleTokenizer(): Tokenizer {
  // Return immediately without fetch
  return new SimpleTokenizer(SIMPLE_VOCAB);
}
```

## Implementation Priority

### Phase 1: Critical Fixes (High Priority)
1. **Tokenizer Instance Caching** - Prevent re-initialization
2. **Vocabulary Data Caching** - Avoid repeated fetches
3. **Memory-based caching** - Works in all environments

### Phase 2: Optimizations (Medium Priority)
1. **Pre-initialization API** - Let apps control loading
2. **Browser Cache API** - Persistent caching
3. **Worker optimizations** - Shared tokenizer instances

### Phase 3: Enhancements (Low Priority)
1. **Bundle simple tokenizer** - Zero-fetch for basic use
2. **Lazy loading** - Load only when needed
3. **Compressed vocabularies** - Reduce file sizes

## Testing Strategy

### Unit Tests
```typescript
describe('Tokenizer Caching', () => {
  it('should reuse tokenizer instance', async () => {
    const tokenizer1 = await getTokenizer('cl100k');
    const tokenizer2 = await getTokenizer('cl100k');
    expect(tokenizer1).toBe(tokenizer2);
  });

  it('should cache vocabulary data', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    
    await getTokenizer('p50k');
    await getTokenizer('p50k');
    
    // Should only fetch once
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
```

### Performance Tests
```typescript
describe('Performance', () => {
  it('should be fast on repeated calls', async () => {
    // First call - includes fetch
    const start1 = performance.now();
    await countTokens('test', 'cl100k');
    const time1 = performance.now() - start1;

    // Second call - should use cache
    const start2 = performance.now();
    await countTokens('test', 'cl100k');
    const time2 = performance.now() - start2;

    // Cached call should be 10x faster
    expect(time2).toBeLessThan(time1 / 10);
  });
});
```

## Migration Guide

### For SDK Users

```typescript
// No breaking changes - caching is automatic
import { countTokens } from 'codefetch-sdk';

// Works as before, but faster
const count = await countTokens(text, 'cl100k');

// New optional optimization
import { preloadTokenizer } from 'codefetch-sdk';

// Pre-load during app initialization
await preloadTokenizer('cl100k');
```

### For SDK Maintainers

1. Implement caching at module level
2. Ensure thread safety in workers
3. Add performance benchmarks
4. Document caching behavior

## Success Metrics

1. **Performance Improvements**:
   - 95% reduction in vocabulary file fetches
   - 10x faster token counting after first use
   - 50% reduction in memory usage with shared instances

2. **Developer Experience**:
   - Zero configuration required
   - Automatic optimization
   - Optional pre-loading for advanced use

3. **Compatibility**:
   - Works in all environments (Node, Browser, Workers)
   - No breaking changes
   - Graceful degradation if caching fails

## Application-Level Workarounds

Until the SDK is fixed, applications can implement these workarounds:

### 1. Fetch Interception (Current Implementation)
```typescript
// Wrap global fetch in workers to cache responses
const originalFetch = self.fetch;
self.fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : input.url;
  if (url?.includes('_base.json')) {
    // Cache tokenizer files
  }
  return originalFetch(input, init);
};
```

### 2. Switch to Simple Tokenizer
```typescript
// Use 'simple' tokenizer by default - no large vocabulary files
const defaultFilters = {
  tokenEncoder: 'simple' as TokenEncoder,
  // ...
};
```

### 3. Worker Pooling
```typescript
// Reuse workers to maintain tokenizer cache
const workerPool = new WorkerPool({
  maxWorkers: 2,
  workerFactory: () => new Worker('./preview.worker.js'),
});
```

## Conclusion

The tokenizer performance issue significantly impacts user experience and resource usage. The proposed SDK-level fixes would benefit all users by implementing proper caching and optimization strategies. Until these fixes are implemented, applications should use the provided workarounds to mitigate the performance impact.

## References

- [TikToken Performance Analysis](https://medium.com/thedeephub/tiktoken-vs-other-tokenizers-why-tiktoken-is-faster-7c3ec2d1c100)
- [OpenAI TikToken Repository](https://github.com/openai/tiktoken)
- [Cloudflare Cache API Documentation](https://developers.cloudflare.com/workers/runtime-apis/cache/)
- Related issues: docs/tasks/103-codefetch-sdk-better-support2.md, docs/tasks/104-codefetch-sdk-cache-fix.md 