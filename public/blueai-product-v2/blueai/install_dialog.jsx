// BlueAI — "additional files required" installer dialog.
// Exports: window.InstallDialog
//
// ONE state machine (idle → downloading → done → onComplete). ONE skin now, dark/BlueStacks
// (Flow A: BlueStacks is installed, BlueAI is not) — the light/"blueai" skin this file used to
// also render was Flow B's, and Flow B stopped using any modal (2026-08-10, see
// needs_bluestacks.jsx's ProgressBubble — installing BlueStacks is an inline chat card now, not
// a popup). Removed that branch outright rather than leave it unreachable.
//
// Rebuilt again (2026-08-11) into a centered "onboarding" layout (badge → title → subtitle →
// divider → body copy → CTA → wave), modeled on a real BlueStacks login-dialog reference. First
// pass also copied that reference's rounded corners onto the card and button — overriding the
// designer's own explicit, direct rule from earlier this session ("no round radius in any
// container or CTA in the BlueStacks App Player UI") based on a personal read of ONE image,
// without checking back first. Corrected same day: card and button are sharp again, radius 0,
// matching that rule and the other four confirm/utility dialogs. The ONE rounding exception that
// survives is the circular badge/checkmark — an identity/completion mark, not chrome, same
// precedent as the done-screen's own checkmark badge already established.
//
// Progress is INDETERMINATE by design. A percentage would claim we know how far along a
// download is, and nothing here downloads anything.

(function () {
  const { useState, useEffect, useRef } = React;

  const IcoX = ({ size = 14, strokeWidth = 2.2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
    </svg>);

  const IcoCheck = ({ size = 15, strokeWidth = 2.6 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>);

  // Same glyph the product window's own titlebar minimize button already uses (index.html's
  // ProductTitlebar) — reused here rather than invented, so the two minimize affordances in the
  // same app read as one convention.
  const IcoMinimize = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 10 10"><rect x="1" y="4.6" width="8" height="1" fill="currentColor" /></svg>);

  // Best-guess match to the real BlueStacks App Player's UI font from the reference
  // screenshots (Poppins) — falls back to the Segoe stack if it fails to load or the guess
  // is wrong. Title weight is also dropped from 700→600 regardless (designer's explicit
  // fallback instruction), so the dialog reads lighter even if the font guess doesn't land.
  const BS_FONT = '"Poppins", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif';


  /* The wave behind the CTA — the same idea as boot.js's pixel logo/rain in blueai-desktop
     (small squares, brand gradient, always moving), rebuilt fresh for this no-canvas prototype
     rather than ported: that engine is a full grid-assembly particle system with no single
     "wave" output to lift, and blueai-product doesn't share code with blueai-desktop at all
     (separate design systems by project convention). This is TWO overlapping SVG layers of the
     exact same wavy path — one filled with the brand's own cyan→purple gradient (the "color
     tone" asked for), one filled with a small-square pattern at low opacity (the "pixel" texture)
     — drawn twice side by side and scrolled by exactly one tile-width so the loop is seamless.
     translateX animates -400px → 0, i.e. content moves toward larger X — rightward on screen,
     not the app's existing `ba-marquee` direction (which moves left). */
  function PixelWave({ height = 108 }) {
    const TILE_W = 400, HUMPS = 4, H = height, HW = TILE_W / HUMPS;
    const buildPath = (ox) => {
      let d = 'M' + ox + ',' + (H * 0.62);
      for (let i = 0; i < HUMPS; i++) {
        const x0 = ox + i * HW;
        d += ' C ' + (x0 + HW * 0.25) + ',' + (H * 0.12) + ' ' + (x0 + HW * 0.25) + ',' + (H * 1.05) + ' ' + (x0 + HW * 0.5) + ',' + (H * 0.62);
        d += ' C ' + (x0 + HW * 0.75) + ',' + (H * 0.18) + ' ' + (x0 + HW * 0.75) + ',' + (H * 1.05) + ' ' + (x0 + HW) + ',' + (H * 0.62);
      }
      return d + ' L ' + (ox + TILE_W) + ',' + H + ' L ' + ox + ',' + H + ' Z';
    };
    const twoTiles = buildPath(0) + ' ' + buildPath(TILE_W);
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: H, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
        <svg width={TILE_W * 2} height={H} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="baWaveGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0EA4C5" /><stop offset="100%" stopColor="#7B4CFF" />
            </linearGradient>
            <pattern id="baWavePixels" width="7" height="7" patternUnits="userSpaceOnUse">
              <rect width="4" height="4" fill="white" />
            </pattern>
          </defs>
          <g className="ba-wave-scroll">
            <path d={twoTiles} fill="url(#baWaveGrad)" opacity="0.85" />
            <path d={twoTiles} fill="url(#baWavePixels)" opacity="0.16" />
          </g>
        </svg>
      </div>);
  }

  /* The progress shell that REPLACES the buttons once the install starts — bar + label, no
     percentage. Shared by both skins; only its palette differs. */
  function ProgressShell({ phase, label, dark }) {
    const done = phase === 'done';
    const ink = done ? (dark ? '#4ade80' : '#16a34a') : (dark ? '#9fb4dd' : '#64748b');
    return (
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: done ? 0 : 9, color: ink }}>
          {done && <IcoCheck />}
          <span style={{ fontSize: 12.5, fontWeight: 600, color: ink, fontFamily: 'inherit' }}>{label}</span>
        </div>
        {!done &&
          <div className="ba-indet"
            style={{ height: 4, borderRadius: 999, background: dark ? '#2b3559' : '#e2e8f0', color: dark ? '#1E7FE0' : '#1990FF' }} />}
      </div>);
  }

  function InstallDialog({
    open, icon, contained,
    title, subtitle, body, body2, meta,
    primaryLabel = 'Download', cancelLabel = 'Not now',
    downloadingLabel = 'Downloading…', doneLabel = 'Installed. Launching it now…',
    downloadMs = 2800, doneMs = 900,
    onCancel, onComplete
  }) {
    const [phase, setPhase] = useState('idle');
    const [minimized, setMinimized] = useState(false);
    const timers = useRef([]);
    const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };

    // Re-arm every time the dialog opens, so a cancelled-then-reopened install starts at idle.
    useEffect(() => { if (open) { clear(); setPhase('idle'); setMinimized(false); } return clear; }, [open]);

    // Esc cancels, but only before the install starts — there is no cancelling a running install.
    useEffect(() => {
      if (!open) return;
      const h = (e) => { if (e.key === 'Escape' && phase === 'idle' && onCancel) onCancel(); };
      document.addEventListener('keydown', h);
      return () => document.removeEventListener('keydown', h);
    }, [open, phase, onCancel]);

    if (!open) return null;

    const label = phase === 'done' ? doneLabel : downloadingLabel;
    const done = phase === 'done';

    // Minimized = render nothing. No chip, no indicator — the window underneath just becomes
    // fully usable again. The download's timers (below, in start()) keep running regardless of
    // what's rendered, so it completes and triggers onComplete on schedule either way; there's
    // nothing to "restore," since minimize only shows up during 'downloading' (see the button
    // below), a phase this dialog auto-advances out of on its own.
    if (minimized) return null;

    const start = () => {
      setPhase('downloading');
      timers.current.push(setTimeout(() => setPhase('done'), downloadMs));
      timers.current.push(setTimeout(() => { onComplete && onComplete(); }, downloadMs + doneMs));
    };

    /* `contained` scopes the dialog to the window that raised it — absolute inside that window's
       box rather than fixed over the whole viewport. A real app's modal dims its OWN window, not
       your entire Windows desktop, and the designer's BlueStacks references show exactly that:
       the player content behind the dialog is dimmed, everything outside it is not. */
    const overlay = {
      position: contained ? 'absolute' : 'fixed', inset: 0, zIndex: 400,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(4,8,20,0.5)', padding: contained ? 16 : 24, cursor: 'default'
    };

    const iconBtn = { width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: 0, background: 'none', color: '#98A2C4', cursor: 'pointer', padding: 0 };
    const closeMini = { onMouseEnter: (e) => e.currentTarget.style.background = '#2B3559', onMouseLeave: (e) => e.currentTarget.style.background = 'none' };

    const btn = { border: 'none', borderRadius: 0, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 130ms ease, opacity 130ms ease' };
    const ICON_SIZE = 44, ICON_GAP = 14;

    return (
      <div style={overlay} onMouseDown={(e) => { if (e.target === e.currentTarget && phase === 'idle' && onCancel) onCancel(); }}>
        <div role="dialog" aria-modal="true" aria-label={title}
          style={{ position: 'relative', width: 420, background: '#1E2440', borderRadius: 0, boxShadow: '0 24px 70px rgba(0,0,0,0.55)', fontFamily: BS_FONT, padding: '24px 24px 22px' }}>

          {done ? (
            /* Success screen — unchanged throughout every rebuild this component has had. */
            <div style={{ textAlign: 'center', padding: '10px 4px 6px' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(74,222,128,0.14)', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                <IcoCheck size={28} strokeWidth={2.4} />
              </div>
              <h2 style={{ fontSize: 17, fontWeight: 600, color: '#F2F5FF', lineHeight: 1.35, textWrap: 'balance' }}>{doneLabel}</h2>
            </div>
          ) : (
            <>
              {/* Left-aligned structure (2026-08-11, designer: "how it was earlier, only before
                 we made it centre aligned, but with this new data"). Icon moved back beside
                 title+subtitle (designer's next correction, same session) rather than beside the
                 body copy — so body/body2/meta now run full-width, nothing left to indent past
                 an icon that isn't in that row anymore. Centering, the circular gradient badge,
                 and the wave-behind-the-footer are all gone with the layout revert; the wave
                 specifically doesn't carry over cleanly onto a small flex-end button row (it was
                 built to sit behind a full-width button with clear space below), so it's dropped
                 here rather than force-fit. Sharp corners / no-glow stay — that correction fixed a
                 real contradiction with the designer's own rule, unrelated to the layout question. */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: ICON_GAP }}>
                {icon &&
                  <img src={icon} alt="" style={{ width: ICON_SIZE, height: ICON_SIZE, flexShrink: 0 }} onError={(e) => { e.target.style.display = 'none'; }} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 500, color: '#F2F5FF', lineHeight: 1.1, textWrap: 'balance' }}>{title}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                      {phase === 'downloading' &&
                        <button aria-label="Minimize" onClick={() => setMinimized(true)} style={iconBtn} {...closeMini}><IcoMinimize size={16} /></button>}
                      {phase === 'idle' &&
                        <button aria-label="Close" onClick={onCancel} style={iconBtn} {...closeMini}><IcoX size={20} strokeWidth={1.6} /></button>}
                    </div>
                  </div>
                  {subtitle && <p style={{ fontSize: 13, fontWeight: 600, color: '#5B9CF6', lineHeight: 1.2, marginTop: 2 }}>{subtitle}</p>}
                </div>
              </div>

              <div style={{ height: 1, background: '#2B3559', margin: '16px 0' }} />

              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#98A2C4' }}>{body}</p>
              {body2 && <p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#98A2C4', marginTop: 10 }}>{body2}</p>}
              {meta && phase === 'idle' && <p style={{ fontSize: 12, color: '#6F7BA4', marginTop: 10 }}>{meta}</p>}

              {/* footer: right-aligned button pair, or the progress shell mid-download */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
                {phase === 'idle' ? (
                  <>
                    <button onClick={onCancel}
                      style={{ ...btn, background: '#F2F5FF', color: '#1E2440' }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                      {cancelLabel}
                    </button>
                    <button onClick={start} autoFocus
                      style={{ ...btn, background: '#1E7FE0', color: 'white' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#1B72CC'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#1E7FE0'}>
                      {primaryLabel}
                    </button>
                  </>
                ) : <div style={{ width: '100%' }}><ProgressShell phase={phase} label={label} dark /></div>}
              </div>
            </>
          )}
        </div>
      </div>);
  }

  window.InstallDialog = InstallDialog;
})();
