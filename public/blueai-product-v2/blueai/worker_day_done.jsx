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
    const B = window.ChatBubbles; if (step.extra) return null;   // a "Run once more" job leaves only its closing line
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

  /* Confetti (DS 44: fixed pieces in blue and neutral, never green or yellow while the day is
     pending, once). EVERY counted day now gets a SMALL burst from the badge and Day 20 a BIG one
     that flies past the popup's edges (Abhisht, 2026-10-15: "I'm not able to see the confetti"; the
     old 12 6px bits that shrank as they flew read as specks). PopBurst draws it, below RunAgain. */
  const Confetti = ({ small }) => {
    const t = T();
    return <PopBurst t={t} small={!!small} />;
  };

  /* The centre moment, MINIMAL (Arpit's structure, 2026-10-14; Abhisht adopted it the same day):
     one tick badge, the title, one status line, Got it. No eyebrow, no big count, no bar. Drawn as
     the design system's celebration dialog (sm 320, dim scrim, 1px line, radius lg, shadow-2,
     scale-in). Badge (Abhisht, 2026-10-14): an OUTLINED circle, not a filled one, a 2px green ring
     on white with ONE green tick inside, since the run is pending, not yet verified. */
  function DayDoneOverlay({ step, onClose, onRunAgain }) {
    if (!step || step.end === 'failed' || step.end === 'declined') return null;
    const t = T();
    const e = step.end, c = step.extra ? { title: EXTRA_TITLE } : COPY[e];
    // Day 1 (the onboarding run) is the first day: nothing verified before it.
    const n = step.day1 ? { ...numbers(e), verified: 0, pending: 1, day: 1 } : numbers(e); const more = onRunAgain && (e === 'job' || e === 'day20') ? onRunAgain : null;
    return (
      <div style={{ position: 'absolute', inset: 0, zIndex: t.zDialog, background: t.scrim, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, animation: 'baMsgIn ' + t.dur3 + 'ms ' + t.easeStandard + ' both' }} onClick={onClose}>
        <style>{'@keyframes ddScaleIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: none; } }'}</style>
        <div role="dialog" aria-modal="true" aria-label={c.title} onClick={(ev) => ev.stopPropagation()}
          style={{ position: 'relative', width: '100%', maxWidth: t.dialogSm, background: t.surface, border: t.stroke + 'px solid ' + t.line, borderRadius: t.radiusLg, padding: '24px 20px 20px', textAlign: 'center', boxShadow: t.shadow2, animation: 'ddScaleIn ' + t.dur4 + 'ms ' + t.easeOut + ' both', overflow: 'visible' }}>
          {!step.extra && <>{e === 'day20' && <Confetti />}{e !== 'day20' && <Confetti small />}</>}
          <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', width: t.markXl, height: t.markXl, margin: '0 auto', borderRadius: t.radiusRound, background: t.surface, border: '2px solid ' + t.success, animation: 'ddScaleIn ' + t.durCelebrate + 'ms ' + t.easeOut + ' both' }}><Tick size={26} /></span>
          <p style={{ fontSize: t.text20, fontWeight: t.wSemibold, color: t.ink, lineHeight: t.leadingTight, letterSpacing: t.trackingTitle, marginTop: 14 }}>{c.title}</p>
          <p style={{ fontSize: t.text14, color: t.ink2, lineHeight: t.leadingBody, marginTop: 6 }}>{statusLine(e, n)}</p>
          {more && <RunAgain onRun={more} />}<button onClick={onClose} style={{ display: 'block', width: '100%', height: t.controlLg, marginTop: 18, background: t.action, border: t.stroke + 'px solid ' + t.action, borderRadius: t.radiusSm, fontSize: t.text13, fontWeight: t.wMedium, color: t.onColor, cursor: 'pointer', fontFamily: 'inherit', transition: 'background ' + t.dur1 + 'ms ' + t.easeStandard, ...(more ? { marginTop: 8, background: t.surface, border: t.stroke + 'px solid ' + t.lineStrong, color: t.ink } : {}) }}
            onMouseEnter={(ev) => { ev.currentTarget.style.background = more ? t.washHover : t.actionHover; }} onMouseLeave={(ev) => { ev.currentTarget.style.background = more ? t.surface : t.action; }}>Got it</button>
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

  /* RUN ONCE MORE (Abhisht, 2026-10-15; LOCAL TRIAL). A scheduled run often ends with nobody at the
     PC, and the board can still hold jobs: a post job is taken once a day, engagement jobs can be
     taken again. So the popup offers the next one. On Auto it counts down from 15s and runs by
     itself (the fill drains as it does); on Always ask it waits for the click, and the job is
     still asked before it starts. Got it, now the secondary button, closes the popup and stops
     there. Shown after a job (job, Day 20, Day 1), not after no job. The day is already counted,
     so a "Run once more" job closes with its own title and the same status line. DRAFT strings. */
  const AGAIN_S = 15;
  const EXTRA_TITLE = 'One more job done.';
  function RunAgain({ onRun }) {
    const t = T();
    const auto = window.AgentPermissions.getMode('youtube') === 'auto';
    const [left, setLeft] = React.useState(AGAIN_S);
    React.useEffect(() => {
      if (!auto) return undefined;
      if (left <= 0) { onRun(); return undefined; }
      const id = setTimeout(() => setLeft((s) => s - 1), 1000);
      return () => clearTimeout(id);
    }, [left, auto]);
    return (<>
      <style>{'@keyframes raDrain { from { transform: scaleX(1); } to { transform: scaleX(0); } }'}</style>
      <button onClick={onRun} style={{ position: 'relative', overflow: 'hidden', display: 'block', width: '100%', height: t.controlLg, marginTop: 18, background: t.action, border: t.stroke + 'px solid ' + t.action, borderRadius: t.radiusSm, fontSize: t.text13, fontWeight: t.wMedium, color: t.onColor, cursor: 'pointer', fontFamily: 'inherit', transition: 'background ' + t.dur1 + 'ms ' + t.easeStandard }}
        onMouseEnter={(ev) => { ev.currentTarget.style.background = t.actionHover; }} onMouseLeave={(ev) => { ev.currentTarget.style.background = t.action; }}>
        {auto && <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.24)', transformOrigin: 'right', animation: 'raDrain ' + AGAIN_S + 's linear both' }} />}
        <span style={{ position: 'relative', fontVariantNumeric: 'tabular-nums' }}>{'Run once more' + (auto ? ' · ' + left + 's' : '')}</span>
      </button></>);
  }

  /* The popup's confetti (see Confetti above). Pieces pop out of the badge fast, hold, then drift
     down as they fade. Blue, the BlueAI gradient's cyan and violet, and neutral: the day is still
     pending, so no green or gold. Small: 12 pieces, about 1.1s. Big (Day 20): 24, wider, 1.5s. */
  const POP = ['#1990FF', '#0EA4C5', '#7B4CFF', '#94a3b8'];
  const POP_SHAPE = { s: [8, 3.5, 1], q: [6, 6, 1.5], d: [6, 6, 3] };   // strip, square, dot: w, h, radius
  //                 x     y  colour shape delay spin
  const POP_SMALL = [[-128, -30, 0, 's', 0, 200], [-96, -62, 1, 'q', 40, -160], [-58, -80, 2, 'd', 80, 0], [-22, -58, 3, 's', 20, 260],
    [20, -76, 0, 'q', 60, -220], [56, -60, 2, 's', 100, 180], [94, -74, 1, 'd', 30, 0], [130, -34, 0, 'q', 120, -200],
    [-140, 14, 2, 'd', 140, 0], [-84, 30, 0, 's', 70, -180], [88, 26, 3, 's', 150, 220], [142, 12, 1, 'q', 110, -240]];
  const POP_BIG = [[-180, -60, 0, 's', 0, 220], [-160, -118, 1, 'q', 30, -160], [-128, -150, 2, 'd', 60, 0], [-98, -96, 3, 's', 20, 300],
    [-66, -142, 0, 'q', 90, -240], [-34, -112, 1, 's', 40, 180], [0, -162, 2, 'd', 110, 0], [34, -118, 0, 's', 50, -280],
    [68, -146, 3, 'q', 10, 200], [100, -100, 1, 's', 80, -200], [132, -140, 2, 'd', 120, 0], [162, -108, 0, 'q', 70, 260],
    [184, -54, 1, 's', 140, -180], [-186, 8, 2, 'q', 160, 240], [-150, 44, 0, 'd', 100, 0], [-110, 74, 1, 's', 180, -220],
    [-60, 58, 3, 'q', 130, 160], [60, 62, 0, 's', 150, -260], [112, 74, 2, 'd', 170, 0], [156, 38, 1, 'q', 90, 200],
    [186, 4, 0, 's', 190, -160], [-140, -20, 3, 's', 200, 180], [142, -24, 2, 'q', 210, -200], [0, 84, 1, 's', 220, 240]];
  const POP_CSS = '@keyframes ddBit { 0% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0.4); animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); }'
    + ' 8% { opacity: 1; } 38% { opacity: 1; transform: translate(var(--tx), var(--ty)) rotate(var(--r)) scale(1); animation-timing-function: ease-in; }'
    + ' 100% { opacity: 0; transform: translate(var(--tx), calc(var(--ty) + 34px)) rotate(calc(var(--r) * 1.6)) scale(0.85); } }'
    + ' @media (prefers-reduced-motion: reduce) { .dd-bit { display: none; } }';
  function PopBurst({ small }) {
    const bits = small ? POP_SMALL : POP_BIG;
    const dur = small ? 1100 : 1500;
    return (
      <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 52, width: 0, height: 0, pointerEvents: 'none' }}>
        <style>{POP_CSS}</style>
        {bits.map(([x, y, c, sh, d, r], i) => { const [w, h, rad] = POP_SHAPE[sh];
          return <span key={i} className="dd-bit" style={{ position: 'absolute', left: -w / 2, top: -h / 2, width: w, height: h, borderRadius: rad, background: POP[c], '--tx': x + 'px', '--ty': y + 'px', '--r': r + 'deg', animation: 'ddBit ' + dur + 'ms linear ' + (160 + d) + 'ms both' }} />; })}
      </span>);
  }

  window.WorkerDayDone = { DayDoneOverlay, DayDoneCard, ENDS, getEnd, setEnd, numbers, doneLine, toastFor, failedAsk };
})();
