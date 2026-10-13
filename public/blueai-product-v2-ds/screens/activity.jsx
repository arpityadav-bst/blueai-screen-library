/* BlueAI Product V2 Design System: Activity, the run and verification ledger (section 58, New).
   Replaces V2's Jobs tab ('Coming Soon', jobs.jsx:140) and Schedule (sample tasks): the one place
   that lists which days counted. Composed only from window.V2Kit, read at render.

   Activity {worker, state, tab, past, onTab, onOpenRun(row), onReport(row), onRetry, onNavigate,
             compact, landmark, frame}
     ScreenHeader 'Activity', ProgramStrip, Tabs (This program / Past), then one ledger row per day,
     newest first: date column, result, and the verification tick (or a Badge while today is live).
     A row's words come from its outcome and its tick from its status (V2Kit.dayWords), so a
     no-job day says so, never 'Paid job done'. A rejected day carries its reason and a Report a
     problem action under the row (a control is never nested in a nav row); the report opens with
     that run attached and 'A day that wasn't counted' picked. Rows open where the day can be acted
     on (rowTarget): a running or waiting run opens Chat at its card, every other run opens Run
     detail in its state (by outcome, then status); a day with no run is static. Today's live row
     is keyed on workerState, like Home's card and the Activity badge, so every state the badge
     counts has a row: a run that didn't start opens Home (Run now), one that can't start opens
     the place that fixes it. state picks the
     fixture and tab (ACTIVITY_STATES) when worker / tab are not passed; loading draws the ledger's
     shape, error says so in place with Try again.
     past [{id, title, range, done, target}] earlier programs (PAST_PROGRAMS is the specimen).
   ledgerRows(worker)  the rows, derived from the record: today's live run first, then the ledger.
   rowTarget(row)  ['chat', {state}] or ['run', {state, row}]: where a row opens. */
(function () {
  const { useState, useId } = React;
  const K = () => window.V2Kit || {};

  const ACTIVITY_STATES = [
    ['empty', 'setUp', 'program', 'Empty (before day 1)', 'the next run, said once'],
    ['mid', 'donePending', 'program', 'Mid-program', 'today pending, the rest verified'],
    ['today', 'waiting', 'program', 'Today in progress', 'a Badge until the run settles'],
    ['nojob', 'nojob', 'program', 'No job today', 'the day still counts'],
    ['rejected', 'rejected', 'program', 'Rejected day', 'reason + Report a problem'],
    ['complete', 'complete', 'program', 'Program complete', 'every day verified'],
    ['past', 'verified', 'past', 'Past tab', 'after a second program'],
    ['pastEmpty', 'verified', 'past', 'Past tab, first program', 'nothing to show yet'],
    ['loading', 'verified', 'program', 'Loading', 'the ledger’s shape'],
    ['error', 'verified', 'program', 'Couldn’t load', 'said in place, with Try again'],
  ];
  // Proposed specimen: what Past holds once a partner has finished a program.
  const PAST_PROGRAMS = [{ id: 'sep', title: 'September program', range: 'Sep 2 to Sep 30', done: 20, target: 20 }];

  // A ledger row is {date, outcome, status} (section 41): its words come from what the run did
  // (V2Kit.dayWords: 'No job on the board', never 'Paid job done' for a no-job day), its tick from
  // whether the day counts. Rows written before outcome existed are read the same way.
  const LEGACY = { skipped: ['skipped', 'notcounted'], missed: ['norun', 'notcounted'] };
  function norm(r) {
    const l = LEGACY[r.status];
    return Object.assign({ outcome: 'job' }, r, l ? { outcome: r.outcome || l[0], status: l[1] } : {});
  }
  function words(r) {
    const P = K();
    if (P.dayWords) return P.dayWords(r);
    return { result: r.outcome === 'nojob' ? 'No job on the board' : 'Paid job done', tick: r.status, tickWord: r.status, hasRun: r.outcome !== 'norun' };
  }
  // Where a finished day opens in Run detail: by what the run did, then by whether it counted.
  const RUN_OF_OUTCOME = { nojob: 'nojob', skipped: 'skipped', expired: 'skipped', stopped: 'stopped', failed: 'failed', nocredits: 'nocredits' };
  const RUN_OF_STATUS = { verified: 'verified', pending: 'done', late: 'pending', rejected: 'rejected', notcounted: 'skipped' };
  // Today, while the run is live or can still count: a Badge says the run's state (not a tick).
  const LIVE = {
    running: ['Run in progress', null, 'info', 'Running'],
    waiting: ['Paid job waiting', 'Answer by 9 pm or today won’t count.', 'attention', 'Needs you'],
    failed: ['Job didn’t finish', 'Try again by 9 pm to count the day.', 'danger', 'Not counted yet'],
    stopped: ['Run stopped', 'Run again by 9 pm to count the day.', 'neutral', 'Not counted yet'],
    missed: ['Run didn’t start', 'Run it by 9 pm to count the day.', 'attention', 'Not counted yet'],
    blocked: ['Run can’t start', null, 'danger', 'Can’t run'],
  };
  // What blocks today's run (V2Kit.blockedBy), said as the fix, in the WorkerCard's words.
  const BLOCKED_FIX = {
    'no-app': 'YouTube isn’t connected. Connect it by 9 pm to count the day.',
    'signed-out': 'App Player isn’t signed in to YouTube. Sign in there by 9 pm to count the day.',
    'no-bluestacks': 'BlueStacks isn’t installed. Install it by 9 pm to count the day.',
  };

  function nextDate(d) {
    const m = /^([A-Za-z]+) (\d+)$/.exec(d || '');
    return m ? m[1] + ' ' + (Number(m[2]) + 1) : 'Today';
  }

  function ledgerRows(w) {
    const P = K();
    const list = (w && w.ledger) || [];
    const t = (w && w.today) || {};
    const st = w && P.workerState ? P.workerState(w) : t.status;
    const rows = list.map(function (r, i) { return Object.assign({ key: r.date + i }, norm(r)); });
    const last = rows[rows.length - 1];
    if (t.status === 'done' && last) Object.assign(last, { date: 'Today', today: true });
    else if (LIVE[st]) {
      const why = st === 'blocked' && P.blockedBy ? (P.blockedBy(w) || {}).reason : null;
      rows.push({ key: 'today', date: 'Today', today: true, live: st, reason: why || null, from: last ? nextDate(last.date) : null });
    }
    return rows.reverse();
  }

  function rowTarget(row) {
    if (row.live === 'running' || row.live === 'waiting') return ['chat', { state: row.live }];
    if (row.live === 'missed') return ['home'];
    if (row.live === 'blocked') return row.reason === 'no-bluestacks' ? ['settings', { highlight: 'bluestacks' }] : ['connected-apps', { app: 'youtube' }];
    if (row.live) return ['run', { state: row.live, row: row }];
    const r = norm(row);
    if (!words(r).hasRun) return null;
    const state = r.status === 'rejected' ? 'rejected' : (RUN_OF_OUTCOME[r.outcome] || RUN_OF_STATUS[r.status] || 'done');
    return ['run', { state: state, row: r }];
  }

  function Row({ row, onOpenRun, onReport }) {
    const P = K();
    const live = row.live ? LIVE[row.live] : null;
    const wd = live ? null : words(row);
    const label = (
      <span className="v2-ledger-line">
        <span className="v2-ledger-date">{row.date}</span>
        <span className="v2-ledger-result">{live ? live[0] : (row.result || wd.result)}</span>
      </span>
    );
    const desc = live ? (row.live === 'blocked' ? BLOCKED_FIX[row.reason] || BLOCKED_FIX['no-app'] : live[1])
      : (row.status === 'rejected' ? row.reason : null);
    const trailing = live
      ? (P.Badge ? <P.Badge tone={live[2]} busy={row.live === 'running'}>{live[3]}</P.Badge> : null)
      : (P.StatusTick ? <P.StatusTick status={wd.tick} size={14} label={wd.tickWord} /> : null);
    return (
      <div className="v2-ledger-item">
        <P.ListRow className="v2-ledger-row" label={label} description={desc} trailing={trailing}
          onClick={rowTarget(row) ? function () { onOpenRun(row); } : undefined} divider={false} />
        {row.status === 'rejected' && P.Link ? (
          <div className="v2-ledger-act">
            <P.Link standalone onClick={function () { onReport(row); }}>Report a problem</P.Link>
          </div>
        ) : null}
      </div>
    );
  }

  function ProgramTab({ w, onOpenRun, onReport, onNavigate }) {
    const P = K();
    const rows = ledgerRows(w);
    if (!rows.length) {
      return P.EmptyState ? (
        <P.EmptyState title="No days yet"
          body={'Each run shows here with its verification: one tick while pending, two once verified. ' + (w.setUp && P.nextRunText ? P.nextRunText(w) : '')}
          primaryAction={w.setUp ? null : { label: 'Set up your worker', onClick: function () { if (onNavigate) onNavigate('chat', { state: 'setup' }); } }} />
      ) : null;
    }
    return (
      <P.Card padding="none" className="v2-ledger">
        {rows.map(function (r) { return <Row key={r.key} row={r} onOpenRun={onOpenRun} onReport={onReport} />; })}
      </P.Card>
    );
  }

  function PastTab({ past }) {
    const P = K();
    if (!past || !past.length) {
      return P.EmptyState ? (
        <P.EmptyState variant="noresults" icon="calendar" title="No past programs"
          body="When this program ends, its days move here. Cash out happens on Earnings." />
      ) : null;
    }
    return (
      <P.Card padding="none" className="v2-ledger">
        {past.map(function (x) {
          return (
            <P.ListRow key={x.id} label={x.title} description={x.range} divider={false}
              trailing={P.StatusTick ? <P.StatusTick status={x.done >= x.target ? 'verified' : 'notcounted'} size={14} label={x.done + ' of ' + x.target + ' days'} /> : null} />
          );
        })}
      </P.Card>
    );
  }

  function Activity(p) {
    const P = K();
    const S = window.V2Screens || {};
    const row = ACTIVITY_STATES.find(function (s) { return s[0] === p.state; }) || ACTIVITY_STATES[1];
    const [own, setOwn] = useState(row[2]);
    const [report, setReport] = useState(null);
    const idBase = useId();
    const tab = p.tab || own;
    const w = p.worker || (P.workerFixtures || {})[row[1]];
    const past = p.past !== undefined ? p.past : (p.state === 'past' ? PAST_PROGRAMS : []);
    const Frame = S.ScreenFrame;
    if (!w || !Frame || !P.ListRow || !P.Tabs) return null;
    const loading = p.state === 'loading';
    function pick(id) { setOwn(id); if (p.onTab) p.onTab(id); }
    function openRun(r) {
      if (p.onOpenRun) { p.onOpenRun(r); return; }
      const t = rowTarget(r);
      if (t && p.onNavigate) p.onNavigate(t[0], t[1]);
    }
    function onReport(r) {
      if (p.onReport) p.onReport(r);
      else setReport(S.reportAbout ? S.reportAbout(r) : {});
    }
    const sheet = report && S.ReportProblemSheet ? (
      <S.ReportProblemSheet open about={report.about} topic={report.topic} email={w.account && w.account.email}
        onClose={function () { setReport(null); }} onSent={function () { setReport(null); }} />
    ) : null;

    let body;
    if (loading) {
      body = (
        <React.Fragment>
          {P.Skeleton ? <div className="v2-home-skel-card"><P.Skeleton shape="line" width="45%" /><P.Skeleton shape="rect" height="var(--v2-rail)" /></div> : null}
          {S.ListSkeleton ? <S.ListSkeleton rows={5} label="Loading your days" /> : null}
        </React.Fragment>
      );
    } else if (p.state === 'error') {
      body = S.LoadError ? <S.LoadError what="your days" onRetry={p.onRetry} /> : null;
    } else {
      body = (
        <React.Fragment>
          {P.ProgramStrip ? <P.ProgramStrip worker={w} /> : null}
          <P.Tabs full idBase={idBase} ariaLabel="Programs" value={tab} onChange={pick}
            tabs={[{ id: 'program', label: 'This program' }, { id: 'past', label: 'Past' }]} />
          <P.TabPanel idBase={idBase} id="program" hidden={tab !== 'program'}>
            {tab === 'program' ? <ProgramTab w={w} onOpenRun={openRun} onReport={onReport} onNavigate={p.onNavigate} /> : null}
          </P.TabPanel>
          <P.TabPanel idBase={idBase} id="past" hidden={tab !== 'past'}>
            {tab === 'past' ? <PastTab past={past} /> : null}
          </P.TabPanel>
        </React.Fragment>
      );
    }
    return (
      <Frame worker={w} tab="activity" loading={loading} compact={p.compact} landmark={p.landmark} frame={p.frame}
        overlays={sheet} onNavigate={p.onNavigate}>
        <div className="v2-screen">
          {P.ScreenHeader ? <P.ScreenHeader title="Activity" /> : null}
          <div className="v2-screen-body" aria-busy={loading ? 'true' : undefined}>{body}</div>
        </div>
      </Frame>
    );
  }

  Object.assign(window.V2Screens = window.V2Screens || {}, { Activity, ACTIVITY_STATES, PAST_PROGRAMS, ledgerRows, rowTarget });
})();
