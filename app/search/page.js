'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import newsData from '@/data/news.json'
import commentaryData from '@/data/commentary.json'
import peopleData from '@/data/people.json'

function normalize(str) {
  return (str ?? '').toLowerCase()
}

function matchesQuery(fields, q) {
  return fields.some(f => normalize(f).includes(q))
}

function SearchPageInner() {
  const params = useSearchParams()
  const router = useRouter()
  const raw = params.get('q') ?? ''
  const [q, setQ] = useState(raw)

  function handleSubmit(e) {
    e.preventDefault()
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  const term = raw.trim().toLowerCase()

  const newsResults = term
    ? newsData
        .filter(item => !item.slug.includes('submission'))
        .filter(item => matchesQuery([item.title, item.body, item.body_html], term))
        .slice(0, 10)
    : []

  const commentaryResults = term
    ? commentaryData
        .filter(item => !item.slug.startsWith('category') && !item.slug.startsWith('tag'))
        .filter(item => matchesQuery([item.title, item.author, item.body], term))
        .slice(0, 10)
    : []

  const peopleResults = term
    ? peopleData
        .filter(item => matchesQuery([item.name, item.title, item.institution, item.research_areas, item.bio], term))
        .slice(0, 10)
    : []

  const total = newsResults.length + commentaryResults.length + peopleResults.length

  return (
    <>
      <form onSubmit={handleSubmit} className="flex mb-10">
        <input
          type="search"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search news, commentary, people…"
          className="flex-1 border border-[#e2e2dc] px-4 py-3 text-[#1a1a1a] placeholder-[#999999] focus:outline-none focus:border-[#0c7c59] font-sans text-sm"
        />
        <button
          type="submit"
          className="bg-[#0c7c59] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-[#0a6b4d] transition-colors font-sans"
        >
          Search
        </button>
      </form>

      {!term && (
        <p className="text-[#717171] text-sm">Enter a search term to find news, commentary, and people.</p>
      )}

      {term && (
        <div>
          <p className="text-sm text-[#717171] mb-8 font-sans">
            {total === 0
              ? `No results for "${raw}"`
              : `${total} result${total !== 1 ? 's' : ''} for "${raw}"`}
          </p>

          {newsResults.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] mb-4 font-sans">News</h2>
              <div className="divide-y divide-[#e2e2dc]">
                {newsResults.map(item => (
                  <Link key={item.slug} href={`/news/${item.slug}`} className="block py-4 group">
                    {item.date && (
                      <p className="text-xs text-[#999999] uppercase tracking-wide mb-1 font-sans">{item.date}</p>
                    )}
                    <h3 className="font-semibold text-[#1a1a1a] group-hover:text-[#0c7c59] transition-colors leading-snug">
                      {item.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {commentaryResults.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] mb-4 font-sans">Commentary</h2>
              <div className="divide-y divide-[#e2e2dc]">
                {commentaryResults.map(item => (
                  <Link key={item.slug} href={`/commentary/${item.slug}`} className="block py-4 group">
                    <div className="flex items-center gap-2 mb-1">
                      {item.author && (
                        <span className="text-xs font-semibold text-[#0c7c59] uppercase tracking-wide font-sans">{item.author}</span>
                      )}
                      {item.date && (
                        <span className="text-xs text-[#999999] font-sans">{item.date}</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-[#1a1a1a] group-hover:text-[#0c7c59] transition-colors leading-snug">
                      {item.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {peopleResults.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#0c7c59] mb-4 font-sans">People</h2>
              <div className="divide-y divide-[#e2e2dc]">
                {peopleResults.map(item => (
                  <Link key={item.slug} href={`/people/${item.slug}`} className="block py-4 group">
                    <h3 className="font-semibold text-[#1a1a1a] group-hover:text-[#0c7c59] transition-colors">
                      {item.name}
                    </h3>
                    {item.institution && (
                      <p className="text-sm text-[#717171] mt-0.5">{item.institution}</p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {total === 0 && (
            <p className="text-sm text-[#717171] mt-4">Try searching for a researcher name, topic, or keyword.</p>
          )}
        </div>
      )}
    </>
  )
}

export default function SearchPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Search</h1>
      <div className="w-12 h-0.5 bg-[#0c7c59] mb-8" />
      <Suspense fallback={<p className="text-[#717171] text-sm">Loading…</p>}>
        <SearchPageInner />
      </Suspense>
    </main>
  )
}
