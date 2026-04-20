import Link from 'next/link'

export const metadata = {
  title: 'Join the Network — AVERT Research Network',
  description: 'Join the AVERT Research Network as a research or affiliate member.',
}

export default function JoinPage() {
  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Join the Network</h1>
          <div className="w-12 h-0.5 bg-white/40 mb-4" />
          <p className="text-white/80 max-w-2xl leading-relaxed">
            AVERT welcomes researchers, practitioners, and organisations committed to evidence-based understanding of violent extremism and radicalisation.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">

          <div className="border border-[#e2e2dc] bg-white p-8 flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] mb-3 font-sans">For Active Researchers</p>
            <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">Research Membership</h2>
            <p className="text-sm text-[#5a5a5a] leading-relaxed mb-4">
              Open to active researchers with a track record of peer-reviewed publications or externally funded research in violent extremism and radicalisation.
            </p>
            <ul className="space-y-2 text-sm text-[#2d2d2d] mb-8">
              {[
                'Access to all AVERT research resources',
                'Advance notice of and priority registration for events',
                'Research newsletter with funding and collaboration opportunities',
                'Propose and lead seminars, projects, and publications',
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-[#0c7c59] font-bold flex-shrink-0">—</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/opportunities/research"
              className="mt-auto inline-block bg-[#0c7c59] text-white hover:bg-[#0a6b4d] px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors font-sans text-center"
            >
              Research Membership →
            </Link>
          </div>

          <div className="border border-[#e2e2dc] bg-white p-8 flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] mb-3 font-sans">For Students & Practitioners</p>
            <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">Affiliate Membership</h2>
            <p className="text-sm text-[#5a5a5a] leading-relaxed mb-4">
              Open to individuals, community organisations, NGOs, think tanks, government agencies, and postgraduate students with an interest in AVERT's focus.
            </p>
            <ul className="space-y-2 text-sm text-[#2d2d2d] mb-8">
              {[
                'Access to publicly available publications and resources',
                'Advance notice of AVERT events and activities',
                'Quarterly AVERT newsletter',
                'Opportunities to collaborate with researchers and partners',
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-[#0c7c59] font-bold flex-shrink-0">—</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/opportunities/affiliate"
              className="mt-auto inline-block bg-[#0c7c59] text-white hover:bg-[#0a6b4d] px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors font-sans text-center"
            >
              Affiliate Membership →
            </Link>
          </div>
        </div>

        <div className="bg-[#1a1a1a] text-white p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-bold text-lg mb-2">Have a question?</h3>
            <p className="text-[#999999] text-sm leading-relaxed max-w-md">
              Contact the AVERT team for membership enquiries or to find out which membership type is right for you.
            </p>
          </div>
          <a
            href="mailto:adi-avert@deakin.edu.au?subject=Membership Enquiry"
            className="flex-shrink-0 border border-[#5a5a5a] hover:border-white text-[#cccccc] hover:text-white px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors font-sans"
          >
            adi-avert@deakin.edu.au
          </a>
        </div>
      </div>
    </>
  )
}
