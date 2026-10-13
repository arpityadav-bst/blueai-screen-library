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
     blockedBy(record)  null, or {reason 'no-app' | 'signed-out' | 'no-bluestacks', app}
     creditsDay(record, now?)  'covered' | 'waiting' | 'stopped': what short credits mean for today
     dayWords(row)      {result, tick, tickWord, hasRun} for a ledger row: words from its outcome,
                        tick from its status (Activity, Run detail, Notifications)
     dayGap(from, to)   whole days between two 'Oct 12' dates, or null
     WORKER_RULE        the program rule (V2 RULE, worker_day_done.jsx:38) + the cash-out minimum
     WORKER_APPS        the apps, in order, with their marks
     WORKER_JOB         the fixture paid job (video, actions, exact comment)
     WORKER_OTHER_ACCOUNT  the second identity sign-in mismatch screens use
     EARNINGS_URL, SITE_FAQ_URL  the one Earnings destination (V2 has two: index.html:320,
                        worker_day_done.jsx:184) and the site's FAQ, on the same stand-in host
     modeSummary(record) 'Always ask' or 'Automatic · YouTube' (V2 wording, agent_permissions.jsx:119) */
(function () {
  // V2 RULE verbatim (worker_day_done.jsx:38) plus the $10 cash-out minimum (its rule note, :6, and
  // the site's dashboard, onblue/apply.html:2292). Money terms wait on decision D3; the UI shows days.
  const WORKER_RULE = { rate: 1, target: 20, bonus: 10, programEnd: 'Nov 1', cashOutMin: 10 };
  // The deadline every 'by 9 pm' line states: an ask, a retry, a late start (24-hour clock).
  const DAY_DEADLINE_HOUR = 21;
  const HOST = 'https://blueai-screen-library.vercel.app/experiments/onblue-vesper/';
  // The menu's destination (index.html:320) wins over the strip's (worker_day_done.jsx:184) until the
  // product team names the real dashboard URL; one constant either way. The FAQ is the site's
  // (onblue/apply.html:1576 links index.html#faqs).
  const EARNINGS_URL = HOST + 'apply.html';
  const SITE_FAQ_URL = HOST + 'index.html#faqs';

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

  // One neutral identity everywhere (R39): no staff data, no second handle. The other account is the
  // one sign-in mismatch screens name (a Google account that did not apply).
  const ACCOUNT = { name: 'Alex Morgan', first: 'Alex', email: 'alex@example.com' };
  const WORKER_OTHER_ACCOUNT = { name: ACCOUNT.name, first: ACCOUNT.first, email: 'alex@morganmedia.example' };

  // The next refill: 00:00 UTC, V2's day key (credits_popup_parts.jsx:22-25; the same instant
  // creditsTime.nextRefill gives). A timestamp, so every surface formats it in local time.
  const now0 = new Date();
  const REFILL_AT = Date.UTC(now0.getUTCFullYear(), now0.getUTCMonth(), now0.getUTCDate() + 1);

  // historyOn: the day watch history was answered ('Oct 6' at setup), null when it was never asked.
  function apps(youtube, instagram) {
    const yt = Object.assign({ status: 'connected', handle: '@alexwatches', mode: 'always', history: 'allowed' }, youtube);
    if (!(youtube && 'historyOn' in youtube)) yt.historyOn = yt.history ? 'Oct 6' : null;
    return {
      youtube: yt,
      instagram: Object.assign({ status: 'coming-soon', mode: 'always' }, instagram),
    };
  }
  /* Ledger rows, oldest first, one per program day: {date, outcome, status, reason}.
       outcome  what the run did: job | nojob | skipped | expired | stopped | failed | nocredits | norun
       status   whether the day counts: verified | pending | late | rejected | notcounted */
  const row = (date, outcome, status, extra) => Object.assign({ date: date, outcome: outcome, status: status }, extra);
  function days(n, status, from) {
    const out = [];
    for (let i = 0; i < n; i++) out.push(row('Oct ' + ((from || 6) + i), 'job', status));
    return out;
  }
  /* today {date, status scheduled | running | waiting | done | stopped | failed | missed | none,
     outcome (as a ledger row's, once the run ends), nextRunAt, startedAt, step, stepsDone, ask,
     error, retryBy, missedAt}. */
  const IDLE = { date: 'Oct 12', status: 'scheduled', nextRunAt: '11 am', startedAt: null, step: null, stepsDone: 0, ask: null, outcome: null, error: null };
  const today = (o) => Object.assign({}, IDLE, o);

  function base(o) {
    return Object.assign({
      account: ACCOUNT,
      setUp: true,
      coachSeen: true,
      apps: apps(),
      runWindow: { kind: 'time', label: '11 am' },
      paused: null,
      blocked: null,
      online: true,
      credits: { left: 1640, grant: 2000, refillAt: REFILL_AT, runCost: 360 },
      today: today(),
      ledger: days(6, 'verified'),
      program: { target: WORKER_RULE.target, endsOn: WORKER_RULE.programEnd, daysLeft: 19 },
    }, o);
  }

  const ASK = { job: WORKER_JOB, since: '11:04 am', expires: '9 pm' };
  const PENDING_TODAY = (outcome) => days(6, 'verified').concat([row('Oct 12', outcome || 'job', 'pending')]);
  const ENDED = { target: 20, endsOn: 'Nov 1', daysLeft: 0 };
  const workerFixtures = {
    new: base({ setUp: false, coachSeen: false, apps: apps({ status: 'not-connected', handle: null, history: null }), today: today({ status: 'none', nextRunAt: null }), ledger: [], program: { target: 20, endsOn: 'Nov 1', daysLeft: 20 } }),
    setUp: base({ ledger: [], program: { target: 20, endsOn: 'Nov 1', daysLeft: 20 } }),
    running: base({ today: today({ status: 'running', startedAt: '11:02 am', step: 'Watching a tech Short…', stepsDone: 2 }) }),
    waiting: base({ today: today({ status: 'waiting', startedAt: '11:02 am', stepsDone: 4, ask: ASK }) }),
    donePending: base({ today: today({ status: 'done', outcome: 'job', startedAt: '11:02 am' }), ledger: PENDING_TODAY() }),
    verified: base({ today: today({ date: 'Oct 13' }), ledger: days(7, 'verified'), program: { target: 20, endsOn: 'Nov 1', daysLeft: 18 } }),
    failed: base({ today: today({ status: 'failed', outcome: 'failed', startedAt: '11:02 am', error: 'App Player closed during the job.', retryBy: '9 pm' }) }),
    stopped: base({ today: today({ status: 'stopped', outcome: 'stopped', startedAt: '11:02 am', stoppedAt: '11:04 am', retryBy: '9 pm' }) }),
    missed: base({ today: today({ status: 'missed', missedAt: '11 am', retryBy: '9 pm' }) }),
    blocked: base({ blocked: { reason: 'signed-out', app: 'youtube' } }),
    paused: base({ paused: { until: 'Oct 16' } }),
    offline: base({ online: false }),
    complete: base({ today: today({ date: 'Oct 21', status: 'none', nextRunAt: null }), ledger: days(20, 'verified', 1), program: ENDED }),
    ended: base({ today: today({ date: 'Nov 2', status: 'none', nextRunAt: null }), ledger: days(18, 'verified', 1).concat([row('Oct 19', 'norun', 'notcounted'), row('Oct 20', 'norun', 'notcounted')]), program: ENDED }),
    endedBelow: base({ today: today({ date: 'Nov 2', status: 'none', nextRunAt: null }), ledger: days(6, 'verified', 1), program: ENDED }),
    // Extra states the cards and strips need.
    noCredits: base({ credits: { left: 120, grant: 2000, refillAt: REFILL_AT, runCost: 360 } }),
    rejected: base({ today: today({ date: 'Oct 13' }), ledger: days(6, 'verified').concat([row('Oct 12', 'job', 'rejected', { reason: 'The comment was removed before we checked it.' })]) }),
    automatic: base({ apps: apps({ mode: 'auto' }), today: today({ status: 'done', outcome: 'job', startedAt: '11:02 am', doneAt: '11:12 am' }), ledger: PENDING_TODAY() }),
    day20: base({ today: today({ date: 'Oct 20', status: 'done', outcome: 'job', startedAt: '11:02 am' }), ledger: days(19, 'verified', 1).concat([row('Oct 20', 'job', 'pending')]), program: ENDED }),
    nojob: base({ today: today({ status: 'done', outcome: 'nojob', startedAt: '11:02 am' }), ledger: PENDING_TODAY('nojob') }),
    declined: base({ today: today({ status: 'done', outcome: 'skipped', startedAt: '11:02 am' }), ledger: days(6, 'verified').concat([row('Oct 12', 'skipped', 'notcounted')]) }),
    revoked: base({ apps: apps({ history: 'revoked', historyOn: 'Oct 11' }), today: today({ date: 'Oct 13' }), ledger: days(7, 'verified'), program: { target: 20, endsOn: 'Nov 1', daysLeft: 18 } }),
    behind: base({ today: today({ date: 'Oct 23' }), ledger: days(8, 'verified').concat([row('Oct 22', 'norun', 'notcounted')]), program: { target: 20, endsOn: 'Nov 1', daysLeft: 9 } }),
  };
  const FIXTURE_ORDER = [
    ['new', 'New'], ['setUp', 'Set up'], ['running', 'Running'], ['waiting', 'Waiting'],
    ['donePending', 'Done, pending'], ['verified', 'Verified'], ['failed', 'Failed'], ['stopped', 'Stopped'],
    ['missed', 'Missed start'], ['blocked', 'Can’t run'], ['paused', 'Paused'], ['offline', 'Offline'],
    ['complete', 'Program complete'], ['ended', 'Period ended'], ['endedBelow', 'Ended under the minimum'],
    ['noCredits', 'Out of credits'], ['rejected', 'Yesterday rejected'], ['automatic', 'Automatic'], ['nojob', 'No job'],
    ['declined', 'Skipped'], ['day20', 'Day 20'], ['behind', 'Out of reach'], ['revoked', 'History revoked'],
  ];

  /* numbers(record): everything a surface prints, derived from the ledger, so tonight's count and
     tomorrow's can never disagree (V2: 'DAY 7 OF 20' tonight, 'Day 6 of 20' tomorrow, R02).
       verified, pending (pending + late), rejected, notCounted (notcounted + rejected)
       done = verified + pending: the count every surface shows ("7 of 20 days"). A pending day that
         is later rejected leaves it, and the receipt line says why (section 41's counting rule).
       toGo, daysLeft, reachable (done + daysLeft >= target), outOfReach (slots no longer reachable)
       latestRejected: the most recent row is rejected (its slot shows red until the next run fills it)
       cashOutMin, reachedMinimum: verified x rate, plus the bonus once complete, is at least the minimum
       segments: target entries, verified | pending | rejected | missed | future */
  function numbers(w) {
    const rec = w || workerFixtures.verified;
    const target = (rec.program && rec.program.target) || WORKER_RULE.target;
    const daysLeft = rec.program ? rec.program.daysLeft : 0;
    const count = (s) => (rec.ledger || []).filter((r) => s.indexOf(r.status) >= 0).length;
    const verified = Math.min(count(['verified']), target);
    const pending = Math.min(count(['pending', 'late']), target - verified);
    const rejected = count(['rejected']);
    const notCounted = count(['notcounted', 'rejected']);
    const done = verified + pending;
    const complete = verified >= target;
    const last = (rec.ledger || [])[(rec.ledger || []).length - 1] || null;
    const latestRejected = !!last && last.status === 'rejected';
    const reachable = done + daysLeft >= target;
    const outOfReach = reachable ? 0 : target - done - daysLeft;
    const earned = verified * WORKER_RULE.rate + (complete ? WORKER_RULE.bonus : 0);
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
      complete, latestRejected, last, segments, cashOutMin: WORKER_RULE.cashOutMin, reachedMinimum: earned >= WORKER_RULE.cashOutMin,
    };
  }

  // What stops today's run before it starts: a set reason on the record, or no connected app.
  function blockedBy(w) {
    if (w.blocked) return w.blocked;
    const live = WORKER_APPS.some((a) => w.apps && w.apps[a.id] && w.apps[a.id].status === 'connected');
    return w.setUp && !live ? { reason: 'no-app', app: 'youtube' } : null;
  }

  /* The WorkerCard state for a record. Order matters: today's own outcome outranks what could block
     the next run, and what blocks a run (no app, no credits) outranks a way to start one, so the
     card never offers Try again, Run again or Run now when the run cannot start.
       setup, complete, ended (the period is over, not complete), offline, paused, running, waiting,
       done, blocked, noCredits, stopped, failed, missed, scheduled */
  function workerState(w) {
    const n = numbers(w);
    const t = w.today || {};
    const idle = !t.status || t.status === 'none' || t.status === 'scheduled';
    if (!w.setUp) return 'setup';
    if (n.complete) return 'complete';
    if (n.daysLeft <= 0 && idle) return 'ended';
    if (!w.online) return 'offline';
    if (w.paused) return 'paused';
    if (t.status === 'running') return 'running';
    if (t.status === 'waiting') return 'waiting';
    if (t.status === 'done') return 'done';
    if (blockedBy(w)) return 'blocked';
    if (w.credits && w.credits.left < w.credits.runCost) return 'noCredits';
    if (t.status === 'stopped') return 'stopped';
    if (t.status === 'failed') return 'failed';
    if (t.status === 'missed') return 'missed';
    return 'scheduled';
  }

  // Short credits and today's day: covered (done, or enough), waiting (the refill comes before the
  // 9 pm deadline, so the run starts after it), stopped (it comes after: today won't count).
  function creditsDay(w, now) {
    const c = w.credits || {};
    const t = w.today || {};
    if (t.status === 'done' || !(c.left < c.runCost)) return 'covered';
    const deadline = new Date(now == null ? Date.now() : now);
    deadline.setHours(DAY_DEADLINE_HOUR, 0, 0, 0);
    return c.refillAt != null && +new Date(c.refillAt) <= +deadline ? 'waiting' : 'stopped';
  }

  // Ledger words. Proposed copy (section 58); the tick words are StatusTick's.
  const OUTCOME_WORDS = {
    job: 'Paid job done', nojob: 'No job on the board', skipped: 'Job skipped', expired: 'No answer, job skipped',
    stopped: 'Run stopped', failed: 'Job didn’t finish', nocredits: 'Out of AI credits', norun: 'No run',
  };
  const TICK_WORDS = { verified: 'Verified', pending: 'Pending', late: 'Still checking', rejected: 'Not counted', notcounted: 'Not counted' };
  function dayWords(r) {
    const tick = TICK_WORDS[r.status] ? r.status : 'pending';
    return { result: OUTCOME_WORDS[r.outcome] || OUTCOME_WORDS.job, tick: tick, tickWord: TICK_WORDS[tick], hasRun: r.outcome !== 'norun' };
  }

  // Whole days from one 'Oct 12' date to another (the fixtures' format), or null if either is not one.
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function dayGap(from, to) {
    const at = function (d) {
      const m = /^([A-Za-z]{3}) (\d{1,2})$/.exec(d || '');
      return m && MONTHS.indexOf(m[1]) >= 0 ? Date.UTC(2026, MONTHS.indexOf(m[1]), Number(m[2])) : NaN;
    };
    const gap = Math.round((at(to) - at(from)) / 864e5);
    return isFinite(gap) ? gap : null;
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
    workerFixtures, FIXTURE_ORDER, numbers, workerState, blockedBy, creditsDay, dayWords, dayGap, modeSummary, nextRunText,
    WORKER_RULE, WORKER_APPS, WORKER_JOB, WORKER_OTHER_ACCOUNT, EARNINGS_URL, SITE_FAQ_URL,
  });
})();
