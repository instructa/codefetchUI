// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

// The D1_TARGET environment variable determines which database schema to generate migrations for
const target = (process.env.D1_TARGET || 'main').toLowerCase() as 'main' | 'auth' | 'analytics';

const schemaMap: Record<typeof target, string> = {
  main: './src/db/schema/app.schema.ts',
  auth: './src/db/schema/auth.schema.ts',
  analytics: './src/db/schema/analytics.schema.ts',
};

export default defineConfig({
  schema: schemaMap[target],
  out: `./drizzle/${target}`,
  dialect: 'sqlite',
  // No dbCredentials needed - Alchemy handles the connection automatically
});
