import { create } from 'zustand';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  content?: string;
  language?: string;
  size?: number;
  tokens?: number;
  lastModified?: string;
  children?: FileNode[];
}

export interface ScrapedData {
  root: FileNode;
}

export interface ScrapedDataMetadata {
  url: string;
  scrapedAt: string;
  title?: string;
  description?: string;
}

interface ScrapedDataStore {
  scrapedData: ScrapedData | null;
  metadata: ScrapedDataMetadata | null;
  selectedFilePath: string | null;
  searchQuery: string;
  expandedPaths: Set<string>;
  urlExpandedPaths: Map<string, Set<string>>; // Store expanded paths per URL
  setScrapedData: (data: ScrapedData | null, metadata: ScrapedDataMetadata | null) => void;
  setSelectedFilePath: (path: string | null) => void;
  setSearchQuery: (query: string) => void;
  toggleExpandedPath: (path: string) => void;
  clearData: () => void;
  getFileByPath: (path: string) => FileNode | null;
  loadExpandedPathsForUrl: (url: string) => void;
  saveExpandedPathsForUrl: (url: string) => void;
}

const STORAGE_KEY = 'scraped-data-expanded-paths';

// Helper to get/set from localStorage
const getStoredExpandedPaths = (): Map<string, Set<string>> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Map();
    
    const parsed = JSON.parse(stored);
    const map = new Map<string, Set<string>>();
    
    Object.entries(parsed).forEach(([url, paths]) => {
      map.set(url, new Set(paths as string[]));
    });
    
    return map;
  } catch {
    return new Map();
  }
};

const saveStoredExpandedPaths = (map: Map<string, Set<string>>) => {
  try {
    const obj: Record<string, string[]> = {};
    map.forEach((paths, url) => {
      obj[url] = Array.from(paths);
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch {
    // Ignore localStorage errors
  }
};

export const useScrapedDataStore = create<ScrapedDataStore>((set, get) => ({
  scrapedData: null,
  metadata: null,
  selectedFilePath: null,
  searchQuery: '',
  expandedPaths: new Set<string>(),
  urlExpandedPaths: getStoredExpandedPaths(),

  setScrapedData: (data, metadata) => {
    const state = get();
    const currentUrl = state.metadata?.url;
    
    // Only reset selectedFilePath if we're switching to a different URL
    const shouldResetSelectedFile = currentUrl !== metadata?.url;
    
    // Save current expanded paths before switching
    if (currentUrl && state.expandedPaths.size > 0) {
      state.saveExpandedPathsForUrl(currentUrl);
    }
    
    set({ 
      scrapedData: data, 
      metadata,
      selectedFilePath: shouldResetSelectedFile ? null : state.selectedFilePath,
      searchQuery: '',
      expandedPaths: new Set<string>() // Will be loaded in loadExpandedPathsForUrl
    });
    
    // Load expanded paths for the new URL
    if (metadata?.url) {
      get().loadExpandedPathsForUrl(metadata.url);
    }
  },

  setSelectedFilePath: (path) => {
    set({ selectedFilePath: path });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  toggleExpandedPath: (path) => {
    set((state) => {
      const newExpandedPaths = new Set(state.expandedPaths);
      if (newExpandedPaths.has(path)) {
        newExpandedPaths.delete(path);
      } else {
        newExpandedPaths.add(path);
      }
      
      // Save to localStorage immediately
      if (state.metadata?.url) {
        const urlPaths = state.urlExpandedPaths;
        urlPaths.set(state.metadata.url, newExpandedPaths);
        saveStoredExpandedPaths(urlPaths);
      }
      
      return { expandedPaths: newExpandedPaths };
    });
  },

  clearData: () => {
    const state = get();
    
    // Save current expanded paths before clearing
    if (state.metadata?.url && state.expandedPaths.size > 0) {
      state.saveExpandedPathsForUrl(state.metadata.url);
    }
    
    set({
      scrapedData: null,
      metadata: null,
      selectedFilePath: null,
      searchQuery: '',
      expandedPaths: new Set<string>()
    });
  },

  getFileByPath: (path) => {
    const { scrapedData } = get();
    if (!scrapedData) return null;

    const findFile = (node: FileNode, targetPath: string): FileNode | null => {
      if (node.path === targetPath) return node;
      
      if (node.children) {
        for (const child of node.children) {
          const found = findFile(child, targetPath);
          if (found) return found;
        }
      }
      
      return null;
    };

    return findFile(scrapedData.root, path);
  },

  loadExpandedPathsForUrl: (url) => {
    set((state) => {
      const storedPaths = state.urlExpandedPaths.get(url);
      return {
        expandedPaths: storedPaths ? new Set(storedPaths) : new Set<string>()
      };
    });
  },

  saveExpandedPathsForUrl: (url) => {
    set((state) => {
      const newUrlPaths = new Map(state.urlExpandedPaths);
      newUrlPaths.set(url, new Set(state.expandedPaths));
      saveStoredExpandedPaths(newUrlPaths);
      return { urlExpandedPaths: newUrlPaths };
    });
  }
}));

// Helper function to search files
export const searchFiles = (node: FileNode, query: string): FileNode[] => {
  const results: FileNode[] = [];
  const lowerQuery = query.toLowerCase();

  const search = (currentNode: FileNode) => {
    if (currentNode.name.toLowerCase().includes(lowerQuery)) {
      results.push(currentNode);
    }

    if (currentNode.children) {
      currentNode.children.forEach(search);
    }
  };

  search(node);
  return results;
};