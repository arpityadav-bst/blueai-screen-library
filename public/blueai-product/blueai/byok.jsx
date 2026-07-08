// BlueAI — Out-of-credits popups + credits-screen BYOK entry points.
// BYOK CONFIG now lives in Settings (byok_settings.jsx). These are the *routes* into it:
//   • OutOfCreditsModal(byok)   → a concise "Use Your API Key" prompt → Add API Key → Settings
//   • OutOfCreditsModal(prime)  → Prime upsell (paid path, prime geo non-member)
//   • OutOfCreditsModal(topup)  → Top-up (paid path, prime member out of credits)
//   • CreditsByokRow            → the credits-screen row/button that routes to Settings BYOK
// Chrome matched to Figma: frosted "NOT ENOUGH CREDITS" banner peeking behind a white card.
// Exposes window.Byok = { PrimeUpsellCard, TopUpCard, ByokUpsell, CreditsByokRow, OutOfCreditsModal } (+ ByokSettings from byok_settings.jsx).
(function () {
  const BLUE = '#1990FF';
  const gradText = { background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' };
  const CARD_BORDER = 'rgba(182,184,204,0.8)';
  const CARD_SHADOW = '0 4px 32px rgba(0,0,0,0.10)';
  const Divider = () => <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(35,38,66,0.18),transparent)', margin: '2px 0' }} />;
  const ChevR = ({ c = 'currentColor', s = 13 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>;
  const pillBtn = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: BLUE, border: 'none', borderRadius: 999, padding: '9px 22px', fontSize: 15, fontWeight: 700, color: 'white', cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.15s' };
  const hov = { onMouseEnter: (e) => e.currentTarget.style.opacity = '0.9', onMouseLeave: (e) => e.currentTarget.style.opacity = '1' };

  const KeyIcon = (p) => (
    <svg width={p.s || 26} height={p.s || 26} viewBox="0 0 24 24" fill="none" stroke={p.c || BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  );

  // Concise "you need credits → use your own key" prompt (screenshot 5). The full BYOK config
  // is NOT crammed here — the button routes to Settings, where the key is actually added.
  function ByokUpsell({ onAddKey }) {
    return (
      <div style={{ textAlign: 'center', padding: '4px 2px 2px' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e8f1fe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px auto 16px' }}>
          <KeyIcon s={28} c={BLUE} />
        </div>
        <h3 style={{ fontSize: 21, fontWeight: 800, color: '#080a1f', letterSpacing: '-0.3px' }}>Use your own key</h3>
        <p style={{ fontSize: 13.5, color: '#565977', lineHeight: 1.5, margin: '7px auto 18px', maxWidth: 250 }}>Add a key to continue using BlueAI.</p>
        <button {...hov} onClick={onAddKey} style={{ ...pillBtn, width: '100%', padding: '13px 22px', fontSize: 15.5, boxShadow: '0 6px 20px rgba(25,144,255,0.32)' }}>Add API key</button>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 7, marginTop: 15 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1.5 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
          <span style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.45, textAlign: 'left' }}>You can manage it later in settings.</span>
        </div>
      </div>
    );
  }

  // Prime offer (non-member) — content only. Matches Figma "Teaser": $3.99 / $4.99 next month.
  function PrimeUpsellCard() {
    return (
      <div>
        <div style={{ textAlign: 'center', padding: '2px 4px 12px' }}>
          <p style={{ fontSize: 13, color: '#565977' }}>BlueAI runs on credits</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#080a1f', marginTop: 3 }}>Get AI Credits with Prime</p>
        </div>
        <Divider />
        <div style={{ textAlign: 'center', padding: '14px 4px 12px' }}>
          <p style={{ ...gradText, fontSize: 54, fontWeight: 800, letterSpacing: '-2px', lineHeight: 1 }}>5000</p>
          <p style={{ ...gradText, fontSize: 22, fontWeight: 800, marginTop: 2 }}>AI Credits</p>
          <p style={{ fontSize: 13, color: '#565977', marginTop: 6 }}>every month</p>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: BLUE, fontFamily: 'inherit', marginTop: 9, display: 'inline-flex', alignItems: 'center', gap: 3 }}>View all benefits <ChevR /></button>
        </div>
        <Divider />
        <div style={{ textAlign: 'center', padding: '16px 4px 2px' }}>
          <button {...hov} style={pillBtn}>Try for $3.99 <ChevR c="white" s={15} /></button>
          <p style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 11 }}>$4.99 next month onwards.</p>
        </div>
      </div>
    );
  }

  // Prime MEMBER, out of credits — TOP-UP (not a re-pitch of Prime).
  function TopUpCard() {
    return (
      <div>
        <div style={{ textAlign: 'center', padding: '2px 4px 12px' }}>
          <p style={{ fontSize: 13, color: '#565977' }}>You&rsquo;ve used all your credits</p>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#080a1f', marginTop: 3 }}>Top up to keep going</p>
        </div>
        <Divider />
        <div style={{ textAlign: 'center', padding: '16px 10px 14px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 999, background: '#f1f5f9' }}>
            <span style={{ display: 'inline-block', width: 14, height: 14, background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', WebkitMaskImage: 'url(assets/Credits.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskImage: 'url(assets/Credits.svg)', maskSize: 'contain', maskRepeat: 'no-repeat' }} />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: '#565977' }}>Prime credits renew in 11 days</span>
          </div>
          <p style={{ fontSize: 13, color: '#565977', lineHeight: 1.5, margin: '14px auto 0', maxWidth: 240 }}>Top up now to keep BlueAI working, or manage your plan.</p>
        </div>
        <Divider />
        <div style={{ textAlign: 'center', padding: '16px 4px 2px' }}>
          <button {...hov} style={pillBtn}>Top Up Credits <ChevR c="white" s={15} /></button>
          <p style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 11 }}>Or manage your subscription.</p>
        </div>
      </div>
    );
  }

  // Credits-screen invite CARD — routes to Settings › BYOK. Designed to carry the screen (not a thin
  // strip): icon + promise + three benefit lines + a full-width CTA. Only ONE state now — a key that's
  // switched off is DELETED (PM), so no "key saved but off". When a key IS on, the screen shows the
  // "Running on your own key" card instead. (Exported as CreditsByokRow for the existing call site.)
  var BYOK_BENEFITS = [
    'Works with OpenAI, Anthropic, Gemini and more',
    'Usage is billed to your provider, not BlueAI',
    'Your key is stored on this device only'
  ];
  function CreditsByokRow({ onManage }) {
    return (
      <div style={{ background: 'white', border: '1px solid #e8edf3', borderRadius: 16, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 15 }}>
          <span style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(14,164,197,0.14),rgba(123,76,255,0.14))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><KeyIcon s={21} c={BLUE} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 16, fontWeight: 800, color: '#080a1f' }}>Bring your own key</p>
            <p style={{ fontSize: 12.5, color: '#565977', marginTop: 2 }}>Use BlueAI without spending credits.</p>
          </div>
        </div>
        <div style={{ height: 1, background: '#eef2f6', marginBottom: 15 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 18 }}>
          {BYOK_BENEFITS.map(function (b, i) {
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><polyline points="20 6 9 17 4 12" /></svg>
                <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.4 }}>{b}</span>
              </div>
            );
          })}
        </div>
        <button {...hov} onClick={onManage} style={{ ...pillBtn, width: '100%', padding: '12px 22px', fontSize: 14.5, boxShadow: '0 6px 20px rgba(25,144,255,0.28)' }}>Add your key in Settings <ChevR c="white" s={15} /></button>
      </div>
    );
  }

  // On-send out-of-credits popup. mode: 'prime' | 'topup' | 'byok'. Banner + white card (Figma chrome).
  function OutOfCreditsModal({ mode, onClose, onAddKey }) {
    const body = mode === 'byok' ? <ByokUpsell onAddKey={onAddKey} /> : mode === 'topup' ? <TopUpCard /> : <PrimeUpsellCard />;
    return (
      <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        style={{ position: 'absolute', inset: 0, zIndex: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.5)', padding: 22 }}>
        <div style={{ width: '100%', maxWidth: 300, position: 'relative' }}>
          {/* frosted "NOT ENOUGH CREDITS" banner — sits BEHIND the card, only its labelled strip shows */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: 'linear-gradient(180deg,#f8dade,#eef0f4)', border: '1px solid #f2c9cf', borderBottom: 'none', borderRadius: '12px 12px 0 0', padding: '9px 14px 20px', WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)', position: 'relative', zIndex: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="#eb553e" /><rect x="11.1" y="8.5" width="1.8" height="5.2" rx="0.9" fill="#fff" /><rect x="11.1" y="15.4" width="1.8" height="1.9" rx="0.9" fill="#fff" /></svg>
            <span style={{ fontSize: 11.5, fontWeight: 500, letterSpacing: '1.4px', color: '#3d2029', textTransform: 'uppercase' }}>Not enough credits</span>
          </div>
          {/* the offer card — overlaps the banner's lower half */}
          <div style={{ position: 'relative', zIndex: 1, marginTop: -12, background: 'white', border: '1px solid ' + CARD_BORDER, borderRadius: 12, boxShadow: CARD_SHADOW, padding: '16px 18px 18px' }}>
            <button aria-label="Close" onClick={onClose} style={{ position: 'absolute', top: 10, right: 10, zIndex: 2, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4, display: 'flex', borderRadius: 8 }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#475569'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
            {body}
          </div>
        </div>
      </div>
    );
  }

  window.Byok = Object.assign(window.Byok || {}, { PrimeUpsellCard, TopUpCard, ByokUpsell, CreditsByokRow, OutOfCreditsModal });
})();
