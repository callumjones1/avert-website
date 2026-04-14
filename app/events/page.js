import eventsData from '@/data/events.json'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Events & Webinars',
  description: 'Upcoming and past AVERT Research Network events, webinars, and conferences on violent extremism.',
}

export default function EventsPage() {
  const upcoming = eventsData.filter((e) => e.type === 'upcoming')
  const past = eventsData.filter((e) => e.type === 'past')

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
            <div className="space-y-6">
              {upcoming.map((event, i) => (
                <div key={i} className="border border-[#e2e2dc] bg-white p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Date block */}
                    {event.date_aedt && (
                      <div className="flex-shrink-0 bg-[#0c7c59] text-white px-5 py-4 text-center min-w-36">
                        <p className="text-xs font-semibold uppercase tracking-wide font-sans opacity-80">AEDT</p>
                        <p className="text-sm font-bold mt-1 font-sans leading-snug">{event.date_aedt}</p>
                        {event.date_cdt && (
                          <p className="text-xs opacity-60 mt-2 font-sans">{event.date_cdt} CDT</p>
                        )}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {event.platform && (
                          <span className="text-xs bg-[#e8f5f0] text-[#0c7c59] px-2 py-0.5 font-semibold font-sans">{event.platform}</span>
                        )}
                        {event.format && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 font-sans">{event.format}</span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 leading-snug">{event.title}</h3>

                      {/* Speaker row with optional headshot and org logo */}
                      <div className="flex items-start gap-4 mb-4">
                        {event.speaker_image && (
                          <div className="flex-shrink-0 w-14 h-14 relative overflow-hidden rounded-full border-2 border-[#e2e2dc]">
                            <Image
                              src={`/images/${event.speaker_image}`}
                              alt={event.speaker || 'Speaker'}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          {event.speaker && (
                            <p className="text-sm font-bold text-[#0c7c59] mb-0.5 font-sans">{event.speaker}</p>
                          )}
                          {event.speaker_title && (
                            <p className="text-xs text-gray-500 font-sans leading-snug">{event.speaker_title}</p>
                          )}
                        </div>
                        {event.org_logo && (
                          <div className="flex-shrink-0 relative h-10 w-28">
                            <Image
                              src={`/images/${event.org_logo}`}
                              alt="Organisation logo"
                              fill
                              className="object-contain object-right"
                            />
                          </div>
                        )}
                      </div>

                      {event.description && (
                        <div className="text-sm text-gray-600 leading-relaxed mb-5 max-w-2xl space-y-3">
                          {event.description.split('\n\n').map((para, i) => (
                            <p key={i}>{para}</p>
                          ))}
                        </div>
                      )}
                      {event.speaker_bio && (
                        <div className="border-l-2 border-[#0c7c59]/30 pl-4 mb-5 max-w-2xl">
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#0c7c59] mb-2 font-sans">About the Speaker</p>
                          <p className="text-sm text-gray-600 leading-relaxed">{event.speaker_bio}</p>
                        </div>
                      )}
                      {event.register_url && (
                        <a
                          href={event.register_url}
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
              ))}
            </div>
          </section>
        )}

        {/* Past events */}
        {past.length > 0 && (
          <section>
            <div className="flex items-baseline gap-3 mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] font-sans">Past Events</h2>
              <div className="flex-1 h-px bg-[#e2e2dc]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {past.map((event, i) => (
                <div key={i} className="border border-[#e2e2dc] bg-white p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 mb-1.5 font-sans">{event.date_aedt} · {event.format}</p>
                      <h3 className="font-bold text-[#1a1a1a] leading-snug text-sm mb-1">{event.title}</h3>
                      {event.speaker && event.speaker !== 'Various speakers' && (
                        <p className="text-xs text-[#0c7c59] font-semibold font-sans mt-0.5">{event.speaker}</p>
                      )}
                      {event.speaker_title && event.speaker !== 'Various speakers' && (
                        <p className="text-xs text-gray-400 font-sans mt-0.5 leading-snug">{event.speaker_title}</p>
                      )}
                    </div>
                    {event.recording_url && (
                      <a
                        href={event.recording_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 text-xs font-semibold text-[#0c7c59] hover:underline font-sans whitespace-nowrap mt-0.5"
                      >
                        Watch recording →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex gap-6">
              <Link href="/events/webinars" className="text-sm text-[#0c7c59] hover:underline font-sans font-medium">
                Full webinar archive →
              </Link>
              <Link href="/events/symposiums" className="text-sm text-[#0c7c59] hover:underline font-sans font-medium">
                Past symposiums →
              </Link>
            </div>
          </section>
        )}
      </div>
    </>
  )
}
