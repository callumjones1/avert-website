import Link from 'next/link'
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
        {/* Featured item */}
        {featured && (
          <Link
            href={`/impact/${featured.slug}`}
            className="group block border border-[#e2e2dc] hover:border-[#0c7c59] bg-white p-8 mb-10 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] font-sans">Latest</span>
              {featured.date && (
                <span className="text-xs text-[#999999] font-sans">{featured.date}</span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-[#111827] group-hover:text-[#0c7c59] leading-snug transition-colors mb-3">
              {featured.title}
            </h2>
            {featured.body && (
              <p className="text-[#717171] leading-relaxed max-w-3xl">
                {featured.body.replace(/^.+?\n/s, '').replace(/Written By[\s\S]*?\n/i, '').substring(0, 240)}…
              </p>
            )}
          </Link>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((item) => (
            <Link
              key={item.slug}
              href={`/impact/${item.slug}`}
              className="group border border-[#e2e2dc] hover:border-[#0c7c59] bg-white p-6 transition-colors"
            >
              {item.date && (
                <p className="text-xs text-[#999999] uppercase tracking-wide mb-3 font-sans">{item.date}</p>
              )}
              <h3 className="font-bold text-[#111827] group-hover:text-[#0c7c59] leading-snug transition-colors">
                {item.title}
              </h3>
              {item.body && (
                <p className="text-sm text-[#717171] mt-2 line-clamp-2 leading-relaxed">
                  {item.body.replace(/^.+?\n/s, '').replace(/Written By[\s\S]*?\n/i, '').substring(0, 120)}…
                </p>
              )}
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
