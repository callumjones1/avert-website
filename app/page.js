import Link from 'next/link'
import Image from 'next/image'
import impactData from '@/data/impact.json'
import commentaryData from '@/data/commentary.json'
import submissionsData from '@/data/submissions.json'
import newslettersData from '@/data/newsletters.json'
import webinarsData from '@/data/webinars.json'
import SubscribeForm from '@/components/SubscribeForm'

export const metadata = {
  title: 'AVERT Research Network',
  description: 'A multidisciplinary research network dedicated to understanding and reducing violent extremism and radicalisation.',
}

// Flatten webinars across years into a chronological list (newest first)
function getLatestWebinars(n) {
  const years = Object.keys(webinarsData).sort((a, b) => Number(b) - Number(a))
  const flat = []
  for (const year of years) {
    for (const w of webinarsData[year]) {
      flat.push({ ...w, year })
      if (flat.length >= n) return flat
    }
  }
  return flat
}

// Strip HTML-like artifacts from titles
function cleanTitle(title) {
  return title.replace(/<[^>]*>/g, '').trim()
}

export default function HomePage() {
  const latestImpact = impactData
    .filter(item => !item.slug.includes('submission'))
    .slice(0, 5)
  const latestCommentary = commentaryData
    .filter(item => !item.slug.startsWith('category') && !item.slug.startsWith('tag'))
    .slice(0, 5)
  const latestSubmissions = submissionsData.slice(0, 5)
  const latestNewsletters = newslettersData.slice(0, 5)
  const latestWebinars = getLatestWebinars(5)

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

      {/* Bondi attack statement */}
      <section className="border-b border-[#e2e2dc] bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6 border-l-4 border-[#0c7c59] pl-6">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] mb-2 font-sans">AVERT Statement</p>
              <h2 className="text-xl font-bold text-[#1a1a1a] mb-2 leading-snug">
                AVERT responds to the Bondi attack
              </h2>
              <p className="text-sm text-[#5a5a5a] leading-relaxed max-w-2xl">
                AVERT researchers have been engaging publicly with analysis of the Bondi attack and its implications for understanding jihadism, IS and AQ strategy, and violent extremism in Australia. Watch our recent webinar with Dr Ali Fisher for evidence-based analysis.
              </p>
            </div>
            <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3">
              <a
                href="https://www.youtube.com/watch?v=TNpstuPkYYI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0c7c59] hover:bg-[#0a6b4d] text-white px-5 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors font-sans"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch webinar
              </a>
              <Link
                href="/impact/avert-responds-to-tragic-events-in-sydney"
                className="inline-flex items-center gap-2 border border-[#0c7c59] text-[#0c7c59] hover:bg-[#e8f5f0] px-5 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors font-sans"
              >
                Read statement
              </Link>
            </div>
          </div>
        </div>
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
                  <h3 className="font-bold text-[#1a1a1a] mb-1 font-sans">{item.label}</h3>
                  <p className="text-sm text-[#5a5a5a] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News & Impact */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1a1a1a]">Latest News & Impact</h2>
            <div className="w-12 h-0.5 bg-[#0c7c59] mt-2" />
          </div>
          <Link href="/impact" className="text-sm text-[#0c7c59] hover:underline font-medium font-sans">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestImpact.slice(0, 3).map((item) => (
            <Link
              key={item.slug}
              href={`/impact/${item.slug}`}
              className="group border border-[#e2e2dc] hover:border-[#0c7c59] bg-white transition-colors overflow-hidden flex flex-col"
            >
              {item.hero_image && (
                <div className="relative h-40 overflow-hidden bg-[#f3f3f3] flex-shrink-0">
                  <Image
                    src={`/images/${item.hero_image}`}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                {item.date && (
                  <p className="text-xs text-[#999999] uppercase tracking-wide mb-2 font-sans">{item.date}</p>
                )}
                <h3 className="font-bold text-[#1a1a1a] group-hover:text-[#0c7c59] leading-snug transition-colors flex-1">
                  {cleanTitle(item.title)}
                </h3>
                {item.body && (
                  <p className="text-sm text-[#717171] mt-2 line-clamp-2 leading-relaxed">
                    {item.body.replace(/\n/g, ' ').substring(0, 120)}…
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
        {/* Row 2 — remaining 2 items in compact list form */}
        {latestImpact.length > 3 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestImpact.slice(3).map((item) => (
              <Link
                key={item.slug}
                href={`/impact/${item.slug}`}
                className="group border border-[#e2e2dc] hover:border-[#0c7c59] bg-white p-5 transition-colors flex gap-4 items-start"
              >
                {item.hero_image && (
                  <div className="relative flex-shrink-0 w-20 h-16 overflow-hidden bg-[#f3f3f3]">
                    <Image
                      src={`/images/${item.hero_image}`}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {item.date && (
                    <p className="text-xs text-[#999999] uppercase tracking-wide mb-1 font-sans">{item.date}</p>
                  )}
                  <h3 className="font-bold text-[#1a1a1a] group-hover:text-[#0c7c59] leading-snug text-sm transition-colors line-clamp-2">
                    {cleanTitle(item.title)}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Commentary */}
      <section className="bg-[#f7f7f5] border-t border-[#e2e2dc]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a1a]">Commentary</h2>
              <div className="w-12 h-0.5 bg-[#0c7c59] mt-2" />
            </div>
            <Link href="/commentary" className="text-sm text-[#0c7c59] hover:underline font-medium font-sans">
              All articles →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestCommentary.slice(0, 3).map((article) => (
              <Link
                key={article.slug}
                href={`/commentary/${article.slug}`}
                className="group bg-white border border-[#e2e2dc] hover:border-[#0c7c59] transition-colors overflow-hidden flex flex-col"
              >
                {article.hero_image ? (
                  <div className="relative h-40 overflow-hidden bg-[#f3f3f3] flex-shrink-0">
                    <Image
                      src={`/images/${article.hero_image}`}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-[#0c7c59]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-4xl font-bold text-[#0c7c59]/20 font-sans">A</span>
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
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
                  {article.original_publication && (
                    <p className="text-xs text-[#999999] mt-3 font-sans">
                      via {article.original_publication}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          {latestCommentary.length > 3 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestCommentary.slice(3).map((article) => (
                <Link
                  key={article.slug}
                  href={`/commentary/${article.slug}`}
                  className="group bg-white border border-[#e2e2dc] hover:border-[#0c7c59] p-5 transition-colors flex gap-4 items-start"
                >
                  {article.hero_image ? (
                    <div className="relative flex-shrink-0 w-20 h-16 overflow-hidden bg-[#f3f3f3]">
                      <Image
                        src={`/images/${article.hero_image}`}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-20 h-16 bg-[#0c7c59]/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-[#0c7c59]/20 font-sans">A</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {article.author && (
                      <p className="text-xs font-semibold text-[#0c7c59] uppercase tracking-wide mb-1 font-sans">{article.author}</p>
                    )}
                    <h3 className="font-bold text-[#1a1a1a] group-hover:text-[#0c7c59] leading-snug text-sm transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    {article.original_publication && (
                      <p className="text-xs text-[#999999] mt-1 font-sans">via {article.original_publication}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Submissions */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1a1a1a]">Submissions</h2>
            <div className="w-12 h-0.5 bg-[#0c7c59] mt-2" />
          </div>
          <Link href="/impact" className="text-sm text-[#0c7c59] hover:underline font-medium font-sans">
            View all impact →
          </Link>
        </div>
        <div className="space-y-3">
          {latestSubmissions.map((item) => (
            <Link
              key={item.slug}
              href={`/impact/${item.slug}`}
              className="group flex items-start gap-5 border border-[#e2e2dc] hover:border-[#0c7c59] bg-white p-5 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-[#e8f5f0] flex items-center justify-center mt-0.5">
                <svg className="w-5 h-5 text-[#0c7c59]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                {item.date && (
                  <p className="text-xs text-[#999999] uppercase tracking-wide mb-1 font-sans">{item.date}</p>
                )}
                <h3 className="font-bold text-[#1a1a1a] group-hover:text-[#0c7c59] leading-snug transition-colors text-sm">
                  {cleanTitle(item.title)}
                </h3>
                {item.body && (
                  <p className="text-sm text-[#717171] mt-1 line-clamp-2 leading-relaxed">
                    {item.body.substring(0, 140)}…
                  </p>
                )}
              </div>
              <span className="flex-shrink-0 text-[#0c7c59] text-sm font-sans mt-0.5">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Webinars */}
      <section className="bg-[#f7f7f5] border-t border-[#e2e2dc]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a1a]">Recent Webinars</h2>
              <div className="w-12 h-0.5 bg-[#0c7c59] mt-2" />
            </div>
            <Link href="/events/webinars" className="text-sm text-[#0c7c59] hover:underline font-medium font-sans">
              Full archive →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {latestWebinars.map((w, i) => (
              w.videoId ? (
                <a
                  key={i}
                  href={`https://www.youtube.com/watch?v=${w.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="relative w-full overflow-hidden bg-[#111]" style={{ paddingBottom: '56.25%' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://img.youtube.com/vi/${w.videoId}/hqdefault.jpg`}
                      alt={w.title}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-75"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-[#ff0000] rounded-full flex items-center justify-center shadow-lg opacity-90 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-[#999999] font-sans mb-1">{w.year}</p>
                    <p className="text-sm font-medium text-[#2d2d2d] group-hover:text-[#0c7c59] leading-snug line-clamp-3 transition-colors duration-150 font-sans">
                      {w.title}
                    </p>
                  </div>
                </a>
              ) : (
                <div key={i} className="block">
                  <div className="relative w-full bg-[#ebebeb] border border-[#e2e2dc] flex items-center justify-center" style={{ paddingBottom: '56.25%' }}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                      <svg className="w-6 h-6 text-[#c0c0c0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.862v6.276a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs text-[#b0b0b0] font-sans">No recording</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-[#999999] font-sans mb-1">{w.year}</p>
                    <p className="text-sm font-medium text-[#888888] leading-snug line-clamp-3 font-sans">
                      {w.title}
                    </p>
                  </div>
                </div>
              )
            ))}
          </div>
          <div className="mt-8">
            <Link href="/events" className="text-sm text-[#0c7c59] hover:underline font-medium font-sans">
              Upcoming events →
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Newsletters */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1a1a1a]">Newsletters</h2>
            <div className="w-12 h-0.5 bg-[#0c7c59] mt-2" />
          </div>
          <a
            href="https://www.avert.net.au/newsletter"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#0c7c59] hover:underline font-medium font-sans"
          >
            All newsletters →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestNewsletters.map((nl) => {
            const isExternal = nl.url.startsWith('http')
            return (
            <a
              key={nl.slug}
              href={nl.url}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className="group flex items-center gap-4 border border-[#e2e2dc] hover:border-[#0c7c59] bg-white p-5 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-[#e8f5f0] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#0c7c59]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#1a1a1a] group-hover:text-[#0c7c59] text-sm leading-snug transition-colors font-sans">
                  {nl.title}
                </p>
                <p className="text-xs text-[#999999] mt-0.5 font-sans">{nl.date}</p>
              </div>
              <span className="flex-shrink-0 text-[#0c7c59] text-sm font-sans">→</span>
            </a>
            )
          })}
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
            <p className="text-[#999999] text-sm max-w-lg leading-relaxed">
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
              className="border border-[#5a5a5a] hover:border-[#999999] text-[#cccccc] hover:text-white px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors font-sans"
            >
              Affiliate Membership
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
