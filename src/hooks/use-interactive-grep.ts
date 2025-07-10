import { useCallback, useState } from 'react';

export interface GrepMatch {
  type: 'match';
  file: string;
  lines: [number, number];
  snippet: string;
  score: number;
}

export interface GrepMetadata {
  type: 'metadata';
  rule: string;
  languages: string[];
  intent?: 'refactor' | 'debug' | 'add' | 'find' | 'other';
  suggestedPaths?: string[];
}

export interface GrepSummary {
  type: 'summary';
  totalFiles: number;
  totalMatches: number;
  wasAiTransformed?: boolean;
  intent?: 'refactor' | 'debug' | 'add' | 'find' | 'other';
}

export interface GrepSuggestion {
  type: 'suggestion';
  path: string;
  reason: string;
}

export type GrepResult = GrepMatch | GrepMetadata | GrepSummary | GrepSuggestion;

interface UseInteractiveGrepReturn {
  searchCode: (prompt: string) => Promise<void>;
  isSearching: boolean;
  results: GrepResult[];
  error: string | null;
  clearResults: () => void;
}

export function useInteractiveGrep(): UseInteractiveGrepReturn {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<GrepResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  const searchCode = useCallback(async (prompt: string) => {
    setIsSearching(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch('/api/interactive-grep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Check for ast-grep panic errors
        if (
          (errorData.error && errorData.error.includes('panic')) ||
          errorData.error.includes('MultipleNode')
        ) {
          throw new Error(
            'Invalid search pattern generated. Try rephrasing your query or use direct ast-grep syntax.'
          );
        }

        throw new Error(errorData.error || 'Failed to search code');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line) as GrepResult;
              setResults((prev) => [...prev, data]);
            } catch (e) {
              console.error('Failed to parse line:', line, e);
            }
          }
        }
      }

      // Process any remaining data in buffer
      if (buffer.trim()) {
        try {
          const data = JSON.parse(buffer) as GrepResult;
          setResults((prev) => [...prev, data]);
        } catch (e) {
          console.error('Failed to parse final buffer:', buffer, e);
        }
      }
    } catch (err) {
      console.error('Interactive grep error:', err);

      // Provide more helpful error messages
      if (err instanceof Error) {
        if (err.message.includes('Gemini API key not found')) {
          setError('Please add your Gemini API key to use AI-enhanced search');
        } else if (err.message.includes('Invalid search pattern')) {
          setError(err.message);
        } else if (err.message.includes('Failed to transform prompt')) {
          setError('Failed to understand your query. Try using more specific code-related terms.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Search failed');
      }
    } finally {
      setIsSearching(false);
    }
  }, []);

  return {
    searchCode,
    isSearching,
    results,
    error,
    clearResults,
  };
}
