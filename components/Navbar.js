'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

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
      { label: 'Impact', href: '/impact' },
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
  {
    label: 'Join',
    href: '/opportunities',
    children: [
      { label: 'Research Membership', href: '/opportunities/research' },
      { label: 'Affiliate Membership', href: '/opportunities/affiliate' },
    ],
  },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)

  return (
    <nav className="bg-[#0c7c59] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/avert-logo-inverse.png"
            alt="AVERT Research Network"
            width={140}
            height={40}
            className="h-9 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
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
                className="nav-link px-4 py-2 text-sm text-white/90 hover:text-white transition-colors inline-block font-sans"
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

        {/* Mobile toggle */}
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
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0a6b4d] border-t border-[#085c41]">
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
