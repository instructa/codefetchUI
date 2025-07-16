D1Database
The D1Database component lets you add Cloudflare D1 Databases to your app.

Minimal Example
Create a basic D1 database with default settings.

import { D1Database } from "alchemy/cloudflare";

const db = await D1Database("my-db", {
  name: "my-db",
});

With Migrations
Create a database with SQL migrations.

import { D1Database } from "alchemy/cloudflare";

const db = await D1Database("users-db", {
  name: "users-db",
  migrationsDir: "./migrations",
  migrationsTable: "schema_migrations", // Custom table name for tracking migrations
});

Custom Migration Table
By default, D1Database uses a table named d1_migrations to track migration history. You can customize this table name using the migrationsTable property, which is useful for compatibility with tools like Drizzle:

import { D1Database } from "alchemy/cloudflare";

// Use custom migration table (compatible with Drizzle)
const db = await D1Database("my-db", {
  name: "my-db",
  migrationsDir: "./migrations",
  migrationsTable: "drizzle_migrations",
});

If you don’t specify migrationsTable, it defaults to d1_migrations:

import { D1Database } from "alchemy/cloudflare";

// Uses default migration table 'd1_migrations'
const db = await D1Database("my-db", {
  name: "my-db",
  migrationsDir: "./migrations",
});

With Location Hint
Create a database with a specific location hint for optimal performance.

import { D1Database } from "alchemy/cloudflare";

const db = await D1Database("eu-db", {
  name: "eu-db",
  primaryLocationHint: "weur",
  readReplication: {
    mode: "auto",
  },
});

Cloning Databases
Create a database by cloning data from an existing database. There are three ways to specify the source database:

Clone by Database ID
import { D1Database } from "alchemy/cloudflare";

const clonedDb = await D1Database("clone-db", {
  name: "clone-db",
  clone: { id: "existing-db-uuid" },
});

Clone by Database Name
import { D1Database } from "alchemy/cloudflare";

const clonedDb = await D1Database("clone-db", {
  name: "clone-db",
  clone: { name: "source-db-name" },
});

Clone from an Existing D1Database
import { D1Database } from "alchemy/cloudflare";

// First create or get the source database
const sourceDb = await D1Database("source-db", {
  name: "source-db",
});

// Then create a new database as a clone of the source
const clonedDb = await D1Database("clone-db", {
  name: "clone-db",
  clone: sourceDb,
});

Bind to a Worker
import { Worker, D1Database } from "alchemy/cloudflare";

const db = await D1Database("my-db", {
  name: "my-db",
});

await Worker("my-worker", {
  name: "my-worker",
  script: "console.log('Hello, world!')",
  bindings: {
    DB: db,
  },
});