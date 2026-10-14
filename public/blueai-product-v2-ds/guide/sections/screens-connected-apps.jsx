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
            What BlueAI does here (Daily warm-up, Paid jobs), then Watch history as a permission (section 46), then the consequence in words over one Disconnect button: danger for
            YouTube, which costs days; secondary for Telegram, which costs nothing and offers Undo.</p>
          <Screens states={[
            { label: 'List', note: 'YouTube connected, Telegram not connected, Instagram Coming soon', node: scr() },
            { label: 'YouTube connected', note: 'pushed from the list or from Settings', node: scr({ app: 'youtube' }) },
            { label: 'YouTube signed out in App Player', note: 'the one action that fixes it', node: scr({ app: 'youtube', state: 'signed-out' }) },
            { label: 'Watch history turned off', note: 'Allow opens the full request', node: scr({ app: 'youtube', worker: K.workerFixtures && K.workerFixtures.revoked }) },
            { label: 'From a blocked run', note: 'the record says signed out', node: scr({ app: 'youtube', worker: K.workerFixtures && K.workerFixtures.blocked }) },
            { label: 'Disconnect confirm', note: 'the cost before the choice', node: scr({ app: 'youtube', state: 'disconnect' }) },
            { label: 'Disconnecting', note: 'the confirm’s primary works in place', node: scr({ app: 'youtube', state: 'disconnect-busy' }) },
            { label: 'Couldn’t disconnect', note: 'said in the dialog, Try again', node: scr({ app: 'youtube', state: 'disconnect-failed' }) },
            { label: 'Disconnected', note: 'runs can’t start; Connect brings it back', node: scr({ app: 'youtube', state: 'disconnected' }) },
            { label: 'Telegram linked', note: 'Disconnect, then Undo in the toast', node: scr({ app: 'telegram', telegram: 'linked' }) },
            { label: 'Telegram not linked', node: scr({ app: 'telegram', telegram: 'not-linked' }) },
            { label: 'Telegram pairing', note: 'the code and a waiting line', node: scr({ app: 'telegram', state: 'tg-pairing' }) },
            { label: 'Pairing expired', node: scr({ app: 'telegram', state: 'tg-expired' }) },
            { label: 'Pairing failed', node: scr({ app: 'telegram', state: 'tg-failed' }) },
            { label: 'Loading', node: scr({ state: 'loading' }) },
            { label: 'Couldn’t load', node: scr({ state: 'error' }) },
          ]} />
          <G.CompareRow
            v2={<div style={{ position: 'relative', width: '100%', minHeight: 440 }}>
              <G.Live get={function () { return window.TelegramCard; }} label="TelegramCard (settings.jsx)" />
            </div>}
            system={scr({ app: 'telegram', state: 'tg-pairing' })}
            changed={'V2’s Connect Telegram opens a modal (press it on the left) with a grey QR placeholder, "Or use pairing code:", '
              + '4829 in indigo, and "I’ve paired, continue": the partner reports a pairing the app never checked. The system keeps the '
              + 'code, says where to send it, and waits for Telegram itself with a live line ("The code works for 10 minutes."); an '
              + 'expired or failed pairing says so, says nothing was linked, and offers a new code or Try again. The QR placeholder '
              + 'is left out until there is a real code to scan.'} />
          <G.StateGrid wide states={[
            { label: 'Rows: all connected', node: rows({ telegram: 'linked' }) },
            { label: 'Rows: YouTube signed out', node: rows({ youtube: 'signed-out' }) },
            { label: 'Rows: YouTube not connected', node: rows({ youtube: 'disconnected' }) },
            { label: 'Row hover', note: 'the kit ListRow, forced', node: K.ListRow ? <div style={{ width: '100%' }}><K.ListRow className="is-hover" label="YouTube" description="@alexwatches · Always ask" onClick={noop} /></div> : null },
            { label: 'Row focus-visible', node: K.ListRow ? <div style={{ width: '100%' }}><K.ListRow className="is-focus" label="YouTube" description="@alexwatches · Always ask" onClick={noop} /></div> : null },
          ]} />
          <G.DoDont
            do={['Show the account handle BlueAI uses, with one status Badge.',
              'Write what disconnecting costs above the button and again in the confirm: runs can’t start, days without a run don’t count.',
              'Confirm a disconnect that costs days; offer Undo for one that costs nothing (Telegram).',
              'Show an app that is not live as Coming soon, with no switch and no chevron.']}
            dont={['Say "Unlink".', 'Let a partner consent to automation on an app with no jobs.',
              'Read watch history without a way to turn it off.', 'Hide the account after setup.']} />
          <G.SpecDrawer rows={[
            { part: 'Title', token: 'ScreenHeader with Back', value: '"Connected apps"; an app’s detail is titled with its name', ref: 'screens-account.apps.handle' },
            { part: 'Row', token: 'ListRow nav + Avatar app 32 + Badge', value: 'name 14/500, account 13 ink-3, one Badge', ref: ['screens-account.apps.youtube', 'screens-account.settings.telegram-title'] },
            { part: 'Status words', token: 'Badge success / attention / neutral', value: 'Connected, Signed out, Not connected, Coming soon' },
            { part: 'Instagram', token: 'ListRow static + Badge neutral', value: '"Instagram jobs aren’t available yet." No chevron' },
            { part: 'Telegram', token: 'ListRow', value: 'V2’s copy: "Connected to @BlueAIBot" / "Connect your Telegram account…"; Connect Telegram', ref: ['screens-account.settings.telegram-linked', 'screens-account.settings.telegram-desc', 'screens-account.settings.telegram-connect'] },
            { part: 'Pairing', token: 'Dialog task + Spinner 16', value: 'the code 4829 (24/600 tabular, sunken, dashed line), "Waiting for Telegram. The code works for 10 minutes."; expired and failed say "Nothing was linked."; no QR placeholder, no "I’ve paired"', ref: ['screens-account.settings.telegram-modal', 'screens-account.settings.telegram-qr', 'screens-account.settings.telegram-code', 'screens-account.settings.telegram-paired'] },
            { part: 'Disconnect', token: 'Button danger md (YouTube), secondary md (Telegram)', value: 'replaces "Unlink"; consequence 13 ink-3 above it', ref: 'screens-account.settings.telegram-unlink' },
            { part: 'Confirm', token: 'Dialog alert sm', value: '"Disconnect YouTube?" Cancel / Disconnect (danger); focus starts on Cancel' },
            { part: 'Daily warm-up', token: 'ListRow', value: 'Watches and likes videos that fit you, every run, in both modes. (general videos when history is off)' },
            { part: 'Watch history', token: 'ListRow + Button secondary sm; PermissionRequest compact and full (section 46)', value: 'allowed: Allowed on Oct 6 / BlueAI sees your watch history, subscriptions and channel stats to pick jobs that fit you. + Turn off (one tap); not now or turned off: the compact result with Allow, which opens the full request', ref: 'screens-account.worker.history-read' },
            { part: 'Passwords', token: 'SettingsSection description', value: 'adapted from the pitch: "It never sees or types your passwords."', ref: 'screens-account.worker.password' },
          ]} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('connected-apps', ConnectedAppsSection);
})();
