/* BlueAI: the 20-day progress bar above the chat box (Arpit, 2026-10-14). ALWAYS THERE in a signed-in
   BlueAI worker chat, Day 1 included (Abhisht, 2026-10-15; it used to come in only after the
   run-complete popup's Got it). A full-width chip above the chat box (not joined to the box): the
   closed row takes its own place above the box, and the open card floats UP OVER the messages
   rather than pushing them (Abhisht, 2026-10-15); a click outside it or Escape closes it.
   Before today's run it shows today's day ("Day 7 of 20", "Day 1 of 20") with today's dash grey;
   once the run is done and its popup closed with Got it, that dash takes the green outline. A
   failed or declined day leaves it grey.

   Closed, one row: an award mark, "Day 7 of 20", 20 thin segments and a chevron ("13 to go" dropped
   2026-10-15, Abhisht, to give the segments room). A tap anywhere on the row opens it upward into a
   card that says what the days are towards (Ambreesh's concept, 2026-10-15; LOCAL TRIAL): "Monthly
   award" (the award is recurring), the same count and segments, a legend as on the dashboard, and
   the rule in the dashboard's words. The chevron replaced the X (Abhisht, 2026-10-15), so the bar
   stays once it has come in; the onClose chat_product.jsx still passes is unused. "Award", never
   "reward": the Program Terms' word.

   Segments: verified days GREEN, today a 1px green OUTLINE (pending verification; picked by Abhisht
   and Arpit 2026-10-15 over a light green fill and a yellow fill), the rest in the line colour. Thin
   4px dashes, as first built. Values from v2_tokens.jsx; the numbers are worker_day_done.jsx's, so
   the bar and the popup always agree.

   Exposes window.WorkerDayProgress = { DayProgressBar, ICONS, getIcon, setIcon, DAY20, getDay20, setDay20 }. */
(function () {
  const { useState, useEffect, useRef } = React;
  const T = () => window.V2Tokens;
  const qs = (k) => { try { return new URLSearchParams(location.search).get(k); } catch (e) { return null; } };
  /* Today's dash is a green OUTLINE. ARCHIVED (2026-10-15): the yellow fill tried the same day,
     kept here unused. To bring it back, set `look` to 'yellow'. */
  const PENDING_YELLOW = '#fbbf24';
  const look = 'outline';

  /* LOCAL TRIAL (Abhisht, 2026-10-15). The mark at the bar's left, three to compare from the
     Preview panel's "Award icon" row or ?icon=, all gold (see Mark below): a gift (default), a
     coin, a medal. The green gift and the BlueAI-gradient gift were tried first and dropped. */
  const ICONS = [['Gift', 'gift'], ['Coin', 'coin'], ['Medal', 'medal']];
  const isIcon = (v) => ICONS.some(([, id]) => id === v);
  let icon = isIcon(qs('icon')) ? qs('icon') : 'gift';
  const getIcon = () => icon;
  const setIcon = (v) => { icon = isIcon(v) ? v : 'gift'; };

  /* Day 20 once its run is verified (Abhisht, 2026-10-15): all twenty dashes green and the card
     says the month is won. The Preview panel's "Verification" row (with Day end = Day 20) or
     ?verify=done flips the bar in place, as if the check had landed since the run. */
  const DAY20 = [['Pending', 'pending'], ['Verified', 'verified']];
  let day20 = qs('verify') === 'done' ? 'verified' : 'pending';
  const getDay20 = () => day20;
  const setDay20 = (v) => { day20 = v === 'verified' ? 'verified' : 'pending'; };

  /* Confetti when the card opens on Day 20 once verified (Abhisht, 2026-10-15; LOCAL TRIAL). Not the
     Day 20 popup's burst (worker_day_done.jsx, DS 44: blue and neutral only while the day is
     pending, 6px bits that shrink away as they fly): over a card that read as faint specks. Here the
     days are verified, so it celebrates: 18 fixed pieces (strips, squares, dots) in green, blue, the
     BlueAI gradient's cyan and violet, and gold, popping out fast from the count, holding, then
     drifting down as they fade, about 1.3s, once per open. Hidden under reduced motion. */
  const BURST = ['#16a34a', '#1990FF', '#0EA4C5', '#7B4CFF', '#f59e0b', '#22c55e'];
  //            x     y   colour  shape  delay  spin
  const BITS = [[-158, -34, 0, 's', 0, 220], [-128, -80, 1, 'q', 40, -160], [-92, -58, 4, 'd', 80, 0], [-60, -104, 3, 's', 20, 300], [-26, -74, 2, 'q', 60, -240],
    [6, -112, 0, 's', 100, 180], [38, -70, 5, 'd', 30, 0], [70, -98, 1, 's', 120, -280], [102, -60, 4, 'q', 10, 200], [134, -86, 3, 's', 90, -200],
    [162, -30, 2, 'd', 50, 0], [-170, 6, 5, 'q', 140, 260], [-112, 24, 3, 's', 70, -180], [-48, 30, 4, 's', 160, 240], [16, 34, 1, 'd', 110, 0],
    [76, 28, 0, 'q', 150, -220], [126, 22, 2, 's', 130, 160], [174, 0, 4, 's', 170, -260]];
  const SHAPE = { s: [8, 3.5, 1], q: [6, 6, 1.5], d: [6, 6, 3] };   // strip, square, dot: w, h, radius
  const Burst = () => (
    <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 50, width: 0, height: 0, zIndex: 2, pointerEvents: 'none' }}>
      {BITS.map(([x, y, c, sh, d, r], i) => { const [w, h, rad] = SHAPE[sh];
        return <span key={i} className="dpb-bit" style={{ position: 'absolute', left: -w / 2, top: -h / 2, width: w, height: h, borderRadius: rad, background: BURST[c], '--tx': x + 'px', '--ty': y + 'px', '--r': r + 'deg', animation: 'dpbBit 1300ms linear ' + (100 + d) + 'ms both' }} />; })}
    </span>);
  const BURST_CSS = '@keyframes dpbBit { 0% { opacity: 0; transform: translate(0, 0) rotate(0deg) scale(0.4); animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); }'
    + ' 8% { opacity: 1; } 38% { opacity: 1; transform: translate(var(--tx), var(--ty)) rotate(var(--r)) scale(1); animation-timing-function: ease-in; }'
    + ' 100% { opacity: 0; transform: translate(var(--tx), calc(var(--ty) + 34px)) rotate(calc(var(--r) * 1.6)) scale(0.85); } }'
    + ' @media (prefers-reduced-motion: reduce) { .dpb-bit { display: none; } }';

  const segStyle = (t, s) => ({
    height: 4, borderRadius: 2, transition: 'background ' + t.dur4 + 'ms ' + t.easeStandard + ', box-shadow ' + t.dur4 + 'ms ' + t.easeStandard,
    background: s === 'done' ? t.success : (s === 'pending' ? (look === 'outline' ? t.surface : PENDING_YELLOW) : t.line),
    boxShadow: s === 'pending' && look === 'outline' ? 'inset 0 0 0 ' + t.stroke + 'px ' + t.success : 'none',
  });

  /* The mark (Abhisht, 2026-10-15: green and then blue "don't give the spark"), gold, the colour of
     a prize, in THREE LEVELS so the shine means something over a month-long program (Abhisht, the
     same day: "tone it down when the days are WIP, shiny when the milestone hits"):
       quiet      days 1 to 19: a gold glyph on a pale gold tile, no motion.
       glint      the moment today's run counts (Got it closes its popup): one soft gold sweep and
                  a small pop, once; not on opening the card, not again that day.
       milestone  Day 20 done (pending or verified): the full gold tile with a white glyph, a white
                  sweep and two twinkling stars when it arrives and each time the card opens
                  (and the verified card's confetti). Day 20 is the only milestone. */
  const GOLD = 'linear-gradient(135deg, #fde047 0%, #fbbf24 45%, #f59e0b 100%)';
  const QUIET = { bg: '#fef3c7', line: '#fde68a', ink: '#d97706' };   // amber 100 / 200 / 600
  const GLYPH = {
    gift: <><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13" /><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" /></>,
    coin: <><path d="M12 3v18" /><path d="M16.5 7H10a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6H7" /></>,
    medal: <><circle cx="12" cy="8" r="6" /><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11" /></>,
  };
  const STAR = 'M12 1.5 13.9 10.1 22.5 12 13.9 13.9 12 22.5 10.1 13.9 1.5 12 10.1 10.1Z';
  const Spark = ({ size, style, delay }) => (
    <svg className="dpb-spark" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"
      style={{ position: 'absolute', pointerEvents: 'none', animation: 'dpbTwinkle 900ms ease-out ' + delay + 'ms both', ...style }}><path d={STAR} fill="#f59e0b" /></svg>);
  // `full` is the milestone look; `glint` plays the quiet look's one sweep on mount.
  const Mark = ({ t, full, glint }) => {
    const coin = icon === 'coin';
    return (
      <span aria-hidden="true" style={{ position: 'relative', display: 'flex', width: 20, height: 20, flexShrink: 0 }}>
        <span className={glint ? 'dpb-pop' : undefined} style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: coin ? t.radiusRound : t.radiusXs + 1,
          background: full ? GOLD : QUIET.bg, color: full ? t.onColor : QUIET.ink,
          boxShadow: full ? 'inset 0 0 0 1px rgba(255,255,255,0.45), 0 1px 2px rgba(180,83,9,0.35)' : 'inset 0 0 0 1px ' + QUIET.line,
          animation: glint ? 'dpbPop 600ms ' + t.easeOut + ' 350ms both' : 'none' }}>
          <svg width={coin ? 11 : 12} height={coin ? 11 : 12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={coin ? 2.8 : 2.3} strokeLinecap="round" strokeLinejoin="round" style={{ filter: full ? 'drop-shadow(0 1px 0 rgba(146,64,14,0.5))' : 'none' }}>{GLYPH[icon]}</svg>
          {full && <span className="dpb-sheen" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.9) 50%, transparent 70%)', animation: 'dpbSheen 900ms ease-out 250ms both' }} />}
          {glint && <span className="dpb-sheen" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg, transparent 28%, rgba(251,191,36,0.75) 50%, transparent 72%)', animation: 'dpbSheen 1000ms ease-out 350ms both' }} />}
        </span>
        {full && <Spark size={9} delay={500} style={{ top: -5, right: -5 }} />}
        {full && <Spark size={6} delay={680} style={{ bottom: -3, left: -4 }} />}
      </span>);
  };
  const SPARK_CSS = ' @keyframes dpbSheen { from { transform: translateX(-130%); } to { transform: translateX(130%); } }'
    + ' @keyframes dpbTwinkle { 0% { opacity: 0; transform: scale(0) rotate(0deg); } 45% { opacity: 1; transform: scale(1.15) rotate(45deg); } 100% { opacity: 0; transform: scale(0) rotate(90deg); } }'
    + ' @keyframes dpbPop { 0% { transform: scale(1); } 40% { transform: scale(1.18); } 100% { transform: scale(1); } }'
    + ' @media (prefers-reduced-motion: reduce) { .dpb-sheen, .dpb-spark { display: none; } .dpb-pop { animation: none !important; } }';

  /* `step` is today's closed run (its day-done step, once Got it has closed the popup), or null
     before that; `day1` says this chat is the person's first day. */
  function DayProgressBar({ step, day1 }) {
    const [open, setOpen] = useState(false);
    const [opens, setOpens] = useState(0);   // replays the milestone mark's shine on each open
    const [glints, setGlints] = useState(0);   // counts the moments today's run started to count
    const wasRan = useRef(null);
    const box = useRef(null);
    const t = T();
    const D = window.WorkerDayDone;
    const ran = !!step && step.end !== 'failed' && step.end !== 'declined';   // today's run is done and counts
    const first = ran ? !!step.day1 : !!day1;
    const base = D.numbers(ran ? step.end : D.getEnd());
    const won = ran && step.end === 'day20' && day20 === 'verified';
    const milestone = ran && step.end === 'day20';   // the one moment the mark shines in full
    // Today's run has just started to count (Got it closed its popup): the quiet mark glints once.
    useEffect(() => { if (wasRan.current === false && ran) setGlints((g) => g + 1); wasRan.current = ran; }, [ran]);
    let n = { ...base, verified: first ? 0 : base.verified, pending: ran ? 1 : 0 };
    n.day = n.verified + 1;   // today
    if (won) n = { ...n, verified: n.target, pending: 0, day: n.target };
    const label = won ? 'All ' + n.target + ' days verified' : (ran && n.day >= n.target ? 'All ' + n.target + ' days done' : 'Day ' + n.day + ' of ' + n.target);
    const segs = Array.from({ length: n.target }, (_, i) => (i < n.verified ? 'done' : i < n.verified + n.pending ? 'pending' : 'todo'));
    const dashes = (
      <span aria-hidden="true" style={{ display: 'flex', gap: 3, flex: 1, minWidth: 80 }}>
        {segs.map((s, i) => <span key={i} style={{ flex: 1, ...segStyle(t, s) }} />)}
      </span>);
    const key = (s, text) => (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: t.space15 }}>
        <span aria-hidden="true" style={{ width: 14, flexShrink: 0, ...segStyle(t, s) }} />{text}
      </span>);
    // Open, the card sits over the thread like a popover: a click outside it or Escape closes it.
    useEffect(() => {
      if (!open) return undefined;
      const away = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
      const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
      document.addEventListener('mousedown', away); document.addEventListener('keydown', esc);
      return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc); };
    }, [open]);
    return (
      // Holds the closed row's place (34px row + 1px border top and bottom); the card is anchored to
      // its bottom, so opening grows it upward over the messages instead of pushing them.
      <div ref={box} style={{ position: 'relative', height: 36, marginBottom: t.space2, zIndex: open ? 4 : 'auto' }}>
      <div role="status" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: t.surface, border: t.stroke + 'px solid ' + t.line, borderRadius: t.radiusMd, boxShadow: open ? '0 14px 36px rgba(15,23,42,0.18), 0 2px 8px rgba(15,23,42,0.08)' : t.shadow0, transition: 'box-shadow ' + t.dur3 + 'ms ' + t.easeStandard, animation: 'dpbIn ' + t.dur4 + 'ms ' + t.easeOut + ' both' }}>
        <style>{'@keyframes dpbIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } } .dpb-head:focus-visible { outline: 2px solid ' + t.blue + '; outline-offset: -2px; } ' + BURST_CSS + SPARK_CSS}</style>
        {won && open && <Burst />}
        <button type="button" className="dpb-head" onClick={() => { if (!open) setOpens((o) => o + 1); setOpen(!open); }} aria-expanded={open}
          aria-label={open ? 'Monthly award, ' + label + '. Collapse' : label + '. Show what this is for'}
          style={{ display: 'flex', alignItems: 'center', gap: t.space3, width: '100%', boxSizing: 'border-box', height: 34, padding: '0 6px 0 8px', background: 'transparent', border: 'none', borderRadius: t.radiusMd, font: 'inherit', textAlign: 'left', cursor: 'pointer', transition: 'background ' + t.dur1 + 'ms ' + t.easeStandard }}
          onMouseEnter={(e) => { e.currentTarget.style.background = t.washHover; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
          <Mark key={milestone ? 'full-' + opens : 'quiet-' + glints} t={t} full={milestone} glint={!milestone && glints > 0} />
          {open
            ? <span style={{ flex: 1, fontSize: t.text13, color: t.ink, fontWeight: t.wSemibold }}>Monthly award</span>
            : <><span style={{ fontSize: t.text12, color: won ? t.successInk : t.ink2, fontWeight: t.wMedium, whiteSpace: 'nowrap' }}>{label}</span>{dashes}</>}
          <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, flexShrink: 0, color: t.ink3, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform ' + t.dur3 + 'ms ' + t.easeOut }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 15 6-6 6 6" /></svg>
          </span>
        </button>
        <div style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows ' + t.dur3 + 'ms ' + t.easeOut }}>
          <div style={{ overflow: 'hidden' }} aria-hidden={!open}>
            <div style={{ padding: '2px 12px 11px', opacity: open ? 1 : 0, transition: 'opacity ' + t.dur2 + 'ms ' + t.easeStandard }}>
              <div style={{ fontSize: t.text13, color: won ? t.successInk : t.ink2, fontWeight: t.wMedium, marginBottom: t.space2 }}>{label}</div>
              {dashes}
              {!won && <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', marginTop: t.space2, fontSize: t.text11, color: t.ink3 }}>
                {key('done', 'Verified')}{key('pending', 'Pending verification')}
              </div>}
              <div style={{ marginTop: t.space3, paddingTop: t.space2, borderTop: t.stroke + 'px solid ' + t.lineHair, fontSize: t.text12, color: t.ink3, lineHeight: t.leadingSnug }}>
                {won ? 'You qualified for this month’s award. It goes to your balance when the month ends.'
                  : 'Run BlueAI on at least ' + n.target + ' days this month to qualify.'}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>);
  }

  window.WorkerDayProgress = { DayProgressBar, ICONS, getIcon, setIcon, DAY20, getDay20, setDay20 };
})();
