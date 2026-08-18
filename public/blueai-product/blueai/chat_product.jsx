/* BlueAI — Product chat screen: the conversation, the composer, and the send rules.
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

  /* ───────── Merged chat screen: ProductHome (empty) → task-progress + feedback (active) ───────── */
  function ChatScreen({ sessionKey, seed, loading, zeroCredits, onNoCredits, isOnboarding, sessionMode = 'default', onNeedLogin, showStates, bsInstalled = true, onBsInstalled }) {
    const C = window.ChatCompare;
    const [convo, setConvo] = useState([]);
    const [visible, setVisible] = useState(0);
    const [draft, setDraft] = useState('');
    const [votes, setVotes] = useState({});
    const [reasons, setReasons] = useState({});
    const [composerFocused, setComposerFocused] = useState(false);
    const scrollRef = useRef(null);
    const taRef = useRef(null);
    const timers = useRef([]);

    // Reset on New chat (and on a login-state flip, which also bumps sessionKey)
    useEffect(() => {
      timers.current.forEach(clearTimeout); timers.current = [];
      setConvo([]); setVisible(0); setDraft(''); setVotes({}); setReasons({});
    }, [sessionKey]);

    // Onboarding chat lands here from the picker → focus the composer (prefilled or empty).
    useEffect(() => { if (isOnboarding) taRef.current && taRef.current.focus(); }, [isOnboarding, sessionKey]);

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
    const running = visible < convo.length;

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
      push(makeTaskSteps(t));
    };

    // Stop a running task at any time: cancel pending steps, drop a trailing "working"
    // indicator, keep the partial output, and re-enable the composer to recalibrate.
    const stop = () => {
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
      if (step.role === 'warning') return <WarningBubble key={i} content={step.content} />;
      /* "Needs BlueStacks" → click Get BlueStacks → an inline progress card, no modal (designer,
         2026-08-10). Clicking pushes the NEXT step into this same conversation rather than
         opening anything outside it; when that step's own timer finishes, it tells the parent to
         run the scene-level effects (mount the BlueStacks window, cycle its frames) and picks the
         original task back up right here, in the same convo — no round-trip through parent state
         needed now that nothing ever leaves the chat. */
      if (step.role === 'needsbs') return <window.NeedsBluestacks.Bubble key={i} app={step.app}
        onGet={() => push([{ role: 'installing-bs', app: step.app, text: step.text, d: 200 }])} />;
      if (step.role === 'installing-bs') return <window.NeedsBluestacks.ProgressBubble key={i} app={step.app}
        onDone={() => { onBsInstalled && onBsInstalled(step.app, step.text); push(makeResumeSteps(step.text, step.app)); }} />;
      if (step.role === 'thinking') return i === visible - 1 ? <ThinkingBubble key={i} /> : null;
      return <FinalBubble key={i} msg={step} feedback={feedbackFor(i, step)} />;
    };

    return (
      <>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div ref={scrollRef} style={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'thin', padding: '16px' }}>
            {showStates ? <ChatStatesPreview /> : <>
              {/* Greeting shows on the pre-conversation view — it clears once a task is sent (both
                 onboarding + default). Onboarding chat pads the greeting down to match the design;
                 the picker welcome lives one level up (App), so no welcome renders here. */}
              {!started &&
                <C.IntroCard onboarding={isOnboarding}
                  title={sessionMode === 'moneymaker' && !isOnboarding ? 'Hi, Alex 👋' : undefined}
                  sub={sessionMode === 'moneymaker' && !isOnboarding
                    /* Value statement, not instruction — the coach tooltip under the card already
                       says "Run this to begin"; this line instructing as well read as a stutter. */
                    ? "You're all set. One skill is all it takes to start earning."
                    : isOnboarding
                    ? 'Just send your message whenever you are ready and see me do your work for you!'
                    : 'Your AI worker for BlueStacks — pick a task below or just type what you need.'} />}
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
                : <div style={{ marginTop: 4 }}>{convo.slice(0, visible).map(renderStep)}</div>}
            </>}
          </div>
        </div>

        {/* Composer — hidden while the "Chat states" dev preview is on (nothing to type/send) */}
        {!showStates && <div style={{ flexShrink: 0, position: 'relative', padding: '4px 16px 10px' }}>
          {/* Onboarding nudge — a pulsing "Send a message to watch BlueAI work" pill sits just
             above the composer until a message is attempted (matches the design's OnboardingChat). */}
          {isOnboarding && !started &&
            <div style={{ position: 'absolute', bottom: 'calc(100% + 2px)', left: 16, display: 'inline-flex', alignItems: 'center', gap: 7, background: '#1990FF', color: 'white', borderRadius: 10, padding: '7px 12px', fontSize: 12, fontWeight: 600, boxShadow: '0 4px 14px rgba(25,144,255,0.3)', whiteSpace: 'nowrap' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'white', animation: 'ba-pulse 1.3s infinite' }} />
              Send a message to watch BlueAI work
            </div>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1.5px solid ' + (isOnboarding ? '#60a5fa' : (composerFocused ? '#1990FF' : '#c7dcf5')), borderRadius: isOnboarding ? 18 : 14, background: 'white', padding: '8px 10px', boxShadow: composerFocused ? '0 0 0 3px rgba(25,144,255,0.12)' : (isOnboarding && !started ? '0 0 0 4px rgba(25,144,255,0.12)' : '0 1px 4px rgba(0,0,0,0.04)'), transition: 'border-color 0.15s ease, box-shadow 0.15s ease' }}>
            <textarea ref={taRef} value={draft} disabled={running} rows={1}
              onChange={(e) => setDraft(e.target.value)}
              onFocus={() => setComposerFocused(true)}
              onBlur={() => setComposerFocused(false)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); run(); } }}
              placeholder={running ? 'BlueAI is working…'
                /* MoneyMaker home is one card + a lot of air — the placeholder points back up at
                   it so the composer reads as connected to the screen, not an orphan input. */
                : (sessionMode === 'moneymaker' && !started ? 'Ask anything, or run MoneyMaker above' : 'Type your message...')}
              style={{ flex: 1, resize: 'none', background: 'transparent', border: 'none', outline: 'none', fontSize: 13.5, color: '#1f2937', padding: '4px 6px', lineHeight: 1.5, fontFamily: 'inherit', maxHeight: 120, overflowY: 'hidden' }} />
            <button onClick={() => (running ? stop() : run())} disabled={!running && !draft.trim()}
              aria-label={running ? 'Stop task' : 'Send message'} title={running ? 'Stop' : 'Send'}
              style={{ width: 34, height: 34, borderRadius: '50%', background: running ? '#eef1f6' : (draft.trim() ? '#1990FF' : '#9ec9f5'), border: running ? '1px solid #d6dce5' : 'none', cursor: (running || draft.trim()) ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s ease' }}
              onMouseEnter={(e) => { if (running || draft.trim()) e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}>
              {running
                ? <svg width="13" height="13" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="3" fill="#64748b" /></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg>}
            </button>
          </div>
        </div>}
      </>);
  }

  window.ProductChat = { ChatScreen };
})();
