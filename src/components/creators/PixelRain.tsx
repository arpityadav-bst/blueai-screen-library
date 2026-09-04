'use client'

import { useEffect, useRef } from 'react'

// The hero's ambient pixel rain — a COPY of creator-brand's PixelRain.tsx (Appy, 2026-08-20: "on
// the hero bg we have some blinking dots which remain at one position and keep fading in and out,
// instead of that we should do what we had on creator brand website hero area, the pixel rain").
// Copied, not imported: /creator-brand is frozen and must not be reached into.
//
// WHAT IT REPLACES: six hard-coded <span class="star"> at fixed percentages, each running the same
// 3.4s opacity keyframe forever. Six lights blinking in place is a decoration; a field of pixels
// arriving and leaving at random coordinates is weather. The difference is that nothing here has a
// position you can learn, which is what made the old version read as six dots rather than as sky.
//
// Itself a port of blueai-desktop's boot.js (bgSparks / spawnBgSpark / drawBgSparks) — same grid,
// same sin(t*PI) envelope so each pixel fades in, peaks and fades out, same two brand colours.
//
// FINER THAN THE SOURCE (Appy, 2026-08-20: "can the pixel rain here be more smaller in size, like
// each pixel is more smaller"). GRID 6 -> 4 makes each mark 2px instead of 4px, which is a quarter
// of the area — so the count and the cadence rise with it, or the same field reads as a handful of
// specks instead of rain. The peak alpha lifts a little for the same reason: a smaller mark carries
// less colour, so the identical alpha reads dimmer.
const GRID = 4
const COLORS = ['110,168,255', '123,76,255'] // blue, iris (byte-identical to --iris's rgb)
const SPAWN_MS = 34
const MAX_SPARKS = 110

type Spark = { x: number; y: number; born: number; life: number; peak: number; col: string }

export default function PixelRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // REDUCED MOTION: a continuously twinkling field is exactly what this preference asks not to
    // see. Nothing is drawn at all, so the hero simply has a plain sky.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    let W = 0
    let H = 0
    const sparks: Spark[] = []
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

    // Read once per spawn rather than cached at mount: the theme switch is a body class that can
    // flip while the canvas is already running, and a cached value would leave the rain on the old
    // theme's alpha until a reload. One classList check per spawned pixel is free.
    const isLight = () => document.body.classList.contains('crx-light')

    function spawn(now: number) {
      const light = isLight()
      sparks.push({
        x: Math.round((Math.random() * W) / GRID) * GRID,
        y: Math.round((Math.random() * H) / GRID) * GRID,
        born: now,
        life: 1100 + Math.random() * 1700,
        // PER THEME (2026-09-02). 0.14-0.40 are blueai-desktop's originals, tuned on #0b0e19, and
        // they are right for the dark sky: boosted, ambient weather becomes a starfield competing
        // with the headline. On light they are nearly invisible - a bright pixel at low alpha on
        // #F9F9FA is nothing - so light takes the agency page's own 0.30-0.60, which exists for
        // exactly this reason and is documented there as light-canvas compensation.
        peak: light ? 0.3 + Math.random() * 0.3 : 0.14 + Math.random() * 0.26,
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

    // PAUSE WHEN OFFSCREEN — the loop re-queues forever, so a hero scrolled two screens away would
    // otherwise keep clearing and recompositing a full-height canvas 60x a second for the rest of
    // the session.
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!raf) raf = requestAnimationFrame(step)
        } else if (raf) {
          cancelAnimationFrame(raf)
          raf = 0
        }
      },
      { rootMargin: '96px' },
    )
    io.observe(canvas)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      ro?.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="crx-rain" />
}
