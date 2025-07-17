import { createFileRoute } from '@tanstack/react-router';
import React, { useState, useEffect, Suspense } from 'react';
import { Badge } from '~/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';

// Lazy‑load Monaco only on client
const MonacoEditor = React.lazy(() => import('@monaco-editor/react'));

export const Route = createFileRoute('/play/sg')({
  component: Playground,
  loader: async ({ search }) => {
    return { repoUrl: typeof search.url === 'string' ? search.url : '' };
  },
});

function Playground() {
  const { repoUrl: initialUrl } = Route.useLoaderData();

  const [repoUrl, setRepoUrl] = useState(initialUrl);
  const [pattern, setPattern] = useState('function $FUNC($$$) { $$$ }');
  const [matches, setMatches] = useState<
    Array<{ file: string; lines?: [number, number]; snippet: string }>
  >([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSearch = async () => {
    if (!repoUrl) {
      setError('Provide a repository URL first');
      return;
    }
    setIsRunning(true);
    setError(null);
    setMatches([]);

    try {
      const resp = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: pattern, repoUrl, engine: 'ast' }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buf.indexOf('\n')) >= 0) {
          const line = buf.slice(0, idx).trim();
          buf = buf.slice(idx + 1);
          if (!line) continue;
          const obj = JSON.parse(line);
          if (obj.type === 'match') {
            setMatches((prev) => [...prev, obj]);
          } else if (obj.type === 'warning') {
            setError(obj.msg);
          }
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>ast-grep Playground</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Repository URL"
              className="flex-1 border rounded px-2 py-1 text-sm"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
            <button
              onClick={runSearch}
              className="bg-primary text-primary-foreground rounded px-3 py-1 text-sm disabled:opacity-50"
              disabled={isRunning}
            >
              {isRunning ? 'Running…' : 'Run'}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Editor */}
            <Suspense fallback={<div className="h-64 border rounded">Loading editor…</div>}>
              <MonacoEditor
                height="300px"
                defaultLanguage="yaml"
                value={pattern}
                options={{ fontSize: 13, minimap: { enabled: false } }}
                onChange={(v) => v && setPattern(v)}
              />
            </Suspense>

            {/* Results */}
            <div className="h-64 overflow-auto border rounded p-2 text-xs font-mono bg-muted/20">
              {matches.length === 0 && !error && (
                <p className="text-muted-foreground">No matches yet.</p>
              )}
              {error && <p className="text-red-600">{error}</p>}
              {matches.map((m, idx) => (
                <div key={idx} className="mb-3">
                  <Badge variant="secondary" className="mr-2">
                    {m.file}
                  </Badge>
                  {m.lines && (
                    <span className="text-muted-foreground">
                      lines {m.lines[0]}‑{m.lines[1]}
                    </span>
                  )}
                  <pre className="mt-1 bg-background/50 p-2 rounded">{m.snippet}</pre>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}