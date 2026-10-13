/* Section 52: Confirm, destroy, undo (entry-patterns slice). Part: Rules (Changed).
   Composed from kit parts (Dialog alert, Toast, Button). Refs: guide/refs/entry-patterns.js. */
(function () {
  const G = window.V2Guide;

  // cost, the rule, examples. Copy in the examples is proposed.
  const RULES = [
    ['Costs today’s day', 'Say the cost on the control, before the choice; confirm if it cannot be taken back today.', 'Skip today’s job (“Skip: today won’t count”), Skip today’s run (tray), Quit BlueAI, Stop a paid run'],
    ['Costs account control or money', 'Confirm in an alert dialog. The title asks the question with the object; the body says what changes and how to undo it; the primary names the action.', 'Sign out and Disconnect YouTube: alert dialog; turn on Automatic: ConsentDialog (section 46)'],
    ['Cannot be undone', 'Confirm; the primary is danger and named for the action.', 'Delete my data, Leave the program'],
    ['Cheap and reversible', 'Do it at once, then a toast with Undo for 6 s. Commit only when the toast leaves.', 'Remove my own key, Disconnect Telegram, Dismiss a notification'],
    ['A switch', 'A switch only turns something on or off. It never deletes, signs out or costs a day as a side effect.', 'Use my own key (off keeps the key)'],
  ];

  // A stand-in for the product window: dialogs are scoped to it, as they are to AppFrame.
  function Win({ h, children }) {
    return <div style={{ position: 'relative', isolation: 'isolate', width: 'var(--v2-shell-w)', height: h || 300, overflow: 'hidden', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-sm)', background: 'var(--v2-canvas)' }}>{children}</div>;
  }
  function V2Logout() {
    const C = window.Profile && window.Profile.LogoutModal;
    if (!C) return <div className="g-missing">V2 LogoutModal is not loaded on this page.</div>;
    return <Win><div className="g-live" style={{ position: 'absolute', inset: 0 }}><G.Boundary><C isOpen onCancel={function () {}} onConfirm={function () {}} /></G.Boundary></div></Win>;
  }

  // Each confirm's strings have one owner, V2Screens.CONFIRM_COPY (screens/settings.jsx); read at render.
  function confirmCopy(kind) {
    const C = (window.V2Screens || {}).CONFIRM_COPY;
    if (!C) return { title: 'V2Screens.CONFIRM_COPY is not loaded', body: '' };
    return kind === 'signOut' ? C.signOut('alex@example.com') : C.disconnect('@alexwatches');
  }

  function ConfirmSection() {
    const K = window.V2Kit;
    const noop = function () {};
    const SIGN_OUT = confirmCopy('signOut'), DISCONNECT = confirmCopy('disconnect');
    const signOut = function (busy) {
      return (
        <Win h={320}>
          <K.Dialog open preview variant="alert" title={SIGN_OUT.title} description={SIGN_OUT.body} busy={busy}
            actions={[{ label: 'Cancel', variant: 'secondary', onClick: noop }, { label: SIGN_OUT.confirm || 'Sign out', variant: 'primary', onClick: noop }]} />
        </Win>
      );
    };
    return (
      <G.Section id="confirm-destroy-undo">
        <G.Part name="Rules" status="changed" role="Confirm when an action costs a day, money or account control, or cannot be undone; otherwise act and offer Undo; never as a side effect of a switch.">
          <div className="g-table-wrap">
            <table className="g-table">
              <thead><tr><th scope="col">When it</th><th scope="col">Rule</th><th scope="col">For example</th></tr></thead>
              <tbody>{RULES.map(function (r) { return <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>; })}</tbody>
            </table>
          </div>
          <G.StateGrid wide states={[
            { label: 'Confirm first: sign out', note: 'primary, not danger: nothing is deleted', node: signOut(false) },
            { label: 'Confirm first: disconnect', note: 'danger: the worker cannot run', node: (
              <Win h={300}>
                <K.Dialog open preview variant="alert" title={DISCONNECT.title} description={DISCONNECT.body}
                  actions={[{ label: 'Cancel', variant: 'secondary', onClick: noop }, { label: DISCONNECT.confirm || 'Disconnect', variant: 'danger', onClick: noop }]} />
              </Win>
            ) },
            { label: 'Busy', note: 'Esc, scrim and Cancel held while it works', node: signOut(true) },
            { label: 'Act, then Undo', note: '6 s; the key is removed when the toast leaves', node: <K.Toast tone="success" title="Key removed." action={{ label: 'Undo', onClick: noop }} duration={0} onClose={noop} /> },
            { label: 'Undone', node: <K.Toast tone="info" title="Key restored." duration={0} onClose={noop} /> },
            { label: 'Cost on the control', note: 'consequence before the choice', node: (
              <div className="v2-hstack v2-wrap v2-gap-2" style={{ maxWidth: 320 }}>
                <K.Chip>Take this job</K.Chip><K.Chip>Skip: today won’t count</K.Chip>
              </div>
            ) },
          ]} />
          <G.CompareRow
            v2={<V2Logout />}
            system={signOut(false)}
            changed="V2’s one sign-out confirm says Logout over a body that says sign out, paints a non-destructive action red, and its confirm does not sign out: it closes and returns to chat. Meanwhile the actions that do lose something never ask: switching your own key off deletes the key, Remove and Unlink act at once with no undo, and Not now on a paid job ends the day as not counted in one tap, with the cost told only afterwards. The system confirms by cost, says the cost before the choice, and makes cheap actions undoable." />
          <G.SpecDrawer rows={[
            { part: 'Dialog', token: 'Dialog alert, --v2-dialog-sm', value: '320, role alertdialog, focus on the first action, no scrim dismiss' },
            { part: 'Title', token: '--v2-text-20', value: 'the question, with the object: Sign out of BlueAI? (V2: Logout)', ref: 'entry-patterns.destroy.logout-title' },
            { part: 'Body', token: '--v2-text-14, --v2-ink-2', value: 'what changes and how to undo it', ref: 'entry-patterns.destroy.logout-body' },
            { part: 'Primary', token: '--v2-action or --v2-danger-ink', value: 'danger only when something is lost (V2 paints sign out #ef4444)', ref: ['entry-patterns.destroy.logout-red', 'entry-patterns.destroy.schedule-red'] },
            { part: 'Confirm that does nothing, V2', token: null, value: 'closes and stays signed in', ref: 'entry-patterns.destroy.logout-noop' },
            { part: 'The one V2 delete confirm', token: null, value: 'Confirm delete / This action cannot be undone.', ref: ['entry-patterns.destroy.schedule-title', 'entry-patterns.destroy.schedule-body'] },
            { part: 'No confirm, no undo, V2', token: null, value: 'switch off deletes the key; Remove; Unlink', ref: ['entry-patterns.destroy.toggle-delete', 'entry-patterns.destroy.remove', 'entry-patterns.destroy.unlink'] },
            { part: 'Cost told afterwards, V2', token: null, value: 'Not now, then: Today doesn’t count toward your 20 days.', ref: ['entry-patterns.destroy.not-now-option', 'entry-patterns.destroy.not-now', 'entry-patterns.destroy.declined-sub'] },
            { part: 'Undo toast', token: 'Toast with action', value: '6 s, pauses on hover and focus; commit on leave' },
          ]} />
          <G.DoDont
            do={['Name the primary for what it does: Sign out, Disconnect, Delete.', 'Say what is kept as well as what is lost.', 'Prefer Undo to a question when the action is cheap.']}
            dont={['Use “Are you sure?” as the whole message.', 'Paint a reversible action red.', 'Let a switch delete data.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('confirm-destroy-undo', ConfirmSection);
})();
