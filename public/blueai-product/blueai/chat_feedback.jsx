/* BlueAI — the thumbs-up/down feedback control for a completed task.
   Split out of chat_product.jsx (2026-08-10), which was 648 lines against the workspace's
   300-line rule. Ported verbatim from "ChatView Feedback.html"; PM's config (placement
   "below", icons only, success only) is chosen by the CALLER, not here.
   Exposes window.ChatFeedback. */
(function () {
  const { useState, useRef, useEffect } = React;

  /* ───────── Icons ───────── */
  function ThumbIcon({ dir, size = 16, color = 'currentColor', filled = false }) {
    const up = "M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3";
    const down = "M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zM17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3";
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
        <path d={dir === 'up' ? up : down} />
      </svg>);
  }

  /* ───────── Feedback control ───────── */
  const FB_TONES = {
    success: { divider: 'rgba(22,101,52,0.16)', label: '#3f9b63', idleIn: '#5cab7c', selIn: '#1f7a36' },
    fail:    { divider: 'rgba(190,18,60,0.14)', label: '#d4838f', idleIn: '#d4838f', selIn: '#b35560' }
  };
  const FB_REASONS = ["Didn't complete the task", "Wrong result", "Took too long", "Didn't understand me", "Other"];

  function revealInScroller(el, pad = 12) {
    let p = el.parentElement;
    while (p && !(p.scrollHeight > p.clientHeight && /(auto|scroll)/.test(getComputedStyle(p).overflowY))) p = p.parentElement;
    if (!p) return;
    const pr = p.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    const delta = er.bottom - pr.bottom + pad;
    if (delta <= 0) return;
    const from = p.scrollTop;
    const to = Math.min(from + delta, p.scrollHeight - p.clientHeight);
    const dur = 240;
    const start = performance.now();
    const ease = (x) => 1 - Math.pow(1 - x, 3);
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      p.scrollTop = from + (to - from) * ease(t);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    setTimeout(() => { if (Math.abs(p.scrollTop - to) > 2) p.scrollTop = to; }, dur + 80);
  }

  function ReasonChips({ variant, reason, onPick, onOtherSubmit, labelColor }) {
    const insideV = variant === 'inside';
    const [otherText, setOtherText] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const isOther = reason === 'Other';
    const rootRef = useRef(null);

    useEffect(() => {
      const el = rootRef.current;
      if (!el) return;
      const t1 = setTimeout(() => revealInScroller(el), 60);
      const t2 = setTimeout(() => revealInScroller(el), 280);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [isOther]);

    const submit = () => {
      if (submitted) return;
      setSubmitted(true);
      if (onOtherSubmit) onOtherSubmit(otherText.trim());
    };

    return (
      <div ref={rootRef} className="ba-chips-in" style={{ marginTop: insideV ? 8 : 9 }}>
        <p style={{ fontSize: 11.5, fontWeight: 600, color: labelColor, marginBottom: 6 }}>What went wrong?</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {FB_REASONS.map((r) => {
            const sel = reason === r;
            const base = sel
              ? { background: '#334155', border: '1px solid #334155', color: 'white' }
              : insideV
                ? { background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.6)', color: '#374151' }
                : { background: 'white', border: '1px solid #e2e8f0', color: '#475569', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' };
            return (
              <button key={r} onClick={() => { if (r === 'Other' || !sel) { setSubmitted(false); } onPick(sel ? null : r); }}
                className={'ba-chip ' + (insideV ? 'ba-chip--inside' : 'ba-chip--below') + (sel ? ' ba-chip--sel' : '')}
                style={{ ...base, borderRadius: 999, padding: '6px 11px', fontSize: 12, fontWeight: 500, cursor: 'pointer', lineHeight: 1 }}>
                {r}
              </button>);
          })}
        </div>
        {isOther &&
          <div className="ba-chips-in" style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginTop: 7 }}>
            <textarea value={otherText} autoFocus rows={1}
              placeholder="Provide additional feedback"
              disabled={submitted}
              onChange={(e) => {
                setOtherText(e.target.value); setSubmitted(false);
                const el = e.target; const maxH = 48;
                el.style.height = 'auto';
                el.style.height = Math.min(el.scrollHeight, maxH) + 'px';
                el.style.overflowY = el.scrollHeight > maxH ? 'auto' : 'hidden';
              }}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
              style={{ flex: 1, minWidth: 0, fontSize: 12, lineHeight: '17px', color: '#1f2937', background: insideV ? 'rgba(255,255,255,0.75)' : 'white', border: '1px solid ' + (insideV ? 'rgba(255,255,255,0.75)' : '#e2e8f0'), borderRadius: 10, padding: '7px 10px', outline: 'none', opacity: submitted ? 0.65 : 1, resize: 'none', overflowY: 'hidden', height: 31, scrollbarWidth: 'thin' }} />
            <button onClick={submit} disabled={submitted} aria-label="Submit feedback"
              style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: submitted ? '#16a34a' : '#334155', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: submitted ? 'default' : 'pointer', flexShrink: 0, transition: 'background 0.15s ease' }}>
              {submitted
                ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                : <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg>}
            </button>
          </div>}
      </div>);
  }

  function FeedbackThumbs({ tone, placement, withLabel, vote, onVote, reason, onReason }) {
    const [thanks, setThanks] = useState(false);
    const [chipsHidden, setChipsHidden] = useState(false);
    const tRef = useRef(null);
    const T = FB_TONES[tone] || FB_TONES.success;

    const cast = (dir) => {
      const next = vote === dir ? null : dir;
      onVote(next);
      if (next !== 'down' && reason) onReason(null);
      setChipsHidden(false);
      if (tRef.current) clearTimeout(tRef.current);
      if (next === 'up') { setThanks(true); tRef.current = setTimeout(() => setThanks(false), 2200); }
      else setThanks(false);
    };
    const pickReason = (r) => {
      onReason(r);
      if (tRef.current) clearTimeout(tRef.current);
      if (r && r !== 'Other') { setChipsHidden(true); setThanks(true); tRef.current = setTimeout(() => setThanks(false), 2200); }
      else setThanks(false);
    };
    const otherSubmitted = () => {
      if (tRef.current) clearTimeout(tRef.current);
      setChipsHidden(true);
      setThanks(true); tRef.current = setTimeout(() => setThanks(false), 2200);
    };

    const showChips = vote === 'down' && !chipsHidden;
    useEffect(() => () => { if (tRef.current) clearTimeout(tRef.current); }, []);

    const inside = placement === 'inside';

    if (placement === 'stamp') {
      const sBtn = (dir) => {
        const selected = vote === dir;
        return (
          <button key={dir} onClick={() => cast(dir)} aria-label={dir === 'up' ? 'Good result' : 'Bad result'}
            className={'ba-fb-btn ba-fb-btn--inside' + (selected ? ' ba-fb-btn--sel' : '')}
            style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: selected ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0, flexShrink: 0, opacity: vote && !selected ? 0.55 : 1 }}>
            <ThumbIcon dir={dir} size={13} color={selected ? T.selIn : T.idleIn} filled={selected} />
          </button>);
      };
      return (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 8, minHeight: 26 }}>
            <span className={thanks ? 'ba-thanks-in' : undefined} style={{ fontSize: 11.5, fontWeight: 600, color: T.label }}>
              {thanks ? 'Thanks for the feedback' : (vote ? '' : (withLabel ? 'Did I get this right?' : ''))}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>{sBtn('up')}{sBtn('down')}</div>
          </div>
          {showChips && <ReasonChips variant="inside" reason={reason} onPick={pickReason} onOtherSubmit={otherSubmitted} labelColor={T.label} />}
        </div>);
    }

    const btn = (dir) => {
      const selected = vote === dir;
      const base = inside
        ? { width: 30, height: 30, borderRadius: '50%', border: 'none', background: selected ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)' }
        : { width: 32, height: 32, borderRadius: '50%', border: '1px solid ' + (selected ? '#94a3b8' : '#e2e8f0'), background: selected ? '#e2e8f0' : 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' };
      const icoColor = selected ? (inside ? T.selIn : '#334155') : (inside ? T.idleIn : '#64748b');
      return (
        <button key={dir} onClick={() => cast(dir)} aria-label={dir === 'up' ? 'Good result' : 'Bad result'}
          className={'ba-fb-btn ' + (inside ? 'ba-fb-btn--inside' : 'ba-fb-btn--below') + (selected ? ' ba-fb-btn--sel' : '')}
          style={{ ...base, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0, flexShrink: 0, opacity: vote && !selected ? 0.55 : 1 }}>
          <ThumbIcon dir={dir} size={15} color={icoColor} filled={selected} />
        </button>);
    };

    const labelText = thanks ? 'Thanks for the feedback' : (vote ? '' : (withLabel ? 'Did I get this right?' : ''));

    if (inside) {
      return (
        <div style={{ marginTop: 10, paddingTop: 9, borderTop: '1px solid ' + T.divider }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, minHeight: 30 }}>
            <span className={thanks ? 'ba-thanks-in' : undefined} style={{ fontSize: 12, fontWeight: 600, color: T.label }}>{labelText}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{btn('up')}{btn('down')}</div>
          </div>
          {showChips && <ReasonChips variant="inside" reason={reason} onPick={pickReason} onOtherSubmit={otherSubmitted} labelColor={T.label} />}
        </div>);
    }
    return (
      <div style={{ marginTop: 7, marginLeft: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {btn('up')}{btn('down')}
          <span className={thanks ? 'ba-thanks-in' : undefined} style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>{labelText}</span>
        </div>
        {showChips && <ReasonChips variant="below" reason={reason} onPick={pickReason} onOtherSubmit={otherSubmitted} labelColor="#94a3b8" />}
      </div>);
  }

  window.ChatFeedback = { FeedbackThumbs };
})();
