/* Section 58: Activity, runs and verification (screens-core slice). Part: Activity (New).
   Screen: screens/activity.jsx (V2Screens.Activity). Refs: guide/refs/screens-core.js. */
(function () {
  const G = window.V2Guide;
  const W = 419, H = 830;
  const noop = function () {};

  function Shot({ scale, h, children }) {
    const s = scale || 0.55;
    const hh = h || H;
    return (
      <div style={{ width: W * s, height: hh * s, overflow: 'hidden', flex: 'none', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-sm)', boxSizing: 'content-box', background: 'var(--v2-canvas)' }}>
        <div style={{ width: W, height: hh, transform: 'scale(' + s + ')', transformOrigin: '0 0' }}>{children}</div>
      </div>
    );
  }
  function Stack({ children }) {
    return <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)' }}>{children}</div>;
  }

  // What V2 offers in Activity's place: a Jobs tab that says Coming Soon, and a chat history.
  function V2Today() {
    return (
      <Stack>
        <div style={{ width: W, maxWidth: '100%' }}>
          <G.Live get={function () { return window.BottomNavbar; }} props={{ activeTab: 'jobs', onTabChange: noop }} label="BottomNavbar (shared.jsx)" />
        </div>
        <G.FrameState url="index.html?start=worker" label="V2: open, then press Jobs in the bottom bar (Coming Soon)" height={830} />
        <div style={{ display: 'flex', flexDirection: 'column', height: 420, width: W, maxWidth: '100%', overflow: 'hidden' }}>
          <G.Live get={function () { return window.ChatHistory && window.ChatHistory.ChatHistoryScreen; }} label="ChatHistoryScreen (history.jsx)" />
        </div>
      </Stack>
    );
  }

  function ActivitySection() {
    const S = window.V2Screens || {};
    const F = (window.V2Kit || {}).workerFixtures || {};
    if (!S.Activity) return <G.Section id="activity"><div className="g-missing">V2Screens.Activity is not loaded.</div></G.Section>;
    const states = S.ACTIVITY_STATES.map(function (s) {
      return { label: s[3], note: s[4], node: <Shot><S.Activity state={s[0]} landmark={false} /></Shot> };
    }).concat([
      { label: 'Failed today', note: 'Not counted yet, with the deadline', node: <Shot><S.Activity worker={F.failed} landmark={false} /></Shot> },
      { label: 'Didn’t start today', note: 'Run it by 9 pm, opens Home', node: <Shot><S.Activity worker={F.missed} landmark={false} /></Shot> },
      { label: 'Can’t run today', note: 'the fix, opens Connected apps', node: <Shot><S.Activity worker={F.blocked} landmark={false} /></Shot> },
      { label: 'Not set up', note: 'one way forward', node: <Shot><S.Activity worker={F.new} landmark={false} /></Shot> },
      { label: 'Compact window (640)', note: 'strip and tabs scroll with the rows', node: <Shot h={640}><S.Activity state="complete" compact landmark={false} /></Shot> },
    ]);
    return (
      <G.Section id="activity">
        <G.Part name="Activity" status="new" role="One row per program day: date, result, whether it counted; the place to dispute a day.">
          <G.Note><strong>Why the product needs it.</strong> The partner is paid per verified day, and every day is checked
            within a day, so the one question after Home is "which days counted?". V2 has no answer anywhere: its first tab,
            Jobs, says 'Coming Soon', Schedule lists sample tasks, Chat History lists past chats, and the day count lives in a
            constant that makes tonight's Day 7 tomorrow's Day 6. A rejected day had no state at all (R19). Activity replaces
            Jobs and Schedule in the nav (R04).</G.Note>
          <p><strong>Anatomy.</strong> ScreenHeader 'Activity'; ProgramStrip (the same card as Home, without See why);
            Tabs This program / Past, full width; a card of ledger rows, newest first. Each row: a 96px date column ('Today',
            'Oct 11'), the result ('Paid job done', 'Job skipped', 'No run'), and on the right the tick in words ('Verified'
            with two ticks, 'Pending' with one, 'Still checking', 'Not counted'). While today's run is live the right side
            is a Badge instead ('Running', 'Needs you', 'Not counted yet'). A rejected day shows its reason under the result
            and a Report a problem line under the row. Rows with a run open Run detail (section 59).</p>
          <G.StateGrid wide states={states} />
          <G.CompareRow v2Label="V2 today (what Activity replaces)" v2={<V2Today />}
            system={<div style={{ width: W, maxWidth: '100%', overflow: 'auto' }}><S.Activity state="rejected" landmark={false} /></div>}
            changed="The first tab of a jobs product said 'Coming Soon'; nowhere listed which days counted. Activity is the ledger the strip, the day bar, the toast and the site's dashboard all read, so the partner can check any day, see why one was not counted, and report it." />
          <G.SpecDrawer rows={[
            { part: 'Nav', token: 'BottomNav (section 31)', value: 'Home, Activity, Settings (Jobs, Chat and Schedule retire)', ref: ['screens-core.jobs.nav-jobs', 'screens-core.jobs.nav-chat', 'screens-core.jobs.nav-schedule'] },
            { part: 'Replaces', token: 'none', value: 'Coming Soon / We are working on this section to bring you new opportunities. Check back soon for updates!', ref: ['screens-core.jobs.title', 'screens-core.jobs.body'] },
            { part: 'Not a chat history', token: 'none', value: "past chats ('find all active redeem codes for genshin impact') are not runs", ref: ['screens-core.history.title', 'screens-core.history.list', 'screens-core.history.sample'] },
            { part: 'Ledger', token: 'worker.ledger, numbers()', value: 'one row per day, derived; never a stored count', ref: 'screens-core.ledger.done-before' },
            { part: 'Ticks', token: 'StatusTick (section 43)', value: 'one tick pending, two verified, plus late, rejected, not counted', ref: 'screens-core.ledger.ticks' },
            { part: 'Row', token: 'ListRow nav, --v2-text-14', value: 'min 48 tall, padding 12 16, divider --v2-line-hair between days' },
            { part: 'Date column', token: '--v2-ink-3, tabular figures', value: '96 wide, 14/400' },
            { part: 'Result', token: '--v2-ink, --v2-weight-medium', value: 'Paid job done / Job skipped / No run / Run in progress / Paid job waiting / Job didn’t finish' },
            { part: 'Not counted', token: 'StatusTick notcounted', value: 'Today doesn’t count toward your 20 days.', ref: 'screens-core.ledger.declined' },
            { part: 'Rejected', token: 'StatusTick rejected, Link standalone', value: 'reason under the result; Report a problem, 32 target, never inside the row' },
            { part: 'Tabs', token: 'Tabs full (section 28)', value: 'This program / Past; Past is empty until a program ends' },
            { part: 'Empty', token: 'EmptyState (section 22)', value: "'No days yet' + the next run time; 'Set up your worker' before setup" },
          ]} />
          <G.DoDont
            do={['Derive every row from the ledger, so Home, Activity and the site agree.', 'Say "Not counted" in words next to the tick, with the reason when there is one.', 'Keep Report a problem on its own line under a rejected row.']}
            dont={['Show a Coming Soon tab in the nav.', 'Nest a control inside a row that opens Run detail.', 'Show money on rows: what a day is worth waits on decision D3.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('activity', ActivitySection);
})();
