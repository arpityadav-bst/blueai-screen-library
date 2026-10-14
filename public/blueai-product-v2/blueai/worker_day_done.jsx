/* BlueAI: the "day done" moment (Oct 2026 worker sheet, row 2 Phase 1: "show something to the
   user so that user can see that today's work is done"; row 24's stage messages ride on the same
   card). Built 2026-10-12.

   A successful day = a verified job, or a completed run on a day with no job available. Strings
   are DRAFT unless marked approved.

   TICKS (Abhisht's feedback, 2026-10-12): a run is verified within a day, so it cannot be
   "complete" the moment it ends. Like a messaging app: ONE tick = the run is done and submitted,
   pending verification; TWO ticks = verified, the day counts. Day-by-day progress lives on the
   partner dashboard as pills: outlined while a run is pending, filled once it is verified.

   THE MOMENT itself appears in the CENTRE of the window, like a game's "quest complete" screen
   (DayDoneOverlay), and that is the whole message: days-led, no money (Abhisht, 2026-10-12). The
   Money and Plain options (and the Preview's Card row) were removed 2026-10-14: Days is the one.

   LOOK (2026-10-14): styled to Arpit's design system, "V2 today" look, values from v2_tokens.jsx:
   DS 44 Day done (celebration dialog sm 320, badge 56, confetti only on Day 20 in blue and
   neutral), 43 Program progress (StatusTick only, both ticks green since 2026-10-14), 25 Dialog,
   11 Button. Flows are unchanged.

   Surfaces:
     DayDoneOverlay the centre moment, dismissed with Got it (not for failed or declined).
     DayDoneCard    what the thread keeps after the run closes: nothing for a counted day (job,
                    day20 are said by the overlay), a status line for no job and for declined, the
                    yellow Retry / Not now question for failed. The thread card was dropped 2026-10-12.
     doneLine       the run's closing line.
     toastFor(end)  the words the Windows notification carries when a SCHEDULED run ends with
                    nobody watching (desktop_toast.jsx draws it).

   Exposes window.WorkerDayDone = { DayDoneOverlay, DayDoneCard, ENDS, getEnd, setEnd, numbers,
   doneLine, toastFor, failedAsk }. */
(function () {
  const T = () => window.V2Tokens;
  const RULE = { target: 20, programEnd: 'Nov 1' };
  const DONE_BEFORE = 6;        // days already verified before today's run (19 for the Day 20 case)

  // The preview's pick: how today's run ends. Numbers derive from it.
  let end = 'job';
  const ENDS = [['Job done', 'job'], ['No job', 'nojob'], ['Day 20', 'day20'], ['Failed', 'failed']];
  const getEnd = () => end;
  const setEnd = (v) => { end = ENDS.some(([, id]) => id === v) ? v : 'job'; };

  function numbers(e = end) {
    const verified = e === 'day20' ? RULE.target - 1 : DONE_BEFORE;   // every earlier day is verified by now
    const counted = e === 'job' || e === 'nojob' || e === 'day20';
    const pending = counted ? 1 : 0;                                    // today's day, one tick
    return { ...RULE, verified, pending, counted, day: verified + pending };
  }

  /* StatusTick: one tick pending, two ticks verified, both GREEN (Abhisht, 2026-10-14: "Keep the
     ticks green"; this overrides DS 43's grey pending tick). The number of ticks carries the state,
     not the colour. Colour on the glyph only; `color` overrides it. */
  function Tick({ status = 'pending', color, size = 14 }) {
    const t = T();
    const double = status === 'verified';
    const c = color || t.success;
    return (
      <svg width={double ? Math.round(size * 1.4) : size} height={size} viewBox={double ? '0 0 34 24' : '0 0 24 24'} fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'inline-block', verticalAlign: '-2px' }} role="img" aria-label={double ? 'Verified' : 'Pending verification'}>
        {double ? <><polyline points="18 6 7 17 2 12" /><polyline points="30 6 19 17 15.5 13.5" /></> : <polyline points="20 6 9 17 4 12" />}
      </svg>);
  }

  // Titles. "Today’s run is done." is APPROVED (Abhisht, 2026-10-14).
  const COPY = {
    job:      { title: 'Today’s run is done.' },
    nojob:    { title: 'No paid job today, but your run counts.' },
    day20:    { title: 'Day 20 done.' },
    failed:   { title: 'Today’s job didn’t finish.', sub: 'Retry to count the day.' },   // the reason is in the fail bubble above it
    declined: { title: 'Run finished without a job.', sub: 'Today doesn’t count toward your 20 days.' }
  };

  // The run's closing line: live copy as is.
  const doneLine = (e, jobTitle) => 'Done. I finished “' + jobTitle + '” and submitted the job.';

  // The failed day's Retry / Not now question, with its words; the docked answer panel reads them too.
  const failedAsk = (step) => ({ ...step, title: COPY.failed.title, lead: COPY.failed.sub });

  /* What the THREAD keeps once the run has closed (Abhisht, 2026-10-12: no "Today's run is done"
     card in the thread, the centre message is enough). A counted day leaves nothing beyond the
     closing line; no job and declined leave one status line each; failed is the yellow worker
     question with Retry / Not now. */
  const LINES = {
    nojob: 'Your run still counts for today.',
    declined: 'Today doesn’t count toward your program days.'
  };
  function DayDoneCard({ step, answer, onAnswer }) {
    const B = window.ChatBubbles;
    if (step.end === 'failed') return React.createElement(window.WorkerCards.AskBubble, { step: failedAsk(step), answer, onAnswer });
    if (LINES[step.end]) return React.createElement(B.StatusBubble, { content: LINES[step.end] });
    return null;
  }

  /* The status line under the title. APPROVED (Abhisht, 2026-10-14), carry verbatim:
     "Day 7 of 20. Pending verification" (no full stop). The popup is the title and this line
     only. The Day 20 line is a draft, in the same pattern; it no longer says when cash out opens,
     since cash out has no period lock (Abhisht, 2026-10-14). */
  const statusLine = (e, n) => (e === 'day20'
    ? 'All 20 days done. Pending verification'
    : 'Day ' + n.day + ' of ' + n.target + '. Pending verification');

  /* Confetti, Day 20 only (DS 44): 12 fixed bits in blue and neutral, never green or yellow while
     the day is pending, once, about 900ms. */
  const BITS = [[-96, -36, 'blue', 0], [-64, -64, 'ink4', 40], [-30, -52, 'action', 80], [8, -70, 'action', 20], [40, -58, 'ink4', 60], [76, -62, 'blue', 100],
    [104, -28, 'action', 30], [-112, 12, 'ink4', 120], [118, 16, 'blue', 90], [-56, 44, 'action', 150], [60, 40, 'blue', 170], [-10, 64, 'ink4', 110]];
  const Confetti = () => {
    const t = T();
    return <>{BITS.map((b, i) => <span key={i} aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 48, width: 6, height: 6, borderRadius: 2, background: t[b[2]], '--tx': b[0] + 'px', '--ty': b[1] + 'px', animation: 'ba-cfetti 900ms ease-out ' + b[3] + 'ms both', pointerEvents: 'none' }} />)}</>;
  };

  /* The centre moment, MINIMAL (Arpit's structure, 2026-10-14; Abhisht adopted it the same day):
     one tick badge, the title, one status line, Got it. No eyebrow, no big count, no bar. Drawn as
     the design system's celebration dialog (sm 320, dim scrim, 1px line, radius lg, shadow-2,
     scale-in). Badge (Abhisht, 2026-10-14): an OUTLINED circle, not a filled one, a 2px green ring
     on white with ONE green tick inside, since the run is pending, not yet verified. */
  function DayDoneOverlay({ step, onClose }) {
    if (!step || step.end === 'failed' || step.end === 'declined') return null;
    const t = T();
    const e = step.end, c = COPY[e];
    // Day 1 (the onboarding run) is the first day: nothing verified before it.
    const n = step.day1 ? { ...numbers(e), verified: 0, pending: 1, day: 1 } : numbers(e);
    return (
      <div style={{ position: 'absolute', inset: 0, zIndex: t.zDialog, background: t.scrim, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, animation: 'baMsgIn ' + t.dur3 + 'ms ' + t.easeStandard + ' both' }} onClick={onClose}>
        <style>{'@keyframes ddScaleIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: none; } }'}</style>
        <div role="dialog" aria-modal="true" aria-label={c.title} onClick={(ev) => ev.stopPropagation()}
          style={{ position: 'relative', width: '100%', maxWidth: t.dialogSm, background: t.surface, border: t.stroke + 'px solid ' + t.line, borderRadius: t.radiusLg, padding: '24px 20px 20px', textAlign: 'center', boxShadow: t.shadow2, animation: 'ddScaleIn ' + t.dur4 + 'ms ' + t.easeOut + ' both', overflow: 'hidden' }}>
          {e === 'day20' && <Confetti />}
          <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', width: t.markXl, height: t.markXl, margin: '0 auto', borderRadius: t.radiusRound, background: t.surface, border: '2px solid ' + t.success, animation: 'ddScaleIn ' + t.durCelebrate + 'ms ' + t.easeOut + ' both' }}><Tick size={26} /></span>
          <p style={{ fontSize: t.text20, fontWeight: t.wSemibold, color: t.ink, lineHeight: t.leadingTight, letterSpacing: t.trackingTitle, marginTop: 14 }}>{c.title}</p>
          <p style={{ fontSize: t.text14, color: t.ink2, lineHeight: t.leadingBody, marginTop: 6 }}>{statusLine(e, n)}</p>
          <button onClick={onClose} style={{ display: 'block', width: '100%', height: t.controlLg, marginTop: 18, background: t.action, border: t.stroke + 'px solid ' + t.action, borderRadius: t.radiusSm, fontSize: t.text13, fontWeight: t.wMedium, color: t.onColor, cursor: 'pointer', fontFamily: 'inherit', transition: 'background ' + t.dur1 + 'ms ' + t.easeStandard }}
            onMouseEnter={(ev) => { ev.currentTarget.style.background = t.actionHover; }} onMouseLeave={(ev) => { ev.currentTarget.style.background = t.action; }}>Got it</button>
        </div>
      </div>);
  }

  // The Windows notification for a scheduled run (nobody watching). `declined` never toasts: the
  // person was there to decline.
  function toastFor(e) {
    const n = numbers(e);
    const dayLine = 'Day ' + n.day + ' of ' + n.target + '.';
    return {
      job:    { title: 'Today’s run is done.', body: dayLine + ' Pending verification.' },
      nojob:  { title: 'Your run counts today.', body: dayLine + ' Pending verification.' },
      day20:  { title: 'Day 20 done.', body: 'All 20 days done, pending verification.' },
      failed: { title: 'Today’s job didn’t finish.', body: 'Open BlueAI to retry and count the day.' }
    }[e] || null;
  }

  window.WorkerDayDone = { DayDoneOverlay, DayDoneCard, ENDS, getEnd, setEnd, numbers, doneLine, toastFor, failedAsk };
})();
