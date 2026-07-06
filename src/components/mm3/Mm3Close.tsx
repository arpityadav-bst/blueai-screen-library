'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Mm3Network from './Mm3Network'
import { MM3_NETWORK, MM3_CLOSE } from '@/lib/mm3-data'
import { WAITLIST_URL } from '@/lib/mm-shared-data'

// The scale story (dense network) + the manifesto close band.
export default function Mm3Close() {
  const rootRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo('.mm3-net-head', { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.mm3-net-section', start: 'top 76%' } })
      gsap.fromTo('.mm3-close-in', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.mm3-close', start: 'top 78%' } })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef}>
      <section className="mm3-net-section">
        <div className="mm3-net-head">
          <p className="mm3-sec-eyebrow">{MM3_NETWORK.eyebrow}</p>
          <h2 className="mm3-h2">{MM3_NETWORK.head}</h2>
          <p className="mm3-net-sub">{MM3_NETWORK.sub}</p>
        </div>
        <div className="mm3-net-stage"><Mm3Network mode="dense" /></div>
      </section>

      <section className="mm3-close" id="start">
        <h2 className="mm3-close-line mm3-close-in">{MM3_CLOSE.line}</h2>
        <a className="mm3-cta is-inverse mm3-close-in" href={WAITLIST_URL}>Join the waitlist<span aria-hidden="true">→</span></a>
        <p className="mm3-fine mm3-close-in">{MM3_CLOSE.fine}</p>
      </section>
    </div>
  )
}
