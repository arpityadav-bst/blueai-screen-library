'use client'

import { useState } from 'react'
import Reveal from '../Reveal'
import CTABand from '../CTABand'

export default function WaitlistCTA() {
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  return (
    <section id="waitlist" className="px-6 pb-24 pt-24">
      <Reveal className="mx-auto max-w-content" as="div">
        <CTABand>
          <h2 className="mx-auto max-w-[24ch] font-head text-3xl font-bold text-white sm:text-4xl">
            The jobs open soon.
            <span className="cb-text-gradient-dark block italic pr-[0.2em]">Be first in line.</span>
          </h2>
          {/* Was an off-token text-[15px] — a third lead size that existed nowhere else.
              Now bai-body-lg like every other lead. text-white/70 still wins over the
              class's own color because utilities outrank @layer components. */}
          <p className="bai-body-lg mx-auto mt-4 max-w-[46ch] text-white/70">
            Join 12,400+ creators waiting to start earning through BlueAI.
          </p>

          {joined ? (
            <p className="mx-auto mt-8 max-w-sm rounded-pill bg-white/10 px-6 py-3 text-[14px] font-medium text-white">
              You&apos;re on the list. We&apos;ll email you the moment jobs open.
            </p>
          ) : (
            // Single flush pill — input and button share one border, exactly like the hero's
            // handle lookup (HandleLookupCard.tsx): `flex items-stretch rounded-pill border`
            // with left padding only, so the button's own pill sits against the shell's inner
            // right edge. Was two separate controls with a gap-3 between them, which read as
            // a form next to a button rather than as one field you complete.
            //
            // On mobile it stacks instead, and the shell drops to rounded-credits: a 128px
            // pill radius around a ~110px-tall stacked box reads as a lozenge rather than a
            // field. Below sm it's a normal input group; from sm up it's the flush pill.
            <form
              className="cb-field-dark mx-auto mt-8 flex max-w-md flex-col items-stretch gap-1.5 rounded-credits border bg-white/10 p-1.5 sm:flex-row sm:gap-0 sm:rounded-pill sm:p-0 sm:pl-5"
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
                placeholder="Enter your email here"
                // No placeholder: utility — cb-field-dark sets it, and a utility would
                // outrank the stylesheet rule.
                className="w-full bg-transparent px-4 py-3 text-[14px] text-white outline-none sm:px-0 sm:py-3.5 sm:pr-2"
              />
              <button
                type="submit"
                className="flex shrink-0 items-center justify-center rounded-pill bg-white px-6 py-3 text-[14px] font-semibold text-ink-display transition-transform hover:-translate-y-0.5 active:scale-[0.98] sm:py-0"
              >
                Join waitlist
              </button>
            </form>
          )}
        </CTABand>
      </Reveal>
    </section>
  )
}
