/* Section 36: Run card (chat slice). RunCard, New. */
(function () {
  const G = window.V2Guide;
  const noop = function () {};

  const STATES = [
    ['running', 'Running', 'Live step with a spinner; Stop is in the composer.'],
    ['waiting', 'Waiting on you', 'The AskCard sits right under it; the day line says the deadline.'],
    ['done-pending', 'Done, pending verification', 'One tick.'],
    ['verified', 'Verified', 'Two ticks, the next morning.'],
    ['failed', 'Failed (Try again)', 'Says that today does not count yet.'],
    ['stopped', 'Stopped', 'Stop leaves a trace and the day status.'],
    ['nojob', 'No job (day counts)', 'Pending tick: the run still counts.'],
    ['nocredits', 'Out of credits', 'Neutral with a clock (section 03); day status and refresh time, decision D6.'],
    ['skipped', 'Skipped (Not now)', 'The partner said Not now. Run detail and Activity.'],
    ['expired', 'No answer (expired)', 'No answer by 9 pm, told apart from Not now. Run detail and Activity.'],
    ['rejected', 'Rejected after checking', 'Run detail and Activity, R19.'],
  ];

  function RunCardSection() {
    const K = window.V2Kit;
    return (
      <G.Section id="run-card">
        <G.Part name="RunCard" status="new" role="One card per run: the live step, finished steps folded, the outcome, whether today counts, and the one action that matters.">
          <G.Note>
            Why the product needs it: the partner opens the app to ask one thing, "is today done, and does it count?". In V2 a daily run prints 6 to 15 separate grey bubbles and the answer is never on screen in one place. The run card answers it in one glance and is the same object Home, Activity and Run detail show (P1: one Worker record). It salvages the AgentProgress idea from V2's unloaded chat.jsx.
          </G.Note>
          <G.StateGrid wide states={STATES.map(function (s) {
            return { label: s[1], note: s[2], node: <K.RunCard state={s[0]} onAction={noop} onOpenDetail={noop} /> };
          }).concat([
            { label: 'Steps expanded', note: 'The disclosure is a real button with aria-expanded.', node: <K.RunCard state="done-pending" defaultExpanded onOpenDetail={noop} /> },
            { label: 'Full width (Run detail)', note: 'full fills the screen column.', node: <div style={{ width: '100%' }}><K.RunCard state="verified" full defaultExpanded /></div> },
          ])} />
          <G.StateGrid states={[
            { label: 'Disclosure hover', node: <button type="button" className="v2-run-toggle is-hover" aria-expanded="false">7 steps done</button> },
            { label: 'Disclosure focus', node: <button type="button" className="v2-run-toggle is-focus" aria-expanded="false">7 steps done</button> },
            { label: 'Details link hover', node: <K.Link standalone className="is-hover">See run details</K.Link> },
            { label: 'Details link focus', node: <K.Link standalone className="is-focus">See run details</K.Link> },
          ]} />
          <G.CompareRow
            v2Label="V2 today (no run card)"
            v2={<G.FrameState url="index.html?day=next&end=job" label="V2 daily run, one bubble per step" height={830} />}
            system={<K.RunCard state="done-pending" onOpenDetail={noop} />}
            changed="New. V2 has no run object: each step is a StatusBubble, the outcome is a separate green bubble, and whether the day counts appears only in the centre overlay. The card keeps V2's own lines where they exist (the done line, 'No paid job on the board today.', the App Player failure, the out-of-credits line, 'Today doesn’t count toward your 20 days.')." />
          <G.SpecDrawer rows={[
            { part: 'Card', token: '--v2-surface, --v2-line, --v2-radius-lg, --v2-space-4', value: 'white, 1px line, radius 16, padding 16, gap 12, no shadow' },
            { part: 'Width', token: '--v2-bubble-max', value: '300 in the thread; 100% with full' },
            { part: 'Header', token: '--v2-text-14, --v2-weight-semibold, --v2-ink', value: '"Today’s run" 14/600 + start time 12 ink-4 + Badge' },
            { part: 'Badge', token: 'status family', value: 'Running info (busy dot), Waiting for you attention, Done neutral (pending verification, section 03), Verified success, Didn’t finish danger, Stopped, Skipped, No answer and Out of credits neutral (out of credits with a clock, section 03)' },
            { part: 'Live row', token: '--v2-ink-2', value: 'Spinner 16 + current step 14', ref: ['chat.run.jobs-board', 'chat.run.status-render'] },
            { part: 'Disclosure', token: '--v2-text-13, --v2-ink-3, --v2-hit-min', value: '"7 steps done", 13/500, 32px tall, chevron turns', ref: 'chat.run.routine' },
            { part: 'Steps', token: '--v2-text-13, --v2-text-12, --v2-ink-4', value: 'check 16 ink-3, past-tense label 13, time 12 tabular', ref: 'chat.run.daily-head' },
            { part: 'Outcome', token: '--v2-ink', value: 'icon 16 in tone + one line 14 ink', ref: ['chat.run.done-line', 'chat.run.fail-copy', 'chat.run.nojob', 'chat.status.ooc-fail'] },
            { part: 'Day line', token: '--v2-line-hair, --v2-text-13, --v2-ink-3', value: 'hairline above; StatusTick + "Day 7 of 20, pending verification"', ref: ['chat.run.pending', 'chat.run.verify-note'] },
            { part: 'Day line, not counted', token: '--v2-ink-3', value: '"Today doesn’t count toward your 20 days."', ref: 'chat.run.declined' },
            { part: 'Day line, verified / rejected / waiting', token: '--v2-success-ink, --v2-danger-ink, --v2-attention-ink', value: 'text in tone' },
            { part: 'Waiting edge', token: '--v2-attention-line', value: 'border only; the fill stays on the AskCard' },
            { part: 'Action', token: 'Button md', value: 'Try again (primary), Run again or See AI credits (secondary), See run details (V2Kit.Link standalone: underlined ink link, 32px)' },
            { part: 'Stopped', token: null, value: 'a stopped run keeps its card and states the day', ref: 'chat.run.stop-trace' },
            { part: 'Origin', token: null, value: 'AgentProgress, never loaded in V2', ref: 'chat.run.agent-progress' },
          ]} />
          <G.Warn>Copy that V2 does not have is proposed and marked in DESIGN.md: the waiting deadline (R08), "Try again before 9 pm", the stopped, skipped and no-answer lines, and whether an out-of-credits run costs the day (decision D6, R14).</G.Warn>
          <G.DoDont
            do={['Keep one card per run and update it in place.', 'Say the day status in words next to the tick.', 'Offer one action, the one that changes today.']}
            dont={['Print a bubble per step.', 'Colour a pending day green.', 'Use "Retry" in new copy; the system word is "Try again".']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('run-card', RunCardSection);
})();
