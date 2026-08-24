'use client'

import { useState } from 'react'

const WEB3FORMS_ACCESS_KEY = '7bcd27d7-8c74-494c-b485-3c4ccc78a760'

const APPLICANT_TYPES = [
  'A university-based researcher',
  'An organisationally-based researcher (e.g. at a think tank, NGO, community or government agency)?',
  'An independent (non-university or organisationally affiliated) researcher?',
  'A postgraduate/higher degree by research student (e.g. studying for a doctoral or Masters research degree)?',
]

const INTERESTS = [
  'To expand my collegial networks with other AVERT-focused researchers',
  'To expand my opportunities for research partnerships with community and/or government and or/academic individuals and groups',
  'To learn more about AVERT-focused research and engagement across different disciplines',
  'To locate research resources relevant to my AVERT-based interests',
  'To better profile my research outputs on AVERT-related topics',
  'To seek colleagues for joint publications, funding bids or project development',
  'To stay abreast of new and forthcoming publications, funding opportunities, jobs and events such as conferences, seminars and symposia in the focus area of AVERT',
  'To contribute to dialogue and debate on key issues in researching AVERT-based topics through participation in seminars, conferences, symposia and other events',
]

const inputClass = 'w-full border border-[#e2e2dc] px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#0c7c59] font-sans'
const labelClass = 'block text-sm font-semibold text-[#1a1a1a] mb-1 font-sans'

export default function ResearchMembershipForm() {
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [applicantType, setApplicantType] = useState('')
  const [interests, setInterests] = useState([])

  function toggleInterest(value) {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')

    const form = e.target
    const data = new FormData(form)
    data.append('access_key', WEB3FORMS_ACCESS_KEY)
    data.append('subject', 'AVERT Research Membership Application')
    data.append('applicant_type', applicantType)
    data.append('main_interests', interests.join('; '))

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      })
      const result = await res.json()
      if (result.success) {
        setStatus('success')
        form.reset()
        setApplicantType('')
        setInterests([])
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-[#f7f7f5] border border-[#e2e2dc] p-8">
        <h3 className="font-bold text-[#1a1a1a] mb-2">Application received</h3>
        <p className="text-sm text-[#2d2d2d] leading-relaxed">
          Thanks for applying for Research Membership. The AVERT team will review your application and be in touch.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-[#f7f7f5] border border-[#e2e2dc] p-8">
      <h3 className="font-bold text-[#1a1a1a] mb-3">Apply for Research Membership</h3>
      <p className="text-sm text-[#2d2d2d] leading-relaxed mb-6">
        If you are interested in joining AVERT as a research member and fulfil the above criteria,
        please complete the form below to apply.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelClass}>Title</label>
          <input type="text" name="title" className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Name <span className="text-[#0c7c59]">*</span></label>
            <input type="text" name="first_name" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Last Name <span className="text-[#0c7c59]">*</span></label>
            <input type="text" name="last_name" required className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Department and/or institution <span className="text-[#0c7c59]">*</span></label>
          <input type="text" name="institution" required className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Your current role at your institution <span className="text-[#0c7c59]">*</span></label>
          <input type="text" name="role" required className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Country where based <span className="text-[#0c7c59]">*</span></label>
          <input type="text" name="country" required className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Email <span className="text-[#0c7c59]">*</span></label>
          <input type="email" name="email" required className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Telephone number</label>
          <input type="tel" name="phone" className={inputClass} placeholder="e.g. +61 4xx xxx xxx" />
        </div>

        <div>
          <label className={labelClass}>Highest academic qualification <span className="text-[#0c7c59]">*</span></label>
          <input type="text" name="qualification" required className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Are you <span className="text-[#0c7c59]">*</span></label>
          <div className="space-y-2 mt-2">
            {APPLICANT_TYPES.map((option) => (
              <label key={option} className="flex items-start gap-2 text-sm text-[#2d2d2d] font-sans">
                <input
                  type="radio"
                  name="applicant_type"
                  value={option}
                  checked={applicantType === option}
                  onChange={() => setApplicantType(option)}
                  required
                  className="mt-1"
                />
                {option}
              </label>
            ))}
            <label className="flex items-start gap-2 text-sm text-[#2d2d2d] font-sans">
              <input
                type="radio"
                name="applicant_type"
                value="Other"
                checked={applicantType === 'Other'}
                onChange={() => setApplicantType('Other')}
                className="mt-1"
              />
              Other
            </label>
          </div>
          {applicantType === 'Other' && (
            <input type="text" name="applicant_type_other" placeholder="If 'other', please describe" className={`${inputClass} mt-2`} />
          )}
        </div>

        <div>
          <label className={labelClass}>
            What are up to 5 keywords most commonly associated with your AVERT-focused research expertise? <span className="text-[#0c7c59]">*</span>
          </label>
          <textarea name="keywords" required rows={2} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>
            Please list up to 5 competitive or commissioned research grants you have held over the last 5 years relevant to the focus of AVERT <span className="text-[#0c7c59]">*</span>
          </label>
          <textarea name="grants" required rows={3} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>
            Please tick one or more of the boxes below regarding your main interests in joining AVERT <span className="text-[#0c7c59]">*</span>
          </label>
          <p className="text-xs text-[#717171] mb-2 font-sans">Please tick all that apply</p>
          <div className="space-y-2">
            {INTERESTS.map((option) => (
              <label key={option} className="flex items-start gap-2 text-sm text-[#2d2d2d] font-sans">
                <input
                  type="checkbox"
                  checked={interests.includes(option)}
                  onChange={() => toggleInterest(option)}
                  className="mt-1"
                />
                {option}
              </label>
            ))}
            <label className="flex items-start gap-2 text-sm text-[#2d2d2d] font-sans">
              <input
                type="checkbox"
                checked={interests.includes('Other')}
                onChange={() => toggleInterest('Other')}
                className="mt-1"
              />
              Other
            </label>
          </div>
          {interests.includes('Other') && (
            <input type="text" name="interests_other" placeholder="Other, please describe" className={`${inputClass} mt-2`} />
          )}
        </div>

        <div>
          <label className={labelClass}>
            Please list up to 5 current or recent research collaborations you&rsquo;ve had with other academic, community or government partners in an area of AVERT focus <span className="text-[#0c7c59]">*</span>
          </label>
          <textarea name="collaborations" required rows={3} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>
            Please list up to five recent research publications in the areas of AVERT focus <span className="text-[#0c7c59]">*</span>
          </label>
          <textarea name="publications" required rows={3} className={inputClass} />
        </div>

        {status === 'error' && (
          <p className="text-sm text-red-700">Something went wrong sending your application. Please try again or email adi-avert@deakin.edu.au directly.</p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-block bg-[#0c7c59] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-[#0a6b4d] transition-colors font-sans disabled:opacity-60"
        >
          {status === 'submitting' ? 'Submitting…' : 'Submit Application'}
        </button>
      </form>
    </div>
  )
}
