/* Section 53: Consent (entry-patterns slice). Part: Consent rules (Changed).
   Composed from V2Screens.TermsSheet (screens/welcome.jsx) and kit parts (ConsentDialog,
   PermissionRequest, ListRow, Badge). Refs: guide/refs/entry-patterns.js. */
(function () {
  const G = window.V2Guide;

  // moment, how it is agreed, what is recorded, where it is seen and withdrawn later
  const MOMENTS = [
    ['Program Terms', 'Blocking sheet on first run; the button is the agreement (Agree and continue). Re-asked in full on every terms change.', 'Account ID, time, terms version, IP address, the exact copy shown; server-side.', 'Account and privacy > Agreements: each version and when it was agreed. Withdrawing means leaving the program, from the same place.', ['entry-patterns.terms.blocking', 'entry-patterns.terms.record', 'entry-patterns.terms.record-fields']],
    ['Automatic, per app', 'Consent dialog; the button is the agreement (I agree, turn on). Asked every time it is turned on, per app. Body proposed, PM and legal (R51); the record keeps the version shown.', 'App, time, the copy version; server-side (V2 keeps the time in localStorage).', 'Settings > Worker and Connected apps: back to Always ask at once, no question.', ['entry-patterns.consent.button', 'entry-patterns.consent.every-time', 'entry-patterns.consent.local', 'entry-patterns.consent.dropped']],
    ['Access to watch history', 'A permission request in setup: Allow or Not now. Not now still lets the worker run.', 'App, scope, time.', 'Connected apps > YouTube > Watch history: Turn off. The interest profile is listed under Account and privacy.', ['entry-patterns.consent.history']],
    ['Windows notifications', 'Windows asks, the first time BlueAI sends one.', 'Kept by Windows.', 'Settings > Notifications: two switches (section 61); section 54 maps the events to them.', null],
  ];
  const WORDING = [
    'Agree to contracts; acknowledge notices. The Privacy Policy and Cookie Policy are acknowledged, never agreed to (legal).',
    'The agreement is the button. No box to tick first.',
    'Say what changes before the button, and say where to turn it off.',
    'Cookie consent is the site banner’s job, never part of the terms.',
  ];

  // A stand-in for the product window: sheets and dialogs are scoped to it, as they are to AppFrame.
  function Win({ h, children }) {
    return <div style={{ position: 'relative', isolation: 'isolate', width: 'var(--v2-shell-w)', height: h || 340, overflow: 'hidden', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-sm)', background: 'var(--v2-canvas)' }}>{children}</div>;
  }
  function Terms(props) {
    const S = window.V2Screens || {};
    if (!S.TermsSheet) return <div className="g-missing">V2Screens.TermsSheet is not loaded.</div>;
    return <Win><S.TermsSheet preview {...props} /></Win>;
  }
  function V2Terms() {
    const C = window.TermsSheet && window.TermsSheet.TermsSheet;
    if (!C) return <div className="g-missing">V2 TermsSheet is not loaded on this page.</div>;
    return <Win><div className="g-live" style={{ position: 'absolute', inset: 0 }}><G.Boundary><C mode="firstrun" onDone={function () {}} /></G.Boundary></div></Win>;
  }
  function Record() {
    const K = window.V2Kit;
    return (
      <div style={{ width: 340 }}>
        <K.Card padding="none">
          <K.ListRow label="Program Terms" description="Agreed Oct 6, version Sep 14" onClick={function () {}} />
          <K.ListRow label="Automatic on YouTube" description="Agreed Oct 8" trailing={<K.Badge tone="info">On</K.Badge>} />
          <K.ListRow label="Watch history" description="Allowed Oct 6" divider={false} trailing={<K.Badge tone="neutral">Allowed</K.Badge>} />
        </K.Card>
      </div>
    );
  }

  function ConsentSection() {
    const K = window.V2Kit;
    const noop = function () {};
    return (
      <G.Section id="consent">
        <G.Part name="Consent rules" status="changed" role="Every agreement is asked at the moment it matters, recorded with what was shown, and can be seen and withdrawn later.">
          <div className="g-table-wrap">
            <table className="g-table">
              <thead><tr><th scope="col">Moment</th><th scope="col">How it is agreed</th><th scope="col">Recorded</th><th scope="col">Seen and withdrawn</th><th scope="col">V2 source</th></tr></thead>
              <tbody>{MOMENTS.map(function (r) { return <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td><G.RefCell refs={r[4]} /></td></tr>; })}</tbody>
            </table>
          </div>
          <ul className="g-list">{WORDING.map(function (t) { return <li key={t}>{t}</li>; })}</ul>
          <G.Note>A Telegram command never gives or takes back consent: turning on Automatic, disconnecting an account and leaving the program happen only in the app, where the exact copy is shown and recorded.</G.Note>
          <G.StateGrid wide states={[
            { label: 'Not asked yet', note: 'first run: the Program Terms sheet', node: <Terms mode="firstrun" /> },
            { label: 'Agreeing', note: 'the record is being written', node: <Terms mode="firstrun" busy /> },
            { label: 'Not saved', note: 'nothing agreed; the same button tries again', node: <Terms mode="firstrun" error /> },
            { label: 'Re-asked after a terms change', node: <Terms mode="update" /> },
            { label: 'Automatic: asked', note: 'the kit ConsentDialog (section 46)', node: <Win h={460}><K.ConsentDialog app="youtube" preview onAgree={noop} onCancel={noop} /></Win> },
            { label: 'Agreed: where it is seen', note: 'Account and privacy > Agreements', node: <Record /> },
            { label: 'Declined', node: <div style={{ width: 340 }}><K.PermissionRequest app="youtube" state="notnow" onAllow={noop} /></div> },
            { label: 'Withdrawn', node: <div style={{ width: 340 }}><K.PermissionRequest app="youtube" state="revoked" decidedOn="Oct 9" onAllow={noop} /></div> },
          ]} />
          <G.CompareRow
            v2={<V2Terms />}
            system={<Terms mode="firstrun" />}
            changed="V2’s consent moments are right and stay as they are: the agreement is the button, Automatic is asked every time it is turned on, contracts are agreed and notices acknowledged, and the copy is legal’s, word for word. What changes is the frame and what comes after. The sheet takes the one dim veil, radius 16, an action-blue button at 4.92:1 and underlined ink links; the button gets a loading state and an error, because the agreement is a server write; and every agreement gets a place to be seen and withdrawn, which V2 does not have." />
          <G.SpecDrawer rows={[
            { part: 'Sheet', token: 'Sheet blocking, --v2-shadow-2', value: 'radius 16 top, no close, no Esc, no scrim dismiss', ref: ['entry-patterns.terms.sheet', 'entry-patterns.terms.blocking'] },
            { part: 'Veil', token: '--v2-scrim', value: 'rgba(11,18,32,0.48)', ref: 'entry-patterns.terms.scrim' },
            { part: 'Title', token: '--v2-text-20, --v2-weight-semibold', value: '20/600 ink: Before you start', ref: ['entry-patterns.terms.title-type', 'entry-patterns.terms.title'] },
            { part: 'Consent line', token: '--v2-text-14, --v2-ink-2', value: 'legal copy, verbatim', ref: ['entry-patterns.terms.body', 'entry-patterns.terms.body-2', 'entry-patterns.terms.body-3', 'entry-patterns.terms.split', 'entry-patterns.terms.agree-ack'] },
            { part: 'Links', token: 'Link (ink)', value: 'underlined ink, blue on hover, new tab, said to screen readers', ref: ['entry-patterns.terms.link', 'entry-patterns.terms.url'] },
            { part: 'Button', token: 'Button primary lg full', value: 'Agree and continue; 44, --v2-action; loading while it records', ref: ['entry-patterns.terms.button', 'entry-patterns.terms.cta', 'entry-patterns.terms.cta-owner'] },
            { part: 'Not saved', token: 'Banner danger', value: 'Your agreement wasn’t saved. Check your connection, then press Agree and continue again.' },
            { part: 'Update mode', token: null, value: 'same sheet, update wording (names the changed documents)', ref: ['entry-patterns.terms.update-title', 'entry-patterns.terms.update-body', 'entry-patterns.terms.update-body-2', 'entry-patterns.terms.update-body-3'] },
            { part: 'Motion', token: '--v2-dur-4, --v2-ease-out', value: 'rises 320 ms; leaves 240 ms ease-in', ref: 'entry-patterns.terms.motion' },
            { part: 'Automatic consent', token: 'ConsentDialog', value: 'Run YouTube jobs automatically? / I agree, turn on', ref: ['entry-patterns.consent.title', 'entry-patterns.consent.line', 'entry-patterns.consent.agree'] },
          ]} />
          <G.DoDont
            do={['Keep legal’s and the PM’s consent copy word for word once they approve it; send a proposed change to them first.', 'Record what was shown, server-side, at the click.', 'Give every agreement a place to be seen and turned off.']}
            dont={['Add a checkbox before the button.', 'Ask once per lifetime for Automatic.', 'Bundle cookie consent into the terms.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('consent', ConsentSection);
})();
