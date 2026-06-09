'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import people from '@/data/people.json'

const ROLE_ORDER = { 'Convenor': 0, 'Coordinator': 1, 'Technical Coordinator': 1, 'HDR Coordinator': 1, 'Executive Committee': 2, 'Research Member': 3, 'Affiliate Member': 4 }
const ROLE_COLOURS = {
  'Convenor': 'bg-[#0c7c59] text-white',
  'Coordinator': 'bg-[#0c7c59]/80 text-white',
  'Technical Coordinator': 'bg-[#0c7c59]/80 text-white',
  'HDR Coordinator': 'bg-[#0c7c59]/80 text-white',
  'Executive Committee': 'bg-[#e8f5f0] text-[#0c7c59] border border-[#0c7c59]/30',
  'Research Member': 'bg-[#f3f3f3] text-[#5a5a5a]',
  'Affiliate Member': 'bg-[#f3f3f3] text-[#717171]',
}

export default function PeoplePage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  const filtered = useMemo(() => {
    return people
      .filter((p) => {
        const q = search.toLowerCase()
        const matchesSearch =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.institution?.toLowerCase().includes(q) ||
          p.research_areas?.toLowerCase().includes(q)
        const matchesRole = !roleFilter || p.role === roleFilter
        return matchesSearch && matchesRole
      })
      .sort((a, b) => {
        const ra = ROLE_ORDER[a.role] ?? 99
        const rb = ROLE_ORDER[b.role] ?? 99
        if (ra !== rb) return ra - rb
        return a.name.split(' ').at(-1).localeCompare(b.name.split(' ').at(-1))
      })
  }, [search, roleFilter])

  const roles = ['Convenor', 'Coordinator', 'Technical Coordinator', 'HDR Coordinator', 'Executive Committee', 'Research Member', 'Affiliate Member']

  return (
    <>
      {/* Header */}
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Our Researchers</h1>
          <div className="w-12 h-0.5 bg-white/40 mb-4" />
          <p className="text-white/80 max-w-2xl leading-relaxed">
            AVERT members come from a wide variety of disciplines and institutions across Australia and internationally, committed to evidence-based research on violent extremism.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Search and filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name, institution, or research area…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-[#e2e2dc] px-4 py-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#0c7c59] bg-white font-sans"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-[#e2e2dc] px-4 py-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#0c7c59] bg-white font-sans"
          >
            <option value="">All roles</option>
            {roles.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <p className="text-sm text-[#999999] mb-8 font-sans">
          Showing {filtered.length} of {people.length} researchers
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((person) => (
            <Link
              key={person.slug}
              href={`/people/${person.slug}`}
              className="group border border-[#e2e2dc] hover:border-[#0c7c59] bg-white overflow-hidden transition-colors flex"
            >
              {/* Headshot — large, fills left side */}
              <div className="flex-shrink-0 w-28 relative overflow-hidden bg-[#e8f5f0]">
                {person.headshot ? (
                  <Image
                    src={`/headshots-thumb/${person.headshot}`}
                    alt={person.name}
                    fill
                    className="object-cover object-top"
                    sizes="112px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#e8f5f0]">
                    <span className="text-2xl font-bold text-[#0c7c59]">
                      {person.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Text — beside photo */}
              <div className="flex-1 min-w-0 p-4 flex flex-col">
                <h3 className="font-bold text-[#1a1a1a] group-hover:text-[#0c7c59] leading-snug transition-colors text-sm mb-1">
                  {person.name}
                </h3>
                {person.title && (
                  <p className="text-xs text-[#717171] mb-0.5 leading-snug line-clamp-2">{person.title}</p>
                )}
                {person.institution && (
                  <p className="text-xs text-[#999999] leading-snug">{person.institution}</p>
                )}
                <div className="mt-auto pt-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 font-sans ${ROLE_COLOURS[person.role] || ROLE_COLOURS['Research Member']}`}>
                    {person.role}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
