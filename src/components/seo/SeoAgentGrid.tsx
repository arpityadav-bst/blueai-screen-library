'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CareerLegacy } from '../hero/scenes/CareerLegacy'
import { CreatorLegacy } from '../hero/scenes/CreatorLegacy'
import { FinanceLegacy } from '../hero/scenes/FinanceLegacy'
import { MarketsLegacy } from '../hero/scenes/MarketsLegacy'
import { HERO_AGENTS } from '@/lib/seo-data'

// The hero's 2×2 of live agent cards — reuses our animated legacy scenes on the same SPOTLIGHT
// loop as the 3/4-card hero (one card runs its scene at a time; others rest at their final state;
// hover restarts + pauses). Sized down to sit beside the headline. Scene CSS is scoped under
// `.v-seo` in seo-home.css.
const SCENES = { career: CareerLegacy, creator: CreatorLegacy, finance: FinanceLegacy, markets: MarketsLegacy } as const
const ICONS: Record<string, string> = { career: '💼', creator: '🎬', finance: '📈', markets: '🎯' }
const SLUG: Record<string, string> = { career: 'apply-to-jobs', creator: 'ai-video-creator', finance: 'ai-trading-agent', markets: 'prediction-market-agent' }
const DWELL = [4200, 4400, 4800, 4600]
const EASE = [0.22, 0.61, 0.36, 1] as const

export function SeoAgentGrid() {
  const [active, setActive] = useState(0)
  const [gen, setGen] = useState(0)
  const [paused, setPaused] = useState(false)
  const select = (i: number) => { setActive(i); setGen((g) => g + 1) }

  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => select((active + 1) % HERO_AGENTS.length), DWELL[active])
    return () => clearTimeout(t)
  }, [active, paused])

  return (
    <div className="seo-agents">
      {HERO_AGENTS.map((a, i) => {
        const Scene = SCENES[a.key]
        const live = i === active
        return (
          <motion.a
            key={a.key}
            href={`/${SLUG[a.key]}`}
            className={`seo-agent${live ? ' is-active' : ' is-dim'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 + i * 0.08, ease: EASE }}
            onMouseEnter={() => { setPaused(true); select(i) }}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="seo-agent-top">
              <div className={`seo-agent-icon icon-${a.key}`}>{ICONS[a.key]}</div>
              <span className="seo-see">See it work
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </span>
            </div>
            <div className="seo-agent-eyebrow">{a.eyebrow}</div>
            <h3 className="seo-agent-title">{a.title}</h3>
            <div className="seo-agent-stage">
              <Scene key={live ? `live-${gen}` : 'idle'} active={live} />
            </div>
          </motion.a>
        )
      })}
    </div>
  )
}
