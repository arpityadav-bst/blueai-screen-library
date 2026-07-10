/* BlueAI — Product chat (assembled).
   Home = the canonical NEW variant (window.ChatCompare.NewHome + IntroCard).
   Conversation = the rich task-progress + feedback engine ported verbatim from
   "ChatView Feedback.html" (PM's chosen config: placement "below", icons-only, success-only).
   Chat history overlay ported from "ChatView Variant.html".
   Everything is wrapped in an IIFE — only window.ProductChat leaks, so no global
   collisions with the other no-build modules. */
(function () {
  const { useState, useRef, useEffect } = React;

  /* ───────── Helpers ───────── */
  function fmtStamp() { return 'Jun 12, 2026, 11:03 AM'; }

  function richText(text, linkColor) {
    const urlRe = /(https?:\/\/[^\s]+)/g;
    return text.split('\n').map((line, li) =>
      <p key={li} style={{ margin: li === 0 ? 0 : '8px 0 0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {line.split(urlRe).map((part, pi) => urlRe.test(part)
          ? <a key={pi} href="#" onClick={(e) => e.preventDefault()} style={{ color: linkColor, textDecoration: 'underline', wordBreak: 'break-all' }}>{part}</a>
          : <span key={pi}>{part}</span>)}
      </p>);
  }

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

  /* ───────── Bubbles (from ChatView Feedback) ───────── */
  function UserBubble({ content }) {
    return (
      <div className="ba-msg-in" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <div style={{ maxWidth: 290, background: 'linear-gradient(135deg,#5158ee,#7b4cff)', borderRadius: 16, padding: '11px 14px 8px', boxShadow: '0 4px 14px rgba(99,102,241,0.30)' }}>
          <p style={{ fontSize: 13.5, lineHeight: 1.45, color: 'white', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{content}</p>
          <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.75)', marginTop: 6 }}>{fmtStamp()}</p>
        </div>
      </div>);
  }

  function StatusBubble({ content }) {
    return (
      <div className="ba-msg-in" style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
        <div style={{ maxWidth: 290, background: '#f1f5f9', border: '1px solid #e8edf3', borderRadius: 16, padding: '10px 13px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <p style={{ fontSize: 13, lineHeight: 1.45, color: '#475569' }}>{content}</p>
        </div>
      </div>);
  }

  /* Warning = a heads-up shown mid-task that does NOT block progress (distinct from the
     amber "human input required" final state, which halts until the user answers). Styled
     like a status bubble (task keeps going) but orange-tinted with a caution icon. */
  function WarningIcon({ size = 14, color = 'currentColor' }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>);
  }

  function WarningBubble({ content }) {
    return (
      <div className="ba-msg-in" style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
        <div style={{ maxWidth: 290, display: 'flex', alignItems: 'flex-start', gap: 8, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 16, padding: '10px 13px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <WarningIcon size={15} color="#c2410c" />
          <p style={{ fontSize: 13, lineHeight: 1.45, color: '#9a3412' }}>{content}</p>
        </div>
      </div>);
  }

  /* NOTE: this is the LIVE product's "human input required" state (PM-confirmed name/colour —
     do not change), not a generic warning. See WarningBubble below for the actual Warning tone. */
  const FINAL_STYLES = {
    success:    { bg: '#d9fbe4', border: '#d9fbe4', text: '#1f2937', stamp: '#4ade80', link: '#1f2937' },
    fail:       { bg: '#fdecec', border: '#f8d7d7', text: '#991b1b', stamp: '#e8a0a0', link: '#991b1b' },
    needsInput: { bg: '#fdf6cf', border: '#f3e8a8', text: '#8a6116', stamp: '#c09a3e', link: '#8a6116' }
  };

  function FinalBubble({ msg, feedback }) {
    const S = FINAL_STYLES[msg.tone];
    const fbPlacement = feedback && feedback.placement;
    const toneKey = msg.tone === 'fail' ? 'fail' : 'success';
    return (
      <div className="ba-msg-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ maxWidth: 310, background: S.bg, border: '1px solid ' + S.border, borderRadius: 16, padding: '12px 14px 10px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 13.5, lineHeight: 1.5, color: S.text }}>{richText(msg.content, S.link)}</div>
          {fbPlacement === 'stamp' &&
            <FeedbackThumbs tone={toneKey} placement="stamp"
              withLabel={feedback.withLabel} vote={feedback.vote} onVote={feedback.onVote}
              reason={feedback.reason} onReason={feedback.onReason} />}
          {fbPlacement === 'inside' &&
            <FeedbackThumbs tone={toneKey} placement="inside"
              withLabel={feedback.withLabel} vote={feedback.vote} onVote={feedback.onVote}
              reason={feedback.reason} onReason={feedback.onReason} />}
        </div>
        {fbPlacement === 'below' &&
          <FeedbackThumbs tone={toneKey} placement="below"
            withLabel={feedback.withLabel} vote={feedback.vote} onVote={feedback.onVote}
            reason={feedback.reason} onReason={feedback.onReason} />}
      </div>);
  }

  function ThinkingBubble() {
    return (
      <div className="ba-msg-in" style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
        <div style={{ background: '#f1f5f9', border: '1px solid #e8edf3', borderRadius: 16, padding: '12px 16px 9px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', gap: 5, marginBottom: 7 }}>
            {[0, 1, 2].map((i) =>
              <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#818cf8', display: 'inline-block', animation: 'ba-pulse 1.2s ease-in-out infinite', animationDelay: (i * 0.18) + 's' }}></span>)}
          </div>
          <p style={{ fontSize: 12, color: '#94a3b8' }}>Working on it…</p>
        </div>
      </div>);
  }

  /* Generic task script played for any prompt the user picks or types — always ends in success.
     Warning/error bubbles are shown via the "Chat states" dev-preview toggle (ChatStatesPreview
     below), not by scripting a real task to fail. */
  function makeTaskSteps(text) {
    return [
      { role: 'user', content: text, d: 250 },
      { role: 'status', content: 'Got it. Starting on your task…', d: 900 },
      { role: 'thinking', d: 1200 },
      { role: 'status', content: 'Opening the required app and navigating to the right screen…', d: 1100 },
      { role: 'status', content: 'Performing the actions step by step…', d: 1100 },
      { role: 'status', content: 'Verifying the result…', d: 1000 },
      { role: 'final', tone: 'success', content: 'Done. I completed your task: “' + text + '”. Let me know if you’d like me to do anything else.', d: 900 }];
  }

  /* Dev-preview only: one example bubble per chat message state, rendered instantly (no
     scripted delay) so success / warning / human-input-required / error are all visible side
     by side without having to type + send a message per state. */
  function ChatStatesPreview() {
    const [votes, setVotes] = useState({});
    const [reasons, setReasons] = useState({});
    const examples = [
      { key: 'success', user: 'Play Whiteout Survival for 10 min', kind: 'final', tone: 'success', content: 'Done. I completed your task: “Play Whiteout Survival for 10 min”. Let me know if you’d like me to do anything else.', hasFeedback: true },
      { key: 'warning', user: 'Farm resources on the world map', kind: 'warning', content: 'Heads up — this may use more AI credits than usual since it involves repeated actions.' },
      { key: 'needsInput', user: 'Set up a task that runs automatically every day at 6 AM', kind: 'final', tone: 'needsInput', content: 'I need a bit more information to continue with “Set up a task that runs automatically every day at 6 AM”. Could you tell me which app or game instance to use?' },
      { key: 'fail', user: 'Collect bonus coins in Disney Solitaire game', kind: 'final', tone: 'fail', content: 'I wasn’t able to complete “Collect bonus coins in Disney Solitaire game” — the app closed unexpectedly partway through. You can try again or rephrase the request.' }
    ];
    return (
      <div style={{ marginTop: 4 }}>
        <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 10 }}>CHAT STATES PREVIEW</p>
        {examples.map((ex) => (
          <div key={ex.key} style={{ marginBottom: 16 }}>
            <UserBubble content={ex.user} />
            {ex.kind === 'warning'
              ? <WarningBubble content={ex.content} />
              : <FinalBubble msg={{ tone: ex.tone, content: ex.content }} feedback={ex.hasFeedback ? {
                  placement: 'below', withLabel: false,
                  vote: votes[ex.key] || null, onVote: (v) => setVotes((p) => ({ ...p, [ex.key]: v })),
                  reason: reasons[ex.key] || null, onReason: (r) => setReasons((p) => ({ ...p, [ex.key]: r }))
                } : null} />}
          </div>))}
      </div>);
  }

  /* ───────── Live home categories (matched to the live app — newer than the export).
     Counts (7/4/4/3) come from the prompt lists; drill-down prompts are best-effort
     assembled from the export's real category prompts (not 1:1 sourced). ───────── */
  const CATS_LIVE = {
    'Social Media': {
      icon: 'social', color: '#E05C8A', bg: '#FCE9F1', border: '#F5C0D5',
      desc: "Posts, replies, and swipes while you're off living.",
      prompts: [
        "Scan my girlfriend's Instagram profile and suggest what I can gift her",
        'Swipe profiles on my dating apps based on my preferences',
        'Find 3 Reddit threads worth replying to and draft my replies',
        'Draft sponsorship pitches to 5 brands for me',
        'Draft replies to my unanswered Discord threads',
        'Re-train my Reels feed toward dog videos',
        'Show me what the people I follow posted this week'] },
    'Game Helpers': {
      icon: 'game', color: '#5B6CF6', bg: '#EEF0FE', border: '#D4D9FB',
      desc: 'Grabs your rewards and grinds dailies while you sleep.',
      prompts: [
        "Find a guide for the level I'm stuck on",
        'Complete the initial boring tutorial of the Coin Master game for me',
        'Play Whiteout Survival for 10 min',
        'Collect bonus coins in Disney Solitaire game'] },
    'Explore': {
      icon: 'explore', color: '#3B8FD4', bg: '#E4F2FC', border: '#B6D9F4',
      desc: 'Finds free games, fresh fits, and new things to try.',
      prompts: [
        'Search the web for active redeem codes for my games',
        'Collect paid games that are free on Google Play Store every day',
        'Recommend and install a new game for me',
        'Suggest an outfit for me today'] },
    'Productivity': {
      icon: 'productivity', color: '#1BA07A', bg: '#DDF4EE', border: '#A8E4D4',
      desc: 'Chores, reminders, summaries — done before your coffee.',
      prompts: [
        'Every morning, brief me on the latest news and my schedule for the day',
        'Wind down my phone for the night and prep tomorrow',
        'Set up a task that runs automatically every day at 6 AM'] }
  };

  /* Home category list WITH task counts (matches the live layout). */
  function ProductHome({ onRun, onOpenHistory }) {
    const [selectedCat, setSelectedCat] = useState(null);
    const C = window.ChatCompare;
    const cats = CATS_LIVE;

    if (selectedCat) {
      const meta = cats[selectedCat];
      return (
        <div style={{ animation: 'baExpand 0.18s ease' }}>
          {/* Back to all categories */}
          <button onClick={() => setSelectedCat(null)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'white', border: '1px solid #e2e8f0', borderRadius: 999, cursor: 'pointer', color: '#7A8499', fontSize: 12, fontWeight: 600, padding: '5px 12px 5px 9px', fontFamily: 'inherit', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            All Actions
          </button>
          {/* Category header: icon · title · task-count pill · description (matches live) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '14px 0' }}>
            <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 11, background: meta.bg, border: '1px solid ' + meta.border, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <C.ChatCatIcon type={meta.icon} size={22} color={meta.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 17, fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }}>{selectedCat}</span>
                <span style={{ flexShrink: 0, background: meta.bg, color: meta.color, fontSize: 11.5, fontWeight: 700, borderRadius: 999, padding: '3px 10px' }}>{meta.prompts.length} {meta.prompts.length === 1 ? 'task' : 'tasks'}</span>
              </div>
              <p style={{ fontSize: 11.5, color: '#6b7280', lineHeight: 1.35, marginTop: 2 }}>{meta.desc}</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {meta.prompts.map((p, i) =>
              <button key={i} onClick={() => onRun(p)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, border: '1px solid #e2e8f0', borderRadius: 11, background: 'white', padding: '13px 14px', fontSize: 13.5, lineHeight: 1.4, color: '#374151', fontWeight: 500, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'background 0.12s, border-color 0.12s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#c7d2e1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                <span style={{ textWrap: 'pretty' }}>{p}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}><polyline points="9 18 15 12 9 6" /></svg>
              </button>)}
          </div>
        </div>);
    }

    return (
      <div>
        <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 8, textAlign: 'left' }}>WHAT WOULD YOU LIKE TO DO?</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {Object.entries(cats).map(([name, meta]) =>
            <div key={name} role="button" tabIndex={0} onClick={() => setSelectedCat(name)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedCat(name); } }}
              style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'transform 0.12s, box-shadow 0.12s' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#c7d2e1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
              <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: meta.bg, border: '1px solid ' + meta.border, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <C.ChatCatIcon type={meta.icon} size={20} color={meta.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{name}</p>
                <p style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.35, marginTop: 1 }}>{meta.desc}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>{meta.prompts.length} {meta.prompts.length === 1 ? 'task' : 'tasks'}</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
              </div>
            </div>)}
        </div>
        <button onClick={onOpenHistory}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, margin: '16px auto 4px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', fontFamily: 'inherit', fontSize: 12, fontWeight: 500, color: '#94a3b8', whiteSpace: 'nowrap', transition: 'color 0.12s' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#1990FF'; e.currentTarget.querySelector('span').style.textDecoration = 'underline'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.querySelector('span').style.textDecoration = 'none'; }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5" /><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" /><polyline points="12 7 12 12 15 14" /></svg>
          <span>Chat History</span>
        </button>
      </div>);
  }

  /* ───────── Merged chat screen: ProductHome (empty) → task-progress + feedback (active) ───────── */
  function ChatScreen({ sessionKey, seed, loading, zeroCredits, onNoCredits, isOnboarding, onNeedLogin, showStates }) {
    const C = window.ChatCompare;
    const [convo, setConvo] = useState([]);
    const [visible, setVisible] = useState(0);
    const [draft, setDraft] = useState('');
    const [votes, setVotes] = useState({});
    const [reasons, setReasons] = useState({});
    const [composerFocused, setComposerFocused] = useState(false);
    const scrollRef = useRef(null);
    const taRef = useRef(null);
    const timers = useRef([]);

    // Reset on New chat (and on a login-state flip, which also bumps sessionKey)
    useEffect(() => {
      timers.current.forEach(clearTimeout); timers.current = [];
      setConvo([]); setVisible(0); setDraft(''); setVotes({}); setReasons({});
    }, [sessionKey]);

    // Onboarding chat lands here from the picker → focus the composer (prefilled or empty).
    useEffect(() => { if (isOnboarding) taRef.current && taRef.current.focus(); }, [isOnboarding, sessionKey]);

    // Seed → either prefill the composer ("Try this skill") or auto-run it. Auto-run is the
    // onboarding → sign-in handoff: the message that opened the login gate gets SENT once the
    // user is back and logged in (so the conversation starts and the category home is skipped).
    useEffect(() => {
      if (!seed || !seed.text) return;
      if (seed.autorun) { run(seed.text); return; }
      setDraft(seed.text); taRef.current && taRef.current.focus();
    }, [seed]);

    useEffect(() => { const el = scrollRef.current; if (el) el.scrollTop = el.scrollHeight; }, [visible, convo]);
    useEffect(() => { const ta = taRef.current; if (!ta) return; ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'; }, [draft]);
    useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

    const started = convo.length > 0;
    const running = visible < convo.length;

    const run = (text) => {
      const t = (text != null ? text : draft).trim();
      if (!t || running) return;
      if (isOnboarding) { if (onNeedLogin) onNeedLogin(t); return; }  // logged out → gate on sign-in, hand the message up so it can auto-send after login
      if (zeroCredits) { if (onNoCredits) onNoCredits(); return; }   // out of credits → open the popup, keep the draft
      setDraft('');
      const steps = makeTaskSteps(t);
      setConvo((prev) => {
        const base = prev.length;
        let cum = 0;
        steps.forEach((step, i) => {
          cum += step.d;
          timers.current.push(setTimeout(() => setVisible(base + i + 1), cum));
        });
        return [...prev, ...steps];
      });
    };
    // Stop a running task at any time: cancel pending steps, drop a trailing "working"
    // indicator, keep the partial output, and re-enable the composer to recalibrate.
    const stop = () => {
      timers.current.forEach(clearTimeout); timers.current = [];
      let end = visible;
      while (end > 0 && convo[end - 1] && convo[end - 1].role === 'thinking') end--;
      setConvo(convo.slice(0, end));
      setVisible(end);
    };
    const feedbackFor = (idx, step) => {
      if (step.tone !== 'success') return null; // PM config: success only (onFailed = false)
      const key = 'k' + idx;
      return {
        placement: 'below', withLabel: false, // PM config: below bubble, icons only
        vote: votes[key] || null, onVote: (v) => setVotes((p) => ({ ...p, [key]: v })),
        reason: reasons[key] || null, onReason: (r) => setReasons((p) => ({ ...p, [key]: r }))
      };
    };

    const renderStep = (step, i) => {
      if (step.role === 'user') return <UserBubble key={i} content={step.content} />;
      if (step.role === 'status') return <StatusBubble key={i} content={step.content} />;
      if (step.role === 'warning') return <WarningBubble key={i} content={step.content} />;
      if (step.role === 'thinking') return i === visible - 1 ? <ThinkingBubble key={i} /> : null;
      return <FinalBubble key={i} msg={step} feedback={feedbackFor(i, step)} />;
    };

    return (
      <>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div ref={scrollRef} style={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'thin', padding: '16px' }}>
            {showStates ? <ChatStatesPreview /> : <>
              {/* Greeting shows on the pre-conversation view — it clears once a task is sent (both
                 onboarding + default). Onboarding chat pads the greeting down to match the design;
                 the picker welcome lives one level up (App), so no welcome renders here. */}
              {!started &&
                <C.IntroCard onboarding={isOnboarding} sub={isOnboarding
                  ? 'Just send your message whenever you are ready and see me do your work for you!'
                  : 'Your AI worker for BlueStacks — pick a task below or just type what you need.'} />}
              {!started
                ? <div style={{ marginTop: 4 }}>
                    {isOnboarding
                      ? null // onboarding chat = greeting + composer only (the category home is default-flow only)
                      : (loading
                          ? <window.HomeSkeleton />
                          : <ProductHome onRun={(p) => run(p)} onOpenHistory={() => window.__openChatHistory && window.__openChatHistory()} />)}
                  </div>
                : <div style={{ marginTop: 4 }}>{convo.slice(0, visible).map(renderStep)}</div>}
            </>}
          </div>
        </div>

        {/* Composer — hidden while the "Chat states" dev preview is on (nothing to type/send) */}
        {!showStates && <div style={{ flexShrink: 0, position: 'relative', padding: '4px 16px 10px' }}>
          {/* Onboarding nudge — a pulsing "Send a message to watch BlueAI work" pill sits just
             above the composer until a message is attempted (matches the design's OnboardingChat). */}
          {isOnboarding && !started &&
            <div style={{ position: 'absolute', bottom: 'calc(100% + 2px)', left: 16, display: 'inline-flex', alignItems: 'center', gap: 7, background: '#1990FF', color: 'white', borderRadius: 10, padding: '7px 12px', fontSize: 12, fontWeight: 600, boxShadow: '0 4px 14px rgba(25,144,255,0.3)', whiteSpace: 'nowrap' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'white', animation: 'ba-pulse 1.3s infinite' }} />
              Send a message to watch BlueAI work
            </div>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1.5px solid ' + (isOnboarding ? '#60a5fa' : (composerFocused ? '#1990FF' : '#c7dcf5')), borderRadius: isOnboarding ? 18 : 14, background: 'white', padding: '8px 10px', boxShadow: composerFocused ? '0 0 0 3px rgba(25,144,255,0.12)' : (isOnboarding && !started ? '0 0 0 4px rgba(25,144,255,0.12)' : '0 1px 4px rgba(0,0,0,0.04)'), transition: 'border-color 0.15s ease, box-shadow 0.15s ease' }}>
            <textarea ref={taRef} value={draft} disabled={running} rows={1}
              onChange={(e) => setDraft(e.target.value)}
              onFocus={() => setComposerFocused(true)}
              onBlur={() => setComposerFocused(false)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); run(); } }}
              placeholder={running ? 'BlueAI is working…' : 'Type your message...'}
              style={{ flex: 1, resize: 'none', background: 'transparent', border: 'none', outline: 'none', fontSize: 13.5, color: '#1f2937', padding: '4px 6px', lineHeight: 1.5, fontFamily: 'inherit', maxHeight: 120, overflowY: 'hidden' }} />
            <button onClick={() => (running ? stop() : run())} disabled={!running && !draft.trim()}
              aria-label={running ? 'Stop task' : 'Send message'} title={running ? 'Stop' : 'Send'}
              style={{ width: 34, height: 34, borderRadius: '50%', background: running ? '#eef1f6' : (draft.trim() ? '#1990FF' : '#9ec9f5'), border: running ? '1px solid #d6dce5' : 'none', cursor: (running || draft.trim()) ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s ease' }}
              onMouseEnter={(e) => { if (running || draft.trim()) e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}>
              {running
                ? <svg width="13" height="13" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="3" fill="#64748b" /></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg>}
            </button>
          </div>
        </div>}
      </>);
  }

  window.ProductChat = { ChatScreen };
})();
