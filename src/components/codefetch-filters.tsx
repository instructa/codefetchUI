import { useState } from 'react';
import { toast } from 'sonner';
import {
  useCodefetchFilters,
  COMMON_EXTENSIONS,
  TOKEN_PRESETS,
} from '~/lib/stores/codefetch-filters.store';
import type { TokenEncoder } from 'codefetch-sdk/worker';
import { useScrapedDataStore } from '~/lib/stores/scraped-data.store';
import { usePreviewGenerator } from '~/hooks/use-preview-generator';
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
  // Initialize preview generator to connect stores and worker
  usePreviewGenerator();

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
      <div className="px-3 py-2 border-b border-border-subtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings2 className="h-3.5 w-3.5 text-primary" />
            <h2 className="text-sm font-medium">Codefetch Filters</h2>
            {hasModified && (
              <Badge variant="secondary" className="text-xs badge-subtle rounded-md">
                Modified
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={exportConfig}
              title="Export configuration"
              className="h-7 w-7 button-ghost rounded-md transition-smooth"
            >
              <Download className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={importConfig}
              title="Import configuration"
              className="h-7 w-7 button-ghost rounded-md transition-smooth"
            >
              <Upload className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                filters.resetFilters();
                toast.info('Filters reset to defaults');
              }}
              className="gap-1.5 h-7 px-2.5 button-ghost rounded-md text-xs transition-smooth"
              disabled={!hasModified}
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Configure filters for file collection and output
        </p>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-2.5 space-y-3">
          {/* File Extensions */}
          <Card className="card-enhanced">
            <CardHeader className="px-3 py-2 border-b border-border-subtle">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <FileCode className="h-3.5 w-3.5" />
                File Extensions
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                {dynamicExtensions.length > 0
                  ? `Found ${dynamicExtensions.length} file types in the project`
                  : scrapedData
                    ? 'No files found in the project'
                    : 'Select which file types to include'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2.5">
              {!scrapedData && dynamicExtensions.length === 0 && (
                <div className="text-xs text-muted-foreground text-center py-2">
                  <p>Scrape a project to see file types specific to that codebase</p>
                </div>
              )}

              <ScrollArea className="h-[140px] pr-2">
                <div className="space-y-0.5">
                  {displayedExtensions.map((ext, index) => {
                    const extInfo = dynamicExtensions.find((item) => item.ext === ext);
                    const fileCount = extInfo?.count;

                    return (
                      <label
                        key={ext}
                        className="flex items-center justify-between py-1.5 px-2 rounded-md cursor-pointer hover:bg-accent/5 transition-colors"
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
                            className="h-3.5 w-3.5"
                          />
                          <span className="text-xs font-mono">{ext}</span>
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
                  className="w-full h-7 text-xs rounded-md mt-2"
                >
                  {showAllExtensions
                    ? `Show less`
                    : `Show ${availableExtensions.length - MAX_VISIBLE_EXTENSIONS} more`}
                </Button>
              )}

              <div className="mt-2.5 space-y-2">
                <Label htmlFor="custom-extensions" className="text-xs">
                  Custom Extensions
                </Label>
                <Input
                  id="custom-extensions"
                  placeholder="e.g., .vue, .svelte, .astro (comma-separated)"
                  value={filters.customExtensions}
                  onChange={(e) => filters.setCustomExtensions(e.target.value)}
                  className="font-mono text-xs input-enhanced h-8 placeholder:text-muted-foreground/25"
                />
                <p className="text-xs text-muted-foreground">
                  Add custom file extensions separated by commas
                </p>
              </div>
            </CardContent>
          </Card>

          {/* File & Directory Patterns */}
          <Card className="card-enhanced">
            <CardHeader className="px-3 py-2 border-b border-border-subtle">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Filter className="h-3.5 w-3.5" />
                Pattern Filters
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Include or exclude specific files and directories
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2.5">
              <Tabs defaultValue="files" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-10 rounded-md shadow-sm">
                  <TabsTrigger
                    value="files"
                    className="gap-1.5 text-body-sm rounded-md transition-smooth"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Files
                  </TabsTrigger>
                  <TabsTrigger
                    value="directories"
                    className="gap-1.5 text-body-sm rounded-md transition-smooth"
                  >
                    <FolderOpen className="h-3.5 w-3.5" />
                    Directories
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="files" className="space-y-2.5 mt-2.5">
                  {/* Include Files */}
                  <div className="space-y-2">
                    <Label className="text-xs">Include Files</Label>
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
                        className="font-mono text-xs input-enhanced h-8 placeholder:text-muted-foreground/25"
                      />
                      <Button
                        size="icon"
                        onClick={() =>
                          handleAddPattern(
                            newIncludeFile,
                            setNewIncludeFile,
                            filters.addIncludeFile
                          )
                        }
                        className="h-8 w-8 rounded-md shadow-xs hover:shadow-sm transition-smooth"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {filters.includeFiles.map((pattern) => (
                        <Badge
                          key={pattern}
                          variant="secondary"
                          className="gap-1 py-0.5 px-2 h-auto rounded-md badge-primary"
                        >
                          <span className="font-mono text-xs">{pattern}</span>
                          <button
                            onClick={() => filters.removeIncludeFile(pattern)}
                            className="ml-1 hover:text-destructive transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Exclude Files */}
                  <div className="space-y-2">
                    <Label className="text-xs">Exclude Files</Label>
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
                        className="font-mono text-xs input-enhanced h-8 placeholder:text-muted-foreground/25"
                      />
                      <Button
                        size="icon"
                        onClick={() =>
                          handleAddPattern(
                            newExcludeFile,
                            setNewExcludeFile,
                            filters.addExcludeFile
                          )
                        }
                        className="h-8 w-8 rounded-md shadow-xs hover:shadow-sm transition-smooth"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {filters.excludeFiles.map((pattern) => (
                        <Badge
                          key={pattern}
                          variant="outline"
                          className="gap-1 py-0.5 px-2 h-auto rounded-md badge-subtle"
                        >
                          <span className="font-mono text-xs">{pattern}</span>
                          <button
                            onClick={() => filters.removeExcludeFile(pattern)}
                            className="ml-1 hover:text-destructive transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="directories" className="space-y-2.5 mt-2.5">
                  {/* Include Directories */}
                  <div className="space-y-2">
                    <Label className="text-xs">Include Directories</Label>
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
                        className="font-mono text-xs input-enhanced h-8 placeholder:text-muted-foreground/25"
                      />
                      <Button
                        size="icon"
                        onClick={() =>
                          handleAddPattern(newIncludeDir, setNewIncludeDir, filters.addIncludeDir)
                        }
                        className="h-8 w-8 rounded-md shadow-xs hover:shadow-sm transition-smooth"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {filters.includeDirs.map((pattern) => (
                        <Badge
                          key={pattern}
                          variant="secondary"
                          className="gap-1 py-0.5 px-2 h-auto rounded-md badge-primary"
                        >
                          <span className="font-mono text-xs">{pattern}</span>
                          <button
                            onClick={() => filters.removeIncludeDir(pattern)}
                            className="ml-1 hover:text-destructive transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Exclude Directories */}
                  <div className="space-y-2">
                    <Label className="text-xs">Exclude Directories</Label>
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
                        className="font-mono text-xs input-enhanced h-8 placeholder:text-muted-foreground/25"
                      />
                      <Button
                        size="icon"
                        onClick={() =>
                          handleAddPattern(newExcludeDir, setNewExcludeDir, filters.addExcludeDir)
                        }
                        className="h-8 w-8 rounded-md shadow-xs hover:shadow-sm transition-smooth"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {filters.excludeDirs.map((pattern) => (
                        <Badge
                          key={pattern}
                          variant="outline"
                          className="gap-1 py-0.5 px-2 h-auto rounded-md badge-subtle"
                        >
                          <span className="font-mono text-xs">{pattern}</span>
                          <button
                            onClick={() => filters.removeExcludeDir(pattern)}
                            className="ml-1 hover:text-destructive transition-colors"
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
          <Card className="card-enhanced">
            <CardHeader className="px-3 py-2 border-b border-border-subtle">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Eye className="h-3.5 w-3.5" />
                    Display Options
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    Configure how the output is displayed
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 button-ghost rounded-md transition-smooth"
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-80 rounded-lg shadow-lg border-border-subtle"
                  >
                    <DropdownMenuLabel className="text-xs">Token Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-3 space-y-3">
                      {/* Max Tokens */}
                      <div className="space-y-2">
                        <Label className="text-xs">Max Tokens</Label>
                        <Select
                          value={filters.maxTokens?.toString() || 'null'}
                          onValueChange={(value) => {
                            filters.setMaxTokens(value === 'null' ? null : parseInt(value));
                          }}
                        >
                          <SelectTrigger className="h-8 text-xs rounded-md">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TOKEN_PRESETS.map((preset) => (
                              <SelectItem
                                key={preset.label}
                                value={preset.value?.toString() || 'null'}
                                className="text-xs"
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
                            className="flex-1 h-8 text-xs rounded-md placeholder:text-muted-foreground/25"
                          />
                          <span className="text-xs text-muted-foreground">tokens</span>
                        </div>
                      </div>

                      {/* Token Encoder */}
                      <div className="space-y-2">
                        <Label className="text-xs">Token Encoder</Label>
                        <Select
                          value={filters.tokenEncoder}
                          onValueChange={(value) => filters.setTokenEncoder(value as TokenEncoder)}
                        >
                          <SelectTrigger className="h-8 text-xs rounded-md">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="simple" className="text-xs">
                              <div className="flex flex-col">
                                <span>Simple (Recommended)</span>
                                <span className="text-xs text-muted-foreground">
                                  Fast, lightweight, works for all models
                                </span>
                              </div>
                            </SelectItem>
                            <SelectItem value="p50k" className="text-xs">
                              <div className="flex flex-col">
                                <span>p50k (Davinci models)</span>
                                <span className="text-xs text-muted-foreground">
                                  Large vocabulary file (~1.5MB)
                                </span>
                              </div>
                            </SelectItem>
                            <SelectItem value="cl100k" className="text-xs">
                              <div className="flex flex-col">
                                <span>cl100k (GPT-4, GPT-3.5)</span>
                                <span className="text-xs text-muted-foreground">
                                  Large vocabulary file (~1.5MB)
                                </span>
                              </div>
                            </SelectItem>
                            <SelectItem value="o200k" className="text-xs">
                              <div className="flex flex-col">
                                <span>o200k (GPT-4o models)</span>
                                <span className="text-xs text-muted-foreground">
                                  Largest vocabulary file (~3MB)
                                </span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Note: Using model-specific tokenizers requires downloading large
                          vocabulary files. Use "Simple" for better performance unless you need
                          exact token counts.
                        </p>
                      </div>

                      {/* Token Limiter Strategy */}
                      <div className="space-y-2">
                        <Label className="text-xs">Token Limiter Strategy</Label>
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
                              <span className="text-xs font-medium">Truncated</span>
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
                              <span className="text-xs font-medium">Spread</span>
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
            <CardContent className="p-2.5 space-y-3">
              {/* Project Tree Depth */}
              <div className="space-y-2">
                <Label className="text-xs">Project Tree Depth</Label>
                <div className="flex items-center gap-2.5">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7 rounded-md shadow-xs hover:shadow-sm transition-smooth"
                    onClick={() => filters.setProjectTreeDepth(filters.projectTreeDepth - 1)}
                    disabled={filters.projectTreeDepth === 0}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <div className="w-10 text-center">
                    <span className="text-sm font-medium">{filters.projectTreeDepth}</span>
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7 rounded-md shadow-xs hover:shadow-sm transition-smooth"
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
                <Label className="text-xs">AI Prompt Template</Label>
                <Select value={filters.selectedPrompt} onValueChange={filters.setSelectedPrompt}>
                  <SelectTrigger className="h-8 text-xs rounded-md input-enhanced">
                    <SelectValue
                      placeholder="Select a prompt template"
                      className="text-muted-foreground/25"
                    />
                  </SelectTrigger>
                  <SelectContent className="rounded-md shadow-lg">
                    <SelectItem value="none" className="text-xs">
                      No prompt
                    </SelectItem>
                    <SelectItem value="codegen" className="text-xs">
                      Code Generation
                    </SelectItem>
                    <SelectItem value="fix" className="text-xs">
                      Fix Issues
                    </SelectItem>
                    <SelectItem value="improve" className="text-xs">
                      Improve Code
                    </SelectItem>
                    <SelectItem value="testgen" className="text-xs">
                      Generate Tests
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Prepend an AI prompt template to the markdown output
                </p>
              </div>

              {/* Line Numbers */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="line-numbers" className="text-xs">
                    Disable Line Numbers
                  </Label>
                  <p className="text-xs text-muted-foreground">Hide line numbers in code blocks</p>
                </div>
                <Checkbox
                  id="line-numbers"
                  checked={filters.disableLineNumbers}
                  onCheckedChange={filters.setDisableLineNumbers}
                  className="h-4 w-4 rounded"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
