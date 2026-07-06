'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { GradientCanvas } from '@/components/creator/GradientCanvas'
import { MM_HERO, MM_OS_AGENTS, MM_OS_FEED } from '@/lib/mm-data'
import { WAITLIST_URL } from '@/lib/mm-shared-data'

// /moneymaker hero — the first screen IS the product: the living brand-gradient sky
// (creator-v2's GradientCanvas, reused) with a glass AUTONOMY OS panel floating in 3D.
// The panel leans with the pointer; on scroll, GSAP scrubs it flat and lifts the copy
// away (cinematic handoff into the page). Reduced-motion → everything static.

function useCountUp(start: number, reduced: boolean) {
  const [cents, setCents] = useState(start)
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setCents((c) => c + (Math.random() < 0.2 ? 20 + ((Math.random() * 60) | 0) : 1 + ((Math.random() * 6) | 0))), 1100)
    return () => clearInterval(id)
  }, [reduced])
  return (cents / 100).toFixed(2)
}

export default function MmHero() {
  const rootRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const [reduced, setReduced] = useState(false)
  const [feedI, setFeedI] = useState(0)
  const earned = useCountUp(4613, reduced)
  const session = useCountUp(0, reduced)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduced(reduce)
    if (reduce) return
    const feed = setInterval(() => setFeedI((i) => i + 1), 3400)

    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      // scroll choreography: copy drifts up + fades, panel un-tilts and settles, orbs parallax at depths
      gsap.to('.mm-hero-copy', { yPercent: -28, autoAlpha: 0.06, ease: 'none', scrollTrigger: { trigger: rootRef.current, start: 'top top', end: '82% top', scrub: true } })
      gsap.fromTo(tiltRef.current, { rotateX: 14 }, { rotateX: 0, y: -46, ease: 'none', scrollTrigger: { trigger: rootRef.current, start: 'top top', end: '70% top', scrub: true } })
      gsap.to('.mm-orb-a', { yPercent: 34, ease: 'none', scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('.mm-orb-b', { yPercent: -26, ease: 'none', scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true } })
      // load-in: one orchestrated stagger (copy → panel), no scattered micro-motion
      gsap.fromTo('.mm-rise', { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.11, ease: 'power3.out', delay: 0.15 })
      gsap.fromTo(panelRef.current, { y: 54, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, ease: 'power3.out', delay: 0.55 })
    }, rootRef)

    // pointer tilt — the OS leans like a physical pane (desktop only; coarse pointers skip)
    const fine = window.matchMedia('(pointer: fine)').matches
    const onMove = fine ? (e: PointerEvent) => {
      const el = tiltRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height
      gsap.to(el, { rotateY: dx * 7, rotateX: 14 - dy * 6, duration: 0.6, ease: 'power2.out', overwrite: 'auto' })
    } : null
    if (onMove) window.addEventListener('pointermove', onMove, { passive: true })
    return () => { clearInterval(feed); ctx.revert(); if (onMove) window.removeEventListener('pointermove', onMove) }
  }, [])

  const feed = [0, 1, 2, 3].map((k) => MM_OS_FEED[(feedI + k) % MM_OS_FEED.length])   // 4 rows ≈ the 4-chip column's height — columns stay balanced

  return (
    <header className="mm-hero" ref={rootRef}>
      <GradientCanvas />
      <div className="mm-orb mm-orb-a" aria-hidden="true" />
      <div className="mm-orb mm-orb-b" aria-hidden="true" />
      <div className="mm-hero-fade" aria-hidden="true" />

      <div className="mm-topbar mm-rise">
        <span className="mm-mark">BlueAI</span>
        <span className="mm-topbar-tag">Moneymaker</span>
        <a className="mm-topbar-cta" href={WAITLIST_URL}>{MM_HERO.primaryCta}</a>
      </div>

      <div className="mm-hero-copy">
        <h1 className="mm-h1 mm-rise">{MM_HERO.h1a} <span className="mm-grad">{MM_HERO.h1grad}</span></h1>
        <p className="mm-sub mm-rise">{MM_HERO.sub}</p>
        <div className="mm-cta-row mm-rise">
          <a className="mm-cta" href={WAITLIST_URL}>{MM_HERO.primaryCta}<span className="mm-cta-arr" aria-hidden="true">→</span></a>
          <a className="mm-cta-ghost" href="#agents">{MM_HERO.secondaryCta}</a>
        </div>
        <ul className="mm-trustline mm-rise">
          {MM_HERO.trust.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </div>

      {/* the Autonomy OS — a glass pane floating in the gradient */}
      <div className="mm-stage">
        <div className="mm-panel-tilt" ref={tiltRef}>
          <div className="mm-panel" ref={panelRef}>
            <div className="mm-panel-head">
              <span className="mm-panel-live" aria-hidden="true" />
              <span className="mm-panel-title">Autonomy OS</span>
              <span className="mm-session" role="status">While you&rsquo;ve been here <b>+${session}</b></span>
            </div>
            <div className="mm-panel-body">
              <div className="mm-panel-agents">
                {MM_OS_AGENTS.map((a) => (
                  <div className={'mm-chip' + (a.on ? ' is-on' : '')} key={a.key}>
                    <span className="mm-chip-dot" aria-hidden="true" />
                    <span className="mm-chip-name">{a.name}</span>
                    <span className="mm-chip-state">{a.state}</span>
                  </div>
                ))}
              </div>
              <div className="mm-panel-feed" aria-label="Recent agent activity (demo)">
                {feed.map((f, i) => (
                  <div className={'mm-feed-row' + (i === 0 ? ' is-new' : '')} key={feedI + '-' + i}>
                    <span className="mm-feed-who">{f.who}</span>
                    <span className="mm-feed-what">{f.what}</span>
                    <span className={'mm-feed-amt' + (f.amt.startsWith('−') ? ' is-loss' : '')}>{f.amt}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mm-panel-foot">
              <span>Earned today</span>
              <b className="mm-panel-total">+${earned}</b>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
