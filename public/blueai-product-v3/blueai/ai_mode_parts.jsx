/* BlueAI: AI Mode's pieces (V3, Phase 5), split out of ai_mode.jsx for the 300-line rule: the
   status pill, the choice card, the tone notices, the inline link and retry button, and the Hybrid
   (Auto) setup dialog. Styles in settings.css. Must load before ai_mode.jsx.
   Exposes window.AiModeParts. */
(function () {
  /* ── status pill (mirrors the real local-model lifecycle) ── */
  const STATUS = {
    idle:           { label: 'Off',             tone: '' },
    checking:       { label: 'Checking…',       tone: 'busy' },
    downloading:    { label: 'Downloading…',    tone: 'busy' },
    installing:     { label: 'Installing…',     tone: 'busy' },
    running:        { label: 'On',              tone: 'ok' },
    install_failed: { label: 'Download failed', tone: 'danger' },
    startup_failed: { label: "Couldn't start",  tone: 'danger' },
    blocked:        { label: 'Paused',          tone: 'attn' },
  };

  function StatusChip({ status }) {
    const cfg = STATUS[status] || STATUS.idle;
    return (
      <span className={'v3-status' + (cfg.tone ? ' v3-status--' + cfg.tone : '')}>
        <span className="v3-status-dot" aria-hidden="true" />
        {cfg.label}
      </span>);
  }

  /* ── shared choice card (Cloud/Hybrid, then Auto/Custom) ── */
  function OptionCard({ title, sub, selected, pending, pendingLabel, onClick, disabled, badge, describedBy }) {
    return (
      <button type="button" onClick={disabled ? undefined : onClick} disabled={disabled} aria-pressed={selected}
        aria-describedby={disabled ? describedBy : undefined}
        title={disabled ? "This PC doesn't meet the requirements for Hybrid." : undefined}
        className={'v3-choice' + (selected ? ' is-selected' : pending ? ' is-pending' : '')}>
        <div className="v3-choice-head">
          <span className="v3-choice-title">{title}</span>
          {selected &&
            <svg className="v3-choice-check" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.1 14.2-3.6-3.6 1.4-1.4 2.2 2.2 4.9-4.9 1.4 1.4-6.3 6.3z" /></svg>}
          {pending && pendingLabel && <span className="v3-tag v3-tag--attn">{pendingLabel}</span>}
          {badge && !selected && !pending && <span className="v3-tag">{badge}</span>}
        </div>
        <p className="v3-choice-sub">{sub}</p>
      </button>);
  }

  /* ── small UI bits ── */
  function InfoBanner({ tone, icon, children }) {
    return (
      <div className={'v3-banner v3-banner--' + (tone === 'red' ? 'danger' : 'attn')}>
        {icon}
        <span>{children}</span>
      </div>);
  }
  const WarnIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
  const ErrIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
  const CONFLICT = 'Another local model (e.g. LM Studio) is running. Running multiple local models may reduce performance.';
  const LinkBtn = ({ onClick, children }) => <button type="button" onClick={onClick} className="v3-link v3-link--ink v3-inline-link">{children}</button>;

  // Recovering from a failure is routine, not the screen's commit: a ghost button.
  function RetryBtn({ onClick }) {
    return <button type="button" onClick={onClick} className="v3-btn-ghost v3-btn-sm" style={{ alignSelf: 'flex-start' }}>Try again</button>;
  }

  /* ── HYBRID (AUTO) SETUP MODAL, reuses the shared ModalOverlay chrome ── */
  function HybridModal(props) {
    const { status, pct, hwSupported, onCancelModal, onConfirmModal, onDoneModal, onHideModal } = props;
    const inProgress = status === 'downloading' || status === 'installing' || status === 'checking';
    const failed = status === 'install_failed' || status === 'startup_failed';
    const running = status === 'running';
    const title = running ? 'Hybrid AI is ready' : inProgress ? 'Setting up Hybrid AI' : 'Set up Hybrid: Auto';
    const headerClose = inProgress ? onHideModal : running ? onDoneModal : onCancelModal;

    // The ladder: the dialog's commit is solid ink, its way back is ghost.
    const btn = (label, onClick, primary, disabled) => (
      <button key={label} type="button" onClick={onClick} disabled={disabled} className={primary ? 'v3-btn-solid' : 'v3-btn-ghost'}>{label}</button>);

    return (
      <window.ModalOverlay isOpen={true} onClose={headerClose} title={title}>
        {running ? (
          <div className="v3-dlg-done">
            <span className="v3-gate-mark v3-gate-mark--success v3-mark-md" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </span>
            <p className="v3-dlg-text">Hybrid is on. BlueAI now uses your PC for supported tasks to help save tokens.</p>
          </div>
        ) : (
          <>
            <p className="v3-dlg-text">
              {inProgress ? (status === 'installing' ? 'Installing on your PC. Cloud mode is still available.' : 'Downloading required files. Cloud mode is still available.')
                : 'BlueAI runs a local model on your PC for you, saving tokens on supported tasks.'}
            </p>
            {!inProgress && !failed &&
              <p className="v3-dlg-text v3-dlg-strong">Additional files of 3 to 4 GB are required to enable Hybrid mode.</p>}

            {inProgress ? (
              <div style={{ marginTop: 'var(--v2-space-4)' }}>
                <div className="v3-prog-head">
                  <span className="v3-prog-label">{status === 'downloading' ? 'Downloading…' : status === 'installing' ? 'Installing…' : 'Checking…'}</span>
                  {status === 'downloading' && <span className="v3-prog-pct">{Math.round(pct)}%</span>}
                </div>
                <div className="v3-prog-track">
                  <div className={'v3-prog-fill' + (status === 'downloading' ? '' : ' is-indet')} style={{ width: status === 'downloading' ? pct + '%' : '100%' }} />
                </div>
              </div>
            ) : failed ? (
              <div style={{ marginTop: 'var(--v2-space-4)' }}>
                <InfoBanner tone="red" icon={<ErrIcon />}>{status === 'install_failed' ? 'Something went wrong during setup. Please try again.' : "Hybrid mode couldn't start. Please try again."}</InfoBanner>
              </div>
            ) : null}
          </>
        )}

        <div className="v3-btn-row v3-dlg-actions">
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

  window.AiModeParts = { StatusChip, OptionCard, InfoBanner, WarnIcon, ErrIcon, CONFLICT, LinkBtn, RetryBtn, HybridModal };
})();
