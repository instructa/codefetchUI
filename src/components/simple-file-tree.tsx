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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';

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
}

function SimpleFileTreeNode({
  node,
  level,
  onSelect,
  selectedPath,
  expandedPaths,
  toggleExpandedPath,
}: SimpleFileTreeNodeProps) {
  const isExpanded = expandedPaths.has(node.path);
  const isSelected = selectedPath === node.path;
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = () => {
    if (node.type === 'directory') {
      toggleExpandedPath(node.path);
    } else {
      onSelect(node.path);
    }
  };

  // Skip root level rendering, directly render children
  if (level === 0 && hasChildren) {
    return (
      <>
        {node.children?.map((child) => (
          <SimpleFileTreeNode
            key={child.path}
            node={child}
            level={level + 1}
            onSelect={onSelect}
            selectedPath={selectedPath}
            expandedPaths={expandedPaths}
            toggleExpandedPath={toggleExpandedPath}
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
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {node.children?.map((child) => (
            <SimpleFileTreeNode
              key={child.path}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              selectedPath={selectedPath}
              expandedPaths={expandedPaths}
              toggleExpandedPath={toggleExpandedPath}
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
        'flex items-center gap-1.5 w-full hover:bg-accent hover:text-accent-foreground py-1 px-2 text-sm',
        isSelected && 'bg-accent text-accent-foreground'
      )}
      style={{ paddingLeft }}
    >
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
        <span className="text-sm font-medium">File Explorer</span>
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
