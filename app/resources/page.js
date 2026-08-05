import Link from 'next/link'
import ResourcesList from '@/components/ResourcesList'

export const metadata = {
  title: 'Resources — AVERT Research Network',
  description: 'Reports, data and resources on radicalisation and violent extremism from partner organisations and government agencies.',
}

const resources = [
  {
    title: '2025 Digital Violent Extremism Transparency Report',
    source: 'New Zealand Department of Internal Affairs (Te Tari Taiwhenua)',
    year: '2026',
    type: 'Report',
    url: 'https://www.dia.govt.nz/Countering-Violent-Extremism-Transparency-reports',
  },
]

export default function ResourcesPage() {
  return (
    <>
      <div className="bg-[#0c7c59] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Resources</h1>
          <div className="w-12 h-0.5 bg-white/40 mb-4" />
          <p className="text-white/80 max-w-2xl leading-relaxed">
            Reports, data and resources on radicalisation and violent extremism from partner organisations, government agencies and the wider field.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <p className="text-[#2d2d2d] leading-relaxed mb-10 max-w-3xl">
          In addition to AVERT's own{' '}
          <Link href="/publications" className="text-[#0c7c59] hover:underline">publications</Link>,
          we share relevant reports and resources published by partner organisations and government
          agencies working to counter radicalisation and violent extremism.
        </p>

        <ResourcesList resources={resources} />
      </div>
    </>
  )
}
