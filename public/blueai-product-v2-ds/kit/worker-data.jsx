/* BlueAI Product V2 Design System: the Worker record (section 41).
   One plain-data shape every worker surface reads: WorkerCard, ProgramStrip, DayBar, DayDone,
   JobPreviewCard, ModeRows, the RunCard, Home and Activity. V2 keeps this state in a component's
   local state, three module globals and constants (worker_flow.jsx:34-37, agent_permissions.jsx:60,
   worker_day_done.jsx:38-39), so the day count goes backwards overnight and the next run time is
   hard-coded. Here it is one record per partner, and the numbers are derived, never stored.

   Exposes on window.V2Kit:
     workerFixtures     { key: record } one record per Worker state (FIXTURE_ORDER lists them)
     FIXTURE_ORDER      [[key, label]] in the order the guide shows them
     numbers(record)    derived counts and the 20 DayBar segments (see below)
     workerState(record) the WorkerCard state key for a record
     WORKER_RULE        the program rule (V2 RULE, worker_day_done.jsx:38)
     WORKER_APPS        the apps, in order, with their marks
     WORKER_JOB         the fixture paid job (video, actions, exact comment)
     EARNINGS_URL       the one Earnings destination (V2 has two: index.html:320, worker_day_done.jsx:184)
     modeSummary(record) 'Always ask' or 'Automatic · YouTube' (V2 wording, agent_permissions.jsx:119) */
(function () {
  // V2 RULE verbatim (worker_day_done.jsx:38). Money terms wait on decision D3; the UI shows days.
  const WORKER_RULE = { rate: 1, target: 20, bonus: 10, programEnd: 'Nov 1' };
  // The menu's destination (index.html:320) wins over the strip's (worker_day_done.jsx:184) until the
  // product team names the real dashboard URL; one constant either way.
  const EARNINGS_URL = 'https://blueai-screen-library.vercel.app/experiments/onblue-vesper/apply.html';

  const WORKER_APPS = [
    { id: 'youtube', name: 'YouTube', icon: 'youtube' },
    { id: 'instagram', name: 'Instagram', icon: 'instagram' },
  ];

  // The job the ask is about. V2 shows only JOB.title (worker_flow.jsx:51); the system shows the video,
  // the channel and the exact comment that will be posted under the partner's name (R07).
  const WORKER_JOB = {
    id: 'job-1042',
    app: 'youtube',
    label: 'Paid job available',
    brief: 'Watch the video and provide feedback',
    video: { title: 'Galaxy S26 vs iPhone 17: night camera test', channel: 'TechLine', duration: '8:24', thumb: null },
    actions: ['watch', 'like', 'comment'],
    comment: 'The low-light shots at 4:10 surprised me. Did not expect the S26 to hold up that well.',
  };

  // One neutral identity everywhere (R39): no staff data, no second handle.
  const ACCOUNT = { name: 'Alex Morgan', first: 'Alex', email: 'alex@example.com' };

  function apps(youtube, instagram) {
    return {
      youtube: Object.assign({ status: 'connected', handle: '@alexwatches', mode: 'always', history: 'allowed' }, youtube),
      instagram: Object.assign({ status: 'coming-soon', mode: 'always' }, instagram),
    };
  }
  // Ledger rows, oldest first: verified | pending | late | rejected | skipped | missed.
  function days(n, status, from) {
    const out = [];
    for (let i = 0; i < n; i++) out.push({ date: 'Oct ' + ((from || 6) + i), status: status });
    return out;
  }
  const IDLE = { status: 'scheduled', nextRunAt: '11 am', startedAt: null, step: null, stepsDone: 0, ask: null, end: null, error: null };
  const today = (o) => Object.assign({}, IDLE, o);

  function base(o) {
    return Object.assign({
      account: ACCOUNT,
      setUp: true,
      coachSeen: true,
      apps: apps(),
      runWindow: { kind: 'time', label: '11 am' },
      paused: null,
      online: true,
      credits: { left: 1640, grant: 2000, refillAt: '5:30 am', runCost: 360 },
      today: today(),
      ledger: days(6, 'verified'),
      program: { target: WORKER_RULE.target, endsOn: WORKER_RULE.programEnd, daysLeft: 19 },
    }, o);
  }

  const ASK = { job: WORKER_JOB, since: '11:04 am', expires: '9 pm' };
  const workerFixtures = {
    new: base({ setUp: false, coachSeen: false, apps: apps({ status: 'not-connected', handle: null, history: null }), today: today({ status: 'none', nextRunAt: null }), ledger: [], program: { target: 20, endsOn: 'Nov 1', daysLeft: 20 } }),
    setUp: base({ ledger: [], program: { target: 20, endsOn: 'Nov 1', daysLeft: 20 } }),
    running: base({ today: today({ status: 'running', startedAt: '11:02 am', step: 'Watching a tech Short…', stepsDone: 2 }) }),
    waiting: base({ today: today({ status: 'waiting', startedAt: '11:02 am', stepsDone: 4, ask: ASK }) }),
    donePending: base({ today: today({ status: 'done', end: 'job', startedAt: '11:02 am' }), ledger: days(6, 'verified').concat(days(1, 'pending', 12)) }),
    verified: base({ ledger: days(7, 'verified'), program: { target: 20, endsOn: 'Nov 1', daysLeft: 18 } }),
    failed: base({ today: today({ status: 'failed', end: 'failed', startedAt: '11:02 am', error: 'App Player closed during the job.', retryBy: '9 pm' }) }),
    paused: base({ paused: { until: 'Oct 16' } }),
    offline: base({ online: false }),
    complete: base({ today: today({ status: 'none', nextRunAt: null }), ledger: days(20, 'verified', 1), program: { target: 20, endsOn: 'Nov 1', daysLeft: 0 } }),
    // Extra states the cards and strips need.
    noCredits: base({ credits: { left: 120, grant: 2000, refillAt: '5:30 am', runCost: 360 } }),
    rejected: base({ ledger: days(6, 'verified').concat([{ date: 'Oct 12', status: 'rejected', reason: 'The comment was removed before we checked it.' }]) }),
    automatic: base({ apps: apps({ mode: 'auto' }), today: today({ status: 'done', end: 'job', startedAt: '11:02 am', doneAt: '11:12 am' }), ledger: days(6, 'verified').concat(days(1, 'pending', 12)) }),
    day20: base({ today: today({ status: 'done', end: 'day20', startedAt: '11:02 am' }), ledger: days(19, 'verified', 1).concat(days(1, 'pending', 20)), program: { target: 20, endsOn: 'Nov 1', daysLeft: 0 } }),
    nojob: base({ today: today({ status: 'done', end: 'nojob', startedAt: '11:02 am' }), ledger: days(6, 'verified').concat(days(1, 'pending', 12)) }),
    declined: base({ today: today({ status: 'done', end: 'declined', startedAt: '11:02 am' }), ledger: days(6, 'verified').concat([{ date: 'Oct 12', status: 'skipped' }]) }),
    behind: base({ ledger: days(8, 'verified').concat([{ date: 'Oct 22', status: 'missed' }]), program: { target: 20, endsOn: 'Nov 1', daysLeft: 9 } }),
  };
  const FIXTURE_ORDER = [
    ['new', 'New'], ['setUp', 'Set up'], ['running', 'Running'], ['waiting', 'Waiting'],
    ['donePending', 'Done, pending'], ['verified', 'Verified'], ['failed', 'Failed'], ['paused', 'Paused'],
    ['offline', 'Offline'], ['complete', 'Program complete'], ['noCredits', 'Out of credits'],
    ['rejected', 'Yesterday rejected'], ['automatic', 'Automatic'], ['nojob', 'No job'],
    ['declined', 'Skipped'], ['day20', 'Day 20'], ['behind', 'Out of reach'],
  ];

  /* numbers(record): everything a surface prints, derived from the ledger, so tonight's count and
     tomorrow's can never disagree (V2: 'DAY 7 OF 20' tonight, 'Day 6 of 20' tomorrow, R02).
       verified, pending (pending + late), rejected, notCounted (skipped + missed + rejected)
       done = verified + pending: the count every surface shows ("7 of 20 days")
       toGo, daysLeft, reachable (done + daysLeft >= target), outOfReach (slots no longer reachable)
       latestRejected: the most recent row is rejected (its slot shows red until the next run fills it)
       segments: target entries, verified | pending | rejected | missed | future */
  function numbers(w) {
    const rec = w || workerFixtures.verified;
    const target = (rec.program && rec.program.target) || WORKER_RULE.target;
    const daysLeft = rec.program ? rec.program.daysLeft : 0;
    const count = (s) => (rec.ledger || []).filter((r) => s.indexOf(r.status) >= 0).length;
    const verified = Math.min(count(['verified']), target);
    const pending = Math.min(count(['pending', 'late']), target - verified);
    const rejected = count(['rejected']);
    const notCounted = count(['skipped', 'missed', 'rejected']);
    const done = verified + pending;
    const last = (rec.ledger || [])[(rec.ledger || []).length - 1] || null;
    const latestRejected = !!last && last.status === 'rejected';
    const reachable = done + daysLeft >= target;
    const outOfReach = reachable ? 0 : target - done - daysLeft;
    const segments = [];
    for (let i = 0; i < target; i++) {
      if (i < verified) segments.push('verified');
      else if (i < done) segments.push('pending');
      else if (i === done && latestRejected) segments.push('rejected');
      else if (i >= target - outOfReach) segments.push('missed');
      else segments.push('future');
    }
    return {
      target, endsOn: (rec.program && rec.program.endsOn) || WORKER_RULE.programEnd, rate: WORKER_RULE.rate, bonus: WORKER_RULE.bonus,
      verified, pending, rejected, notCounted, done, toGo: Math.max(0, target - done), daysLeft, reachable, outOfReach,
      complete: verified >= target, latestRejected, last, segments,
    };
  }

  // The WorkerCard state for a record. Order matters: what blocks the run outranks what the run is doing.
  function workerState(w) {
    const n = numbers(w);
    const t = w.today || {};
    if (!w.setUp) return 'setup';
    if (n.complete) return 'complete';
    if (!w.online) return 'offline';
    if (w.paused) return 'paused';
    if (t.status === 'running') return 'running';
    if (t.status === 'waiting') return 'waiting';
    if (t.status === 'failed') return 'failed';
    if (t.status === 'done') return 'done';
    if (w.credits && w.credits.left < w.credits.runCost) return 'noCredits';
    return 'scheduled';
  }

  // V2's summary wording (agent_permissions.jsx:119): 'Always ask' until some app is Automatic.
  function modeSummary(w) {
    const auto = WORKER_APPS.filter((a) => w && w.apps && w.apps[a.id] && w.apps[a.id].mode === 'auto' && w.apps[a.id].status === 'connected');
    if (!auto.length) return { mode: 'always', label: 'Always ask', icon: 'shield-check' };
    return { mode: 'auto', label: 'Automatic · ' + auto.map((a) => a.name).join(' and '), icon: 'zap' };
  }

  // "Next run today at 11 am" from the saved window, never a hard-coded time (chat_product.jsx:213).
  function nextRunText(w) {
    const r = w.runWindow || {};
    if (r.kind === 'window') return 'Next run today between ' + r.label + '.';
    if (r.kind === 'any') return 'Next run later today.';
    return 'Next run today at ' + (r.label || (w.today && w.today.nextRunAt) || '11 am') + '.';
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, {
    workerFixtures, FIXTURE_ORDER, numbers, workerState, modeSummary, nextRunText,
    WORKER_RULE, WORKER_APPS, WORKER_JOB, EARNINGS_URL,
  });
})();
