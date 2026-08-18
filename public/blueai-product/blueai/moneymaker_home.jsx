// BlueAI — MoneyMaker's POST-LOGIN in-chat card (MoneyMakerHome) + its first-run coach spotlight
// and the dollar glyph the card's tile uses. Split out of moneymaker.jsx (2026-08-18) when that file
// crossed the workspace's 300-line rule.
//
// Clean seam: this is the only part of the feature that renders INSIDE the chat (in ChatScreen's
// !started home slot, on blueai-product's own light design system), whereas the welcome screen in
// moneymaker.jsx runs on creator-brand's theme — two surfaces that share no style and no state.
//
// PROVENANCE: the card + spotlight in this file come from the PM's `moneymaker-first-run-polish`
// branch (commit 6fc57e7, Abhisht Shukla, 2026-08-18), ported across our own 300-line splits. Only
// the CHAT-HOME half of that commit was taken — its welcome-screen changes were deliberately NOT
// applied, since the welcome screen has since been reworked much further here.
//
// Exposes window.MoneyMakerHomeCard = { MoneyMakerHome, PROMPT }. PROMPT lives here because the
// card's CTA is its only consumer; moneymaker.jsx re-exports both on window.MoneyMaker so the
// existing call site in chat_product.jsx is untouched by the split.
(function () {
  const { useState } = React;

  /* Dollar glyph — designer-supplied SVG asset (filled, not stroke), swapped in for the earlier
     custom-drawn version. Down to ONE use now, the card's tile. Two former uses are gone: an
     oversized card watermark, cut because it sat behind the description text and read as a smudge
     (and two dollar signs on one small card was one too many); and the welcome screen's step-2 tile,
     which in this tree uses the designer-supplied IcoCodeFolder instead — see moneymaker_icons.jsx.
     Kept parameterised anyway; it costs nothing and the card renders it at a non-default size. */
  function IcoDollar({ size = 22, color = '#1BA07A' }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M13.558 14.82c0-.453-.128-.813-.382-1.078-.25-.272-.675-.52-1.278-.747a15.837 15.837 0 0 1-1.561-.673 5.255 5.255 0 0 1-1.129-.772 3.23 3.23 0 0 1-.73-1.029c-.172-.393-.258-.86-.258-1.403 0-.935.299-1.702.897-2.3.597-.597 1.391-.945 2.382-1.045V4.66a.664.664 0 0 1 1.328 0v1.137c.98.138 1.746.548 2.3 1.228.372.455.619 1 .74 1.637.104.543-.358.995-.91.995h-.4c-.552 0-.96-.464-1.14-.986a1.534 1.534 0 0 0-.274-.5c-.272-.332-.637-.498-1.096-.498-.454 0-.805.13-1.054.39-.25.255-.374.609-.374 1.062 0 .421.122.759.365 1.013.244.255.695.515 1.353.78.665.266 1.21.518 1.636.756.426.232.785.498 1.079.797.293.293.517.63.672 1.012.155.377.232.817.232 1.32 0 .941-.293 1.705-.88 2.291-.586.587-1.394.933-2.423 1.038v.992a.66.66 0 0 1-1.32 0v-.984c-1.134-.122-2.014-.523-2.64-1.203-.426-.473-.706-1.052-.84-1.737-.104-.542.358-.995.91-.995h.4c.552 0 .962.465 1.153.984.075.206.18.385.311.536.316.348.767.522 1.353.522.487 0 .872-.127 1.154-.381.282-.26.424-.609.424-1.046Z" />
      </svg>);
  }

  /* Google-Material-style onboarding tooltip: solid product blue, one bold line, an explicit "Okay"
     dismiss. Copy went through three rounds — "…get your first job" (promised scarce supply),
     "Start here." (too stubby next to the button), headline + explainer body (too much) — and landed
     on the single instruction "Run this to begin"; don't re-add a body line or promissory copy.

     This REPLACES the earlier dark self-animating pill (its mmJump tick and mmShine sweep are gone
     with it, keyframes included). The reasoning is worth keeping: the scrim spotlight does the
     attention work now, so the tooltip can sit still and offer a way out instead of nagging on a
     timer. Right-aligned with a right-offset caret so it aims at the compact Run pill on the card's
     right edge, rather than centring under a card whose action is no longer centred. */
  /* Scaled down across the board, not just in padding — a tooltip shrunk only by its box keeps type
     sized for the old box and reads as cramped rather than smaller. Every dimension came down
     together: padding 13/16/11 → 10/13/9, title 14 → 12.5, the Okay pill 12/5×16 → 11/4×13, its gap
     10 → 8, the caret 7 → 6, the radius 12 → 10, and the outer gap 12 → 10. The shadow tightened too
     (14/36 → 10/26): a drop shadow scaled for a larger element makes a small one look like it's
     floating far off the surface. */
  function CoachTooltip({ title, onOkay }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 8, marginTop: 10 }}>
        <div style={{ position: 'relative', background: '#1990FF', borderRadius: 10, padding: '10px 13px 9px', boxShadow: '0 10px 26px rgba(0,0,0,0.32)' }}>
          <div style={{ position: 'absolute', top: -6, right: 22, width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: '6px solid #1990FF' }} />
          <p style={{ fontSize: 12.5, fontWeight: 750, color: 'white', lineHeight: 1.3, whiteSpace: 'nowrap' }}>{title}</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={onOkay}
              style={{ background: 'white', color: '#1275D8', border: 'none', borderRadius: 999, padding: '4px 13px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(0.93)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = ''; }}>
              Okay
            </button>
          </div>
        </div>
      </div>);
  }

  const PROMPT = 'Run the MoneyMaker skill to find and complete my first paid job.';

  /* Renders in ChatScreen's !started home slot in place of ProductHome, when sessionMode is
     'moneymaker'. The greeting above it is IntroCard (chat_compare.jsx) with its title/sub
     overridden by the caller — this component is the card plus a one-time coach spotlight.

     Card anatomy is skills.jsx's row (tile · name+description · compact action pill), because the
     button only needs the verb: the tile and the title already say MoneyMaker. The whole card is
     clickable — the pill is a small target, and on a spotlighted first run clicking the lit thing
     should just work; the pill stopPropagations so it doesn't double-fire. The animated gradient
     border + entrance reuse credits_widget.jsx's "special moment" signature (TriggerBorderPulse's
     ba-border-spin) — MoneyMaker's first-paid-job card is the same kind of moment, and against the
     scrim the glowing frame finally reads as a frame.

     THE SCRIM — absolute inset-0, which resolves against .ba-app. That's verified, not assumed: the
     five wrappers between this component and .ba-app (the marginTop:4 div, the chat scroller, its
     overflow:hidden parent, the 420px chat column, and ChatScreen's own fragment) are all
     position:static with no transform, and .ba-app is position:relative. Two consequences worth
     knowing before anyone refactors that chain: overflow alone doesn't clip an absolute box whose
     containing block is an ancestor of the clipper, which is why the scrim escapes the chat
     scroll-area — but a transform ANYWHERE in that chain would capture it and it would clip. The
     jobs/schedule/settings tabs wrap their content in .tab-anim, whose tabFadeUp animates transform;
     the chat branch does not, and that is load-bearing.

     zIndex 40 covers the TopNavbar (20), the composer (positioned, auto) and the bottom nav
     (static), and stays under the in-app modals (shared.jsx's 60); the card+tooltip column lifts to
     41. Dismiss = Okay, clicking the scrim, or just running the skill — the conversation replaces
     this component entirely. */
  function MoneyMakerHome({ onRun }) {
    const [coaching, setCoaching] = useState(true);
    const run = () => onRun(PROMPT, 'MoneyMaker');

    return (
      <div>
        <style>{`
          @keyframes mmCardIn { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
          @keyframes mmScrimIn { from { opacity: 0; } to { opacity: 1; } }
        `}</style>

        {coaching &&
          <div onClick={() => setCoaching(false)} aria-hidden="true"
            style={{ position: 'absolute', inset: 0, zIndex: 40, background: 'rgba(11,18,32,0.52)', animation: 'mmScrimIn 0.35s ease both', cursor: 'pointer' }} />}

        <div style={{ position: 'relative', zIndex: 41 }}>
          <div style={{ position: 'relative', borderRadius: 16, animation: 'mmCardIn 0.4s cubic-bezier(0.22,1,0.36,1) both' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 16, pointerEvents: 'none', background: 'linear-gradient(white,white) padding-box, linear-gradient(135deg,#0EA4C5,#7B4CFF,#0EA4C5) border-box', border: '1.5px solid transparent', animation: 'ba-border-spin 3s linear infinite' }} />
            <div role="button" tabIndex={0} onClick={run}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); run(); } }}
              /* Halo while spotlighted: a wide soft glow sells the punch-out as deliberate. After
                 dismiss it settles to the house card shadow. */
              style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 13, background: 'white', borderRadius: 16, padding: '15px 15px', cursor: 'pointer', boxShadow: coaching ? '0 0 44px rgba(25,144,255,0.28), 0 18px 50px rgba(0,0,0,0.4)' : '0 6px 24px rgba(15,23,42,0.08)', transition: 'box-shadow 0.35s ease, transform 0.15s ease' }}
              onMouseEnter={(e) => { if (!coaching) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}>
              {/* Soft diagonal green gradient, not the flat fill — the tile is the card's face and
                 the flat swatch went muddy next to the animated gradient border. */}
              <div style={{ flexShrink: 0, width: 46, height: 46, borderRadius: 12, background: 'linear-gradient(135deg, #E5F8F0, #CFF0E1)', border: '1px solid #A8E4D4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IcoDollar size={26} color="#1BA07A" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14.5, fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: 3 }}>MoneyMaker</p>
                <p style={{ fontSize: 11.5, color: '#6b7280', lineHeight: 1.4 }}>Finds jobs that fit you and runs them on your account.</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); run(); }}
                style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6, background: '#1990FF', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 12.5, fontWeight: 750, color: 'white', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 3px 10px rgba(25,144,255,0.3)', transition: 'transform 0.15s ease, filter 0.15s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.filter = 'brightness(1.06)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.filter = ''; }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                Run
              </button>
            </div>
          </div>

          {coaching &&
            <div style={{ animation: 'mmCardIn 0.4s cubic-bezier(0.22,1,0.36,1) both 0.15s' }}>
              {/* Deliberately promise-free copy: no "job" anywhere in this nudge — supply may be
                 scarce at launch, and "your first paid job starts here" read as a guarantee. */}
              <CoachTooltip title="Run this to begin" onOkay={() => setCoaching(false)} />
            </div>}
        </div>
      </div>);
  }

  window.MoneyMakerHomeCard = { MoneyMakerHome, PROMPT };
})();
