/* Section 30: Top bar (shell slice). Parts: TopBar (Changed), WorkerStatusChip (New), BrandMark
   (Changed), Help and more menus (Changed). Kit: kit/topbar.jsx. Refs: guide/refs/shell.js. */
(function () {
  const G = window.V2Guide;

  // A bar at the window's width; room leaves space under it for an open menu.
  function Bar(props) {
    const K = window.V2Kit;
    return (
      <div data-v2-bounds="" style={{ width: 'var(--v2-shell-w)', maxWidth: '100%', minHeight: props.room ? 300 : undefined, background: 'var(--v2-canvas)' }}>
        <K.TopBar signedIn={props.signedIn !== false} status={props.status} statusLabel={props.statusLabel}
          credits={props.credits === undefined ? 2000 : props.credits} openMenu={props.openMenu} />
      </div>
    );
  }
  function Chip(props) {
    const K = window.V2Kit;
    return <K.WorkerStatusChip {...props} />;
  }

  // The status a chip shows, from the Worker record (section 41). Labels are proposed copy except
  // 'Didn’t finish', which echoes the PM's toast.
  const CHIP_STATES = [
    ['scheduled', 'Next run 11 am; Next run 9 am to 8 pm; Runs later today', 'today.status scheduled, worded from runWindow (a time, a window, any time)', 'Home, Today'],
    ['running', 'Running', 'today.status running', 'the run in the chat'],
    ['needs-you', 'Needs you (yellow tint)', 'today.status waiting', 'the job preview'],
    ['pending', 'Day 7 of 20 (blue ring: in, not yet checked)', 'today.status done, today’s ledger row not verified yet', 'the run in Activity'],
    ['not-counted', 'Not counted today (neutral dot)', 'done with today.outcome skipped or expired; noCredits with creditsDay stopped', 'the run in Activity; out of credits: Home, Today'],
    ['verified', 'All 20 days done; Day 7 of 20 once today is verified', 'done and verified; numbers().complete', 'the run in Activity; complete: Home, Today (the card’s Earnings)'],
    ['stopped', 'Stopped (ring dot)', 'today.status stopped', 'Home, Today: Run again and its deadline'],
    ['failed', 'Didn’t finish (red tint)', 'today.status failed', 'the run, with Try again and its deadline'],
    ['missed', 'Didn’t start (neutral dot)', 'today.status missed: the PC was off or asleep at run time', 'Home, Today: Run now and its deadline'],
    ['blocked', 'Can’t run (red tint)', 'blockedBy(record): no app, signed out or no BlueStacks', 'Home, Today: the card’s one fix'],
    ['paused', 'Paused (ring dot)', 'paused', 'Settings > Worker'],
    ['no-credits', 'Waiting for credits (ring dot)', 'credits.left below runCost before today’s run, refill before 9 pm (creditsDay waiting)', 'Home, Today: the card says when credits refresh'],
    ['paused', 'Update needed (ring dot)', 'an update is required (section 69)', 'the update screen (section 69)'],
    ['offline', 'Offline (ring dot)', 'offline', 'Home, Today: the card says what happens to today'],
    ['ended', 'Period ended (ring dot)', 'the 20 days ran out before all were verified (daysLeft 0)', 'Home: the period-ended state with Earnings (section 69)'],
  ];
  // The label a specimen draws: the first wording, without the note in brackets.
  function chipLabel(s) { return s[1].split(';')[0].replace(/ \(.*\)$/, ''); }

  const MENU_ROWS = [
    ['Help', 'FAQ', 'help', 'Opens the FAQ on the onBlue site in the browser.', 'Only closes the menu.', ['shell.topbar.faq']],
    ['Help', 'Report a problem', 'alert (ink, not red)', 'Opens the Report a problem sheet, filled in from the last run (section 65).', '"Report Issue" only closes the menu; red glyph.', ['shell.topbar.report', 'shell.topbar.warn-red']],
    ['More', 'Notifications', 'bell', 'Pushes Notifications (section 60) over the current tab.', 'Not in V2. "Chat History" sat here; runs now live in Activity and the chat is one thread from Home.', ['shell.topbar.history']],
    ['More', 'Account', 'user', 'Pushes Account (section 64).', '"Profile".', ['shell.topbar.profile']],
    ['More', 'Earnings', 'earnings + external', 'Opens the Earnings dashboard on the onBlue site: the one Earnings URL.', 'Same label; one of two Earnings URLs.', ['shell.topbar.earnings', 'shell.topbar.earnings-url']],
    ['More', 'Sign out', 'sign-out', 'Asks first, then signs out and pauses the worker.', '"Logout"; the confirm does not sign out.', ['shell.topbar.logout', 'shell.topbar.logout-noop']],
  ];
  function MenuTable() {
    return (
      <div className="g-table-wrap">
        <table className="g-table">
          <thead><tr><th scope="col">Menu</th><th scope="col">Item</th><th scope="col">Icon</th><th scope="col">Does</th><th scope="col">V2 today</th></tr></thead>
          <tbody>
            {MENU_ROWS.map(function (r) {
              return (
                <tr key={r[1]}>
                  <td>{r[0]}</td><td>{r[1]}</td><td><code className="g-code">{r[2]}</code></td><td>{r[3]}</td>
                  <td>{r[4]}<div style={{ marginTop: 'var(--v2-space-1)' }}><G.RefCell refs={r[5]} /></div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  function TopBarSection() {
    const K = window.V2Kit;
    return (
      <G.Section id="top-bar">
        <G.Note>Not worker-centric (2026-10-14, Appy): people also use BlueAI for plain chat, so the bar leads with the credits and shows the worker only while it is live or needs attention (Running…, Needs you, Didn’t finish). Quiet states stay on Home. The BrandMark word is ink in Target; the V2 today look keeps its gradient word.</G.Note>
        <G.Part name="TopBar" status="changed" role="Credits, New chat, help and more on every signed-in screen; the worker only when it is live or needs the partner.">
          <ul className="g-list">
            <li>52 tall, surface, one bottom hairline, no shadow. The credits' spark sits on the 16 gutter; right 12, because the 32 icon buttons carry their own inset.</li>
            <li>Left: the credits (section 47, plain text), then a WorkerStatusChip only for running, needs-you and failed (HEADER_STATUS). Right, in reading order: New chat (edit, tooltip), More (V3 keeps Help beside it).</li>
            <li>Signed out it shows the brand only. Signed in there is no brand: the window's title bar carries it.</li>
          </ul>
          <G.StateGrid wide states={[
            { label: 'Signed out (brand only)', node: <Bar signedIn={false} /> },
            { label: 'Signed in, nothing happening', note: 'a quiet status (here scheduled) is not drawn: Home says it', node: <Bar status="scheduled" statusLabel="Next run 11 am" /> },
            { label: 'Worker running', node: <Bar status="running" /> },
            { label: 'The worker needs you', node: <Bar status="needs-you" /> },
            { label: 'Today didn’t finish', note: 'opens that run, or Retry', node: <Bar status="failed" /> },
            { label: 'Out of credits', note: 'the credits’ dot says it; no chip', node: <Bar credits={0} /> },
            { label: 'Menu open (More)', note: 'keyboard: Down opens, arrows move, Esc returns focus to the button', node: <Bar openMenu="more" room /> },
          ]} />
          <G.CompareRow
            v2={<G.FrameState url="index.html?start=worker" label="V2 header, signed in" height={900} />}
            system={<Bar status="running" />}
            changed="V2 gave its loudest slot, the only filled control in the chrome, to a 'New Chat' pill, while the worker's run appeared nowhere in the header. The system leads with the credits as plain text, shows the worker only while it is live or needs the partner (WorkerStatusChip), makes New chat a quiet icon button, keeps the hairline and drops all three gradients." />
          <G.SpecDrawer rows={[
            { part: 'Height', token: '--v2-topbar-h', value: '52px', ref: 'shell.topbar.bar' },
            { part: 'Surface and edge', token: '--v2-surface, --v2-line', value: '#ffffff, 1px rgba(0,0,0,0.10) bottom', ref: 'shell.topbar.bar' },
            { part: 'Padding', token: '--v2-gutter, --v2-space-3', value: '0 12 0 16', ref: 'shell.topbar.bar' },
            { part: 'Layer', token: '--v2-z-header', value: '20', ref: 'shell.topbar.z' },
            { part: 'Cluster gap', token: '--v2-space-1, --v2-space-05', value: '4px between credits and chip, 2px between icon buttons' },
            { part: 'Icon buttons', token: 'IconButton 32 (section 11)', value: '32 target, 20 glyph, ink-3', ref: 'shell.topbar.icon-btn' },
            { part: 'New chat', token: 'IconButton 32, edit', value: 'icon button with a "New chat" tooltip, not a filled pill', ref: ['shell.topbar.new-chat', 'shell.topbar.new-chat-label', 'shell.topbar.new-chat-hover'] },
            { part: 'Signed out', token: 'signedIn false', value: 'brand only', ref: 'shell.topbar.signed-out' },
            { part: 'Long status label', token: 'WorkerStatusChip label', value: 'the one part that shrinks: it ends in an ellipsis and keeps the full words in its accessible name; credits, New chat, Help and More never move out' },
          ]} />
          <G.DoDont
            do={['Lead with the credits; show the worker only while it is live or needs the partner.', 'Check the bar at 419 wide with “Didn’t finish” and 4-digit credits.']}
            dont={['Put a quiet state (next run, day in, verified, set up) in the bar.', 'Outline the credits or add a filled button.', 'Show the clusters when signed out.']} />
        </G.Part>

        <G.Part name="WorkerStatusChip" status="new" role="Today's run in one glance, in the chrome on every screen; opens today's run.">
          <G.Note><strong>Why the product needs it.</strong> The partner opens BlueAI to check one thing: did today's run happen, and does the day count. In V2 that state lives only inside the chat thread, a taskbar flash and an 8 second Windows toast. One chip in the top bar answers it on every screen and leads to the place to act.</G.Note>
          <G.StateGrid states={CHIP_STATES.map(function (s) {
            return { label: (s[0] === 'needs-you' ? 'needs you' : s[0]) + (s[0] === 'paused' && chipLabel(s) !== 'Paused' ? ' (update)' : ''), note: 'opens ' + s[3], node: <Chip status={s[0]} label={chipLabel(s)} /> };
          }).concat([
            { label: 'signed out', note: 'not rendered', node: <span className="g-muted">(nothing)</span> },
            { label: 'hover', node: <Chip status="scheduled" label="Next run 11 am" className="is-hover" /> },
            { label: 'focus-visible', node: <Chip status="scheduled" label="Next run 11 am" className="is-focus" /> },
            { label: 'pressed', node: <Chip status="scheduled" label="Next run 11 am" className="is-active" /> },
          ])} />
          <div className="g-table-wrap">
            <table className="g-table">
              <thead><tr><th scope="col">Status</th><th scope="col">Label</th><th scope="col">From the Worker record</th><th scope="col">Opens</th></tr></thead>
              <tbody>{CHIP_STATES.map(function (s) { return <tr key={s[1]}><td><code className="g-code">{s[0]}</code></td><td>{s[1]}</td><td>{s[2]}</td><td>{s[3]}</td></tr>; })}</tbody>
            </table>
          </div>
          <G.SpecDrawer rows={[
            { part: 'Height and target', token: '--v2-control-sm, --v2-hit-min', value: '28 visible, 32 target' },
            { part: 'Shape', token: '--v2-radius-pill, --v2-line', value: 'pill, 1px hairline, surface' },
            { part: 'Label', token: '--v2-text-13, --v2-weight-medium', value: '13/500 ink-2, one line' },
            { part: 'Dot', token: '--v2-space-2', value: '8: ink-4 scheduled / not counted / didn’t start; blue running; pending (done, not yet verified): blue ring, the DayBar’s pending look; verified: success; attention needs you; danger failed / can’t run; ink-4 ring paused / offline / stopped / waiting for credits / period ended' },
            { part: 'Needs you', token: '--v2-attention-tint, -line, -ink', value: 'yellow tint: the one state that asks for the partner' },
            { part: 'Didn’t finish, Can’t run', token: '--v2-danger-tint, --v2-danger-ink', value: 'red tint: the day can still count once it is fixed' },
            { part: 'Hover / press', token: '--v2-line-hover, --v2-wash-hover, --v2-wash-press', value: 'line firms, wash layers on the fill' },
            { part: 'Screen readers', token: 'v2-sr-only', value: '"Today’s run: Needs you"' },
          ]} />
          <G.DoDont
            do={['Use the same words as the tray status line and the WorkerCard.', 'Lead to where the partner can act, with the deadline when there is one.']}
            dont={['Make the chip a verb: it names the state; the run holds the action.', 'Animate the running dot: nothing loops unattended.']} />
        </G.Part>

        <G.Part name="BrandMark" status="changed" role="The BlueAI mark and wordmark, the word in ink (V3 restyle).">
          <G.StateGrid states={[
            { label: 'Mark + wordmark, 24', note: 'top bar', node: <K.BrandMark size={24} /> },
            { label: 'Mark only, 24', note: 'tight places; alt "BlueAI"', node: <K.BrandMark size={24} wordmark={false} /> },
            { label: 'Stacked, 48', note: 'splash', node: <K.BrandMark size={48} /> },
          ]} />
          <G.CompareRow
            v2={<G.FrameState url="index.html?start=worker" label="V2 lockup: logo 32, wordmark 22/700" height={900} />}
            system={<K.BrandMark size={24} />}
            changed="V2's bar runs the cyan-to-violet gradient three times in 419px: the wordmark, a ring around the credits pill and the credits number. The wordmark goes to ink (V3 restyle) and the credits chip goes back to ink with its star glyph (section 47). The lockup drops to 24 + 16/600 so the status chip fits beside it." />
          <G.SpecDrawer rows={[
            { part: 'Logo', token: '--v2-icon-lg', value: '24px (48 on the splash)', ref: 'shell.topbar.logo' },
            { part: 'Wordmark', token: '--v2-text-16, --v2-weight-semibold', value: '16/600, -0.01em', ref: 'shell.topbar.wordmark' },
            { part: 'Word fill', token: '--v2-brand-word-fill', value: 'ink in Target; the brand gradient in V2 today', ref: 'shell.topbar.wordmark-gradient' },
            { part: 'Credits ring', token: 'removed', value: 'hairline chip instead', ref: 'shell.topbar.credits-ring' },
            { part: 'Credits number', token: '--v2-ink', value: 'ink, not gradient', ref: 'shell.topbar.credits-number' },
          ]} />
          <G.Warn>Decision D8 (the family mark): the onBlue site uses a blue spark, not this logo. If the PM moves the product to the site's mark, only BrandMark changes.</G.Warn>
        </G.Part>

        <G.Part name="Help and more menus" status="changed" role="Two menus off the top bar: help when something looks wrong, and the account and money doors.">
          <MenuTable />
          <G.CompareRow
            v2={<G.FrameState url="index.html?start=worker" label="V2 menus: open the ? and the three dots" height={900} />}
            system={<Bar status="scheduled" statusLabel="Next run 11 am" openMenu="help" room />}
            changed="V2's two menus close only on an outside mousedown (no Esc, no arrows, no aria-expanded), set hover from mouse handlers, and two of their six rows do nothing. They become two Menus (section 27) with real destinations, the site's words (Sign out, Report a problem) and one Earnings URL. Activity is a tab, so the menu does not repeat it; Notifications, which has no other door, takes its place." />
          <G.SpecDrawer rows={[
            { part: 'Panel', token: 'Menu (section 27)', value: '--v2-shadow-1, --v2-radius-md, hairline', ref: 'shell.topbar.menu-panel' },
            { part: 'Row hover', token: '--v2-wash-hover (CSS)', value: 'no mouse handlers', ref: 'shell.topbar.menu-hover' },
            { part: 'Keyboard', token: 'role menu, aria-expanded', value: 'arrows, Home / End, Esc returns focus', ref: 'shell.topbar.mouse-only' },
            { part: 'Triggers', token: 'IconButton label', value: '"Help", "More"', ref: ['shell.topbar.help-aria', 'shell.topbar.more-aria'] },
          ]} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('top-bar', TopBarSection);
})();
