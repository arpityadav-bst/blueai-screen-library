/* BlueAI — AI Mode settings (Cloud vs Hybrid).
   Ported from the PM's latest Claude Design source ("BlueAI AI Mode Settings v2.html" —
   confirmed newer than the base file: adds the Auto/Custom method split, conflict
   detection, and the custom-VLM endpoint form). Cloud = today's default. Hybrid runs a
   local model on the user's own PC to cut token usage — either BlueAI's bundled model
   ("Auto", recommended) or the user's own local VLM endpoint ("Custom"). */
(function () {
  const { useState, useRef, useEffect } = React;

  const ACCENT = '#1990FF';
  const INK = '#111827';
  const MUTED = '#6b7280';
  const FAINT = '#9aa0b4';

  /* ── status chip (mirrors the real local-model lifecycle) ── */
  const STATUS = {
    idle:           { label: 'Off',             tone: 'gray',  busy: false },
    checking:       { label: 'Checking…',       tone: 'blue',  busy: true },
    downloading:    { label: 'Downloading…',    tone: 'blue',  busy: true },
    installing:     { label: 'Installing…',     tone: 'blue',  busy: true },
    running:        { label: 'On',              tone: 'green', busy: false },
    install_failed: { label: 'Download failed', tone: 'red',   busy: false },
    startup_failed: { label: "Couldn't start",  tone: 'red',   busy: false },
    blocked:        { label: 'Paused',          tone: 'amber', busy: false },
  };
  const TONES = {
    gray:  { bg: '#f1f3f7', fg: '#5b6172', dot: '#9aa0b4' },
    blue:  { bg: '#eaf3ff', fg: '#1763c6', dot: ACCENT },
    green: { bg: '#eafaf0', fg: '#157a44', dot: '#16a34a' },
    red:   { bg: '#fdecec', fg: '#c0392b', dot: '#e05a4f' },
    amber: { bg: '#fef6e7', fg: '#946612', dot: '#e0a52e' },
  };

  function StatusChip({ status }) {
    const cfg = STATUS[status] || STATUS.idle;
    const tone = TONES[cfg.tone];
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 999, padding: '4px 10px', fontSize: 12, fontWeight: 600, background: tone.bg, color: tone.fg }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: tone.dot, animation: cfg.busy ? 'ba-pulse 1.1s ease-in-out infinite' : 'none' }} />
        {cfg.label}
      </span>);
  }

  /* ── shared option card (Cloud/Hybrid, then Auto/Custom) ── */
  function OptionCard({ title, sub, selected, pending, pendingLabel, onClick, disabled, badge }) {
    return (
      <button onClick={disabled ? undefined : onClick} disabled={disabled}
        title={disabled ? "This PC doesn't meet the requirements for Hybrid." : undefined}
        style={{
          flex: 1, textAlign: 'left', cursor: disabled ? 'not-allowed' : 'pointer', borderRadius: 12, padding: '12px 13px', fontFamily: 'inherit',
          background: selected ? '#eef6ff' : 'white',
          border: selected ? `1.5px solid ${ACCENT}` : pending ? `1.5px dashed ${ACCENT}` : '1.5px solid #e3e7ee',
          opacity: disabled ? 0.5 : 1, transition: 'background 0.15s, border-color 0.15s', minWidth: 0,
        }}
        onMouseEnter={(e) => { if (!selected && !pending && !disabled) e.currentTarget.style.borderColor = '#c3cad6'; }}
        onMouseLeave={(e) => { if (!selected && !pending && !disabled) e.currentTarget.style.borderColor = '#e3e7ee'; }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: INK }}>{title}</span>
          {selected &&
            <svg width="15" height="15" viewBox="0 0 24 24" fill={ACCENT} style={{ flexShrink: 0 }}><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.1 14.2-3.6-3.6 1.4-1.4 2.2 2.2 4.9-4.9 1.4 1.4-6.3 6.3z" /></svg>}
          {pending && pendingLabel &&
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.02em', color: TONES.amber.fg, background: TONES.amber.bg, borderRadius: 5, padding: '2px 7px', lineHeight: 1.4, whiteSpace: 'nowrap' }}>{pendingLabel}</span>}
          {badge && !selected && !pending &&
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.02em', color: '#157a44', background: '#eafaf0', borderRadius: 5, padding: '1px 6px', lineHeight: 1.4 }}>{badge}</span>}
        </div>
        <p style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.4 }}>{sub}</p>
      </button>);
  }

  /* ── small UI bits ── */
  function InfoBanner({ tone, icon, children }) {
    const T = TONES[tone];
    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', background: T.bg, color: T.fg, borderRadius: 10, padding: '10px 12px', fontSize: 12.5, lineHeight: 1.45 }}>
        <span style={{ flexShrink: 0, marginTop: 1, display: 'flex' }}>{icon}</span>
        <span>{children}</span>
      </div>);
  }
  const WarnIcon = (c) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
  const ErrIcon = (c) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;

  function RetryBtn({ onClick }) {
    return (
      <button onClick={onClick} style={{ alignSelf: 'flex-start', borderRadius: 9, border: 'none', background: ACCENT, padding: '8px 16px', fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer', fontFamily: 'inherit' }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
        Try again
      </button>);
  }

  /* ── AI MODE CARD ── */
  function AIModeCard(props) {
    const { outer, method, status, hwSupported, conflict, pct, endpoint, model,
      onPickCloud, onPickHybrid, onPickAuto, onPickCustom, onEndpoint, onModel, onApplyCustom, onRetry, onOpenModal, applying } = props;

    const failed = status === 'install_failed' || status === 'startup_failed';
    const autoInProgress = status === 'downloading' || status === 'installing' || status === 'checking';
    const customConfigured = Boolean(endpoint.trim() && model.trim());
    const hybridActive = outer === 'hybrid' && status === 'running';
    const hybridPending = outer === 'hybrid' && status !== 'running';
    const hybridTag = !hybridPending ? null : method === null ? 'Pick method' : status === 'idle' ? 'Setup needed' : null;

    return (
      <div style={{ background: 'white', borderRadius: 16, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)', marginBottom: 14 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: INK, marginBottom: 3 }}>AI Mode</h2>
        <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.5, marginBottom: 14 }}>Choose where AI processing happens.</p>

        <div style={{ display: 'flex', gap: 10 }}>
          <OptionCard title="Cloud" sub="Default. Uses cloud AI." selected={!hybridActive} onClick={onPickCloud} />
          <OptionCard title="Hybrid" sub="Uses your PC and saves tokens." selected={hybridActive} pending={hybridPending} pendingLabel={hybridTag} onClick={onPickHybrid} disabled={!hwSupported} />
        </div>

        {!hwSupported &&
          <div style={{ marginTop: 12 }}>
            <InfoBanner tone="amber" icon={WarnIcon(TONES.amber.fg)}>This PC doesn't meet the requirements for Hybrid. Cloud mode will be used.</InfoBanner>
          </div>}

        {outer === 'hybrid' && hwSupported &&
          <div style={{ marginTop: 14, borderTop: '1px solid #eef2f6', paddingTop: 14 }}>
            <p style={{ fontSize: 12.5, fontWeight: 700, color: method === null ? ACCENT : '#4a4f63', marginBottom: 9 }}>{method === null ? 'Pick method' : 'Hybrid method'}</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <OptionCard title="Auto" sub="BlueAI runs a local model for you." selected={method === 'auto'} onClick={onPickAuto} badge="Recommended" />
              <OptionCard title="Custom" sub="Connect your own local VLM." selected={method === 'custom'} onClick={onPickCustom} />
            </div>

            {method === null &&
              <p style={{ fontSize: 12.5, color: FAINT, lineHeight: 1.5, marginTop: 11 }}>You're still on Cloud until you pick a method.</p>}

            {method === 'auto' &&
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {autoInProgress ? (
                  <div style={{ background: '#f0f7ff', border: '1px solid #d6e6fb', borderRadius: 10, padding: '11px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: INK }}>{status === 'downloading' ? 'Downloading Hybrid AI…' : status === 'installing' ? 'Installing Hybrid AI…' : 'Checking…'}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {status === 'downloading' && <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT, fontVariantNumeric: 'tabular-nums' }}>{Math.round(pct)}%</span>}
                        <button onClick={onOpenModal} style={{ fontSize: 12, fontWeight: 700, color: ACCENT, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>View</button>
                      </div>
                    </div>
                    <div style={{ height: 6, borderRadius: 999, background: '#dceafd', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 999, background: ACCENT, width: status === 'downloading' ? pct + '%' : '100%', opacity: status === 'downloading' ? 1 : 0.6, transition: 'width 0.25s linear', animation: status === 'downloading' ? 'none' : 'ba-pulse 1.1s ease-in-out infinite' }} />
                    </div>
                  </div>
                ) : status === 'idle' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                    <p style={{ fontSize: 12.5, color: '#3a4256', lineHeight: 1.5 }}>Additional files of 3 to 4 GB are required to enable Hybrid mode.</p>
                    <button onClick={onOpenModal} style={{ alignSelf: 'flex-start', borderRadius: 9, border: 'none', background: ACCENT, padding: '9px 16px', fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer', fontFamily: 'inherit' }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                      Download &amp; enable
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#4a4f63' }}>Hybrid status</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {(failed || status === 'blocked') && <button onClick={onRetry} style={{ fontSize: 12.5, fontWeight: 600, color: ACCENT, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>Retry</button>}
                        <StatusChip status={status} />
                      </div>
                    </div>
                    {status === 'running' && conflict &&
                      <InfoBanner tone="amber" icon={WarnIcon(TONES.amber.fg)}>Another local model (e.g. LM Studio) is running. Running multiple local models may reduce performance.</InfoBanner>}
                    {status === 'running' && !conflict &&
                      <p style={{ fontSize: 12.5, color: '#3a4256', lineHeight: 1.5 }}>Hybrid mode uses your PC for supported tasks to help reduce token usage.</p>}
                    {status === 'blocked' &&
                      <InfoBanner tone="amber" icon={WarnIcon(TONES.amber.fg)}>Another local model (e.g. LM Studio) is running. Running multiple local models may reduce performance.</InfoBanner>}
                    {failed &&
                      <>
                        <InfoBanner tone="red" icon={ErrIcon(TONES.red.fg)}>{status === 'install_failed' ? "The download didn't finish. Cloud mode is being used." : "Hybrid mode couldn't start. Cloud mode is being used."}</InfoBanner>
                        <RetryBtn onClick={onRetry} />
                      </>}
                  </>
                )}
              </div>}

            {method === 'custom' &&
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 11 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: '#4a4f63' }}>VLM endpoint</label>
                  <input type="text" value={endpoint} onChange={(e) => onEndpoint(e.target.value)} placeholder="http://127.0.0.1:11434/api/chat"
                    style={{ border: '1px solid #e3e7ee', borderRadius: 8, padding: '9px 11px', fontSize: 13, color: INK, outline: 'none', fontFamily: 'inherit' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = ACCENT} onBlur={(e) => e.currentTarget.style.borderColor = '#e3e7ee'} />
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: '#4a4f63', marginTop: 2 }}>VLM model</label>
                  <input type="text" value={model} onChange={(e) => onModel(e.target.value)} placeholder="qwen3-vl:4b-instruct"
                    style={{ border: '1px solid #e3e7ee', borderRadius: 8, padding: '9px 11px', fontSize: 13, color: INK, outline: 'none', fontFamily: 'inherit' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = ACCENT} onBlur={(e) => e.currentTarget.style.borderColor = '#e3e7ee'} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <button onClick={onApplyCustom} disabled={!customConfigured || applying}
                    style={{ borderRadius: 8, border: 'none', background: ACCENT, padding: '8px 18px', fontSize: 13, fontWeight: 700, color: 'white', cursor: (!customConfigured || applying) ? 'not-allowed' : 'pointer', opacity: (!customConfigured || applying) ? 0.45 : 1, transition: 'opacity .15s', fontFamily: 'inherit' }}
                    onMouseEnter={(e) => { if (customConfigured && !applying) e.currentTarget.style.opacity = '0.9'; }}
                    onMouseLeave={(e) => { if (customConfigured && !applying) e.currentTarget.style.opacity = '1'; }}>
                    Apply
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {customConfigured && (failed || status === 'blocked') && <button onClick={onRetry} style={{ fontSize: 12.5, fontWeight: 600, color: ACCENT, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>Retry</button>}
                    {customConfigured && <StatusChip status={status} />}
                  </div>
                </div>
                {customConfigured && status === 'running' && !conflict &&
                  <p style={{ fontSize: 12.5, color: '#3a4256', lineHeight: 1.5 }}>Hybrid mode uses your local VLM for supported tasks to help reduce token usage.</p>}
                {customConfigured && status === 'running' && conflict &&
                  <InfoBanner tone="amber" icon={WarnIcon(TONES.amber.fg)}>Another local model (e.g. LM Studio) is running. Running multiple local models may reduce performance.</InfoBanner>}
                {customConfigured && status === 'startup_failed' &&
                  <InfoBanner tone="red" icon={ErrIcon(TONES.red.fg)}>Couldn't reach that endpoint. Check the URL and model, then try again.</InfoBanner>}
                {customConfigured && status === 'blocked' &&
                  <InfoBanner tone="amber" icon={WarnIcon(TONES.amber.fg)}>Another local model (e.g. LM Studio) is running. Running multiple local models may reduce performance.</InfoBanner>}
                {!customConfigured &&
                  <p style={{ fontSize: 12, color: FAINT, lineHeight: 1.5 }}>Enter your local VLM endpoint and model name, then Apply.</p>}
              </div>}
          </div>}
      </div>);
  }

  /* ── HYBRID (AUTO) SETUP MODAL — reuses the shared ModalOverlay chrome ── */
  function HybridModal(props) {
    const { status, pct, hwSupported, onCancelModal, onConfirmModal, onDoneModal, onHideModal } = props;
    const inProgress = status === 'downloading' || status === 'installing' || status === 'checking';
    const failed = status === 'install_failed' || status === 'startup_failed';
    const running = status === 'running';
    const title = running ? 'Hybrid AI is ready' : inProgress ? 'Setting up Hybrid AI' : 'Set up Hybrid — Auto';
    const headerClose = inProgress ? onHideModal : running ? onDoneModal : onCancelModal;

    const btn = (label, onClick, primary, disabled) => (
      <button key={label} onClick={onClick} disabled={disabled}
        style={{ borderRadius: 10, border: primary ? 'none' : '1px solid #d8dde7', background: primary ? ACCENT : 'white', padding: '10px 18px', fontSize: 13.5, fontWeight: primary ? 700 : 600, color: primary ? 'white' : '#374151', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, whiteSpace: 'nowrap', fontFamily: 'inherit' }}
        onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.opacity = '0.9'; }}
        onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.opacity = primary ? '1' : '1'; }}>
        {label}
      </button>);

    return (
      <window.ModalOverlay isOpen={true} onClose={headerClose} title={title}>
        {running ? (
          <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
            <span style={{ width: 34, height: 34, borderRadius: '50%', background: TONES.green.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={TONES.green.dot} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </span>
            <p style={{ fontSize: 13.5, color: '#454a5e', lineHeight: 1.55, marginTop: 2 }}>Hybrid is on. BlueAI now uses your PC for supported tasks to help save tokens.</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13.5, color: '#454a5e', lineHeight: 1.55 }}>
              {inProgress ? (status === 'installing' ? 'Installing on your PC. Cloud mode is still available.' : 'Downloading required files. Cloud mode is still available.')
                : 'BlueAI runs a local model on your PC for you, saving tokens on supported tasks.'}
            </p>
            {!inProgress && !failed &&
              <p style={{ fontSize: 13.5, color: INK, fontWeight: 700, lineHeight: 1.55, marginTop: 10 }}>Additional files of 3 to 4 GB are required to enable Hybrid mode.</p>}

            {inProgress ? (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: INK }}>{status === 'downloading' ? 'Downloading…' : status === 'installing' ? 'Installing…' : 'Checking…'}</span>
                  {status === 'downloading' && <span style={{ fontSize: 13, fontWeight: 700, color: ACCENT, fontVariantNumeric: 'tabular-nums' }}>{Math.round(pct)}%</span>}
                </div>
                <div style={{ height: 8, borderRadius: 999, background: '#e7ebf2', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 999, width: status === 'downloading' ? pct + '%' : '100%', transition: 'width 0.25s linear', opacity: status === 'downloading' ? 1 : 0.6, background: ACCENT }} />
                </div>
              </div>
            ) : failed ? (
              <div style={{ marginTop: 14 }}>
                <InfoBanner tone="red" icon={ErrIcon(TONES.red.fg)}>{status === 'install_failed' ? 'Something went wrong during setup. Please try again.' : "Hybrid mode couldn't start. Please try again."}</InfoBanner>
              </div>
            ) : null}
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
          {running
            ? btn('Done', onDoneModal, true)
            : inProgress
              ? [btn(status === 'downloading' ? 'Cancel download' : 'Cancel', onCancelModal, false), btn('Continue in background', onHideModal, true)]
              : failed
                ? [btn('Cancel', onCancelModal, false), btn('Try again', onConfirmModal, true)]
                : [btn('Cancel', onCancelModal, false), btn('Download & enable', onConfirmModal, true, !hwSupported)]}
        </div>
      </window.ModalOverlay>);
  }

  /* ── STATE HOOK — Cloud/Auto/Custom lifecycle. `hwSupported`/`conflict` are lifted to
     the dev Preview panel (like the rest of the app's non-organic states); everything
     else is reachable by clicking through the real flow. ── */
  function useAiMode({ hwSupported = true, conflict = false } = {}) {
    const [outer, setOuter] = useState('cloud');
    const [method, setMethod] = useState(null);
    const [status, setStatus] = useState('idle');
    const [modalOpen, setModalOpen] = useState(false);
    const [pct, setPct] = useState(0);
    const [applying, setApplying] = useState(false);
    const [endpoint, setEndpoint] = useState('');
    const [model, setModel] = useState('');

    const timer = useRef(null);
    const steps = useRef([]);
    const clearAll = () => { clearInterval(timer.current); steps.current.forEach(clearTimeout); steps.current = []; };
    useEffect(() => () => clearAll(), []);

    const runInstall = () => {
      clearAll();
      setStatus('downloading'); setPct(0);
      timer.current = setInterval(() => {
        setPct((p) => {
          const next = p + (p < 70 ? 3.4 : 1.8);
          if (next >= 100) {
            clearInterval(timer.current);
            steps.current.push(setTimeout(() => setStatus('installing'), 500));
            steps.current.push(setTimeout(() => setStatus('running'), 2400));
            return 100;
          }
          return next;
        });
      }, 120);
    };

    const pickCloud = () => { clearAll(); setOuter('cloud'); setMethod(null); setStatus('idle'); setModalOpen(false); setPct(0); };
    const pickHybrid = () => { if (!hwSupported) return; setOuter('hybrid'); };
    const pickAuto = () => {
      setMethod('auto');
      if (status === 'running' || status === 'downloading' || status === 'installing') { setModalOpen(false); return; }
      setStatus('idle'); setPct(0); setModalOpen(true);
    };
    const pickCustom = () => {
      clearAll(); setModalOpen(false); setMethod('custom');
      setStatus((s) => (endpoint.trim() && model.trim() && s === 'running') ? 'running' : 'idle');
    };
    const confirmInstall = () => runInstall();
    const cancelInstall = () => { clearAll(); setModalOpen(false); setPct(0); if (status !== 'running') { setMethod(null); setStatus('idle'); } };
    const hideModal = () => setModalOpen(false);
    const doneModal = () => setModalOpen(false);
    const openModal = () => setModalOpen(true);

    const applyCustom = () => {
      if (!endpoint.trim() || !model.trim()) return;
      clearAll(); setApplying(true); setStatus('checking');
      steps.current.push(setTimeout(() => { setStatus('running'); setApplying(false); }, 1400));
    };
    const retry = () => { if (method === 'custom') applyCustom(); else runInstall(); };

    return {
      outer, method, status, hwSupported, conflict, pct, endpoint, model, applying, modalOpen,
      onPickCloud: pickCloud, onPickHybrid: pickHybrid, onPickAuto: pickAuto, onPickCustom: pickCustom,
      onEndpoint: setEndpoint, onModel: setModel, onApplyCustom: applyCustom, onRetry: retry, onOpenModal: openModal,
      onCancelModal: cancelInstall, onConfirmModal: confirmInstall, onDoneModal: doneModal, onHideModal: hideModal,
    };
  }

  window.AiMode = { AIModeCard, HybridModal, useAiMode };
})();
