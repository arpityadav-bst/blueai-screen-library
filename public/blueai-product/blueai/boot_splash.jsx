// BlueAI — Boot Splash + Shimmer utility
// Exports: BootSplash, Shimmer

(function () {
  const { useState, useEffect } = React;

  /* ── Shimmer block ─────────────────────────────────────────── */
  function Shimmer({ w = '100%', h, r = 8, extra = {} }) {
    return (
      <div style={{
        width: w, height: h, borderRadius: r, flexShrink: 0,
        background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
        backgroundSize: '800px 100%',
        animation: 'ba-shimmer 1.4s ease-in-out infinite',
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

    return (
      <div style={{
        position: 'absolute', inset: 0, zIndex: 200,
        background: 'white',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.5s ease',
        pointerEvents: fading ? 'none' : 'auto',
        userSelect: 'none',
      }}>
        {/* Logo */}
        <img src="assets/Logo.png" alt="" style={{ width: 64, height: 64, marginBottom: 16 }}
          onError={e => { e.target.style.display = 'none'; }} />

        {/* Brand name */}
        <span style={{
          background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          fontSize: 34, fontWeight: 800, letterSpacing: '-0.5px',
          marginBottom: 48, fontFamily: 'inherit', lineHeight: 1,
        }}>BlueAI</span>

        {/* Bouncing dots */}
        <div style={{ display: 'flex', gap: 9, marginBottom: 22 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: i === 1 ? '#7B4CFF' : '#0EA4C5',
              animation: `ba-bounce 1.1s ease-in-out ${i * 0.18}s infinite`,
            }} />
          ))}
        </div>

        {/* Status message */}
        <p style={{
          fontSize: 13.5, color: '#94a3b8', fontWeight: 500,
          fontFamily: 'inherit', transition: 'opacity 0.3s',
        }}>{MSGS[idx]}</p>
      </div>
    );
  }

  /* ── Home skeleton (chat cold-start; mirrors ProductHome's card list) ── */
  function HomeSkeleton() {
    const card = (focused) => ({
      background: 'white',
      border: '1px solid ' + (focused ? '#bcd6f5' : '#e2e8f0'),
      borderRadius: 12, padding: '11px 12px',
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
