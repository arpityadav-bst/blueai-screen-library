/* BlueAI: the BlueAI worker's chat cards (ROB-21350). Data and scripts live in worker_flow.jsx.

   PlanCard   the live PLAN card: light-blue, label, summary, numbered plan, suggested-skill chip.
   AskBubble  a worker question: the live app's yellow "needs your input" bubble (optional bold
              title), then quick-reply chips under it. Onboarding's questions AND the daily
              paid-job ask use it, so every question reads as one, and the job ask is as light as
              the rest (Abhisht, 2026-10-05). An option flagged `consent` turns
              on Automatic for YouTube (the mode is per app), so it opens the consent dialog first
              and only answers once the person agrees; Cancel leaves the question waiting.

   Exposes window.WorkerCards = { PlanCard, AskBubble }. */
(function () {
  const AP = () => window.AgentPermissions;
  const WF = () => window.WorkerFlow;
  const FAINT = '#9ca3af';
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

  function AskBubble({ step, answer, onAnswer }) {
    const pending = !answer;
    const choose = (o) => {
      if (o.consent) { AP().requestMode('youtube', 'auto', () => onAnswer(o.id)); return; }
      if (o.mode) AP().setMode('youtube', o.mode);
      onAnswer(o.id);
    };
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 8 }}>
            {step.options.map((o) =>
              <button key={o.id} className="ba-chip" onClick={() => choose(o)}
                style={{ border: '1.5px solid #c7dcf5', background: 'white', color: '#1990FF', borderRadius: 999, padding: '6px 13px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                {o.label}
              </button>)}
          </div>
          {step.hint && <p style={{ fontSize: 11.5, color: FAINT, lineHeight: 1.45, marginTop: 7 }}>{step.hint}</p>}
        </>}
      </div>);
  }

  window.WorkerCards = { PlanCard, AskBubble };
})();
