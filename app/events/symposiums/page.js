import Link from 'next/link'

export const metadata = {
  title: 'Symposiums — AVERT Research Network',
  description: 'Past AVERT Research Network international research symposiums on violent extremism.',
}

const symposiums = [
  {
    year: '2025',
    title: 'AVERT International Research Symposium 2025',
    theme: 'Signal or noise? Navigating the changing nature of violent extremism online',
    dates: '24–26 November 2025',
    location: 'Deakin Downtown Campus, Melbourne, Australia',
    keynote: 'Professor Cynthia Miller-Idriss (American University, Washington DC)',
    description: 'The pace and scale of technological development is expanding the ways propaganda is disseminated and the types of people and groups who are vulnerable to violent extremism. At the same time, emergent online violent extremist subcultures and movements are becoming ever more cross-platform, transnational, and normalised. These shifting dynamics make it harder to distinguish meaningful threats (\u2018signal\u2019) from background activity (\u2018noise\u2019) online.',
    recordings_url: 'https://www.avert.net.au/2025-recordings',
    program_url: '',
  },
  {
    year: '2024',
    title: 'AVERT International Research Symposium 2024',
    theme: 'People, Places and Spaces: New Dynamics and Shifting Responses to Violent Extremism',
    dates: '29–31 October 2024',
    location: 'Deakin University, Melbourne, Australia',
    keynote: '',
    description: 'In recent years there have been demographic shifts in the people drawn to or participating in violent extremism, the places they come from and the spaces where they participate in and mobilise to violence.',
    recordings_url: 'https://www.avert.net.au/2024-recordings-1-1',
    program_url: '',
  },
  {
    year: '2023',
    title: 'AVERT International Research Symposium 2023 (AIRS)',
    theme: 'Democracy, Dissent and Countering Violent Extremism',
    dates: '26–28 September 2023',
    location: 'Deakin University, Melbourne, Australia',
    keynote: '',
    description: 'The counterterrorism and countering violent extremism frameworks of many democracies were established in the immediate post-9/11 context. Today, democracies around the world face additional challenges such as increasing polarisation, declining trust in institutions, and growing adherence to anti-government conspiracies.',
    recordings_url: 'https://www.avert.net.au/airs2023-recordings-1',
    program_url: 'https://www.avert.net.au/s/AIRS23-PROGRAM-25SEPT.pdf',
  },
  {
    year: '2022',
    title: 'AVERT Research Symposium 2022',
    theme: 'The Space Between: New Directions for CVE Interventions',
    dates: '21–22 November 2022',
    location: 'Deakin University, Melbourne, Australia',
    keynote: '',
    description: 'Interventions in countering violent extremism (CVE) have traditionally been focused on three dimensions: building resilience in general society, diverting individuals identified as at risk, and disengaging or reintegrating those already involved.',
    recordings_url: 'https://www.avert.net.au/ars2022-recordings',
    program_url: 'https://www.avert.net.au/s/AVERT-Symposium-2022-Conference-Program-FINAL-UPDATED-3.pdf',
  },
  {
    year: '2021',
    title: 'AVERT 2021 Research Symposium',
    theme: '',
    dates: '3–5 November 2021',
    location: 'Deakin University, Melbourne, Australia',
    keynote: '',
    description: '',
    recordings_url: 'https://www.avert.net.au/avert-symposium-recordings',
    program_url: 'https://www.avert.net.au/s/AVERT-2021-Research-Symposium-Updated.pdf',
  },
  {
    year: '2021',
    title: 'AVERT Violent Extremism Risk Assessment Conference',
    theme: '',
    dates: '17–18 June 2021',
    location: 'Online',
    keynote: '',
    description: '',
    recordings_url: '',
    program_url: '',
  },
]

export default function SymposiumsPage() {
  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/events" className="text-white/60 hover:text-white text-sm mb-6 inline-block font-sans">← Events</Link>
          <h1 className="text-4xl font-bold mb-3 mt-4">Symposiums</h1>
          <div className="w-12 h-0.5 bg-white/40 mb-4" />
          <p className="text-white/80 max-w-2xl leading-relaxed">
            AVERT hosts annual international research symposiums bringing together researchers, practitioners, and policymakers working on violent extremism, terrorism, and countering violent extremism.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="space-y-8">
          {symposiums.map((sym, i) => (
            <div key={i} className="border border-[#e2e2dc] bg-white p-6">
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 bg-[#0c7c59] text-white text-center px-4 py-3 min-w-20">
                  <p className="text-lg font-bold font-sans">{sym.year}</p>
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-[#1a1a1a] text-base mb-1 leading-snug">{sym.title}</h2>
                  {sym.theme && (
                    <p className="text-sm text-[#0c7c59] font-semibold italic mb-2 font-sans">{sym.theme}</p>
                  )}
                  <p className="text-xs text-gray-400 font-sans mb-3">{sym.dates} · {sym.location}</p>
                  {sym.keynote && (
                    <p className="text-sm text-gray-600 mb-3 font-sans">
                      <span className="font-semibold text-gray-700">Keynote: </span>{sym.keynote}
                    </p>
                  )}
                  {sym.description && (
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{sym.description}</p>
                  )}
                  <div className="flex gap-4 flex-wrap">
                    {sym.recordings_url && (
                      <a
                        href={sym.recordings_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-[#0c7c59] hover:underline font-sans"
                      >
                        Watch recordings →
                      </a>
                    )}
                    {sym.program_url && (
                      <a
                        href={sym.program_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-gray-500 hover:text-[#0c7c59] hover:underline font-sans"
                      >
                        Download program →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
