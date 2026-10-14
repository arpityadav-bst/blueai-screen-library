/* Section 68: Sign-in steps (entry-patterns slice). Part: SignIn (Changed).
   Screen: screens/sign-in.jsx (V2Screens.SignIn). Refs: guide/refs/entry-patterns.js. */
(function () {
  const G = window.V2Guide;
  const { useState } = React;
  const W = 419, H = 830;

  function Shot({ scale, h, children }) {
    const s = scale || 0.55;
    const hh = h || H;
    return (
      <div style={{ width: W * s, height: hh * s, overflow: 'hidden', flex: 'none', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-sm)', boxSizing: 'content-box', background: 'var(--v2-canvas)' }}>
        <div style={{ width: W, height: hh, transform: 'scale(' + s + ')', transformOrigin: '0 0' }}>{children}</div>
      </div>
    );
  }
  function Screen(props) {
    const S = window.V2Screens || {};
    if (!S.SignIn) return <div className="g-missing">V2Screens.SignIn is not loaded.</div>;
    return <S.SignIn landmark={false} preview {...props} />;
  }
  // V2's LoginModal is absolutely positioned and walks browser > signing > success on timers.
  function V2Modal() {
    const [k, setK] = useState(0);
    const C = window.LoginModal;
    if (!C) return <div className="g-missing">V2 LoginModal is not loaded on this page.</div>;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-2)', alignItems: 'flex-start' }}>
        <Shot>
          <div key={k} className="g-live" style={{ position: 'relative', width: W, height: H, overflow: 'hidden', isolation: 'isolate', background: 'var(--v2-canvas)' }}>
            <G.Boundary><C isOpen initialStep="browser" variant="onboarding" onClose={function () {}} onSuccess={function () {}} /></G.Boundary>
          </div>
        </Shot>
        <button type="button" className="g-btn" onClick={function () { setK(k + 1); }}>Replay: browser, signing (2.2 s), success (4 s)</button>
      </div>
    );
  }
  function V2Card({ which }) {
    const A = window.AccountGate;
    const P = window.SignInPage;
    if (!A || !P) return <div className="g-missing">V2 AccountGate is not loaded on this page.</div>;
    const C = which === 'confirm' ? A.ConfirmCard : A.GateCard;
    const acct = which === 'confirm' ? P.ACCOUNTS.primary : P.ACCOUNTS.other;
    return (
      <div className="g-live" style={{ width: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--v2-space-4)', textAlign: 'center', padding: 'var(--v2-space-6)', background: 'var(--v2-surface)', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-lg)' }}>
        <G.Boundary><C account={acct} fromPlayer onSwitch={function () {}} onContinue={function () {}} /></G.Boundary>
      </div>
    );
  }

  const STEPS = [
    ['Browser', ['entry-patterns.signin.browser-title', 'entry-patterns.signin.browser-body', 'entry-patterns.signin.notice', 'entry-patterns.signin.not-seeing', 'entry-patterns.signin.amber-link', 'entry-patterns.signin.same-handler', 'entry-patterns.signin.try-again'],
      '"Check your browser", "Finish logging in from your web browser", the notice, then "Not seeing the browser tab?" in amber (2.15:1) and "Try again": two controls, one handler.',
      'Same title and notice; "Finish signing in from your web browser." (glossary); one action, Open the browser again. Close cancels.'],
    ['Signing', ['entry-patterns.signin.spinner', 'entry-patterns.signin.signing-title', 'entry-patterns.signin.signing-body', 'entry-patterns.signin.result', 'entry-patterns.signin.timer-signing', 'entry-patterns.signin.timer-success'],
      'Indigo #4f46e5 ring (a second accent), "Signing in…", "Please wait while we complete your sign-in", 1500 ms.',
      'Blue Spinner 32, "Signing in…", and what is happening: "Checking that this account is in the program." (proposed).'],
    ['Couldn’t finish', ['entry-patterns.signin.result'],
      'None: after 1500 ms signing always moves to success or the gate, so a timeout or a dropped connection has nowhere to go.',
      '"Couldn’t finish signing in" / "Check your connection and try again." with a danger mark; Try again (primary) and Open the browser again. Close cancels.'],
    ['Success', ['entry-patterns.signin.success-title', 'entry-patterns.signin.welcome-back', 'entry-patterns.signin.continue'],
      '"Logged in", "Welcome back!" to a first-time partner, and a Continue click.',
      '"You’re signed in" and the email, then Home after 900 ms by itself (the browser already said so). No button.'],
    ['Gate', ['entry-patterns.signin.gate-title', 'entry-patterns.signin.gate-body', 'entry-patterns.signin.gate-card', 'entry-patterns.signin.switch'],
      'Since 2026-10-13: a switch-account icon, "Let’s switch accounts", "We couldn’t find your application on this account. Sign in with the account you applied with.", the account as a row (avatar, name, email), then "Switch account". No pill, no App Player line.',
      'The account; Badge "Not in the program" (glossary); one line on why; that App Player follows the account, at 6.0:1, right above the button; a quiet "Get help" (SITE_FAQ_URL) under Switch account. Blocking, no close.'],
    ['Confirm (option B)', ['entry-patterns.signin.confirm-title', 'entry-patterns.signin.confirm-sub', 'entry-patterns.signin.continue-as', 'entry-patterns.signin.not-you'],
      'No longer reached: the PM dropped option B on 2026-10-13 (its card is still in account_gate.jsx). It read "Continue to BlueAI", "Signed in on App Player on this PC", "Continue as Alex", "Not you? Switch account".',
      'Same words; the account is one pressable Card with hover and focus; Switch account is an underlined ink link.'],
    ['Chrome', ['entry-patterns.signin.scrim', 'entry-patterns.signin.card', 'entry-patterns.signin.card-shadow', 'entry-patterns.signin.close', 'entry-patterns.signin.close-size'],
      'White 55% veil with a 10px blur (the gate step: solid #f4f6fa), card radius 20 with a 14% shadow, a 34px close with no name.',
      'The site’s gate veil (88%, blur 14), the kit Dialog md (radius 16, shadow-2), a labelled 32px Close, focus kept inside.'],
  ];

  function SignInSection() {
    return (
      <G.Section id="sign-in-screens">
        <G.Part name="SignIn" status="changed" role="The app’s side of the sign-in handoff, on the frost gate the site uses: one step at a time, one way forward each.">
          <G.StateGrid wide states={[
            { label: 'Browser', note: 'the browser is open', node: <Shot><Screen step="browser" /></Shot> },
            { label: 'Signing', note: 'about 1.5 s', node: <Shot><Screen step="signing" /></Shot> },
            { label: 'Couldn’t finish', note: 'timeout or dropped connection: Try again or the browser', node: <Shot><Screen step="error" /></Shot> },
            { label: 'Success', note: 'moves on after 900 ms', node: <Shot><Screen step="success" /></Shot> },
            { label: 'Gate, from App Player', note: 'case 2 (option A)', node: <Shot><Screen step="gate" from="player" /></Shot> },
            { label: 'Gate, from the browser', note: 'case 3b, a wrong pick', node: <Shot><Screen step="gate" /></Shot> },
            { label: 'Confirm', note: 'option B only (decision D5)', node: <Shot><Screen step="confirm" /></Shot> },
            { label: 'Compact 640', note: 'the dialog centres in the window', node: <Shot h={640}><Screen step="browser" compact /></Shot> },
          ]} />
          <G.CompareRow
            v2={(
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)' }}>
                <V2Modal />
                <V2Card which="gate" />
              </div>
            )}
            system={<Shot><Screen step="browser" /></Shot>}
            changed="The handoff logic is the PM’s and stays. What changes is in the steps: the indigo spinner becomes the one blue, the amber link (2.15:1) and the duplicate Try again become one action, success stops asking for a click and stops saying 'Welcome back!' to someone signing in for the first time, the gate (V2: 'Let’s switch accounts', no pill since 2026-10-13) keeps a 'Not in the program' badge and says App Player follows the account, and the veil becomes the site’s frost gate, so signing in looks the same on both sides." />
          <div className="g-table-wrap">
            <table className="g-table">
              <thead><tr><th scope="col">Step</th><th scope="col">V2 today</th><th scope="col">System</th></tr></thead>
              <tbody>
                {STEPS.map(function (r) {
                  return <tr key={r[0]}><td>{r[0]}</td><td>{r[2]}<div style={{ marginTop: 'var(--v2-space-1)' }}><G.RefCell refs={r[1]} /></div></td><td>{r[3]}</td></tr>;
                })}
              </tbody>
            </table>
          </div>
          <G.SpecDrawer rows={[
            { part: 'Veil', token: '--v2-scrim-frost, --v2-scrim-blur', value: 'rgba(248,249,251,0.88), blur 14px', ref: ['entry-patterns.signin.scrim', 'entry-patterns.family.gate-scrim', 'entry-patterns.family.gate-blur'] },
            { part: 'Layer', token: '--v2-z-gate', value: '110, above dialogs, below the splash' },
            { part: 'Card', token: 'Dialog md, --v2-radius-lg, --v2-shadow-2', value: '382 wide, radius 16, 1px line', ref: ['entry-patterns.signin.card', 'entry-patterns.signin.card-shadow'] },
            { part: 'Close', token: 'IconButton 32', value: 'labelled Close; browser and signing only', ref: ['entry-patterns.signin.close', 'entry-patterns.signin.close-size'] },
            { part: 'Mark', token: '--v2-blue-tint, --v2-blue-ink', value: '48 disc, icon 24; success uses --v2-success-tint' },
            { part: 'Spinner', token: '--v2-blue, --v2-dur-spin', value: 'Spinner 32, no delay', ref: 'entry-patterns.signin.spinner' },
            { part: 'Title', token: '--v2-text-20, --v2-weight-semibold', value: '20/600 ink, centred', ref: 'entry-patterns.signin.browser-title' },
            { part: 'Body', token: '--v2-text-13, --v2-ink-3', value: '13/1.5, 6.0:1', ref: 'entry-patterns.signin.browser-body' },
            { part: 'Notice', token: 'Banner info', value: 'blue tint, ink text: Use the account you applied with', ref: ['entry-patterns.signin.notice-fill', 'entry-patterns.signin.notice'] },
            { part: 'Retry', token: 'Button secondary lg', value: 'one action: Open the browser again', ref: ['entry-patterns.signin.not-seeing', 'entry-patterns.signin.try-again'] },
            { part: 'Success', token: null, value: 'auto-advance 900 ms (a timer, kept under reduced motion)', ref: ['entry-patterns.signin.success-title', 'entry-patterns.signin.welcome-back'] },
            { part: 'Gate account', token: 'Avatar 56, --v2-text-16', value: 'email 16/600 ink (V2: a row, avatar 34, name 14/700, email 12.5)', ref: ['entry-patterns.signin.gate-card', 'display-feedback.avatar.gate-34'] },
            { part: 'Gate badge', token: 'Badge neutral', value: 'Not in the program (V2: no pill since 2026-10-13)' },
            { part: 'Consequence', token: '--v2-text-13, --v2-ink-3', value: '6.0:1, above the button (system only: V2 dropped the line on 2026-10-13)' },
            { part: 'Continue as', token: 'Card pressable, Avatar 32', value: 'line firms on hover, focus ring (option B, dropped by the PM)', ref: 'entry-patterns.signin.continue-as' },
          ]} />
          <G.DoDont
            do={['Keep one action per step.', 'Say the side effect (App Player signs out too) before the button.', 'Move on by itself once the account checks out.']}
            dont={['Give two controls the same job.', 'Greet a first sign-in with "Welcome back!".', 'Use warm colours for links or a second accent for spinners.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('sign-in-screens', SignInSection);
})();
