// BlueAI — Settings › Bring Your Own Key (staged flow, matched to the cloud design screens).
// Lives in Settings for BOTH geos (prime + non-prime). Stages:
//   toggle off → header + description only
//   on, no key → "No API key configured" notice + "Add a provider" dropdown
//   on, provider picked → API key input + hint + Cancel / Validate & Save
//   on, key saved → provider + masked key + Remove + AI Model dropdown
// Saved key state lives in App (shared with the credits screen + out-of-credits popup);
// the in-progress provider/key entry is local. Exposes window.Byok.ByokSettings.
(function () {
  const { useState, useRef, useEffect } = React;
  const ACCENT = '#1990FF';
  const INK = '#111827', MUTED = '#6b7280', FAINT = '#9ca3af';

  const PROVIDERS = {
    'Anthropic':        { models: ['claude-haiku-4-5', 'claude-sonnet-5', 'claude-opus-4-8'], hint: 'Find at https://console.anthropic.com/settings' },
    'Azure OpenAI':     { models: ['gpt-5', 'gpt-4o'],                                          hint: 'Find in your Azure OpenAI resource keys' },
    'Gemini (AI Studio)': { models: ['gemini-3-pro', 'gemini-3-flash'],                         hint: 'Find at https://aistudio.google.com/apikey' },
    'Google Vertex AI': { models: ['gemini-3-pro', 'gemini-3-flash'],                           hint: 'Find in your Google Cloud console' },
    'OpenAI':           { models: ['gpt-5.4', 'gpt-5', 'o4'],                                    hint: 'Find at https://platform.openai.com/api-keys' }
  };
  const PROVIDER_NAMES = Object.keys(PROVIDERS);

  function Toggle({ on, onClick }) {
    return (
      <button onClick={onClick} aria-pressed={on} aria-label="Toggle Bring Your Own Key"
        style={{ width: 46, height: 26, borderRadius: 999, border: 'none', padding: 3, cursor: 'pointer', flexShrink: 0, background: on ? ACCENT : '#cbd5e1', transition: 'background 0.18s ease' }}>
        <span style={{ display: 'block', width: 20, height: 20, borderRadius: '50%', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.25)', transform: on ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.18s ease' }} />
      </button>);
  }

  const selectStyle = { width: '100%', border: '1px solid #d1d5db', borderRadius: 10, padding: '11px 13px', fontSize: 14, fontWeight: 500, color: INK, background: 'white', cursor: 'pointer', fontFamily: 'inherit', outline: 'none', appearance: 'none', WebkitAppearance: 'none' };
  const Chevron = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><polyline points="6 9 12 15 18 9" /></svg>;

  function ByokSettings({ on, setOn, keyAdded, keyInfo, onSave, onRemove, highlight }) {
    const [picked, setPicked] = useState(null);      // provider mid-entry (before save)
    const [keyVal, setKeyVal] = useState('');
    const [savedModel, setSavedModel] = useState((keyInfo && keyInfo.model) || 'claude-haiku-4-5');
    const rootRef = useRef(null);
    const [glow, setGlow] = useState(false);

    // Routed here from the out-of-credits popup / credits screen → scroll into view + pulse.
    useEffect(() => {
      if (!highlight) return;
      const el = rootRef.current;
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setGlow(true);
      const t = setTimeout(() => setGlow(false), 1900);
      return () => clearTimeout(t);
    }, [highlight]);

    const provider = keyAdded ? (keyInfo && keyInfo.provider) : picked;
    const masked = keyInfo && keyInfo.key ? '••••' + String(keyInfo.key).slice(-4) : '••••••';

    const save = () => { onSave({ provider: picked, model: PROVIDERS[picked].models[0], key: keyVal.trim() || ('sk-' + picked.slice(0, 3).toLowerCase() + '-9Xsjhdw1qAAA') }); setSavedModel(PROVIDERS[picked].models[0]); setPicked(null); setKeyVal(''); };
    const cancel = () => { setPicked(null); setKeyVal(''); };

    return (
      <div ref={rootRef} data-section="byok" style={{ background: 'white', borderRadius: 16, padding: 18, marginBottom: 14, border: '1px solid ' + (glow ? 'rgba(25,144,255,0.9)' : 'rgba(0,0,0,0.06)'), boxShadow: glow ? '0 0 0 4px rgba(25,144,255,0.22), 0 6px 20px rgba(25,144,255,0.18)' : '0 1px 3px rgba(0,0,0,0.08)', transition: 'box-shadow 0.3s ease, border-color 0.3s ease' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: INK, marginBottom: 8 }}>Bring Your Own Key</h2>
            <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.55 }}>Use your own API key from OpenAI, Anthropic, or another provider. Usage is billed directly to your provider account, with no BlueAI credits consumed.</p>
          </div>
          <Toggle on={on} onClick={() => { if (on) { setOn(false); onRemove(); setPicked(null); setKeyVal(''); } else { setOn(true); } }} />
        </div>

        {on && keyAdded && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: INK }}>{provider}</p>
                <p style={{ fontSize: 13, color: FAINT, fontFamily: 'ui-monospace, Menlo, monospace', marginTop: 3 }}>{masked}</p>
              </div>
              <button onClick={onRemove} style={{ borderRadius: 10, border: '1px solid #fecaca', background: 'white', padding: '9px 18px', fontSize: 13.5, fontWeight: 700, color: '#dc2626', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.13s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'} onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>Remove</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 16, paddingTop: 16, borderTop: '1px solid #eef2f6' }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: INK }}>AI Model</p>
              <div style={{ position: 'relative', width: 200 }}>
                <select value={savedModel} onChange={(e) => setSavedModel(e.target.value)} style={{ ...selectStyle, paddingRight: 32 }}>
                  {(PROVIDERS[provider] ? PROVIDERS[provider].models : [savedModel]).map((m) => <option key={m} value={m}>{m}</option>)}
                </select><Chevron />
              </div>
            </div>
          </div>
        )}

        {on && !keyAdded && picked && (
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: INK, marginBottom: 10 }}>{picked}</p>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
              <label style={{ fontSize: 12.5, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 7 }}>API Key</label>
              <input value={keyVal} onChange={(e) => setKeyVal(e.target.value)} type="text" spellCheck={false} autoComplete="off" placeholder={PROVIDERS[picked].hint}
                style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 10, padding: '10px 12px', fontSize: 13.5, color: INK, fontFamily: 'ui-monospace, Menlo, monospace', outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => e.currentTarget.style.borderColor = ACCENT} onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'} />
              <p style={{ fontSize: 12, color: FAINT, marginTop: 8 }}>Your key is stored encrypted on this device only.</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14 }}>
                <button onClick={cancel} style={{ borderRadius: 10, border: '1px solid #d8dde7', background: 'white', padding: '9px 18px', fontSize: 13.5, fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f5f7fb'} onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>Cancel</button>
                <button onClick={save} style={{ borderRadius: 10, border: 'none', background: ACCENT, padding: '9px 18px', fontSize: 13.5, fontWeight: 700, color: 'white', cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.13s' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>Validate &amp; Save</button>
              </div>
            </div>
          </div>
        )}

        {on && !keyAdded && !picked && (
          <div style={{ marginTop: 16 }}>
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '11px 13px', marginBottom: 12 }}>
              <p style={{ fontSize: 13, color: '#92722a', lineHeight: 1.5 }}>No API key configured. Add one to get started.</p>
            </div>
            <div style={{ position: 'relative' }}>
              <select value="" onChange={(e) => { if (e.target.value) setPicked(e.target.value); }} style={{ ...selectStyle, paddingRight: 32, color: FAINT }}>
                <option value="" disabled>Add a provider</option>
                {PROVIDER_NAMES.map((p) => <option key={p} value={p} style={{ color: INK }}>{p}</option>)}
              </select><Chevron />
            </div>
          </div>
        )}
      </div>);
  }

  window.Byok = Object.assign(window.Byok || {}, { ByokSettings, BYOK_PROVIDERS: PROVIDERS });
})();
