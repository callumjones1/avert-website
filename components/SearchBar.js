'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar({ placeholder = 'Search news, commentary, people…', className = '' }) {
  const [q, setQ] = useState('')
  const router = useRouter()

  function handleSubmit(e) {
    e.preventDefault()
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-0 ${className}`}>
      <input
        type="search"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder={placeholder}
        className="flex-1 border border-white/30 bg-white/10 backdrop-blur-sm px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-white font-sans text-sm"
      />
      <button
        type="submit"
        className="bg-white text-[#0c7c59] hover:bg-white/90 px-5 py-3 font-semibold transition-colors font-sans flex-shrink-0"
        aria-label="Search"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </button>
    </form>
  )
}
