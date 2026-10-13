/* BlueAI Product V2 Design System: the top bar (section 30).
   TopBar            52 tall: BrandMark left; WorkerStatusChip, credits, Help and More menus right.
                     Props: signedIn, status (a WorkerStatusChip status) or null, statusLabel,
                     credits (number, or { balance, state } for V2Kit.CreditsChip), onOpenStatus,
                     onOpenCredits, helpItems, moreItems (Menu items; default: topBarMenus(onAction)),
                     onAction(id) for the default items, openMenu ('help' | 'more': guide specimens).
   WorkerStatusChip  today's run, said once in the chrome. Props: status (scheduled | running |
                     needs-you | done | failed | paused | offline), label, onClick, className.
                     Opens today's run. Renders nothing for any other status (signed out).
   BrandMark         the BlueAI mark, with or without the wordmark. Props: size (24 | 48), wordmark.
   topBarMenus(onAction)  the default Help and More items (Earnings reads V2Kit.EARNINGS_URL).
   New chat is not here: it lives in the chat screen's own header (section 32). */
(function () {
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function icon(name, size) {
    const I = window.V2Kit && window.V2Kit.Icon;
    return I ? <I name={name} size={size || 20} /> : null;
  }

  // The site's FAQ (onblue/apply.html:1576 links index.html#faqs), on the same stand-in host as the
  // one Earnings URL, which kit/worker-data.jsx owns (P2: one Earnings URL for the whole product).
  const SITE_FAQ_URL = 'https://blueai-screen-library.vercel.app/experiments/onblue-vesper/index.html#faqs';

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

  // Status words are proposed copy except 'Didn’t finish', which echoes the PM's toast
  // ('Today’s job didn’t finish.'). Callers pass the real label: 'Next run 11 am', 'Day 7 of 20'.
  const STATUS = {
    scheduled: 'Scheduled',
    running: 'Running',
    'needs-you': 'Needs you',
    done: 'Done today',
    failed: 'Didn’t finish',
    paused: 'Paused',
    offline: 'Offline',
  };

  function WorkerStatusChip({ status, label, onClick, className }) {
    if (!STATUS[status]) return null;
    return (
      <button type="button" className={cx('v2-status', 'v2-status--' + status, className)} onClick={onClick}>
        <span className="v2-sr-only">Today’s run: </span>
        <span className={cx('v2-status-dot', 'v2-status-dot--' + status)} aria-hidden="true" />
        <span className="v2-status-label">{label || STATUS[status]}</span>
      </button>
    );
  }

  function topBarMenus(onAction) {
    const act = function (id) { return function () { if (onAction) onAction(id); }; };
    return {
      help: [
        { icon: 'help', label: 'FAQ', href: SITE_FAQ_URL, external: true },
        { icon: 'alert', label: 'Report a problem', onSelect: act('report') },
      ],
      more: [
        { icon: 'bell', label: 'Notifications', onSelect: act('notifications') },
        { icon: 'user', label: 'Account', onSelect: act('account') },
        { icon: 'earnings', label: 'Earnings', href: (window.V2Kit || {}).EARNINGS_URL, external: true },
        { separator: true },
        { icon: 'sign-out', label: 'Sign out', onSelect: act('sign-out') },
      ],
    };
  }

  // Icon button for the bar: the kit's IconButton when loaded, a plain labelled button otherwise.
  // Spreads the trigger props V2Kit.Menu hands its render prop (aria-haspopup, aria-expanded,
  // aria-controls, onClick); active mirrors aria-expanded so the open menu's button stays lit.
  function BarButton(props) {
    const IB = window.V2Kit && window.V2Kit.IconButton;
    const rest = Object.assign({}, props);
    delete rest.icon; delete rest.label; delete rest.active;
    if (IB) return <IB icon={props.icon} label={props.label} size={32} active={props.active} {...rest} />;
    return <button type="button" className="v2-topbar-btn" aria-label={props.label} {...rest}>{icon(props.icon, 20)}</button>;
  }

  function BarMenu({ icon: name, label, items, open }) {
    const M = window.V2Kit && window.V2Kit.Menu;
    const trigger = function (t) {
      const p = t && typeof t === 'object' ? t : {};
      return <BarButton icon={name} label={label} active={!!p['aria-expanded']} {...p} />;
    };
    if (!M) return trigger(null);
    return <M items={items} align="end" placement="down" label={label} trigger={trigger} defaultOpen={!!open} />;
  }

  function Credits({ credits, onOpenCredits }) {
    const c = credits && typeof credits === 'object' ? credits : { balance: credits };
    const Chip = window.V2Kit && window.V2Kit.CreditsChip;
    if (Chip) return <Chip balance={c.balance} state={c.state} onClick={onOpenCredits} />;
    return (
      <button type="button" className="v2-status" onClick={onOpenCredits}>
        <span className="v2-status-label">{Number(c.balance || 0).toLocaleString('en-US')}</span>
        <span className="v2-sr-only"> AI credits left today</span>
      </button>
    );
  }

  function TopBar({ signedIn, status, statusLabel, credits, onOpenStatus, onOpenCredits, helpItems, moreItems, onAction, openMenu }) {
    const menus = topBarMenus(onAction);
    return (
      <header className={cx('v2-topbar', !signedIn && 'v2-topbar--signed-out')}>
        <BrandMark size={24} />
        {signedIn ? (
          <div className="v2-topbar-actions">
            {status ? <WorkerStatusChip status={status} label={statusLabel} onClick={onOpenStatus} /> : null}
            {credits != null ? <Credits credits={credits} onOpenCredits={onOpenCredits} /> : null}
            <div className="v2-topbar-menus">
              <BarMenu icon="help" label="Help" items={helpItems || menus.help} open={openMenu === 'help'} />
              <BarMenu icon="more" label="More" items={moreItems || menus.more} open={openMenu === 'more'} />
            </div>
          </div>
        ) : null}
      </header>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { TopBar, WorkerStatusChip, BrandMark, topBarMenus, SITE_FAQ_URL });
})();
