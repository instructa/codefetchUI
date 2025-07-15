import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import * as authSchema from "./auth_d1.schema";
import type { D1Database } from "@cloudflare/workers-types";

/* ------------------------------------------------------------------ */
/* Cloudflare D1                                                      */
/* ------------------------------------------------------------------ */

export type HasDB = { AUTH_DB: D1Database };

/**
 * Always return a D1‑backed Drizzle client.
 * In unit tests you can supply a Miniflare‑provided D1 instance.
 */
export function createDB(env: HasDB) {
  return drizzleD1(env.AUTH_DB, { schema: authSchema });
}