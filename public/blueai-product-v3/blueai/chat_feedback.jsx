/* BlueAI: the thumbs-up/down feedback control for a completed task.
   Split out of chat_product.jsx (2026-08-10), which was 648 lines against the workspace's
   300-line rule. Ported verbatim from "ChatView Feedback.html"; PM's config (placement
   "below", icons only, success only) is chosen by the CALLER, not here.

   V3 (phase 3): every bubble now sits on the white surface, so the control no longer needs a
   per-tone palette. One look for every placement, all kit parts (review round 1): 28px icon
   buttons (a vote is the pressed look), chips for the reasons, a kit field and a quiet 32px submit.
   Exposes window.ChatFeedback. */
(function () {
  const { useState, useRef, useEffect } = React;

  /* ───────── Icons ───────── */
  function ThumbIcon({ dir, filled = false }) {
    const up = "M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3";
    const down = "M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zM17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3";
    return (
      <svg className="v2-icon" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={dir === 'up' ? up : down} />
      </svg>);
  }

  /* ───────── Feedback control ───────── */
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

  function ReasonChips({ reason, onPick, onOtherSubmit }) {
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
      <div ref={rootRef} className="v2-anim-pop-in" style={{ marginTop: 'var(--v2-space-2)' }}>
        <p className="v2-text-caption v2-fb-prompt" style={{ marginBottom: 'var(--v2-space-15)' }}>What went wrong?</p>
        <div className="v2-fb-chips">
          {FB_REASONS.map((r) => {
            const sel = reason === r;
            return (
              <button key={r} type="button" onClick={() => { if (r === 'Other' || !sel) { setSubmitted(false); } onPick(sel ? null : r); }}
                className="v2-chip" aria-pressed={sel}>
                {r}
              </button>);
          })}
        </div>
        {isOther &&
          <div className="v2-anim-pop-in v2-fb-other" style={{ marginTop: 'var(--v2-space-2)' }}>
            <div className={'v2-field' + (submitted ? ' is-disabled' : '')}><div className="v2-field-box">
            <textarea className="v2-field-input v3-fb-input" value={otherText} autoFocus rows={1}
              placeholder="Provide additional feedback"
              disabled={submitted}
              onChange={(e) => {
                setOtherText(e.target.value); setSubmitted(false);
                const el = e.target; const maxH = 64;
                el.style.height = 'auto';
                el.style.height = Math.min(el.scrollHeight, maxH) + 'px';
                el.style.overflowY = el.scrollHeight > maxH ? 'auto' : 'hidden';
              }}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }} />
            </div></div>
            {/* Submit: a quiet 32px icon button (review round 1), the reply is not the view's commit.
                Sent swaps the arrow for a tick (2px mark geometry) and holds the button. */}
            <button type="button" onClick={submit} disabled={submitted} aria-disabled={submitted} aria-label="Submit feedback" className="v2-icon-button">
              {submitted
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                : <svg className="v2-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>}
            </button>
          </div>}
      </div>);
  }

  function FeedbackThumbs({ placement, withLabel, vote, onVote, reason, onReason }) {
    const [thanks, setThanks] = useState(false);
    const [chipsHidden, setChipsHidden] = useState(false);
    const tRef = useRef(null);

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

    const btn = (dir) => {
      const selected = vote === dir;
      return (
        <button key={dir} onClick={() => cast(dir)} aria-label={dir === 'up' ? 'Good result' : 'Bad result'} aria-pressed={selected}
          className={'v2-icon-button v2-icon-button--28' + (vote && !selected ? ' v3-fb-dim' : '')}>
          <ThumbIcon dir={dir} filled={selected} />
        </button>);
    };
    const labelText = thanks ? 'Thanks for the feedback' : (vote ? '' : (withLabel ? 'Did I get this right?' : ''));
    const label = <span className={'v2-text-caption v2-fb-thanks' + (thanks ? ' ba-thanks-in' : '')}>{labelText}</span>;
    const chips = showChips && <ReasonChips reason={reason} onPick={pickReason} onOtherSubmit={otherSubmitted} />;

    // Inside the bubble (stamp / inside): label left, thumbs right, under a hairline.
    if (placement === 'stamp' || placement === 'inside') {
      return (
        <div style={placement === 'inside'
          ? { marginTop: 'var(--v2-space-3)', paddingTop: 'var(--v2-space-2)', borderTop: 'var(--v2-stroke) solid var(--v2-line-hair)' }
          : { marginTop: 'var(--v2-space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--v2-space-3)', minHeight: 'var(--v2-control-sm)' }}>
            {label}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--v2-space-1)' }}>{btn('up')}{btn('down')}</div>
          </div>
          {chips}
        </div>);
    }
    return (
      <div style={{ marginTop: 'var(--v2-space-1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--v2-space-1)' }}>
          {btn('up')}{btn('down')}
          <span style={{ marginLeft: 'var(--v2-space-1)' }}>{label}</span>
        </div>
        {chips}
      </div>);
  }

  window.ChatFeedback = { FeedbackThumbs };
})();
