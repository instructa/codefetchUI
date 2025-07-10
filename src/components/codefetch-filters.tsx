import { useState } from 'react';
import { toast } from 'sonner';
import {
  useCodefetchFilters,
  COMMON_EXTENSIONS,
  TOKEN_PRESETS,
  FILTER_PRESETS,
  type TokenEncoder,
  type TokenLimiter,
} from '~/lib/stores/codefetch-filters.store';
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
  FileCode,
  Hash,
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
} from 'lucide-react';
import { cn } from '~/lib/utils';

export function CodefetchFilters() {
  const filters = useCodefetchFilters();
  const [newIncludeFile, setNewIncludeFile] = useState('');
  const [newExcludeFile, setNewExcludeFile] = useState('');
  const [newIncludeDir, setNewIncludeDir] = useState('');
  const [newExcludeDir, setNewExcludeDir] = useState('');

  const hasModified = filters.hasModifiedFilters();

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

  const applyPreset = (presetKey: keyof typeof FILTER_PRESETS) => {
    const preset = FILTER_PRESETS[presetKey];
    filters.resetFilters();

    // Apply preset configuration
    const config = preset.config as any;
    if (config.extensions) filters.setExtensions(config.extensions);
    if (config.maxTokens !== undefined) filters.setMaxTokens(config.maxTokens);
    if (config.tokenLimiter) filters.setTokenLimiter(config.tokenLimiter);
    if (config.projectTreeDepth !== undefined) filters.setProjectTreeDepth(config.projectTreeDepth);
    if (config.disableLineNumbers !== undefined)
      filters.setDisableLineNumbers(config.disableLineNumbers);

    // Add patterns
    config.includeFiles?.forEach((pattern: string) => filters.addIncludeFile(pattern));
    config.excludeFiles?.forEach((pattern: string) => filters.addExcludeFile(pattern));
    config.includeDirs?.forEach((pattern: string) => filters.addIncludeDir(pattern));
    config.excludeDirs?.forEach((pattern: string) => filters.addExcludeDir(pattern));

    toast.success(`Applied "${preset.name}" preset`, {
      description: preset.description,
    });
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
          {/* Presets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings2 className="h-4 w-4" />
                Quick Presets
              </CardTitle>
              <CardDescription>Apply common filter configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(FILTER_PRESETS).map(([key, preset]) => (
                  <Button
                    key={key}
                    variant="outline"
                    className="justify-start h-auto py-2 px-3"
                    onClick={() => applyPreset(key as keyof typeof FILTER_PRESETS)}
                  >
                    <span className="text-left w-full block">
                      <span className="font-medium block">{preset.name}</span>
                      <span className="text-xs text-muted-foreground truncate block">
                        {preset.description}
                      </span>
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* File Extensions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileCode className="h-4 w-4" />
                File Extensions
              </CardTitle>
              <CardDescription>Select which file types to include</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {COMMON_EXTENSIONS.map((ext) => (
                  <label
                    key={ext}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                  >
                    <Checkbox
                      checked={filters.extensions.includes(ext)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          filters.setExtensions([...filters.extensions, ext]);
                        } else {
                          filters.setExtensions(filters.extensions.filter((e) => e !== ext));
                        }
                      }}
                    />
                    <span className="text-sm font-mono">{ext}</span>
                  </label>
                ))}
              </div>

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

          {/* Token Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Hash className="h-4 w-4" />
                Token Settings
              </CardTitle>
              <CardDescription>Configure token limits and encoding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                      <SelectItem key={preset.label} value={preset.value?.toString() || 'null'}>
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
                    <SelectItem value="cl100k">cl100k (GPT-4, GPT-3.5)</SelectItem>
                    <SelectItem value="p50k">p50k (Older GPT-3)</SelectItem>
                    <SelectItem value="r50k">r50k (Davinci)</SelectItem>
                    <SelectItem value="o200k">o200k (Newer OpenAI)</SelectItem>
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
              <CardTitle className="flex items-center gap-2 text-base">
                <Eye className="h-4 w-4" />
                Display Options
              </CardTitle>
              <CardDescription>Configure how the output is displayed</CardDescription>
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

          {/* Summary */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-sm">Current Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground min-w-[100px]">Extensions:</span>
                  <span className="font-mono text-xs">
                    {filters.getAppliedExtensions().join(', ') || 'None selected'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground min-w-[100px]">Max Tokens:</span>
                  <span>{filters.maxTokens || 'No limit'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground min-w-[100px]">Encoder:</span>
                  <span>{filters.tokenEncoder}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground min-w-[100px]">Strategy:</span>
                  <span>{filters.tokenLimiter}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {/* Apply Button */}
      <div className="p-4 border-t bg-background">
        <Button
          className="w-full"
          onClick={() => {
            // This demonstrates how to use the filters with the codefetch SDK
            const config = {
              extensions: filters.getAppliedExtensions(),
              maxTokens: filters.maxTokens,
              tokenEncoder: filters.tokenEncoder,
              tokenLimiter: filters.tokenLimiter,
              includeFiles: filters.includeFiles.length > 0 ? filters.includeFiles : null,
              excludeFiles: filters.excludeFiles.length > 0 ? filters.excludeFiles : null,
              includeDirs: filters.includeDirs.length > 0 ? filters.includeDirs : null,
              excludeDirs: filters.excludeDirs.length > 0 ? filters.excludeDirs : null,
              projectTree: filters.projectTreeDepth,
              disableLineNumbers: filters.disableLineNumbers,
            };

            console.log('Codefetch SDK Configuration:', config);

            // Show toast notification
            toast.success('Filters applied successfully!', {
              description: `${filters.getAppliedExtensions().length} extensions selected, ${filters.maxTokens || 'no'} token limit`,
            });

            // In a real implementation, you would pass this config to the fetch() function:
            // const result = await fetch({ source: url, ...config });
          }}
        >
          Apply Filters
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Filters will be applied when fetching code
        </p>
      </div>
    </div>
  );
}
