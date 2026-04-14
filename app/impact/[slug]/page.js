import Link from 'next/link'
import impactData from '@/data/impact.json'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return impactData.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const item = impactData.find((i) => i.slug === slug)
  if (!item) return {}
  return {
    title: item.title,
    description: item.body?.substring(0, 160),
  }
}

function buildParagraphs(text) {
  const raw = text.split('\n').map((l) => l.trim()).filter(Boolean)
  if (!raw.length) return []
  // Remove common Squarespace cruft at top
  const cleaned = raw.filter((l) =>
    !/^Written By$/i.test(l) &&
    !/^Apple User$/i.test(l) &&
    !/^\d{1,2}\s+\w{3}$/.test(l)
  )
  const paragraphs = []
  let buf = [cleaned[0]]
  for (let i = 1; i < cleaned.length; i++) {
    const prev = buf[buf.length - 1]
    const curr = cleaned[i]
    const prevEndsTerminal = /[.!?:"]$/.test(prev)
    const currStartsLower = /^[a-z(\d]/.test(curr)
    const prevIsShort = prev.length < 60
    const currIsShort = curr.length < 60
    if (currStartsLower || (!prevEndsTerminal && (prevIsShort || currIsShort))) {
      buf.push(curr)
    } else {
      paragraphs.push(buf.join(' '))
      buf = [curr]
    }
  }
  if (buf.length) paragraphs.push(buf.join(' '))
  return paragraphs
}

export default async function ImpactArticle({ params }) {
  const { slug } = await params
  const item = impactData.find((i) => i.slug === slug)
  if (!item) notFound()

  let body = item.body || ''
  body = body.replace(/^.+?\n/s, '')
  body = body.replace(/^Written By\s*\n.+\n/im, '')
  body = body.trim()

  const paragraphs = buildParagraphs(body)
  const related = impactData.filter((i) => i.slug !== slug).slice(0, 3)

  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/impact" className="text-white/60 hover:text-white text-sm mb-6 inline-block transition-colors font-sans">
            ← News & Impact
          </Link>
          {item.date && (
            <p className="text-white/60 text-sm mt-4 mb-3 font-sans">{item.date}</p>
          )}
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            {item.title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="max-w-2xl">
          {paragraphs.length > 0
            ? paragraphs.map((p, i) => (
                <p key={i} className="mb-5 leading-relaxed text-[#2d2d2d] text-base">{p}</p>
              ))
            : <p className="text-gray-400 italic">Content unavailable.</p>
          }
        </div>
      </div>

      {related.length > 0 && (
        <div className="bg-[#f7f7f5] border-t border-[#e2e2dc]">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <h2 className="text-lg font-bold text-[#111827] mb-6">More News & Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/impact/${r.slug}`}
                  className="group bg-white border border-[#e2e2dc] hover:border-[#0c7c59] p-5 transition-colors"
                >
                  {r.date && (
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-2 font-sans">{r.date}</p>
                  )}
                  <h3 className="font-bold text-[#111827] group-hover:text-[#0c7c59] leading-snug text-sm transition-colors">
                    {r.title}
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
