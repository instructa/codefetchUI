import type { FileNode } from '~/lib/stores/scraped-data.store';

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
export function fileMatchesFilters(
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

// Filter the file tree to only include files that match the filters
export function filterFileTree(
  node: FileNode,
  filters: {
    extensions: string[];
    customExtensions: string;
    includeFiles: string[];
    excludeFiles: string[];
    includeDirs: string[];
    excludeDirs: string[];
  },
  manualSelections?: {
    checked: Set<string>;
    unchecked: Set<string>;
  }
): FileNode | null {
  if (node.type === 'file') {
    // Check manual selections first
    if (manualSelections) {
      if (manualSelections.checked.has(node.path)) return node;
      if (manualSelections.unchecked.has(node.path)) return null;
    }
    // Return the file only if it matches the filters
    return fileMatchesFilters(node, filters) ? node : null;
  }

  // For directories, recursively filter children
  if (node.children) {
    const filteredChildren = node.children
      .map((child) => filterFileTree(child, filters, manualSelections))
      .filter((child): child is FileNode => child !== null);

    // Only return directory if it has matching children
    if (filteredChildren.length > 0) {
      return {
        ...node,
        children: filteredChildren,
      };
    }
  }

  return null;
}

// Extract file extension from filename
function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === 0) return '';

  // Handle special cases like .test.ts, .spec.js, etc.
  const ext = filename.slice(lastDotIndex);
  const beforeDot = filename.slice(0, lastDotIndex);

  // Check if this might be a compound extension
  const secondLastDotIndex = beforeDot.lastIndexOf('.');
  if (secondLastDotIndex !== -1) {
    const potentialCompound = beforeDot.slice(secondLastDotIndex);
    // Common compound extensions
    if (['.test', '.spec', '.e2e', '.integration', '.unit'].includes(potentialCompound)) {
      return potentialCompound + ext;
    }
  }

  return ext;
}

// Compute unique file extensions and their frequencies from a FileNode tree
export function computeFileExtensions(node: FileNode): Array<{ ext: string; count: number }> {
  const extensionMap = new Map<string, number>();

  // Recursive function to traverse the tree
  function traverse(currentNode: FileNode) {
    if (currentNode.type === 'file') {
      const ext = getFileExtension(currentNode.name);
      if (ext) {
        extensionMap.set(ext, (extensionMap.get(ext) || 0) + 1);
      }
    } else if (currentNode.children) {
      currentNode.children.forEach(traverse);
    }
  }

  traverse(node);

  // Convert map to array and sort by count (descending) then alphabetically
  const extensions = Array.from(extensionMap.entries())
    .map(([ext, count]) => ({ ext, count }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count; // Sort by count descending
      }
      return a.ext.localeCompare(b.ext); // Sort alphabetically if counts are equal
    });

  return extensions;
}
