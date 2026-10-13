/* BlueAI Product V2 Design System: Home, the Today screen (section 57), and the one window every
   signed-in screen sits in. Composed only from window.V2Kit, read at render.

   ScreenFrame {worker, tab, loading, compact, landmark, overlays, onNavigate, frame, openMenu,
                scrollTo, status, statusLabel, credits, nav, offlineBanner, onReconnect, className, children}
     AppFrame + TopBar + BottomNav for every signed-in screen. The run chip and credits come from
     the Worker record (topBarProps), so every screen says today's run the same way; status,
     statusLabel and credits override it (null hides). tab is the lit nav item and stays the parent
     tab while a screen is pushed; nav false drops the bottom nav; Activity carries the section 54
     badge. While worker.online is false the offline Banner sits pinned under the top bar (section
     51; Try again calls onReconnect); offlineBanner false drops it (Home: the card says it). Every
     chrome event goes to onNavigate(id, opts): nav ids, menu ids (notifications, account, report,
     sign-out), credits and chipTarget. scrollTo moves the content band to a [data-section];
     openMenu forces a top-bar menu open (guide); frame false returns children and overlays alone.
   ToastScope {children}, useScreenToast()  a screen that confirms its changes wraps itself in
     ToastScope and calls useScreenToast().show({title, tone, action}); AppFrame's ToastRegion is
     the window's one live region, so every toast is announced.
   topBarProps(worker)  {status, statusLabel, credits}. chipTarget(worker)  [id, opts], section 30:
     today's run as its Activity row opens it, Settings > Worker while paused, else Home's card.
     The chip and Home's Details pass {tab}: Run detail goes on the stack of the tab it came from.
   HomeSkeleton, ListSkeleton {rows, label}, LoadError {what, onRetry, busy}  section 50's blocks.
   Home {worker, state, loading, coaching, compact, landmark, frame, onNavigate, onRun, onRetry,
         onReconnect, onResume, onFix, onDismissCoach}  without onResume, Resume confirms with a toast.
     Greeting, WorkerCard first (P1), ProgramStrip, a Banner only when the program needs a word the
     card cannot say, then 'Chat with BlueAI'. The coach mark is a note under the card. Run opens
     setup in Chat for a new partner, else starts today's run; Review job opens the waiting ask;
     failed Try again retries in Chat; offline Try again reconnects (onReconnect); a blocked run's
     fix does what its button says (onFix). An ended period is section 69's full-window state.
   HOME_STATES  [[key, fixture, label, note]] in the guide's order. */
(function () {
  const { useState, useEffect, useRef } = React;
  const K = () => window.V2Kit || {};

  const HOME_STATES = [
    ['new', 'new', 'New (day 0)', 'coach on Run, once; Run opens setup'],
    ['returning', 'verified', 'Returning, before today’s run', 'Run now is secondary'],
    ['running', 'running', 'Running', 'the live step'],
    ['waiting', 'waiting', 'Waiting for you', 'deadline and cost first'],
    ['done', 'donePending', 'Done today, pending', 'no second Run'],
    ['nojob', 'nojob', 'Done, no job (counts)', 'the day still counts'],
    ['skipped', 'declined', 'Skipped (Not now)', 'today doesn’t count'],
    ['day20', 'day20', 'Day 20 done', 'the last day, pending'],
    ['failed', 'failed', 'Failed today', 'Try again, by 9 pm'],
    ['stopped', 'stopped', 'Stopped', 'Run again, by 9 pm'],
    ['missed', 'missed', 'Didn’t start', 'PC off or asleep at 11 am; Run now by 9 pm, never late on its own'],
    ['blocked', 'blocked', 'Can’t run', 'the card’s one fix (onFix), by 9 pm'],
    ['paused', 'paused', 'Paused', 'days do not count'],
    ['noCredits', 'noCredits', 'Out of credits', 'when they refresh'],
    ['offline', 'offline', 'Offline', 'Try again reconnects in place'],
    ['complete', 'complete', 'Program complete', 'Earnings on the site'],
    ['ended', 'ended', 'Period ended', 'section 69’s full-window state, not a card'],
    ['behind', 'behind', 'Out of reach (banner)', 'the one program banner'],
    ['loading', 'verified', 'Loading', 'worker-home skeleton'],
  ];

  // WorkerCard state -> WorkerStatusChip status (section 30, RUN_STATUS). Green means reached:
  // only 'verified' (a verified day, the complete program). A done day still pending keeps the
  // blue ring, a skipped one says it does not count; the kit's words fill any null label.
  const CHIP = {
    scheduled: 'scheduled', running: 'running', waiting: 'needs-you', failed: 'failed', stopped: 'stopped',
    missed: 'missed', blocked: 'blocked', noCredits: 'no-credits', paused: 'paused', offline: 'offline', ended: 'ended',
  };
  // What today needs from the partner before it can count (section 54's Activity count).
  const NEEDS = { waiting: 1, failed: 1, stopped: 1, missed: 1, blocked: 1 };

  // The chip's run time, from the saved run window (the same kinds as nextRunText).
  function runLabel(w) {
    const r = w.runWindow || {};
    if (r.kind === 'window') return 'Next run ' + String(r.label || '9 am and 8 pm').replace(' and ', ' to ');
    if (r.kind === 'any') return 'Runs later today';
    return 'Next run ' + (r.label || (w.today && w.today.nextRunAt) || '11 am');
  }

  function chip(w, st, n) {
    const t = w.today || {};
    const P = K();
    if (st === 'scheduled') return ['scheduled', runLabel(w)];
    // Out of credits waits for the refill only when it lands before 9 pm; after it, today is lost.
    if (st === 'noCredits' && P.creditsDay && P.creditsDay(w) === 'stopped') return ['not-counted', null];
    if (st === 'done') {
      if (t.outcome === 'skipped' || t.outcome === 'expired') return ['not-counted', null];
      return [n.last && n.last.status === 'verified' ? 'verified' : 'pending', 'Day ' + n.done + ' of ' + n.target];
    }
    if (st === 'complete') return ['verified', 'All ' + n.target + ' days done'];
    return [CHIP[st] || null, null];
  }

  // The credits chip warns only while today's run still needs credits (CreditsMeter's runDone rule).
  function creditsState(w) {
    const c = w.credits;
    if ((w.today || {}).status === 'done') return 'full';
    if (c.left <= 0) return 'empty';
    return c.left < c.runCost ? 'low' : 'full';
  }

  function topBarProps(w) {
    const P = K();
    if (!w || !P.workerState || !P.numbers) return { status: null, statusLabel: null, credits: null };
    const c = chip(w, P.workerState(w), P.numbers(w));
    return {
      status: c[0],
      statusLabel: c[1],
      credits: w.credits ? { balance: w.credits.left, state: creditsState(w) } : null,
    };
  }

  // Section 30's 'Opens' column. Running, waiting, failed and done open today's run as its Activity
  // row does (rowTarget, screens/activity.jsx); paused opens Settings > Worker; every other status
  // opens Home, where the card says what to do and holds the action (Run again, Run now, the fix).
  const AS_ROW = { running: 1, waiting: 1, failed: 1, done: 1 };
  function chipTarget(w) {
    const P = K();
    const S = window.V2Screens || {};
    const st = w && P.workerState ? P.workerState(w) : null;
    if (st === 'paused') return ['worker-settings'];
    if (AS_ROW[st] && S.ledgerRows && S.rowTarget) {
      const today = S.ledgerRows(w).find(function (r) { return r.today; });
      const to = today && S.rowTarget(today);
      if (to) return to;
    }
    return ['home'];
  }

  // Section 54's count on Activity: a waiting job, a failed run, a day not counted. Never on Home.
  function needsYou(w) {
    const P = K();
    if (!w || !P.workerState || !P.numbers) return 0;
    return (NEEDS[P.workerState(w)] || 0) + (P.numbers(w).latestRejected ? 1 : 0);
  }

  function ScreenFrame(p) {
    const P = K();
    const anchor = useRef(null);
    useEffect(function () {
      const a = anchor.current;
      const band = a && a.closest('.v2-frame-content');
      const el = band && p.scrollTo && band.querySelector('[data-section="' + p.scrollTo + '"]');
      if (el) band.scrollTop += el.getBoundingClientRect().top - band.getBoundingClientRect().top - 12;
    }, [p.scrollTo]);
    if (p.frame === false || !P.AppFrame) return <React.Fragment>{p.children}{p.overlays || null}</React.Fragment>;
    const nav = function (id, opts) { if (p.onNavigate) p.onNavigate(id, opts); };
    const tb = p.loading ? { status: null, statusLabel: null, credits: null } : topBarProps(p.worker);
    const pick = function (key) { return p[key] !== undefined ? p[key] : tb[key]; };
    const top = P.TopBar ? (
      <P.TopBar signedIn status={pick('status')} statusLabel={pick('statusLabel')} credits={pick('credits')} openMenu={p.openMenu}
        onOpenStatus={function () { const to = chipTarget(p.worker); nav(to[0], Object.assign({ tab: p.tab || 'home' }, to[1])); }}
        onOpenCredits={function () { nav('credits'); }} onAction={nav} />
    ) : null;
    const count = p.loading ? 0 : needsYou(p.worker);
    const items = P.NAV_ITEMS ? P.NAV_ITEMS.map(function (it) { return it.id === 'activity' ? Object.assign({}, it, { badge: count }) : it; }) : undefined;
    const offline = p.offlineBanner !== false && !p.loading && p.worker && p.worker.online === false && P.Banner ? <div className="v2-frame-condition"><P.Banner tone="offline" title="You’re offline" action={p.onReconnect ? { label: 'Try again', onClick: p.onReconnect } : undefined}>Today’s run starts when you’re back online.</P.Banner></div> : null;
    const bottom = p.nav !== false && P.BottomNav ? <P.BottomNav items={items} value={p.tab || 'home'} onChange={nav} /> : null;
    return (
      <P.AppFrame compact={p.compact} landmark={p.landmark} overlays={p.overlays} topBar={offline ? <React.Fragment>{top}{offline}</React.Fragment> : top} nav={bottom} className={p.className}>
        {p.scrollTo ? <span ref={anchor} hidden /> : null}
        {p.children}
      </P.AppFrame>
    );
  }

  // One toast host per screen, drawn by AppFrame's ToastRegion (kit/shell.jsx, section 24).
  const NO_TOAST = { show: function () { return 0; }, update: function () {}, dismiss: function () {} };
  function ToastScope({ children }) {
    const H = K().ToastHost;
    return H ? <H region={false}>{children}</H> : <React.Fragment>{children}</React.Fragment>;
  }
  function useScreenToast() { return (K().useToast || function () { return NO_TOAST; })(); }

  // The worker home's own skeleton (R36): the same three blocks that will arrive, in their order.
  function HomeSkeleton() {
    const S = K().Skeleton;
    if (!S) return null;
    return (
      <div className="v2-screen" aria-busy="true">
        <div className="v2-screen-body">
          <span className="v2-sr-only" role="status">Loading your worker</span>
          <div className="v2-home-skel-title"><S shape="title" width="40%" /></div>
          <div className="v2-home-skel-card v2-home-skel-row">
            <S shape="rect" width="var(--v2-mark-lg)" height="var(--v2-mark-lg)" />
            <span className="v2-home-skel-lines"><S shape="line" width="50%" /><S shape="line" width="85%" /></span>
            <S shape="rect" width="calc(var(--v2-control-md) * 2)" height="var(--v2-control-md)" />
          </div>
          <div className="v2-home-skel-card">
            <S shape="line" width="45%" />
            <S shape="rect" height="var(--v2-rail)" />
            <S shape="line" width="70%" />
          </div>
        </div>
      </div>
    );
  }

  // A list that has not arrived: the rows' shape (a short lead, a line, a trailing mark).
  function ListSkeleton({ rows, label }) {
    const S = K().Skeleton;
    if (!S) return null;
    const list = [];
    for (let i = 0; i < (rows || 4); i++) {
      list.push(
        <div className="v2-skel-list-row" key={i}>
          <S shape="line" width={56} />
          <span className="v2-home-skel-lines"><S shape="line" width={i % 2 ? '55%' : '70%'} /></span>
          <S shape="circle" width={14} />
        </div>
      );
    }
    return (
      <div className="v2-skel-list" aria-busy="true">
        <span className="v2-sr-only" role="status">{label || 'Loading'}</span>
        {list}
      </div>
    );
  }

  // A section that failed to load says so in its own place; the chrome and the rest stay. The
  // words never blame the partner's connection: the cause may be the service (section 51).
  function LoadError({ what, onRetry, busy }) {
    const E = K().EmptyState;
    return E ? (
      <E variant="error" title={'Couldn’t load ' + (what || 'this')}
        body="Nothing is lost: your runs and days are not affected. Try again in a moment."
        primaryAction={{ label: 'Try again', onClick: onRetry, loading: !!busy }} />
    ) : null;
  }

  // The one Home banner: how many days can still be reached, which the card cannot say. Title
  // only, proposed copy: the done count and the end date are on the ProgramStrip, and what a
  // remaining day earns waits on D3, so nothing here depends on the money model.
  function programBanner(n) {
    const B = K().Banner;
    if (!B || n.complete || n.outOfReach <= 0) return null;
    return <B tone="info" title={'You can still reach ' + (n.target - n.outOfReach) + ' of ' + n.target + ' days'} />;
  }

  function fixtureFor(state) {
    const row = HOME_STATES.find(function (s) { return s[0] === state; }) || HOME_STATES[1];
    return (K().workerFixtures || {})[row[1]];
  }

  function Home(p) { return <ToastScope><HomeScreen {...p} /></ToastScope>; }

  function HomeScreen(p) {
    const P = K();
    const [seen, setSeen] = useState(false);
    const toast = useScreenToast();
    const S = window.V2Screens || {};
    const w = p.worker || fixtureFor(p.state);
    const loading = !!(p.loading || p.state === 'loading');
    if (!w || !P.WorkerCard || !P.numbers || !P.workerState) return null;
    const n = P.numbers(w);
    const st = P.workerState(w);
    const go = function (id, opts) { return function () { if (p.onNavigate) p.onNavigate(id, opts); }; };
    const coaching = p.coaching != null ? !!p.coaching : (!loading && !w.setUp && !w.coachSeen && !seen);
    function dismiss() { setSeen(true); if (p.onDismissCoach) p.onDismissCoach(); }
    function run() { dismiss(); if (p.onRun) p.onRun(); else go('chat', { state: st === 'setup' ? 'setup' : 'running' })(); }
    function retry() {
      if (st === 'stopped') { run(); return; }
      if (st !== 'offline') { (p.onRetry || go('chat', { state: 'retrying' }))(); return; }
      if (p.onReconnect) p.onReconnect();
      else toast.show({ tone: 'info', title: 'Still offline. BlueAI keeps trying on its own.' });
    }
    // The fix does what its button says, the same way everywhere (fixBlocked, connected-apps.jsx).
    function fix(reason) { if (S.fixBlocked) S.fixBlocked(reason, p.onFix, toast, function (id, o) { go(id, o)(); }); }
    function resume() { if (p.onResume) p.onResume(); else toast.show({ title: 'Daily runs are back on.' }); }
    if (!loading && st === 'ended' && S.SystemStates) {
      return <S.SystemStates state="period-ended" worker={w} compact={p.compact} landmark={p.landmark} onNavigate={p.onNavigate} />;
    }
    const name = w.account && w.account.first;
    const today = chipTarget(w);

    const body = loading ? <HomeSkeleton /> : (
      <div className="v2-screen">
        {P.ScreenHeader ? <P.ScreenHeader title={name ? 'Hi, ' + name : 'Today'} /> : null}
        <div className="v2-screen-body v2-home">
          <P.WorkerCard worker={w} coaching={coaching} onDismissCoach={dismiss} onRun={run}
            onOpenToday={go(today[0], Object.assign({ tab: 'home' }, today[1]))} onReview={go('chat', { state: 'waiting' })} onRetry={retry}
            onResume={resume} onFix={fix} onOpenCredits={go('credits')} />
          {P.ProgramStrip ? <P.ProgramStrip worker={w} receipt={st !== 'done'} onOpenActivity={go('activity')} /> : null}
          {programBanner(n)}
          {P.Link ? <P.Link standalone className="v2-home-chat" onClick={go('chat')}>Chat with BlueAI</P.Link> : null}
        </div>
      </div>
    );
    return (
      <ScreenFrame worker={w} tab="home" loading={loading} compact={p.compact} landmark={p.landmark}
        frame={p.frame} onNavigate={p.onNavigate} offlineBanner={false}>
        {body}
      </ScreenFrame>
    );
  }

  Object.assign(window.V2Screens = window.V2Screens || {}, {
    Home, ScreenFrame, topBarProps, chipTarget, HOME_STATES, HomeSkeleton, ListSkeleton, LoadError, ToastScope, useScreenToast,
  });
})();
