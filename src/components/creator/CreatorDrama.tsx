'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Arrow } from '@/components/Arrow'
import { useStudio } from './CreatorStudio'

// Micro-drama spotlight — BlueAI's differentiator. Two-column: value-prop + bullets + CTA on the
// left, two hover-play drama tiles on the right. Character-driven episodic stories, the format most
// AI video tools can't do.
const EASE = [0.22, 0.61, 0.36, 1] as const
const FEATURED = [
  { video: 'kai-bride', t: 'He Thought He Bought His Bride', meta: 'Kai · Episode 1 · 1:02', tint: 'linear-gradient(160deg,#2a1d4d,#7b4cff)' },
  { video: 'ceo-married-rival', t: 'The CEO Who Married His Rival', meta: 'Episode 1 · 1:00', tint: 'linear-gradient(160deg,#1b1e38,#3a2d6b)' },
] as const
const POINTS = [
  'Consistent cast, look and voice — shot to shot',
  'Scripted scene by scene, posted as a series',
  'Cel-shaded or cinematic — your call',
]

function DramaTile({ d, i }: { d: (typeof FEATURED)[number]; i: number }) {
  const vid = useRef<HTMLVideoElement>(null)
  return (
    <motion.article
      className="cr-drama-tile"
      onMouseEnter={() => vid.current?.play().catch(() => {})}
      onMouseLeave={() => { const v = vid.current; if (v) { v.pause(); v.currentTime = 0 } }}
      initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
      style={{ background: d.tint }}
    >
      <video ref={vid} className="cr-drama-media" src={`/videos/${d.video}.mp4`} poster={`/videos/${d.video}.jpg`} muted loop playsInline preload="none" aria-hidden="true" />
      <span className="cr-drama-badge">Micro-drama</span>
      <span className="cr-card-play" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
      </span>
      <div className="cr-drama-foot">
        <b>{d.t}</b>
        <span>{d.meta}</span>
      </div>
    </motion.article>
  )
}

export function CreatorDrama() {
  const { setPrompt } = useStudio()
  const makeOne = () => {
    setPrompt('A 3-part cel-shaded micro-drama about a betrayal')
    document.querySelector('.cr-hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <section className="cr-section cr-drama" id="drama">
      <div className="cr-wrap cr-drama-layout">
        <motion.div
          className="cr-drama-copy"
          initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, ease: EASE }}
        >
          <span className="cr-eyebrow-sm">The hard part</span>
          <h2 className="cr-h2">Micro-dramas, fully generated</h2>
          <p className="cr-secsub">Character-driven, episodic stories — the format most AI video tools can&rsquo;t touch. BlueAI keeps the cast, look and voice consistent shot to shot.</p>
          <ul className="cr-drama-points">
            {POINTS.map((p) => (
              <li key={p}>
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
                {p}
              </li>
            ))}
          </ul>
          <button type="button" className="cr-drama-cta" onClick={makeOne}>Make a micro-drama <Arrow size={16} /></button>
        </motion.div>

        <div className="cr-drama-tiles">
          {FEATURED.map((d, i) => <DramaTile d={d} i={i} key={d.video} />)}
        </div>
      </div>
    </section>
  )
}
