import Link from 'next/link'
import Image from 'next/image'
import impactData from '@/data/impact.json'
import commentaryData from '@/data/commentary.json'
import webinarsData from '@/data/webinars.json'
import eventsData from '@/data/events.json'
import SubscribeForm from '@/components/SubscribeForm'

export const metadata = {
  title: 'AVERT Research Network',
  description: 'A multidisciplinary research network dedicated to understanding and reducing violent extremism and radicalisation.',
}

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

function cleanTitle(title) {
  return title.replace(/<[^>]*>/g, '').trim()
}

function getPreview(body, title) {
  if (!body) return ''
  const lines = body.split('\n').map(l => l.trim()).filter(Boolean)
  const junk = new RegExp(
    [
      '^Written By$',
      '^Apple User$',
      '^AVERT Research Network$',
      '^Lydia Khalil$',
      // short date lines like "17 Apr" or "3 May"
      '^\\d{1,2}\\s+\\w{3,}$',
      // photo credits — lines containing "on Unsplash" or "Photo:"
      'on Unsplash',
      '^Photo:',
      // lines that are just the title repeated
    ].join('|'),
    'i'
  )
  const titleNorm = title?.toLowerCase().trim() ?? ''
  const candidates = lines.filter(l =>
    !junk.test(l) &&
    l.toLowerCase().trim() !== titleNorm &&
    l.length > 40
  )
  const first = candidates[0] ?? ''
  return first.length > 180 ? first.substring(0, 180) + '…' : first
}

export default function HomePage() {
  const newsItems = impactData
    .filter(item => !item.slug.includes('submission'))
    .slice(0, 4)

  const latestCommentary = commentaryData
    .filter(item => !item.slug.startsWith('category') && !item.slug.startsWith('tag'))
    .slice(0, 3)

  const latestWebinars = getLatestWebinars(6)

  const nextEvent = eventsData.find(e => e.type === 'upcoming') || null

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0c7c59] text-white">
        <div className="max-w-[1440px] mx-auto px-6 py-14 md:py-20">
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
              <a
                href="#newsletter"
                className="border border-white/40 hover:border-white text-white/80 hover:text-white px-7 py-3 text-sm font-semibold uppercase tracking-wide transition-colors font-sans"
              >
                Stay Informed
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* News & Events */}
      <section className="max-w-[1440px] mx-auto px-6 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1a1a1a]">News & Events</h2>
            <div className="w-12 h-0.5 bg-[#0c7c59] mt-2" />
          </div>
          <Link href="/impact" className="text-sm text-[#0c7c59] hover:underline font-medium font-sans">
            All news →
          </Link>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* News 2×2 grid */}
          <div className="lg:w-[63%] min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {newsItems.map((item) => (
                <Link
                  key={item.slug}
                  href={`/impact/${item.slug}`}
                  className="group border border-[#e2e2dc] hover:border-[#0c7c59] bg-white p-6 transition-colors"
                >
                  {item.date && (
                    <p className="text-xs text-[#999999] uppercase tracking-wide mb-3 font-sans">{item.date}</p>
                  )}
                  <h3 className="font-bold text-[#1a1a1a] group-hover:text-[#0c7c59] leading-snug transition-colors">
                    {cleanTitle(item.title)}
                  </h3>
                  {item.body && (
                    <p className="text-sm text-[#717171] mt-2 line-clamp-2 leading-relaxed">
                      {getPreview(item.body, item.title)}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Next event panel */}
          {nextEvent && (
            <div className="lg:w-[33%] flex-shrink-0">
              <div className="flex items-baseline justify-between mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] font-sans">Next Event</p>
                <Link href="/events" className="text-xs text-[#0c7c59] hover:underline font-sans font-medium">
                  All events →
                </Link>
              </div>
              <div className="border border-[#e2e2dc] bg-white overflow-hidden">
                {nextEvent.date_aedt && (
                  <div className="bg-[#0c7c59] text-white px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wide font-sans opacity-80">AEDT</p>
                    <p className="text-sm font-bold mt-1 font-sans leading-snug">{nextEvent.date_aedt}</p>
                  </div>
                )}
                {nextEvent.speaker_image && (
                  <div className="relative w-full overflow-hidden bg-[#f3f3f3]" style={{ height: '140px' }}>
                    <Image
                      src={`/images/${nextEvent.speaker_image}`}
                      alt={nextEvent.speaker || 'Speaker'}
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {nextEvent.platform && (
                      <span className="text-xs bg-[#e8f5f0] text-[#0c7c59] px-1.5 py-0.5 font-semibold font-sans">{nextEvent.platform}</span>
                    )}
                    {nextEvent.format && (
                      <span className="text-xs bg-[#ebebeb] text-[#717171] px-1.5 py-0.5 font-sans">{nextEvent.format}</span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-[#1a1a1a] mb-1 leading-snug">{nextEvent.title}</h3>
                  {nextEvent.speaker && (
                    <p className="text-xs font-semibold text-[#0c7c59] font-sans">{nextEvent.speaker}</p>
                  )}
                  {nextEvent.speaker_title && (
                    <p className="text-xs text-[#717171] font-sans mt-0.5 leading-snug">{nextEvent.speaker_title}</p>
                  )}
                  {nextEvent.register_url && (
                    <a
                      href={nextEvent.register_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 bg-[#0c7c59] hover:bg-[#0a6b4d] text-white px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors font-sans"
                    >
                      Register →
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Commentary */}
      <section className="bg-[#f7f7f5] border-t border-[#e2e2dc]">
        <div className="max-w-[1440px] mx-auto px-6 py-16">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#1a1a1a]">Commentary</h2>
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
                className="group bg-white border border-[#e2e2dc] hover:border-[#0c7c59] transition-colors overflow-hidden flex flex-col"
              >
                {article.hero_image ? (
                  <div className="relative h-44 overflow-hidden bg-[#f3f3f3] flex-shrink-0">
                    <Image
                      src={`/images/${article.hero_image}`}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-44 bg-[#0c7c59]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-5xl font-bold text-[#0c7c59]/20 font-sans">A</span>
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
        </div>
      </section>

      {/* Recent Webinars */}
      <section className="max-w-[1440px] mx-auto px-6 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1a1a1a]">Recent Webinars</h2>
            <div className="w-12 h-0.5 bg-[#0c7c59] mt-2" />
          </div>
          <Link href="/events/webinars" className="text-sm text-[#0c7c59] hover:underline font-medium font-sans">
            Full archive →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                    <div className="w-12 h-12 bg-[#ff0000] rounded-full flex items-center justify-center shadow-lg opacity-90 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="pt-3">
                  <p className="text-xs text-[#999999] font-sans mb-1">{w.year}</p>
                  <p className="text-sm font-medium text-[#2d2d2d] group-hover:text-[#0c7c59] leading-snug line-clamp-3 transition-colors duration-150 font-sans">
                    {w.title}
                  </p>
                </div>
              </a>
            ) : (
              <div key={i}>
                <div className="relative w-full bg-[#ebebeb] border border-[#e2e2dc]" style={{ paddingBottom: '56.25%' }}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                    <svg className="w-7 h-7 text-[#c0c0c0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.862v6.276a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs text-[#b0b0b0] font-sans">No recording</span>
                  </div>
                </div>
                <div className="pt-3">
                  <p className="text-xs text-[#999999] font-sans mb-1">{w.year}</p>
                  <p className="text-sm font-medium text-[#888888] leading-snug line-clamp-3 font-sans">
                    {w.title}
                  </p>
                </div>
              </div>
            )
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="bg-[#0c7c59] text-white">
        <div className="max-w-[1440px] mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-lg font-bold mb-1">Stay Informed</h2>
            <p className="text-white/80 text-sm max-w-md">
              Subscribe to the AVERT newsletter for updates on research, events, and commentary.
            </p>
          </div>
          <SubscribeForm />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1a1a1a] text-white">
        <div className="max-w-[1440px] mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
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
