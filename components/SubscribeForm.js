'use client'

const MAILCHIMP_ACTION_URL =
  'https://avert.us16.list-manage.com/subscribe/post?u=a9901935e5a771f85b149cd5d&id=461c2a97ef&f_id=000f06e0f0'
const MAILCHIMP_HONEYPOT_NAME = 'b_a9901935e5a771f85b149cd5d_461c2a97ef'

export default function SubscribeForm() {
  return (
    <form
      action={MAILCHIMP_ACTION_URL}
      method="post"
      target="_blank"
      className="flex gap-3 w-full sm:w-auto"
    >
      <input
        type="email"
        name="EMAIL"
        placeholder="Your email address"
        required
        className="flex-1 md:w-72 px-4 py-2.5 text-sm text-[#111] bg-white focus:outline-none font-sans"
      />
      {/* Honeypot field — must stay hidden and empty; Mailchimp uses it to catch bots */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-5000px' }}>
        <input type="text" name={MAILCHIMP_HONEYPOT_NAME} tabIndex="-1" defaultValue="" />
      </div>
      <button
        type="submit"
        className="bg-[#1a1a1a] hover:bg-black text-white px-5 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors font-sans flex-shrink-0"
      >
        Subscribe
      </button>
    </form>
  )
}
