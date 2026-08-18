// BlueAI — "MoneyMaker" session variant: a third onboarding path (alongside Onboarding + Default)
// for the social-monetization funnel. Chrome-free welcome (greeting + 2 icon steps + sign-in
// CTA) hands off to the SAME LoginModal flow every other variant uses, then the chat home swaps
// the four task categories for one MoneyMaker skill card with a coachmark on its CTA.
//
// Everything here is built FROM existing patterns, not invented fresh:
//  - welcome shell: onboarding.jsx's OnboardingWelcome (logo, fade-up rhythm, card rows)
//  - step rows: the same static-row shell as OnboardingWelcome's suggestion buttons, minus the
//    hover/click affordance (these aren't choices, they're instructions)
//  - CTA button: needs_bluestacks.jsx Bubble's full-width primary button
//  - skill card: needs_bluestacks.jsx Bubble's card shell (icon + copy + full-width CTA), sized
//    like product_home.jsx's category cards
//  - coachmark: shared.jsx's nav-tooltip caret (two stacked border triangles) + chat_product.jsx's
//    pulsing-dot nudge pill, merged into one always-visible (not hover-gated) pointer
//  - welcome screen theme: the welcome screen (MoneyMakerWelcome only — MoneyMakerHome keeps
//    blueai-product's own system) is reskinned onto creator-brand's own design theme, not
//    invented: the perspective grid is CTAGrid.tsx's exact geometry, the ambient orbs are
//    Backdrop.tsx's .cb-orb, the paper grain is creator-brand.css's .cb-grain (same
//    feTurbulence recipe), headings use that page's Space Grotesk + ink ramp, and the CTA uses
//    its brand iris→cyan gradient + glow shadow in place of this product's flat #1990FF
//
// Exposes window.MoneyMaker = { MoneyMakerWelcome, MoneyMakerHome, PROMPT } — MoneyMakerHome and
// PROMPT now live in moneymaker_home.jsx (300-line split) and are re-exported here unchanged.
(function () {
  const { useState, useRef, useLayoutEffect } = React;

  /* Background decoration (grid, orbs, grain) lives in moneymaker_backdrop.jsx — split out
     when this file crossed the 300-line rule. Pulled in at RENDER time via React.createElement
     (JSX tag names can't be a call expression like window.X().Y, so this wraps each one in a
     plain function first) — same cross-file convention chat_product.jsx already uses for
     window.ChatBubbles. */
  const B = () => window.MoneyMakerBackdrop;
  const MMGrid = () => React.createElement(B().MMGrid);
  const MMBackdrop = () => React.createElement(B().MMBackdrop);
  const MMGrain = () => React.createElement(B().MMGrain);

  /* The hero logo — four layers, its cursor morph, its entrance travel, its own keyframes — lives
     in moneymaker_logo.jsx, also a 300-line-rule split. Read straight off window at this file's top
     level, so that script must run before this one. */
  const HeroLogo = window.MoneyMakerLogo.HeroLogo;

  // Full-color designer-supplied icons live in moneymaker_icons.jsx — split out when this file
  // crossed the 300-line rule (see that file's header). Referenced directly (not via the
  // React.createElement wrapper MMGrid/MMBackdrop/MMGrain above need) because NumeralIcon is
  // consumed as a plain prop value in StepHalf, never written as a raw window.X.Y JSX tag name —
  // that restriction only applies to the tag position itself, not to how a variable holding a
  // component got its value. Requires moneymaker_icons.jsx's <script> to run before this one.
  const STEPS = [
    { n: 1, NumeralIcon: window.MoneyMakerIcons.IcoProfile, node: 'Sign in with the same now.gg account you applied with.' },
    { n: 2, NumeralIcon: window.MoneyMakerIcons.IcoCodeFolder, node: 'Run the MoneyMaker skill: it finds jobs and runs them for you.' }
  ];

  /* Steps card (StepHalf + StepsCard, the single divided card replacing two square ones) lives
     in moneymaker_steps.jsx — split out when this file crossed the 300-line rule. Referenced
     directly, same reasoning as window.MoneyMakerIcons above: StepsCard is used as a plain JSX
     tag (a local variable), never as a raw window.X.Y tag name. */
  const StepsCard = window.MoneyMakerSteps.StepsCard;

  /* Full-page, chrome-free — same slot as Onboarding.OnboardingWelcome. onSignIn opens the shared
     LoginModal directly at its 'browser' step (this page already IS the "please sign in" screen,
     so the modal's own default step would just repeat it).

     Reskinned onto creator-brand's own design theme (globals.css --bai-* tokens + that route's
     creator-brand.css), not blueai-product's own light system: the --bai-page canvas, its ambient
     orb backdrop + paper grain, Space Grotesk headings in the --bai-* ink ramp, and the brand
     iris→cyan CTA gradient + glow shadow in place of the flat #1990FF this product uses elsewhere.
     Scoped to just this screen — the rest of blueai-product keeps its own system.

     Layering: MMGrid (zIndex 0, the receding grid) → MMBackdrop + MMGrain + the big hero logo
     (zIndex 1, background decoration — the logo fades out via a mask gradient rather than sitting
     in the content flow, same masking technique as MoneyMakerHome's watermark) → the actual
     content column (zIndex 2). */
  function MoneyMakerWelcome({ onSignIn }) {
    /* The title's opening beat: it appears at the screen's TRUE vertical center, then the steps
       card arriving below lifts it to its real resting place. The card and CTA occupy their
       layout space from frame one (they're only invisible, never absent), so the title's resting
       position never moves — the lift is a pure transform, and the distance is exactly half the
       height of everything below the title, minus half the 68px gap above it (the content column
       is centered as a whole, so growth below the title displaces it by half). Measured rather
       than hardcoded: the card's height depends on how the two step bodies wrap, so any constant
       here would be wrong the first time the copy changed. useLayoutEffect, not useEffect, so
       --mm-shift is set before the browser paints frame one — the rise is delayed 0.9s, but the
       animation's backwards fill reads the variable immediately. */
    const belowRef = useRef(null);
    const [shift, setShift] = useState(0);
    useLayoutEffect(() => {
      if (belowRef.current) setShift(Math.round(belowRef.current.offsetHeight / 2 - 34));
    }, []);

    return (
      <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#F9F9FA', padding: '32px 26px', overflowY: 'auto', overflowX: 'hidden' }}>
        <style>{`
          /* INTRO CHOREOGRAPHY — one timeline, five beats, each handing off to the next with no
             overlap except the one that's deliberately simultaneous (beat 2). Every beat fades in
             from a blur as well as from below: the blur is what makes a slow move read as
             "resolving into place" rather than just sliding, and it scales with the travel
             distance (title 10px of blur for no travel, card 8, CTA 5, logo 18 for its long one).

               0.00s  title materializes AT the vertical center, still (0.9s)
               0.90s  steps card rises in AND lifts the title to its resting place (0.75s, shared
                      easing + duration so the two read as one cause and effect, not two events)
               1.65s  CTA rises in, shorter travel and shorter duration (0.6s)
               2.20s  logo drifts up from behind the title to its place — very slow (2.4s)
               4.60s  logo hands off to its perpetual brightness pulse + outward wave
               4.70s  terms fade in, last and slowest (1.2s)

             The card/CTA easing is this product's house curve (cubic-bezier(0.22,1,0.36,1)); the
             logo gets a gentler one (0.4,0.85,0.2,1) because the house curve front-loads almost
             all of its speed, which reads as a snap rather than a drift over 2.4s. */
          @keyframes mmTitleIn { from { opacity: 0; filter: blur(10px); } to { opacity: 1; filter: blur(0); } }
          @keyframes mmTitleRise { from { transform: translateY(var(--mm-shift, 0px)); } to { transform: translateY(0); } }
          @keyframes mmCardUp { from { opacity: 0; transform: translateY(30px); filter: blur(8px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
          @keyframes mmCtaUp { from { opacity: 0; transform: translateY(16px); filter: blur(5px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
          /* The logo's own keyframes (.mm-logo / .mm-logo-art) live in moneymaker_logo.jsx
             alongside the elements they drive — the layers only work because their opacities and
             delays are tuned against each other, and separating the rules from the markup is how
             that drifts. Their delays continue this timeline: the logo travels 2.2-4.6s, then its
             brighten pulse picks up at 4.6s. */
          @keyframes mmTermsEnter { from { opacity: 0; } to { opacity: 1; } }
          .mm-title { animation: mmTitleIn 0.9s cubic-bezier(0.22,1,0.36,1) both, mmTitleRise 0.75s cubic-bezier(0.22,1,0.36,1) 0.9s both; }
          .mm-card { animation: mmCardUp 0.75s cubic-bezier(0.22,1,0.36,1) 0.9s both; }
          .mm-cta { animation: mmCtaUp 0.6s cubic-bezier(0.22,1,0.36,1) 1.65s both; }
          .mm-terms { animation: mmTermsEnter 1.2s ease-out 4.7s both; }
          @media (prefers-reduced-motion: reduce) {
            .mm-title, .mm-card, .mm-cta { animation: none !important; }
            .mm-terms { animation: none !important; opacity: 1 !important; }
          }
        `}</style>

        <MMGrid />
        <MMBackdrop />
        <MMGrain />
        {/* Hero logo — the mark, its brand glow, its pulsing ring and its grain overlay, plus
           the cursor-proximity morph and the entrance travel, all live in moneymaker_logo.jsx
           (split out when this file crossed the 300-line rule). It positions itself absolutely
           against this same root, so it stays out of the content flow. */}
        <HeroLogo />

        {/* Vertically centered in the whole screen (top:50% + translateY(-50%)), then offset
           +25px down (was pushed +50px, pulled back up 25px per the designer's call, alongside
           the logo moving +25px down — the two were drifting too close together) — the Terms &
           Conditions footer stays
           pinned to the bottom on its own, unaffected, since it's a separate absolutely-
           positioned element below. left/right 26px replicates the root's own horizontal
           padding, since absolutely positioned children measure against the padding box and
           would otherwise ignore it. */}
        <div style={{ position: 'absolute', top: 'calc(50% + 25px)', left: 26, right: 26, zIndex: 2, transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', '--mm-shift': `${shift}px` }}>
          <h1 className="mm-title" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 27, fontWeight: 700, color: '#080A1F', letterSpacing: '-0.02em', lineHeight: 1.18, textAlign: 'center', textWrap: 'balance', marginTop: 68 }}>
            An AI that turns your social accounts <span style={{ background: 'linear-gradient(to bottom right, #7B4CFF 0%, #0EA4C5 99%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>into income.</span>
          </h1>

          {/* Everything below the title, in one wrapper — because its measured height is what the
             title's opening offset is derived from (see the useLayoutEffect above). display:flex
             matters here and isn't cosmetic: in a plain block wrapper the card's 40px marginTop
             would collapse through the wrapper's top edge and be missing from offsetHeight, making
             the measured lift 20px short. */}
          <div ref={belowRef} style={{ display: 'flex', flexDirection: 'column' }}>
            {/* One shared card (StepsCard) holding both steps stacked. Its arrival IS the beat that
               lifts the title — same duration and easing as mmTitleRise, started at the same 0.9s,
               so the two read as one cause and effect.

               marginTop 40 → 32 to match the CTA's own 32 below: the title, card and CTA are one
               vertical stack, and an uneven gap inside a three-item stack reads as a mistake rather
               than as hierarchy. Equalising DOWN rather than up (32, not 40) keeps the group
               compact now that the card is two stacked rows instead of two side-by-side columns.
               No change needed to the title's opening offset — it's measured off this wrapper, so it
               follows the new height on its own. */}
            <div className="mm-card" style={{ marginTop: 32 }}>
              <StepsCard steps={STEPS} />
            </div>

            {/* Brand CTA — creator-brand's own gradient + glow shadow (globals.css
               --bai-cta-gradient / the cb-scope-tuned --bai-shadow-cta) in place of the flat
               #1990FF this product uses elsewhere for a full-page sign-in CTA. --bai-legacy-blue
               (rgb(26,144,255)) as the gradient's own start stop keeps a thread back to this
               product's usual accent. Its hover sets `transform` inline, which is safe: mmCtaUp
               has finished and released the property long before anyone can reach the button. */}
            <button onClick={onSignIn} className="mm-cta"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', marginTop: 32, background: 'linear-gradient(105deg, #1A90FF 0%, #6b53ff 55%, #7B4CFF 100%)', border: 'none', borderRadius: 999, padding: '13px 0', fontSize: 14.5, fontWeight: 700, color: 'white', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 16px -8px rgba(95,70,255,.42)', transition: 'transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.filter = 'brightness(1.06)'; e.currentTarget.style.boxShadow = '0 9px 20px -8px rgba(95,70,255,.5)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.filter = ''; e.currentTarget.style.boxShadow = '0 6px 16px -8px rgba(95,70,255,.42)'; }}>
              Sign in to get started
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        {/* Pinned to the bottom of the whole screen, not the content block — the content column
           above is vertically centered, so this sits outside it as its own absolutely-positioned
           footer, EXCLUDED from the +50px shift applied to that block above. Hover color is
           creator-brand's own --cb-accent (#2258c9, that route's header/footer link hover), not
           the generic gray-darken login.jsx's Terms & Conditions links use. Last in the intro
           sequence — mmTermsEnter, starting just after the logo's own entrance finishes (4.7s),
           fading in slowest of all. */}
        <button onClick={(e) => e.preventDefault()} className="mm-terms"
          style={{ position: 'absolute', left: 0, right: 0, bottom: 24, zIndex: 2, textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: '#9ca3af', opacity: 0, transition: 'color 0.15s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#2258c9'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>
          Terms &amp; Conditions
        </button>
      </div>);
  }

  /* The post-login in-chat card (MoneyMakerHome + its coachmark + the dollar glyph + PROMPT) lives
     in moneymaker_home.jsx — split out when this file crossed the 300-line rule. Re-exported here
     unchanged so the existing call site (chat_product.jsx's <window.MoneyMaker.MoneyMakerHome />)
     doesn't move. Read straight off window at this file's top level — same convention as
     window.MoneyMakerIcons/Steps above — so moneymaker_home.jsx's <script> must run first. */
  const { MoneyMakerHome, PROMPT } = window.MoneyMakerHomeCard;

  window.MoneyMaker = { MoneyMakerWelcome, MoneyMakerHome, PROMPT };
})();
