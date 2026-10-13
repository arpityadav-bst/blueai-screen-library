/* Section 54: Notifications (entry-patterns slice). Part: Channel map (Changed).
   Composed from kit parts (ListRow, Card, Icon, BottomNav, Toast); inbox rows reuse section 60’s row classes. The Windows notification
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
  // event, Windows title (V2 where V2 has it), when it expires, Windows, taskbar, the Settings switch that
  // silences its Windows notification (section 61), refs
  const EVENTS = [
    ['Day done', 'Today’s run is done.', 'never', 'yes', 'no', 'Today’s run ends', ['entry-patterns.notify.job-title', 'entry-patterns.notify.days-body']],
    ['No job today', 'Your run counts today.', 'never', 'yes', 'no', 'Today’s run ends', ['entry-patterns.notify.nojob-title']],
    ['Job waiting (Always ask)', 'A paid YouTube job is waiting for your OK. Answer by 9 pm.', 'at 9 pm (the day’s deadline, section 41): the day closes as skipped', 'yes', 'yes', 'A paid job needs you', ['entry-patterns.notify.attention-delay']],
    ['Run failed', 'Today’s job didn’t finish.', 'at 9 pm', 'yes', 'yes', 'Today’s run ends', ['entry-patterns.notify.failed-title', 'entry-patterns.notify.failed']],
    ['Run didn’t start (raised when the PC wakes)', 'Today’s run didn’t start. Run it by 9 pm to count today.', '9 pm', 'yes', 'no', 'always on', null],
    ['Run can’t start (no YouTube, App Player signed out, no BlueStacks)', 'Today’s run can’t start: <reason>. Fix it by 9 pm.', '9 pm', 'yes', 'no', 'always on', null],
    ['Out of credits for today’s run (refill after 9 pm)', 'Not enough AI credits for today’s run. They refresh at 5:30 am, so today won’t count.', '9 pm', 'yes', 'no', 'always on', null],
    ['Day verified', 'Yesterday’s run is verified.', 'never', 'no (inbox only)', 'no', 'inbox only', null],
    ['Day not counted', 'Oct 12 wasn’t counted. See why.', 'never', 'yes', 'no', 'always on', null],
    ['Program ending', '3 days left in this program.', 'the program’s end', 'yes', 'no', 'always on', null],
    ['Cash out open (only when numbers().cashOutOpen is true, after the period)', 'Cash out is open on Earnings.', 'never', 'yes', 'no', 'always on', null],
    ['Cash out, under $10', 'This program has ended. You need $10 to cash out. Your balance carries over to the next period.', 'never', 'no (inbox only)', 'no', 'inbox only', null],
    ['Terms updated', 'We’ve updated the Program Terms.', 'never (the sheet asks on next open)', 'no', 'no', 'inbox only', null],
  ];

  // One inbox row in section 60's anatomy, the same ListRow mark as the screen (section 18): a 32
  // sunken disc with the glyph 16 in its tone, an 8px blue dot and a 600 title while unread, the body
  // 13 ink-3 (it wraps), the time 12 ink-3. Every row opens its place, an expired ask included.
  function Row({ icon, tone, title, body, time, unread }) {
    const K = window.V2Kit;
    return (
      <K.ListRow className={'v2-notif' + (unread ? ' v2-notif--unread' : '')} mark={{ icon: icon, tone: tone, dot: unread }}
        label={<span>{unread ? <span className="v2-sr-only">Unread: </span> : null}{title}</span>}
        description={body} value={time} onClick={function () {}} />
    );
  }
  function Inbox() {
    const K = window.V2Kit;
    return (
      <div style={{ width: 'var(--v2-shell-w)' }}>
        <K.Card padding="none">
          <Row unread icon="bell" tone="attention" title="Paid YouTube job waiting for your OK" body="Answer by 9 pm or today won’t count." time="11:04 am" />
          <Row icon="check" title="Run done" body="Day 7 of 20, pending verification." time="Oct 12" />
          <Row icon="check-double" tone="success" title="Oct 11 run verified" body="Day 6 of 20." time="Oct 12" />
          <Row icon="clock" title="Paid job expired" body="No answer by 9 pm, so today didn’t count." time="Oct 9" />
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
              <thead><tr><th scope="col">Event</th><th scope="col">Windows title (proposed unless sourced)</th><th scope="col">Expires</th><th scope="col">Windows</th><th scope="col">Taskbar</th><th scope="col">Switch</th><th scope="col">V2 source</th></tr></thead>
              <tbody>{EVENTS.map(function (r) { return <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td>{r[4]}</td><td>{r[5]}</td><td><G.RefCell refs={r[6]} /></td></tr>; })}</tbody>
            </table>
          </div>
          <G.Note>Every event also lands in Notifications. A Windows notification stays in the Windows action centre; BlueAI does not make it leave early. Clicking it opens the entry’s own place: the job ask in Chat (Chat waiting, the destination section 60 names), the run card with Try again, Activity, or Earnings. The two Settings switches only silence the Windows notification; every event still lands in the inbox, and events marked always on cost or pay the partner, so no switch hides them. When the credits refill lands before 9 pm there is no event: the run starts once they are back.</G.Note>
          <G.Note>Telegram is not a notification channel. A linked Telegram (section 63) carries the partner’s commands to BlueAI, not these events, and nothing here waits on it. Whether it should carry the day-losing events (job waiting, run didn’t start, run can’t start) to a partner away from the PC is a product call (section 76).</G.Note>
          <G.StateGrid wide states={[
            { label: 'Unread, read, expired', note: 'section 60’s rows, newest first; opening one marks it read', node: <Inbox /> },
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
            { part: 'Inbox row', token: 'ListRow + v2-notif (section 60)', value: '32 sunken disc, glyph 16 in its tone; title 14, 600 unread / 500 read; body 13 ink-3, wraps; time 12 ink-3; chevron' },
            { part: 'Unread', token: '--v2-blue, --v2-space-2', value: '8px dot on the disc and a 600 title; said “Unread:” first; opening the row marks it read' },
            { part: 'Expired', token: 'kind expired (clock, ink-3)', value: 'the waiting ask turns into its result and what it cost; still opens the run' },
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
