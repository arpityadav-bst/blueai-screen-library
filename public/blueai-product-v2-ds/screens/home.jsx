/* BlueAI Product V2 Design System: Home, the Today screen (section 57), and the window every
   signed-in core screen sits in. Composed only from window.V2Kit, read at render.

   ScreenFrame {worker, tab, loading, compact, landmark, overlays, onNavigate, frame, children}
     AppFrame + TopBar + BottomNav. The top bar's run chip and credits come from the Worker record
     (topBarProps), so every screen says today's run the same way. tab is the lit nav item; it stays
     the parent tab while a screen is pushed (Chat over Home, Run detail over Activity). frame
     false returns the children alone (the same prop as the account screens' AccountFrame).
     onNavigate(id) receives nav ids (home, activity, settings), menu ids (notifications, account,
     report, sign-out), today (the run chip) and credits.
   topBarProps(worker)  {status, statusLabel, credits} for TopBar.
   Home {worker, state, loading, coaching, compact, landmark, frame, onNavigate, onRun, onRetry,
         onResume, onDismissCoach}
     Greeting (ScreenHeader, name, no emoji), ProgramStrip, a Banner only when the program needs a
     word the card cannot say, WorkerCard, then 'Chat with BlueAI'. state picks a fixture when no
     worker is passed (HOME_STATES); loading draws the worker-home skeleton. The coach mark shows
     once for a partner who has not set up (coachSeen false) under a dim scrim at --v2-z-coach.
   HOME_STATES  [[key, fixture, label, note]] in the guide's order. */
(function () {
  const { useState } = React;
  const K = () => window.V2Kit || {};

  const HOME_STATES = [
    ['new', 'new', 'New (day 0)', 'coach on Run, once'],
    ['returning', 'verified', 'Returning, before today’s run', 'Run now is secondary'],
    ['running', 'running', 'Running', 'the live step'],
    ['waiting', 'waiting', 'Waiting for you', 'deadline and cost first'],
    ['done', 'donePending', 'Done today, pending', 'no second Run'],
    ['failed', 'failed', 'Failed today', 'Try again, by 9 pm'],
    ['paused', 'paused', 'Paused', 'days do not count'],
    ['noCredits', 'noCredits', 'Out of credits', 'when they refresh'],
    ['offline', 'offline', 'Offline', 'what happens to today'],
    ['complete', 'complete', 'Program complete', 'Earnings on the site'],
    ['behind', 'behind', 'Out of reach (banner)', 'the one program banner'],
    ['loading', 'verified', 'Loading', 'worker-home skeleton'],
  ];

  // WorkerCard state -> WorkerStatusChip status (section 30). Out of credits reads as a pause in the
  // chrome; the credits chip beside it carries the empty dot.
  const CHIP = {
    scheduled: 'scheduled', running: 'running', waiting: 'needs-you', done: 'done', failed: 'failed',
    paused: 'paused', offline: 'offline', noCredits: 'paused', complete: 'done',
  };

  function creditsState(c) {
    if (!c) return undefined;
    if (c.left <= 0) return 'empty';
    return c.left < c.runCost ? 'low' : 'full';
  }

  function topBarProps(w) {
    const P = K();
    if (!w || !P.workerState || !P.numbers) return { status: null, statusLabel: null, credits: null };
    const st = P.workerState(w);
    const n = P.numbers(w);
    let label = null;
    if (st === 'scheduled') label = 'Next run ' + ((w.runWindow && w.runWindow.label) || '11 am');
    else if (st === 'done') label = w.today && w.today.end === 'declined' ? 'Done today' : 'Day ' + n.done + ' of ' + n.target;
    else if (st === 'noCredits') label = 'Waiting for credits';
    else if (st === 'complete') label = 'All ' + n.target + ' days';
    return {
      status: CHIP[st] || null,
      statusLabel: label,
      credits: w.credits ? { balance: w.credits.left, state: creditsState(w.credits) } : null,
    };
  }

  function ScreenFrame(p) {
    const P = K();
    if (p.frame === false || !P.AppFrame) return <React.Fragment>{p.children}</React.Fragment>;
    const nav = function (id) { if (p.onNavigate) p.onNavigate(id); };
    const tb = p.loading ? { status: null, statusLabel: null, credits: null } : topBarProps(p.worker);
    const top = P.TopBar ? (
      <P.TopBar signedIn status={tb.status} statusLabel={tb.statusLabel} credits={tb.credits}
        onOpenStatus={function () { nav('today'); }} onOpenCredits={function () { nav('credits'); }} onAction={nav} />
    ) : null;
    const bottom = P.BottomNav ? <P.BottomNav value={p.tab || 'home'} onChange={nav} /> : null;
    return (
      <P.AppFrame compact={p.compact} landmark={p.landmark} overlays={p.overlays} topBar={top} nav={bottom} className={p.className}>
        {p.children}
      </P.AppFrame>
    );
  }

  // The worker home's own skeleton (R36): the same three blocks that will arrive, nothing else.
  function HomeSkeleton() {
    const S = K().Skeleton;
    if (!S) return null;
    return (
      <div className="v2-screen" aria-busy="true">
        <div className="v2-screen-body">
          <span className="v2-sr-only" role="status">Loading your worker</span>
          <div className="v2-home-skel-title"><S shape="title" width="40%" /></div>
          <div className="v2-home-skel-card">
            <S shape="line" width="45%" />
            <S shape="rect" height={8} />
            <S shape="line" width="70%" />
          </div>
          <div className="v2-home-skel-card v2-home-skel-row">
            <S shape="rect" width={40} height={40} />
            <span className="v2-home-skel-lines"><S shape="line" width="50%" /><S shape="line" width="85%" /></span>
            <S shape="rect" width={72} height={36} />
          </div>
        </div>
      </div>
    );
  }

  // The one Home banner: a program fact the worker card cannot say. Proposed copy; no money, since
  // what a day is worth waits on decision D3.
  function programBanner(n) {
    const B = K().Banner;
    if (!B || n.complete || n.outOfReach <= 0) return null;
    return (
      <B tone="info" title={n.target + ' days are out of reach'}>
        {n.done} days done and {n.daysLeft} days left before {n.endsOn}.
      </B>
    );
  }

  function fixtureFor(state) {
    const row = HOME_STATES.find(function (s) { return s[0] === state; }) || HOME_STATES[1];
    return (K().workerFixtures || {})[row[1]];
  }

  function Home(p) {
    const P = K();
    const [seen, setSeen] = useState(false);
    const w = p.worker || fixtureFor(p.state);
    const loading = !!(p.loading || p.state === 'loading');
    if (!w || !P.WorkerCard || !P.numbers) return null;
    const n = P.numbers(w);
    const go = function (id) { return function () { if (p.onNavigate) p.onNavigate(id); }; };
    const coaching = p.coaching != null ? !!p.coaching : (!loading && !w.setUp && !w.coachSeen && !seen);
    function dismiss() { setSeen(true); if (p.onDismissCoach) p.onDismissCoach(); }
    function run() { dismiss(); if (p.onRun) p.onRun(); else go('chat')(); }
    const name = w.account && w.account.first;

    const body = loading ? <HomeSkeleton /> : (
      <div className="v2-screen">
        {P.ScreenHeader ? <P.ScreenHeader title={name ? 'Hi, ' + name : 'Today'} /> : null}
        <div className="v2-screen-body v2-home">
          {P.ProgramStrip ? <P.ProgramStrip worker={w} onOpenActivity={go('activity')} /> : null}
          {programBanner(n)}
          <P.WorkerCard worker={w} coaching={coaching} onDismissCoach={dismiss} onRun={run}
            onOpenToday={go('today')} onReview={go('chat')} onRetry={p.onRetry || go('chat')}
            onResume={p.onResume} onOpenCredits={go('credits')} />
          {P.Link ? <P.Link standalone className="v2-home-chat" onClick={go('chat')}>Chat with BlueAI</P.Link> : null}
        </div>
      </div>
    );
    const scrim = coaching && P.Scrim ? <div className="v2-home-coach-layer"><P.Scrim onClick={dismiss} /></div> : null;
    return (
      <ScreenFrame worker={w} tab="home" loading={loading} compact={p.compact} landmark={p.landmark}
        frame={p.frame} overlays={scrim} onNavigate={p.onNavigate}>
        {body}
      </ScreenFrame>
    );
  }

  Object.assign(window.V2Screens = window.V2Screens || {}, { Home, ScreenFrame, topBarProps, HOME_STATES });
})();
