import { integer } from 'drizzle-orm/sqlite-core';

// Helper to create SQLite integer columns that store JavaScript Date objects as timestamps
export const timestampColumn = (name: string) => integer(name, { mode: 'timestamp' });

/**
 * Convenience helpers for common timestamp columns. Uses JavaScript Date objects
 * so values are consistent between server and Cloudflare D1.
 */
export const createdAt = () =>
  timestampColumn('created_at')
    .$defaultFn(() => new Date())
    .notNull();

export const updatedAt = () =>
  timestampColumn('updated_at')
    .$defaultFn(() => new Date())
    .notNull();

export const accessedAt = () =>
  timestampColumn('accessed_at')
    .$defaultFn(() => new Date())
    .notNull();

export const timestamps = {
  createdAt: createdAt(),
  updatedAt: updatedAt(),
  accessedAt: accessedAt(),
};
