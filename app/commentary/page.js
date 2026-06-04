import Link from 'next/link'
import Image from 'next/image'
import commentary from '@/data/commentary.json'

export const metadata = {
  title: 'Commentary',
  description: 'Expert analysis and commentary from AVERT researchers on violent extremism and radicalisation.',
}

function heroSrc(article) {
  if (article.hero_image && article.hero_image.startsWith('http')) {
    return article.hero_image
  }
  return null
}

export default function CommentaryPage() {
  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Commentary</h1>
          <div className="w-12 h-0.5 bg-white/40 mb-4" />
          <p className="text-white/80 max-w-2xl leading-relaxed">
            Expert analysis and public commentary from AVERT researchers on terrorism, radicalisation, and violent extremism — translating research for broader audiences.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Article grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commentary.map((article) => {
            const img = heroSrc(article)
            return (
              <Link
                key={article.slug}
                href={`/commentary/${article.slug}`}
                className="group border border-[#e2e2dc] hover:border-[#0c7c59] bg-white transition-colors overflow-hidden flex flex-col"
              >
                {img && (
                  <div className="relative w-full h-40 overflow-hidden bg-[#e8f5f0] flex-shrink-0">
                    <Image
                      src={img}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    {article.author && (
                      <span className="text-xs font-semibold text-[#0c7c59] uppercase tracking-wide font-sans">
                        {article.author}
                      </span>
                    )}
                    {article.date && (
                      <span className="text-xs text-[#999999] font-sans">{article.date}</span>
                    )}
                  </div>
                  <h3 className="font-bold text-[#1a1a1a] group-hover:text-[#0c7c59] leading-snug transition-colors flex-1">
                    {article.title}
                  </h3>
                  {!img && article.body_html && (
                    <p className="text-sm text-[#717171] mt-2 line-clamp-2 leading-relaxed">
                      {article.body_html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 120)}…
                    </p>
                  )}
                  {article.original_publication && (
                    <p className="text-xs text-[#999999] mt-3 font-sans">
                      via {article.original_publication}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
