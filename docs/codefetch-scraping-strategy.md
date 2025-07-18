# CodeFetch Scraping Strategy

## Overview

CodeFetch UI implements a dual-mode scraping strategy optimized for code repository analysis and file exploration.

## Default Mode: Non-Streaming (Recommended)

The non-streaming mode with `format: 'json'` is the **default and recommended** approach for most use cases.

### Why Non-Streaming is Default

1. **Complete File Tree Structure**
   - Essential for file browsing and navigation
   - Required for the `FileTree` and `SimpleFileTree` components
   - Enables filtering, selection, and search functionality

2. **User Experience**
   - Immediate access to all files and directories
   - Supports multi-file selection and filtering
   - Shows accurate file counts and statistics

3. **AI Code Search**
   - Needs access to all files for comprehensive searching
   - Enables cross-file analysis and pattern matching
   - Supports context-aware code understanding

4. **Cloudflare Compatibility**
   - Works well within Workers memory limits for typical repositories
   - Leverages caching to reduce repeated API calls
   - Integrates with queue system for background processing

### API Usage

```bash
# Default (non-streaming)
GET /api/scrape?url=https://github.com/owner/repo

# Response: NDJSON stream with structured data
# Line 1: {"type":"metadata","data":{...}}
# Line 2-N: {"type":"node","data":{...}}
# Last line: {"type":"complete"}
```

## Streaming Mode (Optional)

Streaming mode is available for specific scenarios where progressive loading is beneficial.

### When to Use Streaming

1. **Very Large Repositories**
   - Repositories with thousands of files
   - When memory constraints are a concern
   - For repositories exceeding 100MB of code

2. **Markdown-Only Output**
   - When file tree navigation isn't needed
   - For simple documentation generation
   - Quick preview scenarios

3. **Real-Time Progress**
   - When users need immediate feedback
   - For slow network connections
   - Progressive rendering requirements

### API Usage

```bash
# Streaming mode (GitHub only)
GET /api/scrape?url=https://github.com/owner/repo&stream=true

# Response: NDJSON stream with markdown chunks
# Line 1: {"type":"metadata","data":{...}}
# Line 2-N: {"type":"markdown","data":"..."}
# Last line: {"type":"complete"}
```

## Implementation Details

### Data Flow

1. **Request Processing**
   ```
   Client Request → Rate Limiting → Security Checks → Cache Check → Fetch Data
   ```

2. **Non-Streaming Flow**
   ```
   fetchFromWeb(format: 'json') → Build Tree → Store Data → Stream Response → Cache
   ```

3. **Streaming Flow**
   ```
   streamGitHubFiles() → createMarkdownStream() → Progressive Response
   ```

### Caching Strategy

- **Cache Key**: URL-based
- **Cache Duration**: Determined by Cloudflare settings
- **Cache Invalidation**: Manual or time-based

### Rate Limiting

- **Limit**: 10 requests per minute per IP
- **Headers**: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
- **Storage**: KV namespace in production, in-memory in development

### Error Handling

1. **Invalid URLs**: 400 Bad Request
2. **Rate Limit Exceeded**: 429 Too Many Requests
3. **Fetch Failures**: 500 Internal Server Error
4. **Unexpected Formats**: Fallback to single-file structure

## Cloudflare Deployment Considerations

### Memory Management

- Non-streaming mode works well for repos up to ~50MB
- Streaming mode recommended for larger repositories
- Use Workers KV for caching frequently accessed repos

### Queue Integration

- Embed queue processes valid tree structures
- Background processing for vector embeddings
- Non-blocking operation for main request

### Performance Optimization

1. **Enable Caching**: Reduces API calls and improves response time
2. **Use CDN**: Cloudflare's global network for faster delivery
3. **Compress Responses**: Enable gzip/brotli compression
4. **Optimize File Filtering**: Process filters on the client side

## Best Practices

1. **Default to Non-Streaming**
   - Better user experience for file exploration
   - Complete data for AI-powered features
   - Consistent with app's core functionality

2. **Offer Streaming as Option**
   - Add UI toggle for large repository warnings
   - Educate users about trade-offs
   - Monitor usage patterns

3. **Monitor Performance**
   - Track response times
   - Monitor memory usage
   - Analyze cache hit rates

4. **Handle Edge Cases**
   - Gracefully degrade for unsupported URLs
   - Provide clear error messages
   - Implement retry logic for transient failures

## Future Enhancements

1. **Additional Providers**
   - GitLab support
   - Bitbucket integration
   - Generic Git repository support

2. **Advanced Features**
   - Incremental updates
   - Webhook integration
   - Real-time synchronization

3. **Performance Improvements**
   - Parallel file fetching
   - Smarter caching strategies
   - Compression optimization 