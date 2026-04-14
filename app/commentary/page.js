import Link from 'next/link'
import Image from 'next/image'
import commentary from '@/data/commentary.json'

export const metadata = {
  title: 'Commentary',
  description: 'Expert analysis and commentary from AVERT researchers on violent extremism and radicalisation.',
}

function heroSrc(article) {
  if (
    article.hero_image &&
    !article.hero_image.includes('AVERT_Primary') &&
    !article.hero_image.includes('AVERT-logo') &&
    !article.hero_image.endsWith('.gif')
  ) {
    return `/images/${article.hero_image}`
  }
  return null
}

export default function CommentaryPage() {
  const featured = commentary[0]
  const rest = commentary.slice(1)

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
        {/* Featured */}
        {featured && (
          <Link
            href={`/commentary/${featured.slug}`}
            className="group block border border-[#e2e2dc] hover:border-[#0c7c59] bg-white mb-8 transition-colors overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {heroSrc(featured) && (
                <div className="relative w-full md:w-72 h-48 md:h-auto flex-shrink-0 overflow-hidden bg-[#e8f5f0]">
                  <Image
                    src={heroSrc(featured)}
                    alt={featured.title}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 288px"
                  />
                </div>
              )}
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-semibold text-[#0c7c59] uppercase tracking-widest font-sans">Featured</span>
                  {featured.date && (
                    <span className="text-xs text-gray-400 font-sans">{featured.date}</span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-[#1a1a1a] group-hover:text-[#0c7c59] leading-snug transition-colors mb-3">
                  {featured.title}
                </h2>
                {featured.author && (
                  <p className="text-sm font-semibold text-[#0c7c59] mb-3 font-sans">By {featured.author}</p>
                )}
                {featured.body && (
                  <p className="text-gray-600 leading-relaxed line-clamp-3 text-sm">
                    {featured.body.replace(/^.+?\n/s, '').replace(/Written By[\s\S]*?\n/i, '').substring(0, 280)}…
                  </p>
                )}
                {featured.original_publication && (
                  <p className="text-xs text-gray-400 mt-4 font-sans">
                    Originally published in {featured.original_publication}
                  </p>
                )}
              </div>
            </div>
          </Link>
        )}

        {/* Article grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((article) => {
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
                      <span className="text-xs text-gray-400 font-sans">{article.date}</span>
                    )}
                  </div>
                  <h3 className="font-bold text-[#1a1a1a] group-hover:text-[#0c7c59] leading-snug transition-colors flex-1">
                    {article.title}
                  </h3>
                  {!img && article.body && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                      {article.body.replace(/^.+?\n/s, '').substring(0, 120)}…
                    </p>
                  )}
                  {article.original_publication && (
                    <p className="text-xs text-gray-400 mt-3 font-sans">
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
