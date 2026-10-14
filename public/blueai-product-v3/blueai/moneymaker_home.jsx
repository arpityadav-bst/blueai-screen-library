// BlueAI: MoneyMaker's POST-LOGIN in-chat card (MoneyMakerHome) + its first-run coach spotlight
// and the dollar glyph the card's tile uses. Split out of moneymaker.jsx (2026-08-18) when that file
// crossed the workspace's 300-line rule.
//
// Clean seam: this is the only part of the feature that renders INSIDE the chat (in ChatScreen's
// !started home slot, on blueai-product's own light design system), whereas the welcome screen in
// moneymaker.jsx runs on creator-brand's theme, two surfaces that share no style and no state.
//
// PROVENANCE: the card + spotlight in this file come from the PM's `moneymaker-first-run-polish`
// branch (commit 6fc57e7, Abhisht Shukla, 2026-08-18), ported across our own 300-line splits. Only
// the CHAT-HOME half of that commit was taken, its welcome-screen changes were deliberately NOT
// applied, since the welcome screen has since been reworked much further here.
//
// Exposes window.MoneyMakerHomeCard = { MoneyMakerHome, PROMPT }. PROMPT lives here because the
// card's CTA is its only consumer; moneymaker.jsx re-exports both on window.MoneyMaker so the
// existing call site in chat_product.jsx is untouched by the split.
(function () {
  const { useState } = React;

  /* Dollar glyph: designer-supplied SVG asset (filled, not stroke), swapped in for the earlier
     custom-drawn version. Down to ONE use now, the card's tile. Two former uses are gone: an
     oversized card watermark, cut because it sat behind the description text and read as a smudge
     (and two dollar signs on one small card was one too many); and the welcome screen's step-2 tile
     (the welcome now uses numbered step discs, V3 Phase 2).
     Kept parameterised anyway; it costs nothing and the card renders it at a non-default size.
     V3 (phase 4): it takes the tile's ink (money is ink, never green). */
  function IcoDollar({ size = 22 }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.558 14.82c0-.453-.128-.813-.382-1.078-.25-.272-.675-.52-1.278-.747a15.837 15.837 0 0 1-1.561-.673 5.255 5.255 0 0 1-1.129-.772 3.23 3.23 0 0 1-.73-1.029c-.172-.393-.258-.86-.258-1.403 0-.935.299-1.702.897-2.3.597-.597 1.391-.945 2.382-1.045V4.66a.664.664 0 0 1 1.328 0v1.137c.98.138 1.746.548 2.3 1.228.372.455.619 1 .74 1.637.104.543-.358.995-.91.995h-.4c-.552 0-.96-.464-1.14-.986a1.534 1.534 0 0 0-.274-.5c-.272-.332-.637-.498-1.096-.498-.454 0-.805.13-1.054.39-.25.255-.374.609-.374 1.062 0 .421.122.759.365 1.013.244.255.695.515 1.353.78.665.266 1.21.518 1.636.756.426.232.785.498 1.079.797.293.293.517.63.672 1.012.155.377.232.817.232 1.32 0 .941-.293 1.705-.88 2.291-.586.587-1.394.933-2.423 1.038v.992a.66.66 0 0 1-1.32 0v-.984c-1.134-.122-2.014-.523-2.64-1.203-.426-.473-.706-1.052-.84-1.737-.104-.542.358-.995.91-.995h.4c.552 0 .962.465 1.153.984.075.206.18.385.311.536.316.348.767.522 1.353.522.487 0 .872-.127 1.154-.381.282-.26.424-.609.424-1.046Z" />
      </svg>);
  }

  /* Onboarding tooltip: one bold line, an explicit "Okay" dismiss. Copy went through three rounds,
     "…get your first job" (promised scarce supply),
     "Start here." (too stubby next to the button), headline + explainer body (too much), and landed
     on the single instruction "Run this to begin"; don't re-add a body line or promissory copy.

     This REPLACES the earlier dark self-animating pill (its mmJump tick and mmShine sweep are gone
     with it, keyframes included). The reasoning is worth keeping: the scrim spotlight does the
     attention work now, so the tooltip can sit still and offer a way out instead of nagging on a
     timer. Right-aligned with a right-offset caret so it aims at the compact Run pill on the card's
     right edge, rather than centring under a card whose action is no longer centred.
     V3 (phase 4): a white popover with a 1px line and the floating cast, not a blue fill (blue is
     never a surface); Okay is the ladder's quiet step, since Run is this view's one committing action. */
  function CoachTooltip({ title, onOkay }) {
    return (
      <div className="v3-coach">
        <div className="v3-coach-tip" role="note">
          <p className="v3-coach-title">{title}</p>
          <div className="v3-coach-actions">
            <button type="button" onClick={onOkay} className="v3-quiet">Okay</button>
          </div>
        </div>
      </div>);
  }

  // Renamed 2026-09-09 (designer directive: MoneyMaker -> "BlueAI worker"), copy only, this
  // string still gets pushed into the conversation as the simulated user message, so it had to
  // read naturally, not just find/replace the name in place.
  const PROMPT = 'Run the BlueAI worker to find and complete my first paid job.';

  /* Renders in ChatScreen's !started home slot in place of ProductHome, when sessionMode is
     'moneymaker'. The greeting above it is IntroCard (product_home.jsx) with its title/sub
     overridden by the caller, this component is the card plus a one-time coach spotlight.

     Card anatomy is skills.jsx's row (tile · name+description · compact action pill), because the
     button only needs the verb: the tile and the title already say MoneyMaker. The whole card is
     clickable: the pill is a small target, and on a spotlighted first run clicking the lit thing
     should just work; the pill stopPropagations so it doesn't double-fire.
     V3 (phase 4): the chat home's row language (chat.css .v3-row) at card size, a 1px line and no
     cast, the dollar on a sunken tile in ink, and Run as the solid ink button. The spinning gradient
     border and the blue halo are gone (no gradients, no glows); while the coach lights it, the card
     sits above the veil, so for that moment it floats with the dialog cast.

     THE SCRIM: absolute inset-0, which resolves against .ba-app. That's verified, not assumed: the
     five wrappers between this component and .ba-app (the marginTop:4 div, the chat scroller, its
     overflow:hidden parent, the 420px chat column, and ChatScreen's own fragment) are all
     position:static with no transform, and .ba-app is position:relative. Two consequences worth
     knowing before anyone refactors that chain: overflow alone doesn't clip an absolute box whose
     containing block is an ancestor of the clipper, which is why the scrim escapes the chat
     scroll-area: but a transform ANYWHERE in that chain would capture it and it would clip. The
     jobs/schedule/settings tabs wrap their content in .tab-anim, whose tabFadeUp animates transform;
     the chat branch does not, and that is load-bearing.

     zIndex 40 covers the TopNavbar (20), the composer (positioned, auto) and the bottom nav
     (static), and stays under the in-app modals (shared.jsx's 60); the card+tooltip column lifts to
     41 ONLY WHILE COACHING. It used to stay at 41 for good, which left the card out-ranking the
     header after the scrim was gone, so the header's kebab dropdown (60, but inside the header's
     own z-20 layer) rendered underneath the card (Abhisht, 2026-09-30). With no scrim there is
     nothing to sit above, so the column drops back to auto. Dismiss = Okay, clicking the scrim, or
     just running the skill, the conversation replaces this component entirely. */
  function MoneyMakerHome({ onRun }) {
    // A returning person (the worker already set up): no coach spotlight, and the earnings strip
    // above the card says where they are this month (sheet row 2, 2026-10-12).
    const back = window.WorkerFlow.isOnboarded();
    const [coaching, setCoaching] = useState(!back);
    const run = () => onRun(PROMPT, 'MoneyMaker');

    return (
      <div>
        {coaching && <div className="v3-coach-scrim" onClick={() => setCoaching(false)} aria-hidden="true" />}

        <div className={'v3-wk-stack' + (coaching ? ' is-coaching' : '')}>
          {back && <window.WorkerDayDone.EarningsStrip />}
          <div role="button" tabIndex={0} onClick={run} className={'v3-row v3-wk-home' + (coaching ? ' is-lit' : '')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); run(); } }}>
            <span className="v3-row-tile v3-row-tile--lg"><IcoDollar size={22} /></span>
            <div className="v3-row-main">
              {/* Renamed 2026-09-09 (designer directive: MoneyMaker -> "BlueAI worker"). */}
              <p className="v3-row-title">BlueAI worker</p>
              <p className="v3-row-desc">Finds jobs that fit you and runs them on your account.</p>
            </div>
            <button type="button" onClick={(e) => { e.stopPropagation(); run(); }} className="v3-btn-solid v3-btn-sm">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
              Run
            </button>
          </div>

          {/* Deliberately promise-free copy: no "job" anywhere in this nudge, supply may be
             scarce at launch, and "your first paid job starts here" read as a guarantee. */}
          {coaching && <CoachTooltip title="Run this to begin" onOkay={() => setCoaching(false)} />}
        </div>
      </div>);
  }

  window.MoneyMakerHomeCard = { MoneyMakerHome, PROMPT };
})();
