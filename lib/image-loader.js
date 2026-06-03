// Prepends basePath so next/image works under /avert-website on GitHub Pages.
// External URLs (Cloudinary, etc.) are passed through unchanged.
// When the domain switches to avert.net.au, change BASE_PATH to '' and remove basePath from next.config.mjs.
const BASE_PATH = '/avert-website'

export default function imageLoader({ src }) {
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  return `${BASE_PATH}${src}`
}
