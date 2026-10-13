/* Section 56: Sign-in flow (entry-patterns slice). Part: Sign-in cases (Changed).
   The ROB-21388 handoff as a pattern; the in-app steps themselves are section 68 (V2Screens.SignIn).
   Refs: guide/refs/entry-patterns.js. */
(function () {
  const G = window.V2Guide;

  // case, setup, option A (recommended), option B, where it lands, refs
  const CASES = [
    ['1', 'App Player signed in with the accepted account', 'Silent sign-in. No screen.', 'Continue as Alex, then Home.', 'Home', ['entry-patterns.signin.case-1']],
    ['2', 'App Player signed in with another account', 'Silent sign-in, then the gate. The browser never opens.', 'Continue as Alex, then the gate.', 'Gate, Switch account', ['entry-patterns.signin.case-2', 'entry-patterns.signin.player-other']],
    ['3a', 'App Player signed out; the browser holds the accepted account', 'Browser: the continue page. Back in the app: Signing in, Signed in, Home.', 'Same, with Continue as on the continue page.', 'Home', ['entry-patterns.signin.case-3a']],
    ['3b', 'App Player signed out; the browser holds another account', 'Browser: the continue page says Not in the program, with “Not you? Continue with a different account” (V2 says “ID”). Continuing anyway lands on the gate.', 'Same.', 'Gate, or the right account', ['entry-patterns.signin.case-3b', 'entry-patterns.signin.site-pill', 'entry-patterns.signin.different-id']],
    ['3c', 'App Player signed out; the browser is signed out too', 'Browser: the site’s sign-in with Google’s chooser. Back in the app: Signing in, then Home or the gate.', 'Same.', 'Home or gate', ['entry-patterns.signin.case-3c']],
  ];
  const RULES = [
    'Whatever account BlueAI ends up with, App Player ends up on it too; say so before Switch account.',
    'Interrupt only when the account is wrong (option A). Each extra stop after the browser already said “You’re signed in” costs a click and says nothing new.',
    'The gate has one way out: Switch account. The download link only reaches accepted partners, so a wrong account is always the cause.',
    'Signing in looks the same on both sides: the site’s frosted gate veil, the same words (Sign in, not Log in), the same legal wording.',
  ];

  // A flow as a row of steps; each step is a word and an optional branch note.
  function Flow({ title, steps }) {
    const K = window.V2Kit;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-2)' }}>
        <div className="g-eyebrow">{title}</div>
        <ol style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--v2-space-2)', margin: 0, padding: 0, listStyle: 'none' }}>
          {steps.map(function (s, i) {
            return (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--v2-space-2)' }}>
                {i ? <span aria-hidden="true" style={{ color: 'var(--v2-ink-4)' }}><K.Icon name="arrow-right" size={16} /></span> : null}
                <span style={{ padding: 'var(--v2-space-1) var(--v2-space-3)', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-md)', background: s[1] ? 'var(--v2-surface-sunken)' : 'var(--v2-surface)', fontSize: 'var(--v2-text-13)', color: 'var(--v2-ink-2)' }}>
                  {s[0]}{s[1] ? <span style={{ display: 'block', fontSize: 'var(--v2-text-12)', color: 'var(--v2-ink-3)' }}>{s[1]}</span> : null}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }
  function Step({ step, from }) {
    const S = window.V2Screens || {};
    if (!S.SignIn) return <div className="g-missing">V2Screens.SignIn is not loaded.</div>;
    const s = 0.36;
    return (
      <div style={{ width: 419 * s, height: 830 * s, overflow: 'hidden', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-sm)', flex: 'none' }}>
        <div style={{ width: 419, height: 830, transform: 'scale(' + s + ')', transformOrigin: '0 0' }}><S.SignIn step={step} from={from} landmark={false} preview /></div>
      </div>
    );
  }
  function Strip() {
    return (
      <div style={{ display: 'flex', gap: 'var(--v2-space-2)', flexWrap: 'wrap' }}>
        <Step step="browser" /><Step step="signing" /><Step step="success" />
      </div>
    );
  }

  function SignInFlowSection() {
    return (
      <G.Section id="sign-in-flow">
        <G.Part name="Sign-in cases" status="changed" role="The PM’s five sign-in cases and two options, with the in-app stops cut to the ones that carry information.">
          <Flow title="App Player signed in (cases 1, 2)" steps={[['BlueAI opens'], ['Silent sign-in'], ['Home', 'accepted account'], ['Gate', 'another account'], ['Switch account'], ['Browser']]} />
          <Flow title="App Player signed out (cases 3a, 3b, 3c)" steps={[['Welcome'], ['Sign in to get started'], ['Browser', 'continue page or site sign-in'], ['Signing in…'], ['You’re signed in', '900 ms, no click'], ['Home']]} />
          <div className="g-table-wrap">
            <table className="g-table">
              <thead><tr><th scope="col">Case</th><th scope="col">Setup</th><th scope="col">Option A (recommended)</th><th scope="col">Option B</th><th scope="col">Lands on</th><th scope="col">V2 source</th></tr></thead>
              <tbody>{CASES.map(function (r) { return <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td>{r[4]}</td><td><G.RefCell refs={r[5]} /></td></tr>; })}</tbody>
            </table>
          </div>
          <ul className="g-list">{RULES.map(function (t) { return <li key={t}>{t}</li>; })}</ul>
          <G.Warn>
            Decision D5. Option A (Check account) interrupts only on the wrong account; option B (Continue as) always asks when an account is already signed in. The system recommends A for fewer stops; whichever the PM picks, drop the other code path.
          </G.Warn>
          <G.StateGrid wide states={[
            { label: 'Gate, from App Player', note: 'case 2', node: <Step step="gate" from="player" /> },
            { label: 'Confirm', note: 'option B, cases 1 and 2', node: <Step step="confirm" /> },
          ]} />
          <G.CompareRow
            v2={<G.FrameState url="index.html?cases=signin&case=3c" label="V2: the five cases bar, case 3c" height={760} />}
            system={<Strip />}
            changed="The logic is sound and the PM’s, and it stays. Two stops change: success no longer asks for a Continue click (or says 'Welcome back!' to a partner signing in for the first time), and the browser step has one retry instead of two. Two site lines need the PM and legal: the site’s gate tells accepted partners 'Sign in to start your application.' (the app variant should read 'Sign in to continue to BlueAI.'), and its legal line agrees to the Privacy Policy, which legal rejected for the app’s terms sheet." />
          <G.SpecDrawer rows={[
            { part: 'Cases', token: null, value: '1, 2, 3a, 3b, 3c (PM-specified)', ref: ['entry-patterns.signin.cases', 'entry-patterns.signin.page-cases'] },
            { part: 'Options', token: null, value: 'A: Check account; B: Continue as (D5)', ref: ['entry-patterns.signin.opts', 'entry-patterns.signin.opt-a', 'entry-patterns.signin.opt-b'] },
            { part: 'Signing to result, V2', token: null, value: '1500 ms, then success or gate', ref: 'entry-patterns.signin.result' },
            { part: 'Success', token: null, value: 'moves on after 900 ms; no Continue', ref: ['entry-patterns.signin.continue', 'entry-patterns.signin.welcome-back'] },
            { part: 'Gate veil', token: '--v2-scrim-frost, --v2-scrim-blur', value: 'the site’s gate veil, sign-in only', ref: ['entry-patterns.family.gate-scrim', 'entry-patterns.family.gate-blur'] },
            { part: 'Site lede', token: null, value: 'app variant: Sign in to continue to BlueAI. (PM)', ref: ['entry-patterns.signin.site-lede', 'entry-patterns.family.signin'] },
            { part: 'Site legal line', token: null, value: 'align with the terms sheet: agree to Program Terms, acknowledge the notices (PM, legal)', ref: ['entry-patterns.signin.site-legal', 'entry-patterns.terms.split'] },
            { part: 'Review link', token: null, value: '?signin=browser opens the handoff; ?cases=signin the cases bar', ref: ['entry-patterns.signin.link', 'entry-patterns.signin.cases'] },
          ]} />
          <G.DoDont
            do={['Stop the partner only when the account is wrong.', 'Say that App Player follows the account, before Switch account.', 'Use Sign in and Sign out on both sides.']}
            dont={['Confirm a sign-in the browser already confirmed.', 'Offer Apply or other exits on the gate.', 'Use a different veil for signing in on the site and in the app.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('sign-in-flow', SignInFlowSection);
})();
