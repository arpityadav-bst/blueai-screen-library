'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Visual counter-argument to Hero's AmbientOrbit: instead of one channel reading one
// AI, this is many small creators orbiting one brand mark — "reach through many local
// voices, not one big one." Same icon-badge family as AmbientOrbit (stroke glyph in a
// colored circle) so the two hero devices read as one system, not two unrelated widgets.
const DOTS = [
  { r: 70, duration: 14, offset: 0 },
  { r: 70, duration: 14, offset: 120 },
  { r: 70, duration: 14, offset: 240 },
  { r: 118, duration: 22, offset: 40 },
  { r: 118, duration: 22, offset: 160 },
  { r: 118, duration: 22, offset: 280 },
  { r: 166, duration: 32, offset: 0 },
  { r: 166, duration: 32, offset: 90 },
  { r: 166, duration: 32, offset: 180 },
  { r: 166, duration: 32, offset: 270 },
]

const COLORS = ['#2F6DFF', '#0EA4C5', '#7B4CFF'] // real --bai-mkt-blue / --bai-cyan / --bai-iris
const CHECK_PATH = 'M5 13l4 4L19 7' // "verified" — each dot is a completed, checked job
const BADGE_SIZE = 18

export default function BrandOrbit() {
  const orbitRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      DOTS.forEach((d, i) => {
        const el = orbitRefs.current[i]
        if (!el) return
        gsap.set(el, { rotation: d.offset })
        gsap.to(el, { rotation: `+=360`, duration: d.duration, ease: 'none', repeat: -1 })
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="pointer-events-none relative mx-auto aspect-square w-full max-w-[420px] select-none">
      {[70, 118, 166].map((r) => (
        <div
          key={r}
          className="absolute rounded-full border border-divider"
          style={{ width: r * 2, height: r * 2, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
        />
      ))}

      <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-overlay">
        <Image src="/logo-mark.svg" alt="BlueAI" width={44} height={44} />
      </div>

      {DOTS.map((d, i) => (
        <div
          key={i}
          ref={(el) => { orbitRefs.current[i] = el }}
          className="absolute left-1/2 top-1/2 h-0 w-0"
        >
          <div
            style={{ transform: `translateX(${d.r}px) translateY(-50%)` }}
            className="absolute left-0 top-1/2 flex items-center justify-center rounded-full shadow-overlay"
          >
            <span
              className="flex items-center justify-center rounded-full"
              style={{ width: BADGE_SIZE, height: BADGE_SIZE, background: COLORS[i % COLORS.length] }}
            >
              <svg viewBox="0 0 24 24" width={BADGE_SIZE * 0.5} height={BADGE_SIZE * 0.5} fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d={CHECK_PATH} />
              </svg>
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
