import staticData from '@/data/static.json'
import Link from 'next/link'

export const metadata = { title: 'FAQs — AVERT Research Network' }

function parseFaqs(text) {
  if (!text) return []
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  const faqs = []
  let current = null
  for (const line of lines) {
    // Skip the heading line "FAQs"
    if (line === 'FAQs') continue
    // Detect a question: ends with '?' or starts with a known Q pattern
    if (line.endsWith('?')) {
      if (current) faqs.push(current)
      current = { q: line, paragraphs: [] }
    } else if (current) {
      current.paragraphs.push(line)
    }
  }
  if (current) faqs.push(current)
  return faqs
}

export default function FaqsPage() {
  const data = staticData['faqs'] || {}
  const faqs = parseFaqs(data.text)

  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/about" className="text-white/60 hover:text-white text-sm mb-6 inline-block font-sans">← About</Link>
          <h1 className="text-4xl font-bold mb-3 mt-4">Frequently Asked Questions</h1>
          <div className="w-12 h-0.5 bg-white/40" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-14">
        {faqs.length > 0 ? (
          <div className="space-y-10">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-[#e2e2dc] pb-10 last:border-0">
                <h2 className="text-lg font-bold text-[#111827] mb-4 leading-snug">{faq.q}</h2>
                <div className="space-y-3">
                  {faq.paragraphs.map((p, j) => (
                    <p key={j} className="text-[#2d2d2d] leading-relaxed">{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#999999] italic">Content coming soon.</p>
        )}

        <div className="mt-14 bg-[#f7f7f5] border border-[#e2e2dc] p-8">
          <h3 className="font-bold text-[#111827] mb-3">Still have questions?</h3>
          <p className="text-[#2d2d2d] text-sm leading-relaxed mb-4">
            Get in touch with the AVERT team at{' '}
            <a href="mailto:adi-avert@deakin.edu.au" className="text-[#0c7c59] hover:underline">
              adi-avert@deakin.edu.au
            </a>
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/opportunities/research" className="bg-[#0c7c59] text-white px-5 py-2.5 text-sm font-semibold uppercase tracking-wide hover:bg-[#0a6b4d] transition-colors font-sans">
              Research Membership
            </Link>
            <Link href="/opportunities/affiliate" className="border border-[#0c7c59] text-[#0c7c59] px-5 py-2.5 text-sm font-semibold uppercase tracking-wide hover:bg-[#0c7c59] hover:text-white transition-colors font-sans">
              Affiliate Membership
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
