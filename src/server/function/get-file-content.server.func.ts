import { createServerFn } from '@tanstack/react-start';
import { fetch as codefetchFetch } from '@codefetch/sdk';

export const getFileContent = createServerFn({ method: 'GET' })
  .validator((input: { url: string; filePath: string }) => input)
  .handler(async ({ data }) => {
    const { url, filePath } = data;

    try {
      // Fetch data from codefetch
      const codefetch = await codefetchFetch({ source: url, format: 'json' });
      
      // Find the file in the tree
      const findFile = (node: any, path: string): any => {
        if (node.path === path) return node;
        
        if (node.children) {
          for (const child of node.children) {
            const found = findFile(child, path);
            if (found) return found;
          }
        }
        
        return null;
      };
      
      const file = findFile(codefetch.root, filePath);
      
      if (!file) {
        throw new Error('File not found');
      }
      
      return {
        success: true,
        data: file,
      };
    } catch (error) {
      console.error('Error fetching file content:', error);
      throw new Error('Failed to fetch file content');
    }
  });