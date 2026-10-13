/* Section 59: Run detail (screens-core slice). Part: RunDetail (New).
   Screen: screens/run-detail.jsx (V2Screens.RunDetail). Refs: guide/refs/screens-core.js. */
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

  function RunDetailSection() {
    const S = window.V2Screens || {};
    const F = (window.V2Kit || {}).workerFixtures || {};
    if (!S.RunDetail) return <G.Section id="run-detail"><div className="g-missing">V2Screens.RunDetail is not loaded.</div></G.Section>;
    const states = S.RUN_STATES.map(function (s) {
      return { label: s[1], note: s[2], node: <Shot><S.RunDetail state={s[0]} landmark={false} /></Shot> };
    }).concat([
      { label: 'Job done on Automatic', note: 'the receipt offers the way back to Always ask', node: <Shot><S.RunDetail state="done" worker={F.automatic} landmark={false} /></Shot> },
      { label: 'Compact window (640)', note: 'header pinned, the run scrolls', node: <Shot h={640}><S.RunDetail state="verified" compact landmark={false} /></Shot> },
    ]);
    return (
      <G.Section id="run-detail">
        <G.Part name="RunDetail" status="new" role="What the worker did on my account in one run, and whether that day counted.">
          <G.Note><strong>Why the product needs it.</strong> The worker acts on the partner's own YouTube account while
            nobody watches. In V2 the only record of what it did is the chat thread, built step by step as bubbles,
            and it disappears the moment another tab opens. The comment posted under the partner's name is never shown
            ('Leaving a comment…'), and nothing says when a day was checked or why it did not count. A partner who is
            paid per verified day, and who can be asked about a comment they did not write, needs the receipt.</G.Note>
          <p><strong>Anatomy.</strong> Pushed over Activity (or opened from Home's Details and the run chip), Activity
            stays lit. ScreenHeader 'Run details' with Back; then a 12px column: the RunCard (section 36) full width with
            its steps open and no day line; the JobPreviewCard receipt (section 45) when a paid job ran: the video, the
            channel, what was done and the exact comment; Verification, the one place the day is said: a tick in words and
            one sentence, plus Report a problem on a rejected day; Details (job mode, AI credits a paid job used); a
            standalone Report a problem link on every other run.</p>
          <G.StateGrid wide states={states} />
          <G.CompareRow v2Label="V2 today (the only record)"
            v2={<G.FrameState url="index.html?day=next" label="V2: a daily run, as status bubbles in the chat" height={830} />}
            system={<div style={{ width: W, maxWidth: '100%', overflow: 'auto' }}><S.RunDetail state="rejected" landmark={false} /></div>}
            changed="The only record was a chat thread that disappears on navigation. Run detail keeps every run, with what was posted and whether the day counted, for as long as the program lasts." />
          <G.SpecDrawer rows={[
            { part: 'Header', token: 'ScreenHeader with Back', value: "'Run details'; Back returns to Activity (or Home)" },
            { part: 'Record', token: 'Worker record, ledger row', value: 'kept per run; V2 renders steps as bubbles only', ref: 'screens-core.run.render-step' },
            { part: 'Steps', token: 'RunCard full, defaultExpanded', value: 'every step with its time; V2 says them once, live', ref: ['screens-core.run.open-steps', 'screens-core.run.like-step'] },
            { part: 'The comment', token: 'JobPreviewCard receipt', value: 'the exact words posted under the partner’s name', ref: 'screens-core.run.comment-step' },
            { part: 'Failed reason', token: 'RunCard failed', value: 'App Player closed during the job. + Try again', ref: 'screens-core.run.fail-reason' },
            { part: 'No job', token: 'RunCard nojob', value: 'No paid job on the board today.', ref: 'screens-core.run.no-job' },
            { part: 'Done line', token: 'RunCard done', value: 'Today’s run is done.', ref: 'screens-core.run.done-title' },
            { part: 'Verification', token: 'Card, --v2-radius-lg, --v2-line', value: 'title 14/600, StatusTick 16 with its word, sentence 13 ink-2' },
            { part: 'Pending', token: 'StatusTick pending', value: 'Pending verification / We check every run within a day.', ref: 'screens-core.run.pending' },
            { part: 'Verified', token: 'StatusTick verified', value: 'Checked Oct 12, 7:02 am. Day 6 of 20 counts.' },
            { part: 'Rejected', token: 'StatusTick rejected, --v2-danger-ink', value: 'the reason, then Report a problem (secondary, 36)' },
            { part: 'Not counted', token: 'StatusTick notcounted', value: 'Today doesn’t count toward your 20 days.', ref: 'screens-core.ledger.declined' },
            { part: 'Details', token: 'Card padding none, ListRow static', value: "Paid jobs: how this job ran, 'Always ask' / 'Automatic'; AI credits used 360" },
            { part: 'Receipt', token: 'JobPreviewCard receipt, verify null, ranOn', value: "no tick of its own (Verification says the day once); 'Switch back to Always ask' only when the job ran on Automatic" },
            { part: 'Out of credits', token: 'StatusTick notcounted', value: 'The run stopped when AI credits ran out, so today doesn’t count. (decision D6 may change it)' },
          ]} />
          <G.DoDont
            do={['Say the day once, in Verification, with the reason when it did not count.', 'Show the exact comment that went out under the partner’s name.', 'Keep the run after the chat moves on.']}
            dont={['Repeat the day line in the RunCard and in Verification.', 'Drop Report a problem from runs that counted: any run can be questioned.', 'Show money here before decision D3.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('run-detail', RunDetailSection);
})();
