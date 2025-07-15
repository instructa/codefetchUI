import type { Config } from "drizzle-kit";

export default {
  out: "./drizzle",
  schema: "./src/db/schema/index.ts",
  dialect: "sqlite",
  driver: "d1",             // new in Drizzle Kit ≥0.31
  dbCredentials: {
    url: "file:local.sqlite"    // ignored by D1 but required by CLI
  },
  verbose: true,
  strict: true,
} satisfies Config;
