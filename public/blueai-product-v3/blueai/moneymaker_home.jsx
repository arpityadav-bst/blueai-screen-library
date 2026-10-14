// BlueAI: MoneyMaker's POST-LOGIN in-chat card (MoneyMakerHome) + its first-run coach spotlight.
// Split out of moneymaker.jsx (2026-08-18) when that file crossed the workspace's 300-line rule.
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
            <button type="button" onClick={onOkay} className="v2-button v2-button--quiet v2-button--sm">Okay</button>
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

     Card anatomy is the old Skills screen's row (skills.jsx, deleted 2026-10-14) (tile · name+description · compact action pill), because the
     button only needs the verb: the tile and the title already say MoneyMaker. Run is the card's
     one control (review round 1: the card itself is no longer a button). Under the description,
     the mode line says how paid jobs run ("Always ask", or "Automatic on YouTube") with a quiet
     Change that opens the mode sheet (the kit's WorkerCard mode line, design-md 42).
     V3: the kit's card (review round 2: .v2-card, not a row, so no pointer and no hover: Run is its
     one target), a 1px line and no cast, the kit's earnings glyph (the one dollar mark, as the top
     bar's Earnings row) on the kit WorkerCard's sunken tile in ink, and Run as the solid ink button
     with the kit's outline play. The spinning gradient border and the blue halo are gone (no
     gradients, no glows); while the coach lights it, the card sits above the veil, so for that
     moment it floats with the dialog cast.

     THE SCRIM: absolute inset-0, which resolves against .ba-app. That's verified, not assumed: the
     five wrappers between this component and .ba-app (the marginTop:4 div, the chat scroller, its
     overflow:hidden parent, the chat column, and ChatScreen's own fragment) are all
     position:static with no transform, and .ba-app is position:relative. Two consequences worth
     knowing before anyone refactors that chain: overflow alone doesn't clip an absolute box whose
     containing block is an ancestor of the clipper, which is why the scrim escapes the chat
     scroll-area: but a transform ANYWHERE in that chain would capture it and it would clip. The
     jobs/schedule/settings tabs wrap their content in .v2-anim-fade-up, which animates transform;
     the chat branch does not, and that is load-bearing.

     The scrim's --v2-z-popover covers the top bar (--v2-z-header), the composer (positioned, auto)
     and the bottom nav (static), and stays under the in-app dialogs (--v2-z-dialog); the
     card+tooltip column lifts one step above it ONLY WHILE COACHING. It used to stay lifted for
     good, which left the card out-ranking the header after the scrim was gone, so the header's
     kebab dropdown (inside the header's own layer) rendered underneath the card (Abhisht, 2026-09-30). With no scrim there is
     nothing to sit above, so the column drops back to auto. Dismiss = Okay, clicking the scrim, or
     just running the skill, the conversation replaces this component entirely.

     ONCE A DAY (review round 2, R3, R10): once today has counted, or today was the setup, Run stays
     on the card with its label but is disabled (aria-disabled, so it keeps focus and its reason),
     and a reason line under the mode line says why and when the next run is (WorkerFlow.runLock).
     With no credits it is disabled too, the reason the live countdown to the refill. A skipped or
     failed day offers Run again; the strip's Retry answers a failed day (R4). */
  function MoneyMakerHome({ onRun, zeroCredits, onRetry, modeInBar }) {
    // A returning person (the worker already set up): no coach spotlight, and the earnings strip
    // above the card says where they are this month (sheet row 2, 2026-10-12).
    const back = window.WorkerFlow.isOnboarded();
    const [coaching, setCoaching] = useState(!back);
    const AP = window.AgentPermissions;
    const { autoApps } = AP.usePermissionMode();
    const auto = autoApps();
    const Icon = window.V2Kit.Icon;
    const reasonId = React.useId();
    const CP = window.CreditsPopupParts;
    const now = CP.useNow();
    const lock = window.WorkerFlow.runLock();
    const reason = lock || (zeroCredits
      ? <>Out of credits. Credits will be refreshed in <strong className="v3-figure">{CP.formatLeft(CP.nextUtcMidnight(now) - now)}</strong>.</>
      : null);
    const run = () => { if (!reason) onRun(PROMPT, 'MoneyMaker'); };

    return (
      <div>
        {coaching && <div className="v3-coach-scrim" onClick={() => setCoaching(false)} aria-hidden="true" />}

        <div className={'v3-wk-stack' + (coaching ? ' is-coaching' : '')}>
          {back && <window.WorkerDayDone.EarningsStrip onRetry={onRetry} />}
          <div className={'v2-card v3-wk-home' + (coaching ? ' is-lit' : '')}>
            <span className="v2-wcard-tile"><Icon name="earnings" size={24} /></span>
            <div className="v2-grow">
              {/* Renamed 2026-09-09 (designer directive: MoneyMaker -> "BlueAI worker"). */}
              <p className="v2-text-title-sm">BlueAI worker</p>
              <p className="v2-text-caption v3-wk-desc">Finds jobs that fit you and runs them on your account.</p>
              {/* Only when it matters (Appy, 2026-10-14): the worker is set up, Automatic is on (Always
                 ask is the safe default and needs no line), and the composer's Mode chip is not already
                 saying it below. */}
              {back && auto.length > 0 && !modeInBar && <p className="v3-wk-mode">
                <Icon name="zap" /><span className="v3-wk-mode-text">{AP.summary(auto)}</span>
                <button type="button" onClick={AP.openSheet} aria-haspopup="dialog" className="v2-button v2-button--quiet v2-button--sm v3-wk-mode-change">Change</button>
              </p>}
              {reason && <p id={reasonId} className="v2-text-caption v3-wk-reason">{reason}</p>}
            </div>
            <button type="button" onClick={run} aria-disabled={reason ? 'true' : undefined} aria-describedby={reason ? reasonId : undefined} className="v2-button v2-button--primary">
              <Icon name="play" />
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
