import Link from 'next/link'

export const metadata = {
  title: 'Publications — AVERT Research Network',
  description: 'Research publications, reports and resources from AVERT network members.',
}

const publications = [
  {
    title: 'Public Release: Profiles of Individual Radicalisation in Australia (PIRA) Database',
    authors: 'AVERT Research Network',
    year: '2024',
    type: 'Database',
    url: 'https://espace.library.uq.edu.au/view/UQ:0798ead',
  },
  {
    title: 'New Directions in Radicalisation and Violent Extremism: A Literature Review',
    authors: 'Emma Belton and Adrian Cherney',
    year: '2025',
    type: 'Report',
    url: 'https://www.avert.net.au/s/National-Research-Project-Phase-1-Report-New-Directions-in-Radicalisation-and-Violent-Extremism-9102-tpw8.pdf',
  },
  {
    title: 'AVERT Submission to the Legal and Constitutional Affairs References Committee of the Senate',
    authors: 'Josh Roose, Shahram Akbarzadeh and Vivian Gerrand',
    year: '2024',
    type: 'Submission',
    url: 'https://static1.squarespace.com/static/6155080406f6bc53e0ef6a1b/t/662b0f001f65d76f79495c8b/1714097973193/AVERT+Submission+to+the+Legal+and+Constitutional+Affairs+References+Committee+of+the+Senate.pdf',
  },
  {
    title: 'Rapid Evidence Assessment on Disguised Compliance',
    authors: 'Adrian Cherney, Amy Templar and Daniel Koehler',
    year: '2022',
    type: 'Report',
    url: 'https://static1.squarespace.com/static/6155080406f6bc53e0ef6a1b/t/632ab47d8b01c1369355cd0b/1663743103910/REA+-+Disguised+Compliance.pdf',
  },
  {
    title: 'Rapid Evidence Assessment on Disguised Compliance (German translation)',
    authors: 'Adrian Cherney, Amy Templar and Daniel Koehler',
    year: '2022',
    type: 'Report',
    url: 'https://static1.squarespace.com/static/6155080406f6bc53e0ef6a1b/t/63c51f9580a74c62c6f80502/1673863063389/konex_Australienstudie_p3.pdf',
  },
  {
    title: 'AVERT Submission to the Victorian Parliamentary Inquiry into Extremism in Victoria',
    authors: 'AVERT Research Network',
    year: '2022',
    type: 'Submission',
    url: 'https://www.parliament.vic.gov.au/495e84/contentassets/be1e1556ff464d1d969bb450051838b0/submission-documents/017.-final-avert-research-network_redacted.pdf',
  },
  {
    title: 'AVERT Submission to the Parliamentary Joint Committee on Intelligence and Security Inquiry into Extremist Movements and Radicalism in Australia',
    authors: 'Michele Grossman, Adrian Cherney, Hass Dellal, Joshua M. Roose, Mark Duckworth and Lydia Khalil',
    year: '2021',
    type: 'Submission',
    url: 'https://static1.squarespace.com/static/6155080406f6bc53e0ef6a1b/t/6239ae9fda18be043e00872f/1647947424842/AVERT%2BPJCIS%2BInquiry%2BFINAL%2BVERSION%2B12.02.21.pdf',
  },
  {
    title: 'Rapid Evidence Assessment on Neurodiversity and Violent Extremism',
    authors: 'Rachel Worthington, Zainab Al-Attar, Alexandra Lewis and Natalie Pyszora',
    year: '2021',
    type: 'Report',
    url: 'https://www.avert.net.au/s/Rapid-Evidence-Assessment-on-Neurodiversity-and-Violent-Extremism.pdf',
  },
  {
    title: 'Rapid Evidence Assessment on Alternative Narratives',
    authors: 'Joshua M. Roose, Vivian Gerrand and Shahram Akbarzadeh',
    year: '2021',
    type: 'Report',
    url: 'https://static1.squarespace.com/static/6155080406f6bc53e0ef6a1b/t/621f4421c925935a64be3a8e/1646216255319/REA+-+Alternative+Narratives+%28Roose+Gerrand+Akbarzadeh%29%5B3%5D.pdf',
  },
  {
    title: 'Rapid Evidence Assessment: An International Review of Terrorist Recidivism',
    authors: 'Chad Whelan, David Bright and Paige Fletcher',
    year: '2021',
    type: 'Report',
    url: 'https://static1.squarespace.com/static/6155080406f6bc53e0ef6a1b/t/621f451cd5107921f635bcf4/1646216477690/Final+REA+Report%5B2%5D.pdf',
  },
]

const typeColour = {
  'Database': 'bg-[#0c7c59] text-white',
  'Report': 'bg-[#e8f5f0] text-[#0c7c59] border border-[#0c7c59]/20',
  'Submission': 'bg-gray-100 text-gray-600',
}

export default function PublicationsPage() {
  const byYear = {}
  for (const pub of publications) {
    if (!byYear[pub.year]) byYear[pub.year] = []
    byYear[pub.year].push(pub)
  }
  const years = Object.keys(byYear).sort((a, b) => b - a)

  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Publications</h1>
          <div className="w-12 h-0.5 bg-white/40 mb-4" />
          <p className="text-white/80 max-w-2xl leading-relaxed">
            Research publications, reports, and policy submissions produced by or commissioned through the AVERT Research Network.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14">
        {/* Intro */}
        <p className="text-[#2d2d2d] leading-relaxed mb-10 max-w-3xl">
          AVERT members are strongly committed to the accessible dissemination of research findings and outcomes.
          We publish through reports, journal articles, books and book chapters, and media commentary.
          Individual member publication lists are available on{' '}
          <Link href="/people" className="text-[#0c7c59] hover:underline">researcher profile pages</Link>.
          Below you can find research publications commissioned or facilitated by the AVERT Network.
        </p>

        {/* Publications by year */}
        <div className="space-y-12">
          {years.map((year) => (
            <div key={year}>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-[#1a1a1a]">{year}</h2>
                <div className="flex-1 h-px bg-[#e2e2dc]" />
              </div>
              <div className="space-y-4">
                {byYear[year].map((pub, i) => (
                  <a
                    key={i}
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-5 border border-[#e2e2dc] hover:border-[#0c7c59] bg-white p-6 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 font-sans ${typeColour[pub.type] || typeColour['Report']}`}>
                          {pub.type}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#1a1a1a] group-hover:text-[#0c7c59] leading-snug transition-colors mb-1">
                        {pub.title}
                      </h3>
                      <p className="text-sm text-gray-500">{pub.authors}</p>
                    </div>
                    <span className="text-xs font-semibold text-[#0c7c59] uppercase tracking-wide font-sans flex-shrink-0 mt-1">
                      Read →
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Separator */}
        <div className="border-t border-[#e2e2dc] mt-14 pt-10">
          <h3 className="font-bold text-[#1a1a1a] mb-3">Individual Member Publications</h3>
          <p className="text-[#2d2d2d] text-sm leading-relaxed mb-4">
            AVERT members publish extensively in peer-reviewed journals, books, and policy outlets.
            Individual publication lists are available on each researcher's profile page.
          </p>
          <Link
            href="/people"
            className="inline-block bg-[#0c7c59] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-[#0a6b4d] transition-colors font-sans"
          >
            Browse Researchers →
          </Link>
        </div>
      </div>
    </>
  )
}
