import eventsData from '@/data/events.json'
import Link from 'next/link'
import Image from 'next/image'
import EventCarousel from '@/components/EventCarousel'

export const metadata = {
  title: 'Events & Webinars',
  description: 'Upcoming and past AVERT Research Network events, webinars, and conferences on violent extremism.',
}

export default function EventsPage() {
  const upcoming = eventsData.filter((e) => e.type === 'upcoming')

  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Events & Webinars</h1>
          <div className="w-12 h-0.5 bg-white/40 mb-4" />
          <p className="text-white/80 max-w-2xl leading-relaxed">
            AVERT regularly hosts events and webinars featuring the latest research on violent extremism, terrorism, radicalisation, and countering violent extremism.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Upcoming events */}
        {upcoming.length > 0 && (
          <section className="mb-14">
            <div className="flex items-baseline gap-3 mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] font-sans">Upcoming Events</h2>
              <div className="flex-1 h-px bg-[#e2e2dc]" />
            </div>
            {upcoming.length === 1 ? (
              <div className="border border-[#e2e2dc] bg-white overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-start">
                  <div className="flex-shrink-0 w-full md:w-52 flex flex-col">
                    {upcoming[0].date_aedt && (
                      <div className="bg-[#0c7c59] text-white px-5 py-4">
                        <p className="text-xs font-semibold uppercase tracking-wide font-sans opacity-80">AEDT</p>
                        <p className="text-sm font-bold mt-1 font-sans leading-snug">{upcoming[0].date_aedt}</p>
                        {upcoming[0].date_cdt && (
                          <p className="text-xs opacity-60 mt-2 font-sans">{upcoming[0].date_cdt} CDT</p>
                        )}
                      </div>
                    )}
                    {upcoming[0].speakers ? (
                      upcoming[0].speakers.map((s, si) => (
                        <div key={si} className="border-t border-[#e2e2dc] p-4">
                          <div className="relative w-full overflow-hidden bg-[#f3f3f3] mb-3" style={{ aspectRatio: '1/1' }}>
                            <Image src={`/${s.image_dir}/${s.image}`} alt={s.name} fill className="object-cover object-top" />
                          </div>
                          <p className="text-sm font-bold text-[#0c7c59] font-sans leading-snug">{s.name}</p>
                          <p className="text-xs text-[#717171] font-sans mt-0.5 leading-snug">{s.title}</p>
                        </div>
                      ))
                    ) : (upcoming[0].speaker || upcoming[0].speaker_image) && (
                      <div className="border-t border-[#e2e2dc] p-4">
                        {upcoming[0].speaker_image && (
                          <div className="relative w-full overflow-hidden bg-[#f3f3f3] mb-3" style={{ aspectRatio: '1/1' }}>
                            <Image src={`/images/${upcoming[0].speaker_image}`} alt={upcoming[0].speaker || 'Speaker'} fill className="object-cover object-top" />
                          </div>
                        )}
                        {upcoming[0].speaker && <p className="text-sm font-bold text-[#0c7c59] font-sans leading-snug">{upcoming[0].speaker}</p>}
                        {upcoming[0].speaker_title && <p className="text-xs text-[#717171] font-sans mt-0.5 leading-snug">{upcoming[0].speaker_title}</p>}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-6 md:p-8 border-t md:border-t-0 md:border-l border-[#e2e2dc]">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {upcoming[0].platform && (
                        <span className="text-xs bg-[#e8f5f0] text-[#0c7c59] px-2 py-0.5 font-semibold font-sans">{upcoming[0].platform}</span>
                      )}
                      {upcoming[0].format && (
                        <span className="text-xs bg-[#f3f3f3] text-[#717171] px-2 py-0.5 font-sans">{upcoming[0].format}</span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-[#1a1a1a] mb-4 leading-snug">{upcoming[0].title}</h3>
                    {upcoming[0].description && (
                      <div className="text-sm text-[#5a5a5a] leading-relaxed mb-5 max-w-2xl space-y-3">
                        {upcoming[0].description.split('\n\n').map((para, pi) => (
                          <p key={pi}>{para}</p>
                        ))}
                      </div>
                    )}
                    {upcoming[0].speakers ? (
                      <div className="mb-5 max-w-2xl space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#0c7c59] font-sans">About the Speakers</p>
                        {upcoming[0].speakers.map((s, si) => (
                          <div key={si} className="border-l-2 border-[#0c7c59]/30 pl-4">
                            <p className="text-xs font-semibold text-[#1a1a1a] mb-1">{s.name}</p>
                            <p className="text-sm text-[#5a5a5a] leading-relaxed">{s.bio}</p>
                          </div>
                        ))}
                      </div>
                    ) : upcoming[0].speaker_bio && (
                      <div className="border-l-2 border-[#0c7c59]/30 pl-4 mb-5 max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#0c7c59] mb-2 font-sans">About the Speaker</p>
                        <p className="text-sm text-[#5a5a5a] leading-relaxed">{upcoming[0].speaker_bio}</p>
                      </div>
                    )}
                    {upcoming[0].org_logo && (
                      <div className="relative h-10 w-28 mb-4">
                        <Image src={`/images/${upcoming[0].org_logo}`} alt="Organisation logo" fill className="object-contain object-left" />
                      </div>
                    )}
                    {upcoming[0].register_url && (
                      <a
                        href={upcoming[0].register_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-[#0c7c59] hover:bg-[#0a6b4d] text-white px-5 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors font-sans"
                      >
                        Register via Zoom →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <EventCarousel events={upcoming} />
            )}
          </section>
        )}

        {/* Past events */}
        <section>
          <div className="flex items-baseline gap-3 mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] font-sans">Past Events</h2>
            <div className="flex-1 h-px bg-[#e2e2dc]" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/events/webinars"
              className="flex-1 border border-[#e2e2dc] hover:border-[#0c7c59] bg-white p-6 transition-colors group"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] mb-2 font-sans">Archive</p>
              <h3 className="font-bold text-[#1a1a1a] group-hover:text-[#0c7c59] transition-colors">Past Webinars →</h3>
              <p className="text-sm text-[#717171] mt-1">Full archive of AVERT webinar recordings</p>
            </Link>
            <Link
              href="/events/symposiums"
              className="flex-1 border border-[#e2e2dc] hover:border-[#0c7c59] bg-white p-6 transition-colors group"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] mb-2 font-sans">Archive</p>
              <h3 className="font-bold text-[#1a1a1a] group-hover:text-[#0c7c59] transition-colors">Past Symposiums →</h3>
              <p className="text-sm text-[#717171] mt-1">AVERT annual research symposiums</p>
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
