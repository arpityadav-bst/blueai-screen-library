/* Section 25: Dialog (overlays slice). Kit: V2Kit.Dialog and V2Kit.Scrim (kit/dialog.jsx). */
(function () {
  const G = window.V2Guide;
  const { useState } = React;
  const noop = function () {};
  // V2's consent title and button, quoted (agent_permissions.jsx:159, 179); the body is the kit's proposed one. Its full body is ConsentDialog's (section 46).
  const CONSENT = {
    title: 'Run YouTube jobs automatically?',
    body: 'BlueAI will take YouTube jobs and do them on your account without asking first: watching, liking and posting comments in your name.', // ConsentBody (kit/permissions.jsx:79); proposed, PM and legal, R51, design-md/46
    agree: 'I agree, turn on',
  };
  // V2's Confirm delete, quoted (schedule.jsx:144-149): the same words in both shells, so only the shell differs.
  const DELETE = { title: 'Confirm delete', body: 'Are you sure you want to delete this scheduled task? This action cannot be undone.' };
  // Proposed copy, read from its one owner, V2Screens.CONFIRM_COPY (screens/settings.jsx, section 52), so each
  // confirm has one wording. Read at render, so the screens script has loaded.
  function confirmCopy(kind) {
    const C = (window.V2Screens || {}).CONFIRM_COPY;
    if (!C) return { title: 'V2Screens.CONFIRM_COPY is not loaded', body: '' };
    return kind === 'signOut' ? C.signOut('alex@example.com') : C.disconnect('@alexwatches');
  }

  // A stand-in for the product window: dialogs are scoped to it, as they are to AppFrame.
  function Win({ h, children }) {
    return (
      <div data-v2-bounds="" style={{
        position: 'relative', width: '100%', height: h, overflow: 'hidden', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: 'var(--v2-space-4)', background: 'var(--v2-canvas)',
        border: 'var(--v2-stroke) solid var(--v2-line-hair)', borderRadius: 'var(--v2-radius-md)',
      }}>{children}</div>
    );
  }
  function consent(extra) {
    return Object.assign({
      variant: 'consent', title: CONSENT.title, description: CONSENT.body,
      actions: [{ label: 'Cancel' }, { label: CONSENT.agree, variant: 'primary' }],
    }, extra || {});
  }
  function alertOf(c, confirm, variant, extra) {
    return Object.assign({
      variant: 'alert', title: c.title, description: c.body,
      actions: [{ label: 'Cancel' }, { label: confirm, variant: variant }],
    }, extra || {});
  }
  function MoreMenu({ onAutomatic }) {
    const K = window.V2Kit;
    return (
      <K.Menu label="More" align="end" items={[
        { icon: 'user', label: 'Account' },
        { icon: 'zap', label: 'Turn on Automatic', onSelect: onAutomatic },
      ]} trigger={function (t) { return <K.IconButton icon="more" label="More" size={32} {...t} />; }} />
    );
  }

  function TryIt() {
    const K = window.V2Kit;
    const SIGN_OUT = confirmCopy('signOut'), DISCONNECT = confirmCopy('disconnect');
    const [open, setOpen] = useState(null);
    const [busy, setBusy] = useState(false);
    function close() { setOpen(null); setBusy(false); }
    function slow() { setBusy(true); setTimeout(close, 1200); }
    return (
      <Win h={440}>
        <div style={{ position: 'absolute', top: 'var(--v2-space-2)', right: 'var(--v2-space-2)' }}>
          <MoreMenu onAutomatic={function () { setOpen('consent'); }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--v2-space-2)', justifyContent: 'center' }}>
          <K.Button onClick={function () { setOpen('consent'); }}>Consent</K.Button>
          <K.Button onClick={function () { setOpen('signout'); }}>Sign out</K.Button>
          <K.Button onClick={function () { setOpen('disconnect'); }}>Disconnect</K.Button>
        </div>
        <K.Dialog open={open === 'consent'} onClose={close} busy={busy}
          {...consent({ actions: [{ label: 'Cancel', onClick: close }, { label: CONSENT.agree, variant: 'primary', onClick: slow }] })} />
        <K.Dialog open={open === 'signout'} onClose={close}
          {...alertOf(SIGN_OUT, 'Sign out', 'primary', { actions: [{ label: 'Cancel', onClick: close }, { label: 'Sign out', variant: 'primary', onClick: close }] })} />
        <K.Dialog open={open === 'disconnect'} onClose={close} busy={busy}
          {...alertOf(DISCONNECT, 'Disconnect', 'danger', { actions: [{ label: 'Cancel', onClick: close }, { label: 'Disconnect', variant: 'danger', onClick: slow }] })} />
      </Win>
    );
  }

  function DialogSection() {
    const K = window.V2Kit;
    const SIGN_OUT = confirmCopy('signOut'), DISCONNECT = confirmCopy('disconnect');
    const D = function (props) { return <Win h={330}><K.Dialog preview open {...props} /></Win>; };
    return (
      <G.Section id="dialog">
        <G.Part name="Dialog" status="changed"
          role="One dialog for a decision or a short task: two widths, four variants, a busy state, and focus that goes in, stays in and comes back.">
          <p>Variants set the defaults: <strong>task</strong> (md, close button, scrim click cancels),
            <strong> consent</strong> (md, close button, the agreement is the primary's label, scrim click does nothing so
            consent is never given or refused by accident), <strong>alert</strong> (sm, role alertdialog, no close
            button, focus starts on Cancel), <strong>celebration</strong> (sm, centred, the day-done moment). On open the
            panel itself takes focus, so no ring appears until Tab (the onBlue rule); a form dialog passes initialFocus to
            its first field instead. Tab cycles inside; Esc, Close or Cancel returns focus to whatever opened it.</p>
          <G.StateGrid wide states={[
            { label: 'Closed', node: <Win h={330}><K.Button>Turn on Automatic</K.Button></Win>, note: 'Nothing mounted; the opener keeps focus.' },
            { label: 'Opening', node: <D {...consent({ className: 'is-snapshot' })} />, note: 'Scale-in 320ms on the site ease; the scrim fades 240ms.' },
            { label: 'Open (consent, md)', node: <D {...consent()} /> },
            { label: 'Busy', node: <D {...consent({ busy: true })} />, note: 'The primary loads; Esc, the scrim and Close wait, so it cannot fire twice.' },
            { label: 'Closing', node: <D {...consent({ className: 'is-snapshot is-closing' })} />, note: 'Fades 240ms; focus is already back on the opener.' },
            {
              label: 'Over a menu', note: 'The menu closes first; when the dialog closes, focus returns to the menu button.',
              node: <Win h={330}><div style={{ position: 'absolute', top: 'var(--v2-space-2)', right: 'var(--v2-space-2)' }}><MoreMenu /></div><K.Dialog preview open {...consent()} /></Win>,
            },
          ]} />
          <G.Note>Try it: open each one with the mouse and with the keyboard (Tab to a button, Enter). The More menu at
            the top right opens the consent dialog from a menu item.</G.Note>
          <G.Stage width="shell"><TryIt /></G.Stage>
          <G.CompareRow
            v2={<Win h={330}><G.Live label="ModalOverlay" get={function () { return window.ModalOverlay; }} props={{ isOpen: true, onClose: noop, title: DELETE.title, children: DELETE.body }} /></Win>}
            system={<D variant="task" title={DELETE.title} description={DELETE.body} actions={[{ label: 'Cancel' }, { label: 'Delete', variant: 'danger' }]} />}
            changed="Same words on both sides, so only the shell differs (V2's buttons come from each caller). V2 builds its overlays one by one: five widths (280, 300, 340, 360, 382), radii 12, 16 and 20, five different scrims, z-indexes from 50 to 130 with a tie at 120. None moves focus in or gives it back, the close button has no name, and nothing has a busy state, so a slow consent can be clicked twice. The system has one Dialog on one scrim: sm 320 or md 382, radius 16, shadow-2, a 20/600 title that takes the row with a named 32px Close beside it, body 14 in ink-2, actions secondary then primary at 44px." />
          <G.SpecDrawer rows={[
            { part: 'Scrim', token: '--v2-scrim', value: 'rgba(11,18,32,0.48), fades 240ms', ref: ['overlays.dialog.scrim', 'overlays.dialog.logout-scrim', 'overlays.dialog.ooc-scrim', 'overlays.dialog.daydone-scrim'] },
            { part: 'Layer', token: '--v2-z-dialog', value: '100; one at a time; mount order only settles an unavoidable overlap', ref: ['overlays.dialog.scrim', 'overlays.dialog.logout-scrim', 'overlays.dialog.ooc-scrim'] },
            { part: 'Width sm', token: '--v2-dialog-sm', value: '320px (alert, celebration)', ref: ['overlays.dialog.ooc-panel', 'overlays.dialog.daydone', 'overlays.dialog.logout-panel'] },
            { part: 'Width md', token: '--v2-dialog-md', value: '382px (task, consent)', ref: ['overlays.dialog.panel', 'overlays.dialog.login-card'] },
            { part: 'Height', token: null, value: 'up to the window less 16px each side; the body scrolls, title and actions stay', ref: 'overlays.dialog.panel' },
            { part: 'Window inset', token: '--v2-space-4', value: '16px', ref: 'overlays.dialog.padding' },
            { part: 'Shape', token: '--v2-radius-lg, --v2-line, --v2-shadow-2', value: '16px, 1px 10% line, the dialog cast', ref: 'overlays.dialog.panel-shape' },
            { part: 'Padding', token: '--v2-space-5', value: '20px', ref: ['overlays.dialog.header', 'overlays.dialog.body'] },
            { part: 'Title', token: '--v2-text-20, --v2-weight-semibold, --v2-ink', value: '20/600, tracking -0.02em; takes the row', ref: ['overlays.dialog.title', 'overlays.dialog.family-title'] },
            { part: 'Close', token: '--v2-hit-min', value: 'IconButton 32, named Close; hidden on alert and blocking', ref: 'overlays.dialog.close' },
            { part: 'Body', token: '--v2-text-14, --v2-ink-2, --v2-leading-body', value: '14px / 1.5, #3c4049' },
            { part: 'Actions', token: '--v2-control-lg, --v2-space-2', value: '44px, equal widths, 8px apart, secondary then primary' },
            { part: 'Enter', token: '--v2-dur-4, --v2-ease-out', value: 'scale-in 320ms', ref: 'overlays.dialog.family-motion' },
            { part: 'Exit', token: '--v2-dur-3, --v2-ease-in', value: 'fade 240ms' },
            { part: 'Esc', token: null, value: 'closes unless busy or blocking', ref: 'overlays.dialog.esc' },
            { part: 'Focus', token: null, value: 'panel on open (alert: Cancel); Tab trapped; back to the opener on close', ref: 'overlays.dialog.family-focus' },
            { part: 'Copy compared', token: null, value: DELETE.title + ' / ' + DELETE.body + ' / Cancel / Delete', ref: ['overlays.dialog.delete-title', 'overlays.dialog.delete-body', 'overlays.dialog.delete-cancel', 'overlays.dialog.delete-confirm'] },
            { part: 'Consent copy', token: null, value: CONSENT.title + ' / ' + CONSENT.agree, ref: ['overlays.dialog.consent-title', 'overlays.dialog.consent-body', 'overlays.dialog.consent-agree'] },
          ]} />
          <G.DoDont
            do={['Use a dialog when the partner must decide before going on: consent, sign out, disconnect.',
              'Write the title as the question and the body as what changes and how to undo it.',
              'Set busy while the answer is being recorded.']}
            dont={['Open a dialog to confirm something cheap to reverse; act and offer Undo in a toast.',
              'Stack a dialog on a dialog; finish or close the first.',
              'Use a dialog for a long form; that is a sheet or a screen.']} />
        </G.Part>

        <G.Part name="AlertDialog (confirm, destructive)" status="changed"
          role="The confirm: the title is the question, the body says what changes, the primary is named for the action.">
          <G.StateGrid wide states={[
            { label: 'Confirm', node: <D {...alertOf(SIGN_OUT, 'Sign out', 'primary')} />, note: 'Signing in again undoes it and nothing is deleted, so the primary is neutral; the body still says days don’t count meanwhile.' },
            { label: 'Destructive', node: <D {...alertOf(DISCONNECT, 'Disconnect', 'danger')} />, note: 'Danger only when it destroys or costs a day.' },
            { label: 'Busy', node: <D {...alertOf(DISCONNECT, 'Disconnect', 'danger', { busy: true })} /> },
          ]} />
          <G.CompareRow
            v2={<Win h={300}><G.Live label="Profile.LogoutModal" get={function () { return window.Profile && window.Profile.LogoutModal; }} props={{ isOpen: true, onCancel: noop, onConfirm: noop }} /></Win>}
            system={<D {...alertOf(SIGN_OUT, 'Sign out', 'primary')} />}
            changed="V2 titles it Logout at 19/800 and paints the confirm #ef4444 (3.76:1) as if signing out destroyed something, and confirming leaves the partner signed in (R03). The system asks the question in the title, says the consequence in the body (proposed copy, glossary: Sign out), and keeps the primary neutral. Danger, danger-ink #c03a40 with a white label (5.36:1), is kept for an action that destroys or costs a day, and it is named for the action (Disconnect, Delete), never OK or Yes." />
          <G.SpecDrawer rows={[
            { part: 'Role', token: null, value: 'alertdialog; no close button; scrim click does nothing; Esc cancels' },
            { part: 'First focus', token: null, value: 'Cancel, the safe answer' },
            { part: 'Title', token: '--v2-text-20, --v2-weight-semibold', value: 'the question, 20/600', ref: 'overlays.alert.logout-title' },
            { part: 'Body', token: '--v2-text-14, --v2-ink-2', value: 'what changes and how to undo it', ref: 'overlays.alert.logout-body' },
            { part: 'Confirm, neutral', token: '--v2-action', value: '#1268f0, white label 4.92:1', ref: 'overlays.alert.logout-confirm' },
            { part: 'Confirm, destructive', token: '--v2-danger-ink', value: '#c03a40, white label 5.36:1', ref: ['overlays.alert.logout-confirm', 'overlays.dialog.delete-confirm'] },
            { part: 'Width', token: '--v2-dialog-sm', value: '320px', ref: 'overlays.dialog.logout-panel' },
            { part: 'V2 outcome', token: null, value: 'confirm closes the dialog and stays signed in', ref: 'overlays.alert.logout-noop' },
          ]} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('dialog', DialogSection);
})();
