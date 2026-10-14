/* BlueAI Product V2 Design System: the window (section 29).
   AppFrame  the 419 x 830 content box with its three bands (top bar, content, bottom nav) and an
             overlay plane every in-app dialog, sheet and the splash position against. It holds the
             window's one toast live region (V2Kit.ToastRegion): a screen that wraps itself in
             <V2Kit.ToastHost region={false}> shows toasts here with useToast(); without an outer
             host the frame provides its own, for the parts inside it.
             Props: compact (640 tall: content scrolls, bars stay pinned), topBar, nav, children,
             overlays, landmark (default true: content is the page's <main>; specimens pass false),
             className. With no topBar and no nav it is chrome-free (signed out).
   TrayMenu  what the Windows tray icon offers while the window is closed. Windows draws the real
             menu; this specimen fixes its items, order and words. Props: runStatus (a RUN_STATUS
             key, section 30: the chip and the tray say the same words), statusLabel, onOpen,
             onSkip, onResume, onQuit, confirm (null | 'skip' | 'quit': the consequence step),
             onConfirm, onCancel. Skip today's run is offered only while today's run is still to
             come; pausing runs for days lives in Settings > Worker, with an end date.
   Reads other kit parts at render (V2Kit.BrandMark, Button, ToastHost), so load order is free. */
(function () {
  const { useId } = React;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }

  function AppFrame({ compact, topBar, nav, children, overlays, landmark, className }) {
    const K = window.V2Kit;
    const outer = K.useToastHost();
    const bare = !topBar && !nav;
    const Content = landmark === false ? 'div' : 'main';
    const frame = (
      <div className={cx('v2-frame', compact && 'v2-frame--compact', bare && 'v2-frame--bare', className)}>
        {topBar || null}
        <Content className="v2-frame-content v2-scroll">{children}</Content>
        {nav || null}
        {overlays ? <div className="v2-frame-overlays">{overlays}</div> : null}
        <K.ToastRegion offset={nav ? 'nav' : 'none'} />
      </div>
    );
    return outer ? frame : <K.ToastHost region={false}>{frame}</K.ToastHost>;
  }

  // Today's run is still to come: the only time skipping it means anything.
  const TO_COME = { scheduled: 1, missed: 1 };
  // Today is settled (counted, pending or not): quitting costs only the next run.
  const SETTLED = { pending: 1, done: 1, 'not-counted': 1, verified: 1, ended: 1 };

  // The consequence step. Said before the choice (P3): what it costs today. Proposed copy. Only
  // 'skip' and 'quit' have one; any other confirm value shows the menu, never a guessed step.
  function trayConfirmCopy(kind, runStatus) {
    if (kind === 'skip') {
      return {
        title: 'Skip today’s run?',
        body: 'Today won’t count toward your 20 days. Runs start again tomorrow.',
        confirm: 'Skip today',
        cancel: 'Keep today’s run',
      };
    }
    if (kind !== 'quit') return null;
    return {
      title: 'Quit BlueAI?',
      body: SETTLED[runStatus]
        ? 'Today is done. Your next run won’t happen while BlueAI is closed.'
        : 'Today’s run won’t happen while BlueAI is closed, so today won’t count.',
      confirm: 'Quit',
      cancel: 'Keep running',
    };
  }

  function TrayMenu({ runStatus, statusLabel, onOpen, onSkip, onResume, onQuit, confirm, onConfirm, onCancel }) {
    const K = window.V2Kit;
    const id = useId();
    const words = K.RUN_STATUS;
    const status = words[runStatus] ? runStatus : (runStatus === 'done' ? 'pending' : 'scheduled');
    const c = confirm ? trayConfirmCopy(confirm, status) : null;
    if (c) {
      return (
        <div className="v2-tray v2-tray--confirm" role="alertdialog" aria-labelledby={id + 't'} aria-describedby={id + 'b'}>
          <p className="v2-tray-confirm-title" id={id + 't'}>{c.title}</p>
          <p className="v2-tray-confirm-body" id={id + 'b'}>{c.body}</p>
          <div className="v2-tray-actions">
            <K.Button variant="secondary" size="sm" onClick={onCancel}>{c.cancel}</K.Button>
            <K.Button variant="primary" size="sm" onClick={onConfirm}>{c.confirm}</K.Button>
          </div>
        </div>
      );
    }
    return (
      <div className="v2-tray" role="menu" aria-label="BlueAI">
        <div className="v2-tray-head" role="presentation">
          <span aria-hidden="true"><K.BrandMark size={24} wordmark={false} /></span>
          <div className="v2-tray-head-text">
            <span className="v2-tray-name">BlueAI</span>
            <span className="v2-tray-status">
              <span className={cx('v2-status-dot', 'v2-status-dot--' + status)} aria-hidden="true" />
              {statusLabel || words[status][1]}
            </span>
          </div>
        </div>
        <div className="v2-tray-sep" role="separator" />
        <button type="button" role="menuitem" className="v2-tray-item" onClick={onOpen}>Open BlueAI</button>
        {status === 'paused' ? <button type="button" role="menuitem" className="v2-tray-item" onClick={onResume}>Resume runs</button> : null}
        {TO_COME[status] ? <button type="button" role="menuitem" className="v2-tray-item" onClick={onSkip}>Skip today’s run</button> : null}
        <div className="v2-tray-sep" role="separator" />
        <button type="button" role="menuitem" className="v2-tray-item" onClick={onQuit}>Quit BlueAI</button>
      </div>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { AppFrame, TrayMenu });
})();
