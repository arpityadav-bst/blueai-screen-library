'use client'
import '@/styles/hero-stage.css'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HeroNav } from './HeroNav'
import { CareerScene, careerMeta } from './scenes/CareerScene'
import { CreatorScene, creatorMeta } from './scenes/CreatorScene'
import { FinanceScene, financeMeta } from './scenes/FinanceScene'

const EASE = [0.22, 0.61, 0.36, 1] as const
const AGENTS = [
  { ...careerMeta, Comp: CareerScene },
  { ...creatorMeta, Comp: CreatorScene },
  { ...financeMeta, Comp: FinanceScene },
]
const DWELL = [9800, 10200, 9200] // ms per agent — each ≥ its (slower) animation + a read beat

export function HeroStage() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const A = AGENTS[active]

  // ambient auto-advance — each agent dwells long enough to finish + a read beat
  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => setActive((a) => (a + 1) % AGENTS.length), DWELL[active])
    return () => clearTimeout(t)
  }, [active, paused])

  return (
    <div className="hero-screen">
      <HeroNav />

      {/* HERO */}
      <main className="hero">
        {/* LEFT: message */}
        <motion.div className="hero-left" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15, ease: EASE }}>
          <h1 className="headline">Your AI worker for getting things done.</h1>
          <p className="subhead">Hand off everyday tasks, reduce app switching, and keep work moving with BlueAI. Watch a real agent work, then build your own.</p>
          <button className="cta">
            <svg className="spark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /><path d="M20 3v4" /><path d="M22 5h-4" /><path d="M4 17v2" /><path d="M5 18H3" /></svg>
            Download BlueAI
            <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
        </motion.div>

        {/* RIGHT: agent showcase */}
        <motion.div className="hero-right" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.28, ease: EASE }}
          onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="pill-live"><span className="dot" /><span>3 Agents Live Now</span></div>

          <div className="rail">
            {AGENTS.map((ag, i) => (
              <button key={ag.key} type="button" className={`thumb${i === active ? ' is-active' : ' is-dim'}`} onMouseEnter={() => setActive(i)} onClick={() => setActive(i)}>
                <span className={`thumb-icon icon-${ag.key}`}>{ag.icon}</span>
                <span className="thumb-label">{ag.label}</span>
                <span className="thumb-see"><ag.SeeArrow /></span>
                {i === active && <motion.span className="thumb-progress" key={`p${active}`} initial={{ scaleX: 0 }} animate={{ scaleX: paused ? 0 : 1 }} transition={{ duration: paused ? 0 : DWELL[i] / 1000, ease: 'linear' }} />}
              </button>
            ))}
          </div>

          <div className="stage-main">
            {/* instant swap — keyed so the agent scene replays on switch (no slide, no overlap) */}
            <div className="pane" key={active}>
              <div className="pane-top">
                <div className={`icon-tile icon-${A.key}`}>{A.icon}</div>
                <div className="eyebrow">{A.label}</div>
                <button type="button" className="see-tag"><span>See it work</span><A.SeeArrow /></button>
              </div>
              <h2 className="pane-title">{A.title}</h2>
              <A.Comp />
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
