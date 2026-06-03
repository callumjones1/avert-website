import Link from 'next/link'

export const metadata = { title: 'FAQs — AVERT Research Network' }

const faqs = [
  {
    q: 'What kind of research do AVERT members conduct?',
    body: [
      'We research a wide array of topics related to terrorism, radicalisation, extremism and violent extremism, focusing on three core challenges:',
      [
        'How can we reduce the appeal and take-up of violent extremism before people engage?',
        'How can we divert those already on pathways to extremist violence, and support them to deradicalise?',
        'What are the best ways to disengage actors who have already committed to violent extremist action?',
      ],
      'We bring together community members, organisations, government agencies and academics to deliver qualitative analysis, participatory and collaborative research design, social policy research, methodology assessment and review, ethically managed research data, and multi-method approaches to complex research projects.',
      'Our researchers come from a range of disciplines including sociology, political science, international relations, cultural studies, information systems, digital and communication studies, international and regional area studies, religious studies, political psychology, education and criminology.',
    ],
  },
  {
    q: 'How can my organisation collaborate with AVERT?',
    body: [
      'AVERT members collaborate with a diverse range of community, government and civil society organisations. We want to connect our members from different sectors with each other, as a forum for collaboration on innovative, cross-sector projects.',
      'If you would like to collaborate with AVERT as an organisation, please email us at adi-avert@deakin.edu.au.',
      'For more information about our members\' research partners and to contact them directly about collaboration, please visit individual AVERT member profile pages.',
    ],
  },
  {
    q: 'How is AVERT funded?',
    body: [
      'The Network is administratively supported by the Alfred Deakin Institute for Citizenship and Globalisation (ADI) at Deakin University. Since 2020, the Network receives annual funding under a Memorandum of Understanding with the Australian Government Department of Home Affairs to support specified program activities, to provide advisory expertise and build research capacity.',
      'Occasional additional funding is sought and received for specific programmatic and research activities and is transparently acknowledged.',
    ],
  },
  {
    q: 'How can I access AVERT research publications?',
    body: [
      'AVERT members are committed to the accessible dissemination of research findings and outcomes. We publicise our research findings through reports, articles, book chapters, press and social media releases, academic resource-sharing sites such as ResearchGate and Academia.com, community-focused seminars and workshops, and web-based summaries.',
      'AVERT commissioned or facilitated research publications are available on our Publications page. You can access individual member research publications via the AVERT members\' profile pages.',
    ],
  },
  {
    q: 'How can I get involved with AVERT?',
    body: [
      'Sign up to our mailing list to receive research updates and invitations to our knowledge-sharing events and webinars.',
      'If you would like to become a member of the AVERT Network, you can find out more information about how to apply via our membership page, or email adi-avert@deakin.edu.au.',
    ],
  },
  {
    q: 'How can I contact an AVERT member or expert?',
    body: [
      'AVERT is happy to connect members of the public and media with our research members. If you are seeking research expertise on a particular topic, please email us at adi-avert@deakin.edu.au.',
      'Our members\' contact information is also available on their individual member profile pages.',
    ],
  },
]

export default function FaqsPage() {
  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/about" className="text-white/60 hover:text-white text-sm mb-6 inline-block font-sans transition-colors">← About</Link>
          <h1 className="text-4xl font-bold mb-3 mt-4">Frequently Asked Questions</h1>
          <div className="w-12 h-0.5 bg-white/40" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="max-w-3xl space-y-0 divide-y divide-[#e2e2dc]">
          {faqs.map((faq, i) => (
            <div key={i} className="py-10 first:pt-0">
              <h2 className="text-lg font-bold text-[#1a1a1a] mb-4 leading-snug">{faq.q}</h2>
              <div className="space-y-3 text-[#2d2d2d] leading-relaxed">
                {faq.body.map((item, j) =>
                  Array.isArray(item) ? (
                    <ul key={j} className="space-y-1.5 pl-1">
                      {item.map((li, k) => (
                        <li key={k} className="flex gap-3">
                          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0c7c59] mt-2.5" />
                          <span>{li}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p key={j}>{item}</p>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mt-6 bg-[#f7f7f5] border border-[#e2e2dc] p-8">
          <h3 className="font-bold text-[#1a1a1a] mb-3">Still have questions?</h3>
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
