import * as authSchema from './auth.schema'; // This will be generated in a later step
import * as profileSchema from './profile.schema';

// Combine all schemas here for migrations
export const schema = {
  ...authSchema,
  ...profileSchema,
  // ... your other application schemas
} as const;
