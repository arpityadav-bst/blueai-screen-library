'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CareerLegacy } from '@/components/hero/scenes/CareerLegacy'
import { CreatorLegacy } from '@/components/hero/scenes/CreatorLegacy'
import { FinanceLegacy } from '@/components/hero/scenes/FinanceLegacy'
import { MarketsLegacy } from '@/components/hero/scenes/MarketsLegacy'
import { LDV2_WORKERS } from '@/lib/ldv2-data'

// The workers grid — the PM's 4 cards, ALIVE: each card runs its real agent scene on the
// spotlight loop (one plays at a time, others rest at final state, hover steals) and keeps
// the PM's result chip (the receipt). Scene CSS is scoped under .ldv2 in live-demo-v2.css.
const SCENES = { career: CareerLegacy, creator: CreatorLegacy, finance: FinanceLegacy, markets: MarketsLegacy } as const
const DWELL = [4400, 4200, 4800, 4600]
const EASE = [0.22, 0.61, 0.36, 1] as const

export function Ldv2Workers() {
  const [active, setActive] = useState(0)
  const [gen, setGen] = useState(0)
  const [paused, setPaused] = useState(false)
  const select = (i: number) => { setActive(i); setGen((g) => g + 1) }

  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => select((active + 1) % LDV2_WORKERS.length), DWELL[active])
    return () => clearTimeout(t)
  }, [active, paused])

  return (
    <section className="ldv2-section" id="workers">
      <div className="ldv2-wrap">
        <div className="ldv2-secthead">
          <span className="ldv2-eyebrow">Already on the job</span>
          <h2 className="ldv2-h2">Meet the workers already earning.</h2>
          <p className="ldv2-sub">Each one does real, multi step work inside real apps. This is what they actually shipped.</p>
        </div>
        <div className="ldv2-workers">
          {LDV2_WORKERS.map((w, i) => {
            const Scene = SCENES[w.key]
            const live = i === active
            return (
              <motion.div
                key={w.key}
                className={`ldv2-worker${live ? ' is-active' : ' is-dim'}`}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                onMouseEnter={() => { setPaused(true); select(i) }}
                onMouseLeave={() => setPaused(false)}
              >
                <div className="ldv2-worker-top">
                  <div className={`ldv2-worker-icon icon-${w.key}`}>{w.icon}</div>
                  <h3>{w.title}</h3>
                  <span className="live"><span className="dot" />LIVE</span>
                </div>
                <p>{w.desc}</p>
                <div className="ldv2-stage">
                  <Scene key={live ? `live-${gen}` : 'idle'} active={live} />
                </div>
                <div className="ldv2-result">{w.result}</div>
              </motion.div>
            )
          })}
        </div>
        <p className="ldv2-wmore">Plus <b>30+ more skills</b>, from deal hunting and cashback to WhatsApp business and freelance bidding.</p>
      </div>
    </section>
  )
}
