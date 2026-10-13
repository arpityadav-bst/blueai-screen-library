/* BlueAI Product V2 Design System: navigation (sections 31 and 32).
   BottomNav     56 tall, three places that match the concept: Home (the worker, today, progress),
                 Activity (runs and verification), Settings (worker first). Chat is reached from
                 Home; a fourth Chat item exists only if the PM decides so (D12).
                 Props: items [{ id, label, icon, badge }] (default NAV_ITEMS), value (the lit id,
                 which stays the parent tab while a pushed screen is open), onChange(id),
                 ariaLabel, className. Item ids accept .is-hover / .is-focus forcing via
                 forceState { [id]: 'hover' | 'focus' } for guide specimens.
   ScreenHeader  one title band for every screen. Props: title, onBack (shows Back), trailing (an
                 IconButton or a small Button), titleId, className. The title is the focus target
                 when a screen is pushed (tabIndex -1).
   NAV_ITEMS, NAV_ITEMS_WITH_CHAT  the default item lists. */
(function () {
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function icon(name, size) {
    const I = window.V2Kit && window.V2Kit.Icon;
    return I ? <I name={name} size={size || 20} /> : null;
  }

  const NAV_ITEMS = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'activity', label: 'Activity', icon: 'activity' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];
  // Decision D12: only if the PM keeps chat as a tab.
  const NAV_ITEMS_WITH_CHAT = [NAV_ITEMS[0], { id: 'chat', label: 'Chat', icon: 'chat' }, NAV_ITEMS[1], NAV_ITEMS[2]];

  function BottomNav({ items, value, onChange, ariaLabel, forceState, className }) {
    const list = items || NAV_ITEMS;
    const force = forceState || {};
    return (
      <nav className={cx('v2-nav', className)} aria-label={ariaLabel || 'Main'}>
        {list.map(function (it) {
          const on = it.id === value;
          const badge = typeof it.badge === 'number' && it.badge > 0 ? it.badge : null;
          return (
            <button key={it.id} type="button"
              className={cx('v2-nav-item', on && 'is-selected', force[it.id] === 'hover' && 'is-hover', force[it.id] === 'focus' && 'is-focus')}
              aria-current={on ? 'page' : undefined}
              onClick={function () { if (onChange) onChange(it.id); }}>
              <span className="v2-nav-icon">
                {icon(it.icon, 20)}
                {badge ? <span className="v2-nav-badge" aria-hidden="true">{badge > 9 ? '9+' : badge}</span> : null}
              </span>
              <span className="v2-nav-label">{it.label}</span>
              {badge ? <span className="v2-sr-only">, {badge} new</span> : null}
            </button>
          );
        })}
      </nav>
    );
  }

  function BackButton({ onBack }) {
    const IB = window.V2Kit && window.V2Kit.IconButton;
    if (IB) return <IB icon="back" label="Back" size={32} onClick={onBack} />;
    return <button type="button" className="v2-topbar-btn" aria-label="Back" onClick={onBack}>{icon('back', 20)}</button>;
  }

  function ScreenHeader({ title, onBack, trailing, titleId, className }) {
    return (
      <div className={cx('v2-screen-header', onBack && 'v2-screen-header--back', className)}>
        {onBack ? <BackButton onBack={onBack} /> : null}
        <h1 className="v2-screen-title" id={titleId} tabIndex={-1}>{title}</h1>
        {trailing ? <div className="v2-screen-header-trailing">{trailing}</div> : null}
      </div>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { BottomNav, ScreenHeader, NAV_ITEMS, NAV_ITEMS_WITH_CHAT });
})();
