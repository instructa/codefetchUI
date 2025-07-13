/**
 * Decide which search engine to run based on the raw query.
 *
 *  • Returns `"ast"` when the user appears to supply ast‑grep syntax
 *    (metavariables $, YAML "pattern:" or "kind:").
 *  • Returns `"vector"` for ultra‑short queries (≤ 5 chars) where
 *    semantic search beats structural search.
 *  • Returns `"hybrid"` for everything else (vector narrow → ast‑grep confirm).
 */
export type SearchEngine = 'ast' | 'vector' | 'hybrid';

export function chooseEngine(q: string): SearchEngine {
  const astLike = /(\$|\bpattern:|\bkind:)/i.test(q);
  if (astLike) return 'ast';

  if (q.trim().length < 6) return 'vector';

  return 'hybrid';
}