/* BlueAI Product V2 Design System: the window (section 29).
   AppFrame  the 419 x 830 content box with its three bands (top bar, content, bottom nav) and an
             overlay plane every in-app dialog, sheet, toast and the splash position against.
             Props: compact (640 tall: content scrolls, bars stay pinned), topBar, nav, children,
             overlays, landmark (default true: content is the page's <main>; specimens pass false),
             className. With no topBar and no nav it is chrome-free (signed out).
   TrayMenu  what the Windows tray icon offers while the window is closed. Windows draws the real
             menu; this specimen fixes its items, order and words. Props: runStatus
             (scheduled | running | done | paused), statusLabel, onOpen, onPause, onResume, onQuit,
             confirm (null | 'pause' | 'quit': the consequence step), onConfirm, onCancel.
   Reads other kit parts lazily at render (V2Kit.BrandMark, V2Kit.Button), so load order is free. */
(function () {
  const { useId } = React;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }

  function AppFrame({ compact, topBar, nav, children, overlays, landmark, className }) {
    const bare = !topBar && !nav;
    const Content = landmark === false ? 'div' : 'main';
    return (
      <div className={cx('v2-frame', compact && 'v2-frame--compact', bare && 'v2-frame--bare', className)}>
        {topBar || null}
        <Content className="v2-frame-content v2-scroll">{children}</Content>
        {nav || null}
        {overlays ? <div className="v2-frame-overlays">{overlays}</div> : null}
      </div>
    );
  }

  // Default status line per run status. Proposed copy; the time comes from the saved run window.
  const TRAY_STATUS = {
    scheduled: 'Next run 11 am',
    running: 'Running today’s run',
    done: 'Done today, pending verification',
    paused: 'Runs paused',
  };
  const TRAY_TONE = { scheduled: 'scheduled', running: 'running', done: 'done', paused: 'paused' };

  // The consequence step. Said before the choice (P3): what stopping costs today.
  function trayConfirmCopy(kind, runStatus) {
    if (kind === 'pause') {
      return {
        title: 'Pause today’s run?',
        body: runStatus === 'done'
          ? 'Today is already done. Runs stay paused until you resume them.'
          : 'Today won’t count toward your 20 days. Runs stay paused until you resume them.',
        confirm: 'Pause',
        cancel: 'Keep running',
      };
    }
    return {
      title: 'Quit BlueAI?',
      body: runStatus === 'done'
        ? 'Today is done. Your next run won’t happen while BlueAI is closed.'
        : 'Today’s run won’t happen while BlueAI is closed, so today won’t count.',
      confirm: 'Quit',
      cancel: 'Keep running',
    };
  }

  function TrayButton({ variant, onClick, children }) {
    const B = window.V2Kit && window.V2Kit.Button;
    if (B) return <B variant={variant} size="sm" onClick={onClick}>{children}</B>;
    return <button type="button" className={cx('v2-tray-btn', variant === 'danger' && 'v2-tray-btn--danger')} onClick={onClick}>{children}</button>;
  }

  function TrayMenu({ runStatus, statusLabel, onOpen, onPause, onResume, onQuit, confirm, onConfirm, onCancel }) {
    const id = useId();
    const status = runStatus || 'scheduled';
    const Brand = window.V2Kit && window.V2Kit.BrandMark;
    if (confirm) {
      const c = trayConfirmCopy(confirm, status);
      return (
        <div className="v2-tray v2-tray--confirm" role="alertdialog" aria-labelledby={id + 't'} aria-describedby={id + 'b'}>
          <p className="v2-tray-confirm-title" id={id + 't'}>{c.title}</p>
          <p className="v2-tray-confirm-body" id={id + 'b'}>{c.body}</p>
          <div className="v2-tray-actions">
            <TrayButton variant="secondary" onClick={onCancel}>{c.cancel}</TrayButton>
            <TrayButton variant={confirm === 'quit' ? 'danger' : 'primary'} onClick={onConfirm}>{c.confirm}</TrayButton>
          </div>
        </div>
      );
    }
    const paused = status === 'paused';
    return (
      <div className="v2-tray" role="menu" aria-label="BlueAI">
        <div className="v2-tray-head" role="presentation">
          {Brand ? <span aria-hidden="true"><Brand size={24} wordmark={false} /></span> : null}
          <div className="v2-tray-head-text">
            <span className="v2-tray-name">BlueAI</span>
            <span className="v2-tray-status">
              <span className={cx('v2-status-dot', 'v2-status-dot--' + TRAY_TONE[status])} aria-hidden="true" />
              {statusLabel || TRAY_STATUS[status]}
            </span>
          </div>
        </div>
        <div className="v2-tray-sep" role="separator" />
        <button type="button" role="menuitem" className="v2-tray-item" onClick={onOpen}>Open BlueAI</button>
        {paused
          ? <button type="button" role="menuitem" className="v2-tray-item" onClick={onResume}>Resume runs</button>
          : <button type="button" role="menuitem" className="v2-tray-item" onClick={onPause}>Pause today’s run</button>}
        <div className="v2-tray-sep" role="separator" />
        <button type="button" role="menuitem" className="v2-tray-item" onClick={onQuit}>Quit BlueAI</button>
      </div>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { AppFrame, TrayMenu });
})();
