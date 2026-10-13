/* BlueAI Product V2 Design System: the Chat screen, reached from Home (shown in section 57).
   The thread is a window onto the Worker record (P1): today's run is one RunCard that reads the
   record, so leaving Chat for Credits or Activity loses nothing (V2 unmounts the whole chat,
   index.html:965). Composed only from window.V2Kit, read at render.

   Chat {worker, state, steps, onBack, onNewChat, onSend, onStop, onAnswer, onChangeMode,
         onOpenRun, onOpenCredits, onNavigate, compact, landmark, frame}
     state  empty | running | waiting | done | noCredits | automatic (CHAT_STATES); picks the
            Worker fixture and the thread when worker / steps are not passed.
     steps  thread steps in V2Kit.renderMessage's shape; default is the state's thread.
   Header: ScreenHeader 'Chat' with Back (to Home) and a New chat IconButton (moved out of V2's
   top bar). Bottom: Composer, with ComposerNotice for a condition that holds before typing:
   Automatic on (V2's ribbon words, agent_permissions.jsx:197) or out of credits.
   CHAT_STATES  [[key, fixture, label, note]] in the guide's order. */
(function () {
  const K = () => window.V2Kit || {};

  const CHAT_STATES = [
    ['empty', 'verified', 'Empty', 'before anything is said today'],
    ['running', 'running', 'Running', 'Send becomes Stop'],
    ['waiting', 'waiting', 'Waiting for you', 'the job ask, with its cost'],
    ['done', 'donePending', 'Done', 'one run card, one day line'],
    ['noCredits', 'noCredits', 'Out of credits', 'said before typing'],
    ['automatic', 'automatic', 'Automatic on', 'the mode, above the field'],
  ];

  // V2's job ask word for word (worker_flow.jsx:50-51, 120-121). The cost of 'Not now' is said on
  // the card before the tap (R06, proposed copy); V2 says it only afterwards.
  const JOB_ASK = {
    role: 'ask', key: 'ask', title: 'Paid job available',
    lead: 'Watch the video and provide feedback.',
    question: 'Want me to take this one?',
    options: [
      { id: 'always', label: 'Yes, switch to Automatic', consent: true },
      { id: 'once', label: 'Just this job' },
      { id: 'deny', label: 'Not now', consequence: 'Today won’t count toward your 20 days.' },
    ],
  };

  function threadFor(state, h) {
    const sep = { role: 'separator', key: 'sep', label: 'Today' };
    const run = function (s) { return { role: 'run', key: 'run', state: s, onOpenDetail: h.onOpenRun, onAction: h.onRunAction }; };
    switch (state) {
      case 'running': return [sep, run('running')];
      case 'waiting': return [sep, run('waiting'), Object.assign({}, JOB_ASK, { onAnswer: h.onAnswer })];
      case 'done': return [
        sep, run('done-pending'),
        { role: 'user', key: 'q', content: 'Did today count?', time: '11:20 am' },
        { role: 'status', key: 'a', content: 'Today’s run is done. Day 7 of 20, pending verification. We check every run within a day.', time: '11:20 am' },
      ];
      case 'noCredits': return [sep, run('nocredits')];
      case 'automatic': return [sep, run('done-pending')];
      default: return [];
    }
  }

  // Out of credits: the field is locked and says until when (the same clock as the notice above it).
  // Its own component, so only this state runs the one-second countdown.
  function LockedComposer({ onSend }) {
    const P = K();
    const t = P.useCountdown ? P.useCountdown() : {};
    return (
      <P.Composer disabledReason={'Out of AI credits until ' + (t.clock || '5:30 am')} onSend={onSend}
        notice={P.OutOfCreditsNotice ? <P.OutOfCreditsNotice variant="composer" /> : null} />
    );
  }

  function Chat(p) {
    const P = K();
    const row = CHAT_STATES.find(function (s) { return s[0] === p.state; }) || CHAT_STATES[0];
    const state = row[0];
    const w = p.worker || (P.workerFixtures || {})[row[1]];
    const go = function (id) { return function () { if (p.onNavigate) p.onNavigate(id); }; };
    const h = {
      onOpenRun: p.onOpenRun || go('today'),
      onAnswer: p.onAnswer,
      onRunAction: function (kind) { if (kind === 'credits') (p.onOpenCredits || go('credits'))(); },
    };
    const steps = p.steps || threadFor(state, h);
    const Frame = (window.V2Screens || {}).ScreenFrame;
    if (!P.Thread || !P.Composer || !Frame) return null;

    // V2's ribbon words (agent_permissions.jsx:197-198), in the composer's notice slot.
    const auto = state === 'automatic'
      ? { tone: 'info', icon: 'zap', text: 'Automatic is on for YouTube. BlueAI takes paid YouTube jobs without asking.', action: { label: 'Change', onClick: p.onChangeMode } }
      : null;

    const empty = P.EmptyState ? (
      <P.EmptyState icon="chat" title="Chat with BlueAI"
        body="Ask about today’s run, or tell your worker what to change." />
    ) : null;

    return (
      <Frame worker={w} tab="home" compact={p.compact} landmark={p.landmark} frame={p.frame} onNavigate={p.onNavigate}>
        <div className="v2-screen v2-chat-screen">
          {P.ScreenHeader ? (
            <P.ScreenHeader title="Chat" onBack={p.onBack || go('home')}
              trailing={P.IconButton ? <P.IconButton icon="plus" label="New chat" size={32} onClick={p.onNewChat} /> : null} />
          ) : null}
          <P.Thread steps={steps} empty={empty} />
          {state === 'noCredits' ? <LockedComposer onSend={p.onSend} /> : (
            <P.Composer running={state === 'running'} awaiting={state === 'waiting'} notice={auto}
              onSend={p.onSend} onStop={p.onStop} />
          )}
        </div>
      </Frame>
    );
  }

  Object.assign(window.V2Screens = window.V2Screens || {}, { Chat, CHAT_STATES });
})();
