import staticData from '@/data/static.json'
import Link from 'next/link'

export const metadata = {
  title: 'Opportunities — AVERT Research Network',
  description: 'Research funding, membership opportunities, and PhD scholarships through the AVERT Research Network.',
}

function buildParagraphs(text) {
  if (!text) return []
  const raw = text.split('\n').map((l) => l.trim()).filter(Boolean)
  return raw
}

export default function OpportunitiesPage() {
  const data = staticData['opportunities'] || {}
  const paragraphs = buildParagraphs(data.text).filter((l) => l !== 'Research Funding and Other Opportunities')

  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Opportunities</h1>
          <div className="w-12 h-0.5 bg-white/40 mb-4" />
          <p className="text-white/80 max-w-2xl leading-relaxed">
            Research funding, PhD scholarships, membership, and collaboration opportunities through the AVERT Research Network.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <div className="prose-article text-[#2d2d2d] space-y-5 mb-12">
              {paragraphs.map((p, i) => (
                <p key={i} className="leading-relaxed">{p}</p>
              ))}
            </div>

            <div className="space-y-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#111827]">Current Opportunities</h2>
                <div className="w-12 h-0.5 bg-[#0c7c59] mt-2" />
              </div>
              <div className="border border-[#e2e2dc] bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] mb-2 font-sans">PhD Scholarships</p>
                <h3 className="font-bold text-[#111827] mb-2">Adelaide University — Terrorism & Extremism</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Multiple funded PhD scholarships available at Adelaide University in the study of terrorism, extremism, and related fields.
                  Topics include vernacular security, cyberthreats, proscription, and listing regimes.
                </p>
                <a
                  href="https://www.adelaide.edu.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#0c7c59] hover:underline font-sans font-semibold"
                >
                  Learn more →
                </a>
              </div>
              <div className="border border-[#e2e2dc] bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] mb-2 font-sans">Call for Proposals</p>
                <h3 className="font-bold text-[#111827] mb-2">GNET — New Voices in Extremism Research</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  GNET is seeking proposals from PhD students researching the nexus of technology, violent extremism, and terrorism.
                  This series highlights new and emerging academic voices. Applications from women and students from underrepresented regions are especially encouraged.
                </p>
                <a
                  href="https://gnet-research.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#0c7c59] hover:underline font-sans font-semibold"
                >
                  See post →
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#f7f7f5] border border-[#e2e2dc] p-6">
              <h3 className="font-bold text-[#111827] text-xs uppercase tracking-wide mb-4 font-sans">Join AVERT</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/opportunities/research" className="text-[#0c7c59] hover:underline">
                    Research Membership →
                  </Link>
                </li>
                <li>
                  <Link href="/opportunities/affiliate" className="text-[#0c7c59] hover:underline">
                    Affiliate Membership →
                  </Link>
                </li>
              </ul>
            </div>
            <div className="bg-[#1a1a1a] text-white p-6">
              <h3 className="font-bold text-xs uppercase tracking-wide mb-2 font-sans">Contact Us</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                For funding opportunities, collaboration enquiries, or membership questions:
              </p>
              <a href="mailto:adi-avert@deakin.edu.au" className="text-[#0c7c59] hover:text-white text-sm font-semibold transition-colors font-sans">
                adi-avert@deakin.edu.au
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
