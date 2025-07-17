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
  SidebarMenuButton,
  SidebarMenuItem,
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
  onSelect: (path: string) => void;
}

function FileTreeNode({ node, level, onSelect }: FileTreeNodeProps) {
  const { expandedPaths, toggleExpandedPath, selectedFilePath } = useScrapedDataStore();
  const router = useRouter();

  // Check if we're in a chat route
  const isInChatRoute = router.state.location.pathname.startsWith('/chat/');

  // Try to get search params from different route contexts
  let fileFromUrl: string | undefined;
  if (isInChatRoute) {
    try {
      // Try chat route
      const searchFromChat = useSearch({ from: '/chat/$url' }) as { file?: string };
      fileFromUrl = searchFromChat?.file ? decodeURIComponent(searchFromChat.file) : undefined;
    } catch {
      // If that fails, we're likely in a different route context
      fileFromUrl = undefined;
    }
  }

  const isExpanded = expandedPaths.has(node.path);
  const isSelected = selectedFilePath === node.path || fileFromUrl === node.path;
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = () => {
    if (node.type === 'directory') {
      toggleExpandedPath(node.path);
    } else {
      onSelect(node.path);
    }
  };

  if (level === 0) {
    // Root level
    return (
      <>
        {hasChildren &&
          node.children?.map((child) => (
            <FileTreeNode key={child.path} node={child} level={level + 1} onSelect={onSelect} />
          ))}
      </>
    );
  }

  if (level === 1) {
    // Top level items
    if (node.type === 'directory' && hasChildren) {
      return (
        <Collapsible open={isExpanded}>
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                onClick={handleToggle}
                className={cn('w-full', isSelected && 'bg-accent text-sidebar-accent-foreground')}
              >
                {isExpanded ? (
                  <ChevronDown className={cn('h-4 w-4')} />
                ) : (
                  <ChevronRight className={cn('h-4 w-4')} />
                )}
                {isExpanded ? (
                  <FolderOpen className={cn('h-4 w-4')} />
                ) : (
                  <Folder className={cn('h-4 w-4')} />
                )}
                <span className="truncate">{node.name}</span>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenu className="ml-4">
                {node.children?.map((child) => (
                  <FileTreeNode
                    key={child.path}
                    node={child}
                    level={level + 1}
                    onSelect={onSelect}
                  />
                ))}
              </SidebarMenu>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    // Top level file
    const FileIcon = getFileIcon(node.name);
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={handleToggle}
          className={cn('w-full', isSelected && 'bg-accent text-sidebar-accent-foreground')}
        >
          <FileIcon className={cn('h-4 w-4')} />
          <span className="truncate">{node.name}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // Nested items (level > 1)
  if (node.type === 'directory' && hasChildren) {
    return (
      <Collapsible open={isExpanded}>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              onClick={handleToggle}
              className={cn('w-full', isSelected && 'bg-accent text-sidebar-accent-foreground')}
            >
              {isExpanded ? (
                <ChevronDown className={cn('h-4 w-4')} />
              ) : (
                <ChevronRight className={cn('h-4 w-4')} />
              )}
              {isExpanded ? (
                <FolderOpen className={cn('h-4 w-4')} />
              ) : (
                <Folder className={cn('h-4 w-4')} />
              )}
              <span className="truncate">{node.name}</span>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenu className="ml-4">
              {node.children?.map((child) => (
                <FileTreeNode key={child.path} node={child} level={level + 1} onSelect={onSelect} />
              ))}
            </SidebarMenu>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  // Nested file
  const FileIcon = getFileIcon(node.name);
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={handleToggle}
        className={cn('w-full', isSelected && 'bg-accent text-sidebar-accent-foreground')}
      >
        <FileIcon className={cn('h-4 w-4')} />
        <span className="truncate">{node.name}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function FileTree() {
  const navigate = useNavigate();
  const router = useRouter();
  const { scrapedData, searchQuery, setSearchQuery } = useScrapedDataStore();
  const [isSearching, setIsSearching] = useState(false);

  // Check if we're in a scrape route
  const isInChatRoute = router.state.location.pathname.startsWith('/chat/');

  // Try to get params from chat route if we're in that context
  let urlParam: string | undefined;
  if (isInChatRoute) {
    try {
      const chatParams = useParams({ from: '/chat/$url' });
      urlParam = chatParams.url;
    } catch {
      // Not in chat route, that's fine
      urlParam = undefined;
    }
  }

  const handleFileSelect = (path: string) => {
    // If we have a URL param, navigate to the chat route
    if (urlParam && isInChatRoute) {
      navigate({
        to: '/chat/$url',
        params: { url: urlParam },
        search: { file: path },
      });
    } else {
      // Otherwise, just update the selected file in the store
      const { setSelectedFilePath } = useScrapedDataStore.getState();
      setSelectedFilePath(path);
    }
  };

  const filteredNodes = useMemo(() => {
    if (!scrapedData || !searchQuery) return scrapedData?.root;

    const results = searchFiles(scrapedData.root, searchQuery);
    if (results.length === 0) return null;

    // Create a filtered tree structure
    const filteredRoot: FileNode = {
      ...scrapedData.root,
      children: results,
    };

    return filteredRoot;
  }, [scrapedData, searchQuery]);

  if (!scrapedData) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center justify-between">
        <span>File Explorer</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsSearching(!isSearching)}
        >
          <Search className="h-3 w-3" />
        </Button>
      </SidebarGroupLabel>

      {isSearching && (
        <div className="px-3 pb-2">
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

      <SidebarGroupContent>
        <SidebarMenu>
          {filteredNodes ? (
            <FileTreeNode node={filteredNodes} level={0} onSelect={handleFileSelect} />
          ) : (
            <div className="px-3 py-2 text-xs text-muted-foreground">No files found</div>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
