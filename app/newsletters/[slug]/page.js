import Link from 'next/link'
import newslettersData from '@/data/newsletters.json'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return newslettersData
    .filter(nl => !nl.url.startsWith('http'))
    .map(nl => ({ slug: nl.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const nl = newslettersData.find(n => n.slug === slug)
  if (!nl) return {}
  return { title: `${nl.title} — AVERT Research Network` }
}

export default async function NewsletterPage({ params }) {
  const { slug } = await params
  const nl = newslettersData.find(n => n.slug === slug)
  if (!nl || nl.url.startsWith('http')) notFound()

  const others = newslettersData.filter(n => n.slug !== slug).slice(0, 3)

  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/newsletters" className="text-white/60 hover:text-white text-sm mb-6 inline-block transition-colors font-sans">
            ← Newsletters
          </Link>
          <p className="text-white/60 text-sm mt-4 mb-3 font-sans">{nl.date}</p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">{nl.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-3xl">
          {nl.summary && (
            <p className="text-lg text-[#2d2d2d] leading-relaxed mb-8 border-l-4 border-[#0c7c59] pl-5">
              {nl.summary}
            </p>
          )}

          {nl.highlights && nl.highlights.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] mb-5 font-sans">
                In this issue
              </h2>
              <ul className="space-y-4">
                {nl.highlights.map((h, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0c7c59] mt-2" />
                    <span className="text-[#2d2d2d] leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {others.length > 0 && (
          <div className="mt-16 pt-10 border-t border-[#e2e2dc]">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] mb-6 font-sans">Other Issues</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {others.map(other => {
                const isExternal = other.url.startsWith('http')
                const Tag = isExternal ? 'a' : Link
                const props = isExternal
                  ? { href: other.url, target: '_blank', rel: 'noopener noreferrer' }
                  : { href: other.url }
                return (
                  <Tag key={other.slug} {...props}
                    className="group border border-[#e2e2dc] hover:border-[#0c7c59] bg-white p-5 transition-colors"
                  >
                    <p className="text-xs text-[#999999] font-sans mb-1">{other.date}</p>
                    <p className="font-bold text-sm text-[#1a1a1a] group-hover:text-[#0c7c59] leading-snug transition-colors">
                      {other.title}
                    </p>
                  </Tag>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
