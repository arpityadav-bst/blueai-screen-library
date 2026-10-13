/* BlueAI Product V2 Design System: the worker card and its coach mark (section 42).
   WorkerCard {worker, state, onRun, onOpenToday, onRetry, onResume, onOpenCredits, onReview,
               coaching, onDismissCoach}
     The home's one card. state defaults to workerState(worker); pass it to force one for review.
     Ten states: setup, scheduled, running, waiting, done, failed, paused, noCredits, offline,
     complete. Never a second Run once today's run has happened (V2's Run 'completes' the day again).
     The card is not one big button (V2's role=button wraps a second button); only the action acts.
   CoachMark {title, onOkay}
     The first-run pointer under the card. PM copy 'Run this to begin' / 'Okay' kept. The screen
     owns the scrim (Scrim at --v2-z-coach) and remembers dismissal on the Worker record (coachSeen),
     so it never comes back on a remount (V2: moneymaker_home.jsx:105). */
(function () {
  const K = () => window.V2Kit || {};
  const cx = function () { return Array.prototype.filter.call(arguments, Boolean).join(' '); };

  const TILE = {
    setup: ['spark', null], scheduled: ['clock', null], running: ['play', 'info'], waiting: ['bell', 'attention'],
    done: ['check', null], failed: ['alert', 'danger'], paused: ['pause', null], noCredits: ['credits', null],
    offline: ['wifi-off', null], complete: ['check-double', 'success'],
  };

  // V2 copy where V2 has it (quoted exactly), proposed copy elsewhere.
  const DONE_LINE = {
    job: 'Today’s run is done.',
    nojob: 'No paid job today, but your run counts.',
    day20: 'Day 20 done.',
    declined: 'Run finished without a job.',
  };

  function content(state, w, h) {
    const t = w.today || {};
    const n = K().numbers(w);
    const B = K().Button;
    const Spin = K().Spinner;
    const btn = (variant, label, onClick, extra) => (B ? <B variant={variant} size="md" onClick={onClick} {...(extra || {})}>{label}</B> : null);
    switch (state) {
      case 'setup':
        return { lines: [{ text: 'Finds jobs that fit you and runs them on your account.' }], action: btn('primary', 'Run', h.onRun), noMode: true };
      case 'scheduled':
        return { lines: [{ text: K().nextRunText(w) }], action: btn('secondary', 'Run now', h.onRun) };
      case 'running':
        return { lines: [{ text: t.step || 'Working…', lead: Spin ? <Spin size={16} label="Running" /> : null }], action: btn('quiet', 'Details', h.onOpenToday) };
      case 'waiting': {
        const a = t.ask || {};
        return {
          lines: [{ text: 'A paid YouTube job is waiting for your OK.', tone: 'attention' }, { text: (a.since ? 'Since ' + a.since + '. ' : '') + 'Answer by ' + (a.expires || '9 pm') + ' or today won’t count.', meta: true }],
          action: btn('primary', 'Review job', h.onReview || h.onOpenToday),
        };
      }
      case 'done': {
        const end = t.end || 'job';
        const lines = [{ text: DONE_LINE[end] || DONE_LINE.job }];
        if (end === 'declined') lines.push({ text: 'Today doesn’t count toward your 20 days.', meta: true });
        else lines.push({ text: 'Pending verification', tick: 'pending', meta: true });
        return { lines: lines, action: btn('quiet', 'Details', h.onOpenToday) };
      }
      case 'failed':
        return {
          lines: [{ text: 'Today’s job didn’t finish.', tone: 'danger' }, { text: (t.error ? t.error + ' ' : '') + 'Try again by ' + (t.retryBy || '9 pm') + ' to count the day.', meta: true }],
          action: btn('primary', 'Try again', h.onRetry || h.onRun),
        };
      case 'paused':
        return { lines: [{ text: w.paused && w.paused.until ? 'Paused until ' + w.paused.until + '.' : 'Paused.' }, { text: 'Days don’t count while the worker is paused.', meta: true }], action: btn('secondary', 'Resume', h.onResume) };
      case 'noCredits':
        return { lines: [{ text: 'Not enough AI credits for today’s run.' }, { text: 'Credits refresh at ' + ((w.credits && w.credits.refillAt) || '5:30 am') + '.', meta: true }], action: btn('secondary', 'AI credits', h.onOpenCredits) };
      case 'offline':
        return { lines: [{ text: 'You’re offline.' }, { text: 'Today’s run starts when you’re back online.', meta: true }], action: btn('secondary', 'Try again', h.onRetry) };
      case 'complete':
        return {
          lines: [{ text: 'All ' + n.target + ' days done.' }, { text: 'Cash out on Earnings after ' + n.endsOn + '.', meta: true }],
          action: btn('secondary', 'Earnings', null, { href: K().EARNINGS_URL, external: true }), noMode: true,
        };
      default:
        return { lines: [], action: null };
    }
  }

  function WorkerCard(props) {
    const w = props.worker || (K().workerFixtures || {}).setUp;
    const state = props.state || K().workerState(w);
    const c = content(state, w, props);
    const I = K().Icon;
    const tile = TILE[state] || TILE.scheduled;
    const mode = K().modeSummary(w);
    const T = K().StatusTick;
    return (
      <div>
        <article className={cx('v2-wcard', 'v2-wcard--' + state, props.coaching && 'is-coaching')} aria-label="BlueAI worker">
          <span className={cx('v2-wcard-tile', tile[1] && 'v2-wcard-tile--' + tile[1])} aria-hidden="true">{I ? <I name={tile[0]} size={20} /> : null}</span>
          <div className="v2-wcard-body">
            <h2 className="v2-wcard-title">BlueAI worker</h2>
            {c.lines.map(function (l, i) {
              return (
                <p key={i} className={cx('v2-wcard-status', l.tone && 'v2-wcard-status--' + l.tone, l.meta && 'v2-wcard-status--meta')} role={i === 0 && (state === 'running' || state === 'waiting') ? 'status' : undefined}>
                  {l.lead || null}
                  {l.tick && T ? <T status={l.tick} size={14} /> : null}
                  <span>{l.text}</span>
                </p>
              );
            })}
            {c.noMode ? null : (
              <span className={cx('v2-wcard-mode', mode.mode === 'auto' && 'v2-wcard-mode--auto')}>
                {I ? <I name={mode.icon} size={16} /> : null}{mode.label}
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
        <div className="v2-coach" role="note">
          <p className="v2-coach-title">{title || 'Run this to begin'}</p>
          <div className="v2-coach-row">
            <button type="button" className={cx('v2-w-btn v2-w-btn--inverse', okayClassName)} onClick={onOkay}>Okay</button>
          </div>
        </div>
      </div>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { WorkerCard, CoachMark });
})();
