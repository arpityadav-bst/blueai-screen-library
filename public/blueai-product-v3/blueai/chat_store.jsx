/* BlueAI: the chat's conversation, held ABOVE the chat screen (review round 2, R1).
   The conversation, its reveal timers and the worker run's answers live in this module, not in
   ChatScreen's state, so leaving Chat (a tab, Credits, History, Profile, even closing the window)
   unmounts the screen and nothing else: the run keeps playing, and coming back shows it where it
   is. App starts a new conversation (reset) when it starts a new session; nothing on the screen
   resets it on mount.

   A step that shows can record how today went for the 20 days (WorkerDayDone.setToday): a day-done
   step its `end`, any step its `record`. A step with `notify` raises the Windows notification
   through App's hook (a scheduled run, nobody watching).

   derive() reads what a conversation is doing: running (steps still to show, or a question waiting),
   awaiting (that question), dailyLive (today's worker run is under way), jobWaiting (the job or retry
   question waits: BlueAI's taskbar button lights), doneIdx (the day-done step), readOnly (the
   scheduled run that died on zero credits: only that chat locks its composer, R5).

   StopRunDialog is New chat's confirm while today's run is under way: stopping costs the day.
   useChat() re-renders on every change (the chat screen); useChatWhere(select) only when the
   selected value changes (App, so a keystroke in the composer does not redraw the desktop).
   answerTyped() answers the waiting question with what the person typed (PM, 2026-10-14): their own
   bubble echoes it, WorkerFlow.interpret() reads it, and an unclear one is asked again.
   Exposes window.ChatStore = { useChat, useChatWhere, get, derive, reset, push, setDraft, mark, answer,
   answerTyped, retry, stop, dismissDone, claimSeed, setHooks, StopRunDialog }. */
(function () {
  const { useState, useEffect, useRef } = React;
  const fresh = () => ({ convo: [], visible: 0, draft: '', votes: {}, reasons: {}, answers: {}, typed: {}, seenDone: -1 });
  let s = fresh();
  let timers = [];
  let hooks = {};
  let lastSeed = null;
  const subs = new Set();
  const emit = () => subs.forEach((f) => f());
  const set = (patch) => { s = { ...s, ...patch }; emit(); };
  const get = () => s;
  const clear = () => { timers.forEach(clearTimeout); timers = []; };

  function useChat() {
    const [, bump] = useState(0);
    useEffect(() => { const f = () => bump((n) => n + 1); subs.add(f); return () => { subs.delete(f); }; }, []);
    return s;
  }
  function useChatWhere(select) {
    const [, bump] = useState(0);
    const last = useRef(select(s));
    useEffect(() => {
      const f = () => { const v = select(s); if (v !== last.current) { last.current = v; bump((n) => n + 1); } };
      subs.add(f);
      return () => { subs.delete(f); };
    }, []);
    return select(s);
  }
  const isDayStep = (x) => x.role === 'daydone' || x.card === 'daydone';

  function derive(st = s) {
    const shown = st.convo.slice(0, st.visible);
    const awaitingIdx = shown.findIndex((x, i) => x.role === 'ask' && !st.answers['k' + i]);
    const awaiting = awaitingIdx !== -1;
    const asked = awaiting ? st.convo[awaitingIdx] : null;
    const running = st.visible < st.convo.length || awaiting;
    return {
      started: st.convo.length > 0, awaitingIdx, awaiting, running,
      dailyLive: running && st.convo.some((x) => x.daily),
      jobWaiting: awaiting && (asked.id === 'job' || asked.id === 'retry'),
      workerStarted: shown.some((x) => x.worker),
      doneIdx: shown.findIndex((x) => x.role === 'daydone'),
      readOnly: shown.some((x) => x.ooc)
    };
  }

  function reset() { clear(); s = fresh(); emit(); }

  // A step shows: record what it says about today, raise its notification, then show it.
  function reveal(n) {
    const step = s.convo[n - 1];
    if (step) {
      if (isDayStep(step)) window.WorkerDayDone.setToday(step.end);
      if (step.record) window.WorkerDayDone.setToday(step.record);
      if (step.notify && hooks.onNotify) hooks.onNotify(step.notify);
    }
    set({ visible: n });
  }

  // Append steps and schedule their reveal (d = ms after the previous step).
  function push(steps) {
    const base = s.convo.length;
    let cum = 0;
    steps.forEach((step, i) => { cum += step.d; timers.push(setTimeout(() => reveal(base + i + 1), cum)); });
    set({ convo: [...s.convo, ...steps] });
  }

  const setDraft = (draft) => set({ draft });
  // votes / reasons / answers / typed, keyed 'k' + step index.
  const mark = (field, key, v) => set({ [field]: { ...s[field], [key]: v } });
  function answer(i, a) {
    const step = s.convo[i];
    mark('answers', 'k' + i, a);
    push(window.WorkerFlow.next(step, a));
  }
  function answerTyped(text) {
    const d = derive();
    if (!d.awaiting) return;
    const i = d.awaitingIdx, step = s.convo[i], WF = window.WorkerFlow;
    const a = WF.interpret(step, text);
    const said = { role: 'user', content: text, d: 250 };
    set({ draft: '' });
    if (!a) { push([said, { role: 'status', content: WF.UNCLEAR, d: 700 }]); return; }
    set({ answers: { ...s.answers, ['k' + i]: a }, typed: { ...s.typed, ['k' + i]: true } });
    push([said, ...WF.next(step, a)]);
  }
  // Retry from the worker card or the top bar (R4): answers the retry question still waiting in this chat, if there is one.
  function retry() {
    const d = derive();
    if (!d.awaiting || s.convo[d.awaitingIdx].id !== 'retry') return false;
    answer(d.awaitingIdx, 'retry');
    return true;
  }

  /* Stop a run at any time: cancel what has not shown, drop a trailing "working" indicator, keep the
     rest, and say what stopping cost. Today's worker run stopped before it closed is a skipped day
     (R6): the job ask "wasn't taken", anything else "didn't finish"; a setup question only stops. */
  function stop() {
    const d = derive();
    const asked = d.awaiting ? s.convo[d.awaitingIdx] : null;
    clear();
    let end = s.visible;
    while (end > 0 && s.convo[end - 1] && s.convo[end - 1].role === 'thinking') end--;
    const kept = s.convo.slice(0, end);
    const note = (content) => kept.push({ role: 'status', content, d: 0 });
    if (asked && asked.id === 'job') note('Run stopped. Today’s job wasn’t taken.');
    else if (d.dailyLive) note('Run stopped. Today’s job didn’t finish.');
    else if (asked) note('The run stopped before you answered.');
    if (d.dailyLive) window.WorkerDayDone.setToday('declined');
    set({ convo: kept, visible: kept.length, answers: asked ? { ...s.answers, ['k' + d.awaitingIdx]: 'stopped' } : s.answers });
  }

  const dismissDone = (i) => set({ seenDone: i });
  // A seed (a prefill, or the message that auto-sends after sign-in) is used once, not on every
  // return to Chat.
  function claimSeed(seed) {
    if (!seed || seed === lastSeed) return false;
    lastSeed = seed;
    return true;
  }
  const setHooks = (h) => { hooks = h || {}; };

  /* New chat while today's run is under way (R1): stopping it skips the day, so ask first. The
     commit is the destructive button: the day is what is lost (review round 2, S4). */
  function StopRunDialog({ isOpen, onCancel, onConfirm }) {
    return (
      <ModalOverlay plain isOpen={isOpen} onClose={onCancel} title="Stop today’s run?" describedBy="stop-run-body">
        <p id="stop-run-body" className="v2-text-body">Today won’t count toward your 20 days.</p>
        <div className="v3-btn-row v3-dlg-actions">
          <button type="button" onClick={onCancel} className="v2-button v2-button--secondary v2-button--lg">Cancel</button>
          <button type="button" onClick={onConfirm} className="v2-button v2-button--destructive v2-button--lg">Stop run</button>
        </div>
      </ModalOverlay>);
  }

  window.ChatStore = { useChat, useChatWhere, get, derive, reset, push, setDraft, mark, answer, answerTyped, retry, stop, dismissDone, claimSeed, setHooks, StopRunDialog };
})();
