import { useState, useCallback, useRef } from 'react';

interface StreamChunk {
  type: 'metadata' | 'markdown' | 'complete';
  data?: any;
}

interface UseMarkdownStreamOptions {
  onChunk?: (markdown: string) => void;
  onComplete?: (fullMarkdown: string) => void;
  onError?: (error: Error) => void;
}

interface UseMarkdownStreamReturn {
  startStreaming: () => Promise<void>;
  cancel: () => void;
  isStreaming: boolean;
  error: Error | null;
  markdown: string;
  metadata: any | null;
}

export function useMarkdownStream(
  url: string | null,
  options: UseMarkdownStreamOptions = {}
): UseMarkdownStreamReturn {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [markdown, setMarkdown] = useState('');
  const [metadata, setMetadata] = useState<any | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const markdownRef = useRef<string>('');

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const startStreaming = useCallback(async () => {
    if (!url) {
      return;
    }

    // Cancel any ongoing request
    cancel();

    setIsStreaming(true);
    setError(null);
    setMarkdown('');
    setMetadata(null);
    markdownRef.current = '';

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch(`/api/scrape?url=${encodeURIComponent(url)}&stream=true`, {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
          if (!line.trim()) continue;

          try {
            const chunk: StreamChunk = JSON.parse(line);

            if (chunk.type === 'metadata' && chunk.data) {
              setMetadata(chunk.data);
            } else if (chunk.type === 'markdown' && chunk.data) {
              markdownRef.current += chunk.data;
              setMarkdown(markdownRef.current);
              options.onChunk?.(chunk.data);
            } else if (chunk.type === 'complete') {
              options.onComplete?.(markdownRef.current);
            }
          } catch (e) {
            console.error('Failed to parse chunk:', e);
          }
        }
      }

      // Process any remaining data in buffer
      if (buffer.trim()) {
        try {
          const chunk: StreamChunk = JSON.parse(buffer);
          if (chunk.type === 'markdown' && chunk.data) {
            markdownRef.current += chunk.data;
            setMarkdown(markdownRef.current);
            options.onChunk?.(chunk.data);
          }
        } catch (e) {
          console.error('Failed to parse final buffer:', e);
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Stream cancelled');
      } else {
        console.error('Streaming error:', err);
        setError(err);
        options.onError?.(err);
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [url, options, cancel]);

  return {
    startStreaming,
    cancel,
    isStreaming,
    error,
    markdown,
    metadata,
  };
}
