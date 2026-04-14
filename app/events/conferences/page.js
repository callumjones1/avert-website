import Link from 'next/link'

export const metadata = {
  title: 'Past Conferences — AVERT Research Network',
  description: 'Past AVERT Research Network conferences and symposia.',
}

const conferences = [
  {
    title: 'AVERT International Research Symposium 2025',
    date: '24–25 November 2025',
    theme: 'The New Misogyny and The Rise of Violent Extremism',
    keynote: 'Cynthia Miller-Idriss, American University',
    recording_url: 'https://www.avert.net.au/2025-recordings',
    description: 'The 2025 symposium examined the intersection of misogyny and violent extremism, including digital ecosystems, the manosphere, AI-generated extremism, and building digital community resilience.',
  },
  {
    title: 'AVERT International Research Symposium 2024',
    date: '29–30 October 2024',
    theme: 'Fragmented Social Ecologies: Understanding the Emergence of Fluid Extremism',
    keynote: 'Professor Noémie Bouhana, University College London',
    recording_url: 'https://www.avert.net.au/2024-recordings-1-1',
    description: 'The 2024 symposium explored shifting demographics of violent extremism, CVE interventions, the online environment\'s influence on radicalisation, and emerging research methodologies.',
  },
  {
    title: 'Australasian Islamist Radicalisation Symposium (AIRS) 2023',
    date: 'September 2023',
    theme: 'Islamist Radicalisation in the Australasian Context',
    keynote: '',
    recording_url: 'https://www.avert.net.au/airs2023-recordings-1',
    description: 'AIRS 2023 brought together leading researchers to examine Islamist radicalisation processes, online environments, and prevention approaches in the Australasian region.',
  },
  {
    title: 'AVERT Research Symposium 2022',
    date: '2022',
    theme: '',
    keynote: '',
    recording_url: 'https://www.avert.net.au/ars2022-recordings',
    description: '',
  },
  {
    title: 'AVERT Research Symposium (with TSAS)',
    date: '2021',
    theme: 'Religion and the Far Right',
    keynote: '',
    recording_url: 'https://www.avert.net.au/avert-symposium-recordings',
    description: '',
  },
]

export default function ConferencesPage() {
  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/events" className="text-white/60 hover:text-white text-sm mb-6 inline-block font-sans">← Events</Link>
          <h1 className="text-4xl font-bold mb-3 mt-4">Past Conferences</h1>
          <div className="w-12 h-0.5 bg-white/40 mb-4" />
          <p className="text-white/80 max-w-2xl leading-relaxed">
            AVERT hosts an annual International Research Symposium bringing together researchers, practitioners, and policymakers working on violent extremism and radicalisation.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="space-y-8">
          {conferences.map((conf, i) => (
            <div key={i} className="border border-[#e2e2dc] bg-white p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#999999] uppercase tracking-wide mb-2 font-sans">{conf.date}</p>
                  <h2 className="text-xl font-bold text-[#1a1a1a] mb-2 leading-snug">{conf.title}</h2>
                  {conf.theme && (
                    <p className="text-sm font-semibold text-[#0c7c59] mb-3 font-sans">
                      Theme: {conf.theme}
                    </p>
                  )}
                  {conf.keynote && (
                    <p className="text-sm text-[#5a5a5a] mb-3">
                      <span className="font-semibold text-[#1a1a1a]">Keynote: </span>{conf.keynote}
                    </p>
                  )}
                  {conf.description && (
                    <p className="text-sm text-[#5a5a5a] leading-relaxed">{conf.description}</p>
                  )}
                </div>
                {conf.recording_url && (
                  <div className="flex-shrink-0">
                    <a
                      href={conf.recording_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block border border-[#0c7c59] text-[#0c7c59] hover:bg-[#0c7c59] hover:text-white px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors font-sans"
                    >
                      Recordings →
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
