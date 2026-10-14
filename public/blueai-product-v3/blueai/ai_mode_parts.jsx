/* BlueAI: AI Mode's pieces (V3, Phase 5), split out of ai_mode.jsx for the 300-line rule: the
   status pill, the choice card, the tone notices, the inline link and retry button, and the Hybrid
   (Auto) setup dialog. Styles in settings.css; the status pill and tags are the kit's Badge, the
   notices its Banner, the link and buttons its own (review round 1). Must load before ai_mode.jsx.
   Exposes window.AiModeParts. */
(function () {
  /* ── status pill (mirrors the real local-model lifecycle) ── */
  const STATUS = {
    idle:           { label: 'Off',             tone: 'neutral' },
    checking:       { label: 'Checking…',       tone: 'info', busy: true },
    downloading:    { label: 'Downloading…',    tone: 'info', busy: true },
    installing:     { label: 'Installing…',     tone: 'info', busy: true },
    running:        { label: 'On',              tone: 'success' },
    install_failed: { label: 'Download failed', tone: 'danger' },
    startup_failed: { label: "Couldn't start",  tone: 'danger' },
    blocked:        { label: 'Paused',          tone: 'attention' },
  };

  function StatusChip({ status }) {
    const cfg = STATUS[status] || STATUS.idle;
    return (
      <span className={'v2-badge v2-badge--' + cfg.tone + (cfg.busy ? ' is-busy' : '')}>
        <span className={'v2-badge-dot' + (cfg.busy ? ' v2-anim-pulse' : '')} aria-hidden="true" />
        <span className="v2-badge-label">{cfg.label}</span>
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
            <svg className="v2-icon v3-choice-check" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.1 14.2-3.6-3.6 1.4-1.4 2.2 2.2 4.9-4.9 1.4 1.4-6.3 6.3z" /></svg>}
          {pending && pendingLabel && <span className="v2-badge v2-badge--attention"><span className="v2-badge-label">{pendingLabel}</span></span>}
          {badge && !selected && !pending && <span className="v2-badge"><span className="v2-badge-label">{badge}</span></span>}
        </div>
        <p className="v2-text-caption v3-choice-sub">{sub}</p>
      </button>);
  }

  /* ── small UI bits ── */
  function InfoBanner({ tone, icon, children }) {
    return (
      <div className={'v2-banner v2-banner--' + (tone === 'red' ? 'danger' : 'attention')}>
        <span className="v2-banner-icon">{icon}</span>
        <span className="v2-banner-text">{children}</span>
      </div>);
  }
  const WarnIcon = () => <svg className="v2-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
  const ErrIcon = () => <svg className="v2-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
  const CONFLICT = 'Another local model (e.g. LM Studio) is running. Running multiple local models may reduce performance.';
  const LinkBtn = ({ onClick, children }) => <button type="button" onClick={onClick} className="v2-link v3-inline-link"><span className="v2-link-text">{children}</span></button>;

  // Recovering from a failure is routine, not the screen's commit: a secondary button.
  function RetryBtn({ onClick }) {
    return <button type="button" onClick={onClick} className="v2-button v2-button--secondary" style={{ alignSelf: 'flex-start' }}>Try again</button>;
  }

  /* ── HYBRID (AUTO) SETUP MODAL, reuses the shared ModalOverlay chrome ── */
  function HybridModal(props) {
    const { status, pct, hwSupported, onCancelModal, onConfirmModal, onDoneModal, onHideModal } = props;
    const inProgress = status === 'downloading' || status === 'installing' || status === 'checking';
    const failed = status === 'install_failed' || status === 'startup_failed';
    const running = status === 'running';
    const title = running ? 'Hybrid AI is ready' : inProgress ? 'Setting up Hybrid AI' : 'Set up Hybrid: Auto';
    const headerClose = inProgress ? onHideModal : running ? onDoneModal : onCancelModal;

    // The ladder: the dialog's commit is the primary, its way back the secondary.
    const btn = (label, onClick, primary, disabled) => (
      <button key={label} type="button" onClick={onClick} disabled={disabled} aria-disabled={!!disabled}
        className={'v2-button v2-button--lg ' + (primary ? 'v2-button--primary' : 'v2-button--secondary')}>{label}</button>);

    return (
      <window.ModalOverlay isOpen={true} onClose={headerClose} title={title}>
        {running ? (
          <div className="v3-dlg-done">
            <span className="v3-gate-mark v3-gate-mark--success v3-mark-md" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </span>
            <p className="v2-text-body">Hybrid is on. BlueAI now uses your PC for supported tasks to help save tokens.</p>
          </div>
        ) : (
          <>
            <p className="v2-text-body">
              {inProgress ? (status === 'installing' ? 'Installing on your PC. Cloud mode is still available.' : 'Downloading required files. Cloud mode is still available.')
                : 'BlueAI runs a local model on your PC for you, saving tokens on supported tasks.'}
            </p>
            {!inProgress && !failed &&
              <p className="v2-text-body v3-dlg-strong">Additional files of 3 to 4 GB are required to enable Hybrid mode.</p>}

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
