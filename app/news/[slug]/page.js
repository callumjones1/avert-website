import Link from 'next/link'
import Image from 'next/image'
import newsData from '@/data/news.json'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return newsData.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const item = newsData.find((i) => i.slug === slug)
  if (!item) return {}
  return {
    title: item.title,
    description: item.body_html?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 160),
  }
}

export default async function NewsArticle({ params }) {
  const { slug } = await params
  const item = newsData.find((i) => i.slug === slug)
  if (!item) notFound()

  const related = newsData.filter((i) => i.slug !== slug).slice(0, 3)

  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/news" className="text-white/60 hover:text-white text-sm mb-6 inline-block transition-colors font-sans">
            ← News
          </Link>
          {item.date && (
            <p className="text-white/60 text-sm mt-4 mb-3 font-sans">{item.date}</p>
          )}
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            {item.title}
          </h1>
        </div>
      </div>

      {item.hero_image && (
        <div className="max-w-4xl mx-auto px-6 pt-10">
          <div className="relative w-full h-64 md:h-80 overflow-hidden">
            <Image
              src={item.hero_image}
              alt={item.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div
          className="max-w-2xl prose-article"
          dangerouslySetInnerHTML={{ __html: item.body_html || '' }}
        />
      </div>

      {related.length > 0 && (
        <div className="bg-[#f7f7f5] border-t border-[#e2e2dc]">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <h2 className="text-lg font-bold text-[#1a1a1a] mb-6">More News</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/news/${r.slug}`}
                  className="group bg-white border border-[#e2e2dc] hover:border-[#0c7c59] p-5 transition-colors"
                >
                  {r.date && (
                    <p className="text-xs text-[#999999] uppercase tracking-wide mb-2 font-sans">{r.date}</p>
                  )}
                  <h3 className="font-bold text-[#1a1a1a] group-hover:text-[#0c7c59] leading-snug text-sm transition-colors">
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
