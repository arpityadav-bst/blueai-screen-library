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
// IDENTICAL TO THE BOOT INTRO'S FIELD (Appy, 2026-09-07: "the same pixel rain exactly how we have
// it in the intro animation same size and amount"). This REVERSES the 2026-08-20 call that made the
// hero's rain finer than the intro's ("can the pixel rain here be more smaller in size") — the two
// fields now match, because the intro dissolves straight into the hero and a mark that changes size
// across that handover reads as two different weathers.
//
// All four numbers below are useBootIntro's, not new ones:
//   GRID 6      — a 4x4px mark (it draws GRID - 2), where this was 4 and drew 2x2
//   24 / 420x760 and 110ms — boot.js's densities, which the intro re-derives per unit area
//   life and peak — copied verbatim, so the alpha envelope matches too
// THE DENSITY IS PER UNIT AREA, not a fixed count. This used to be a flat 110 sparks every 34ms,
// which is a different rain at every viewport: dense on a laptop, sparse on a wide monitor. The
// intro scales both against a 420x760 base, so the field reads the same everywhere - and "same
// amount" as the intro is only true if it scales the same way the intro does.
const GRID = 6
// ONE COLOUR since 2026-09-08. It was blue + iris, the two ends of the old brand gradient; the
// accent is the whole palette now, and a second hue in the rain would be the only place on the
// page still saying there are two.
const COLORS = ['47,109,255']
const BASE_AREA = 420 * 760
const BASE_CAP = 24
const BASE_SPAWN_MS = 110

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
    // Recomputed in resize(), exactly as the intro does it — same sparks per unit area, floored at
    // boot.js's originals so a small viewport never drops below the density it was tuned at.
    let cap = BASE_CAP
    let spawnEvery = BASE_SPAWN_MS

    function resize() {
      const host = canvas!.parentElement
      W = Math.max(1, host ? host.clientWidth : window.innerWidth)
      H = Math.max(1, host ? host.clientHeight : window.innerHeight)
      canvas!.style.width = `${W}px`
      canvas!.style.height = `${H}px`
      canvas!.width = Math.round(W * dpr)
      canvas!.height = Math.round(H * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      // AREA IS THIS CANVAS'S, not the viewport's: the hero rain sizes to <main> while the intro
      // covers the whole screen. Same sparks per unit area is what makes the two fields match, so
      // the ratio has to be taken against whatever each one actually covers.
      const areaRatio = (W * H) / BASE_AREA
      cap = Math.max(BASE_CAP, Math.round(BASE_CAP * areaRatio))
      spawnEvery = Math.max(24, Math.round(BASE_SPAWN_MS / Math.max(1, areaRatio)))
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
        // THE INTRO'S ENVELOPE, verbatim (2026-09-07). These were 0.30-0.60 light / 0.14-0.40 dark,
        // lifted on 2026-09-02 to compensate for the finer 2px mark this file used to draw. With the
        // mark back at the intro's 4px there is nothing left to compensate for, and matching the
        // intro's alphas is what makes the handover from intro to hero invisible.
        peak: light ? 0.28 + Math.random() * 0.28 : 0.12 + Math.random() * 0.22,
        col: Math.random() < 0.5 ? COLORS[0] : COLORS[1],
      })
    }

    function step(now: number) {
      ctx!.clearRect(0, 0, W, H)
      if (now - lastSpawn > spawnEvery && sparks.length < cap) {
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
