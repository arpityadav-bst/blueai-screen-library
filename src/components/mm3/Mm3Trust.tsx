'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { MM_CUSTODY, MM_FAQ, MM_BRAND_LINE } from '@/lib/mm-shared-data'

// The trust section, in the keynote voice: the custody flow as a numbered editorial
// list (the same content as the other two variants, staged as confident statements
// rather than a diagram or a checklist), then an accordion addressing the real
// objections, closing on the brand-credibility line.

function TrustFaq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="mm3-faq">
      {MM_FAQ.map((f, i) => {
        const isOpen = open === i
        return (
          <div className={'mm3-faq-item' + (isOpen ? ' is-open' : '')} key={f.q}>
            <button className="mm3-faq-q" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
              {f.q}
              <span className="mm3-faq-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
            </button>
            <div className="mm3-faq-a-wrap"><p className="mm3-faq-a">{f.a}</p></div>
          </div>
        )
      })}
    </div>
  )
}

export default function Mm3Trust() {
  const rootRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo('.mm3-trust-head', { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } })
      gsap.fromTo('.mm3-custody-row', { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.mm3-custody-list', start: 'top 78%' } })
      gsap.fromTo('.mm3-faq-item', { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.mm3-faq', start: 'top 82%' } })
      gsap.fromTo('.mm3-brand-line', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, scrollTrigger: { trigger: '.mm3-brand-line', start: 'top 92%' } })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="mm3-trust" ref={rootRef}>
      <div className="mm3-trust-head">
        <p className="mm3-sec-eyebrow">Nothing hidden</p>
        <h2 className="mm3-h2">How your money stays <span className="mm3-grad">yours.</span></h2>
      </div>

      <div className="mm3-custody-list">
        {MM_CUSTODY.map((s) => (
          <div className="mm3-custody-row" key={s.n}>
            <span className="mm3-custody-n">{s.n}</span>
            <div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mm3-faq-wrap">
        <p className="mm3-sec-eyebrow">Real questions, answered</p>
        <TrustFaq />
      </div>

      <p className="mm3-brand-line">{MM_BRAND_LINE}</p>
    </section>
  )
}
