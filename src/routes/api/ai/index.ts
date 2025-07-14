import { createServerFileRoute } from '@tanstack/react-start/server'
import { buildAuthApp } from '../../../server/auth.cf'

/**
 * POST /api/ai
 *  – Validates Better‑Auth session
 *  – Enforces short‑window rate‑limit (Workers RateLimit API)
 *  – Checks monthly quota via Durable Object
 *  – Proxies the request to Cloudflare AI Gateway
 *  – Decrements quota based on Gateway token usage
 *
 * Mirrors behaviour of the removed Hono implementation.
 */
export const ServerRoute = createServerFileRoute('/api/ai/').methods({
  POST: async ({ request, context }) => {
    const { env } = context

    /* ---------- session check ---------- */
    const authApp = buildAuthApp(env)
    const session = await authApp.auth.api.getSession({ headers: request.headers })
    if (!session?.user) {
      return new Response('Unauthenticated', { status: 401 })
    }

    /* ---------- rate‑limit (RPM/RPS) ---------- */
    const rate = await env.AI_RATELIMIT.limit(`user:${session.user.id}`)
    if (!rate.allowed) {
      return new Response('Too many requests', { status: 429 })
    }

    /* ---------- monthly quota check ---------- */
    const quotaRes = await env.QUOTA_DO.fetch(`https://quota/${session.user.id}`)
    if (quotaRes.status === 402) {
      return new Response('Quota exceeded', { status: 402 })
    }

    /* ---------- proxy to Cloudflare AI Gateway ---------- */
    const gwRes = await fetch(`${env.AI_GATEWAY_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'cf-meta-user': session.user.id,
      },
      body: request.body,
    })

    /* ---------- decrement quota based on token usage ---------- */
    try {
      const usage = (await gwRes.clone().json()).usage?.total_tokens ?? 0
      await env.QUOTA_DO.fetch(`https://quota/${session.user.id}/decrement`, {
        method: 'POST',
        body: JSON.stringify({ tokens: usage }),
      })
    } catch {
      /* streamed / non‑JSON responses – ignore */
    }

    return gwRes           // raw Response keeps headers & streaming body
  },
})