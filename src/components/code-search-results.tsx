import { useState } from 'react';
import { ChevronDown, ChevronRight, Code, FileText, Search, Plus, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { Badge } from '~/components/ui/badge';
import { ScrollArea } from '~/components/ui/scroll-area';
import { cn } from '~/lib/utils';
import type {
  GrepMatch,
  GrepMetadata,
  GrepResult,
  GrepSummary,
  GrepSuggestion,
} from '~/hooks/use-interactive-grep';

interface CodeSearchResultsProps {
  results: GrepResult[];
  isSearching: boolean;
  error?: string | null;
}

export function CodeSearchResults({ results, isSearching, error }: CodeSearchResultsProps) {
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());

  const metadata = results.find((r) => r.type === 'metadata') as GrepMetadata | undefined;
  const matches = results.filter((r) => r.type === 'match') as GrepMatch[];
  const summary = results.find((r) => r.type === 'summary') as GrepSummary | undefined;
  const suggestions = results.filter((r) => r.type === 'suggestion') as GrepSuggestion[];

  // Group matches by file
  const matchesByFile = matches.reduce(
    (acc, match) => {
      if (!acc[match.file]) {
        acc[match.file] = [];
      }
      acc[match.file].push(match);
      return acc;
    },
    {} as Record<string, GrepMatch[]>
  );

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
    return fullPath.replace(/^.*\/projects\/[^/]+\//, '').replace(/^.*\/src\//, 'src/');
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

  if (results.length === 0) {
    if (error) {
      return (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive font-medium mb-2">Search Error</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      );
    }
    return null;
  }

  return (
    <div className="space-y-4">
      {metadata && (
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
            <div className="mt-2 flex gap-2">
              {metadata.languages.map((lang) => (
                <Badge key={lang} variant="secondary" className="text-xs">
                  {lang}
                </Badge>
              ))}
            </div>
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
            <ScrollArea className="h-[400px]">
              <div className="p-4 space-y-2">
                {Object.entries(matchesByFile).map(([file, fileMatches]) => {
                  const isExpanded = expandedFiles.has(file);
                  const relativePath = getRelativePath(file);

                  return (
                    <Collapsible key={file} open={isExpanded} onOpenChange={() => toggleFile(file)}>
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
                            {fileMatches.map((match, idx) => (
                              <div
                                key={`${match.file}-${match.lines[0]}-${idx}`}
                                className={cn('p-3', idx < fileMatches.length - 1 && 'border-b')}
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
                            ))}
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  );
                })}
              </div>
            </ScrollArea>
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
