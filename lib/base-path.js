export const BASE_PATH = ''

export function assetUrl(path) {
  if (!path || path.startsWith('http://') || path.startsWith('https://')) return path
  return `${BASE_PATH}${path}`
}
