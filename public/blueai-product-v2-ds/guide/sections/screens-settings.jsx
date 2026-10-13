/* Section 61: Settings (screens-account slice). Screen: screens/settings.jsx (V2Screens.Settings).
   Screens are drawn whole, in the compact 419 x 640 window, so each state sits in its own frame. */
(function () {
  const G = window.V2Guide;
  const noop = function () {};
  // V2 always hands SettingsScreen a byok object (index.html:977), so its own-key card draws; this one is V2's signed-in default.
  const V2_BYOK = { on: false, setOn: noop, keyAdded: false, keyInfo: null, onSave: noop, onRemove: noop, highlight: false };
  const v2Box = { width: 'var(--v2-shell-w)', maxWidth: '100%', maxHeight: 640, overflow: 'auto', padding: '0 var(--v2-space-4)', background: 'var(--v2-canvas)' };

  // StateGrid's cells are 168 or 320 wide; a whole window needs 419 plus the stage padding.
  function Screens({ states }) {
    return (
      <div className="g-states" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(453px, 1fr))', overflowX: 'auto' }}>
        {states.map(function (s, i) {
          return (
            <figure className="g-state" key={s.label + i}>
              <div className="g-state-stage">{s.node}</div>
              <figcaption className="g-state-label">{s.label}{s.note ? <span className="g-state-note">{s.note}</span> : null}</figcaption>
            </figure>
          );
        })}
      </div>
    );
  }

  function SettingsScreenSection() {
    const S = window.V2Screens || {};
    const K = window.V2Kit || {};
    if (!S.Settings) return <G.Section id="settings"><G.Warn>screens/settings.jsx is not loaded.</G.Warn></G.Section>;
    const f = K.workerFixtures || {};
    const scr = function (p) { return <S.Settings preview compact landmark={false} onNavigate={noop} {...(p || {})} />; };
    return (
      <G.Section id="settings">
        <G.Part name="Settings" status="changed"
          role="The Settings tab. Partner topics first, in the order a partner looks for them; developer controls closed behind Advanced.">
          <p><strong>Anatomy.</strong> Inside the window (Settings lit in the nav): ScreenHeader 'Settings', then one 12px column of
            SettingsSection cards: Worker (one summary row), Connected apps (one row per app), Notifications (two switch rows, covering the events section 54 maps to them),
            BlueStacks (one row that tells the truth, with the action that fixes it), Account and privacy (one row), Help (FAQ,
            Report a problem), and the Advanced disclosure, closed, holding AI mode, own key and one chat model.</p>
          <Screens states={[
            { label: 'Default', note: 'Always ask, runs daily at 11 am', node: scr() },
            { label: 'Advanced open', note: 'AI mode, own key, one chat model', node: scr({ state: 'advanced' }) },
            { label: 'BlueStacks not installed', note: 'the preflight result, with the way out', node: scr({ state: 'no-bluestacks' }) },
            { label: 'BlueStacks signed out', note: 'App Player not signed in to YouTube', node: scr({ state: 'no-bluestacks', bluestacks: 'signed-out' }) },
            { label: 'Highlighted section', note: 'routed to Connected apps: look held 1900ms, no value changed', node: scr({ highlight: 'apps', telegram: 'linked' }) },
            { label: 'Worker paused', note: 'the summary row says until when and what it costs', node: scr({ worker: f.paused }) },
            { label: 'Report a problem', note: 'Help > Report a problem opens the sheet (section 65)', node: scr({ state: 'report' }) },
          ]} />
          <G.Note>Each summary row pushes its screen with Back and keeps Settings lit in the nav: BlueAI worker to Worker settings
            (section 62), an app to Connected apps (63), the account row to Account and privacy (64). AI credits (66) is not
            under Settings: only the top bar's credits chip opens it, and it keeps the tab it was opened over lit (section 32).
            FAQ opens the site article in the browser; Report a problem opens one sheet (65). Changes apply at once with a
            toast; nothing on this screen has a Save button.</G.Note>
          <G.CompareRow
            v2={(
              <div>
                <div style={v2Box}>
                  <G.Live get={function () { return window.SettingsScreen; }} label="window.SettingsScreen"
                    props={{ byok: V2_BYOK, aiModeConditions: { hwSupported: true, conflict: false } }} />
                </div>
                <G.FrameState url="index.html?start=worker" label="V2 signed in: open Settings in the bottom nav" height={760} />
              </div>
            )}
            system={scr()}
            changed={'V2 has no page title and opens on "BlueStacks Instance", which says "Connected to BlueStacks App Player" '
              + 'whether or not BlueStacks is installed; then Telegram, AI mode, own key, and a Chat AI Settings card of Max '
              + 'Output Tokens, Max Steps and Timeout with its own Save button and a second AI Model picker. Nothing about the '
              + 'worker, its accounts or the partner is here. The system leads with the worker (when it runs, how it takes paid '
              + 'jobs), then the accounts it acts on, notifications, a BlueStacks row that tells the truth with the one action '
              + 'that fixes it, the account, and help; AI mode, own key and one chat model wait closed under Advanced, and the '
              + 'token, step and timeout knobs leave the partner UI. One card shape, one 20/600 title, changes apply on change.'} />
          <G.DoDont
            do={['Keep the order: Worker, Connected apps, Notifications, BlueStacks, Account and privacy, Help, Advanced.',
              'Bind the BlueStacks row to the preflight result: connected, not installed (Get BlueStacks), signed out (Open App Player).',
              'Summarise each pushed screen in one row with its current value; the change happens on that screen.',
              'Route to a section by highlighting it; never change a value by routing.']}
            dont={['Show tokens, steps or timeouts to a partner.', 'Claim a connection the app has not checked.',
              'Add a Save button to a list of toggles.', 'Open Advanced by default.']} />
          <G.SpecDrawer rows={[
            { part: 'Title', token: 'ScreenHeader, --v2-text-20, --v2-weight-semibold', value: '"Settings" 20/600 ink', ref: 'screens-account.settings.no-title' },
            { part: 'Order', token: null, value: 'Worker, Connected apps, Notifications, BlueStacks, Account and privacy, Help, Advanced', ref: ['screens-account.settings.order-bluestacks', 'screens-account.settings.order-telegram', 'screens-account.settings.order-aimode', 'screens-account.settings.order-chat-ai'] },
            { part: 'Section card', token: 'SettingsSection: --v2-surface, --v2-line, --v2-radius-lg, --v2-space-4', value: '1px line, radius 16, padding 16, no shadow', ref: 'screens-account.settings.card' },
            { part: 'Section title', token: '--v2-text-16, --v2-weight-semibold', value: '16/600 ink, no icon', ref: 'screens-account.settings.card-title' },
            { part: 'Gap and gutter', token: '--v2-space-3, --v2-gutter', value: '12 between sections, 16 to the window edge' },
            { part: 'Worker row', token: 'ListRow nav, Badge neutral when paused', value: 'run time + mode from the Worker record', ref: 'screens-account.worker.no-settings-card' },
            { part: 'Connected apps', token: 'V2Screens.ConnectedAppRows', value: 'YouTube, Telegram, Instagram (Coming soon, static)', ref: ['screens-account.settings.telegram-title', 'screens-account.apps.instagram'] },
            { part: 'Notifications', token: 'ListRow + Switch', value: 'a paid job needs you; today’s run ends (Proposed copy); each covers the events section 54 maps to it' },
            { part: 'BlueStacks', token: 'ListRow, Badge success or Button sm', value: 'three true states; V2’s switch hint kept', ref: ['screens-account.settings.bluestacks-claim', 'screens-account.settings.bluestacks-switch'] },
            { part: 'Help', token: 'ListRow external + ListRow', value: 'FAQ (site), Report a problem (sheet)', ref: ['screens-account.help.faq', 'screens-account.help.report'] },
            { part: 'Advanced', token: 'AdvancedDisclosure, closed', value: 'AI mode, own key, chat model; no tokens, steps or timeout', ref: ['screens-account.settings.max-tokens', 'screens-account.settings.max-steps', 'screens-account.settings.timeout'] },
            { part: 'Chat model', token: 'Select', value: 'one picker, Auto + six models', ref: ['screens-account.settings.ai-model', 'screens-account.settings.model-auto'] },
            { part: 'Saving', token: 'Toast', value: 'apply on change; no Save button', ref: 'screens-account.settings.save' },
          ]} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('settings', SettingsScreenSection);
})();
