'use client'
import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'

// Seamless horizontal auto-scroll (GSAP). Renders the children twice and slides the track by 50%
// on an infinite linear loop; pauses on hover; honors prefers-reduced-motion (stays static, the
// row just becomes horizontally scrollable). Re-measures on resize via ResizeObserver.
export function Marquee({ children, speed = 40, reverse = false }: { children: ReactNode; speed?: number; reverse?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let tween: gsap.core.Tween | null = null
    const build = () => {
      tween?.kill()
      const w = track.scrollWidth / 2 // width of one set
      if (w < 10) return
      const dur = w / speed
      gsap.set(track, { xPercent: reverse ? -50 : 0 })
      tween = gsap.to(track, { xPercent: reverse ? 0 : -50, duration: dur, ease: 'none', repeat: -1 })
    }
    build()
    const enter = () => tween?.pause()
    const leave = () => tween?.resume()
    track.addEventListener('mouseenter', enter)
    track.addEventListener('mouseleave', leave)
    const ro = new ResizeObserver(build)
    ro.observe(track)
    return () => {
      tween?.kill()
      track.removeEventListener('mouseenter', enter)
      track.removeEventListener('mouseleave', leave)
      ro.disconnect()
    }
  }, [speed, reverse])
  return (
    <div className="cr-marquee">
      <div className="cr-marquee-track" ref={trackRef}>
        <div className="cr-marquee-set">{children}</div>
        <div className="cr-marquee-set" aria-hidden="true">{children}</div>
      </div>
    </div>
  )
}
