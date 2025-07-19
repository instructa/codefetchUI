Drizzle D1
Build a full-stack application with Drizzle ORM and Cloudflare D1 Database. This guide shows you how to set up a type-safe database layer with automated migrations and a web interface.

Create your project

Start by creating a new project and installing dependencies.

Terminal window
mkdir drizzle-d1-app
cd drizzle-d1-app

bun
npm
pnpm
yarn
Terminal window
pnpm init
pnpm add alchemy drizzle-orm
pnpm add -D drizzle-kit @types/node

Login to Cloudflare

Authenticate with your Cloudflare account.

bun
npm
pnpm
yarn
Terminal window
pnpm alchemy login

Tip

Make sure you have a Cloudflare account (free tier works)

Set up Drizzle schema

Create your database schema with Drizzle ORM:

src/schema.ts
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: integer('author_id').notNull().references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

Configure Drizzle Kit

Create drizzle.config.ts for migration generation:

drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
});

Generate migrations

Generate SQL migrations from your schema:

bun
npm
pnpm
yarn
Terminal window
pnpm drizzle-kit generate

This creates migration files in the migrations/ directory.

Create your infrastructure

Create alchemy.run.ts with D1 database and Worker:

alchemy.run.ts
import alchemy from "alchemy";
import { D1Database, Worker } from "alchemy/cloudflare";

const app = await alchemy("drizzle-d1-app");

// Create D1 database with migrations
const database = await D1Database("app-db", {
  name: "app-db",
  migrationsDir: "./migrations",
});

// Create API worker
export const worker = await Worker("api-worker", {
  name: "api-worker",
  entrypoint: "./src/worker.ts",
  bindings: {
    DB: database,
  },
});

console.log(`API available at: ${worker.url}`);
await app.finalize();

Create your worker with Drizzle

Create src/worker.ts with basic Drizzle ORM integration:

src/worker.ts
import { drizzle } from 'drizzle-orm/d1';
import { users } from './schema';
import type { worker } from "../alchemy.run.ts"

// infer the types
type Env = typeof worker.Env

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const db = drizzle(env.DB);

    // Create a sample user
    const newUser = await db.insert(users).values({
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date(),
    }).returning();

    // Query all users
    const allUsers = await db.select().from(users);

    return new Response(JSON.stringify({
      message: 'Drizzle D1 working!',
      newUser: newUser[0],
      allUsers
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  },
};

Deploy your application

Deploy your D1 database and worker:

bun
npm
pnpm
yarn
Terminal window
pnpm alchemy deploy

Your API will be available at the displayed URL. Test it with:

Terminal window
# Test the Drizzle D1 integration
curl https://api-worker.your-account.workers.dev

(Optional) Tear down

Clean up all resources when you’re done:

bun
npm
pnpm
yarn
Terminal window
pnpm alchemy destroy