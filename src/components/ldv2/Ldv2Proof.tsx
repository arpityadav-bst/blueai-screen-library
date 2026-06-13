'use client'
import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { LDV2_STATS, LDV2_STEPS } from '@/lib/ldv2-data'

const EASE = [0.22, 0.61, 0.36, 1] as const

// One stat number — counts up once when it scrolls into view.
function Count({ n, decimals, suffix }: { n: number; decimals: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const [v, setV] = useState(reduce ? n : 0)
  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(0, n, { duration: 1.3, ease: 'easeOut', onUpdate: (x) => setV(x) })
    return () => c.stop()
  }, [inView, n, reduce])
  return <span ref={ref}>{v.toFixed(decimals)}{suffix}</span>
}

export function Ldv2Stats() {
  return (
    <section className="ldv2-stats">
      <div className="ldv2-stats-grid">
        {LDV2_STATS.map((s) => (
          <div className="ldv2-stat" key={s.label}>
            <div className="n"><Count n={s.n} decimals={s.decimals} suffix={s.suffix} /></div>
            <div className="l">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// How it works — a gradient progress line DRAWS across the 4 steps as the section scrolls
// through the viewport (the hire → paid journey, literally drawn). Steps light in as it passes.
export function Ldv2How() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 78%', 'end 55%'] })
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])
  const reduce = useReducedMotion()
  return (
    <section className="ldv2-section" id="how">
      <div className="ldv2-wrap">
        <div className="ldv2-secthead">
          <span className="ldv2-eyebrow">How it works</span>
          <h2 className="ldv2-h2">From hire to paid in four steps.</h2>
          <p className="ldv2-sub">No prompts to engineer. You hire a worker and it figures out the rest with you.</p>
        </div>
        <div className="ldv2-how" ref={ref}>
          <div className="ldv2-howline" aria-hidden="true">
            <motion.span className="ldv2-howfill" style={{ scaleX: reduce ? 1 : scaleX }} />
          </div>
          <div className="ldv2-steps">
            {LDV2_STEPS.map((s, i) => (
              <motion.div
                className="ldv2-step"
                key={s.t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
              >
                <div className="num">{i + 1}</div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
