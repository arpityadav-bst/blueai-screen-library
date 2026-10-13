/* BlueAI Product V2 Design System: the worker card and its coach mark (section 42).
   WorkerCard {worker, state, busy, onRun, onOpenToday, onRetry, onResume, onOpenCredits, onReview,
               onFix, coaching, onDismissCoach}
     The home's one card. state defaults to workerState(worker); pass it to force one for review.
     busy: the card's action is working (Try again reconnecting, Run now starting): its Button
     loads in place and ignores a second click.
     Fourteen states: setup, scheduled, running, waiting, done, stopped, failed, missed, blocked,
     paused, noCredits, offline, complete, ended. Never a second Run once today's run has happened
     (V2's Run 'completes' the day again). The card is not one big button (V2's role=button wraps a
     second button); only the action acts. Every state that costs today says so, with the time.
     onFix(reason) is the blocked state's one fixing action ('no-app' Connect YouTube, 'signed-out'
     Open App Player, 'no-bluestacks' Get BlueStacks). ended uses endedCopy, the words section 69's
     period-ended state shows; Home itself shows that state, not this card, once the period is over,
     so ended is for review and for surfaces other than Home.
   CoachMark {title, onOkay, okayClassName}
     The first-run pointer under the card, a non-blocking note: nothing is dimmed or locked, so
     nothing has to be made inert. PM copy 'Run this to begin' / 'Okay' kept. Dismissal is
     remembered on the Worker record (coachSeen), so it never comes back on a remount (V2:
     moneymaker_home.jsx:105). */
(function () {
  const K = () => window.V2Kit;
  const cx = function () { return Array.prototype.filter.call(arguments, Boolean).join(' '); };

  const TILE = {
    setup: ['spark', null], scheduled: ['clock', null], running: ['play', 'info'], waiting: ['bell', 'attention'],
    done: ['check', null], stopped: ['stop', null], failed: ['alert', 'danger'], missed: ['clock', 'attention'],
    blocked: ['alert', 'danger'], paused: ['pause', null], noCredits: ['credits', null], offline: ['wifi-off', null],
    complete: ['check-double', 'success'], ended: ['calendar', null],
  };

  // V2 copy where V2 has it (quoted exactly), proposed copy elsewhere. Keyed by today's outcome.
  const NOT_COUNTED = 'Today doesn’t count toward your 20 days.';
  const DONE_LINE = {
    job: ['Today’s run is done.'],
    nojob: ['No paid job today, but your run counts.'],
    skipped: ['Run finished without a job.', NOT_COUNTED],
    expired: ['No answer by 9 pm, so I skipped the job.', NOT_COUNTED],
  };
  // What blocks today's run, and the one action that fixes it. Proposed copy, in Settings' words.
  const BLOCKED = {
    'no-app': ['YouTube isn’t connected.', 'Connect it by 9 pm to count today.', 'Connect YouTube'],
    'signed-out': ['App Player isn’t signed in to YouTube.', 'Sign in there by 9 pm to count today.', 'Open App Player'],
    'no-bluestacks': ['BlueStacks isn’t installed.', 'Install it by 9 pm to count today.', 'Get BlueStacks'],
  };

  function content(state, w, h) {
    const P = K();
    const t = w.today || {};
    const n = P.numbers(w);
    const btn = (variant, label, onClick, extra) => <P.Button variant={variant} size="md" loading={!!h.busy} onClick={onClick} {...(extra || {})}>{label}</P.Button>;
    const earnings = btn('secondary', 'Earnings', null, { href: P.EARNINGS_URL, external: true });
    switch (state) {
      case 'setup':
        return { lines: [{ text: 'Finds jobs that fit you and runs them on your account.' }], action: btn('primary', 'Run', h.onRun), noMode: true };
      case 'scheduled':
        return { lines: [{ text: P.nextRunText(w) }], action: btn('secondary', 'Run now', h.onRun) };
      case 'running':
        return { lines: [{ text: t.step || 'Working…', lead: <P.Spinner size={16} label="Running" /> }], action: btn('quiet', 'Details', h.onOpenToday) };
      case 'waiting': {
        const a = t.ask || {};
        const app = P.WORKER_APPS.find((x) => x.id === (a.job && a.job.app)) || P.WORKER_APPS[0];
        return {
          lines: [{ text: 'A paid ' + app.name + ' job is waiting for your OK.', tone: 'attention' }, { text: (a.since ? 'Since ' + a.since + '. ' : '') + 'Answer by ' + (a.expires || '9 pm') + ' or today won’t count.', meta: true }],
          action: btn('primary', 'Review job', h.onReview || h.onOpenToday),
        };
      }
      case 'done': {
        const out = DONE_LINE[t.outcome] || DONE_LINE.job;
        const first = t.outcome === 'job' && n.done >= n.target ? 'Day ' + n.target + ' done.' : out[0];
        const second = out[1] ? { text: out[1], meta: true } : { text: 'Pending verification', tick: 'pending', meta: true };
        return { lines: [{ text: first }, second], action: btn('quiet', 'Details', h.onOpenToday) };
      }
      case 'stopped':
        return { lines: [{ text: 'You stopped today’s run.' }, { text: 'Today doesn’t count yet. Run again by ' + (t.retryBy || '9 pm') + '.', meta: true }], action: btn('secondary', 'Run again', h.onRetry || h.onRun) };
      case 'failed':
        return {
          lines: [{ text: 'Today’s job didn’t finish.', tone: 'danger' }, { text: (t.error ? t.error + ' ' : '') + 'Try again by ' + (t.retryBy || '9 pm') + ' to count the day.', meta: true }],
          action: btn('primary', 'Try again', h.onRetry || h.onRun),
        };
      // A late start never begins on its own: the partner may be using the PC when it wakes (P3).
      case 'missed':
        return {
          lines: [{ text: 'Your PC was off or asleep at ' + (t.missedAt || '11 am') + ', so today’s run didn’t start.', tone: 'attention' }, { text: 'Run now by ' + (t.retryBy || '9 pm') + ' to count today.', meta: true }],
          action: btn('primary', 'Run now', h.onRun),
        };
      case 'blocked': {
        const b = P.blockedBy(w) || { reason: 'no-app' };
        const c = BLOCKED[b.reason] || BLOCKED['no-app'];
        return {
          lines: [{ text: 'Today’s run can’t start: ' + c[0], tone: 'danger' }, { text: c[1], meta: true }],
          action: btn('primary', c[2], function () { if (h.onFix) h.onFix(b.reason); }),
        };
      }
      case 'paused':
        return { lines: [{ text: w.paused && w.paused.until ? 'Paused until ' + w.paused.until + '.' : 'Paused.' }, { text: 'Days don’t count while the worker is paused.', meta: true }], action: btn('secondary', 'Resume', h.onResume) };
      case 'noCredits': {
        const c = w.credits || {};
        const at = P.creditsTime.formatClock(c.refillAt != null ? c.refillAt : P.creditsTime.nextRefill());
        return { lines: [{ text: 'Not enough AI credits for today’s run.' }, { text: 'Credits refresh at ' + at + '. ' + P.OOC_COPY.day[P.creditsDay(w)], meta: true }], action: btn('secondary', 'AI credits', h.onOpenCredits) };
      }
      case 'offline':
        return { lines: [{ text: 'You’re offline.' }, { text: 'Today’s run starts when you’re back online.', meta: true }], action: btn('secondary', 'Try again', h.onRetry) };
      case 'complete':
        return { lines: [{ text: 'All ' + n.target + ' days done.' }, { text: 'Cash out on Earnings after ' + n.endsOn + '.', meta: true }], action: earnings, noMode: true };
      case 'ended': {
        const e = P.endedCopy(n);
        return { lines: [{ text: e.title + '.' }, { text: e.body, meta: true }], action: earnings, noMode: true };
      }
      default:
        return { lines: [], action: null };
    }
  }

  function WorkerCard(props) {
    const P = K();
    const w = props.worker || P.workerFixtures.setUp;
    const state = props.state || P.workerState(w);
    const c = content(state, w, props);
    const tile = TILE[state] || TILE.scheduled;
    const mode = P.modeSummary(w);
    return (
      <div>
        <article className={cx('v2-wcard', 'v2-wcard--' + state)} aria-label="BlueAI worker">
          <span className={cx('v2-wcard-tile', tile[1] && 'v2-wcard-tile--' + tile[1])} aria-hidden="true"><P.Icon name={tile[0]} size={20} /></span>
          <div className="v2-wcard-body">
            <h2 className="v2-text-title">BlueAI worker</h2>
            {c.lines.map(function (l, i) {
              return (
                <p key={i} className={cx('v2-wcard-status', l.tone && 'v2-wcard-status--' + l.tone, l.meta && 'v2-wcard-status--meta')} role={i === 0 && (state === 'running' || state === 'waiting') ? 'status' : undefined}>
                  {l.lead || null}
                  {l.tick ? <P.StatusTick status={l.tick} size={14} /> : null}
                  <span>{l.text}</span>
                </p>
              );
            })}
            {c.noMode ? null : (
              <span className={cx('v2-wcard-mode', mode.mode === 'auto' && 'v2-wcard-mode--auto')}>
                <P.Icon name={mode.icon} size={16} />{mode.label}
              </span>
            )}
          </div>
          {c.action ? <div className="v2-wcard-action">{c.action}</div> : null}
        </article>
        {props.coaching ? <CoachMark onOkay={props.onDismissCoach} /> : null}
      </div>
    );
  }

  function CoachMark({ title, onOkay, okayClassName }) {
    return (
      <div className="v2-coach-wrap">
        <div className="v2-coach v2-anim-pop-in" role="note">
          <p className="v2-coach-title">{title || 'Run this to begin'}</p>
          <div className="v2-coach-row">
            <button type="button" className={cx('v2-coach-okay', okayClassName)} onClick={onOkay}>Okay</button>
          </div>
        </div>
      </div>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { WorkerCard, CoachMark });
})();
