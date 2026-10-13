/* Section 67: Welcome, signed out (entry-patterns slice). Part: Welcome (Changed).
   Screen: screens/welcome.jsx (V2Screens.Welcome). Refs: guide/refs/entry-patterns.js. */
(function () {
  const G = window.V2Guide;
  const W = 419, H = 830;

  // A window drawn at true size and scaled down to fit a guide column.
  function Shot({ scale, h, children }) {
    const s = scale || 0.55;
    const hh = h || H;
    return (
      <div style={{ width: W * s, height: hh * s, overflow: 'hidden', flex: 'none', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-sm)', boxSizing: 'content-box', background: 'var(--v2-canvas)' }}>
        <div style={{ width: W, height: hh, transform: 'scale(' + s + ')', transformOrigin: '0 0' }}>{children}</div>
      </div>
    );
  }
  // A live V2 component that needs a sized, positioned box (it fills it or overlays it).
  function LiveBox({ get, props, h, label }) {
    let C = null;
    try { C = get(); } catch (e) { C = null; }
    if (!C) return <div className="g-missing">{label} is not loaded on this page.</div>;
    return (
      <div className="g-live" style={{ position: 'relative', width: W, height: h || H, display: 'flex', flexDirection: 'column', overflow: 'hidden', isolation: 'isolate' }}>
        <G.Boundary><C {...(props || {})} /></G.Boundary>
      </div>
    );
  }
  function Screen(props) {
    const S = window.V2Screens || {};
    if (!S.Welcome) return <div className="g-missing">V2Screens.Welcome is not loaded.</div>;
    return <S.Welcome landmark={false} preview {...props} />;
  }

  const ANATOMY = [
    ['Mark', 'BrandMark 48, logo only (the wordmark would repeat the title’s job)'],
    ['Title', '24/600 ink, balanced, one serif italic word in blue ink (the site’s title-lg em)'],
    ['Steps', 'one Card, two rows: a 28px step disc (blue tint, blue edge, ink figure) and the PM’s line'],
    ['Action', 'one primary Button, lg 44, full width: Sign in to get started'],
    ['Terms', 'a muted standalone Link at the foot, Program Terms, opens the legal page in a new tab'],
    ['Over it', 'the Program Terms sheet on first run (blocking; section 53)'],
  ];

  function WelcomeSection() {
    return (
      <G.Section id="welcome">
        <G.Part name="Welcome" status="changed" role="The signed-out start on the site’s DNA: one promise, two steps, one action, with the Program Terms sheet over it on first run.">
          <div className="g-table-wrap">
            <table className="g-table">
              <thead><tr><th scope="col">Anatomy</th><th scope="col">System</th></tr></thead>
              <tbody>{ANATOMY.map(function (r) { return <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td></tr>; })}</tbody>
            </table>
          </div>
          <G.StateGrid wide states={[
            { label: 'First run', note: 'Program Terms sheet over it (V2: bare URL)', node: <Shot><Screen terms="firstrun" /></Shot> },
            { label: 'After terms', note: 'title, steps, action rise once, 120 ms apart', node: <Shot><Screen /></Shot> },
            { label: 'Agreeing', note: 'the agreement record is being written', node: <Shot><Screen terms="firstrun" termsBusy /></Shot> },
            { label: 'Not saved', note: 'the same button tries again', node: <Shot><Screen terms="firstrun" termsError /></Shot> },
            { label: 'Signed out', note: 'after Sign out (section 64): paused, one way back', node: <Shot><Screen signedOut="alex@example.com" /></Shot> },
            { label: 'Reduced motion', note: 'everything is simply there', node: <Shot><Screen reduced /></Shot> },
            { label: 'Compact 640', note: 'the column centres in less height', node: <Shot h={640}><Screen compact /></Shot> },
            { label: 'Proposed headline', note: 'if D3 drops the income promise', node: <Shot><Screen headline="proposed" /></Shot> },
          ]} />
          <G.Warn>
            Decision D3. The headline is the PM’s and is kept word for word: “An AI that turns your social accounts into income.” The site pays $30 for 20 verified days, and the glossary bans “income”. If D3 settles on the site’s model, use the proposed line (“Put your BlueAI worker to work.”), shown above.
          </G.Warn>
          <G.CompareRow
            v2={(
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)' }}>
                <Shot><LiveBox get={function () { return window.MoneyMaker && window.MoneyMaker.MoneyMakerWelcome; }} props={{ onSignIn: function () {} }} label="V2 MoneyMakerWelcome" /></Shot>
                <G.FrameState url="index.html" label="V2 bare URL: the terms sheet over this screen" height={760} />
              </div>
            )}
            system={<Shot><Screen /></Shot>}
            changed="V2 dresses the welcome in a third visual family (creator-brand): Space Grotesk 27/700, a perspective grid, orbs, grain, a hero logo with a cursor morph, a gradient pill with a glow, and a 5.9 s intro that plays behind the terms sheet. Its Terms link is a dead button at 2.41:1. The system keeps the PM’s words and order, and draws them in the site’s language: Inter, one serif word, the site’s numbered discs, a plain card, the action-blue button. Everything has arrived by 420 ms. The link says Program Terms and opens them." />
          <G.SpecDrawer rows={[
            { part: 'Ground', token: '--v2-canvas', value: '#fafbfb; padding 40 24 16', ref: 'entry-patterns.welcome.canvas' },
            { part: 'Decoration', token: null, value: 'none (grid, orbs, grain and hero logo removed)', ref: ['entry-patterns.welcome.backdrop', 'entry-patterns.welcome.hero-logo'] },
            { part: 'Mark', token: 'BrandMark 48', value: 'logo 48, no wordmark' },
            { part: 'Title', token: '--v2-text-24, --v2-weight-semibold, --v2-tracking-title', value: '24/600 ink, leading 1.2, text-wrap balance', ref: 'entry-patterns.welcome.title-type' },
            { part: 'Title copy', token: null, value: 'PM copy, verbatim; the site pays $30 for 20 days (D3)', ref: ['entry-patterns.welcome.headline', 'entry-patterns.welcome.headline-em', 'entry-patterns.family.pay'] },
            { part: 'Serif word', token: '--v2-font-serif, --v2-blue-ink', value: 'Instrument Serif italic 400, 1.06em', ref: 'entry-patterns.family.title-em' },
            { part: 'Steps card', token: 'Card', value: 'radius 16, 1px --v2-line, padding 16, no shadow', ref: 'entry-patterns.welcome.step-card' },
            { part: 'Step disc', token: '--v2-select, --v2-select-line, --v2-control-sm', value: '28 round, figure 13/600 ink', ref: ['entry-patterns.family.step-num', 'entry-patterns.welcome.step-label'] },
            { part: 'Step text', token: '--v2-text-14, --v2-ink-2', value: '14/1.5, first line centred on the disc', ref: 'entry-patterns.welcome.step-body' },
            { part: 'Step copy', token: null, value: 'PM copy, verbatim', ref: ['entry-patterns.welcome.step1', 'entry-patterns.welcome.step2'] },
            { part: 'Action', token: '--v2-action, --v2-control-lg', value: 'Button primary lg full: 44, radius 6, 13/500 white (4.92:1)', ref: ['entry-patterns.welcome.cta-fill', 'entry-patterns.welcome.cta'] },
            { part: 'Terms link', token: '--v2-ink-3, --v2-hit-min', value: 'Program Terms, 13/500, 6.0:1, 32 target, new tab', ref: ['entry-patterns.welcome.terms-dead', 'entry-patterns.welcome.terms-ink', 'entry-patterns.welcome.terms-label'] },
            { part: 'Entrance', token: '--v2-dur-2, --v2-ease-out', value: 'v2-anim-fade-up; .v2-delay-1, .v2-delay-2 (120 ms steps)', ref: ['entry-patterns.welcome.intro', 'entry-patterns.welcome.terms-intro'] },
          ]} />
          <G.DoDont
            do={['Keep the PM’s two steps and their words; restyle, never rewrite.', 'Open the Program Terms from the foot link, in a new tab.', 'Let the terms sheet be the first thing on a first run.']}
            dont={['Add backdrop effects, a cursor morph or a gradient button.', 'Make the intro longer than the time it takes to read the title.', 'Promise income (decision D3).']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('welcome', WelcomeSection);
})();
