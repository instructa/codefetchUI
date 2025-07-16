import * as analyticsSchema from './analytics.schema';
import * as appSchema from './app.schema';
import * as authSchema from './auth.schema';
import * as profileSchema from './profile.schema';

// Combine all schemas here for migrations and queries
export const schema = {
  ...analyticsSchema,
  ...appSchema,
  ...authSchema,
  ...profileSchema,
};

// Re-export all schemas and shared utils for convenience
export * from './_shared';
export * from './analytics.schema';
export * from './app.schema';
export * from './auth.schema';
export * from './profile.schema';
