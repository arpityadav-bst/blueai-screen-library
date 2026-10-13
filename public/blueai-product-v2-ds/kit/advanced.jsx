/* BlueAI Product V2 Design System: the Advanced panels (section 49). Both live inside
   AdvancedDisclosure on Settings and are built from the kit (SettingsSection, Switch, Select,
   TextField, Button, Banner, Badge, RadioCard, ProgressBar), read lazily at render.

   ByokPanel    {on, keyInfo?, providers?, status?, draft?, highlight?, onToggle, onSave, onCancel,
                 onRemove, onModel, className}
       keyInfo {provider, model, last4 | key}: a saved key. status 'idle' | 'validating' |
       'invalid' | 'unreachable' | 'confirm-remove' is set by the caller while onSave({provider,
       key, model}) runs. The switch only turns the key on or off; it never deletes it. Remove asks
       first, says what changes, then calls onRemove(keyInfo); the screen shows the Undo toast.
       draft {provider, key} pre-fills the entry form (specimens, routed entry).
   AiModePanel  {mode, method?, status, hwSupported, conflict, pct, endpoint?, model?, onPick,
                 onMethod, onDownload, onCancel, onRetry, onEndpoint, onModel, onApply, className}
       mode 'cloud' | 'hybrid'; method 'auto' (default, BlueAI's own local model) | 'custom' (the
       partner's local model endpoint). status follows V2's lifecycle (ai_mode.jsx:16-25): idle,
       checking, downloading, installing, running, install_failed, startup_failed, blocked. */
(function () {
  const { useState } = React;
  const cx = function () { return Array.prototype.filter.call(arguments, Boolean).join(' '); };

  // V2's providers, models and hints, as shipped (byok_settings.jsx:14-20).
  const PROVIDERS = {
    'Anthropic': { models: ['claude-haiku-4-5', 'claude-sonnet-5', 'claude-opus-4-8'], hint: 'Find at https://console.anthropic.com/settings' },
    'Azure OpenAI': { models: ['gpt-5', 'gpt-4o'], hint: 'Find in your Azure OpenAI resource keys' },
    'Gemini (AI Studio)': { models: ['gemini-3-pro', 'gemini-3-flash'], hint: 'Find at https://aistudio.google.com/apikey' },
    'Google Vertex AI': { models: ['gemini-3-pro', 'gemini-3-flash'], hint: 'Find in your Google Cloud console' },
    'OpenAI': { models: ['gpt-5.4', 'gpt-5', 'o4'], hint: 'Find at https://platform.openai.com/api-keys' },
  };

  const BYOK = {
    title: 'Bring your own key',
    desc: 'Use your own API key from OpenAI, Anthropic, or another provider. Usage is billed directly to your provider account, with no AI credits used.',
    switchLabel: 'Use my own key',
    switchDesc: 'Turning this off keeps your saved key.',
    none: 'No API key configured. Add one to get started.',
    stored: 'Your key is stored encrypted on this device only.',
    invalid: 'That key didn’t work. Check it and paste it again.',
    unreachable: function (p) { return 'Couldn’t reach ' + p; },
    unreachableBody: 'Your key wasn’t saved.',
    checking: function (p) { return 'Checking your key with ' + p + '…'; },
    onNote: 'No AI credits are used while this is on.',
    offNote: 'Your key is saved but not in use, so AI credits are used.',
    confirm: function (p) { return 'Remove your ' + p + ' key? BlueAI goes back to using your AI credits.'; },
  };

  const AI = {
    title: 'AI mode',
    desc: 'Choose where AI processing happens.',
    cloudSub: 'Default. Uses cloud AI.',
    hybridSub: 'Runs on your PC and uses fewer AI credits.',
    noHw: 'This PC doesn’t meet the requirements for Hybrid. Cloud mode will be used.',
    pending: 'You’re still on Cloud until Hybrid is set up.',
    setupTag: 'Setup needed',
    size: 'Additional files of 3 to 4 GB are required to enable Hybrid mode.',
    download: 'Download and turn on',
    busy: { downloading: 'Downloading Hybrid AI…', installing: 'Installing Hybrid AI…', checking: 'Checking…' },
    still: 'Cloud mode is still available.',
    cancel: 'Cancel download',
    status: 'Hybrid status',
    on: 'Hybrid mode uses your PC for supported tasks, so they use fewer AI credits.',
    onCustom: 'Hybrid mode uses your local model for supported tasks, so they use fewer AI credits.',
    conflict: 'Another local model (e.g. LM Studio) is running. Running multiple local models may reduce performance.',
    install_failed: 'The download didn’t finish. Cloud mode is being used.',
    startup_failed: 'Hybrid mode couldn’t start. Cloud mode is being used.',
    endpoint_failed: 'Couldn’t reach that endpoint. Check the URL and model, then try again.',
    toCustom: 'Use my own local model instead',
    toAuto: 'Use BlueAI’s model instead',
    fields: 'Enter the endpoint and model name first',
  };
  const BADGES = { running: ['success', 'On'], install_failed: ['danger', 'Download failed'], startup_failed: ['danger', 'Couldn’t start'], blocked: ['neutral', 'Paused'] };

  function part(name) {
    const K = window.V2Kit || {};
    return K[name] || function Missing() { return <span className="v2-kit-missing">{name}</span>; };
  }
  function Ic({ name, size }) {
    const K = window.V2Kit || {};
    return K.Icon ? <K.Icon name={name} size={size || 16} /> : null;
  }
  // Kit controls may hand back an event or a value; accept both.
  function val(x) { return x && x.target ? (x.target.type === 'checkbox' ? x.target.checked : x.target.value) : x; }
  function call(fn) { const rest = Array.prototype.slice.call(arguments, 1); if (typeof fn === 'function') fn.apply(null, rest); }
  const opts = function (list) { return list.map(function (v) { return { value: v, label: v }; }); };

  function ByokPanel(props) {
    const { on, keyInfo, status, draft, highlight, className } = props;
    const P = props.providers || PROVIDERS;
    const [picked, setPicked] = useState((draft && draft.provider) || null);
    const [keyVal, setKeyVal] = useState((draft && draft.key) || '');
    const [confirming, setConfirming] = useState(status === 'confirm-remove');
    const Section = part('SettingsSection'), Switch = part('Switch'), Select = part('Select');
    const TextField = part('TextField'), Button = part('Button'), Banner = part('Banner');
    const busy = status === 'validating';

    let body = null;
    if (keyInfo) {
      const last4 = String(keyInfo.last4 || keyInfo.key || '').slice(-4);
      const models = P[keyInfo.provider] ? P[keyInfo.provider].models : [keyInfo.model];
      body = (
        <div className="v2-byok-block">
          <div className="v2-byok-key">
            <div className="v2-byok-key-text">
              <p className="v2-byok-provider">{keyInfo.provider}</p>
              <p className="v2-byok-masked" aria-label={'Key ending ' + last4}>{'•••• ' + last4}</p>
            </div>
            {!confirming ? <Button variant="secondary" size="sm" onClick={function () { setConfirming(true); }}>Remove</Button> : null}
          </div>
          {confirming ? (
            <div className="v2-byok-confirm" role="group" aria-label="Remove key">
              <p className="v2-byok-confirm-text">{BYOK.confirm(keyInfo.provider)}</p>
              <div className="v2-byok-actions">
                <Button variant="secondary" size="sm" onClick={function () { setConfirming(false); }}>Keep key</Button>
                <Button variant="danger" size="sm" onClick={function () { setConfirming(false); call(props.onRemove, keyInfo); }}>Remove key</Button>
              </div>
            </div>
          ) : null}
          <Select label="Model" value={keyInfo.model} options={opts(models)} disabled={!on}
            onChange={function (x) { call(props.onModel, val(x)); }} />
          <p className="v2-byok-note">{on ? BYOK.onNote : BYOK.offNote}</p>
        </div>
      );
    } else if (on && picked) {
      const cancel = function () { setPicked(null); setKeyVal(''); call(props.onCancel); };
      const save = function () { if (keyVal.trim()) call(props.onSave, { provider: picked, key: keyVal.trim(), model: P[picked].models[0] }); };
      body = (
        <div className="v2-byok-block">
          <Select label="Provider" value={picked} options={opts(Object.keys(P))} disabled={busy}
            onChange={function (x) { setPicked(val(x) || null); }} />
          <TextField label="API key" value={keyVal} secret mono readOnly={busy} helper={busy ? BYOK.checking(picked) : P[picked].hint}
            status={busy ? 'validating' : undefined} error={status === 'invalid' ? BYOK.invalid : undefined}
            onChange={function (x) { setKeyVal(val(x) || ''); }} />
          <p className="v2-byok-note v2-byok-note--icon"><Ic name="lock" size={16} />{BYOK.stored}</p>
          {status === 'unreachable' ? <Banner tone="danger" title={BYOK.unreachable(picked)} action={{ label: 'Try again', onClick: save }}>{BYOK.unreachableBody}</Banner> : null}
          <div className="v2-byok-actions">
            <Button variant="secondary" onClick={cancel} disabled={busy}>Cancel</Button>
            <Button variant="primary" onClick={save} loading={busy} disabled={!keyVal.trim()} disabledReason="Paste your key first">
              {busy ? 'Checking key…' : 'Check and save'}
            </Button>
          </div>
        </div>
      );
    } else if (on) {
      body = (
        <div className="v2-byok-block">
          <p className="v2-byok-note">{BYOK.none}</p>
          <Select label="Provider" value="" placeholder="Add a provider" options={opts(Object.keys(P))}
            onChange={function (x) { setPicked(val(x) || null); }} />
        </div>
      );
    }
    return (
      <Section id="byok" title={BYOK.title} description={BYOK.desc} highlight={highlight} className={cx('v2-byok', className)}>
        <Switch checked={!!on} label={BYOK.switchLabel} description={BYOK.switchDesc}
          onChange={function (x) { call(props.onToggle, !!val(x)); }} />
        {body}
      </Section>
    );
  }

  function AiModePanel(props) {
    const { mode, method, hwSupported, conflict, pct, endpoint, model, className } = props;
    const RadioCard = part('RadioCard'), Section = part('SettingsSection'), Button = part('Button');
    const Badge = part('Badge'), Banner = part('Banner'), ProgressBar = part('ProgressBar'), TextField = part('TextField');
    const hw = hwSupported !== false;
    const hybrid = mode === 'hybrid' && hw;
    const st = props.status || 'idle';
    const running = hybrid && st === 'running';
    const custom = method === 'custom';
    const busy = AI.busy[st];
    const failed = st === 'install_failed' || st === 'startup_failed';
    const ready = Boolean((endpoint || '').trim() && (model || '').trim());
    const retry = { label: 'Try again', onClick: props.onRetry };

    let body = null;
    if (hybrid && busy) {
      const n = Math.round(pct || 0);
      body = (
        <div className="v2-aimode-block">
          <ProgressBar value={st === 'downloading' ? n : undefined} max={100} indeterminate={st !== 'downloading'}
            size={6} label={busy} valueText={st === 'downloading' ? n + '%' : undefined} />
          <p className="v2-aimode-meta">{AI.still}</p>
          {st === 'downloading' ? <div className="v2-aimode-row"><Button variant="quiet" size="sm" onClick={props.onCancel}>{AI.cancel}</Button></div> : null}
        </div>
      );
    } else if (hybrid && st === 'idle' && custom) {
      body = (
        <div className="v2-aimode-block">
          <TextField label="Model endpoint" mono value={endpoint || ''} placeholder="http://127.0.0.1:11434/api/chat" onChange={function (x) { call(props.onEndpoint, val(x)); }} />
          <TextField label="Model name" mono value={model || ''} placeholder="qwen3-vl:4b-instruct" onChange={function (x) { call(props.onModel, val(x)); }} />
          <div className="v2-aimode-row"><Button variant="primary" size="sm" onClick={props.onApply} disabled={!ready} disabledReason={AI.fields}>Apply</Button></div>
        </div>
      );
    } else if (hybrid && st === 'idle') {
      body = (
        <div className="v2-aimode-block">
          <p className="v2-aimode-text">{AI.pending}</p>
          <p className="v2-aimode-text v2-aimode-text--strong">{AI.size}</p>
          <div className="v2-aimode-row"><Button variant="primary" size="sm" icon="download" onClick={props.onDownload}>{AI.download}</Button></div>
        </div>
      );
    } else if (hybrid) {
      const b = BADGES[st];
      const failText = st === 'startup_failed' && custom ? AI.endpoint_failed : AI[st];
      body = (
        <div className="v2-aimode-block">
          <div className="v2-aimode-status"><span>{AI.status}</span>{b ? <Badge tone={b[0]} dot>{b[1]}</Badge> : null}</div>
          {st === 'running' && !conflict ? <p className="v2-aimode-text">{custom ? AI.onCustom : AI.on}</p> : null}
          {(st === 'running' && conflict) || st === 'blocked'
            ? <Banner tone="offline" icon="alert" action={st === 'blocked' ? retry : null}>{AI.conflict}</Banner> : null}
          {failed ? <Banner tone="danger" action={retry}>{failText}</Banner> : null}
        </div>
      );
    }
    const canSwitch = hybrid && !running && !busy;
    return (
      <Section id="ai-mode" title={AI.title} description={AI.desc} className={cx('v2-aimode', className)}>
        <RadioCard label={AI.title} name="ai-mode" value={running ? 'hybrid' : 'cloud'} onChange={function (x) { call(props.onPick, val(x)); }}
          options={[
            { value: 'cloud', title: 'Cloud', sub: AI.cloudSub },
            { value: 'hybrid', title: 'Hybrid', sub: AI.hybridSub, disabled: !hw, disabledReason: AI.noHw, pending: hybrid && !running ? (st === 'idle' ? AI.setupTag : true) : false },
          ]} />
        {body || canSwitch ? (
          <div className="v2-aimode-body">
            {body}
            {canSwitch ? (
              <button type="button" className="v2-aimode-switch" onClick={function () { call(props.onMethod, custom ? 'auto' : 'custom'); }}>
                {custom ? AI.toAuto : AI.toCustom}
              </button>
            ) : null}
          </div>
        ) : null}
      </Section>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { ByokPanel, AiModePanel, BYOK_PROVIDERS: PROVIDERS });
})();
