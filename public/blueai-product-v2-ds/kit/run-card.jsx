/* BlueAI Product V2 Design System: RunCard (section 36, New).
   One card per run answers the partner's question "is today done, and does it count": the live
   step, finished steps folded under a disclosure, the outcome, the day's status, one action.

   RunCard {run, worker, state, onAction, onOpenDetail, feedback, full, defaultExpanded, className}
     run    {status, title, startedAt, current, since, steps: [{label, time, status}], outcome,
             dayText, note, dayStatus, retryBy, reason, action}   every field optional; a missing
             field falls back to the fixture for that status, so <RunCard state="failed" /> renders
             a whole card.
     worker the Worker record (section 41). The day line is built from it, never a fixed count:
             runDayText(worker, state) 'Day 7 of 20, pending verification' (numbers().done and
             StatusTick's word); without a worker it is the tick word alone. The deadline lines are
             DAY_COPY's (kit/job.jsx), the deadline the record's (today.retryBy, 9 pm when absent).
             The running line is RUN_COPY.keepOpen. The 'nocredits' day line is OOC_COPY.day[dayStatus]
             (default V2Kit.creditsDay(worker), else 'stopped'); its outcome ends at the fact, and the
             refill time is said once, by the composer's OutOfCreditsNotice (section 48).
             A stopped run, like a failed one, still counts if it runs again by 9 pm.
             note: one line under the day line. A done job's pending day says, before it can cost
             the day, that a removed comment fails verification (proposed copy, section 36).
     state  shorthand for run.status: running | waiting | done-pending | verified | failed |
            stopped | nojob | nocredits, plus skipped, expired and rejected for Run detail. A
            ledger row's outcome (section 41) picks it: skipped (Not now) and expired (no answer
            by 9 pm) are told apart, as the AskCard told them apart.
     onAction(kind)   'retry' (failed), 'credits' (nocredits), 'restart' (stopped).
   runDayText(worker, state, reason)  the day line of a finished run, for any surface that says it
     (Chat's 'Did today count?' reply reads it, so the thread never states a count of its own).
     onOpenDetail()   shows 'See run details' on finished runs when given.
     full   fills its container (Run detail) instead of the 300px thread width. The badge then
            says the run, not the verification: the Verification card owns the day's result.
   Copy in RUN_FIXTURES quotes V2 where V2 has the line (refs in guide/refs/chat.js); the rest is
   proposed copy, marked in design-md/36-run-card.md. */
(function () {
  const { useState, useId } = React;
  const K = () => window.V2Kit || {};
  const cx = function () { return Array.prototype.filter.call(arguments, Boolean).join(' '); };

  const JOB = 'Watch the video and provide feedback';
  const DONE_STEPS = [
    { label: 'Run started', time: '11:02 am' },
    { label: 'Watched a tech Short', time: '11:02 am' },
    { label: 'Liked the tech Short', time: '11:03 am' },
    { label: 'Checked the jobs board', time: '11:03 am' },
    { label: 'Watched the job’s video', time: '11:05 am' },
    { label: 'Liked the video', time: '11:06 am' },
    { label: 'Left a comment', time: '11:06 am' },
  ];

  /* Per status: badge [tone, label], outcome icon [name, tone], tick for the day line, tone of
     the day line, default action. Out of AI credits is neutral (section 03); only its day line,
     when the day is lost ('stopped'), takes danger (dayTick and dayTone in RunCard). */
  const STATUS = {
    running: { badge: ['info', 'Running'], busy: true },
    waiting: { badge: ['attention', 'Waiting for you'], dayTone: 'attention' },
    'done-pending': { badge: ['neutral', 'Done'], outcome: ['check', 'success'], tick: 'pending' },
    verified: { badge: ['success', 'Verified'], outcome: ['check', 'success'], tick: 'verified', dayTone: 'success' },
    failed: { badge: ['danger', 'Didn’t finish'], outcome: ['x-circle', 'danger'], tick: 'notcounted', action: ['retry', 'Try again', 'primary'] },
    stopped: { badge: ['neutral', 'Stopped'], outcome: ['stop', 'neutral'], tick: 'notcounted', action: ['restart', 'Run again', 'secondary'] },
    skipped: { badge: ['neutral', 'Skipped'], outcome: ['info', 'neutral'], tick: 'notcounted' },
    expired: { badge: ['neutral', 'No answer'], outcome: ['clock', 'neutral'], tick: 'notcounted' },
    nojob: { badge: ['neutral', 'No job today'], outcome: ['info', 'neutral'], tick: 'pending' },
    nocredits: { badge: ['neutral', 'Out of credits'], outcome: ['clock', 'neutral'], action: ['credits', 'See AI credits', 'secondary'] },
    rejected: { badge: ['danger', 'Not counted'], outcome: ['x-circle', 'danger'], tick: 'rejected', dayTone: 'danger' },
  };

  // Steps, outcomes and notes only: every day line is built at render (dayLine), from the record.
  const FINISHED_JOB = 'Done. I finished “' + JOB + '” and submitted the job.';
  const RUN_FIXTURES = {
    running: { steps: DONE_STEPS.slice(0, 3), current: 'Checking the jobs board…' },
    waiting: { steps: DONE_STEPS.slice(0, 4), since: '11:04 am' },
    'done-pending': { steps: DONE_STEPS, outcome: FINISHED_JOB, note: 'Keep the comment up until it’s verified, or the day won’t count.' },
    verified: { steps: DONE_STEPS, outcome: FINISHED_JOB },
    failed: { steps: DONE_STEPS.slice(0, 5), outcome: 'I couldn’t finish “' + JOB + '”. App Player closed during the job.' },
    stopped: { steps: DONE_STEPS.slice(0, 3), outcome: 'You stopped the run at 11:04 am.' },
    skipped: { steps: DONE_STEPS.slice(0, 4), outcome: 'You skipped today’s paid job.' },
    expired: { steps: DONE_STEPS.slice(0, 4) },
    nojob: { steps: DONE_STEPS.slice(0, 4), outcome: 'No paid job on the board today.' },
    nocredits: { steps: DONE_STEPS.slice(0, 5), outcome: 'Not enough credits for this job.' },
    rejected: { steps: DONE_STEPS, outcome: FINISHED_JOB, reason: 'The comment was removed before it was checked.' },
  };

  const ALIAS = { done: 'done-pending', pending: 'done-pending', 'no-job': 'nojob', 'no-credits': 'nocredits' };
  const FINISHED = { 'done-pending': 1, verified: 1, nojob: 1, rejected: 1, skipped: 1, expired: 1 };

  function Icon(props) { const I = K().Icon; return <I {...props} />; }
  const lowerFirst = (x) => x.charAt(0).toLowerCase() + x.slice(1);

  // 'Day 7 of 20, pending verification' from numbers() and StatusTick's word; a rejected day names
  // its slot and why. Without a worker, the tick word alone: never a fixed count (V2's R02).
  function runDayText(worker, state, reason) {
    const s = STATUS[state] ? state : ALIAS[state];
    const tick = s ? STATUS[s].tick : null;
    const n = worker && K().numbers ? K().numbers(worker) : null;
    if (tick === 'rejected') {
      const last = n && n.last && n.last.status === 'rejected' ? n.last : null;
      const why = reason || (last && last.reason) || RUN_FIXTURES.rejected.reason;
      return (n ? 'Day ' + (n.done + 1) + ' not counted: ' : 'Not counted: ') + lowerFirst(why);
    }
    if (tick !== 'pending' && tick !== 'verified') return null;
    const word = K().tickWord(tick);
    return n ? 'Day ' + n.done + ' of ' + n.target + ', ' + lowerFirst(word) : word;
  }
  // The day line for any status: the deadline lines in DAY_COPY's words, by the record's deadline.
  function dayLine(status, r, w, credits) {
    const P = K();
    const t = (w && w.today) || {};
    const by = r.retryBy || t.retryBy || (status === 'waiting' && t.ask && t.ask.expires) || null;
    switch (status) {
      case 'running': return P.RUN_COPY.keepOpen;
      case 'waiting': return 'Answer by ' + (by || '9 pm') + ' or today won’t count.';
      case 'failed': return P.DAY_COPY.failed(by);
      case 'stopped': return P.DAY_COPY.stopped(by);
      case 'skipped': case 'expired': return P.DAY_COPY.notCounted;
      case 'nocredits': return P.OOC_COPY.day[credits];
      default: return runDayText(w, status, r.reason);
    }
  }

  /* StatusTick (section 43) draws the tick in its own colour; the day line's words say it, so the
     glyph is hidden from assistive tech here. */
  function Tick({ status }) {
    const T = K().StatusTick;
    return <T status={status} size={14} />;
  }

  function RunCard({ run, worker, state, onAction, onOpenDetail, feedback, full, defaultExpanded, className }) {
    const r = run || {};
    const raw = state || r.status || 'running';
    const status = STATUS[raw] ? raw : (ALIAS[raw] || 'running');
    const S = STATUS[status];
    const F = RUN_FIXTURES[status];
    const steps = r.steps || F.steps || [];
    const P = K();
    const t = (worker && worker.today) || {};
    // V2's 'Credits will be refreshed tomorrow.' names no time (section 47): the outcome ends at
    // the fact, and the day line says what short credits cost today.
    const credits = r.dayStatus || (worker && P.creditsDay ? P.creditsDay(worker) : 'stopped');
    const outcome = r.outcome != null ? r.outcome
      : status === 'expired' ? P.DAY_COPY.expired(r.retryBy || t.retryBy || (t.ask && t.ask.expires)) : F.outcome;
    const dayText = r.dayText != null ? r.dayText : dayLine(status, r, worker, credits);
    const lost = status === 'nocredits' && credits === 'stopped';
    const dayTick = status === 'nocredits' ? (lost ? 'notcounted' : null) : S.tick;
    const dayTone = lost ? 'danger' : S.dayTone;
    // On Run detail the Verification card says verified or not counted; the badge says the run.
    const badge = full && (status === 'verified' || status === 'rejected') ? ['neutral', 'Done'] : S.badge;
    const note = r.note !== undefined ? r.note : F.note;
    const action = r.action !== undefined ? r.action : S.action;
    const [open, setOpen] = useState(!!defaultExpanded);
    const listId = useId();

    let live = null;
    if (status === 'running') {
      live = (
        <div className="v2-run-live">
          <P.Spinner size={16} delay={0} />
          <span>{r.current || F.current}</span>
        </div>
      );
    } else if (status === 'waiting') {
      live = (
        <div className="v2-run-live">
          <span className="v2-chat-tone--attention"><Icon name="help" size={16} /></span>
          <span>Waiting for your answer since {r.since || F.since}</span>
        </div>
      );
    }

    return (
      <div className={cx('v2-msg', 'v2-msg--worker', full && 'is-full')}>
        <article className={cx('v2-run', 'v2-text-body', 'v2-run--' + status, full && 'is-full', className)} aria-label={(r.title || 'Today’s run') + ', ' + badge[1]}>
          <header className="v2-run-head">
            <p className="v2-run-title v2-text-title-sm">
              {r.title || 'Today’s run'}
              <span className="v2-run-time v2-text-meta">{r.startedAt || '11:02 am'}</span>
            </p>
            <P.Badge tone={badge[0]} busy={!!S.busy}>{badge[1]}</P.Badge>
          </header>

          {live}

          {steps.length ? (
            <div className="v2-run-steps-wrap">
              <button type="button" className="v2-run-toggle" aria-expanded={open} aria-controls={listId}
                onClick={function () { setOpen(!open); }}>
                <span className="v2-run-chev"><Icon name="chevron-down" size={16} /></span>
                {steps.length === 1 ? '1 step done' : steps.length + ' steps done'}
              </button>
              <ol className="v2-run-steps" id={listId} hidden={!open}>
                {steps.map(function (s, i) {
                  const failed = s.status === 'failed';
                  return (
                    <li className="v2-run-step" key={i}>
                      <span className={failed ? 'v2-chat-tone--danger' : 'v2-chat-tone--neutral'}><Icon name={failed ? 'x-circle' : 'check'} size={16} /></span>
                      <span>{s.label}</span>
                      <span className="v2-run-step-time v2-text-meta">{s.time}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          ) : null}

          {outcome && S.outcome ? (
            <div className="v2-run-outcome">
              <span className={'v2-run-icon v2-chat-tone--' + S.outcome[1]}><Icon name={S.outcome[0]} size={16} /></span>
              <p className="v2-run-outcome-text">{outcome}</p>
            </div>
          ) : null}

          {dayText ? (
            <div className={cx('v2-run-day', dayTone && 'v2-run-day--' + dayTone)}>
              {dayTick ? <span className="v2-run-tick" aria-hidden="true"><Tick status={dayTick} /></span> : null}
              <span>{dayText}</span>
            </div>
          ) : null}
          {dayText && note ? <p className="v2-text-body-sm">{note}</p> : null}

          {action || (onOpenDetail && FINISHED[status]) ? (
            <div className="v2-run-actions">
              {action ? (
                <P.Button variant={action[2]} size="md" onClick={function () { if (onAction) onAction(action[0]); }}>{action[1]}</P.Button>
              ) : null}
              {onOpenDetail && FINISHED[status] ? (
                <P.Link standalone onClick={onOpenDetail}>See run details</P.Link>
              ) : null}
            </div>
          ) : null}
        </article>
        {feedback || null}
      </div>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { RunCard, RUN_FIXTURES, RUN_STATUSES: Object.keys(STATUS), runDayText });
})();
