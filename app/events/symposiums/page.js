import Link from 'next/link'
import symposiumsData from '@/data/symposiums.json'

export const metadata = {
  title: 'Symposiums — AVERT Research Network',
  description: 'Past AVERT Research Network international research symposiums on violent extremism.',
}

export default function SymposiumsPage() {
  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/events" className="text-white/60 hover:text-white text-sm mb-6 inline-block font-sans transition-colors">← Events</Link>
          <h1 className="text-4xl font-bold mb-3 mt-4">Symposiums</h1>
          <div className="w-12 h-0.5 bg-white/40 mb-4" />
          <p className="text-white/80 max-w-2xl leading-relaxed">
            AVERT hosts annual international research symposiums bringing together researchers, practitioners, and policymakers working on violent extremism and countering violent extremism.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="space-y-6">
          {symposiumsData.map((sym) => (
            <Link
              key={sym.slug}
              href={`/events/symposiums/${sym.slug}`}
              className="group block border border-[#e2e2dc] hover:border-[#0c7c59] bg-white overflow-hidden transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-stretch">
                <div className="flex-shrink-0 bg-[#0c7c59] text-white px-6 py-5 md:w-28 flex flex-col items-center justify-center text-center">
                  <p className="text-2xl font-bold font-sans">{sym.year}</p>
                </div>
                <div className="flex-1 p-6 md:p-8">
                  <h2 className="font-bold text-[#1a1a1a] group-hover:text-[#0c7c59] text-lg leading-snug transition-colors mb-1">
                    {sym.title}
                  </h2>
                  {sym.theme && (
                    <p className="text-sm text-[#0c7c59] font-semibold italic mb-2 font-sans">{sym.theme}</p>
                  )}
                  <p className="text-xs text-[#999999] font-sans mb-3">{sym.dates} · {sym.location}</p>
                  {sym.keynotes?.length > 0 && (
                    <p className="text-sm text-[#5a5a5a] font-sans">
                      <span className="font-semibold text-[#3d3d3d]">Keynote{sym.keynotes.length > 1 ? 's' : ''}: </span>
                      {sym.keynotes.map(k => k.name).join(' · ')}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-4">
                    {sym.recordings?.length > 0 ? (
                      <span className="text-xs font-semibold text-[#0c7c59] font-sans">
                        {sym.recordings.length} session recording{sym.recordings.length !== 1 ? 's' : ''} →
                      </span>
                    ) : sym.cfp ? (
                      <span className="text-xs font-semibold text-[#0c7c59] font-sans">Call for Proposals Open →</span>
                    ) : null}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
