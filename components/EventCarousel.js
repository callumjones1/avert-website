'use client'
import { useState, useCallback } from 'react'
import Image from 'next/image'

export default function EventCarousel({ events }) {
  const [idx, setIdx] = useState(0)
  const max = events.length - 1
  const multi = events.length > 1

  const next = useCallback(() => setIdx(i => i >= max ? 0 : i + 1), [max])
  const prev = useCallback(() => setIdx(i => i <= 0 ? max : i - 1), [max])

  const event = events[idx]

  return (
    <div>
      <div className="border border-[#e2e2dc] bg-white overflow-hidden">
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

      {multi && (
        <div className="flex items-center justify-between mt-3">
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
      )}
    </div>
  )
}
