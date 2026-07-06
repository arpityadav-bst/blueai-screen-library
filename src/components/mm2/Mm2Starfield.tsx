'use client'
import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react'

// Mission Control backdrop — a dense two-depth starfield over near-black, twinkling at
// rest. On scroll, MmHero calls setBoost(0..1) (same imperative pattern as Mm2Ship, zero
// re-renders): stars gain downward drift and, past a threshold, STREAK into short lines —
// the "accelerating through space" cue that sells the ascent. Deliberately NOT SpaceX's
// own imagery/branding (procedural only, zero IP risk — same practice as the
// Pexels-not-scraping call on creator-v2). Canvas, ResizeObserver-sized, reduced-motion →
// one static frame, disposes on unmount.

export type Mm2StarfieldHandle = { setBoost: (v: number) => void }

type Star = { x: number; y: number; r: number; base: number; ph: number; layer: 0 | 1 }

const Mm2Starfield = forwardRef<Mm2StarfieldHandle>(function Mm2Starfield(_props, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const boostRef = useRef(0)
  useImperativeHandle(ref, () => ({ setBoost: (v: number) => { boostRef.current = Math.max(0, Math.min(1, v)) } }), [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let W = 0, H = 0
    let stars: Star[] = []

    const seed = () => {
      const count = Math.round((W * H) / 5200)
      stars = Array.from({ length: count }, () => {
        const layer = Math.random() < 0.7 ? 0 : 1
        return {
          x: Math.random() * W, y: Math.random() * H,
          r: layer === 0 ? 0.5 + Math.random() * 0.7 : 1.1 + Math.random() * 1.1,
          base: layer === 0 ? 0.25 + Math.random() * 0.35 : 0.45 + Math.random() * 0.4,
          ph: Math.random() * Math.PI * 2, layer,
        }
      })
    }
    const resize = () => {
      const host = canvas.parentElement
      W = Math.max(1, host?.clientWidth || window.innerWidth)
      H = Math.max(1, host?.clientHeight || window.innerHeight)
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr)
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }
    const ro = new ResizeObserver(resize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)
    resize()

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H)
      const boost = reduced ? 0 : boostRef.current
      const streaking = boost > 0.32
      for (const s of stars) {
        const tw = reduced ? 1 : 0.55 + 0.45 * Math.sin(t * 0.0011 + s.ph)
        const speed = (s.layer === 0 ? 6 : 10) * boost * boost   // deeper layer streaks faster — parallax read
        if (!reduced) { s.y += speed; if (s.y - speed > H) { s.y = -4; s.x = Math.random() * W } }
        ctx.globalAlpha = s.base * tw
        ctx.fillStyle = s.layer === 0 ? '#eef2f5' : '#cfe3ff'
        if (streaking) {
          const len = 6 + speed * 2.2
          ctx.strokeStyle = ctx.fillStyle
          ctx.lineWidth = s.r
          ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x, s.y - len); ctx.stroke()
        } else {
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }

    let raf = 0
    if (reduced) { draw(0) } else {
      const loop = (t: number) => { draw(t); raf = requestAnimationFrame(loop) }
      raf = requestAnimationFrame(loop)
    }
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])
  return <canvas ref={canvasRef} className="mm2-stars-canvas" aria-hidden="true" />
})

export default Mm2Starfield
