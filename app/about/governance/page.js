import staticData from '@/data/static.json'
import Link from 'next/link'

export const metadata = { title: 'Structure & Governance' }

export default function GovernancePage() {
  const data = staticData['structure-and-governance'] || {}
  const paragraphs = data.text?.split('\n').filter((l) => l.trim()) || []

  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/about" className="text-white/60 hover:text-white text-sm mb-6 inline-block font-sans">← About</Link>
          <h1 className="text-4xl font-bold mb-3 mt-4">Structure & Governance</h1>
          <div className="w-12 h-0.5 bg-white/40" />
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="prose-article">
          {paragraphs.length > 0
            ? paragraphs.map((p, i) => <p key={i} className="mb-5 leading-relaxed text-[#2d2d2d]">{p}</p>)
            : <p className="text-gray-400 italic">Content coming soon.</p>
          }
        </div>
      </div>
    </>
  )
}
