/* BlueAI: the BlueAI worker's chat cards (ROB-21350). Data and scripts live in worker_flow.jsx.

   PlanCard   the live PLAN card: light-blue, label, summary, numbered plan, suggested-skill chip.
   AskBubble  a worker question: the live app's yellow "needs your input" bubble (optional bold
              title), then quick-reply chips under it. The composer stays open while the question
              waits ("Or type your answer…"), so a typed answer works too (Abhisht, 2026-10-14).
              Tried and dropped the same day: an "Other" chip that focused the composer, and the
              docked answer panel (answer_dock.jsx's Dock, archived, not rendered).
              Onboarding's questions AND the daily paid-job ask use it, so every question reads as
              one. An option flagged `consent` turns on Automatic for YouTube, so it opens the
              consent dialog first and only answers once the person agrees; Cancel leaves the
              question waiting. Chips follow the design system's Chip (DS 15, "V2 today" look).
   choose     what picking an option does (consent first for Automatic, mode for Always ask), shared
              by the chips and a typed answer.

   Exposes window.WorkerCards = { PlanCard, AskBubble, choose }. */
(function () {
  const AP = () => window.AgentPermissions;
  const WF = () => window.WorkerFlow;
  const T = () => window.V2Tokens;
  /* Exact live colours: ai-worker frontend/src/components/chat/Message.tsx:20, the AwaitInput
     bubble ("bg-[#fdf6cf] border border-[#f3e8a8] text-[#8a6116]"), which this prototype already
     mirrors as chat_bubbles.jsx FINAL_STYLES.needsInput. */
  const INPUT = { bg: '#fdf6cf', border: '#f3e8a8', text: '#8a6116' };

  function PlanCard() {
    const P = WF().PLAN;
    return (
      <div className="ba-msg-in" style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
        <div style={{ maxWidth: 330, background: 'linear-gradient(135deg,#eef5ff,#e2edff)', border: '1px solid #d6e6fb', borderRadius: 16, padding: '11px 14px 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#60a5fa' }}>PLAN</p>
          <p style={{ fontSize: 13, color: '#1e3a8a', lineHeight: 1.5, marginTop: 4 }}>{P.summary}</p>
          <ol style={{ margin: '8px 0 0', paddingLeft: 18, fontSize: 12.5, color: '#1d4ed8', lineHeight: 1.6 }}>
            {P.steps.map((s) => <li key={s}>{s}</li>)}
          </ol>
          <span style={{ display: 'inline-block', marginTop: 9, fontSize: 11, fontWeight: 600, color: '#1e40af', background: '#dbeafe', borderRadius: 999, padding: '3px 9px' }}>Suggested skill: {P.skill}</span>
        </div>
      </div>);
  }

  // Picking an option: Automatic waits for the consent dialog's agreement, Always ask is set at once.
  function choose(o, done) {
    if (o.consent) { AP().requestMode('youtube', 'auto', () => done(o.id)); return; }
    if (o.mode) AP().setMode('youtube', o.mode);
    done(o.id);
  }

  // The design system's Chip, reply variant: answers once, then the row goes.
  function Chip({ label, icon, onPick }) {
    const t = T();
    return (
      <button type="button" onClick={onPick}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: t.controlSm, padding: '0 12px', border: t.stroke + 'px solid ' + t.lineStrong, background: t.surface, color: t.ink, borderRadius: t.radiusPill, fontSize: t.text13, fontWeight: t.wMedium, lineHeight: 1, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'background ' + t.dur2 + 'ms ' + t.easeStandard + ', border-color ' + t.dur2 + 'ms ' + t.easeStandard }}
        onMouseEnter={(e) => { e.currentTarget.style.background = t.washHover; e.currentTarget.style.borderColor = t.lineHover; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = t.surface; e.currentTarget.style.borderColor = t.lineStrong; }}>
        {icon && <span style={{ display: 'flex', color: t.ink3 }}>{icon}</span>}{label}
      </button>);
  }

  function AskBubble({ step, answer, onAnswer }) {
    const t = T();
    const pending = !answer;
    const Zap = AP().IcoZap;
    return (
      <div className="ba-msg-in" style={{ marginBottom: 12 }}>
        <div style={{ maxWidth: 310, background: INPUT.bg, border: '1px solid ' + INPUT.border, borderRadius: 16, padding: '11px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          {step.title && <p style={{ fontSize: 13.5, fontWeight: 800, color: INPUT.text, lineHeight: 1.4, marginBottom: 2 }}>{step.title}</p>}
          {step.lead && <p style={{ fontSize: 13.5, color: INPUT.text, lineHeight: 1.5 }}>{step.lead}</p>}
          {step.bullets &&
            <ul style={{ margin: '7px 0 0', paddingLeft: 18, fontSize: 13, color: INPUT.text, lineHeight: 1.55 }}>
              {step.bullets.map((b) => <li key={b}>{b}</li>)}
            </ul>}
          {step.question && <p style={{ fontSize: 13.5, color: INPUT.text, lineHeight: 1.5, marginTop: 7 }}>{step.question}</p>}
        </div>
        {pending && <>
          <div role="group" aria-label={step.question || step.lead} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {step.options.map((o) => <Chip key={o.id} label={o.label} icon={o.consent ? <Zap size={16} /> : null} onPick={() => choose(o, onAnswer)} />)}
          </div>
          {step.hint && <p style={{ fontSize: t.text12, color: t.ink3, lineHeight: t.leadingSnug, marginTop: 7 }}>{step.hint}</p>}
        </>}
      </div>);
  }

  window.WorkerCards = { PlanCard, AskBubble, choose };
})();
