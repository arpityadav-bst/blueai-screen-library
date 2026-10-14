// BlueAI: Settings › Bring Your Own Key (staged flow, matched to the cloud design screens).
// Lives in Settings for BOTH geos (prime + non-prime). Stages:
//   toggle off → header + description only
//   on, no key → "No API key configured" notice + "Add a provider" dropdown
//   on, provider picked → API key input + hint + Cancel / Validate & Save
//   on, key saved → provider + masked key + Remove + AI Model dropdown
// Saved key state lives in App (shared with the credits screen + out-of-credits popup);
// the in-progress provider/key entry is local. Exposes window.Byok.ByokSettings.
//
// V3, Phase 5: the Settings card and row language (settings.css), on kit parts since review round 1:
// the product's one switch (shared.jsx Toggle, the kit's .v2-switch), the kit select and field, a
// neutral kit banner for the empty state, the danger Remove (red only on hover), and the primary
// Validate & Save. Routed here from the credits screen, the card takes a passing selection ring.
(function () {
  const { useState, useRef, useEffect } = React;

  const PROVIDERS = {
    'Anthropic':        { models: ['claude-haiku-4-5', 'claude-sonnet-5', 'claude-opus-4-8'], hint: 'Find at https://console.anthropic.com/settings' },
    'Azure OpenAI':     { models: ['gpt-5', 'gpt-4o'],                                          hint: 'Find in your Azure OpenAI resource keys' },
    'Gemini (AI Studio)': { models: ['gemini-3-pro', 'gemini-3-flash'],                         hint: 'Find at https://aistudio.google.com/apikey' },
    'Google Vertex AI': { models: ['gemini-3-pro', 'gemini-3-flash'],                           hint: 'Find in your Google Cloud console' },
    'OpenAI':           { models: ['gpt-5.4', 'gpt-5', 'o4'],                                    hint: 'Find at https://platform.openai.com/api-keys' }
  };
  const PROVIDER_NAMES = Object.keys(PROVIDERS);

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
      <section ref={rootRef} data-section="byok" className={'v2-card v3-set-card' + (glow ? ' is-highlight' : '')}>
        <div className="v3-set-head">
          <div className="v3-set-head-main">
            <h2 className="v2-text-title v3-set-title">Bring Your Own Key</h2>
            <p className="v2-text-body-sm v3-set-desc">Use your own API key from OpenAI, Anthropic, or another provider. Usage is billed directly to your provider account, with no BlueAI credits consumed.</p>
          </div>
          <Toggle enabled={on} label="Toggle Bring Your Own Key" onToggle={() => { if (on) { setOn(false); onRemove(); setPicked(null); setKeyVal(''); } else { setOn(true); } }} />
        </div>

        {on && keyAdded && (
          <div className="v3-set-rows">
            <div className="v3-set-row">
              <div className="v3-set-line">
                <div style={{ minWidth: 0 }}>
                  <p className="v3-set-label">{provider}</p>
                  <p className="v2-text-meta v3-set-hint v3-mono">{masked}</p>
                </div>
                <button type="button" onClick={onRemove} className="v2-button v2-button--danger">Remove</button>
              </div>
            </div>
            <div className="v3-set-row">
              <div className="v3-set-line">
                <p className="v3-set-label">AI Model</p>
                <SelectField aria-label="AI Model" className="v3-field--md" value={savedModel} onChange={(e) => setSavedModel(e.target.value)}>
                  {(PROVIDERS[provider] ? PROVIDERS[provider].models : [savedModel]).map((m) => <option key={m} value={m}>{m}</option>)}
                </SelectField>
              </div>
            </div>
          </div>
        )}

        {on && !keyAdded && picked && (
          <div style={{ marginTop: 'var(--v2-space-4)' }}>
            <p className="v3-set-label" style={{ marginBottom: 'var(--v2-space-2)' }}>{picked}</p>
            <div className="v2-card v2-card--inset">
              <Field id="byok-key" label="API Key" className="v2-field--mono">
                <input id="byok-key" value={keyVal} onChange={(e) => setKeyVal(e.target.value)} type="text" spellCheck={false} autoComplete="off" placeholder={PROVIDERS[picked].hint}
                  className="v2-field-input" />
              </Field>
              <p className="v2-text-meta v3-set-hint">Your key is stored encrypted on this device only.</p>
              <div className="v3-set-actions">
                <button type="button" onClick={cancel} className="v2-button v2-button--secondary">Cancel</button>
                <button type="button" onClick={save} className="v2-button v2-button--primary">Validate &amp; Save</button>
              </div>
            </div>
          </div>
        )}

        {on && !keyAdded && !picked && (
          <div style={{ marginTop: 'var(--v2-space-4)' }}>
            <div className="v2-banner v3-set-notice">
              <span className="v2-banner-icon"><svg className="v2-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg></span>
              <span className="v2-banner-text">No API key configured. Add one to get started.</span>
            </div>
            <SelectField aria-label="Add a provider" value="" empty onChange={(e) => { if (e.target.value) setPicked(e.target.value); }}>
              <option value="" disabled>Add a provider</option>
              {PROVIDER_NAMES.map((p) => <option key={p} value={p}>{p}</option>)}
            </SelectField>
          </div>
        )}
      </section>);
  }

  window.Byok = Object.assign(window.Byok || {}, { ByokSettings, BYOK_PROVIDERS: PROVIDERS });
})();
