'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTypewriter } from '../useTypewriter'

// FINANCE agent — Scene 1: ask a question → pull live data (sweep + metrics + the
// price graph draws itself). Scene 2: slide to the breakdown → reads each position →
// "analysis sent to your inbox (data only)". Rebuilt from buildFinanceRich.
const EASE = [0.22, 0.61, 0.36, 1] as const
const QUESTION = 'How are my holdings doing?'
const METRICS = [['Price', '$214'], ['Momentum', '+1.8%'], ['RSI', '58'], ['ADX', '27'], ['52W high', '−4%'], ['Volume', '1.4×']]
const POSITIONS = [
  { sym: 'AAPL', bg: 'linear-gradient(150deg,#7B4CFF,#0EA4C5)', note: 'Near 52-week high, momentum cooling as volume thins.' },
  { sym: 'NVDA', bg: 'linear-gradient(150deg,#2f8fff,#13c2c2)', note: 'Strong trend (ADX 31), price compressing under resistance.' },
  { sym: 'MSFT', bg: 'linear-gradient(150deg,#8a6bff,#5b8def)', note: 'Range-bound, low volatility, RSI neutral at 51.' },
  { sym: 'TSLA', bg: 'linear-gradient(150deg,#d6455d,#e0863a)', note: 'Below 50-day average, volume expanding on the downside.' },
]
// phase: 0 typing · 1 pull data · 2 data pulled · 3 slide→deliver · 4 positions · 5 email
const STEPS = [1900, 3600, 4000, 4600, 6100]
const Arrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>

export function FinanceScene() {
  const [phase, setPhase] = useState(0)
  const typed = useTypewriter(QUESTION, { speed: 48, startDelay: 350 })

  useEffect(() => {
    const timers = STEPS.map((t, k) => setTimeout(() => setPhase(k + 1), t))
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="stage fn-stage">
      {/* Scene 1 — gather */}
      <motion.div className="fn-scene fn-gather" initial={{ x: '0%' }} animate={{ x: phase >= 3 ? '-100%' : '0%', opacity: phase >= 3 ? 0 : 1 }} transition={{ duration: 0.42, ease: EASE }}>
        <div className="fn-ask">
          <span className="fn-chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>holdings.png</span>
          <span className="fn-ask-q">{typed}</span><span className="fn-caret" />
        </div>
        <div className="fn-data-lbl">
          {phase < 2 && <motion.span className="fn-spin" animate={{ rotate: 360 }} transition={{ duration: 0.9, ease: 'linear', repeat: Infinity }} />}
          <span className="fn-data-txt">{phase >= 2 ? 'Live data pulled' : 'Pulling live data…'}</span>
        </div>
        <div className="fn-metrics">
          {METRICS.map(([k, v], i) => (
            <motion.div className="fn-metric" key={k} initial={{ opacity: 0, y: 6 }} animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 6 }} transition={{ duration: 0.3, delay: phase >= 1 ? i * 0.1 : 0, ease: EASE }}>
              <span className="k">{k}</span><span className="val">{v}</span>
            </motion.div>
          ))}
          {phase >= 1 && phase < 3 && <motion.span className="fn-sweep" initial={{ x: '-120%' }} animate={{ x: '360%' }} transition={{ duration: 1.2, ease: 'easeInOut' }} />}
        </div>
        <div className="fn-graph">
          <span className="fn-gtag">AAPL · 6M</span>
          <svg viewBox="0 0 400 60" preserveAspectRatio="none">
            <defs>
              <linearGradient id="fn-grad" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#7B4CFF" /><stop offset="1" stopColor="#0EA4C5" /></linearGradient>
              <linearGradient id="fn-agrad" x1="0" y1="0" x2="0" y2="60" gradientUnits="userSpaceOnUse"><stop stopColor="rgba(61,123,255,.16)" /><stop offset="1" stopColor="rgba(61,123,255,0)" /></linearGradient>
            </defs>
            <motion.path className="fn-garea" d="M4 46 L52 42 L100 47 L148 34 L196 38 L244 24 L292 30 L340 16 L396 20 L396 60 L4 60 Z" fill="url(#fn-agrad)" animate={{ opacity: phase >= 1 ? 1 : 0 }} transition={{ duration: 0.5, delay: phase >= 1 ? 0.5 : 0 }} />
            <motion.path className="fn-gline" d="M4 46 L52 42 L100 47 L148 34 L196 38 L244 24 L292 30 L340 16 L396 20" initial={{ pathLength: 0 }} animate={{ pathLength: phase >= 1 ? 1 : 0 }} transition={{ duration: 1.0, ease: 'easeInOut', delay: phase >= 1 ? 0.3 : 0 }} />
          </svg>
        </div>
      </motion.div>

      {/* Scene 2 — deliver */}
      <motion.div className="fn-scene fn-deliver" initial={{ x: '100%', opacity: 0 }} animate={{ x: phase >= 3 ? '0%' : '100%', opacity: phase >= 3 ? 1 : 0 }} transition={{ duration: 0.42, ease: EASE }}>
        <div className="fn-run-lbl">Running the numbers, position by position</div>
        <div className="fn-breakdown">
          {POSITIONS.map((p, i) => (
            <motion.div className="fn-pos" key={p.sym} initial={{ opacity: 0, y: 8 }} animate={{ opacity: phase >= 4 ? 1 : 0, y: phase >= 4 ? 0 : 8 }} transition={{ duration: 0.32, delay: phase >= 4 ? i * 0.26 : 0, ease: EASE }}>
              <span className="sym" style={{ background: p.bg }}>{p.sym}</span>
              <span className="note">{p.note}</span>
            </motion.div>
          ))}
        </div>
        <motion.div className="fn-email" initial={{ opacity: 0, y: 10 }} animate={{ opacity: phase >= 5 ? 1 : 0, y: phase >= 5 ? 0 : 10 }} transition={{ duration: 0.42, ease: 'backOut' }}>
          <span className="env"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg></span>
          <span><b>Analysis sent to your inbox</b><i>Data only — no buy or sell calls</i></span>
        </motion.div>
      </motion.div>
    </div>
  )
}

export const financeMeta = { key: 'finance', icon: '📈', label: 'Finance', title: 'An AI trading agent that runs live market analysis', SeeArrow: Arrow }
