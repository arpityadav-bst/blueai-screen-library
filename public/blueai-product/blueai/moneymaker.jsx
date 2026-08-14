// BlueAI — "MoneyMaker" session variant: a third onboarding path (alongside Onboarding + Default)
// for the social-monetization funnel. Chrome-free welcome (greeting + 2 numbered steps + sign-in
// CTA) hands off to the SAME LoginModal flow every other variant uses, then the chat home swaps
// the four task categories for one MoneyMaker skill card with a coachmark on its CTA.
//
// Everything here is built FROM existing patterns, not invented fresh:
//  - welcome shell: onboarding.jsx's OnboardingWelcome (logo, fade-up rhythm, card rows)
//  - numbered steps: the same static-row shell as OnboardingWelcome's suggestion buttons, minus
//    the hover/click affordance (these aren't choices, they're instructions)
//  - CTA button: needs_bluestacks.jsx Bubble's full-width primary button
//  - skill card: needs_bluestacks.jsx Bubble's card shell (icon + copy + full-width CTA), sized
//    like product_home.jsx's category cards
//  - coachmark: shared.jsx's nav-tooltip caret (two stacked border triangles) + chat_product.jsx's
//    pulsing-dot nudge pill, merged into one always-visible (not hover-gated) pointer
//
// Exposes window.MoneyMaker = { MoneyMakerWelcome, MoneyMakerHome, PROMPT }
(function () {
  const STEPS = [
    { n: 1, node: <>Sign in <strong>with the same now.gg account you applied with</strong>.</> },
    { n: 2, node: <><strong>Run the MoneyMaker skill</strong>: it finds jobs and runs them for you.</> }
  ];

  function StepRow({ n, node }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', background: 'white', border: '1.5px solid #dbe3ee', borderRadius: 16, padding: '14px 16px', boxShadow: '0 2px 10px rgba(15,23,42,0.06)' }}>
        <div style={{ flexShrink: 0, width: 26, height: 26, borderRadius: '50%', background: '#E0F2FE', border: '1px solid #BAE6FD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12.5, fontWeight: 800, color: '#0369A1' }}>{n}</div>
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
          .mm-item { animation: mmFadeUp 0.42s cubic-bezier(0.22,1,0.36,1) both; }
          @media (prefers-reduced-motion: reduce) { .mm-item { animation: none; } }
        `}</style>

        <div className="mm-item" style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, animationDelay: '0s' }}>
          <img src="assets/BAILogo2.svg" alt="BlueAI" style={{ width: 64, height: 64 }} />
        </div>

        <p className="mm-item" style={{ marginTop: 8, color: '#64748b', lineHeight: 1.5, textAlign: 'center', fontSize: 18, animationDelay: '0.1s' }}>Hi, I'm BlueAI</p>
        <h1 className="mm-item" style={{ fontSize: 25, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.18, textAlign: 'center', textWrap: 'balance', marginTop: 6, animationDelay: '0.2s' }}>
          An AI that turns your social accounts <span style={{ color: '#1990FF' }}>into income.</span>
        </h1>

        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {STEPS.map((s, i) => (
            <div key={s.n} className="mm-item" style={{ animationDelay: 0.3 + i * 0.1 + 's' }}>
              <StepRow n={s.n} node={s.node} />
            </div>
          ))}
        </div>

        {/* Pill + lift/brighten/deepen-shadow hover — matches every "Sign in" CTA in login.jsx
           (this button does the same job on a full-page pre-login screen), not the flatter
           rounded-rect + opacity-only hover used by in-card action buttons like Bubble's
           "Get BlueStacks" or this file's own "Run MoneyMaker" below. Two different CTA
           families in this product, each kept consistent with its own context. */}
        <button onClick={onSignIn} className="mm-item"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', marginTop: 22, background: '#1990FF', border: 'none', borderRadius: 999, padding: '13px 0', fontSize: 14.5, fontWeight: 700, color: 'white', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(25,144,255,0.35)', transition: 'transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease', animationDelay: '0.5s' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.filter = 'brightness(1.06)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(25,144,255,0.42)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.filter = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(25,144,255,0.35)'; }}>
          Sign in to get started
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
        </button>

        <p className="mm-item" style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 12, animationDelay: '0.6s' }}>Terms &amp; Conditions</p>
      </div>);
  }

  /* Dollar glyph — designer-supplied SVG asset (filled, not stroke), swapped in for the earlier
     custom-drawn version. Reused twice at two scales: the small avatar glyph and, much larger
     and near-transparent, the card's background watermark — same asset, not two icons. */
  function IcoDollar({ size = 22, color = '#1BA07A' }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M13.558 14.82c0-.453-.128-.813-.382-1.078-.25-.272-.675-.52-1.278-.747a15.837 15.837 0 0 1-1.561-.673 5.255 5.255 0 0 1-1.129-.772 3.23 3.23 0 0 1-.73-1.029c-.172-.393-.258-.86-.258-1.403 0-.935.299-1.702.897-2.3.597-.597 1.391-.945 2.382-1.045V4.66a.664.664 0 0 1 1.328 0v1.137c.98.138 1.746.548 2.3 1.228.372.455.619 1 .74 1.637.104.543-.358.995-.91.995h-.4c-.552 0-.96-.464-1.14-.986a1.534 1.534 0 0 0-.274-.5c-.272-.332-.637-.498-1.096-.498-.454 0-.805.13-1.054.39-.25.255-.374.609-.374 1.062 0 .421.122.759.365 1.013.244.255.695.515 1.353.78.665.266 1.21.518 1.636.756.426.232.785.498 1.079.797.293.293.517.63.672 1.012.155.377.232.817.232 1.32 0 .941-.293 1.705-.88 2.291-.586.587-1.394.933-2.423 1.038v.992a.66.66 0 0 1-1.32 0v-.984c-1.134-.122-2.014-.523-2.64-1.203-.426-.473-.706-1.052-.84-1.737-.104-.542.358-.995.91-.995h.4c.552 0 .962.465 1.153.984.075.206.18.385.311.536.316.348.767.522 1.353.522.487 0 .872-.127 1.154-.381.282-.26.424-.609.424-1.046Z" />
      </svg>);
  }

  /* Always-visible coachmark (not hover-gated, unlike shared.jsx's nav tooltip it borrows the
     caret construction from) pointing up into the CTA above it. Centered under the card via
     width:fit-content + margin:auto — reliable without measuring the button, since the CTA
     spans the card's full width, so the card's horizontal center IS the CTA's center.
     mmJump ticks the whole pill (caret included, so it stays attached) on a fixed ~3.5s cycle —
     the middle of the requested 2.5–4.5s window; true per-cycle randomization would need JS
     state for a decorative nudge, which is more machinery than this earns. mmShine is a light
     sweep clipped to the pill's own rounded corners, timed to the same cycle so the two read as
     one "attention" beat rather than two competing motions. */
  function Coachmark({ text }) {
    return (
      <div style={{ position: 'relative', marginTop: 14, width: 'fit-content', marginLeft: 'auto', marginRight: 'auto', animation: 'mmJump 3.5s ease-in-out infinite' }}>
        <style>{`
          @keyframes mmJump { 0%, 82% { transform: translateY(0); } 88% { transform: translateY(-5px); } 94%, 100% { transform: translateY(0); } }
          @keyframes mmShine { 0%, 82% { transform: translateX(-160%); } 92% { transform: translateX(220%); } 100% { transform: translateX(220%); } }
        `}</style>
        <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '8px solid #1e293b' }} />
        <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-flex', alignItems: 'center', gap: 7, background: '#1e293b', color: 'white', borderRadius: 10, padding: '8px 13px', fontSize: 12.5, fontWeight: 600, boxShadow: '0 6px 18px rgba(0,0,0,0.22)', whiteSpace: 'nowrap' }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '40%', background: 'linear-gradient(115deg, transparent, rgba(255,255,255,0.4), transparent)', animation: 'mmShine 3.5s ease-in-out infinite', pointerEvents: 'none' }} />
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#38bdf8', flexShrink: 0, animation: 'ba-pulse 1.3s infinite' }} />
          {text}
        </div>
      </div>);
  }

  const PROMPT = 'Run the MoneyMaker skill to find and complete my first paid job.';

  /* Renders in ChatScreen's !started home slot in place of ProductHome, when sessionMode is
     'moneymaker'. The greeting above it is IntroCard (chat_compare.jsx) with its title/sub
     overridden by the caller — this component is just the card + its coachmark.

     Layout: the icon sits left, sized to the combined height of the title+description column
     beside it, rather than a small icon over a full-width title row. The animated gradient
     border + entrance reuse credits_widget.jsx's own "special moment" signature
     (TriggerBorderPulse's ba-border-spin, used there for the free-credits highlight) —
     MoneyMaker's first-paid-job card is the same kind of moment, so it gets the same frame
     instead of a new one. The oversized dollar watermark bottom-right, faded out toward the
     bottom via a mask gradient, is the SAME IcoDollar glyph as the avatar — one icon, two scales,
     not two different assets. */
  function MoneyMakerHome({ onRun }) {
    return (
      <div>
        <style>{`@keyframes mmCardIn { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
        <div style={{ position: 'relative', borderRadius: 16, animation: 'mmCardIn 0.4s cubic-bezier(0.22,1,0.36,1) both' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 16, pointerEvents: 'none', background: 'linear-gradient(white,white) padding-box, linear-gradient(135deg,#0EA4C5,#7B4CFF,#0EA4C5) border-box', border: '1.5px solid transparent', animation: 'ba-border-spin 3s linear infinite' }} />
          <div style={{ position: 'relative', background: 'white', borderRadius: 16, padding: '18px 18px 16px', boxShadow: '0 6px 24px rgba(15,23,42,0.08)', overflow: 'hidden' }}>
            {/* Background watermark — behind everything below (zIndex:0 vs the content
               wrapper's zIndex:1), clipped to the card's rounded corners by the parent's
               overflow:hidden, faded toward the bottom via a mask gradient. */}
            <div style={{ position: 'absolute', top: -18, right: -18, width: 128, height: 128, zIndex: 0, opacity: 0.09, WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 78%)', maskImage: 'linear-gradient(to bottom, black 0%, transparent 78%)', pointerEvents: 'none' }}>
              <IcoDollar size={128} color="#1BA07A" />
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ flexShrink: 0, width: 62, height: 62, borderRadius: 15, background: '#DDF4EE', border: '1px solid #A8E4D4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IcoDollar size={36} color="#1BA07A" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 16, fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: 4 }}>MoneyMaker</p>
                  <p style={{ fontSize: 12.5, color: '#6b7280', lineHeight: 1.45 }}>Asks a few questions about you, then finds jobs and runs them on your account.</p>
                </div>
              </div>
              <button onClick={() => onRun(PROMPT, 'MoneyMaker')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, width: '100%', background: '#1990FF', border: 'none', borderRadius: 10, padding: '11px 0', fontSize: 13.5, fontWeight: 700, color: 'white', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(25,144,255,0.28)', transition: 'opacity 0.15s ease, transform 0.15s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = ''; }}>
                Run MoneyMaker
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
          </div>
        </div>
        <div style={{ animation: 'mmCardIn 0.4s cubic-bezier(0.22,1,0.36,1) both 0.15s' }}>
          <Coachmark text="Run MoneyMaker to get your first job" />
        </div>
      </div>);
  }

  window.MoneyMaker = { MoneyMakerWelcome, MoneyMakerHome, PROMPT };
})();
