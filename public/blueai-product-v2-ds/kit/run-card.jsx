/* BlueAI Product V2 Design System: RunCard (section 36, New).
   One card per run answers the partner's question "is today done, and does it count": the live
   step, finished steps folded under a disclosure, the outcome, the day's status, one action.

   RunCard {run, state, onAction, onOpenDetail, feedback, full, defaultExpanded, className}
     run    {status, title, startedAt, current, since, steps: [{label, time, status}], outcome,
             dayText, day: {n, target}, action}   every field optional; a missing field falls back
             to the fixture for that status, so <RunCard state="failed" /> renders a whole card.
     state  shorthand for run.status: running | waiting | done-pending | verified | failed |
            stopped | nojob | nocredits, plus skipped and rejected for Run detail.
     onAction(kind)   'retry' (failed), 'credits' (nocredits), 'restart' (stopped).
     onOpenDetail()   shows 'See run details' on finished runs when given.
     full   fills its container (Run detail) instead of the 300px thread width.
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
     the day line, default action. */
  const STATUS = {
    running: { badge: ['info', 'Running'], busy: true },
    waiting: { badge: ['attention', 'Waiting for you'], dayTone: 'attention' },
    'done-pending': { badge: ['neutral', 'Done'], outcome: ['check', 'success'], tick: 'pending' },
    verified: { badge: ['success', 'Verified'], outcome: ['check', 'success'], tick: 'verified', dayTone: 'success' },
    failed: { badge: ['danger', 'Didn’t finish'], outcome: ['x-circle', 'danger'], tick: 'notcounted', action: ['retry', 'Try again', 'primary'] },
    stopped: { badge: ['neutral', 'Stopped'], outcome: ['stop', 'neutral'], tick: 'notcounted', action: ['restart', 'Run again', 'secondary'] },
    skipped: { badge: ['neutral', 'Skipped'], outcome: ['info', 'neutral'], tick: 'notcounted' },
    nojob: { badge: ['neutral', 'No job today'], outcome: ['info', 'neutral'], tick: 'pending' },
    nocredits: { badge: ['attention', 'Out of credits'], outcome: ['alert', 'attention'], tick: 'notcounted', action: ['credits', 'See AI credits', 'secondary'] },
    rejected: { badge: ['danger', 'Not verified'], outcome: ['x-circle', 'danger'], tick: 'rejected', dayTone: 'danger' },
  };

  const RUN_FIXTURES = {
    running: { steps: DONE_STEPS.slice(0, 3), current: 'Checking the jobs board…' },
    waiting: { steps: DONE_STEPS.slice(0, 4), since: '11:04 am', dayText: 'Answer by 9 pm or today won’t count.' },
    'done-pending': { steps: DONE_STEPS, outcome: 'Done. I finished “' + JOB + '” and submitted the job.', dayText: 'Day 7 of 20, pending verification' },
    verified: { steps: DONE_STEPS, outcome: 'Done. I finished “' + JOB + '” and submitted the job.', dayText: 'Day 7 of 20, verified' },
    failed: { steps: DONE_STEPS.slice(0, 5), outcome: 'I couldn’t finish “' + JOB + '”. App Player closed during the job.', dayText: 'Today doesn’t count yet. Try again before 9 pm.' },
    stopped: { steps: DONE_STEPS.slice(0, 3), outcome: 'You stopped the run at 11:04 am.', dayText: 'Today doesn’t count toward your 20 days.' },
    skipped: { steps: DONE_STEPS.slice(0, 4), outcome: 'You skipped today’s paid job.', dayText: 'Today doesn’t count toward your 20 days.' },
    nojob: { steps: DONE_STEPS.slice(0, 4), outcome: 'No paid job on the board today.', dayText: 'Day 7 of 20, pending verification' },
    nocredits: { steps: DONE_STEPS.slice(0, 5), outcome: 'Not enough credits for this job. Credits will be refreshed tomorrow.', dayText: 'Today doesn’t count yet. Credits refresh at 5:30 am.' },
    rejected: { steps: DONE_STEPS, outcome: 'Done. I finished “' + JOB + '” and submitted the job.', dayText: 'Day 7 not counted: the comment was removed before it was checked.' },
  };

  const ALIAS = { done: 'done-pending', pending: 'done-pending', 'no-job': 'nojob', 'no-credits': 'nocredits' };
  const FINISHED = { 'done-pending': 1, verified: 1, nojob: 1, rejected: 1, skipped: 1 };

  function Icon(props) { const I = K().Icon; return I ? <I {...props} /> : null; }

  /* StatusTick (section 43) draws the tick in its own colour; the day line's words say it, so the
     glyph is hidden from assistive tech here. */
  function Tick({ status }) {
    const T = K().StatusTick;
    return T ? <T status={status} size={14} /> : null;
  }

  function RunCard({ run, state, onAction, onOpenDetail, feedback, full, defaultExpanded, className }) {
    const r = run || {};
    const raw = state || r.status || 'running';
    const status = STATUS[raw] ? raw : (ALIAS[raw] || 'running');
    const S = STATUS[status];
    const F = RUN_FIXTURES[status];
    const steps = r.steps || F.steps || [];
    const outcome = r.outcome != null ? r.outcome : F.outcome;
    const dayText = r.dayText != null ? r.dayText : F.dayText;
    const action = r.action !== undefined ? r.action : S.action;
    const [open, setOpen] = useState(!!defaultExpanded);
    const listId = useId();
    const P = K();

    let live = null;
    if (status === 'running') {
      live = (
        <div className="v2-run-live">
          {P.Spinner ? <P.Spinner size={16} delay={0} /> : null}
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
        <article className={cx('v2-run', 'v2-run--' + status, full && 'is-full', className)} aria-label={(r.title || 'Today’s run') + ', ' + S.badge[1]}>
          <header className="v2-run-head">
            <p className="v2-run-title">
              {r.title || 'Today’s run'}
              <span className="v2-run-time">{r.startedAt || '11:02 am'}</span>
            </p>
            {P.Badge ? <P.Badge tone={S.badge[0]} busy={!!S.busy}>{S.badge[1]}</P.Badge> : <span>{S.badge[1]}</span>}
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
                      <span className="v2-run-step-time">{s.time}</span>
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
            <div className={cx('v2-run-day', S.dayTone && 'v2-run-day--' + S.dayTone)}>
              {S.tick ? <span className="v2-run-tick" aria-hidden="true"><Tick status={S.tick} /></span> : null}
              <span>{dayText}</span>
            </div>
          ) : null}

          {action || (onOpenDetail && FINISHED[status]) ? (
            <div className="v2-run-actions">
              {action && P.Button ? (
                <P.Button variant={action[2]} size="md" onClick={function () { if (onAction) onAction(action[0]); }}>{action[1]}</P.Button>
              ) : null}
              {onOpenDetail && FINISHED[status] ? (
                <button type="button" className="v2-run-link" onClick={onOpenDetail}>See run details</button>
              ) : null}
            </div>
          ) : null}
        </article>
        {feedback || null}
      </div>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { RunCard, RUN_FIXTURES, RUN_STATUSES: Object.keys(STATUS) });
})();
