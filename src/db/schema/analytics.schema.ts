import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createdAt } from './_shared';

export const searchErrors = sqliteTable('search_errors', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  ts: integer('ts', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  repo: text('repo').notNull(),
  engine: text('engine').notNull(),
  pattern: text('pattern').notNull(),
  error: text('error').notNull(),
  createdAt: createdAt(),
});
