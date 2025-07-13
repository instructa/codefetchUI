# Markdown Conversion Queue ‑ Error & Fix Plan

## 1. Problem Statement
The `/convert` API endpoint correctly **queues** conversion jobs and responds `202 queued`, but the **jobs never complete**. Re-checking the same endpoint always returns `queued` instead of the expected markdown content.

## 2. Expected Flow
1. Client POSTs `/convert?repo=<owner/repo>&sha=<commit>`
2. API Worker enqueues a message in `md_jobs` queue
3. Queue Consumer Worker (`md-consumer`) receives the message
4. Consumer calls Durable Object (`ConverterDO`) to perform conversion
5. ConverterDO stores the markdown in R2 ➜ returns R2 key
6. Consumer updates KV (`md-cache`) with **repo@sha → R2 key**
7. Subsequent `/convert` calls hit KV cache and return markdown

## 3. Actual Behaviour
- Step 1 OK – `/convert` returns `202 queued`
- Steps 3–6 **never happen**
  - No logs of `queue` handler execution
  - No records written to R2
  - KV not updated ⇒ every request re-queues

## 4. Observations & Clues
| Source | Finding |
| ------ | ------- |
| Cloudflare logs (`md-consumerdev`) | Error: *"Handler does not export a fetch() function"* – indicates HTTP traffic hitting the consumer |
| `src/cloudflare/consumer.ts` | Exports **only** a `queue()` handler (no `fetch`) – correct for queue consumer |
| `alchemy.run.ts` | `md-consumer` Worker created **without** explicit `url:false` ⇒ deployment tool assigns a default public route |
| Deploy log | `md-consumerdev` created recently; no queue processing entries |

## 5. Root Cause
`md-consumer` is unintentionally exposed via HTTP. Because Cloudflare associates a *route* with the worker, the queue-consumer binding is not activated (Worker runs in HTTP mode instead of Queue mode). Queue messages therefore never reach the `queue()` handler.

## 6. Fix
Add `url: false` to the consumer worker definition in `alchemy.run.ts` to disable any HTTP route and force the Worker to operate **only** as a queue consumer:

```ts
// alchemy.run.ts
export const consumer = await Worker(`md-consumer${BRANCH}`, {
  entrypoint: './src/cloudflare/consumer.ts',
  url: false,           // ← crucial: no HTTP route
  bindings: {
    Converter: ConverterDO,
    KV_CACHE,
    FILES_R2: ARTEFACTS,
  },
  eventSources: [{ queue: CONVERT_Q }],
});
```

After redeploying:
1. Verify `md-consumer` no longer has a route in Cloudflare dashboard
2. Trigger `/convert` again ➜ expect `202 queued`
3. **Within seconds** logs should show consumer processing the message
4. Re-call `/convert` ➜ expect markdown content (placeholder) returned

## 7. Related Source Files
1. `src/cloudflare/api.ts` – queues jobs & serves cache
2. `src/cloudflare/consumer.ts` – queue consumer logic
3. `src/cloudflare/ConverterDO.ts` – conversion implementation
4. `alchemy.run.ts` – infrastructure & bindings
5. `deploy-log.txt` – last deployment output

---
Prepared for hand-over • 2025-07-07 