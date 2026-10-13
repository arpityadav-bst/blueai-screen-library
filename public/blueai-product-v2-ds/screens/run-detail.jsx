/* BlueAI Product V2 Design System: Run detail (section 59, New). What the worker did on the
   partner's account in one run: every step, the job and its exact comment, whether the day
   counted, and the credits it used. V2's only record of a run is the chat thread, which unmounts
   on navigation (chat_product.jsx:159, index.html:965). Composed only from window.V2Kit.

   RunDetail {worker, state, run, row, onBack, onRetry, onRunAgain, onReport, onChangeMode,
              onOpenCredits, onNavigate, compact, landmark, frame}
     ScreenHeader 'Run details' with Back, RunCard (full, steps open, no day line: the
     Verification card owns it), the JobPreviewCard receipt when a job ran (no tick of its own:
     the day is said once, in Verification; 'Switch back to Always ask' only when the job ran on
     Automatic: ranOn), Verification (tick, one sentence, and for a rejected day Report a problem), a
     Details card (how paid jobs were taken, and the AI credits a paid job used), then a Report a
     problem link for every other run. Report a problem opens the sheet with this run attached.
     state  done | nojob | skipped | failed | stopped | nocredits | pending | verified | rejected |
            loading | error (RUN_STATES).
     run    overrides: {card, title, job, taken 'ask' | 'auto', verify, text, checkedAt, reason}.
     row    the Activity ledger row it was opened from: its date names the run and its status
            decides Verification. */
(function () {
  const { useState } = React;
  const K = () => window.V2Kit || {};

  const RUN_STATES = [
    ['done', 'Job done', 'pending verification, today'],
    ['nojob', 'No job', 'the run still counts'],
    ['skipped', 'Skipped', 'the partner said Not now'],
    ['failed', 'Failed', 'Try again, by 9 pm'],
    ['stopped', 'Stopped', 'stopped from the composer'],
    ['nocredits', 'Out of credits', 'stopped when credits ran out'],
    ['pending', 'Pending, past a day', 'still checking'],
    ['verified', 'Verified', 'two ticks'],
    ['rejected', 'Rejected', 'reason + Report a problem'],
    ['loading', 'Loading', 'the run card’s shape'],
    ['error', 'Couldn’t load', 'said in place, with Try again'],
  ];

  // The day said once, in the Verification card. Copy is proposed unless marked V2.
  const VERIFY = {
    pending: ['pending', 'Pending verification', 'We check every run within a day. One tick while pending, two once verified.'],
    late: ['late', 'Still checking', 'This one is taking longer than a day. There is nothing to do; the day counts once it’s verified.'],
    verified: ['verified', 'Verified', null],
    rejected: ['rejected', 'Not counted', null],
    notcounted: ['notcounted', 'Not counted', 'Today doesn’t count toward your 20 days.'], // V2, worker_day_done.jsx:95
    open: ['notcounted', 'Not counted yet', 'Try again by 9 pm to count the day.'],
    // Decision D6 (credits and the paid run) may let this day count; until then it does not.
    nocredits: ['notcounted', 'Not counted', 'The run stopped when AI credits ran out, so today doesn’t count.'],
  };
  // A ledger row's status -> its Verification key (a day lost to credits says why).
  const ROW_VERIFY = { verified: 'verified', pending: 'pending', late: 'late', rejected: 'rejected', notcounted: 'notcounted', skipped: 'notcounted' };

  const RUNS = {
    done: { card: 'done-pending', title: 'Today’s run', job: true, verify: 'pending' },
    nojob: { card: 'nojob', title: 'Today’s run', verify: 'pending' },
    skipped: { card: 'skipped', title: 'Today’s run', verify: 'notcounted' },
    failed: { card: 'failed', title: 'Today’s run', verify: 'open' },
    stopped: { card: 'stopped', title: 'Today’s run', verify: 'notcounted' },
    nocredits: { card: 'nocredits', title: 'Today’s run', verify: 'nocredits' },
    pending: { card: 'done-pending', title: 'Oct 10 run', job: true, verify: 'late' },
    verified: { card: 'verified', title: 'Oct 11 run', job: true, verify: 'verified', checkedAt: 'Oct 12, 7:02 am', day: 6 },
    rejected: { card: 'rejected', title: 'Oct 11 run', job: true, verify: 'rejected', reason: 'The comment was removed before we checked it.' },
  };

  function fromRow(row) {
    if (!row) return {};
    const o = { title: row.today || !row.date || row.date === 'Today' ? 'Today’s run' : row.date + ' run' };
    if (row.outcome === 'nocredits') o.verify = 'nocredits';
    else if (ROW_VERIFY[row.status]) o.verify = ROW_VERIFY[row.status];
    if (row.reason) o.reason = row.reason;
    return o;
  }

  function verifyText(r) {
    if (r.text) return r.text;
    if (r.verify === 'verified') return 'Checked ' + (r.checkedAt || 'within a day') + '. Day ' + (r.day || 7) + ' of 20 counts.';
    if (r.verify === 'rejected') return r.reason || 'This run didn’t pass the check.';
    return (VERIFY[r.verify] || VERIFY.pending)[2];
  }

  function RunSkeleton() {
    const Sk = K().Skeleton;
    if (!Sk) return null;
    return (
      <div className="v2-home-skel-card" aria-busy="true">
        <span className="v2-sr-only" role="status">Loading this run</span>
        <Sk shape="line" width="40%" />
        <Sk shape="line" width="80%" />
        <Sk shape="line" width="65%" />
        <Sk shape="rect" height={36} width={120} />
      </div>
    );
  }

  function RunDetail(p) {
    const P = K();
    const S = window.V2Screens || {};
    const [report, setReport] = useState(null);
    const key = RUNS[p.state] ? p.state : 'done';
    const r = Object.assign({}, RUNS[key], fromRow(p.row), p.run || {});
    const w = p.worker || (P.workerFixtures || {})[r.verify === 'open' ? 'failed' : 'verified'];
    const Frame = S.ScreenFrame;
    if (!w || !Frame || !P.RunCard || !P.Card) return null;
    const go = function (id, opts) { return function () { if (p.onNavigate) p.onNavigate(id, opts); }; };
    const v = VERIFY[r.verify] || VERIFY.pending;
    const rejected = r.verify === 'rejected';
    const taken = r.taken || (P.modeSummary ? P.modeSummary(w).mode : 'always');
    const credits = w.credits || {};
    const loading = p.state === 'loading';
    function openReport() {
      if (p.onReport) { p.onReport(); return; }
      const about = S.reportAbout ? S.reportAbout({ date: r.title === 'Today’s run' ? 'Today' : r.title.replace(/ run$/, ''), reason: rejected ? r.reason : null, verify: r.verify }) : {};
      setReport(about);
    }
    function onAction(kind) {
      if (kind === 'retry') (p.onRetry || go('chat', { state: 'retrying' }))();
      else if (kind === 'restart') (p.onRunAgain || go('chat', { state: 'running' }))();
      else if (kind === 'credits') (p.onOpenCredits || go('credits'))();
    }
    const sheet = report && S.ReportProblemSheet ? (
      <S.ReportProblemSheet open about={report.about} topic={report.topic} email={w.account && w.account.email}
        onClose={function () { setReport(null); }} onSent={function () { setReport(null); }} />
    ) : null;

    let body;
    if (loading) body = <RunSkeleton />;
    else if (p.state === 'error') body = S.LoadError ? <S.LoadError what="this run" onRetry={p.onRetry} /> : null;
    else {
      body = (
        <React.Fragment>
          <P.RunCard state={r.card} run={{ title: r.title, dayText: '' }} full defaultExpanded onAction={onAction} />
          {r.job && P.JobPreviewCard ? (
            <P.JobPreviewCard mode="receipt" doneAt="11:06 am" verify={null} ranOn={taken === 'auto' ? 'auto' : 'ask'}
              onChangeMode={p.onChangeMode || go('worker-settings')} />
          ) : null}
          <P.Card as="section" className="v2-verify" aria-label="Verification">
            <h2 className="v2-verify-title">Verification</h2>
            {P.StatusTick ? <P.StatusTick status={v[0]} size={16} label={v[1]} /> : null}
            <p className={'v2-verify-text' + (rejected ? ' v2-verify-text--danger' : '')}>{verifyText(r)}</p>
            {rejected && P.Button ? (
              <div className="v2-verify-actions"><P.Button variant="secondary" size="md" onClick={openReport}>Report a problem</P.Button></div>
            ) : null}
          </P.Card>
          {P.ListRow ? (
            <P.Card padding="none" as="section" aria-label="Details">
              <P.ListRow label="Paid jobs" value={taken === 'auto' ? 'Automatic' : 'Always ask'} />
              {r.job ? <P.ListRow label="AI credits used" value={String(credits.runCost || 360)} /> : null}
            </P.Card>
          ) : null}
          {!rejected && P.Link ? <P.Link standalone className="v2-rundetail-report" onClick={openReport}>Report a problem</P.Link> : null}
        </React.Fragment>
      );
    }

    return (
      <Frame worker={w} tab="activity" loading={loading} compact={p.compact} landmark={p.landmark} frame={p.frame}
        overlays={sheet} onNavigate={p.onNavigate}>
        <div className="v2-screen">
          {P.ScreenHeader ? <P.ScreenHeader title="Run details" onBack={p.onBack || go('activity')} /> : null}
          <div className="v2-screen-body v2-rundetail">{body}</div>
        </div>
      </Frame>
    );
  }

  Object.assign(window.V2Screens = window.V2Screens || {}, { RunDetail, RUN_STATES });
})();
