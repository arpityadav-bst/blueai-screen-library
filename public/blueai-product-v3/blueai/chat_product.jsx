/* BlueAI: Product chat screen: the conversation, the composer, and the send rules.
   Home = the greeting (ProductHomeScreen.IntroCard) over the category home. Conversation =
   the task-progress + feedback engine ported from "ChatView Feedback.html". The composer is drawn
   by chat_composer.jsx (review round 1); the draft and the send / stop rules stay here.

   Bubbles, the step scripts, the feedback control and the category home were split into
   chat_bubbles.jsx / chat_feedback.jsx / product_home.jsx (2026-08-10) when this file hit 648
   lines against the workspace's 300-line rule. Only window.ProductChat leaks from here. */
(function () {
  const { useState, useRef, useEffect } = React;

  /* Pulled in at render time, not at parse time, so this file carries no load-order dependency
     on its siblings. */
  const B = () => window.ChatBubbles;
  const UserBubble = (p) => React.createElement(B().UserBubble, p);
  const StatusBubble = (p) => React.createElement(B().StatusBubble, p);
  const WarningBubble = (p) => React.createElement(B().WarningBubble, p);
  const FinalBubble = (p) => React.createElement(B().FinalBubble, p);
  const ThinkingBubble = (p) => React.createElement(B().ThinkingBubble, p);
  const ChatStatesPreview = (p) => React.createElement(B().ChatStatesPreview, p);
  const ProductHome = (p) => React.createElement(window.ProductHomeScreen.ProductHome, p);
  const IntroCard = (p) => React.createElement(window.ProductHomeScreen.IntroCard, p);
  const makeTaskSteps = (t) => B().makeTaskSteps(t);
  const makeResumeSteps = (t, app) => B().makeResumeSteps(t, app);
  const makeScheduledOocSteps = () => B().makeScheduledOocSteps();
  const WF = () => window.WorkerFlow;   // the BlueAI worker's onboarding + daily run (worker_flow.jsx, ROB-21350)
  const PlanCard = (p) => React.createElement(window.WorkerCards.PlanCard, p);
  const AskBubble = (p) => React.createElement(window.WorkerCards.AskBubble, p);
  const DayDoneCard = (p) => React.createElement(window.WorkerDayDone.DayDoneCard, p);   // the card that closes a daily run (sheet row 2)
  const DayDoneOverlay = (p) => React.createElement(window.WorkerDayDone.DayDoneOverlay, p);   // the centre "run complete" moment over the whole window
  const Composer = (p) => React.createElement(window.ChatComposer.Composer, p);   // the composer (chat_composer.jsx)

  /* ───────── Merged chat screen: ProductHome (empty) → task-progress + feedback (active) ───────── */
  function ChatScreen({ sessionKey, seed, loading, zeroCredits, onNoCredits, isOnboarding, sessionMode = 'default', onNeedLogin, showStates, bsInstalled = true, onBsInstalled, scheduledOoc = false, dailyRunKey = 0, onJobWaiting, permUi = 'ribbon', onDayDone }) {
    const [convo, setConvo] = useState([]);
    const [visible, setVisible] = useState(0);
    const [draft, setDraft] = useState('');
    const [votes, setVotes] = useState({});
    const [reasons, setReasons] = useState({});
    const [answers, setAnswers] = useState({});   // worker question / job card answers, keyed like votes: 'k' + step index
    const [seenDone, setSeenDone] = useState(-1);  // index of the day-done step whose centre overlay was dismissed
    const scrollRef = useRef(null);
    const taRef = useRef(null);
    const timers = useRef([]);

    // Reset on New chat (and on a login-state flip, which also bumps sessionKey)
    useEffect(() => {
      timers.current.forEach(clearTimeout); timers.current = [];
      setConvo([]); setVisible(0); setDraft(''); setVotes({}); setReasons({}); setAnswers({}); setSeenDone(-1);
    }, [sessionKey]);

    // Onboarding chat lands here from the picker → focus the composer (prefilled or empty).
    useEffect(() => { if (isOnboarding) taRef.current && taRef.current.focus(); }, [isOnboarding, sessionKey]);

    /* Scheduled-run-out-of-credits scenario: plays ITSELF on mount, with no user message and no
       send, because that's the whole point of the state, a scheduled BlueAI worker run happens in
       its own chat while nobody is typing. Keyed on sessionKey as well as the flag so flipping the
       preview toggle (which bumps sessionKey) replays it from the top instead of appending a
       second copy onto the first. */
    useEffect(() => {
      if (scheduledOoc && !isOnboarding) push(makeScheduledOocSteps());
    }, [scheduledOoc, sessionKey, isOnboarding]);

    // "Next day" preview: the worker's daily scheduled run plays itself in its own chat, once per click.
    useEffect(() => {
      if (!isOnboarding && WF().claimDailyRun(dailyRunKey)) push(WF().makeDailyRun({ scheduled: true }));
    }, [dailyRunKey, isOnboarding]);

    // Seed → either prefill the composer ("Try this skill") or auto-run it. Auto-run is the
    // onboarding → sign-in handoff: the message that opened the login gate gets SENT once the
    // user is back and logged in (so the conversation starts and the category home is skipped).
    useEffect(() => {
      if (!seed || !seed.text) return;
      if (seed.autorun) { run(seed.text); return; }
      setDraft(seed.text); taRef.current && taRef.current.focus();
    }, [seed]);

    useEffect(() => { const el = scrollRef.current; if (el) el.scrollTop = el.scrollHeight; }, [visible, convo]);
    useEffect(() => { const ta = taRef.current; if (!ta) return; ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'; }, [draft]);
    useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

    const started = convo.length > 0;
    /* A worker question waiting on its answer is still a run in progress: the composer stays locked
       (live placeholder below) and the Stop button stays up, so the run can be ended from the
       question OR the composer. */
    const awaitingIdx = convo.slice(0, visible).findIndex((s, i) => s.role === 'ask' && !answers['k' + i]);
    const awaiting = awaitingIdx !== -1;
    const running = visible < convo.length || awaiting;

    /* An unanswered job ask lights up BlueAI's taskbar button, the way Windows flags an app that
       needs you (Abhisht, 2026-10-05). 4s is the prototype's stand-in for "nobody answered". */
    const jobWaiting = awaiting && (convo[awaitingIdx].id === 'job' || convo[awaitingIdx].id === 'retry');
    const workerStarted = convo.slice(0, visible).some((s) => s.worker);
    const doneIdx = convo.slice(0, visible).findIndex((s) => s.role === 'daydone');   // today's run has closed: the centre moment shows until dismissed
    useEffect(() => {
      if (!onJobWaiting) return;
      if (!jobWaiting) { onJobWaiting(false); return; }
      const t = setTimeout(() => onJobWaiting(true), 4000);
      return () => clearTimeout(t);
    }, [jobWaiting]);
    useEffect(() => () => { if (onJobWaiting) onJobWaiting(false); }, []);
    // A daily run's day-done step records how today closed (the 20-day strip on the worker home and
    // the Jobs tab reads it); a scheduled run's also tells the desktop, which raises the notification.
    useEffect(() => {
      const s = convo[visible - 1];
      if (!s || (s.role !== 'daydone' && s.card !== 'daydone')) return;
      window.WorkerDayDone.setToday(s.end);
      if (s.scheduled && onDayDone) onDayDone(s.end);
    }, [visible]);

    // Append steps and schedule their reveal. Shared by run() and the post-install resume.
    const push = (steps) => {
      setConvo((prev) => {
        const base = prev.length;
        let cum = 0;
        steps.forEach((step, i) => {
          cum += step.d;
          timers.current.push(setTimeout(() => setVisible(base + i + 1), cum));
        });
        return [...prev, ...steps];
      });
    };

    const run = (text, category) => {
      const t = (text != null ? text : draft).trim();
      if (!t || running) return;
      if (isOnboarding) { if (onNeedLogin) onNeedLogin(t); return; }  // logged out → gate on sign-in, hand the message up so it can auto-send after login
      if (zeroCredits) { if (onNoCredits) onNoCredits(); return; }   // out of credits → open the popup, keep the draft
      setDraft('');
      /* No BlueStacks on this PC and the task needs an Android app → the task can't start. Answer
         in the conversation with the missing dependency and a way to fix it, rather than a popup:
         the user asked a question, so the reply belongs where the question was. */
      const app = bsInstalled ? null : window.NeedsBluestacks.needsApp(t, category);
      if (app) {
        push([{ role: 'user', content: t, d: 250 }, { role: 'needsbs', app, text: t, d: 700 }]);
        return;
      }
      // The BlueAI worker card: onboarding the first time, a daily run after that (ROB-21350).
      if (category === 'MoneyMaker') { push(WF().makeWorkerRun(t)); return; }
      push(makeTaskSteps(t));
    };

    // Stop a running task at any time: cancel pending steps, drop a trailing "working"
    // indicator, keep the partial output, and re-enable the composer to recalibrate. Stopped while
    // a question waits, the thread says what that cost (review round 1, U10): the job ask's day goes
    // untaken, so today doesn't count.
    const stop = () => {
      const asked = awaiting ? convo[awaitingIdx] : null;
      if (asked) setAnswers((p) => ({ ...p, ['k' + awaitingIdx]: 'stopped' }));
      timers.current.forEach(clearTimeout); timers.current = [];
      let end = visible;
      while (end > 0 && convo[end - 1] && convo[end - 1].role === 'thinking') end--;
      const kept = convo.slice(0, end);
      if (asked) {
        const job = asked.id === 'job' || asked.id === 'retry';
        if (asked.id === 'job') window.WorkerDayDone.setToday('declined');
        kept.push({ role: 'status', content: job ? 'Run stopped. Today’s job wasn’t taken.' : 'The run stopped before you answered.', d: 0 });
      }
      setConvo(kept);
      setVisible(kept.length);
    };
    const feedbackFor = (idx, step) => {
      if (step.tone !== 'success') return null; // PM config: success only (onFailed = false)
      const key = 'k' + idx;
      return {
        placement: 'below', withLabel: false, // PM config: below bubble, icons only
        vote: votes[key] || null, onVote: (v) => setVotes((p) => ({ ...p, [key]: v })),
        reason: reasons[key] || null, onReason: (r) => setReasons((p) => ({ ...p, [key]: r }))
      };
    };

    const renderStep = (step, i) => {
      if (step.role === 'user') return <UserBubble key={i} content={step.content} />;
      if (step.role === 'status') return <StatusBubble key={i} content={step.content} />;
      if (step.role === 'warning') return <WarningBubble key={i} title={step.title} content={step.content} refill={step.refill} />;
      /* "Needs BlueStacks" → click Get BlueStacks → an inline progress card, no modal (designer,
         2026-08-10). Clicking pushes the NEXT step into this same conversation rather than
         opening anything outside it; when that step's own timer finishes, it tells the parent to
         run the scene-level effects (mount the BlueStacks window, cycle its frames) and picks the
         original task back up right here, in the same convo, no round-trip through parent state
         needed now that nothing ever leaves the chat. */
      if (step.role === 'needsbs') return <window.NeedsBluestacks.Bubble key={i} app={step.app}
        onGet={() => push([{ role: 'installing-bs', app: step.app, text: step.text, d: 200 }])} />;
      if (step.role === 'installing-bs') return <window.NeedsBluestacks.ProgressBubble key={i} app={step.app}
        onDone={() => { onBsInstalled && onBsInstalled(step.app, step.text); push(makeResumeSteps(step.text, step.app)); }} />;
      if (step.role === 'plan') return <PlanCard key={i} />;
      if (step.role === 'daydone' || step.card === 'daydone') return <DayDoneCard key={i} step={step} answer={answers['k' + i]}
        onAnswer={(a) => { setAnswers((p) => ({ ...p, ['k' + i]: a })); push(WF().next(step, a)); }} />;
      if (step.role === 'ask') return <AskBubble key={i} step={step} answer={answers['k' + i]}
        onAnswer={(a) => { setAnswers((p) => ({ ...p, ['k' + i]: a })); push(WF().next(step, a)); }} />;
      if (step.role === 'thinking') return i === visible - 1 ? <ThinkingBubble key={i} /> : null;
      return <FinalBubble key={i} msg={step} feedback={feedbackFor(i, step)} />;
    };

    return (
      <>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div ref={scrollRef} style={{ height: '100%', overflowY: 'auto', padding: 'var(--v2-space-4)' }}>
            {showStates ? <ChatStatesPreview /> : <>
              {/* Greeting shows on the pre-conversation view, it clears once a task is sent (both
                 onboarding + default). Onboarding chat pads the greeting down to match the design;
                 the picker welcome lives one level up (App), so no welcome renders here. */}
              {!started &&
                <IntroCard onboarding={isOnboarding}
                  title={sessionMode === 'moneymaker' && !isOnboarding ? 'Hi, Alex 👋' : undefined}
                  sub={sessionMode === 'moneymaker' && !isOnboarding
                    /* Value statement, not instruction, the coach tooltip under the card already
                       says "Run this to begin"; this line instructing as well read as a stutter.
                       "skill" -> "worker" 2026-09-09: the Skills tab is hidden now and this is the
                       one worker in the product, so "skill" framing no longer matches anything
                       else the product says. */
                    ? (WF().isOnboarded() ? 'Welcome back. ' + WF().getRunTime().next : "You're all set. The BlueAI worker is all it takes to start earning.")   // returning person: the run time onboarding set, or Settings > Worker's Daily run (draft copy, sheet row 24)
                    : isOnboarding
                    ? 'Just send your message whenever you are ready and see me do your work for you!'
                    : 'Your AI worker for BlueStacks. Pick a task below or just type what you need.'} />}
              {!started
                ? <div style={{ marginTop: 'var(--v2-space-1)' }}>
                    {isOnboarding
                      ? null // pre-login chat (onboarding or moneymaker) = greeting + composer only
                      : sessionMode === 'moneymaker'
                      ? (loading ? <window.WorkerHomeSkeleton /> : <window.MoneyMaker.MoneyMakerHome onRun={(p, cat) => run(p, cat)} />)
                      : (loading
                          ? <window.HomeSkeleton />
                          : <ProductHome onRun={(p, cat) => run(p, cat)} onOpenHistory={() => window.__openChatHistory && window.__openChatHistory()} />)}
                  </div>
                /* Conversation is BOTTOM-anchored, like every real messaging app: a short thread
                   rests on the composer and grows upward, rather than hanging from the top of an
                   empty panel (designer, 2026-09-09, this was wrong in every chat mode, not just
                   the scheduled run, since they all render through here).

                   The kit's thread list (kit/chat.css .v2-thread-list, review round 2): min-height
                   100% with flex-end on the LIST, never on the scroll container (flex-end on a
                   scrolling box clips the overflowing top in Chrome and Firefox); the list simply
                   grows past 100% and the container scrolls normally. Its 8px gap spaces the
                   messages. The scroll container stays a plain block, so the pre-conversation home
                   and the ChatStatesPreview keep their top-aligned layout. */
                : <div className="v2-thread-list">{convo.slice(0, visible).map(renderStep)}</div>}
            </>}
          </div>
        </div>

        {/* Composer: hidden while the "Chat states" dev preview is on (nothing to type/send) */}
        {!showStates && <Composer taRef={taRef} draft={draft} setDraft={setDraft} running={running} awaiting={awaiting}
          onSend={() => run()} onStop={stop} isOnboarding={isOnboarding} started={started} sessionMode={sessionMode}
          permUi={permUi} workerStarted={workerStarted} scheduledOoc={scheduledOoc} />}
        {doneIdx > seenDone && <DayDoneOverlay step={convo[doneIdx]} onClose={() => setSeenDone(doneIdx)} />}
      </>);
  }

  window.ProductChat = { ChatScreen };
})();
