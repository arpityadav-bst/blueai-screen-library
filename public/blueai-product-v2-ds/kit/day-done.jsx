/* BlueAI Product V2 Design System: the day-done moment (section 44).
   DayDone {worker, open, onClose, preview}
     The one milestone of the program: Day 20, the last day, which also carries the next step (cash
     out). An ordinary day has no moment: the RunCard's day line ('Day 7 of 20, pending
     verification', section 36), the WorkerCard's done line and the run chip close it, so a
     blocking dialog after every run would only repeat them (the PM's job and nojob titles are
     dropped as a proposal, section 73; V2 opens it after every run).
     worker   the Worker record; numbers() gives the one count (V2: 'DAY 7 OF 20' then 'Day 6 of
              20', R02).
     open     shows the kit Dialog (celebration variant, size sm). preview draws it open in place
              without taking focus (guide specimens; give it a positioned parent).
   One count, one status line. Pending stays blue with one tick until verified (P2: green means
   reached), and so does the confetti: blue and neutral only, once, never under reduced motion.
   The title and sub are the PM's DRAFT strings, quoted (worker_day_done.jsx:93); the sub's
   'every day for this month' goes to the PM as a proposal ('That's all 20 days.', section 73).
   One proposed next-step line: cash out after the period, with the $10 minimum, the one amount
   that holds under both options of decision D3 (section 01). */
(function () {
  const K = () => window.V2Kit || {};

  const COPY = { title: 'Day 20 done.', sub: 'That’s every day for this month.' };
  // Proposed: what comes after the last day, so the moment does not end on 'every day'.
  const NEXT = function (endsOn) { return 'Cash out on Earnings after ' + endsOn + ', once your days are verified ($10 minimum).'; };
  const PENDING = 'Pending verification';
  const VERIFY_NOTE = 'We check every run within a day. The tick doubles once it’s verified.';

  // A fixed burst, so every render is the same (V2 rolls Math.random per mount). The day is still
  // pending, so the bits are the pending blues and a neutral mark: no green, no yellow (P2).
  const BITS = [
    [-96, -36, '--v2-blue', 0, 140], [-64, -64, '--v2-ink-4', 40, -90], [-30, -52, '--v2-action', 80, 200],
    [8, -70, '--v2-action', 20, -160], [40, -58, '--v2-ink-4', 60, 120], [76, -62, '--v2-blue', 100, -60],
    [104, -28, '--v2-action', 30, 180], [-112, 12, '--v2-ink-4', 120, -140], [118, 16, '--v2-blue', 90, 90],
    [-56, 44, '--v2-action', 150, 60], [60, 40, '--v2-blue', 170, -120], [-10, 64, '--v2-ink-4', 110, 150],
  ];
  function Confetti() {
    return (
      <span className="v2-confetti" aria-hidden="true">
        {BITS.map(function (b, i) {
          return <i key={i} style={{ '--tx': b[0] + 'px', '--ty': b[1] + 'px', '--c': 'var(' + b[2] + ')', '--d': b[3] + 'ms', '--r': b[4] + 'deg' }} />;
        })}
      </span>
    );
  }

  function DayDoneBody({ worker, titleId }) {
    const w = worker || (K().workerFixtures || {}).day20;
    const n = K().numbers(w);
    const T = K().StatusTick;
    const Bar = K().DayBar;
    return (
      <div className="v2-daydone">
        <Confetti />
        <span className="v2-daydone-badge" aria-hidden="true">{T ? <T status="pending" size={28} /> : null}</span>
        <h2 className="v2-daydone-title v2-text-title-lg" id={titleId}>{COPY.title}</h2>
        <p className="v2-daydone-sub v2-text-body-sm">{COPY.sub}</p>
        <p className="v2-daydone-sub v2-text-body-sm">{NEXT(n.endsOn)}</p>
        <div className="v2-daydone-progress">
          {Bar ? <Bar days={n.segments} target={n.target} legend={false} /> : null}
          <div className="v2-daydone-count">
            <span className="v2-text-body-sm"><strong className="v2-tabular">{n.done}</strong> of {n.target} days</span>
            {T ? <T status="pending" size={14} label={PENDING} /> : <span>{PENDING}</span>}
          </div>
        </div>
        <p className="v2-text-body-sm">{VERIFY_NOTE}</p>
      </div>
    );
  }

  let seq = 0;
  // The kit Dialog's celebration variant: centred, no close button, scrim and Esc dismiss, one
  // full-width Got it. The title sits under the badge, so the dialog is labelled by it.
  function DayDone({ worker, open, onClose, preview }) {
    const [titleId] = React.useState(function () { seq += 1; return 'v2-daydone-title-' + seq; });
    const D = K().Dialog;
    if (!D || !(open || preview)) return null;
    return (
      <D open variant="celebration" size="sm" preview={preview} onClose={onClose} labelledBy={titleId}
        actions={[{ label: 'Got it', variant: 'primary', onClick: onClose }]}>
        <DayDoneBody worker={worker} titleId={titleId} />
      </D>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { DayDone });
})();
