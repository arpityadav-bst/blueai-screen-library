'use client'
import { motion } from 'framer-motion'
import { Arrow } from '@/components/Arrow'

// Flagship gradient banner — a punchy brand-gradient band that breaks the rhythm between the
// proof galleries and the rest of the page, and states the one-line promise. The CTA scrolls back
// up to the hero prompt and focuses it, so you can start describing.
const EASE = [0.22, 0.61, 0.36, 1] as const

export function CreatorBanner() {
  const describe = () => {
    document.querySelector('.cr-hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    ;(document.querySelector('.cr-prompt-input') as HTMLTextAreaElement | null)?.focus({ preventScroll: true })
  }
  return (
    <section className="cr-bandsec">
      <motion.div
        className="cr-wrap cr-band"
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="cr-band-glow" aria-hidden="true" />
        <div className="cr-band-img" aria-hidden="true" />
        <div className="cr-band-inner">
          <span className="cr-band-eyebrow">End to end</span>
          <h2 className="cr-band-h">One prompt in. A finished video out.</h2>
          <p className="cr-band-sub">BlueAI scripts it, generates the visuals, voices and captions it, edits the cut — then posts to YouTube, TikTok and Instagram on your schedule. Up to 30 minutes, in any language.</p>
          <button type="button" className="cr-band-cta" onClick={describe}>Describe your video <Arrow size={16} /></button>
        </div>
      </motion.div>
    </section>
  )
}
