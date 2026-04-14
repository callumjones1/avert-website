import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-[#999999] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-2">
            <p className="text-white font-semibold text-sm uppercase tracking-widest mb-4 font-sans">
              AVERT Research Network
            </p>
            <p className="text-sm leading-relaxed max-w-sm">
              A multidisciplinary research network dedicated to understanding and reducing violent extremism and radicalisation in Australia and globally.
            </p>
            <p className="text-xs mt-4 text-[#555555]">
              Supported by Deakin University's Alfred Deakin Institute for Citizenship and Globalisation.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3 font-sans">Network</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About AVERT</Link></li>
              <li><Link href="/people" className="hover:text-white transition-colors">Researchers</Link></li>
              <li><Link href="/about/governance" className="hover:text-white transition-colors">Governance</Link></li>
              <li><Link href="/opportunities" className="hover:text-white transition-colors">Membership</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3 font-sans">Research</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/publications" className="hover:text-white transition-colors">Publications</Link></li>
              <li><Link href="/commentary" className="hover:text-white transition-colors">Commentary</Link></li>
              <li><Link href="/impact" className="hover:text-white transition-colors">Impact</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">Events & Webinars</Link></li>
            </ul>
          </div>
        </div>

        {/* Acknowledgement of Country */}
        <div className="border-t border-[#2d2d2d] mt-8 pt-6 mb-6">
          <p className="text-xs text-[#555555] leading-relaxed max-w-3xl">
            <span className="text-[#777777] font-semibold font-sans">Acknowledgement of Country.</span>{' '}
            AVERT Research Network acknowledges the Traditional Custodians of the lands on which our members live and work, and pays respect to their Elders past, present, and emerging. We recognise the continuing connection of Aboriginal and Torres Strait Islander peoples to Country, and their enduring contributions to this land.
          </p>
        </div>

        <div className="border-t border-[#2d2d2d] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs">© {new Date().getFullYear()} AVERT Research Network. All rights reserved.</p>
          <a
            href="https://www.linkedin.com/company/avert-research-network"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs hover:text-white transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}
