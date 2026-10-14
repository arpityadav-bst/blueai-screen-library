// BlueAI: Settings › Bring Your Own Key (staged flow, matched to the cloud design screens).
// Lives in Settings for BOTH geos (prime + non-prime). Stages:
//   toggle off → header + description only
//   on, no key → "No API key configured" notice + "Add a provider" dropdown
//   on, provider picked → API key input + hint + Cancel / Validate & Save
//   on, key saved → provider + masked key + Remove + AI Model dropdown
//   off, key saved → paused: provider + masked key + Remove, and a note that credits are in use
// Review round 1 (U12, the kit's ByokPanel, design-md 49 and 52): the switch only pauses the key,
// it never deletes it; Remove asks first, inline ("Remove your Anthropic key? ...", Keep key /
// Remove key, the commit the kit's destructive button named for what is lost: review round 2).
// Saved key state lives in App (shared with the credits screen + out-of-credits popup);
// the in-progress provider/key entry is local. Exposes window.Byok.ByokSettings.
//
// V3, Phase 5, on kit parts since review rounds 1 and 2: the kit's SettingsSection (its head carries
// the switch as its action; routed here from the credits screen it takes the kit's passing
// selection ring, is-highlighted) and ListRow (the key, the model), the product's one switch
// (shared.jsx Toggle, the kit's .v2-switch), the kit select (bare where its placeholder is its only
// name) and field with its helper, a neutral kit banner for the empty state, the danger Remove
// (red only on hover), and the primary Validate and save.
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
    const [confirmRemove, setConfirmRemove] = useState(false);
    // Remove and its confirm swap in place, so focus follows to the first button now showing (Keep
    // key, or Remove again): the kit's in-place swap (V2Kit.useSwapFocus, design-md 09).
    window.V2Kit.useSwapFocus(() => rootRef.current && rootRef.current.querySelector('[data-key-swap] button'), confirmRemove);

    // Routed here from the out-of-credits popup / credits screen → scroll into view + pulse.
    useEffect(() => {
      if (!highlight) return;
      const el = rootRef.current;
      if (el) el.scrollIntoView({ behavior: window.V2Kit.reducedMotion() ? 'auto' : 'smooth', block: 'center' });
      setGlow(true);
      const t = setTimeout(() => setGlow(false), 1900);
      return () => clearTimeout(t);
    }, [highlight]);

    const provider = keyAdded ? (keyInfo && keyInfo.provider) : picked;
    const masked = keyInfo && keyInfo.key ? '••••' + String(keyInfo.key).slice(-4) : '••••••';

    // The model row, the kit's ListRow with the select as its control.
    const fieldModel = () => (
      <div className="v2-row v2-row--divider">
        <span className="v2-row-text"><span className="v2-row-label">AI model</span></span>
        <span className="v2-row-trail">
          <SelectField aria-label="AI model" className="v3-field--md" value={savedModel} onChange={(e) => setSavedModel(e.target.value)}>
            {(PROVIDERS[provider] ? PROVIDERS[provider].models : [savedModel]).map((m) => <option key={m} value={m}>{m}</option>)}
          </SelectField>
        </span>
      </div>);
    const save = () => { onSave({ provider: picked, model: PROVIDERS[picked].models[0], key: keyVal.trim() || ('sk-' + picked.slice(0, 3).toLowerCase() + '-9Xsjhdw1qAAA') }); setSavedModel(PROVIDERS[picked].models[0]); setPicked(null); setKeyVal(''); };
    const cancel = () => { setPicked(null); setKeyVal(''); };

    return (
      <section ref={rootRef} data-section="byok" className={'v2-settings-section' + (glow ? ' is-highlighted' : '')}>
        <header className="v2-settings-section-head">
          <div className="v2-settings-section-text">
            <h2 className="v2-settings-section-title v2-text-title">Bring your own key</h2>
            <p className="v2-settings-section-desc v2-text-body-sm">Use your own API key from OpenAI, Anthropic, or another provider. Usage is billed directly to your provider account, with no BlueAI credits consumed.</p>
          </div>
          <div className="v2-settings-section-action">
            <Toggle enabled={on} label="Toggle Bring your own key" onToggle={() => { if (on) { setOn(false); setPicked(null); setKeyVal(''); } else { setOn(true); } }} />
          </div>
        </header>

        {keyAdded && (
          <div className="v2-settings-section-body">
            {/* While the confirm is open the key row drops its hairline: the inset confirm reads as its own. */}
            <div className={'v2-row' + (confirmRemove ? '' : ' v2-row--divider')}>
              <span className="v2-row-text">
                <span className="v2-row-label">{provider}</span>
                <span className="v2-row-desc v2-text-body-sm v3-mono">{masked}</span>
                {!on && !confirmRemove && <span className="v2-row-desc v2-text-body-sm">Your key is saved but not in use, so AI credits are used.</span>}
              </span>
              {!confirmRemove && <span className="v2-row-trail" data-key-swap=""><button type="button" onClick={() => setConfirmRemove(true)} className="v2-button v2-button--danger">Remove</button></span>}
            </div>
            {confirmRemove &&
              <div className="v2-card v2-card--inset v3-set-confirm" role="group" aria-labelledby="byok-remove-q" data-key-swap="">
                <p id="byok-remove-q" className="v2-text-body-sm">Remove your {provider} key? BlueAI goes back to using your AI credits.</p>
                <div className="v3-set-actions">
                  <button type="button" onClick={() => setConfirmRemove(false)} className="v2-button v2-button--secondary">Keep key</button>
                  <button type="button" onClick={() => { setConfirmRemove(false); onRemove(); }} className="v2-button v2-button--destructive">Remove key</button>
                </div>
              </div>}
            {on && fieldModel()}
          </div>
        )}

        {on && !keyAdded && picked && (
          <div>
            <p className="v3-set-label" style={{ marginBottom: 'var(--v2-space-2)' }}>{picked}</p>
            <div className="v2-card v2-card--inset"><div className="v2-stack">
              <Field id="byok-key" label="API key" helper="Your key is stored encrypted on this device only." className="v2-field--mono">
                <input id="byok-key" value={keyVal} onChange={(e) => setKeyVal(e.target.value)} type="text" spellCheck={false} autoComplete="off" placeholder={PROVIDERS[picked].hint}
                  className="v2-field-input" />
              </Field>
              <div className="v3-set-actions">
                <button type="button" onClick={cancel} className="v2-button v2-button--secondary">Cancel</button>
                <button type="button" onClick={save} className="v2-button v2-button--primary">Validate and save</button>
              </div>
            </div></div>
          </div>
        )}

        {on && !keyAdded && !picked && (
          <div>
            <div className="v2-banner v3-set-notice">
              <span className="v2-banner-icon"><window.V2Kit.Icon name="info" /></span>
              <span className="v2-banner-text">No API key configured. Add one to get started.</span>
            </div>
            <SelectField aria-label="Add a provider" className="v2-field--bare" value="" empty onChange={(e) => { if (e.target.value) setPicked(e.target.value); }}>
              <option value="" disabled>Add a provider</option>
              {PROVIDER_NAMES.map((p) => <option key={p} value={p}>{p}</option>)}
            </SelectField>
          </div>
        )}
      </section>);
  }

  window.Byok = Object.assign(window.Byok || {}, { ByokSettings, BYOK_PROVIDERS: PROVIDERS });
})();
