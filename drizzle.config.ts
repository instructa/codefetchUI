// drizzle.config.ts — dynamic multi‑DB support
import { defineConfig } from 'drizzle-kit';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Local‑dev helper: find the SQLite file Wrangler creates.
 * Optionally allow an override per binding via LOCAL_D1_PATH_* env vars.
 */
function getLocalD1DB(binding: string) {
  const manual = process.env[`LOCAL_D1_PATH_${binding}`];
  if (manual) return manual;

  try {
    const basePath = path.resolve('.wrangler/d1');
    const dbFile = fs.readdirSync(basePath, { encoding: 'utf-8' }).find((f) => f.includes(binding));
    if (!dbFile) throw new Error(`.sqlite file not found for binding "${binding}" in .wrangler/d1`);
    return path.resolve(basePath, dbFile);
  } catch (err) {
    console.error(`Error finding local D1 DB for "${binding}":`, err);
    return undefined;
  }
}

/**
 * Decide which DB we are targeting for this run.
 *   main        – application tables (profile, domain models, …)
 *   auth        – auth/users/sessions/etc.
 *   analytics   – high‑write log tables
 */
const target = (process.env.D1_TARGET || 'main').toLowerCase() as 'main' | 'auth' | 'analytics';

/** Map target → schema entry point */
const schemaMap: Record<typeof target, string> = {
  main: './src/db/schema/app.schema.ts',
  auth: './src/db/schema/auth.schema.ts',
  analytics: './src/db/schema/analytics.schema.ts',
};

/** Map target → Cloudflare binding name */
const bindingNameMap: Record<typeof target, string> = {
  main: 'DATABASE',
  auth: 'AUTH_DB',
  analytics: 'ANALYTICS',
};

/** Migration output folder */
const outDir = `./drizzle/${target}`;

/** Production credentials env‑var names */
const prodDbIdEnv: Record<typeof target, string> = {
  main: 'CLOUDFLARE_DATABASE_ID_MAIN',
  auth: process.env.CLOUDFLARE_DATABASE_AUTH_ID || '',
  analytics: 'CLOUDFLARE_DATABASE_ID_ANALYTICS',
};

export default defineConfig({
  dialect: 'sqlite',
  schema: schemaMap[target],
  out: outDir,
  ...(process.env.NODE_ENV === 'production'
    ? {
        driver: 'd1-http' as const,
        dbCredentials: {
          accountId: process.env.CLOUDFLARE_D1_ACCOUNT_ID,
          databaseId: process.env[prodDbIdEnv[target]],
          token: process.env.CLOUDFLARE_D1_API_TOKEN,
        },
      }
    : {
        dbCredentials: {
          url: getLocalD1DB(bindingNameMap[target]), // use correct binding
        },
      }),
});
