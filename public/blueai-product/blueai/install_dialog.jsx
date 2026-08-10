// BlueAI — "additional files required" installer dialog.
// Exports: window.InstallDialog
//
// ONE component, ONE state machine (idle → downloading → done → onComplete), TWO skins:
//
//   skin="bluestacks"  BlueStacks App Player is doing the talking (Flow A: BlueStacks is
//                      installed, BlueAI is not). Dark navy chrome, header strip, tight
//                      4-6px radii, buttons bottom-right — Windows-app idioms, rebuilt from
//                      the designer's Media Gallery / Manager / New-instance references. It
//                      must NOT look like BlueAI; that difference is the whole point.
//
//   skin="blueai"      BlueAI is doing the talking (Flow B: BlueAI is installed, BlueStacks
//                      is not). The product's own light system. A BlueStacks-dark dialog for
//                      software that isn't installed yet would misattribute the voice.
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

  // Best-guess match to the real BlueStacks App Player's UI font from the reference
  // screenshots (Poppins) — falls back to the Segoe stack if it fails to load or the guess
  // is wrong. Title weight is also dropped from 700→600 regardless (designer's explicit
  // fallback instruction), so the dialog reads lighter even if the font guess doesn't land.
  const BS_FONT = '"Poppins", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif';

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
    open, skin = 'blueai', icon, contained,
    title, body, meta,
    primaryLabel = 'Download and Install', cancelLabel = 'Not now',
    downloadingLabel = 'Downloading…', doneLabel = 'Installed. Launching it now…',
    downloadMs = 2800, doneMs = 900,
    onCancel, onComplete
  }) {
    const [phase, setPhase] = useState('idle');
    const timers = useRef([]);
    const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };

    // Re-arm every time the dialog opens, so a cancelled-then-reopened install starts at idle.
    useEffect(() => { if (open) { clear(); setPhase('idle'); } return clear; }, [open]);

    // Esc cancels, but only before the install starts — there is no cancelling a running install.
    useEffect(() => {
      if (!open) return;
      const h = (e) => { if (e.key === 'Escape' && phase === 'idle' && onCancel) onCancel(); };
      document.addEventListener('keydown', h);
      return () => document.removeEventListener('keydown', h);
    }, [open, phase, onCancel]);

    if (!open) return null;

    const start = () => {
      setPhase('downloading');
      timers.current.push(setTimeout(() => setPhase('done'), downloadMs));
      timers.current.push(setTimeout(() => { onComplete && onComplete(); }, downloadMs + doneMs));
    };

    const dark = skin === 'bluestacks';
    const label = phase === 'done' ? doneLabel : downloadingLabel;
    /* `contained` scopes the dialog to the window that raised it — absolute inside that window's
       box rather than fixed over the whole viewport. A real app's modal dims its OWN window, not
       your entire Windows desktop, and the designer's BlueStacks references show exactly that:
       the player content behind the dialog is dimmed, everything outside it is not. */
    const overlay = {
      position: contained ? 'absolute' : 'fixed', inset: 0, zIndex: 400,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: dark ? 'rgba(4,8,20,0.5)' : 'rgba(15,23,42,0.44)',
      padding: contained ? 16 : 24,     // contained in the 421px product window, 380 + 32 fits
      cursor: 'default'
    };

    /* ── BlueStacks skin ─────────────────────────────────────────────────────────────────
       Rebuilt twice against the real reference screenshots — second pass (2026-08-10)
       corrects the first, which over-rounded everything (16px radius, rounded buttons) on a
       mistaken read of the same five images. Designer's direct correction, looking at the
       same screenshots: BlueStacks' own chrome has NO rounding anywhere — not the dialog
       panel, not the buttons, not the icon's container. The one place softness survives is
       inside an icon's own artwork (e.g. the white rounded box under the clapperboard in the
       "Login successful" reference) — that shape is baked into the PNG, not drawn by this
       dialog's CSS, so it isn't a counterexample.
       Also corrected: the close ✕ is thinner and larger (was 14px/2.2 stroke, now 20px/1.6),
       and the "done" phase is a real success SCREEN — icon + message, replacing the
       explanatory content entirely — modelled on the "Login successful" reference, rather
       than a small checkmark squeezed into the footer where the buttons used to be. */
    if (dark) {
      const btn = { border: 'none', borderRadius: 0, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 130ms ease, opacity 130ms ease' };
      const done = phase === 'done';
      const ICON_SIZE = 52, ICON_GAP = 18;
      return (
        <div style={overlay} onMouseDown={(e) => { if (e.target === e.currentTarget && phase === 'idle' && onCancel) onCancel(); }}>
          <div role="dialog" aria-modal="true" aria-label={title}
            style={{ position: 'relative', width: 420, background: '#1E2440', borderRadius: 0, boxShadow: '0 24px 70px rgba(0,0,0,0.55)', fontFamily: BS_FONT, padding: '24px 24px 22px' }}>
            {done ? (
              /* Success screen — the explanatory header/body/meta/buttons are gone, not
                 hidden-in-place, matching how "Login successful" replaces its own idle
                 content rather than appending a status line to it. No CTA: this is a
                 transient state that auto-advances (onComplete), so a button here would be
                 a dead affordance, unlike the reference's non-advancing "Okay". */
              <div style={{ textAlign: 'center', padding: '10px 4px 6px' }}>
                {/* Circular by design exception, not oversight: the "no rounding anywhere" rule
                   (see the block comment above) came from five real dialogs, none of which show
                   a success badge — a square reads wrong specifically for a completion checkmark,
                   where a circle is the near-universal shape. Scoped to just this one badge. */}
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(74,222,128,0.14)', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                  <IcoCheck size={28} strokeWidth={2.4} />
                </div>
                <h2 style={{ fontSize: 17, fontWeight: 600, color: '#F2F5FF', lineHeight: 1.35, textWrap: 'balance' }}>{doneLabel}</h2>
              </div>
            ) : (
              <>
                {/* Title + close, same row — designer correction (2026-08-10): the ✕ used to sit
                   absolutely positioned in the corner, disconnected from the title's own line;
                   this puts them on one baseline instead, so the title reads as the row's other
                   half rather than something the ✕ happens to float near. */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, color: '#F2F5FF', lineHeight: 1.3, textWrap: 'balance' }}>{title}</h2>
                  {phase === 'idle' &&
                    <button aria-label="Close" onClick={onCancel}
                      style={{ flexShrink: 0, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: 0, background: 'none', color: '#98A2C4', cursor: 'pointer', padding: 0 }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#2B3559'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                      <IcoX size={20} strokeWidth={1.6} />
                    </button>}
                </div>
                {/* Icon + body, same row — designer correction: the icon used to sit beside the
                   TITLE (matching the "Disk cleanup" reference); moved beside the BODY copy
                   instead. ICON_SIZE/ICON_GAP are shared with meta's indent below, so the
                   metadata line lines up with where the body TEXT starts, not with the icon —
                   two hard-coded numbers here would drift apart the next time either changes. */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: ICON_GAP, marginTop: 14 }}>
                  {icon &&
                    <img src={icon} alt="" style={{ width: ICON_SIZE, height: ICON_SIZE, flexShrink: 0 }} onError={(e) => { e.target.style.display = 'none'; }} />}
                  <p style={{ flex: 1, minWidth: 0, fontSize: 13.5, lineHeight: 1.6, color: '#98A2C4' }}>{body}</p>
                </div>
                {meta && <p style={{ fontSize: 12, color: '#6F7BA4', marginTop: 10, marginLeft: icon ? ICON_SIZE + ICON_GAP : 0 }}>{meta}</p>}
                {/* footer: right-aligned button pair (Close App Player / Disk cleanup both use
                   this exact shape), or the progress shell that replaces it mid-download */}
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

    /* ── BlueAI skin ───────────────────────────────────────────────────────────────────
       Matched to the product's own "explain, then one CTA" card family (ByokUpsell,
       CreditsByokRow, OutOfCreditsModal in byok.jsx) rather than freehanded: centered icon
       badge → centered title/body → a muted metadata pill → one full-width PILL primary
       button with the house glow shadow. Dismiss is the ✕ alone, same as every other card
       in that family — a second "Cancel" text link duplicated it without adding a choice. */
    return (
      <div style={overlay} onMouseDown={(e) => { if (e.target === e.currentTarget && phase === 'idle' && onCancel) onCancel(); }}>
        <div role="dialog" aria-modal="true" aria-label={title}
          style={{ position: 'relative', width: '100%', maxWidth: 340, background: 'white', border: '1px solid #e2e8f0', borderRadius: 20, boxShadow: '0 24px 60px rgba(15,23,42,0.24)', padding: '30px 26px 26px', textAlign: 'center' }}>
          {phase === 'idle' &&
            <button aria-label="Close" onClick={onCancel}
              style={{ position: 'absolute', top: 14, right: 14, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: 8, background: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#475569'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94a3b8'; }}>
              <IcoX size={15} />
            </button>}
          {icon &&
            <div style={{ width: 58, height: 58, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(14,164,197,0.14),rgba(123,76,255,0.14))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <img src={icon} alt="" style={{ width: 28, height: 28, borderRadius: 6 }} onError={(e) => { e.target.style.display = 'none'; }} />
            </div>}
          {/* textWrap: balance — not maxWidth tuning or copy-rewriting — is what keeps this
             orphan-proof: title/body are shared strings across installer configs (see
             INSTALLERS in index.html), so the fix has to hold for whatever text lands here,
             not just today's wording. "BlueStacks App Player required" was stranding
             "required" alone on its own line before this. */}
          <h2 style={{ fontSize: 19, fontWeight: 800, color: '#080a1f', letterSpacing: '-0.2px', lineHeight: 1.3, textWrap: 'balance' }}>{title}</h2>
          <p style={{ fontSize: 13.5, lineHeight: 1.55, color: '#565977', marginTop: 8, maxWidth: 264, marginLeft: 'auto', marginRight: 'auto', textWrap: 'balance' }}>{body}</p>
          {meta &&
            <div style={{ display: 'inline-flex', alignItems: 'center', marginTop: 14, padding: '5px 13px', borderRadius: 999, background: '#f1f5f9' }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#565977' }}>{meta}</span>
            </div>}

          <div style={{ marginTop: 22 }}>
            {phase === 'idle' ? (
              <button onClick={start} autoFocus
                style={{ width: '100%', background: '#1990FF', border: 'none', borderRadius: 999, padding: '13px 22px', fontSize: 14.5, fontWeight: 700, color: 'white', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 20px rgba(25,144,255,0.28)', transition: 'opacity 0.15s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                {primaryLabel}
              </button>
            ) : <ProgressShell phase={phase} label={label} />}
          </div>
        </div>
      </div>);
  }

  window.InstallDialog = InstallDialog;
})();
