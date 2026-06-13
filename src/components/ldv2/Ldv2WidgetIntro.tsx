'use client'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// The widget assembling itself: blueprint wireframe DRAWS in → a scan beam sweeps down and the
// blueprint is WIPED AWAY behind it (clip-path), revealing the live widget beneath as the beam
// passes — "the widget materializes under a scanning beam." A wipe (not a cross-fade) so the
// blueprint and the real widget never overlap in the same spot — alignment is irrelevant, no shift.
// Opaque overlay hides the loading iframe. Plays once, ~1.9s. Reduced-motion: skip.
// Stroke/fill live in CSS (.ldv2-intro) — var() doesn't resolve in SVG presentation attributes.
const EASE = [0.22, 0.61, 0.36, 1] as const
const ROWS = [330, 398, 466] // the 3 value-row rects (panel coords, viewBox 0 0 452 720)

export function Ldv2WidgetIntro() {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<'draw' | 'reveal' | 'gone'>('draw')

  useEffect(() => {
    if (reduce) { setPhase('gone'); return }
    const t1 = setTimeout(() => setPhase('reveal'), 950)
    const t2 = setTimeout(() => setPhase('gone'), 2150)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [reduce])

  if (reduce || phase === 'gone') return null
  const revealing = phase === 'reveal'
  const draw = { initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: 0.85, ease: EASE } }

  // The wipe (clip-path) + beam are CSS-driven (the `is-reveal` class) — framer doesn't reliably
  // interpolate clip-path strings (it snaps); a CSS keyframe animates inset() smoothly.
  return (
    <div className={`ldv2-intro${revealing ? ' is-reveal' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 452 720" preserveAspectRatio="xMidYMid meet" fill="none">
        <g>
          <motion.circle cx="226" cy="140" r="38" {...draw} />
          <motion.rect x="86" y="206" width="280" height="20" rx="6" {...draw} />
          <motion.rect x="126" y="234" width="200" height="20" rx="6" {...draw} />
          <motion.rect x="106" y="276" width="240" height="8" rx="4" {...draw} />
          <motion.rect x="126" y="290" width="200" height="8" rx="4" {...draw} />
          {ROWS.map((y) => (
            <motion.rect key={y} x="64" y={y} width="324" height="52" rx="12" {...draw} />
          ))}
          <motion.rect x="64" y="600" width="324" height="50" rx="25" {...draw} />
        </g>
      </svg>
      {/* the materialize beam — rides the wipe edge (top → bottom), CSS-animated on .is-reveal */}
      {revealing && <div className="ldv2-intro-scan" />}
    </div>
  )
}
