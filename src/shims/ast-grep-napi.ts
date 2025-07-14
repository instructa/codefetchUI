/**
 * Shim for the native "@ast-grep/napi" package.
 *
 * ‑ In Node environments you should install the real package to get full AST
 *   search power.
 * ‑ In Cloudflare Workers (or any environment where native addons are banned)
 *   this stub is used instead, preventing build failures.
 *
 * The API surface is intentionally minimal—just enough for existing
 * code to compile and run without crashing. All searches return zero
 * matches, so features degrade gracefully.
 */
export function parse(_language: string, _source: string) {
  // Very small façade that mimics the subset of the real API we use.
  return {
    root() {
      return {
        findAll(_pattern: string) {
          // Always return an empty array ‑ effectively "no matches".
          return [];
        },
      };
    },
  };
}