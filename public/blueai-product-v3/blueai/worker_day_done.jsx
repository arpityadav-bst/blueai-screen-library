/* BlueAI: the "day done" moment (Oct 2026 worker sheet, row 2 Phase 1: "show something to the
   user so that user can see that today's work is done"; row 24's stage messages ride on the same
   card). Built 2026-10-12.

   A successful day = a verified job, or a completed run on a day with no job available. Strings are
   DRAFT unless marked approved.

   TICKS (Abhisht's feedback, 2026-10-12): a run is verified within a day, so it cannot be
   "complete" the moment it ends. Like a messaging app: ONE tick = the run is done and submitted,
   pending verification; TWO ticks = verified, the day counts. Day-by-day progress lives on the
   partner dashboard (Earnings in the More menu), not in the app (PM, 2026-10-14).

   THE MOMENT itself appears in the CENTRE of the window, like a game's "quest complete" screen
   (DayDoneOverlay), and that is the whole message: days-led, no money. MINIMAL (PM, 2026-10-14):
   an outlined green circle with one green tick, the title, one status line, Got it. Day 1 (the
   setup run) shows it too; confetti on Day 20 only.

   Surfaces:
     DayDoneOverlay the centre moment, dismissed with Got it (not for failed or declined).
     DayDoneCard    what the thread keeps after the run closes: nothing for a counted day (job,
                    day20 are said by the overlay), a status line for no job and for declined, the
                    Retry / Not now question for failed.
     doneLine       the run's closing line.
     toastFor(end)  the words the Windows notification carries when a SCHEDULED run needs the person
                    while they are away (desktop_toast.jsx draws it).

   Exposes window.WorkerDayDone = { DayDoneOverlay, DayDoneCard, ENDS, getEnd, setEnd, getToday,
   setToday, setVerified, numbers, doneLine, toastFor }. */
(function () {
  const RULE = { target: 20 };
  /* Days already verified before today's run (review round 2, R2: state, not a constant). 0 for a
     new partner, whose setup run is Day 1; the preview seeds a returning one with 6, and the Day 20
     case with 19 (index.html). */
  let verified = 0;
  const setVerified = (n) => { verified = Math.max(0, Math.min(RULE.target, n || 0)); };

  // The preview's pick: how today's run ends. Numbers derive from it.
  let end = 'job';
  const ENDS = [['Job done', 'job'], ['No job', 'nojob'], ['Day 20', 'day20'], ['Failed', 'failed']];
  const getEnd = () => end;
  const setEnd = (v) => { end = ENDS.some(([, id]) => id === v) ? v : 'job'; };
  /* How today's run closed, once it has: the end its day-done step carried (job, nojob, day20,
     declined, failed, nocredits), null while it has not run or is still running (worker_flow.jsx
     resets it when a run starts, chat_store.jsx sets it when the step shows). */
  let today = null;
  const getToday = () => today;
  const setToday = (v) => { today = v || null; };

  function numbers(e = end) {
    const counted = e === 'job' || e === 'nojob' || e === 'day20';
    return { ...RULE, verified, counted, day: verified + (counted ? 1 : 0) };   // today's day is the pending one
  }

  // One tick, in the colour of the text around it. A tick is mark geometry, so its stroke renders
  // 2px at every size (48 / size in the 24-unit glyph, design-md 08).
  const Tick = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={48 / size} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, display: 'block' }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>);

  // Titles. "Today’s run is done." is APPROVED (PM, 2026-10-14).
  const COPY = {
    job:      { title: 'Today’s run is done.' },
    nojob:    { title: 'No paid job today, but your run counts.' },
    day20:    { title: 'Day 20 done.' },
    failed:   { title: 'Today’s job didn’t finish.', sub: 'Retry to count the day.' },   // the reason is in the fail bubble above it
    declined: { title: 'Run finished without a job.', sub: 'Today doesn’t count toward your 20 days.' }
  };
  /* The status line under the title. APPROVED (PM, 2026-10-14), verbatim: "Day 7 of 20. Pending
     verification" (no full stop). The Day 20 line is a draft in the same pattern. */
  const statusLine = (e, n) => (e === 'day20' ? 'All 20 days done. Pending verification' : 'Day ' + n.day + ' of ' + n.target + '. Pending verification');

  // The run's closing line: live copy as is.
  const doneLine = (jobTitle) => 'Done. I finished “' + jobTitle + '” and submitted the job.';

  /* What the THREAD keeps once the run has closed (Abhisht, 2026-10-12: no "Today's run is done"
     card in the thread, the centre message is enough). A counted day leaves nothing beyond the
     closing line; no job and declined leave one status line each; failed is the worker question
     with Retry / Not now. */
  const LINES = {
    nojob: 'Your run still counts for today.',
    declined: 'Today doesn’t count toward your 20 days.'
  };
  function DayDoneCard({ step, answer, typed, onAnswer }) {
    const B = window.ChatBubbles;
    if (step.end === 'failed') return React.createElement(window.WorkerCards.AskBubble, { step: { ...step, title: COPY.failed.title, lead: COPY.failed.sub }, answer, typed, onAnswer });
    if (LINES[step.end]) return React.createElement(B.StatusBubble, { content: LINES[step.end] });
    return null;
  }

  /* Confetti, Day 20 only: the kit's burst (kit/worker.css .v2-confetti, section 44), 12 fixed bits
     in the pending blues and a neutral, once, hidden under reduced motion. */
  const BITS = [
    [-96, -36, '--v2-blue', 0, 140], [-64, -64, '--v2-ink-4', 40, -90], [-30, -52, '--v2-action', 80, 200],
    [8, -70, '--v2-action', 20, -160], [40, -58, '--v2-ink-4', 60, 120], [76, -62, '--v2-blue', 100, -60],
    [104, -28, '--v2-action', 30, 180], [-112, 12, '--v2-ink-4', 120, -140], [118, 16, '--v2-blue', 90, 90],
    [-56, 44, '--v2-action', 150, 60], [60, 40, '--v2-blue', 170, -120], [-10, 64, '--v2-ink-4', 110, 150]];
  const Confetti = () => (
    <span className="v2-confetti" aria-hidden="true">
      {BITS.map((b, i) => <i key={i} style={{ '--tx': b[0] + 'px', '--ty': b[1] + 'px', '--c': 'var(' + b[2] + ')', '--d': b[3] + 'ms', '--r': b[4] + 'deg' }} />)}
    </span>);

  /* The centre moment: the outlined green circle with ONE green tick (the run is pending, not yet
     verified), the title, the status line, Got it. Day 20 also offers Open Earnings, the secondary
     under Got it (R13), where the 20 days and cash out live. The kit's focus hook (shared.jsx
     DialogPanel): focus moves in, Tab stays inside, Esc answers Got it, focus returns. */
  function DayDoneOverlay({ step, onClose }) {
    if (!step || !COPY[step.end] || step.end === 'failed' || step.end === 'declined') return null;
    const e = step.end, n = numbers(e), c = COPY[e];
    return (
      <div className="v2-overlay v2-overlay--center v3-dd">
        <div className="v2-scrim" onClick={onClose} aria-hidden="true" />
        <DialogPanel onEscape={onClose} label={c.title} className="v2-dialog v2-dialog--sm v2-dialog--center">
          <div className="v2-dialog-body">
            {e === 'day20' && <Confetti />}
            <span className="v3-dd-badge"><Tick size={24} /></span>
            <p className="v2-text-title-dialog v3-dd-title">{c.title}</p>
            <p className="v2-text-body-sm v3-dd-status">{statusLine(e, n)}</p>
            <button type="button" onClick={onClose} className="v2-button v2-button--primary v2-button--lg v2-button--full v3-dd-cta">Got it</button>
            {e === 'day20' &&
              <a href={window.BlueAILinks.dashboard} target="_blank" rel="noopener" className="v2-button v2-button--secondary v2-button--lg v2-button--full v3-dd-cta2">
                Open Earnings<window.V2Kit.Icon name="external" /><span className="v2-sr-only"> (opens in a new tab)</span>
              </a>}
          </div>
        </DialogPanel>
      </div>);
  }

  /* The Windows notification for a scheduled run, raised only while the person is away from the app
     (index.html). `declined` never toasts: the person was there to decline. A job waiting for an
     answer (R8) and a run stopped by zero credits, with the countdown to the refill (R7), toast too. */
  function toastFor(e) {
    const n = numbers(e);
    const dayLine = 'Day ' + n.day + ' of ' + n.target + '.';
    const CP = window.CreditsPopupParts;
    const left = () => CP.formatLeft(CP.nextUtcMidnight(new Date()) - Date.now());
    if (e === 'nocredits') return { title: 'Today’s run stopped: out of credits.', body: 'Credits will be refreshed in ' + left() + '. Today won’t count toward your 20 days.' };
    return {
      job:     { title: 'Today’s run is done.', body: dayLine + ' Pending verification.' },
      nojob:   { title: 'Your run counts today.', body: dayLine + ' Pending verification.' },
      day20:   { title: 'Day 20 done.', body: 'All 20 days done, pending verification.' },
      failed:  { title: 'Today’s job didn’t finish.', body: 'Open BlueAI to retry and count the day.' },
      waiting: { title: 'A paid YouTube job is waiting for your OK.', body: 'Open BlueAI to answer. It’s held until ' + window.WorkerFlow.HOLD + '.' }
    }[e] || null;
  }

  window.WorkerDayDone = { DayDoneOverlay, DayDoneCard, ENDS, getEnd, setEnd, getToday, setToday, setVerified, numbers, doneLine, toastFor };
})();
