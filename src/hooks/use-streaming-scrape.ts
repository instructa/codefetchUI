import { useState, useCallback, useEffect, useRef } from 'react';
import { FileNode, ScrapedData, ScrapedDataMetadata } from '~/lib/stores/scraped-data.store';

interface StreamChunk {
  type: 'metadata' | 'node' | 'complete';
  data?: any;
}

interface UseStreamingScrapeOptions {
  onComplete?: (data: ScrapedData, metadata: ScrapedDataMetadata) => void;
  onError?: (error: Error) => void;
}

export function useStreamingScrape(url: string | null, options: UseStreamingScrapeOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);
  const [metadata, setMetadata] = useState<ScrapedDataMetadata | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const nodesRef = useRef<Map<string, FileNode>>(new Map());
  const rootRef = useRef<FileNode | null>(null);
  const metadataRef = useRef<ScrapedDataMetadata | null>(null);


  const startScraping = useCallback(async () => {
    if (!url) {
      return;
    }

    // Abort any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);
    nodesRef.current.clear();
    rootRef.current = null;
    metadataRef.current = null;

    try {
      abortControllerRef.current = new AbortController();
      
      const response = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`, {
        signal: abortControllerRef.current.signal,
      });


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let buffer = '';
      let nodeCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          
          // Process any remaining data in buffer
          if (buffer.trim()) {
            try {
              const chunk: StreamChunk = JSON.parse(buffer);
              
              if (chunk.type === 'complete') {
                setProgress(1);
                setIsLoading(false);
                
                if (rootRef.current && metadataRef.current) {
                  const scrapedData: ScrapedData = { root: rootRef.current };
                  options.onComplete?.(scrapedData, metadataRef.current);
                } else {
                }
              }
            } catch (err) {
              console.error('[useStreamingScrape] Error parsing final buffer:', err, buffer);
            }
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const chunk: StreamChunk = JSON.parse(line);

            switch (chunk.type) {
              case 'metadata':
                metadataRef.current = chunk.data;
                setMetadata(chunk.data);
                break;

              case 'node':
                const nodeData = chunk.data;
                const node: FileNode = {
                  name: nodeData.name,
                  path: nodeData.path,
                  type: nodeData.type,
                  size: nodeData.size,
                  lastModified: nodeData.lastModified,
                  language: nodeData.language,
                  tokens: nodeData.tokens,
                  content: nodeData.content,
                  children: nodeData.hasChildren ? [] : undefined,
                };

                nodesRef.current.set(node.path, node);
                nodeCount++;

                if (nodeCount % 50 === 0) {
                }

                // Update progress based on node count
                setProgress(Math.min(nodeCount / 100, 0.95)); // Cap at 95% until complete

                // Handle root node
                if (node.path === '') {
                  rootRef.current = node;
                } else {
                  // Add to parent's children
                  const parentPath = nodeData.parentPath;
                  const parent = nodesRef.current.get(parentPath);
                  if (parent && parent.children) {
                    parent.children.push(node);
                  }
                }
                break;

              case 'complete':
                setProgress(1);
                setIsLoading(false);
                
                if (rootRef.current && metadataRef.current) {
                  const scrapedData: ScrapedData = { root: rootRef.current };
                  options.onComplete?.(scrapedData, metadataRef.current);
                } else {
                }
                break;
            }
          } catch (err) {
            console.error('Error parsing chunk:', err);
          }
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
        } else {
          setError(err);
          options.onError?.(err);
        }
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [url, options]);

  // Cancel ongoing request
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return {
    startScraping,
    cancel,
    isLoading,
    error,
    progress,
    metadata,
  };
}