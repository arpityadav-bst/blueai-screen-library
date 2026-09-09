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
(function () {
  const BLUE = '#1990FF';
  const CARD_BORDER = 'rgba(182,184,204,0.8)';
  const CARD_SHADOW = '0 4px 32px rgba(0,0,0,0.10)';
  const Divider = () => <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(35,38,66,0.18),transparent)', margin: '2px 0' }} />;
  const pillBtn = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: BLUE, border: 'none', borderRadius: 999, padding: '9px 22px', fontSize: 15, fontWeight: 700, color: 'white', cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.15s' };
  const hov = { onMouseEnter: (e) => e.currentTarget.style.opacity = '0.9', onMouseLeave: (e) => e.currentTarget.style.opacity = '1' };

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
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 4px 16px' }}>
          <span style={{ display: 'inline-block', width: 26, height: 26, background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', WebkitMaskImage: 'url(assets/Credits.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskImage: 'url(assets/Credits.svg)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }} />
          <span style={{ fontSize: 38, fontWeight: 800, lineHeight: 1, letterSpacing: '-1px', background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>0</span>
        </div>
        <Divider />
        <div style={{ textAlign: 'center', padding: '16px 4px 4px' }}>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#080a1f' }}>Out of credits</p>
          {/* Two sentences, two lines, as drawn. Separate blocks rather than one wrapping
             paragraph, so the break always lands after "credits." instead of wherever the
             available width happens to put it. */}
          <p style={{ fontSize: 13, color: '#565977', lineHeight: 1.55, marginTop: 7 }}>
            <span style={{ display: 'block' }}>You&rsquo;ve used all of today&rsquo;s AI credits.</span>
            <span style={{ display: 'block' }}>Credits will be refreshed tomorrow.</span>
          </p>
          <button onClick={onDismiss} {...hov} style={{ ...pillBtn, marginTop: 18 }}>Got it</button>
        </div>
      </div>
    );
  }

  /* The on-send popup. No `mode` any more: there is one card, because there is one kind of member.
     Closes on the X, on the backdrop, and on "Got it", which all route to the same onClose. */
  function OutOfCreditsModal({ onClose }) {
    return (
      <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        style={{ position: 'absolute', inset: 0, zIndex: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.5)', padding: 22 }}>
        <div style={{ width: '100%', maxWidth: 300, position: 'relative', background: 'white', border: '1px solid ' + CARD_BORDER, borderRadius: 12, boxShadow: CARD_SHADOW, padding: '16px 18px 18px' }}>
          <button aria-label="Close" onClick={onClose} style={{ position: 'absolute', top: 10, right: 10, zIndex: 2, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4, display: 'flex', borderRadius: 8 }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#475569'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
          <OutOfCreditsCard onDismiss={onClose} />
        </div>
      </div>
    );
  }

  window.Byok = Object.assign(window.Byok || {}, { OutOfCreditsCard, OutOfCreditsModal });
})();
