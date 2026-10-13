/* BlueAI Product V2 Design System: Run detail (section 59, New). What the worker did on the
   partner's account in one run: every step, the job and its exact comment, whether the day
   counted, and the credits it used. V2's only record of a run is the chat thread, which unmounts
   on navigation (chat_product.jsx:159, index.html:965). Composed only from window.V2Kit.

   RunDetail {worker, state, run, onBack, onRetry, onRunAgain, onReport, onChangeMode,
              onOpenCredits, onNavigate, compact, landmark, frame}
     ScreenHeader 'Run details' with Back, RunCard (full, steps open, no day line: the
     Verification card owns it), the JobPreviewCard receipt when a job ran, Verification (tick,
     one sentence, and for a rejected day Report a problem), a Details card (job mode, and the AI
     credits a paid job used), then a Report a problem link for every other run.
     state  done | nojob | skipped | failed | stopped | pending | verified | rejected (RUN_STATES).
     run    overrides: {card, title, job, verify, text, checkedAt, reason}. */
(function () {
  const K = () => window.V2Kit || {};

  const RUN_STATES = [
    ['done', 'Job done', 'pending verification, today'],
    ['nojob', 'No job', 'the run still counts'],
    ['skipped', 'Skipped', 'the partner said Not now'],
    ['failed', 'Failed', 'Try again, by 9 pm'],
    ['stopped', 'Stopped', 'stopped from the composer'],
    ['pending', 'Pending, past a day', 'still checking'],
    ['verified', 'Verified', 'two ticks'],
    ['rejected', 'Rejected', 'reason + Report a problem'],
  ];

  // The day said once, in the Verification card. Copy is proposed unless marked V2.
  const VERIFY = {
    pending: ['pending', 'Pending verification', 'We check every run within a day. One tick while pending, two once verified.'],
    late: ['late', 'Still checking', 'This one is taking longer than a day. There is nothing to do; the day counts once it’s verified.'],
    verified: ['verified', 'Verified', null],
    rejected: ['rejected', 'Not counted', null],
    notcounted: ['notcounted', 'Not counted', 'Today doesn’t count toward your 20 days.'], // V2, worker_day_done.jsx:95
    open: ['notcounted', 'Not counted yet', 'Try again by 9 pm to count the day.'],
  };

  const RUNS = {
    done: { card: 'done-pending', title: 'Today’s run', job: true, verify: 'pending' },
    nojob: { card: 'nojob', title: 'Today’s run', verify: 'pending' },
    skipped: { card: 'skipped', title: 'Today’s run', verify: 'notcounted' },
    failed: { card: 'failed', title: 'Today’s run', verify: 'open' },
    stopped: { card: 'stopped', title: 'Today’s run', verify: 'notcounted' },
    pending: { card: 'done-pending', title: 'Oct 10 run', job: true, verify: 'late' },
    verified: { card: 'verified', title: 'Oct 11 run', job: true, verify: 'verified', checkedAt: 'Oct 12, 7:02 am', day: 6 },
    rejected: { card: 'rejected', title: 'Oct 11 run', job: true, verify: 'rejected', reason: 'The comment was removed before we checked it.' },
  };

  function verifyText(r) {
    if (r.text) return r.text;
    if (r.verify === 'verified') return 'Checked ' + (r.checkedAt || 'within a day') + '. Day ' + (r.day || 7) + ' of 20 counts.';
    if (r.verify === 'rejected') return r.reason || 'This run didn’t pass the check.';
    return (VERIFY[r.verify] || VERIFY.pending)[2];
  }

  function RunDetail(p) {
    const P = K();
    const key = RUNS[p.state] ? p.state : 'done';
    const r = Object.assign({}, RUNS[key], p.run || {});
    const w = p.worker || (P.workerFixtures || {})[r.verify === 'open' ? 'failed' : 'verified'];
    const Frame = (window.V2Screens || {}).ScreenFrame;
    if (!w || !Frame || !P.RunCard || !P.Card) return null;
    const go = function (id) { return function () { if (p.onNavigate) p.onNavigate(id); }; };
    const v = VERIFY[r.verify] || VERIFY.pending;
    const rejected = r.verify === 'rejected';
    const report = p.onReport || go('report');
    const mode = P.modeSummary ? P.modeSummary(w) : { label: 'Always ask' };
    const credits = w.credits || {};
    function onAction(kind) {
      if (kind === 'retry') (p.onRetry || go('chat'))();
      else if (kind === 'restart') (p.onRunAgain || go('chat'))();
      else if (kind === 'credits') (p.onOpenCredits || go('credits'))();
    }

    return (
      <Frame worker={w} tab="activity" compact={p.compact} landmark={p.landmark} frame={p.frame} onNavigate={p.onNavigate}>
        <div className="v2-screen">
          {P.ScreenHeader ? <P.ScreenHeader title="Run details" onBack={p.onBack || go('activity')} /> : null}
          <div className="v2-screen-body v2-rundetail">
            <P.RunCard state={r.card} run={{ title: r.title, dayText: '' }} full defaultExpanded onAction={onAction} />
            {r.job && P.JobPreviewCard ? (
              <P.JobPreviewCard mode="receipt" doneAt="11:06 am" onChangeMode={p.onChangeMode || go('worker-settings')} />
            ) : null}
            <P.Card as="section" className="v2-verify" aria-label="Verification">
              <h2 className="v2-verify-title">Verification</h2>
              {P.StatusTick ? <P.StatusTick status={v[0]} size={16} label={v[1]} /> : null}
              <p className={'v2-verify-text' + (rejected ? ' v2-verify-text--danger' : '')}>{verifyText(r)}</p>
              {rejected && P.Button ? (
                <div className="v2-verify-actions"><P.Button variant="secondary" size="md" onClick={report}>Report a problem</P.Button></div>
              ) : null}
            </P.Card>
            {P.ListRow ? (
              <P.Card padding="none" as="section" aria-label="Details">
                <P.ListRow label="Job mode" value={mode.label} />
                {r.job ? <P.ListRow label="AI credits used" value={String(credits.runCost || 360)} /> : null}
              </P.Card>
            ) : null}
            {!rejected && P.Link ? <P.Link standalone className="v2-rundetail-report" onClick={report}>Report a problem</P.Link> : null}
          </div>
        </div>
      </Frame>
    );
  }

  Object.assign(window.V2Screens = window.V2Screens || {}, { RunDetail, RUN_STATES });
})();
