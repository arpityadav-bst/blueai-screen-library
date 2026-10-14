/* BlueAI Product V2 Design System: the top bar (section 30).
   TopBar            52 tall, not worker-centric (2026-10-14: people also use BlueAI for plain chat).
                     Signed in: left, the credits (V2Kit.CreditsChip, plain text) and, only while the
                     worker is live or needs attention (HEADER_STATUS: running, needs-you, failed), a
                     WorkerStatusChip right after them; right, New chat (IconButton 32, 'edit') and one
                     More menu. Quiet states (scheduled, pending, verified, not set up) stay on Home.
                     Signed out: BrandMark only. The brand is the window's title bar's when there is one.
                     Props: signedIn, status (a RUN_STATUS key; shown only if in HEADER_STATUS),
                     statusLabel, credits (number, or { balance, state } for V2Kit.CreditsChip),
                     onOpenStatus, onOpenCredits, onNewChat, moreItems (Menu items; default:
                     topBarMenus(onAction).more), onAction(id) for the default items and New chat
                     ('new-chat') when onNewChat is absent, openMenu ('more'; 'help' opens it too:
                     guide specimens). FAQ and Report a problem sit in More, above the separator.
   WorkerStatusChip  today's run, said once in the chrome. Props: status (a RUN_STATUS key), label,
                     onClick, className. Renders nothing for any other status (signed out). 'done'
                     is read as 'pending': a finished day is pending until verified, so only
                     'verified' is ever green.
   RUN_STATUS        { status: [chip label, tray line] }: the one set of words the chip and the
                     tray menu (section 29) share. Callers pass the real time or count as the label.
   HEADER_STATUS     the statuses the top bar shows: live (running) or needing attention.
   BrandMark         the BlueAI mark, with or without the wordmark. Props: size (24 | 48), wordmark.
   topBarMenus(onAction)  { more }: the default More items (SITE_FAQ_URL, EARNINGS_URL from the
                     Worker record, kit/worker-data.jsx). */
(function () {
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  const K = function () { return window.V2Kit; };

  function BrandMark({ size, wordmark, className }) {
    const lg = size === 48;
    const showWord = wordmark !== false;
    return (
      <span className={cx('v2-brand', lg && 'v2-brand--lg', className)}>
        <img className="v2-brand-logo" src="assets/Logo.png" alt={showWord ? '' : 'BlueAI'} draggable="false"
          onError={function (e) { e.currentTarget.hidden = true; }} />
        {showWord ? <span className="v2-brand-word">BlueAI</span> : null}
      </span>
    );
  }

  /* Proposed copy except 'Didn’t finish', which echoes the PM's toast ('Today’s job didn’t
     finish.'). The dot says the tone (shell.css); the words always say the state. */
  const RUN_STATUS = {
    scheduled: ['Scheduled', 'Next run 11 am'],
    running: ['Running…', 'Running. Leave App Player open until it’s done'],
    'needs-you': ['Needs you', 'A paid job needs your OK by 9 pm'],
    pending: ['Done, pending', 'Done today, pending verification'],
    'not-counted': ['Not counted today', 'Today doesn’t count toward your 20 days'],
    verified: ['Verified', 'All 20 days verified'],
    checking: ['All 20 done', 'All 20 days done. Waiting for the last check'],
    failed: ['Didn’t finish', 'Today’s job didn’t finish. Try again by 9 pm'],
    stopped: ['Stopped', 'You stopped today’s run. Run again by 9 pm'],
    missed: ['Didn’t start', 'Today’s run didn’t start. Run it by 9 pm'],
    blocked: ['Can’t run', 'Today’s run can’t start. Open BlueAI to fix it'],
    'no-credits': ['Waiting for credits', 'Out of AI credits for today’s run'],
    paused: ['Paused', 'Runs paused'],
    offline: ['Offline', 'Offline. Today’s run waits for a connection'],
    ended: ['Period ended', 'This program has ended'],
  };
  const ALIAS = { done: 'pending' };
  function runStatus(s) { return RUN_STATUS[s] ? s : (ALIAS[s] || null); }

  function WorkerStatusChip({ status, label, onClick, className }) {
    const s = runStatus(status);
    if (!s) return null;
    return (
      <button type="button" className={cx('v2-status', 'v2-status--' + s, className)} onClick={onClick}>
        <span className="v2-sr-only">Today’s run: </span>
        <span className={cx('v2-status-dot', 'v2-status-dot--' + s)} aria-hidden="true" />
        <span className="v2-status-label">{label || RUN_STATUS[s][0]}</span>
      </button>
    );
  }

  function topBarMenus(onAction) {
    const act = function (id) { return function () { if (onAction) onAction(id); }; };
    return {
      more: [
        { icon: 'bell', label: 'Notifications', onSelect: act('notifications') },
        { icon: 'user', label: 'Account', onSelect: act('account') },
        { icon: 'earnings', label: 'Earnings', href: K().EARNINGS_URL, external: true },
        { icon: 'help', label: 'FAQ', href: K().SITE_FAQ_URL, external: true },
        { icon: 'alert', label: 'Report a problem', onSelect: act('report') },
        { separator: true },
        { icon: 'sign-out', label: 'Sign out', onSelect: act('sign-out') },
      ],
    };
  }

  // The bar's menus: V2Kit.Menu with the kit IconButton as its trigger. The trigger props the Menu
  // hands its render prop (aria-haspopup, aria-expanded, aria-controls, onClick) are spread on;
  // active mirrors aria-expanded so the open menu's button stays lit.
  function BarMenu({ icon, label, items, open }) {
    const P = K();
    const trigger = function (t) {
      const p = t && typeof t === 'object' ? t : {};
      return <P.IconButton icon={icon} label={label} size={32} {...p} active={!!p['aria-expanded']} />;
    };
    return <P.Menu items={items} align="end" placement="down" label={label} trigger={trigger} defaultOpen={!!open} />;
  }

  const HEADER_STATUS = ['running', 'needs-you', 'failed'];

  function TopBar({ signedIn, status, statusLabel, credits, onOpenStatus, onOpenCredits, onNewChat, moreItems, onAction, openMenu }) {
    const P = K();
    const menus = topBarMenus(onAction);
    const c = credits && typeof credits === 'object' ? credits : { balance: credits };
    const newChat = onNewChat || function () { if (onAction) onAction('new-chat'); };
    return (
      <header className={cx('v2-topbar', !signedIn && 'v2-topbar--signed-out')}>
        {signedIn ? (
          <div className="v2-topbar-lead">
            {credits != null ? <P.CreditsChip balance={c.balance} state={c.state} onClick={onOpenCredits} /> : null}
            {HEADER_STATUS.indexOf(runStatus(status)) >= 0 ? <WorkerStatusChip status={status} label={statusLabel} onClick={onOpenStatus} /> : null}
          </div>
        ) : <BrandMark size={24} />}
        {signedIn ? (
          <div className="v2-topbar-actions">
            <P.IconButton icon="edit" label="New chat" size={32} onClick={newChat} />
            <BarMenu icon="more" label="More" items={moreItems || menus.more} open={openMenu === 'more' || openMenu === 'help'} />
          </div>
        ) : null}
      </header>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { TopBar, WorkerStatusChip, BrandMark, topBarMenus, RUN_STATUS, HEADER_STATUS });
})();
