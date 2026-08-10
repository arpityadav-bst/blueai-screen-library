'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

// The room the whole page sits in — one fixed layer behind every section.
//
// Ported from the /seo route's SeoBackdrop (src/components/seo/SeoBackdrop.tsx), which is
// the treatment the designer pointed at. Two deliberate differences:
//   1. The star is the LOGO'S OWN inner 4-point star, lifted verbatim from
//      public/logo-mark.svg (viewBox 32, not 24) rather than the lucide Sparkle glyph —
//      /seo does the same thing, and it's why the effect reads as "a sparkle from the logo."
//   2. Alpha is tuned UP from /seo's .038. That value was set against #eef1fb;
//      /creator-brand's canvas is #F9F9FA, so the same fill vanishes here.
//
// It is `fixed`, so it never scrolls — the motion inside it is scroll-LINKED instead,
// off whole-document progress. Nothing here is pinned or scroll-jacked.

const LOGO_STAR =
  'M16 6C16 11.5228 20.4772 16 26 16C20.4772 16 16 20.4772 16 26C16 20.4772 11.5228 16 6 16C11.5228 16 16 11.5228 16 6Z'

export default function Backdrop() {
  const reduce = useReducedMotion()
  const { scrollYProgress: p, scrollY } = useScroll()

  // THE HERO IS OFF LIMITS. Both heroes are signed off, and this layer is mounted in the
  // route layout, so without a gate it renders behind them too and quietly changes
  // finished work. It stays at opacity 0 for the whole hero and only fades in as the hero
  // leaves — measured off #hero rather than a guessed scroll distance, because the two
  // heroes aren't the same height and neither is a phone.
  const [heroEnd, setHeroEnd] = useState(0)
  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return
    const measure = () => setHeroEnd(hero.offsetTop + hero.offsetHeight)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const gate = useTransform(
    scrollY,
    heroEnd ? [heroEnd * 0.6, heroEnd * 0.98] : [0, 1],
    heroEnd ? [0, 1] : [0, 0],
  )

  // Under reduced-motion every range collapses to its first value — the layer still
  // renders (it's atmosphere, not decoration) but stops moving.
  const v = (arr: string[]) => (reduce ? arr.map(() => arr[0]) : arr)

  const irisX = useTransform(p, [0, 0.33, 0.66, 1], v(['-4vw', '38vw', '10vw', '44vw']))
  const irisY = useTransform(p, [0, 1], v(['-16vh', '48vh']))
  const cyanX = useTransform(p, [0, 0.5, 1], v(['58vw', '20vw', '54vw']))
  const cyanY = useTransform(p, [0, 1], v(['6vh', '-16vh']))
  const blueX = useTransform(p, [0, 0.5, 1], v(['14vw', '46vw', '22vw']))
  const blueY = useTransform(p, [0, 1], v(['64vh', '26vh']))

  const starRotate = useTransform(p, [0, 1], reduce ? [0, 0] : [0, 540])
  const starScale = useTransform(p, [0, 0.5, 1], reduce ? [1, 1, 1] : [0.88, 1.14, 0.94])

  return (
    <motion.div className="cb-backdrop" aria-hidden="true" style={{ opacity: gate }}>
      <motion.div className="cb-orb cb-orb-iris" style={{ x: irisX, y: irisY }} />
      <motion.div className="cb-orb cb-orb-cyan" style={{ x: cyanX, y: cyanY }} />
      <motion.div className="cb-orb cb-orb-blue" style={{ x: blueX, y: blueY }} />
      <motion.svg
        className="cb-star"
        viewBox="0 0 32 32"
        fill="currentColor"
        // x/y do the centering INSIDE the same transform as rotate/scale (paired with
        // left/top:50% in CSS) — same trick as SeoBackdrop, avoids a wrapper element.
        style={{ x: '-50%', y: '-50%', rotate: starRotate, scale: starScale }}
      >
        <path d={LOGO_STAR} />
      </motion.svg>
    </motion.div>
  )
}
