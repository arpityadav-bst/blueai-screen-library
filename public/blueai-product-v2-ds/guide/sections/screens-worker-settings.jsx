/* Section 62: Worker settings (screens-account slice). Screen: screens/worker-settings.jsx
   (V2Screens.WorkerSettings). New: V2 has no screen for any of it. */
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

  function WorkerSettingsSection() {
    const S = window.V2Screens || {};
    if (!S.WorkerSettings) return <G.Section id="worker-settings"><G.Warn>screens/worker-settings.jsx is not loaded.</G.Warn></G.Section>;
    const scr = function (p) { return <S.WorkerSettings preview compact landmark={false} onBack={noop} {...(p || {})} />; };
    return (
      <G.Section id="worker-settings">
        <G.Part name="WorkerSettings" status="new"
          role="Settings > Worker: daily runs on or paused, Always ask or Automatic per app, when the run happens, and the interest profile.">
          <G.Note>
            <strong>Why the product needs it. </strong>BlueAI acts on the partner's own YouTube account every day, so every promise
            made in setup needs a control the partner can find later (P4). V2's pitch says "You can pause, stop, or disconnect
            anytime." and its consent says "You can turn it off anytime", yet the mode changes only inside an open chat (a
            Settings card was dropped), modes are not kept across a reload, and the run time is asked once in chat and never
            shown again. Consent that cannot be found to revoke is weak consent (R05).
          </G.Note>
          <p><strong>Anatomy.</strong> ScreenHeader 'Worker' with Back, Settings lit. Four SettingsSection cards: Runs (a switch row;
            off asks first in a dialog that states the cost and an end date), Paid jobs (ModeRows, section 46), Daily run
            (RadioCard list, then one time or a From and To pair), Interest profile (topic chips). Every change confirms in a toast.</p>
          <Screens states={[
            { label: 'Always ask everywhere', note: 'the default for every app', node: scr({ state: 'ask' }) },
            { label: 'Automatic on YouTube', note: 'after consent; Instagram stays Coming soon', node: scr({ state: 'auto' }) },
            { label: 'Consent open', note: 'picking Automatic asks every time (section 46)', node: scr({ state: 'consent' }) },
            { label: 'Pause, before the choice', note: 'what a paused day costs, then until when', node: scr({ state: 'pause' }) },
            { label: 'Paused until a date', note: 'the switch turns it back on at once', node: scr({ state: 'paused' }) },
            { label: 'Editing the run window', note: 'a window: From and To', node: scr({ state: 'window' }) },
          ]} />
          <G.Warn>Decision D4 recommends this screen as the permanent home of the mode either way (the ribbon above the chat
            stays the shortcut). The interest profile is V2's four topics; whether a partner can turn a topic off is a product
            call (proposed here).</G.Warn>
          <G.DoDont
            do={['Say what pausing costs before it happens: paused days don’t count, with the days still needed and left.',
              'Apply every change at once and confirm it in a toast.',
              'Send Automatic through the consent dialog every time; Always ask needs no consent.',
              'Say the run window the way the partner set it: "11 am", "between 9 am and 9 pm".']}
            dont={['Hide the mode in the chat only.', 'Let Instagram be switched before its jobs exist.',
              'Show a pause with no end date and no cost.', 'Change today’s run silently after it has begun.']} />
          <G.SpecDrawer rows={[
            { part: 'Title', token: 'ScreenHeader with Back', value: '"Worker", pushed over Settings (Settings stays lit)', ref: 'screens-account.worker.promise' },
            { part: 'Runs', token: 'ListRow + Switch', value: 'on: "Next run today at 11 am."; off: "Paused until Oct 16. Paused days don’t count toward your 20 days."', ref: 'screens-account.worker.promise' },
            { part: 'Pause dialog', token: 'Dialog task md + Select', value: 'cost from numbers(), for the date picked: "Pausing until Oct 20 skips 7 days. You’d have 11 left for the 13 you need, so 20 days would be out of reach."; Keep running / Pause' },
            { part: 'Start with Windows', token: 'ListRow + Switch', value: 'on; "If it’s off, runs skip after a restart until you open BlueAI."' },
            { part: 'Paid jobs', token: 'ModeRows (section 46), full-bleed', value: 'Always ask / Automatic per app; Instagram Coming soon', ref: ['screens-account.worker.mode-always', 'screens-account.worker.mode-auto', 'screens-account.worker.not-persisted'] },
            { part: 'Consent', token: 'ConsentDialog', value: 'V2’s consent copy; "I agree, turn on"', ref: ['screens-account.worker.no-settings-card', 'screens-account.worker.turn-off'] },
            { part: 'Daily run', token: 'RadioCard list', value: 'A set time / A window / Any time', ref: ['screens-account.worker.option-time', 'screens-account.worker.option-window', 'screens-account.worker.option-any'] },
            { part: 'Run window copy', token: '--v2-text-13, --v2-ink-3', value: 'adapted to the product voice: "BlueAI starts within that hour."', ref: ['screens-account.worker.schedule-time', 'screens-account.worker.schedule-window'] },
            { part: 'Times', token: 'Select (one, or From + To in two columns)', value: '6 am to 10 pm, hourly; gap --v2-space-2' },
            { part: 'Interest profile', token: 'Chip toggles (aria-pressed)', value: 'V2’s four topics, names only', ref: ['screens-account.worker.profile-lead', 'screens-account.worker.topic-tech', 'screens-account.worker.topic-auto', 'screens-account.worker.topic-finance', 'screens-account.worker.topic-fun'] },
            { part: 'Confirmation', token: 'Toast success / info', value: '"Daily run set at 11 am.", "Automatic is on for YouTube.", "Daily runs paused."' },
          ]} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('worker-settings', WorkerSettingsSection);
})();
