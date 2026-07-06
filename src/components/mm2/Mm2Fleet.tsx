'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { MM2_UNITS } from '@/lib/mm2-data'
import Mm2UnitDemo from './Mm2UnitDemo'

// The fleet — four worker units as mission cards, each with a live telemetry log
// (Mm2UnitDemo). GSAP staggers them in as the section enters.

export default function Mm2Fleet() {
  const rootRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo('.mm2-unit', { y: 36, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 74%' },
      })
      gsap.fromTo('.mm2-fleet-head', { y: 24, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 82%' },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="mm2-fleet" id="fleet" ref={rootRef}>
      <div className="mm2-fleet-head">
        <p className="mm2-sec-eyebrow">THE FLEET</p>
        <h2 className="mm2-h2">Four units. One mission.</h2>
      </div>
      <div className="mm2-unit-grid">
        {MM2_UNITS.map((u, i) => (
          <article className="mm2-unit" key={u.key}>
            <div className="mm2-unit-head">
              <span className="mm2-unit-callsign">{u.callsign}</span>
              <span className="mm2-unit-go"><i /> GO</span>
            </div>
            <h3 className="mm2-unit-name">{u.name}</h3>
            <p className="mm2-unit-brief">{u.brief}</p>
            <Mm2UnitDemo unit={u} offset={i * 900} />
          </article>
        ))}
      </div>
    </section>
  )
}
