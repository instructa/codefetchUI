# Plan: Fix Invalid Cache Key in Scrape API

## 1. Problem Description

When using the `/api/scrape` endpoint, the application throws a `TypeError: Invalid URL. Cache API keys must be fully-qualified, valid URLs.` This error originates from the Cloudflare Cache API, which requires that any key used for caching must be a complete and valid URL (e.g., `https://example.com/cache/some-key`).

The current implementation likely uses a simple string like `repo:owner/name` as the cache key, which is not a valid URL, causing the operation to fail.

## 2. Root Cause Analysis

The root cause is the format of the cache key provided to the Cloudflare Cache API (`caches.default.put()` and `caches.default.match()`). The key needs to be a `Request` object with a fully-qualified URL, not just a string.

Additionally, the way the cache API was being accessed (through `context.caches`) was incorrect. In Cloudflare Workers, the Cache API is available globally as `caches.default`.

## 3. Implemented Solution

To fix this issue, we made the following changes:

1. **Correct Cache API Access**: Changed from `(context as any)?.caches?.default` to the globally available `caches.default`
2. **Create Request Objects**: Instead of passing string URLs to `cache.match()` and `cache.put()`, we now create proper `Request` objects
3. **Environment Detection**: Added a check for `typeof caches !== 'undefined'` to ensure we're in a Cloudflare Workers environment

### Implementation Details:

The fix involved modifying `src/routes/api/scrape.ts` to:
- Access the Cache API correctly through the global `caches` object
- Create `Request` objects with fully-qualified URLs for cache operations
- Use `https://codefetch.ui/cache/${encodeURIComponent(targetUrl)}` as the cache key format

## 4. Code Changes

```typescript
// src/routes/api/scrape.ts

// ... existing code ...

    try {
      // In Cloudflare Workers, we can use the Cache API
      // Check if we're in a Cloudflare Workers environment
      const isWorkerEnvironment = typeof caches !== 'undefined';
      
      if (isWorkerEnvironment) {
        const cache = caches.default;
        const cacheUrl = `https://codefetch.ui/cache/${encodeURIComponent(targetUrl)}`;
        const cacheRequest = new Request(cacheUrl);

        const cachedResponse = await cache.match(cacheRequest);
        if (cachedResponse) {
          // Return cached response with rate limit headers...
        }
      }

// ... existing code ...

      // Cache the response if we're in a Cloudflare Workers environment
      if (isWorkerEnvironment) {
        const cache = caches.default;
        const cacheUrl = `https://codefetch.ui/cache/${encodeURIComponent(targetUrl)}`;
        const cacheRequest = new Request(cacheUrl);
        // We need to clone the response to be able to cache it
        await cache.put(cacheRequest, response.clone());
      }

// ... existing code ...
```

## 5. Testing

To test the API after the fix:

```bash
# Test with curl (include Origin header to pass security checks)
curl -X GET "http://localhost:3000/api/scrape?url=https://github.com/vercel/ms" \
  -H "Accept: application/x-ndjson" \
  -H "Origin: http://localhost:3000" \
  -H "Referer: http://localhost:3000"
```

Expected behavior:
- The API should return a streaming NDJSON response
- Each line should be a JSON object with `type` field
- The stream should end with `{"type":"complete"}`
- No cache-related errors should occur

## 6. Additional Notes

During implementation, we discovered that the `fetchFromWeb` function from codefetch-sdk returns markdown content directly as a string, not an object with `files` and `metadata` as initially expected. The implementation was updated to handle this case properly by:

1. Detecting when the result is a string
2. Creating a simple file structure with the markdown content
3. Streaming the response in the expected format

This ensures backward compatibility with the frontend while properly handling the codefetch-sdk response format. 