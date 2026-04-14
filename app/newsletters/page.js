import newslettersData from '@/data/newsletters.json'

export const metadata = {
  title: 'Newsletters — AVERT Research Network',
  description: 'Past issues of the AVERT Research Network newsletter.',
}

export default function NewslettersPage() {
  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Newsletters</h1>
          <div className="w-12 h-0.5 bg-white/40 mb-4" />
          <p className="text-white/80 max-w-2xl leading-relaxed">
            AVERT publishes biannual newsletters highlighting network events, announcements, research opportunities, and member news.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {newslettersData.map((nl) => {
            const isExternal = nl.url.startsWith('http')
            return (
              <a
                key={nl.slug}
                href={nl.url}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="group flex items-center gap-4 border border-[#e2e2dc] hover:border-[#0c7c59] bg-white p-6 transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-[#e8f5f0] flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#0c7c59]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1a1a1a] group-hover:text-[#0c7c59] leading-snug transition-colors font-sans">
                    {nl.title}
                  </p>
                  <p className="text-sm text-[#999999] mt-0.5 font-sans">{nl.date}</p>
                </div>
                <span className="flex-shrink-0 text-[#0c7c59] text-lg font-sans">→</span>
              </a>
            )
          })}
        </div>

        <div className="mt-12 border-t border-[#e2e2dc] pt-8">
          <p className="text-sm text-[#717171] leading-relaxed">
            To receive future newsletters, subscribe using the form on the{' '}
            <a href="/" className="text-[#0c7c59] hover:underline">homepage</a>.
          </p>
        </div>
      </div>
    </>
  )
}
