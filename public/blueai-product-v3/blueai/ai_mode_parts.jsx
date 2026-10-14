/* BlueAI: AI Mode's pieces (V3, Phase 5), split out of ai_mode.jsx for the 300-line rule: the
   status pill, the choice card, the tone notices, the inline link and retry button, and the Hybrid
   (Auto) setup dialog. The status pill and tags are the kit's Badge, the notices its Banner, the
   link and buttons its own (review round 1); since review round 2 the choice card is the kit's
   RadioCard (its outline check), the progress the kit's ProgressBar and every glyph the kit's
   Icon. Must load before ai_mode.jsx.
   Exposes window.AiModeParts. */
(function () {
  const Icon = (p) => React.createElement(window.V2Kit.Icon, p);

  /* ── status pill (mirrors the real local-model lifecycle) ── */
  const STATUS = {
    idle:           { label: 'Off',             tone: 'neutral' },
    checking:       { label: 'Checking…',       tone: 'info', busy: true },
    downloading:    { label: 'Downloading…',    tone: 'info', busy: true },
    installing:     { label: 'Installing…',     tone: 'info', busy: true },
    running:        { label: 'On',              tone: 'neutral' },   // green is only reached or verified (review round 2)
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

  /* ── shared choice card (Cloud/Hybrid, then Auto/Custom): the kit's RadioCard (kit/inputs.css),
     a button so a click on the chosen card still answers (Auto reopens its setup) ── */
  function OptionCard({ title, sub, selected, pending, pendingLabel, onClick, disabled, badge, describedBy }) {
    return (
      <button type="button" onClick={disabled ? undefined : onClick} disabled={disabled} aria-pressed={selected}
        aria-describedby={disabled ? describedBy : undefined}
        title={disabled ? "This PC doesn't meet the requirements for Hybrid." : undefined}
        className={'v2-radio-card' + (selected ? ' is-selected' : pending ? ' is-pending' : '') + (disabled ? ' is-disabled' : '')}>
        <span className="v2-radio-card-body">
          <span className="v2-radio-card-head">
            <span className="v2-radio-card-title v2-text-title-sm">{title}</span>
            {pending && pendingLabel && <span className="v2-badge v2-badge--attention"><span className="v2-badge-label">{pendingLabel}</span></span>}
            {badge && !selected && !pending && <span className="v2-badge"><span className="v2-badge-label">{badge}</span></span>}
            <span className="v2-radio-card-check" aria-hidden="true"><Icon name="check" /></span>
          </span>
          <span className="v2-radio-card-sub">{sub}</span>
        </span>
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
  const WarnIcon = () => <Icon name="alert" />;
  const ErrIcon = () => <Icon name="x-circle" />;
  const CONFLICT = 'Another local model (e.g. LM Studio) is running. Running multiple local models may reduce performance.';
  const LinkBtn = ({ onClick, children }) => <button type="button" onClick={onClick} className="v2-link v3-inline-link"><span className="v2-link-text">{children}</span></button>;

  // Recovering from a failure is routine, not the screen's commit: a secondary button.
  function RetryBtn({ onClick }) {
    return <button type="button" onClick={onClick} className="v2-button v2-button--secondary" style={{ alignSelf: 'flex-start' }}>Try again</button>;
  }

  /* ── HYBRID (AUTO) SETUP MODAL, reuses the shared ModalOverlay chrome. Its actions stack full width,
     the commit first (review round 2). ── */
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
                <window.V2Kit.ProgressBar label={status === 'downloading' ? 'Downloading…' : status === 'installing' ? 'Installing…' : 'Checking…'}
                  value={pct} indeterminate={status !== 'downloading'} />
              </div>
            ) : failed ? (
              <div style={{ marginTop: 'var(--v2-space-4)' }}>
                <InfoBanner tone="red" icon={<ErrIcon />}>{status === 'install_failed' ? 'Something went wrong during setup. Please try again.' : "Hybrid mode couldn't start. Please try again."}</InfoBanner>
              </div>
            ) : null}
          </>
        )}

        <div className="v3-btn-row v3-btn-row--stack v3-dlg-actions">
          {running
            ? btn('Done', onDoneModal, true)
            : inProgress
              ? [btn('Continue in background', onHideModal, true), btn(status === 'downloading' ? 'Cancel download' : 'Cancel', onCancelModal, false)]
              : failed
                ? [btn('Try again', onConfirmModal, true), btn('Cancel', onCancelModal, false)]
                : [btn('Download & enable', onConfirmModal, true, !hwSupported), btn('Cancel', onCancelModal, false)]}
        </div>
      </window.ModalOverlay>);
  }

  window.AiModeParts = { StatusChip, OptionCard, InfoBanner, WarnIcon, ErrIcon, CONFLICT, LinkBtn, RetryBtn, HybridModal };
})();
