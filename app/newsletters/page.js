import Link from 'next/link'
import newslettersData from '@/data/newsletters.json'

export const metadata = {
  title: 'Newsletters — AVERT Research Network',
  description: 'Past issues of the AVERT Research Network newsletter.',
}

export default function NewslettersPage() {
  const [featured, ...rest] = newslettersData

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

        {/* Featured latest */}
        {featured && (
          <NewsletterCard nl={featured} featured />
        )}

        {/* Archive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {rest.map((nl) => (
            <NewsletterCard key={nl.slug} nl={nl} />
          ))}
        </div>

        <div className="mt-12 border-t border-[#e2e2dc] pt-8">
          <p className="text-sm text-[#717171] leading-relaxed">
            To receive future newsletters, subscribe using the form on the{' '}
            <Link href="/#newsletter" className="text-[#0c7c59] hover:underline">homepage</Link>.
          </p>
        </div>
      </div>
    </>
  )
}

function NewsletterCard({ nl, featured = false }) {
  const isExternal = !nl.body_html && nl.url.startsWith('http')
  const href = nl.body_html ? `/newsletters/${nl.slug}` : nl.url
  const hasContent = nl.highlights && nl.highlights.length > 0

  const Tag = isExternal ? 'a' : Link
  const linkProps = isExternal
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : { href }

  if (featured) {
    return (
      <Tag
        {...linkProps}
        className="group block border border-[#e2e2dc] hover:border-[#0c7c59] bg-white p-8 transition-colors mb-0"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-semibold text-[#0c7c59] uppercase tracking-widest font-sans">Latest Issue</span>
          <span className="text-xs text-[#999999] font-sans">{nl.date}</span>
        </div>
        <h2 className="text-xl font-bold text-[#1a1a1a] group-hover:text-[#0c7c59] leading-snug transition-colors mb-3">
          {nl.title}
        </h2>
        {nl.summary && (
          <p className="text-[#5a5a5a] text-sm leading-relaxed mb-5">{nl.summary}</p>
        )}
        {hasContent && (
          <ul className="space-y-2">
            {nl.highlights.map((h, i) => (
              <li key={i} className="flex gap-3 text-sm text-[#2d2d2d]">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0c7c59] mt-1.5" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="text-sm text-[#0c7c59] font-semibold mt-5 font-sans">Read newsletter →</p>
      </Tag>
    )
  }

  return (
    <Tag
      {...linkProps}
      className="group border border-[#e2e2dc] hover:border-[#0c7c59] bg-white p-6 transition-colors flex flex-col"
    >
      <p className="text-xs text-[#999999] font-sans mb-2">{nl.date}</p>
      <h3 className="font-bold text-[#1a1a1a] group-hover:text-[#0c7c59] leading-snug transition-colors mb-3 flex-1">
        {nl.title}
      </h3>
      {nl.summary && (
        <p className="text-sm text-[#717171] leading-relaxed mb-3 line-clamp-2">{nl.summary}</p>
      )}
      <p className="text-xs text-[#0c7c59] font-semibold font-sans mt-auto">Read newsletter →</p>
    </Tag>
  )
}
