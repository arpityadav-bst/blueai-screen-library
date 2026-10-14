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
  /* V3: both cards are the kit's (review round 2, kit/chat.css): the plan a worker MessageBubble
     (.v2-bubble with its title, paragraph and numbered list), the question the AskCard (.v2-ask).
     The live app's AwaitInput yellow (ai-worker Message.tsx:20) becomes the kit's waiting fill and
     edge while the question waits. The eyebrow, the badge and the reply chips are the kit's too. */
  function PlanCard() {
    const P = WF().PLAN;
    return (
      <div className="v2-anim-pop-in v2-msg v2-msg--worker">
        <div className="v2-bubble v2-text-body">
          <p className="v2-text-eyebrow">Plan</p>
          <p className="v2-bubble-p" style={{ marginTop: 'var(--v2-space-1)' }}>{P.summary}</p>
          <ol className="v2-bubble-list">
            {P.steps.map((s) => <li key={s}>{s}</li>)}
          </ol>
          <span className="v2-badge" style={{ marginTop: 'var(--v2-space-2)' }}><span className="v2-badge-label">Suggested skill: {P.skill}</span></span>
        </div>
      </div>);
  }

  /* The kit's AskCard (U2 of review round 1; its markup since round 2): pending, the card takes the
     attention fill and edge (--v2-waiting-fill, --v2-waiting-line) and what an answer costs sits
     above the chips as that chip's description; answered, it settles to the surface and the chosen
     chip stays as a selected pill, the answer's echo. Answering removes the chips, so focus moves
     to the settled card (the kit's in-place swap, V2Kit.useSwapFocus). */
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
      <div className={'v2-anim-pop-in v2-msg v2-msg--worker v2-ask ' + (pending ? 'is-pending' : 'is-answered')}>
        <div ref={card} className="v2-ask-card v2-text-body" tabIndex={pending ? undefined : -1} data-v2-anchor={pending ? undefined : ''}>
          {pending && <span className="v2-sr-only">BlueAI needs your answer. </span>}
          {step.title && <p className="v2-ask-title">{step.title}</p>}
          {step.lead && <p className="v2-ask-text">{step.lead}</p>}
          {step.bullets &&
            <ul className="v2-ask-bullets">
              {step.bullets.map((b) => <li key={b}>{b}</li>)}
            </ul>}
          {step.question && <p id={qid} className="v2-ask-text">{step.question}</p>}
        </div>
        {pending && <>
          {step.options.map((o) => o.consequence && <p key={o.id} id={qid + '-' + o.id} className="v2-ask-consequence">{o.consequence}</p>)}
          <div className="v2-ask-chips" role="group" aria-labelledby={step.question ? qid : undefined} aria-label={step.question ? undefined : (step.title || 'Answers')}>
            {step.options.map((o) =>
              <button key={o.id} type="button" className="v2-chip" aria-describedby={o.consequence ? qid + '-' + o.id : undefined} onClick={() => choose(o)}>
                {o.label}
              </button>)}
          </div>
          {step.hint && <p className="v2-ask-hint">{step.hint}</p>}
        </>}
        {chosen &&
          <div className="v2-ask-chips">
            <span className="v2-chip is-selected v2-ask-answer">
              <span className="v2-sr-only">You answered: </span>
              <window.V2Kit.Icon name="check" />
              <span>{chosen.label}</span>
            </span>
          </div>}
      </div>);
  }

  window.WorkerCards = { PlanCard, AskBubble };
})();
