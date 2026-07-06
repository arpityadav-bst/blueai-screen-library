'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Mm2Starfield, { type Mm2StarfieldHandle } from './Mm2Starfield'
import Mm2Ship, { type Mm2ShipHandle } from './Mm2Ship'
import { MM2_HERO } from '@/lib/mm2-data'
import { WAITLIST_URL } from '@/lib/mm-shared-data'

// Mission Control hero — a launch-broadcast first screen: starfield, an ascending worker
// unit, live telemetry readouts, and the capital manifesto staged as a mission log.
// GSAP scrub: the unit rises + the flame intensifies as you scroll; copy lifts away.

function useMissionClock() {
  const [t, setT] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setT(252); return }
    const start = Date.now()
    const id = setInterval(() => setT(Math.floor((Date.now() - start) / 1000)), 1000)
    return () => clearInterval(id)
  }, [])
  const h = String(Math.floor(t / 3600)).padStart(2, '0')
  const m = String(Math.floor((t % 3600) / 60)).padStart(2, '0')
  const s = String(t % 60).padStart(2, '0')
  return `T+${h}:${m}:${s}`
}

function useCapitalCounter(reduced: boolean) {
  const [v, setV] = useState(12480)
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setV((n) => n + 1 + ((Math.random() * 4) | 0)), 2200)
    return () => clearInterval(id)
  }, [reduced])
  return v.toLocaleString('en-US')
}

export default function Mm2Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const shipWrapRef = useRef<HTMLDivElement>(null)
  const shipHandle = useRef<Mm2ShipHandle>(null)
  const starHandle = useRef<Mm2StarfieldHandle>(null)
  const [reduced, setReduced] = useState(false)
  const clock = useMissionClock()
  const capital = useCapitalCounter(reduced)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduced(reduce)
    if (reduce) return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo('.mm2-rise', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out', delay: 0.15 })
      gsap.fromTo(shipWrapRef.current, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out', delay: 0.5 })

      gsap.to('.mm2-hero-copy', { yPercent: -22, autoAlpha: 0.08, ease: 'none', scrollTrigger: { trigger: rootRef.current, start: 'top top', end: '82% top', scrub: true } })
      // ascent: a pitching-over trajectory (not a straight vertical rise) + a stronger climax scale
      gsap.to(shipWrapRef.current, {
        y: '-40vh', x: '-5vw', scale: 1.28, rotate: 4.5, ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current, start: 'top top', end: '85% top', scrub: true,
          onUpdate: (self) => { shipHandle.current?.setBoost(self.progress); starHandle.current?.setBoost(self.progress) },
        },
      })
      gsap.to('.mm2-glow-a', { yPercent: 28, ease: 'none', scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('.mm2-glow-b', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true } })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <header className="mm2-hero" ref={rootRef}>
      <Mm2Starfield ref={starHandle} />
      <div className="mm2-glow mm2-glow-a" aria-hidden="true" />
      <div className="mm2-glow mm2-glow-b" aria-hidden="true" />
      <div className="mm2-horizon" aria-hidden="true" />
      <div className="mm2-fade" aria-hidden="true" />

      <div className="mm2-topbar mm2-rise">
        <span className="mm2-mark">BLUEAI // MISSION CONTROL</span>
        <a className="mm2-topbar-cta" href={WAITLIST_URL}>{MM2_HERO.primaryCta}</a>
      </div>

      <div className="mm2-telemetry mm2-rise" aria-hidden="true">
        <div className="mm2-tel-row"><span>CLOCK</span><b>{clock}</b></div>
        <div className="mm2-tel-row"><span>STATUS</span><b className="is-go"><i /> NOMINAL</b></div>
        <div className="mm2-tel-row"><span>CAPITAL AT WORK</span><b>${capital}</b></div>
      </div>

      <div className="mm2-hero-copy">
        <p className="mm2-eyebrow mm2-rise">{MM2_HERO.eyebrow}</p>
        <h1 className="mm2-h1 mm2-rise">{MM2_HERO.h1[0]}<br />{MM2_HERO.h1[1]}</h1>
        <p className="mm2-sub mm2-rise">{MM2_HERO.sub}</p>
        <div className="mm2-cta-row mm2-rise">
          <a className="mm2-cta" href={WAITLIST_URL}>{MM2_HERO.primaryCta}</a>
          <a className="mm2-cta-ghost" href="#fleet">{MM2_HERO.secondaryCta}</a>
        </div>
      </div>

      <div className="mm2-ship-wrap" ref={shipWrapRef}>
        <Mm2Ship ref={shipHandle} />
      </div>
    </header>
  )
}
