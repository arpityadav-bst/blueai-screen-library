/* Section 51: Errors and offline (entry-patterns slice). Parts: Error scopes (Changed), Offline (New).
   Composed from kit parts (TextField, Toast, Banner, RunCard, WorkerCard, Composer, TopBar) and
   V2Screens.SystemStates. Refs: guide/refs/entry-patterns.js. */
(function () {
  const G = window.V2Guide;

  // scope, where it goes, the system's example copy, the V2 source for that scope (null: undesigned)
  const SCOPES = [
    ['Field', 'A message under the field; the border turns red. Never a toast.', 'That key didn’t work. Check it and try again.', null],
    ['Action', 'A toast with Try again, where the partner is looking.', 'Couldn’t save. Check your connection and try again.', null],
    ['Section', 'A danger banner at the top of the section it is about (kept from V2).', "The download didn't finish. Cloud mode is being used.", ['entry-patterns.errors.hybrid', 'entry-patterns.errors.endpoint']],
    ['Run', 'The run card and the worker card, with the deadline and Try again.', 'Today’s job didn’t finish. Try again by 9 pm to count the day.', ['entry-patterns.errors.run-fail', 'entry-patterns.errors.retry-sub', 'entry-patterns.errors.fail-bubble']],
    ['Screen', 'An EmptyState in the content band; top bar and nav stay.', 'Couldn’t load Home. Nothing is lost: today’s run and your days are not affected.', null],
    ['App', 'A banner under the top bar while it lasts; a full state only when nothing is cached.', 'You’re offline. Today’s run starts when you’re back online.', null],
  ];

  function Box({ w, children }) {
    return <div style={{ width: w || 320, display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)' }}>{children}</div>;
  }
  function Mini({ banner, card, composer }) {
    const K = window.V2Kit;
    const fx = K.workerFixtures || {};
    return (
      <div style={{ width: 'var(--v2-shell-w)', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-sm)', overflow: 'hidden', background: 'var(--v2-canvas)' }}>
        <K.TopBar signedIn status="offline" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)', padding: 'var(--v2-space-4) var(--v2-gutter)' }}>
          {banner}
          {card === false ? null : <K.WorkerCard worker={fx.offline} state="offline" />}
          {composer ? <K.Composer disabledReason="You’re offline" /> : null}
        </div>
      </div>
    );
  }
  function V2Fail() {
    const C = window.ChatBubbles && window.ChatBubbles.FinalBubble;
    if (!C) return <div className="g-missing">V2 FinalBubble is not loaded on this page.</div>;
    return (
      <div className="g-live" style={{ width: 320 }}>
        <G.Boundary><C msg={{ tone: 'fail', content: 'I couldn’t finish “Watch the video and provide feedback”. App Player closed during the job.' }} /></G.Boundary>
      </div>
    );
  }
  function ScreenError() {
    const S = window.V2Screens || {};
    if (!S.SystemStates) return <div className="g-missing">V2Screens.SystemStates is not loaded.</div>;
    return (
      <div style={{ width: 419 * 0.55, height: 830 * 0.55, overflow: 'hidden', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-sm)' }}>
        <div style={{ width: 419, height: 830, transform: 'scale(0.55)', transformOrigin: '0 0' }}><S.SystemStates state="error" landmark={false} /></div>
      </div>
    );
  }

  function ErrorsSection() {
    const K = window.V2Kit;
    const noop = function () {};
    return (
      <G.Section id="errors-offline">
        <G.Part name="Error scopes" status="changed" role="An error goes where its scope is, and every message says what happened, what it means for today, and the one next step.">
          <div className="g-table-wrap">
            <table className="g-table">
              <thead><tr><th scope="col">Scope</th><th scope="col">Where it goes</th><th scope="col">System copy (proposed unless sourced)</th><th scope="col">V2 source</th></tr></thead>
              <tbody>{SCOPES.map(function (r) { return <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td><G.RefCell refs={r[3]} /></td></tr>; })}</tbody>
            </table>
          </div>
          <G.StateGrid wide states={[
            { label: 'Field', node: <Box w={300}><K.TextField label="API key" secret defaultValue="sk-test-1234" error="That key didn’t work. Check it and try again." /></Box> },
            { label: 'Action', node: <K.Toast tone="error" title="Couldn’t save. Check your connection and try again." action={{ label: 'Try again', onClick: noop }} duration={0} onClose={noop} /> },
            { label: 'Section', note: 'V2 copy, kept', node: <Box><K.Banner tone="danger">The download didn't finish. Cloud mode is being used.</K.Banner></Box> },
            { label: 'Run', node: <K.RunCard state="failed" /> },
            { label: 'Screen', note: 'V2Screens.SystemStates error', node: <ScreenError /> },
          ]} />
          <G.CompareRow
            v2={<V2Fail />}
            system={<K.RunCard state="failed" />}
            changed="V2 designed only its scripted failures: a run that fails (a red bubble, then Retry and Not now) and three AI-mode banners. A failed save, a field that rejects input, a screen that cannot load, a lost connection, a service outage: none has a place or words. The system gives each scope one home and one sentence shape, and keeps V2's good banners as the section scope." />
          <G.SpecDrawer rows={[
            { part: 'Field', token: '--v2-danger-line, --v2-danger-ring, --v2-danger-ink', value: 'red border + 3px ring; message 12 in danger ink, role alert' },
            { part: 'Action', token: 'Toast error', value: '8 s, assertive, Try again' },
            { part: 'Section', token: 'Banner danger', value: 'danger tint, ink words, role alert', ref: ['entry-patterns.errors.hybrid', 'entry-patterns.errors.endpoint'] },
            { part: 'Run', token: 'RunCard failed', value: 'deadline + Try again; V2 bubble #fdecec, #991b1b', ref: ['entry-patterns.errors.fail-bubble', 'entry-patterns.errors.run-fail'] },
            { part: 'Retry label', token: null, value: 'Try again everywhere (V2 also says Retry)', ref: ['entry-patterns.copy.retry', 'entry-patterns.copy.try-again'] },
            { part: 'Run end, no credits', token: null, value: 'says the refill time and the day’s status', ref: 'entry-patterns.errors.credits' },
          ]} />
          <G.DoDont
            do={['Say what it means for today’s run or the 20 days.', 'Offer one next step, named for what it does (Try again, Switch account).', 'Keep the partner’s input when an action fails.']}
            dont={['Show an error code or a stack of reasons.', 'Use a toast for a field problem, or a full screen for a section.', 'Say “Something went wrong” and stop.']} />
        </G.Part>

        <G.Part name="Offline" status="new" role="Losing the connection is shown at once, says what will not happen today, and recovers by itself.">
          <G.Note>Why the product needs it. Nothing in V2 checks or shows connectivity, and a scheduled run that silently fails to start costs a counted day.</G.Note>
          <G.StateGrid wide states={[
            { label: 'Offline', note: 'banner on a screen without the worker card (Chat); on Home the card says it, and Try again reconnects in place', node: <Mini composer card={false} banner={<K.Banner tone="offline" title="You’re offline" action={{ label: 'Try again', onClick: noop }}>Today’s run starts when you’re back online.</K.Banner>} /> },
            { label: 'Offline on Home', note: 'no banner: the worker card says it, and its Try again reconnects in place', node: <Mini /> },
            { label: 'Reconnecting', note: 'checks again by itself every 30 s', node: <Mini card={false} banner={<K.Banner tone="offline" icon="refresh" title="Reconnecting…">Today’s run starts when you’re back online.</K.Banner>} /> },
            { label: 'Back online', note: 'the banner goes; one quiet toast', node: <K.Toast tone="success" title="You’re back online." duration={0} /> },
            { label: 'Service down', note: 'our side, not the partner’s PC', node: <Mini card={false} banner={<K.Banner tone="offline" icon="alert" title="BlueAI can’t reach its service">This is on our side, not your PC. Today’s run starts as soon as it’s back.</K.Banner>} /> },
          ]} />
          <G.SpecDrawer rows={[
            { part: 'Banner', token: 'Banner tone offline', value: 'neutral sunken fill, wifi-off icon, ink words; sticky under the top bar, role status' },
            { part: 'Top bar', token: 'WorkerStatusChip offline', value: 'hollow dot, Offline' },
            { part: 'Composer', token: 'Composer disabledReason', value: 'locked, the reason as placeholder' },
            { part: 'Recovery', token: 'Toast success', value: '4 s, polite: You’re back online.' },
            { part: 'Retry cadence', token: null, value: 'every 30 s, and at once on Try again' },
          ]} />
          <G.DoDont
            do={['Show offline the moment it is known, and keep showing it until it ends.', 'Start the missed run as soon as the connection is back.']}
            dont={['Blank the window or replace Home with an error.', 'Ask the partner to restart BlueAI.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('errors-offline', ErrorsSection);
})();
