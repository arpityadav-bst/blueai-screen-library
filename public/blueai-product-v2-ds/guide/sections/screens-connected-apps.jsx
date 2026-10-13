/* Section 63: Connected apps (screens-account slice). Screen: screens/connected-apps.jsx
   (V2Screens.ConnectedApps, V2Screens.ConnectedAppRows). New. */
(function () {
  const G = window.V2Guide;
  const noop = function () {};

  function Screens({ states }) {
    return (
      <div className="g-states" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(453px, 1fr))', overflowX: 'auto' }}>
        {states.map(function (s, i) {
          return (
            <figure className="g-state" key={s.label + i}>
              <div className="g-state-stage">{s.node}</div>
              <figcaption className="g-state-label">{s.label}{s.note ? <span className="g-state-note">{s.note}</span> : null}</figcaption>
            </figure>
          );
        })}
      </div>
    );
  }

  function ConnectedAppsSection() {
    const S = window.V2Screens || {};
    const K = window.V2Kit || {};
    if (!S.ConnectedApps) return <G.Section id="connected-apps"><G.Warn>screens/connected-apps.jsx is not loaded.</G.Warn></G.Section>;
    const scr = function (p) { return <S.ConnectedApps preview compact landmark={false} onBack={noop} onNavigate={noop} {...(p || {})} />; };
    const rows = function (p) {
      return K.SettingsSection
        ? <div style={{ width: '100%' }}><K.SettingsSection title="Your accounts"><S.ConnectedAppRows onOpen={noop} {...p} /></K.SettingsSection></div>
        : null;
    };
    return (
      <G.Section id="connected-apps">
        <G.Part name="ConnectedApps" status="new"
          role="The accounts BlueAI acts on, how it uses each, and the way to stop it: Disconnect, said before it happens.">
          <G.Note>
            <strong>Why the product needs it. </strong>The worker watches, likes and comments as the partner. V2 confirms the
            YouTube account once in chat ("Looks like you’re signed in as @bluestacksfan, is that right?") and never shows it
            again, reads watch history without asking (R18), lets Instagram be switched to Automatic before Instagram jobs
            exist (R40), and its Telegram card unlinks at once with no way back. The partner needs one place that says which
            accounts are in use, what BlueAI does with each, and how to stop it (P4).
          </G.Note>
          <p><strong>Anatomy.</strong> ScreenHeader 'Connected apps' with Back. The list is one SettingsSection of
            ConnectedAppRows: app mark, name, the account or why there is none, one Badge. An app's detail: its Account row,
            What BlueAI does here (Paid jobs, Watch history), then the consequence in words over one danger Disconnect button.</p>
          <Screens states={[
            { label: 'List', note: 'YouTube connected, Telegram not connected, Instagram Coming soon', node: scr() },
            { label: 'YouTube connected', note: 'pushed from the list or from Settings', node: scr({ app: 'youtube' }) },
            { label: 'YouTube signed out in App Player', note: 'the one action that fixes it', node: scr({ app: 'youtube', state: 'signed-out' }) },
            { label: 'Disconnect confirm', note: 'the cost before the choice', node: scr({ app: 'youtube', state: 'disconnect' }) },
            { label: 'Disconnected', note: 'runs paused; Connect brings it back', node: scr({ app: 'youtube', state: 'disconnected' }) },
            { label: 'Telegram linked', note: 'Disconnect, then Undo in the toast', node: scr({ app: 'telegram', telegram: 'linked' }) },
            { label: 'Telegram not linked', node: scr({ app: 'telegram', telegram: 'not-linked' }) },
          ]} />
          <G.StateGrid wide states={[
            { label: 'Rows: all connected', node: rows({ telegram: 'linked' }) },
            { label: 'Rows: YouTube signed out', node: rows({ youtube: 'signed-out' }) },
            { label: 'Rows: YouTube not connected', node: rows({ youtube: 'disconnected' }) },
            { label: 'Row hover', note: 'the kit ListRow, forced', node: K.ListRow ? <div style={{ width: '100%' }}><K.ListRow className="is-hover" label="YouTube" description="@alexwatches · Always ask" onClick={noop} /></div> : null },
            { label: 'Row focus-visible', node: K.ListRow ? <div style={{ width: '100%' }}><K.ListRow className="is-focus" label="YouTube" description="@alexwatches · Always ask" onClick={noop} /></div> : null },
          ]} />
          <G.DoDont
            do={['Show the account handle BlueAI uses, with one status Badge.',
              'Write what disconnecting costs above the button and again in the confirm: runs pause, days without a run don’t count.',
              'Confirm a disconnect that costs days; offer Undo for one that costs nothing (Telegram).',
              'Show an app that is not live as Coming soon, with no switch and no chevron.']}
            dont={['Say "Unlink".', 'Let a partner consent to automation on an app with no jobs.',
              'Read watch history without a visible switch to stop it.', 'Hide the account after setup.']} />
          <G.SpecDrawer rows={[
            { part: 'Title', token: 'ScreenHeader with Back', value: '"Connected apps"; an app’s detail is titled with its name', ref: 'screens-account.apps.handle' },
            { part: 'Row', token: 'ListRow nav + Avatar app 32 + Badge', value: 'name 14/500, account 13 ink-3, one Badge', ref: ['screens-account.apps.youtube', 'screens-account.settings.telegram-title'] },
            { part: 'Status words', token: 'Badge success / attention / neutral', value: 'Connected, Signed out, Not connected, Coming soon' },
            { part: 'Instagram', token: 'ListRow static + Badge neutral', value: '"Instagram jobs aren’t available yet." No chevron', ref: 'screens-account.apps.instagram' },
            { part: 'Telegram', token: 'ListRow', value: 'V2’s copy: "Connected to @BlueAIBot" / "Connect your Telegram account…"; Connect Telegram', ref: ['screens-account.settings.telegram-linked', 'screens-account.settings.telegram-desc', 'screens-account.settings.telegram-connect'] },
            { part: 'Disconnect', token: 'Button danger md', value: 'replaces "Unlink"; consequence 13 ink-3 above it', ref: 'screens-account.settings.telegram-unlink' },
            { part: 'Confirm', token: 'Dialog alert sm', value: '"Disconnect YouTube?" Cancel / Disconnect (danger); focus starts on Cancel' },
            { part: 'Watch history', token: 'ListRow + Switch', value: 'on: used to pick jobs; off: general videos', ref: 'screens-account.worker.history-read' },
            { part: 'Passwords', token: 'SettingsSection description', value: 'adapted from the pitch: "It never sees or types your passwords."', ref: 'screens-account.worker.password' },
          ]} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('connected-apps', ConnectedAppsSection);
})();
