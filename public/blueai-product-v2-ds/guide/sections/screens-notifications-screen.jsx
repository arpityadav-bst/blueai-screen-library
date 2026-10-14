/* Section 60: Notifications screen (screens-core slice). Part: Notifications (New).
   Screen: screens/notifications.jsx (V2Screens.Notifications). Refs: guide/refs/screens-core.js.
   The channel model (toast, taskbar, inbox, nav badge) is section 54 (entry-patterns slice). */
(function () {
  const G = window.V2Guide;
  const W = 419, H = 830;

  function Shot({ scale, h, children }) {
    const s = scale || 0.55;
    const hh = h || H;
    return (
      <div style={{ width: W * s, height: hh * s, overflow: 'hidden', flex: 'none', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-sm)', boxSizing: 'content-box', background: 'var(--v2-canvas)' }}>
        <div style={{ width: W, height: hh, transform: 'scale(' + s + ')', transformOrigin: '0 0' }}>{children}</div>
      </div>
    );
  }

  // V2's words, read live from V2's own toastFor (worker_day_done.jsx:191): the only place they exist.
  const ENDS = [['job', 'Job done'], ['nojob', 'No job'], ['day20', 'Day 20'], ['failed', 'Failed']];
  function V2Toasts() {
    const D = window.WorkerDayDone;
    if (!D || !D.toastFor) return <div className="g-missing">window.WorkerDayDone.toastFor is not loaded.</div>;
    return (
      <div className="g-table-wrap">
        <table className="g-table">
          <thead><tr><th scope="col">Run end</th><th scope="col">Toast title</th><th scope="col">Toast body</th></tr></thead>
          <tbody>
            {ENDS.map(function (e) {
              let t = null;
              try { t = D.toastFor(e[0]); } catch (x) { t = null; }
              return <tr key={e[0]}><td>{e[1]}</td><td>{t ? t.title : 'none'}</td><td>{t ? t.body : 'none'}</td></tr>;
            })}
            <tr><td>Skipped</td><td colSpan={2}>No toast: the partner was there to say Not now.</td></tr>
            <tr><td>Job waiting</td><td colSpan={2}>No toast: the taskbar button flashes after 4 seconds, with no deadline.</td></tr>
          </tbody>
        </table>
      </div>
    );
  }

  // Section 60's Kinds, verbatim (design-md/60-notifications-screen.md): kind, glyph and tone, words, where it opens.
  const KINDS = [
    ["`ask`", "bell, attention", "'Paid YouTube job waiting for your OK' / 'Answer by 9 pm or today won’t count.'", "`chat` (the waiting ask), only while the record has a job waiting (otherwise its run, or Activity). Once answered it turns into 'You took the paid job' / 'Day 7 of 20, pending verification.' (`done`) or the `skipped` row."],
    ["`expired`", "clock, neutral", "'Paid job expired' / 'No answer by 9 pm, so today didn’t count.'", "`run`."],
    ["`done`", "check, neutral", "'Run done' / 'Day 6 of 20, pending verification.'", "`run`."],
    ["`skipped`", "info, neutral", "'You skipped the paid job' / 'Today didn’t count toward your 20 days.'", "`run`."],
    ["`nojob`", "info, neutral", "'No job today' / 'Your run counts. Day 6 of 20, pending verification.'", "`run`."],
    ["`failed`", "x-circle, danger", "'Job didn’t finish' / the V2 reason ('App Player closed during the job.')", "`run`."],
    ["`verified`", "check-double, success", "'Oct 11 run verified' / 'Day 6 of 20.'", "`run`."],
    ["`rejected`", "x-circle, danger", "'Oct 12 wasn’t counted' / the reason", "`run`."],
    ["`missed`", "clock, attention", "'Today’s run didn’t start' / 'Run it by 9 pm to count today.'", "`home` (the WorkerCard's Run now). At 9 pm it turns into 'Today’s run didn’t happen' / 'Today didn’t count.', neutral, `run`."],
    ["`blocked`", "alert, danger", "'Today’s run can’t start' / the reason and 'Fix it by 9 pm.'", "`home` (the card's one fix). At 9 pm it turns into its result, as missed does."],
    ["`nocredits`", "credits, attention", "'Out of AI credits for today’s run' / 'They refresh at 5:30 am, so today won’t count.'", "`credits`."],
    ["`ending`", "calendar, neutral", "'3 days left in this program' / '17 of 20 days done. It ends Nov 1.'", "`activity`."],
    ["`cashout`", "earnings, success", "'Cash out is open' / 'Your balance is $10 or more. Cash out on Earnings.'", "`earnings` (external: `EARNINGS_URL`, opens the site in the browser, the row carries the external glyph)."],
    ["`ended`", "calendar, neutral", "'This program has ended' / 'You need $10 to cash out.' (the site's words, `onblue/apply.html:2317`)", "`earnings` (external)."],
    ["`terms`", "info, neutral", "'Terms of Use and Privacy Policy updated' / 'Review them and accept the updated terms to keep your worker running.' (names from the row's docs, the same data the TermsSheet shows)", "`terms` (the TermsSheet, `update` mode, section 53)."],
  ];
  function ticks(s) { return s.split('`').map(function (t, i) { return i % 2 ? <code key={i} className="g-code">{t}</code> : t; }); }
  function KindRow({ item }) {
    const K = window.V2Kit || {};
    const S = window.V2Screens || {};
    return K.Card && S.NotificationRow ? <div style={{ width: W, maxWidth: '100%' }}><K.Card padding="none"><S.NotificationRow item={item} /></K.Card></div> : null;
  }

  function NotificationsSection() {
    const S = window.V2Screens || {};
    if (!S.Notifications) return <G.Section id="notifications-screen"><div className="g-missing">V2Screens.Notifications is not loaded.</div></G.Section>;
    const states = S.NOTIFICATION_STATES.map(function (s) {
      return { label: s[2], note: s[3], node: <Shot><S.Notifications state={s[0]} landmark={false} /></Shot> };
    }).concat([
      { label: 'Compact window (640)', note: 'header and tabs pinned with the bars', node: <Shot h={640}><S.Notifications state="unread" compact landmark={false} /></Shot> },
    ]);
    return (
      <G.Section id="notifications-screen">
        <G.Part name="Notifications" status="new" role="The record of everything the worker told the partner, with what is still unread.">
          <G.Note><strong>Why the product needs it.</strong> The worker runs while nobody watches, so what it says has to
            reach the partner later. In V2 a finished run raises an 8 second Windows toast and nothing else; a waiting job
            only flashes the taskbar button, with no deadline; a skipped day never notifies. Close the toast and the words
            are gone. The inbox keeps them, newest first, and opens the place to act.</G.Note>
          <p><strong>Anatomy.</strong> Pushed from the top bar's More menu; the tab the partner came from stays lit.
            ScreenHeader 'Notifications' with Back and, only while something is unread, a quiet 'Mark all read'. Tabs All /
            Unread with counts (a tab never changes width). A card of rows: a 32px disc with the event's glyph in its tone
            and a blue dot when unread; the title (600 when unread, 500 when read; screen readers hear 'Unread:' first);
            the body, one short sentence that wraps; the time on the right ('11:04 am' today, 'Oct 11' before). A row opens where to act: the chat for a
            waiting job, Run detail for everything else. Opening a row marks it read.</p>
          <G.StateGrid wide states={states} />
          <p><strong>Kinds.</strong> One per section 54 event. A kind not in this list draws the neutral info glyph, never a check.
            An answered ask turns into what was chosen (the 'actioned' state in NOTIFICATION_STATES), as an unanswered one turns into its result at 9 pm.</p>
          <G.Table head={['Kind', 'Glyph, tone', 'Title / body', 'Opens']} rows={KINDS.map(function (r) { return r.map(ticks); })} />
          {S.NOTIFICATION_SAMPLES ? <G.StateGrid wide states={S.NOTIFICATION_SAMPLES.map(function (n) {
            return { label: n.kind, note: 'opens ' + n.target, node: <KindRow item={n} /> };
          })} /> : null}
          <G.CompareRow v2Label="V2 today (the words, live from V2)" v2={<V2Toasts />}
            system={<div style={{ width: W, maxWidth: '100%', overflow: 'auto' }}><S.Notifications state="unread" landmark={false} /></div>}
            changed="The words existed; the place did not. Rows are written to last: 'Today’s run is done.' is right for 8 seconds on the desktop and wrong in a list tomorrow, so a row keeps the event and the day count ('Run done' / 'Day 6 of 20, pending verification.'). A waiting job gets a row with its deadline, and the row turns into its result when the deadline passes." />
          <G.SpecDrawer rows={[
            { part: 'Toast today', token: 'none (OS chrome, section 54)', value: 'title + body, gone after 8 s', ref: 'screens-core.notif.toast' },
            { part: 'Toast words', token: 'none', value: 'Today’s run is done. / Day 7 of 20. Pending verification.', ref: ['screens-core.notif.toast-fn', 'screens-core.notif.job-title', 'screens-core.notif.days-body', 'screens-core.notif.day-line'] },
            { part: 'Other ends', token: 'none', value: 'Your run counts today. / Today’s job didn’t finish. + Open BlueAI to retry and count the day.', ref: ['screens-core.notif.nojob-title', 'screens-core.notif.failed'] },
            { part: 'Skipped day', token: 'none', value: 'never notifies (the partner was there to say Not now); Activity records it', ref: 'screens-core.notif.declined-silent' },
            { part: 'Job waiting', token: 'none', value: 'V2: taskbar flash after 4 s, no expiry; here a row with the deadline', ref: ['screens-core.notif.taskbar', 'screens-core.notif.taskbar-delay'] },
            { part: 'Row', token: 'ListRow nav, Card padding none', value: 'min 48, padding 12 16, hairline between rows' },
            { part: 'Disc', token: 'ListRow mark (section 18): --v2-mark-md, --v2-surface-sunken, --v2-radius-round', value: '32 round, glyph 16 in --v2-attention-ink / --v2-success-ink / --v2-danger-ink / --v2-ink-3' },
            { part: 'Unread dot', token: '--v2-blue, --v2-surface ring', value: '8 round at the disc’s top right; CanvasText in forced colours' },
            { part: 'Title', token: '--v2-text-14, --v2-weight-semibold / medium', value: '600 unread, 500 read, ink' },
            { part: 'Body', token: '--v2-text-13, --v2-ink-3', value: 'one short sentence; wraps, never truncated' },
            { part: 'Time', token: '--v2-text-12, --v2-ink-3', value: 'top-aligned, tabular' },
            { part: 'Mark all read', token: 'Button quiet md', value: '36 tall in the header; absent when nothing is unread' },
            { part: 'Tabs', token: 'Tabs full (section 28)', value: 'All n / Unread n' },
            { part: 'Empty', token: 'EmptyState (section 22)', value: "'No notifications yet'; Unread tab: 'Nothing unread'" },
          ]} />
          <G.DoDont
            do={['Write a row so it is still true tomorrow: the event and the day count, the date on the right.', 'Open the place to act from every row.', 'Turn a waiting job into its result when its deadline passes.']}
            dont={['Copy the toast’s “Today’s …” into a list that outlives the day.', 'Show Mark all read when nothing is unread.', 'Rely on the toast or the taskbar flash as the only record.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('notifications-screen', NotificationsSection);
})();
