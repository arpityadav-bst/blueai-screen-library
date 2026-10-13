/* BlueAI Product V2 Design System: the Chat screen, reached from Home (shown in section 57).
   The thread is a window onto the Worker record (P1): today's run is one RunCard that reads the
   record and changes in place, so leaving Chat for Credits or Activity loses nothing (V2 unmounts
   the whole chat, index.html:965). Composed only from window.V2Kit, read at render.

   Chat {worker, state, steps, onBack, onNewChat, onSend, onStop, onAnswer, onRetry, onChangeMode,
         onOpenRun, onOpenCredits, onNavigate, compact, landmark, frame}
     state  CHAT_STATES. Picks the Worker fixture and the thread when worker / steps are not
            passed; answers, Try again and Stop move the thread on in place.
     setup  a new partner's Run lands here, in V2's order (worker_flow.jsx:65-171): the pitch,
            confirm the YouTube account, watch history (PermissionRequest, section 46), the run
            time, then paid jobs per app (Always ask first; Automatic only through ConsentDialog),
            closing with ProgramSummary and when day 1 counts (decision D7). Under option A the
            first run starts there: today's RunCard follows, live, and the record says running.
            No on the handle says the worker uses only the account applied with (section 56)
            and offers Report a problem.
     waiting  a paid job is asked in the JobPreviewCard (decision D17, option A, section 45): Take
            this job, Skip: today won't count, and Switch YouTube to Automatic through the consent.
            The card owns the deadline line. Option B (D17 = 'B') is V2's AskCard with the video,
            channel and comment added (jobAsk). Every other question stays an AskCard (section 37).
     typed  what the partner types is answered from the record (a status question), with a Link
            to the control that does it (an action: the worker never changes a setting from chat),
            or with what the worker can do (out of scope). Proposed copy (section 57).
     steps  thread steps in V2Kit.renderMessage's shape, plus {role: 'node', node} for a kit part.
   Every answer that turns Automatic on (consent: true) opens ConsentDialog first and answers only
   on "I agree, turn on"; Cancel leaves the question waiting. Stop asks first while today is not
   counted yet (running, waiting, retrying).
   Header: ScreenHeader 'Chat' with Back (to Home) and a New chat IconButton (moved out of V2's
   top bar). Bottom: Composer, with one ComposerNotice for a condition that holds before typing:
   offline; at zero credits the field locks and says until when (section 48); short of today's
   run it stays open and says so (the chip's low state); else Automatic on (V2's ribbon words).
   CHAT_STATES  [[key, fixture, label, note]] in the guide's order. */
(function () {
  const { useState, useEffect } = React;
  const K = () => window.V2Kit || {};

  const CHAT_STATES = [
    ['empty', 'verified', 'Empty', 'before anything is said today'],
    ['setup', 'new', 'Setup, first run', 'Run lands here: the pitch first'],
    ['setupDone', 'setUp', 'Setup, finished', 'the rules, and when day 1 counts'],
    ['running', 'running', 'Running', 'Stop asks first'],
    ['waiting', 'waiting', 'Waiting for you', 'the job preview: take, skip, or Automatic'],
    ['done', 'donePending', 'Done', 'one run card, one day line'],
    ['nojob', 'nojob', 'Done, no job (counts)', 'the day still counts'],
    ['skipped', 'declined', 'Skipped (Not now)', 'today doesn’t count'],
    ['day20', 'day20', 'Day 20 done', 'the last day, pending'],
    ['failed', 'failed', 'Failed', 'Try again, by 9 pm'],
    ['retrying', 'failed', 'Retrying', 'the second try, live'],
    ['noCredits', 'noCredits', 'Short of credits', 'the field stays open, the notice says so'],
    ['creditsZero', 'noCredits', 'Out of credits', 'at zero the field locks until they refresh'],
    ['automatic', 'automatic', 'Automatic on', 'the mode, above the field'],
    ['request', 'verified', 'Typed request', 'a link to the control, never a silent change'],
    ['offTopic', 'verified', 'Out of scope', 'what the worker can do'],
  ];
  const DONE_SETUP = { pitch: 'yes', handle: 'yes', history: 'allowed', schedule: 'time', mode: 'ask' };
  // Decision D7 (does day 1 count), said in the close either way; option A until the PM picks.
  const DAY_ONE = { A: 'Your first run starts now, and today counts as day 1 once it’s verified.', B: 'Your first counted day is tomorrow, at your run time.' };
  const D7 = 'A';
  const YES_NO = [{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'No' }];
  const DO = { watch: 'watch it', like: 'like it', comment: 'post this comment', subscribe: 'subscribe to the channel' };
  // Decision D17 (the paid job ask): option A, built, is the JobPreviewCard; 'B' draws jobAsk.
  const D17 = 'A';
  const JOB_SAID = { once: 'Take this job', deny: 'Skip: today won’t count', always: 'Switch YouTube to Automatic' };

  // Option A: the job preview (section 45), answered once. Automatic goes through the consent.
  function jobCard(P, h, w) {
    const a = (w.today && w.today.ask) || {};
    const pick = function (id, o) { return function () { if (!h.job) h.answerJob(id, o); }; };
    return { role: 'node', key: 'ask', node: P.JobPreviewCard ? <P.JobPreviewCard job={a.job || P.WORKER_JOB} waitingSince={a.since}
      expiresAt={a.expires} answer={h.job} onTake={pick('once')} onSkip={pick('deny')} onStopAsking={pick('always', { consent: true })} /> : null };
  }

  // Option B: V2's job ask word for word (worker_flow.jsx:50-51, 120-121), plus what the job is (R07,
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
  function setupSteps(h, w, run) {
    const P = K();
    const a = h.setup;
    const ask = h.ask;
    const yt = (w.apps && w.apps.youtube) || {};
    // V2 capitalises 'BlueAI Worker' (worker_flow.jsx:64); the glossary's name is 'BlueAI worker'.
    const out = [{ role: 'separator', key: 'sep', label: 'Today' }, say('hi', 'Welcome! Let’s set up your BlueAI worker.')];
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
    // Proposed copy. V2 asks for another account (worker_flow.jsx:162), which section 56 refuses.
    if (a.handle === 'no') {
      return out.concat([say('handle-no', 'Okay. I can only use the YouTube account you applied with, or a channel under it. If you meant a different channel, report a problem and we’ll help.'),
        { role: 'node', key: 'handle-report', node: P.Link ? <P.Link standalone onClick={h.onReport}>Report a problem</P.Link> : null }]);
    }
    out.push({ role: 'node', key: 'history', node: P.PermissionRequest ? <P.PermissionRequest app="youtube" state={a.history || 'asked'}
      onAllow={function () { ask.set('history', 'allowed'); }} onNotNow={function () { ask.set('history', 'notnow'); }} /> : null });
    if (!a.history) return out;
    // V2's window example ends at 9 pm (worker_flow.jsx:73-74); runs start by 8 pm (section 62), so
    // the example ends there (proposed, section 73).
    const sched = ask('schedule', {
      lead: 'When would you like me to run each day? Give me a time, like 11 am, and I’ll start within that hour. Or give me a window, like 9 am to 8 pm, and I’ll pick a different moment in it each day. Or leave it to me.',
      options: [{ id: 'time', label: '11 am' }, { id: 'window', label: '9 am to 8 pm' }, { id: 'any', label: 'Leave it to me' }],
      hint: 'Pick one for now; change the time anytime in Settings > Worker.',
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
    if (D7 === 'A') out.push(run('running', { steps: [], current: 'Opening YouTube in App Player…' }));
    return out;
  }

  function threadFor(state, h, w) {
    const P = K();
    const sep = { role: 'separator', key: 'sep', label: 'Today' };
    const run = function (s, extra, key) { return { role: 'run', key: key || 'run', state: s, run: extra, onOpenDetail: h.onOpenRun, onAction: h.onRunAction }; };
    const ooc = P.OOC_COPY || {};
    switch (state) {
      case 'setup': case 'setupDone': return setupSteps(h, w, run);
      case 'running': return [sep, run('running')];
      case 'waiting': { // under A the job preview owns the deadline line, so the run card drops it
        const ask = D17 === 'A' ? jobCard(P, h, w) : Object.assign(jobAsk(P.WORKER_JOB), { answer: h.job, onAnswer: h.answerJob });
        if (!h.job) return [sep, run('waiting', D17 === 'A' ? { dayText: '' } : undefined), ask];
        const said = D17 === 'A' ? { role: 'user', key: 'ask-r', content: JOB_SAID[h.job] } : reply(ask, h.job);
        const out = [sep, run(h.job === 'deny' ? 'skipped' : 'running', { current: 'Opening the job’s video on YouTube…' }), ask, said];
        return h.job === 'always' ? out.concat([say('auto-on', 'Got it. Automatic is on for YouTube. I’ll take paid YouTube jobs on my own from now on.')]) : out;
      }
      case 'done': return [
        sep, run('done-pending'),
        { role: 'user', key: 'q', content: 'Did today count?', time: '11:20 am' },
        { role: 'status', key: 'a', content: 'Today’s run is done. Day 7 of 20, pending verification. We check every run within a day.', time: '11:20 am' },
      ];
      case 'nojob': return [sep, run('nojob')];
      case 'skipped': return [sep, run('skipped')];
      case 'day20': { const n = P.numbers ? P.numbers(w) : { done: 20, target: 20 };
        return [sep, run('done-pending', { dayText: 'Day ' + n.done + ' of ' + n.target + ', pending verification' })]; }
      // Typed messages (proposed copy, section 57): an action is a Link to its control, never done
      // silently from chat; out of scope says what the worker can do.
      case 'request': return [sep, { role: 'user', key: 'q', content: 'Move my run to 3 pm.', time: '10:12 am' },
        { role: 'status', key: 'a', content: 'I don’t change settings from chat, so nothing has changed. You can set the run time in Worker settings.', time: '10:12 am' },
        { role: 'node', key: 'go', node: P.Link ? <P.Link standalone onClick={h.goTo('worker-settings')}>Open Worker settings</P.Link> : null }];
      case 'offTopic': return [sep, { role: 'user', key: 'q', content: 'Can you write a caption for my next post?', time: '10:12 am' },
        { role: 'status', key: 'a', content: 'That’s not something I can do here. I run your daily YouTube job, answer questions about your runs and days, and point you to the setting you need.', time: '10:12 am' }];
      case 'failed': return [sep, run('failed')];
      case 'retrying': return [sep, run('failed', { action: null }), { role: 'user', key: 'retry', content: 'Try again' },
        run('running', { title: 'Today’s run, second try', current: 'Retrying the job…' }, 'run2')];
      case 'stopped': return [sep, run('stopped')];
      case 'noCredits': case 'creditsZero': // Each fact once: the card says the run ran short and
        // what that costs today (OOC_COPY.day); the notice above the field says when they refresh.
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
    const S = window.V2Screens || {};
    const row = CHAT_STATES.find(function (s) { return s[0] === p.state; }) || CHAT_STATES[0];
    const [local, setLocal] = useState(null);
    const [job, setJob] = useState(null);
    const [setup, setSetup] = useState(row[0] === 'setupDone' ? DONE_SETUP : {});
    const [consent, setConsent] = useState(null);
    const [report, setReport] = useState(false);
    useEffect(function () { setLocal(null); setJob(null); setSetup(row[0] === 'setupDone' ? DONE_SETUP : {}); }, [p.state]);
    const state = local || row[0];
    const fx = p.worker || (P.workerFixtures || {})[row[1]];
    // creditsZero draws the noCredits record at a zero balance, the one case where the field locks.
    const w = fx && !p.worker && row[0] === 'creditsZero' ? Object.assign({}, fx, { credits: Object.assign({}, fx.credits, { left: 0 }) }) : fx;
    const go =function (id, opts) { return function () { if (p.onNavigate) p.onNavigate(id, opts); }; };
    const Frame = S.ScreenFrame;
    if (!w || !P.Thread || !P.Composer || !Frame) return null;

    // The chrome reads the record, so a move made here (a retry, a stop, an answer, the first run
    // that setup starts under D7 option A) shows there too.
    const started = (state === 'setup' || state === 'setupDone') && !!setup.mode && D7 === 'A';
    const moved = started ? { status: 'running', startedAt: '11:02 am' }
      : state === 'waiting' && job ? (job === 'deny' ? { status: 'done', outcome: 'skipped' } : { status: 'running' })
        : ({ retrying: { status: 'running' }, running: { status: 'running' }, stopped: { status: 'stopped' } })[state] || null;
    const rec = moved ? Object.assign({}, w, started ? { setUp: true } : {}, { today: Object.assign({}, w.today, moved) }) : w;

    // An answer that turns Automatic on waits for the ConsentDialog.
    function guarded(apply) { return function (id, o) { if (o && o.consent) setConsent({ apply: function () { apply(id, o); } }); else apply(id, o); }; }
    const ask = function (key, o) { return Object.assign({ role: 'ask', key: key, answer: setup[key], onAnswer: guarded(function (id) { ask.set(key, id); }) }, o); };
    ask.set = function (key, id) { setSetup(function (s) { return Object.assign({}, s, { [key]: id }); }); };
    const h = {
      setup: setup, ask: ask, job: job, goTo: go, onReport: function () { setReport(true); },
      answerJob: guarded(function (id, o) { setJob(id); if (p.onAnswer) p.onAnswer(id, o); }),
      onOpenRun: p.onOpenRun || function () { const to = S.chipTarget ? S.chipTarget(rec) : ['activity']; go(to[0], Object.assign({ tab: 'home' }, to[1]))(); },
      onRunAction: function (kind) {
        if (kind === 'credits') (p.onOpenCredits || go('credits'))();
        else if (kind === 'retry') { if (p.onRetry) p.onRetry(); else setLocal('retrying'); }
        else if (kind === 'restart') setLocal('running');
      },
    };
    const steps = p.steps || threadFor(state, h, w);
    const live = started || state === 'running' || state === 'retrying' || (state === 'waiting' && job !== 'deny');
    const awaiting = state === 'waiting' && !job;
    const jobOn = state === 'retrying' || (state === 'waiting' && !!job && job !== 'deny'); // a paid job is under way

    // The Automatic ribbon whenever some app is on Automatic (running, waiting or done), naming the app.
    const auto = P.autoNotice ? P.autoNotice(w, p.onChangeMode || go('worker-settings')) : null;
    const empty = P.EmptyState ? (
      <P.EmptyState icon="chat" title="Chat with BlueAI" body="Ask about today’s run, your days, or where to change a setting." />
    ) : null;
    const dialog = consent && P.ConsentDialog ? (
      <P.ConsentDialog app="youtube" open worker={w}
        onAgree={function () { const c = consent; setConsent(null); c.apply(); }} onCancel={function () { setConsent(null); }} />
    ) : null;
    const sheet = report && S.ReportProblemSheet ? (
      <S.ReportProblemSheet open topic="account" email={w.account && w.account.email}
        onClose={function () { setReport(false); }} onSent={function () { setReport(false); }} />
    ) : null;

    // One notice above the field (sections 38, 48): offline; at zero the field locks and says until
    // when; short of today's run it stays open and says so, as the chip's low dot does.
    const offline = w.online === false;
    const cr = w.credits || {};
    const zero = cr.left != null && cr.left <= 0;
    const at = P.creditsTime && cr.refillAt != null ? P.creditsTime.formatClock(cr.refillAt) : null;
    const short = !zero && P.creditsDay && P.creditsDay(w) !== 'covered'
      ? { tone: 'neutral', icon: 'clock', text: 'Not enough AI credits for today’s run.' + (at ? ' They refresh at ' + at + '.' : '') } : null;
    return (
      <Frame worker={rec} tab="home" compact={p.compact} landmark={p.landmark} frame={p.frame} onNavigate={p.onNavigate}
        overlays={<React.Fragment>{dialog}{sheet}</React.Fragment>}>
        <div className="v2-screen v2-chat-screen">
          {P.ScreenHeader ? (
            <P.ScreenHeader title="Chat" onBack={p.onBack || go('home')}
              trailing={P.IconButton ? <P.IconButton icon="plus" label="New chat" size={32} onClick={p.onNewChat} /> : null} />
          ) : null}
          <P.Thread steps={steps} empty={empty} renderStep={renderStep} />
          {zero || offline ? (
            <P.Composer disabledReason="You can’t send messages right now" onSend={p.onSend}
              notice={offline ? { tone: 'neutral', icon: 'wifi-off', text: 'You’re offline. You can send messages once you’re back online.' } : (P.OutOfCreditsNotice ? <P.OutOfCreditsNotice variant="composer" refillAt={(w.credits || {}).refillAt} /> : null)} />
          ) : (
            <P.Composer running={live && !awaiting} awaiting={awaiting} costsDay={live || awaiting} paidJob={jobOn} notice={short || auto}
              onSend={p.onSend} onStop={p.onStop || function () { setJob(null); setLocal('stopped'); }} />
          )}
        </div>
      </Frame>
    );
  }

  Object.assign(window.V2Screens = window.V2Screens || {}, { Chat, CHAT_STATES });
})();
