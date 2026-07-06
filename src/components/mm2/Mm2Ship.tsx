'use client'
import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react'

// The Worker Unit — an abstract geometric capsule (NOT a literal rocket; original
// shapes only, no scraped/branded imagery). At rest it idles: a gentle hover-bob +
// wobble (CSS, on .mm2-ship) and a breathing glow behind it, so the hero has presence
// before anyone scrolls. On scroll, MmHero's GSAP tween calls setBoost(0..1), which
// (a) intensifies the flame-particle sim below and (b) writes a --boost CSS var onto
// the glow layer — all without a React re-render (mirrors the MmEngine energy pattern).
// The GSAP-driven ASCENT itself lives one level up, on .mm2-ship-wrap — kept on a
// separate element from the idle CSS animation so the two transforms never fight.

export type Mm2ShipHandle = { setBoost: (v: number) => void }

type Particle = { x: number; y: number; vx: number; vy: number; life: number; age: number; size: number }

const Mm2Ship = forwardRef<Mm2ShipHandle>(function Mm2Ship(_props, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const boostRef = useRef(0.15)

  useImperativeHandle(ref, () => ({
    setBoost: (v: number) => {
      boostRef.current = Math.max(0, Math.min(1, v))
      glowRef.current?.style.setProperty('--boost', String(boostRef.current))
    },
  }), [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const W = 96, H = 190   // taller than the ship — room for the flame to stretch at high boost
    canvas.width = W * dpr; canvas.height = H * dpr
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    let particles: Particle[] = []
    const spawn = () => {
      const boost = boostRef.current
      const n = reduced ? 0 : Math.round(1 + boost * 5)
      for (let i = 0; i < n; i++) {
        particles.push({
          x: W / 2 + (Math.random() - 0.5) * (6 + boost * 10), y: 6,
          vx: (Math.random() - 0.5) * (0.3 + boost * 0.6), vy: 1.2 + Math.random() * 1.6 + boost * 3.6,
          life: 24 + Math.random() * 18, age: 0, size: 2 + Math.random() * 2.4 + boost * 3.2,
        })
      }
    }
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      spawn()
      particles = particles.filter((p) => p.age < p.life)
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.age++
        const t = p.age / p.life
        const a = (1 - t) * 0.88
        ctx.globalAlpha = a
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        grad.addColorStop(0, t < 0.35 ? '#fff7e0' : '#ffd27a')
        grad.addColorStop(0.6, '#ff8a4d')
        grad.addColorStop(1, 'rgba(255,90,40,0)')
        ctx.fillStyle = grad
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (1 + t * 0.6), 0, 6.283); ctx.fill()
      }
      ctx.globalAlpha = 1
    }
    let raf = 0
    if (reduced) { draw() } else {
      const loop = () => { draw(); raf = requestAnimationFrame(loop) }
      raf = requestAnimationFrame(loop)
    }
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="mm2-ship">
      <div className="mm2-ship-glow" ref={glowRef} aria-hidden="true" />
      <svg className="mm2-ship-svg" viewBox="0 0 90 150" width="90" height="150" aria-hidden="true">
        <defs>
          <linearGradient id="mm2Hull" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c7d4e0" />
            <stop offset="45%" stopColor="#f3f6fa" />
            <stop offset="100%" stopColor="#9fb0c2" />
          </linearGradient>
        </defs>
        {/* capsule body */}
        <path d="M45 4 C64 4 72 30 72 62 L72 118 C72 128 60 134 45 134 C30 134 18 128 18 118 L18 62 C18 30 26 4 45 4 Z" fill="url(#mm2Hull)" stroke="rgba(238,242,245,.5)" strokeWidth="1" />
        {/* window */}
        <circle cx="45" cy="52" r="12.5" fill="#0a1420" stroke="#eef2f5" strokeWidth="2.5" />
        <circle cx="41" cy="48" r="4" fill="#6fb3ff" className="mm2-ship-glint" />
        {/* fins */}
        <path d="M18 92 L2 128 L18 118 Z" fill="#8b9bad" />
        <path d="M72 92 L88 128 L72 118 Z" fill="#8b9bad" />
        {/* base ring */}
        <rect x="20" y="128" width="50" height="8" rx="3" fill="#5c6b7c" />
      </svg>
      <canvas ref={canvasRef} className="mm2-flame-canvas" aria-hidden="true" />
    </div>
  )
})

export default Mm2Ship
