// BlueAI: "MoneyMaker" session variant: a third onboarding path (alongside Onboarding + Default)
// for the social-monetization funnel. Chrome-free welcome (logo, headline, two numbered steps,
// sign-in CTA) hands off to the SAME LoginModal flow every other variant uses, then the chat home
// swaps the four task categories for one MoneyMaker skill card with a coachmark on its CTA.
//
// V3, Phase 2 (Appy, 2026-10-14): the welcome is drawn in the onBlue Agentic partner site's
// language on the Target tokens, structured after the design system's Welcome (blueai-product-v2-ds
// screens/welcome.jsx, design-md/67). No gradient anywhere: the site's plain spark mark in its blue,
// a quiet grey dot grid on the canvas, an Inter 600 headline with one Instrument Serif italic
// phrase, the site's numbered step discs in one lined card, and the site's solid dark button.
// Styles live in entry.css (.v3-*); this file only lays them out and runs the intro.
//
// Exposes window.MoneyMaker = { MoneyMakerWelcome, MoneyMakerHome, PROMPT }, MoneyMakerHome and
// PROMPT live in moneymaker_home.jsx (300-line split) and are re-exported here unchanged.
(function () {
  const { useState, useRef, useLayoutEffect } = React;

  // Copy unchanged from V2 ("now.gg" dropped, Abhisht 2026-09-24; "BlueAI worker", 2026-09-09).
  const STEPS = [
    'Sign in with the same account you applied with.',
    'Run the BlueAI worker: it finds jobs and runs them for you.'
  ];

  /* Full-page, chrome-free: same slot as Onboarding.OnboardingWelcome. onSignIn opens the shared
     LoginModal directly at its 'browser' step (this page already IS the "please sign in" screen,
     so the modal's own default step would just repeat it). */
  function MoneyMakerWelcome({ onSignIn }) {
    /* The opening beat: the logo and title appear at the screen's TRUE vertical centre, then the
       steps card arriving below lifts them to their resting place. The card and CTA hold their
       layout space from frame one (invisible, never absent), so the lift is a pure transform of
       half the height of everything below the head (the column is centred as a whole). Measured,
       not hardcoded, because the card's height follows how the step copy wraps. useLayoutEffect
       so --mm-shift is set before frame one paints. */
    const belowRef = useRef(null);
    const [shift, setShift] = useState(0);
    useLayoutEffect(() => {
      if (belowRef.current) setShift(Math.round(belowRef.current.offsetHeight / 2));
    }, []);

    return (
      <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--v2-canvas)', fontFamily: 'var(--v2-font-ui)', padding: 'var(--v2-space-10) var(--v2-space-6)', overflowY: 'auto', overflowX: 'hidden' }}>
        <style>{`
          /* INTRO: one timeline, four beats, each fading in from a blur as well as from below.
               0.00s  logo + title materialise AT the vertical centre, still (0.9s)
               0.90s  steps card rises in AND lifts the head to its resting place (0.75s, shared
                      easing + duration so the two read as one cause and effect)
               1.65s  CTA rises in, shorter travel and duration (0.6s)
               2.30s  terms link fades in, last and slowest (1.2s)
             Easing is the Target arrival curve (--v2-ease-out). */
          @keyframes mmTitleIn { from { opacity: 0; filter: blur(10px); } to { opacity: 1; filter: blur(0); } }
          @keyframes mmTitleRise { from { transform: translateY(var(--mm-shift, 0px)); } to { transform: translateY(0); } }
          @keyframes mmCardUp { from { opacity: 0; transform: translateY(30px); filter: blur(8px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
          @keyframes mmCtaUp { from { opacity: 0; transform: translateY(16px); filter: blur(5px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
          @keyframes mmTermsEnter { from { opacity: 0; } to { opacity: 1; } }
          .mm-title { animation: mmTitleIn 0.9s var(--v2-ease-out) both, mmTitleRise 0.75s var(--v2-ease-out) 0.9s both; }
          .mm-card { animation: mmCardUp 0.75s var(--v2-ease-out) 0.9s both; }
          .mm-cta { animation: mmCtaUp 0.6s var(--v2-ease-out) 1.65s both; }
          .mm-terms { animation: mmTermsEnter 1.2s ease-out 2.3s both; }
          @media (prefers-reduced-motion: reduce) {
            .mm-title, .mm-card, .mm-cta, .mm-terms { animation: none !important; }
          }
        `}</style>

        <div className="v3-dotgrid" aria-hidden="true" />

        <div style={{ position: 'relative', zIndex: 'var(--v2-z-raised)', display: 'flex', flexDirection: 'column', '--mm-shift': `${shift}px` }}>
          <div className="mm-title" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--v2-space-4)' }}>
            <window.BlueAILogo wordmark={false} mark={48} />
            <h1 className="v3-welcome-title">
              An AI that turns your social accounts <em className="v3-serif-em">into income.</em>
            </h1>
          </div>

          {/* Everything below the head, in one flex wrapper: its measured height is what the head's
             opening offset is derived from, and display:flex keeps the card's top margin inside
             offsetHeight instead of collapsing through the wrapper. */}
          <div ref={belowRef} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="mm-card v3-card" style={{ marginTop: 'var(--v2-space-8)' }}>
              <ol className="v3-steps" aria-label="How it works">
                {STEPS.map((text, i) => (
                  <li className="v3-step" key={i}>
                    <span className="v3-step-num" aria-hidden="true">{i + 1}</span>
                    <p className="v3-step-text"><span className="v3-sr-only">Step {i + 1}: </span>{text}</p>
                  </li>
                ))}
              </ol>
            </div>

            <button type="button" onClick={onSignIn} className="mm-cta v3-btn-solid v3-btn-full" style={{ marginTop: 'var(--v2-space-8)' }}>
              Sign in to get started
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ strokeWidth: 'var(--v2-icon-stroke)' }}><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        {/* Pinned to the bottom of the screen, outside the centred column. Quiet and underlined,
           as the site's links are. Still a no-op, as in V2. */}
        <div className="mm-terms" style={{ position: 'absolute', left: 0, right: 0, bottom: 'var(--v2-space-6)', zIndex: 'var(--v2-z-raised)', display: 'flex', justifyContent: 'center', fontSize: 'var(--v2-text-12)' }}>
          <button type="button" onClick={(e) => e.preventDefault()} className="v3-link">
            Terms &amp; Conditions
          </button>
        </div>
      </div>);
  }

  /* The post-login in-chat card (MoneyMakerHome + its coachmark + the dollar glyph + PROMPT) lives
     in moneymaker_home.jsx. Re-exported here unchanged so the existing call site (chat_product.jsx's
     <window.MoneyMaker.MoneyMakerHome />) doesn't move; that script must run before this one. */
  const { MoneyMakerHome, PROMPT } = window.MoneyMakerHomeCard;

  window.MoneyMaker = { MoneyMakerWelcome, MoneyMakerHome, PROMPT };
})();
