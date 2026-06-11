'use client'
import { useEffect, useState } from 'react'
import { motion, type TargetAndTransition } from 'framer-motion'

// MARKETS — legacy single-scene (3-Cards): name a market → read the live odds per outcome →
// one swings past the threshold → a summary alert lands in the inbox. Maps the 4 "How it works"
// steps (pick markets · reads live odds · tracks every move · you get an alert). Phase-driven.
const EASE = [0.22, 0.61, 0.36, 1] as const
const STEPS = [400, 1150, 2200, 3000] // 1 pick market · 2 read odds · 3 swing past threshold · 4 alert
const OUTCOMES = [
  { name: 'Argentina', base: 24, baseW: 86 },
  { name: 'France', base: 19, baseW: 68, swung: 25, swungW: 90 }, // swings past threshold at phase 3
  { name: 'Brazil', base: 15, baseW: 54 },
]
const FINAL = STEPS.length

export function MarketsLegacy({ active = true }: { active?: boolean }) {
  const [phase, setPhase] = useState(active ? 0 : FINAL)
  useEffect(() => {
    if (!active) return
    setPhase(0)
    const t = STEPS.map((ms, k) => setTimeout(() => setPhase(k + 1), ms))
    return () => t.forEach(clearTimeout)
  }, [active])
  // inactive cards mount at the final state with no entrance replay (framer replays initial→animate on every mount)
  const init = (v?: TargetAndTransition) => (active ? v : false)

  return (
    <>
      {/* 1 — pick your markets */}
      <motion.div className="mk-watch" initial={init({ opacity: 0, y: -8 })} animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : -8 }} transition={{ duration: 0.35, ease: EASE }}>
        <span className="mk-dot" />
        <span className="mk-watch-t">World Cup 2026 · Winner</span>
        <span className="mk-src">Polymarket</span>
      </motion.div>

      {/* 2 — reads the live odds · 3 — France swings past the threshold */}
      <div className="mk-odds">
        {OUTCOMES.map((o, i) => {
          const swung = o.swung != null && phase >= 3
          const pct = swung ? o.swung : o.base
          const w = swung ? o.swungW! : o.baseW
          return (
            <motion.div className="mk-row" key={o.name} initial={init({ opacity: 0, x: -6 })} animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : -6 }} transition={{ duration: 0.3, delay: phase >= 2 ? i * 0.12 : 0, ease: EASE }}>
              <span className="mk-name">{o.name}</span>
              <span className="mk-track">
                <motion.span className="mk-fill" initial={init({ scaleX: 0 })} animate={{ scaleX: phase >= 2 ? w / 100 : 0 }} transition={{ duration: 0.45, delay: phase >= 2 ? i * 0.12 : 0, ease: EASE }} />
              </span>
              <span className={`mk-pct${swung ? ' is-up' : ''}`}>{swung ? '▲ ' : ''}{pct}%</span>
            </motion.div>
          )
        })}
      </div>

      {/* 4 — you get an alert (odds + context only, lands in the inbox) */}
      <motion.div className="mk-alert" initial={init({ opacity: 0, y: 8 })} animate={{ opacity: phase >= 4 ? 1 : 0, y: phase >= 4 ? 0 : 8 }} transition={{ duration: 0.35, ease: 'backOut' }}>
        <span className="mk-env">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
        </span>
        <span className="mk-alert-t">Alert sent · France +6%</span>
      </motion.div>
    </>
  )
}
