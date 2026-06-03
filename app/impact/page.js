import Link from 'next/link'
import Image from 'next/image'
import impactData from '@/data/impact.json'

export const metadata = {
  title: 'News & Impact — AVERT Research Network',
  description: 'Latest news, impact, and updates from the AVERT Research Network.',
}

export default function ImpactPage() {
  const featured = impactData[0]
  const rest = impactData.slice(1)

  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">News & Impact</h1>
          <div className="w-12 h-0.5 bg-white/40 mb-4" />
          <p className="text-white/80 max-w-2xl leading-relaxed">
            Research updates, network news, funding opportunities, and impact stories from the AVERT Research Network.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        {featured && (
          <Link
            href={`/impact/${featured.slug}`}
            className="group block border border-[#e2e2dc] hover:border-[#0c7c59] bg-white mb-10 transition-colors overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {featured.hero_image && (
                <div className="relative w-full md:w-72 h-48 md:h-auto flex-shrink-0 overflow-hidden bg-[#e8f5f0]">
                  <Image
                    src={featured.hero_image}
                    alt={featured.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-semibold text-[#0c7c59] uppercase tracking-widest font-sans">Latest</span>
                  {featured.date && (
                    <span className="text-xs text-[#999999] font-sans">{featured.date}</span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-[#1a1a1a] group-hover:text-[#0c7c59] leading-snug transition-colors mb-3">
                  {featured.title}
                </h2>
                {featured.body_html && (
                  <p className="text-[#5a5a5a] leading-relaxed line-clamp-3 text-sm">
                    {featured.body_html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 280)}…
                  </p>
                )}
              </div>
            </div>
          </Link>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((item) => (
            <Link
              key={item.slug}
              href={`/impact/${item.slug}`}
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

        {impactData.length === 0 && (
          <p className="text-[#999999] italic">No items yet.</p>
        )}
      </div>
    </>
  )
}
