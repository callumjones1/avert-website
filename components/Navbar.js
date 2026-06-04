'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const navItems = [
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'About AVERT', href: '/about' },
      { label: 'Structure & Governance', href: '/about/governance' },
      { label: 'FAQs', href: '/about/faqs' },
    ],
  },
  { label: 'People', href: '/people' },
  {
    label: 'Research',
    href: '/publications',
    children: [
      { label: 'Publications', href: '/publications' },
      { label: 'Commentary', href: '/commentary' },
      { label: 'News', href: '/news' },
      { label: 'Newsletters', href: '/newsletters' },
    ],
  },
  {
    label: 'Events',
    href: '/events',
    children: [
      { label: 'Upcoming Events', href: '/events' },
      { label: 'Webinars', href: '/events/webinars' },
      { label: 'Symposiums', href: '/events/symposiums' },
    ],
  },
  { label: 'Opportunities', href: '/opportunities' },
  {
    label: 'Join',
    href: '/join',
    children: [
      { label: 'Research Membership', href: '/opportunities/research' },
      { label: 'Affiliate Membership', href: '/opportunities/affiliate' },
    ],
  },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const searchInputRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  function handleSearchSubmit(e) {
    e.preventDefault()
    const q = searchQ.trim()
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`)
      setSearchOpen(false)
      setSearchQ('')
    }
  }

  return (
    <nav className="bg-[#0c7c59] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Left: logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/avert-logo-inverse.png"
            alt="AVERT Research Network"
            width={140}
            height={40}
            className="h-9 w-auto"
            priority
          />
        </Link>

        {/* Right: nav + search */}
        <div className="flex items-center gap-2">
          {/* Desktop nav — right-aligned */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={item.href}
                className="nav-link px-4 py-2 text-base text-white/90 hover:text-white transition-colors inline-block font-sans"
              >
                {item.label}
                {item.children && (
                  <span className="ml-1 text-xs text-white/60">▾</span>
                )}
              </Link>
              {item.children && openDropdown === item.label && (
                <div className="absolute top-full left-0 bg-white min-w-52 py-1 shadow-xl border border-[#eeeeee]">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-2.5 text-sm text-[#3d3d3d] hover:text-[#0c7c59] hover:bg-[#f9f9f9] transition-colors font-sans"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          </div>

          <button
            onClick={() => setSearchOpen(v => !v)}
            className="hidden md:block p-2 text-white/80 hover:text-white"
            aria-label="Search"
          >
            {searchOpen
              ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>
            }
          </button>

          <button
            className="md:hidden text-white/80 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>{/* end right group */}
      </div>

      {/* Desktop search dropdown — spans full width below the bar */}
      {searchOpen && (
        <div className="hidden md:block bg-[#0a6b4d] border-t border-[#085c41]">
          <form onSubmit={handleSearchSubmit} className="max-w-7xl mx-auto px-6 py-4 flex gap-0">
            <input
              ref={searchInputRef}
              type="search"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
              placeholder="Search news, commentary, people…"
              className="flex-1 border border-white/30 bg-white/10 px-4 py-2.5 text-white placeholder-white/60 focus:outline-none focus:border-white text-sm font-sans"
            />
            <button type="submit" className="bg-white text-[#0c7c59] hover:bg-white/90 px-5 py-2.5 text-sm font-semibold font-sans flex-shrink-0 transition-colors">
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0a6b4d] border-t border-[#085c41]">
          <form onSubmit={e => { e.preventDefault(); const q = searchQ.trim(); if (q) { router.push(`/search?q=${encodeURIComponent(q)}`); setMobileOpen(false); setSearchQ('') } }} className="flex px-6 py-3 gap-0">
            <input
              type="search"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Search…"
              className="flex-1 border border-white/30 bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-white text-sm font-sans"
            />
            <button type="submit" className="bg-white/20 hover:bg-white/30 px-3 py-2 text-white" aria-label="Search">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
          </form>
          {navItems.map((item) => (
            <div key={item.label}>
              <Link
                href={item.href}
                className="block px-6 py-3 text-sm text-white/90 hover:text-white hover:bg-[#085c41] font-medium font-sans"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
              {item.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block px-10 py-2 text-sm text-white/70 hover:text-white hover:bg-[#085c41] font-sans"
                  onClick={() => setMobileOpen(false)}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </nav>
  )
}
