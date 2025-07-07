# Queue Consumer Fix Implementation

## Manual Steps Required

Since the Cloudflare worker files are not in this repository, you'll need to apply these changes in your Cloudflare workers project:

### 1. Update alchemy.run.ts

Locate your `alchemy.run.ts` file and find the consumer worker definition around line 60. Update it to add `url: false`:

```typescript
// Before (current state):
export const consumer = await Worker(`md-consumer${BRANCH}`, {
  entrypoint: './src/cloudflare/consumer.ts',
  bindings: {
    Converter: ConverterDO,
    KV_CACHE,
    FILES_R2: ARTEFACTS,
  },
  eventSources: [{
    queue: CONVERT_Q,
  }],
});

// After (fixed state):
export const consumer = await Worker(`md-consumer${BRANCH}`, {
  entrypoint: './src/cloudflare/consumer.ts',
  url: false,  // ← ADD THIS LINE - crucial: no HTTP route
  bindings: {
    Converter: ConverterDO,
    KV_CACHE,
    FILES_R2: ARTEFACTS,
  },
  eventSources: [{
    queue: CONVERT_Q,
  }],
});
```

### 2. Deploy the Changes

Run the deployment command (assuming you're using the dev branch):
```bash
BRANCH_PREFIX=dev node --loader ts-node/esm infra/alchemy.run.ts
```

Or if you have a deployment script:
```bash
pnpm run cf:deploy
```

### 3. Verify the Fix

1. **Check Cloudflare Dashboard**:
   - Go to Workers & Pages
   - Find `md-consumerdev`
   - Verify it no longer shows an HTTP route/URL

2. **Monitor Queue Processing**:
   - Go to Workers & Pages → Queues
   - Check the queue backlog for `convert-mddev`
   - If there are old messages, consider purging them

3. **Test with New Request**:
   ```bash
   curl -X POST "https://md-apidev.office-35d.workers.dev/convert?repo=regenrek/codefetch&sha=main"
   ```

4. **Check Consumer Logs**:
   ```bash
   wrangler tail md-consumerdev
   ```

5. **Verify Completion**:
   After a few seconds, the same request should return the markdown content:
   ```bash
   curl -X POST "https://md-apidev.office-35d.workers.dev/convert?repo=regenrek/codefetch&sha=main"
   ```

## Expected Results

- Consumer worker should process queued messages
- KV cache should be updated with the R2 key
- Subsequent requests should return the markdown content instead of "queued"
- No more "Handler does not export a fetch() function" errors

## Troubleshooting

If the queue still doesn't process:
1. Check if the queue is paused in Cloudflare dashboard
2. Verify the queue binding names match (md_jobs in API, CONVERT_Q in infrastructure)
3. Check for any deployment errors in the logs