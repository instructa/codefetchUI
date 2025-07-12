import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  FileText,
  FileCode,
  FileJson,
  FileImage,
  Search,
  X,
  CheckSquare,
  Square,
  RotateCcw,
} from 'lucide-react';
import { cn } from '~/lib/utils';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Checkbox } from '~/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { useCodefetchFilters } from '~/lib/stores/codefetch-filters.store';
import { useScrapedDataStore } from '~/lib/stores/scraped-data.store';

// Simple pattern matching function for basic glob patterns
function matchesPattern(filePath: string, pattern: string): boolean {
  // Convert glob pattern to regex
  const regexPattern = pattern
    .replace(/\./g, '\\.')
    .replace(/\*\*/g, '___DOUBLE_STAR___') // Temporarily replace ** to avoid conflict
    .replace(/\*/g, '[^/]*') // Single * matches anything except /
    .replace(/___DOUBLE_STAR___/g, '.*') // ** matches anything including /
    .replace(/\?/g, '.');

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(filePath);
}

// Check if a file matches the codefetch filters
function fileMatchesFilters(
  node: FileNode,
  filters: {
    extensions: string[];
    customExtensions: string;
    includeFiles: string[];
    excludeFiles: string[];
    includeDirs: string[];
    excludeDirs: string[];
  }
): boolean {
  if (node.type === 'directory') return false;

  // Check file extension
  const fileExt = '.' + (node.name.split('.').pop()?.toLowerCase() || '');
  const appliedExtensions = [...filters.extensions];

  // Add custom extensions
  if (filters.customExtensions) {
    const customExts = filters.customExtensions
      .split(',')
      .map((ext) => ext.trim())
      .filter((ext) => ext && ext.startsWith('.'));
    appliedExtensions.push(...customExts);
  }

  // If no extensions are selected, consider all files as not matching
  if (appliedExtensions.length === 0) return false;

  // Check if file extension matches
  let matches = appliedExtensions.includes(fileExt);

  // Check exclude patterns
  if (matches && filters.excludeFiles.length > 0) {
    for (const pattern of filters.excludeFiles) {
      if (matchesPattern(node.path, pattern) || matchesPattern(node.name, pattern)) {
        matches = false;
        break;
      }
    }
  }

  // Check include patterns (overrides extension check if specified)
  if (filters.includeFiles.length > 0) {
    for (const pattern of filters.includeFiles) {
      if (matchesPattern(node.path, pattern) || matchesPattern(node.name, pattern)) {
        matches = true;
        break;
      }
    }
  }

  // Check directory patterns
  const pathParts = node.path.split('/');
  pathParts.pop(); // Remove filename
  const dirPath = pathParts.join('/');

  // Check exclude directories
  if (matches && filters.excludeDirs.length > 0) {
    for (const pattern of filters.excludeDirs) {
      for (let i = 0; i < pathParts.length; i++) {
        const checkPath = pathParts.slice(0, i + 1).join('/') + '/';
        if (matchesPattern(checkPath, pattern) || matchesPattern(pathParts[i] + '/', pattern)) {
          matches = false;
          break;
        }
      }
    }
  }

  // Check include directories
  if (filters.includeDirs.length > 0) {
    let inIncludedDir = false;
    for (const pattern of filters.includeDirs) {
      for (let i = 0; i < pathParts.length; i++) {
        const checkPath = pathParts.slice(0, i + 1).join('/') + '/';
        if (matchesPattern(checkPath, pattern) || matchesPattern(pathParts[i] + '/', pattern)) {
          inIncludedDir = true;
          break;
        }
      }
    }
    if (!inIncludedDir) matches = false;
  }

  return matches;
}

// Get file icon based on file extension
const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
    case 'vue':
    case 'py':
    case 'rb':
    case 'go':
    case 'rs':
    case 'java':
    case 'cpp':
    case 'c':
    case 'h':
    case 'cs':
    case 'php':
      return FileCode;
    case 'json':
    case 'yaml':
    case 'yml':
    case 'toml':
    case 'xml':
      return FileJson;
    case 'md':
    case 'mdx':
    case 'txt':
    case 'rst':
    case 'doc':
    case 'docx':
      return FileText;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
    case 'webp':
    case 'ico':
      return FileImage;
    default:
      return File;
  }
};

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  content?: string;
  size?: number;
  language?: string;
  lastModified?: string;
}

interface SimpleFileTreeNodeProps {
  node: FileNode;
  level: number;
  onSelect: (path: string) => void;
  selectedPath?: string;
  expandedPaths: Set<string>;
  toggleExpandedPath: (path: string) => void;
  matchesFilter?: boolean;
  childrenMatchCount?: number;
  manualSelections: {
    checked: Set<string>;
    unchecked: Set<string>;
  };
  onManualSelectionChange: (path: string, isDirectory: boolean) => void;
}

function SimpleFileTreeNode({
  node,
  level,
  onSelect,
  selectedPath,
  expandedPaths,
  toggleExpandedPath,
  matchesFilter = false,
  childrenMatchCount = 0,
  manualSelections,
  onManualSelectionChange,
}: SimpleFileTreeNodeProps) {
  const isExpanded = expandedPaths.has(node.path);
  const isSelected = selectedPath === node.path;
  const hasChildren = node.children && node.children.length > 0;
  const filters = useCodefetchFilters();

  const handleToggle = () => {
    if (node.type === 'directory') {
      toggleExpandedPath(node.path);
    } else {
      onSelect(node.path);
    }
  };

  // Calculate matches for children
  const childMatches = useMemo(() => {
    if (!hasChildren) return [];

    return node.children!.map((child) => {
      const matches = child.type === 'file' ? fileMatchesFilters(child, filters) : false;
      let childCount = 0;

      if (child.children) {
        const counts = child.children.map((grandchild) =>
          grandchild.type === 'file' ? (fileMatchesFilters(grandchild, filters) ? 1 : 0) : 0
        );
        childCount = counts.reduce((a: number, b: number) => a + b, 0);
      }

      return { matches, childCount };
    });
  }, [node.children, filters]);

  // Calculate how many children are actually checked
  const checkedChildrenCount = useMemo(() => {
    if (!hasChildren) return 0;

    const countChecked = (n: FileNode): number => {
      if (n.type === 'file') {
        if (manualSelections.checked.has(n.path)) return 1;
        if (manualSelections.unchecked.has(n.path)) return 0;
        return fileMatchesFilters(n, filters) ? 1 : 0;
      }
      if (n.children) {
        return n.children.reduce((acc, child) => acc + countChecked(child), 0);
      }
      return 0;
    };

    return node.children!.reduce((acc, child) => acc + countChecked(child), 0);
  }, [node.children, filters, manualSelections]);

  // Determine checkbox state
  const getCheckboxState = (): boolean | 'indeterminate' => {
    if (manualSelections.checked.has(node.path)) {
      return true;
    }
    if (manualSelections.unchecked.has(node.path)) {
      return false;
    }
    if (node.type === 'file') {
      return matchesFilter;
    }
    // For directories, check if all/some children are selected
    if (hasChildren) {
      let checkedCount = 0;
      let totalCount = 0;

      const countChildrenState = (n: FileNode): { checked: number; total: number } => {
        if (n.type === 'file') {
          totalCount++;
          if (manualSelections.checked.has(n.path)) {
            checkedCount++;
          } else if (!manualSelections.unchecked.has(n.path) && fileMatchesFilters(n, filters)) {
            checkedCount++;
          }
          return { checked: checkedCount, total: totalCount };
        }
        if (n.children) {
          n.children.forEach((child) => countChildrenState(child));
        }
        return { checked: checkedCount, total: totalCount };
      };

      node.children!.forEach((child) => countChildrenState(child));

      if (checkedCount === totalCount && totalCount > 0) return true;
      if (checkedCount > 0) return 'indeterminate';
      return false;
    }
    return false;
  };

  const checkboxState = getCheckboxState();

  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    onManualSelectionChange(node.path, node.type === 'directory');
  };

  // Skip root level rendering, directly render children
  if (level === 0 && hasChildren) {
    return (
      <>
        {node.children?.map((child, index) => (
          <SimpleFileTreeNode
            key={child.path}
            node={child}
            level={level + 1}
            onSelect={onSelect}
            selectedPath={selectedPath}
            expandedPaths={expandedPaths}
            toggleExpandedPath={toggleExpandedPath}
            matchesFilter={childMatches[index]?.matches || false}
            childrenMatchCount={childMatches[index]?.childCount || 0}
            manualSelections={manualSelections}
            onManualSelectionChange={onManualSelectionChange}
          />
        ))}
      </>
    );
  }

  const paddingLeft = `${(level - 1) * 16 + 8}px`;

  if (node.type === 'directory' && hasChildren) {
    return (
      <Collapsible open={isExpanded}>
        <CollapsibleTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            onClick={handleToggle}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggle();
              }
            }}
            className={cn(
              'flex items-center gap-1.5 w-full hover:bg-accent hover:text-accent-foreground py-1 px-2 text-sm cursor-pointer',
              isSelected && 'bg-accent text-accent-foreground',
              !checkedChildrenCount && 'opacity-70'
            )}
            style={{ paddingLeft }}
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            )}
            <Checkbox
              checked={checkboxState === true}
              onClick={handleCheckboxChange}
              className="size-3.5 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              aria-label={`Directory selection`}
            />
            {isExpanded ? (
              <FolderOpen className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <Folder className="h-3.5 w-3.5 shrink-0" />
            )}
            <span className="truncate">{node.name}</span>
            {checkedChildrenCount > 0 && (
              <span className="ml-auto mr-1 text-xs text-muted-foreground">
                ({checkedChildrenCount})
              </span>
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {node.children?.map((child, index) => (
            <SimpleFileTreeNode
              key={child.path}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              selectedPath={selectedPath}
              expandedPaths={expandedPaths}
              toggleExpandedPath={toggleExpandedPath}
              matchesFilter={childMatches[index]?.matches || false}
              childrenMatchCount={childMatches[index]?.childCount || 0}
              manualSelections={manualSelections}
              onManualSelectionChange={onManualSelectionChange}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  // File node
  const FileIcon = getFileIcon(node.name);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      }}
      className={cn(
        'flex items-center gap-1.5 w-full hover:bg-accent hover:text-accent-foreground py-1 px-2 text-sm transition-opacity cursor-pointer',
        isSelected && 'bg-accent text-accent-foreground',
        !checkboxState && 'opacity-70'
      )}
      style={{ paddingLeft }}
    >
      <Checkbox
        checked={checkboxState === true}
        onClick={handleCheckboxChange}
        className="size-3.5 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        aria-label={`${node.type === 'directory' ? 'Directory' : 'File'} selection`}
      />
      <FileIcon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{node.name}</span>
    </div>
  );
}

interface SimpleFileTreeProps {
  data?: FileNode;
  onFileSelect: (file: { id: string; name: string; path: string }) => void;
  selectedPath?: string;
}

// Helper function to search files
function searchFiles(node: FileNode, query: string): FileNode[] {
  const results: FileNode[] = [];
  const lowerQuery = query.toLowerCase();

  function traverse(current: FileNode) {
    if (current.name.toLowerCase().includes(lowerQuery)) {
      results.push(current);
    }

    if (current.children) {
      current.children.forEach(traverse);
    }
  }

  if (node.children) {
    node.children.forEach(traverse);
  }

  return results;
}

export function SimpleFileTree({ data, onFileSelect, selectedPath }: SimpleFileTreeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const filters = useCodefetchFilters();
  const [prevFilters, setPrevFilters] = useState(filters);
  const { manualSelections, setManualSelections } = useScrapedDataStore();

  // Reset manual selections when filters change
  useEffect(() => {
    const hasFiltersChanged = JSON.stringify(filters) !== JSON.stringify(prevFilters);
    if (hasFiltersChanged) {
      setManualSelections({ checked: new Set(), unchecked: new Set() });
      setPrevFilters(filters);
    }
  }, [filters, prevFilters, setManualSelections]);

  // Calculate initial matches for root level
  const rootChildMatches = useMemo(() => {
    if (!data?.children) return [];

    return data.children.map((child) => {
      const matches = child.type === 'file' ? fileMatchesFilters(child, filters) : false;
      let childCount = 0;

      const countMatches = (node: FileNode): number => {
        if (node.type === 'file') {
          return fileMatchesFilters(node, filters) ? 1 : 0;
        }
        if (node.children) {
          return node.children.reduce((acc, child) => acc + countMatches(child), 0);
        }
        return 0;
      };

      if (child.children) {
        childCount = countMatches(child);
      }

      return { matches, childCount };
    });
  }, [data, filters]);

  // Count total matches in the entire tree
  const totalFilterMatches = useMemo(() => {
    if (!data) return 0;

    const countMatches = (node: FileNode): number => {
      if (node.type === 'file') {
        return fileMatchesFilters(node, filters) ? 1 : 0;
      }
      if (node.children) {
        return node.children.reduce((acc, child) => acc + countMatches(child), 0);
      }
      return 0;
    };

    return countMatches(data);
  }, [data, filters]);

  // Count selected files (including manual selections)
  const selectedCount = useMemo(() => {
    if (!data) return 0;

    const countSelected = (node: FileNode): number => {
      if (node.type === 'file') {
        if (manualSelections.checked.has(node.path)) return 1;
        if (manualSelections.unchecked.has(node.path)) return 0;
        return fileMatchesFilters(node, filters) ? 1 : 0;
      }
      if (node.children) {
        return node.children.reduce((acc, child) => acc + countSelected(child), 0);
      }
      return 0;
    };

    return countSelected(data);
  }, [data, filters, manualSelections]);

  const toggleExpandedPath = (path: string) => {
    setExpandedPaths((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const handleFileSelect = (path: string) => {
    const file = findFileByPath(data, path);
    if (file && file.type === 'file') {
      onFileSelect({
        id: file.path,
        name: file.name,
        path: file.path,
      });
    }
  };

  // Handle manual selection changes
  const handleManualSelectionChange = useCallback(
    (path: string, isDirectory: boolean) => {
      const node = findFileByPath(data, path);
      if (!node) return;

      const newChecked = new Set(manualSelections.checked);
      const newUnchecked = new Set(manualSelections.unchecked);

      // Toggle current node
      const wasManuallyChecked = newChecked.has(path);
      const wasManuallyUnchecked = newUnchecked.has(path);
      const wasFilterChecked = node.type === 'file' ? fileMatchesFilters(node, filters) : false;

      if (wasManuallyChecked) {
        newChecked.delete(path);
        if (!wasFilterChecked) {
          newUnchecked.add(path);
        }
      } else if (wasManuallyUnchecked) {
        newUnchecked.delete(path);
        if (wasFilterChecked) {
          // Return to filter state
        } else {
          newChecked.add(path);
        }
      } else {
        if (wasFilterChecked) {
          newUnchecked.add(path);
        } else {
          newChecked.add(path);
        }
      }

      // If directory, cascade to children
      if (isDirectory && node.children) {
        // Determine if we should check or uncheck all children
        const shouldCheck = newChecked.has(path);

        const cascadeToChildren = (n: FileNode) => {
          if (n.type === 'file') {
            if (shouldCheck) {
              newChecked.add(n.path);
              newUnchecked.delete(n.path);
            } else {
              newUnchecked.add(n.path);
              newChecked.delete(n.path);
            }
          }
          if (n.children) {
            n.children.forEach((child) => cascadeToChildren(child));
          }
        };

        node.children.forEach((child) => cascadeToChildren(child));
      }

      setManualSelections({ checked: newChecked, unchecked: newUnchecked });
    },
    [data, filters, manualSelections, setManualSelections]
  );

  // Select all files
  const handleSelectAll = useCallback(() => {
    if (!data) return;

    const newChecked = new Set<string>();
    const collectAllFiles = (node: FileNode) => {
      if (node.type === 'file') {
        newChecked.add(node.path);
      }
      if (node.children) {
        node.children.forEach(collectAllFiles);
      }
    };

    collectAllFiles(data);
    setManualSelections({ checked: newChecked, unchecked: new Set() });
  }, [data]);

  // Deselect all files
  const handleDeselectAll = useCallback(() => {
    if (!data) return;

    const newUnchecked = new Set<string>();
    const collectAllFiles = (node: FileNode) => {
      if (node.type === 'file') {
        newUnchecked.add(node.path);
      }
      if (node.children) {
        node.children.forEach(collectAllFiles);
      }
    };

    collectAllFiles(data);
    setManualSelections({ checked: new Set(), unchecked: newUnchecked });
  }, [data]);

  // Reset to filter state
  const handleReset = useCallback(() => {
    setManualSelections({ checked: new Set(), unchecked: new Set() });
  }, []);

  const filteredNodes = useMemo(() => {
    if (!data || !searchQuery) return data;

    const results = searchFiles(data, searchQuery);
    if (results.length === 0) return null;

    // Create a filtered tree structure
    const filteredRoot: FileNode = {
      ...data,
      children: results,
    };

    return filteredRoot;
  }, [data, searchQuery]);

  if (!data) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-2 p-2 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">File Explorer</span>
            <Badge variant="default" className="text-xs" title="Total selected files">
              {selectedCount} selected
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={handleReset}
              disabled={
                manualSelections.checked.size === 0 && manualSelections.unchecked.size === 0
              }
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsSearching(!isSearching)}
            >
              <Search className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleSelectAll}>
            <CheckSquare className="h-3 w-3 mr-1" />
            Select All
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleDeselectAll}>
            <Square className="h-3 w-3 mr-1" />
            Deselect All
          </Button>
        </div>
      </div>

      {isSearching && (
        <div className="p-2 border-b">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 text-xs pr-8"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-7 w-7"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {filteredNodes ? (
          <SimpleFileTreeNode
            node={filteredNodes}
            level={0}
            onSelect={handleFileSelect}
            selectedPath={selectedPath}
            expandedPaths={expandedPaths}
            toggleExpandedPath={toggleExpandedPath}
            manualSelections={manualSelections}
            onManualSelectionChange={handleManualSelectionChange}
          />
        ) : (
          <div className="px-3 py-2 text-xs text-muted-foreground">No files found</div>
        )}
      </div>
    </div>
  );
}

// Helper function to find a file by path
function findFileByPath(node: FileNode | undefined, path: string): FileNode | undefined {
  if (!node) return undefined;

  if (node.path === path) return node;

  if (node.children) {
    for (const child of node.children) {
      const found = findFileByPath(child, path);
      if (found) return found;
    }
  }

  return undefined;
}
