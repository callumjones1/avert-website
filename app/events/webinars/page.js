import Link from 'next/link'

export const metadata = {
  title: 'Webinars — AVERT Research Network',
  description: 'Past AVERT Research Network webinars on violent extremism and radicalisation.',
}

const webinars = {
  '2026': [
    'AVERT Webinar with Dr Ali Fisher — Jihadism and the Bondi Attack: Disrupting IS and AQ Strategy in 2026',
    'AVERT Webinar with Rahel Kellich — Education in Christian Fundamentalism: Current Developments and Challenges for Civic Education',
  ],
  '2025': [
    'AVERT Webinar with Dr Rik Peels — Cognitive and Behavioral Radicalization: An Explanatory Split',
    'AVERT Webinar with Dr Joel Busher — Violence escalation and inhibition during far-right protest waves',
    'AVERT Webinar with Dr Emma Belton — Public Release of the Profiles of Individual Radicalisation in Australia (PIRA) Database',
    'AVERT Hybrid Event — 2025 Global Terrorism Index Launch',
    'AVERT Webinar with Dr Julie Chernov Hwang — The Disbanding of Jemaah Islamiyah',
    'AVERT Webinar with Dr Arie Perliger — Exploring the Religious Dimensions of American Far-Right Extremist Discourse',
    'AVERT Webinar — Emerging Global Perspectives on Preventing and Countering Violent Extremism',
    'Rethinking religion and radicalisation: The role(s) of religion in far-right extremist movements',
    'AVERT Webinar with Dr Nell Bennett — The Bureaucracy of Violence: Organisational Survival and the Challenge of Disengagement',
    'AVERT Webinar with Dr Keiran Hardy — How (Not) to Argue with a Sovereign Citizen',
    'AVERT Webinar with Dr Imogen Richards — The Aesthetic Politics of Far-right Environmentalism',
    'AVERT Webinar with Dr Mario Peucker — Understanding and Countering the Rise of the Far-Right',
  ],
  '2024': [
    'AVERT Webinar with Dr Suraj Lakhani — The nexus between videogaming and violent extremism',
    'AVERT Webinar with Dr Aaron Y Zelin — The Evolution of the Islamic State',
    'AVERT Webinar with Dr Julia Ebner — Is There a Language of Terrorists?',
    'AVERT Webinar with Dr Imogen Richards — The Far Right and the Environment in Australia',
    'AVERT Webinar with Professor John Horgan — Terrorist Minds',
    'AVERT Webinar — Research on Radicalisation: Where have we got to and ways forward',
    'AVERT Webinar with Jade Hutchinson — "The Far-Right Online Ecosystem"',
    'AVERT Webinar with Dr Lauren Moulds and John Young — Rethinking CVE Interventions: a needs based approach',
    'AVERT Webinar with Professor Stuart Macdonald — "Outlinks": Violent Jihadist Online Propaganda Dissemination Strategies',
  ],
  '2023': [
    'AVERT Webinar with Professor Daniel Byman — The October 7th Attacks: Hamas Goals, Israeli Response and Global Impacts',
    'AVERT Webinar with Professor Sébastien Brouillette-Alarie — Systematic review of the reliability and validity of risk tools for violent radicalization',
    'AVERT Webinar with Associate Professor David Malet — Ukraine Foreign Fighters: Volunteers on the Right Side or the Far-Right\'s ISIS?',
    'AVERT Webinar with Emma Belton — Understanding the progression to violence: Background characteristics and risk factors',
    'AVERT Webinar with Dr Marc-André Argentino — QAnon as a New Religious Movement and its Implications for Violent Extremism',
    'AVERT Webinar with Dr Vivian Gerrand — Understanding conspiritual radicalisation and militant wellness movements',
    'AVERT Webinar with Professor Joel Busher — Pathways Towards and Away From Violence During Waves of Far Right Protest',
    'AVERT Webinar with Professor Paul Thomas — The State of British Preventing and Countering Violent Extremism (P/CVE)',
  ],
  '2022': [
    'AVERT Webinar with Dr Imogen Richards — Far Right Identitarianism and the Great Replacement Conspiracy in Australia',
    'AVERT Webinar with Professor Jan-Willem van Prooijen — Belief in Conspiracy Theories and Extremism',
    'AVERT Webinar with Annemarie van de Weert — The Role of Subjectivity in the Early Detection of Violent Extremism Among Youth',
    'AVERT Webinar with Professor Maura Conway — Online Extremism and Terrorism: What to Watch for in 2022',
  ],
  '2021': [
    'TSAS AVERT — Religion and the Far Right',
    'AVERT Webinar — Rethinking US Efforts on Counterterrorism: Toward a Sustainable Plan 20 Years after 9/11',
    'AVERT Webinar — Afghanistan and the Return of the Taliban',
    'AVERT Webinar — The Gendered Dimensions of Violent Extremism',
    'AVERT Webinar with Dr Amarnath Amarasingam — Examining Sri Lanka\'s Easter Bombings Two Years On',
    'AVERT Webinar — White Nationalist Extremism: Definitions, Dimensions, and Research Directions',
  ],
}

export default function WebinarsPage() {
  const years = Object.keys(webinars).sort((a, b) => b - a)

  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/events" className="text-white/60 hover:text-white text-sm mb-6 inline-block font-sans">← Events</Link>
          <h1 className="text-4xl font-bold mb-3 mt-4">Webinars</h1>
          <div className="w-12 h-0.5 bg-white/40 mb-4" />
          <p className="text-white/80 max-w-2xl leading-relaxed">
            AVERT regularly hosts online webinars featuring leading researchers on violent extremism, terrorism, radicalisation, and countering violent extremism.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="space-y-12">
          {years.map((year) => (
            <div key={year}>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-[#1a1a1a]">{year}</h2>
                <div className="flex-1 h-px bg-[#e2e2dc]" />
              </div>
              <div className="space-y-2">
                {webinars[year].map((title, i) => (
                  <div key={i} className="flex items-start gap-4 border border-[#e2e2dc] bg-white p-4">
                    <div className="w-1 flex-shrink-0 self-stretch bg-[#0c7c59] min-h-4" />
                    <p className="text-sm text-[#2d2d2d] leading-snug py-0.5">{title}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
