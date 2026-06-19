import Link from 'next/link'

export const metadata = {
  title: 'Opportunities — AVERT Research Network',
  description: 'Research funding, PhD scholarships, grants, and job postings through the AVERT Research Network.',
}

export default function OpportunitiesPage() {
  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Opportunities</h1>
          <div className="w-12 h-0.5 bg-white/40 mb-4" />
          <p className="text-white/80 max-w-2xl leading-relaxed">
            Research funding, PhD scholarships, grants, and job postings relevant to the AVERT Research Network community.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <p className="text-[#2d2d2d] leading-relaxed mb-10">
              AVERT shares relevant research funding calls, PhD scholarships, grants, and job opportunities with our network members as they arise. Subscribe to our newsletter to receive updates directly to your inbox.
            </p>

            <div className="mb-6">
              <h2 className="text-lg font-bold text-[#1a1a1a] mb-2">Current Opportunities</h2>
              <div className="w-12 h-0.5 bg-[#0c7c59] mb-6" />
            </div>

            <div className="border border-[#e2e2dc] bg-[#f7f7f5] p-8">
              <p className="text-xs uppercase tracking-wide text-[#0c7c59] font-semibold font-sans mb-2">Call for Papers</p>
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">
                18th Annual International Conference of the Society for Terrorism Research (STR): Continuity and Change in the Character of Terrorism
              </h3>
              <p className="text-[#5a5a5a] text-sm font-sans mb-4">
                9–11 December 2026 &middot; Coogee Bay Hotel, Sydney, Australia &middot; Abstract submissions due 31 August 2026
              </p>
              <p className="text-[#2d2d2d] leading-relaxed mb-4">
                The Society for Terrorism Research invites submissions addressing evolving profiles, motivations, actors, tactics, ideologies, and strategies of terrorism, and their implications for counter-terrorism and prevention/countering violent extremism policy and practice. Track categories include conceptual and definitional debates, causes and consequences of terrorism, (de-)radicalisation, psychology and ideologies of terrorism, single-issue and lone-actor terrorism, cyber-terrorism, gender and race and terrorism, (pro-)state terrorism, the crime-terror nexus, warfare and terrorism, and counter-terrorism. Papers, posters, panels (4+ authors), roundtables (3+ discussants), and book talks (3+ discussants) are welcome.
              </p>
              <a
                href="https://indico.global/event/18285/abstracts/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#0c7c59] text-white hover:bg-[#0a6b4d] px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors font-sans"
              >
                Submit an Abstract →
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#f7f7f5] border border-[#e2e2dc] p-6">
              <h3 className="font-bold text-[#1a1a1a] text-xs uppercase tracking-wide mb-3 font-sans">Join the Network</h3>
              <p className="text-sm text-[#5a5a5a] leading-relaxed mb-4">
                Interested in becoming an AVERT member? Learn about research and affiliate membership.
              </p>
              <Link href="/join" className="inline-block bg-[#0c7c59] text-white hover:bg-[#0a6b4d] px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors font-sans">
                Join →
              </Link>
            </div>
            <div className="bg-[#1a1a1a] text-white p-6">
              <h3 className="font-bold text-xs uppercase tracking-wide mb-2 font-sans">Contact Us</h3>
              <p className="text-[#999999] text-sm leading-relaxed mb-3">
                For funding opportunities or collaboration enquiries:
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
