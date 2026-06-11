'use client'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

// Ambient living backdrop for the SEO page: soft iris/cyan/blue gradient orbs + a faint logo
// sparkle that DRIFT and RECOMPOSE as you scroll (each orb wanders a different path, so the
// composition feels different per section) while the sparkle slowly rotates + breathes. Calm,
// on-brand — not a toy. Fixed, behind content, pointer-events:none. Reduced-motion → static.
export function SeoBackdrop() {
  const reduce = useReducedMotion()
  const { scrollYProgress: p } = useScroll()
  // freeze every range to its first stop when the user prefers reduced motion
  const v = (arr: string[]) => (reduce ? arr.map(() => arr[0]) : arr)

  // each orb takes a different multi-stop path across the scroll → recomposes per section
  const o1x = useTransform(p, [0, 0.33, 0.66, 1], v(['0vw', '42vw', '14vw', '48vw']))
  const o1y = useTransform(p, [0, 1], v(['-14vh', '46vh']))
  const o2x = useTransform(p, [0, 0.5, 1], v(['56vw', '22vw', '52vw']))
  const o2y = useTransform(p, [0, 1], v(['8vh', '-14vh']))
  const o3x = useTransform(p, [0, 0.5, 1], v(['16vw', '44vw', '24vw']))
  const o3y = useTransform(p, [0, 1], v(['62vh', '28vh']))
  // sparkle — slow rotation + a gentle scale "breath"
  const rot = useTransform(p, [0, 1], reduce ? [0, 0] : [0, 65])
  const scl = useTransform(p, [0, 0.5, 1], reduce ? [1, 1, 1] : [0.85, 1.12, 0.92])

  return (
    <div className="seo-backdrop" aria-hidden="true">
      <motion.div className="seo-orb seo-orb-iris" style={{ x: o1x, y: o1y }} />
      <motion.div className="seo-orb seo-orb-cyan" style={{ x: o2x, y: o2y }} />
      <motion.div className="seo-orb seo-orb-blue" style={{ x: o3x, y: o3y }} />
      <motion.svg className="seo-spark-bg" viewBox="0 0 24 24" fill="currentColor" style={{ x: '-50%', y: '-50%', rotate: rot, scale: scl }}>
        <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" />
      </motion.svg>
    </div>
  )
}
