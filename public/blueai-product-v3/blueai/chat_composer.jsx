/* BlueAI: the chat's composer. Split out of chat_product.jsx (review round 1, 2026-10-14) for the
   300-line rule; chat_product.jsx owns the draft, the run state and the send / stop rules, this file
   only draws them.
   The kit's composer (kit/chat.css, design-md 38): a radius-10 box, a 1.5px blue focus edge, the
   round 36px send (sunken with an ink-4 glyph while there is nothing to send), Stop the ghost.
   Review round 1 (U6): what the run is doing never sits in the placeholder. It is the kit's muted
   status line above the field (.v2-composer-status): 'BlueAI is working…', 'Answer with the buttons
   above.', or, once a scheduled run has died on zero credits, when credits come back (the live
   countdown to the 00:00 UTC refill, CreditsPopupParts). That chat's disabled field points at New
   chat, where a message can go.
   Exposes window.ChatComposer = { Composer }. */
(function () {
  /* The scheduled run's own chat, out of credits: the countdown to the refill, ticking. */
  function RefillNote() {
    const CP = window.CreditsPopupParts;
    const now = CP.useNow();
    return <>Out of credits. Credits will be refreshed in <strong className="v3-figure">{CP.formatLeft(CP.nextUtcMidnight(now) - now)}</strong>.</>;
  }

  function Composer({ taRef, draft, setDraft, running, awaiting, onSend, onStop, isOnboarding, started, sessionMode, permUi, workerStarted, scheduledOoc }) {
    /* ROB-21350 Version 1: the Mode chip sits in the composer's bottom bar in every signed-in chat
       (product level), with Send moving down beside it. Version 2 keeps the one-row composer. */
    const modeChip = permUi === 'chatbox' && !isOnboarding;
    const status = running ? (awaiting ? 'Answer with the buttons above.' : 'BlueAI is working…') : (scheduledOoc ? <RefillNote /> : null);
    const sendBtn = (
      <button type="button" onClick={() => (running ? onStop() : onSend())} disabled={!running && !draft.trim()} aria-disabled={!running && !draft.trim()}
        aria-label={running ? 'Stop task' : 'Send message'} title={running ? 'Stop' : 'Send'}
        className={'v2-sendstop ' + (running ? 'v2-sendstop--stop' : 'v2-sendstop--send')}>
        {running
          ? <svg className="v2-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2" fill="currentColor" /></svg>
          : <svg className="v2-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>}
      </button>);

    return (
      <div className={'v2-composer v3-composer' + (isOnboarding && !started ? ' is-focus' : '')}>
        {/* Onboarding nudge: a pulsing "Send a message to watch BlueAI work" pill sits just
           above the composer until a message is attempted (matches the design's OnboardingChat).
           It floats, so it is the one thing here with a shadow; the blue dot is the live mark. */}
        {isOnboarding && !started &&
          <div className="v3-nudge">
            <span className="v3-nudge-dot" aria-hidden="true" />
            Send a message to watch BlueAI work
          </div>}
        {/* ROB-21350 Version 2: the Automatic ribbon, only once the worker has started in this chat. */}
        {permUi === 'ribbon' && workerStarted && <window.AgentPermissions.AutoRibbon />}
        {status && <p className="v2-composer-status" role="status">{status}</p>}
        {/* Focus shows as the blue edge + ring (:focus-within). The onboarding "type here" moment
           borrows the same look (.is-focus on the composer) until the first message is attempted. */}
        <div className={'v2-composer-box' + (modeChip ? ' v3-composer-box--stack' : '') + (running || scheduledOoc ? ' is-readonly' : '')}>
          {/* The scheduled run's own chat stays read-only once its run has died (designer's spec,
             2026-09-09): nobody was typing there and there is nothing to buy. Typing in a new chat
             still routes to the out-of-credits popup through run()'s zeroCredits guard, so the
             placeholder points there. The worker home is one card and a lot of air, so its
             placeholder points back up at the card. */}
          <textarea ref={taRef} className="v2-composer-input" value={draft} disabled={running || scheduledOoc} rows={1}
            aria-label="Message BlueAI"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
            placeholder={scheduledOoc && !running ? 'Start a New chat to send a message'
              : (sessionMode === 'moneymaker' && !started ? 'Ask anything, or run the BlueAI worker above' : 'Type your message...')}
            />
          {modeChip
            ? <div className="v3-composer-bar"><window.AgentPermissions.ModeChip />{sendBtn}</div>
            : sendBtn}
        </div>
      </div>);
  }

  window.ChatComposer = { Composer };
})();
