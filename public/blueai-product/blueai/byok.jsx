// BlueAI — Out-of-credits popups + Bring-your-own-key (BYOK).
// Three on-send variants (window: prime member → top-up · prime non-member → Prime offer ·
// non-prime geo → BYOK). Chrome matched to Figma (Instance Manager → Sign Up & Subscription):
// frosted "NOT ENOUGH CREDITS" banner peeking behind a white radius-12 card, soft shadow,
// gradient-fade dividers, compact centered pill buttons. Light theme throughout.
// Exposes window.Byok = { ByokForm, ByokFields, KeyAddedPanel, PrimeUpsellCard, TopUpCard, OutOfCreditsModal }.
(function () {
  const { useState } = React;

  const BLUE = '#1990FF';
  const gradText = { background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' };
  const CARD_BORDER = 'rgba(182,184,204,0.8)';               // Figma stroke #B6B8CC @ 80%
  const CARD_SHADOW = '0 4px 32px rgba(0,0,0,0.10)';         // Figma drop-shadow
  const Divider = () => <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(35,38,66,0.18),transparent)', margin: '2px 0' }} />;
  const ChevR = ({ c = 'currentColor', s = 13 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>;
  // centered compact pill (Figma button: radius 40, ~32 tall, hug)
  const pillBtn = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: BLUE, border: 'none', borderRadius: 999, padding: '9px 22px', fontSize: 15, fontWeight: 700, color: 'white', cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.15s' };
  const hov = { onMouseEnter: (e) => e.currentTarget.style.opacity = '0.9', onMouseLeave: (e) => e.currentTarget.style.opacity = '1' };

  const KeyIcon = (p) => (
    <svg width={p.s || 15} height={p.s || 15} viewBox="0 0 24 24" fill="none" stroke={p.c || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  );

  const PROVIDERS = { Anthropic: ['Claude 4.5', 'Claude 4.1', 'Claude 3.7'], OpenAI: ['GPT-5.4', 'GPT-5', 'o4'], Google: ['Gemini 3.1 Pro', 'Gemini 3 Flash'] };
  const labelStyle = { fontSize: 12, fontWeight: 700, color: '#475569', width: 66, flexShrink: 0 };
  const fieldWrap = { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 };
  const controlBase = { flex: 1, minWidth: 0, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 12px', fontSize: 13.5, color: '#111827', fontFamily: 'inherit', outline: 'none' };

  function Select({ value, options, onChange }) {
    return (
      <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
        <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...controlBase, width: '100%', appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer', paddingRight: 30 }}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><polyline points="6 9 12 15 18 9" /></svg>
      </div>
    );
  }

  // BYOK form CONTENT (no card chrome) — used inside the modal and, wrapped, on the credits screen.
  function ByokFields({ onUse }) {
    const [provider, setProvider] = useState('Anthropic');
    const [model, setModel] = useState(PROVIDERS.Anthropic[0]);
    const [key, setKey] = useState('');
    const pickProvider = (p) => { setProvider(p); setModel(PROVIDERS[p][0]); };
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <KeyIcon s={16} c={BLUE} />
          <h3 style={{ fontSize: 15.5, fontWeight: 800, color: '#080a1f' }}>Use your own key</h3>
        </div>
        <p style={{ fontSize: 12.5, color: '#565977', margin: '0 0 15px' }}>Configure your own LLM provider</p>
        <div style={fieldWrap}><span style={labelStyle}>Provider</span><Select value={provider} options={Object.keys(PROVIDERS)} onChange={pickProvider} /></div>
        <div style={fieldWrap}><span style={labelStyle}>Model</span><Select value={model} options={PROVIDERS[provider]} onChange={setModel} /></div>
        <div style={fieldWrap}>
          <span style={{ ...labelStyle, display: 'inline-flex', alignItems: 'center', gap: 4 }}>API Key
            <span title="Your key is stored locally on this device and never sent to BlueAI." style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 14, height: 14, borderRadius: '50%', border: '1px solid #cbd5e1', color: '#94a3b8', fontSize: 9.5, fontWeight: 700, cursor: 'help' }}>?</span>
          </span>
          <input value={key} onChange={(e) => setKey(e.target.value)} type="text" spellCheck={false} autoComplete="off" placeholder="Paste your API key" style={{ ...controlBase, fontFamily: 'ui-monospace, Menlo, monospace' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
          <button {...hov} onClick={() => onUse && onUse({ provider, model, key: key.trim() || 'sk-ant-9Xsjhdw1u294' })} style={{ ...pillBtn, borderRadius: 10, padding: '10px 20px', fontSize: 14 }}>Use my key</button>
        </div>
      </div>
    );
  }
  // Standalone (credits screen): the fields inside a card.
  function ByokForm({ onUse }) {
    return <div style={{ background: 'white', border: '1px solid ' + CARD_BORDER, borderRadius: 12, padding: 18, boxShadow: CARD_SHADOW }}><ByokFields onUse={onUse} /></div>;
  }

  function KeyAddedPanel({ info, onEdit, onRemove }) {
    const k = info || { provider: 'Anthropic', model: 'Claude 4.5', key: 'sk-ant-9Xsjhdw1u294' };
    const masked = (k.key && k.key.length > 6) ? k.key.slice(0, 5) + '••••••' + k.key.slice(-2) : '••••••••';
    const row = (label, val, mono) => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #eef2f6' }}>
        <span style={{ fontSize: 12.5, color: '#565977', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 13, color: '#080a1f', fontWeight: 700, fontFamily: mono ? 'ui-monospace, Menlo, monospace' : 'inherit' }}>{val}</span>
      </div>
    );
    return (
      <div style={{ background: 'white', border: '1px solid ' + CARD_BORDER, borderRadius: 12, padding: '16px 18px', boxShadow: CARD_SHADOW }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', background: '#dcfce7', flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </span>
          <h3 style={{ fontSize: 14.5, fontWeight: 800, color: '#080a1f' }}>Manual key active</h3>
        </div>
        {row('Provider', k.provider)}{row('Model', k.model)}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0' }}>
          <span style={{ fontSize: 12.5, color: '#565977', fontWeight: 600 }}>API Key</span>
          <span style={{ fontSize: 13, color: '#080a1f', fontWeight: 700, fontFamily: 'ui-monospace, Menlo, monospace' }}>{masked}</span>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button onClick={onEdit} style={{ flex: 1, borderRadius: 10, border: '1px solid #e2e8f0', background: 'white', padding: '10px', fontSize: 13.5, fontWeight: 700, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>Edit key</button>
          <button onClick={onRemove} style={{ flex: 1, borderRadius: 10, border: '1px solid #fecaca', background: 'white', padding: '10px', fontSize: 13.5, fontWeight: 700, color: '#dc2626', cursor: 'pointer', fontFamily: 'inherit' }}>Remove</button>
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

  // Prime MEMBER, out of credits — TOP-UP (not a re-pitch of Prime). Reuses the member screen's action.
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

  // On-send out-of-credits popup. mode: 'prime' | 'topup' | 'byok'. Banner + white card (Figma chrome).
  function OutOfCreditsModal({ mode, onClose, onUse }) {
    const body = mode === 'byok' ? <ByokFields onUse={onUse} /> : mode === 'topup' ? <TopUpCard /> : <PrimeUpsellCard />;
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

  window.Byok = { ByokFields, ByokForm, KeyAddedPanel, PrimeUpsellCard, TopUpCard, OutOfCreditsModal };
})();
