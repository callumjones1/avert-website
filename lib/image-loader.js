import { BASE_PATH } from './base-path.js'

export default function imageLoader({ src }) {
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  return `${BASE_PATH}${src}`
}
