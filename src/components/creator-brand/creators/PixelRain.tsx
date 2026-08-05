'use client'

import { useEffect, useRef } from 'react'

// Direct port of blueai-desktop's ambient background twinkle (boot.js: bgSparks /
// spawnBgSpark / drawBgSparks) — same grid size, same fade envelope (sin(t*PI) so each
// pixel fades in, peaks, fades out), same two brand colors. Only the spawn cap is scaled
// up since this canvas covers a full hero section instead of a compact onboarding panel.
const GRID = 6
const COLORS = ['110,168,255', '123,76,255'] // blue, iris (byte-identical to --bai-iris-rgb)
const SPAWN_MS = 45
const MAX_SPARKS = 70

type Spark = { x: number; y: number; born: number; life: number; peak: number; col: string }

export default function PixelRain({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    let W = 0
    let H = 0
    let sparks: Spark[] = []
    let lastSpawn = 0
    let raf = 0

    function resize() {
      const host = canvas!.parentElement
      W = Math.max(1, host ? host.clientWidth : window.innerWidth)
      H = Math.max(1, host ? host.clientHeight : window.innerHeight)
      canvas!.style.width = `${W}px`
      canvas!.style.height = `${H}px`
      canvas!.width = Math.round(W * dpr)
      canvas!.height = Math.round(H * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function spawn(now: number) {
      sparks.push({
        x: Math.round((Math.random() * W) / GRID) * GRID,
        y: Math.round((Math.random() * H) / GRID) * GRID,
        born: now,
        life: 1100 + Math.random() * 1700,
        // Original peak (0.12-0.34) was tuned against blueai-desktop's dark background
        // (#0b0e19) — bright colors at low opacity still read clearly there. Our page is
        // light (#F9F9FA), so the same low opacity is nearly invisible; boosted to compensate.
        peak: 0.3 + Math.random() * 0.3,
        col: Math.random() < 0.5 ? COLORS[0] : COLORS[1],
      })
    }

    function step(now: number) {
      ctx!.clearRect(0, 0, W, H)
      if (now - lastSpawn > SPAWN_MS && sparks.length < MAX_SPARKS) {
        lastSpawn = now
        spawn(now)
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        const t = (now - s.born) / s.life
        if (t >= 1) {
          sparks.splice(i, 1)
          continue
        }
        ctx!.globalAlpha = Math.sin(t * Math.PI) * s.peak // fade in -> peak -> fade out
        ctx!.fillStyle = `rgb(${s.col})`
        ctx!.fillRect(s.x, s.y, GRID - 2, GRID - 2)
      }
      ctx!.globalAlpha = 1
      raf = requestAnimationFrame(step)
    }

    resize()
    raf = requestAnimationFrame(step)
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    ro?.observe(canvas.parentElement ?? canvas)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      ro?.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`} />
}
