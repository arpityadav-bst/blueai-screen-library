'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { MM_TRUST } from '@/lib/mm-data'
import { MM_CUSTODY, MM_FAQ, MM_BRAND_LINE } from '@/lib/mm-shared-data'

// The deepened trust section — the 3 quick pillars (unchanged) lead into the full custody
// flow (the #1 trust lever for a product touching your money) + an accordion addressing
// the real objections head-on, closing on a brand-credibility byline. Glass language,
// matching the rest of Autonomy OS.

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="mm-faq">
      {MM_FAQ.map((f, i) => {
        const isOpen = open === i
        return (
          <div className={'mm-faq-item' + (isOpen ? ' is-open' : '')} key={f.q}>
            <button className="mm-faq-q" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
              {f.q}
              <span className="mm-faq-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
            </button>
            <div className="mm-faq-a-wrap">
              <p className="mm-faq-a">{f.a}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function MmTrustDeep() {
  const rootRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo('.mm-trust-card', { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: rootRef.current, start: 'top 76%' } })
      gsap.fromTo('.mm-custody-step', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.13, ease: 'power3.out', scrollTrigger: { trigger: '.mm-custody', start: 'top 78%' } })
      gsap.fromTo('.mm-faq-item', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.mm-faq', start: 'top 80%' } })
      gsap.fromTo('.mm-brand-line', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, scrollTrigger: { trigger: '.mm-brand-line', start: 'top 90%' } })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="mm-trust" ref={rootRef}>
      <p className="mm-sec-eyebrow">Built on trust</p>
      <h2 className="mm-h2">Autonomous, <span className="mm-grad">never out of control.</span></h2>
      <div className="mm-trust-grid">
        {MM_TRUST.map((t) => (
          <article className="mm-trust-card" key={t.title}>
            <h3>{t.title}</h3>
            <p>{t.desc}</p>
          </article>
        ))}
      </div>

      <div className="mm-custody">
        <p className="mm-sec-eyebrow">How your money stays yours</p>
        <div className="mm-custody-flow">
          {MM_CUSTODY.map((s, i) => (
            <div className="mm-custody-step" key={s.n}>
              <span className="mm-custody-n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {i < MM_CUSTODY.length - 1 && <span className="mm-custody-arr" aria-hidden="true">→</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="mm-faq-wrap">
        <p className="mm-sec-eyebrow">Real questions, answered</p>
        <FaqAccordion />
      </div>

      <p className="mm-brand-line">{MM_BRAND_LINE}</p>
    </section>
  )
}
