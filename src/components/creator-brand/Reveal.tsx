'use client'

import { useRef, useEffect, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

type RevealProps = {
  children: ReactNode
  className?: string
  /** stagger children of this wrapper instead of animating the wrapper as one block */
  stagger?: boolean
  staggerSelector?: string
  delay?: number
  y?: number
  as?: 'div' | 'section'
}

/**
 * One reusable scroll-reveal primitive — fade + rise, played once on enter.
 * Deliberately a single well-tuned motion (not scattered per-element micro-fades):
 * every section on this site uses the SAME curve so the page reads as one system.
 */
export default function Reveal({
  children,
  className = '',
  stagger = false,
  staggerSelector = '[data-reveal-item]',
  delay = 0,
  y = 28,
  as = 'div',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      const targets = stagger ? el.querySelectorAll(staggerSelector) : el
      gsap.set(targets, { opacity: 0, y })
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        // Staggered groups use a shorter per-item duration + a wider stagger interval than
        // a lone block reveal, so a 4-up grid reads as a visible cascade (each item mostly
        // settled before the next starts) instead of all items resolving in one clustered blur.
        duration: stagger ? 0.6 : 0.9,
        delay,
        ease: 'power3.out',
        stagger: stagger ? 0.12 : 0,
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          once: true,
        },
      })
    }, el)
    return () => ctx.revert()
  }, [stagger, staggerSelector, delay, y])

  const Tag = as
  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  )
}
