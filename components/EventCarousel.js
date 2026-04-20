'use client'
import { useState, useCallback } from 'react'
import Image from 'next/image'

export default function EventCarousel({ events }) {
  const max = events.length - 1
  const [idx, setIdx] = useState(0)

  const next = useCallback(() => setIdx(i => i >= max ? 0 : i + 1), [max])
  const prev = useCallback(() => setIdx(i => i <= 0 ? max : i - 1), [max])

  return (
    <div>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {events.map((event, i) => (
            <div key={i} className="flex-shrink-0 w-full border border-[#e2e2dc] bg-white overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-start">

                {/* Left panel: date + speakers */}
                <div className="flex-shrink-0 w-full md:w-52 flex flex-col">
                  {event.date_aedt && (
                    <div className="bg-[#0c7c59] text-white px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-wide font-sans opacity-80">AEDT</p>
                      <p className="text-sm font-bold mt-1 font-sans leading-snug">{event.date_aedt}</p>
                      {event.date_cdt && (
                        <p className="text-xs opacity-60 mt-2 font-sans">{event.date_cdt} CDT</p>
                      )}
                    </div>
                  )}
                  {event.speakers ? (
                    event.speakers.map((s, si) => (
                      <div key={si} className="border-t border-[#e2e2dc] p-4">
                        <div className="relative w-full overflow-hidden bg-[#f3f3f3] mb-3" style={{ aspectRatio: '1/1' }}>
                          <Image src={`/${s.image_dir}/${s.image}`} alt={s.name} fill className="object-cover object-top" />
                        </div>
                        <p className="text-sm font-bold text-[#0c7c59] font-sans leading-snug">{s.name}</p>
                        <p className="text-xs text-[#717171] font-sans mt-0.5 leading-snug">{s.title}</p>
                      </div>
                    ))
                  ) : (event.speaker || event.speaker_image) && (
                    <div className="border-t border-[#e2e2dc] p-4">
                      {event.speaker_image && (
                        <div className="relative w-full overflow-hidden bg-[#f3f3f3] mb-3" style={{ aspectRatio: '1/1' }}>
                          <Image src={`/images/${event.speaker_image}`} alt={event.speaker || 'Speaker'} fill className="object-cover object-top" />
                        </div>
                      )}
                      {event.speaker && <p className="text-sm font-bold text-[#0c7c59] font-sans leading-snug">{event.speaker}</p>}
                      {event.speaker_title && <p className="text-xs text-[#717171] font-sans mt-0.5 leading-snug">{event.speaker_title}</p>}
                    </div>
                  )}
                </div>

                {/* Right panel: content */}
                <div className="flex-1 p-6 md:p-8 border-t md:border-t-0 md:border-l border-[#e2e2dc]">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.platform && (
                      <span className="text-xs bg-[#e8f5f0] text-[#0c7c59] px-2 py-0.5 font-semibold font-sans">{event.platform}</span>
                    )}
                    {event.format && (
                      <span className="text-xs bg-[#f3f3f3] text-[#717171] px-2 py-0.5 font-sans">{event.format}</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-[#1a1a1a] mb-4 leading-snug">{event.title}</h3>
                  {event.description && (
                    <div className="text-sm text-[#5a5a5a] leading-relaxed mb-5 max-w-2xl space-y-3">
                      {event.description.split('\n\n').map((para, pi) => (
                        <p key={pi}>{para}</p>
                      ))}
                    </div>
                  )}
                  {event.speakers ? (
                    <div className="mb-5 max-w-2xl space-y-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#0c7c59] font-sans">About the Speakers</p>
                      {event.speakers.map((s, si) => (
                        <div key={si} className="border-l-2 border-[#0c7c59]/30 pl-4">
                          <p className="text-xs font-semibold text-[#1a1a1a] mb-1">{s.name}</p>
                          <p className="text-sm text-[#5a5a5a] leading-relaxed">{s.bio}</p>
                        </div>
                      ))}
                    </div>
                  ) : event.speaker_bio && (
                    <div className="border-l-2 border-[#0c7c59]/30 pl-4 mb-5 max-w-2xl">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#0c7c59] mb-2 font-sans">About the Speaker</p>
                      <p className="text-sm text-[#5a5a5a] leading-relaxed">{event.speaker_bio}</p>
                    </div>
                  )}
                  {event.org_logo && (
                    <div className="relative h-10 w-28 mb-4">
                      <Image src={`/images/${event.org_logo}`} alt="Organisation logo" fill className="object-contain object-left" />
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
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-1.5">
          {events.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === idx ? 'bg-[#0c7c59]' : 'bg-[#e2e2dc] hover:bg-[#c0c0c0]'}`}
              aria-label={`Go to event ${i + 1}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={prev}
            className="border border-[#e2e2dc] hover:border-[#0c7c59] text-[#717171] hover:text-[#0c7c59] w-8 h-8 flex items-center justify-center transition-colors"
            aria-label="Previous event"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="border border-[#e2e2dc] hover:border-[#0c7c59] text-[#717171] hover:text-[#0c7c59] w-8 h-8 flex items-center justify-center transition-colors"
            aria-label="Next event"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  )
}
