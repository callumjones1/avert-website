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
    description: article.body_html?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 160),
  }
}

export default async function CommentaryArticle({ params }) {
  const { slug } = await params
  const article = commentary.find((a) => a.slug === slug)
  if (!article) notFound()

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
      {article.hero_image && (
        <div className="max-w-4xl mx-auto px-6 pt-10">
          <div className="relative w-full h-64 md:h-80 overflow-hidden">
            <Image
              src={article.hero_image}
              alt={article.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      )}

      {/* Article body */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div
          className="max-w-2xl prose-article"
          dangerouslySetInnerHTML={{ __html: article.body_html || '' }}
        />
        {article.original_url && (
          <div className="mt-10 pt-6 border-t border-[#e2e2dc] max-w-2xl">
            <a
              href={article.original_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#0c7c59] hover:underline font-sans"
            >
              Originally published at {new URL(article.original_url).hostname.replace('www.', '')} →
            </a>
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
