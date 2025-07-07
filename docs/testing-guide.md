# Testing Guide

## API Testing

### Rate Limiter Testing

The API has a rate limiter configured for 10 requests per minute. Here's how to test it:

#### 1. Start the Development Server

```bash
npm run dev
```

#### 2. Test Rate Limiting

Open a new terminal and run this script to make 12 rapid requests:

```bash
# Test rate limiting (should allow 10, block 2)
for i in {1..12}; do
  echo "Request $i:"
  curl -i "http://localhost:3000/api/scrape?url=https://github.com/facebook/react" \
    -H "Origin: http://localhost:3000" \
    2>/dev/null | grep -E "HTTP|X-RateLimit"
  echo ""
done
```

**Expected Results:**
- Requests 1-10: `HTTP/1.1 200 OK` with `X-RateLimit-Remaining` decreasing from 9 to 0
- Requests 11-12: `HTTP/1.1 429 Too Many Requests` with `X-RateLimit-Remaining: 0`

#### 3. Test Streaming Response

Test that the API correctly streams NDJSON data:

```bash
# Watch the streaming output
curl "http://localhost:3000/api/scrape?url=https://github.com/facebook/react" \
  -H "Origin: http://localhost:3000"
```

**Expected Output:**
- Multiple JSON objects separated by newlines
- First object: `{"type":"metadata","data":{...}}`
- Following objects: `{"type":"node","data":{...}}`
- Last object: `{"type":"complete"}`

#### 4. Test Error Cases

```bash
# Test missing URL parameter
curl -i "http://localhost:3000/api/scrape" \
  -H "Origin: http://localhost:3000"
# Expected: 400 Bad Request

# Test forbidden origin
curl -i "http://localhost:3000/api/scrape?url=https://github.com/facebook/react" \
  -H "Origin: http://evil.com"
# Expected: 403 Forbidden
```

### Production Testing on Cloudflare

When deployed to Cloudflare Workers:

1. **Rate Limiting**: Uses KV storage instead of in-memory
   - Rate limits persist across requests
   - Shared across all worker instances

2. **Filesystem Cache**: Automatically disabled
   - The codefetch SDK will run with `noCache: true`

3. **Test Commands** (replace with your worker URL):
   ```bash
   # Test rate limiting on production
   for i in {1..12}; do
     curl -i "https://your-worker.workers.dev/api/scrape?url=https://github.com/facebook/react"
   done
   ```

## Build Testing

### Local Build Test

```bash
# Build for Cloudflare Workers
npm run build

# Check the output
ls -la .output/server/
# Should show index.mjs and index.mjs.map
```

### Deployment Test

```bash
# Deploy to Cloudflare (dev stage)
npm run deploy

# Deploy to production
npm run deploy:prod
```

## Environment Variables

Make sure these are set in your `.env` file:

```bash
# Required for deployment
CLOUDFLARE_API_TOKEN=your-token
CLOUDFLARE_ACCOUNT_ID=your-account-id
ALCHEMY_PASSWORD=your-encryption-password

# Required for the app
BETTER_AUTH_SECRET=your-auth-secret
CODEFETCH_API_KEY=your-codefetch-key
```

## Troubleshooting

### Rate Limiter Not Working

1. **In Development**: Check that the in-memory rate limiter is being used
2. **In Production**: Verify KV namespace is bound to the worker

### Streaming Not Working

1. Check browser DevTools Network tab
2. Look for `Content-Type: application/x-ndjson`
3. Verify response is not buffered

### CORS Issues

1. Ensure `Origin` header matches allowed origins
2. Check `src/lib/api-security.ts` for allowed origins configuration