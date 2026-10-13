/* BlueAI Product V2 Design System: Notifications, the in-app record (section 60, New). Everything
   the worker told the partner, kept after the Windows toast is gone (V2's toast closes after 8 s
   and leaves nothing, desktop_toast.jsx:12). Pushed from the top bar's More menu, so the lit tab
   stays where the partner was. Composed only from window.V2Kit.

   Notifications {items, state, tab, onOpen(item), onMarkAllRead, onBack, onRetry, onNavigate,
                  worker, parentTab, compact, landmark, frame}
     ScreenHeader 'Notifications' with Back and 'Mark all read' (only while something is unread),
     Tabs All / Unread with counts, one ListRow per notification (icon, title, one line, time;
     unread carries a dot and is said first to screen readers), EmptyState when a tab has none.
     Rows are written to last: the toast's 'Today’s run is done.' is right for 8 seconds on the
     desktop and wrong in a list tomorrow, so a row keeps the event and the day count instead.
     items  [{id, kind, title, body, time, unread, target, run}] (NOTIFICATIONS is the specimen);
            kind ask | expired | done | verified | failed | nojob | rejected sets the icon; target
            'chat' opens the waiting ask, 'run' opens the run the row is about: run {date, outcome,
            status} is its ledger row, so the row opens that day as it stands now (rowTarget).
     state  empty | unread | read | expired | unreadTab | loading | error (NOTIFICATION_STATES).
     What needs the partner is counted on the Activity nav item (ScreenFrame, section 54). */
(function () {
  const { useState, useId } = React;
  const K = () => window.V2Kit || {};
  const cx = function () { return Array.prototype.filter.call(arguments, Boolean).join(' '); };

  // [key, tab, label, note, Worker fixture for the chrome]
  const NOTIFICATION_STATES = [
    ['empty', 'all', 'Empty', 'before the first run', 'setUp'],
    ['unread', 'all', 'With unread', 'a waiting job first', 'waiting'],
    ['read', 'all', 'All read', 'Mark all read goes away', 'verified'],
    ['expired', 'all', 'Expired job ask', 'the ask turns into its result', 'declined'],
    ['unreadTab', 'unread', 'Unread tab, all read', 'nothing unread', 'verified'],
    ['loading', 'all', 'Loading', 'the list’s shape', 'verified'],
    ['error', 'all', 'Couldn’t load', 'said in place, with Try again', 'verified'],
  ];

  const ICON = {
    ask: ['bell', 'attention'], expired: ['clock', 'neutral'], done: ['check', 'neutral'],
    verified: ['check-double', 'success'], failed: ['x-circle', 'danger'], nojob: ['info', 'neutral'],
    rejected: ['x-circle', 'danger'],
  };

  // Proposed copy, consistent with the WorkerCard and the toasts (worker_day_done.jsx:191-204).
  // A row's run is its ledger row as it stands now: an old 'Run done' opens that day, verified.
  const ASK = { id: 'n1', kind: 'ask', title: 'Paid YouTube job waiting for your OK', body: 'Answer by 9 pm or today won’t count.', time: '11:04 am', unread: true, target: 'chat' };
  const EXPIRED = { id: 'n1', kind: 'expired', title: 'Paid job expired', body: 'No answer by 9 pm, so today didn’t count.', time: '9 pm', unread: true, target: 'run', run: { date: 'Today', today: true, outcome: 'expired', status: 'notcounted' } };
  const REST = [
    { id: 'n2', kind: 'verified', title: 'Oct 11 run verified', body: 'Day 6 of 20.', time: '7:02 am', unread: true, target: 'run', run: { date: 'Oct 11', status: 'verified' } },
    { id: 'n3', kind: 'done', title: 'Run done', body: 'Day 6 of 20, pending verification.', time: 'Oct 11', target: 'run', run: { date: 'Oct 11', status: 'verified' } },
    { id: 'n4', kind: 'verified', title: 'Oct 10 run verified', body: 'Day 5 of 20.', time: 'Oct 11', target: 'run', run: { date: 'Oct 10', status: 'verified' } },
    { id: 'n5', kind: 'failed', title: 'Job didn’t finish', body: 'App Player closed during the job.', time: 'Oct 10', target: 'run', run: { date: 'Oct 10', status: 'verified' } },
  ];
  const NOTIFICATIONS = [ASK].concat(REST);

  function itemsFor(state) {
    if (state === 'empty') return [];
    if (state === 'expired') return [EXPIRED].concat(REST);
    if (state === 'read' || state === 'unreadTab') return NOTIFICATIONS.map(function (n) { return Object.assign({}, n, { unread: false }); });
    return NOTIFICATIONS;
  }

  function Lead({ kind, unread }) {
    const I = K().Icon;
    const ic = ICON[kind] || ICON.done;
    return (
      <span className={cx('v2-notif-icon', 'v2-notif-icon--' + ic[1])}>
        {I ? <I name={ic[0]} size={16} /> : null}
        {unread ? <span className="v2-notif-dot" /> : null}
      </span>
    );
  }

  function Notifications(p) {
    const P = K();
    const row = NOTIFICATION_STATES.find(function (s) { return s[0] === p.state; }) || NOTIFICATION_STATES[1];
    const [ownTab, setOwnTab] = useState(row[1]);
    const [read, setRead] = useState({});
    const idBase = useId();
    const S = window.V2Screens || {};
    const Frame = S.ScreenFrame;
    if (!Frame || !P.ListRow || !P.Tabs) return null;
    const loading = row[0] === 'loading';
    const tab = p.tab || ownTab;
    const all = (p.items || itemsFor(row[0])).map(function (n) {
      return read[n.id] || read.all ? Object.assign({}, n, { unread: false }) : n;
    });
    const unread = all.filter(function (n) { return n.unread; });
    const list = tab === 'unread' ? unread : all;
    const go = function (id) { return function () { if (p.onNavigate) p.onNavigate(id); }; };
    function open(n) {
      setRead(Object.assign({}, read, { [n.id]: true }));
      if (p.onOpen) { p.onOpen(n); return; }
      if (!p.onNavigate) return;
      const to = n.target === 'run' && n.run && S.rowTarget ? S.rowTarget(n.run) : null;
      if (to) p.onNavigate(to[0], to[1]);
      else p.onNavigate(n.target, n.target === 'chat' ? { state: 'waiting' } : undefined);
    }
    function markAll() { setRead({ all: true }); if (p.onMarkAllRead) p.onMarkAllRead(); }

    const empty = !P.EmptyState ? null : (tab === 'unread' && all.length
      ? <P.EmptyState variant="noresults" icon="check" title="Nothing unread" body="You’ve seen everything your worker sent." />
      : <P.EmptyState icon="bell" title="No notifications yet" body="Your worker tells you here when a run is done, a job needs your OK, or a day is verified." />);

    const failed = row[0] === 'error';
    const lists = ['all', 'unread'].map(function (id) {
      return (
        <P.TabPanel key={id} idBase={idBase} id={id} hidden={tab !== id}>
          {tab !== id ? null : (list.length ? (
            <P.Card padding="none" className="v2-notif-list">
              {list.map(function (n) {
                return (
                  <P.ListRow key={n.id} className={cx('v2-notif', n.unread && 'v2-notif--unread')}
                    leading={<Lead kind={n.kind} unread={n.unread} />}
                    label={<span>{n.unread ? <span className="v2-sr-only">Unread: </span> : null}{n.title}</span>}
                    description={n.body} value={n.time} onClick={function () { open(n); }} />
                );
              })}
            </P.Card>
          ) : empty)}
        </P.TabPanel>
      );
    });
    let body;
    if (loading) body = S.ListSkeleton ? <S.ListSkeleton rows={5} label="Loading notifications" /> : null;
    else if (failed) body = S.LoadError ? <S.LoadError what="your notifications" onRetry={p.onRetry} /> : null;
    else {
      body = (
        <React.Fragment>
          <P.Tabs full idBase={idBase} ariaLabel="Show" value={tab} onChange={setOwnTab}
            tabs={[{ id: 'all', label: 'All', count: all.length }, { id: 'unread', label: 'Unread', count: unread.length }]} />
          {lists}
        </React.Fragment>
      );
    }

    return (
      <Frame worker={p.worker || (P.workerFixtures || {})[row[4]]} tab={p.parentTab || 'home'} compact={p.compact}
        landmark={p.landmark} frame={p.frame} onNavigate={p.onNavigate}>
        <div className="v2-screen">
          {P.ScreenHeader ? (
            <P.ScreenHeader title="Notifications" onBack={p.onBack || go('home')}
              trailing={!loading && !failed && unread.length && P.Button ? <P.Button variant="quiet" size="md" onClick={markAll}>Mark all read</P.Button> : null} />
          ) : null}
          <div className="v2-screen-body" aria-busy={loading ? 'true' : undefined}>{body}</div>
        </div>
      </Frame>
    );
  }

  Object.assign(window.V2Screens = window.V2Screens || {}, { Notifications, NOTIFICATION_STATES, NOTIFICATIONS });
})();
