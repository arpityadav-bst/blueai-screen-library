// BlueAI — Settings Screen
// Matches the live product: NO page title, NO account card (Profile / Chat History /
// Report Issue / Log Out live in the header ? and kebab menus). Cards, in order:
// BlueStacks Instance · Telegram · Chat AI Settings.

const { useState } = React;

function BluestacksCard() {
  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <img src="assets/BlueStacks.png" alt="BlueStacks" style={{ width: 30, height: 30, borderRadius: 8, objectFit: 'contain' }} onError={e => { e.target.style.display = 'none'; }} />
        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111827' }}>BlueStacks Instance</h2>
      </div>
      <p style={{ fontSize: 13.5, color: '#6b7280', marginBottom: 5 }}>
        Connected to <span style={{ color: '#1990FF', fontWeight: 600 }}>BlueStacks App Player</span>
      </p>
      <p style={{ fontSize: 12.5, color: '#9ca3af', lineHeight: 1.5 }}>
        To switch, open BlueAI from another instance.
      </p>
    </div>
  );
}

function TelegramCard() {
  const [connected, setConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div style={{ background: 'white', borderRadius: 16, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <svg viewBox="0 0 24 24" fill="#3B82F6" style={{ width: 32, height: 32, flexShrink: 0 }}>
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111827' }}>Telegram</h2>
        </div>
        <div style={{ minHeight: 40, marginBottom: 12 }}>
          {connected
            ? <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Connected to <span style={{ color: '#1990FF', fontWeight: 600 }}>@BlueAIBot</span></p>
            : <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5, marginTop: 2 }}>Connect your Telegram account and send commands to BlueAI from any device.</p>}
        </div>
        {connected
          ? <button onClick={() => setConnected(false)} style={{ borderRadius: 20, border: '1px solid #e2e8f0', padding: '8px 18px', fontSize: 13, fontWeight: 600, color: '#374151', background: 'white', cursor: 'pointer', fontFamily: 'inherit' }}>Unlink</button>
          : <button onClick={() => setShowModal(true)} style={{ borderRadius: 20, background: '#1990FF', border: 'none', padding: '8px 18px', fontSize: 13, fontWeight: 600, color: 'white', cursor: 'pointer', fontFamily: 'inherit' }}>Connect Telegram</button>}
      </div>

      <ModalOverlay isOpen={showModal} onClose={() => setShowModal(false)} title="Connect Telegram">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>Scan the QR code or use the pairing code below to connect your Telegram account to BlueAI.</p>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            {/* QR placeholder */}
            <div style={{ width: 120, height: 120, background: '#e2e8f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><circle cx="17.5" cy="17.5" r="2.5" fill="#94a3b8" stroke="none"/></svg>
            </div>
            <p style={{ fontSize: 12, color: '#9ca3af' }}>Or use pairing code:</p>
            <div style={{ background: 'white', border: '1.5px dashed #c7d2fe', borderRadius: 8, padding: '10px 20px' }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#4f46e5', letterSpacing: 6 }}>4829</span>
            </div>
          </div>
          <button onClick={() => { setConnected(true); setShowModal(false); }}
            style={{ padding: '11px', borderRadius: 8, background: '#1990FF', border: 'none', fontSize: 14, fontWeight: 600, color: 'white', cursor: 'pointer', fontFamily: 'inherit' }}>
            I've paired — continue
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

  // Live layout: bold dark label + value box on one row, grey hint line below, divider between.
  const fieldRow = (label, sublabel, el) => (
    <div key={label} style={{ padding: '16px 0', borderBottom: '1px solid #eef2f6' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{label}</p>
        {el}
      </div>
      {sublabel && <p style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.4, marginTop: 8 }}>{sublabel}</p>}
    </div>
  );

  const numInput = (val, set, min, max, step = 1) => (
    <input type="number" className="ba-field" value={val} onChange={e => set(+e.target.value)} min={min} max={max} step={step}
      style={{ width: 150, border: '1px solid #d1d5db', borderRadius: 8, padding: '9px 12px', fontSize: 14, fontWeight: 500, color: '#111827', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
  );

  return (
    <div data-section="ai-chat-settings" style={{ background: 'white', borderRadius: 16, padding: 18, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <svg width="28" height="28" fill="none" stroke="#1990FF" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
        </svg>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111827' }}>Chat AI Settings</h2>
      </div>
      <div>
        {fieldRow('AI Model', null,
          <select className="ba-field" value={model} onChange={e => setModel(e.target.value)}
            style={{ width: 200, border: '1px solid #d1d5db', borderRadius: 8, padding: '9px 12px', fontSize: 14, fontWeight: 500, color: '#111827', background: 'white', cursor: 'pointer', fontFamily: 'inherit', outline: 'none' }}>
            <option value="auto">Auto</option>
            <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro Preview</option>
            <option value="gpt-5.4-mini">GPT-5.4 Mini</option>
            <option value="claude-sonnet-4.6">Claude Sonnet 4.6</option>
            <option value="claude-opus-4.6">Claude Opus 4.6</option>
            <option value="gemini-3-flash-preview">Gemini 3 Flash Preview</option>
            <option value="gpt-5.4">GPT-5.4</option>
          </select>
        )}
        {fieldRow('Max Output Tokens', 'Maximum number of tokens to generate (5,000-100,000)', numInput(maxTokens, setMaxTokens, 5000, 100000, 1000))}
        {fieldRow('Max Steps', 'Maximum number of reasoning steps (10-500)', numInput(maxSteps, setMaxSteps, 10, 500))}
        {fieldRow('Timeout (in Secs)', null, numInput(timeout, setTimeoutVal, 60, 7200, 60))}
      </div>
      {saved && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#15803d', marginTop: 12 }}>Settings saved successfully.</div>}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <button onClick={save} style={{ background: '#1990FF', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 14, fontWeight: 600, color: 'white', cursor: 'pointer', fontFamily: 'inherit' }}>Save settings</button>
      </div>
    </div>
  );
}

function SettingsScreen({ byok, aiModeConditions }) {
  const ByokSettings = window.Byok && window.Byok.ByokSettings;
  const aiMode = window.AiMode.useAiMode(aiModeConditions);
  return (
    <div style={{ paddingTop: 16, paddingBottom: 20 }}>
      <BluestacksCard />
      <TelegramCard />
      <window.AiMode.AIModeCard {...aiMode} />
      {/* Bring Your Own Key — available in every geo; the canonical place to add/manage a key. */}
      {ByokSettings && byok && <ByokSettings {...byok} />}
      <AISettingsCard />
      {aiMode.modalOpen && <window.AiMode.HybridModal {...aiMode} />}
    </div>
  );
}
