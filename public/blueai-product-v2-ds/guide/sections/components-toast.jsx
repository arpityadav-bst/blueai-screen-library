/* Section 24: Toast (overlays slice). Kit: V2Kit.Toast, ToastHost, useToast (kit/toast.jsx).
   Every toast string here is proposed copy (the part is New). */
(function () {
  const G = window.V2Guide;
  const noop = function () {};

  // A stand-in for the product window: the toast host sits at its bottom, as it does in AppFrame.
  function Win({ h, children }) {
    return (
      <div data-v2-bounds="" style={{
        position: 'relative', width: '100%', height: h, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: 'var(--v2-space-4)', background: 'var(--v2-canvas)',
        border: 'var(--v2-stroke) solid var(--v2-line-hair)', borderRadius: 'var(--v2-radius-md)',
      }}>{children}</div>
    );
  }

  function Demo() {
    const K = window.V2Kit;
    const toast = K.useToast();
    function save() { toast.show({ tone: 'success', title: 'Settings saved' }); }
    function remove() {
      toast.show({ tone: 'success', title: 'Key removed', action: { label: 'Undo', onClick: function () { toast.show({ tone: 'info', title: 'Key restored' }); } } });
    }
    function send() {
      const id = toast.show({ tone: 'loading', title: 'Sending your report…' });
      setTimeout(function () { toast.update(id, { tone: 'success', title: 'Report sent' }); }, 1400);
    }
    function fail() { toast.show({ tone: 'error', title: 'Couldn’t save your change', action: { label: 'Try again', onClick: save } }); }
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--v2-space-2)', justifyContent: 'center', alignSelf: 'flex-start' }}>
        <K.Button onClick={save}>Save a setting</K.Button>
        <K.Button onClick={remove}>Remove key</K.Button>
        <K.Button onClick={send}>Send a report</K.Button>
        <K.Button onClick={fail}>Fail to save</K.Button>
      </div>
    );
  }

  function ToastSection() {
    const K = window.V2Kit;
    const T = function (props) { return <Win h={96}><K.Toast duration={0} onClose={noop} {...props} /></Win>; };
    return (
      <G.Section id="toast">
        <G.Part name="Toast" status="new"
          role="Confirms what the partner just did in this window, with Undo or Try again. One at a time, above the bottom nav.">
          <p><strong>Why the product needs it.</strong> V2's only in-app confirmation is an inline green
            "Settings saved successfully." that vanishes after 2.5 s. Removing your own key and unlinking an app act at
            once, with no confirm and no undo. The confirm, destroy, undo rule (section 52) says cheap mistakes get
            Undo instead of a confirm, and Undo needs a place to live. A toast is that place. It is not the Windows
            notification: that one reaches a partner who is not looking at BlueAI (a run that ended while they were
            away); a toast only confirms something done in this window, a second ago.</p>
          <G.StateGrid wide states={[
            { label: 'Success', node: <T tone="success" title="Settings saved" /> },
            { label: 'Info', node: <T tone="info" title="Automatic is off for YouTube" /> },
            { label: 'Error with Try again', node: <T tone="error" title="Couldn’t save your change" action={{ label: 'Try again' }} />, note: 'With Try again it has no timer: it stays until Dismiss, Try again, the next toast or dismiss() on leaving. An error that holds belongs in a banner.' },
            { label: 'With Undo', node: <T tone="success" title="Key removed" action={{ label: 'Undo' }} />, note: 'The change applies now; Undo reverses it.' },
            { label: 'Loading', node: <T tone="loading" title="Sending your report…" />, note: 'No timer until it has a result.' },
            { label: 'Loading, then its result', node: <T tone="success" title="Report sent" />, note: 'The same toast, updated in place.' },
            { label: 'Paused on hover or focus', node: <T tone="success" title="Key removed" action={{ label: 'Undo' }} duration={6000} className="is-paused" />, note: 'The timer holds while the pointer or keyboard focus is on it.' },
            { label: 'Entering', node: <T tone="success" title="Settings saved" className="is-snapshot" />, note: 'Fade-up, 180ms.' },
            { label: 'Leaving', node: <T tone="success" title="Settings saved" leaving className="is-snapshot" />, note: 'Fade, 120ms.' },
          ]} />
          <G.Note>Try it. The window below has its own toast host; each button fires the toast a real action would.
            Undo and Try again work; hover a toast to hold it.</G.Note>
          <G.Stage width="shell">
            <Win h={260}><K.ToastHost offset="none"><Demo /></K.ToastHost></Win>
          </G.Stage>
          <G.SpecDrawer rows={[
            { part: 'Placement', token: '--v2-nav-h, --v2-space-3', value: 'bottom centre, 12px above the bottom nav (offset none: 16px from the bottom)' },
            { part: 'Size', token: '--v2-control-lg', value: 'hugs its words, max 388px, at least 44px tall' },
            { part: 'Surface', token: '--v2-surface, --v2-line, --v2-radius-md, --v2-shadow-1', value: 'white, 1px 10% line, radius 10, the float cast' },
            { part: 'Icon', token: '--v2-icon-sm; --v2-success, --v2-blue, --v2-danger-ink', value: '16px check-circle, info, alert; a spinner while loading' },
            { part: 'Title', token: '--v2-text-13, --v2-weight-medium, --v2-ink', value: '13/500, one line where it can' },
            { part: 'Action', token: '--v2-blue-ink, --v2-hit-min', value: 'a text button in a 32px target: Undo or Try again' },
            { part: 'Close', token: '--v2-hit-min', value: '32px icon button named Dismiss' },
            { part: 'Timing', token: null, value: '4s; 8s for an error; no timer with an action (Undo, Try again): it stays until Dismiss, its action, the next toast or dismiss() on leaving; loading waits for update()', ref: ['overlays.toast.saved-time', 'overlays.toast.os'] },
            { part: 'Pause', token: null, value: 'while hovered or holding keyboard focus (a CSS state)' },
            { part: 'Layer', token: '--v2-z-toast', value: '120, above dialogs' },
            { part: 'Motion', token: '--v2-dur-2, --v2-dur-1', value: 'fade-up 180ms in, fade 120ms out' },
            { part: 'Live region', token: null, value: 'two always-mounted regions, polite and assertive; an error goes to the assertive one; one toast at a time' },
            { part: 'V2 today', token: null, value: '"Settings saved successfully." in an inline box (#f0fdf4, #bbf7d0, radius 8), gone in 2.5 s', ref: ['overlays.toast.saved', 'overlays.toast.saved-style', 'overlays.toast.saved-time'] },
            { part: 'V2 actions with no undo', token: null, value: 'Remove (own key), Unlink (Telegram)', ref: ['overlays.toast.remove-key', 'overlays.toast.unlink'] },
          ]} />
          <G.DoDont
            do={['Confirm a change the partner made here: saved, removed, sent, copied.',
              'Offer Undo instead of a confirm dialog for anything cheap to reverse.',
              'Turn a loading toast into its result in place with update().']}
            dont={['Use a toast for something the worker did while the partner was away; that is the Windows notification and the inbox.',
              'Make a toast the only route to a fix; a condition that holds is a banner.',
              'Stack toasts; a new one replaces the current one.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('toast', ToastSection);
})();
