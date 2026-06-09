import sharp from 'sharp'
import { readdirSync, mkdirSync, statSync, existsSync } from 'fs'
import { join, extname } from 'path'

const SRC = 'public/headshots'
const DEST = 'public/headshots-thumb'
const WIDTH = 300

mkdirSync(DEST, { recursive: true })

const files = readdirSync(SRC).filter(f => /\.(jpe?g|png|webp)$/i.test(f))

let generated = 0
let skipped = 0

for (const file of files) {
  const src = join(SRC, file)
  const dest = join(DEST, file)

  if (existsSync(dest)) {
    const srcMtime = statSync(src).mtimeMs
    const destMtime = statSync(dest).mtimeMs
    if (destMtime >= srcMtime) { skipped++; continue }
  }

  await sharp(src)
    .resize(WIDTH, null, { withoutEnlargement: true })
    .sharpen({ sigma: 0.5 })
    .toFormat('jpeg', { quality: 85, progressive: true })
    .toFile(dest)

  generated++
}

console.log(`Thumbnails: ${generated} generated, ${skipped} up-to-date`)
