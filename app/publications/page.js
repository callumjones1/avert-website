import Link from 'next/link'
import PublicationsList from '@/components/PublicationsList'

export const metadata = {
  title: 'Publications — AVERT Research Network',
  description: 'Research publications, reports and resources from AVERT network members.',
}

const publications = [
  {
    title: 'AVERT Submission to the Independent National Security Legislation Monitor (INSLM)',
    authors: 'AVERT Research Network',
    year: '2025',
    type: 'Submission',
    url: '/publications/AVERT-INSLM-Submission-2025.pdf',
  },
  {
    title: 'Public Release: Profiles of Individual Radicalisation in Australia (PIRA) Database',
    authors: 'Emma Belton and Adrian Cherney',
    year: '2025',
    type: 'Database',
    url: 'https://espace.library.uq.edu.au/view/UQ:0798ead',
  },
  {
    title: 'New Directions in Radicalisation and Violent Extremism: A Literature Review',
    authors: 'Josh Roose, Shahram Akbarzadeh and Vivian Gerrand',
    year: '2024',
    type: 'Report',
    url: '/publications/National-Research-Project-Phase-1-Report.pdf',
  },
  {
    title: 'AVERT Submission to the Legal and Constitutional Affairs References Committee of the Senate',
    authors: 'AVERT Research Network',
    year: '2024',
    type: 'Submission',
    url: '/publications/AVERT-Senate-Submission-2024.pdf',
  },
  {
    title: 'Rapid Evidence Assessment on Disguised Compliance',
    authors: 'Adrian Cherney, Amy Templar and Daniel Koehler',
    year: '2022',
    type: 'Report',
    url: '/publications/REA-Disguised-Compliance.pdf',
  },
  {
    title: 'Rapid Evidence Assessment on Disguised Compliance (German translation)',
    authors: 'Adrian Cherney, Amy Templar and Daniel Koehler',
    year: '2022',
    type: 'Report',
    url: '/publications/REA-Disguised-Compliance-German.pdf',
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
    url: '/publications/AVERT-PJCIS-Inquiry-2021.pdf',
  },
  {
    title: 'Rapid Evidence Assessment on Neurodiversity and Violent Extremism',
    authors: 'Rachel Worthington, Zainab Al-Attar, Alexandra Lewis and Natalie Pyszora',
    year: '2021',
    type: 'Report',
    url: '/publications/REA-Neurodiversity.pdf',
  },
  {
    title: 'Rapid Evidence Assessment on Alternative Narratives',
    authors: 'Joshua M. Roose, Vivian Gerrand and Shahram Akbarzadeh',
    year: '2021',
    type: 'Report',
    url: '/publications/REA-Alternative-Narratives.pdf',
  },
  {
    title: 'Rapid Evidence Assessment: An International Review of Terrorist Recidivism',
    authors: 'Chad Whelan, David Bright and Paige Fletcher',
    year: '2021',
    type: 'Report',
    url: '/publications/REA-Terrorist-Recidivism.pdf',
  },
]

export default function PublicationsPage() {
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

      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Intro */}
        <p className="text-[#2d2d2d] leading-relaxed mb-10 max-w-3xl">
          AVERT members are strongly committed to the accessible dissemination of research findings and outcomes.
          We publish through reports, journal articles, books and book chapters, and media commentary.
          Individual member publication lists are available on{' '}
          <Link href="/people" className="text-[#0c7c59] hover:underline">researcher profile pages</Link>.
          Below you can find research publications commissioned or facilitated by the AVERT Network.
        </p>

        {/* Publications by year, filterable by type */}
        <PublicationsList publications={publications} />

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
