'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { useTypewriter } from '../useTypewriter'

// CAREER agent — Scene 1: type a job search → results scan in → pick the top match.
// Scene 2: slide to the form → fields auto-fill → CV + cover letter attach → submit →
// "Applied ✓ 24". Rebuilt from the GSAP timeline (buildCareerRich) as phase-driven motion.
const EASE = [0.22, 0.61, 0.36, 1] as const
const QUERY = 'Product Manager · Remote'
const RESULTS = [
  { letter: 'A', bg: 'linear-gradient(150deg,#7B4CFF,#0EA4C5)', title: 'Senior Product Manager', co: 'Acme · Remote', match: '98%' },
  { letter: 'G', bg: 'linear-gradient(150deg,#2f8fff,#13c2c2)', title: 'Product Lead, Growth', co: 'Globex · Hybrid', match: '91%' },
  { letter: 'I', bg: 'linear-gradient(150deg,#8a6bff,#5b8def)', title: 'Group PM, Platform', co: 'Initech · On-site', match: '87%' },
]
// phase: 0 typing · 1 results · 2 pick · 3 slide→apply · 4 fills · 5 chips · 6 submitted
const STEPS = [1800, 2900, 3500, 4500, 5500, 6300]
const Arrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>

export function CareerScene() {
  const [phase, setPhase] = useState(0)
  const typed = useTypewriter(QUERY, { speed: 55, startDelay: 350 })

  useEffect(() => {
    const timers = STEPS.map((t, k) => setTimeout(() => setPhase(k + 1), t))
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="stage cr-stage">
      {/* Scene 1 — find */}
      <motion.div className="cr-scene cr-find" initial={{ x: '0%' }} animate={{ x: phase >= 3 ? '-100%' : '0%', opacity: phase >= 3 ? 0 : 1 }} transition={{ duration: 0.42, ease: EASE }}>
        <div className="cr-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
          <span className="cr-query">{typed}</span><span className="cr-caret" />
        </div>
        <div className="cr-results">
          {RESULTS.map((r, i) => (
            <motion.div key={r.letter} className={cn('cr-result', i === 0 && phase >= 2 && 'is-pick')}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: phase < 1 ? 0 : phase >= 2 && i !== 0 ? 0.4 : 1, y: phase >= 1 ? 0 : 8 }}
              transition={{ duration: 0.34, delay: phase === 1 ? i * 0.12 : 0, ease: EASE }}>
              <span className="cr-rlogo" style={{ background: r.bg }}>{r.letter}</span>
              <span className="cr-rmeta"><b>{r.title}</b><i>{r.co}</i></span>
              <span className="cr-rmatch">{r.match}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scene 2 — apply */}
      <motion.div className="cr-scene cr-apply" initial={{ x: '100%', opacity: 0 }} animate={{ x: phase >= 3 ? '0%' : '100%', opacity: phase >= 3 ? 1 : 0 }} transition={{ duration: 0.42, ease: EASE }}>
        <div className="cr-job">
          <div className="cr-logo">A</div>
          <div><div className="t">Senior Product Manager</div><div className="s">Acme · Remote</div></div>
        </div>
        <div className="cr-form">
          {['Name', 'Email'].map((l, i) => (
            <div className="cr-row" key={l}>
              <span className="cr-lbl">{l}</span>
              <span className="cr-track"><motion.span className="cr-fill" initial={{ scaleX: 0 }} animate={{ scaleX: phase >= 4 ? 1 : 0 }} transition={{ duration: 0.34, delay: phase >= 4 ? i * 0.2 : 0, ease: EASE }} /></span>
            </div>
          ))}
        </div>
        <div className="cr-attach">
          {['CV.pdf', 'Cover letter'].map((c, i) => (
            <motion.span className="cr-chip" key={c} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: phase >= 5 ? 1 : 0, scale: phase >= 5 ? 1 : 0.7 }} transition={{ duration: 0.3, delay: phase >= 5 ? i * 0.18 : 0, ease: 'backOut' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.4 11.05 12.25 20.2a5 5 0 0 1-7.07-7.07l9.19-9.19a3 3 0 0 1 4.24 4.24l-9.2 9.19a1 1 0 0 1-1.41-1.41l8.48-8.49" /></svg>{c}<span className="cr-chk">✓</span>
            </motion.span>
          ))}
        </div>
        <div className="cr-actions">
          <motion.button className="cr-submit" tabIndex={-1} animate={{ opacity: phase >= 6 ? 0 : 1 }} transition={{ duration: 0.2 }}>Submit application</motion.button>
          <motion.div className="cr-applied" initial={{ opacity: 0, y: 6 }} animate={{ opacity: phase >= 6 ? 1 : 0, y: phase >= 6 ? 0 : 6 }} transition={{ duration: 0.32, ease: 'backOut' }}>
            Applied ✓ <span style={{ opacity: .8 }}>· <span className="cr-count">{phase >= 6 ? 24 : 23}</span> today</span>
          </motion.div>
          <motion.span className="cr-ripple" initial={{ scale: 0, opacity: 0 }} animate={phase >= 6 ? { scale: 1, opacity: [0.55, 0] } : { scale: 0, opacity: 0 }} transition={{ duration: 0.5 }} />
        </div>
      </motion.div>
    </div>
  )
}

export const careerMeta = { key: 'career', icon: '💼', label: 'Career', title: 'Auto apply to jobs with an agent that does the clicking', SeeArrow: Arrow }
