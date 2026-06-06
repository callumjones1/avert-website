import Link from 'next/link'
import webinarsData from '@/data/webinars.json'

export const metadata = {
  title: 'Webinars — AVERT Research Network',
  description: 'Past AVERT Research Network webinars on violent extremism and radicalisation.',
}

const webinars = webinarsData

function WebinarTile({ title, videoId }) {
  if (videoId) {
    return (
      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        <div className="relative w-full overflow-hidden bg-[#111]" style={{ paddingBottom: '56.25%' }}>
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt={title}
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
        <div className="pt-2.5">
          <p className="text-sm font-medium text-[#2d2d2d] group-hover:text-[#0c7c59] leading-snug line-clamp-3 transition-colors duration-150 font-sans">
            {title}
          </p>
        </div>
      </a>
    )
  }

  return (
    <div className="block">
      <div
        className="relative w-full bg-[#f3f3f3] border border-[#e2e2dc] flex items-center justify-center"
        style={{ paddingBottom: '56.25%' }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
          <svg className="w-7 h-7 text-[#c8c8c8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.862v6.276a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="text-xs text-[#b0b0b0] font-sans">No recording</span>
        </div>
      </div>
      <div className="pt-2.5">
        <p className="text-sm font-medium text-[#888888] leading-snug line-clamp-3 font-sans">
          {title}
        </p>
      </div>
    </div>
  )
}

export default function WebinarsPage() {
  const years = Object.keys(webinars).sort((a, b) => b - a)

  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/events" className="text-white/60 hover:text-white text-sm mb-6 inline-block font-sans transition-colors">← Events</Link>
          <h1 className="text-4xl font-bold mb-3 mt-4">Webinars</h1>
          <div className="w-12 h-0.5 bg-white/40 mb-4" />
          <p className="text-white/80 max-w-2xl leading-relaxed">
            AVERT regularly hosts online webinars featuring leading researchers on violent extremism, terrorism, radicalisation, and countering violent extremism.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="space-y-14">
          {years.map((year) => (
            <div key={year}>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a1a]">{year}</h2>
                <div className="flex-1 h-px bg-[#e2e2dc]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {webinars[year].map((item, i) => (
                  <WebinarTile key={i} title={item.title} videoId={item.videoId} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
