'use client'

import { useState } from 'react'
import Reveal from '../Reveal'

export default function WaitlistCTA() {
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  return (
    <section id="waitlist" className="px-6 pb-24 pt-24">
      <Reveal className="mx-auto max-w-content" as="div">
        <div className="overflow-hidden rounded-credits bg-cta-band px-8 py-16 text-center sm:px-16">
          <p className="bai-eyebrow uppercase text-white/70">Pre-launch</p>
          <h2 className="mx-auto mt-3 max-w-[24ch] font-head text-3xl font-bold text-white sm:text-4xl">
            Be first in line when the jobs open up.
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-[15px] text-white/70">
            Join 12,400+ creators waiting to start earning through BlueAI.
          </p>

          {joined ? (
            <p className="mx-auto mt-8 max-w-sm rounded-pill bg-white/10 px-6 py-3 text-[14px] font-medium text-white">
              You&apos;re on the list — we&apos;ll email you the moment jobs open.
            </p>
          ) : (
            <form
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault()
                if (email.trim()) setJoined(true)
              }}
            >
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-pill border border-white/20 bg-white/10 px-5 py-3.5 text-[14px] text-white outline-none placeholder:text-white/50 focus:border-white/50"
              />
              <button
                type="submit"
                className="shrink-0 rounded-pill bg-white px-6 py-3.5 text-[14px] font-semibold text-ink-display transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Join waitlist
              </button>
            </form>
          )}
        </div>
      </Reveal>
    </section>
  )
}
