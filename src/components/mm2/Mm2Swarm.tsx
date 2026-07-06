'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Mm2SwarmCanvas from './Mm2SwarmCanvas'
import { MM2_SWARM, MM2_MANIFEST } from '@/lib/mm2-data'
import { WAITLIST_URL } from '@/lib/mm-shared-data'

// Scalability scene (swarm formation) + the close: a flight-manifest waitlist band with
// a scripted reservation counter that ticks up once the section is in view.

function useReservationCounter(active: boolean, reduced: boolean) {
  const [n, setN] = useState(1842)
  useEffect(() => {
    if (!active || reduced) return
    const id = setInterval(() => setN((v) => v + (Math.random() < 0.5 ? 1 : 0)), 2600)
    return () => clearInterval(id)
  }, [active, reduced])
  return n
}

export default function Mm2Swarm() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [manifestIn, setManifestIn] = useState(false)
  const [reduced, setReduced] = useState(false)
  const count = useReservationCounter(manifestIn, reduced)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduced(reduce)
    if (reduce) { setManifestIn(true); return }
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo('.mm2-swarm-head', { y: 26, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.mm2-swarm', start: 'top 78%' },
      })
      ScrollTrigger.create({ trigger: '.mm2-manifest', start: 'top 80%', onEnter: () => setManifestIn(true) })
      gsap.fromTo('.mm2-manifest-in', { y: 24, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.mm2-manifest', start: 'top 78%' },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef}>
      <section className="mm2-swarm">
        <div className="mm2-swarm-head">
          <p className="mm2-sec-eyebrow">{MM2_SWARM.eyebrow}</p>
          <h2 className="mm2-h2">{MM2_SWARM.head}</h2>
          <p className="mm2-swarm-sub">{MM2_SWARM.sub}</p>
        </div>
        <div className="mm2-swarm-stage"><Mm2SwarmCanvas /></div>
      </section>

      <section className="mm2-manifest">
        <p className="mm2-sec-eyebrow mm2-manifest-in">{MM2_MANIFEST.eyebrow}</p>
        <h2 className="mm2-h2 is-light mm2-manifest-in">{MM2_MANIFEST.head}</h2>
        <p className="mm2-manifest-sub mm2-manifest-in">{MM2_MANIFEST.sub}</p>
        <a className="mm2-cta mm2-manifest-in" href={WAITLIST_URL}>Reserve now</a>
        <div className="mm2-counter mm2-manifest-in">
          <b>{count.toLocaleString('en-US')}</b>
          <span>{MM2_MANIFEST.counterLabel}</span>
        </div>
        <p className="mm2-fine mm2-manifest-in">{MM2_MANIFEST.fine}</p>
      </section>
    </div>
  )
}
