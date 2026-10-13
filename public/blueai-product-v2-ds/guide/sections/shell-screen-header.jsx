/* Section 32: Screen header and navigation model (shell slice). Parts: ScreenHeader (Changed),
   Navigation model (Changed). Kit: kit/nav.jsx, kit/shell.jsx. Refs: guide/refs/shell.js. */
(function () {
  const G = window.V2Guide;
  const { useState } = React;

  // Section 32's route table, verbatim (design-md/32-screen-header.md): every id a screen emits.
  const ROUTES = [
    ["`home`, `activity`, `settings`", "none", "Home, Activity, Settings", "tab", "itself", "none; tapping the lit tab returns it to its root"],
    ["`settings`", "`{highlight}`: a section id ('worker', 'apps', 'notifications', 'bluestacks', 'account', 'help', 'advanced')", "Settings, scrolled to that section and holding the highlight", "tab", "Settings", "none"],
    ["`chat`", "`{state}`: setup, running, waiting, retrying", "Chat", "pushed on Home's stack, from any door", "Home", "the screen under it on Home's stack"],
    ["`run`", "`{state, row, tab}`: a Run detail state, its ledger row (`rowTarget`, section 58) and the tab it was opened from", "Run detail (`tab`)", "pushed on the stack of the tab it was opened from (`opts.tab`; Activity by default)", "that tab", "the screen under it on that tab's stack"],
    ["`notifications`", "none", "Notifications (`parentTab`)", "pushed over the tab you are on", "that tab", "that tab"],
    ["`credits`", "none", "AI credits (`tab`)", "pushed over the tab you are on", "that tab", "that tab"],
    ["`account`", "none", "Account", "pushed on Settings' stack", "Settings", "Settings"],
    ["`worker-settings`", "none", "Worker settings", "pushed on Settings' stack", "Settings", "the screen under it"],
    ["`connected-apps`", "`{app}`: 'youtube' or 'telegram'; none for the list", "Connected apps", "pushed on Settings' stack", "Settings", "the screen under it"],
    ["`report`", "none", "the Report a problem sheet (`V2Screens.ReportProblemSheet`)", "overlay", "unchanged", "its own close"],
    ["`sign-out`", "none", "the sign-out confirm (`CONFIRM_COPY.signOut`, section 64)", "overlay", "unchanged", "Cancel"],
    ["`terms`", "`{docs}`: the changed documents' names", "the Program Terms sheet, `update` mode (`V2Screens.TermsSheet`, section 53), from a Terms updated notification", "overlay", "unchanged", "none: it asks for the agreement"],
  ];
  const ROUTES_NOTE = "The run chip, the WorkerCard's Details and the RunCard's details emit no id of their own: they open `V2Screens.chipTarget(worker)` (`screens/home.jsx`), which is today's row as Activity opens it (`chat` {state} while the run is live, `run` {state, row} once it has an outcome), `worker-settings` while paused, and `home` otherwise. Earnings is not a route: it opens `EARNINGS_URL` on the site in the browser. A pushed screen whose id is already on top is replaced, so it shows the new state. A new screen gets a row here before it ships (section 74, step 3).";
  // `code` spans in the table's words become code.
  function ticks(s) { return s.split('`').map(function (t, i) { return i % 2 ? <code key={i} className="g-code">{t}</code> : t; }); }

  function Band(props) {
    const K = window.V2Kit;
    return <div style={{ width: 'var(--v2-shell-w)', maxWidth: '100%', background: 'var(--v2-canvas)' }}><K.ScreenHeader {...props} /></div>;
  }
  function Icon(name, label) {
    const K = window.V2Kit;
    return K.IconButton ? <K.IconButton icon={name} label={label} size={32} /> : null;
  }
  function Small(label) {
    const K = window.V2Kit;
    return K.Button ? <K.Button variant="quiet" size="sm">{label}</K.Button> : null;
  }

  // V2's title treatments, each with its ref.
  const TITLES = [
    ['AI Credits', '19 / 800, #111827', 'none', 'shell.header.credits-title'],
    ['Chat History', '22 / 800, #111827', 'none', 'shell.header.history-title'],
    ['Scheduled tasks', '20 / 700, #111827', 'none (a tab)', 'shell.header.schedule-title'],
    ['Coming Soon (Jobs)', '22 / 800, #1e293b', 'none (a tab)', 'shell.header.jobs-title'],
  ];

  // The model, working: three tabs, each with its own stack of pushed screens.
  const ROOTS = {
    home: { title: null, rows: [['Chat with BlueAI', 'Chat']] },
    activity: { title: 'Activity', rows: [['Oct 12 run, verified', 'Run detail'], ['Oct 11 run, verified', 'Run detail']] },
    settings: { title: 'Settings', rows: [['Worker', 'Worker settings'], ['Connected apps', 'Connected apps']] },
  };
  function NavDemo() {
    const K = window.V2Kit;
    const [tab, setTab] = useState('home');
    const [stacks, setStacks] = useState({ home: [], activity: [], settings: [] });
    const stack = stacks[tab];
    const top = stack[stack.length - 1];
    function push(t) { setStacks(Object.assign({}, stacks, { [tab]: stack.concat([t]) })); }
    function pop() { setStacks(Object.assign({}, stacks, { [tab]: stack.slice(0, -1) })); }
    function change(id) {
      if (id === tab) { setStacks(Object.assign({}, stacks, { [id]: [] })); return; }
      setTab(id);
    }
    const root = ROOTS[tab];
    const row = { display: 'flex', alignItems: 'center', minHeight: 48, padding: '0 var(--v2-space-4)', width: '100%', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-md)', background: 'var(--v2-surface)', color: 'var(--v2-ink-2)', font: 'inherit', textAlign: 'left', cursor: 'pointer' };
    const body = top ? (
      <div><K.ScreenHeader title={top} onBack={pop} /><p style={{ margin: 0, padding: '0 var(--v2-gutter)', color: 'var(--v2-ink-3)', fontSize: 'var(--v2-text-13)' }}>Pushed over {tab}. Back returns; tapping the lit tab returns to its root.</p></div>
    ) : (
      <div>
        {root.title ? <K.ScreenHeader title={root.title} /> : <div style={{ padding: 'var(--v2-space-4) var(--v2-gutter) 0', color: 'var(--v2-ink)', fontSize: 'var(--v2-text-24)', fontWeight: 'var(--v2-weight-semibold)', letterSpacing: 'var(--v2-tracking-title)' }}>Home</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-2)', padding: 'var(--v2-space-3) var(--v2-gutter)' }}>
          {root.rows.map(function (r) { return <button key={r[0]} type="button" style={row} onClick={function () { push(r[1]); }}>{r[0]}</button>; })}
        </div>
      </div>
    );
    return (
      <div style={{ border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-sm)', overflow: 'hidden', width: 'max-content' }}>
        <K.AppFrame compact landmark={false} topBar={<K.TopBar signedIn status="scheduled" statusLabel="Next run 11 am" credits={2000} />}
          nav={<K.BottomNav value={tab} onChange={change} />}>{body}</K.AppFrame>
      </div>
    );
  }

  const LEVELS = [
    ['Tab', 'Home, Activity, Settings', 'none: the nav is the way out', 'itself'],
    ['Pushed screen', 'Chat, Run detail, Notifications, Account, Worker settings, Connected apps, AI credits', 'Back in the ScreenHeader', 'its parent tab (rule below)'],
    ['Overlay', 'Dialog, Sheet, day done, splash, toast', 'its own close or answer; never Back', 'unchanged'],
  ];

  function ScreenHeaderSection() {
    return (
      <G.Section id="screen-header">
        <G.Part name="ScreenHeader" status="changed" role="One title band for every screen: optional Back, one 20/600 title, optional trailing action.">
          <G.StateGrid wide states={[
            { label: 'Title only (a tab)', node: <Band title="Activity" /> },
            { label: 'With Back (a pushed screen)', node: <Band title="Worker settings" onBack={function () {}} /> },
            { label: 'With a trailing icon action', note: 'New chat lives here, not in the top bar', node: <Band title="Chat" onBack={function () {}} trailing={Icon('plus', 'New chat')} /> },
            { label: 'With a trailing text action', node: <Band title="Notifications" onBack={function () {}} trailing={Small('Mark all read')} /> },
            { label: 'Long title', note: 'one line, truncates; the full name is the accessible name', node: <Band title="Connected apps and accounts on this PC" onBack={function () {}} /> },
          ]} />
          <div className="g-table-wrap">
            <table className="g-table">
              <thead><tr><th scope="col">V2 screen</th><th scope="col">V2 title</th><th scope="col">Back</th><th scope="col">Source</th></tr></thead>
              <tbody>{TITLES.map(function (t) { return <tr key={t[0]}><td>{t[0]}</td><td>{t[1]}</td><td>{t[2]}</td><td><G.RefCell refs={t[3]} /></td></tr>; })}
                <tr><td>Profile</td><td>no title</td><td>none</td><td><G.RefCell refs="shell.topbar.profile" /></td></tr>
              </tbody>
            </table>
          </div>
          <G.CompareRow
            v2={<div style={{ width: 'var(--v2-shell-w)', maxWidth: '100%', height: 220, overflow: 'hidden' }}><G.Live get={function () { return window.ChatHistory && window.ChatHistory.ChatHistoryScreen; }} label="V2 ChatHistoryScreen" /></div>}
            system={<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)' }}><Band title="Activity" /><Band title="Account" onBack={function () {}} /></div>}
            changed="V2 has no shared header: five title treatments at 19 to 22px and weights 700 to 800, and no screen has a Back, so a screen opened from the kebab is left only by tapping a tab. The system has one band: 20/600 ink on the 16 gutter, Back on every pushed screen, and one slot for the screen's own action." />
          <G.SpecDrawer rows={[
            { part: 'Title', token: '--v2-text-20, --v2-weight-semibold, --v2-tracking-title', value: '20/600, -0.02em, ink', ref: ['shell.header.credits-title', 'shell.header.history-title', 'shell.header.schedule-title', 'shell.header.jobs-title'] },
            { part: 'Band', token: '--v2-topbar-h, --v2-space-2, --v2-gutter', value: 'min 52 tall, 8 / 16 padding, canvas', ref: 'shell.header.credits-pad' },
            { part: 'Back', token: 'IconButton 32, back', value: 'label "Back"; the chevron lands on the gutter' },
            { part: 'Trailing', token: 'IconButton 32 or Button sm quiet', value: 'one action only' },
            { part: 'Position', token: '--v2-z-sticky', value: 'sticky to the top of the content band' },
            { part: 'Focus', token: 'tabIndex -1 on the title', value: 'focus moves to the title when a screen is pushed' },
          ]} />
          <G.DoDont
            do={['Give every pushed screen a Back.', 'Keep one action in the trailing slot; put the rest in the screen.']}
            dont={['Use a second title style.', 'Put Back on a tab root or on an overlay.']} />
        </G.Part>

        <G.Part name="Navigation model" status="changed" role="Tabs are the base; secondary screens push over a tab with Back; overlays sit above both. Navigation never holds the worker's state.">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--v2-space-5)', alignItems: 'flex-start' }}>
            <NavDemo />
            <div style={{ flex: '1 1 320px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)' }}>
              <div className="g-table-wrap">
                <table className="g-table">
                  <thead><tr><th scope="col">Level</th><th scope="col">Screens</th><th scope="col">Way back</th><th scope="col">Tab lit</th></tr></thead>
                  <tbody>{LEVELS.map(function (l) { return <tr key={l[0]}><td>{l[0]}</td><td>{l[1]}</td><td>{l[2]}</td><td>{l[3]}</td></tr>; })}</tbody>
                </table>
              </div>
              <ul className="g-list">
                <li>Each tab keeps its own stack. Tapping another tab switches and keeps the stack; tapping the lit tab returns to its root.</li>
                <li>Navigation state is separate from the Worker record (section 41): opening Credits or Account never unmounts today's run.</li>
                <li>A notification or the tray opens the screen it names, pushed over its parent tab.</li>
                <li>Which tab is lit for a pushed screen, one rule: a screen with a home in Settings (Worker settings, Connected apps, Account) lights Settings from any door, the top bar’s More menu included. A pushed screen with no home in Settings goes on the stack of the tab it was opened from and keeps it lit; Back returns there (Run detail, AI credits, Notifications); Chat belongs to Home. The props are tab (Run detail, AI credits) or parentTab (Notifications).</li>
              </ul>
            </div>
          </div>
          <G.Table head={['id', 'opts', 'Screen', 'Level', 'Tab lit', 'Back']}
            rows={ROUTES.map(function (r) { return r.map(ticks); })} caption="The route table: every id a screen emits, resolved by the host router" />
          <G.Note>{ticks(ROUTES_NOTE)}</G.Note>
          <G.CompareRow
            v2={<G.FrameState url="index.html?start=worker" label="V2: open the kebab's Chat History, then look for a way back" height={900} />}
            system={<span className="g-muted">The working model above: push a screen, switch tabs, come back.</span>}
            changed="V2 picks the screen from a chain of booleans checked in order (profile, history, credits, then the tab), swaps it in place and lights no tab while a kebab screen is open. The chat, and the run inside it, mounts only on the chat tab, so opening Credits ends the run's view. The system names two levels plus overlays and keeps the worker outside navigation." />
          <G.SpecDrawer title="V2 sources" rows={[
            { part: 'Screen choice', token: 'tab + stack', value: 'replaces the boolean chain', ref: 'shell.header.precedence' },
            { part: 'Leaving a secondary screen', token: 'Back', value: 'replaces tap-a-tab-only', ref: 'shell.header.tab-change' },
            { part: 'Parent tab lit', token: 'BottomNav value', value: 'replaces no tab lit', ref: 'shell.nav.no-tab-lit' },
            { part: 'Run outlives screens', token: 'Worker record', value: 'replaces chat-only mount', ref: 'shell.header.chat-mount' },
          ]} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('screen-header', ScreenHeaderSection);
})();
