'use client'
import { useState, useEffect, useCallback } from 'react'

const VISIBLE = 3

export default function WebinarCarousel({ webinars }) {
  const max = Math.max(0, webinars.length - VISIBLE)
  const [idx, setIdx] = useState(0)

  const next = useCallback(() => setIdx(i => i >= max ? 0 : i + 1), [max])
  const prev = () => setIdx(i => i <= 0 ? max : i - 1)

  useEffect(() => {
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [next])

  return (
    <div>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${idx * (100 / VISIBLE)}%)` }}
        >
          {webinars.map((w, i) => (
            <div key={i} className="flex-shrink-0 px-3" style={{ width: `${100 / VISIBLE}%` }}>
              {w.videoId ? (
                <a
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
                    <p className="text-sm font-medium text-[#2d2d2d] group-hover:text-[#0c7c59] leading-snug line-clamp-2 transition-colors duration-150 font-sans">
                      {w.title}
                    </p>
                  </div>
                </a>
              ) : (
                <div>
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
                    <p className="text-sm font-medium text-[#888888] leading-snug line-clamp-2 font-sans">{w.title}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex gap-1.5">
          {Array.from({ length: max + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === idx ? 'bg-[#0c7c59]' : 'bg-[#e2e2dc] hover:bg-[#c0c0c0]'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={prev}
            className="border border-[#e2e2dc] hover:border-[#0c7c59] text-[#717171] hover:text-[#0c7c59] w-8 h-8 flex items-center justify-center transition-colors"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="border border-[#e2e2dc] hover:border-[#0c7c59] text-[#717171] hover:text-[#0c7c59] w-8 h-8 flex items-center justify-center transition-colors"
            aria-label="Next"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  )
}
