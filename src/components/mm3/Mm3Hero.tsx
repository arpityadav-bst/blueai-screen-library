'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Mm3Network from './Mm3Network'
import { MM3_HERO } from '@/lib/mm3-data'
import { WAITLIST_URL } from '@/lib/mm-shared-data'

// The Capital Shift hero — one bold, direct claim over an ambient agent-network sky.
// (Earlier drafts staged this as a "you sold your time / your skill / your capital"
// three-act reveal — that framing was the internal strategy rationale, not user-facing
// copy, and was removed 2026-07-06. The product benefit is stated plainly instead.)

export default function Mm3Hero() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.mm3-rise', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.85, stagger: 0.12, ease: 'power3.out', delay: 0.2 })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <header className="mm3-hero" ref={rootRef}>
      <Mm3Network mode="ambient" />
      <div className="mm3-vignette" aria-hidden="true" />

      <div className="mm3-topbar mm3-rise">
        <span className="mm3-mark">BlueAI</span>
        <a className="mm3-topbar-cta" href={WAITLIST_URL}>{MM3_HERO.primaryCta}</a>
      </div>

      <div className="mm3-hero-inner">
        <p className="mm3-sec-eyebrow mm3-rise">{MM3_HERO.eyebrow}</p>
        <h1 className="mm3-h1 mm3-rise">{MM3_HERO.h1a} <span className="mm3-grad">{MM3_HERO.h1grad}</span></h1>
        <p className="mm3-sub mm3-rise">{MM3_HERO.sub}</p>
        <div className="mm3-cta-row mm3-rise">
          <a className="mm3-cta" href={WAITLIST_URL}>{MM3_HERO.primaryCta}<span aria-hidden="true">→</span></a>
          <a className="mm3-cta-ghost" href="#compare">{MM3_HERO.secondaryCta}</a>
        </div>
      </div>
    </header>
  )
}
