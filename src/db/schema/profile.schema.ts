import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * User profile table – SQLite / Cloudflare D1 version.
 */
export const profile = sqliteTable('profile', {
  id: text('id').primaryKey().notNull(),
  username: text('username').unique(),
  email: text('email'),

  avatar: text('avatar'),
  phone: text('phone'),
  firstName: text('firstName'),
  lastName: text('lastName'),
  fullName: text('fullName'),
  isOnboarded: integer('is_onboarded', { mode: 'boolean' }).$defaultFn(() => false),

  /** Mirrors the old `timestamptz` column; stored as milliseconds */
  emailVerifiedAt: integer('email_verified_at', { mode: 'timestamp' }),

  // createdAt / updatedAt helpers
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
});
