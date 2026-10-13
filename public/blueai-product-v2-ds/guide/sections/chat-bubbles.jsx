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

  function BubblesSection() {
    const K = window.V2Kit;
    return (
      <G.Section id="bubbles">
        <G.Part name="MessageBubble (user)" status="changed" role="What the partner said, or the answer they tapped. The quietest thing on screen, because the partner already knows what they said.">
          <G.StateGrid states={[
            { label: 'Rest', node: <K.MessageBubble from="user">{COPY.user}</K.MessageBubble> },
            { label: 'With time (last of a group)', node: <K.MessageBubble from="user" time="11:03 am">{COPY.user}</K.MessageBubble> },
          ]} />
          <G.CompareRow
            v2={<G.Live get={function () { return CB().UserBubble; }} props={{ content: COPY.user }} label="ChatBubbles.UserBubble" />}
            system={<K.MessageBubble from="user" time="11:03 am">{COPY.user}</K.MessageBubble>}
            changed="An indigo-violet gradient with a 30% glow was the loudest thing on screen, in a colour nothing else uses, with white text and a fixed fake date. It becomes the quietest: a blue tint (the product's one hue) with a hairline, ink text, no shadow, and a real time only on the last message of a group." />
          <G.SpecDrawer rows={[
            { part: 'Fill', token: '--v2-blue-tint', value: 'rgba(21,110,254,0.08)', ref: 'chat.user-bubble.gradient' },
            { part: 'Line', token: '--v2-blue-tint-line', value: '1px rgba(21,110,254,0.24)' },
            { part: 'Shadow', token: '--v2-shadow-0', value: 'none', ref: 'chat.user-bubble.glow' },
            { part: 'Shape', token: '--v2-radius-lg, --v2-bubble-max', value: 'radius 16, max 300', ref: ['chat.user-bubble.radius', 'chat.user-bubble.shape'] },
            { part: 'Padding', token: '--v2-space-2 + --v2-space-05, --v2-space-3 + --v2-space-05', value: '10px 14px' },
            { part: 'Text', token: '--v2-text-14, --v2-leading-body, --v2-ink', value: '14/1.5 ink #0b0b0d', ref: 'chat.user-bubble.text' },
            { part: 'Time', token: '--v2-text-12, --v2-ink-4', value: '12px #6e737c under the bubble', ref: 'chat.user-bubble.stamp-style' },
          ]} />
        </G.Part>

        <G.Part name="MessageBubble (worker)" status="changed" role="A plain sentence from the worker: a reply, a short status. Run progress lives in the RunCard, not here.">
          <G.StateGrid states={[
            { label: 'Rest', node: <K.MessageBubble from="worker">Verifying the result…</K.MessageBubble> },
            { label: 'With time', node: <K.MessageBubble from="worker" time="11:06 am">Verifying the result…</K.MessageBubble> },
            { label: 'Thinking (last step only)', node: K.renderMessage({ role: 'thinking' }, 0, [{ role: 'thinking' }]) },
          ]} />
          <G.CompareRow
            v2={<G.Live get={function () { return CB().StatusBubble; }} props={{ content: 'Verifying the result…' }} label="ChatBubbles.StatusBubble" />}
            system={<K.MessageBubble from="worker">Verifying the result…</K.MessageBubble>}
            changed="Grey fill plus shadow becomes white plus a 1px line, the site's surface rule. Thinking drops the indigo dots and the 2.56:1 caption for the shared Spinner and ink-3 text." />
          <G.SpecDrawer rows={[
            { part: 'Fill and line', token: '--v2-surface, --v2-line', value: 'white, 1px rgba(0,0,0,0.10)', ref: 'chat.status.fill' },
            { part: 'Shadow', token: '--v2-shadow-0', value: 'none', ref: 'chat.status.shadow' },
            { part: 'Text', token: '--v2-text-14, --v2-ink-2', value: '14/1.5 #3c4049', ref: 'chat.status.text' },
            { part: 'Thinking', token: '--v2-ink-3', value: 'Spinner 16 + "Working on it…" 14 #5f636b (6.0:1)', ref: ['chat.status.thinking-dots', 'chat.status.thinking-copy'] },
          ]} />
        </G.Part>

        <G.Part name="NoticeBubble" status="changed" role="An outcome or a heads-up from the worker. Neutral surface; the icon carries the tone. Only 'needs input' keeps a fill.">
          <G.StateGrid wide states={[
            { label: 'Heads-up (attention icon on neutral)', node: <K.NoticeBubble kind="headsup" lines={[COPY.headsup]} /> },
            { label: 'Heads-up with title', node: <K.NoticeBubble kind="headsup" title="Out of credits" lines={['You’ve used all of today’s AI credits.', 'Credits will be refreshed tomorrow.']} /> },
            { label: 'Outcome success (check)', node: <K.NoticeBubble kind="success" lines={[COPY.success]} /> },
            { label: 'Outcome fail (x-circle, danger)', node: <K.NoticeBubble kind="fail" lines={[COPY.fail]} /> },
            { label: 'Needs input (attention fill)', node: <K.NoticeBubble kind="needsInput" lines={[COPY.needsInput]} /> },
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
            { part: 'Needs input', token: '--v2-attention-tint, --v2-attention-line', value: '#fdf6cf fill, #f3e8a8 line, help icon #8a6116', ref: 'chat.status.final-needs-input' },
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
