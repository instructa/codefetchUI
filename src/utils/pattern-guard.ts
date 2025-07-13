/**
 * Utility helpers for preparing and guarding ast‑grep rules.
 *
 * These functions are **framework‑agnostic** and can be shared by both
 * the AI‑transform step (utils/ast‑grep‑ai.ts) *and* server routes
 * (e.g. /api/interactive‑grep.ts) to ensure a single source of truth.
 */

export interface SimpleRule {
  pattern: string;
  languages?: string[];
}

export type NormalisedRule = SimpleRule;

/**
 * Convert raw YAML/string/partial objects into a predictable structure.
 *  • Upper‑cases any lowercase metavariables.
 *  • Strips newline characters to avoid MultipleNode panics.
 *  • Leaves other fields untouched.
 */
export function normaliseRule(
  raw: string | { pattern: string; languages?: string[] }
): NormalisedRule {
  const obj: NormalisedRule =
    typeof raw === 'string' ? { pattern: raw } : { ...raw };

  // 1 • ban newlines early – keep it single‑line.
  obj.pattern = obj.pattern.replace(/\n/g, ' ').trim();

  // 2 • force metavariables to UPPERCASE (ast‑grep 0.39.x is strict).
  obj.pattern = obj.pattern.replace(/\$([a-z_][a-zA-Z0-9_]*)/g, (_, name) => {
    return '$' + name.toUpperCase();
  });

  return obj;
}

/**
 * Lightweight guard that mirrors ast‑grep’s common runtime errors ––
 * returns `{valid:false, error:'…'}` if the rule should be rejected
 * before calling the expensive `parse()` step.
 */
export function validateRule(
  rule: Pick<SimpleRule, 'pattern'>
): { valid: boolean; error?: string } {
  const { pattern } = rule;

  // Empty or missing pattern.
  if (!pattern?.trim()) {
    return { valid: false, error: 'Rule must include a non‑empty pattern.' };
  }

  // Unbalanced braces / parentheses.
  const unbalanced = (open: RegExp, close: RegExp) =>
    (pattern.match(open)?.length || 0) !==
    (pattern.match(close)?.length || 0);

  if (unbalanced(/\{/g, /\}/g)) {
    return { valid: false, error: 'Unbalanced braces in pattern.' };
  }
  if (unbalanced(/\(/g, /\)/g)) {
    return { valid: false, error: 'Unbalanced parentheses in pattern.' };
  }

  // Quick metavariable sanity: no dangling "$".
  if (/\$[^A-Za-z_$]/.test(pattern)) {
    return { valid: false, error: 'Invalid metavariable syntax.' };
  }

  return { valid: true };
}