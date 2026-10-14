// BlueAI: Boot Splash + Shimmer utility
// Exports: BootSplash, Shimmer

(function () {
  const { useState, useEffect } = React;

  /* ── Shimmer block ─────────────────────────────────────────── */
  function Shimmer({ w = '100%', h, r = 8, extra = {} }) {
    return (
      <div style={{
        width: w, height: h, borderRadius: r, flexShrink: 0,
        // Target skeleton (V3 Phase 1): sunken base with a hairline-dark sweep, on the token clock.
        background: 'linear-gradient(90deg, var(--v2-surface-sunken) 25%, var(--v2-line-hair) 50%, var(--v2-surface-sunken) 75%)',
        backgroundSize: '800px 100%',
        animation: 'ba-shimmer var(--v2-dur-shimmer) ease-in-out infinite',
        ...extra,
      }} />
    );
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

    /* V3 Phase 1, the Target splash (design-md 33): surface ground, the onBlue BlueAI logo, three
       6px blue dots pulsing (progress, not brand), one status line in ink-3. Same two messages and
       the same timings as before; the fade runs on --v2-dur-4 with the departure curve, well inside
       the 500ms before onDone. Reduced motion stops the dots (.ba-splash-dot in index.html). */
    return (
      <div style={{
        position: 'absolute', inset: 0, zIndex: 'var(--v2-z-splash)',
        background: 'var(--v2-surface)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--v2-font-ui)',
        opacity: fading ? 0 : 1,
        transition: 'opacity var(--v2-dur-4) var(--v2-ease-in)',
        pointerEvents: fading ? 'none' : 'auto',
        userSelect: 'none',
      }}>
        <window.BlueAILogo size={30} />

        <div aria-hidden="true" style={{ display: 'flex', gap: 'var(--v2-space-15)', marginTop: 'var(--v2-space-10)' }}>
          {[0, 1, 2].map(i => (
            <span key={i} className="ba-splash-dot" style={{ animationDelay: 'calc(var(--v2-dur-pulse) * ' + i + ' / 6)' }} />
          ))}
        </div>

        <p role="status" style={{
          marginTop: 'var(--v2-space-3)',
          fontSize: 'var(--v2-text-13)', lineHeight: 'var(--v2-leading-snug)',
          color: 'var(--v2-ink-3)', fontWeight: 'var(--v2-weight-regular)',
        }}>{MSGS[idx]}</p>
      </div>
    );
  }

  /* ── Home skeleton (chat cold-start; mirrors ProductHome's card list) ── */
  function HomeSkeleton() {
    const card = (focused) => ({
      background: 'var(--v2-surface)',
      border: 'var(--v2-stroke) solid ' + (focused ? 'var(--v2-blue-tint-line)' : 'var(--v2-line)'),
      borderRadius: 'var(--v2-radius-md)', padding: '11px 12px',
      display: 'flex', alignItems: 'center', gap: 12,
    });
    return (
      <div>
        {/* "WHAT WOULD YOU LIKE TO DO?" label placeholder */}
        <Shimmer w={150} h={9} r={4} extra={{ marginBottom: 12 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={card(false)}>
              <Shimmer w={36} h={36} r={10} />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                <Shimmer w="46%" h={10} r={5} />
                <Shimmer w="82%" h={9} r={5} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <Shimmer w={34} h={9} r={5} />
                <Shimmer w={10} h={10} r={3} />
              </div>
            </div>
          ))}
          {/* last card lands focused, as in the live cold-start */}
          <div style={card(true)}>
            <Shimmer w={32} h={32} r="50%" />
            <Shimmer w="58%" h={10} r={5} />
          </div>
        </div>
      </div>
    );
  }

  Object.assign(window, { BootSplash, Shimmer, HomeSkeleton });
})();
