/* Section 54: Notifications (entry-patterns slice). Part: Channel map (Changed).
   Composed from kit parts (ListRow, Card, Badge, Icon, BottomNav, Toast). The Windows notification
   and the taskbar are OS chrome (section 71): this section fixes when they fire and what they say.
   Refs: guide/refs/entry-patterns.js. */
(function () {
  const G = window.V2Guide;

  const CHANNELS = [
    ['Windows notification', 'A pointer, for a partner who is not looking at BlueAI. A click opens the record it points to, never a cold home.', 'Every event marked below'],
    ['Taskbar attention', 'A pointer: the BlueAI button flashes, finitely, while something waits for an answer.', 'Job waiting, run failed'],
    ['Notifications (inbox)', 'The record. Every event lands here, read or not; opened from More (section 60).', 'Every event'],
    ['Badge', 'The count of what needs the partner, on Activity (section 31). Never on Home.', 'A waiting job, a day not counted'],
    ['In-app toast', 'Confirms what the partner just did in this window. Never an event.', 'Saved, Key removed, Back online'],
  ];
  // event, Windows title (V2 where V2 has it), when it expires, Windows, taskbar, refs
  const EVENTS = [
    ['Day done', 'Today’s run is done.', 'never', 'yes', 'no', ['entry-patterns.notify.job-title', 'entry-patterns.notify.days-body']],
    ['No job today', 'Your run counts today.', 'never', 'yes', 'no', ['entry-patterns.notify.nojob-title']],
    ['Job waiting (Always ask)', 'A paid YouTube job is waiting for your OK. Answer by 9 pm.', 'the run window’s end: the day closes as skipped', 'yes', 'yes', ['entry-patterns.notify.attention-delay']],
    ['Run failed', 'Today’s job didn’t finish.', 'the run window’s end', 'yes', 'yes', ['entry-patterns.notify.failed-title', 'entry-patterns.notify.failed']],
    ['Day verified', 'Yesterday’s run is verified.', 'never', 'no (inbox only)', 'no', null],
    ['Day not counted', 'Oct 12 wasn’t counted. See why.', 'never', 'yes', 'no', null],
    ['Program ending', '3 days left in this program.', 'the program’s end', 'yes', 'no', null],
    ['Cash out open', 'Cash out is open on Earnings.', 'never', 'yes', 'no', null],
    ['Terms updated', 'We’ve updated the Program Terms.', 'never (the sheet asks on next open)', 'no', 'no', null],
  ];

  function Row({ icon, title, body, time, state }) {
    const K = window.V2Kit;
    const badge = state === 'new' ? <K.Badge tone="info" dot>New</K.Badge>
      : (state === 'expired' ? <K.Badge tone="neutral">Expired</K.Badge> : null);
    return (
      <K.ListRow leading={<K.Icon name={icon} size={20} />} label={title} description={body + ' · ' + time}
        badge={badge} onClick={state === 'expired' ? undefined : function () {}} />
    );
  }
  function Inbox() {
    const K = window.V2Kit;
    return (
      <div style={{ width: 'var(--v2-shell-w)' }}>
        <K.Card padding="none">
          <Row state="new" icon="bell" title="Paid YouTube job waiting for your OK" body="Answer by 9 pm or today won’t count." time="11:04 am" />
          <Row state="seen" icon="check" title="Oct 12 run done" body="Day 7 of 20. Pending verification." time="Yesterday" />
          <Row state="actioned" icon="check-double" title="Oct 11 run verified" body="Day 6 of 20." time="Oct 12" />
          <Row state="expired" icon="clock" title="Paid job expired" body="No answer by 9 pm, so today didn’t count." time="Oct 9" />
        </K.Card>
      </div>
    );
  }

  // The record itself is the Notifications screen (section 60, screens-core); fall back to the rows.
  function Screen60() {
    const S = window.V2Screens || {};
    if (!S.Notifications) return <Inbox />;
    return (
      <div style={{ width: 419 * 0.6, height: 830 * 0.6, overflow: 'hidden', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-sm)' }}>
        <div style={{ width: 419, height: 830, transform: 'scale(0.6)', transformOrigin: '0 0' }}><S.Notifications state="unread" landmark={false} /></div>
      </div>
    );
  }

  function NotificationsSection() {
    const K = window.V2Kit;
    const items = (K.NAV_ITEMS || []).map(function (it) { return it; });
    return (
      <G.Section id="notifications-pattern">
        <G.Part name="Channel map" status="changed" role="Pointers by urgency, one record for everything: the Windows notification and taskbar point, the inbox remembers, the badge counts.">
          <div className="g-table-wrap">
            <table className="g-table">
              <thead><tr><th scope="col">Channel</th><th scope="col">Job</th><th scope="col">Used for</th></tr></thead>
              <tbody>{CHANNELS.map(function (r) { return <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>; })}</tbody>
            </table>
          </div>
          <div className="g-table-wrap">
            <table className="g-table">
              <thead><tr><th scope="col">Event</th><th scope="col">Windows title (proposed unless sourced)</th><th scope="col">Expires</th><th scope="col">Windows</th><th scope="col">Taskbar</th><th scope="col">V2 source</th></tr></thead>
              <tbody>{EVENTS.map(function (r) { return <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td>{r[4]}</td><td><G.RefCell refs={r[5]} /></td></tr>; })}</tbody>
            </table>
          </div>
          <G.Note>Every event also lands in Notifications. A Windows notification stays in the Windows action centre; BlueAI does not make it leave early. Clicking it opens the entry’s own place: the job preview, the run card with Try again, Activity, or Earnings.</G.Note>
          <G.StateGrid wide states={[
            { label: 'New, seen, actioned, expired', note: 'one row each, newest first', node: <Inbox /> },
            { label: 'Badge', note: 'on Activity: a waiting job and a day not counted', node: <div style={{ width: 'var(--v2-shell-w)' }}><K.BottomNav items={items.map(function (it) { return it.id === 'activity' ? Object.assign({}, it, { badge: 2 }) : it; })} value="home" /></div> },
            { label: 'In-app toast', note: 'confirms an action, never an event', node: <K.Toast tone="success" title="Notification settings saved." duration={0} /> },
          ]} />
          <G.CompareRow
            v2={<G.FrameState url="index.html?end=job" label="V2: the run plays, then the Windows notification (bottom right)" height={760} />}
            system={<Screen60 />}
            changed="V2 has good pointers and nothing for them to point at. The Windows notification leaves after 8 s and is the only record; a click opens a cold-started home with no Retry; and the most urgent moment, a paid job waiting for an Always ask partner, raises only an amber taskbar flash after 4 s, with no notification and no deadline, so the job waits forever. The system sends every event to one inbox, keeps the Windows notification and the taskbar as pointers into it, and gives a waiting job a deadline that says what missing it costs." />
          <G.SpecDrawer rows={[
            { part: 'OS toast, V2', token: null, value: 'auto-dismiss 8000 ms; declined never notifies', ref: ['entry-patterns.notify.ms', 'entry-patterns.notify.declined', 'entry-patterns.notify.toast-for'] },
            { part: 'Click target, V2', token: null, value: 'opens a cold-started home', ref: 'entry-patterns.notify.open' },
            { part: 'Taskbar, V2', token: null, value: 'after 4000 ms; 7 flashes of 0.55 s, then holds amber', ref: ['entry-patterns.notify.attention-delay', 'entry-patterns.notify.flash', 'entry-patterns.notify.flash-colour'] },
            { part: 'Low-credit dot, V2', token: null, value: 'red dot on the credits pill (moves to the credits chip, section 47)', ref: 'entry-patterns.notify.low-dot' },
            { part: 'Telegram, V2', token: null, value: 'a card with no notification role (a channel later, if the PM wants one)', ref: 'entry-patterns.notify.telegram' },
            { part: 'Inbox row', token: 'ListRow, --v2-icon-md', value: 'icon 20, title 14/500, body + time 12 ink-3, chevron' },
            { part: 'New', token: 'Badge info dot', value: 'New until opened; the screen itself is section 60' },
            { part: 'Expired', token: 'Badge neutral', value: 'Expired; not pressable; says what it cost' },
            { part: 'Badge', token: 'BottomNav badge', value: 'on Activity; count, 9+ above nine, read as “, 2 new”' },
          ]} />
          <G.DoDont
            do={['Put every event in Notifications, even when it also raised a Windows notification.', 'Give anything that waits for the partner a deadline and its cost.', 'Open the place the notification is about.']}
            dont={['Make the Windows notification the only record.', 'Flash the taskbar without saying why anywhere.', 'Use an in-app toast for something the worker did while the partner was away.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('notifications-pattern', NotificationsSection);
})();
