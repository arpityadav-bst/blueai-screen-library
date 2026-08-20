import { useEffect, useRef } from 'react'

// The boot intro, ported 1:1 from the mock (alt-copy.html), which itself ports the pixel logo from
// blueai-desktop's boot.js: disc minus 4-point astroid, cyan->violet by (lx+ly), edge spawns with
// staggered delays, easeOutExpo assembly, diagonal shimmer — same genLogo params (0.45/0.86/0.92).
// Here it plays viewport-big as THE AGENT, introduces itself over two beats, then flies down and
// docks into the laptop screen, and finally tucks into the screen's brand mark as the page reveals.
//
// Beats: void -> assemble -> shimmer -> "This is your AI worker." -> "It exists to make you money."
// -> descend into the PC's screen -> a breath -> tuck into the top-left corner as the brand mark ->
// reveal. Click/wheel/touch/key skips. prefers-reduced-motion skips the whole thing.
//
// STATE LIVES ON .crx AND body.crx-lock, not on body.revealed like the mock — see creators.css's
// header for why. onDone is the task loop's start (useHomeFx), the same handoff the mock made.
// Cleanup (rAF, listeners, timers, the body lock) exists because this component can unmount and
// StrictMode double-mounts in dev; the mock's page never had either problem.
const CELLS = 40
const PH = { dormant: 500, assemble: 1700, shimmer: 150, hold: 250, line1: 1500, line2: 1600, linesOut: 300, descend: 900, screenHold: 350, tuck: 500 }

type Px = { lx: number; ly: number; color: string; sx?: number; sy?: number; delay?: number }

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clampT = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function genLogo(cells: number, ex: number, starFac: number, discFac: number): Px[] {
  const arr: Px[] = []
  const C = (cells - 1) / 2
  const R = C + 0.5
  const circleR = R * discFac
  const starR = R * starFac
  const thr = Math.pow(starR, ex)
  const cyan = [14, 164, 197]
  const violet = [123, 76, 255]
  for (let j = 0; j < cells; j++) {
    for (let i = 0; i < cells; i++) {
      const lx = i - C
      const ly = j - C
      if (Math.sqrt(lx * lx + ly * ly) > circleR) continue
      if (Math.pow(Math.abs(lx), ex) + Math.pow(Math.abs(ly), ex) <= thr) continue
      const t = clampT(((lx + ly) / (2 * circleR)) * 0.5 + 0.5)
      arr.push({
        lx, ly,
        color: 'rgb(' + Math.round(cyan[0] + (violet[0] - cyan[0]) * t) + ',' +
          Math.round(cyan[1] + (violet[1] - cyan[1]) * t) + ',' +
          Math.round(cyan[2] + (violet[2] - cyan[2]) * t) + ')',
      })
    }
  }
  return arr
}

export default function useBootIntro(onDone: () => void) {
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    const root = document.getElementById('crx')
    const coreCv = document.getElementById('core-cv') as HTMLCanvasElement | null
    const backdropEl = document.getElementById('backdrop')
    const lapScreen = document.getElementById('lap-screen')
    const brandIcon = document.querySelector('.crx .scr-brand svg')
    const beat1 = document.getElementById('beat1')
    const beat2 = document.getElementById('beat2')
    if (!root || !coreCv || !backdropEl || !lapScreen || !brandIcon || !beat1 || !beat2) return
    const cctx = coreCv.getContext('2d')
    if (!cctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    let VW = 0
    let VH = 0
    const corePixels = genLogo(CELLS, 0.45, 0.86, 0.92)
    let flickers: { x: number; y: number; ph: number }[] = []
    let introRaf: number | null = null
    let finished = false
    const timers: ReturnType<typeof setTimeout>[] = []

    document.body.classList.add('crx-lock')

    function finish() {
      if (finished) return
      finished = true
      if (introRaf) cancelAnimationFrame(introRaf)
      ;(['click', 'wheel', 'touchstart', 'keydown'] as const).forEach((ev) => window.removeEventListener(ev, finish))
      coreCv!.classList.add('out')
      root!.classList.add('revealed')
      document.body.classList.remove('crx-lock')
      timers.push(setTimeout(() => root!.classList.add('settled'), 500))
      timers.push(setTimeout(() => onDoneRef.current(), reduced ? 0 : 400))
    }

    function coreResize() {
      VW = window.innerWidth
      VH = window.innerHeight
      coreCv!.width = Math.round(VW * dpr)
      coreCv!.height = Math.round(VH * dpr)
    }

    function assignSpawns() {
      for (let k = 0; k < corePixels.length; k++) {
        const p = corePixels[k]
        const edge = (Math.random() * 4) | 0
        if (edge === 0) { p.sx = Math.random() * VW; p.sy = -40 }
        else if (edge === 1) { p.sx = VW + 40; p.sy = Math.random() * VH }
        else if (edge === 2) { p.sx = Math.random() * VW; p.sy = VH + 40 }
        else { p.sx = -40; p.sy = Math.random() * VH }
        p.delay = Math.random() * 0.38
      }
      flickers = []
      for (let f = 0; f < 16; f++) flickers.push({ x: Math.random() * VW, y: Math.random() * VH, ph: Math.random() * 6.28 })
    }

    /* soft aura behind the agent, so it reads as a presence rather than a sprite */
    function drawGlow(cx: number, cy: number, rad: number, alpha: number) {
      const g = cctx!.createRadialGradient(cx * dpr, cy * dpr, 0, cx * dpr, cy * dpr, rad * dpr)
      g.addColorStop(0, 'rgba(123, 76, 255, ' + 0.22 * alpha + ')')
      g.addColorStop(0.6, 'rgba(14, 164, 197, ' + 0.08 * alpha + ')')
      g.addColorStop(1, 'rgba(0, 0, 0, 0)')
      cctx!.fillStyle = g
      cctx!.fillRect((cx - rad) * dpr, (cy - rad) * dpr, rad * 2 * dpr, rad * 2 * dpr)
    }

    function drawLogo(cx: number, cy: number, cell: number, assembleT: number | null, sweep: number | null, fade: number | null) {
      const DB = Math.max(2, Math.round(cell * dpr) - 2)
      const half = DB >> 1
      for (let k = 0; k < corePixels.length; k++) {
        const p = corePixels[k]
        const tx = cx + p.lx * cell
        const ty = cy + p.ly * cell
        let x = tx
        let y = ty
        if (assembleT !== null) {
          const local = clampT((assembleT - p.delay!) / (1 - 0.38))
          if (local <= 0) continue
          const e = easeOutExpo(local)
          x = lerp(p.sx!, tx, e)
          y = lerp(p.sy!, ty, e)
        }
        const px = Math.round(x * dpr) - half
        const py = Math.round(y * dpr) - half
        cctx!.globalAlpha = fade != null ? fade : 1
        cctx!.fillStyle = p.color
        cctx!.fillRect(px, py, DB, DB)
        if (assembleT === null && sweep != null) {
          const dpos = (p.lx + p.ly) / CELLS + 0.5
          const band = 1 - Math.min(1, Math.abs(dpos - sweep) / 0.10)
          if (band > 0) { cctx!.globalAlpha = band * 0.4; cctx!.fillStyle = '#fff'; cctx!.fillRect(px, py, DB, DB) }
        }
      }
      cctx!.globalAlpha = 1
    }

    function startIntro() {
      coreResize()
      assignSpawns()
      const cx0 = VW / 2
      const cy0 = VH * 0.42
      const bigCell = (Math.min(VW, VH) * 0.46) / CELLS
      const span = bigCell * CELLS
      // the declarations sit just under the assembled agent
      const lineTop = Math.min(VH * 0.86, cy0 + span / 2 + 44)
      beat1!.style.top = lineTop + 'px'
      beat2!.style.top = lineTop + 'px'

      const T1 = PH.dormant, T2 = T1 + PH.assemble, T3 = T2 + PH.shimmer, T4 = T3 + PH.hold,
        T5 = T4 + PH.line1, T6 = T5 + PH.line2, T7 = T6 + PH.linesOut,
        T8 = T7 + PH.descend, T9 = T8 + PH.screenHold, T10 = T9 + PH.tuck
      let start: number | null = null
      let lastCy = cy0
      let descending = false, dockX = 0, dockY = 0, dockCell = 0, descCyFrom = cy0
      let tuckX = 0, tuckY = 0, tuckCell = 0

      function step(ts: number) {
        if (start == null) start = ts
        const t = ts - start
        cctx!.clearRect(0, 0, coreCv!.width, coreCv!.height)
        if (t < T1) {
          // void hum: faint blue sparks before the agent takes shape
          for (let f = 0; f < flickers.length; f++) {
            const fl = flickers[f]
            const a = 0.10 + 0.10 * Math.sin(t * 0.006 + fl.ph)
            cctx!.globalAlpha = Math.max(0, a)
            cctx!.fillStyle = '#3a7bd5'
            cctx!.fillRect(fl.x * dpr, fl.y * dpr, 3 * dpr, 3 * dpr)
          }
          cctx!.globalAlpha = 1
        } else if (t < T2) {
          drawGlow(cx0, cy0, span * 0.8, ((t - T1) / PH.assemble) * 0.8)
          drawLogo(cx0, cy0, bigCell, (t - T1) / PH.assemble, null, null)
        } else if (t < T3) {
          drawGlow(cx0, cy0, span * 0.8, 0.9)
          drawLogo(cx0, cy0, bigCell, null, (t - T2) / PH.shimmer, null)
        } else if (t < T7) {
          // the agent hovers, breathing, while it introduces itself
          lastCy = cy0 + Math.sin((t - T3) * 0.0018) * 7
          drawGlow(cx0, lastCy, span * (0.8 + 0.05 * Math.sin((t - T3) * 0.0022)), 1)
          drawLogo(cx0, lastCy, bigCell, null, null, null)
          if (t >= T4 && t < T5) { beat1!.classList.add('on') }
          else if (t >= T5 && t < T6) { beat1!.classList.remove('on'); beat2!.classList.add('on') }
          else if (t >= T6) { beat2!.classList.remove('on') }
        } else if (t < T8) {
          // deployment: the agent flies down and shrinks into its first machine
          if (!descending) {
            descending = true
            descCyFrom = lastCy
            const r = lapScreen!.getBoundingClientRect()
            dockX = r.left + r.width / 2
            dockY = r.top + r.height / 2
            dockCell = (r.height * 0.55) / CELLS
            const b = brandIcon!.getBoundingClientRect()
            tuckX = b.left + b.width / 2
            tuckY = b.top + b.height / 2
            tuckCell = b.width / CELLS
            backdropEl!.classList.add('gone')
          }
          const u = easeInOut((t - T7) / PH.descend)
          const cx = lerp(cx0, dockX, u)
          const cy = lerp(descCyFrom, dockY, u)
          const cell = lerp(bigCell, dockCell, u)
          drawGlow(cx, cy, cell * CELLS * 0.9, 1 - u * 0.5)
          drawLogo(cx, cy, cell, null, null, null)
        } else if (t < T9) {
          // on-screen for a breath: the machine has its agent
          drawGlow(dockX, dockY, dockCell * CELLS * 0.9, 0.5)
          drawLogo(dockX, dockY, dockCell, null, null, null)
        } else if (t < T10) {
          // then it tucks itself into the corner and becomes the mark it works under;
          // the real screen icon fades in over this exact spot on reveal
          const v = easeInOut((t - T9) / PH.tuck)
          const cx2 = lerp(dockX, tuckX, v)
          const cy2 = lerp(dockY, tuckY, v)
          const cell2 = lerp(dockCell, tuckCell, v)
          drawGlow(cx2, cy2, cell2 * CELLS * 1.1, (1 - v) * 0.4)
          drawLogo(cx2, cy2, cell2, null, null, null)
        } else {
          finish()
          return
        }
        introRaf = requestAnimationFrame(step)
      }
      introRaf = requestAnimationFrame(step)
      ;(['click', 'wheel', 'touchstart', 'keydown'] as const).forEach((ev) => window.addEventListener(ev, finish))
      // same guard boot.js carries: if rAF is throttled (hidden/background tab), timers still land the page
      timers.push(setTimeout(finish, T10 + 2600))
    }

    if (reduced) { finish() } else { startIntro() }

    return () => {
      // Unmount (or StrictMode's dev re-mount): stop everything and put body back. `finished`
      // also guards the skip listeners, which finish() itself removes on the normal path.
      finished = true
      if (introRaf) cancelAnimationFrame(introRaf)
      ;(['click', 'wheel', 'touchstart', 'keydown'] as const).forEach((ev) => window.removeEventListener(ev, finish))
      timers.forEach(clearTimeout)
      document.body.classList.remove('crx-lock')
      root.classList.remove('revealed', 'settled')
      coreCv.classList.remove('out')
    }
  }, [])
}
