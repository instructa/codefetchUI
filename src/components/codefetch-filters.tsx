import { useState } from 'react';
import { toast } from 'sonner';
import {
  useCodefetchFilters,
  COMMON_EXTENSIONS,
  TOKEN_PRESETS,
} from '~/lib/stores/codefetch-filters.store';
import { useScrapedDataStore } from '~/lib/stores/scraped-data.store';
import type { TokenEncoder } from 'codefetch-sdk';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Badge } from '~/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
  FileCode,
  Filter,
  FolderOpen,
  FileText,
  Minus,
  Plus,
  X,
  RotateCcw,
  Settings2,
  Eye,
  Download,
  Upload,
  Settings,
} from 'lucide-react';

/**
 * CodefetchFilters Component
 *
 * Changes made:
 * - Removed Quick Presets section (not useful)
 * - Removed Apply Filters button (store syncs in realtime)
 * - Removed Current Configuration summary
 * - Moved token settings to Display Options behind gear icon
 * - Reordered Display Options with Project Tree Depth first
 */
export function CodefetchFilters() {
  const filters = useCodefetchFilters();
  const { dynamicExtensions, scrapedData } = useScrapedDataStore();
  const [newIncludeFile, setNewIncludeFile] = useState('');
  const [newExcludeFile, setNewExcludeFile] = useState('');
  const [newIncludeDir, setNewIncludeDir] = useState('');
  const [newExcludeDir, setNewExcludeDir] = useState('');
  const [showAllExtensions, setShowAllExtensions] = useState(false);

  const hasModified = filters.hasModifiedFilters();

  // Use dynamic extensions if available, otherwise fall back to common extensions
  const availableExtensions =
    dynamicExtensions.length > 0 ? dynamicExtensions.map((item) => item.ext) : COMMON_EXTENSIONS;

  // Limit displayed extensions if there are too many
  const MAX_VISIBLE_EXTENSIONS = 15;
  const displayedExtensions = showAllExtensions
    ? availableExtensions
    : availableExtensions.slice(0, MAX_VISIBLE_EXTENSIONS);
  const hasMoreExtensions = availableExtensions.length > MAX_VISIBLE_EXTENSIONS;

  const handleAddPattern = (
    value: string,
    setter: (value: string) => void,
    adder: (pattern: string) => void
  ) => {
    if (value.trim()) {
      adder(value.trim());
      setter('');
    }
  };

  const exportConfig = () => {
    const config = {
      extensions: filters.extensions,
      customExtensions: filters.customExtensions,
      maxTokens: filters.maxTokens,
      tokenEncoder: filters.tokenEncoder,
      tokenLimiter: filters.tokenLimiter,
      includeFiles: filters.includeFiles,
      excludeFiles: filters.excludeFiles,
      includeDirs: filters.includeDirs,
      excludeDirs: filters.excludeDirs,
      projectTreeDepth: filters.projectTreeDepth,
      disableLineNumbers: filters.disableLineNumbers,
    };

    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'codefetch-filters.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast.success('Configuration exported!');
  };

  const importConfig = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const config = JSON.parse(text);

        // Apply imported configuration
        if (config.extensions) filters.setExtensions(config.extensions);
        if (config.customExtensions !== undefined)
          filters.setCustomExtensions(config.customExtensions);
        if (config.maxTokens !== undefined) filters.setMaxTokens(config.maxTokens);
        if (config.tokenEncoder) filters.setTokenEncoder(config.tokenEncoder);
        if (config.tokenLimiter) filters.setTokenLimiter(config.tokenLimiter);
        if (config.projectTreeDepth !== undefined)
          filters.setProjectTreeDepth(config.projectTreeDepth);
        if (config.disableLineNumbers !== undefined)
          filters.setDisableLineNumbers(config.disableLineNumbers);

        // Clear and re-add patterns
        config.includeFiles?.forEach((pattern: string) => filters.addIncludeFile(pattern));
        config.excludeFiles?.forEach((pattern: string) => filters.addExcludeFile(pattern));
        config.includeDirs?.forEach((pattern: string) => filters.addIncludeDir(pattern));
        config.excludeDirs?.forEach((pattern: string) => filters.addExcludeDir(pattern));

        toast.success('Configuration imported successfully!');
      } catch (error) {
        toast.error('Failed to import configuration', {
          description: 'Please ensure the file is a valid JSON configuration.',
        });
      }
    };
    input.click();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Codefetch Filters</h2>
            {hasModified && (
              <Badge variant="secondary" className="text-xs">
                Modified
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={exportConfig}
              title="Export configuration"
              className="h-8 w-8"
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={importConfig}
              title="Import configuration"
              className="h-8 w-8"
            >
              <Upload className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                filters.resetFilters();
                toast.info('Filters reset to defaults');
              }}
              className="gap-2"
              disabled={!hasModified}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Configure filters for the codefetch SDK to customize file collection and output
        </p>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* File Extensions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileCode className="h-4 w-4" />
                File Extensions
              </CardTitle>
              <CardDescription>
                {dynamicExtensions.length > 0
                  ? `Found ${dynamicExtensions.length} file types in the project`
                  : scrapedData
                    ? 'No files found in the project'
                    : 'Select which file types to include'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!scrapedData && dynamicExtensions.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4">
                  <p>Scrape a project to see file types specific to that codebase</p>
                </div>
              )}

              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-1">
                  {displayedExtensions.map((ext, index) => {
                    const extInfo = dynamicExtensions.find((item) => item.ext === ext);
                    const fileCount = extInfo?.count;

                    return (
                      <label
                        key={ext}
                        className="flex items-center justify-between py-1.5 px-2 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={filters.extensions.includes(ext)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                filters.setExtensions([...filters.extensions, ext]);
                              } else {
                                filters.setExtensions(filters.extensions.filter((e) => e !== ext));
                              }
                            }}
                            className="h-4 w-4"
                          />
                          <span className="text-sm font-mono">{ext}</span>
                        </div>
                        {fileCount && (
                          <span className="text-xs text-muted-foreground">
                            {fileCount} {fileCount === 1 ? 'file' : 'files'}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </ScrollArea>

              {hasMoreExtensions && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllExtensions(!showAllExtensions)}
                  className="w-full"
                >
                  {showAllExtensions
                    ? `Show less`
                    : `Show ${availableExtensions.length - MAX_VISIBLE_EXTENSIONS} more`}
                </Button>
              )}

              <div className="space-y-2">
                <Label htmlFor="custom-extensions">Custom Extensions</Label>
                <Input
                  id="custom-extensions"
                  placeholder="e.g., .vue, .svelte, .astro (comma-separated)"
                  value={filters.customExtensions}
                  onChange={(e) => filters.setCustomExtensions(e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Add custom file extensions separated by commas
                </p>
              </div>
            </CardContent>
          </Card>

          {/* File & Directory Patterns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Filter className="h-4 w-4" />
                Pattern Filters
              </CardTitle>
              <CardDescription>Include or exclude specific files and directories</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="files" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="files" className="gap-2">
                    <FileText className="h-3.5 w-3.5" />
                    Files
                  </TabsTrigger>
                  <TabsTrigger value="directories" className="gap-2">
                    <FolderOpen className="h-3.5 w-3.5" />
                    Directories
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="files" className="space-y-4">
                  {/* Include Files */}
                  <div className="space-y-2">
                    <Label>Include Files</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., **/test/*.ts"
                        value={newIncludeFile}
                        onChange={(e) => setNewIncludeFile(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddPattern(
                              newIncludeFile,
                              setNewIncludeFile,
                              filters.addIncludeFile
                            );
                          }
                        }}
                        className="font-mono text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() =>
                          handleAddPattern(
                            newIncludeFile,
                            setNewIncludeFile,
                            filters.addIncludeFile
                          )
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {filters.includeFiles.map((pattern) => (
                        <Badge key={pattern} variant="secondary" className="gap-1">
                          <span className="font-mono text-xs">{pattern}</span>
                          <button
                            onClick={() => filters.removeIncludeFile(pattern)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Exclude Files */}
                  <div className="space-y-2">
                    <Label>Exclude Files</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., *.test.ts"
                        value={newExcludeFile}
                        onChange={(e) => setNewExcludeFile(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddPattern(
                              newExcludeFile,
                              setNewExcludeFile,
                              filters.addExcludeFile
                            );
                          }
                        }}
                        className="font-mono text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() =>
                          handleAddPattern(
                            newExcludeFile,
                            setNewExcludeFile,
                            filters.addExcludeFile
                          )
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {filters.excludeFiles.map((pattern) => (
                        <Badge key={pattern} variant="outline" className="gap-1">
                          <span className="font-mono text-xs">{pattern}</span>
                          <button
                            onClick={() => filters.removeExcludeFile(pattern)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="directories" className="space-y-4">
                  {/* Include Directories */}
                  <div className="space-y-2">
                    <Label>Include Directories</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., src/"
                        value={newIncludeDir}
                        onChange={(e) => setNewIncludeDir(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddPattern(
                              newIncludeDir,
                              setNewIncludeDir,
                              filters.addIncludeDir
                            );
                          }
                        }}
                        className="font-mono text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() =>
                          handleAddPattern(newIncludeDir, setNewIncludeDir, filters.addIncludeDir)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {filters.includeDirs.map((pattern) => (
                        <Badge key={pattern} variant="secondary" className="gap-1">
                          <span className="font-mono text-xs">{pattern}</span>
                          <button
                            onClick={() => filters.removeIncludeDir(pattern)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Exclude Directories */}
                  <div className="space-y-2">
                    <Label>Exclude Directories</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., node_modules/"
                        value={newExcludeDir}
                        onChange={(e) => setNewExcludeDir(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddPattern(
                              newExcludeDir,
                              setNewExcludeDir,
                              filters.addExcludeDir
                            );
                          }
                        }}
                        className="font-mono text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() =>
                          handleAddPattern(newExcludeDir, setNewExcludeDir, filters.addExcludeDir)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {filters.excludeDirs.map((pattern) => (
                        <Badge key={pattern} variant="outline" className="gap-1">
                          <span className="font-mono text-xs">{pattern}</span>
                          <button
                            onClick={() => filters.removeExcludeDir(pattern)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Display Options */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Eye className="h-4 w-4" />
                    Display Options
                  </CardTitle>
                  <CardDescription>Configure how the output is displayed</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Token Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-4 space-y-4">
                      {/* Max Tokens */}
                      <div className="space-y-2">
                        <Label>Max Tokens</Label>
                        <Select
                          value={filters.maxTokens?.toString() || 'null'}
                          onValueChange={(value) => {
                            filters.setMaxTokens(value === 'null' ? null : parseInt(value));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TOKEN_PRESETS.map((preset) => (
                              <SelectItem
                                key={preset.label}
                                value={preset.value?.toString() || 'null'}
                              >
                                {preset.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Custom limit"
                            value={filters.maxTokens || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              filters.setMaxTokens(value ? parseInt(value) : null);
                            }}
                            className="flex-1"
                          />
                          <span className="text-sm text-muted-foreground">tokens</span>
                        </div>
                      </div>

                      {/* Token Encoder */}
                      <div className="space-y-2">
                        <Label>Token Encoder</Label>
                        <Select
                          value={filters.tokenEncoder}
                          onValueChange={(value) => filters.setTokenEncoder(value as TokenEncoder)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="simple">simple (All models)</SelectItem>
                            <SelectItem value="p50k">p50k (Davinci models)</SelectItem>
                            <SelectItem value="cl100k">cl100k (GPT-4, GPT-3.5)</SelectItem>
                            <SelectItem value="o200k">o200k (GPT-4o models)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Token Limiter Strategy */}
                      <div className="space-y-2">
                        <Label>Token Limiter Strategy</Label>
                        <div className="space-y-2">
                          <label className="flex items-start space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="tokenLimiter"
                              value="truncated"
                              checked={filters.tokenLimiter === 'truncated'}
                              onChange={() => filters.setTokenLimiter('truncated')}
                              className="mt-0.5"
                            />
                            <div>
                              <span className="text-sm font-medium">Truncated</span>
                              <p className="text-xs text-muted-foreground">
                                Include files until token limit is reached
                              </p>
                            </div>
                          </label>
                          <label className="flex items-start space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="tokenLimiter"
                              value="spread"
                              checked={filters.tokenLimiter === 'spread'}
                              onChange={() => filters.setTokenLimiter('spread')}
                              className="mt-0.5"
                            />
                            <div>
                              <span className="text-sm font-medium">Spread</span>
                              <p className="text-xs text-muted-foreground">
                                Distribute tokens across all files
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Project Tree Depth */}
              <div className="space-y-2">
                <Label>Project Tree Depth</Label>
                <div className="flex items-center gap-3">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() => filters.setProjectTreeDepth(filters.projectTreeDepth - 1)}
                    disabled={filters.projectTreeDepth === 0}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <div className="w-16 text-center">
                    <span className="text-lg font-medium">{filters.projectTreeDepth}</span>
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() => filters.setProjectTreeDepth(filters.projectTreeDepth + 1)}
                    disabled={filters.projectTreeDepth === 10}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  0 = no tree, higher values show more depth
                </p>
              </div>

              {/* Prompt Selection */}
              <div className="space-y-2">
                <Label>AI Prompt Template</Label>
                <Select value={filters.selectedPrompt} onValueChange={filters.setSelectedPrompt}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a prompt template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No prompt</SelectItem>
                    <SelectItem value="codegen">Code Generation</SelectItem>
                    <SelectItem value="fix">Fix Issues</SelectItem>
                    <SelectItem value="improve">Improve Code</SelectItem>
                    <SelectItem value="testgen">Generate Tests</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Prepend an AI prompt template to the markdown output
                </p>
              </div>

              {/* Line Numbers */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="line-numbers">Disable Line Numbers</Label>
                  <p className="text-xs text-muted-foreground">Hide line numbers in code blocks</p>
                </div>
                <Checkbox
                  id="line-numbers"
                  checked={filters.disableLineNumbers}
                  onCheckedChange={filters.setDisableLineNumbers}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
