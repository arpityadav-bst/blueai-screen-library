'use client'
import '@/styles/hero-cards.css'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HeroNav, HeroArrow, HeroCta } from './HeroNav'
import { CareerLegacy } from './scenes/CareerLegacy'
import { CreatorLegacy } from './scenes/CreatorLegacy'
import { FinanceLegacy } from './scenes/FinanceLegacy'
import { MarketsLegacy } from './scenes/MarketsLegacy'

// 3-Cards hero direction: centered headline + 3 agent cards side by side. SPOTLIGHT loop —
// only the highlighted card runs its scene (from scratch); the other two sit at their resting
// "before" state until their turn. Auto-advances; hover restarts the hovered card + pauses;
// mouse-leave resumes the loop from there. (Same model as the Stage hero.)
const EASE = [0.22, 0.61, 0.36, 1] as const
const CARDS = [
  { key: 'career', icon: '💼', label: 'Career', title: 'Auto apply to jobs with an agent that does the clicking', Scene: CareerLegacy },
  { key: 'creator', icon: '🎬', label: 'Creator', title: 'A faceless video creator agent for YouTube', Scene: CreatorLegacy },
  { key: 'finance', icon: '📈', label: 'Finance', title: 'An AI trading agent that runs live market analysis', Scene: FinanceLegacy },
  { key: 'markets', icon: '🎯', label: 'Markets', title: 'A prediction market agent that watches the odds', Scene: MarketsLegacy },
]
const DWELL = [4200, 4400, 4800, 4600] // ms per card — each ≥ its scene length + a read beat

export function HeroCards() {
  const [active, setActive] = useState(0)
  const [gen, setGen] = useState(0) // bumps on every (re)activation → keyed scene remounts → replays from scratch
  const [paused, setPaused] = useState(false)

  // select a card and (re)start its scene — used by auto-advance, hover, and click
  const select = (i: number) => { setActive(i); setGen((g) => g + 1) }

  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => select((active + 1) % CARDS.length), DWELL[active])
    return () => clearTimeout(t)
  }, [active, paused])

  return (
    <div className="hero-screen">
      <HeroNav />
      <main className="hero">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, delay: 0.1, ease: EASE }}>
          <div className="pill-live"><span className="dot" /><span>4 Agents Live Now</span></div>
        </motion.div>
        <motion.h1 className="headline" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15, ease: EASE }}>Your AI worker for getting things done.</motion.h1>
        <motion.p className="subhead" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2, ease: EASE }}>Hand off everyday tasks, reduce app switching, and keep work moving with BlueAI. Watch a real agent work, then build your own.</motion.p>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25, ease: EASE }}><HeroCta /></motion.div>

        <section className="agents">
          {CARDS.map((c, i) => {
            const Scene = c.Scene
            const live = i === active
            return (
              <motion.article key={c.key} className={`card${live ? ' is-active' : ' is-dim'}`}
                initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: EASE }}
                onMouseEnter={() => { setPaused(true); select(i) }} onMouseLeave={() => setPaused(false)} onClick={() => select(i)}>
                <div className="card-top">
                  <div className={`icon-tile icon-${c.key}`}>{c.icon}</div>
                  <button type="button" className="see-tag"><span>See it work</span><HeroArrow /></button>
                </div>
                <div className="eyebrow">{c.label}</div>
                <h3 className="card-title">{c.title}</h3>
                {/* keyed remount on each activation (live-<gen>) replays from scratch; idle cards rest at phase 0 */}
                <div className="stage"><Scene key={live ? `live-${gen}` : 'idle'} active={live} /></div>
              </motion.article>
            )
          })}
        </section>
      </main>
    </div>
  )
}
