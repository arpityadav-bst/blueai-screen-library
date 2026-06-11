'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useCountUp } from '../useCountUp'

// CREATOR — legacy single-scene: "Trending" pops → 3 script lines draw → 3 storyboard
// frames pop (last gets a play button) → views count to 12.4K. Rebuilt from buildCreatorLegacy.
const EASE = [0.22, 0.61, 0.36, 1] as const
const STEPS = [200, 600, 1100, 1600, 1800] // 1 trend · 2 lines · 3 frames · 4 play · 5 views

const FINAL = STEPS.length // resting phase for inactive cards = fully completed
export function CreatorLegacy({ active = true }: { active?: boolean }) {
  const [phase, setPhase] = useState(active ? 0 : FINAL)
  // active: replay from scratch (0 → FINAL). inactive: sit at the FINAL (completed) state.
  useEffect(() => { if (!active) return; setPhase(0); const t = STEPS.map((ms, k) => setTimeout(() => setPhase(k + 1), ms)); return () => t.forEach(clearTimeout) }, [active])
  const views = useCountUp(12400, phase >= 5, { duration: 1000, instant: !active })
  const viewsTxt = views >= 1000 ? (views / 1000).toFixed(1) + 'K' : String(views)
  // inactive cards mount straight at the final state (initial=false) — no entrance replay on hand-off
  const init = (v?: object) => (active ? v : false)
  return (
    <>
      <motion.div className="cv-trend" initial={init({ opacity: 0, y: -10, scale: 0.85 })} animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : -10, scale: phase >= 1 ? 1 : 0.85 }} transition={{ duration: 0.4, ease: 'backOut' }}>▲ Trending</motion.div>
      <div className="cv-script">
        {['l1', 'l2', 'l3'].map((c, i) => (
          <motion.span className={`cv-line ${c}`} key={c} initial={init({ scaleX: 0 })} animate={{ scaleX: phase >= 2 ? 1 : 0 }} transition={{ duration: 0.32, delay: phase >= 2 ? i * 0.2 : 0, ease: EASE }} />
        ))}
      </div>
      <div className="cv-board">
        {[0, 1, 2].map((i) => (
          <motion.div className="cv-frame" key={i} initial={init({ opacity: 0, scale: 0.6, y: 10 })} animate={{ opacity: phase >= 3 ? 1 : 0, scale: phase >= 3 ? 1 : 0.6, y: phase >= 3 ? 0 : 10 }} transition={{ duration: 0.4, delay: phase >= 3 ? i * 0.14 : 0, ease: 'backOut' }}>
            {i === 2 && (
              <motion.span className="cv-play" initial={init({ opacity: 0, scale: 0 })} animate={{ opacity: phase >= 4 ? 1 : 0, scale: phase >= 4 ? 1 : 0 }} transition={{ duration: 0.4, ease: 'backOut' }}>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
      <div className="cv-views"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg><span className="cv-count">{viewsTxt}</span> views</div>
    </>
  )
}
