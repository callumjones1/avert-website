import staticData from '@/data/static.json'
import Link from 'next/link'

export const metadata = {
  title: 'Research Membership — AVERT Research Network',
  description: 'Join the AVERT Research Network as a research member.',
}

const benefits = [
  { title: 'Resources', desc: 'Browse and download all research resources uploaded and curated by AVERT members.' },
  { title: 'Events', desc: 'Advance notice of AVERT events, seminars, symposia, workshops, masterclasses and roundtables.' },
  { title: 'Early Bird Ticketing', desc: 'Priority registration and ticketing to all AVERT events.' },
  { title: 'AVERT Research Newsletter', desc: 'Research member news, up to date funding opportunities, calls for papers and job opportunities.' },
  { title: 'Engagement & Collaboration', desc: 'Propose topics for seminars, projects, conferences and publications; find and collaborate with other AVERT members from academia, community and government.' },
]

export default function ResearchMembershipPage() {
  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/opportunities" className="text-white/60 hover:text-white text-sm mb-6 inline-block font-sans">← Opportunities</Link>
          <h1 className="text-4xl font-bold mb-3 mt-4">Research Membership</h1>
          <div className="w-12 h-0.5 bg-white/40" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <div className="mb-10">
              <h2 className="text-xl font-bold text-[#111827] mb-6">Eligibility Criteria</h2>
              <div className="space-y-6">
                <div className="flex gap-5">
                  <div className="w-8 h-8 bg-[#0c7c59] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 font-sans">1</div>
                  <div>
                    <h3 className="font-bold text-[#111827] mb-2">Active Researcher</h3>
                    <p className="text-[#2d2d2d] leading-relaxed text-sm">
                      Research members must be active researchers in any discipline in the area of addressing violent extremism
                      and radicalisation to terrorism. 'Active research' is defined as having:
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-[#2d2d2d]">
                      <li className="flex gap-2"><span className="text-[#0c7c59] font-bold">a)</span> Published at least 3 peer-reviewed research publications and/or publicly available research reports over the last 5 years; and/or</li>
                      <li className="flex gap-2"><span className="text-[#0c7c59] font-bold">b)</span> Received at least one externally funded research grant supporting research relevant to AVERT's focus over the last five years.</li>
                    </ul>
                    <p className="mt-3 text-sm text-gray-500 italic">
                      Note: Masters and Doctoral students are only eligible for Affiliate membership. Once a doctoral degree is conferred, the applicant can be upgraded to a Research member.
                    </p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="w-8 h-8 bg-[#0c7c59] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 font-sans">2</div>
                  <div>
                    <h3 className="font-bold text-[#111827] mb-2">Active Participation</h3>
                    <p className="text-[#2d2d2d] leading-relaxed text-sm">
                      Research members are expected to be active participants in AVERT engagement activities and to share information
                      about their research projects, publications and related activities with other members through the AVERT Newsletter
                      and AVERT website.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-xl font-bold text-[#111827] mb-6">Member Benefits</h2>
              <div className="space-y-4">
                {benefits.map((b) => (
                  <div key={b.title} className="flex gap-4 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0c7c59] flex-shrink-0 mt-2" />
                    <div>
                      <span className="font-semibold text-[#111827]">{b.title}</span>
                      <span className="text-[#2d2d2d] text-sm"> — {b.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#f7f7f5] border border-[#e2e2dc] p-8">
              <h3 className="font-bold text-[#111827] mb-3">Apply for Research Membership</h3>
              <p className="text-sm text-[#2d2d2d] leading-relaxed mb-6">
                If you are interested in joining AVERT as a research member and fulfil the above criteria,
                please contact us to begin your application.
              </p>
              <a
                href="mailto:adi-avert@deakin.edu.au?subject=Research Membership Application"
                className="inline-block bg-[#0c7c59] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-[#0a6b4d] transition-colors font-sans"
              >
                Apply Now
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#f7f7f5] border border-[#e2e2dc] p-6">
              <h3 className="font-bold text-[#111827] text-xs uppercase tracking-wide mb-4 font-sans">Membership Options</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/opportunities/research" className="text-[#0c7c59] font-semibold">Research Membership</Link></li>
                <li><Link href="/opportunities/affiliate" className="text-[#0c7c59] hover:underline">Affiliate Membership →</Link></li>
              </ul>
            </div>
            <div className="bg-[#1a1a1a] text-white p-6">
              <h3 className="font-bold text-xs uppercase tracking-wide mb-2 font-sans">Questions?</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                Contact the AVERT team for any membership enquiries.
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
