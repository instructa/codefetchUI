import { useCallback, useRef, useState } from 'react';
import { chooseEngine, type SearchEngine } from '~/utils/engine-select';

/* ---------- Result Types (identical to old hook) ---------- */
export interface SearchMatch {
  type: 'match';
  file: string;
  lines?: [number, number];
  snippet: string;
  score: number;
  tier?: 'high' | 'mid' | 'low';
  origin?: 'vector' | 'ast' | 'vector+sg';
}

export interface SearchMetadata {
  type: 'metadata';
  engine: SearchEngine;
  intent?: string;
  rule?: string;           // if ast path used
}

export interface SearchSummary {
  type: 'summary';
  totalFiles: number;
  totalMatches: number;
}

export interface SearchSuggestion {
  type: 'suggestion';
  path: string;
  reason: string;
}

export type SearchResult =
  | SearchMatch
  | SearchMetadata
  | SearchSummary
  | SearchSuggestion;

/* ---------- Hook ---------- */
interface UseCodeSearchReturn {
  searchCode: (prompt: string, repoUrl?: string) => Promise<void>;
  isSearching: boolean;
  results: SearchResult[];
  error: string | null;
  clearResults: () => void;
}

export function useCodeSearch(): UseCodeSearchReturn {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const cache = useRef(new Map<string, SearchResult[]>());

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  const searchCode = useCallback(
    async (prompt: string, repoUrl?: string) => {
      const engine = chooseEngine(prompt);
      const key = `${repoUrl || ''}_${engine}_${prompt}`;

      // cache hit
      if (cache.current.has(key)) {
        setResults(cache.current.get(key)!);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setError(null);
      setResults([]);

      try {
        const resp = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, repoUrl, engine }),
        });

        if (!resp.ok) {
          const errData = await resp.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${resp.status}`);
        }

        const reader = resp.body?.getReader();
        if (!reader) throw new Error('Empty response body');

        const decoder = new TextDecoder();
        let buf = '';
        const local: SearchResult[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });

          let idx;
          while ((idx = buf.indexOf('\n')) >= 0) {
            const line = buf.slice(0, idx).trim();
            buf = buf.slice(idx + 1);
            if (!line) continue;
            try {
              local.push(JSON.parse(line));
            } catch {
              /* swallow parse errors per line */
            }
          }
        }

        setResults(local);
        cache.current.set(key, local);
      } catch (err: any) {
        console.error('[useCodeSearch] error', err);
        setError(err.message || 'Search failed');
      } finally {
        setIsSearching(false);
      }
    },
    [],
  );

  return { searchCode, isSearching, results, error, clearResults };
}