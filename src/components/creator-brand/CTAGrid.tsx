/**
 * The receding grid on the dark closing-CTA bands — floor and ceiling.
 *
 * WHY THIS IS SVG AND NOT CSS 3D. It was `perspective` + `rotateX` on two background-gradient
 * planes, and that failed three times for the same underlying reason: with a 3D rotation, where
 * the paint actually lands is a non-linear function of the plane's height, the angle, the
 * perspective distance AND the band's own height — so every value had to be guessed, and each
 * guess broke a different axis:
 *
 *   1. rotateX squashes the plane's vertical axis by cos(angle). At 78° that's 0.21, so the
 *      HORIZONTAL lines (whose thickness lives on that axis) rendered 1px as 0.21px and all but
 *      disappeared, while the verticals kept a full 1px. They looked like two different grids.
 *   2. Thickening the horizontals to 5px fixed their weight but a 132px row pitch left only
 *      ~2 rows in a 310px plane — two stripes, not a grid.
 *   3. Deepening the plane to 160% to win rows back made each plane 619px inside a 387px band,
 *      so the floor and ceiling boxes overlapped through the middle and ruled lines straight
 *      across the copy.
 *
 * Here every line's endpoints are computed, so the geometry is exact and checkable, and both
 * axes take the same 1px stroke because nothing is foreshortened. `preserveAspectRatio="none"`
 * means the result no longer depends on the band's measured height at all.
 */

// viewBox units. Only ratios matter — the SVG stretches to whatever the band is.
const W = 1200
const H = 420
const DEPTH = 120 // how far the floor/ceiling runs before reaching its horizon
const ROWS = 8
// Sets how fast rows bunch toward the horizon, and therefore how far apart the FIRST two sit:
// the opening gap is DEPTH * RATIO/(1+RATIO), so a LOWER ratio starts tighter (it's the one
// counter-intuitive knob here — lower means more even, which means a smaller first step).
// 0.55 opened at 47px; 0.38 opens at 33px.
const RATIO = 0.38
const COLS = 15
// Where the fade finishes, as a fraction of DEPTH. Below 1 so the grid dissolves BEFORE its own
// horizon — no hard vanishing line, and the rows that pile up too densely to resolve are gone
// before they get there. It also decides how many rows are worth drawing: at 0.62 the last
// visible row is ~the 5th, so ROWS above ~8 would just be invisible markup.
const FADE_END = 0.62
const SPREAD = W * 1.9 // near-edge width of the fan; wider than the viewBox so it fills the band

// Distance of row `i` above the near edge. The 1/(1 + r·i) term is what makes successive rows
// closer together as they recede — verified monotonic decreasing.
const rowOffsets = Array.from({ length: ROWS }, (_, i) => DEPTH * (1 - 1 / (1 + RATIO * i)))

// Where each vertical line meets the near edge. They all converge on the vanishing point.
const colX = Array.from({ length: COLS }, (_, i) => (W - SPREAD) / 2 + (SPREAD * i) / (COLS - 1))

const VP_X = W / 2

type PlaneProps = { id: string; kind: 'floor' | 'ceiling' }

function Plane({ id, kind }: PlaneProps) {
  // The floor grows upward from y = H; the ceiling mirrors it downward from y = 0.
  const near = kind === 'floor' ? H : 0
  const at = (offset: number) => (kind === 'floor' ? near - offset : near + offset)
  const horizon = at(DEPTH)

  return (
    <g mask={`url(#${id})`}>
      {colX.map((x) => (
        <line
          key={`v${x}`}
          x1={x}
          y1={near}
          x2={VP_X}
          y2={horizon}
          stroke="#fff"
          strokeOpacity="0.3"
          strokeWidth="1"
          // Required, because preserveAspectRatio="none" scales x and y by different factors
          // (≈1.18 and ≈0.92 at the bands' real size). Without this a vertical stroke would
          // scale by x and a horizontal one by y, leaving them ~28% apart — a much smaller
          // version of the exact mismatch this whole component exists to eliminate. This pins
          // every stroke to 1 device-independent pixel whatever the transform.
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
          stroke="#fff"
          // Rows fade with depth on their own as well as under the mask — a distant line in a
          // real perspective view is both thinner and dimmer, and stroke-opacity is the only one
          // of those two we can vary without the thickness problem that started all this.
          strokeOpacity={(0.42 * (1 - i / ROWS)).toFixed(3)}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </g>
  )
}

export default function CTAGrid() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        {/* Dissolves each plane before it reaches its own horizon, so there's no hard vanishing
            line and no dense pile-up of rows where they converge. */}
        {/* Three stops rather than two: the middle one pulls most of the falloff into the first
            third, so the grid is already dissolving well before FADE_END instead of dimming at a
            constant rate all the way down. */}
        <linearGradient id="cbGridFadeFloor" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset={`${FADE_END * 45}%`} stopColor="#fff" stopOpacity="0.4" />
          <stop offset={`${FADE_END * 100}%`} stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cbGridFadeCeiling" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset={`${FADE_END * 45}%`} stopColor="#fff" stopOpacity="0.4" />
          <stop offset={`${FADE_END * 100}%`} stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="cbGridMaskFloor" maskUnits="userSpaceOnUse" x="0" y={H - DEPTH} width={W} height={DEPTH}>
          <rect x="0" y={H - DEPTH} width={W} height={DEPTH} fill="url(#cbGridFadeFloor)" />
        </mask>
        <mask id="cbGridMaskCeiling" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={DEPTH}>
          <rect x="0" y="0" width={W} height={DEPTH} fill="url(#cbGridFadeCeiling)" />
        </mask>
      </defs>
      <Plane id="cbGridMaskCeiling" kind="ceiling" />
      <Plane id="cbGridMaskFloor" kind="floor" />
    </svg>
  )
}
