'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Stroke-based glyphs (fill=none, stroke=currentColor) — matches the DS's real icon
// primitives (Sparkle.tsx/Arrow.tsx), not a separate filled-icon language. Generic shapes,
// not brand marks: "video / photo / short-form / social" so the motif reads as "your
// channels", not a trademark wall.
const GLYPHS = [
  { path: 'M9 8l7 4-7 4V8Z', bg: '#FF5A5A' },                                                        // play
  { path: 'M4 8h4l1.5-2h5L16 8h4v11H4V8Z M12 10.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z', bg: '#7B4CFF' },     // camera
  { path: 'M6 16V9M10 18V6M14 18V9M18 15v-3', bg: '#0B0E1A' },                                        // soundwave
  { path: 'M4 5h16v10H10l-4 4V15H4V5Z', bg: '#0EA4C5' },                                              // chat — real --bai-cyan (#0EA4C5)
]

const ORBITS = [
  { radius: 92, duration: 22, glyph: GLYPHS[0] },
  { radius: 140, duration: 34, glyph: GLYPHS[1] },
  { radius: 140, duration: 34, glyph: GLYPHS[2], offset: 180 },
  { radius: 188, duration: 46, glyph: GLYPHS[3] },
]

const BADGE_SIZE = 32 // one consistent diameter for every orbit satellite (was 28-34px, four different sizes)

export default function AmbientOrbit() {
  const orbitRefs = useRef<(HTMLDivElement | null)[]>([])
  const counterRefs = useRef<(HTMLDivElement | null)[]>([])
  const pingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ORBITS.forEach((o, i) => {
        const wrap = orbitRefs.current[i]
        const counter = counterRefs.current[i]
        if (!wrap || !counter) return
        gsap.set(wrap, { rotation: o.offset || 0 })
        gsap.to(wrap, { rotation: `+=360`, duration: o.duration, ease: 'none', repeat: -1 })
        gsap.to(counter, { rotation: `-=360`, duration: o.duration, ease: 'none', repeat: -1 })
      })
      if (pingRef.current) {
        gsap.fromTo(
          pingRef.current,
          { scale: 0.3, opacity: 0.5 },
          { scale: 2.1, opacity: 0, duration: 3.2, ease: 'power1.out', repeat: -1 }
        )
      }
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="pointer-events-none relative mx-auto aspect-square w-full max-w-[420px] select-none">
      {[92, 140, 188].map((r) => (
        <div
          key={r}
          className="absolute rounded-full border border-divider"
          style={{ width: r * 2, height: r * 2, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
        />
      ))}

      <div ref={pingRef} className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bai-gradient opacity-20" />

      <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-overlay">
        <Image src="/logo-mark.svg" alt="BlueAI" width={44} height={44} />
      </div>

      {ORBITS.map((o, i) => (
        <div
          key={i}
          ref={(el) => { orbitRefs.current[i] = el }}
          className="absolute left-1/2 top-1/2 h-0 w-0"
        >
          <div
            style={{ transform: `translateX(${o.radius}px) translateY(-50%)` }}
            className="absolute left-0 top-1/2"
          >
            <div
              ref={(el) => { counterRefs.current[i] = el }}
              className="flex items-center justify-center rounded-full shadow-overlay"
              style={{ width: BADGE_SIZE, height: BADGE_SIZE, background: o.glyph.bg }}
            >
              <svg viewBox="0 0 24 24" width={BADGE_SIZE * 0.5} height={BADGE_SIZE * 0.5} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={o.glyph.path} />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
