### ✅ Implementation plan — “Stateless‑Free vs Persistent‑Paid” architecture

*Everything is expressed as an ordered task‑list so you can drop it straight into Linear/Jira.  Where helpful, I’ve added suggested owners and acceptance criteria.*

---

#### **Phase 0 — Project set‑up**

| #   | Task                                                                         | Owner     | Done when                                         |
| --- | ---------------------------------------------------------------------------- | --------- | ------------------------------------------------- |
| 0‑1 | Create **feature flag** `stateless_rag_split` (boolean, default false).      | Platform  | Toggle deploys to production without code change. |
| 0‑2 | Produce **sequence diagram** (current vs target) and circulate for sign‑off. | Staff Eng | All reviewers sign.                               |

---

#### **Phase 1 — Authentication & user‑tier routing**

| #   | Task                                                                                               | Owner    | Done when                            |
| --- | -------------------------------------------------------------------------------------------------- | -------- | ------------------------------------ |
| 1‑1 | Extend `@better-auth` JWT payload to include `tier: "FREE" \| "PAID"`.                             | Auth Eng | JWT contains tier and verifies.      |
| 1‑2 | Implement `authenticate(req)` helper returning `UserInfo`.                                         | Backend  | Unit tests: valid/invalid tokens.    |
| 1‑3 | Add switch in main Worker `handleRequest()` calling `runStatelessSearch` vs `runPersistentSearch`. | Backend  | Integration test hits both branches. |

---

#### **Phase 2 — Stateless (FREE) request path**

| #   | Task                                                                                     | Owner    | Done when                                     |
| --- | ---------------------------------------------------------------------------------------- | -------- | --------------------------------------------- |
| 2‑1 | Port existing repo‑scraper to **pure in‑memory mode**: no KV writes.                     | Backend  | Memory footprint < 50 MB for 98th pctl repos. |
| 2‑2 | Write `flattenToText(tree, maxChars)` helper with streaming truncation after 40 k chars. | Backend  | Jest test: returns ≤40 k chars.               |
| 2‑3 | Integrate Llama‑3‑8B in Workers AI call (edge compute) with SSE streaming.               | AI Eng   | P95 latency ≤ 250 ms.                         |
| 2‑4 | Ensure Cloudflare **no‑cache** headers (`Cache‑Control: private, max-age=0`).            | Platform | Header appears in response.                   |

---

#### **Phase 3 — Persistent (PAID) path upgrades**

| #   | Task                                                                           | Owner    | Done when                                   |
| --- | ------------------------------------------------------------------------------ | -------- | ------------------------------------------- |
| 3‑1 | Amend **embed‑worker** queue payload to include `userId`, `plan`.              | Backend  | Message schema versioned & deployed.        |
| 3‑2 | Add metadata columns to Vectorize upserts (`repo`, `user`, `expiresAt`).       | AI Eng   | Upsert API returns 200.                     |
| 3‑3 | Implement **30‑day TTL** roll‑off job (Cron 1×/day) deleting stale embeddings. | Platform | Rows <= expected.                           |
| 3‑4 | Filter AutoRAG searches by `repoId` (and optionally `userId`).                 | AI Eng   | Unit test: cross‑tenant leakage impossible. |

---

#### **Phase 4 — BYO LLM (Gemini / OpenAI) for both tiers**

| #   | Task                                                                      | Owner     | Done when                                        |
| --- | ------------------------------------------------------------------------- | --------- | ------------------------------------------------ |
| 4‑1 | FE modal to collect **external API key**, store in `localStorage`.        | Front‑end | UX reviewed.                                     |
| 4‑2 | Pass `x‑gen-ai‑key` (or `x‑openai‑key`) header; Worker forwards only.     | Backend   | Header appears in outbound fetch; not logged.    |
| 4‑3 | Add server‑side **regex format validation** (no quota check).             | Backend   | Invalid key rejected 400.                        |
| 4‑4 | Fallback logic: if header missing or provider 5xx → revert to Workers AI. | Backend   | Cypress test forces failure & observes fallback. |

---

#### **Phase 5 — Abuse & quota controls**

| #   | Task                                                             | Owner    | Done when                            |
| --- | ---------------------------------------------------------------- | -------- | ------------------------------------ |
| 5‑1 | Rate‑limit: `scrape:${userId}` KV key with 60 s TTL (free only). | Platform | Burst >1/min returns 429.            |
| 5‑2 | Reject repos > *X* MB or > *N* files (env var configurable).     | Backend  | Oversize repo returns 413.           |
| 5‑3 | Prompt length guard (`query.length ≤ 200`).                      | Backend  | Test passes/blocks.                  |
| 5‑4 | Cloudflare WAF rule tagging excessive LLM traffic anomalies.     | SecOps   | WAF log alert after >500 req/min IP. |

---

#### **Phase 6 — Observability & billing**

| #   | Task                                                                             | Owner    | Done when                        |
| --- | -------------------------------------------------------------------------------- | -------- | -------------------------------- |
| 6‑1 | Add custom metrics: `stateless_requests`, `persistent_requests`, `byo_requests`. | Platform | Metrics visible in Grafana.      |
| 6‑2 | Implement **per‑account spend cap** via Workers AI “usage limit” API.            | FinOps   | Hard‑limit enforced at 90 % cap. |
| 6‑3 | Daily BigQuery export: user‑id, tokens‑in/out, compute‑ms.                       | Data Eng | Table populated for 3 days.      |

---

#### **Phase 7 — Testing & QA**

| #   | Task                                               | Owner    | Done when           |
| --- | -------------------------------------------------- | -------- | ------------------- |
| 7‑1 | **Unit tests** for both paths (FREE vs PAID).      | QA       | Coverage ≥ 90 %.    |
| 7‑2 | **Load test** 100 RPS stateless with 10 MB repos.  | QA       | Error rate < 0.5 %. |
| 7‑3 | Pen‑test on header‑forward (BYO keys).             | SecOps   | No secrets leaked.  |
| 7‑4 | Canary deploy under feature flag for 10 % traffic. | Platform | 24 h stable.        |

---

#### **Phase 8 — Roll‑out**

| #   | Task                                                      | Owner     | Done when                |
| --- | --------------------------------------------------------- | --------- | ------------------------ |
| 8‑1 | Flip feature flag to 100 %.                               | Product   | All traffic on new path. |
| 8‑2 | Email release notes to customers (plan change, BYO keys). | Marketing | Email delivered.         |
| 8‑3 | Close retro & write post‑mortem doc.                      | Team lead | Doc linked in wiki.      |

---

### 🔑 Key acceptance criteria (summary)

* **Free requests never hit Vectorize/KV/D1.**
* **Paid requests always scoped to owning repo & user metadata.**
* **P95 total latency:** `< 1.2 s` for stateless; `< 600 ms` for cached persistent.
* **No cross‑tenant data leakage** confirmed by unit & integration tests.
* **Spend caps** enforced at account and global level.

---

> **Next action** Create tickets *0‑1 → 1‑3* today so engineering can start with the routing skeleton, then work phases in order.
