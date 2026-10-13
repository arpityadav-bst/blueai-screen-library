/* Section 34: Chat thread (chat slice). Thread, DaySeparator and times, JumpToLatest. */
(function () {
  const G = window.V2Guide;
  const { useState } = React;
  const noop = function () {};
  const box = function (node, h) { return <div style={{ width: '100%', height: (h || 360) + 'px' }}>{node}</div>; };

  const JOB_ASK = {
    role: 'ask', title: 'Paid job available', lead: 'Watch the video and provide feedback.',
    question: 'Want me to take this one?',
    options: [{ id: 'always', label: 'Yes, switch to Automatic', consent: true }, { id: 'once', label: 'Just this job' }, { id: 'deny', label: 'Not now' }],
  };
  const YESTERDAY = [
    { role: 'separator', label: 'Yesterday' },
    { role: 'run', state: 'verified', run: { title: 'Yesterday’s run', startedAt: '11:14 am', dayText: 'Day 6 of 20, verified' } },
    { role: 'separator', label: 'Today' },
  ];
  const FIXTURES = {
    running: YESTERDAY.concat([{ role: 'run', state: 'running' }]),
    awaiting: YESTERDAY.concat([{ role: 'run', state: 'waiting' }, Object.assign({}, JOB_ASK, { onAnswer: noop })]),
    done: YESTERDAY.concat([
      Object.assign({}, JOB_ASK, { answer: 'once' }),
      { role: 'user', content: 'Just this job', time: '11:05 am' },
      { role: 'run', state: 'done-pending', feedback: { vote: null, onVote: noop, reason: null, onReason: noop } },
    ]),
  };
  /* Demo exchange for the scroll behaviour only (not product copy). */
  const MORE = [
    { role: 'user', content: 'When is my next run?' },
    { role: 'status', content: 'Tomorrow, within the 11 am hour.' },
    { role: 'user', content: 'Can you skip Instagram jobs?' },
    { role: 'status', content: 'Instagram isn’t connected, so I won’t take Instagram jobs.' },
  ];

  function LiveThread() {
    const K = window.V2Kit;
    const [n, setN] = useState(0);
    const steps = FIXTURES.done.concat(MORE.slice(0, n));
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {box(<K.Thread steps={steps} />, 300)}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" className="g-btn" onClick={function () { setN(Math.min(MORE.length, n + 1)); }} disabled={n >= MORE.length}>Add a message</button>
          <button type="button" className="g-btn" onClick={function () { setN(0); }}>Reset</button>
        </div>
      </div>
    );
  }

  function ThreadSection() {
    const K = window.V2Kit;
    return (
      <G.Section id="chat-thread">
        <G.Part name="Thread" status="changed" role="The conversation as a window onto today's run: bottom-anchored, sticks to the bottom only while you are there, read out politely.">
          <G.StateGrid wide states={[
            { label: 'Empty (home body)', note: 'The Home body sits here until the first message (section 57).', node: box(<K.Thread steps={[]} empty={<G.Note>Greeting and worker card render here.</G.Note>} />, 200) },
            { label: 'Running', node: box(<K.Thread steps={FIXTURES.running} />) },
            { label: 'Awaiting an answer', note: 'What needs you is always last.', node: box(<K.Thread steps={FIXTURES.awaiting} />) },
            { label: 'Done', note: 'Answer above, run card keeps the bottom.', node: box(<K.Thread steps={FIXTURES.done} />, 420) },
            { label: 'Scrolled up with new steps', node: box(<K.Thread steps={FIXTURES.done} stickToBottom={false} unseen={2} />, 420) },
            { label: 'Focus (keyboard scrolling)', note: 'The thread takes Tab focus so arrow keys scroll it.', node: box(<K.Thread steps={FIXTURES.running} className="is-focus" />) },
          ]} />
          <G.Note>Try it: scroll this thread up, then add messages. It stays where you are and counts what arrived.</G.Note>
          <LiveThread />
          <G.CompareRow
            v2={<G.FrameState url="index.html?day=next&end=job" label="V2 daily run (scheduled, its own chat)" height={830} />}
            system={box(<K.Thread steps={FIXTURES.done} />, 420)}
            changed="V2 forces the scroll to the bottom on every step and has no live region, so you cannot read back during a run and a screen reader hears nothing. The role map is kept as the canonical message kinds, plus run and notice. A daily run is one RunCard instead of 6 to 15 grey bubbles." />
          <G.SpecDrawer rows={[
            { part: 'Region', token: null, value: 'role=log, aria-live=polite, labelled "Conversation with BlueAI", focusable for keyboard scrolling' },
            { part: 'Padding', token: '--v2-gutter', value: '16px', ref: 'chat.thread.padding' },
            { part: 'Anchor', token: null, value: 'bottom: list min-height 100%, justify-content flex-end', ref: 'chat.thread.anchor' },
            { part: 'Scroll', token: null, value: 'stick to bottom only within 24px of it; otherwise count new steps', ref: 'chat.thread.force-scroll' },
            { part: 'Gap', token: '--v2-space-2', value: '8px, plus 8px when the sender changes' },
            { part: 'Message kinds', token: null, value: 'separator, user, status, thinking, plan, warning, final, notice, ask, needsbs, installing-bs, run (daydone moves to the run card)', ref: 'chat.thread.render-step' },
            { part: 'Thinking', token: null, value: 'only as the last step', ref: 'chat.thread.thinking-last' },
          ]} />
          <G.DoDont
            do={['Put whatever needs the partner last; otherwise the run card keeps the bottom.', 'Let the reader scroll up while a run plays.']}
            dont={['Yank the scroll on every step.', 'Print each run step as its own bubble.']} />
        </G.Part>

        <G.Part name="DaySeparator and times" status="new" role="When each thing happened: a day label between groups and one real time per message group.">
          <G.StateGrid states={[
            { label: 'Today', node: <K.DaySeparator label="Today" /> },
            { label: 'Yesterday', node: <K.DaySeparator label="Yesterday" /> },
            { label: 'Older (date)', node: <K.DaySeparator label="Oct 12" /> },
            { label: 'One time per group', node: <div style={{ width: '100%' }}>{K.renderMessage({ role: 'user', content: 'Just this job', time: '11:05 am' }, 0, [{ role: 'user', content: 'Just this job', time: '11:05 am' }])}</div> },
          ]} />
          <G.Note>Why the product needs it: a run is verified a day later, so "when" is the content. V2 stamps every user bubble with the same fixed date and worker bubbles with nothing. Labels come from chatTime.day() and chatTime.time() in the partner's local time.</G.Note>
          <G.SpecDrawer rows={[
            { part: 'Day label', token: '--v2-text-12, --v2-weight-medium, --v2-ink-4', value: '12/500, centred; Today, Yesterday, then "Oct 12"' },
            { part: 'Time', token: '--v2-text-12, --v2-ink-4', value: '"11:05 am" under the last message of a group', ref: 'chat.thread.stamp' },
          ]} />
        </G.Part>

        <G.Part name="JumpToLatest" status="new" role="A pill above the composer when new steps arrived while you were reading back.">
          <G.StateGrid states={[
            { label: 'Hidden (nothing new)', node: <G.Note>Renders nothing.</G.Note> },
            { label: 'One new', node: <K.JumpToLatest count={1} onClick={noop} /> },
            { label: 'Several new', node: <K.JumpToLatest count={3} onClick={noop} /> },
            { label: 'Hover', node: <K.JumpToLatest count={3} onClick={noop} className="is-hover" /> },
            { label: 'Focus', node: <K.JumpToLatest count={3} onClick={noop} className="is-focus" /> },
            { label: 'Pressed', node: <K.JumpToLatest count={3} onClick={noop} className="is-active" /> },
          ]} />
          <G.Note>Why the product needs it: V2 pulls the reader to the bottom on every step, so reading back during a run is impossible.</G.Note>
          <G.SpecDrawer rows={[
            { part: 'Shape', token: '--v2-radius-pill, --v2-hit-min', value: 'pill, min height 32px' },
            { part: 'Surface', token: '--v2-surface, --v2-line, --v2-shadow-1', value: 'white, 1px line, floats over the thread' },
            { part: 'Label', token: '--v2-text-13, --v2-weight-medium, --v2-ink-2', value: '13/500 "3 new messages", chevron-down 16' },
            { part: 'Place', token: '--v2-space-3, --v2-z-raised', value: 'centred, 12px above the thread bottom', ref: 'chat.thread.force-scroll' },
          ]} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('chat-thread', ThreadSection);
})();
