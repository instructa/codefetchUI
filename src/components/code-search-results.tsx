import { useState, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  ChevronDown,
  ChevronRight,
  Code,
  FileText,
  Search,
  Plus,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { Badge } from '~/components/ui/badge';
import { ScrollArea } from '~/components/ui/scroll-area';
import { cn } from '~/lib/utils';
import type {
  SearchResult,
  SearchMatch,
  SearchMetadata,
  SearchSummary,
  SearchSuggestion,
} from '~/hooks/use-code-search';
import { useIsMobile } from '~/hooks/use-mobile';
import { Button } from '~/components/ui/button';

interface CodeSearchResultsProps {
  results: SearchResult[];
  isSearching: boolean;
  error?: string | null;
  onRetry?: () => void; // Added optional retry callback for error handling
}

export function CodeSearchResults({
  results,
  isSearching,
  error,
  onRetry,
}: CodeSearchResultsProps) {
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const parentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const metadata = results.find((r) => r.type === 'metadata') as SearchMetadata | undefined;
  const matches = results.filter((r) => r.type === 'match') as SearchMatch[];
  const summary = results.find((r) => r.type === 'summary') as SearchSummary | undefined;
  const suggestions = results.filter((r) => r.type === 'suggestion') as SearchSuggestion[];

  // Group matches by file
  const matchesByFile = matches.reduce(
    (acc, match) => {
      if (!acc[match.file]) {
        acc[match.file] = [];
      }
      acc[match.file].push(match);
      return acc;
    },
    {} as Record<string, SearchMatch[]>
  );

  // Create file list for virtualizer
  const fileList = Object.entries(matchesByFile);

  // Initialize virtualizer at top level to comply with Rules of Hooks
  const rowVirtualizer = useVirtualizer({
    count: fileList.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
  });

  const toggleFile = (file: string) => {
    setExpandedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(file)) {
        next.delete(file);
      } else {
        next.add(file);
      }
      return next;
    });
  };

  const getRelativePath = (fullPath: string) => {
    // Remove common project paths
    return fullPath.replace(/^.\//, '');
  };

  if (isSearching) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 animate-pulse" />
            Searching code...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  // Improved error handling with user-friendly message and optional retry button
  if (results.length === 0) {
    if (error) {
      return (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive font-medium mb-2">Search Error</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            {onRetry && (
              <Button onClick={onRetry}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Search
              </Button>
            )}
          </CardContent>
        </Card>
      );
    }
    return null;
  }

  return (
    <div className="space-y-4">
      {metadata && (
        // Always show metadata; removed isDevelopment check for broader visibility
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Generated Pattern
              {metadata.intent && (
                <Badge variant="outline" className="text-xs">
                  {metadata.intent}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
              <code>{metadata.rule}</code>
            </pre>
            {metadata.languages && metadata.languages.length > 0 && (
              <div className="mt-2 flex gap-2">
                {metadata.languages.map((lang) => (
                  <Badge key={lang} variant="secondary" className="text-xs">
                    {lang}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Suggested Locations
            </CardTitle>
            <CardDescription>
              Based on your codebase structure, these are good locations for new files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-muted-foreground" />
                    <code className="text-sm">{suggestion.path}</code>
                  </div>
                  <span className="text-xs text-muted-foreground">{suggestion.reason}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {Object.entries(matchesByFile).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Code Matches
              </span>
              {summary && (
                <span className="text-sm font-normal text-muted-foreground">
                  {summary.totalMatches} matches in {Object.keys(matchesByFile).length} files
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div
              ref={parentRef}
              className={`overflow-auto ${isMobile ? 'h-[300px]' : 'h-[400px]'}`}
            >
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const [file, fileMatches] = fileList[virtualRow.index];
                  const isExpanded = expandedFiles.has(file);
                  const relativePath = getRelativePath(file);
                  return (
                    <div
                      key={virtualRow.key}
                      data-index={virtualRow.index}
                      ref={rowVirtualizer.measureElement}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <Collapsible
                        key={file}
                        open={isExpanded}
                        onOpenChange={() => toggleFile(file)}
                      >
                        <div className="border rounded-lg">
                          <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-2 flex-1">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-mono text-left">{relativePath}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {fileMatches.length} {fileMatches.length === 1 ? 'match' : 'matches'}
                            </Badge>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <div className="border-t">
                              {fileMatches.map((match, idx) => {
                                const tierColour =
                                  match.tier === 'high'
                                    ? 'border-green-500'
                                    : match.tier === 'mid'
                                    ? 'border-amber-500'
                                    : match.tier === 'low'
                                    ? 'border-slate-400'
                                    : 'border-muted';

                                return (
                                  <div
                                    key={`${match.file}-${match.lines[0]}-${idx}`}
                                    className={cn(
                                      'p-3 border-l-4',
                                      tierColour,
                                      idx < fileMatches.length - 1 && 'border-b'
                                    )}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-xs text-muted-foreground">
                                        Lines {match.lines[0]}-{match.lines[1]}
                                      </span>
                                    </div>
                                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                      <code>{match.snippet}</code>
                                    </pre>
                                  </div>
                                );
                              })}
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {summary && Object.keys(matchesByFile).length === 0 && suggestions.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No matches found in {summary.totalFiles} files.
              {summary.wasAiTransformed && (
                <span className="block mt-2 text-sm">
                  Try rephrasing your query or use direct ast-grep syntax like "test($$$)" for test
                  functions.
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
