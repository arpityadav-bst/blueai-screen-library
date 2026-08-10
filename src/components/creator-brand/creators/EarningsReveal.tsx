'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { formatCount, type Estimate } from './estimate'
import { CBLinkButton } from '../Button'

export default function EarningsReveal({ estimate, handleLabel }: { estimate: Estimate; handleLabel: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const lowRef = useRef<HTMLSpanElement>(null)
  const highRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const counters = { low: 0, high: 0 }
      // Timeline (not two independent tweens): the card finishes its entrance BEFORE the
      // count-up starts, so it never reads as "done" while digits are still moving. A
      // linear ease on the count keeps low/high finishing together instead of the smaller
      // number visually settling early under an "out" ease.
      const tl = gsap.timeline()
      tl.fromTo(rootRef.current, { opacity: 0, y: 16, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' })
      tl.to(
        counters,
        {
          low: estimate.low,
          high: estimate.high,
          duration: 0.9,
          ease: 'none',
          onUpdate: () => {
            if (lowRef.current) lowRef.current.textContent = Math.round(counters.low).toLocaleString()
            if (highRef.current) highRef.current.textContent = Math.round(counters.high).toLocaleString()
          },
        },
        '-=0.1'
      )
    })
    return () => ctx.revert()
  }, [estimate])

  return (
    <div ref={rootRef} className="cb-tabular shadow-float rounded-credits border border-stroke-warm bg-white p-6">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-ink-muted">{handleLabel}</span>
        <span className="rounded-pill bg-bai-wash px-3 py-1 text-[12px] font-semibold text-iris">
          {estimate.tier}
        </span>
      </div>

      <div className="mt-4 text-[13px] text-ink-muted">Estimated reach</div>
      <div className="font-head text-[28px] font-semibold text-ink-display">{formatCount(estimate.followers)} subscribers</div>

      <div className="mt-5 border-t border-divider pt-5">
        <div className="text-[13px] text-ink-muted">You could be earning</div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-head text-[36px] font-bold leading-none text-ink-display">
            $<span ref={lowRef}>0</span>–$<span ref={highRef}>0</span>
          </span>
          <span className="text-[14px] font-medium text-ink-muted">/ week</span>
        </div>
        <p className="mt-2 text-[12px] text-ink-muted">
          A flat rate per YouTube job, plus a reach bonus based on your following. Real
          payouts depend on the jobs available.
        </p>
      </div>

      <CBLinkButton href="#waitlist" size="lg" className="mt-5 w-full">
        Join the waitlist to start earning
      </CBLinkButton>
    </div>
  )
}
