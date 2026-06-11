'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { useTypewriter } from '../useTypewriter'

// CREATOR agent — Scene 1: type a topic → lock style/platforms/length → Create.
// Scene 2: slide to render → spinner + build steps tick + captions paint + play →
// "link emailed, posts on schedule". Rebuilt from buildCreatorRich.
const EASE = [0.22, 0.61, 0.36, 1] as const
const TOPIC = 'Daily stoic philosophy — calm, cinematic shorts'
const SETTINGS = [['Style', 'Cinematic'], ['Platforms', 'YT · TikTok'], ['Length', '0:45']]
const STEPS_TXT = ['Writes the script', 'Generates visuals + voiceover', 'Captions & edits to template']
// phase: 0 typing · 1 settings · 2 create · 3 slide→render · 4 building · 5 ready · 6 delivered
const STEPS = [2600, 3800, 4400, 5100, 6700, 7300]
const Tick = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
const Arrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>

export function CreatorScene() {
  const [phase, setPhase] = useState(0)
  const typed = useTypewriter(TOPIC, { speed: 44, startDelay: 350 })

  useEffect(() => {
    const timers = STEPS.map((t, k) => setTimeout(() => setPhase(k + 1), t))
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="stage cv-stage">
      {/* Scene 1 — brief */}
      <motion.div className="cv-scene cv-brief" initial={{ x: '0%' }} animate={{ x: phase >= 3 ? '-100%' : '0%', opacity: phase >= 3 ? 0 : 1 }} transition={{ duration: 0.42, ease: EASE }}>
        <div className="cv-topic">
          <span className="cv-prompt-lbl">Describe your video</span>
          <div className="cv-script-box"><span className="cv-typed">{typed}</span><span className="cv-caret" /></div>
        </div>
        <div className="cv-settings">
          {SETTINGS.map(([k, v], i) => (
            <motion.div className={cn('cv-set', phase >= 1 && 'is-set')} key={k} animate={phase >= 1 ? { scale: [1, 1.05, 1] } : { scale: 1 }} transition={{ duration: 0.32, delay: phase === 1 ? i * 0.26 : 0 }}>
              <span className="cv-set-k">{k}</span><span className="cv-set-v">{v}</span>
            </motion.div>
          ))}
        </div>
        <div className="cv-gen-actions">
          <motion.button className="cv-generate" tabIndex={-1} animate={phase >= 2 ? { scale: [1, 1.05, 1] } : { scale: 1 }} transition={{ duration: 0.3 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /></svg>Create video
          </motion.button>
        </div>
      </motion.div>

      {/* Scene 2 — render */}
      <motion.div className="cv-scene cv-render" initial={{ x: '100%', opacity: 0 }} animate={{ x: phase >= 3 ? '0%' : '100%', opacity: phase >= 3 ? 1 : 0 }} transition={{ duration: 0.42, ease: EASE }}>
        <div className="cv-render-top">
          {phase < 5 && <motion.span className="cv-spin" animate={{ rotate: 360 }} transition={{ duration: 0.95, ease: 'linear', repeat: Infinity }} />}
          <span className="cv-render-lbl">{phase >= 5 ? 'Video ready' : 'Creating your video…'}</span>
        </div>
        <div className="cv-make">
          <div className="cv-preview">
            <motion.span className="cv-cap c2" initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: phase >= 4 ? 1 : 0, opacity: phase >= 4 ? 1 : 0 }} transition={{ duration: 0.3, ease: EASE }} />
            <motion.span className="cv-cap" initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: phase >= 4 ? 1 : 0, opacity: phase >= 4 ? 1 : 0 }} transition={{ duration: 0.3, delay: phase >= 4 ? 0.16 : 0, ease: EASE }} />
            <motion.span className="cv-play" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: phase >= 5 ? 1 : 0, scale: phase >= 5 ? 1 : 0 }} transition={{ duration: 0.4, ease: 'backOut' }}>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            </motion.span>
          </div>
          <div className="cv-steps">
            {STEPS_TXT.map((s, i) => (
              <motion.div className={cn('cv-step', phase >= 4 && 'is-done')} key={s} initial={{ x: -4, opacity: 0.5 }} animate={{ x: 0, opacity: phase >= 4 ? 1 : 0.5 }} transition={{ duration: 0.25, delay: phase >= 4 ? i * 0.45 : 0, ease: EASE }}>
                <span className="tick"><Tick /></span>{s}
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div className="cv-deliver-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: phase >= 6 ? 1 : 0, y: phase >= 6 ? 0 : 10 }} transition={{ duration: 0.42, ease: 'backOut' }}>
          <span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg></span>
          <span><b>Link emailed to review</b><i>Then posts to YouTube · TikTok on your schedule</i></span>
        </motion.div>
      </motion.div>
    </div>
  )
}

export const creatorMeta = { key: 'creator', icon: '🎬', label: 'Creator', title: 'A faceless video creator agent for YouTube', SeeArrow: Arrow }
