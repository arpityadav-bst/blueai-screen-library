'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { CREATOR } from '@/lib/agents-data'
import { HOW_IT_WORKS } from '@/lib/creator-data'

// How it works + SEO explainer + FAQ — the content from the v1 agent page (CREATOR data), restyled
// in the creator DS so it reads as part of v2. The FAQ answers stay in the DOM (crawlable), revealed
// via a grid-rows 0fr→1fr transition. Sits after the micro-drama spotlight.
const EASE = [0.22, 0.61, 0.36, 1] as const
const reveal = { initial: { opacity: 0, y: 22 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' } as const, transition: { duration: 0.6, ease: EASE } }

export function CreatorInfo() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <>
      <section className="cr-section cr-hiw" id="how-it-works">
        <motion.div className="cr-wrap cr-sechead" {...reveal}>
          <span className="cr-eyebrow-sm">How it works</span>
          <h2 className="cr-h2">{HOW_IT_WORKS.heading}</h2>
        </motion.div>
        <div className="cr-wrap cr-hiw-grid">
          {HOW_IT_WORKS.steps.map((s, i) => (
            <motion.div
              className="cr-hiw-card" key={s.t}
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, delay: (i % 4) * 0.06, ease: EASE }}
            >
              <span className="cr-hiw-n">{i + 1}</span>
              <b className="cr-hiw-t">{s.t}</b>
              <p className="cr-hiw-d">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="cr-section cr-seo" id="learn">
        <motion.div className="cr-wrap cr-sechead" {...reveal}>
          <span className="cr-eyebrow-sm">Good to know</span>
          <h2 className="cr-h2">AI video creation, explained</h2>
        </motion.div>
        <div className="cr-wrap cr-seo-grid">
          {CREATOR.seoBlocks?.map((b) => (
            <div className="cr-seo-block" key={b.h}><h3>{b.h}</h3><p>{b.p}</p></div>
          ))}
        </div>
      </section>

      <section className="cr-section cr-faq" id="faq">
        <motion.div className="cr-wrap cr-sechead" {...reveal}>
          <span className="cr-eyebrow-sm">FAQ</span>
          <h2 className="cr-h2">Frequently asked questions</h2>
        </motion.div>
        <div className="cr-wrap cr-faq-list">
          {CREATOR.faq.map((it, i) => (
            <div className={`cr-faq-item${open === i ? ' is-open' : ''}`} key={it.q}>
              <button type="button" className="cr-faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                {it.q}<span className="cr-faq-pm" aria-hidden="true">{open === i ? '–' : '+'}</span>
              </button>
              <div className="cr-faq-a"><div className="cr-faq-a-inner"><p>{it.a}</p></div></div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
