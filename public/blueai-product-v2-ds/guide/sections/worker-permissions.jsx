/* Section 46: Always ask and Automatic (ModeRows, ConsentDialog, AutoRibbon Changed; PermissionRequest New). */
(function () {
  const G = window.V2Guide;
  const { useState } = React;
  const noop = function () {};
  const AP = function () { return window.AgentPermissions || null; };

  function Win({ height, children }) {
    return (
      <div style={{ position: 'relative', overflow: 'hidden', width: '100%', maxWidth: 'var(--v2-shell-w)', minHeight: height || 520,
        background: 'var(--v2-canvas)', border: 'var(--v2-stroke) solid var(--v2-line-hair)', borderRadius: 'var(--v2-radius-md)' }}>{children}</div>
    );
  }
  const pad = function (node) { return <div style={{ padding: 'var(--v2-space-4)' }}>{node}</div>; };

  // Settings > Worker in miniature: Always ask applies at once; Automatic waits for the consent.
  function ModeDemo() {
    const K = window.V2Kit || {};
    const [modes, setModes] = useState({ youtube: 'always' });
    const [ask, setAsk] = useState(null);
    const [busy, setBusy] = useState(false);
    function before(app, m) {
      if (m !== 'auto') return true;
      return new Promise(function (resolve) { setAsk({ app: app, resolve: resolve }); });
    }
    function agree() { setBusy(true); setTimeout(function () { setBusy(false); ask.resolve(true); setAsk(null); }, 900); }
    function cancel() { ask.resolve(false); setAsk(null); }
    return (
      <Win height={600}>
        {pad(<K.ModeRows worker={K.workerFixtures.verified} modes={modes} beforeChange={before}
          onChange={function (app, m) { setModes(Object.assign({}, modes, { [app]: m })); }} />)}
        {ask ? <K.ConsentDialog app={ask.app} open busy={busy} onAgree={agree} onCancel={cancel} worker={K.workerFixtures.verified} /> : null}
      </Win>
    );
  }

  function V2Consent() {
    const ap = AP();
    if (!ap) return <div className="g-missing">AgentPermissions is not loaded on this page.</div>;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-2)', width: '100%' }}>
        <div style={{ display: 'flex', gap: 'var(--v2-space-2)', flexWrap: 'wrap' }}>
          <button type="button" className="g-btn" onClick={function () { ap.requestMode('youtube', 'auto'); }}>Ask V2 for Automatic on YouTube</button>
          <button type="button" className="g-btn" onClick={function () { ap.reset(); }}>Reset V2 to Always ask</button>
        </div>
        <Win height={560}><G.Live get={function () { return ap.AutoConfirm; }} label="AgentPermissions.AutoConfirm" /></Win>
      </div>
    );
  }

  function V2Ribbon() {
    const ap = AP();
    if (!ap) return <div className="g-missing">AgentPermissions is not loaded on this page.</div>;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-2)', width: '100%', minHeight: 220, justifyContent: 'flex-end' }}>
        <button type="button" className="g-btn" style={{ alignSelf: 'flex-start' }} onClick={function () { ap.setMode('youtube', 'auto'); }}>Turn Automatic on in V2 (no consent, like ?mode=auto)</button>
        <G.Live get={function () { return ap.AutoRibbon; }} label="AgentPermissions.AutoRibbon" />
      </div>
    );
  }

  function PermissionsSection() {
    const K = window.V2Kit || {};
    if (!K.ModeRows || !K.workerFixtures) return <G.Section id="permissions"><div className="g-missing">kit/permissions.jsx is not loaded.</div></G.Section>;
    const F = K.workerFixtures;
    const consent = function (busy, error) { return K.Dialog ? <Win height={600}><K.ConsentDialog app="youtube" preview busy={busy} error={error} onAgree={noop} onCancel={noop} worker={F.verified} /></Win> : null; };
    const notice = K.ComposerNotice ? <K.ComposerNotice {...K.autoNotice(F.automatic, noop)} /> : null;
    return (
      <G.Section id="permissions">
        <G.Part name="ModeRows" status="changed" role="The per-app mode, the PM's model: one row per app, Always ask or Automatic, with a permanent home in Settings > Worker.">
          <p><strong>Anatomy.</strong> One ListRow per app: app mark 20, name 14/500, the account as the description,
            and the kit Segmented 'Always ask' / 'Automatic' (md, 32: it can open a consent). Picking Automatic runs beforeChange, which opens the
            ConsentDialog; only 'I agree, turn on' commits it. Always ask applies at once. The PM's note sits under the
            rows, 12 ink-3. An app that is not live is a row with 'Coming soon' and no switch; one that is not connected offers Connect.</p>
          <G.StateGrid wide states={[
            { label: 'Always ask', note: 'every app starts here', node: pad(<K.ModeRows worker={F.verified} onChange={noop} />) },
            { label: 'Automatic (after consent)', node: pad(<K.ModeRows worker={F.automatic} onChange={noop} />) },
            { label: 'Not connected', note: 'no switch until there is an account', node: pad(<K.ModeRows worker={F.new} onChange={noop} note={false} />) },
            { label: 'Popover (from the ribbon’s Change)', node: <K.ModeRows worker={F.automatic} onChange={noop} float /> },
          ]} />
          <p><strong>Try it.</strong> Switch YouTube to Automatic: the consent opens; Cancel keeps Always ask.</p>
          <ModeDemo />
          <G.CompareRow
            v2={<div style={{ minHeight: 160 }}><G.Live get={function () { return AP() && AP().AppSwitchList; }} label="AgentPermissions.AppSwitchList" /></div>}
            system={<K.ModeRows worker={F.verified} onChange={noop} float />}
            changed="Same model, same words, one row per app. Since 2026-10-14 V2 draws each row as one switch (on = Automatic; turning it on asks for consent, off applies at once) in a bottom sheet titled 'Apps BlueAI can run on its own', opened from the composer chip or the ribbon's Change, and lists the same rows in Settings > Worker > Apps, so the mode already has a home outside an open chat (R05, D4). The system names both options with the kit Segmented (arrow keys, a gate for consent, 32px segments), so a row says which mode is on without decoding a switch, and puts the rows in Settings > Worker's Paid jobs. Instagram cannot be consented to before its jobs exist (R40)." />
          <G.SpecDrawer rows={[
            { part: 'Always ask', token: 'Segmented option', value: 'Always ask (default for every app)', ref: ['worker.permissions.always', 'worker.permissions.store'] },
            { part: 'Automatic', token: 'Segmented option + beforeChange', value: 'Automatic, only through the consent', ref: 'worker.permissions.auto' },
            { part: 'Track', token: '--v2-surface-sunken, --v2-radius-md', value: 'Segmented md, 32 (section 14); V2: a 40x24 switch, on #1990FF, off #cbd5e1', ref: 'worker.permissions.switch-size' },
            { part: 'Segment', token: '--v2-radius-sm, --v2-text-13 500', value: 'shield-check / zap icon 16 + label; selected: the select fill, a blue edge, ink. V2: one role=switch per app, named Run YouTube jobs without asking; on asks for consent, off applies at once', ref: ['worker.permissions.switch', 'worker.permissions.switch-request'] },
            { part: 'Apps', token: 'WORKER_APPS + record status', value: 'YouTube live, Instagram coming soon', ref: ['worker.permissions.apps', 'worker.permissions.instagram'] },
            { part: 'Note', token: '--v2-text-12, --v2-ink-3', value: "System: 'Automatic starts and finishes that app’s jobs without asking. …' (the words of V2’s former menu). V2 today, under the sheet’s title: 'New apps always start on Always ask.'", ref: 'worker.permissions.sheet-note' },
            { part: 'Summary (card, chip)', token: 'modeSummary()', value: "'Always ask' or 'Automatic · YouTube'; V2's chip and ribbon since 2026-10-14: 'Always ask', 'Automatic on YouTube' or 'Automatic on 2 apps'", ref: 'worker.permissions.summary' },
            { part: 'Where (V2)', token: null, value: "a bottom sheet, 'Apps BlueAI can run on its own' (section 26), from the composer chip or the ribbon's Change; the same list in Settings > Worker > Apps", ref: ['worker.permissions.sheet', 'worker.permissions.sheet-title', 'worker.permissions.chip', 'worker.permissions.list', 'worker.permissions.settings'] },
          ]} />
        </G.Part>

        <G.Part name="ConsentDialog" status="changed" role="Turning Automatic on is consent, asked every time: what changes, every app with its setting, and the agreement as the button.">
          <p><strong>Anatomy.</strong> The kit Dialog, consent variant, md (382): title 20/600, close 32, no scrim dismiss.
            Body 14 ink-2. A per-app table, radius 10, the app being changed tinted blue, Automatic in blue ink with zap,
            Always ask with shield-check. Note and 'where to turn it off' 12 ink-3. Footer: Cancel (secondary), then
            'I agree, turn on' (primary), both 44.</p>
          <G.StateGrid wide states={[
            { label: 'Open', node: consent(false) },
            { label: 'Agree: busy', note: 'primary loading; Esc, scrim and close held', node: consent(true) },
            { label: 'Agree: not saved', note: 'danger banner; nothing changed; I agree, turn on tries again', node: consent(false, true) },
            { label: 'Agree: done', note: 'the dialog closes and the ribbon appears', node: notice },
            { label: 'Cancel', note: 'nothing changes; the job question keeps waiting', node: <span className="g-muted">Dialog closed, mode unchanged.</span> },
          ]} />
          <G.CompareRow
            v2={<V2Consent />}
            system={consent(false)}
            changed="The strongest trust moment in V2. V2 adopted the minimal consent dialog on 2026-10-14 (a plain frame with no header, divider or X: title, one sentence, a lighter second line, Cancel / I agree, turn on). The system keeps its title and button word for word; its body names what a job does instead of posting videos (proposed, PM and legal, R51), and it keeps the per-app table, the note and the agreement line V2 dropped, plus one line that says where to turn it off (P4). The chrome moves to the one Dialog: focus moves in and returns, Tab stays inside, busy prevents a double agree, and the agree button goes from #1990FF (3.24:1) to action blue." />
          <G.SpecDrawer rows={[
            { part: 'Dialog', token: '--v2-dialog-md, consent variant', value: '382, close button, no scrim dismiss (V2: a plain frame, no header, divider or X, since 2026-10-14)', ref: 'worker.permissions.modal' },
            { part: 'Title', token: '--v2-text-20, --v2-weight-semibold', value: 'Run YouTube jobs automatically?', ref: 'worker.permissions.consent-title' },
            { part: 'Body', token: '--v2-text-14, --v2-ink-2', value: 'Proposed, PM and legal (R51): BlueAI will take YouTube jobs and do them on your account without asking first: watching, liking and posting comments in your name.', ref: 'worker.permissions.consent-body' },
            { part: 'Target row', token: '--v2-blue-tint', value: 'the app being changed (system only; V2 dropped its list on 2026-10-14)' },
            { part: 'Note', token: '--v2-text-12, --v2-ink-3', value: 'Each app has its own setting. The others stay on Always ask until you switch them. (System only; V2 dropped it on 2026-10-14; its mode sheet says New apps always start on Always ask.)' },
            { part: 'Agreement', token: '--v2-text-14, --v2-ink-2', value: 'By turning this on, you agree to let BlueAI do this for you on YouTube. You can turn it off anytime. (V2’s words until 2026-10-14; the system keeps them.)' },
            { part: 'Where to turn it off', token: '--v2-text-12, --v2-ink-3', value: 'Proposed: Turn it off in Settings > Worker, or with Change above the chat.' },
            { part: 'Cancel', token: 'Button secondary lg', value: 'Cancel', ref: 'worker.permissions.cancel' },
            { part: 'Agree', token: 'Button primary lg, --v2-action', value: 'I agree, turn on', ref: ['worker.permissions.agree', 'worker.permissions.agree-fill', 'worker.permissions.accent'] },
            { part: 'Record', token: 'server, per app', value: 'agreement time kept per account, not in localStorage', ref: 'worker.permissions.consent-record' },
          ]} />
        </G.Part>

        <G.Part name="AutoRibbon" status="changed" role="While any app is Automatic, the chat says so above the composer, with a one-tap way to change it.">
          <p><strong>Anatomy.</strong> The chat kit's ComposerNotice, info tone: zap 16, text 13, 'Change' as its 32px
            trailing action, which opens ModeRows as a popover. Built by <code className="g-code">autoNotice(record, onChange)</code>; null while every app is on Always ask.</p>
          <G.StateGrid wide states={[
            { label: 'Visible while some app is Automatic', node: notice },
            { label: 'Change opens ModeRows', node: <K.ModeRows worker={F.automatic} onChange={noop} float /> },
            { label: 'Hidden', note: 'every app on Always ask', node: <span className="g-muted">Nothing renders.</span> },
          ]} />
          <G.CompareRow
            v2={<V2Ribbon />}
            system={notice}
            changed="V2's ribbon is one line since 2026-10-14: 'Automatic on YouTube' (a count once several apps are on) and Change, which opens the mode sheet. Kept as the in-chat shortcut, now drawn by the shared ComposerNotice so standing conditions (Automatic, out of credits, BlueStacks needed, paused) share one shape. Text moves from 12/600 #1763c6 on #eaf3ff to ink-2 on the info tint, with only the icon in blue ink; Change grows to a 32px target. Its permanent home is Settings > Worker (decision D4), where V2 also lists the apps now." />
          <G.SpecDrawer rows={[
            { part: 'Gate', token: 'autoNotice() returns null', value: 'only while some app is Automatic', ref: 'worker.permissions.ribbon-gate' },
            { part: 'Fill', token: '--v2-blue-tint, --v2-blue-tint-line', value: 'info tone', ref: 'worker.permissions.ribbon-fill' },
            { part: 'Copy', token: 'text --v2-text-13, --v2-ink-2; icon --v2-blue-ink', value: "System: 'Automatic is on for YouTube. BlueAI takes paid YouTube jobs without asking.' V2 since 2026-10-14: 'Automatic on YouTube'", ref: 'worker.permissions.ribbon-copy' },
            { part: 'Change', token: 'ComposerNotice action, --v2-hit-min', value: 'Change (opens ModeRows; in V2, the mode sheet)', ref: 'worker.permissions.ribbon-change' },
          ]} />
        </G.Part>

        <G.Part name="PermissionRequest" status="new" role="Asks before the worker reads viewing data, says what Not now costs, and says where to take it back.">
          <G.Warn>
            Why the product needs it: during setup V2 reads watch history ({G.refText('worker.flow.history')}),
            subscriptions and channel stats ({G.refText('worker.flow.stats')}) without asking. Reading viewing data is a
            separate permission from using the account like a fan (R18). Proposed copy; the PM decides.
          </G.Warn>
          <p><strong>Anatomy.</strong> Card radius 16, max 300. Head 14/600: app mark on a 32 disc and 'BlueAI wants to'.
            Three access lines 13 ink-2 with 16 icons. Why and the cost of Not now, 13 ink-3. Not now (secondary) then
            Allow (primary), 36. Revoke note 12 ink-3. After a choice it collapses to one line with its way back.</p>
          <G.StateGrid wide states={[
            { label: 'Asked', node: <K.PermissionRequest onAllow={noop} onNotNow={noop} /> },
            { label: 'Allowing', note: 'Allow busy', node: <K.PermissionRequest busy onAllow={noop} onNotNow={noop} /> },
            { label: 'Allowed', node: <K.PermissionRequest state="allowed" /> },
            { label: 'Not now', node: <K.PermissionRequest state="notnow" onAllow={noop} /> },
            { label: 'Revoked (in Connected apps)', node: <K.PermissionRequest state="revoked" decidedOn="Oct 14" onAllow={noop} /> },
          ]} />
          <G.SpecDrawer rows={[
            { part: 'Watch history', token: 'access line', value: 'See your watch history', ref: 'worker.flow.history' },
            { part: 'Subscriptions', token: 'access line', value: 'See your subscriptions', ref: 'worker.flow.subs' },
            { part: 'Channel stats', token: 'access line', value: 'See your channel’s joined date and stats', ref: 'worker.flow.stats' },
            { part: 'Cost of Not now', token: '--v2-text-13, --v2-ink-3', value: 'I’ll still run, with general videos.' },
            { part: 'Actions', token: 'Button secondary + primary md', value: 'Not now / Allow' },
          ]} />
          <G.DoDont
            do={['Ask before reading viewing data, and say what Not now costs.', 'Give every permission a Revoke row in Connected apps.']}
            dont={['Read history during setup as a status line.', 'Ask for Automatic and data access in one tap.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('permissions', PermissionsSection);
})();
