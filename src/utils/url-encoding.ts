/**
 * URL-safe encoding utilities for route parameters
 * Uses Base64URL encoding (RFC 4648) to safely encode URLs for use in route paths
 */

/**
 * Encodes a URL to a URL-safe string that can be used in route parameters
 * @param url - The URL to encode
 * @returns Base64URL encoded string
 */
export function encodeUrlForRoute(url: string): string {
  try {
    // Convert string to base64
    const base64 = btoa(encodeURIComponent(url).replace(/%([0-9A-F]{2})/g, (_, p1) => 
      String.fromCharCode(parseInt(p1, 16))
    ));
    
    // Convert to base64url by replacing characters
    return base64
      .replace(/\+/g, '-')  // Replace + with -
      .replace(/\//g, '_')  // Replace / with _
      .replace(/=/g, '');   // Remove padding
  } catch (error) {
    console.error('Failed to encode URL:', error);
    throw new Error('Invalid URL for encoding');
  }
}

/**
 * Decodes a Base64URL encoded string back to the original URL
 * @param encoded - The Base64URL encoded string
 * @returns The original URL
 */
export function decodeUrlFromRoute(encoded: string): string {
  try {
    // Add back padding if needed
    let base64 = encoded
      .replace(/-/g, '+')  // Replace - with +
      .replace(/_/g, '/'); // Replace _ with /
    
    // Add padding
    const padding = base64.length % 4;
    if (padding) {
      base64 += '='.repeat(4 - padding);
    }
    
    // Decode from base64
    const decoded = atob(base64);
    
    // Convert back to original string
    return decodeURIComponent(decoded.split('').map(char => 
      '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
  } catch (error) {
    console.error('Failed to decode URL:', error);
    throw new Error('Invalid encoded URL');
  }
}

/**
 * Validates if a string is a properly encoded URL
 * @param encoded - The string to validate
 * @returns True if valid, false otherwise
 */
export function isValidEncodedUrl(encoded: string): boolean {
  try {
    decodeUrlFromRoute(encoded);
    return true;
  } catch {
    return false;
  }
}