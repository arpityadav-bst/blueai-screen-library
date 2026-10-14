// BlueAI: Settings Screen
// NO account card (Profile / Chat history / Report issue / Log Out live in the header ? and
// kebab menus). Since review round 1 the tab carries the one screen header ("Settings"), as every
// pushed screen and tab does. Cards, in order:
// BlueStacks instance · Worker · Telegram · AI mode · Bring your own key · Chat AI settings.
//
// V3, Phase 5, on kit parts since review rounds 1 and 2: every section is the kit's SettingsSection
// (.v2-settings-section: an in-flow card, the head, the body whose rows run full bleed) and every
// row the kit's ListRow (.v2-row: the label and its description on the left, the control on the
// right, the hairline between rows). An outside service (BlueStacks, Telegram) keeps its mark in a
// sunken tile (settings.css .v3-set-head); BlueAI's own sections carry none. One solid action per
// open form (review round 1): an always-shown card's save and routine actions are secondary.

const { useState } = React;

/* Worker (Arpit, 2026-10-14): the permanent home of the per-app mode outside chat. Its Apps
   group is the mode sheet's own list (agent_permissions.jsx's AppSwitchList), so a switch
   flipped here and one flipped in chat are the same setting, and turning one on asks for consent.
   Review round 1 (U9): the daily run time onboarding asked for is shown and changed here too, the
   Daily run row (the kit's Run time block, design-md 62, at its smallest: one select of the
   onboarding's three answers); the home greeting reads the same value (worker_flow.jsx). */
function WorkerCard() {
  const AppSwitchList = window.AgentPermissions.AppSwitchList;
  const WF = window.WorkerFlow;
  const [runTime, setRunTime] = useState(WF.getRunTime().id);
  const pick = (e) => { setRunTime(e.target.value); WF.setRunTime(e.target.value); };
  return (
    <section data-section="worker-settings" className="v2-settings-section">
      <h2 className="v2-settings-section-title v2-text-title">Worker</h2>
      <div className="v2-settings-section-body">
        <div className="v2-row v2-row--divider">
          <span className="v2-row-text">
            <label htmlFor="worker-run" className="v2-row-label">Daily run</label>
            <span id="worker-run-hint" className="v2-row-desc v2-text-body-sm">When BlueAI runs each day. A change starts with the next run.</span>
          </span>
          <span className="v2-row-trail">
            <SelectField id="worker-run" className="v3-field--md" value={runTime} onChange={pick} aria-describedby="worker-run-hint">
              {WF.RUN_TIMES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </SelectField>
          </span>
        </div>
        <div className="v3-set-block">
          <h3 className="v3-set-label">Apps</h3>
          <p className="v2-text-body-sm v3-set-desc">Apps BlueAI can run on its own. New apps always start on Always ask.</p>
          <AppSwitchList />
        </div>
      </div>
    </section>
  );
}

function BluestacksCard() {
  return (
    <section className="v2-settings-section">
      <div className="v3-set-head">
        <span className="v3-set-brand"><img src="assets/BlueStacks.png" alt="BlueStacks" onError={e => { e.target.style.display = 'none'; }} /></span>
        <div className="v3-set-head-main">
          <h2 className="v2-text-title v3-set-title">BlueStacks instance</h2>
          <p className="v2-text-body-sm v3-set-desc">Connected to <strong>BlueStacks App Player</strong></p>
          <p className="v2-text-meta v3-set-note">To switch, open BlueAI from another instance.</p>
        </div>
      </div>
    </section>
  );
}

function TelegramCard() {
  const [connected, setConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section className="v2-settings-section">
        <div className="v3-set-head">
          <span className="v3-set-brand"><window.V2Kit.Icon name="telegram" size={20} /></span>
          <div className="v3-set-head-main">
            <h2 className="v2-text-title v3-set-title">Telegram</h2>
            {connected
              ? <p className="v2-text-body-sm v3-set-desc">Connected to <strong>@BlueAIBot</strong></p>
              : <p className="v2-text-body-sm v3-set-desc">Connect your Telegram account and send commands to BlueAI from any device.</p>}
          </div>
        </div>
        <div className="v3-set-actions v3-set-actions--start">
          {connected
            ? <button type="button" onClick={() => setConnected(false)} className="v2-button v2-button--secondary">Unlink</button>
            : <button type="button" onClick={() => setShowModal(true)} className="v2-button v2-button--secondary">Connect Telegram</button>}
        </div>
      </section>

      <ModalOverlay isOpen={showModal} onClose={() => setShowModal(false)} title="Connect Telegram">
        <div className="v3-tg">
          <p className="v2-text-body">Scan the QR code or use the pairing code below to connect your Telegram account to BlueAI.</p>
          <div className="v2-card v2-card--inset v3-tg-panel">
            {/* QR placeholder */}
            <div className="v3-tg-qr">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><circle cx="17.5" cy="17.5" r="2.5" fill="currentColor" stroke="none"/></svg>
            </div>
            <p className="v2-text-meta">Or use pairing code:</p>
            <div className="v3-tg-code">4829</div>
          </div>
          <button type="button" onClick={() => { setConnected(true); setShowModal(false); }} className="v2-button v2-button--primary v2-button--lg v2-button--full">
            I've paired, continue
          </button>
        </div>
      </ModalOverlay>
    </>
  );
}

function AISettingsCard() {
  const [model, setModel] = useState('auto');
  const [maxTokens, setMaxTokens] = useState(10000);
  const [maxSteps, setMaxSteps] = useState(50);
  const [timeout, setTimeoutVal] = useState(1200);
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  // The one settings row, the kit's ListRow: the label and its description left, the control right.
  const fieldRow = (label, sublabel, el) => (
    <div key={label} className="v2-row v2-row--divider">
      <span className="v2-row-text">
        <span className="v2-row-label">{label}</span>
        {sublabel && <span className="v2-row-desc v2-text-body-sm">{sublabel}</span>}
      </span>
      <span className="v2-row-trail">{el}</span>
    </div>
  );

  const numInput = (label, val, set, min, max, step = 1) => (
    <Field className="v3-field--sm"><input type="number" aria-label={label} className="v2-field-input" value={val} onChange={e => set(+e.target.value)} min={min} max={max} step={step} style={{ fontVariantNumeric: 'tabular-nums' }} /></Field>
  );

  return (
    <section data-section="ai-chat-settings" className="v2-settings-section">
      <h2 className="v2-settings-section-title v2-text-title">Chat AI settings</h2>
      <div className="v2-settings-section-body">
        {fieldRow('AI model', null,
          <SelectField aria-label="AI model" className="v3-field--md" value={model} onChange={e => setModel(e.target.value)}>
            <option value="auto">Auto</option>
            <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro Preview</option>
            <option value="gpt-5.4-mini">GPT-5.4 Mini</option>
            <option value="claude-sonnet-4.6">Claude Sonnet 4.6</option>
            <option value="claude-opus-4.6">Claude Opus 4.6</option>
            <option value="gemini-3-flash-preview">Gemini 3 Flash Preview</option>
            <option value="gpt-5.4">GPT-5.4</option>
          </SelectField>
        )}
        {fieldRow('Max output tokens', 'Maximum number of tokens to generate (5,000-100,000)', numInput('Max output tokens', maxTokens, setMaxTokens, 5000, 100000, 1000))}
        {fieldRow('Max steps', 'Maximum number of reasoning steps (10-500)', numInput('Max steps', maxSteps, setMaxSteps, 10, 500))}
        {fieldRow('Timeout (seconds)', null, numInput('Timeout (seconds)', timeout, setTimeoutVal, 60, 7200, 60))}
        {/* The confirmation sits in the action row, beside the button that caused it, so nothing
           above it moves when it appears. Saved is a reached state, so it is the one green here. */}
        <div className="v3-set-actions">
          {saved &&
            <span className="v3-set-saved" role="status">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
              Settings saved successfully.
            </span>}
          <button type="button" onClick={save} className="v2-button v2-button--secondary">Save settings</button>
        </div>
      </div>
    </section>
  );
}

function SettingsScreen({ byok, aiModeConditions }) {
  const ByokSettings = window.Byok && window.Byok.ByokSettings;
  const aiMode = window.AiMode.useAiMode(aiModeConditions);
  return (
    <div className="v3-set">
      <ScreenHead title="Settings" />
      <div className="v3-screen-body">
      <BluestacksCard />
      <WorkerCard />
      <TelegramCard />
      <window.AiMode.AIModeCard {...aiMode} />
      {/* Bring Your Own Key, available in every geo; the canonical place to add/manage a key. */}
      {ByokSettings && byok && <ByokSettings {...byok} />}
      <AISettingsCard />
      {aiMode.modalOpen && <window.AiMode.HybridModal {...aiMode} />}
      </div>
    </div>
  );
}
