/* BlueAI: the 20-day progress bar above the chat box (Arpit, 2026-10-14). It comes in only after the
   run-complete popup is closed with Got it, as a full-width chip above the chat box (not joined to
   the box), pushes the thread up rather than covering it (chat_product.jsx scrolls the
   thread to its end when it appears), and closes with its X until the next completed run. Failed and declined days get no popup, so no bar.

   One row: "Day 7 of 20", 20 thin segments, "13 to go", X. Segments: verified days filled green, today light
   green (pending verification), the rest in the line colour. Values from v2_tokens.jsx; the numbers
   are worker_day_done.jsx's, so the bar and the popup always agree.

   Exposes window.WorkerDayProgress = { DayProgressBar }. */
(function () {
  const T = () => window.V2Tokens;

  function DayProgressBar({ step, onClose }) {
    if (!step || step.end === 'failed' || step.end === 'declined') return null;
    const t = T();
    const D = window.WorkerDayDone;
    const n = step.day1 ? { ...D.numbers(step.end), verified: 0, pending: 1, day: 1 } : D.numbers(step.end);
    const left = n.target - n.day;
    const label = left > 0 ? 'Day ' + n.day + ' of ' + n.target : 'All ' + n.target + ' days done';
    const segs = Array.from({ length: n.target }, (_, i) => (i < n.verified ? t.success : i < n.day ? t.successLine : t.line));
    return (
      <div role="status" style={{ display: 'flex', alignItems: 'center', gap: t.space3, marginBottom: t.space2, padding: '7px 6px 7px 12px', background: t.surface, border: t.stroke + 'px solid ' + t.line, borderRadius: t.radiusMd, boxShadow: t.shadow0, animation: 'dpbIn ' + t.dur4 + 'ms ' + t.easeOut + ' both' }}>
        <style>{'@keyframes dpbIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }'}</style>
        <span style={{ fontSize: t.text12, color: t.ink2, fontWeight: t.wMedium, whiteSpace: 'nowrap' }}>{label}</span>
        <span aria-hidden="true" style={{ display: 'flex', gap: 3, flex: 1, minWidth: 80 }}>
          {segs.map((c, i) => <span key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: c }} />)}
        </span>
        {left > 0 && <span style={{ fontSize: t.text12, color: t.ink3, whiteSpace: 'nowrap' }}>{left + ' to go'}</span>}
        <button onClick={onClose} aria-label="Close" title="Close"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, flexShrink: 0, background: 'transparent', border: 'none', borderRadius: t.radiusXs, color: t.ink4, cursor: 'pointer', transition: 'background ' + t.dur1 + 'ms ' + t.easeStandard }}
          onMouseEnter={(e) => { e.currentTarget.style.background = t.washHover; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      </div>);
  }

  window.WorkerDayProgress = { DayProgressBar };
})();
