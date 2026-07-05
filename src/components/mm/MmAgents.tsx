'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { MM_EARNERS } from '@/lib/mm-data'
import MmAgentDemo from './MmDemos'

// "Meet your earners" — four glass agent cards on the light canvas. Each carries a small
// LIVING orbital mark (CSS motion, no charts). GSAP staggers them in as the section enters.

export default function MmAgents() {
  const rootRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo('.mm-agent', { y: 42, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 72%' },
      })
      gsap.fromTo('.mm-agents-head', { y: 26, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 80%' },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="mm-agents" id="agents" ref={rootRef}>
      <div className="mm-agents-head">
        <p className="mm-sec-eyebrow">Meet your earners</p>
        {/* multi-sentence heading breaks AT the full stop (taste 14) — never mid-sentence via balance */}
        <h2 className="mm-h2">Four agents.<br />One payroll — <span className="mm-grad">yours.</span></h2>
      </div>
      <div className="mm-agent-grid">
        {MM_EARNERS.map((e, i) => (
          <article className="mm-agent" key={e.key}>
            <div className={'mm-agent-orb is-' + e.key} aria-hidden="true">
              <span className="mm-orbit" /><span className="mm-orbit mm-orbit-2" />
              <span className="mm-agent-core" />
            </div>
            <p className="mm-agent-role">{String(i + 1).padStart(2, '0')} · {e.role}</p>
            <h3 className="mm-agent-name">{e.name}</h3>
            <p className="mm-agent-desc">{e.desc}</p>
            <MmAgentDemo kind={e.key} offset={i * 900} />
            <p className="mm-agent-range"><span>{e.monthly}</span> / month · demo range</p>
          </article>
        ))}
      </div>
    </section>
  )
}
