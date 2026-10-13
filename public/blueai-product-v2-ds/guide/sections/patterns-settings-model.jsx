/* Section 55: Settings model (entry-patterns slice). Part: Grouping and save model (Changed).
   Composed from kit parts (Switch, Select, TextField, Button, Toast) and V2Screens.Settings
   (screens-account slice). Refs: guide/refs/entry-patterns.js. */
(function () {
  const G = window.V2Guide;

  // group, what lives there, why it sits at that rank
  const GROUPS = [
    ['Worker', 'Always ask or Automatic per app, run window, pause until, start with Windows, interest profile', 'The promise “pause, stop, or disconnect anytime” needs its controls first (P4).'],
    ['Connected apps', 'YouTube (account, watch history, Disconnect), Instagram (coming soon), Telegram', 'Which accounts BlueAI acts on, and how to take them back.'],
    ['Notifications', 'Windows notifications per event', 'What the worker may interrupt for.'],
    ['BlueStacks', 'App Player status from the real check: not installed, signed out, connected as', 'Where a partner debugs a failed day.'],
    ['Account and privacy', 'Signed-in account, the program, agreements, what BlueAI keeps, Sign out', 'Who you are and what you agreed to.'],
    ['Help', 'FAQ (opens the site), Report a problem', 'Last of the partner topics.'],
    ['Advanced (closed)', 'AI mode, your own key, chat model', 'Developer controls a partner never needs; one disclosure, closed by default.'],
  ];
  const SAVE = [
    ['Apply on change', 'Switch, segmented control, select: the change applies at once, a quiet toast says what changed, and a failure puts the control back with Try again.', 'Start with Windows; Always ask or Automatic; run window'],
    ['Save', 'Only for a form whose fields make sense together. Save is disabled until something changes (with the reason), loads while it saves, and leaving with changes asks first.', 'Your own key (provider and key); Report a problem'],
  ];

  function Box({ w, children }) {
    return <div style={{ width: w || 320, display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)' }}>{children}</div>;
  }
  function Win() {
    const S = window.V2Screens || {};
    if (!S.Settings) return <div className="g-missing">V2Screens.Settings is not loaded (screens-account slice).</div>;
    return (
      <div style={{ width: 419 * 0.6, height: 830 * 0.6, overflow: 'hidden', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-sm)' }}>
        <div style={{ width: 419, height: 830, transform: 'scale(0.6)', transformOrigin: '0 0' }}><S.Settings landmark={false} preview /></div>
      </div>
    );
  }
  function V2Settings() {
    const C = window.SettingsScreen;
    if (!C) return <div className="g-missing">V2 SettingsScreen is not loaded on this page.</div>;
    return (
      <div className="g-live" style={{ width: 419, height: 500, overflowY: 'auto', padding: '0 var(--v2-space-4)', background: 'var(--v2-canvas)', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-sm)' }}>
        <G.Boundary><C aiModeConditions={{}} /></G.Boundary>
      </div>
    );
  }
  function KeyForm({ state }) {
    const K = window.V2Kit;
    const dirty = state !== 'clean';
    return (
      <Box w={320}>
        <K.Select label="Provider" defaultValue="openai" options={[{ value: 'openai', label: 'OpenAI' }, { value: 'google', label: 'Google' }]} />
        <K.TextField label="API key" secret defaultValue={dirty ? 'sk-test-1234' : ''} placeholder="sk-proj-abc123"
          error={state === 'error' ? 'That key didn’t work. Check it and try again.' : undefined} />
        <K.Button variant="primary" loading={state === 'saving'} disabled={!dirty}
          disabledReason={dirty ? undefined : 'No changes yet'}>Save</K.Button>
      </Box>
    );
  }

  function SettingsModelSection() {
    const K = window.V2Kit;
    const noop = function () {};
    const sw = function (extra) {
      return <Box><K.Switch checked label="Start BlueAI with Windows" description="So tomorrow’s run still happens after a restart." onChange={noop} {...(extra || {})} /></Box>;
    };
    return (
      <G.Section id="settings-model">
        <G.Part name="Grouping and save model" status="changed" role="Settings grouped by what the partner thinks about, worker first, developer controls last; and one rule for when a change applies.">
          <div className="g-table-wrap">
            <table className="g-table">
              <thead><tr><th scope="col">Group, in order</th><th scope="col">What lives there</th><th scope="col">Why there</th></tr></thead>
              <tbody>{GROUPS.map(function (r) { return <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>; })}</tbody>
            </table>
          </div>
          <div className="g-table-wrap">
            <table className="g-table">
              <thead><tr><th scope="col">Save model</th><th scope="col">Rule</th><th scope="col">Used by</th></tr></thead>
              <tbody>{SAVE.map(function (r) { return <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>; })}</tbody>
            </table>
          </div>
          <G.StateGrid wide states={[
            { label: 'Apply on change: clean', node: sw() },
            { label: 'Saving', note: 'the switch holds', node: sw({ busy: true }) },
            { label: 'Saved', note: 'a quiet toast says what changed', node: <K.Toast tone="success" title="BlueAI starts with Windows." duration={0} /> },
            { label: 'Error', note: 'the switch goes back', node: <K.Toast tone="error" title="Couldn’t save that change." action={{ label: 'Try again', onClick: noop }} duration={0} onClose={noop} /> },
            { label: 'Form: clean', note: 'Save disabled, with the reason', node: <KeyForm state="clean" /> },
            { label: 'Form: dirty', node: <KeyForm state="dirty" /> },
            { label: 'Form: saving', node: <KeyForm state="saving" /> },
            { label: 'Form: saved', node: <K.Toast tone="success" title="Key saved." duration={0} /> },
            { label: 'Form: error', note: 'on the field, input kept', node: <KeyForm state="error" /> },
          ]} />
          <G.CompareRow
            v2={<V2Settings />}
            system={<Win />}
            changed="V2’s Settings is one stack of five cards with no groups: BlueStacks first (claiming Connected even when it is not installed), then Telegram, AI mode, your own key, and Chat AI settings with Max Output Tokens, Max Steps and a timeout, behind a Save button whose success line lasts 2.5 s, while switches beside it apply at once. A partner looking for worker controls finds none. The system groups by what the partner thinks about, puts the worker first, folds developer controls into one closed Advanced disclosure, and uses one save rule." />
          <G.SpecDrawer rows={[
            { part: 'Groups, V2', token: null, value: 'one stack, BlueStacks first, chat AI last', ref: ['entry-patterns.settings.screen', 'entry-patterns.settings.first', 'entry-patterns.settings.last'] },
            { part: 'False status, V2', token: null, value: 'Connected to BlueStacks App Player, always', ref: 'entry-patterns.settings.status' },
            { part: 'Developer knobs, V2', token: null, value: 'Chat AI Settings: Max Output Tokens, Max Steps, Timeout', ref: ['entry-patterns.settings.chat-ai', 'entry-patterns.settings.max-tokens', 'entry-patterns.settings.max-steps', 'entry-patterns.settings.timeout'] },
            { part: 'Saved, V2', token: null, value: 'Settings saved successfully. for 2500 ms', ref: ['entry-patterns.settings.saved', 'entry-patterns.settings.saved-time'] },
            { part: 'Section', token: 'SettingsSection', value: 'card radius 16, title 16/600, rows full-bleed with hairlines' },
            { part: 'Advanced', token: 'AdvancedDisclosure', value: 'closed by default, one button with aria-expanded' },
            { part: 'Routed highlight', token: 'SettingsSection highlight', value: '1900 ms, scrolls into view; never changes a value', ref: 'entry-patterns.settings.glow' },
            { part: 'Apply-on-change toast', token: 'Toast success', value: '4 s, polite, says what changed' },
            { part: 'Save button', token: 'Button primary md', value: 'disabled with a reason until dirty; loading while saving' },
          ]} />
          <G.DoDont
            do={['Put the worker’s controls first.', 'Apply a single control at once and say so quietly.', 'Keep Save for forms whose fields belong together.']}
            dont={['Mix apply-on-change and Save on one card.', 'Show developer controls by default.', 'Show a status the app has not checked.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('settings-model', SettingsModelSection);
})();
