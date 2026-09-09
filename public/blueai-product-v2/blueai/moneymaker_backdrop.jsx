// BlueAI — MoneyMaker welcome screen's background decoration layer: the perspective grid, the
// ambient orb backdrop, and the paper grain. Split out of moneymaker.jsx (2026-08-14) when that
// file crossed the workspace's 300-line rule — this is purely decorative and self-contained, so
// it splits cleanly from the actual welcome/home screen logic.
//
// Everything here is PORTED from creator-brand's own design system, not invented — see each
// function's own comment for its source file. Exposes window.MoneyMakerBackdrop = { MMGrid,
// MMBackdrop, MMGrain }.
(function () {
  const { useState, useEffect } = React;

  /* Perspective floor/ceiling grid — ported constant-for-constant from creator-brand's
     CTAGrid.tsx (see that file's header for why the geometry is computed rather than guessed
     via CSS 3D transforms). Two layers, not one: the BASE grid is back to the original flat
     slate (unchanged from before any gradient work), and a second SHINE layer — same line
     geometry, drawn on top — carries the logo's own iris→cyan gradient as a traveling wave that
     is fully transparent at rest and full opacity at its peak, scrolling from the near edge
     toward the horizon on each plane via an SVG spreadMethod="repeat" gradient animated with
     <animateTransform>.

     WHICH columns carry the wave changes every cycle — random 1-3 of the 15, re-picked on a
     timer — while the TIMING (flash for FAST, dark for GAP) stays on one shared clock so the
     whole grid genuinely goes dark together between waves. Pure SMIL can give you one or the
     other but not both at once: a single shared gradient (one <animateTransform>) can only ever
     paint the exact same lines every repeat, since nothing about a periodic animation changes
     between its own cycles — and per-line independent phases (an earlier version here) traded
     away the guaranteed gap to get variety, since 15 clocks running independently meant something
     was always mid-flash somewhere. Picking a fresh random subset with a JS interval, timed to
     the same DUR as the shared gradient's own cycle, is what actually gets both properties at
     once — this is the one part of the effect that genuinely needs JS, not a CSS/SVG trick. */
  function MMGrid() {
    const W = 1200, H = 420, DEPTH = 120, ROWS = 8, RATIO = 0.38, COLS = 15, FADE_END = 0.62;
    const SPREAD = W * 1.9;
    const TILE = 180;
    const rowOffsets = Array.from({ length: ROWS }, (_, i) => DEPTH * (1 - 1 / (1 + RATIO * i)));
    const colX = Array.from({ length: COLS }, (_, i) => (W - SPREAD) / 2 + (SPREAD * i) / (COLS - 1));
    const VP_X = W / 2;
    const STROKE = '#64748b';

    // FAST = how long the streak takes to cross a fixed point (the quick "shiner" flash); GAP =
    // the requested quiet period between waves. Every shine-carrying column shares this one
    // clock, so they flash together and go fully dark together, with zero drift between them.
    const FAST = 0.9, GAP = 2.5, DUR = FAST + GAP;

    // Picks a fresh random count (1–3) and that many distinct random columns out of the 15 —
    // called once on mount and then again every DUR seconds, so each wave lights up a different
    // subset instead of the same fixed set every time.
    const pickShineCols = () => {
      const count = 1 + Math.floor(Math.random() * 3);
      const pool = Array.from({ length: COLS }, (_, i) => i);
      const chosen = [];
      for (let k = 0; k < count && pool.length; k++) chosen.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
      return chosen;
    };
    const [shineCols, setShineCols] = useState(pickShineCols);
    useEffect(() => {
      const id = setInterval(() => setShineCols(pickShineCols()), DUR * 1000);
      return () => clearInterval(id);
    }, []);

    function Plane({ id, kind }) {
      const near = kind === 'floor' ? H : 0;
      const at = (offset) => (kind === 'floor' ? near - offset : near + offset);
      const horizon = at(DEPTH);
      const shineStroke = `url(#mmShine${kind === 'floor' ? 'Floor' : 'Ceiling'})`;
      return (
        <g mask={`url(#${id})`}>
          {/* base grid — the original look, untouched, on every column */}
          {colX.map((x, i) => (
            <line key={'bv' + i} x1={x} y1={near} x2={VP_X} y2={horizon} stroke={STROKE} strokeOpacity="0.16" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
          {rowOffsets.map((o, i) => (
            <line key={'bh' + i} x1={0} y1={at(o)} x2={W} y2={at(o)} stroke={STROKE} strokeOpacity={(0.22 * (1 - i / ROWS)).toFixed(3)} strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
          {/* shine overlay — only on this cycle's shineCols (random 1–3, re-picked every DUR —
             see the effect above), all sharing the SAME synchronized gradient, so whichever lines
             are chosen this cycle flash together and go dark together as one wave. Thicker than
             the base line (1.8 vs 1) so the pulse reads as bolder, not just brighter. */}
          {shineCols.map((i) => (
            <line key={'sv' + i} x1={colX[i]} y1={near} x2={VP_X} y2={horizon} stroke={shineStroke} strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
          ))}
        </g>);
    }

    /* Stop-width is FAST/DUR of the tile (~26.5%), so a fixed point sees the streak for
       FAST=0.9s and sits dark for the remaining GAP=2.5s of every DUR=3.4s cycle. Purely
       additive (the base grid supplies the resting look), so it stays 0 opacity everywhere
       outside the streak. */
    const streakPct = (FAST / DUR) * 100;
    const shineStops = (
      <>
        <stop offset="0%" stopColor="#7B4CFF" stopOpacity="0" />
        <stop offset={`${(50 - streakPct / 2).toFixed(1)}%`} stopColor="#7B4CFF" stopOpacity="0" />
        <stop offset={`${(50 - streakPct / 2 + 3).toFixed(1)}%`} stopColor="#7B4CFF" stopOpacity="0.6" />
        <stop offset="50%" stopColor="#0EA4C5" stopOpacity="0.6" />
        <stop offset={`${(50 + streakPct / 2 - 3).toFixed(1)}%`} stopColor="#0EA4C5" stopOpacity="0.3" />
        <stop offset={`${(50 + streakPct / 2).toFixed(1)}%`} stopColor="#0EA4C5" stopOpacity="0" />
        <stop offset="100%" stopColor="#0EA4C5" stopOpacity="0" />
      </>);

    /* One shared gradient per plane (not one per line) — that's what makes whichever columns are
       in shineCols this cycle flash and go dark IN SYNC, with the same FAST/GAP rhythm holding
       across all of them regardless of which lines they happen to be.

       DIRECTION (flipped 2026-08-18): the wave now travels FROM the horizon TOWARD the viewer,
       not away from it — so both signs below are inverted from the original. Each gradient's axis
       runs near-edge → horizon, so translating the pattern back along that axis walks the streak
       toward the near edge. Floor's near edge is the LARGER y (H), so toward-viewer is positive;
       ceiling's near edge is y=0, so toward-viewer is negative. The two signs differ because the
       planes face opposite ways, not by accident — flipping only one would send the floor and
       ceiling waves in opposite directions. */
    return (
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          {/* fill stays white — this is an alpha mask (varying opacity only), not a color; the
             grid's own visible color comes from each <line>'s stroke, set above. */}
          <linearGradient id="mmFadeFloor" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset={`${FADE_END * 45}%`} stopColor="#fff" stopOpacity="0.4" />
            <stop offset={`${FADE_END * 100}%`} stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="mmFadeCeiling" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset={`${FADE_END * 45}%`} stopColor="#fff" stopOpacity="0.4" />
            <stop offset={`${FADE_END * 100}%`} stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="mmMaskFloor" maskUnits="userSpaceOnUse" x="0" y={H - DEPTH} width={W} height={DEPTH}>
            <rect x="0" y={H - DEPTH} width={W} height={DEPTH} fill="url(#mmFadeFloor)" />
          </mask>
          <mask id="mmMaskCeiling" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={DEPTH}>
            <rect x="0" y="0" width={W} height={DEPTH} fill="url(#mmFadeCeiling)" />
          </mask>
          <linearGradient id="mmShineFloor" gradientUnits="userSpaceOnUse" x1="0" y1={H} x2="0" y2={H - TILE} spreadMethod="repeat">
            {shineStops}
            <animateTransform attributeName="gradientTransform" type="translate" from="0 0" to={`0 ${TILE}`} dur={`${DUR}s`} repeatCount="indefinite" />
          </linearGradient>
          <linearGradient id="mmShineCeiling" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={TILE} spreadMethod="repeat">
            {shineStops}
            <animateTransform attributeName="gradientTransform" type="translate" from="0 0" to={`0 ${-TILE}`} dur={`${DUR}s`} repeatCount="indefinite" />
          </linearGradient>
        </defs>
        <Plane id="mmMaskCeiling" kind="ceiling" />
        <Plane id="mmMaskFloor" kind="floor" />
      </svg>);
  }

  /* Ambient backdrop — ported from creator-brand's own Backdrop.tsx (.cb-orb): large blurred
     radial-gradient circles in the exact same brand colors/alphas (iris, cyan, marketing blue),
     just resized from that page's full-viewport vw units down to fixed px that make sense in
     this 420px-wide panel (vw would resolve against the whole desktop scene, not this window). */
  function MMBackdrop() {
    const orb = (bg, style) => <div aria-hidden="true" style={{ position: 'absolute', zIndex: 1, borderRadius: '50%', filter: 'blur(48px)', opacity: 0.34, background: bg, pointerEvents: 'none', ...style }} />;
    return (
      <>
        {orb('radial-gradient(circle at center, rgba(123,76,255,.55), transparent 68%)', { width: 220, height: 220, top: -60, left: -60 })}
        {orb('radial-gradient(circle at center, rgba(14,164,197,.5), transparent 68%)', { width: 200, height: 200, bottom: 40, right: -70 })}
        {orb('radial-gradient(circle at center, rgba(47,109,255,.44), transparent 68%)', { width: 160, height: 160, bottom: -50, left: 30 })}
      </>);
  }

  /* Page-wide paper grain — creator-brand's own .cb-grain, same feTurbulence recipe and the
     same 3% opacity/multiply-blend (this screen is small enough that the scroll-repaint cost
     that treatment's own comment warns about, on a 10,000px marketing page, doesn't apply). */
  function MMGrain() {
    return (
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0.03, mixBlendMode: 'multiply', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />);
  }

  window.MoneyMakerBackdrop = { MMGrid, MMBackdrop, MMGrain };
})();
