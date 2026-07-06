'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { MM_CUSTODY, MM_FAQ, MM_BRAND_LINE } from '@/lib/mm-shared-data'

// SAFETY PROTOCOL — the custody flow staged as a pre-flight checklist (items tick off
// in sequence as the section enters, mirroring the mission-log language used everywhere
// else on this page) + the FAQ staged as a comm-log transcript. Same shared content as
// the other two variants, entirely different voice.

function CommLog() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="mm2-comm">
      {MM_FAQ.map((f, i) => {
        const isOpen = open === i
        return (
          <div className={'mm2-comm-item' + (isOpen ? ' is-open' : '')} key={f.q}>
            <button className="mm2-comm-q" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
              <span className="mm2-comm-tag">&gt;&gt; INCOMING</span>{f.q}
              <span className="mm2-comm-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
            </button>
            <div className="mm2-comm-a-wrap">
              <p className="mm2-comm-a"><span className="mm2-comm-tag is-go">MISSION CONTROL</span>{f.a}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Mm2Safety() {
  const rootRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo('.mm2-safety-head', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: rootRef.current, start: 'top 78%' } })
      // checklist ticks off in sequence, like items being confirmed one by one — the
      // check mark pops in a beat AFTER its row lands, reading as "row arrives, then confirms"
      gsap.fromTo('.mm2-check-row', { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.28, ease: 'power2.out', scrollTrigger: { trigger: '.mm2-checklist', start: 'top 76%' } })
      gsap.fromTo('.mm2-check-box', { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.35, stagger: 0.28, delay: 0.18, ease: 'back.out(2.4)', scrollTrigger: { trigger: '.mm2-checklist', start: 'top 76%' } })
      gsap.fromTo('.mm2-comm-item', { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.mm2-comm', start: 'top 82%' } })
      gsap.fromTo('.mm2-cert', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, scrollTrigger: { trigger: '.mm2-cert', start: 'top 92%' } })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="mm2-safety" ref={rootRef}>
      <div className="mm2-safety-head">
        <p className="mm2-sec-eyebrow">SAFETY PROTOCOL</p>
        <h2 className="mm2-h2">PRE-FLIGHT CHECKLIST</h2>
      </div>

      <div className="mm2-checklist">
        {MM_CUSTODY.map((s) => (
          <div className="mm2-check-row" key={s.n}>
            <span className="mm2-check-box" aria-hidden="true">✓</span>
            <div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mm2-comm-wrap">
        <p className="mm2-sec-eyebrow">COMM LOG</p>
        <CommLog />
      </div>

      <p className="mm2-cert">GROUND CONTROL — {MM_BRAND_LINE}</p>
    </section>
  )
}
