import Link from 'next/link'
import Image from 'next/image'
import commentary from '@/data/commentary.json'
import people from '@/data/people.json'
import { notFound } from 'next/navigation'

// Match an author name string to an AVERT researcher slug
function authorSlug(name) {
  if (!name) return null
  const norm = (s) => s.toLowerCase().replace(/[^a-z\s]/g, '').trim()
  const normed = norm(name)
  // exact match first
  const exact = people.find((p) => norm(p.name) === normed)
  if (exact) return exact.slug
  // surname match
  const surname = normed.split(' ').at(-1)
  const byLastName = people.filter((p) => norm(p.name).split(' ').at(-1) === surname)
  if (byLastName.length === 1) return byLastName[0].slug
  return null
}

export async function generateStaticParams() {
  return commentary.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const article = commentary.find((a) => a.slug === slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.body?.substring(0, 160),
  }
}

// Join lines that are clearly continuations of a sentence (link text orphans etc.)
function buildParagraphs(text) {
  const raw = text.split('\n').map((l) => l.trim()).filter(Boolean)
  if (!raw.length) return []
  const paragraphs = []
  let buf = [raw[0]]
  for (let i = 1; i < raw.length; i++) {
    const prev = buf[buf.length - 1]
    const curr = raw[i]
    const prevEndsWithTerminal = /[.!?:"]$/.test(prev)
    const currStartsLower = /^[a-z(\d]/.test(curr)
    const prevIsShort = prev.length < 60
    const currIsShort = curr.length < 60
    // join if curr is lowercase start, or either side is a short orphan without terminal punct
    if (currStartsLower || (!prevEndsWithTerminal && (prevIsShort || currIsShort))) {
      buf.push(curr)
    } else {
      paragraphs.push(buf.join(' '))
      buf = [curr]
    }
  }
  if (buf.length) paragraphs.push(buf.join(' '))
  return paragraphs
}

// Inject hyperlinks back into plain text using external_links array
function linkifyText(text, externalLinks) {
  if (!externalLinks?.length) return text
  // build lookup: link text → href
  const lookup = {}
  for (const lnk of externalLinks) {
    if (lnk.text && lnk.text.length > 3 && lnk.text.length < 120) {
      lookup[lnk.text] = lnk.href
    }
  }
  if (!Object.keys(lookup).length) return text

  // escape special regex chars in link texts, sort longest first to avoid partial matches
  const sorted = Object.keys(lookup).sort((a, b) => b.length - a.length)
  const pattern = sorted.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
  const regex = new RegExp(`(${pattern})`, 'g')

  const parts = text.split(regex)
  return parts.map((part, i) =>
    lookup[part]
      ? <a key={i} href={lookup[part]} target="_blank" rel="noopener noreferrer" className="text-[#0c7c59] underline underline-offset-2 hover:text-[#0a6b4d]">{part}</a>
      : part
  )
}

export default async function CommentaryArticle({ params }) {
  const { slug } = await params
  const article = commentary.find((a) => a.slug === slug)
  if (!article) notFound()

  // find hero image: skip AVERT logo images, take first real content image
  const heroImage = article.hero_image &&
    !article.hero_image.includes('AVERT_Primary') &&
    !article.hero_image.includes('AVERT-logo')
    ? article.hero_image
    : null

  // clean body text: strip Squarespace header cruft (Photo by, Written By, etc.)
  let body = article.body || ''
  // remove photo credit lines that appear at top
  body = body.replace(/^Photo by[\s\S]*?on\s+Unsplash\s*/i, '')
  body = body.replace(/^Written By\s*\n.+\n/im, '')
  body = body.trim()

  const paragraphs = buildParagraphs(body)

  const related = commentary.filter((a) => a.slug !== article.slug).slice(0, 3)

  const profileSlug = authorSlug(article.author)

  return (
    <>
      {/* Header */}
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/commentary" className="text-white/60 hover:text-white text-sm mb-6 inline-block transition-colors font-sans">
            ← Commentary
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mt-4 mb-5">
            {article.title}
          </h1>
          <div className="flex items-center gap-3 flex-wrap border-t border-white/20 pt-5">
            {article.author && (
              profileSlug
                ? <Link href={`/people/${profileSlug}`} className="text-sm font-bold text-white hover:text-white/80 uppercase tracking-wide font-sans transition-colors">
                    {article.author}
                  </Link>
                : <span className="text-sm font-bold text-white uppercase tracking-wide font-sans">
                    {article.author}
                  </span>
            )}
            {article.date && (
              <span className="text-white/60 text-sm font-sans">· {article.date}</span>
            )}
            {article.original_publication && (
              <span className="text-white/50 text-xs font-sans ml-auto">
                via {article.original_publication}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hero image */}
      {heroImage && (
        <div className="max-w-4xl mx-auto px-6 pt-10">
          <div className="relative w-full h-64 md:h-80 overflow-hidden bg-[#f3f3f3]">
            <Image
              src={`/images/${heroImage}`}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Article body */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="max-w-2xl">
          {paragraphs.length > 0
            ? paragraphs.map((para, i) => (
                <p key={i} className="mb-5 leading-relaxed text-[#2d2d2d] text-base">
                  {linkifyText(para, article.external_links)}
                </p>
              ))
            : <p className="text-[#999999] italic">Content unavailable — please visit the original publication.</p>
          }
        </div>

        {/* Sources */}
        {article.external_links?.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[#e2e2dc] max-w-2xl">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#999999] mb-4 font-sans">Sources & Links</h4>
            <ul className="space-y-2">
              {article.external_links
                .filter((lnk) => lnk.text && !['Unsplash', 'Franco Alva', 'Written By'].includes(lnk.text))
                .slice(0, 10)
                .map((lnk, i) => (
                  <li key={i}>
                    <a
                      href={lnk.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#0c7c59] hover:underline font-sans"
                    >
                      {lnk.text || lnk.href}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      {/* More commentary */}
      {related.length > 0 && (
        <div className="bg-[#f7f7f5] border-t border-[#e2e2dc]">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <h2 className="text-lg font-bold text-[#1a1a1a] mb-6">More Commentary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((a) => (
                <Link
                  key={a.slug}
                  href={`/commentary/${a.slug}`}
                  className="group bg-white border border-[#e2e2dc] hover:border-[#0c7c59] p-5 transition-colors"
                >
                  {a.author && (
                    <p className="text-xs font-semibold text-[#0c7c59] uppercase tracking-wide mb-2 font-sans">{a.author}</p>
                  )}
                  <h3 className="font-bold text-[#1a1a1a] group-hover:text-[#0c7c59] leading-snug text-sm transition-colors">
                    {a.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
