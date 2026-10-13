/* BlueAI Product V2 Design System: the Chat screen, reached from Home (shown in section 57).
   The thread is a window onto the Worker record (P1): today's run is one RunCard that reads the
   record and changes in place, so leaving Chat for Credits or Activity loses nothing (V2 unmounts
   the whole chat, index.html:965). Composed only from window.V2Kit, read at render.

   Chat {worker, state, steps, onBack, onNewChat, onSend, onStop, onAnswer, onRetry, onChangeMode,
         onOpenRun, onOpenCredits, onNavigate, compact, landmark, frame}
     state  CHAT_STATES: empty | setup | setupDone | running | waiting | done | failed | retrying |
            noCredits | automatic. Picks the Worker fixture and the thread when worker / steps are
            not passed; answers, Try again and Stop move the thread on in place.
     setup  a new partner's Run lands here, in V2's order (worker_flow.jsx:65-171): the pitch,
            confirm the YouTube account, watch history (PermissionRequest, section 46), the run
            time, then paid jobs per app (Always ask first; Automatic only through ConsentDialog),
            closing with ProgramSummary and when day 1 counts (decision D7).
     steps  thread steps in V2Kit.renderMessage's shape, plus {role: 'node', node} for a kit part.
   Every answer that turns Automatic on (an option with consent: true) opens ConsentDialog first
   and answers only on "I agree, turn on"; Cancel leaves the question waiting. Stop asks first
   while today is not counted yet (running, waiting, retrying).
   Header: ScreenHeader 'Chat' with Back (to Home) and a New chat IconButton (moved out of V2's
   top bar). Bottom: Composer, with ComposerNotice for a condition that holds before typing:
   Automatic on (V2's ribbon words, agent_permissions.jsx:197) or out of credits.
   CHAT_STATES  [[key, fixture, label, note]] in the guide's order. */
(function () {
  const { useState, useEffect } = React;
  const K = () => window.V2Kit || {};

  const CHAT_STATES = [
    ['empty', 'verified', 'Empty', 'before anything is said today'],
    ['setup', 'new', 'Setup, first run', 'Run lands here: the pitch first'],
    ['setupDone', 'setUp', 'Setup, finished', 'the rules, and when day 1 counts'],
    ['running', 'running', 'Running', 'Stop asks first'],
    ['waiting', 'waiting', 'Waiting for you', 'the job, its cost, consent for Automatic'],
    ['done', 'donePending', 'Done', 'one run card, one day line'],
    ['failed', 'failed', 'Failed', 'Try again, by 9 pm'],
    ['retrying', 'failed', 'Retrying', 'the second try, live'],
    ['noCredits', 'noCredits', 'Out of credits', 'said once per part'],
    ['automatic', 'automatic', 'Automatic on', 'the mode, above the field'],
  ];
  const DONE_SETUP = { pitch: 'yes', handle: 'yes', history: 'allowed', schedule: 'time', mode: 'ask' };
  // Decision D7 (does day 1 count), said in the close either way; option A until the PM picks.
  const DAY_ONE = { A: 'Your first run starts now, and today counts as day 1 once it’s verified.', B: 'Your first counted day is tomorrow, at your run time.' };
  const D7 = 'A';
  const YES_NO = [{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'No' }];
  const DO = { watch: 'watch it', like: 'like it', comment: 'post this comment', subscribe: 'subscribe to the channel' };

  // V2's job ask word for word (worker_flow.jsx:50-51, 120-121), plus what the job is (R07,
  // proposed): the video and what will be done under the partner's name, so Review job has
  // something to review. The cost of 'Not now' is said before the tap (R06, proposed copy).
  function jobAsk(job) {
    const j = job || {};
    const v = j.video || {};
    const acts = (j.actions || []).map(function (a) { return DO[a]; }).filter(Boolean);
    const did = acts.length > 1 ? acts.slice(0, -1).join(', ') + ' and ' + acts[acts.length - 1] : acts[0];
    return {
      role: 'ask', key: 'ask', title: 'Paid job available',
      lead: 'Watch the video and provide feedback.',
      bullets: v.title ? ['“' + v.title + '”, ' + v.channel + ' on YouTube, ' + v.duration + '.', 'I’ll ' + did + (j.comment ? ': “' + j.comment + '”' : '.')] : null,
      question: 'Want me to take this one?',
      options: [
        { id: 'always', label: 'Yes, switch to Automatic', consent: true },
        { id: 'once', label: 'Just this job' },
        { id: 'deny', label: 'Not now', consequence: 'Today won’t count toward your 20 days.' },
      ],
    };
  }

  const say = function (key, content) { return { role: 'status', key: key, content: content }; };
  function reply(step, id) {
    const o = (step.options || []).find(function (x) { return x.id === id; });
    return { role: 'user', key: step.key + '-r', content: o ? o.label : id };
  }

  // The setup conversation so far, from the answers given. Copy is V2's (worker_flow.jsx) unless
  // noted; the handle is the record's, never a second identity (R39).
  function setupSteps(a, ask, w) {
    const P = K();
    const yt = (w.apps && w.apps.youtube) || {};
    const out = [{ role: 'separator', key: 'sep', label: 'Today' }, say('hi', 'Welcome! Let’s set up your BlueAI Worker.')];
    const pitch = ask('pitch', {
      lead: 'Here’s the idea: I’ll use your YouTube account like a genuine fan, watching things you’re actually into and keeping it active on its own, and you earn when I finish a paid job.',
      bullets: ['I only run a paid job after you say yes to that specific job.', 'You can pause, stop, or disconnect anytime.', 'I never see or type your password.'],
      question: 'Want to set this up?', options: [{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'Not now' }],
    });
    out.push(pitch);
    if (!a.pitch) return out;
    out.push(reply(pitch, a.pitch));
    if (a.pitch === 'no') return out.concat([say('pitch-no', 'No problem. Run the BlueAI worker whenever you’re ready to set it up.')]);
    const acct = ask('handle', { lead: 'Looks like you’re signed in as ' + (yt.handle || '@alexwatches') + ', is that right?', options: YES_NO });
    out.push(say('check', 'Checking your YouTube account…'), acct);
    if (!a.handle) return out;
    out.push(reply(acct, a.handle));
    if (a.handle === 'no') return out.concat([say('handle-no', 'Okay. Sign in to the YouTube account you want me to use in App Player, then run the BlueAI worker again.')]);
    out.push({ role: 'node', key: 'history', node: P.PermissionRequest ? <P.PermissionRequest app="youtube" state={a.history || 'asked'}
      onAllow={function () { ask.set('history', 'allowed'); }} onNotNow={function () { ask.set('history', 'notnow'); }} /> : null });
    if (!a.history) return out;
    const sched = ask('schedule', {
      lead: 'When would you like me to run each day? Give me a time, like 11 am, and I’ll start within that hour. Or give me a window, like 9am–9pm, and I’ll pick a different moment in it each day. Or leave it to me.',
      options: [{ id: 'time', label: '11 am' }, { id: 'window', label: '9am–9pm' }, { id: 'any', label: 'Leave it to me' }],
    });
    out.push(sched);
    if (!a.schedule) return out;
    out.push(reply(sched, a.schedule));
    const mode = ask('mode', {
      lead: 'One more thing. When I find a paid YouTube job on my daily run, should I take it on my own, or check with you first?',
      options: [{ id: 'ask', label: 'Always ask' }, { id: 'auto', label: 'Automatic', consent: true }],
      hint: 'A new app starts on Always ask. Change it anytime in Settings > Worker.',
    });
    out.push(mode);
    if (!a.mode) return out;
    const auto = a.mode === 'auto';
    out.push(reply(mode, a.mode), say('mode-ok', auto ? 'Got it. Automatic is on for YouTube. I’ll take paid jobs on my own.' : 'Got it. Always ask is on for YouTube. I’ll check with you before each paid job.'));
    out.push({ role: 'final', key: 'set', tone: 'success', content: 'You’re all set. I’ll run every day in your window and keep your account active. ' + (auto ? 'When a paid job comes up, I’ll take it on my own.' : 'When a paid job comes up, I’ll check with you first.') });
    out.push({ role: 'node', key: 'rules', node: P.Card && P.ProgramSummary ? <P.Card><div className="v2-chat-close"><P.ProgramSummary /><p className="v2-chat-dayone">{DAY_ONE[D7]}</p></div></P.Card> : null });
    return out;
  }

  function threadFor(state, h, w) {
    const P = K();
    const sep = { role: 'separator', key: 'sep', label: 'Today' };
    const run = function (s, extra, key) { return { role: 'run', key: key || 'run', state: s, run: extra, onOpenDetail: h.onOpenRun, onAction: h.onRunAction }; };
    const ooc = P.OOC_COPY || {};
    switch (state) {
      case 'setup': case 'setupDone': return setupSteps(h.setup, h.ask, w);
      case 'running': return [sep, run('running')];
      case 'waiting': {
        const ask = Object.assign(jobAsk(P.WORKER_JOB), { answer: h.job, onAnswer: h.answerJob });
        if (!h.job) return [sep, run('waiting'), ask];
        const out = [sep, run(h.job === 'deny' ? 'skipped' : 'running', { current: 'Opening the job’s video on YouTube…' }), ask, reply(ask, h.job)];
        return h.job === 'always' ? out.concat([say('auto-on', 'Got it. Automatic is on for YouTube. I’ll take paid YouTube jobs on my own from now on.')]) : out;
      }
      case 'done': return [
        sep, run('done-pending'),
        { role: 'user', key: 'q', content: 'Did today count?', time: '11:20 am' },
        { role: 'status', key: 'a', content: 'Today’s run is done. Day 7 of 20, pending verification. We check every run within a day.', time: '11:20 am' },
      ];
      case 'failed': return [sep, run('failed')];
      case 'retrying': return [sep, run('failed', { action: null }), { role: 'user', key: 'retry', content: 'Try again' },
        run('running', { title: 'Today’s run, second try', current: 'Retrying the job…' }, 'run2')];
      case 'stopped': return [sep, run('stopped')];
      case 'noCredits': // Each fact once: the card says the run ran short and what that costs today
        // (OOC_COPY.day), the notice above the field says until when, the field stays neutral.
        return [sep, run('nocredits', {
          outcome: 'Not enough credits for this job.',
          dayText: (ooc.day && ooc.day[P.creditsDay ? P.creditsDay(w) : 'stopped']) || 'Today won’t count toward your 20 days.',
        })];
      case 'automatic': return [sep, run('done-pending')];
      default: return [];
    }
  }

  function renderStep(step, i, list) {
    if (step.role === 'node') return <div key={step.key || i} className="v2-msg v2-msg--worker"><div className="v2-chat-node">{step.node}</div></div>;
    const R = K().renderMessage;
    return R ? R(step, i, list) : null;
  }

  function Chat(p) {
    const P = K();
    const row = CHAT_STATES.find(function (s) { return s[0] === p.state; }) || CHAT_STATES[0];
    const [local, setLocal] = useState(null);
    const [job, setJob] = useState(null);
    const [setup, setSetup] = useState(row[0] === 'setupDone' ? DONE_SETUP : {});
    const [consent, setConsent] = useState(null);
    useEffect(function () { setLocal(null); setJob(null); setSetup(row[0] === 'setupDone' ? DONE_SETUP : {}); }, [p.state]);
    const state = local || row[0];
    const w = p.worker || (P.workerFixtures || {})[row[1]];
    const go = function (id, opts) { return function () { if (p.onNavigate) p.onNavigate(id, opts); }; };
    const Frame = (window.V2Screens || {}).ScreenFrame;
    if (!w || !P.Thread || !P.Composer || !Frame) return null;

    // An answer that turns Automatic on waits for the ConsentDialog.
    function guarded(apply) { return function (id, o) { if (o && o.consent) setConsent({ apply: function () { apply(id, o); } }); else apply(id, o); }; }
    const ask = function (key, o) { return Object.assign({ role: 'ask', key: key, answer: setup[key], onAnswer: guarded(function (id) { ask.set(key, id); }) }, o); };
    ask.set = function (key, id) { setSetup(function (s) { return Object.assign({}, s, { [key]: id }); }); };
    const h = {
      setup: setup, ask: ask, job: job,
      answerJob: guarded(function (id, o) { setJob(id); if (p.onAnswer) p.onAnswer(id, o); }),
      onOpenRun: p.onOpenRun || go('today'),
      onRunAction: function (kind) {
        if (kind === 'credits') (p.onOpenCredits || go('credits'))();
        else if (kind === 'retry') { if (p.onRetry) p.onRetry(); else setLocal('retrying'); }
        else if (kind === 'restart') setLocal('running');
      },
    };
    const steps = p.steps || threadFor(state, h, w);
    // The chrome reads the record, so a move made here (a retry, a stop, an answer) shows there too.
    const moved = state === 'waiting' && job ? (job === 'deny' ? { status: 'done', outcome: 'skipped' } : { status: 'running' })
      : ({ retrying: { status: 'running' }, running: { status: 'running' }, stopped: { status: 'stopped' } })[state] || null;
    const rec = moved ? Object.assign({}, w, { today: Object.assign({}, w.today, moved) }) : w;
    const live = state === 'running' || state === 'retrying' || (state === 'waiting' && job !== 'deny');
    const awaiting = state === 'waiting' && !job;
    const jobOn = state === 'retrying' || (state === 'waiting' && !!job && job !== 'deny'); // a paid job is under way

    const auto = state === 'automatic' && P.autoNotice ? P.autoNotice(w, p.onChangeMode || go('worker-settings')) : null;
    const empty = P.EmptyState ? (
      <P.EmptyState icon="chat" title="Chat with BlueAI" body="Ask about today’s run, or tell your worker what to change." />
    ) : null;
    const dialog = consent && P.ConsentDialog ? (
      <P.ConsentDialog app="youtube" open worker={w}
        onAgree={function () { const c = consent; setConsent(null); c.apply(); }} onCancel={function () { setConsent(null); }} />
    ) : null;

    return (
      <Frame worker={rec} tab="home" compact={p.compact} landmark={p.landmark} frame={p.frame} onNavigate={p.onNavigate} overlays={dialog}>
        <div className="v2-screen v2-chat-screen">
          {P.ScreenHeader ? (
            <P.ScreenHeader title="Chat" onBack={p.onBack || go('home')}
              trailing={P.IconButton ? <P.IconButton icon="plus" label="New chat" size={32} onClick={p.onNewChat} /> : null} />
          ) : null}
          <P.Thread steps={steps} empty={empty} renderStep={renderStep} />
          {state === 'noCredits' ? (
            <P.Composer disabledReason="You can’t send messages right now" onSend={p.onSend}
              notice={P.OutOfCreditsNotice ? <P.OutOfCreditsNotice variant="composer" refillAt={(w.credits || {}).refillAt} /> : null} />
          ) : (
            <P.Composer running={live && !awaiting} awaiting={awaiting} costsDay={live || awaiting} paidJob={jobOn} notice={auto}
              onSend={p.onSend} onStop={p.onStop || function () { setJob(null); setLocal('stopped'); }} />
          )}
        </div>
      </Frame>
    );
  }

  Object.assign(window.V2Screens = window.V2Screens || {}, { Chat, CHAT_STATES });
})();
