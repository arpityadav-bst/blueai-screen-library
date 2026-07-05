'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { MM_NIGHT, MM_TRUST, MM_CLOSE } from '@/lib/mm-data'

// The cinematic middle + close: a PINNED night-shift scene (deep slate interlude — the page's
// one dark band), scroll-scrubbed: the moon arcs, the night's earnings surface one by one,
// then the wake-up line lands. Follows with the glass trust pillars and the gradient close band.
// Reduced-motion / short viewports → unpinned static stack.

export default function MmStory() {
  const rootRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      // the head reveals as the section APPROACHES (pre-pin) — the scene must never read as empty sky
      gsap.fromTo('.mm-night-head', { autoAlpha: 0, y: 30 }, {
        autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.mm-night', start: 'top 72%' },
      })
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.mm-night', start: 'top top', end: '+=185%', scrub: 0.4, pin: true },
      })
      // the moon's night: a true lunar ARC — rises from the low left, glides across the apex
      // (slightly larger, nearer), and begins to set right as dawn tints the sky
      tl.set('.mm-moon', { x: '-30vw', y: '24vh', rotate: -10, scale: 0.9 }, 0)
        .to('.mm-moon', { x: '-9vw', y: '-5vh', rotate: -3, scale: 1.0, ease: 'sine.out', duration: 1.1 }, 0)
        .to('.mm-moon', { x: '10vw', y: '-9vh', rotate: 3, scale: 1.08, ease: 'none', duration: 0.9 }, 1.1)
        .to('.mm-moon', { x: '30vw', y: '7vh', rotate: 10, scale: 0.96, ease: 'sine.in', duration: 0.9 }, 2.0)
        .to('.mm-cloud-a', { x: '9vw', ease: 'none', duration: 2.9 }, 0)
        .to('.mm-cloud-b', { x: '-7vw', ease: 'none', duration: 2.9 }, 0)
        .to('.mm-cloud-c', { x: '5vw', ease: 'none', duration: 2.9 }, 0)
        .to('.mm-stars-a', { yPercent: -5, ease: 'none', duration: 2.9 }, 0)
        .to('.mm-stars-b', { yPercent: -11, ease: 'none', duration: 2.9 }, 0)
        .fromTo('.mm-beat', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, stagger: 0.45, duration: 0.45 }, 0.15)
        .fromTo('.mm-wake', { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.5 }, 2.15)
        .to('.mm-night-sky', { backgroundPosition: '0% 100%', ease: 'none', duration: 2.9 }, 0)
      gsap.fromTo('.mm-trust-card', { y: 36, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '.mm-trust', start: 'top 76%' },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef}>
      {/* night shift — the one dark, cinematic band */}
      <section className="mm-night">
        <div className="mm-night-sky" aria-hidden="true" />
        <div className="mm-stars mm-stars-a" aria-hidden="true" />
        <div className="mm-stars mm-stars-b" aria-hidden="true" />
        <span className="mm-moon" aria-hidden="true" />
        <span className="mm-cloud mm-cloud-a" aria-hidden="true" />
        <span className="mm-cloud mm-cloud-b" aria-hidden="true" />
        <span className="mm-cloud mm-cloud-c" aria-hidden="true" />
        <div className="mm-night-inner">
          <div className="mm-night-head">
            <p className="mm-sec-eyebrow is-night">{MM_NIGHT.sub}</p>
            <h2 className="mm-h2 is-night">{MM_NIGHT.head}</h2>
          </div>
          <div className="mm-beats">
            {MM_NIGHT.beats.map((b) => (
              <div className="mm-beat" key={b.t}>
                <span className="mm-beat-t">{b.t}</span>
                <span className="mm-beat-what"><b>{b.who}</b> — {b.what}</span>
                <span className="mm-beat-amt">{b.amt}</span>
              </div>
            ))}
          </div>
          <p className="mm-wake">{MM_NIGHT.wake}</p>
        </div>
      </section>

      {/* trust — the glass pillars that make "it touches my money" feel safe */}
      <section className="mm-trust">
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
      </section>

      {/* close — the brand-gradient band */}
      <section className="mm-close" id="start">
        <h2 className="mm-close-line">{MM_CLOSE.line}</h2>
        <a className="mm-cta is-inverse" href="#top" aria-label={MM_CLOSE.cta}>{MM_CLOSE.cta}<span className="mm-cta-arr" aria-hidden="true">→</span></a>
        <p className="mm-fine">{MM_CLOSE.fine}</p>
      </section>
    </div>
  )
}
