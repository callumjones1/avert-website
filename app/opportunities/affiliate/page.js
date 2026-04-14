import Link from 'next/link'

export const metadata = {
  title: 'Affiliate Membership — AVERT Research Network',
  description: 'Join the AVERT Research Network as an affiliate member.',
}

const benefits = [
  { title: 'Resources', desc: 'Browse and download publicly available research resources and publications.' },
  { title: 'Events', desc: 'Advance notice of AVERT events, seminars, symposia, workshops, masterclasses and roundtables.' },
  { title: 'AVERT Newsletter', desc: 'Quarterly round-up of AVERT activities, publications, resources and links.' },
  { title: 'Engagement & Collaboration', desc: 'Find and collaborate with AVERT members from academia, community and government; share news of related events and activities; propose topics for AVERT seminars or blogs.' },
]

export default function AffiliateMembershipPage() {
  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/opportunities" className="text-white/60 hover:text-white text-sm mb-6 inline-block font-sans">← Opportunities</Link>
          <h1 className="text-4xl font-bold mb-3 mt-4">Affiliate Membership</h1>
          <div className="w-12 h-0.5 bg-white/40" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <div className="mb-10">
              <p className="text-[#2d2d2d] leading-relaxed mb-5">
                Affiliate membership of the AVERT Research Network is open to individuals, community organisations
                and groups, service providers, NGOs, think tanks and government agencies with an interest in AVERT's
                focus and activities.
              </p>
              <p className="text-[#2d2d2d] leading-relaxed mb-5">
                Affiliate members stay in touch with current research, opportunities for workshops, seminars, policy
                briefs and roundtables, and opportunities for collaboration with researchers and other potential partners
                for project ideas and development.
              </p>
              <p className="text-sm text-gray-500 italic">
                Note: Masters and Doctoral students are eligible for Affiliate membership. Upon conferral of a doctoral degree,
                affiliate members may apply to upgrade to Research Membership.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="text-xl font-bold text-[#111827] mb-6">Affiliate Benefits</h2>
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
              <h3 className="font-bold text-[#111827] mb-3">Become an Affiliate Member</h3>
              <p className="text-sm text-[#2d2d2d] leading-relaxed mb-6">
                If you are interested in joining AVERT as an affiliate member, please contact us to begin your application.
              </p>
              <a
                href="mailto:adi-avert@deakin.edu.au?subject=Affiliate Membership Application"
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
                <li><Link href="/opportunities/research" className="text-[#0c7c59] hover:underline">Research Membership →</Link></li>
                <li><Link href="/opportunities/affiliate" className="text-[#0c7c59] font-semibold">Affiliate Membership</Link></li>
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
            <div className="border border-[#e2e2dc] bg-white p-6">
              <h3 className="font-bold text-[#111827] text-xs uppercase tracking-wide mb-3 font-sans">Already a researcher?</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                If you meet the research membership criteria, consider applying as a research member instead.
              </p>
              <Link href="/opportunities/research" className="text-sm text-[#0c7c59] hover:underline font-semibold font-sans">
                Research Membership →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
