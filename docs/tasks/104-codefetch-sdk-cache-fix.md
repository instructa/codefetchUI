# Codefetch SDK Cache Fix Plan

## Executive Summary

The codefetch-sdk currently has critical cache implementation issues when running in Cloudflare Workers environments. The SDK attempts to use invalid URLs for cache keys (like `https://codefetch.ui/cache/...`) which causes the Cloudflare Cache API to throw errors. This document outlines a comprehensive plan to fix these issues and make the SDK universally usable across all environments.

## Problem Analysis

### Current Issues

1. **Invalid Cache URLs**: The SDK generates cache keys using invalid domains like `codefetch.ui` which is not a valid TLD
2. **Environment-Specific Failures**: Cache implementation works in Node.js but fails in Cloudflare Workers
3. **No Cache Control Options**: Users cannot disable or configure caching behavior
4. **Hardcoded Cache Paths**: Cache URLs are hardcoded without considering the runtime environment
5. **Missing Error Handling**: Cache failures crash the entire operation instead of gracefully degrading

### Root Cause

From the error analysis in `cache-error-analysis.md`, the SDK's cache implementation:
- Stores file paths in cache metadata
- These paths become invalid when temporary directories are cleaned
- No validation that cached content still exists before returning it
- Uses invalid URL formats for Cloudflare Cache API

## Proposed Solutions

### 1. Environment-Aware Cache Factory

Create a cache factory that returns the appropriate cache implementation based on the runtime environment:

```typescript
// src/cache/factory.ts
export interface CacheInterface {
  get(key: string): Promise<CachedResult | null>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

export function createCache(options?: CacheOptions): CacheInterface {
  if (typeof caches !== 'undefined' && caches.default) {
    // Cloudflare Workers environment
    return new CloudflareCache(options);
  } else if (typeof process !== 'undefined' && process.versions?.node) {
    // Node.js environment
    return new FileSystemCache(options);
  } else {
    // Browser or unknown environment - use in-memory cache
    return new MemoryCache(options);
  }
}
```

### 2. Fix Cloudflare Cache Implementation

```typescript
// src/cache/cloudflare-cache.ts
export class CloudflareCache implements CacheInterface {
  private options: CacheOptions;
  
  constructor(options: CacheOptions = {}) {
    this.options = {
      namespace: 'codefetch',
      ttl: 3600, // 1 hour default
      ...options
    };
  }
  
  private getCacheUrl(key: string): string {
    // Use the request's origin or a configured base URL
    const baseUrl = this.options.baseUrl || 'https://cache.codefetch.workers.dev';
    return `${baseUrl}/cache/${this.options.namespace}/${encodeURIComponent(key)}`;
  }
  
  async get(key: string): Promise<CachedResult | null> {
    try {
      const cache = caches.default;
      const cacheUrl = this.getCacheUrl(key);
      const request = new Request(cacheUrl);
      
      const response = await cache.match(request);
      if (!response) return null;
      
      // Validate response is still fresh
      const age = response.headers.get('age');
      if (age && parseInt(age) > this.options.ttl!) {
        await this.delete(key);
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.warn('Cache get failed:', error);
      return null;
    }
  }
  
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const cache = caches.default;
      const cacheUrl = this.getCacheUrl(key);
      const request = new Request(cacheUrl);
      
      const response = new Response(JSON.stringify(value), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': `max-age=${ttl || this.options.ttl}`,
        },
      });
      
      await cache.put(request, response);
    } catch (error) {
      console.warn('Cache set failed:', error);
      // Fail silently - caching is not critical
    }
  }
}
```

### 3. Add Cache Control Options

```typescript
// src/types/options.ts
export interface FetchOptions {
  // Existing options...
  
  // Cache control
  cache?: boolean | CacheStrategy;
  cacheKey?: string;
  cacheTTL?: number;
  cacheNamespace?: string;
  
  // For Cloudflare Workers
  cacheBaseUrl?: string;
  
  // Bypass cache completely
  noCache?: boolean;
}

export type CacheStrategy = 
  | 'auto'        // Use cache if available (default)
  | 'force'       // Always use cache, fail if not available
  | 'bypass'      // Skip cache completely
  | 'refresh'     // Invalidate cache and fetch fresh
  | 'validate';   // Check if cache is still valid
```

### 4. Implement Graceful Degradation

```typescript
// src/web/fetch.ts
export async function fetchFromWeb(url: string, options: FetchOptions = {}) {
  // Initialize cache based on options
  let cache: CacheInterface | null = null;
  
  if (!options.noCache && options.cache !== 'bypass') {
    try {
      cache = createCache({
        namespace: options.cacheNamespace,
        baseUrl: options.cacheBaseUrl,
        ttl: options.cacheTTL,
      });
    } catch (error) {
      console.warn('Failed to initialize cache:', error);
      // Continue without cache
    }
  }
  
  // Generate cache key
  const cacheKey = options.cacheKey || generateCacheKey(url, options);
  
  // Try to get from cache first
  if (cache && options.cache !== 'refresh') {
    try {
      const cached = await cache.get(cacheKey);
      if (cached) {
        // Validate cached content still exists
        if (await validateCachedContent(cached)) {
          return cached;
        } else {
          // Invalid cache entry, delete it
          await cache.delete(cacheKey);
        }
      }
    } catch (error) {
      console.warn('Cache retrieval failed:', error);
      // Continue to fetch fresh data
    }
  }
  
  // Fetch fresh data
  const result = await performFetch(url, options);
  
  // Store in cache if successful
  if (cache && result && options.cache !== 'bypass') {
    try {
      await cache.set(cacheKey, result, options.cacheTTL);
    } catch (error) {
      console.warn('Cache storage failed:', error);
      // Non-critical, continue
    }
  }
  
  return result;
}
```

### 5. Fix Content Validation

```typescript
// src/cache/validation.ts
export async function validateCachedContent(cached: CachedResult): Promise<boolean> {
  if (!cached || !cached.content) return false;
  
  // For file system paths
  if (cached.type === 'filesystem' && cached.content.path) {
    try {
      await fs.access(cached.content.path);
      return true;
    } catch {
      return false;
    }
  }
  
  // For in-memory content
  if (cached.type === 'memory' && cached.content.data) {
    return true;
  }
  
  // For serialized content
  if (cached.type === 'serialized' && cached.content) {
    return true;
  }
  
  return false;
}
```

## Implementation Steps

### Phase 1: Core Cache Refactoring (Priority: High)
1. Create cache interface and factory pattern
2. Implement environment-specific cache classes
3. Add proper error handling and validation
4. Update fetchFromWeb to use new cache system

### Phase 2: Cloudflare Workers Support (Priority: High)
1. Implement CloudflareCache with proper URL handling
2. Add configuration for cache base URLs
3. Test in Cloudflare Workers environment
4. Add fallback to memory cache if CF cache fails

### Phase 3: Cache Control Options (Priority: Medium)
1. Add cache control options to FetchOptions
2. Implement cache strategies (auto, force, bypass, refresh)
3. Add TTL and namespace configuration
4. Document all cache options

### Phase 4: Content Validation (Priority: Medium)
1. Implement content validation for cached entries
2. Auto-cleanup invalid cache entries
3. Add cache statistics and debugging
4. Implement cache size limits

### Phase 5: Testing & Documentation (Priority: High)
1. Unit tests for all cache implementations
2. Integration tests for different environments
3. Performance benchmarks
4. Comprehensive documentation

## Breaking Changes

### Minimal Breaking Changes Approach
1. Keep existing API surface intact
2. Add `noCache: true` as immediate workaround
3. Deprecate old cache behavior gradually
4. Provide migration guide

### Recommended Migration Path
```typescript
// Old way (might fail in Workers)
const result = await fetchFromWeb(url);

// Immediate fix (bypass cache)
const result = await fetchFromWeb(url, { noCache: true });

// New way (with proper cache config)
const result = await fetchFromWeb(url, {
  cache: 'auto',
  cacheBaseUrl: 'https://your-domain.com',
  cacheTTL: 3600,
});
```

## Testing Strategy

### Unit Tests
- Test each cache implementation in isolation
- Mock environment globals (caches, fs, etc.)
- Test error scenarios and fallbacks

### Integration Tests
- Test in real Cloudflare Workers environment
- Test in Node.js with file system
- Test cache invalidation and cleanup
- Test concurrent access scenarios

### Performance Tests
- Benchmark cache hit/miss performance
- Memory usage in different environments
- Network overhead in Workers

## Documentation Updates

### API Reference
- Document all new cache options
- Provide environment-specific examples
- Include troubleshooting guide

### Migration Guide
- Step-by-step migration from v1.x
- Common issues and solutions
- Performance optimization tips

### Examples
- Cloudflare Workers example
- Node.js server example
- Browser usage example
- Cache configuration examples

## Timeline

- **Week 1**: Core cache refactoring and interfaces
- **Week 2**: Cloudflare Workers implementation
- **Week 3**: Cache control options and validation
- **Week 4**: Testing and documentation
- **Week 5**: Beta release and feedback
- **Week 6**: Final release

## Success Metrics

1. **Zero cache-related errors** in Cloudflare Workers
2. **Backward compatibility** maintained
3. **Performance improvement** in cache operations
4. **Developer satisfaction** through clear APIs
5. **Comprehensive test coverage** (>90%)

## Conclusion

This plan addresses all critical cache issues in the codefetch-sdk while maintaining backward compatibility and improving the developer experience. The modular approach allows for incremental implementation and testing, ensuring a smooth transition for existing users while enabling new deploy