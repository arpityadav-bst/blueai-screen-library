/* ARCHIVED 2026-10-14 (Abhisht went ahead with chips): Dock is kept here but nothing renders it.
   answerTyped() is still live: the composer's typed answers go through it.

   BlueAI: the docked answer panel (Abhisht, 2026-10-14: "it's not evident enough that the users
   can also type for a response"; modelled on how Claude asks a question). The Preview panel's
   "Answers" row, Docked option.

   While a worker question waits, this panel takes the composer's place at the bottom of the chat,
   so the question can't scroll away from the person it is waiting on. The thread keeps the yellow
   question bubble (without chips) and, once answered, the reply. The panel:
     header   the live "needs your input" yellow, the question in one or two lines (the job ask's
              "Paid job available" rides above it), and Stop, since the composer's Stop is hidden.
     rows     one per option, numbered; 1 to n pick it (Automatic still opens the consent first).
     Other    always the last row, n+1. It turns into a text field in place; Enter sends, Esc goes
              back to the options. A typed answer is read by WorkerFlow.interpret(); when it can't
              tell, the words and "Sorry, I didn't get that…" go into the thread and the panel stays.
   Keys: number keys and Up/Down while the panel is up (not while the consent dialog is open).
   Focus goes to the first row when a question arrives, without scrolling. Look: "V2 today" tokens.
   Copy here ("Other", "Type your own answer", "Type your answer…") is DRAFT.

   Exposes window.AnswerDock = { Dock, answerTyped }. */
(function () {
  const { useState, useEffect, useRef } = React;
  const T = () => window.V2Tokens;
  const WF = () => window.WorkerFlow;
  const WC = () => window.WorkerCards;
  const AP = () => window.AgentPermissions;

  const svg = (size, paths) =>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>{paths}</svg>;
  const IcoPencil = () => svg(15, <><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></>);

  /* A typed answer, from the composer (Chips + Other) or this panel's Other row: the option it means
     goes through choose() and answers with the typed words; when it can't tell, the words and a
     "didn't get that" go into the thread and the question stays open. */
  function answerTyped(step, text, answer, push) {
    const id = WF().interpret(step, text);
    const o = id && step.options.find((x) => x.id === id);
    if (!o) { push([{ role: 'user', content: text, d: 250 }, { role: 'status', content: WF().UNCLEAR, d: 700 }]); return; }
    WC().choose(o, (a) => answer(a, text));
  }

  // The question for the header: the failed day's Retry question carries its words in the day-done file.
  function view(step) {
    const s = step.card === 'daydone' ? window.WorkerDayDone.failedAsk(step) : step;
    return { eyebrow: s.question && s.title ? s.title : null, text: s.question || s.lead || s.title, options: s.options };
  }

  function Row({ n, label, sub, icon, onPick }) {
    const t = T();
    return (
      <button type="button" onClick={onPick} className="ba-mode-row"
        style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', minHeight: 40, textAlign: 'left', border: 'none', background: 'transparent', borderRadius: t.radiusSm, padding: '6px 10px', cursor: 'pointer', fontFamily: 'inherit', transition: 'background ' + t.dur1 + 'ms ' + t.easeStandard }}
        onMouseEnter={(e) => { e.currentTarget.style.background = t.washHover; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
        <span aria-hidden="true" style={{ width: 22, height: 22, borderRadius: 6, background: t.sunken, color: t.ink3, fontSize: 11.5, fontWeight: t.wSemibold, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{n}</span>
        <span style={{ flex: 1, minWidth: 0, fontSize: t.text14, fontWeight: t.wMedium, color: t.ink, lineHeight: 1.35 }}>
          {label}{sub && <span style={{ marginLeft: 8, color: t.ink3, fontWeight: t.wRegular, fontSize: t.text13 }}>{sub}</span>}</span>
        {icon && <span style={{ display: 'flex', color: t.ink3 }}>{icon}</span>}
      </button>);
  }

  function Dock({ step, onAnswer, onTyped, onStop }) {
    const t = T();
    const { confirming } = AP().usePermissionMode();
    const v = view(step);
    const n = v.options.length;
    const [typing, setTyping] = useState(false);
    const [text, setText] = useState('');
    const rowsRef = useRef(null);
    const inputRef = useRef(null);
    const pick = (o) => WC().choose(o, (a) => onAnswer(a));
    const send = () => { const x = text.trim(); if (!x) return; setText(''); setTyping(false); onTyped(x); };

    // A new question: back to the options, focus on the first row (no scroll).
    useEffect(() => {
      setTyping(false); setText('');
      const b = rowsRef.current && rowsRef.current.querySelector('button');
      if (b) b.focus({ preventScroll: true });
    }, [step]);
    useEffect(() => { if (typing && inputRef.current) inputRef.current.focus({ preventScroll: true }); }, [typing]);
    useEffect(() => {
      const key = (e) => {
        if (typing || confirming) return;
        if (/^(INPUT|TEXTAREA)$/.test((e.target && e.target.tagName) || '')) return;
        const k = Number(e.key);
        if (k >= 1 && k <= n) { e.preventDefault(); pick(v.options[k - 1]); return; }
        if (k === n + 1) { e.preventDefault(); setTyping(true); return; }
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          const rows = Array.from(rowsRef.current ? rowsRef.current.querySelectorAll('button') : []);
          if (!rows.length) return;
          e.preventDefault();
          const i = rows.indexOf(document.activeElement);
          const down = e.key === 'ArrowDown';
          const next = i < 0 ? rows[down ? 0 : rows.length - 1] : rows[(i + (down ? 1 : rows.length - 1)) % rows.length];
          next.focus({ preventScroll: true });
        }
      };
      document.addEventListener('keydown', key);
      return () => document.removeEventListener('keydown', key);
    }, [typing, confirming, step]);

    const Zap = AP().IcoZap;
    return (
      <div role="group" aria-label="BlueAI needs your input" className="ba-msg-in"
        style={{ border: '1.5px solid ' + t.attentionLine, borderRadius: 14, background: t.surface, boxShadow: '0 -4px 18px rgba(15,23,42,0.08), 0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: t.attentionTint, borderBottom: t.stroke + 'px solid ' + t.attentionLine, padding: '9px 8px 9px 14px' }}>
          <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
            {v.eyebrow && <p style={{ fontSize: t.text12, fontWeight: t.wSemibold, color: t.attentionInk, opacity: 0.8, lineHeight: 1.3, marginBottom: 2 }}>{v.eyebrow}</p>}
            <p title={v.text} style={{ fontSize: t.text14, fontWeight: t.wSemibold, color: t.attentionInk, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.text}</p>
          </div>
          <button type="button" onClick={onStop} aria-label="Stop task" title="Stop"
            style={{ width: 28, height: 28, flexShrink: 0, borderRadius: '50%', background: '#eef1f6', border: '1px solid #d6dce5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="11" height="11" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="3" fill="#64748b" /></svg>
          </button>
        </div>
        <div ref={rowsRef} role="group" aria-label={v.text} style={{ padding: 4 }}>
          {v.options.map((o, i) => <Row key={o.id} n={i + 1} label={o.label} icon={o.consent ? <Zap size={15} /> : null} onPick={() => pick(o)} />)}
          {typing
            ? <div style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 40, padding: '4px 6px 4px 10px' }}>
                <span aria-hidden="true" style={{ width: 22, height: 22, borderRadius: 6, background: t.blueTint, color: t.blueInk, fontSize: 11.5, fontWeight: t.wSemibold, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{n + 1}</span>
                <input ref={inputRef} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your answer…" aria-label="Type your answer"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); send(); }
                    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setTyping(false); setText(''); }
                  }}
                  style={{ flex: 1, minWidth: 0, height: 32, border: '1.5px solid ' + t.action, borderRadius: t.radiusSm, padding: '0 10px', fontSize: t.text14, fontFamily: 'inherit', color: t.ink, outline: 'none', boxShadow: '0 0 0 3px rgba(25,144,255,0.12)' }} />
                <button type="button" onClick={send} disabled={!text.trim()} aria-label="Send answer"
                  style={{ width: 30, height: 30, flexShrink: 0, borderRadius: '50%', border: 'none', background: text.trim() ? t.action : '#9ec9f5', cursor: text.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg>
                </button>
              </div>
            : <Row n={n + 1} label="Other" sub="Type your own answer" icon={<IcoPencil />} onPick={() => setTyping(true)} />}
        </div>
      </div>);
  }

  window.AnswerDock = { Dock, answerTyped };
})();
