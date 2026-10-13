/* BlueAI Product V2 Design System: Home, the Today screen (section 57), and the one window every
   signed-in screen sits in. Composed only from window.V2Kit, read at render.

   ScreenFrame {worker, tab, loading, compact, landmark, overlays, onNavigate, frame, openMenu,
                scrollTo, status, statusLabel, credits, nav, className, children}
     AppFrame + TopBar + BottomNav for every signed-in screen (core, account and system states).
     The run chip and credits come from the Worker record (topBarProps), so every screen says
     today's run the same way; status, statusLabel and credits override it (system states; null
     hides). tab is the lit nav item and stays the parent tab while a screen is pushed. nav false
     drops the bottom nav. Activity carries the section 54 badge: what needs the partner.
     Every chrome event goes to onNavigate(id, opts): nav ids (home, activity, settings), menu ids
     (notifications, account, report, sign-out), credits, and the run chip's chipTarget.
     scrollTo moves the content band to a [data-section]; openMenu forces a top-bar menu open
     (guide). frame false returns the children and overlays alone.
   ToastScope {children}, useScreenToast()  a screen that confirms its changes wraps itself in
     ToastScope (V2Kit.ToastHost region={false}) and calls useScreenToast().show({title, tone,
     action}); the window's one live region is AppFrame's ToastRegion, so every toast is announced.
   topBarProps(worker)  {status, statusLabel, credits} for TopBar.
   chipTarget(worker)  [id, opts]: where the run chip and the card's Details open (section 30):
     today's run as its Activity row opens it (Chat while live, Run detail once it has an outcome),
     Settings > Worker while paused, Home's card for every other status.
   HomeSkeleton, ListSkeleton {rows, label}, LoadError {what, onRetry, busy}  the loading and
     load-failed blocks every screen that reads server data uses (section 50).
   Home {worker, state, loading, coaching, compact, landmark, frame, onNavigate, onRun, onRetry,
         onReconnect, onResume, onFix, onDismissCoach}
     Greeting (ScreenHeader, name, no emoji), WorkerCard first (P1), ProgramStrip, a Banner only
     when the program needs a word the card cannot say, then 'Chat with BlueAI'. The coach mark is
     a note under the card: nothing is dimmed or locked. Run opens setup in Chat for a new partner
     and starts today's run otherwise (Run now, Run again); Review job opens the waiting ask; a
     failed day's Try again retries in Chat; offline Try again reconnects in place (onReconnect); a
     blocked run's fix does what its button says (onFix). A period that has ended is section 69's
     full-window state, not a card.
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
    ['failed', 'failed', 'Failed today', 'Try again, by 9 pm'],
    ['paused', 'paused', 'Paused', 'days do not count'],
    ['noCredits', 'noCredits', 'Out of credits', 'when they refresh'],
    ['offline', 'offline', 'Offline', 'Try again reconnects in place'],
    ['complete', 'complete', 'Program complete', 'Earnings on the site'],
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
      if (t.outcome === 'skipped' || t.outcome === 'expired' || t.end === 'declined') return ['not-counted', null];
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
        onOpenStatus={function () { const to = chipTarget(p.worker); nav(to[0], to[1]); }}
        onOpenCredits={function () { nav('credits'); }} onAction={nav} />
    ) : null;
    const count = p.loading ? 0 : needsYou(p.worker);
    const items = P.NAV_ITEMS ? P.NAV_ITEMS.map(function (it) { return it.id === 'activity' ? Object.assign({}, it, { badge: count }) : it; }) : undefined;
    const bottom = p.nav !== false && P.BottomNav ? <P.BottomNav items={items} value={p.tab || 'home'} onChange={nav} /> : null;
    return (
      <P.AppFrame compact={p.compact} landmark={p.landmark} overlays={p.overlays} topBar={top} nav={bottom} className={p.className}>
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
            <S shape="rect" width={40} height={40} />
            <span className="v2-home-skel-lines"><S shape="line" width="50%" /><S shape="line" width="85%" /></span>
            <S shape="rect" width={72} height={36} />
          </div>
          <div className="v2-home-skel-card">
            <S shape="line" width="45%" />
            <S shape="rect" height={8} />
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
    // The fix does what its button says. Open App Player and Get BlueStacks act in place (the
    // host's onFix; here a toast stands in for the launch and the download); Connect YouTube opens
    // Connected apps, where the account is connected.
    function fix(reason) {
      if (p.onFix) p.onFix(reason);
      else if (reason === 'signed-out') toast.show({ tone: 'info', title: 'Opening App Player. Sign in to YouTube there.' });
      else if (reason === 'no-bluestacks') toast.show({ tone: 'info', title: 'BlueStacks is downloading. Open the installer when it’s done.' });
      else go('connected-apps', { app: 'youtube' })();
    }
    const S = window.V2Screens || {};
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
            onOpenToday={go(today[0], today[1])} onReview={go('chat', { state: 'waiting' })} onRetry={retry}
            onResume={p.onResume} onFix={fix} onOpenCredits={go('credits')} />
          {P.ProgramStrip ? <P.ProgramStrip worker={w} receipt={st !== 'done'} onOpenActivity={go('activity')} /> : null}
          {programBanner(n)}
          {P.Link ? <P.Link standalone className="v2-home-chat" onClick={go('chat')}>Chat with BlueAI</P.Link> : null}
        </div>
      </div>
    );
    return (
      <ScreenFrame worker={w} tab="home" loading={loading} compact={p.compact} landmark={p.landmark}
        frame={p.frame} onNavigate={p.onNavigate}>
        {body}
      </ScreenFrame>
    );
  }

  Object.assign(window.V2Screens = window.V2Screens || {}, {
    Home, ScreenFrame, topBarProps, chipTarget, HOME_STATES, HomeSkeleton, ListSkeleton, LoadError, ToastScope, useScreenToast,
  });
})();
