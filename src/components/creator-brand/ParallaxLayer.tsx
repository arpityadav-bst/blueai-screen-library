'use client'

import { useRef, useEffect, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

type ParallaxLayerProps = {
  children: ReactNode
  className?: string
  /** px of vertical travel across the section's scroll range — negative moves up faster (background feel) */
  speed?: number
}

/**
 * Section-level parallax: this layer drifts at its own rate against the section
 * it sits in, tied to scroll with scrub (not a fixed background trick). Applied to
 * whole compositional groups (a card cluster, a decorative shape field), not single
 * icons — that's what keeps it feeling like depth rather than a gimmick.
 */
export default function ParallaxLayer({ children, className = '', speed = -60 }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const section = el.closest('section') || el.parentElement
    if (!section) return
    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: speed,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      })
    }, el)
    return () => ctx.revert()
  }, [speed])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
