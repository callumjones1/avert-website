import Link from 'next/link'

export const metadata = {
  title: 'About AVERT',
  description: 'About the AVERT Research Network — a multidisciplinary research initiative on violent extremism and radicalisation.',
}

const principles = [
  'Serve as a genuine and inclusive consortium of demonstrated research experts and contributors across universities, civil society, communities and government',
  'Collaboration, not competition; synergies, not silos',
  'Transparency, trust and respect in how we engage with all stakeholders and partners',
  'Commitment to evidence-based research and practice drawing on both theoretical insights and empirical data',
  'Research outcomes that deliver social benefits and inform effective policy and practice',
  'Systematic and public sharing, exchange and dialogue on new knowledge and outcomes',
  'Innovation and rigour in research design and methodologies',
  'Relationship and connectivity benefits that flow back to all participants in research enterprises',
  'Integrity in promoting independent and constructive critique and dialogue',
]

export default function AboutPage() {
  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">About AVERT</h1>
          <div className="w-12 h-0.5 bg-white/40 mb-4" />
          <p className="text-white/80 max-w-2xl leading-relaxed">
            The Addressing Violent Extremism and Radicalisation to Terrorism Research Network.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          <div className="md:col-span-2 space-y-5 text-[#2d2d2d] leading-relaxed">
            <p>
              The Addressing Violent Extremism and Radicalisation to Terrorism (AVERT) Research Network is a multidisciplinary, multi-institutional research initiative based in Melbourne, Australia, supported by Deakin University's Alfred Deakin Institute for Citizenship and Globalisation (ADI). Our Network is composed of highly engaged and critically informed social science, humanities and multidisciplinary research academics from a variety of universities and research institutions who believe in conducting meaningful evidence-based research for the public good.
            </p>
            <p>
              As an Australian-based research network, we engage globally with colleagues, institutions, and issues and trends, while remaining strongly grounded in local contexts and knowledge relevant for Australian community and policy landscapes.
            </p>
            <p>
              The AVERT Network brings together researchers, community, government and civil society stakeholders to understand and reduce the social harms created by violent extremism and terrorism, as well as the effects of counter-extremism and counterterrorism on the fabric of our local, national and transnational communities.
            </p>
            <p>
              AVERT members conduct research into a wide array of topics related to terrorism, radicalisation and violent extremism. Specific areas of focus and inquiry can be found on individual members' profile pages.
            </p>

            <div className="pt-4">
              <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Our Guiding Principles</h2>
              <ul className="space-y-3">
                {principles.map((p, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0c7c59] mt-2.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="pt-2 text-[#5a5a5a] text-sm border-t border-[#e2e2dc] pt-6 mt-4">
              Affiliate membership of the AVERT Research Network is open to individuals working with community organisations and groups, service providers, NGOs, think tanks and government agencies with an interest in AVERT's focus and activities.{' '}
              <Link href="/opportunities/affiliate" className="text-[#0c7c59] hover:underline">Learn more about affiliate membership →</Link>
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-[#f7f7f5] border border-[#e2e2dc] p-6">
              <h3 className="font-bold text-[#1a1a1a] text-xs uppercase tracking-wide mb-4 font-sans">About the Network</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about-avert/governance" className="text-[#0c7c59] hover:underline">Structure & Governance →</Link></li>
                <li><Link href="/about-avert/faqs" className="text-[#0c7c59] hover:underline">FAQs →</Link></li>
                <li><Link href="/people" className="text-[#0c7c59] hover:underline">Our Researchers →</Link></li>
                <li><Link href="/opportunities" className="text-[#0c7c59] hover:underline">Join AVERT →</Link></li>
              </ul>
            </div>
            <div className="bg-[#e8f5f0] border border-[#0c7c59]/20 p-6">
              <h3 className="font-bold text-[#0c7c59] text-xs uppercase tracking-wide mb-2 font-sans">Supported by</h3>
              <p className="text-[#2d2d2d] text-sm leading-relaxed">
                Alfred Deakin Institute for Citizenship and Globalisation, Deakin University, Melbourne, Australia.
              </p>
            </div>
            <div className="bg-[#f7f7f5] border border-[#e2e2dc] p-6">
              <h3 className="font-bold text-[#1a1a1a] text-xs uppercase tracking-wide mb-2 font-sans">Contact</h3>
              <a href="mailto:adi-avert@deakin.edu.au" className="text-[#0c7c59] hover:underline text-sm">
                adi-avert@deakin.edu.au
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
