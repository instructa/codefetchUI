import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { users } from './auth.schema';
import { timestamps } from './_shared';

export const projects = sqliteTable('projects', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  ...timestamps,
});
