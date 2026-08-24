'use client'

import { useState, useRef } from 'react'

// Web3Forms "AVERT_Affiliate_Members" form — destination email is set in the
// Web3Forms dashboard for this form (Settings tab), not here.
const WEB3FORMS_ACCESS_KEY = 'b05751e6-3f51-4d9f-ad87-55b01935f0b2'

// Same Mailchimp audience as the newsletter signup (components/SubscribeForm.js),
// posted to directly so applicants are auto-subscribed. FNAME/LNAME/EMAIL are
// Mailchimp's built-in fields and always save; the rest (ORG, ROLE, COUNTRY, PHONE,
// KEYWORDS, PROGRAMS, REASONS, COLLAB) only save if merge fields with those exact
// tags exist in the audience (Audience > Settings > Audience fields) — otherwise
// Mailchimp silently drops them.
const MAILCHIMP_ACTION_URL =
  'https://avert.us16.list-manage.com/subscribe/post?u=a9901935e5a771f85b149cd5d&id=461c2a97ef&f_id=000f06e0f0'
const MAILCHIMP_HONEYPOT_NAME = 'b_a9901935e5a771f85b149cd5d_461c2a97ef'

const REASONS = [
  'To connect with potential research partners for project development and/or funding bids on AVERT-related topics',
  'To source research expertise relevant to our organisational focus on policy and/or practice related to AVERT issues',
  'To bring community and/or practitioner and/or government knowledge, voices and issues into focus when designing and disseminating AVERT-focused research',
  'To learn more about AVERT-focused research methods, issues and approaches',
  'To keep in touch with new and emerging issues in the field of AVERT research',
  'To contribute to dialogue and debate on key issues related to AVERT topics through participation in seminars, conferences, symposia and other events',
]

const inputClass = 'w-full border border-[#e2e2dc] px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#0c7c59] font-sans'
const labelClass = 'block text-sm font-semibold text-[#1a1a1a] mb-1 font-sans'

export default function AffiliateMembershipForm() {
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [reasons, setReasons] = useState([])
  const mailchimpFormRef = useRef(null)

  function toggleReason(value) {
    setReasons((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')

    const form = e.target
    const data = new FormData(form)
    data.append('access_key', WEB3FORMS_ACCESS_KEY)
    data.append('subject', 'AVERT Affiliate Membership Application')
    data.append('reasons_for_joining', reasons.join('; '))

    // Add them to the Mailchimp audience in parallel with the Web3Forms email, via a
    // real hidden-iframe form POST (same mechanism as the working newsletter signup)
    // rather than fetch — Mailchimp's endpoint doesn't behave reliably with fetch/no-cors.
    const mc = mailchimpFormRef.current
    if (mc) {
      mc.elements.FNAME.value = data.get('first_name') || ''
      mc.elements.LNAME.value = data.get('last_name') || ''
      mc.elements.EMAIL.value = data.get('email') || ''
      mc.elements.TITLE.value = data.get('title') || ''
      mc.elements.ORG.value = data.get('organisation') || ''
      mc.elements.ROLE.value = data.get('role') || ''
      mc.elements.COUNTRY.value = data.get('country') || ''
      mc.elements.PHONE.value = data.get('phone') || ''
      mc.elements.KEYWORDS.value = data.get('keywords') || ''
      mc.elements.PROGRAMS.value = data.get('programs') || ''
      mc.elements.REASONS.value = reasons.join('; ')
      mc.elements.COLLAB.value = data.get('collaborations') || ''
      mc.submit()
    }

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
        setReasons([])
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
          Thanks for applying for Affiliate Membership. The AVERT team will be in touch.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-[#f7f7f5] border border-[#e2e2dc] p-8">
      <h3 className="font-bold text-[#1a1a1a] mb-3">Become an Affiliate Member</h3>
      <p className="text-sm text-[#2d2d2d] leading-relaxed mb-6">
        If you are interested in joining AVERT as an affiliate member, please complete the form below to apply.
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
          <label className={labelClass}>Email <span className="text-[#0c7c59]">*</span></label>
          <input type="email" name="email" required className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Organisation <span className="text-[#0c7c59]">*</span></label>
          <input type="text" name="organisation" required className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Your current role at Organisation <span className="text-[#0c7c59]">*</span></label>
          <input type="text" name="role" required className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Country where based <span className="text-[#0c7c59]">*</span></label>
          <input type="text" name="country" required className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Telephone number</label>
          <input type="tel" name="phone" className={inputClass} placeholder="e.g. +61 4xx xxx xxx" />
        </div>

        <div>
          <label className={labelClass}>What are up to 5 keywords for you/your organisation&rsquo;s primary AVERT-related interests?</label>
          <textarea name="keywords" rows={2} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Please identify up to 5 current or recent AVERT-focused programs or work you/your organisation has been involved in</label>
          <p className="text-xs text-[#717171] mb-2 font-sans">Please include approximate year/s of operation for each entry</p>
          <textarea name="programs" rows={3} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>
            What are your/your organisation&rsquo;s main reasons for wanting to join the AVERT Research Network? <span className="text-[#0c7c59]">*</span>
          </label>
          <p className="text-xs text-[#717171] mb-2 font-sans">Please tick all that apply</p>
          <div className="space-y-2">
            {REASONS.map((option) => (
              <label key={option} className="flex items-start gap-2 text-sm text-[#2d2d2d] font-sans">
                <input
                  type="checkbox"
                  checked={reasons.includes(option)}
                  onChange={() => toggleReason(option)}
                  className="mt-1"
                />
                {option}
              </label>
            ))}
            <label className="flex items-start gap-2 text-sm text-[#2d2d2d] font-sans">
              <input
                type="checkbox"
                checked={reasons.includes('Other')}
                onChange={() => toggleReason('Other')}
                className="mt-1"
              />
              Other
            </label>
          </div>
          {reasons.includes('Other') && (
            <input type="text" name="reasons_other" placeholder="Other, please describe" className={`${inputClass} mt-2`} />
          )}
        </div>

        <div>
          <label className={labelClass}>
            Please list up to 5 current or recent research, program or policy collaborations with academic, community or government partners in an area of AVERT focus
          </label>
          <textarea name="collaborations" rows={3} className={inputClass} />
        </div>

        {status === 'error' && (
          <p className="text-sm text-red-700">Something went wrong sending your application. Please try again or email adi-avert@deakin.edu.au directly.</p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-block bg-[#0c7c59] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-[#0a6b4d] transition-colors font-sans disabled:opacity-60"
        >
          {status === 'submitting' ? 'Submitting…' : 'Submit'}
        </button>
      </form>

      {/* Hidden form that mirrors the visible one, POSTed to Mailchimp on submit so
          applicants are auto-subscribed. target="_blank" is the same proven mechanism
          the newsletter signup (components/SubscribeForm.js) already uses — it opens
          Mailchimp's own confirmation page in a new tab. */}
      <form
        ref={mailchimpFormRef}
        action={MAILCHIMP_ACTION_URL}
        method="post"
        target="_blank"
        style={{ display: 'none' }}
      >
        <input type="text" name="FNAME" defaultValue="" readOnly />
        <input type="text" name="LNAME" defaultValue="" readOnly />
        <input type="email" name="EMAIL" defaultValue="" readOnly />
        <input type="text" name="TITLE" defaultValue="" readOnly />
        <input type="text" name="ORG" defaultValue="" readOnly />
        <input type="text" name="ROLE" defaultValue="" readOnly />
        <input type="text" name="COUNTRY" defaultValue="" readOnly />
        <input type="text" name="PHONE" defaultValue="" readOnly />
        <input type="text" name="KEYWORDS" defaultValue="" readOnly />
        <input type="text" name="PROGRAMS" defaultValue="" readOnly />
        <input type="text" name="REASONS" defaultValue="" readOnly />
        <input type="text" name="COLLAB" defaultValue="" readOnly />
        <input type="text" name={MAILCHIMP_HONEYPOT_NAME} defaultValue="" readOnly />
      </form>
    </div>
  )
}
