/**
 * Converts any standard image URL into a fast, optimized CDN URL using wsrv.nl (Cloudflare powered).
 * It will instantly resize and convert images to WebP format for fast loading.
 */
export const getOptimizedImage = (url, width = 600) => {
  if (!url) return '';
  // Don't proxy inline base64 or relative SVGs, etc.
  if (url.startsWith('data:') || url.startsWith('/')) return url;
  
  // Bypass wsrv for loremflickr because it uses redirects that wsrv sometimes fails to follow or blocks.
  if (url.includes('loremflickr.com')) return url;

  // Wsrv.nl accepts an absolute URL. 
  // output=webp guarantees modern format, default= falls back nicely if original dies.
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&output=webp&maxage=31d`;
};
