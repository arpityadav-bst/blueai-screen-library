// BlueAI — "MoneyMaker" session variant: a third onboarding path (alongside Onboarding + Default)
// for the social-monetization funnel — shown to members who were APPROVED for the jobs program and
// installed the dedicated build from their acceptance email. Chrome-free welcome (brand glow +
// icon steps + gradient sign-in CTA) hands off to the SAME LoginModal flow every other variant
// uses, then the chat home spotlights one MoneyMaker skill card: a window-wide scrim dims all
// chrome and a blue onboarding tooltip points at the card's Run pill until dismissed. Two things
// deliberately do NOT appear (designer, 2026-08-18): the "you're approved" confirmation (it lives
// in the acceptance email, so the screen opens straight on the value line) and any "what happens
// next" explainer on the chat home (members arrive already knowing the flow — the beautification
// brief was visual polish, not more content).
//
// Everything here is built FROM existing patterns, not invented fresh:
//  - welcome shell: onboarding.jsx's OnboardingWelcome (logo, fade-up rhythm, card rows)
//  - numbered steps → icon tiles: same static-row shell as before; step 2's tile is the SAME
//    green + dollar as the MoneyMaker card on the next screen, so the instruction visually
//    points at the thing the member will actually click after signing in
//  - skill card row: skills.jsx's card anatomy (name + description left, compact action pill
//    right) — chosen over the earlier stacked icon/copy/full-width-CTA billboard because the
//    verb is all the button needs to say once the card already says MoneyMaker twice
//  - coach spotlight: ModalOverlay's window-scoped absolute-overlay technique for the scrim +
//    a Google-Material-style solid-blue tooltip with an explicit "Okay" dismiss
//  - "what happens next" strip: product_home.jsx's uppercase kicker ("WHAT WOULD YOU LIKE TO DO?")
//    + its icon-tile-and-copy row rhythm, muted all the way down so the card's CTA stays the only
//    loud element on the screen
//
// Exposes window.MoneyMaker = { MoneyMakerWelcome, MoneyMakerHome, PROMPT }
(function () {
  const { useState } = React;

  /* Tinted 34px icon tiles replaced the bare numbered circles (2026-08-18, beautification pass):
     with only two steps the vertical order already carries the sequence, and the icons buy
     continuity — the blue tile echoes the sign-in world, the green dollar tile IS the MoneyMaker
     card's identity, previewed one screen early. */
  const STEPS = [
    {
      tile: { bg: '#E0F2FE', border: '#BAE6FD' },
      icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0369A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
      node: <>Sign in <strong>with the same now.gg account you applied with</strong>.</>
    },
    {
      tile: { bg: '#DDF4EE', border: '#A8E4D4' },
      // IcoDollar is declared further down the file; safe here because function declarations
      // hoist to the top of the IIFE, and this JSX only calls it when STEPS evaluates.
      icon: <IcoDollar size={19} />,
      node: <><strong>Run the MoneyMaker skill</strong>: it finds jobs and runs them for you.</>
    }
  ];

  function StepRow({ tile, icon, node }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 13, width: '100%', background: 'white', border: '1.5px solid #dbe3ee', borderRadius: 16, padding: '13px 15px', boxShadow: '0 2px 10px rgba(15,23,42,0.06)' }}>
        <div style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 10, background: tile.bg, border: '1px solid ' + tile.border, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
        <p style={{ fontSize: 14, lineHeight: 1.5, color: '#374151' }}>{node}</p>
      </div>);
  }

  /* Full-page, chrome-free — same slot as Onboarding.OnboardingWelcome. onSignIn opens the shared
     LoginModal directly at its 'browser' step (this page already IS the "please sign in" screen,
     so the modal's own default step would just repeat it). */
  function MoneyMakerWelcome({ onSignIn }) {
    return (
      <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#f8fafc', padding: '24px 22px', overflowY: 'auto' }}>
        <style>{`
          @keyframes mmFadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes mmFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
          .mm-item { animation: mmFadeUp 0.42s cubic-bezier(0.22,1,0.36,1) both; }
          .mm-float { animation: mmFloat 6s ease-in-out infinite; }
          @media (prefers-reduced-motion: reduce) { .mm-item, .mm-float { animation: none; } }
        `}</style>

        {/* Decorative layer — a brand-gradient glow behind the logo and a faint blue wash rising
           from the bottom edge. Both are pinned to the CONTAINER (not the content flow), so they
           spend the dead space this tall window otherwise leaves above and below a centered
           ~500px column, without moving a single element. pointerEvents: none throughout. */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,164,197,0.13) 0%, rgba(123,76,255,0.09) 45%, transparent 70%)', pointerEvents: 'none' }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 170, background: 'linear-gradient(to top, rgba(25,144,255,0.06), transparent)', pointerEvents: 'none' }} />

        <div className="mm-item" style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, animationDelay: '0s', position: 'relative' }}>
          <img src="assets/BAILogo2.svg" alt="BlueAI" className="mm-float" style={{ width: 64, height: 64 }} />
        </div>

        <p className="mm-item" style={{ color: '#64748b', lineHeight: 1.5, textAlign: 'center', fontSize: 18, animationDelay: '0.1s', position: 'relative' }}>Hi, I'm BlueAI</p>
        {/* Headline accent carries the same gradient as the wordmark + chip + CTA — one brand
           voice on this screen, not the in-app action blue (that family returns after sign-in). */}
        <h1 className="mm-item" style={{ fontSize: 25, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.18, textAlign: 'center', textWrap: 'balance', marginTop: 6, animationDelay: '0.2s', position: 'relative' }}>
          An AI that turns your social accounts <span style={{ background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>into income.</span>
        </h1>

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
          {STEPS.map((s, i) => (
            <div key={i} className="mm-item" style={{ animationDelay: 0.3 + i * 0.1 + 's' }}>
              <StepRow tile={s.tile} icon={s.icon} node={s.node} />
            </div>
          ))}
        </div>

        {/* Pill + lift/brighten/deepen-shadow hover — the login.jsx "Sign in" CTA family's
           behavior, promoted from its flat action blue to the brand gradient (2026-08-18):
           this is the funnel's one full-page brand moment, and the button should read as the
           same voice as the wordmark, chip, and headline accent around it. In-app CTAs (Run
           MoneyMaker below, every post-login button) stay flat #1990FF — the gradient is
           reserved for this pre-login stage, exactly like the credits pill treatment. */}
        <button onClick={onSignIn} className="mm-item"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', marginTop: 24, background: 'linear-gradient(100deg,#0EA4C5,#7B4CFF)', border: 'none', borderRadius: 999, padding: '13px 0', fontSize: 14.5, fontWeight: 700, color: 'white', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 20px rgba(123,76,255,0.30)', transition: 'transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease', animationDelay: '0.5s', position: 'relative' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.filter = 'brightness(1.07)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(123,76,255,0.38)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.filter = ''; e.currentTarget.style.boxShadow = '0 6px 20px rgba(123,76,255,0.30)'; }}>
          Sign in to get started
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
        </button>

        <p className="mm-item" style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 12, animationDelay: '0.58s', position: 'relative' }}>Terms &amp; Conditions</p>
      </div>);
  }

  /* Dollar glyph — designer-supplied SVG asset (filled, not stroke), swapped in for the earlier
     custom-drawn version. Reused at two scales: the welcome screen's step-2 tile and the card's
     avatar glyph. (A third use — an oversized card watermark — was cut 2026-08-18: it sat behind
     the description text and read as a smudge, and two dollar signs on one small card was one
     too many.) */
  function IcoDollar({ size = 22, color = '#1BA07A' }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M13.558 14.82c0-.453-.128-.813-.382-1.078-.25-.272-.675-.52-1.278-.747a15.837 15.837 0 0 1-1.561-.673 5.255 5.255 0 0 1-1.129-.772 3.23 3.23 0 0 1-.73-1.029c-.172-.393-.258-.86-.258-1.403 0-.935.299-1.702.897-2.3.597-.597 1.391-.945 2.382-1.045V4.66a.664.664 0 0 1 1.328 0v1.137c.98.138 1.746.548 2.3 1.228.372.455.619 1 .74 1.637.104.543-.358.995-.91.995h-.4c-.552 0-.96-.464-1.14-.986a1.534 1.534 0 0 0-.274-.5c-.272-.332-.637-.498-1.096-.498-.454 0-.805.13-1.054.39-.25.255-.374.609-.374 1.062 0 .421.122.759.365 1.013.244.255.695.515 1.353.78.665.266 1.21.518 1.636.756.426.232.785.498 1.079.797.293.293.517.63.672 1.012.155.377.232.817.232 1.32 0 .941-.293 1.705-.88 2.291-.586.587-1.394.933-2.423 1.038v.992a.66.66 0 0 1-1.32 0v-.984c-1.134-.122-2.014-.523-2.64-1.203-.426-.473-.706-1.052-.84-1.737-.104-.542.358-.995.91-.995h.4c.552 0 .962.465 1.153.984.075.206.18.385.311.536.316.348.767.522 1.353.522.487 0 .872-.127 1.154-.381.282-.26.424-.609.424-1.046Z" />
      </svg>);
  }

  /* Google-Material-style onboarding tooltip (designer, 2026-08-18): solid product blue, one
     bold line, an explicit "Okay" dismiss. Copy went through three rounds — "…get your first
     job" (promised scarce supply), "Start here." (too stubby next to the button), headline +
     explainer body (too much) — and landed on the single instruction "Run this to begin";
     don't re-add a body line or promissory copy. Replaces the earlier dark self-animating
     pill — the scrim spotlight does the attention work now, so the tooltip sits still and
     offers a way out instead of nagging on a timer. Right-aligned with a right-offset caret
     so it aims at the compact Run pill on the card's right edge. */
  function CoachTooltip({ title, onOkay }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 8, marginTop: 12 }}>
        <div style={{ position: 'relative', background: '#1990FF', borderRadius: 12, padding: '13px 16px 11px', boxShadow: '0 14px 36px rgba(0,0,0,0.35)' }}>
          <div style={{ position: 'absolute', top: -7, right: 24, width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: '7px solid #1990FF' }} />
          <p style={{ fontSize: 14, fontWeight: 750, color: 'white', lineHeight: 1.3, whiteSpace: 'nowrap' }}>{title}</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
            <button onClick={onOkay}
              style={{ background: 'white', color: '#1275D8', border: 'none', borderRadius: 999, padding: '5px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'filter 0.15s ease' }}
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

     Card anatomy is skills.jsx's row (tile · name+description · compact action pill), because
     the button only needs the verb: the tile and the title already say MoneyMaker. The whole
     card is clickable (the pill is a small target, and on a spotlighted first run clicking the
     lit thing should just work); the pill stopPropagations so it doesn't double-fire. The
     animated gradient border + entrance reuse credits_widget.jsx's "special moment" signature
     (TriggerBorderPulse's ba-border-spin) — MoneyMaker's first-paid-job card is the same kind
     of moment, and against the scrim the glowing frame finally reads as a frame.

     The scrim: absolute inset-0 against .ba-app, the same load-bearing positioned box every
     in-app overlay (boot splash, login gate, modals) scopes to — so it dims the app's own
     chrome but not the fake Windows titlebar, which is OS scenery. It escapes the chat
     scroll-area's overflow clipping because its containing block (.ba-app) is an ancestor of
     the clipper. zIndex 40 covers the TopNavbar (z 20), the composer (positioned, z auto) and
     the bottom nav (static), and stays under the in-app modals (z 60); the card+tooltip column
     lifts to 41. Dismiss = Okay, clicking the scrim, or just running the skill (the
     conversation replaces this component entirely). */
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
              /* Halo while spotlighted: a wide soft glow sells the punch-out as deliberate.
                 After dismiss it settles to the house card shadow. */
              style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 13, background: 'white', borderRadius: 16, padding: '15px 15px', cursor: 'pointer', boxShadow: coaching ? '0 0 44px rgba(25,144,255,0.28), 0 18px 50px rgba(0,0,0,0.4)' : '0 6px 24px rgba(15,23,42,0.08)', transition: 'box-shadow 0.35s ease, transform 0.15s ease' }}
              onMouseEnter={(e) => { if (!coaching) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}>
              {/* Soft diagonal green gradient, not the flat fill — the tile is the card's face
                 and the flat swatch went muddy next to the animated gradient border. */}
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
              {/* Deliberately promise-free copy (designer, 2026-08-18): no "job" anywhere in
                 this nudge — supply may be scarce at launch, and "your first paid job starts
                 here" read as a guarantee. */}
              <CoachTooltip title="Run this to begin" onOkay={() => setCoaching(false)} />
            </div>}
        </div>
      </div>);
  }

  window.MoneyMaker = { MoneyMakerWelcome, MoneyMakerHome, PROMPT };
})();
