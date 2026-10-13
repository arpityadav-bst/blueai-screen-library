/* BlueAI Product V2 Design System: Run detail (section 59, New). What the worker did on the
   partner's account in one run: every step, the job and its exact comment, whether the day
   counted, and the credits it used. V2's only record of a run is the chat thread, which unmounts
   on navigation (chat_product.jsx:159, index.html:965). Composed only from window.V2Kit.

   RunDetail {worker, state, run, row, tab, onBack, onRetry, onRunAgain, onReport, onChangeMode,
              onOpenCredits, onNavigate, compact, landmark, frame}
     tab    the tab it was opened from ('activity' by default; Home's Details and the run chip
            pass theirs): it stays lit and Back returns there, as AI credits and Notifications do.
     ScreenHeader 'Run details' with Back, RunCard (full, steps open, no day line: the
     Verification card owns it), the JobPreviewCard receipt when a job ran (no tick of its own:
     the day is said once, in Verification; 'Switch back to Always ask' only when the job ran on
     Automatic: ranOn), Verification (tick, one sentence, and for a rejected day Report a problem), a
     Details card (how this job was taken, and the AI credits it used), then a Report a problem
     link for every other run. Report a problem opens the sheet with this run attached.
     state  done | nojob | skipped | failed | stopped | nocredits | pending | verified | rejected |
            loading | error (RUN_STATES).
     run    overrides: {card, title, job, taken 'ask' | 'auto', verify, text, checkedAt, reason, day}.
     row    the Activity ledger row it was opened from (section 41): its date names the run, its
            status decides Verification, its place in the ledger gives the day number, and its
            checkedAt and ranOn say when it was checked and how the job was taken. A settled row
            (not today's live run) offers no Try again or Run again, and a past day's words are
            dated. How a job was taken is the record's, never today's setting: with no ranOn, the
            row is left out. */
(function () {
  const { useState } = React;
  const K = () => window.V2Kit || {};

  const RUN_STATES = [
    ['done', 'Job done', 'pending verification, today'],
    ['nojob', 'No job', 'the run still counts'],
    ['skipped', 'Skipped', 'the partner said Not now'],
    ['failed', 'Failed', 'Try again, by 9 pm'],
    ['stopped', 'Stopped', 'Not counted yet: Run again by 9 pm'],
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
    reopen: ['notcounted', 'Not counted yet', 'Run again by 9 pm to count the day.'],
    // Decision D6 (credits and the paid run) may let this day count; until then it does not.
    nocredits: ['notcounted', 'Not counted', 'The run stopped when AI credits ran out, so today doesn’t count.'],
  };
  // A ledger row's status -> its Verification key (a day lost to credits says why).
  const ROW_VERIFY = { verified: 'verified', pending: 'pending', late: 'late', rejected: 'rejected', notcounted: 'notcounted', skipped: 'notcounted' };
  const COUNTS = { verified: 1, pending: 1, late: 1 };

  // Specimens. Today's runs read how the job was taken from the record (today.ranOn); the dated
  // ones carry it, as their ledger rows would.
  const RUNS = {
    done: { card: 'done-pending', title: 'Today’s run', job: true, verify: 'pending' },
    nojob: { card: 'nojob', title: 'Today’s run', verify: 'pending' },
    skipped: { card: 'skipped', title: 'Today’s run', verify: 'notcounted' },
    failed: { card: 'failed', title: 'Today’s run', verify: 'open' },
    stopped: { card: 'stopped', title: 'Today’s run', verify: 'reopen' },
    nocredits: { card: 'nocredits', title: 'Today’s run', verify: 'nocredits' },
    pending: { card: 'done-pending', title: 'Oct 10 run', job: true, verify: 'late', taken: 'ask' },
    verified: { card: 'verified', title: 'Oct 11 run', job: true, verify: 'verified', checkedAt: 'Oct 12, 7:02 am', day: 6, taken: 'ask' },
    rejected: { card: 'rejected', title: 'Oct 11 run', job: true, verify: 'rejected', reason: 'The comment was removed before we checked it.', taken: 'ask' },
  };

  // A counted day's number: the counted days in the ledger up to and including its row.
  function dayOf(w, row, today) {
    const L = (w && w.ledger) || [];
    const i = today ? L.length - 1 : L.map(function (x) { return x.date; }).lastIndexOf(row.date);
    return i < 0 ? null : L.slice(0, i + 1).filter(function (x) { return COUNTS[x.status]; }).length;
  }

  function fromRow(row, w) {
    if (!row) return {};
    const today = !!row.today || !row.date || row.date === 'Today';
    const o = { title: today ? 'Today’s run' : row.date + ' run', taken: row.ranOn || (today && w && w.today && w.today.ranOn) || null };
    if (!row.live) o.action = null; // a settled day: nothing to try again or run again
    if (!today) o.past = row.date;
    if (row.outcome === 'nocredits') o.verify = 'nocredits';
    else if (ROW_VERIFY[row.status]) o.verify = ROW_VERIFY[row.status];
    if (row.reason) o.reason = row.reason;
    if (o.verify === 'verified') { o.day = dayOf(w, row, today); o.checkedAt = row.checkedAt || null; }
    return o;
  }

  function verifyText(r, target) {
    if (r.text) return r.text;
    if (r.verify === 'verified') {
      return (r.checkedAt ? 'Checked ' + r.checkedAt + '. ' : '') + (r.day ? 'Day ' + r.day + ' of ' + target + ' counts.' : 'This day counts toward your ' + target + ' days.');
    }
    if (r.verify === 'rejected') return r.reason || 'This run didn’t pass the check.';
    if (r.past && r.verify === 'notcounted') return r.past + ' didn’t count toward your ' + target + ' days.';
    if (r.past && r.verify === 'nocredits') return 'The run stopped when AI credits ran out, so ' + r.past + ' didn’t count.';
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
    const w = p.worker || (P.workerFixtures || {})[(!p.row && { failed: 'failed', stopped: 'stopped' }[key]) || 'verified'];
    const r = Object.assign({}, RUNS[key], fromRow(p.row, w), p.run || {});
    const Frame = S.ScreenFrame;
    if (!w || !Frame || !P.RunCard || !P.Card) return null;
    const go = function (id, opts) { return function () { if (p.onNavigate) p.onNavigate(id, opts); }; };
    const v = VERIFY[r.verify] || VERIFY.pending;
    const rejected = r.verify === 'rejected';
    const taken = r.taken !== undefined ? r.taken : ((w.today && w.today.ranOn) || null);
    const target = P.numbers ? P.numbers(w).target : 20;
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
          <P.RunCard state={r.card} run={Object.assign({ title: r.title, dayText: '' }, r.action === null ? { action: null } : {})}
            full defaultExpanded onAction={onAction} />
          {r.job && P.JobPreviewCard ? (
            <P.JobPreviewCard mode="receipt" doneAt="11:06 am" verify={null} ranOn={taken === 'auto' ? 'auto' : 'ask'}
              onChangeMode={p.onChangeMode || go('worker-settings')} />
          ) : null}
          <P.Card as="section" className="v2-verify" aria-label="Verification">
            <h2 className="v2-verify-title">Verification</h2>
            {P.StatusTick ? <P.StatusTick status={v[0]} size={16} label={v[1]} /> : null}
            <p className={'v2-verify-text' + (rejected ? ' v2-verify-text--danger' : '')}>{verifyText(r, target)}</p>
            {rejected && P.Button ? (
              <div className="v2-verify-actions"><P.Button variant="secondary" size="md" onClick={openReport}>Report a problem</P.Button></div>
            ) : null}
          </P.Card>
          {r.job && P.ListRow ? (
            <P.Card padding="none" as="section" aria-label="Details">
              {taken ? <P.ListRow label="Paid jobs" value={taken === 'auto' ? 'Automatic' : 'Always ask'} /> : null}
              <P.ListRow label="AI credits used" value={String(credits.runCost || 360)} />
            </P.Card>
          ) : null}
          {!rejected && P.Link ? <P.Link standalone className="v2-rundetail-report" onClick={openReport}>Report a problem</P.Link> : null}
        </React.Fragment>
      );
    }

    return (
      <Frame worker={w} tab={p.tab || 'activity'} loading={loading} compact={p.compact} landmark={p.landmark} frame={p.frame}
        overlays={sheet} onNavigate={p.onNavigate}>
        <div className="v2-screen">
          {P.ScreenHeader ? <P.ScreenHeader title="Run details" onBack={p.onBack || go(p.tab || 'activity')} /> : null}
          <div className="v2-screen-body v2-rundetail">{body}</div>
        </div>
      </Frame>
    );
  }

  Object.assign(window.V2Screens = window.V2Screens || {}, { RunDetail, RUN_STATES });
})();
