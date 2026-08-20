'use client'

import { useEffect, useState } from 'react'

// The closing CTA's grid-lined band — a COPY of creator-brand's CTABand + CTAGrid pair (Appy,
// 2026-08-19: "the final CTA call style can be similar to what we have there, inside a grid lined
// container same bg same grids"), now carrying blueai-product's MoneyMaker shine on top of it
// (Appy, 2026-08-20: "that same grid lines animation... everything same way"). Both are copies,
// not imports: /creator-brand is frozen, and blueai-product's version is a plain-browser JSX
// bundle in another worktree.
//
// TWO DELIBERATE DEVIATIONS from the original geometry, both Appy's and both noted where they live:
//   · the band GRADIENT is rebuilt from this page's tokens (creators.css .crx-band) — the DS's own
//     colours read as a panel borrowed from another site when dropped on this sky;
//   · NEAR_INSET pulls both planes off the band's edges, so the first row is not mistaken for a
//     border stroke.
// Everything else is the original constant for constant — a receding floor and ceiling drawn as
// two vanishing-point fans. Its own notes, worth keeping because they explain non-obvious values:
//   · SPREAD is wider than the viewBox so the fan fills the band instead of tapering inside it.
//   · rowOffsets are non-linear (RATIO) so rows bunch toward the horizon the way perspective does.
//   · Each plane is masked to dissolve BEFORE its own horizon — otherwise the rows pile into a
//     hard vanishing line. Three gradient stops, not two, so most of the falloff lands in the
//     first third and the grid is already fading well before FADE_END.
//
// BASE STROKES ARE currentColor, not the original's hardcoded #fff — the band went light (see
// creators.css .crx-band), and white lines on a white panel are invisible. The colour is set once
// on the svg in CSS, so the grid follows the band whichever way it is themed. The SHINE keeps its
// literal iris/cyan, because that layer IS the logo gradient and must not follow the theme.
//
// One band on this page, so the SVG ids need no prefix parameter — the original takes one because
// the creators page could render two at once (the submitted-application confirmation and the
// closing band), and duplicate mask ids render correctly right up until one band's size changes.
const W = 1200
const H = 420
const DEPTH = 120
const ROWS = 8
const RATIO = 0.38
const COLS = 15
const FADE_END = 0.62
const SPREAD = W * 1.9
// NEAR_INSET is this copy's one deviation from the original geometry (Appy, 2026-08-19), and it
// went 16 -> 6 -> -8 to land. The original starts each plane exactly on the band's edge, where the
// first row (offset 0) reads as an extra hairline stroke against the rounded corner rather than as
// the start of a floor. A POSITIVE inset pulls the plane inward, which fixes the stroke but opens
// a visible dead gap and loses the sense of the grid running into the band.
// NEGATIVE is the better answer: the plane's near edge sits 8 units OUTSIDE the frame, so the
// offset-0 row is clipped away by overflow:hidden and the first row you actually see is the second
// one — already in perspective, and closer to the edge than any positive inset could put it.
// The masks follow it below, so the fade still spans exactly near -> horizon.
const NEAR_INSET = -8

// SHINE, ported constant for constant from blueai-product's moneymaker_backdrop.jsx (MMGrid).
// A traveling wave of the logo's iris->cyan gradient, drawn as a second, thicker line layer over
// the base grid, transparent at rest and full at its peak, scrolling from the horizon toward the
// viewer on each plane. TILE is the gradient's repeat period; FAST is how long the streak takes to
// cross a fixed point and GAP is the quiet between waves, so a point flashes for FAST and sits
// dark for GAP of every DUR.
// FASTER HERE THAN IN THE ORIGINAL (Appy, 2026-08-20: "decrease the time difference between grid
// line animations here, can be a bit faster, only here"). MoneyMaker runs 0.9/2.5; that panel is a
// persistent app backdrop you sit in front of for minutes, where a long quiet is what keeps it from
// nagging. This band is one screen you scroll past, so a 2.5s dark stretch means most visitors see
// the grid do nothing at all. The pulse itself is barely quicker — it is the GAP that shortens.
const TILE = 180
const FAST = 0.8
const GAP = 1.3
const DUR = FAST + GAP

const rowOffsets = Array.from({ length: ROWS }, (_, i) => DEPTH * (1 - 1 / (1 + RATIO * i)))
const colX = Array.from({ length: COLS }, (_, i) => (W - SPREAD) / 2 + (SPREAD * i) / (COLS - 1))
const VP_X = W / 2

// WHICH columns carry the wave changes every cycle — a random 3-6 of the 15, re-picked on a timer
// synced to the gradient's own DUR (moneymaker's own range is 1-3; Appy widened it here on
// 2026-08-20, because against this band's shorter cycle one or two lit lines read as a stray
// glimmer rather than a sweep) — while the TIMING stays on one shared clock, so the whole grid
// genuinely goes dark together between waves. That combination is the one part of the effect that
// needs JS: a single shared gradient can only ever paint the same lines every repeat (nothing about
// a periodic animation changes between its own cycles), and per-line independent phases trade the
// guaranteed gap away, since 15 clocks means something is always mid-flash somewhere.
function pickShineCols() {
  const count = 3 + Math.floor(Math.random() * 4)
  const pool = Array.from({ length: COLS }, (_, i) => i)
  const chosen: number[] = []
  for (let k = 0; k < count && pool.length; k++) {
    chosen.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0])
  }
  return chosen
}

function Plane({ id, kind, shineCols }: { id: string; kind: 'floor' | 'ceiling'; shineCols: number[] }) {
  const near = kind === 'floor' ? H - NEAR_INSET : NEAR_INSET
  const at = (offset: number) => (kind === 'floor' ? near - offset : near + offset)
  const horizon = at(DEPTH)
  const shineStroke = `url(#crxShine${kind === 'floor' ? 'Floor' : 'Ceiling'})`

  return (
    <g mask={`url(#${id})`}>
      {colX.map((x) => (
        <line
          key={`v${x}`}
          x1={x}
          y1={near}
          x2={VP_X}
          y2={horizon}
          stroke="currentColor"
          strokeOpacity="0.3"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {rowOffsets.map((o, i) => (
        <line
          key={`h${i}`}
          x1={0}
          y1={at(o)}
          x2={W}
          y2={at(o)}
          stroke="currentColor"
          strokeOpacity={(0.42 * (1 - i / ROWS)).toFixed(3)}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {/* shine overlay — only this cycle's columns, all on the SAME synchronized gradient, so
          whichever lines are chosen flash together and go dark together as one wave. Thicker than
          the base line (1.8 vs 1) so the pulse reads as bolder, not merely brighter. */}
      {shineCols.map((i) => (
        <line
          key={`s${i}`}
          x1={colX[i]}
          y1={near}
          x2={VP_X}
          y2={horizon}
          stroke={shineStroke}
          strokeWidth="1.8"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </g>
  )
}

/* Stop-width is FAST/DUR of the tile, so a fixed point sees the streak for FAST and sits
   dark for the remaining GAP of every DUR cycle. Purely additive — the base grid supplies the
   resting look — so it stays at 0 opacity everywhere outside the streak. */
const streakPct = (FAST / DUR) * 100
const ShineStops = () => (
  <>
    <stop offset="0%" stopColor="#7B4CFF" stopOpacity="0" />
    <stop offset={`${(50 - streakPct / 2).toFixed(1)}%`} stopColor="#7B4CFF" stopOpacity="0" />
    <stop offset={`${(50 - streakPct / 2 + 3).toFixed(1)}%`} stopColor="#7B4CFF" stopOpacity="0.6" />
    <stop offset="50%" stopColor="#0EA4C5" stopOpacity="0.6" />
    <stop offset={`${(50 + streakPct / 2 - 3).toFixed(1)}%`} stopColor="#0EA4C5" stopOpacity="0.3" />
    <stop offset={`${(50 + streakPct / 2).toFixed(1)}%`} stopColor="#0EA4C5" stopOpacity="0" />
    <stop offset="100%" stopColor="#0EA4C5" stopOpacity="0" />
  </>
)

export default function CtaBand({ children }: { children: React.ReactNode }) {
  // The FIRST cycle's columns are fixed, not random — unlike the moneymaker original this renders
  // through Next's SSR, and Math.random() in the initial state would hand the server and the client
  // different lines and trip a hydration mismatch. The interval below takes over at the first cycle
  // boundary (it fires at DUR, the same period as the gradient), so only wave one is deterministic.
  const [shineCols, setShineCols] = useState<number[]>([2, 6, 9, 13])
  useEffect(() => {
    const id = setInterval(() => setShineCols(pickShineCols()), DUR * 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="crx-band">
      <svg
        className="crx-band-grid"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="crxBandFadeFloor" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset={`${FADE_END * 45}%`} stopColor="#fff" stopOpacity="0.4" />
            <stop offset={`${FADE_END * 100}%`} stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="crxBandFadeCeiling" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset={`${FADE_END * 45}%`} stopColor="#fff" stopOpacity="0.4" />
            <stop offset={`${FADE_END * 100}%`} stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          {/* masks follow the inset planes, so the fade still spans exactly near -> horizon */}
          <mask id="crxBandMaskFloor" maskUnits="userSpaceOnUse" x="0" y={H - NEAR_INSET - DEPTH} width={W} height={DEPTH}>
            <rect x="0" y={H - NEAR_INSET - DEPTH} width={W} height={DEPTH} fill="url(#crxBandFadeFloor)" />
          </mask>
          <mask id="crxBandMaskCeiling" maskUnits="userSpaceOnUse" x="0" y={NEAR_INSET} width={W} height={DEPTH}>
            <rect x="0" y={NEAR_INSET} width={W} height={DEPTH} fill="url(#crxBandFadeCeiling)" />
          </mask>
          {/* One shared gradient per plane (not one per line) — that is what makes whichever
              columns are lit this cycle flash and go dark IN SYNC. The wave travels FROM the
              horizon TOWARD the viewer; each gradient's axis runs near-edge -> horizon, so
              translating the pattern back along that axis walks the streak toward the near edge.
              The floor's near edge is the LARGER y, so toward-viewer is positive; the ceiling's is
              the smaller, so it is negative. The signs differ because the planes face opposite
              ways — flipping only one would send the two waves in opposite directions. */}
          <linearGradient id="crxShineFloor" gradientUnits="userSpaceOnUse" x1="0" y1={H - NEAR_INSET} x2="0" y2={H - NEAR_INSET - TILE} spreadMethod="repeat">
            <ShineStops />
            <animateTransform attributeName="gradientTransform" type="translate" from="0 0" to={`0 ${TILE}`} dur={`${DUR}s`} repeatCount="indefinite" />
          </linearGradient>
          <linearGradient id="crxShineCeiling" gradientUnits="userSpaceOnUse" x1="0" y1={NEAR_INSET} x2="0" y2={NEAR_INSET + TILE} spreadMethod="repeat">
            <ShineStops />
            <animateTransform attributeName="gradientTransform" type="translate" from="0 0" to={`0 ${-TILE}`} dur={`${DUR}s`} repeatCount="indefinite" />
          </linearGradient>
        </defs>
        <Plane id="crxBandMaskCeiling" kind="ceiling" shineCols={shineCols} />
        <Plane id="crxBandMaskFloor" kind="floor" shineCols={shineCols} />
      </svg>
      {/* content rides above the grid */}
      <div className="crx-band-in">{children}</div>
    </div>
  )
}
