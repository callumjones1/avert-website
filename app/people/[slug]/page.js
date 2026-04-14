import Link from 'next/link'
import Image from 'next/image'
import people from '@/data/people.json'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return people.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const person = people.find((p) => p.slug === slug)
  if (!person) return {}
  return {
    title: person.name,
    description: person.bio?.substring(0, 160),
  }
}

function buildBio(text) {
  if (!text) return []
  return text.split('\n').map((l) => l.trim()).filter((l) => l.length > 20)
}

const ROLE_COLOURS = {
  'Convenor': 'bg-[#0c7c59] text-white',
  'Coordinator': 'bg-[#0c7c59]/80 text-white',
  'Executive Committee': 'bg-[#e8f5f0] text-[#0c7c59] border border-[#0c7c59]/30',
  'Research Member': 'bg-[#f3f3f3] text-[#5a5a5a]',
  'Affiliate Member': 'bg-[#f3f3f3] text-[#717171]',
}

export default async function PersonPage({ params }) {
  const { slug } = await params
  const person = people.find((p) => p.slug === slug)
  if (!person) notFound()

  const initials = person.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
  const bioParagraphs = buildBio(person.bio)

  return (
    <>
      {/* Header */}
      <div className="bg-[#0c7c59] text-white py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/people" className="text-white/60 hover:text-white text-sm mb-6 inline-block transition-colors font-sans">
            ← All Researchers
          </Link>
          <div className="flex items-start gap-6 mt-4">
            {/* Headshot or initials */}
            {person.headshot ? (
              <div className="w-20 h-20 rounded-full overflow-hidden bg-white/20 flex-shrink-0 border-2 border-white/40">
                <Image
                  src={`/headshots/${person.headshot}`}
                  alt={person.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0 border-2 border-white/40">
                {initials}
              </div>
            )}
            <div>
              {person.role && (
                <span className={`text-xs font-semibold px-2 py-0.5 mb-3 inline-block font-sans ${ROLE_COLOURS[person.role] || ROLE_COLOURS['Research Member']}`}>
                  {person.role}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">{person.name}</h1>
              {person.title && (
                <p className="text-white/80 mt-1 text-sm">{person.title}</p>
              )}
              {person.institution && (
                <p className="text-white/70 mt-1 text-sm font-sans">{person.institution}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {person.email && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-[#999999] mb-2 font-sans">Contact</h4>
                <a
                  href={`mailto:${person.email}`}
                  className="text-sm text-[#0c7c59] hover:underline break-all"
                >
                  {person.email}
                </a>
              </div>
            )}
            {person.institution && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-[#999999] mb-2 font-sans">Institution</h4>
                <p className="text-sm text-[#2d2d2d]">{person.institution}</p>
              </div>
            )}
            {person.research_areas && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-[#999999] mb-3 font-sans">Research Areas</h4>
                <div className="flex flex-wrap gap-1.5">
                  {person.research_areas.split(/[;,]/).map((k) => k.trim()).filter(Boolean).map((k) => (
                    <span
                      key={k}
                      className="text-xs bg-[#f7f7f5] text-[#5a5a5a] px-2 py-1 border border-[#e2e2dc] leading-snug"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            {bioParagraphs.length > 0 ? (
              <div className="prose-article text-[#2d2d2d]">
                {bioParagraphs.map((para, i) => (
                  <p key={i} className="mb-4 leading-relaxed">{para}</p>
                ))}
              </div>
            ) : (
              <p className="text-[#999999] italic">No biography available.</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
