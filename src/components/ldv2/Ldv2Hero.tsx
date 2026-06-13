'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Ldv2WidgetIntro } from '@/components/ldv2/Ldv2WidgetIntro'

const EASE = [0.22, 0.61, 0.36, 1] as const
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: EASE },
})

// Ambient 3-layer parallax backdrop — orbs drift slower than the page (depth).
export function Ldv2Backdrop() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, (v) => v * -0.1)
  const y2 = useTransform(scrollY, (v) => v * -0.16)
  const y3 = useTransform(scrollY, (v) => v * -0.06)
  return (
    <div className="ldv2-backdrop" aria-hidden="true">
      <motion.div className="ldv2-orb ldv2-orb-iris" style={reduce ? { left: '-12%', top: '4%' } : { y: y1, left: '-12%', top: '4%' }} />
      <motion.div className="ldv2-orb ldv2-orb-cyan" style={reduce ? { right: '-14%', top: '34%' } : { y: y2, right: '-14%', top: '34%' }} />
      <motion.div className="ldv2-orb ldv2-orb-blue" style={reduce ? { left: '32%', top: '78%' } : { y: y3, left: '32%', top: '78%' }} />
    </div>
  )
}

// Hero: staged copy entrance left · the LIVE widget panel right. Scrolling past the hero
// DOCKS the panel to the corner (framer `layout` FLIPs between the two states) so the
// live demo stays hire-able through the whole scroll story. Desktop only; reduced-motion off.
export function Ldv2Hero() {
  const reduce = useReducedMotion()
  const slotRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [docked, setDocked] = useState(false)
  const [engaged, setEngaged] = useState(false) // first click inside the widget — the invitation's job is done

  useEffect(() => {
    if (reduce) return
    const onScroll = () => {
      const slot = slotRef.current
      if (!slot || window.innerWidth < 980) { setDocked(false); return }
      const bottom = slot.offsetTop + slot.offsetHeight
      setDocked(window.scrollY > bottom - 120)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [reduce])

  // Retire the "Live, try it now" badge once the user engages: from there the widget's own
  // presence dot (the worker status) is THE live signal — two pulsing dots is one too many.
  useEffect(() => {
    const iframe = frameRef.current
    if (!iframe) return
    const attach = () => { try { iframe.contentDocument?.addEventListener('pointerdown', () => setEngaged(true), { once: true }) } catch {} }
    iframe.addEventListener('load', attach)
    attach()
    return () => iframe.removeEventListener('load', attach)
  }, [])

  return (
    <header className="ldv2-hero" id="hire">
      <div className="ldv2-wrap ldv2-hero-grid">
        <div className="ldv2-hero-copy">
          <motion.span className="ldv2-eyebrow" {...rise(0.05)}>Runs inside BlueStacks</motion.span>
          <motion.h1 className="ldv2-h1" {...rise(0.14)}>Meet <span className="grad">BlueAI.</span></motion.h1>
          <motion.p className="ldv2-lead" {...rise(0.24)}>
            An AI worker that uses your real apps to earn and save money for you, on your PC, in the background.
          </motion.p>
          <motion.div className="ldv2-startcue" {...rise(0.36)}><span className="arr">→</span> It is live. Hire yours, right here.</motion.div>
          <motion.div className="ldv2-trust" {...rise(0.46)}>
            <span className="ldv2-stars">★★★★★</span>
            <span className="ldv2-ti">7.6M run apps on BlueStacks</span>
            <span className="ldv2-tdot" />
            <span className="ldv2-ti">4 workers live today</span>
          </motion.div>
        </div>

        <div className="ldv2-panelslot" ref={slotRef}>
          <motion.div
            className={`ldv2-panel${docked ? ' is-docked' : ''}`}
            layout
            layoutDependency={docked}
            transition={{ layout: { duration: 0.45, ease: EASE } }}
            initial={{ opacity: 0, y: 26, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
          >
            <div className="ldv2-glow" />
            <div className={`ldv2-tryflag${engaged ? ' is-done' : ''}`}><span className="pd" /> Live, try it now</div>
            {docked && (
              <button type="button" className="ldv2-restore" aria-label="Back to the demo" onClick={() => slotRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
              </button>
            )}
            <div className="ldv2-frame">
              <iframe ref={frameRef} src="/live-demo-v2/widget.html?embed=1" title="Hire your AI worker" loading="lazy" />
              <Ldv2WidgetIntro />
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  )
}
