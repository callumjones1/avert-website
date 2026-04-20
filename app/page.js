import Link from 'next/link'
import Image from 'next/image'
import impactData from '@/data/impact.json'
import commentaryData from '@/data/commentary.json'
import webinarsData from '@/data/webinars.json'
import eventsData from '@/data/events.json'
import SubscribeForm from '@/components/SubscribeForm'
import WebinarCarousel from '@/components/WebinarCarousel'

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
    .slice(0, 6)

  const latestWebinars = getLatestWebinars(12)

  const upcomingEvents = eventsData.filter(e => e.type === 'upcoming')

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
                className="bg-white text-[#0c7c59] hover:bg-white/90 px-7 py-3 text-sm font-semibold uppercase tracking-wide transition-colors font-sans"
              >
                Meet the Researchers
              </Link>
              <a
                href="#newsletter"
                className="bg-white text-[#0c7c59] hover:bg-white/90 px-7 py-3 text-sm font-semibold uppercase tracking-wide transition-colors font-sans"
              >
                Stay Informed
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* News & Events */}
      <section className="max-w-[1440px] mx-auto px-6 py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1a1a1a]">News & Events</h2>
          <div className="w-12 h-0.5 bg-[#0c7c59] mt-2" />
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* News 2×2 grid */}
          <div className="lg:w-[63%] min-w-0">
            <div className="flex items-baseline justify-between mb-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] font-sans">Latest News</p>
              <Link href="/impact" className="text-xs text-[#0c7c59] hover:underline font-sans font-medium">
                All news →
              </Link>
            </div>
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

          {/* Upcoming events panel */}
          {upcomingEvents.length > 0 && (
            <div className="lg:w-[33%] flex-shrink-0">
              <div className="flex items-baseline justify-between mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] font-sans">Upcoming Events</p>
                <Link href="/events" className="text-xs text-[#0c7c59] hover:underline font-sans font-medium">
                  All events →
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                {upcomingEvents.map((event, i) => (
                  <div key={i} className="border border-[#e2e2dc] bg-white overflow-hidden">
                    {event.date_aedt && (
                      <div className="bg-[#0c7c59] text-white px-5 py-4">
                        <p className="text-xs font-semibold uppercase tracking-wide font-sans opacity-80">AEDT</p>
                        <p className="text-sm font-bold mt-1 font-sans leading-snug">{event.date_aedt}</p>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {event.platform && (
                          <span className="text-xs bg-[#e8f5f0] text-[#0c7c59] px-1.5 py-0.5 font-semibold font-sans">{event.platform}</span>
                        )}
                        {event.format && (
                          <span className="text-xs bg-[#ebebeb] text-[#717171] px-1.5 py-0.5 font-sans">{event.format}</span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-[#1a1a1a] mb-3 leading-snug">{event.title}</h3>
                      {event.speakers ? (
                        <div className="flex flex-col gap-2">
                          {event.speakers.map((s, si) => (
                            <div key={si} className="flex items-center gap-3">
                              <div className="relative flex-shrink-0 w-20 h-20 overflow-hidden rounded-full bg-[#f3f3f3]">
                                <Image src={`/${s.image_dir}/${s.image}`} alt={s.name} fill className="object-cover object-top" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-[#0c7c59] font-sans">{s.name}</p>
                                <p className="text-xs text-[#717171] font-sans mt-0.5 leading-snug">{s.title}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (event.speaker || event.speaker_image) && (
                        <div className="flex items-center gap-3">
                          {event.speaker_image && (
                            <div className="relative flex-shrink-0 w-20 h-20 overflow-hidden rounded-full bg-[#f3f3f3]">
                              <Image src={`/images/${event.speaker_image}`} alt={event.speaker || 'Speaker'} fill className="object-cover object-top" />
                            </div>
                          )}
                          <div className="min-w-0">
                            {event.speaker && <p className="text-xs font-semibold text-[#0c7c59] font-sans">{event.speaker}</p>}
                            {event.speaker_title && <p className="text-xs text-[#717171] font-sans mt-0.5 leading-snug">{event.speaker_title}</p>}
                          </div>
                        </div>
                      )}
                      {event.register_url && (
                        <a
                          href={event.register_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-4 bg-[#0c7c59] hover:bg-[#0a6b4d] text-white px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors font-sans"
                        >
                          Register →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestCommentary.map((article) => (
              <Link
                key={article.slug}
                href={`/commentary/${article.slug}`}
                className="group border border-[#e2e2dc] hover:border-[#0c7c59] bg-white p-6 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  {article.author && (
                    <span className="text-xs font-semibold text-[#0c7c59] uppercase tracking-wide font-sans">{article.author}</span>
                  )}
                  {article.date && (
                    <span className="text-xs text-[#999999] font-sans">{article.date}</span>
                  )}
                </div>
                <h3 className="font-bold text-[#1a1a1a] group-hover:text-[#0c7c59] leading-snug transition-colors mb-2">
                  {article.title}
                </h3>
                {article.body && (
                  <p className="text-sm text-[#717171] line-clamp-2 leading-relaxed">
                    {getPreview(article.body, article.title)}
                  </p>
                )}
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
        <WebinarCarousel webinars={latestWebinars} />
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
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <SubscribeForm />
            <div className="hidden sm:block w-px h-10 bg-white/20" />
            <Link
              href="/join"
              className="bg-white text-[#0c7c59] hover:bg-white/90 px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors font-sans whitespace-nowrap flex-shrink-0"
            >
              Join
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
