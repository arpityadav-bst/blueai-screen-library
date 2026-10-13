/* Section 42: the worker card and coach mark (Changed from V2). Owner: worker slice. */
(function () {
  const G = window.V2Guide;
  const { useState } = React;
  const noop = function () {};

  // V2's home card paints its coach scrim against the nearest positioned box; this keeps it in here.
  function Contained({ height, children }) {
    return <div style={{ position: 'relative', overflow: 'hidden', minHeight: height || 260, padding: 'var(--v2-space-3)' }}>{children}</div>;
  }

  const STATES = [
    ['setup', 'new', 'Set up', 'Not set up yet: V2 description and Run (?start=worker)'],
    ['scheduled', 'setUp', 'Next run', 'Run now is secondary: nothing is waiting'],
    ['running', 'running', 'Running', 'live step, Details opens today'],
    ['waiting', 'waiting', 'Waiting for you', 'the deadline and its cost before the tap'],
    ['done', 'donePending', 'Done today', 'no second Run; pending until verified'],
    ['done', 'declined', 'Done, skipped', 'says the day does not count'],
    ['failed', 'failed', 'Failed', 'Try again, with the deadline'],
    ['paused', 'paused', 'Paused', 'days do not count while paused'],
    ['noCredits', 'noCredits', 'Out of credits', 'when the allowance comes back'],
    ['offline', 'offline', 'Offline', 'what happens to today'],
    ['complete', 'complete', 'Program complete', 'Earnings opens the site'],
    ['done', 'automatic', 'Automatic', 'the mode line names the app'],
  ];

  function CoachDemo() {
    const K = window.V2Kit || {};
    const [seen, setSeen] = useState(false);
    if (!K.WorkerCard) return <div className="g-missing">The worker kit is not loaded.</div>;
    const Scrim = K.Scrim;
    return (
      <Contained height={300}>
        {!seen && Scrim ? <div style={{ position: 'absolute', inset: 0, zIndex: 'var(--v2-z-coach)' }}><Scrim variant="dim" onClick={function () { setSeen(true); }} /></div> : null}
        <K.WorkerCard worker={K.workerFixtures.new} coaching={!seen} onDismissCoach={function () { setSeen(true); }} onRun={function () { setSeen(true); }} />
        {seen ? <p className="g-muted" style={{ marginTop: 'var(--v2-space-3)' }}>Dismissed: the record keeps <code className="g-code">coachSeen: true</code>, so it never returns. <button type="button" className="g-btn" onClick={function () { setSeen(false); }}>Show again</button></p> : null}
      </Contained>
    );
  }

  function WorkerCardSection() {
    const K = window.V2Kit || {};
    const ready = !!(K.WorkerCard && K.workerFixtures);
    const card = (state, fx) => (ready ? <div style={{ width: '100%' }}><K.WorkerCard worker={K.workerFixtures[fx]} state={state} onRun={noop} onOpenToday={noop} onRetry={noop} onResume={noop} onOpenCredits={noop} /></div> : null);
    return (
      <G.Section id="worker-card">
        <G.Part name="WorkerCard" status="changed" role="The home's one card: what the worker is doing today and the one action that matters now. Never a second Run.">
          <p><strong>Anatomy.</strong> Card radius 16 with a 1px line, no shadow. Tile 40, radius 10, sunken, with the
            state's icon (tone only for waiting, failed, running and complete). Title 16/600 'BlueAI worker'. Status
            line 13 ink-3, an optional 12 line for the deadline or consequence. Mode line 12/500: shield-check
            'Always ask' or zap 'Automatic · YouTube'. One Button on the right.</p>
          <G.StateGrid wide states={STATES.map(function (s) { return { label: s[2], note: s[3], node: card(s[0], s[1]) }; })} />
          <G.CompareRow
            v2={<Contained height={300}><G.Live get={function () { return window.MoneyMaker && window.MoneyMaker.MoneyMakerHome; }} props={{ onRun: noop }} label="MoneyMakerHome" /></Contained>}
            system={<CoachDemo />}
            changed="The infinite gradient border, the glow and the green dollar tile go: the card sits on a line like every other card, and the tile carries the state, not money. The whole-card role=button that wrapped a second button goes; only the action acts. 'Run' always sent 'my first paid job' and could complete the day again; now Run exists only before setup and as 'Run now' before today's run. Every other state names what is happening and when, from the record." />
          <G.FrameState url="index.html?start=worker" label="V2: first open of the worker home (coach on)" height={830} />
          <G.FrameState url="index.html?day=returning" label="V2: returning partner, before today's run" height={830} />
          <G.SpecDrawer rows={[
            { part: 'Card', token: '--v2-radius-lg, --v2-line, --v2-shadow-0', value: '16, 1px line, no shadow, no animated border', ref: ['worker.card.border-spin', 'worker.strip.shadow'] },
            { part: 'Tile', token: '--v2-surface-sunken, --v2-radius-md', value: '40 x 40, radius 10, state icon 20', ref: 'worker.card.tile' },
            { part: 'Title', token: '--v2-text-16, --v2-weight-semibold, --v2-ink', value: "'BlueAI worker' 16/600", ref: 'worker.card.title' },
            { part: 'Set up line', token: '--v2-text-13, --v2-ink-3', value: 'Finds jobs that fit you and runs them on your account.', ref: 'worker.card.desc' },
            { part: 'Action', token: '--v2-action (primary) or secondary / quiet', value: 'Button md 36; one per card', ref: ['worker.card.run', 'worker.card.run-label'] },
            { part: 'Run message', token: 'none', value: 'Run starts setup or today’s run, never "first paid job" twice', ref: 'worker.card.prompt' },
            { part: 'Mode line', token: '--v2-text-12, --v2-ink-3 / --v2-blue-ink', value: "'Always ask' or 'Automatic · YouTube'", ref: 'worker.permissions.summary' },
            { part: 'Next run', token: 'nextRunText(record)', value: 'Next run today at 11 am. (from the saved window)', ref: 'worker.flow.next-run' },
            { part: 'Running step', token: 'today.step', value: 'Watching a tech Short…', ref: 'worker.flow.running-step' },
            { part: 'Done', token: 'today.end', value: 'Today’s run is done. / Pending verification', ref: ['worker.copy.job', 'worker.copy.pending'] },
            { part: 'Skipped', token: 'today.end', value: 'Run finished without a job. / Today doesn’t count toward your 20 days.', ref: 'worker.copy.declined' },
            { part: 'Failed', token: '--v2-danger-ink', value: 'Today’s job didn’t finish. + reason + Try again by 9 pm', ref: ['worker.copy.failed', 'worker.flow.failed-reason'] },
            { part: 'Waiting, paused, credits, offline, complete', token: 'status family', value: 'Proposed copy, each with its consequence for today' },
          ]} />
          <G.DoDont
            do={['Say what happens to today on the card itself (deadline, does not count, refresh time).', 'Keep one action; make it primary only when the partner is needed (set up, waiting, failed).', 'Read the next run time from the record.']}
            dont={['Offer Run after today’s run is done.', 'Make the whole card a button around another button.', 'Animate the border or paint the tile green for money.']} />
        </G.Part>

        <G.Part name="CoachMark" status="changed" role="Points a brand-new partner at the one thing to press, once. PM copy kept; it no longer returns on every remount.">
          <p><strong>Anatomy.</strong> Ink fill, radius 10, shadow-1, caret 6 aimed at the action. Title 13/500 on-colour
            'Run this to begin'. Okay: a 32px inverse button. The screen draws the dim scrim at the coach layer (z 40) and lifts the card above it.</p>
          <G.StateGrid states={ready ? [
            { label: 'Visible', node: <K.CoachMark onOkay={noop} /> },
            { label: 'Okay hover', node: <K.CoachMark onOkay={noop} okayClassName="is-hover" /> },
            { label: 'Okay focus-visible', node: <K.CoachMark onOkay={noop} okayClassName="is-focus" /> },
            { label: 'Okay pressed', node: <K.CoachMark onOkay={noop} okayClassName="is-active" /> },
            { label: 'Dismissed (remembered)', note: 'Okay, a scrim click or Run sets coachSeen', node: <span className="g-muted">Nothing renders.</span> },
          ] : []} />
          <G.CompareRow
            v2={<G.FrameState url="index.html?start=worker" label="V2: coach under the card" height={830} />}
            system={ready ? <K.CoachMark onOkay={noop} /> : null}
            changed="Same words and the same Okay. The blue bubble becomes ink so it reads as a pointer, not another blue button. Okay grows from about 21px at 3.24:1 to 32px at 19:1. Dismissal is stored on the record instead of in local state, so it does not come back on a remount." />
          <G.SpecDrawer rows={[
            { part: 'Fill', token: '--v2-ink', value: 'ink, radius 10, shadow-1', ref: 'worker.card.coach-fill' },
            { part: 'Copy', token: '--v2-text-13, --v2-on-color', value: 'Run this to begin', ref: 'worker.card.coach-copy' },
            { part: 'Okay', token: '--v2-hit-min, --v2-surface, --v2-ink', value: '32 tall, radius 6, 13/500', ref: ['worker.card.okay', 'worker.card.okay-label'] },
            { part: 'Scrim', token: '--v2-scrim, --v2-z-coach', value: 'rgba(11,18,32,0.48), z 40', ref: 'worker.card.scrim' },
            { part: 'Memory', token: 'coachSeen', value: 'on the Worker record', ref: 'worker.card.coach-state' },
            { part: 'Motion', token: '--v2-dur-3, --v2-ease-out', value: 'rise 6px once, none under reduced motion' },
          ]} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('worker-card', WorkerCardSection);
})();
