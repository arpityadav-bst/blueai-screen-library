/* Section 35: Message bubbles and notices (chat slice). MessageBubble (user, worker), NoticeBubble. */
(function () {
  const G = window.V2Guide;
  const CB = function () { return window.ChatBubbles || {}; };

  /* V2's own preview copy (chat_bubbles.jsx:199-202, 188), quoted exactly. */
  const COPY = {
    user: 'Play Whiteout Survival for 10 min',
    success: 'Done. I completed your task: “Play Whiteout Survival for 10 min”. Let me know if you’d like me to do anything else.',
    headsup: 'Heads up: this may use more AI credits than usual since it involves repeated actions.',
    needsInput: 'I need a bit more information to continue with “Set up a task that runs automatically every day at 6 AM”. Could you tell me which app or game instance to use?',
    fail: 'I wasn’t able to complete “Collect bonus coins in Disney Solitaire game”. The app closed unexpectedly partway through. You can try again or rephrase the request.',
  };
  /* V2's preview copy is a general assistant's, so it stays in the CompareRows (the same words on both
     sides). The state grids speak as the worker, in the strings the RunCard, AskCard and out-of-credits
     parts already use (sections 36, 37, 48). */
  const JOB = 'Watch the video and provide feedback';
  const WORK = {
    answer: 'Just this job',
    success: 'Done. I finished “' + JOB + '” and submitted the job.',
    fail: 'I couldn’t finish “' + JOB + '”. App Player closed during the job.',
    needsInput: ['Paid job available: “' + JOB + '”.', 'Answer by 9 pm or today won’t count.'],
    // Proposed: a heads-up that needs nothing from the partner. Out of AI credits is not one: it is neutral and
    // says until when (sections 03, 48), so it is not drawn as an attention bubble here.
    headsup: ['This job may use more AI credits than usual, since it repeats a few actions.'],
  };

  /* The plan step V2 shows after the first Run (worker_flow.jsx:62), read from V2's own PLAN so its
     copy exists once. Without V2 loaded, the specimen says so. */
  function planStep() {
    const P = (window.WorkerFlow || {}).PLAN;
    return P ? { role: 'plan', summary: P.summary, items: P.steps } : null;
  }

  function BubblesSection() {
    const K = window.V2Kit;
    const plan = planStep();
    const planNode = plan ? K.renderMessage(plan, 0, [plan]) : <div className="g-missing">WorkerFlow.PLAN (V2 worker_flow.jsx) is not loaded, so the plan is not drawn.</div>;
    return (
      <G.Section id="bubbles">
        <G.Note>V3 restyle (2026-10-14): the user bubble is the grey surface with a hairline, not a blue tint. Tone rides on one 16px icon; the edge takes the tone only when the run stopped (waiting: the waiting edge, the attention ink; failed: the strong danger edge, review round 2), on the surface. A message's time is a 12 ink-3 caption. The progress note (a 4px dot and a muted 13px line) is a pattern, not a bubble.</G.Note>
        <G.Part name="MessageBubble (user)" status="changed" role="What the partner said, or the answer they tapped. The quietest thing on screen, because the partner already knows what they said.">
          <G.StateGrid states={[
            { label: 'Rest', note: 'an answer the partner tapped', node: <K.MessageBubble from="user">{WORK.answer}</K.MessageBubble> },
            { label: 'With time (last of a group)', node: <K.MessageBubble from="user" time="11:05 am">{WORK.answer}</K.MessageBubble> },
          ]} />
          <G.CompareRow
            v2={<G.Live get={function () { return CB().UserBubble; }} props={{ content: COPY.user }} label="ChatBubbles.UserBubble" />}
            system={<K.MessageBubble from="user" time="11:03 am">{COPY.user}</K.MessageBubble>}
            changed="An indigo-violet gradient with a 30% glow was the loudest thing on screen, in a colour nothing else uses, with white text and a fixed fake date. It becomes the quietest: a blue tint (the product's one hue) with a hairline, ink text, no shadow, and a real time only on the last message of a group." />
          <G.SpecDrawer rows={[
            { part: 'Fill', token: '--v2-bubble-user-fill', value: '--v2-surface-sunken #f6f6f8', ref: 'chat.user-bubble.gradient' },
            { part: 'Line', token: '--v2-bubble-user-line', value: '1px --v2-line-hair (8%)' },
            { part: 'Shadow', token: '--v2-shadow-0', value: 'none', ref: 'chat.user-bubble.glow' },
            { part: 'Shape', token: '--v2-radius-lg, --v2-bubble-max', value: 'radius 16, max 300', ref: ['chat.user-bubble.radius', 'chat.user-bubble.shape'] },
            { part: 'Padding', token: '--v2-space-3, --v2-space-4', value: '12px 16px' },
            { part: 'Text', token: '--v2-text-14, --v2-leading-body, --v2-ink', value: '14/1.5 ink #0b0b0d', ref: 'chat.user-bubble.text' },
            { part: 'Time', token: '--v2-text-12, --v2-ink-4', value: '12px #6e737c under the bubble', ref: 'chat.user-bubble.stamp-style' },
          ]} />
        </G.Part>

        <G.Part name="MessageBubble (worker)" status="changed" role="A plain sentence from the worker: a reply, a short status. Run progress lives in the RunCard, not here.">
          <G.StateGrid states={[
            { label: 'Rest', node: <K.MessageBubble from="worker">Verifying the result…</K.MessageBubble> },
            { label: 'With time', node: <K.MessageBubble from="worker" time="11:06 am">Verifying the result…</K.MessageBubble> },
            { label: 'Thinking (last step only)', node: K.renderMessage({ role: 'thinking' }, 0, [{ role: 'thinking' }]) },
            { label: 'Plan', note: 'role plan: title, summary, numbered steps. V2 copy.', node: planNode },
          ]} />
          <G.CompareRow
            v2={<G.Live get={function () { return CB().StatusBubble; }} props={{ content: 'Verifying the result…' }} label="ChatBubbles.StatusBubble" />}
            system={<K.MessageBubble from="worker">Verifying the result…</K.MessageBubble>}
            changed="Grey fill plus shadow becomes white plus a 1px line, the site's surface rule. Thinking drops the indigo dots and the 2.56:1 caption for the shared Spinner and ink-3 text." />
          <G.CompareRow
            v2={<G.Live get={function () { return window.WorkerCards && window.WorkerCards.PlanCard; }} label="WorkerCards.PlanCard" />}
            system={planNode}
            changed="V2's PLAN card is a light-blue gradient with a shadow, a 10/700 pale-blue eyebrow, the summary and steps in two more blues (its step numbers hidden by the Tailwind preflight) and a 'Suggested skill: blueai-worker' chip. It becomes a worker bubble: white, 1px line, 'Plan' as a 14/600 ink title, the summary and the numbered steps in ink-2. The skill chip goes: a skill id means nothing to the partner." />
          <G.SpecDrawer rows={[
            { part: 'Fill and line', token: '--v2-surface, --v2-line', value: 'white, 1px rgba(0,0,0,0.10)', ref: 'chat.status.fill' },
            { part: 'Shadow', token: '--v2-shadow-0', value: 'none', ref: 'chat.status.shadow' },
            { part: 'Text', token: '--v2-text-14, --v2-ink-2', value: '14/1.5 #3c4049', ref: 'chat.status.text' },
            { part: 'Thinking', token: '--v2-ink-3', value: 'Spinner 16 + "Working on it…" 14 #5f636b (6.0:1)', ref: ['chat.status.thinking-dots', 'chat.status.thinking-copy'] },
            { part: 'Plan', token: '--v2-weight-semibold, --v2-ink, --v2-ink-2', value: "'Plan' 14/600 ink, then the summary and a numbered list in ink-2 with its numbers shown (V2's are hidden)", ref: 'chat.ask.plan-list' },
          ]} />
        </G.Part>

        <G.Part name="NoticeBubble" status="changed" role="An outcome or a heads-up from the worker. Neutral surface; the icon carries the tone. Only 'needs input' keeps a fill.">
          <G.StateGrid wide states={[
            { label: 'Attention (heads-up icon on neutral)', note: 'alias headsup. Proposed copy.', node: <K.NoticeBubble kind="attention" lines={WORK.headsup} /> },
            { label: 'Attention with title', node: <K.NoticeBubble kind="attention" title="Uses more AI credits" lines={WORK.headsup} /> },
            { label: 'Success (check)', node: <K.NoticeBubble kind="success" lines={[WORK.success]} /> },
            { label: 'Danger (x-circle)', note: 'alias fail', node: <K.NoticeBubble kind="danger" lines={[WORK.fail]} /> },
            { label: 'Needs input (attention fill)', note: 'alias needsInput', node: <K.NoticeBubble kind="needsInput" lines={WORK.needsInput} /> },
            { label: 'Info (used by DependencyCard)', node: <K.NoticeBubble kind="info" lines={['BlueStacks is ready.']} /> },
          ]} />
          <G.CompareRow
            v2={<G.Live get={function () { return CB().ChatStatesPreview; }} label="ChatBubbles.ChatStatesPreview" />}
            system={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <K.NoticeBubble kind="success" lines={[COPY.success]} />
                <K.NoticeBubble kind="headsup" lines={[COPY.headsup]} />
                <K.NoticeBubble kind="needsInput" lines={[COPY.needsInput]} />
                <K.NoticeBubble kind="fail" lines={[COPY.fail]} />
              </div>
            }
            changed="Four tinted message surfaces (green, orange, yellow, red), each with a shadow, become one neutral bubble whose 16px icon carries the tone, so the run card and the ask stay the loudest things in the thread. The PM-pinned needs-input yellow stays as the one attention fill. Copy is V2's, quoted exactly." />
          <G.SpecDrawer rows={[
            { part: 'Surface', token: '--v2-surface, --v2-line, --v2-radius-lg', value: 'white, 1px line, radius 16, max 300' },
            { part: 'Heads-up', token: '--v2-attention-ink', value: 'alert icon #8a6116 on white (was an orange bubble)', ref: ['chat.status.warning', 'chat.status.warning-icon'] },
            { part: 'Success', token: '--v2-success-ink', value: 'check icon #15803d (was a green bubble)', ref: 'chat.status.final-success' },
            { part: 'Fail', token: '--v2-danger-ink', value: 'x-circle icon #c03a40 (was a red bubble)', ref: 'chat.status.final-fail' },
            { part: 'Needs input', token: '--v2-waiting-fill, --v2-waiting-line', value: 'the attention tint, the attention ink as the edge, help icon #8a6116', ref: 'chat.status.final-needs-input' },
            { part: 'Title', token: '--v2-text-14, --v2-weight-semibold, --v2-ink', value: '14/600 ink, optional', ref: 'chat.status.ooc-title' },
            { part: 'Body', token: '--v2-text-14, --v2-ink-2', value: '14/1.5; one line per item when given lines' },
            { part: 'Copy', token: null, value: 'V2 preview examples, quoted', ref: ['chat.status.example-success', 'chat.status.example-warning', 'chat.status.example-needs-input', 'chat.status.example-fail'] },
          ]} />
          <G.DoDont
            do={['Let the icon say the tone; keep the words plain.', 'Use needs input only when the worker is stopped on the partner.']}
            dont={['Tint a bubble green to say success.', 'Use a notice for run progress; that is the RunCard.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('bubbles', BubblesSection);
})();
