'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { formatCount, type Estimate } from './estimate'
import { useCBModal } from '../ModalHost'

// The lookup result. It used to be a card that REPLACED the hero's input — the input vanished the
// moment you submitted, so there was no way to try a second handle without a page reload, and the
// hero's whole layout jumped. It's a dialog body now: the input stays exactly where it was and this
// appears over it.
//
// STRIPPED BACK (designer, 2026-08-11: "this needs to be more minimal"). What was removed and why,
// because each of these was a layer of chrome around one number:
//   · the tinted panel that wrapped the figure — a card inside a card, on a dialog that is already
//     a card. The dialog is the container; it didn't need a second one.
//   · TWO competing big numbers. "342 subscribers" was set at 26px directly above a 40px earnings
//     figure, so the INPUT was fighting the OUTPUT for the eye. The subscriber count is what the
//     reader told us; the money is what they came for. Count demoted to a quiet line.
//   · the "FROM WHAT YOU TOLD US" eyebrow — an uppercase tracking-label row whose whole content was
//     a provenance note. Folded into the count line as ordinary text.
//   · the three-row breakdown of bold-key + em-dash-description pairs, plus the hairline above it.
//     Three rows of two-tone text to say "5 jobs, flat rate, plus a bonus" — now one sentence.
//   · the tier chip (pill, wash fill, iris ink). It's a nice human touch and it stays, as quiet
//     text next to the handle rather than as a coloured badge.
//
// `source` exists because the two paths genuinely know different things. 'auto' read the channel;
// 'manual' was told. Saying "read from your channel" for both would claim BlueAI looked something up
// when the reader typed it in themselves thirty seconds earlier.
export default function EarningsReveal({
  estimate,
  handleLabel,
  source,
}: {
  estimate: Estimate
  handleLabel: string
  source: 'auto' | 'manual'
}) {
  const { open } = useCBModal()
  const lowRef = useRef<HTMLSpanElement>(null)
  const highRef = useRef<HTMLSpanElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const counters = { low: 0, high: 0 }
      // A count-up only, no card entrance — Modal animates the panel, and running a second
      // fade-and-rise on the contents inside it made the numbers arrive after the dialog had
      // already visually settled. A linear ease keeps low/high finishing together instead of the
      // smaller number settling early under an "out" ease.
      gsap.to(counters, {
        low: estimate.low,
        high: estimate.high,
        duration: 0.9,
        ease: 'none',
        onUpdate: () => {
          if (lowRef.current) lowRef.current.textContent = Math.round(counters.low).toLocaleString()
          if (highRef.current) highRef.current.textContent = Math.round(counters.high).toLocaleString()
        },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [estimate])

  return (
    <div ref={rootRef} className="cb-tabular">
      {/* Handle and tier on one line. pr-12 clears Modal's close button. */}
      <div className="flex flex-wrap items-baseline gap-x-2 border-b border-divider px-6 py-4 pr-12 sm:px-7 sm:pr-14">
        <span className="text-[13px] font-semibold text-ink-heading">{handleLabel}</span>
        <span className="text-[12.5px] text-ink-muted">· {estimate.tier}</span>
      </div>

      <div className="px-6 py-6 sm:px-7">
        <p className="text-[12.5px] text-ink-muted">
          {formatCount(estimate.followers)} subscribers,{' '}
          {source === 'auto' ? 'read from your channel' : 'from what you told us'}
        </p>

        {/* The one number this whole flow exists to produce: the brand gradient and the largest type
            in the dialog, with nothing boxed around it. */}
        <p className="mt-5 text-[13px] text-ink-body-2">You could be earning</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-gradient font-head text-[40px] font-bold leading-none">
            $<span ref={lowRef}>0</span>–$<span ref={highRef}>0</span>
          </span>
          <span className="text-[14px] font-medium text-ink-muted">/ week</span>
        </div>

        {/* One sentence where three labelled rows used to be. Same three facts. */}
        <p className="mt-4 max-w-[46ch] text-[12.5px] leading-relaxed text-ink-muted">
          Around 5 jobs a week at a flat rate, plus a bonus scaled to your following.
        </p>

        <button
          type="button"
          onClick={() => open('waitlist')}
          className="mt-7 w-full rounded-pill bg-cta-gradient px-5 py-3.5 text-[15px] font-semibold text-white shadow-cta transition-all duration-base ease-out-bai hover:-translate-y-0.5 hover:shadow-cta-hover"
        >
          Join the waitlist to start earning
        </button>
        {/* Under the CTA, not above it: it's the caveat on the number, and a reader who has already
            decided doesn't need it in their way first. Two sentences collapsed into one. */}
        <p className="mt-3 text-center text-[11.5px] text-ink-muted">
          Illustrative — real payouts depend on the jobs available.
        </p>
      </div>
    </div>
  )
}
