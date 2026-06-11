'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// CAREER — legacy single-scene (3-Cards + Stage Original): job card drops in → 3
// fields fill → submit pulse + ripple → "Applied ✓ 24". Renders the .stage contents;
// the shell provides the .stage box + sizing. Rebuilt from buildCareerLegacy.
const EASE = [0.22, 0.61, 0.36, 1] as const
const STEPS = [300, 800, 1900, 2200] // 1 job · 2 fills · 3 submit/ripple · 4 applied

const FINAL = STEPS.length // resting phase for inactive cards = fully completed
export function CareerLegacy({ active = true }: { active?: boolean }) {
  const [phase, setPhase] = useState(active ? 0 : FINAL)
  // active: replay from scratch (0 → FINAL). inactive: sit at the FINAL (completed) state.
  useEffect(() => { if (!active) return; setPhase(0); const t = STEPS.map((ms, k) => setTimeout(() => setPhase(k + 1), ms)); return () => t.forEach(clearTimeout) }, [active])
  // inactive cards mount straight at the final state (initial=false) — no entrance replay on hand-off
  const init = (v?: object) => (active ? v : false)
  return (
    <>
      <motion.div className="cr-job" initial={init({ y: -14, opacity: 0 })} animate={{ y: phase >= 1 ? 0 : -14, opacity: phase >= 1 ? 1 : 0 }} transition={{ duration: 0.45, ease: EASE }}>
        <div className="cr-logo">A</div>
        <div><div className="t">Senior Product Manager</div><div className="s">Acme · Remote</div></div>
      </motion.div>
      <div className="cr-form">
        {['Name', 'Email', 'Resume'].map((l, i) => (
          <div className="cr-row" key={l}><span className="cr-lbl">{l}</span><span className="cr-track"><motion.span className="cr-fill" initial={init({ scaleX: 0 })} animate={{ scaleX: phase >= 2 ? 1 : 0 }} transition={{ duration: 0.4, delay: phase >= 2 ? i * 0.22 : 0, ease: EASE }} /></span></div>
        ))}
      </div>
      <motion.button className="cr-submit" tabIndex={-1} initial={init()} animate={{ scale: phase >= 3 ? [1, 1.05, 1] : 1, opacity: phase >= 4 ? 0 : 1 }} transition={{ duration: 0.3 }}>Submit application</motion.button>
      <motion.span className="cr-ripple" initial={init({ scale: 0, opacity: 0 })} animate={phase >= 3 ? { scale: 1, opacity: [0.5, 0] } : { scale: 0, opacity: 0 }} transition={{ duration: 0.5, delay: phase >= 3 ? 0.1 : 0 }} />
      <motion.div className="cr-applied" initial={init({ opacity: 0, y: 8 })} animate={{ opacity: phase >= 4 ? 1 : 0, y: phase >= 4 ? 0 : 8 }} transition={{ duration: 0.35, ease: 'backOut' }}>
        Applied ✓ <span style={{ opacity: .8 }}>· <span className="cr-count">{phase >= 4 ? 24 : 23}</span> today</span>
      </motion.div>
    </>
  )
}
