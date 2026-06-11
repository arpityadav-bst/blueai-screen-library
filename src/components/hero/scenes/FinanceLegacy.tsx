'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useCountUp } from '../useCountUp'

// FINANCE — legacy single-scene: tickers + sweep → chart line draws + area fills →
// "BUY" marker pops → portfolio counts 9,850→12,480. Rebuilt from buildFinanceLegacy.
// `big` switches the chart geometry/viewBox between the 3-Cards (62h) and Stage
// Original (96h) panels.
const EASE = [0.22, 0.61, 0.36, 1] as const
const TICKS: [string, string, string][] = [['AAPL', '+1.2%', 'up'], ['NVDA', '+3.4%', 'up'], ['TSLA', '−0.8%', 'dn']]
const STEPS = [200, 900, 1700, 2000, 2200] // 1 ticks+sweep · 2 line · 3 area · 4 marker · 5 value

const FINAL = STEPS.length // resting phase for inactive cards = fully completed
export function FinanceLegacy({ big = false, active = true }: { big?: boolean; active?: boolean }) {
  const [phase, setPhase] = useState(active ? 0 : FINAL)
  // active: replay from scratch (0 → FINAL). inactive: sit at the FINAL (completed) state.
  useEffect(() => { if (!active) return; setPhase(0); const t = STEPS.map((ms, k) => setTimeout(() => setPhase(k + 1), ms)); return () => t.forEach(clearTimeout) }, [active])
  const val = useCountUp(12480, phase >= 5, { duration: 900, start: 9850, instant: !active })
  const h = big ? 96 : 62
  const areaD = big ? 'M4 72 L40 62 L80 68 L120 46 L160 52 L200 28 L240 34 L276 12 L276 96 L4 96 Z' : 'M4 46 L40 40 L80 44 L120 30 L160 34 L200 18 L240 22 L276 8 L276 62 L4 62 Z'
  const lineD = big ? 'M4 72 L40 62 L80 68 L120 46 L160 52 L200 28 L240 34 L276 12' : 'M4 46 L40 40 L80 44 L120 30 L160 34 L200 18 L240 22 L276 8'
  // inactive cards mount straight at the final state (initial=false) — no entrance replay on hand-off
  const init = (v?: object) => (active ? v : false)
  return (
    <>
      <div className="fn-tickers">
        {TICKS.map(([sym, pct, dir], i) => (
          <motion.div className="fn-tick" key={sym} initial={init({ opacity: 0.45 })} animate={{ opacity: phase >= 1 ? 1 : 0.45 }} transition={{ duration: 0.25, delay: phase >= 1 ? i * 0.12 : 0 }}>
            <div className="sym">{sym}</div><div className={`pct ${dir}`}>{pct}</div>
          </motion.div>
        ))}
        {phase >= 1 && phase < 2 && <motion.span className="fn-sweep" initial={{ x: '-120%' }} animate={{ x: '320%' }} transition={{ duration: 0.85, ease: 'easeInOut' }} />}
      </div>
      <div className="fn-chartwrap">
        <svg className="fn-chart" viewBox={`0 0 280 ${h}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="fn-grad" x1="0" y1="0" x2="280" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#7B4CFF" /><stop offset="1" stopColor="#0EA4C5" /></linearGradient>
            <linearGradient id="fn-areagrad" x1="0" y1="0" x2="0" y2={h} gradientUnits="userSpaceOnUse"><stop stopColor="rgba(123,76,255,.18)" /><stop offset="1" stopColor="rgba(14,164,197,0)" /></linearGradient>
          </defs>
          <motion.path className="fn-area" d={areaD} fill="url(#fn-areagrad)" initial={init({ opacity: 0 })} animate={{ opacity: phase >= 3 ? 1 : 0 }} transition={{ duration: 0.5 }} />
          <motion.path className="fn-line" d={lineD} initial={init({ pathLength: 0 })} animate={{ pathLength: phase >= 2 ? 1 : 0 }} transition={{ duration: 1.0, ease: 'easeInOut' }} />
        </svg>
        <motion.div className="fn-marker" initial={init({ opacity: 0, scale: 0, y: -16 })} animate={{ opacity: phase >= 4 ? 1 : 0, scale: phase >= 4 ? 1 : 0, y: phase >= 4 ? 0 : -16 }} transition={{ duration: 0.45, ease: 'backOut' }}>BUY</motion.div>
      </div>
      <div className="fn-port"><span className="v">$<span className="fn-val">{val.toLocaleString('en-US')}</span></span><span className="d">▲ 3.2%</span></div>
    </>
  )
}
