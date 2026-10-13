/* Section 69: System and program states (entry-patterns slice). Part: SystemStates (New).
   Screen: screens/system-states.jsx (V2Screens.SystemStates). Refs: guide/refs/entry-patterns.js. */
(function () {
  const G = window.V2Guide;
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
    if (!S.SystemStates) return <div className="g-missing">V2Screens.SystemStates is not loaded.</div>;
    return <S.SystemStates landmark={false} preview {...props} />;
  }

  // state, when it shows, the top bar, the one next step. Copy is proposed unless a ref is given.
  const ROWS = [
    ['Offline, nothing cached', 'BlueAI opens with no connection and has nothing saved to show.', 'Offline chip, nav', 'Try again (and the run starts by itself when the connection is back)', null],
    ['Screen failed', 'A screen’s data did not load; the worker itself is fine.', 'Today’s status, credits, nav', 'Try again; Report a problem', null],
    ['Update ready', 'A new version is downloaded.', 'Unchanged', 'Restart now, or nothing: it installs on the next start', null],
    ['Update required', 'This version can no longer run jobs.', 'Paused chip "Update needed"', 'Update now', null],
    ['Not in the program', 'Signed in, but this account is not an accepted one (the gate, after the fact).', 'No status, no credits, no nav', 'Switch account (App Player signs out too)', ['entry-patterns.signin.gate-card', 'entry-patterns.signin.player-too']],
    ['Program complete', 'Day 20 is verified; the period has not ended.', '"All 20 days done"', 'Earnings, after the period ends', ['entry-patterns.copy.day20', 'entry-patterns.copy.day20-sub']],
    ['Period ended', 'The program’s period is over (Nov 1); cash out is open only when numbers().reachedMinimum.', 'No status, no credits', 'Earnings', ['entry-patterns.copy.rule', 'entry-patterns.copy.cashout']],
    ['Period ended, under $10', 'The period is over and earnings are under the $10 minimum.', 'No status, no credits', 'Earnings as the quiet one', ['entry-patterns.copy.cashout']],
    ['Between programs', 'No program is running; the next one has a date.', 'No status, no credits', 'None needed; Earnings as the quiet one', null],
  ];

  function SystemStatesSection() {
    const S = window.V2Screens || {};
    const list = S.SYSTEM_STATES || [];
    return (
      <G.Section id="system-states">
        <G.Part name="SystemStates" status="new" role="What the app says when it cannot do its job, and around the program’s end: what it means for today, and the one next step.">
          <G.Note>
            Why the product needs it. The worker runs on a schedule on the partner’s PC; when the PC is offline, the app is out of date, or the account is the wrong one, a day is at stake and the partner is usually not watching. V2 designs none of these, and after Day 20 it has nothing to say about what happens next: the last words are “Day 20 done.” and “That’s every day for this month.”
          </G.Note>
          <G.StateGrid wide states={list.map(function (s) {
            return { label: s[1], node: <Shot><Screen state={s[0]} /></Shot> };
          }).concat([
            { label: 'Offline, trying again', note: 'the button holds while it checks', node: <Shot><Screen state="offline" busy /></Shot> },
            { label: 'Updating', note: 'Update now in progress', node: <Shot><Screen state="update-required" busy /></Shot> },
            { label: 'Offline, compact 640', note: 'bars pinned, content centred', node: <Shot h={640}><Screen state="offline" compact /></Shot> },
          ])} />
          <div className="g-table-wrap">
            <table className="g-table">
              <thead><tr><th scope="col">State</th><th scope="col">When</th><th scope="col">Top bar</th><th scope="col">Next step</th><th scope="col">V2 source</th></tr></thead>
              <tbody>
                {ROWS.map(function (r) {
                  return <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td><G.RefCell refs={r[4]} /></td></tr>;
                })}
              </tbody>
            </table>
          </div>
          <G.SpecDrawer rows={[
            { part: 'Frame', token: 'AppFrame', value: 'top bar always; nav whenever there is somewhere to go' },
            { part: 'Body', token: '--v2-gutter, --v2-space-4', value: 'one column, centred when it holds one EmptyState' },
            { part: 'Empty states', token: 'EmptyState', value: 'dashed ghost, icon 24 ink-3, title 16/600 as the page h1, body 13 ink-3, one primary' },
            { part: 'Update banner', token: 'Banner info, --v2-z-sticky', value: 'sticky under the top bar, action Restart now' },
            { part: 'Busy', token: 'Button loading', value: 'spinner in the button, label kept, aria-busy' },
            { part: 'Consequence', token: '--v2-text-13, --v2-ink-3', value: 'App Player will be signed out too.', ref: 'entry-patterns.signin.player-too' },
            { part: 'Program end', token: null, value: 'ends Nov 1; cash out after the period', ref: ['entry-patterns.copy.rule', 'entry-patterns.copy.cashout'] },
            { part: 'Earnings', token: 'EARNINGS_URL', value: 'the one Earnings URL, opens the site', ref: 'entry-patterns.copy.earnings-arrow' },
          ]} />
          <G.DoDont
            do={['Keep the top bar, so the partner knows the app is alive.', 'Say what the state means for today’s run or the 20 days.', 'Offer exactly one next step, as a button.']}
            dont={['Show a blank window or a spinner with no words.', 'Blame the partner (“your connection”) when it is the service.', 'Show money the program has not decided yet (decision D3).']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('system-states', SystemStatesSection);
})();
