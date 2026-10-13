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
  // V2's home paints its coach scrim against the nearest positioned box; this keeps it in here.
  function Contained({ height, children }) {
    return <div style={{ position: 'relative', overflow: 'hidden', height: height, padding: 'var(--v2-space-3)', background: 'var(--v2-canvas)' }}>{children}</div>;
  }
  function Stack({ children }) {
    return <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)' }}>{children}</div>;
  }

  // The core screens wired together: three tabs, pushed screens, Back. Settings is section 61.
  const ROW_RUN = { verified: 'verified', pending: 'done', late: 'pending', rejected: 'rejected', skipped: 'skipped' };
  function Flow() {
    const S = window.V2Screens || {};
    const K = window.V2Kit || {};
    const [fx, setFx] = useState('returning');
    const [tab, setTab] = useState('home');
    const [stack, setStack] = useState([]);
    const [run, setRun] = useState('verified');
    const [coached, setCoached] = useState(false);
    const row = (S.HOME_STATES || []).find(function (s) { return s[0] === fx; }) || [];
    const w = (K.workerFixtures || {})[row[1]];
    if (!S.Home || !w) return <div className="g-missing">The core screens are not loaded.</div>;
    const st = K.workerState(w);
    const top = stack[stack.length - 1];
    function push(id) { if (id !== top) setStack(stack.concat([id])); }
    function nav(id) {
      if (id === 'home' || id === 'activity' || id === 'settings') { setTab(id); setStack([]); return; }
      if (id === 'today') {
        if (st === 'running' || st === 'waiting') { push('chat'); return; }
        setRun(st === 'failed' ? 'failed' : (st === 'done' ? 'done' : 'verified'));
        push('run'); return;
      }
      if (id === 'chat' || id === 'notifications') push(id);
    }
    function back() { setStack(stack.slice(0, -1)); }
    function pick(key) { setFx(key); setTab('home'); setStack([]); }
    const common = { worker: w, landmark: false, onNavigate: nav, onBack: back };
    const chatState = { running: 'running', waiting: 'waiting', done: 'done', noCredits: 'noCredits' }[st] || 'empty';
    let screen;
    if (top === 'chat') screen = <S.Chat {...common} state={chatState} />;
    else if (top === 'run') screen = <S.RunDetail {...common} state={run} />;
    else if (top === 'notifications') screen = <S.Notifications worker={w} landmark={false} onNavigate={nav} onBack={back} state="unread" parentTab={tab} />;
    else if (tab === 'activity') {
      screen = <S.Activity {...common} onOpenRun={function (r) { setRun(r.live === 'failed' ? 'failed' : (ROW_RUN[r.status] || 'verified')); push('run'); }} />;
    } else if (tab === 'settings') {
      screen = <S.ScreenFrame worker={w} tab="settings" landmark={false} onNavigate={nav}><div className="v2-screen-body"><p>Settings is section 61.</p></div></S.ScreenFrame>;
    } else {
      screen = <S.Home {...common} state={fx} coaching={coached ? false : undefined} onDismissCoach={function () { setCoached(true); }} />;
    }
    return (
      <Stack>
        <div role="group" aria-label="Worker state" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--v2-space-1)' }}>
          {(S.HOME_STATES || []).map(function (s) {
            return <button key={s[0]} type="button" className="g-btn" aria-pressed={fx === s[0]} onClick={function () { pick(s[0]); }}>{s[2]}</button>;
          })}
        </div>
        <div style={{ width: W, maxWidth: '100%', overflow: 'auto' }}>{screen}</div>
        <p className="g-muted">Live: Chat with BlueAI, Details, See why, the run chip, More &gt; Notifications, the nav and Back all work. Dismissing the coach is remembered, as the record's coachSeen would be.</p>
      </Stack>
    );
  }

  function V2Home() {
    return (
      <Stack>
        <Contained height={300}><G.Live get={function () { return window.MoneyMaker && window.MoneyMaker.MoneyMakerHome; }} props={{ onRun: noop }} label="MoneyMakerHome" /></Contained>
        <Contained height={260}><G.Live get={function () { return window.HomeSkeleton; }} label="HomeSkeleton (V2 loading)" /></Contained>
        <G.FrameState url="index.html?start=worker" label="V2: first open (greeting, coach on Run)" height={830} />
        <G.FrameState url="index.html?day=returning" label="V2: returning partner, before today's run" height={830} />
      </Stack>
    );
  }

  function HomeSection() {
    const S = window.V2Screens || {};
    if (!S.Home || !S.Chat) return <G.Section id="home"><div className="g-missing">V2Screens.Home and V2Screens.Chat are not loaded.</div></G.Section>;
    const homeStates = S.HOME_STATES.map(function (s) {
      return { label: s[2], note: s[3], node: <Shot><S.Home state={s[0]} landmark={false} /></Shot> };
    }).concat([{ label: 'Compact window (640)', note: 'bars pinned, body scrolls', node: <Shot h={640}><S.Home state="returning" compact landmark={false} /></Shot> }]);
    const chatStates = S.CHAT_STATES.map(function (s) {
      return { label: s[2], note: s[3], node: <Shot><S.Chat state={s[0]} landmark={false} /></Shot> };
    });
    return (
      <G.Section id="home">
        <G.Part name="Home" status="changed" role="Today at a glance: is my worker on, when is the next run, did the days count, is anything waiting for me.">
          <p><strong>Anatomy.</strong> Inside the window (top bar with today's run chip and credits, nav with Home lit):
            the greeting as the screen title ('Hi, Alex', no emoji, no second line), then a 12px column: ProgramStrip
            (section 43), a Banner only for a program fact the card cannot say, WorkerCard (section 42), and one
            standalone link 'Chat with BlueAI'. Nothing else: no feature list, no second Run.</p>
          <G.StateGrid wide states={homeStates} />
          <G.CompareRow v2={<V2Home />} system={<Flow />}
            changed="V2's home answered 'what can I do' but not 'what is my worker doing'. 'Hi, Alex' with an emoji and 'You're all set. The BlueAI worker is all it takes to start earning.' sat above the coach's 'Run this to begin'; the progress strip appeared only for a returning partner and counted from a constant; the next run time was typed into the copy. Here the greeting is only a title, the strip is always there and reads the ledger, the card says today's state with one action, and Chat is one link away instead of being the home itself. Loading draws the worker home, not V2's five-card skill list." />
          <G.SpecDrawer rows={[
            { part: 'Greeting', token: '--v2-text-20, --v2-weight-semibold (ScreenHeader)', value: "'Hi, Alex'; 'Today' with no name; no emoji, no sub line", ref: ['screens-core.home.greeting-title', 'screens-core.home.first-line', 'screens-core.home.returning-line'] },
            { part: 'When it shows', token: 'none', value: 'always (V2: only before a conversation starts)', ref: 'screens-core.home.greeting-gate' },
            { part: 'Column', token: '--v2-gutter, --v2-space-3, --v2-space-6', value: 'padding 16 16 24, blocks 12 apart; only the body scrolls' },
            { part: 'ProgramStrip', token: 'numbers(record)', value: 'always, from the ledger; 7 of 20 days tonight is 7 of 20 tomorrow', ref: ['screens-core.home.strip-returning', 'screens-core.home.strip-day', 'screens-core.ledger.done-before'] },
            { part: 'Receipt line', token: '--v2-text-12, --v2-ink-3', value: 'Yesterday’s run verified.', ref: 'screens-core.home.strip-verified' },
            { part: 'Earnings', token: 'EARNINGS_URL', value: 'one URL for the whole product', ref: 'screens-core.home.strip-earnings' },
            { part: 'WorkerCard', token: 'section 42', value: "'BlueAI worker', one action", ref: ['screens-core.home.component', 'screens-core.home.card-title'] },
            { part: 'Coach scrim', token: '--v2-scrim, --v2-z-coach', value: 'rgba(11,18,32,0.48) over the whole window, z 40', ref: 'screens-core.home.scrim' },
            { part: 'Coach memory', token: 'coachSeen', value: 'on the Worker record, never shown twice', ref: 'screens-core.home.coach-local' },
            { part: 'Banner', token: 'Banner info (section 21)', value: "'20 days are out of reach' + days done and left; only when outOfReach > 0" },
            { part: 'Chat link', token: 'Link standalone', value: "'Chat with BlueAI', 13/500, 32 target" },
            { part: 'Run chip', token: 'topBarProps(record)', value: "'Next run 11 am', 'Needs you', 'Day 7 of 20', 'Waiting for credits'" },
            { part: 'Loading', token: 'Skeleton, --v2-dur-shimmer', value: 'title, strip, card: the worker home, held still under reduced motion', ref: 'screens-core.home.skeleton' },
          ]} />
          <G.DoDont
            do={['Read every number and time on Home from the Worker record.', 'Keep one card and one primary action; make the action primary only when the partner is needed.', 'Use the banner for a fact about the program, and only while it holds.']}
            dont={['Greet with a second line that repeats what the card says.', 'Hide the progress strip until the partner has been back once.', 'Put the chat on Home: it is one link away.']} />
        </G.Part>

        <G.Part name="Chat (from Home)" status="changed" role="The thread as a window onto the Worker record, pushed from Home; leaving it loses nothing.">
          <p><strong>Anatomy.</strong> ScreenHeader 'Chat' with Back (to Home) and a New chat IconButton; the Thread
            (section 34) with today's run as one RunCard (section 36) and any question as an AskCard (section 37); the
            Composer (section 38) with its notice slot. Home stays lit in the nav while Chat is open.</p>
          <G.StateGrid wide states={chatStates} />
          <G.CompareRow
            v2={<G.FrameState url="index.html?day=next" label="V2: the next day's scheduled run, as chat bubbles" height={830} />}
            system={<div style={{ width: W, maxWidth: '100%', overflow: 'auto' }}><S.Chat state="waiting" landmark={false} /></div>}
            changed="V2's chat is the home, the run and the record at once, and it unmounts when another tab opens, so a waiting job or a failed day's Retry is gone. New Chat was the loudest control in the top bar. Here Chat is pushed from Home over the same record, the run is one card instead of a dozen status bubbles, the job ask says what Not now costs before the tap, New chat is an icon in the chat's own header, and a condition that holds before typing (Automatic on, no credits) sits above the field." />
          <G.SpecDrawer rows={[
            { part: 'Lifetime', token: 'Worker record', value: 'the thread reads the record; opening Credits or Activity loses nothing', ref: 'screens-core.chat.mounted-as-tab' },
            { part: 'New chat', token: 'IconButton 32, plus', value: "label 'New chat', in the chat header (not a filled pill in the top bar)", ref: ['screens-core.chat.new-chat', 'screens-core.chat.new-chat-label'] },
            { part: 'Today’s run', token: 'RunCard (section 36)', value: 'one card per run, steps folded', ref: 'screens-core.chat.scheduled-start' },
            { part: 'Job ask', token: 'AskCard (section 37)', value: 'Paid job available / Watch the video and provide feedback. / Want me to take this one?', ref: ['screens-core.chat.job-label', 'screens-core.chat.job-title', 'screens-core.chat.job-question'] },
            { part: 'Answers', token: 'Chip', value: 'Yes, switch to Automatic / Just this job / Not now', ref: 'screens-core.chat.job-options' },
            { part: 'Not now costs', token: '--v2-text-12', value: 'Today won’t count toward your 20 days. (said before the tap, proposed)' },
            { part: 'Automatic on', token: 'ComposerNotice info, zap', value: 'Automatic is on for YouTube. BlueAI takes paid YouTube jobs without asking. + Change', ref: ['screens-core.chat.auto-ribbon', 'screens-core.chat.auto-change'] },
            { part: 'Out of credits', token: 'OutOfCreditsNotice composer', value: "field locked: 'Out of AI credits until 5:30 am', said before typing" },
            { part: 'Empty', token: 'EmptyState', value: "'Chat with BlueAI' / 'Ask about today’s run, or tell your worker what to change.'" },
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
