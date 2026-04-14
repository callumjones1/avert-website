import Link from 'next/link'
import impactData from '@/data/impact.json'
import commentaryData from '@/data/commentary.json'
import SubscribeForm from '@/components/SubscribeForm'

export const metadata = {
  title: 'AVERT Research Network',
  description: 'A multidisciplinary research network dedicated to understanding and reducing violent extremism and radicalisation.',
}

export default function HomePage() {
  const latestImpact = impactData.slice(0, 3)
  const latestCommentary = commentaryData.slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0c7c59] text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-block border border-white/30 text-white/80 text-xs font-semibold uppercase tracking-widest px-3 py-1 mb-6 font-sans">
              Australian Research Network
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Understanding and Reducing Violent Extremism
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl">
              AVERT brings together Australia's leading social scientists and humanities researchers to produce evidence-based research that matters — for policy, practice, and public good.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/publications"
                className="bg-white text-[#0c7c59] hover:bg-white/90 px-7 py-3 text-sm font-semibold uppercase tracking-wide transition-colors font-sans"
              >
                Our Research
              </Link>
              <Link
                href="/people"
                className="border border-white/40 hover:border-white text-white/80 hover:text-white px-7 py-3 text-sm font-semibold uppercase tracking-wide transition-colors font-sans"
              >
                Meet the Researchers
              </Link>
            </div>
          </div>
        </div>
        <div className="h-px bg-white/10" />
      </section>

      {/* Mission strip */}
      <section className="bg-[#f7f7f5] border-b border-[#e2e2dc]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Multidisciplinary', desc: 'Social science, humanities, criminology, psychology, and law working together.' },
              { label: 'Evidence-Based', desc: 'Rigorous, peer-reviewed research informing policy and prevention practice.' },
              { label: 'Public Good', desc: 'Translating research findings into real-world impact for communities and government.' },
            ].map((item) => (
              <div key={item.label} className="flex gap-4 items-start">
                <div className="w-1 h-12 bg-[#0c7c59] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-[#111827] mb-1 font-sans">{item.label}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Impact */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#111827]">Latest News & Impact</h2>
            <div className="w-12 h-0.5 bg-[#0c7c59] mt-2" />
          </div>
          <Link href="/impact" className="text-sm text-[#0c7c59] hover:underline font-medium font-sans">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestImpact.map((item) => (
            <Link
              key={item.slug}
              href={`/impact/${item.slug}`}
              className="group border border-[#e2e2dc] hover:border-[#0c7c59] bg-white p-6 transition-colors"
            >
              {item.date && (
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-3 font-sans">{item.date}</p>
              )}
              <h3 className="font-bold text-[#111827] group-hover:text-[#0c7c59] leading-snug transition-colors">
                {item.title}
              </h3>
              {item.body && (
                <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                  {item.body.substring(0, 120)}…
                </p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Commentary */}
      <section className="bg-[#f7f7f5] border-t border-[#e2e2dc]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#111827]">Commentary</h2>
              <div className="w-12 h-0.5 bg-[#0c7c59] mt-2" />
            </div>
            <Link href="/commentary" className="text-sm text-[#0c7c59] hover:underline font-medium font-sans">
              All articles →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestCommentary.map((article) => (
              <Link
                key={article.slug}
                href={`/commentary/${article.slug}`}
                className="group bg-white border border-[#e2e2dc] hover:border-[#0c7c59] p-6 transition-colors"
              >
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
                <h3 className="font-bold text-[#111827] group-hover:text-[#0c7c59] leading-snug transition-colors">
                  {article.title}
                </h3>
                {article.original_publication && (
                  <p className="text-xs text-gray-400 mt-3 font-sans">
                    via {article.original_publication}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="bg-[#0c7c59] text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-xl font-bold mb-1">Stay Informed</h2>
            <p className="text-white/80 text-sm max-w-md">
              Subscribe to the AVERT newsletter for updates on research, events, and commentary.
            </p>
          </div>
          <SubscribeForm />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Join the Network</h2>
            <p className="text-gray-400 text-sm max-w-lg leading-relaxed">
              AVERT welcomes researchers committed to evidence-based approaches to violent extremism. Research and affiliate memberships are available.
            </p>
          </div>
          <div className="flex gap-4 flex-shrink-0">
            <Link
              href="/opportunities/research"
              className="bg-[#0c7c59] hover:bg-[#0a6b4d] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors font-sans"
            >
              Research Membership
            </Link>
            <Link
              href="/opportunities/affiliate"
              className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors font-sans"
            >
              Affiliate Membership
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
