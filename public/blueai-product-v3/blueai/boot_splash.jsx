// BlueAI: Boot Splash + Shimmer utility
// Exports: BootSplash, Shimmer

(function () {
  const { useState, useEffect } = React;

  /* ── Shimmer block ─────────────────────────────────────────── */
  /* The kit's skeleton block (kit/feedback.css .v2-skel) with its shimmer (kit/motion.css
     .v2-anim-shimmer, on the token clock); only the block's size and radius are this call's. */
  function Shimmer({ w = '100%', h, r = 8, extra = {} }) {
    return <div className="v2-skel v2-anim-shimmer" style={{ width: w, height: h, borderRadius: r, flexShrink: 0, ...extra }} />;
  }

  /* ── Boot Splash ───────────────────────────────────────────── */
  function BootSplash({ onDone }) {
    // Live app shows two messages on cold start: "Starting BlueAI…" → "Loading your skills…".
    const MSGS = [
      'Starting BlueAI…',
      'Loading your skills…',
    ];
    const [idx, setIdx]       = useState(0);
    const [fading, setFading] = useState(false);

    useEffect(() => {
      const msgT  = setTimeout(() => setIdx(1),        1050);
      const fadeT = setTimeout(() => setFading(true),  2150);
      const doneT = setTimeout(() => onDone?.(),       2650);
      return () => [msgT, fadeT, doneT].forEach(clearTimeout);
    }, []);

    /* V3 Phase 1, the Target splash (design-md 33), the kit's since review round 1 (kit/shell.css
       .v2-splash): surface ground, the onBlue BlueAI logo, three 6px blue dots pulsing (progress,
       not brand), one status line in ink-3. Same two messages and the same timings as before; the
       fade runs on --v2-dur-4 with the departure curve, well inside the 500ms before onDone. */
    return (
      <div className={'v2-splash' + (fading ? ' is-fading' : '')}>
        <window.BlueAILogo size={30} />
        <div className="v2-splash-dots" aria-hidden="true">
          <span className="v2-splash-dot" /><span className="v2-splash-dot" /><span className="v2-splash-dot" />
        </div>
        <p role="status" className="v2-splash-status">{MSGS[idx]}</p>
      </div>
    );
  }

  /* ── Home skeleton (chat cold-start; mirrors ProductHome's card list) ──
     Review round 1: it matches the real rows (chat.css .v3-row: padding 12, gap 8, radius 10, a
     36px tile at radius 6), and the blue "focused" last card is gone. */
  function HomeSkeleton() {
    const row = {
      display: 'flex', alignItems: 'center', gap: 'var(--v2-space-3)', padding: 'var(--v2-space-3)',
      background: 'var(--v2-surface)', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-md)'
    };
    return (
      <div>
        {/* "What would you like to do?" eyebrow placeholder */}
        <Shimmer w={150} h={9} r={4} extra={{ marginBottom: 'var(--v2-space-2)' }} />
        <div className="v3-rows">
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={row}>
              <Shimmer w="var(--v2-control-md)" h="var(--v2-control-md)" r="var(--v2-radius-sm)" />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-15)' }}>
                <Shimmer w="46%" h={10} r={5} />
                <Shimmer w="82%" h={9} r={5} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--v2-space-1)', flexShrink: 0 }}>
                <Shimmer w={34} h={9} r={5} />
                <Shimmer w={16} h={16} r={4} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  Object.assign(window, { BootSplash, Shimmer, HomeSkeleton });
})();
