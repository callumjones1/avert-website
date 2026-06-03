import Link from 'next/link'
import newslettersData from '@/data/newsletters.json'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return newslettersData
    .filter(nl => nl.body_html)
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
  if (!nl || !nl.body_html) notFound()

  const others = newslettersData.filter(n => n.slug !== slug && n.body_html).slice(0, 4)

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
        <div
          className="max-w-3xl newsletter-body"
          dangerouslySetInnerHTML={{ __html: nl.body_html }}
        />

        {others.length > 0 && (
          <div className="max-w-3xl mt-16 pt-10 border-t border-[#e2e2dc]">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] mb-6 font-sans">Other Issues</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {others.map(other => (
                <Link key={other.slug} href={`/newsletters/${other.slug}`}
                  className="group border border-[#e2e2dc] hover:border-[#0c7c59] bg-white p-4 transition-colors"
                >
                  <p className="text-xs text-[#999999] font-sans mb-1">{other.date}</p>
                  <p className="font-bold text-sm text-[#1a1a1a] group-hover:text-[#0c7c59] leading-snug transition-colors">
                    {other.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
