'use client'

import { useEffect, useState } from 'react'

// THE RECEDING GRID — a floor and a ceiling drawn as two vanishing-point fans, with an optional
// travelling shine. Extracted from CtaBand on 2026-09-08 when the expectations dialog asked for the
// same lines at its own scale (Appy: "those grid lines at the top and the bottom that we have on
// our final CTA section"). CtaBand's own header had already said it: the geometry "is the whole
// file and must not exist twice", so a second copy at dialog size was the one thing not to do.
//
// The band keeps its chrome — gradient, padding, the .crx-band-in stacking context — and now just
// renders this inside it. Everything below is that file's, constant for constant, with its
// reasoning intact:
//   · SPREAD is wider than the viewBox so the fan fills the frame instead of tapering inside it.
//   · rowOffsets are non-linear (RATIO) so rows bunch toward the horizon the way perspective does.
//   · Each plane is masked to dissolve BEFORE its own horizon — otherwise the rows pile into a hard
//     vanishing line. Three gradient stops, not two, so most of the falloff lands in the first
//     third and the grid is already fading well before FADE_END.
//   · NEAR_INSET is negative on purpose: the plane's near edge sits 8 units OUTSIDE the frame, so
//     the offset-0 row is clipped by overflow:hidden and the first row you see is already in
//     perspective, rather than reading as an extra hairline along the rounded corner.
//
// TWO THINGS ARE PARAMETERS NOW, and only two. `idPrefix`, because two grids on one page with the
// same mask and gradient ids render correctly right up until one of them changes size — and there
// are two on a page the moment a dialog opens over the closer. And `shine`, because the travelling
// wave belongs to a full-width band you scroll past; behind 40 words of dialog copy it is a
// distraction competing with the thing it frames.
//
// STROKES ARE currentColor. The colour is set once by whoever mounts this — the band sets it on
// .crx-band-grid, the dialog on its own wrapper — so one grid follows the band's theme and the
// other sits at dialog weight without either knowing about the other.
const W = 1200
const H = 420
const DEPTH = 120
const ROWS = 8
const RATIO = 0.38
const COLS = 15
const FADE_END = 0.62
const SPREAD = W * 1.9
const NEAR_INSET = -8

// SHINE, ported constant for constant from blueai-product's moneymaker_backdrop.jsx (MMGrid).
// TILE is the gradient's repeat period; FAST is how long the streak takes to cross a fixed point
// and GAP is the quiet between waves, so a point flashes for FAST and sits dark for GAP of every
// DUR. Faster here than the original (Appy, 2026-08-20) — MoneyMaker runs 0.9/2.5 as a persistent
// app backdrop, where a long quiet is what stops it nagging; this band is one screen you scroll
// past, so a 2.5s dark stretch means most visitors see the grid do nothing at all. It is the GAP
// that shortens, not really the pulse.
const TILE = 180
const FAST = 0.8
const GAP = 1.3
const DUR = FAST + GAP

const rowOffsets = Array.from({ length: ROWS }, (_, i) => DEPTH * (1 - 1 / (1 + RATIO * i)))
const colX = Array.from({ length: COLS }, (_, i) => (W - SPREAD) / 2 + (SPREAD * i) / (COLS - 1))
const VP_X = W / 2

// WHICH columns carry the wave changes every cycle — a random 3-6 of the 15, re-picked on a timer
// synced to the gradient's own DUR — while the TIMING stays on one shared clock, so the whole grid
// genuinely goes dark together between waves. That combination is the one part of the effect that
// needs JS: a single shared gradient can only ever paint the same lines every repeat, and per-line
// independent phases trade the guaranteed gap away, since 15 clocks means something is always
// mid-flash somewhere.
function pickShineCols() {
  const count = 3 + Math.floor(Math.random() * 4)
  const pool = Array.from({ length: COLS }, (_, i) => i)
  const chosen: number[] = []
  for (let k = 0; k < count && pool.length; k++) {
    chosen.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0])
  }
  return chosen
}

const streakPct = (FAST / DUR) * 100

/* Stop-width is FAST/DUR of the tile, so a fixed point sees the streak for FAST and sits dark for
   the remaining GAP of every DUR cycle. Purely additive — the base grid supplies the resting look —
   so it stays at 0 opacity everywhere outside the streak.
   ONE HUE, NOT TWO (2026-09-08). This ran iris -> cyan because the layer WAS the logo gradient; the
   page has no gradient any more, so the streak is the accent blue throughout and only its opacity
   moves. The stops stay asymmetric — 0.6 rising, 0.3 falling — which is what still gives the wave
   a leading edge and a tail now that the hue shift is not doing it. */
const SHINE = '#2F6DFF'
const ShineStops = () => (
  <>
    <stop offset="0%" stopColor={SHINE} stopOpacity="0" />
    <stop offset={`${(50 - streakPct / 2).toFixed(1)}%`} stopColor={SHINE} stopOpacity="0" />
    <stop offset={`${(50 - streakPct / 2 + 3).toFixed(1)}%`} stopColor={SHINE} stopOpacity="0.6" />
    <stop offset="50%" stopColor={SHINE} stopOpacity="0.6" />
    <stop offset={`${(50 + streakPct / 2 - 3).toFixed(1)}%`} stopColor={SHINE} stopOpacity="0.3" />
    <stop offset={`${(50 + streakPct / 2).toFixed(1)}%`} stopColor={SHINE} stopOpacity="0" />
    <stop offset="100%" stopColor={SHINE} stopOpacity="0" />
  </>
)

function Plane({
  idPrefix,
  kind,
  shineCols,
}: {
  idPrefix: string
  kind: 'floor' | 'ceiling'
  shineCols: number[]
}) {
  const near = kind === 'floor' ? H - NEAR_INSET : NEAR_INSET
  const at = (offset: number) => (kind === 'floor' ? near - offset : near + offset)
  const horizon = at(DEPTH)
  const cap = kind === 'floor' ? 'Floor' : 'Ceiling'

  return (
    <g mask={`url(#${idPrefix}Mask${cap})`}>
      {colX.map((x) => (
        <line key={`v${x}`} x1={x} y1={near} x2={VP_X} y2={horizon} stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
      {rowOffsets.map((o, i) => (
        <line key={`h${i}`} x1={0} y1={at(o)} x2={W} y2={at(o)} stroke="currentColor" strokeOpacity={(0.42 * (1 - i / ROWS)).toFixed(3)} strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
      {/* shine overlay — only this cycle's columns, all on the SAME synchronized gradient, so
          whichever lines are chosen flash together and go dark together as one wave. Thicker than
          the base line (1.8 vs 1) so the pulse reads as bolder, not merely brighter. */}
      {shineCols.map((i) => (
        <line key={`s${i}`} x1={colX[i]} y1={near} x2={VP_X} y2={horizon} stroke={`url(#${idPrefix}Shine${cap})`} strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
      ))}
    </g>
  )
}

export default function BandGrid({
  idPrefix,
  shine = false,
  className = '',
}: {
  /** Unique per mount — two grids sharing mask ids break the moment their sizes differ. */
  idPrefix: string
  shine?: boolean
  className?: string
}) {
  // The FIRST cycle's columns are fixed, not random: this renders through SSR, and Math.random()
  // in the initial state would hand the server and the client different lines and trip a hydration
  // mismatch. The interval takes over at the first cycle boundary.
  const [shineCols, setShineCols] = useState<number[]>([2, 6, 9, 13])
  useEffect(() => {
    if (!shine) return
    const id = setInterval(() => setShineCols(pickShineCols()), DUR * 1000)
    return () => clearInterval(id)
  }, [shine])

  const cols = shine ? shineCols : []

  return (
    <svg className={className} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${idPrefix}FadeFloor`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset={`${FADE_END * 45}%`} stopColor="#fff" stopOpacity="0.4" />
          <stop offset={`${FADE_END * 100}%`} stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${idPrefix}FadeCeiling`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset={`${FADE_END * 45}%`} stopColor="#fff" stopOpacity="0.4" />
          <stop offset={`${FADE_END * 100}%`} stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        {/* masks follow the inset planes, so the fade still spans exactly near -> horizon */}
        <mask id={`${idPrefix}MaskFloor`} maskUnits="userSpaceOnUse" x="0" y={H - NEAR_INSET - DEPTH} width={W} height={DEPTH}>
          <rect x="0" y={H - NEAR_INSET - DEPTH} width={W} height={DEPTH} fill={`url(#${idPrefix}FadeFloor)`} />
        </mask>
        <mask id={`${idPrefix}MaskCeiling`} maskUnits="userSpaceOnUse" x="0" y={NEAR_INSET} width={W} height={DEPTH}>
          <rect x="0" y={NEAR_INSET} width={W} height={DEPTH} fill={`url(#${idPrefix}FadeCeiling)`} />
        </mask>
        {shine && (
          <>
            {/* One shared gradient per plane (not one per line) — that is what makes whichever
                columns are lit this cycle flash and go dark IN SYNC. The wave travels FROM the
                horizon TOWARD the viewer; each gradient's axis runs near-edge -> horizon, so
                translating the pattern back along that axis walks the streak toward the near edge.
                The floor's near edge is the LARGER y, so toward-viewer is positive; the ceiling's is
                the smaller, so it is negative. The signs differ because the planes face opposite
                ways — flipping only one would send the two waves in opposite directions. */}
            <linearGradient id={`${idPrefix}ShineFloor`} gradientUnits="userSpaceOnUse" x1="0" y1={H - NEAR_INSET} x2="0" y2={H - NEAR_INSET - TILE} spreadMethod="repeat">
              <ShineStops />
              <animateTransform attributeName="gradientTransform" type="translate" from="0 0" to={`0 ${TILE}`} dur={`${DUR}s`} repeatCount="indefinite" />
            </linearGradient>
            <linearGradient id={`${idPrefix}ShineCeiling`} gradientUnits="userSpaceOnUse" x1="0" y1={NEAR_INSET} x2="0" y2={NEAR_INSET + TILE} spreadMethod="repeat">
              <ShineStops />
              <animateTransform attributeName="gradientTransform" type="translate" from="0 0" to={`0 ${-TILE}`} dur={`${DUR}s`} repeatCount="indefinite" />
            </linearGradient>
          </>
        )}
      </defs>
      <Plane idPrefix={idPrefix} kind="ceiling" shineCols={cols} />
      <Plane idPrefix={idPrefix} kind="floor" shineCols={cols} />
    </svg>
  )
}
