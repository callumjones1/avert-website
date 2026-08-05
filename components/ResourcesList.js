'use client'
import { useState } from 'react'
import { assetUrl } from '@/lib/base-path'

const typeColour = {
  'Report': 'bg-[#e8f5f0] text-[#0c7c59] border border-[#0c7c59]/20',
  'Dataset': 'bg-[#0c7c59] text-white',
  'Guideline': 'bg-[#f3f3f3] text-[#5a5a5a]',
}

export default function ResourcesList({ resources }) {
  const [activeTab, setActiveTab] = useState('All')
  const tabs = ['All', ...Array.from(new Set(resources.map(r => r.type)))]

  const filtered = activeTab === 'All' ? resources : resources.filter(r => r.type === activeTab)

  const byYear = {}
  for (const r of filtered) {
    if (!byYear[r.year]) byYear[r.year] = []
    byYear[r.year].push(r)
  }
  const years = Object.keys(byYear).sort((a, b) => b - a)

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs font-semibold uppercase tracking-wide px-4 py-2 font-sans transition-colors ${
              activeTab === tab
                ? 'bg-[#0c7c59] text-white'
                : 'bg-[#f3f3f3] text-[#5a5a5a] hover:bg-[#e8f5f0] hover:text-[#0c7c59]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {years.length > 0 ? (
        <div className="space-y-12">
          {years.map((year) => (
            <div key={year}>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-[#1a1a1a]">{year}</h2>
                <div className="flex-1 h-px bg-[#e2e2dc]" />
              </div>
              <div className="space-y-4">
                {byYear[year].map((r, i) => (
                  <a
                    key={i}
                    href={assetUrl(r.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-5 border border-[#e2e2dc] hover:border-[#0c7c59] bg-white p-6 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 font-sans ${typeColour[r.type] || typeColour['Report']}`}>
                          {r.type}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#1a1a1a] group-hover:text-[#0c7c59] leading-snug transition-colors mb-1">
                        {r.title}
                      </h3>
                      <p className="text-sm text-[#717171]">{r.source}</p>
                    </div>
                    <span className="text-xs font-semibold text-[#0c7c59] uppercase tracking-wide font-sans flex-shrink-0 mt-1">
                      Read →
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[#717171] text-sm">No resources in this category yet.</p>
      )}
    </>
  )
}
