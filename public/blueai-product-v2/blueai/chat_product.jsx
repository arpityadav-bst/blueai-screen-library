/* BlueAI: Product chat screen: the conversation, the composer, and the send rules.
   Home = the canonical NEW variant (window.ChatCompare.NewHome + IntroCard). Conversation =
   the task-progress + feedback engine ported from "ChatView Feedback.html".

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
  const makeTaskSteps = (t) => B().makeTaskSteps(t);
  const makeResumeSteps = (t, app) => B().makeResumeSteps(t, app);
  const makeScheduledOocSteps = () => B().makeScheduledOocSteps();
  const WF = () => window.WorkerFlow;   // the BlueAI worker's onboarding + daily run (worker_flow.jsx, ROB-21350)
  const PlanCard = (p) => React.createElement(window.WorkerCards.PlanCard, p);
  const AskBubble = (p) => React.createElement(window.WorkerCards.AskBubble, p);
  const DayDoneCard = (p) => React.createElement(window.WorkerDayDone.DayDoneCard, p);   // the card that closes a daily run (sheet row 2)
  const DayDoneOverlay = (p) => React.createElement(window.WorkerDayDone.DayDoneOverlay, p);   // the centre "run complete" moment over the whole window
  const DayProgressBar = (p) => React.createElement(window.WorkerDayProgress.DayProgressBar, p);   // the 20-day bar on the chat box, after Got it

  /* ───────── Merged chat screen: ProductHome (empty) → task-progress + feedback (active) ───────── */
  function ChatScreen({ sessionKey, seed, loading, zeroCredits, onNoCredits, isOnboarding, sessionMode = 'default', onNeedLogin, showStates, bsInstalled = true, onBsInstalled, scheduledOoc = false, dailyRunKey = 0, onJobWaiting, permUi = 'chatbox', onDayDone, workerDay = 'next' }) {
    const C = window.ChatCompare;
    const [convo, setConvo] = useState([]);
    const [visible, setVisible] = useState(0);
    const [draft, setDraft] = useState('');
    const [votes, setVotes] = useState({});
    const [reasons, setReasons] = useState({});
    const [answers, setAnswers] = useState({});   // worker question / job card answers, keyed like votes: 'k' + step index
    const [seenDone, setSeenDone] = useState(-1);  // index of the day-done step whose centre overlay was dismissed
    const [barShut, setBarShut] = useState(-1);    // index of the day-done step whose progress bar was closed
    const [composerFocused, setComposerFocused] = useState(false);
    const scrollRef = useRef(null);
    const taRef = useRef(null);
    const timers = useRef([]);

    // Reset on New chat (and on a login-state flip, which also bumps sessionKey)
    useEffect(() => {
      timers.current.forEach(clearTimeout); timers.current = [];
      setConvo([]); setVisible(0); setDraft(''); setVotes({}); setReasons({}); setAnswers({}); setSeenDone(-1); setBarShut(-1);
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
    // The 20-day bar takes room above the composer after Got it: keep the thread's end in view.
    useEffect(() => { const el = scrollRef.current; if (el && seenDone >= 0) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }); }, [seenDone]); useEffect(() => { const el = scrollRef.current; if (!el || !window.ResizeObserver) return; let h = el.clientHeight; const ro = new ResizeObserver(() => { if (el.clientHeight < h && el.scrollHeight - el.scrollTop - h < 48) el.scrollTop = el.scrollHeight; h = el.clientHeight; }); ro.observe(el); return () => ro.disconnect(); }, []);   // and while the bar opens upward
    useEffect(() => { const ta = taRef.current; if (!ta) return; ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'; }, [draft]);
    useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

    const started = convo.length > 0;
    /* A worker question waiting on its answer is still a run in progress: the composer stays locked
       (live placeholder below) and the Stop button stays up, so the run can be ended from the
       question OR the composer. */
    const awaitingIdx = convo.slice(0, visible).findIndex((s, i) => s.role === 'ask' && !answers['k' + i]);
    const awaiting = awaitingIdx !== -1;
    const running = visible < convo.length || awaiting;
    /* A worker question is answered with its chips, or by typing: the composer stays open while it
       waits (Abhisht, 2026-10-14). A typed answer is read by WorkerFlow.interpret(). The docked
       answer panel (answer_dock.jsx's Dock) is archived: it rendered in the composer's place. */
    const askStep = awaiting ? convo[awaitingIdx] : null;
    const typeOk = !!askStep;
    const answerAsk = (i, step, a, typed) => { setAnswers((p) => ({ ...p, ['k' + i]: a })); push(WF().next(step, a, typed)); };
    const typeAnswer = (text) => { setDraft(''); window.AnswerDock.answerTyped(askStep, text, (a, typed) => answerAsk(awaitingIdx, askStep, a, typed), push); };

    /* An unanswered job ask lights up BlueAI's taskbar button, the way Windows flags an app that
       needs you (Abhisht, 2026-10-05). 4s is the prototype's stand-in for "nobody answered". */
    const jobWaiting = awaiting && (convo[awaitingIdx].id === 'job' || convo[awaitingIdx].id === 'retry');
    const workerStarted = convo.slice(0, visible).some((s) => s.worker);
    /* The worker is running on an app: worker_flow.jsx marks the first step it takes inside one
       `appStart` (the app). With the app ribbon (2026-10-23 trial; Abhisht: it appears "when the
       worker detects it's running on YouTube (or any app)") the ribbon takes the 20-day bar's place
       from that step until the run's last line, or a stop. It leaves on the line BEFORE the day-done
       card (900ms ahead of it), so the swap back plays in view and not under the run-complete
       popup. The setup run has no `appStart`, so Day 1's setup never shows it. */
    const shownSteps = convo.slice(0, visible);
    const lastAppStart = shownSteps.map((s) => !!s.appStart).lastIndexOf(true);
    const lastRunClose = shownSteps.map((s) => s.role === 'daydone').lastIndexOf(true);
    const closingNext = !!convo[visible] && convo[visible].role === 'daydone';
    const ribbonApp = lastAppStart >= 0 ? shownSteps[lastAppStart].appStart : 'youtube';
    /* Choosing a mode (its popover or the Auto consent is open) holds the run's close (Abhisht,
       2026-10-23: "don't overwrite the choosing popup, wait for the user's input and then show
       the today's run done popup"). The ribbon stays, and the run-complete popup waits until they
       pick or dismiss, then comes 900ms later, the gap a normal close has, so the bar is back first.
       In ribbon mode only the ribbon opens a choice, so an app this chat ran on is enough to hold it. */
    const { choosing } = window.AgentPermissions.usePermissionMode();
    const [popupReady, setPopupReady] = useState(true);
    useEffect(() => {
      if (choosing) { setPopupReady(false); return undefined; }
      const t = setTimeout(() => setPopupReady(true), 900);
      return () => clearTimeout(t);
    }, [choosing]);
    const ribbonOn = permUi === 'ribbon' && ((running && lastAppStart > lastRunClose && !closingNext) || (choosing && lastAppStart >= 0));
    const doneIdx = convo.slice(0, visible).findIndex((s) => s.role === 'daydone'); const lastDone = convo.slice(0, visible).map((s) => s.role).lastIndexOf('daydone');   // today's run has closed: the centre moment shows until dismissed; lastDone, the newest close, as a "Run once more" job gets its own popup
    useEffect(() => {
      if (!onJobWaiting) return;
      if (!jobWaiting) { onJobWaiting(false); return; }
      const t = setTimeout(() => onJobWaiting(true), 4000);
      return () => clearTimeout(t);
    }, [jobWaiting]);
    useEffect(() => () => { if (onJobWaiting) onJobWaiting(false); }, []);
    // A scheduled run's day-done card tells the desktop, which raises the Windows notification.
    useEffect(() => {
      const s = convo[visible - 1];
      if (s && s.scheduled && (s.role === 'daydone' || s.card === 'daydone') && onDayDone) onDayDone(s.end);
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
    // indicator, keep the partial output, and re-enable the composer to recalibrate.
    const stop = () => {
      if (awaiting) setAnswers((p) => ({ ...p, ['k' + awaitingIdx]: 'stopped' }));
      timers.current.forEach(clearTimeout); timers.current = [];
      let end = visible;
      while (end > 0 && convo[end - 1] && convo[end - 1].role === 'thinking') end--;
      setConvo(convo.slice(0, end));
      setVisible(end);
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
      if (step.role === 'warning') return <WarningBubble key={i} title={step.title} content={step.content} />;
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
        onAnswer={(a) => answerAsk(i, step, a)} />;
      if (step.role === 'ask') return <AskBubble key={i} step={step} answer={answers['k' + i]}
        onAnswer={(a) => answerAsk(i, step, a)} />;
      if (step.role === 'thinking') return i === visible - 1 ? <ThinkingBubble key={i} /> : null;
      return <FinalBubble key={i} msg={step} feedback={feedbackFor(i, step)} />;
    };

    /* ROB-21350 mode control. 'chatbox': the Mode chip sits in the composer's bottom bar in every
       signed-in chat (product level), with Send moving down beside it. 'ribbon' (the 2026-10-23
       trial): the one-row composer, and the app ribbon above it while the worker runs on an app. */
    const modeChip = permUi === 'chatbox' && !isOnboarding;
    const busy = running && !(typeOk && draft.trim());   // a typed answer turns Stop back into Send
    const sendBtn = (
      <button onClick={() => (!busy && typeOk ? typeAnswer(draft.trim()) : busy ? stop() : run())} disabled={!busy && !draft.trim()}
        aria-label={busy ? 'Stop task' : (typeOk ? 'Send answer' : 'Send message')} title={busy ? 'Stop' : 'Send'}
        style={{ width: modeChip ? 32 : 34, height: modeChip ? 32 : 34, borderRadius: '50%', background: busy ? '#eef1f6' : (draft.trim() ? '#1990FF' : '#9ec9f5'), border: busy ? '1px solid #d6dce5' : 'none', cursor: (busy || draft.trim()) ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s ease' }}
        onMouseEnter={(e) => { if (busy || draft.trim()) e.currentTarget.style.opacity = '0.85'; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}>
        {busy
          ? <svg width="13" height="13" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="3" fill="#64748b" /></svg>
          : <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg>}
      </button>);

    return (
      <>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div ref={scrollRef} style={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'thin', padding: '16px' }}>
            {showStates ? <ChatStatesPreview /> : <>
              {/* Greeting shows on the pre-conversation view, it clears once a task is sent (both
                 onboarding + default). Onboarding chat pads the greeting down to match the design;
                 the picker welcome lives one level up (App), so no welcome renders here. */}
              {!started &&
                <C.IntroCard onboarding={isOnboarding}
                  title={sessionMode === 'moneymaker' && !isOnboarding ? 'Hi, Alex 👋' : undefined}
                  sub={sessionMode === 'moneymaker' && !isOnboarding
                    /* Value statement, not instruction, the coach tooltip under the card already
                       says "Run this to begin"; this line instructing as well read as a stutter.
                       "skill" -> "worker" 2026-09-09: the Skills tab is hidden now and this is the
                       one worker in the product, so "skill" framing no longer matches anything
                       else the product says. */
                    ? "You're all set. The BlueAI worker is all it takes to start earning."   // one line for first-time and returning people (Abhisht, 2026-10-14)
                    : isOnboarding
                    ? 'Just send your message whenever you are ready and see me do your work for you!'
                    : 'Your AI worker for BlueStacks. Pick a task below or just type what you need.'} />}
              {!started
                ? <div style={{ marginTop: 4 }}>
                    {isOnboarding
                      ? null // pre-login chat (onboarding or moneymaker) = greeting + composer only
                      : sessionMode === 'moneymaker'
                      ? (loading ? <window.HomeSkeleton /> : <window.MoneyMaker.MoneyMakerHome onRun={(p, cat) => run(p, cat)} />)
                      : (loading
                          ? <window.HomeSkeleton />
                          : <ProductHome onRun={(p, cat) => run(p, cat)} onOpenHistory={() => window.__openChatHistory && window.__openChatHistory()} />)}
                  </div>
                /* Conversation is BOTTOM-anchored, like every real messaging app: a short thread
                   rests on the composer and grows upward, rather than hanging from the top of an
                   empty panel (designer, 2026-09-09, this was wrong in every chat mode, not just
                   the scheduled run, since they all render through here).

                   minHeight:100% + marginTop:auto, NOT justifyContent:'flex-end' on the scroll
                   container. Two reasons. (1) flex-end on a scrolling container is the classic
                   trap: once the content is taller than the box, the overflowing top gets
                   clipped and can't be scrolled back to in Chrome and Firefox. Here the wrapper
                   simply grows past 100%, marginTop:auto collapses to 0, and it scrolls normally.
                   (2) It leaves the scroll container a plain block, so the pre-conversation home
                   (greeting + cards) and the ChatStatesPreview keep their existing top-aligned
                   layout untouched: making the container itself flex would have changed all
                   three at once. The old marginTop:4 is dropped: it spaced the thread off the
                   greeting, which isn't rendered once a conversation exists. */
                : <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginTop: 'auto' }}>{convo.slice(0, visible).map(renderStep)}</div>
                  </div>}
            </>}
          </div>
        </div>

        {/* Composer: hidden while the "Chat states" dev preview is on (nothing to type/send) */}
        {!showStates && <div style={{ flexShrink: 0, position: 'relative', padding: '4px 16px 10px' }}>
          {/* Onboarding nudge: a pulsing "Send a message to watch BlueAI work" pill sits just
             above the composer until a message is attempted (matches the design's OnboardingChat). */}
          {isOnboarding && !started &&
            <div style={{ position: 'absolute', bottom: 'calc(100% + 2px)', left: 16, display: 'inline-flex', alignItems: 'center', gap: 7, background: '#1990FF', color: 'white', borderRadius: 10, padding: '7px 12px', fontSize: 12, fontWeight: 600, boxShadow: '0 4px 14px rgba(25,144,255,0.3)', whiteSpace: 'nowrap' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'white', animation: 'ba-pulse 1.3s infinite' }} />
              Send a message to watch BlueAI work
            </div>}
          {/* The 20-day bar is always there in a worker chat (Abhisht, 2026-10-15); today's run counts
             once Got it closes its popup. With the app ribbon (Abhisht, 2026-10-23: "the progress bar
             would hide (with animation) and the ribbon will appear") the two share one slot: the bar
             tucks down into the chat box and the ribbon rises out of it, and back when the run closes
             (.ba-swap, index.html). Showing both read as clutter. */}
          {sessionMode === 'moneymaker' && !isOnboarding && <div style={{ position: 'relative' }}>
            <div className={'ba-swap' + (ribbonOn ? ' is-off' : '')} aria-hidden={ribbonOn}>
              <DayProgressBar key={sessionKey} hidden={ribbonOn} day1={workerDay === 'day1'} step={doneIdx >= 0 && seenDone >= doneIdx ? convo[doneIdx] : null} />
            </div>
            {permUi === 'ribbon' && <div className={'ba-swap' + (ribbonOn ? '' : ' is-off')} aria-hidden={!ribbonOn} style={{ position: 'absolute', left: 0, right: 0, top: 0 }}>
              <window.AgentPermissions.AppRibbon app={ribbonApp} hidden={!ribbonOn} />
            </div>}
          </div>}
          <div style={{ position: 'relative', display: 'flex', flexDirection: modeChip ? 'column' : 'row', alignItems: modeChip ? 'stretch' : 'center', gap: modeChip ? 2 : 8, border: '1.5px solid ' + (isOnboarding ? '#60a5fa' : (composerFocused ? '#1990FF' : '#c7dcf5')), borderRadius: isOnboarding ? 18 : 14, background: 'white', padding: modeChip ? '8px 8px 6px 10px' : '8px 10px', boxShadow: composerFocused ? '0 0 0 3px rgba(25,144,255,0.12)' : (isOnboarding && !started ? '0 0 0 4px rgba(25,144,255,0.12)' : '0 1px 4px rgba(0,0,0,0.04)'), transition: 'border-color 0.15s ease, box-shadow 0.15s ease' }}>
            <textarea ref={taRef} value={draft} disabled={(running && !typeOk) || scheduledOoc} rows={1}
              onChange={(e) => setDraft(e.target.value)}
              onFocus={() => setComposerFocused(true)}
              onBlur={() => setComposerFocused(false)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (!typeOk) run(); else if (draft.trim()) typeAnswer(draft.trim()); } }}
              placeholder={running ? (awaiting ? 'Or type your answer…' : 'BlueAI is working…')
                /* After the running check on purpose: "BlueAI is working…" is honest until the run dies.
                   Disabled in the scheduled run's own chat (designer, 2026-09-09): nothing to type there. */
                : scheduledOoc ? 'BlueAI is out of credits until tomorrow...'
                /* the worker home's placeholder points back up at its one card */
                : (sessionMode === 'moneymaker' && !started ? 'Ask anything, or run the BlueAI worker above' : 'Type your message...')}
              style={{ flex: modeChip ? 'none' : 1, resize: 'none', background: 'transparent', border: 'none', outline: 'none', fontSize: 13.5, color: '#1f2937', padding: '4px 6px', lineHeight: 1.5, fontFamily: 'inherit', maxHeight: 120, overflowY: 'hidden' }} />
            {modeChip
              ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}><window.AgentPermissions.ModeChip />{sendBtn}</div>
              : sendBtn}
          </div>
        </div>}
        {lastDone > seenDone && !choosing && popupReady && <DayDoneOverlay step={convo[lastDone]} onClose={() => setSeenDone(lastDone)} onRunAgain={() => { setSeenDone(lastDone); push(WF().makeExtraRun(convo[lastDone])); }} />}
      </>);
  }

  window.ProductChat = { ChatScreen };
})();
