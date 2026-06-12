'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { HERO } from '@/lib/seo-data'
import { SeoAgentGrid } from './SeoAgentGrid'
import { Sparkle } from '@/components/Sparkle'

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="18" height="18"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)
const Play = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="15" height="15"><path d="M8 5v14l11-7z" /></svg>
)

export function SeoHero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // subtle parallax — cards drift up a touch faster than the text as you scroll past the hero
  const cardsY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -54])
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 26])

  return (
    <section className="seo-hero" id="top" ref={ref}>
      <motion.div className="seo-hero-text" style={{ y: textY }}>
        <span className="seo-eyebrow">{HERO.eyebrow}</span>
        <h1 className="seo-h1">
          {HERO.h1[0]}<span className="seo-grad">{HERO.h1[1]}</span>{HERO.h1[2]}
        </h1>
        <p className="seo-subhead">{HERO.subhead}</p>
        <div className="seo-hero-ctas">
          <a className="seo-cta-primary" href="#download"><Sparkle size={18} />{HERO.primaryCta}<Arrow /></a>
          <a className="seo-cta-secondary" href="#what-is"><Play />{HERO.secondaryCta}</a>
        </div>
        <p className="seo-microcopy">{HERO.microcopy}</p>
      </motion.div>

      <motion.div className="seo-hero-cards" style={{ y: cardsY }}>
        <div className="seo-agents-label"><span className="dot" />{HERO.agentsLabel}</div>
        <SeoAgentGrid />
      </motion.div>
    </section>
  )
}
