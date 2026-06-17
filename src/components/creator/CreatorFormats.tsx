'use client'
import { motion } from 'framer-motion'
import { Marquee } from './Marquee'
import { CreatorCard } from './CreatorCard'
import { SHORTS, LONGFORM } from '@/lib/creator-data'

const EASE = [0.22, 0.61, 0.36, 1] as const
const reveal = { initial: { opacity: 0, y: 22 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' } as const, transition: { duration: 0.6, ease: EASE } }

// Format galleries — two auto-scrolling rows: Shorts (9:16) drifting left, Long-form (16:9) right.
export function CreatorFormats() {
  return (
    <section className="cr-section cr-formats">
      <motion.div className="cr-wrap cr-sechead" {...reveal}>
        <span className="cr-eyebrow-sm">Made with the Video Creator</span>
        <h2 className="cr-h2">Shorts, long-form, and everything between</h2>
        <p className="cr-secsub">Real formats BlueAI produces end to end — scripted, generated, voiced, captioned and cut. No camera, no timeline.</p>
      </motion.div>
      <div className="cr-marquee-rows">
        <Marquee speed={42}>
          {SHORTS.map((c) => <CreatorCard key={c.title} card={c} ratio="9/16" />)}
        </Marquee>
        <Marquee speed={34} reverse>
          {LONGFORM.map((c) => <CreatorCard key={c.title} card={c} ratio="16/9" />)}
        </Marquee>
      </div>
    </section>
  )
}
