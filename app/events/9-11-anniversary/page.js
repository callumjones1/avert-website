import Image from 'next/image'
import data from '@/data/anniversary-2026.json'

export const metadata = {
  title: data.title,
  description: 'A week-long series of panel discussions marking the 25th anniversary of the September 11 terrorist attacks, presented by the AVERT Research Network.',
}

function LogoStrip({ logos }) {
  const track = [...logos, ...logos]
  return (
    <div className="bg-white border border-[#e2e2dc] py-10 overflow-hidden logo-marquee-mask">
      <div className="flex items-center gap-20 w-max logo-marquee-track">
        {track.map((l, i) => (
          <div key={i} className="relative h-20 md:h-24 w-48 md:w-56 flex-shrink-0">
            <Image
              src={`/logos/anniversary-2026/${l.logo}`}
              alt={l.name}
              fill
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function PersonCard({ person, roleLabel }) {
  if (person.pending) {
    return (
      <div className="border border-dashed border-[#e2e2dc] bg-[#f7f7f5] p-6 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-[#e2e2dc] mb-4" />
        <p className="font-bold text-[#1a1a1a] leading-snug">{person.name}</p>
        {person.title && <p className="text-xs text-[#717171] font-sans mt-1 mb-3">{person.title}</p>}
        <span className="inline-block bg-[#0c7c59]/10 text-[#0c7c59] text-[11px] font-semibold uppercase tracking-widest px-2.5 py-1 font-sans">TBD</span>
      </div>
    )
  }

  const NameTag = person.linkedin ? 'a' : 'p'
  const nameProps = person.linkedin
    ? { href: person.linkedin, target: '_blank', rel: 'noopener noreferrer', className: 'font-bold text-[#1a1a1a] hover:text-[#0c7c59] leading-snug transition-colors' }
    : { className: 'font-bold text-[#1a1a1a] leading-snug' }

  return (
    <div className="border border-[#e2e2dc] bg-white p-6">
      {person.image && (
        <div className="relative w-20 h-20 overflow-hidden rounded-full bg-[#f3f3f3] mb-4">
          <Image
            src={`/headshots/anniversary-2026/${person.image}`}
            alt={person.name}
            fill
            className="object-cover"
            style={{ objectPosition: person.image_position || 'top' }}
          />
        </div>
      )}
      {person.logo && (
        <div className="relative h-12 w-40 mb-4">
          <Image
            src={`/logos/anniversary-2026/${person.logo}`}
            alt={person.name}
            fill
            className="object-contain object-left"
          />
        </div>
      )}
      {roleLabel && (
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0c7c59] font-sans mb-1.5">{roleLabel}</p>
      )}
      <NameTag {...nameProps}>{person.name}</NameTag>
      {person.title && <p className="text-xs text-[#717171] font-sans mt-0.5 mb-3">{person.title}</p>}
      {person.bio && <p className="text-sm text-[#5a5a5a] leading-relaxed">{person.bio}</p>}
    </div>
  )
}

function SessionSection({ session }) {
  return (
    <section className="border border-[#e2e2dc] bg-white">
      <div className="bg-[#f7f7f5] border-b border-[#e2e2dc] px-6 md:px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] font-sans mb-1">{session.day} · {session.date}</p>
          <p className="text-sm text-[#5a5a5a] font-sans">
            {session.time_aedt}
            {session.time_other && <span className="text-[#9a9a9a]"> ({session.time_other})</span>}
            {' · '}{session.location}
          </p>
        </div>
        {session.co_host_logo && (
          <div className="relative h-16 w-52 md:h-20 md:w-64 flex-shrink-0 md:ml-auto">
            <Image
              src={`/logos/anniversary-2026/${session.co_host_logo}`}
              alt={session.co_host}
              fill
              className="object-contain object-left md:object-right"
            />
          </div>
        )}
      </div>

      <div className="px-6 md:px-8 py-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a1a] leading-tight mb-3">{session.title}</h2>
          <div className="space-y-3 max-w-3xl">
            {session.abstract.split('\n\n').map((para, i) => (
              <p key={i} className="text-[#2d2d2d] leading-relaxed">{para}</p>
            ))}
          </div>
        </div>

        {/* Co-host */}
        <div className="max-w-3xl border-l-2 border-[#0c7c59]/30 pl-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] font-sans mb-1.5">
            {session.co_host_label || 'Co-hosted with'}{' '}
            {session.co_host_linkedin ? (
              <a href={session.co_host_linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline normal-case font-bold text-[#1a1a1a]">
                {session.co_host}
              </a>
            ) : (
              <span className="normal-case font-bold text-[#1a1a1a]">{session.co_host}</span>
            )}
          </p>
          <p className="text-sm text-[#5a5a5a] leading-relaxed">{session.co_host_bio}</p>
        </div>

        {/* Combined moderator + panellists lineup (used when the moderator also sits on the panel, or the panel isn't finalised yet) */}
        {session.combined_lineup ? (
          <div>
            <div className="flex items-baseline gap-3 mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] font-sans">Speakers</h3>
              <div className="flex-1 h-px bg-[#e2e2dc]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {session.moderator && (
                <PersonCard
                  person={session.moderator}
                  roleLabel={session.moderator.also_panellist ? 'Moderator & Panellist' : 'Moderator'}
                />
              )}
              {session.panellists.map((p, i) => (
                <PersonCard key={i} person={p} roleLabel="Panellist" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Moderator */}
            {session.moderator && (
              <div>
                <div className="flex items-baseline gap-3 mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] font-sans">Moderator</h3>
                  <div className="flex-1 h-px bg-[#e2e2dc]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">
                  <PersonCard person={session.moderator} />
                </div>
              </div>
            )}

            {/* Panellists */}
            {session.panellists.length > 0 && (
              <div>
                <div className="flex items-baseline gap-3 mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] font-sans">Panellists</h3>
                  <div className="flex-1 h-px bg-[#e2e2dc]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {session.panellists.map((p, i) => (
                    <PersonCard key={i} person={p} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Pending note */}
        {session.pending_note && (
          <p className="text-sm text-[#0c7c59] font-sans font-semibold bg-[#0c7c59]/5 border border-[#0c7c59]/20 px-4 py-3 max-w-3xl">
            {session.pending_note}
          </p>
        )}

        {/* Register */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {session.register_url ? (
            <a
              href={session.register_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#0c7c59] text-white hover:bg-[#0a6b4d] px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors font-sans"
            >
              Register for this session →
            </a>
          ) : (
            <p className="text-sm text-[#9a9a9a] font-sans italic">Registration link coming soon.</p>
          )}
          {session.in_person_note && (
            <p className="text-sm text-[#5a5a5a] font-sans italic">{session.in_person_note}</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default function AnniversaryEventPage() {
  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-white/60 text-sm mb-2 font-sans">{data.dates}</p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2">{data.title}</h1>
          <p className="text-white/80 text-lg italic mt-2">A week-long series marking 25 years since the September 11 terrorist attacks</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10">
        <div className="relative w-full h-64 md:h-80 overflow-hidden">
          <Image src="/images/anniversary-2026/hero.jpg" alt="Tribute in Light, New York City" fill className="object-cover" />
        </div>
        <p className="text-[#9a9a9a] text-[11px] font-sans text-right mt-1.5">Photo: Julien Maculan / Unsplash</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">

        {/* Overview */}
        <section className="max-w-3xl space-y-8">
          <div className="space-y-4">
            {data.overview.split('\n\n').map((para, i) => (
              <p key={i} className="text-[#2d2d2d] leading-relaxed">{para}</p>
            ))}
          </div>
        </section>

        {/* Logo ribbon, directly below the "please see below" registration note */}
        <LogoStrip logos={data.co_host_logos} />

        <section className="max-w-3xl">
          <div>
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] font-sans">Objectives</h2>
              <div className="flex-1 h-px bg-[#e2e2dc]" />
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-[#2d2d2d] leading-relaxed">
              {data.objectives.map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </div>
        </section>

        {/* Sessions */}
        <section>
          <div className="flex items-baseline gap-3 mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] font-sans">Programme</h2>
            <div className="flex-1 h-px bg-[#e2e2dc]" />
          </div>
          <div className="space-y-10">
            {data.sessions.map((session, i) => (
              <SessionSection key={i} session={session} />
            ))}
          </div>
        </section>

      </div>
    </>
  )
}
