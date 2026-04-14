// Prepends basePath so next/image works under /avert-website on GitHub Pages.
// When the domain switches to avert.net.au, change BASE_PATH to '' and remove basePath from next.config.mjs.
const BASE_PATH = '/avert-website'

export default function imageLoader({ src }) {
  return `${BASE_PATH}${src}`
}
