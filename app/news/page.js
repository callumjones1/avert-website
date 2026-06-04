import Link from 'next/link'
import Image from 'next/image'
import newsData from '@/data/news.json'

export const metadata = {
  title: 'News — AVERT Research Network',
  description: 'Latest news and updates from the AVERT Research Network.',
}

export default function NewsPage() {
  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">News</h1>
          <div className="w-12 h-0.5 bg-white/40 mb-4" />
          <p className="text-white/80 max-w-2xl leading-relaxed">
            Research updates, network news, funding opportunities, and stories from the AVERT Research Network.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsData.map((item) => (
            <Link
              key={item.slug}
              href={`/news/${item.slug}`}
              className="group border border-[#e2e2dc] hover:border-[#0c7c59] bg-white transition-colors overflow-hidden flex flex-col"
            >
              {item.hero_image && (
                <div className="relative w-full h-40 overflow-hidden bg-[#e8f5f0] flex-shrink-0">
                  <Image
                    src={item.hero_image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                {item.date && (
                  <p className="text-xs text-[#999999] uppercase tracking-wide mb-3 font-sans">{item.date}</p>
                )}
                <h3 className="font-bold text-[#1a1a1a] group-hover:text-[#0c7c59] leading-snug transition-colors flex-1">
                  {item.title}
                </h3>
                {item.body_html && (
                  <p className="text-sm text-[#717171] mt-2 line-clamp-2 leading-relaxed">
                    {item.body_html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 120)}…
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {newsData.length === 0 && (
          <p className="text-[#999999] italic">No items yet.</p>
        )}
      </div>
    </>
  )
}
