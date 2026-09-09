// BlueAI — Onboarding welcome (logged-out cold start), matched 1:1 to the cloud design
// (BlueAI Onboarding project → blueai/relax_flow.jsx "TaskPicker"). A chrome-free, vertically
// centered picker: gradient sparkle logo + greeting + 3 starter tasks + "Just type it".
// Picking a task hands its prompt up to prefill the onboarding chat composer; Send there
// gates on sign-in (window.LoginModal, variant="onboarding").
// Exposes window.Onboarding = { OnboardingWelcome, SUGGESTIONS }.
(function () {
  // Colors + glyphs match the design's TASKS exactly (game / discover / social ChatCatIcon).
  const SUGGESTIONS = [
    {
      key: 'games', icon: 'game', color: '#047857', bg: '#D1FAE5', border: '#A7F3D0',
      title: 'Get paid games for free',
      desc: 'Grabs paid games that are free on Google Play.',
      prompt: 'Collect paid games that are free on the Google Play Store.'
    },
    {
      key: 'codes', icon: 'discover', color: '#0369A1', bg: '#E0F2FE', border: '#BAE6FD',
      title: 'Find redeem codes',
      desc: 'Searches the web for active redeem codes for your games.',
      prompt: 'Search the web for active redeem codes for my games.'
    },
    {
      key: 'gift', icon: 'social', color: '#BE123C', bg: '#FFE4E6', border: '#FECDD3',
      title: 'Find the perfect gift',
      desc: 'Scans a profile and drops the perfect gift ideas.',
      prompt: "Scan my partner's Instagram profile and suggest what I can gift her."
    }
  ];

  function OnboardingWelcome({ onPick, onTypeIt }) {
    const C = window.ChatCompare;
    return (
      <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#f8fafc', padding: '24px 22px', overflowY: 'auto' }}>
        <style>{`
          @keyframes obPickerFadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
          .ob-pk-item { animation: obPickerFadeUp 0.42s cubic-bezier(0.22,1,0.36,1) both; }
          @media (prefers-reduced-motion: reduce) { .ob-pk-item { animation: none; } }
        `}</style>

        <div className="ob-pk-item" style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, animationDelay: '0s' }}>
          <img src="assets/BAILogo2.svg" alt="BlueAI" style={{ width: 64, height: 64 }} />
        </div>

        <p className="ob-pk-item" style={{ marginTop: 8, color: '#64748b', lineHeight: 1.5, textAlign: 'center', fontSize: 18, animationDelay: '0.1s' }}>Hi, I'm BlueAI</p>
        <h1 className="ob-pk-item" style={{ fontSize: 25, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.18, textAlign: 'center', textWrap: 'balance', marginTop: 6, animationDelay: '0.2s' }}>What can I do for you first?</h1>

        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {SUGGESTIONS.map((t, i) => (
            <button key={t.key} onClick={() => onPick(t)}
              className="ob-pk-item"
              style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', background: 'white', border: '1.5px solid #dbe3ee', borderRadius: 16, padding: '16px 15px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', boxShadow: '0 2px 10px rgba(15,23,42,0.06)', transition: 'transform 0.12s, box-shadow 0.12s, border-color 0.12s', animationDelay: 0.3 + i * 0.1 + 's' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 26px rgba(15,23,42,0.12)'; e.currentTarget.style.borderColor = t.color; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 10px rgba(15,23,42,0.06)'; e.currentTarget.style.borderColor = '#dbe3ee'; }}>
              <div style={{ flexShrink: 0, width: 50, height: 50, borderRadius: 14, background: t.bg, border: '1px solid ' + t.border, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <C.ChatCatIcon type={t.icon} size={26} color={t.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 17, fontWeight: 800, color: '#111827', lineHeight: 1.25 }}>{t.title}</p>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.4, marginTop: 3 }}>{t.desc}</p>
              </div>
              <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: '50%', background: t.bg, border: '1px solid ' + t.border, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </div>
            </button>
          ))}
        </div>

        <p className="ob-pk-item" style={{ textAlign: 'center', fontSize: 13.5, color: '#64748b', marginTop: 22, lineHeight: 1.55, maxWidth: 300, marginLeft: 'auto', marginRight: 'auto', animationDelay: '0.65s' }}>
          Something else in mind?{' '}
          <button onClick={onTypeIt} style={{ background: 'none', border: 'none', padding: 0, color: '#1990FF', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline', textUnderlineOffset: 2 }}>Just type it.</button>
        </p>
      </div>);
  }

  window.Onboarding = { OnboardingWelcome, SUGGESTIONS };
})();
