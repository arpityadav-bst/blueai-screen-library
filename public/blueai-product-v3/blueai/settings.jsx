// BlueAI: Settings Screen
// NO account card (Profile / Chat history / Report issue / Log Out live in the header ? and
// kebab menus). Since review round 1 the tab carries the one screen header ("Settings"), as every
// pushed screen and tab does. Cards, in order:
// BlueStacks Instance · Worker · Telegram · AI Mode · Bring Your Own Key · Chat AI Settings.
//
// V3, Phase 5 (settings.css .v3-set-*, kit cards, fields, switch and buttons since review round 1):
// every section is an in-flow card (1px line, no shadow) with
// the same head (title, one muted line) and the same row: label left in ink, control right, one
// muted hint under, rows split by the hairline. An outside service (BlueStacks, Telegram) keeps its
// mark in a sunken tile; BlueAI's own sections carry no icon. One solid action per open form (review
// round 1): an always-shown card's save and routine actions (connect, unlink) are secondary.

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
    <section data-section="worker-settings" className="v2-card v3-set-card">
      <h2 className="v2-text-title v3-set-title">Worker</h2>
      <div className="v3-set-rows">
        <div className="v3-set-row">
          <div className="v3-set-line">
            <label htmlFor="worker-run" className="v3-set-label">Daily run</label>
            <SelectField id="worker-run" className="v3-field--md" value={runTime} onChange={pick} aria-describedby="worker-run-hint">
              {WF.RUN_TIMES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </SelectField>
          </div>
          <p id="worker-run-hint" className="v2-text-meta v3-set-hint">When BlueAI runs each day. A change starts with the next run.</p>
        </div>
        <div className="v3-set-row">
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
    <section className="v2-card v3-set-card">
      <div className="v3-set-head">
        <span className="v3-set-brand"><img src="assets/BlueStacks.png" alt="BlueStacks" onError={e => { e.target.style.display = 'none'; }} /></span>
        <div className="v3-set-head-main">
          <h2 className="v2-text-title v3-set-title">BlueStacks Instance</h2>
          <p className="v2-text-body-sm v3-set-desc">Connected to <strong>BlueStacks App Player</strong></p>
          <p className="v2-text-meta v3-set-note">To switch, open BlueAI from another instance.</p>
        </div>
      </div>
    </section>
  );
}

const TelegramMark = () => (
  <svg className="v2-icon v2-icon--20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

function TelegramCard() {
  const [connected, setConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section className="v2-card v3-set-card">
        <div className="v3-set-head">
          <span className="v3-set-brand"><TelegramMark /></span>
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

  // The one settings row: label + control on a line, a muted hint below, hairline between rows.
  const fieldRow = (label, sublabel, el) => (
    <div key={label} className="v3-set-row">
      <div className="v3-set-line">
        <p className="v3-set-label">{label}</p>
        {el}
      </div>
      {sublabel && <p className="v2-text-meta v3-set-hint">{sublabel}</p>}
    </div>
  );

  const numInput = (label, val, set, min, max, step = 1) => (
    <Field className="v3-field--sm"><input type="number" aria-label={label} className="v2-field-input" value={val} onChange={e => set(+e.target.value)} min={min} max={max} step={step} style={{ fontVariantNumeric: 'tabular-nums' }} /></Field>
  );

  return (
    <section data-section="ai-chat-settings" className="v2-card v3-set-card">
      <h2 className="v2-text-title v3-set-title">Chat AI Settings</h2>
      <div className="v3-set-rows">
        {fieldRow('AI Model', null,
          <SelectField aria-label="AI Model" className="v3-field--md" value={model} onChange={e => setModel(e.target.value)}>
            <option value="auto">Auto</option>
            <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro Preview</option>
            <option value="gpt-5.4-mini">GPT-5.4 Mini</option>
            <option value="claude-sonnet-4.6">Claude Sonnet 4.6</option>
            <option value="claude-opus-4.6">Claude Opus 4.6</option>
            <option value="gemini-3-flash-preview">Gemini 3 Flash Preview</option>
            <option value="gpt-5.4">GPT-5.4</option>
          </SelectField>
        )}
        {fieldRow('Max Output Tokens', 'Maximum number of tokens to generate (5,000-100,000)', numInput('Max Output Tokens', maxTokens, setMaxTokens, 5000, 100000, 1000))}
        {fieldRow('Max Steps', 'Maximum number of reasoning steps (10-500)', numInput('Max Steps', maxSteps, setMaxSteps, 10, 500))}
        {fieldRow('Timeout (in Secs)', null, numInput('Timeout (in Secs)', timeout, setTimeoutVal, 60, 7200, 60))}
      </div>
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
    </section>
  );
}

function SettingsScreen({ byok, aiModeConditions }) {
  const ByokSettings = window.Byok && window.Byok.ByokSettings;
  const aiMode = window.AiMode.useAiMode(aiModeConditions);
  return (
    <div>
      <ScreenHead title="Settings" />
      <div className="v3-set">
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
