import Link from 'next/link'

export const metadata = {
  title: 'Webinars — AVERT Research Network',
  description: 'Past AVERT Research Network webinars on violent extremism and radicalisation.',
}

const webinars = {
  '2026': [
    {
      title: 'AVERT Webinar with Dr Ali Fisher — Jihadism and the Bondi Attack: Disrupting IS and AQ Strategy in 2026',
      videoId: null,
    },
    {
    title: 'AVERT Webinar with Rahel Kellich — Education in Christian Fundamentalism: Current Developments and Challenges for Civic Education',
      videoId: null,
    },
  ],
  '2025': [
    { title: 'AVERT Webinar with Dr Rik Peels — Cognitive and Behavioral Radicalization: An Explanatory Split', videoId: 'vUF1DQsMmcc' },
    { title: 'AVERT Webinar with Dr Joel Busher — Violence escalation and inhibition during far-right protest waves', videoId: 'KVig_gtqQAI' },
    { title: 'AVERT Webinar with Dr Emma Belton — Public Release of the Profiles of Individual Radicalisation in Australia (PIRA) Database', videoId: 'TH-0faGSTDI' },
    { title: 'AVERT Hybrid Event — 2025 Global Terrorism Index Launch', videoId: '5DPUSC-idg8' },
    { title: 'AVERT Webinar with Dr Julie Chernov Hwang — The Disbanding of Jemaah Islamiyah', videoId: 'wn1Kkr7jhOI' },
    { title: 'AVERT Webinar with Dr Arie Perliger — Exploring the Religious Dimensions of American Far-Right Extremist Discourse', videoId: '7k84AwUgx_4' },
    { title: 'AVERT Webinar — Emerging Global Perspectives on Preventing and Countering Violent Extremism', videoId: 'XTgXv11QhWc' },
    { title: 'Rethinking religion and radicalisation: The role(s) of religion in far-right extremist movements', videoId: 'dEL-Cai32QY' },
    { title: 'AVERT Webinar with Dr Nell Bennett — The Bureaucracy of Violence: Organisational Survival and the Challenge of Disengagement', videoId: 'je6gQmZAfzw' },
    { title: 'AVERT Webinar with Dr Keiran Hardy — How (Not) to Argue with a Sovereign Citizen', videoId: 'm9A3p7BMxBY' },
    { title: 'AVERT Webinar with Dr Imogen Richards — The Aesthetic Politics of Far-right Environmentalism', videoId: 's3LH4HM5Muk' },
  ],
  '2024': [
    { title: 'AVERT Webinar with A/Prof Mario Peucker — Understanding and Countering the Rise of the Far-Right', videoId: '690sKFBZqNI' },
    { title: 'AVERT Webinar with Dr Suraj Lakhani — The nexus between videogaming and violent extremism', videoId: 'Il7HlfFAtuU' },
    { title: 'AVERT Webinar with Dr Aaron Y Zelin — The Evolution of the Islamic State', videoId: 'zMmjGmEEznI' },
    { title: 'AVERT Webinar with Dr Julia Ebner — Is There a Language of Terrorists?', videoId: 'dCHZ5109pSw' },
    { title: 'AVERT Webinar with Dr Imogen Richards — The Far Right and the Environment in Australia', videoId: null },
    { title: 'AVERT Webinar with Professor John Horgan — Terrorist Minds', videoId: null },
    { title: 'AVERT Webinar — Research on Radicalisation: Where have we got to and ways forward', videoId: 'PdGzWAfvhII' },
    { title: 'AVERT Webinar with Jade Hutchinson — "The Far-Right Online Ecosystem"', videoId: 'NmICee0a6YM' },
    { title: 'AVERT Webinar with Dr Lauren Moulds and John Young — Rethinking CVE Interventions: a needs based approach', videoId: 'Y-kxb3XzNu8' },
    { title: 'AVERT Webinar with Professor Stuart Macdonald — "Outlinks": Violent Jihadist Online Propaganda Dissemination Strategies', videoId: 'jfiHMlX37X0' },
  ],
  '2023': [
    { title: 'AVERT Webinar with Professor Daniel Byman — The October 7th Attacks: Hamas Goals, Israeli Response and Global Impacts', videoId: null },
    { title: 'AVERT Webinar with Professor Sébastien Brouillette-Alarie — Systematic review of the reliability and validity of risk tools for violent radicalization', videoId: 'LCm1fBkMBy8' },
    { title: 'AVERT Webinar with Associate Professor David Malet — Ukraine Foreign Fighters: Volunteers on the Right Side or the Far-Right\'s ISIS?', videoId: 'd8-m_GhAdRA' },
    { title: 'AVERT Webinar with Emma Belton — Understanding the progression to violence: Background characteristics and risk factors', videoId: null },
    { title: 'AVERT Webinar with Dr Marc-André Argentino — QAnon as a New Religious Movement and its Implications for Violent Extremism', videoId: null },
    { title: 'AVERT Webinar with Dr Vivian Gerrand — Understanding conspiritual radicalisation and militant wellness movements', videoId: 'o0U2ytHzGBI' },
    { title: 'AVERT Webinar with Professor Joel Busher — Pathways Towards and Away From Violence During Waves of Far Right Protest', videoId: null },
    { title: 'AVERT Webinar with Professor Paul Thomas — The State of British Preventing and Countering Violent Extremism (P/CVE)', videoId: null },
  ],
  '2022': [
    { title: 'AVERT Webinar with Dr Imogen Richards — Far Right Identitarianism and the Great Replacement Conspiracy in Australia', videoId: null },
    { title: 'AVERT Webinar with Professor Jan-Willem van Prooijen — Belief in Conspiracy Theories and Extremism', videoId: null },
    { title: 'AVERT Webinar with Annemarie van de Weert — The Role of Subjectivity in the Early Detection of Violent Extremism Among Youth', videoId: null },
    { title: 'AVERT Webinar with Professor Maura Conway — Online Extremism and Terrorism: What to Watch for in 2022', videoId: null },
  ],
  '2021': [
    { title: 'TSAS AVERT — Religion and the Far Right', videoId: null },
    { title: 'AVERT Webinar — Rethinking US Efforts on Counterterrorism: Toward a Sustainable Plan 20 Years after 9/11', videoId: null },
    { title: 'AVERT Webinar — Afghanistan and the Return of the Taliban', videoId: null },
    { title: 'AVERT Webinar — The Gendered Dimensions of Violent Extremism', videoId: null },
    { title: 'AVERT Webinar with Dr Amarnath Amarasingam — Examining Sri Lanka\'s Easter Bombings Two Years On', videoId: null },
    { title: 'AVERT Webinar — White Nationalist Extremism: Definitions, Dimensions, and Research Directions', videoId: null },
  ],
}

function WebinarTile({ title, videoId }) {
  if (videoId) {
    return (
      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        <div className="relative w-full overflow-hidden bg-[#111]" style={{ paddingBottom: '56.25%' }}>
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-75"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-[#ff0000] rounded-full flex items-center justify-center shadow-lg opacity-90 group-hover:opacity-100 transition-opacity duration-200">
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="pt-2.5">
          <p className="text-sm font-medium text-[#2d2d2d] group-hover:text-[#0c7c59] leading-snug line-clamp-3 transition-colors duration-150 font-sans">
            {title}
          </p>
        </div>
      </a>
    )
  }

  return (
    <div className="block">
      <div
        className="relative w-full bg-[#f3f3f3] border border-[#e2e2dc] flex items-center justify-center"
        style={{ paddingBottom: '56.25%' }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
          <svg className="w-7 h-7 text-[#c8c8c8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.862v6.276a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="text-xs text-[#b0b0b0] font-sans">No recording</span>
        </div>
      </div>
      <div className="pt-2.5">
        <p className="text-sm font-medium text-[#888888] leading-snug line-clamp-3 font-sans">
          {title}
        </p>
      </div>
    </div>
  )
}

export default function WebinarsPage() {
  const years = Object.keys(webinars).sort((a, b) => b - a)

  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/events" className="text-white/60 hover:text-white text-sm mb-6 inline-block font-sans transition-colors">← Events</Link>
          <h1 className="text-4xl font-bold mb-3 mt-4">Webinars</h1>
          <div className="w-12 h-0.5 bg-white/40 mb-4" />
          <p className="text-white/80 max-w-2xl leading-relaxed">
            AVERT regularly hosts online webinars featuring leading researchers on violent extremism, terrorism, radicalisation, and countering violent extremism.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="space-y-14">
          {years.map((year) => (
            <div key={year}>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a1a]">{year}</h2>
                <div className="flex-1 h-px bg-[#e2e2dc]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {webinars[year].map((item, i) => (
                  <WebinarTile key={i} title={item.title} videoId={item.videoId} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
