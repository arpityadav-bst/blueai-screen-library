// BlueAI V2 - the out-of-credits popup.
//
// SHRUNK HARD 2026-09-09 for V2's credit model. V2 has no membership tiers, no geo split and no
// top-up: every member is granted 2000 credits a day, automatically. That removed the reason for
// three of the four cards this file used to hold, so they are deleted rather than left unreachable:
//
//   PrimeUpsellCard  - pitched Prime at non-members. V2 has no non-members.
//   ByokUpsell       - pitched bring-your-own-key in geos with no Prime. V2 has one geo.
//   CreditsByokRow   - the credits screen's invite to add a key. That screen no longer carries it;
//                      adding a key lives in Settings (byok_settings.jsx), which is untouched and
//                      does not depend on anything here.
//
// The frosted red "NOT ENOUGH CREDITS" banner went with them. It existed because those upsell
// cards never said what had gone wrong, so the banner had to. The card below leads with its own
// "Out of credits" headline, which is why the designer's spec shows no banner at all.
//
// KeyIcon, ChevR and gradText were only used by the deleted cards and are gone too. BYOK config
// itself is unaffected: it lives in byok_settings.jsx and exposes window.Byok.ByokSettings.
//
// Exposes window.Byok = { OutOfCreditsCard, OutOfCreditsModal } (+ ByokSettings from byok_settings.jsx).
//
// V3, Phase 5: the popup is a dialog in the shared frame (worker.css .v3-dialog*, the dim veil and
// the floating cast), at the confirm width. The zero is an ink figure beside the credits glyph, the
// hairline closes the statement off, and "Got it", the one way out, is the solid ink button.
(function () {
  /* The out-of-credits card. Hitting zero in V2 is a "come back tomorrow" state, not a purchase
     moment, so this is dismiss-only. It was called TopUpCard until the model changed; a name
     promising a top-up that does not exist would mislead the next reader.

     Order is the designer's: the balance states the fact, the divider closes that statement off,
     then the explanation and the way out sit together beneath it. An earlier build had the divider
     under the body copy instead, which grouped the sentences with the number and left the button
     stranded alone below the line.

     "Got it" has to genuinely dismiss, so this takes onDismiss. Buttons elsewhere in this
     prototype are decorative; this one is the primary way out, there being no other action. */
  function OutOfCreditsCard({ onDismiss }) {
    // 2026-10-06 review (ROB-21389): say WHEN credits return, and let the (i) explain what they
    // are. The countdown, the (i) and its tooltip come from credits_popup_parts.jsx, shared with
    // the comparison page (credits-popup-options.html). The refill lands at 00:00 UTC.
    const P = window.CreditsPopupParts;
    const now = P.useNow();
    const left = P.formatLeft(P.nextUtcMidnight(now) - now);
    return (
      <div className="v3-dlg-center">
        <div className="v3-cr-figure">
          <img src="assets/Credits.svg" alt="" className="v3-cr-glyph" />
          <span className="v3-cr-value">0</span>
        </div>
        <hr className="v3-rule v3-dlg-rule" />
        {/* The (i) sits to the right of the title. Its tooltip opens upward, over the 0, so it
           never covers the two lines below or the button. */}
        <div className="v3-dlg-headline">
          <h2 className="v3-dialog-title">Out of credits</h2>
          <P.InfoTip dir="up" />
        </div>
        {/* Two sentences, two lines, as drawn. Separate blocks rather than one wrapping
           paragraph, so the break always lands after "credits." instead of wherever the
           available width happens to put it. */}
        <p className="v3-dlg-text">
          <span>You&rsquo;ve used all of today&rsquo;s AI credits.</span>
          <span>Credits will be refreshed in <strong className="v3-figure" style={{ whiteSpace: 'nowrap' }}>{left}</strong>.</span>
        </p>
        <button type="button" onClick={onDismiss} className="v3-btn-solid v3-btn-full v3-dlg-actions">Got it</button>
      </div>
    );
  }

  /* The on-send popup. No `mode` any more: there is one card, because there is one kind of member.
     Closes on the X, on the backdrop, and on "Got it", which all route to the same onClose. */
  function OutOfCreditsModal({ onClose }) {
    return (
      <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} className="v3-dialog-scrim" style={{ zIndex: 'var(--v2-z-dialog)' }}>
        <div role="dialog" aria-modal="true" aria-label="Out of credits" className="v3-dialog v3-dialog--plain v3-dialog--sm" style={{ overflow: 'visible' }}>
          <button type="button" aria-label="Close" onClick={onClose} className="v3-icon-btn v3-dlg-x"><IcoXClose size={18} /></button>
          <div className="v3-dialog-body">
            <OutOfCreditsCard onDismiss={onClose} />
          </div>
        </div>
      </div>
    );
  }

  window.Byok = Object.assign(window.Byok || {}, { OutOfCreditsCard, OutOfCreditsModal });
})();
