'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { formatCount, type Estimate } from './estimate'
import { useCBModal } from '../ModalHost'

// The lookup result. It used to be a card that REPLACED the hero's input — the input vanished the
// moment you submitted, so there was no way to try a second handle without a page reload, and the
// hero's whole layout jumped. It's a dialog body now (designer, 2026-08-11): the input stays
// exactly where it was and this appears over it.
//
// `source` exists because the two paths genuinely know different things. 'auto' read the channel;
// 'manual' was told. Labelling both "Estimated reach" would claim BlueAI looked something up when
// the reader typed it in themselves thirty seconds earlier.
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
      // A count-up only, no card entrance any more — Modal.tsx animates the panel, and running a
      // second fade-and-rise on the contents inside it made the numbers arrive after the dialog
      // had already visually settled. A linear ease keeps low/high finishing together instead of
      // the smaller number settling early under an "out" ease.
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
      <div className="flex items-center justify-between gap-3 border-b border-divider px-6 py-4 pr-12 sm:px-7 sm:pr-14">
        <span className="truncate text-[13px] font-medium text-ink-muted">{handleLabel}</span>
        <span className="shrink-0 rounded-pill bg-bai-wash px-3 py-1 text-[12px] font-semibold text-iris">
          {estimate.tier}
        </span>
      </div>

      <div className="px-6 py-6 sm:px-7">
        <div className="text-[12px] font-medium uppercase tracking-label text-ink-muted">
          {source === 'auto' ? 'Read from your channel' : 'From what you told us'}
        </div>
        <div className="mt-1 font-head text-[26px] font-semibold text-ink-display">
          {formatCount(estimate.followers)} subscribers
        </div>

        {/* The earnings figure is the one number this whole flow exists to produce, so it gets the
            brand gradient and the largest type in the dialog — everything above it is the setup. */}
        <div className="mt-6 rounded-field bg-[rgba(var(--bai-iris-rgb),0.05)] p-5">
          <div className="text-[13px] text-ink-body-2">You could be earning</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-gradient font-head text-[40px] font-bold leading-none">
              $<span ref={lowRef}>0</span>–$<span ref={highRef}>0</span>
            </span>
            <span className="text-[14px] font-medium text-ink-muted">/ week</span>
          </div>
          {/* The breakdown replaces one line of prose that asked the reader to take the range on
              faith. Three facts, each the reason the number is what it is. */}
          <ul className="mt-4 space-y-1.5 border-t border-[rgba(var(--bai-iris-rgb),0.12)] pt-4">
            {[
              ['Around 5 jobs a week', 'based on what brands are queuing now'],
              ['A flat rate per job', 'the same for every creator, whatever your size'],
              ['Plus a reach bonus', 'scaled to your following'],
            ].map(([k, v]) => (
              <li key={k} className="flex flex-wrap items-baseline gap-x-1.5 text-[12.5px]">
                <span className="font-semibold text-ink-heading">{k}</span>
                <span className="text-ink-muted">— {v}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={() => open('waitlist')}
          className="mt-5 w-full rounded-pill bg-cta-gradient px-5 py-3.5 text-[15px] font-semibold text-white shadow-cta transition-all duration-base ease-out-bai hover:-translate-y-0.5 hover:shadow-cta-hover"
        >
          Join the waitlist to start earning
        </button>
        {/* Was buried mid-card above the CTA. It belongs under it: it's the caveat on the number,
            and a reader who has already decided doesn't need it in their way first. */}
        <p className="mt-3 text-center text-[11.5px] text-ink-muted">
          Illustrative, not a rate card. Real payouts depend on the jobs available.
        </p>
      </div>
    </div>
  )
}
