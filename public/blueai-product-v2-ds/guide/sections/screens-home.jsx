/* Section 57: Home (Today), with the Chat screen reached from it (screens-core slice).
   Parts: Home (Changed), Chat from Home (Changed). Screens: screens/home.jsx (V2Screens.Home,
   ScreenFrame), screens/chat.jsx (V2Screens.Chat). Refs: guide/refs/screens-core.js. */
(function () {
  const G = window.V2Guide;
  const { useState } = React;
  const W = 419, H = 830;
  const noop = function () {};

  function Shot({ scale, h, children }) {
    const s = scale || 0.55;
    const hh = h || H;
    return (
      <div style={{ width: W * s, height: hh * s, overflow: 'hidden', flex: 'none', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-sm)', boxSizing: 'content-box', background: 'var(--v2-canvas)' }}>
        <div style={{ width: W, height: hh, transform: 'scale(' + s + ')', transformOrigin: '0 0' }}>{children}</div>
      </div>
    );
  }
  function Contained({ height, children }) {
    return <div style={{ position: 'relative', overflow: 'hidden', height: height, padding: 'var(--v2-space-3)', background: 'var(--v2-canvas)' }}>{children}</div>;
  }
  function Stack({ children }) {
    return <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)' }}>{children}</div>;
  }

  // The Home states section 57 lists that HOME_STATES does not carry, each from its kit fixture
  // (kit/worker-data.jsx), placed after the row they follow. 'blocked:<reason>' sets one reason on
  // the blocked fixture, so each fix has its own cell. A key HOME_STATES already has is not added.
  const MORE_STATES = {
    failed: [
      ['stopped', 'stopped', 'Stopped today', 'Run again, by 9 pm'],
      ['missed', 'missed', 'Didn’t start', 'PC off or asleep at 11 am; Run now, by 9 pm; never starts late on its own'],
      ['blocked-no-app', 'blocked:no-app', 'Can’t run: no app', 'Connect YouTube opens Connected apps'],
      ['blocked-signed-out', 'blocked:signed-out', 'Can’t run: signed out', 'Open App Player acts in place'],
      ['blocked-no-bluestacks', 'blocked:no-bluestacks', 'Can’t run: no BlueStacks', 'Get BlueStacks acts in place'],
    ],
    complete: [
      ['ended', 'ended', 'Period ended', 'section 69’s state, not a card; $10 or more'],
      ['endedBelow', 'endedBelow', 'Period ended, under $10', 'section 69’s state: You need $10 to cash out.'],
    ],
  };
  function homeStates(S) {
    const base = S.HOME_STATES || [];
    const has = function (k) { return base.some(function (s) { return s[0] === k; }); };
    return base.reduce(function (out, s) {
      return out.concat([s], (MORE_STATES[s[0]] || []).filter(function (m) { return !has(m[0]); }));
    }, []);
  }
  function fixtureOf(F, key) {
    const r = String(key || '').split(':');
    return r[1] ? Object.assign({}, F[r[0]], { blocked: { reason: r[1], app: 'youtube' } }) : F[key];
  }

  // The core screens wired together: three tabs, pushed screens, Back. Settings is section 61.
  // Section 32's model: each tab keeps its own stack; another tab switches and keeps it; tapping the
  // lit tab again returns that tab to its root. A stack entry is { id, run, row }: run is the pushed
  // screen's state (Chat's or RunDetail's), row the ledger row a Run detail is about.
  // Chat belongs to Home: it goes on Home's stack and Home lights, from any door. Run detail goes on
  // the stack of the tab it was opened from (opts.tab: Home's Details, the run chip and Chat's See run
  // details pass it; Activity rows pass none, so the current tab), and that tab stays lit. AI credits
  // and Notifications have no home in Settings either, so they go over the tab you are on.
  const NO_STACKS = { home: [], activity: [], settings: [] };
  const PARENT = { chat: 'home' };
  function Flow() {
    const S = window.V2Screens || {};
    const K = window.V2Kit || {};
    const [fx, setFx] = useState('returning');
    const [tab, setTab] = useState('home');
    const [stacks, setStacks] = useState(NO_STACKS);
    const [coached, setCoached] = useState(false);
    const states = homeStates(S);
    const row = states.find(function (s) { return s[0] === fx; }) || [];
    const w = fixtureOf(K.workerFixtures || {}, row[1]);
    if (!S.Home || !w) return <div className="g-missing">The core screens are not loaded.</div>;
    const st = K.workerState(w);
    const stack = stacks[tab];
    const top = stack[stack.length - 1] || {};
    function setStack(next) { setStacks(Object.assign({}, stacks, { [tab]: next })); }
    // Switch to the parent tab, then push; the same screen on top is replaced, so it shows this run.
    function push(id, run, r, from) {
      const t = from || PARENT[id] || tab;
      const s = stacks[t];
      const keep = (s[s.length - 1] || {}).id === id ? s.slice(0, -1) : s;
      setStacks(Object.assign({}, stacks, { [t]: keep.concat([{ id: id, run: run, row: r }]) }));
      if (t !== tab) setTab(t);
    }
    function nav(id, opts) {
      if (id === 'home' || id === 'activity' || id === 'settings') { if (id === tab) setStack([]); else setTab(id); return; }
      if (id === 'today') { const t = S.chipTarget(w); nav(t[0], t[1]); return; }
      // Settings > Worker, Connected apps and Settings with {highlight} all live under the settings tab.
      if (id === 'worker-settings' || id === 'connected-apps') { if (tab === 'settings') setStack([]); else setTab('settings'); return; }
      if (id === 'chat' || id === 'run') { push(id, opts && opts.state, opts && opts.row, opts && opts.tab); return; }
      if (id === 'credits') { push('credits'); return; }
      if (id === 'notifications') push(id);
    }
    function back() { setStack(stack.slice(0, -1)); }
    function pick(key) { setFx(key); setTab('home'); setStacks(NO_STACKS); }
    const common = { worker: w, landmark: false, onNavigate: nav, onBack: back };
    const chatState = { setup: 'setup', running: 'running', waiting: 'waiting', done: 'done', failed: 'failed', stopped: 'stopped', noCredits: 'noCredits' }[st] || 'empty';
    let screen;
    if (top.id === 'chat') screen = <S.Chat {...common} state={top.run || chatState} />;
    else if (top.id === 'run') screen = <S.RunDetail {...common} tab={tab} state={top.run} row={top.row} />;
    else if (top.id === 'credits') screen = <S.Credits {...common} tab={tab} />;
    else if (top.id === 'notifications') screen = <S.Notifications worker={w} landmark={false} onNavigate={nav} onBack={back} state="unread" parentTab={tab} />;
    else if (tab === 'activity') {
      screen = <S.Activity {...common} />;
    } else if (tab === 'settings') {
      screen = <S.ScreenFrame worker={w} tab="settings" landmark={false} onNavigate={nav}><div className="v2-screen-body"><p>Settings is section 61.</p></div></S.ScreenFrame>;
    } else {
      screen = <S.Home {...common} state={fx} coaching={coached ? false : undefined} onDismissCoach={function () { setCoached(true); }} />;
    }
    return (
      <Stack>
        <div role="group" aria-label="Worker state" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--v2-space-1)' }}>
          {states.map(function (s) {
            return <button key={s[0]} type="button" className="g-btn" aria-pressed={fx === s[0]} onClick={function () { pick(s[0]); }}>{s[2]}</button>;
          })}
        </div>
        <div style={{ width: W, maxWidth: '100%', overflow: 'auto' }}>{screen}</div>
        <p className="g-muted">Live: Chat with BlueAI, Details, See why, the run chip, More &gt; Notifications, the nav and Back all work. Each tab keeps its own stack; tapping the lit tab returns it to its root. Chat always opens on Home's stack; Run detail, AI credits and Notifications open on the stack of the tab they were opened from, so the lit tab is the one whose stack holds the screen. Dismissing the coach is remembered, as the record's coachSeen would be.</p>
      </Stack>
    );
  }

  function V2Home() {
    return (
      <Stack>
        <Contained height={300}><G.Live get={function () { return window.MoneyMaker && window.MoneyMaker.MoneyMakerHome; }} props={{ onRun: noop }} label="MoneyMakerHome" /></Contained>
        <Contained height={260}><G.Live get={function () { return window.HomeSkeleton; }} label="HomeSkeleton (V2 loading)" /></Contained>
        <G.FrameState url="index.html?start=worker" label="V2: first open (greeting, coach on Run)" height={830} />
      </Stack>
    );
  }

  function HomeSection() {
    const S = window.V2Screens || {};
    if (!S.Home || !S.Chat) return <G.Section id="home"><div className="g-missing">V2Screens.Home and V2Screens.Chat are not loaded.</div></G.Section>;
    const F = (window.V2Kit || {}).workerFixtures || {};
    const homeGrid = homeStates(S).map(function (s) {
      return { label: s[2], note: s[3], node: <Shot><S.Home state={s[0]} worker={fixtureOf(F, s[1])} landmark={false} /></Shot> };
    }).concat([{ label: 'Compact window (640)', note: 'bars pinned, body scrolls', node: <Shot h={640}><S.Home state="returning" compact landmark={false} /></Shot> }]);
    const chatStates = S.CHAT_STATES.map(function (s) {
      return { label: s[2], note: s[3], node: <Shot><S.Chat state={s[0]} landmark={false} /></Shot> };
    });
    return (
      <G.Section id="home">
        <G.Part name="Home" status="changed" role="Today at a glance: is my worker on, when is the next run, did the days count, is anything waiting for me.">
          <p><strong>Anatomy.</strong> Inside the window (top bar with today's run chip and credits, nav with Home lit):
            the greeting as the screen title ('Hi, Alex', no emoji, no second line), then a 12px column: WorkerCard
            (section 42), ProgramStrip (section 43), a Banner only for a program fact the card cannot say, and one
            standalone link 'Chat with BlueAI'. Nothing else: no feature list, no second Run.</p>
          <G.StateGrid wide states={homeGrid} />
          <G.CompareRow v2={<V2Home />} system={<Flow />}
            changed="V2's home answered 'what can I do' but not 'what is my worker doing'. 'Hi, Alex' with an emoji and 'You're all set. The BlueAI worker is all it takes to start earning.' sat above the coach's 'Run this to begin'; since 2026-10-14 that one line greets returning partners too, and V2's progress strip left home for the partner dashboard. Here the greeting is only a title, the strip is always there and reads the ledger, the card says today's state with one action, and Chat is one link away instead of being the home itself. Loading draws the worker home, not V2's five-card skill list." />
          <G.SpecDrawer rows={[
            { part: 'Greeting', token: '--v2-text-20, --v2-weight-semibold (ScreenHeader)', value: "'Hi, Alex'; 'Today' with no name; no emoji, no sub line", ref: ['screens-core.home.greeting-title', 'screens-core.home.first-line'] },
            { part: 'When it shows', token: 'none', value: 'always (V2: only before a conversation starts)', ref: 'screens-core.home.greeting-gate' },
            { part: 'Column', token: '--v2-gutter, --v2-space-3, --v2-space-6', value: 'padding 16 16 24, blocks 12 apart; only the body scrolls' },
            { part: 'ProgramStrip', token: 'numbers(record)', value: 'always, from the ledger; 7 of 20 days tonight is 7 of 20 tomorrow (V2: no strip on home since 2026-10-14)', ref: 'screens-core.ledger.done-before' },
            { part: 'Receipt line', token: '--v2-text-12, --v2-ink-3', value: 'Yesterday’s run verified.' },
            { part: 'Earnings', token: 'EARNINGS_URL', value: 'one URL for the whole product', ref: 'worker.earnings.menu-url' },
            { part: 'WorkerCard', token: 'section 42', value: "'BlueAI worker', one action", ref: ['screens-core.home.component', 'screens-core.home.card-title'] },
            { part: 'Coach mark', token: 'CoachMark (section 42)', value: 'a note under the WorkerCard: no scrim, nothing dimmed or locked' },
            { part: 'Coach memory', token: 'coachSeen', value: 'on the Worker record, never shown twice', ref: 'screens-core.home.coach-local' },
            { part: 'Banner', token: 'Banner info (section 21)', value: "'You can still reach 17 of 20 days', a title only; only when outOfReach > 0" },
            { part: 'Chat link', token: 'Link standalone', value: "'Chat with BlueAI', 13/500, 32 target" },
            { part: 'Run chip', token: 'topBarProps(record)', value: "'Next run 11 am', 'Next run 9 am to 8 pm', 'Runs later today', 'Needs you', 'Day 7 of 20' (pending ring), 'Waiting for credits' (refill before 9 pm) or 'Not counted today' (after); opens chipTarget(record)" },
            { part: 'Loading', token: 'Skeleton, --v2-dur-shimmer', value: 'a title, the worker card, the strip card: the worker home, held still under reduced motion', ref: 'screens-core.home.skeleton' },
          ]} />
          <G.DoDont
            do={['Read every number and time on Home from the Worker record.', 'Keep one card and one primary action; make the action primary only when the partner is needed.', 'Use the banner for a fact about the program, and only while it holds.']}
            dont={['Greet with a second line that repeats what the card says.', 'Hide the progress strip until the partner has been back once.', 'Put the chat on Home: it is one link away.']} />
        </G.Part>

        <G.Part name="Chat (from Home)" status="changed" role="The thread as a window onto the Worker record, pushed from Home; leaving it loses nothing.">
          <p><strong>Anatomy.</strong> ScreenHeader 'Chat' with Back (to Home) and a New chat IconButton; the Thread
            (section 34) with today's run as one RunCard (section 36), a paid job as the JobPreviewCard (section 45) and any other question as an AskCard (section 37); the
            Composer (section 38) with its notice slot. Home stays lit in the nav while Chat is open. States
            (CHAT_STATES): {S.CHAT_STATES.map(function (c) { return c[0]; }).join(', ')}.</p>
          <G.StateGrid wide states={chatStates} />
          <G.CompareRow
            v2={<G.FrameState url="index.html?day=next" label="V2: the next day's scheduled run, as chat bubbles" height={830} />}
            system={<div style={{ width: W, maxWidth: '100%', overflow: 'auto' }}><S.Chat state="waiting" landmark={false} /></div>}
            changed="V2's chat is the home, the run and the record at once, and it unmounts when another tab opens, so a waiting job or a failed day's Retry is gone. New Chat was the loudest control in the top bar. Here Chat is pushed from Home over the same record, the run is one card instead of a dozen status bubbles, the job preview shows the video, channel and exact comment and puts the cost of skipping on its button, New chat is an icon in the chat's own header, and a condition that holds before typing (Automatic on, no credits) sits above the field." />
          <G.SpecDrawer rows={[
            { part: 'Lifetime', token: 'Worker record', value: 'the thread reads the record; opening Credits or Activity loses nothing', ref: 'screens-core.chat.mounted-as-tab' },
            { part: 'New chat', token: 'IconButton 32, plus', value: "label 'New chat', in the chat header (not a filled pill in the top bar)", ref: ['screens-core.chat.new-chat', 'screens-core.chat.new-chat-label'] },
            { part: 'Today’s run', token: 'RunCard (section 36)', value: 'one card per run, steps folded', ref: 'screens-core.chat.scheduled-start' },
            { part: 'Job ask', token: 'JobPreviewCard (section 45)', value: 'Take this job / Skip: today won’t count / Switch YouTube to Automatic (through ConsentDialog); decision D17 option A, built; option B (V2’s AskCard words) is D17 = B in screens/chat.jsx' },
            { part: 'Option B (V2’s ask)', token: 'AskCard + Chip (section 37)', value: 'Paid job available / Watch the video and provide feedback. / Want me to take this one? + Yes / Not now', ref: ['screens-core.chat.job-label', 'screens-core.chat.job-title', 'screens-core.chat.job-question', 'screens-core.chat.job-options'] },
            { part: 'Skip costs', token: 'Button secondary (section 11)', value: 'on the button: Skip: today won’t count' },
            { part: 'Automatic on', token: 'ComposerNotice info, zap', value: 'V2: none since 2026-10-14 (the ribbon is archived; the composer chip says the mode)', ref: 'worker.permissions.ribbon-gate' },
            { part: 'Setup', token: 'AskCard, PermissionRequest, ConsentDialog, ProgramSummary', value: "V2's order: the pitch, confirm @alexwatches, watch history, the run time (no mode question since 2026-10-14); the system adds paid jobs per app (Always ask first; Automatic only through ConsentDialog); closes with ProgramSummary and the D7 line (A: 'Your first run starts now, and today counts as day 1 once it’s verified.'; B: 'Your first counted day is tomorrow, at your run time.')", ref: 'screens-core.chat.job-options' },
            { part: 'Job ask bullets', token: 'AskCard bullets', value: 'proposed (R07): the video, channel and length; what will be done, with the exact comment' },
            { part: 'Consent', token: 'ConsentDialog (section 46)', value: 'any answer that turns Automatic on opens it first; Cancel leaves the question waiting' },
            { part: 'Stop', token: 'Composer costsDay / paidJob (section 38)', value: 'asks first while running, retrying or waiting' },
            { part: 'Out of credits', token: 'RunCard nocredits, OutOfCreditsNotice composer', value: "the field locks only at zero (until when); short of today's run (noCredits, 120 of 360) it stays open with ComposerNotice Not enough AI credits for today’s run. They refresh at 5:30 am." },
            { part: 'Empty', token: 'EmptyState', value: "'Chat with BlueAI' / 'Ask about today’s run, your days, or where to change a setting.'" },
            { part: 'Typed messages', token: 'MessageBubble + Link (proposed copy)', value: 'status questions answered from the record; an action gets a Link to its control (Open Worker settings), never a silent change; out of scope says what the worker can do' },
          ]} />
          <G.DoDont
            do={['Show a run as one RunCard that updates in place.', 'Say what an answer costs on the card, before the tap.', 'Put a condition that holds before typing in the notice slot.']}
            dont={['Make the chat the only record of a run.', 'Put New chat in the top bar.', 'Let the partner type a message that will be refused for credits.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('home', HomeSection);
})();
