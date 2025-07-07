import { useNavigate, useParams, useSearch, useRouter } from '@tanstack/react-router';
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
import { useScrapedDataStore, searchFiles, type FileNode } from '~/lib/stores/scraped-data.store';
import { useState, useMemo } from 'react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '~/components/ui/sidebar';
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

interface FileTreeNodeProps {
  node: FileNode;
  level: number;
  onSelect: (node: FileNode) => void;
  selectedPath?: string | null;
  expandedPaths: Set<string>;
  toggleExpanded: (path: string) => void;
}

function FileTreeNode({
  node,
  level,
  onSelect,
  selectedPath,
  expandedPaths,
  toggleExpanded,
}: FileTreeNodeProps) {
  const isExpanded = expandedPaths.has(node.path);
  const isSelected = selectedPath === node.path;
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = () => {
    if (node.type === 'directory') {
      toggleExpanded(node.path);
    } else {
      onSelect(node);
    }
  };

  if (node.type === 'directory') {
    if (!hasChildren) return null; // Don't render empty directories

    return (
      <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(node.path)}>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              onClick={handleToggle}
              style={{ paddingLeft: `${level * 1}rem` }}
              className={cn('w-full', isSelected && 'bg-accent text-sidebar-accent-foreground')}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              {isExpanded ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
              <span className="truncate">{node.name}</span>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenu>
              {node.children?.map((child) => (
                <FileTreeNode
                  key={child.path}
                  node={child}
                  level={level + 1}
                  onSelect={onSelect}
                  selectedPath={selectedPath}
                  expandedPaths={expandedPaths}
                  toggleExpanded={toggleExpanded}
                />
              ))}
            </SidebarMenu>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  // File
  const FileIcon = getFileIcon(node.name);
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={handleToggle}
        style={{ paddingLeft: `${level * 1}rem` }}
        className={cn('w-full', isSelected && 'bg-accent text-sidebar-accent-foreground')}
      >
        <FileIcon className="h-4 w-4 mr-2" />
        <span className="truncate">{node.name}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

interface FileTreeProps {
  data: FileNode | undefined;
  onFileSelect: (file: { id: string; name: string; path: string }) => void;
}

export function FileTree({ data, onFileSelect }: FileTreeProps) {
  const { selectedFilePath, setSelectedFilePath } = useScrapedDataStore();
  const [expandedPaths, setExpandedPaths] = useState(new Set<string>());

  const toggleExpanded = (path: string) => {
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

  const handleSelect = (node: FileNode) => {
    if (node.type === 'file') {
      setSelectedFilePath(node.path);
      onFileSelect({
        id: node.path,
        name: node.name,
        path: node.path,
      });
    }
  };

  if (!data) {
    return <div className="p-4 text-sm text-muted-foreground">Initializing file explorer...</div>;
  }

  return (
    <SidebarMenu>
      {data.children?.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          level={1}
          onSelect={handleSelect}
          selectedPath={selectedFilePath}
          expandedPaths={expandedPaths}
          toggleExpanded={toggleExpanded}
        />
      ))}
    </SidebarMenu>
  );
}
