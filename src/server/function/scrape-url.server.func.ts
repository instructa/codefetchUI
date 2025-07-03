import { createServerFn } from '@tanstack/react-start';
import { dummyCodefetch } from '~/data/dummy-data';
import { fetch as codefetchFetch } from '@codefetch/sdk';

// Cache to store fetched data temporarily
const dataCache = new Map<string, any>();

// Helper function to split tree into chunks
function splitTreeIntoChunks(node: any, chunkSize: number = 50): any[][] {
  const chunks: any[][] = [];
  let currentChunk: any[] = [];
  
  function traverse(item: any) {
    if (currentChunk.length >= chunkSize) {
      chunks.push([...currentChunk]);
      currentChunk = [];
    }
    
    // Add node without children first
    const { children, ...nodeWithoutChildren } = item;
    currentChunk.push(nodeWithoutChildren);
    
    if (item.type === 'directory' && children) {
      children.forEach(traverse);
    }
  }
  
  traverse(node);
  
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}

// Helper function to reconstruct tree from flat structure
function reconstructTree(flatNodes: any[]): any {
  const nodeMap = new Map();
  const root = { children: [] };
  
  // First pass: create all nodes
  flatNodes.forEach(node => {
    nodeMap.set(node.path, { ...node, children: [] });
  });
  
  // Second pass: build tree structure
  flatNodes.forEach(node => {
    const currentNode = nodeMap.get(node.path);
    if (node.path === '') {
      Object.assign(root, currentNode);
    } else {
      // Find parent path
      const parentPath = node.path.split('/').slice(0, -1).join('/');
      const parent = nodeMap.get(parentPath) || root;
      if (parent.children) {
        parent.children.push(currentNode);
      }
    }
  });
  
  return root;
}

export const scrapeUrl = createServerFn({ method: 'GET' })
  .validator((input: { url: string }) => input)
  .handler(async ({ data }) => {
    const { url } = data;

    try {
      // Fetch data from codefetch
      const codefetch = await codefetchFetch({ source: url, format: 'json' });
      
      // Check if result is a FetchResult object
      if (typeof codefetch === 'string' || !('root' in codefetch)) {
        throw new Error('Invalid response from codefetch');
      }
      
      // Remove file contents to reduce payload size
      const lightweightData = {
        root: removeFileContents(codefetch.root)
      };

      return {
        success: true,
        data: lightweightData,
        metadata: {
          url,
          scrapedAt: new Date().toISOString(),
          title: (codefetch as any).metadata?.gitRepo || 'Scraped Content',
          description: `Source: ${(codefetch as any).metadata?.source || url}`,
          totalFiles: (codefetch as any).metadata?.totalFiles,
          totalSize: (codefetch as any).metadata?.totalSize,
          totalTokens: (codefetch as any).metadata?.totalTokens,
        },
      };
    } catch (error) {
      console.error('Error fetching from codefetch:', error);
      
      // Fallback to dummy data if fetch fails
      return {
        success: true,
        data: dummyCodefetch,
        metadata: {
          url,
          scrapedAt: new Date().toISOString(),
          title: 'Scraped Website (Fallback)',
          description: 'Using dummy data due to fetch error',
        },
      };
    }
  });
