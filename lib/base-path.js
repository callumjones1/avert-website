// Prefix for all local static assets on GitHub Pages.
// Remove (set to '') when avert.net.au points at this repo and basePath is removed from next.config.mjs.
export const BASE_PATH = '/avert-website'

export function assetUrl(path) {
  if (!path || path.startsWith('http://') || path.startsWith('https://')) return path
  return `${BASE_PATH}${path}`
}
