import { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { cn } from '~/lib/utils';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Checkbox } from '~/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { useCodefetchFilters } from '~/lib/stores/codefetch-filters.store';

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
        childCount = counts.reduce((a, b) => a + b, 0);
      }

      return { matches, childCount };
    });
  }, [node.children, filters]);

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
          />
        ))}
      </>
    );
  }

  const paddingLeft = `${(level - 1) * 16 + 8}px`;

  if (node.type === 'directory' && hasChildren) {
    const totalMatches = childMatches.reduce(
      (acc, { matches, childCount }) => acc + (matches ? 1 : 0) + childCount,
      0
    );

    return (
      <Collapsible open={isExpanded}>
        <CollapsibleTrigger asChild>
          <button
            onClick={handleToggle}
            className={cn(
              'flex items-center gap-1.5 w-full hover:bg-accent hover:text-accent-foreground py-1 px-2 text-sm',
              isSelected && 'bg-accent text-accent-foreground'
            )}
            style={{ paddingLeft }}
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            )}
            {isExpanded ? (
              <FolderOpen className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <Folder className="h-3.5 w-3.5 shrink-0" />
            )}
            <span className="truncate">{node.name}</span>
            {totalMatches > 0 && (
              <span className="ml-auto mr-1 text-xs text-muted-foreground">({totalMatches})</span>
            )}
          </button>
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
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  // File node
  const FileIcon = getFileIcon(node.name);
  return (
    <button
      onClick={handleToggle}
      className={cn(
        'flex items-center gap-1.5 w-full hover:bg-accent hover:text-accent-foreground py-1 px-2 text-sm transition-opacity',
        isSelected && 'bg-accent text-accent-foreground',
        !matchesFilter && 'opacity-60'
      )}
      style={{ paddingLeft }}
    >
      <Checkbox
        checked={matchesFilter}
        className="h-3 w-3 pointer-events-none data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        aria-label={`File ${matchesFilter ? 'matches' : 'does not match'} current filters`}
      />
      <FileIcon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{node.name}</span>
    </button>
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
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">File Explorer</span>
          {filters.getAppliedExtensions().length > 0 && (
            <Badge
              variant={totalFilterMatches > 0 ? 'secondary' : 'outline'}
              className="text-xs"
              title="Files matching current Codefetch filters"
            >
              {totalFilterMatches} matched
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsSearching(!isSearching)}
        >
          <Search className="h-3 w-3" />
        </Button>
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
