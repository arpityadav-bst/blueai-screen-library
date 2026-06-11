'use client'
import '@/styles/hero-stage-original.css'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HeroNav, HeroArrow, HeroCta } from './HeroNav'
import { CareerLegacy } from './scenes/CareerLegacy'
import { CreatorLegacy } from './scenes/CreatorLegacy'
import { FinanceLegacy } from './scenes/FinanceLegacy'

// Stage Original hero direction: centered headline + CTA on top; below, one big stage
// (legacy animation, cross-faded) + a vertical thumbnail rail.
const EASE = [0.22, 0.61, 0.36, 1] as const
const AGENTS = [
  { key: 'career', icon: '💼', label: 'Career', title: 'Auto apply to jobs with an agent that does the clicking', desc: 'Reads a job, fills the application, and submits it for you across job boards. You review, it taps.', Scene: <CareerLegacy /> },
  { key: 'creator', icon: '🎬', label: 'Creator', title: 'A faceless video creator agent for YouTube', desc: 'Finds a trend, writes the script, builds the short or micro-drama, and posts it. A whole channel on autopilot.', Scene: <CreatorLegacy /> },
  { key: 'finance', icon: '📈', label: 'Finance', title: 'An AI trading agent that runs live market analysis', desc: 'Scans US markets every day and shows live agent portfolios you can watch. Data analysis, not advice.', Scene: <FinanceLegacy big /> },
]
const DWELL = 4500

export function HeroStageOriginal() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const A = AGENTS[active]

  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => setActive((a) => (a + 1) % AGENTS.length), DWELL)
    return () => clearTimeout(t)
  }, [active, paused])

  return (
    <div className="hero-screen">
      <HeroNav />
      <main className="hero">
        <motion.h1 className="headline" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15, ease: EASE }}>Your AI worker for getting things done.</motion.h1>
        <motion.p className="subhead" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2, ease: EASE }}>Hand off everyday tasks, reduce app switching, and keep work moving with BlueAI. Watch a real agent work, then build your own.</motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25, ease: EASE }}><HeroCta /></motion.div>

        <motion.section className="showcase" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
          onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          {/* big stage */}
          <div className="stage-main">
            <AnimatePresence initial={false}>
              <motion.div key={active} className="pane" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                <div className="pane-top">
                  <div className={`icon-tile icon-${A.key}`}>{A.icon}</div>
                  <div><div className="eyebrow">{A.label}</div></div>
                  <button type="button" className="see-tag"><span>See it work</span><HeroArrow /></button>
                </div>
                <h2 className="pane-title">{A.title}</h2>
                <p className="pane-desc">{A.desc}</p>
                <div className="stage">{A.Scene}</div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* rail */}
          <div className="rail">
            <div className="pill-live"><span className="dot" /><span>3 Agents Live Now</span></div>
            {AGENTS.map((a, i) => (
              <button key={a.key} type="button" className={`thumb${i === active ? ' is-active' : ' is-dim'}`} onMouseEnter={() => setActive(i)} onClick={() => setActive(i)}>
                <div className="thumb-top"><span className={`thumb-icon icon-${a.key}`}>{a.icon}</span><span className="thumb-eyebrow">{a.label}</span></div>
                <p className="thumb-title">{a.title}</p>
                {i === active && <motion.span className="thumb-progress" key={`p${active}`} initial={{ scaleX: 0 }} animate={{ scaleX: paused ? 0 : 1 }} transition={{ duration: paused ? 0 : DWELL / 1000, ease: 'linear' }} />}
              </button>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  )
}
