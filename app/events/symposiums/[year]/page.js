import Link from 'next/link'
import symposiumsData from '@/data/symposiums.json'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return symposiumsData.map(s => ({ year: s.slug }))
}

export async function generateMetadata({ params }) {
  const { year } = await params
  const sym = symposiumsData.find(s => s.slug === year)
  if (!sym) return {}
  return { title: `${sym.title} — AVERT Research Network` }
}

export default async function SymposiumPage({ params }) {
  const { year } = await params
  const sym = symposiumsData.find(s => s.slug === year)
  if (!sym) notFound()

  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/events/symposiums" className="text-white/60 hover:text-white text-sm mb-6 inline-block font-sans transition-colors">← Symposiums</Link>
          <p className="text-white/60 text-sm mt-4 mb-2 font-sans">{sym.dates} · {sym.location}</p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2">{sym.title}</h1>
          {sym.theme && (
            <p className="text-white/80 text-lg italic mt-2">{sym.theme}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-14">

        {/* Program download — top of page */}
        {sym.program_url && (
          <section>
            <a
              href={sym.program_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0c7c59] text-white hover:bg-[#0a6b4d] px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors font-sans"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Download Program
            </a>
          </section>
        )}

        {/* Description */}
        {sym.description && (
          <section className="max-w-3xl space-y-4">
            {sym.description.split('\n\n').map((para, i) => (
              <p key={i} className="text-[#2d2d2d] leading-relaxed">{para}</p>
            ))}
          </section>
        )}

        {/* Keynotes */}
        {sym.keynotes?.length > 0 && (
          <section>
            <div className="flex items-baseline gap-3 mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] font-sans">
                Keynote Speaker{sym.keynotes.length > 1 ? 's' : ''}
              </h2>
              <div className="flex-1 h-px bg-[#e2e2dc]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">
              {sym.keynotes.map((k, i) => (
                <div key={i} className="border border-[#e2e2dc] bg-white p-6">
                  <p className="font-bold text-[#1a1a1a] leading-snug mb-1">{k.name}</p>
                  <p className="text-xs text-[#0c7c59] font-semibold font-sans mb-3">{k.institution}</p>
                  <p className="text-sm text-[#5a5a5a] leading-relaxed">{k.bio}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recordings */}
        {sym.recordings?.length > 0 && (
          <section>
            <div className="flex items-baseline gap-3 mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] font-sans">Session Recordings</h2>
              <div className="flex-1 h-px bg-[#e2e2dc]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {sym.recordings.map((rec, i) => (
                <a
                  key={i}
                  href={`https://www.youtube.com/watch?v=${rec.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="relative w-full overflow-hidden bg-[#111]" style={{ paddingBottom: '56.25%' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://img.youtube.com/vi/${rec.videoId}/hqdefault.jpg`}
                      alt={rec.title}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-75"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-[#ff0000] rounded-full flex items-center justify-center shadow-lg opacity-90 group-hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-[#2d2d2d] group-hover:text-[#0c7c59] leading-snug line-clamp-2 transition-colors mt-2 font-sans">
                    {rec.title}
                  </p>
                </a>
              ))}
            </div>
          </section>
        )}


      </div>
    </>
  )
}
