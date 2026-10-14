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
     items  [{id, kind, title, body, time, unread, target, run}] (NOTIFICATIONS is the specimen,
            NOTIFICATION_SAMPLES one row per kind, NotificationRow {item, onOpen} one row); kind ask | expired | done | skipped | nojob |
            failed | verified | rejected | missed | blocked | nocredits | ending | cashout | ended | terms sets
            the glyph and tone (any other kind: neutral info, never a check); target chat | run |
            home | credits | activity | earnings | terms: 'chat' opens the waiting ask, and only
            while the record has a job waiting (otherwise the day's run, or Activity), 'run' opens
            the run the row is about (run {date, outcome, status} is its ledger row, so the row opens
            that day as it stands now, rowTarget, on the stack of the tab you are on), 'earnings'
            opens EARNINGS_URL in the browser, and home, credits, activity and terms go through
            onNavigate (section 32's route table); terms carries docs, the changed documents' names,
            which the TermsSheet names too.
            Once the ask is answered its row says what was chosen and opens that run (actioned):
            'You took the paid job' or 'You skipped the paid job', as expiry does at 9 pm.
     state  empty | unread | read | actioned | expired | unreadTab | loading | error
            (NOTIFICATION_STATES). Mark all read moves focus to the first row it leaves behind.
     What needs the partner is counted on the Activity nav item (ScreenFrame, section 54). */
(function () {
  const { useState, useId, useRef } = React;
  const K = () => window.V2Kit || {};
  const cx = function () { return Array.prototype.filter.call(arguments, Boolean).join(' '); };

  // [key, tab, label, note, Worker fixture for the chrome]
  const NOTIFICATION_STATES = [
    ['empty', 'all', 'Empty', 'before the first run', 'setUp'],
    ['unread', 'all', 'With unread', 'a waiting job first', 'waiting'],
    ['read', 'all', 'All read', 'Mark all read goes away; the ask, answered', 'donePending'],
    ['actioned', 'all', 'Answered job ask', 'the ask turns into what you chose', 'declined'],
    ['expired', 'all', 'Expired job ask', 'the ask turns into its result', 'declined'],
    ['unreadTab', 'unread', 'Unread tab, all read', 'nothing unread', 'donePending'],
    ['loading', 'all', 'Loading', 'the list’s shape', 'verified'],
    ['error', 'all', 'Couldn’t load', 'said in place, with Try again', 'verified'],
  ];

  const ICON = {
    ask: ['bell', 'attention'], expired: ['clock', 'neutral'], done: ['check', 'neutral'],
    verified: ['check-double', 'success'], failed: ['x-circle', 'danger'], nojob: ['info', 'neutral'],
    rejected: ['x-circle', 'danger'], missed: ['clock', 'attention'], blocked: ['alert', 'danger'],
    skipped: ['info', 'neutral'], nocredits: ['credits', 'attention'], ending: ['calendar', 'neutral'], cashout: ['earnings', 'success'],
    ended: ['calendar', 'neutral'], terms: ['info', 'neutral'],
  };
  const ICON_OTHER = ['info', 'neutral'];

  // Proposed copy, consistent with the WorkerCard and the toasts (worker_day_done.jsx:191-204).
  // A row's run is its ledger row as it stands now: an old 'Run done' opens that day, verified.
  const ASK = { id: 'n1', kind: 'ask', title: 'Paid YouTube job waiting for your OK', body: 'Answer by 9 pm or today won’t count.', time: '11:04 am', unread: true, target: 'chat' };
  const EXPIRED = { id: 'n1', kind: 'expired', title: 'Paid job expired', body: 'No answer by 9 pm, so today didn’t count.', time: '9 pm', unread: true, target: 'run', run: { date: 'Today', today: true, outcome: 'expired', status: 'notcounted' } };
  // Actioned: the answered ask says what was chosen and opens that run.
  const TOOK = { id: 'n1', kind: 'done', title: 'You took the paid job', body: 'Day 7 of 20, pending verification.', time: '11:06 am', target: 'run', run: { date: 'Today', today: true, outcome: 'job', status: 'pending' } };
  const SKIPPED = { id: 'n1', kind: 'skipped', title: 'You skipped the paid job', body: 'Today didn’t count toward your 20 days.', time: '11:06 am', target: 'run', run: { date: 'Today', today: true, outcome: 'skipped', status: 'notcounted' } };
  // The documents a terms change names: data, the same names the TermsSheet shows (welcome.jsx).
  const TERMS_DOCS = ['Terms of Use', 'Privacy Policy'];
  const REST = [
    { id: 'n2', kind: 'verified', title: 'Oct 11 run verified', body: 'Day 6 of 20.', time: '7:02 am', unread: true, target: 'run', run: { date: 'Oct 11', status: 'verified' } },
    { id: 'n3', kind: 'done', title: 'Run done', body: 'Day 6 of 20, pending verification.', time: 'Oct 11', target: 'run', run: { date: 'Oct 11', status: 'verified' } },
    { id: 'n4', kind: 'verified', title: 'Oct 10 run verified', body: 'Day 5 of 20.', time: 'Oct 11', target: 'run', run: { date: 'Oct 10', status: 'verified' } },
    { id: 'n5', kind: 'failed', title: 'Job didn’t finish', body: 'App Player closed during the job.', time: 'Oct 10', target: 'run', run: { date: 'Oct 10', status: 'verified' } },
  ];
  const NOTIFICATIONS = [ASK].concat(REST);
  // One row per kind (section 60's Kinds), for the guide's specimens.
  const NOTIFICATION_SAMPLES = [
    ASK, TOOK, SKIPPED, EXPIRED, REST[1],
    { id: 'k-nojob', kind: 'nojob', title: 'No job today', body: 'Your run counts. Day 6 of 20, pending verification.', time: 'Oct 11', target: 'run', run: { date: 'Oct 11', outcome: 'nojob', status: 'pending' } },
    REST[3], REST[0],
    { id: 'k-rejected', kind: 'rejected', title: 'Oct 12 wasn’t counted', body: 'The comment was removed before we checked it.', time: 'Oct 13', target: 'run', run: { date: 'Oct 12', outcome: 'job', status: 'rejected', reason: 'The comment was removed before we checked it.' } },
    { id: 'k-missed', kind: 'missed', title: 'Today’s run didn’t start', body: 'Run it by 9 pm to count today.', time: '11:05 am', unread: true, target: 'home' },
    { id: 'k-blocked', kind: 'blocked', title: 'Today’s run can’t start', body: 'YouTube isn’t connected. Fix it by 9 pm.', time: '11:00 am', unread: true, target: 'home' },
    { id: 'k-nocredits', kind: 'nocredits', title: 'Out of AI credits for today’s run', body: 'They refresh at 5:30 am, so today won’t count.', time: '2:40 pm', unread: true, target: 'credits' },
    { id: 'k-ending', kind: 'ending', title: '3 days left in this program', body: '17 of 20 days done. It ends Nov 1.', time: 'Oct 29', target: 'activity' },
    { id: 'k-cashout', kind: 'cashout', title: 'Cash out is open', body: 'Your balance is $10 or more. Cash out on Earnings.', time: 'Nov 2', unread: true, target: 'earnings' },
    { id: 'k-ended', kind: 'ended', title: 'This program has ended', body: 'You need $10 to cash out.', time: 'Nov 2', unread: true, target: 'earnings' },
    { id: 'k-terms', kind: 'terms', title: TERMS_DOCS.join(' and ') + ' updated', body: 'Review them and accept the updated terms to keep your worker running.', time: 'Oct 14', unread: true, target: 'terms', docs: TERMS_DOCS },
  ];

  function itemsFor(state) {
    if (state === 'empty') return [];
    if (state === 'expired') return [EXPIRED].concat(REST);
    if (state === 'actioned') return [SKIPPED].concat(REST);
    if (state === 'read' || state === 'unreadTab') return [TOOK].concat(REST).map(function (n) { return Object.assign({}, n, { unread: false }); });
    return NOTIFICATIONS;
  }

  // One row: the ListRow mark (section 18) in the kind's glyph and tone; unread is said first.
  function NotificationRow({ item, onOpen }) {
    const L = K().ListRow;
    const n = item;
    const ic = ICON[n.kind] || ICON_OTHER;
    return L ? (
      <L className={cx('v2-notif', n.unread && 'v2-notif--unread')}
        mark={{ icon: ic[0], tone: ic[1], dot: n.unread }} external={n.target === 'earnings'}
        label={<span>{n.unread ? <span className="v2-sr-only">Unread: </span> : null}{n.title}</span>}
        description={n.body} value={n.time} onClick={function () { if (onOpen) onOpen(n); }} />
    ) : null;
  }

  function Notifications(p) {
    const P = K();
    const row = NOTIFICATION_STATES.find(function (s) { return s[0] === p.state; }) || NOTIFICATION_STATES[1];
    const [ownTab, setOwnTab] = useState(row[1]);
    const [read, setRead] = useState({});
    const idBase = useId();
    const box = useRef(null);
    const S = window.V2Screens || {};
    const Frame = S.ScreenFrame;
    const w = p.worker || (P.workerFixtures || {})[row[4]];
    if (P.useSwapFocus) P.useSwapFocus(function () { return box.current && box.current.querySelector('.v2-notif, [role="tab"]'); }, !!read.all);
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
      if (n.target === 'earnings') { window.open(P.EARNINGS_URL, '_blank', 'noopener'); return; }
      if (!p.onNavigate) return;
      // A job ask opens Chat's waiting state only while the record has a job waiting; once answered
      // or expired it opens the day's run (its row), or Activity.
      const stale = n.target === 'chat' && !(w && w.today && w.today.status === 'waiting');
      const to = (n.target === 'run' || stale) && n.run && S.rowTarget ? S.rowTarget(n.run) : null;
      if (to) p.onNavigate(to[0], Object.assign({ tab: p.parentTab || 'home' }, to[1]));
      else if (stale) p.onNavigate('activity');
      else p.onNavigate(n.target, n.target === 'chat' ? { state: 'waiting' } : (n.target === 'terms' ? { docs: n.docs } : undefined));
    }
    function markAll() { setRead({ all: true }); if (p.onMarkAllRead) p.onMarkAllRead(); }

    const empty = !P.EmptyState ? null : (tab === 'unread' && all.length
      ? <P.EmptyState variant="noresults" icon="check" title="Nothing unread" body="You’ve seen everything your worker sent." />
      : <P.EmptyState icon="bell" title="No notifications yet" body="Your worker tells you here when a run is done, a job needs your OK, a day is verified or lost, and when cash out opens." />);

    const failed = row[0] === 'error';
    const lists = ['all', 'unread'].map(function (id) {
      return (
        <P.TabPanel key={id} idBase={idBase} id={id} hidden={tab !== id}>
          {tab !== id ? null : (list.length ? (
            <P.Card padding="none" className="v2-notif-list">
              {list.map(function (n) { return <NotificationRow key={n.id} item={n} onOpen={open} />; })}
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
      <Frame worker={w} tab={p.parentTab || 'home'} compact={p.compact}
        landmark={p.landmark} frame={p.frame} onNavigate={p.onNavigate}>
        <div className="v2-screen">
          {P.ScreenHeader ? (
            <P.ScreenHeader title="Notifications" onBack={p.onBack || go('home')}
              trailing={!loading && !failed && unread.length && P.Button ? <P.Button variant="quiet" size="md" onClick={markAll}>Mark all read</P.Button> : null} />
          ) : null}
          <div className="v2-screen-body" ref={box} aria-busy={loading ? 'true' : undefined}>{body}</div>
        </div>
      </Frame>
    );
  }

  Object.assign(window.V2Screens = window.V2Screens || {}, { Notifications, NotificationRow, NOTIFICATION_STATES, NOTIFICATIONS, NOTIFICATION_SAMPLES });
})();
