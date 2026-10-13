/* BlueAI Product V2 Design System: Activity, the run and verification ledger (section 58, New).
   Replaces V2's Jobs tab ('Coming Soon', jobs.jsx:140) and Schedule (sample tasks): the one place
   that lists which days counted. Composed only from window.V2Kit, read at render.

   Activity {worker, state, tab, past, onTab, onOpenRun(row), onReport(row), onNavigate,
             compact, landmark, frame}
     ScreenHeader 'Activity', ProgramStrip, Tabs (This program / Past), then one ledger row per day,
     newest first: date column, result, and the verification tick (or a Badge while today is live).
     A rejected day carries its reason and a Report a problem action under the row (a control is
     never nested in a nav row). Rows with a run open Run detail; a day with no run is static.
     state picks the fixture and tab (ACTIVITY_STATES) when worker / tab are not passed.
     past [{id, title, range, done, target}] earlier programs (PAST_PROGRAMS is the specimen).
   ledgerRows(worker)  the rows, derived from the record: today's live run first, then the ledger. */
(function () {
  const { useState, useId } = React;
  const K = () => window.V2Kit || {};

  const ACTIVITY_STATES = [
    ['empty', 'setUp', 'program', 'Empty (before day 1)', 'the next run, said once'],
    ['mid', 'donePending', 'program', 'Mid-program', 'today pending, the rest verified'],
    ['today', 'waiting', 'program', 'Today in progress', 'a Badge until the run settles'],
    ['rejected', 'rejected', 'program', 'Rejected day', 'reason + Report a problem'],
    ['complete', 'complete', 'program', 'Program complete', 'every day verified'],
    ['past', 'verified', 'past', 'Past tab', 'after a second program'],
    ['pastEmpty', 'verified', 'past', 'Past tab, first program', 'nothing to show yet'],
  ];
  // Proposed specimen: what Past holds once a partner has finished a program.
  const PAST_PROGRAMS = [{ id: 'sep', title: 'September program', range: 'Sep 2 to Sep 30', done: 20, target: 20 }];

  const RESULT = { verified: 'Paid job done', pending: 'Paid job done', late: 'Paid job done', rejected: 'Paid job done', skipped: 'Job skipped', missed: 'No run' };
  const TICK = { verified: ['verified', 'Verified'], pending: ['pending', 'Pending'], late: ['late', 'Still checking'], rejected: ['rejected', 'Not counted'], skipped: ['notcounted', 'Not counted'], missed: ['notcounted', 'Not counted'] };
  // Today, while the run is live: a Badge says the run's state (it is not a verification state yet).
  const LIVE = {
    running: ['Run in progress', null, 'info', 'Running'],
    waiting: ['Paid job waiting', 'Answer by 9 pm or today won’t count.', 'attention', 'Needs you'],
    failed: ['Job didn’t finish', 'Try again by 9 pm to count the day.', 'danger', 'Not counted yet'],
  };

  function nextDate(d) {
    const m = /^([A-Za-z]+) (\d+)$/.exec(d || '');
    return m ? m[1] + ' ' + (Number(m[2]) + 1) : 'Today';
  }

  function ledgerRows(w) {
    const list = (w && w.ledger) || [];
    const t = (w && w.today) || {};
    const rows = list.map(function (r, i) { return Object.assign({ key: r.date + i }, r); });
    const last = rows[rows.length - 1];
    if (t.status === 'done' && last) last.date = 'Today';
    else if (LIVE[t.status]) rows.push({ key: 'today', date: 'Today', live: t.status, from: last ? nextDate(last.date) : null });
    return rows.reverse();
  }

  function Row({ row, onOpenRun, onReport }) {
    const P = K();
    const live = row.live ? LIVE[row.live] : null;
    const tick = TICK[row.status] || TICK.pending;
    const label = (
      <span className="v2-ledger-line">
        <span className="v2-ledger-date">{row.date}</span>
        <span className="v2-ledger-result">{live ? live[0] : (row.result || RESULT[row.status] || 'Run')}</span>
      </span>
    );
    const desc = live ? live[1] : (row.status === 'rejected' ? row.reason : null);
    const hasRun = row.status !== 'missed';
    const trailing = live
      ? (P.Badge ? <P.Badge tone={live[2]} busy={row.live === 'running'}>{live[3]}</P.Badge> : null)
      : (P.StatusTick ? <P.StatusTick status={tick[0]} size={14} label={tick[1]} /> : null);
    return (
      <div className="v2-ledger-item">
        <P.ListRow className="v2-ledger-row" label={label} description={desc} trailing={trailing}
          onClick={hasRun ? function () { if (onOpenRun) onOpenRun(row); } : undefined} divider={false} />
        {row.status === 'rejected' && P.Link ? (
          <div className="v2-ledger-act">
            <P.Link standalone onClick={function () { if (onReport) onReport(row); }}>Report a problem</P.Link>
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
          primaryAction={w.setUp ? null : { label: 'Set up your worker', onClick: function () { if (onNavigate) onNavigate('home'); } }} />
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
    const row = ACTIVITY_STATES.find(function (s) { return s[0] === p.state; }) || ACTIVITY_STATES[1];
    const [own, setOwn] = useState(row[2]);
    const idBase = useId();
    const tab = p.tab || own;
    const w = p.worker || (P.workerFixtures || {})[row[1]];
    const past = p.past !== undefined ? p.past : (p.state === 'past' ? PAST_PROGRAMS : []);
    const Frame = (window.V2Screens || {}).ScreenFrame;
    if (!w || !Frame || !P.ListRow || !P.Tabs) return null;
    function pick(id) { setOwn(id); if (p.onTab) p.onTab(id); }
    const openRun = p.onOpenRun || function () { if (p.onNavigate) p.onNavigate('run'); };
    const report = p.onReport || function () { if (p.onNavigate) p.onNavigate('report'); };
    return (
      <Frame worker={w} tab="activity" compact={p.compact} landmark={p.landmark} frame={p.frame} onNavigate={p.onNavigate}>
        <div className="v2-screen">
          {P.ScreenHeader ? <P.ScreenHeader title="Activity" /> : null}
          <div className="v2-screen-body">
            {P.ProgramStrip ? <P.ProgramStrip worker={w} /> : null}
            <P.Tabs full idBase={idBase} ariaLabel="Programs" value={tab} onChange={pick}
              tabs={[{ id: 'program', label: 'This program' }, { id: 'past', label: 'Past' }]} />
            <P.TabPanel idBase={idBase} id="program" hidden={tab !== 'program'}>
              {tab === 'program' ? <ProgramTab w={w} onOpenRun={openRun} onReport={report} onNavigate={p.onNavigate} /> : null}
            </P.TabPanel>
            <P.TabPanel idBase={idBase} id="past" hidden={tab !== 'past'}>
              {tab === 'past' ? <PastTab past={past} /> : null}
            </P.TabPanel>
          </div>
        </div>
      </Frame>
    );
  }

  Object.assign(window.V2Screens = window.V2Screens || {}, { Activity, ACTIVITY_STATES, PAST_PROGRAMS, ledgerRows });
})();
