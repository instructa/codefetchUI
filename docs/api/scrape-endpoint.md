# Scrape API Endpoint Documentation

## Overview

The `/api/scrape` endpoint provides intelligent web scraping functionality optimized for code repositories and documentation sites.

## Endpoint

```
GET /api/scrape
```

## Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `url` | string | Yes | - | The URL to scrape |
| `stream` | boolean | No | `false` | Enable streaming mode (GitHub only) |

## Response Format

The endpoint returns an NDJSON (Newline Delimited JSON) stream with the following chunk types:

### 1. Metadata Chunk (First)
```json
{
  "type": "metadata",
  "data": {
    "url": "https://github.com/owner/repo",
    "scrapedAt": "2024-01-13T10:00:00Z",
    "title": "Repository Name",
    "description": "Repository description",
    "totalFiles": 150,
    "totalSize": 1048576,
    "totalTokens": 50000
  }
}
```

### 2. Node Chunks (Multiple)
```json
{
  "type": "node",
  "data": {
    "name": "src",
    "path": "src",
    "type": "directory",
    "parentPath": "",
    "hasChildren": true
  }
}
```

For file nodes:
```json
{
  "type": "node",
  "data": {
    "name": "index.ts",
    "path": "src/index.ts",
    "type": "file",
    "parentPath": "src",
    "hasChildren": false,
    "content": "// File content here",
    "language": "typescript",
    "size": 1024,
    "tokens": 256
  }
}
```

### 3. Markdown Chunk (Streaming Mode Only)
```json
{
  "type": "markdown",
  "data": "## File: src/index.ts\n\n```typescript\n..."
}
```

### 4. Complete Signal (Last)
```json
{
  "type": "complete"
}
```

## Headers

### Response Headers

| Header | Description |
|--------|-------------|
| `Content-Type` | `application/x-ndjson` |
| `X-RateLimit-Limit` | Request limit per window (10) |
| `X-RateLimit-Remaining` | Remaining requests |
| `X-RateLimit-Reset` | Unix timestamp for limit reset |

### Required Request Headers

| Header | Description |
|--------|-------------|
| `Origin` or `Referer` | Must match allowed origins |

## Examples

### Basic Usage (Non-Streaming)

```javascript
const response = await fetch('/api/scrape?url=https://github.com/facebook/react');
const reader = response.body.getReader();
const decoder = new TextDecoder();

let chunks = [];
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const text = decoder.decode(value);
  const lines = text.trim().split('\n');
  
  for (const line of lines) {
    if (line) {
      chunks.push(JSON.parse(line));
    }
  }
}

// Process chunks
const metadata = chunks.find(c => c.type === 'metadata');
const nodes = chunks.filter(c => c.type === 'node');
```

### Streaming Mode (GitHub Only)

```javascript
const response = await fetch('/api/scrape?url=https://github.com/facebook/react&stream=true');
// Process streaming markdown chunks progressively
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "URL parameter is required"
}
```

```json
{
  "error": "Invalid URL format"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too many requests. Please try again later."
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to scrape URL"
}
```

## Rate Limiting

- **Limit**: 10 requests per minute per IP
- **Strategy**: Sliding window
- **Storage**: KV namespace in production, in-memory in development

## Caching

- **Enabled**: In Cloudflare Workers environment
- **Key**: URL-based
- **Duration**: Determined by Cloudflare cache rules

## Security

1. **Origin Validation**: Requests must come from allowed origins
2. **Rate Limiting**: Prevents abuse
3. **URL Validation**: Ensures valid URL format

## Best Practices

1. **Use Non-Streaming by Default**
   - Provides complete file structure
   - Better for file exploration and filtering
   - Required for AI code search

2. **Enable Streaming for Large Repos**
   - Reduces memory usage
   - Provides progressive feedback
   - Suitable for markdown-only output

3. **Handle Errors Gracefully**
   - Check response status
   - Parse error messages
   - Implement retry logic

4. **Process Chunks Efficiently**
   - Use streaming parsers
   - Build tree structure progressively
   - Handle incomplete streams

## Integration Example

```typescript
import { useStreamingScrape } from '~/hooks/use-streaming-scrape';

function MyComponent() {
  const { startScraping, isLoading, error, progress } = useStreamingScrape(
    url,
    {
      onComplete: (data, metadata) => {
        console.log('Scraping complete', { data, metadata });
      },
      onError: (error) => {
        console.error('Scraping failed', error);
      }
    }
  );

  // Use the hook
  useEffect(() => {
    startScraping();
  }, [url]);
}
```

## Performance Considerations

1. **File Size Limits**: Large files may be truncated
2. **Token Limits**: Default 100,000 tokens per request
3. **Memory Usage**: Non-streaming mode loads entire tree
4. **Network Latency**: Streaming provides faster initial response

## Future Enhancements

1. Support for GitLab and Bitbucket
2. Configurable file filters
3. Incremental updates
4. WebSocket support for real-time updates
5. Custom authentication providers 