/* Section 15: Chip (actions-inputs slice). Kit: window.V2Kit.Chip (kit/choice.jsx, kit/actions.css).
   Spec: design-md/15-chip.md. */
(function () {
  const G = window.V2Guide;
  const { useState, useId } = React;
  const noop = function () {};
  const row = 'v2-hstack v2-wrap v2-gap-2';
  /* V2 copy, quoted (refs below). */
  const JOB = { title: 'Paid job available', lead: 'Watch the video and provide feedback.', question: 'Want me to take this one?' };
  const REPLIES = ['Yes, switch to Automatic', 'Just this job', 'Not now'];
  const PROMPT = 'What went wrong?';
  const REASONS = ["Didn't complete the task", 'Wrong result', 'Took too long', "Didn't understand me", 'Other'];
  /* Proposed copy: Activity filters (section 58). */
  const FILTERS = ['Verified', 'Pending verification', 'Missed'];

  /* V2 today: the job ask's reply chips, and the feedback reasons with one picked. */
  function V2Chips() {
    const W = window.WorkerCards;
    const F = window.ChatFeedback;
    const [vote, setVote] = useState('down');
    const [reason, setReason] = useState('Wrong result');
    const step = Object.assign({ options: REPLIES.map(function (l, i) { return { id: 'o' + i, label: l }; }) }, JOB);
    return (
      <div className="v2-stack">
        {W && W.AskBubble ? <W.AskBubble step={step} answer={null} onAnswer={noop} /> : null}
        {F && F.FeedbackThumbs ? <F.FeedbackThumbs tone="success" placement="below" vote={vote} onVote={setVote} reason={reason} onReason={setReason} /> : null}
      </div>
    );
  }

  function Reasons() {
    const K = window.V2Kit;
    const [picked, setPicked] = useState('Wrong result');
    const id = 'g-chip-' + useId().replace(/[^a-zA-Z0-9]/g, '');
    return (
      <div className="v2-stack v2-gap-2">
        <span className="v2-text-label" id={id}>{PROMPT}</span>
        <div className={row} role="group" aria-labelledby={id}>
          {REASONS.map(function (r) {
            return <K.Chip key={r} selected={picked === r} onClick={function () { setPicked(picked === r ? null : r); }}>{r}</K.Chip>;
          })}
        </div>
      </div>
    );
  }
  function Filters() {
    const K = window.V2Kit;
    const [on, setOn] = useState({ Verified: true });
    return (
      <div className={row} role="group" aria-label="Show days">
        {FILTERS.map(function (f) {
          return <K.Chip key={f} selected={!!on[f]} onClick={function () { const n = Object.assign({}, on); n[f] = !on[f]; setOn(n); }}>{f}</K.Chip>;
        })}
      </div>
    );
  }

  function ChipSection() {
    const K = window.V2Kit;
    const replies = (
      <div className={row}>
        <K.Chip icon="zap" onClick={noop}>{REPLIES[0]}</K.Chip>
        <K.Chip onClick={noop}>{REPLIES[1]}</K.Chip>
        <K.Chip onClick={noop}>{REPLIES[2]}</K.Chip>
      </div>
    );
    return (
      <G.Section id="chip">
        <G.Part name="Chip" status="changed" role="One chip for three jobs: a one-shot reply to the worker, a reason you toggle, a filter. Same look; only the behaviour differs.">
          <ul className="g-list">
            <li>Pill, 30 tall (an invisible extension makes the target 32), padding 0 12, 1px line-strong, white.</li>
            <li>Label 13/500 ink, one line; an optional 16px icon before it (zap marks the option that turns on Automatic).</li>
            <li>Reply: a plain button that answers once. Reason and filter: toggles that carry aria-pressed and show the chosen look.</li>
            <li>Rows wrap with an 8px gap.</li>
          </ul>
          <G.StateGrid states={[
            { label: 'Rest', node: <K.Chip onClick={noop}>{REPLIES[1]}</K.Chip> },
            { label: 'Hover', note: 'wash + 20% edge', node: <K.Chip onClick={noop} className="is-hover">{REPLIES[1]}</K.Chip> },
            { label: 'Focus-visible', node: <K.Chip onClick={noop} className="is-focus">{REPLIES[1]}</K.Chip> },
            { label: 'Active', node: <K.Chip onClick={noop} className="is-active">{REPLIES[1]}</K.Chip> },
            { label: 'Selected', note: 'aria-pressed', node: <K.Chip selected onClick={noop}>{REASONS[1]}</K.Chip> },
            { label: 'Selected, hover', node: <K.Chip selected onClick={noop} className="is-hover">{REASONS[1]}</K.Chip> },
            { label: 'Unselected toggle', note: 'aria-pressed false', node: <K.Chip selected={false} onClick={noop}>{REASONS[2]}</K.Chip> },
            { label: 'Disabled', node: <K.Chip disabled onClick={noop}>{REPLIES[2]}</K.Chip> },
            { label: 'With icon', node: <K.Chip icon="zap" onClick={noop}>{REPLIES[0]}</K.Chip> },
          ]} />
          <G.Stage ground="canvas" width="shell">
            <div className="v2-stack v2-gap-5">
              {replies}
              <Reasons />
              <Filters />
            </div>
          </G.Stage>
          <G.Note>Replies and reasons are V2 copy; the filters are proposed copy for Activity.</G.Note>
          <G.CompareRow
            v2={<G.Live get={function () { return (window.WorkerCards || window.ChatFeedback) && V2Chips; }} label="WorkerCards.AskBubble and ChatFeedback.FeedbackThumbs" />}
            system={<div className="v2-stack v2-gap-5">{replies}<Reasons /></div>}
            changed="Three chip looks (a 1.5px blue outline with #1990FF text at 3.24:1, a dark #334155 selected reason, a grey back pill) become one: a 1px neutral pill whose hover is a wash, not a lift, and whose selected state is the family's blue 12% fill and blue-ink label. Toggles now say they are pressed." />
          <G.SpecDrawer rows={[
            { part: 'Shape', token: '--v2-radius-pill, --v2-line-strong', value: '30 tall, pill, padding 0 12, 1px 15% black (V2: 1.5px #c7dcf5; 1px #e2e8f0 + shadow)', ref: ['actions-inputs.chip.reply', 'actions-inputs.chip.reason-idle', 'actions-inputs.chip.reason-shape', 'actions-inputs.chip.back'] },
            { part: 'Label', token: '--v2-text-13, --v2-weight-medium, --v2-ink', value: '13/500 ink (V2: 12.5/700 #1990FF at 3.24:1; 12/500 #475569)', ref: ['actions-inputs.chip.reply', 'actions-inputs.chip.reason-shape'] },
            { part: 'Hover', token: '--v2-wash-hover, --v2-line-hover', value: 'wash + 20% edge (V2: lifts 1px, no colour change)', ref: 'actions-inputs.chip.reply-hover' },
            { part: 'Press', token: '--v2-wash-press', value: 'deeper wash (V2: scale 0.96)', ref: 'actions-inputs.chip.reply-press' },
            { part: 'Selected', token: '--v2-select, --v2-select-line, --v2-blue-ink', value: 'blue 12% fill, 50% edge, #0d5ad6 label (V2: #334155 fill, white)', ref: ['actions-inputs.chip.reason-selected', 'actions-inputs.onblue.choice-on'] },
            { part: 'Focus', token: '--v2-focus-outline', value: '2px #156efe, offset 2 (V2: none)' },
            { part: 'Disabled', token: '--v2-opacity-disabled', value: 'native disabled, 0.45' },
            { part: 'Row gap', token: '--v2-space-2', value: '8 (V2: 7 and 6)' },
            { part: 'Shape choice', token: null, value: 'pill kept: in the thread it reads as "tap to answer"; the site\'s radius-9 chip is a fact, not a control', ref: 'actions-inputs.onblue.chip' },
            { part: 'Copy', token: null, value: 'V2 copy', ref: ['actions-inputs.chip.job-title', 'actions-inputs.chip.job-lead', 'actions-inputs.chip.job-question', 'actions-inputs.chip.job-options', 'actions-inputs.chip.reason-prompt', 'actions-inputs.chip.reasons'] },
          ]} />
          <G.DoDont
            do={['Use a reply chip when the worker asks and the answers are short.', 'Show what an answer costs before the chips (AskCard, section 37).', 'Give toggles aria-pressed via selected.']}
            dont={['Colour chip text blue at rest.', 'Lift or shrink a chip on hover or press.', 'Use a chip as the main action of a screen: that is a Button.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('chip', ChipSection);
})();
