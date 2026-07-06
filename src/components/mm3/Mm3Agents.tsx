'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { MM3_WORKERS } from '@/lib/mm3-data'
import Mm3AgentDemo from './Mm3AgentDemo'

// "Capital, deployed" — the four workers as where your capital actually goes to work.
export default function Mm3Agents() {
  const rootRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo('.mm3-worker', { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } })
      gsap.fromTo('.mm3-workers-head', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: rootRef.current, start: 'top 80%' } })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="mm3-workers" ref={rootRef}>
      <div className="mm3-workers-head">
        <p className="mm3-sec-eyebrow">Where it goes to work</p>
        <h2 className="mm3-h2">Capital, deployed.</h2>
      </div>
      <div className="mm3-worker-grid">
        {MM3_WORKERS.map((w, i) => (
          <article className="mm3-worker" key={w.key}>
            <p className="mm3-worker-tag">{w.tag}</p>
            <h3 className="mm3-worker-name">{w.name}</h3>
            <p className="mm3-worker-desc">{w.desc}</p>
            <Mm3AgentDemo worker={w} offset={i * 900} />
          </article>
        ))}
      </div>
    </section>
  )
}
