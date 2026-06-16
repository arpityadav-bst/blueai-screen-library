// BlueAI — Settings Screen

const { useState } = React;

function BluestacksCard() {
  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <img src="assets/BlueStacks.png" alt="BlueStacks" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'contain' }} onError={e => { e.target.style.display = 'none'; }} />
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>BlueStacks</h2>
      </div>
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>
        Connected to <span style={{ color: '#1990FF', fontWeight: 600 }}>BlueStacks 5 – Player</span>
      </p>
      <p style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.5 }}>
        This instance is used by BlueAI to control apps and run automated tasks.
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
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Telegram</h2>
        </div>
        <div style={{ minHeight: 40, marginBottom: 12 }}>
          {connected
            ? <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Connected to <span style={{ color: '#1990FF', fontWeight: 600 }}>@BlueAIBot</span></p>
            : <p style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.5, marginTop: 2 }}>Connect Telegram to receive notifications and control BlueAI from your phone.</p>}
        </div>
        {connected
          ? <button onClick={() => setConnected(false)} style={{ borderRadius: 20, border: '1px solid #e2e8f0', padding: '7px 16px', fontSize: 13, color: '#374151', background: 'white', cursor: 'pointer', fontFamily: 'inherit' }}>Unlink</button>
          : <button onClick={() => setShowModal(true)} style={{ borderRadius: 20, background: '#1990FF', border: 'none', padding: '7px 16px', fontSize: 13, fontWeight: 600, color: 'white', cursor: 'pointer', fontFamily: 'inherit' }}>Connect</button>}
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

  const fieldRow = (label, sublabel, el) => (
    <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f3f4f6', gap: 12 }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: '#6b7280', marginBottom: sublabel ? 2 : 0 }}>{label}</p>
        {sublabel && <p style={{ fontSize: 11.5, color: '#9ca3af', lineHeight: 1.4 }}>{sublabel}</p>}
      </div>
      {el}
    </div>
  );

  const numInput = (val, set, min, max, step = 1) => (
    <input type="number" value={val} onChange={e => set(+e.target.value)} min={min} max={max} step={step}
      style={{ width: 110, border: '1px solid #d1d5db', borderRadius: 8, padding: '6px 10px', fontSize: 13, fontWeight: 600, textAlign: 'right', color: '#111827', fontFamily: 'inherit', outline: 'none' }} />
  );

  return (
    <div data-section="ai-chat-settings" style={{ background: 'white', borderRadius: 16, padding: 18, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        <svg width="28" height="28" fill="none" stroke="#1990FF" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
        </svg>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Chat AI settings</h2>
      </div>
      <div>
        {fieldRow('AI model', null,
          <select value={model} onChange={e => setModel(e.target.value)}
            style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '6px 10px', fontSize: 13, fontWeight: 600, color: '#111827', background: 'white', cursor: 'pointer', fontFamily: 'inherit', outline: 'none' }}>
            <option value="auto">Auto</option>
            <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
            <option value="claude-3-haiku">Claude 3 Haiku</option>
            <option value="gpt-4o">GPT-4o</option>
          </select>
        )}
        {fieldRow('Max tokens', '5,000 – 100,000 per response', numInput(maxTokens, setMaxTokens, 5000, 100000, 1000))}
        {fieldRow('Max steps', '10 – 500 agent steps per task', numInput(maxSteps, setMaxSteps, 10, 500))}
        {fieldRow('Timeout (s)', null, numInput(timeout, setTimeoutVal, 60, 7200, 60))}
      </div>
      {saved && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#15803d', marginTop: 12 }}>Settings saved successfully.</div>}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <button onClick={save} style={{ background: '#1990FF', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 14, fontWeight: 600, color: 'white', cursor: 'pointer', fontFamily: 'inherit' }}>Save settings</button>
      </div>
    </div>
  );
}

function AccountCard() {
  const items = [
    { label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { label: 'Chat History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Report Issue', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { label: 'Log Out', icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1', danger: true },
  ];
  return (
    <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)', marginBottom: 14 }}>
      <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Player #4821</p>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>BlueStacks account</p>
          </div>
        </div>
      </div>
      {items.map((item, i) => (
        <button key={item.label}
          style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 16px', background: 'none', border: 'none', borderTop: i > 0 ? '1px solid #f8fafc' : 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', fontSize: 13.5, fontWeight: 500, color: item.danger ? '#ef4444' : '#374151', transition: 'background 0.12s' }}
          onMouseEnter={e => e.currentTarget.style.background = item.danger ? '#fef2f2' : '#f8fafc'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}>
          <svg width="17" height="17" fill="none" stroke={item.danger ? '#ef4444' : '#94a3b8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d={item.icon}/></svg>
          {item.label}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" style={{ marginLeft: 'auto' }}><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      ))}
    </div>
  );
}

function SettingsScreen() {
  return (
    <div style={{ paddingTop: 14, paddingBottom: 20 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Settings</h1>
      <AccountCard />
      <BluestacksCard />
      <TelegramCard />
      <AISettingsCard />
    </div>
  );
}
