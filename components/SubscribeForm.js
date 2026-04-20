'use client'
export default function SubscribeForm() {
  return (
    <form className="flex gap-3 w-full sm:w-auto" onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        placeholder="Your email address"
        className="flex-1 md:w-72 px-4 py-2.5 text-sm text-[#111] bg-white focus:outline-none font-sans"
      />
      <button
        type="submit"
        className="bg-[#1a1a1a] hover:bg-black text-white px-5 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors font-sans flex-shrink-0"
      >
        Subscribe
      </button>
    </form>
  )
}
