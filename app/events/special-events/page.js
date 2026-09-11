import Link from 'next/link'
import specialEventsData from '@/data/special-events.json'

export const metadata = {
  title: 'Special Events — AVERT Research Network',
  description: 'Past AVERT Research Network special events and thematic panel series on violent extremism.',
}

export default function SpecialEventsPage() {
  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/events" className="text-white/60 hover:text-white text-sm mb-6 inline-block font-sans transition-colors">← Events</Link>
          <h1 className="text-4xl font-bold mb-3 mt-4">Special Events</h1>
          <div className="w-12 h-0.5 bg-white/40 mb-4" />
          <p className="text-white/80 max-w-2xl leading-relaxed">
            One-off multi-session panel series marking significant anniversaries and milestones, distinct from AVERT's recurring webinars and annual symposiums.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="space-y-6">
          {specialEventsData.map((ev) => (
            <Link
              key={ev.slug}
              href={ev.detail_url}
              className="group block border border-[#e2e2dc] hover:border-[#0c7c59] bg-white overflow-hidden transition-colors"
            >
              <div className="p-6 md:p-8">
                <p className="text-xs text-[#999999] font-sans mb-2">{ev.dates}</p>
                <h2 className="font-bold text-[#1a1a1a] group-hover:text-[#0c7c59] text-lg leading-snug transition-colors mb-2">
                  {ev.title}
                </h2>
                {ev.description && (
                  <p className="text-sm text-[#5a5a5a] leading-relaxed max-w-2xl">{ev.description}</p>
                )}
                {ev.session_count > 0 && (
                  <p className="text-xs font-semibold text-[#0c7c59] font-sans mt-4">
                    {ev.session_count} session recording{ev.session_count !== 1 ? 's' : ''} →
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
