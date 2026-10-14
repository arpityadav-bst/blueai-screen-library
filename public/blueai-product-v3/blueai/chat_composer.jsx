/* BlueAI: the chat's composer. Split out of chat_product.jsx (review round 1, 2026-10-14) for the
   300-line rule; chat_product.jsx owns the draft, the run state and the send / stop rules, this file
   only draws them.
   The kit's composer (kit/chat.css, design-md 38): a radius-10 box, a 1.5px blue focus edge, the
   round 36px send (sunken with an ink-4 glyph while there is nothing to send), Stop the ghost.
   Review round 1 (U6): what the run is doing never sits in the placeholder. It is the kit's muted
   status line above the field (.v2-composer-status): 'BlueAI is working…', or, once a scheduled run
   has died on zero credits, when credits come back (the countdown to the 00:00 UTC refill,
   CreditsPopupParts). That chat's disabled field points at New chat, where a message can go.
   While a worker question waits, the field stays open for a typed answer (PM, 2026-10-14): its
   placeholder says so, and a typed answer turns Stop back into Send.
   Exposes window.ChatComposer = { Composer }. */
(function () {
  function Composer({ taRef, draft, setDraft, running, awaiting, onSend, onStop, isOnboarding, started, sessionMode, modeChip: chipOn, scheduledOoc }) {
    /* ROB-21350: the Mode chip sits in the composer's bottom bar in every signed-in chat (product
       level), the one place the mode is changed, with Send beside it. */
    const modeChip = chipOn && !isOnboarding;
    const CP = window.CreditsPopupParts;
    const status = running ? (awaiting ? null : 'BlueAI is working…') : (scheduledOoc ? <>Out of credits. <CP.RefillIn /></> : null);
    const busy = running && !(awaiting && draft.trim());   // a typed answer turns Stop back into Send
    const locked = (running && !awaiting) || scheduledOoc;
    const sendBtn = (
      <button type="button" onClick={() => (busy ? onStop() : onSend())} disabled={!busy && !draft.trim()} aria-disabled={!busy && !draft.trim()}
        aria-label={busy ? 'Stop task' : (awaiting ? 'Send answer' : 'Send message')} title={busy ? 'Stop' : 'Send'}
        className={'v2-sendstop ' + (busy ? 'v2-sendstop--stop' : 'v2-sendstop--send')}>
        <window.V2Kit.Icon name={busy ? 'stop' : 'arrow-up'} />
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
        {status && <p className="v2-composer-status" role="status">{status}</p>}
        {/* Focus shows as the blue edge + ring (:focus-within). The onboarding "type here" moment
           borrows the same look (.is-focus on the composer) until the first message is attempted. */}
        <div className={'v2-composer-box' + (modeChip ? ' v3-composer-box--stack' : '') + (locked ? ' is-readonly' : '')}>
          {/* The scheduled run's own chat stays read-only once its run has died (designer's spec,
             2026-09-09): nobody was typing there and there is nothing to buy. Typing in a new chat
             still routes to the out-of-credits popup through run()'s zeroCredits guard, so the
             placeholder points there. The worker home is one card and a lot of air, so its
             placeholder points back up at the card. */}
          <textarea ref={taRef} className="v2-composer-input" value={draft} disabled={locked} rows={1}
            aria-label="Message BlueAI"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
            placeholder={awaiting ? 'Or type your answer…'
              : scheduledOoc && !running ? 'Start a New chat to send a message'
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
