/* Section 41: the Worker record (New). Owner: worker slice. */
(function () {
  const G = window.V2Guide;
  const { useState } = React;

  const SHAPE = [
    '{',
    '  account:   { name, first, email }            one neutral identity everywhere',
    '  setUp:     true | false                       onboarding finished',
    '  coachSeen: true | false                       the first-run coach mark was dismissed',
    "  apps:      { youtube: { status, handle, mode, history, historyOn }, instagram: { status: 'coming-soon' } }",
    "  runWindow: { kind: 'time' | 'window' | 'any', label: '11 am' }",
    "  paused:    null | { until: 'Oct 16' }",
    "  blocked:   null | { reason: 'no-app' | 'signed-out' | 'no-bluestacks', app }",
    '  online:    true | false',
    "  credits:   { left, grant: 2000, refillAt: '5:30 am', runCost }",
    "  cashOutOpen: true | false | null            the site’s answer; null until it sends one",
    "  today:     { date, status: scheduled | running | waiting | done | stopped | failed | missed | none,",
    "               nextRunAt, startedAt, step, stepsDone, ask: { job, since, expires },",
    "               outcome, error, retryBy, missedAt, checkedAt, ranOn }",
    "  ledger:    [ { date, outcome: job | nojob | skipped | expired | stopped | failed | nocredits | norun,",
    "                 status: verified | pending | late | rejected | notcounted, reason, checkedAt, ranOn } ]",
    "  program:   { target: 20, endsOn: 'Nov 1', daysLeft }",
    '}',
  ].join('\n');

  function FixtureTable() {
    const K = window.V2Kit || {};
    if (!K.workerFixtures) return <div className="g-missing">kit/worker-data.jsx is not loaded.</div>;
    return (
      <div className="g-table-wrap">
        <table className="g-table">
          <thead>
            <tr>
              <th scope="col">Fixture</th><th scope="col">Card state</th><th scope="col">today.status</th>
              <th scope="col">Count</th><th scope="col">Verified</th><th scope="col">Pending</th>
              <th scope="col">Not counted</th><th scope="col">Days left</th><th scope="col">Mode</th>
            </tr>
          </thead>
          <tbody>
            {K.FIXTURE_ORDER.map(function (f) {
              const w = K.workerFixtures[f[0]];
              const n = K.numbers(w);
              return (
                <tr key={f[0]}>
                  <td><code className="g-code">{f[0]}</code> <span className="g-muted">{f[1]}</span></td>
                  <td>{K.workerState(w)}</td>
                  <td>{w.today.status}{w.today.end ? ', ' + w.today.end : ''}</td>
                  <td>{n.done} of {n.target}</td>
                  <td>{n.verified}</td>
                  <td>{n.pending}</td>
                  <td>{n.notCounted}{n.outOfReach ? ' (' + n.outOfReach + ' out of reach)' : ''}</td>
                  <td>{n.daysLeft}</td>
                  <td>{K.modeSummary(w).label}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // One record, three surfaces: pick a fixture and every part redraws from the same data.
  function OneRecord() {
    const K = window.V2Kit || {};
    const [key, setKey] = useState('donePending');
    if (!K.workerFixtures || !K.WorkerCard) return <div className="g-missing">The worker kit is not loaded.</div>;
    const w = K.workerFixtures[key];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)' }}>
        <div role="group" aria-label="Fixture" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--v2-space-2)' }}>
          {K.FIXTURE_ORDER.map(function (f) {
            return <button key={f[0]} type="button" className="g-btn" aria-pressed={key === f[0]} onClick={function () { setKey(f[0]); }}
              style={key === f[0] ? { borderColor: 'var(--v2-select-line)', background: 'var(--v2-select)', color: 'var(--v2-blue-ink)' } : undefined}>{f[1]}</button>;
          })}
        </div>
        <G.Stage width="shell" ground="canvas">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)' }}>
            {w.setUp ? <K.ProgramStrip worker={w} /> : null}
            <K.WorkerCard worker={w} />
          </div>
        </G.Stage>
      </div>
    );
  }

  function WorkerModelSection() {
    return (
      <G.Section id="worker-model">
        <G.Part name="Worker record and fixtures" status="new" role="One record per partner that every worker surface reads. Counts are derived from the ledger, never stored, so they cannot disagree.">
          <G.Warn>
            Why the product needs it: V2 keeps the worker in a component's local state, module globals and
            constants. The day count is a constant ({G.refText('worker.rule.done-before')}), so tonight's
            overlay says DAY 7 OF 20 and tomorrow's strip says Day 6 of 20 ({G.refText('worker.strip.before-run')});
            the next run time is hard-coded ({G.refText('worker.flow.next-run')}); the mode per app resets on
            reload ({G.refText('worker.permissions.store')}); and opening another tab unmounts the run (R01).
          </G.Warn>
          <p><strong>Anatomy.</strong> Plain data, no methods. Helpers on <code className="g-code">window.V2Kit</code>:
            {' '}<code className="g-code">numbers(record)</code> (count, verified, pending, not counted, out of reach, the 20 segments, cashOutMin, cashOutOpen),
            {' '}<code className="g-code">workerState(record)</code> (the card state),
            {' '}<code className="g-code">blockedBy(record)</code> (null or {'{reason, app}'}),
            {' '}<code className="g-code">creditsDay(record, now)</code> ('covered' | 'waiting' | 'stopped'),
            {' '}<code className="g-code">modeSummary(record)</code>, <code className="g-code">nextRunText(record)</code>,
            {' '}<code className="g-code">endedCopy(n)</code>, <code className="g-code">dayWords(row)</code> and <code className="g-code">dayGap(from, to)</code>.
            Constants: <code className="g-code">WORKER_RULE</code>, <code className="g-code">WORKER_APPS</code>,
            {' '}<code className="g-code">WORKER_JOB</code>, <code className="g-code">WORKER_OTHER_ACCOUNT</code>, <code className="g-code">EARNINGS_URL</code>,
            {' '}<code className="g-code">SITE_FAQ_URL</code> and <code className="g-code">DAY_DEADLINE_HOUR</code> 21 (the day’s 9 pm deadline).</p>
          <G.Stage ground="surface"><pre className="g-code" style={{ display: 'block', margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{SHAPE}</pre></G.Stage>
          <p><strong>Every state, derived.</strong> One row per fixture; the numbers are computed live by <code className="g-code">numbers()</code>.</p>
          <FixtureTable />
          <p><strong>One record, every surface.</strong> Pick a fixture: the strip and the card redraw from the same record.</p>
          <OneRecord />
          <G.Note>
            The count every surface shows is verified plus pending: tonight "7 of 20 days" with one tick,
            tomorrow "7 of 20 days" with two. A rejected day drops the count and says why, it never stays
            pending forever (R19). Slots that can no longer be reached before the program ends show as out of reach.
          </G.Note>
          <G.SpecDrawer rows={[
            { part: 'Program rule', token: 'WORKER_RULE', value: "rate 1, target 20, bonus 10, ends 'Nov 1', cashOutMin 10 (copied, money waits on D3; the $10 cash-out minimum holds under both options)", ref: ['worker.rule.const', 'worker.rule.money-draft', 'worker.rule.cash-out'] },
            { part: 'What counts', token: 'numbers()', value: 'verified job, or a completed run with no job', ref: 'worker.rule.successful-day' },
            { part: 'Days before today', token: 'ledger', value: 'derived from rows, not a constant', ref: 'worker.rule.done-before' },
            { part: 'Strip count', token: 'numbers().done', value: 'same figure tonight and tomorrow', ref: 'worker.strip.before-run' },
            { part: 'Scheduled run', token: 'today.status', value: "'scheduled' on the record", ref: 'worker.flow.last-run' },
            { part: 'Set up', token: 'setUp', value: 'on the record', ref: 'worker.flow.onboarded' },
            { part: 'Mode per app', token: 'apps.<id>.mode', value: "'always' | 'auto', kept per account", ref: 'worker.permissions.store' },
            { part: 'Next run', token: 'runWindow', value: 'nextRunText(record)', ref: 'worker.flow.next-run' },
            { part: 'Earnings', token: 'EARNINGS_URL', value: 'one URL (the menu one until the product team names the dashboard)', ref: ['worker.earnings.menu-url', 'worker.strip.earnings'] },
            { part: 'Identity', token: 'account', value: 'Alex Morgan, @alexwatches (neutral fixture, R39)' },
          ]} />
          <G.DoDont
            do={['Read every worker fact from the record and numbers().', 'Add a ledger row to change a count; never edit a count.', 'Keep the record above every screen so navigation cannot erase a run.']}
            dont={['Store a day count, a next-run time or a mode in a component.', 'Hard-code 11 am or Day 6 anywhere.', 'Invent a second fixture identity for a screen.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('worker-model', WorkerModelSection);
})();
