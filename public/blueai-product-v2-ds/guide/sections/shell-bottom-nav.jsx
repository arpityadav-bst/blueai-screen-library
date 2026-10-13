/* Section 31: Bottom navigation (shell slice). Part: BottomNav (Changed). Kit: kit/nav.jsx.
   Refs: guide/refs/shell.js. */
(function () {
  const G = window.V2Guide;

  function Nav(props) {
    const K = window.V2Kit;
    return (
      <div style={{ width: 'var(--v2-shell-w)', maxWidth: '100%', paddingTop: 'var(--v2-space-3)', background: 'var(--v2-canvas)' }}>
        <K.BottomNav {...props} />
      </div>
    );
  }
  function withBadge(n) {
    const K = window.V2Kit;
    return K.NAV_ITEMS.map(function (it) { return it.id === 'activity' ? Object.assign({}, it, { badge: n }) : it; });
  }

  // A working nav, so the selected bar, hover and keyboard focus can be tried for real.
  function Playground() {
    const [value, setValue] = React.useState('home');
    return <Nav value={value} onChange={setValue} items={withBadge(value === 'activity' ? 0 : 2)} />;
  }

  function BottomNavSection() {
    const K = window.V2Kit;
    return (
      <G.Section id="bottom-nav">
        <G.Part name="BottomNav" status="changed" role="Three places that match the concept: Home (the worker today), Activity (runs and days), Settings (worker first).">
          <ul className="g-list">
            <li>56 tall, surface, one top hairline, no shadow. Three equal items: icon 20 over a 12/500 label.</li>
            <li><strong>Home</strong>: the worker, today and progress; the chat is reached from here. <strong>Activity</strong>: every run and whether each day was verified (replaces Jobs). <strong>Settings</strong>: Worker first, Advanced last.</li>
            <li>Selected: a 2px blue bar on the top hairline plus ink icon and label. The weight never changes, so labels never shift.</li>
            <li>A pushed screen (Notifications, Account, Worker settings) keeps its parent tab lit (section 32).</li>
          </ul>
          <G.StateGrid wide states={[
            { label: 'Rest, Home selected', node: <Nav value="home" /> },
            { label: 'Hover (Activity)', node: <Nav value="home" forceState={{ activity: 'hover' }} /> },
            { label: 'Selected (Settings)', node: <Nav value="settings" /> },
            { label: 'Focus-visible (Activity)', node: <Nav value="home" forceState={{ activity: 'focus' }} /> },
            { label: 'Badge count', note: 'something in Activity needs the partner: a waiting job, a rejected day', node: <Nav value="home" items={withBadge(2)} /> },
            { label: 'Four items, only if D12', note: 'Chat as a tab: the PM decides', node: <Nav value="home" items={K.NAV_ITEMS_WITH_CHAT} /> },
            { label: 'Hidden when signed out', note: 'AppFrame renders no nav (section 29)', node: <span className="g-muted">(no nav)</span> },
            { label: 'Try it', note: 'click or Tab and Enter', node: <Playground /> },
          ]} />
          <G.CompareRow
            v2={<G.Live get={function () { return window.BottomNavbar; }} props={{ activeTab: 'chat', onTabChange: function () {} }} label="V2 BottomNavbar" />}
            system={<Nav value="home" />}
            changed="V2's first tab, Jobs, is a Coming Soon page in a product about paid jobs, and Schedule shows sample tasks for another app. The active tab is indigo #4f46e5 on #eef2ff, a second accent beside the blue every other control uses, and the bar carries both a border and a shadow. The system keeps three places that match the concept, one blue for selection, one hairline, and no tab is ever left unlit." />
          <G.SpecDrawer rows={[
            { part: 'Height', token: '--v2-nav-h', value: '56px', ref: 'shell.nav.bar' },
            { part: 'Surface and edge', token: '--v2-surface, --v2-line', value: '1px top hairline, no shadow', ref: 'shell.nav.bar' },
            { part: 'Items', token: 'NAV_ITEMS', value: 'Home, Activity, Settings', ref: ['shell.nav.jobs', 'shell.nav.chat', 'shell.nav.schedule', 'shell.nav.settings'] },
            { part: 'Default', token: 'value', value: 'home', ref: 'shell.nav.default-tab' },
            { part: 'Selected bar', token: '--v2-blue, --v2-space-05', value: '#156efe, 2 x 24 on the hairline', ref: 'shell.nav.active-ink' },
            { part: 'Selected label and icon', token: '--v2-ink', value: '#0b0b0d, no fill', ref: 'shell.nav.active-fill' },
            { part: 'Rest label and icon', token: '--v2-ink-3', value: '#5f636b (6.0:1)', ref: 'shell.nav.active-ink' },
            { part: 'Label', token: '--v2-text-12, --v2-weight-medium', value: '12/500 in every state', ref: 'shell.nav.label' },
            { part: 'Icon', token: '--v2-icon-md, --v2-icon-stroke', value: '20, stroke 1.75', ref: ['shell.nav.icon', 'shell.nav.stroke'] },
            { part: 'Item shape', token: '--v2-radius-sm', value: '48 tall inside the bar, radius 6, wash on hover', ref: 'shell.nav.item-shape' },
            { part: 'Motion', token: '--v2-dur-1, --v2-ease-standard', value: '120ms colour', ref: 'shell.nav.motion' },
            { part: 'Badge', token: '--v2-action, --v2-on-color, --v2-text-11', value: '16 tall pill, 4.92:1' },
            { part: 'Pushed screen', token: 'value = parent tab', value: 'parent stays lit', ref: 'shell.nav.no-tab-lit' },
          ]} />
          <G.Note>V2's Jobs tab today: a Coming Soon page (<G.RefCell refs="shell.nav.coming-soon" />). Jobs and Schedule retire; the run window moves to Settings &gt; Worker (R04).</G.Note>
          <G.Warn>Decision D12: keep a fourth Chat tab only if the PM wants chat as a place of its own. The recommendation is three tabs, with the chat reached from Home, because the worker, not the conversation, is the product.</G.Warn>
          <G.DoDont
            do={['Light the parent tab while a pushed screen is open.', 'Use the badge only for something that needs the partner.']}
            dont={['Add a tab for a page that has nothing on it yet.', 'Change weight or size on the selected item.', 'Show the nav before sign-in.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('bottom-nav', BottomNavSection);
})();
