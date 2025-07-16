import { getAnalyticsDb } from '~/db/db-config';
import { searchErrors } from '~/db/schema';

export interface SearchErrorLog {
  repo: string;
  engine: string;
  pattern: string;
  error: string;
}

export async function logSearchError(env: any, data: SearchErrorLog): Promise<void> {
  if (!env?.ANALYTICS) {
    console.error('[analytics] D1 binding not found');
    return;
  }
  try {
    const db = getAnalyticsDb(env);
    await db.insert(searchErrors).values({
      repo: data.repo,
      engine: data.engine,
      pattern: data.pattern,
      error: data.error,
    });
  } catch (e) {
    // Silent – avoid cascading failures
    console.error('[analytics] failed to log', e);
  }
}
