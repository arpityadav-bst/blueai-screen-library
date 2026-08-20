import { useEffect, useRef } from 'react'

// The boot intro — blueai-desktop's own launch animation (public/blueai-desktop/boot.js), ported
// beat for beat on 2026-08-20 (Appy: "take out that landscape animation code as it is and use it
// here... we'll replace the current blocky animation with that pristine one"). READ-ONLY reference:
// nothing in blueai-desktop was touched, and this is not a VDA surface.
//
// WHAT THE PAGE ALREADY HAD, AND WHY IT READ AS BLOCKY. The mock's version already carried
// genLogo with the same parameters (0.45 / 0.86 / 0.92) and the same edge-spawn assembly, so the
// logo itself was never the problem. Three things around it were, and all three are what the
// desktop does differently:
//
//   0. THE PIXELS WERE THREE TO FOUR TIMES TOO BIG — the actual reason it read as blocky, and the
//      one the first pass of this port missed by keeping the old sizing. See CELL_CSS below.
//   1. NOTHING WAS ON A PIXEL LATTICE except the logo. The void-hum sparks were placed at raw
//      float coordinates and drawn 3px square, so the screen before the logo was noise that
//      happened to be square — not the same material the logo is made of. Desktop snaps every
//      spark to the GRID, and that single change is most of the "pristine" difference: the whole
//      canvas is visibly one pixel grid, and the logo condenses out of it.
//   2. THE HOLD WAS STATIC. The assembled agent just sat there behind a breathing radial glow.
//      Desktop's hold is alive — a per-pixel twinkle across the logo plus an ambient field of
//      sparks fading in and out behind it (holdStep / drawCenterLive / drawBgSparks).
//   3. THE HOLD RAN OUT INTO NOTHING. The logo faded on the spot. It lands in the laptop's brand
//      mark now — see the exit note below; that part is this page's own, not desktop's.
//
// AND ONE THING DELIBERATELY DROPPED: the radial aura (drawGlow). Desktop has none — the pixels
// are the whole image — and on a logo made of hard-edged squares a soft glow is exactly the thing
// that makes it read as a sprite pasted on a background rather than as the background resolving
// into a shape.
//
// THE "LANDSCAPE" QUALIFIER: setWide() in boot.js only repaints the header row's tone, so the
// assemble/hold/dissolve sequence is identical in both modes — what differs is the canvas it plays
// on. Here the canvas is the whole viewport, which is the landscape case by construction.
//
// WHAT IS NOT VERBATIM, and why: the two spark COUNTS. Desktop tunes 7 flickers and a 24-spark
// ambient cap against a drawer a few hundred px wide; the same numbers on a 1920x1080 canvas are
// an empty screen with a few dots in it. Both are scaled by area against desktop's own density,
// and the per-spark envelope (life, peak, the sin(t*PI) fade) is byte-identical.
//
// THE EXIT IS THIS PAGE'S OWN, and it is the one place the desktop port does not apply. boot.js
// bursts its logo away because it has nowhere to put it; this page does — the agent travels into
// the brand mark on the laptop's own screen, shrinking as it goes and fading out as it arrives,
// so the mark the page already draws is what it leaves behind.
//
// ONE MOVE, NOT THREE. The original did this in three phases — descend to the middle of the
// screen, hold there for a breath, then tuck up into the corner — and restoring it restored that
// too. Appy cut it the same day: "can it go directly to the logo area instead of that mid step".
// He is right, and the reason is that the middle of the screen was never a destination. It was a
// waypoint the animation stopped at, so the exit read as two separate journeys with a pause
// between them rather than as the agent going where it was always going.
//
// WHICH IS WHY THE SCENE ENTERS FIRST. The page's staged entry used to run title -> sub -> CTA ->
// scene; the agent cannot land in a laptop that has not arrived yet, so the scene now takes the
// first slot (.d0) and everything else keeps its order behind it. `.revealed` is added when the
// descent STARTS rather than when the intro ends, so the laptop is rising into place underneath
// the agent as it comes down.
//
// Beats: void hum -> assemble -> shimmer -> the agent holds, alive, over two lines of copy ->
// one travel into the screen's brand mark, shrinking and fading, while the page arrives on its
// own staggered blur entry (creators.css). Click/wheel/touch/key skips. prefers-reduced-motion
// skips the whole thing.
//
// STATE LIVES ON .crx AND body.crx-lock, not on body.revealed like the mock — see creators.css's
// header for why. onDone is the hero task loop's start (useLaptopFx), the same handoff the mock
// made. Cleanup (rAF, listeners, timers, the body lock) exists because this component can unmount
// and StrictMode double-mounts in dev; neither page it came from had either problem.
/** THE ONE NUMBER THAT DECIDES WHETHER THIS LOOKS PRISTINE OR BLOCKY, and the thing the first
    port got wrong. boot.js draws a 130px logo across 40 cells, so its cell is GRID(6) x
    BIG(130/240) = 3.25 css px — a 2px block with a 1.25px gap at any dpr. This page kept CELLS=40
    and blew the logo up to 46% of the viewport, which is the same code at a cell of 10-12px:
    3.2x to 3.8x desktop's grain. Identical geometry, four times the pixel, and pixel art four
    times too large is exactly what "blocky" means.
    Desktop itself never scales the cell — it scales the COUNT. Its header logo is 9 cells at
    ~2.6px and its boot logo is 40 cells at 3.25px; the pixel stays the same size and the artwork
    gets more of them. This page does the same, so the cell is fixed here and CELLS is derived
    from the viewport at runtime (see startIntro). */
const CELL_CSS = 3.25
/** Upper bound on the derived cell count, for frame cost rather than looks: the pixel count grows
    with the square, and this is where it stops being free — 40 cells is 916 pixels a frame, 120 is
    8208, 140 is 11172. 120 gives a 390px logo, which is the size a full-screen intro wants. */
const MAX_CELLS = 120
/** boot.js's own cell size for everything that is NOT the logo — the void-hum flickers, the
    ambient sparks. They stay on this lattice, which is what makes the canvas read as one pixel
    grid rather than as a logo sitting on noise. */
const GRID = 6
const PH = { dormant: 350, assemble: 1700, shimmer: 150, hold: 250, line1: 1500, line2: 1600, linesOut: 300, land: 1100 }

type Px = {
  lx: number; ly: number; color: string
  sx?: number; sy?: number; delay?: number
  nx?: number; dvx?: number; dvy?: number
}
type Spark = { x: number; y: number; born: number; life: number; peak: number; col: string }

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clampT = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

// A clean pixel disc minus a 4-point NSEW sparkle (astroid) — boot.js's genLogo, same relative
// shape at any resolution. ex<1 makes the sparkle concave; the colour ramps cyan -> violet along
// (lx+ly), so the gradient is diagonal rather than flat.
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
    const beat1 = document.getElementById('beat1')
    const beat2 = document.getElementById('beat2')
    // What the agent aims at: the brand mark on the laptop's screen, and nothing else — the
    // screen's own rect was only ever needed for the middle waypoint that is gone. OPTIONAL,
    // unlike the rest: it belongs to the hero scene, and a missing scene must degrade to a plain
    // fade rather than strand the intro, so the guard below deliberately does not include it.
    const brandIcon = document.querySelector<SVGElement>('.crx .scr-brand svg')
    // FAIL OPEN, NEVER CLOSED. Bailing means finish() never runs, .revealed is never added, and
    // the page stays hidden behind an opaque backdrop forever. A missing decoration must never be
    // able to white-screen the site.
    if (!root || !coreCv || !backdropEl || !beat1 || !beat2) {
      root?.classList.add('revealed', 'settled')
      document.body.classList.remove('crx-lock')
      onDoneRef.current()
      return
    }
    const cctx = coreCv.getContext('2d')
    if (!cctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    let VW = 0
    let VH = 0
    // Built in startIntro, once the viewport has been measured — its resolution depends on it.
    let cells = 40
    let corePixels: Px[] = []
    let flickers: { x: number; y: number; ph: number }[] = []
    const sparks: Spark[] = []
    let lastSpawn = 0
    let sparkCap = 24
    let spawnEvery = 110
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
      // boot.js's densities, re-derived for this canvas: 7 flickers and a 24-spark cap were tuned
      // against roughly a 420x760 drawer. Same sparks per unit area, floored at the originals.
      const areaRatio = (VW * VH) / (420 * 760)
      sparkCap = Math.max(24, Math.round(24 * areaRatio))
      spawnEvery = Math.max(24, Math.round(110 / Math.max(1, areaRatio)))
    }

    /** Every pixel flies in from a random edge, staggered — boot.js assignSpawns(). The flickers
        it seeds alongside are snapped to the GRID, which is the thing that makes the void read as
        the same material the logo is about to be made of. */
    function assignSpawns() {
      for (let k = 0; k < corePixels.length; k++) {
        const p = corePixels[k]
        const edge = (Math.random() * 4) | 0
        if (edge === 0) { p.sx = Math.random() * VW; p.sy = -GRID * 3 }
        else if (edge === 1) { p.sx = VW + GRID * 3; p.sy = Math.random() * VH }
        else if (edge === 2) { p.sx = Math.random() * VW; p.sy = VH + GRID * 3 }
        else { p.sx = -GRID * 3; p.sy = Math.random() * VH }
        p.delay = Math.random() * 0.38
      }
      flickers = []
      const n = Math.max(7, Math.round((7 * (VW * VH)) / (420 * 760)))
      for (let f = 0; f < n; f++) {
        flickers.push({
          x: Math.round((Math.random() * VW) / GRID) * GRID,
          y: Math.round((Math.random() * VH) / GRID) * GRID,
          ph: Math.random() * 6.28,
        })
      }
    }

    /** boot.js spawnBgSpark/drawBgSparks — the ambient field behind the held logo. The envelope is
        the original's: fade in, peak, fade out on sin(t*PI). */
    function drawBgSparks(now: number) {
      if (now - lastSpawn > spawnEvery && sparks.length < sparkCap) {
        lastSpawn = now
        sparks.push({
          x: Math.round((Math.random() * VW) / GRID) * GRID,
          y: Math.round((Math.random() * VH) / GRID) * GRID,
          born: now, life: 1100 + Math.random() * 1700,
          peak: 0.12 + Math.random() * 0.22,
          col: Math.random() < 0.5 ? '110,168,255' : '123,76,255',
        })
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        const t = (now - s.born) / s.life
        if (t >= 1) { sparks.splice(i, 1); continue }
        cctx!.globalAlpha = Math.sin(t * Math.PI) * s.peak
        cctx!.fillStyle = 'rgb(' + s.col + ')'
        cctx!.fillRect(s.x * dpr, s.y * dpr, (GRID - 2) * dpr, (GRID - 2) * dpr)
      }
      cctx!.globalAlpha = 1
    }

    // Assembly + shimmer. Integer device-px rendering with a ~2px gap, so the pixels stay distinct
    // and never merge into a soft mass — boot.js drawLogo().
    // `g` is a parameter rather than the closed-over cctx because the landing needs this same
    // artwork painted once into an offscreen canvas — see the exit phase for why.
    function drawLogo(g: CanvasRenderingContext2D, cx: number, cy: number, cell: number, assembleT: number | null, sweep: number | null) {
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
        g.fillStyle = p.color
        g.fillRect(px, py, DB, DB)
        if (assembleT === null && sweep != null) {
          const dpos = (p.lx + p.ly) / cells + 0.5
          const band = 1 - Math.min(1, Math.abs(dpos - sweep) / 0.10)
          if (band > 0) { g.globalAlpha = band * 0.4; g.fillStyle = '#fff'; g.fillRect(px, py, DB, DB); g.globalAlpha = 1 }
        }
      }
    }

    /** boot.js drawCenterLive() at energy 0: the held logo breathes per pixel rather than as one
        object, which is what stops the hold looking like a still frame. */
    function drawCenterLive(cx: number, cy: number, cell: number, now: number) {
      const DB = Math.max(2, Math.round(cell * dpr) - 2)
      const half = DB >> 1
      for (let k = 0; k < corePixels.length; k++) {
        const p = corePixels[k]
        const tw = 0.5 + 0.5 * Math.sin(now * 0.0035 + p.lx * 1.1 + p.ly * 0.7)
        cctx!.globalAlpha = Math.min(1, 0.78 + 0.14 * tw)
        cctx!.fillStyle = p.color
        // rounds (css * dpr), exactly as drawLogo does — rounding in css px first would land the
        // held logo a fraction off the assembled one and it would visibly jump at the handover
        cctx!.fillRect(Math.round((cx + p.lx * cell) * dpr) - half, Math.round((cy + p.ly * cell) * dpr) - half, DB, DB)
      }
      cctx!.globalAlpha = 1
    }

    function startIntro() {
      coreResize()
      // SIZE FROM GRAIN, NOT GRAIN FROM SIZE. Pick how many 3.25px cells fit the target width and
      // build the logo at that resolution; the pixel stays desktop's size and the artwork simply
      // has more of them. 0.36 of the short side is a little under the old 0.46 — at desktop's
      // grain the logo carries far more detail, so it does not need the width to have presence.
      cells = Math.max(40, Math.min(MAX_CELLS, Math.round((Math.min(VW, VH) * 0.36) / CELL_CSS)))
      corePixels = genLogo(cells, 0.45, 0.86, 0.92)
      assignSpawns()
      const cx0 = VW / 2
      // 0.40 is boot.js's own CY_FRAC — it sits the logo above centre, which is what leaves the
      // room the two lines of copy need underneath.
      const cy0 = VH * 0.4
      const bigCell = CELL_CSS
      const span = bigCell * cells
      // the declarations sit just under the assembled agent
      const lineTop = Math.min(VH * 0.86, cy0 + span / 2 + 44)
      beat1!.style.top = lineTop + 'px'
      beat2!.style.top = lineTop + 'px'

      const T1 = PH.dormant, T2 = T1 + PH.assemble, T3 = T2 + PH.shimmer, T4 = T3 + PH.hold,
        T5 = T4 + PH.line1, T6 = T5 + PH.line2, T7 = T6 + PH.linesOut,
        T8 = T7 + PH.land
      let start: number | null = null
      let landing = false
      let toX = 0, toY = 0, toScale = 1
      let stamp: HTMLCanvasElement | null = null
      let stampCss = 0

      function step(ts: number) {
        if (start == null) start = ts
        const t = ts - start
        // NO frameBase() FILL, unlike boot.js: there the canvas IS the app's background, here the
        // .backdrop element behind it owns that and has to keep dissolving independently.
        cctx!.clearRect(0, 0, coreCv!.width, coreCv!.height)
        if (t < T1) {
          // void hum: grid-snapped blue sparks breathing before the agent takes shape
          for (let f = 0; f < flickers.length; f++) {
            const fl = flickers[f]
            cctx!.globalAlpha = Math.max(0, 0.10 + 0.10 * Math.sin(t * 0.006 + fl.ph))
            cctx!.fillStyle = '#3a7bd5'
            cctx!.fillRect(fl.x * dpr, fl.y * dpr, (GRID - 1.5) * dpr, (GRID - 1.5) * dpr)
          }
          cctx!.globalAlpha = 1
        } else if (t < T2) {
          drawLogo(cctx!, cx0, cy0, bigCell, (t - T1) / PH.assemble, null)
        } else if (t < T3) {
          drawLogo(cctx!, cx0, cy0, bigCell, null, (t - T2) / PH.shimmer)
        } else if (t < T7) {
          // the agent holds, alive, while it introduces itself — boot.js holdStep()
          drawBgSparks(ts)
          drawCenterLive(cx0, cy0, bigCell, ts)
          if (t >= T4 && t < T5) { beat1!.classList.add('on') }
          else if (t >= T5 && t < T6) { beat1!.classList.remove('on'); beat2!.classList.add('on') }
          else if (t >= T6) { beat2!.classList.remove('on') }
        } else if (t < T8) {
          // ONE TRAVEL: out of the hold, into the mark, shrinking the whole way.
          if (!landing) {
            landing = true
            // Measured now, not at mount. The scene is still at opacity 0 at this instant — .rv
            // hides it until its entry animation runs — but opacity does not affect layout, so the
            // rect is already the real one, and reading it here means a resize during the intro
            // cannot leave the agent aiming at a stale position.
            const b = brandIcon!.getBoundingClientRect()
            toX = b.left + b.width / 2
            toY = b.top + b.height / 2

            // A BITMAP, NOT PER-PIXEL RECTS, and this is the whole reason the shrink works.
            // drawLogo paints each cell at `round(cell * dpr) - 2` device px with a hard floor of
            // 2, so below a cell of 2/dpr the logo stops getting smaller — at 120 cells that floor
            // is a ~120px logo against an ~18px mark, and the last third of the travel was spent
            // visibly not shrinking (Appy: "it doesn't scale down properly... can we scale it down
            // more, so it feels more like it's going inside the laptop").
            // Stamping the artwork once into an offscreen canvas and scaling THAT has no floor:
            // it goes to any size, and the browser's own downsampling softens the pixel grid as it
            // gets small, which is what something disappearing into a mark should do anyway.
            stampCss = (cells + 2) * bigCell
            const c = document.createElement('canvas')
            c.width = Math.ceil(stampCss * dpr)
            c.height = c.width
            const g = c.getContext('2d')
            if (g) drawLogo(g, stampCss / 2, stampCss / 2, bigCell, null, null)
            stamp = c
            toScale = b.width / stampCss

            // Both on the same frame: the backdrop begins its 1s dissolve and the page begins its
            // staged entry, which starts with the scene (.d0). The laptop is therefore rising into
            // place underneath the agent while the agent is on its way into it.
            backdropEl!.classList.add('gone')
            root!.classList.add('revealed')
          }
          if (stamp) {
            const u = easeInOut((t - T7) / PH.land)
            const size = stampCss * (1 + (toScale - 1) * u)
            // Opaque for the first 70%: the SCALE carries the journey now, so fading early would
            // hide the very thing that makes it read as going into the machine.
            cctx!.globalAlpha = 1 - clampT((u - 0.7) / 0.3)
            const x = lerp(cx0, toX, u) - size / 2
            const y = lerp(cy0, toY, u) - size / 2
            cctx!.drawImage(stamp, x * dpr, y * dpr, size * dpr, size * dpr)
            cctx!.globalAlpha = 1
          }
        } else {
          finish()
          return
        }
        introRaf = requestAnimationFrame(step)
      }
      introRaf = requestAnimationFrame(step)
      ;(['click', 'wheel', 'touchstart', 'keydown'] as const).forEach((ev) => window.addEventListener(ev, finish))
      // same guard boot.js carries: if rAF is throttled (hidden/background tab), timers still land the page
      timers.push(setTimeout(finish, T8 + 2600))
    }

    // NO TARGET, NO LANDING. The scene only exists on the signed-out homepage; if it is ever
    // absent the agent has nothing to fly into, and travelling to a measured rect of {0,0,0,0}
    // would send it to the top-left corner. It fades on the spot instead.
    if (reduced || !brandIcon) { finish() } else { startIntro() }

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
