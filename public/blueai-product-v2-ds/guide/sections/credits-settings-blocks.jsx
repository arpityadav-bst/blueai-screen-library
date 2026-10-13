/* Section 49: Settings blocks (credits-settings slice). Kit: kit/settings.jsx, kit/advanced.jsx. */
(function () {
  const G = window.V2Guide;
  const noop = function () {};
  const fill = { width: '100%' };
  const stack = { display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)', width: '100%' };
  const KEY = { provider: 'Anthropic', model: 'claude-haiku-4-5', last4: 'qAAA' };
  const DRAFT = { provider: 'Anthropic', key: 'sk-ant-api03-7Hq2xQ' };
  const W = function (node) { return <div style={fill}>{node}</div>; };
  // V2 always hands SettingsScreen a byok object (index.html:977), so its own-key card draws; V2's signed-in default.
  const V2_BYOK = { on: false, setOn: noop, keyAdded: false, keyInfo: null, onSave: noop, onRemove: noop, highlight: false };

  function SettingsBlocksSection() {
    const K = window.V2Kit || {};
    const S = K.SettingsSection, A = K.AdvancedDisclosure, B = K.ByokPanel, M = K.AiModePanel;
    if (!S || !A || !B || !M) return <G.Section id="settings-blocks"><G.Warn>kit/settings.jsx or kit/advanced.jsx is not loaded.</G.Warn></G.Section>;
    const Row = K.ListRow || function (p) { return <div>{p.label}: {p.value}</div>; };
    const Select = K.Select || function () { return null; };
    const rows = [<Row key="w" label="Run window" value="11 am" />, <Row key="m" label="YouTube" value="Always ask" />];
    const sec = function (p) { return W(<S title="Worker" {...p}>{rows}</S>); };
    const byok = function (p) { return W(<B on onToggle={noop} onSave={noop} onRemove={noop} onModel={noop} {...p} />); };
    // The kit's own placeholders (kit/advanced.jsx), as a filled-in local model.
    const LOCAL = { endpoint: 'http://127.0.0.1:11434/api/chat', model: 'qwen3-vl:4b-instruct' };
    const ai = function (p) { return W(<M mode="hybrid" hwSupported conflict={false} pct={0} onPick={noop} onMethod={noop} onDownload={noop} onCancel={noop} onRetry={noop} {...p} />); };
    const toast = K.Toast ? <K.Toast tone="success" title="Anthropic key removed" action={{ label: 'Undo', onClick: noop }} duration={0} /> : null;
    const chatModel = <S title="Chat model"><Select label="Model" value="auto" options={[{ value: 'auto', label: 'Auto' }]} onChange={noop} /></S>;
    return (
      <G.Section id="settings-blocks">
        <G.Part name="SettingsSection" status="changed"
          role="One card per topic the partner thinks about, hair-divided rows inside; developer controls behind one Advanced disclosure.">
          <G.StateGrid wide states={[
            { label: 'Rest', node: sec() },
            { label: 'With description', node: sec({ description: 'When it runs and what it asks you first.' }) },
            { label: 'Highlighted', note: 'routed here, 1900ms', node: sec({ className: 'is-highlighted' }) },
          ]} />
          <G.CompareRow
            v2={<G.Live get={function () { return window.SettingsScreen; }} props={{ byok: V2_BYOK, aiModeConditions: { hwSupported: true, conflict: false } }} label="window.SettingsScreen" />}
            system={<div style={stack}>{sec({ description: 'When it runs and what it asks you first.' })}<A /></div>}
            changed={'V2 copies one card shell five times inline with two paddings (16 and 18), two title weights (17/700 and '
              + '17/800) and a shadow on every card, then leads with BlueStacks, Telegram, AI Mode, own key and Max Output Tokens, '
              + 'Max Steps and Timeout before anything about the worker. The system is one SettingsSection (1px line, no shadow, '
              + 'padding 16, title 16/600), rows hair-divided, partner topics first and the developer controls behind one '
              + 'Advanced disclosure. Routing to a section highlights it and never changes it (V2 also switched own key on).'} />
          <G.Warn>V2 says "Connected to BlueStacks App Player" whether or not it is installed (settings.jsx:16). The truthful card is part of Settings (section 61).</G.Warn>
          <G.DoDont
            do={['Group by what the partner thinks about: Worker, Connected apps, Notifications, BlueStacks, Account and privacy, Help, then Advanced.', 'Apply on change with a quiet toast; a Save button only for a multi-field form (section 55).', 'Pass ListRows without their own divider; the section draws the hairlines.']}
            dont={['Put tokens, steps or timeouts in front of the partner.', 'Change a setting by routing to it.', 'Add a shadow or a second padding.']} />
          <G.SpecDrawer rows={[
            { part: 'Card', token: '--v2-surface, --v2-line, --v2-shadow-0', value: '1px rgba(0,0,0,0.10), no shadow', ref: 'credits-settings.settings.card' },
            { part: 'Radius', token: '--v2-radius-lg', value: '16px', ref: 'credits-settings.settings.card' },
            { part: 'Padding', token: '--v2-space-4', value: '16px (one value)', ref: ['credits-settings.settings.card', 'credits-settings.settings.card-18'] },
            { part: 'Title', token: '--v2-text-16, --v2-weight-semibold', value: '16/600 #0b0b0d', ref: ['credits-settings.settings.title', 'credits-settings.byok.title'] },
            { part: 'Description', token: '--v2-text-13, --v2-ink-3', value: '13/400 #5f636b' },
            { part: 'Row divider', token: '--v2-line-hair', value: '1px rgba(0,0,0,0.08), between rows only', ref: 'credits-settings.settings.row' },
            { part: 'Highlight', token: '--v2-blue, --v2-focus-ring', value: 'blue edge + 3px 16% ring for 1900ms', ref: ['credits-settings.byok.glow', 'credits-settings.byok.glow-time'] },
            { part: 'Routing', token: null, value: 'scrolls (instantly under reduced motion), never sets a value', ref: 'credits-settings.settings.route' },
            { part: 'Save model', token: null, value: 'apply on change + toast', ref: ['credits-settings.settings.save', 'credits-settings.settings.saved'] },
          ]} />
        </G.Part>

        <G.Part name="AdvancedDisclosure" status="changed"
          role="The one place developer controls live: AI mode, your own key and the chat model, closed by default so partner topics come first.">
          <G.StateGrid wide states={[
            { label: 'Closed', node: W(<A />) },
            { label: 'Hover', note: 'toggleClassName', node: W(<A toggleClassName="is-hover" />) },
            { label: 'Focus-visible', node: W(<A toggleClassName="is-focus" />) },
            { label: 'Pressed', node: W(<A toggleClassName="is-active" />) },
            { label: 'Open', note: 'chevron turned, panels 12 apart', node: W(<A defaultOpen>{chatModel}</A>) },
          ]} />
          <G.Note>Changed from V2, which has no grouping: Max Output Tokens, Max Steps, Timeout and two AI model pickers sit in front of the partner. Forced states go on the button with toggleClassName; className stays on the wrapper.</G.Note>
          <G.SpecDrawer rows={[
            { part: 'Row', token: '--v2-control-lg, --v2-surface, --v2-line, --v2-radius-lg', value: 'min 44, padding 12 16, 1px line, radius 16; a real button with aria-expanded and aria-controls', ref: 'credits-settings.settings.order' },
            { part: 'Label', token: '--v2-text-14, --v2-weight-medium, --v2-ink', value: "'Advanced' 14/500 ink" },
            { part: 'Note', token: '--v2-text-12, --v2-ink-3', value: "12 ink-3: 'AI mode, your own key and the chat model. Most partners never need these.'" },
            { part: 'Chevron', token: '--v2-icon-sm, --v2-ink-3, --v2-dur-2', value: 'chevron-down 16 ink-3, turns 180° open in 180ms; the body appears without animation' },
            { part: 'Hover, press', token: '--v2-line-hover, --v2-wash-hover, --v2-wash-press', value: 'edge firms + wash; deeper wash while held' },
            { part: 'Body', token: '--v2-space-3', value: 'stays in the DOM with hidden, so aria-controls always resolves' },
            { part: 'Chat model', token: null, value: 'one model picker, under Advanced', ref: ['credits-settings.settings.ai-model', 'credits-settings.byok.model', 'credits-settings.settings.max-tokens'] },
          ]} />
          <G.DoDont
            do={['Keep it closed by default.', 'Put AI mode, your own key and the chat model inside it.']}
            dont={['Put anything a partner needs for the worker inside it.', 'Force a state with className: it lands on the wrapper, not the button.']} />
        </G.Part>

        <G.Part name="ByokPanel" status="changed"
          role="Run on your own provider key. The switch only turns it on or off; removing a key asks first and can be undone.">
          <G.StateGrid wide states={[
            { label: 'Off', node: byok({ on: false }) },
            { label: 'Off, key kept', note: 'switching off never deletes', node: byok({ on: false, keyInfo: KEY }) },
            { label: 'On, no key', node: byok() },
            { label: 'Provider picked', node: byok({ draft: { provider: 'Anthropic' } }) },
            { label: 'Validating', node: byok({ draft: DRAFT, status: 'validating' }) },
            { label: 'Invalid key', node: byok({ draft: DRAFT, status: 'invalid' }) },
            { label: 'Provider unreachable', node: byok({ draft: DRAFT, status: 'unreachable' }) },
            { label: 'Saved', node: byok({ keyInfo: KEY }) },
            { label: 'Remove confirm', note: 'consequence before the choice', node: byok({ keyInfo: KEY, status: 'confirm-remove' }) },
            { label: 'Removed', note: 'Undo toast (section 24)', node: <div style={stack}>{byok()}{toast}</div> },
          ]} />
          <G.CompareRow
            v2={<G.Live get={function () { return window.Byok && window.Byok.ByokSettings; }} label="window.Byok.ByokSettings"
              props={{ on: true, keyAdded: true, keyInfo: { provider: 'Anthropic', model: 'claude-haiku-4-5', key: 'sk-ant-9Xsj' }, setOn: noop, onSave: noop, onRemove: noop }} />}
            system={byok({ keyInfo: KEY })}
            changed={'In V2 switching own key off deletes the key, Validate & Save cannot fail (it makes up a key when the field '
              + 'is empty), the key is typed in clear text under "stored encrypted", Remove acts at once, the toggle is a 46x26 '
              + 'pressed button and the select drops its focus outline. The system separates the Switch ("Turning this off keeps '
              + 'your saved key") from Remove, which asks first and offers Undo; the key is a secret field; validating, invalid '
              + 'and unreachable states exist; one model picker; "AI credits" replaces "BlueAI credits consumed".'} />
          <G.SpecDrawer rows={[
            { part: 'Section', token: 'SettingsSection', value: "'Bring your own key' + V2 description", ref: ['credits-settings.byok.title', 'credits-settings.byok.desc'] },
            { part: 'Switch', token: 'V2Kit.Switch (role=switch)', value: "'Use my own key', on/off only", ref: ['credits-settings.byok.toggle', 'credits-settings.byok.toggle-size', 'credits-settings.byok.toggle-deletes'] },
            { part: 'No key', token: '--v2-text-12, --v2-ink-3', value: 'neutral note, not the yellow notice', ref: ['credits-settings.byok.none', 'credits-settings.byok.notice-amber'] },
            { part: 'Provider', token: 'V2Kit.Select', value: "placeholder 'Add a provider', five providers", ref: ['credits-settings.byok.add', 'credits-settings.byok.providers', 'credits-settings.byok.select-outline'] },
            { part: 'API key', token: 'V2Kit.TextField secret mono', value: 'password type + reveal; hint as helper', ref: ['credits-settings.byok.clear-text', 'credits-settings.byok.stored'] },
            { part: 'Check and save', token: 'Button primary', value: "disabled until a key; keeps 'Check and save' with a spinner while validating (the helper says 'Checking your key with {provider}…')", ref: ['credits-settings.byok.validate', 'credits-settings.byok.fake-key'] },
            { part: 'Saved key', token: '--v2-font-mono, --v2-ink-3', value: 'provider 14/500, four dots + last 4', ref: 'credits-settings.byok.masked' },
            { part: 'Remove', token: 'Button secondary, then danger', value: 'inline confirm, then Undo toast', ref: ['credits-settings.byok.remove', 'credits-settings.byok.remove-style'] },
            { part: 'On note', token: '--v2-text-12, --v2-ink-3', value: "'No AI credits are used while this is on.'", ref: 'credits-settings.byok.own-key-note' },
          ]} />
        </G.Part>

        <G.Part name="AiModePanel" status="changed"
          role="Where AI runs: Cloud, or Hybrid on the partner's PC so tasks use fewer AI credits. Every lifecycle state is reachable.">
          <G.StateGrid wide states={[
            { label: 'Cloud', node: ai({ mode: 'cloud' }) },
            { label: 'Hybrid pending', note: 'still on Cloud', node: ai({ status: 'idle' }) },
            { label: 'Downloading', node: ai({ status: 'downloading', pct: 42 }) },
            { label: 'Installing', node: ai({ status: 'installing', pct: 100 }) },
            { label: 'On', node: ai({ status: 'running' }) },
            { label: 'On, another local model running', node: ai({ status: 'running', conflict: true }) },
            { label: 'Download failed', node: ai({ status: 'install_failed' }) },
            { label: "Couldn't start", node: ai({ status: 'startup_failed' }) },
            { label: 'Paused', node: ai({ status: 'blocked' }) },
            { label: 'Hardware not supported', node: ai({ mode: 'cloud', hwSupported: false }) },
            { label: 'Own local model', note: 'method custom', node: ai({ status: 'idle', method: 'custom', endpoint: '', model: '' }) },
            { label: 'Own local model, checking', note: 'after Apply', node: ai({ status: 'checking', method: 'custom', endpoint: LOCAL.endpoint, model: LOCAL.model }) },
            { label: 'Own local model, on', node: ai({ status: 'running', method: 'custom', endpoint: LOCAL.endpoint, model: LOCAL.model }) },
            { label: 'Own local model, unreachable', note: 'endpoint failed', node: ai({ status: 'startup_failed', method: 'custom', endpoint: LOCAL.endpoint, model: LOCAL.model }) },
          ]} />
          <G.CompareRow
            v2={<G.Live get={function () { return window.AiMode && window.AiMode.AIModeCard; }} label="window.AiMode.AIModeCard"
              props={{ outer: 'hybrid', method: 'auto', status: 'running', hwSupported: true, conflict: false, pct: 100, endpoint: '', model: '', applying: false,
                onPickCloud: noop, onPickHybrid: noop, onPickAuto: noop, onPickCustom: noop, onEndpoint: noop, onModel: noop, onApplyCustom: noop, onRetry: noop, onOpenModal: noop }} />}
            system={ai({ status: 'running' })}
            changed={'V2 is a solid state machine whose three failure states (download failed, couldn\'t start, paused) no code '
              + 'path reaches, behind a second set of option cards (Auto, Custom) and a separate setup dialog. "Saves tokens" '
              + 'becomes "uses fewer AI credits"; Retry becomes Try again. The system defaults to BlueAI\'s own model (one less '
              + 'choice), keeps your own local model one link away, folds the setup dialog into the panel with the 3 to 4 GB '
              + 'stated before the button, gives the disabled Hybrid card its reason, and the whole panel moves under Advanced.'} />
          <G.SpecDrawer rows={[
            { part: 'Section', token: 'SettingsSection', value: "'AI mode', 'Choose where AI processing happens.'", ref: ['credits-settings.aimode.title', 'credits-settings.aimode.desc'] },
            { part: 'Choice', token: 'V2Kit.RadioCard', value: "Cloud / Hybrid; pending = picked, not active ('Setup needed')", ref: ['credits-settings.aimode.cloud', 'credits-settings.aimode.hybrid', 'credits-settings.aimode.option-card', 'credits-settings.aimode.setup-tag'] },
            { part: 'No hardware', token: 'RadioCard disabledReason', value: 'reason on the card, not a title tooltip', ref: ['credits-settings.aimode.no-hw', 'credits-settings.aimode.disabled'] },
            { part: 'Pending', token: '--v2-text-13, --v2-ink-2', value: 'still on Cloud + 3 to 4 GB, then Download and turn on', ref: ['credits-settings.aimode.pick', 'credits-settings.aimode.size', 'credits-settings.aimode.download', 'credits-settings.aimode.modal'] },
            { part: 'Progress', token: 'V2Kit.ProgressBar size 6', value: 'Downloading 42% / Installing (sliding)', ref: ['credits-settings.aimode.progress', 'credits-settings.aimode.rail', 'credits-settings.aimode.still', 'credits-settings.aimode.cancel'] },
            { part: 'Status', token: 'V2Kit.Badge', value: 'On success / Download failed, Couldn\'t start danger / Paused neutral', ref: ['credits-settings.aimode.status', 'credits-settings.aimode.on-label', 'credits-settings.aimode.failed-label', 'credits-settings.aimode.start-label', 'credits-settings.aimode.paused-label'] },
            { part: 'Messages', token: 'V2Kit.Banner danger / offline', value: 'V2 copy; Try again as the banner action', ref: ['credits-settings.aimode.failed-text', 'credits-settings.aimode.start-text', 'credits-settings.aimode.conflict', 'credits-settings.aimode.retry'] },
            { part: 'On text', token: '--v2-text-13, --v2-ink-2', value: '...so they use fewer AI credits.', ref: 'credits-settings.aimode.on-text' },
            { part: 'Own local model', token: 'V2Kit.TextField mono', value: 'endpoint + model name, Apply', ref: ['credits-settings.aimode.endpoint', 'credits-settings.aimode.model', 'credits-settings.aimode.endpoint-failed'] },
            { part: 'Reachability', token: null, value: 'every status is a prop, so each is reviewable', ref: 'credits-settings.aimode.run-install' },
          ]} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('settings-blocks', SettingsBlocksSection);
})();
