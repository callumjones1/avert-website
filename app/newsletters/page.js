import Link from 'next/link'
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
          {newslettersData.map((nl) => (
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

function NewsletterCard({ nl }) {
  const isExternal = !nl.body_html && nl.url.startsWith('http')
  const href = nl.body_html ? `/newsletters/${nl.slug}` : nl.url

  const Tag = isExternal ? 'a' : Link
  const linkProps = isExternal
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : { href }

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
