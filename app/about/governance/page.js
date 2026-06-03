import Link from 'next/link'
import Image from 'next/image'
import peopleData from '@/data/people.json'

export const metadata = { title: 'Structure & Governance — AVERT Research Network' }

function PersonCard({ person, size = 'sm' }) {
  const imgSrc = person.headshot ? `/headshots/${person.headshot}` : null
  const large = size === 'lg'

  return (
    <Link
      href={`/people/${person.slug}`}
      className="group flex flex-col border border-[#e2e2dc] hover:border-[#0c7c59] bg-white overflow-hidden transition-colors"
    >
      <div className={`relative w-full overflow-hidden bg-[#f3f3f3] flex-shrink-0 ${large ? 'h-52' : 'h-36'}`}>
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={person.name}
            fill
            className="object-cover object-top"
            sizes={large ? '(max-width:768px) 100vw, 33vw' : '(max-width:768px) 50vw, 20vw'}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-[#c8c8c8]">
              {person.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </span>
          </div>
        )}
      </div>
      <div className={`${large ? 'p-5' : 'p-3'}`}>
        <p className={`font-bold text-[#0c7c59] group-hover:text-[#0a6b4d] leading-snug transition-colors ${large ? 'text-sm' : 'text-xs'}`}>
          {person.name}
        </p>
        {person.title && (
          <p className={`text-[#717171] mt-0.5 leading-snug ${large ? 'text-xs' : 'text-xs'}`}>
            {person.title}
          </p>
        )}
        {person.institution && (
          <p className={`text-[#999999] mt-0.5 ${large ? 'text-xs' : 'text-xs'}`}>
            {person.institution}
          </p>
        )}
      </div>
    </Link>
  )
}

export default function GovernancePage() {
  const convenors = peopleData.filter(p => p.role === 'Convenor')
  const coordinators = peopleData.filter(p => p.role === 'Coordinator')
  const execCommittee = peopleData.filter(p => p.role === 'Executive Committee')

  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/about" className="text-white/60 hover:text-white text-sm mb-6 inline-block font-sans transition-colors">← About</Link>
          <h1 className="text-4xl font-bold mb-3 mt-4">Structure & Governance</h1>
          <div className="w-12 h-0.5 bg-white/40" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14 space-y-16">

        {/* Overview */}
        <section className="max-w-3xl space-y-4 text-[#2d2d2d] leading-relaxed">
          <p>
            The AVERT Research Network was established in 2018 by Professor Michele Grossman and colleagues at Deakin University. Professor Grossman co-convened the Network with Lydia Khalil from 2022 to 2024. From 2024, Lydia Khalil served as sole Convenor and was joined by Co-Convenor Professor Julian Droogan in August 2024. In 2025, Professor Grossman became Co-Convenor alongside Professor Droogan. AVERT membership, including representation on its Executive and Steering Committees, is multi-institutional.
          </p>
          <p>
            The Network is administratively supported by the Alfred Deakin Institute for Citizenship and Globalisation (ADI) at Deakin University. Since 2020, the Network has received annual funding from the Australian Government Department of Home Affairs to support specified program activities, advisory expertise and research capacity building.
          </p>
          <p>
            AVERT's work is guided by an <strong>Executive Committee</strong> and a <strong>Steering Committee</strong>. The Steering Committee provides high-level strategic advice to the Convenors and Executive on the goals and operations of the Network. The Executive Committee manages the day-to-day design and implementation of AVERT activities and contributes to strategic planning and development.
          </p>
        </section>

        {/* Convenors */}
        {convenors.length > 0 && (
          <section>
            <div className="flex items-baseline gap-3 mb-8">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] font-sans">Convenors</h2>
              <div className="flex-1 h-px bg-[#e2e2dc]" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {convenors.map(p => <PersonCard key={p.slug} person={p} size="lg" />)}
            </div>
          </section>
        )}

        {/* Executive Committee */}
        {execCommittee.length > 0 && (
          <section>
            <div className="flex items-baseline gap-3 mb-8">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] font-sans">Executive Committee</h2>
              <div className="flex-1 h-px bg-[#e2e2dc]" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {execCommittee.map(p => <PersonCard key={p.slug} person={p} size="sm" />)}
            </div>
          </section>
        )}

        {/* Coordinators */}
        {coordinators.length > 0 && (
          <section>
            <div className="flex items-baseline gap-3 mb-8">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] font-sans">Coordinators</h2>
              <div className="flex-1 h-px bg-[#e2e2dc]" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {coordinators.map(p => <PersonCard key={p.slug} person={p} size="sm" />)}
            </div>
          </section>
        )}

      </div>
    </>
  )
}
