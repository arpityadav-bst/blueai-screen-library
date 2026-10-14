/* BlueAI: the BlueAI worker's chat cards (ROB-21350). Data and scripts live in worker_flow.jsx.

   PlanCard   the live PLAN card: label, summary, numbered plan, suggested-skill chip.
   AskBubble  a worker question: the live app's "needs your input" bubble (optional bold
              title), then quick-reply chips under it. Onboarding's questions AND the daily
              paid-job ask use it, so every question reads as one, and the job ask is as light as
              the rest (Abhisht, 2026-10-05). An option flagged `consent` turns
              on Automatic for YouTube (the mode is per app), so it opens the consent dialog first
              and only answers once the person agrees; Cancel leaves the question waiting.

   Exposes window.WorkerCards = { PlanCard, AskBubble }. */
(function () {
  const AP = () => window.AgentPermissions;
  const WF = () => window.WorkerFlow;
  /* V3 (phase 3): both cards speak the chat's one bubble language (chat.css). The live app's
     AwaitInput yellow (ai-worker Message.tsx:20) becomes the Target waiting tokens while the
     question waits, with the waiting-on-you mark, the same as FinalBubble's needsInput.
     The eyebrow, the badge and the reply chips are the kit's (review round 1). */
  const ToneIcon = (p) => React.createElement(window.ChatBubbles.ToneIcon, p);

  function PlanCard() {
    const P = WF().PLAN;
    return (
      <div className="v2-anim-pop-in v3-msg">
        <div className="v3-bubble">
          <p className="v2-text-eyebrow">Plan</p>
          <p style={{ marginTop: 'var(--v2-space-1)' }}>{P.summary}</p>
          <ol className="v3-bubble-list">
            {P.steps.map((s) => <li key={s}>{s}</li>)}
          </ol>
          <span className="v2-badge" style={{ marginTop: 'var(--v2-space-2)' }}><span className="v2-badge-label">Suggested skill: {P.skill}</span></span>
        </div>
      </div>);
  }

  /* Review round 1 (U2, the kit's AskCard): pending, the bubble takes the attention fill and edge
     (--v2-waiting-fill, --v2-waiting-line) and what an answer costs sits above the chips as that
     chip's description; answered, the waiting state drops (the surface, the mark in the quiet ink)
     and the chosen chip stays as a selected pill, the answer's echo. Answering removes the chips,
     so focus moves to the settled bubble (the kit's in-place swap, V2Kit.useSwapFocus). */
  function AskBubble({ step, answer, onAnswer }) {
    const pending = !answer;
    const qid = React.useId();
    const card = React.useRef(null);
    window.V2Kit.useSwapFocus(card, pending);
    const chosen = pending ? null : step.options.find((o) => o.id === answer);
    const choose = (o) => {
      if (o.consent) { AP().requestMode('youtube', 'auto', () => onAnswer(o.id)); return; }
      if (o.mode) AP().setMode('youtube', o.mode);
      onAnswer(o.id);
    };
    return (
      <div className={'v2-anim-pop-in v3-msg' + (pending ? '' : ' v3-ask--answered')}>
        <div ref={card} className={'v3-bubble v3-toned' + (pending ? ' v3-bubble--input' : '')} tabIndex={pending ? undefined : -1} data-v2-anchor={pending ? undefined : ''}>
          <ToneIcon tone="input" />
          <div className="v3-toned-body">
            {pending && <span className="v2-sr-only">BlueAI needs your answer. </span>}
            {step.title && <p className="v3-bubble-title">{step.title}</p>}
            {step.lead && <p>{step.lead}</p>}
            {step.bullets &&
              <ul className="v3-bubble-list">
                {step.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>}
            {step.question && <p id={qid} className="v3-bubble-q">{step.question}</p>}
          </div>
        </div>
        {pending && <>
          {step.options.map((o) => o.consequence && <p key={o.id} id={qid + '-' + o.id} className="v2-ask-consequence v3-ask-cost">{o.consequence}</p>)}
          <div className="v2-ask-chips v3-ask-chips" role="group" aria-labelledby={step.question ? qid : undefined} aria-label={step.question ? undefined : (step.title || 'Answers')}>
            {step.options.map((o) =>
              <button key={o.id} type="button" className="v2-chip" aria-describedby={o.consequence ? qid + '-' + o.id : undefined} onClick={() => choose(o)}>
                {o.label}
              </button>)}
          </div>
          {step.hint && <p className="v2-text-caption v3-ask-hint">{step.hint}</p>}
        </>}
        {chosen &&
          <div className="v2-ask-chips v3-ask-chips">
            <span className="v2-chip is-selected v2-ask-answer">
              <span className="v2-sr-only">You answered: </span>
              <svg className="v2-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
              <span>{chosen.label}</span>
            </span>
          </div>}
      </div>);
  }

  window.WorkerCards = { PlanCard, AskBubble };
})();
