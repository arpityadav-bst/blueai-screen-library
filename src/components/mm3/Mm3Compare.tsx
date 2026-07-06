'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { MM3_COMPARE } from '@/lib/mm3-data'

// "Two ways to earn" — an ABSTRACT mark per side (a flat line that stops · a curve that
// keeps climbing), not a literal data chart with axes. The line itself draws in via GSAP
// stroke-dashoffset as the section enters.

export default function Mm3Compare() {
  const rootRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo('.mm3-cmp-head', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } })
      gsap.fromTo('.mm3-cmp-card', { y: 32, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } })
      ;['.mm3-line-flat', '.mm3-line-curve'].forEach((sel) => {
        const el = rootRef.current?.querySelector(sel) as SVGPathElement | null
        if (!el) return
        const len = el.getTotalLength()
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
        gsap.to(el, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut', scrollTrigger: { trigger: rootRef.current, start: 'top 65%' } })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="mm3-compare" id="compare" ref={rootRef}>
      <div className="mm3-cmp-head">
        <p className="mm3-sec-eyebrow">{MM3_COMPARE.eyebrow}</p>
        <h2 className="mm3-h2">{MM3_COMPARE.head}</h2>
      </div>
      <div className="mm3-cmp-grid">
        <article className="mm3-cmp-card is-time">
          <svg className="mm3-cmp-mark" viewBox="0 0 220 90" fill="none">
            <path className="mm3-line-flat" d="M10 62 C60 62 100 62 150 62" stroke="rgba(238,242,245,.55)" strokeWidth="3" strokeLinecap="round" />
            <circle cx="150" cy="62" r="4.5" fill="rgba(238,242,245,.55)" />
          </svg>
          <h3>{MM3_COMPARE.left.label}</h3>
          <p>{MM3_COMPARE.left.desc}</p>
        </article>
        <article className="mm3-cmp-card is-capital">
          <svg className="mm3-cmp-mark" viewBox="0 0 220 90" fill="none">
            <path className="mm3-line-curve" d="M10 74 C70 74 90 20 150 14 S 205 8 212 6" stroke="url(#mm3CmpGrad)" strokeWidth="3.5" strokeLinecap="round" />
            <defs><linearGradient id="mm3CmpGrad" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#7B4CFF" /><stop offset="100%" stopColor="#ff3ea5" /></linearGradient></defs>
            <circle cx="212" cy="6" r="4.5" fill="#ff3ea5" />
          </svg>
          <h3>{MM3_COMPARE.right.label}</h3>
          <p>{MM3_COMPARE.right.desc}</p>
        </article>
      </div>
    </section>
  )
}
