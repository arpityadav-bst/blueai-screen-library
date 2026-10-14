/* BlueAI: AI Mode settings (Cloud vs Hybrid).
   Ported from the PM's latest Claude Design source ("BlueAI AI Mode Settings v2.html",
   confirmed newer than the base file: adds the Auto/Custom method split, conflict
   detection, and the custom-VLM endpoint form). Cloud = today's default. Hybrid runs a
   local model on the user's own PC to cut token usage, either BlueAI's bundled model
   ("Auto", recommended) or the user's own local VLM endpoint ("Custom").

   V3, Phase 5 (settings.css): the Settings card and row language. The choices are the site's
   selection (12% blue fill, 50% blue edge), pending is the same edge dashed. Status pills carry
   their tone (progress blue, verified green, failed red, paused amber) and nothing else does.
   Hybrid unavailable is disabled with a reason: the card keeps its label at 45% and one muted line
   under the choices says why. Retry and View are links; Download & enable opens the dialog, where
   the commit is the solid ink button. The pieces and the dialog live in ai_mode_parts.jsx. */
(function () {
  const { useState, useRef, useEffect } = React;

  const { StatusChip, OptionCard, InfoBanner, WarnIcon, ErrIcon, CONFLICT, LinkBtn, RetryBtn, HybridModal } = window.AiModeParts;

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
    const applyOff = !customConfigured || applying;

    return (
      <section className="v3-card v3-set-card">
        <h2 className="v3-set-title">AI Mode</h2>
        <p className="v3-set-desc">Choose where AI processing happens.</p>

        <div className="v3-choices">
          <OptionCard title="Cloud" sub="Default. Uses cloud AI." selected={!hybridActive} onClick={onPickCloud} />
          <OptionCard title="Hybrid" sub="Uses your PC and saves tokens." selected={hybridActive} pending={hybridPending} pendingLabel={hybridTag} onClick={onPickHybrid} disabled={!hwSupported} describedBy="ai-mode-hw" />
        </div>

        {!hwSupported &&
          <p id="ai-mode-hw" className="v3-reason"><WarnIcon />This PC doesn't meet the requirements for Hybrid. Cloud mode will be used.</p>}

        {outer === 'hybrid' && hwSupported &&
          <div className="v3-subgroup">
            <p className="v3-subgroup-label">{method === null ? 'Pick method' : 'Hybrid method'}</p>
            <div className="v3-choices" style={{ marginTop: 'var(--v2-space-2)' }}>
              <OptionCard title="Auto" sub="BlueAI runs a local model for you." selected={method === 'auto'} onClick={onPickAuto} badge="Recommended" />
              <OptionCard title="Custom" sub="Connect your own local VLM." selected={method === 'custom'} onClick={onPickCustom} />
            </div>

            {method === null &&
              <p className="v3-reason">You're still on Cloud until you pick a method.</p>}

            {method === 'auto' &&
              <div className="v3-stack">
                {autoInProgress ? (
                  <div className="v3-panel">
                    <div className="v3-prog-head">
                      <span className="v3-prog-label">{status === 'downloading' ? 'Downloading Hybrid AI…' : status === 'installing' ? 'Installing Hybrid AI…' : 'Checking…'}</span>
                      <div className="v3-row-gap">
                        {status === 'downloading' && <span className="v3-prog-pct">{Math.round(pct)}%</span>}
                        <LinkBtn onClick={onOpenModal}>View</LinkBtn>
                      </div>
                    </div>
                    <div className="v3-prog-track">
                      <div className={'v3-prog-fill' + (status === 'downloading' ? '' : ' is-indet')} style={{ width: status === 'downloading' ? pct + '%' : '100%' }} />
                    </div>
                  </div>
                ) : status === 'idle' ? (
                  <>
                    <p className="v3-set-desc" style={{ margin: 0 }}>Additional files of 3 to 4 GB are required to enable Hybrid mode.</p>
                    <button type="button" onClick={onOpenModal} className="v3-btn-ghost v3-btn-sm" style={{ alignSelf: 'flex-start' }}>Download &amp; enable</button>
                  </>
                ) : (
                  <>
                    <div className="v3-set-line">
                      <span className="v3-set-label">Hybrid status</span>
                      <div className="v3-row-gap">
                        {(failed || status === 'blocked') && <LinkBtn onClick={onRetry}>Retry</LinkBtn>}
                        <StatusChip status={status} />
                      </div>
                    </div>
                    {status === 'running' && conflict && <InfoBanner tone="amber" icon={<WarnIcon />}>{CONFLICT}</InfoBanner>}
                    {status === 'running' && !conflict &&
                      <p className="v3-set-desc" style={{ margin: 0 }}>Hybrid mode uses your PC for supported tasks to help reduce token usage.</p>}
                    {status === 'blocked' && <InfoBanner tone="amber" icon={<WarnIcon />}>{CONFLICT}</InfoBanner>}
                    {failed &&
                      <>
                        <InfoBanner tone="red" icon={<ErrIcon />}>{status === 'install_failed' ? "The download didn't finish. Cloud mode is being used." : "Hybrid mode couldn't start. Cloud mode is being used."}</InfoBanner>
                        <RetryBtn onClick={onRetry} />
                      </>}
                  </>
                )}
              </div>}

            {method === 'custom' &&
              <div className="v3-stack">
                <div className="v3-form" style={{ gap: 'var(--v2-space-3)' }}>
                  <div>
                    <label htmlFor="vlm-endpoint" className="v3-label">VLM endpoint</label>
                    <input id="vlm-endpoint" type="text" value={endpoint} onChange={(e) => onEndpoint(e.target.value)} placeholder="http://127.0.0.1:11434/api/chat" className="v3-field" />
                  </div>
                  <div>
                    <label htmlFor="vlm-model" className="v3-label">VLM model</label>
                    <input id="vlm-model" type="text" value={model} onChange={(e) => onModel(e.target.value)} placeholder="qwen3-vl:4b-instruct" className="v3-field" />
                  </div>
                </div>
                <div className="v3-set-line">
                  <button type="button" onClick={onApplyCustom} disabled={applyOff} aria-describedby={!customConfigured ? 'vlm-why' : undefined} className="v3-btn-solid v3-btn-sm">
                    Apply
                  </button>
                  <div className="v3-row-gap">
                    {customConfigured && (failed || status === 'blocked') && <LinkBtn onClick={onRetry}>Retry</LinkBtn>}
                    {customConfigured && <StatusChip status={status} />}
                  </div>
                </div>
                {customConfigured && status === 'running' && !conflict &&
                  <p className="v3-set-desc" style={{ margin: 0 }}>Hybrid mode uses your local VLM for supported tasks to help reduce token usage.</p>}
                {customConfigured && status === 'running' && conflict && <InfoBanner tone="amber" icon={<WarnIcon />}>{CONFLICT}</InfoBanner>}
                {customConfigured && status === 'startup_failed' &&
                  <InfoBanner tone="red" icon={<ErrIcon />}>Couldn't reach that endpoint. Check the URL and model, then try again.</InfoBanner>}
                {customConfigured && status === 'blocked' && <InfoBanner tone="amber" icon={<WarnIcon />}>{CONFLICT}</InfoBanner>}
                {!customConfigured &&
                  <p id="vlm-why" className="v3-reason" style={{ margin: 0 }}>Enter your local VLM endpoint and model name, then Apply.</p>}
              </div>}
          </div>}
      </section>);
  }

  /* ── STATE HOOK: Cloud/Auto/Custom lifecycle. `hwSupported`/`conflict` are lifted to
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
