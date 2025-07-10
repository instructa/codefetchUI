import { useCallback, useRef, useState } from 'react';

export interface ContextItem {
  file: string;
  lines: [number, number];
  snippet: string;
  bucket: string | null;
  score: number;
}

export const useStreamingAstGrep = () => {
  const [data, setData] = useState<ContextItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const startGeneration = useCallback(async (resource: string, intent: string) => {
    if (!resource) return;

    // Abort any existing request
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    setData(null);
    setIsLoading(true);
    setError(null);

    try {
      const resp = await fetch(
        `/api/context?resource=${encodeURIComponent(resource)}&intent=${encodeURIComponent(intent)}`,
        { signal: controller.signal },
      );
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buf = '';

      const collected: ContextItem[] = [];

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
            collected.push(JSON.parse(line));
            setData([...collected]); // trigger update
          } catch {}
        }
      }
      setIsLoading(false);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err);
      setIsLoading(false);
    }
  }, []);

  return {
    startGeneration,
    isLoading,
    error,
    data,
  };
};