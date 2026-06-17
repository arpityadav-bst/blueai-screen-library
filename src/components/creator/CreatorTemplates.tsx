'use client'
import { motion } from 'framer-motion'
import { Arrow } from '@/components/Arrow'
import { useStudio } from './CreatorStudio'
import { TEMPLATES } from '@/lib/creator-data'

// "Start from a template" — a tidy icon-tile grid. Clicking a preset drops its starter prompt into
// the hero and scrolls up to it, ready to Generate. Tiles stagger in on scroll.
const EASE = [0.22, 0.61, 0.36, 1] as const

export function CreatorTemplates() {
  const { setPrompt } = useStudio()
  const useTemplate = (prompt: string) => {
    setPrompt(prompt)
    document.querySelector('.cr-hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <section className="cr-section cr-templates" id="templates">
      <motion.div
        className="cr-wrap cr-sechead"
        initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, ease: EASE }}
      >
        <span className="cr-eyebrow-sm">Start in one click</span>
        <h2 className="cr-h2">Templates for every format</h2>
        <p className="cr-secsub">Pick a preset and BlueAI handles the rest — pacing, shot list, voice and captions are tuned to the format.</p>
      </motion.div>

      <div className="cr-wrap cr-tpl-grid">
        {TEMPLATES.map((t, i) => (
          <motion.button
            type="button" className="cr-tpl" key={t.name} onClick={() => useTemplate(t.prompt)}
            initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.06, ease: EASE }}
          >
            <span className="cr-tpl-icon" aria-hidden="true">{t.icon}</span>
            <span className="cr-tpl-body">
              <b>{t.name}</b>
              <span className="cr-tpl-tag">{t.tag}</span>
            </span>
            <span className="cr-tpl-go" aria-hidden="true"><Arrow size={15} /></span>
          </motion.button>
        ))}
      </div>
    </section>
  )
}
