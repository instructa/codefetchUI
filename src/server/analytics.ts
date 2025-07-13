export interface SearchErrorLog {
  repo: string;
  engine: string;
  pattern: string;
  error: string;
}

export async function logSearchError(
  env: any,
  data: SearchErrorLog,
): Promise<void> {
  if (!env?.ANALYTICS || typeof env.ANALYTICS.prepare !== 'function') return;

  try {
    await env.ANALYTICS.prepare(
      `INSERT INTO search_errors (ts, repo, engine, pattern, error)
       VALUES (datetime('now'), ?, ?, ?, ?)`,
    )
      .bind(data.repo, data.engine, data.pattern, data.error)
      .run();
  } catch (e) {
    // Silent – avoid cascading failures
    console.error('[analytics] failed to log', e);
  }
}