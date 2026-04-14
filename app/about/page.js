import staticData from '@/data/static.json'
import Link from 'next/link'

export const metadata = {
  title: 'About AVERT',
  description: 'About the AVERT Research Network.',
}

// Joins orphaned lines (from inline links split across lines) back into proper paragraphs
function buildParagraphs(text) {
  if (!text) return []
  const raw = text.split('\n').map((l) => l.trim()).filter(Boolean)
  // Skip the page title line
  const filtered = raw.filter((l) => l !== 'About the AVERT Research Network' && l !== 'About Avert')
  if (!filtered.length) return []
  const paragraphs = []
  let buf = [filtered[0]]
  for (let i = 1; i < filtered.length; i++) {
    const prev = buf[buf.length - 1]
    const curr = filtered[i]
    const prevEndsTerminal = /[.!?:"]$/.test(prev)
    const currStartsLower = /^[a-z(\d]/.test(curr)
    const prevIsShort = prev.length < 60
    const currIsShort = curr.length < 60
    if (currStartsLower || (!prevEndsTerminal && (prevIsShort || currIsShort))) {
      buf.push(curr)
    } else {
      paragraphs.push(buf.join(' '))
      buf = [curr]
    }
  }
  if (buf.length) paragraphs.push(buf.join(' '))
  // Filter out very short call-to-action fragments at the end
  return paragraphs.filter((p) => p.length > 20)
}

export default function AboutPage() {
  const about = staticData['about-avert'] || {}
  const paragraphs = buildParagraphs(about.text)

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

      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 prose-article text-[#2d2d2d]">
            {paragraphs.length > 0
              ? paragraphs.map((p, i) => (
                  <p key={i} className="mb-5 leading-relaxed">{p}</p>
                ))
              : (
                <>
                  <p className="mb-5 leading-relaxed">
                    The Addressing Violent Extremism and Radicalisation to Terrorism (AVERT) Research Network is a multidisciplinary multi-institutional research initiative based in Melbourne, Australia, supported by Deakin University's Alfred Deakin Institute for Citizenship and Globalisation (ADI).
                  </p>
                  <p className="mb-5 leading-relaxed">
                    Our Network is composed of highly engaged and critically informed social science, humanities and multidisciplinary research academics from a variety of universities and research institutions who believe in conducting meaningful evidence-based research for the public good.
                  </p>
                  <p className="mb-5 leading-relaxed">
                    AVERT aims to become one of the leading research networks in Australia focused on the study of violent extremism and radicalisation to terrorism, through generating excellent research and facilitating collaborations between academic researchers, government and policy makers, law enforcement agencies, and community organisations.
                  </p>
                </>
              )
            }
          </div>

          <div className="space-y-4">
            <div className="bg-[#f7f7f5] border border-[#e2e2dc] p-6">
              <h3 className="font-bold text-[#1a1a1a] text-xs uppercase tracking-wide mb-4 font-sans">About the Network</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about/governance" className="text-[#0c7c59] hover:underline">Structure & Governance →</Link></li>
                <li><Link href="/about/faqs" className="text-[#0c7c59] hover:underline">FAQs →</Link></li>
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
          </div>
        </div>
      </div>
    </>
  )
}
