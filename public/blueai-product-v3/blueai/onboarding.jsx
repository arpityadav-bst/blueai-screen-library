// BlueAI: Onboarding welcome (logged-out cold start), matched to the cloud design's content
// (BlueAI Onboarding project → blueai/relax_flow.jsx "TaskPicker"). A chrome-free, vertically
// centered picker: logo + greeting + 3 starter tasks + "Just type it".
// Picking a task hands its prompt up to prefill the onboarding chat composer; Send there
// gates on sign-in (window.LoginModal).
//
// V3, Phase 5: drawn like the phase 2 welcome (moneymaker.jsx) it sits beside: the canvas with the
// lens dot field (texture is allowed on a welcome), the spark mark, an Inter 600 title with one
// Instrument Serif phrase, and the tasks as the chat home's own rows (chat.css .v3-row: a 1px line,
// a sunken tile with the category glyph in ink, a quiet chevron). The per-task tint colours are
// gone: colour is a signal here, never decoration. "Just type it." is the site's underlined link.
// Exposes window.Onboarding = { OnboardingWelcome, SUGGESTIONS }.
(function () {
  // Glyphs match the design's TASKS (game / discover / social ChatCatIcon).
  const SUGGESTIONS = [
    {
      key: 'games', icon: 'game',
      title: 'Get paid games for free',
      desc: 'Grabs paid games that are free on Google Play.',
      prompt: 'Collect paid games that are free on the Google Play Store.'
    },
    {
      key: 'codes', icon: 'discover',
      title: 'Find redeem codes',
      desc: 'Searches the web for active redeem codes for your games.',
      prompt: 'Search the web for active redeem codes for my games.'
    },
    {
      key: 'gift', icon: 'social',
      title: 'Find the perfect gift',
      desc: 'Scans a profile and drops the perfect gift ideas.',
      prompt: "Scan my partner's Instagram profile and suggest what I can gift her."
    }
  ];

  function OnboardingWelcome({ onPick, onTypeIt }) {
    const C = window.ProductHomeScreen;
    return (
      <div className="v3-ob">
        <style>{`
          @keyframes obPickerFadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
          .ob-pk-item { animation: obPickerFadeUp var(--v2-dur-4) var(--v2-ease-out) both; }
          @media (prefers-reduced-motion: reduce) { .ob-pk-item { animation: none; } }
        `}</style>

        <window.LensDots />

        <div className="v3-ob-inner">
          <div className="ob-pk-item" style={{ display: 'flex', justifyContent: 'center', animationDelay: '0s' }}>
            <window.BlueAILogo wordmark={false} mark={48} />
          </div>

          <p className="ob-pk-item v3-ob-hi" style={{ animationDelay: '0.1s' }}>Hi, I'm BlueAI</p>
          <h1 className="ob-pk-item v3-welcome-title" style={{ animationDelay: '0.2s' }}>What can I do for you <em className="v3-serif-em">first?</em></h1>

          <div className="v3-rows">
            {SUGGESTIONS.map((t, i) => (
              <button key={t.key} type="button" onClick={() => onPick(t)} className="ob-pk-item v3-row" style={{ animationDelay: 0.3 + i * 0.1 + 's' }}>
                <span className="v3-row-tile v3-row-tile--lg">
                  <C.ChatCatIcon type={t.icon} size={22} />
                </span>
                <span className="v3-row-main">
                  <span className="v3-row-title">{t.title}</span>
                  <span className="v3-row-desc">{t.desc}</span>
                </span>
                <span className="v3-row-end">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="v3-ico" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
                </span>
              </button>
            ))}
          </div>

          <p className="ob-pk-item v3-ob-more" style={{ animationDelay: '0.65s' }}>
            Something else in mind?{' '}
            <button type="button" onClick={onTypeIt} className="v3-link v3-link--ink">Just type it.</button>
          </p>
        </div>
      </div>);
  }

  window.Onboarding = { OnboardingWelcome, SUGGESTIONS };
})();
