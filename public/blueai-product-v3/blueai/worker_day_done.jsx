/* BlueAI: the "day done" moment (Oct 2026 worker sheet, row 2 Phase 1: "show something to the
   user so that user can see that today's work is done"; row 24's stage messages ride on the same
   card). Built 2026-10-12.

   Money rule under review (sheet rows 2, 3, 30): $1 credited at the end of each successful day,
   up to 20 days, plus a $10 bonus at day 20; cash out from $10 when the period ends; a successful
   day = a verified job, or a completed run on a day with no job available. Every string here is
   a DRAFT until Abhisht approves it.

   TICKS (Abhisht's feedback, 2026-10-12): a run is verified within a day, so it cannot be
   "complete" the moment it ends. Like a messaging app: ONE tick = the run is done and submitted,
   pending verification; TWO ticks = verified, the day counts and the money is in. Today's day
   shows one tick; the next morning it shows two. The 20-day bar lives on the worker home
   (EarningsStrip): verified days solid, the pending one outlined.

   THE MOMENT itself appears in the CENTRE of the window, like a game's "quest complete" screen
   (DayDoneOverlay), and that is the whole message. MINIMAL since 2026-10-14 (Arpit): one small
   tick, the title, one status line, Got it. Three options, the Preview panel's "Card" row:
     money   the status line leads with the dollar: "+$1 · Day 7 of 20 · Pending verification".
     days    the same with no money on it: "Day 7 of 20 · Pending verification".
     plain   no overlay and no card. The closing line gets one more sentence, so it ships as a
             copy change in the skill.

   Surfaces:
     DayDoneOverlay the centre moment, dismissed with Got it (not for failed or declined, not plain).
     DayDoneCard    what the thread keeps after the run closes: nothing for a counted day (job,
                    nojob, day20 are said by the overlay), a status line for declined, the yellow
                    Retry / Not now question for failed. The thread card was dropped 2026-10-12.
     EarningsStrip  the 20-day progress line, on the worker home for a returning person and on the
                    Jobs tab, read from today's real state (review round 1): before today's run,
                    yesterday's two ticks; once today's run has closed, today's day as the pending
                    segment and its one-tick receipt, or what a skipped or failed day means
                    (hidden in the plain option).
     doneLine       the run's closing line; the plain option's extra sentence lives here.
     toastFor(end)  the words the Windows notification carries when a SCHEDULED run ends with
                    nobody watching (desktop_toast.jsx draws it).

   Exposes window.WorkerDayDone = { DayDoneOverlay, DayDoneCard, EarningsStrip, ENDS, STYLES,
   getEnd, setEnd, getStyle, setStyle, setToday, numbers, doneLine, toastFor }. */
(function () {
  const { useState } = React;
  const RULE = { rate: 1, target: 20, bonus: 10, programEnd: 'Nov 1' };
  const DONE_BEFORE = 6;        // days already verified before today's run (19 for the Day 20 case)
  /* V3 (phase 4, worker.css; the dialog is the kit's since review round 1): today's day is PENDING, so its marks are the progress blue (the
     site's step disc, an outlined segment); green arrives only with the second tick, when the day
     is verified. Money stays ink. */

  // The preview's picks: how today's run ends, and which option draws it. Numbers derive from them.
  let end = 'job', style = 'days';   // days-led ships (Abhisht, 2026-10-12): no money on the message
  const ENDS = [['Job done', 'job'], ['No job', 'nojob'], ['Day 20', 'day20'], ['Failed', 'failed']];
  const STYLES = [['Days', 'days'], ['Money', 'money'], ['Plain', 'plain']];
  const getEnd = () => end;
  const setEnd = (v) => { end = ENDS.some(([, id]) => id === v) ? v : 'job'; };
  const getStyle = () => style;
  const setStyle = (v) => { style = STYLES.some(([, id]) => id === v) ? v : 'days'; };
  /* How today's run closed, once it has: the end its day-done step carried (job, nojob, day20,
     declined, failed), null while it has not run or is still running (worker_flow.jsx resets it
     when a run starts, chat_product.jsx sets it when the step shows). */
  let today = null;
  const setToday = (v) => { today = v || null; };

  function numbers(e = end) {
    const verified = e === 'day20' ? RULE.target - 1 : DONE_BEFORE;   // every earlier day is verified by now
    const counted = e === 'job' || e === 'nojob' || e === 'day20';
    const pending = counted ? 1 : 0;                                    // today's day, one tick
    const day = verified + pending;
    const bonus = day >= RULE.target ? RULE.bonus : 0;
    return { ...RULE, verified, pending, counted, day, toGo: RULE.target - day, gained: counted ? RULE.rate + (e === 'day20' ? RULE.bonus : 0) : 0, balance: day * RULE.rate + bonus };
  }
  const money = (n) => '$' + n;

  /* One tick or two, in the colour of the text around it. 16 or 20 tall; a tick is mark geometry,
     so its stroke renders 2px at every size (48 / size in the 24-unit glyph, design-md 08). */
  function Tick({ double, size = 16 }) {
    return (
      <svg width={double ? Math.round(size * 1.4) : size} height={size} viewBox={double ? '0 0 34 24' : '0 0 24 24'} fill="none" stroke="currentColor" strokeWidth={48 / size} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, display: 'inline-block', verticalAlign: '-2px' }}>
        {double ? <><polyline points="18 6 7 17 2 12" /><polyline points="30 6 19 17 15.5 13.5" /></> : <polyline points="20 6 9 17 4 12" />}
      </svg>);
  }


  // Titles. A sub given per style differs between the money and days options.
  const COPY = {
    job:      { title: 'Today’s run is done.' },
    nojob:    { title: 'No paid job today, but your run counts.' },
    day20:    { title: 'Day 20 done.', sub: { money: 'This month’s $30 is yours once it’s verified.', days: 'That’s every day for this month.' } },
    failed:   { title: 'Today’s job didn’t finish.', sub: 'Retry to count the day.' },   // the reason is in the fail bubble above it
    declined: { title: 'Run finished without a job.', sub: 'Today doesn’t count toward your 20 days.' }
  };
  const PENDING = 'Pending verification';
  const VERIFY_NOTE = 'We check every run within a day. The tick doubles once it’s verified.';

  /* The run's closing line. Live copy as is; the plain option adds the one sentence that says the
     day is complete and nothing more is needed. */
  function doneLine(e, jobTitle) {
    const live = 'Done. I finished “' + jobTitle + '” and submitted the job.';
    if (style !== 'plain') return live;
    return live + (e === 'day20'
      ? ' That’s day 20. You’ve completed this month’s program, nothing more to do. We’ll verify the run by tomorrow.'
      : ' That’s it for today. Nothing more to do until tomorrow’s run. We’ll verify today’s run by then.');
  }

  /* What the THREAD keeps once the run has closed (Abhisht, 2026-10-12: no "Today's run is done"
     card in the thread, the centre message is enough; Arpit takes the look and the Earnings
     integration from here). A counted day leaves nothing beyond the closing line; no job leaves one
     status line (the plain option says it in a closing bubble instead); declined leaves one status
     line; failed is the usual yellow worker question with Retry / Not now. */
  const PLAIN = {
    nojob: 'No paid job today, but your run still counts. That’s it for today, nothing more to do until tomorrow’s run.',
    nojobLine: 'Your run still counts for today.',
    declined: 'Today doesn’t count toward your program days.'
  };
  function DayDoneCard({ step, answer, onAnswer }) {
    const B = window.ChatBubbles;
    if (step.end === 'failed') return React.createElement(window.WorkerCards.AskBubble, { step: { ...step, title: COPY.failed.title, lead: COPY.failed.sub }, answer, onAnswer });
    if (step.end === 'nojob') return style === 'plain'
      ? React.createElement(B.FinalBubble, { msg: { tone: 'success', content: PLAIN.nojob }, feedback: null })
      : React.createElement(B.StatusBubble, { content: PLAIN.nojobLine });
    if (step.end === 'declined') return React.createElement(B.StatusBubble, { content: PLAIN.declined });
    return null;
  }

  /* The centre moment, MINIMAL (Arpit, 2026-10-14). It used to say the day three times (an
     eyebrow, a big "7 of 20 days", the 20-day bar) and draw the tick four times (badge, pending
     line, both legend entries). Now: one small tick, the title, one status line, Got it. The bar
     lives on the worker home. What "pending" means is explained only the first time the moment
     shows in a session, while the ticks are new; after that the status line is enough. */
  let explained = false;
  /* The kit's focus hook (shared.jsx DialogPanel): focus moves in, Tab stays inside, Esc answers
     Got it, focus returns (review round 1). */
  function DayDoneOverlay({ step, onClose }) {
    const [explain] = useState(() => { const first = !explained; explained = true; return first; });
    if (style === 'plain' || !step || step.end === 'failed' || step.end === 'declined') return null;
    const e = step.end, n = numbers(e), c = COPY[e];
    const sub = c.sub && typeof c.sub === 'object' ? c.sub[style] : c.sub;
    // The money option leads with the dollar as the line's one bold ink figure (brief section 9).
    const status = (e === 'day20' ? '' : 'Day ' + n.day + ' of ' + n.target + ' · ') + PENDING;
    return (
      <div className="v2-overlay v2-overlay--center v3-dd">
        <div className="v2-scrim" onClick={onClose} aria-hidden="true" />
        <DialogPanel onEscape={onClose} label={c.title} className="v2-dialog v2-dialog--sm v2-dialog--center">
          <div className="v2-dialog-body">
            <span className="v3-dd-badge"><Tick size={20} /></span>
            <p className="v2-text-title-dialog v3-dd-title">{c.title}</p>
            {sub && <p className="v2-text-body-sm v3-dd-sub">{sub}</p>}
            <p className="v2-text-body-sm v3-dd-status">{style === 'money' && <><span className="v3-figure">{'+' + money(n.gained)}</span>{' · '}</>}{status}</p>
            {explain && <p className="v2-text-meta v3-dd-note">{VERIFY_NOTE}</p>}
            <button type="button" onClick={onClose} className="v2-button v2-button--primary v2-button--lg v2-button--full v3-dd-cta">Got it</button>
          </div>
        </DialogPanel>
      </div>);
  }

  /* The 20-day strip (worker home for a returning person, and the Jobs tab), MINIMAL since
     2026-10-14 (Arpit): the day and Earnings on one row, 20 thin segments (one per program day,
     the partner's own unit), one quiet receipt line. Read from today's real state (review round
     1, the kit's ProgramStrip receipts, design-md 43): verified days solid; once today's run has
     counted, today is the pending segment and the receipt says so with one tick; a skipped or
     failed day says what it means; before today's run, yesterday's two ticks. No amber bonus
     segment: nothing on this card talks about money. */
  const RECEIPT = {
    pending: 'Today’s run is pending verification.',
    declined: 'Today doesn’t count toward your 20 days.',
    failed: 'Today’s job didn’t finish. Retry to count the day.',
    verified: 'Yesterday’s run verified.'
  };
  function EarningsStrip() {
    if (style === 'plain') return null;
    const counted = today === 'job' || today === 'nojob' || today === 'day20';
    const verified = numbers(end).verified;
    const day = verified + (counted ? 1 : 0);
    const state = counted ? 'pending' : (today === 'declined' || today === 'failed' ? today : 'verified');
    return (
      <div className="v2-card v3-progress">
        <div className="v3-progress-head">
          <span className="v3-progress-title">Day {day} of {RULE.target}{style === 'money' && <span> · <span className="v3-figure">{money(day * RULE.rate + (day >= RULE.target ? RULE.bonus : 0))}</span> earned</span>}</span>
          <a href={window.BlueAILinks.dashboard} target="_blank" rel="noopener" className="v2-link v3-progress-link"><span className="v2-link-text">Earnings ↗</span></a>
        </div>
        <div className="v3-segs" aria-hidden="true">{Array.from({ length: RULE.target }, (_, i) => <span key={i} className={'v3-seg' + (i < verified ? ' v3-seg--done' : (i < day ? ' v3-seg--pending' : ''))} />)}</div>
        <p className="v2-text-caption v3-progress-note">
          {state === 'verified' && <span className="v3-verified"><Tick double /></span>}
          {state === 'pending' && <Tick />}
          {RECEIPT[state]}
        </p>
      </div>);
  }

  // The Windows notification for a scheduled run (nobody watching). `declined` never toasts: the
  // person was there to decline.
  function toastFor(e) {
    const n = numbers(e);
    const dayLine = 'Day ' + n.day + ' of ' + n.target + '.';
    const body = {
      money: { job: money(n.gained) + ' pending verification. ' + dayLine, nojob: money(n.gained) + ' pending verification. ' + dayLine, day20: money(n.bonus) + ' bonus pending verification. ' + money(n.balance) + ' this month.' },
      days:  { job: dayLine + ' Pending verification.', nojob: dayLine + ' Pending verification.', day20: 'All 20 days done, pending verification.' },
      plain: { job: 'Nothing more to do until tomorrow’s run.', nojob: 'Nothing more to do until tomorrow’s run.', day20: 'You’ve completed this month’s program.' }
    }[style];
    return {
      job:    { title: 'Today’s run is done.', body: body.job },
      nojob:  { title: 'Your run counts today.', body: body.nojob },
      day20:  { title: 'Day 20 done.', body: body.day20 },
      failed: { title: 'Today’s job didn’t finish.', body: 'Open BlueAI to retry and count the day.' }
    }[e] || null;
  }

  window.WorkerDayDone = { DayDoneOverlay, DayDoneCard, EarningsStrip, ENDS, STYLES, getEnd, setEnd, getStyle, setStyle, setToday, numbers, doneLine, toastFor };
})();
