/* BlueAI Product V2 Design System: navigation (sections 31 and 32).
   BottomNav     56 tall, three places that match the concept: Home (the worker, today, progress),
                 Activity (runs and verification), Settings (worker first). Chat is reached from
                 Home; a fourth Chat item exists only if the PM decides so (D12).
                 Props: items [{ id, label, icon, badge }] (default NAV_ITEMS), value (the lit id,
                 which stays the parent tab while a pushed screen is open), onChange(id),
                 ariaLabel, className. Item ids accept .is-hover / .is-focus forcing via
                 forceState { [id]: 'hover' | 'focus' } for guide specimens.
   ScreenHeader  one title band for every screen. Props: title, onBack (shows Back), trailing (an
                 IconButton or a small Button), titleId, focusOnMount, className. The title (the
                 .v2-text-title-lg role, tabIndex -1) is the focus target. With onBack it takes
                 focus when it opens, so a screen reader says where the partner landed, but only
                 when the push came from inside this window (the pushing control holds focus, or
                 went away with the screen it sat on); a specimen mounting beside someone's focus
                 never takes it. Back returns focus to the pushing control: the same element if it
                 is still there (a top bar button), else the control with its name in the window
                 Back lands in, else that screen's title. focusOnMount true takes focus whatever
                 held it (an in-place swap that removes the focused control); false never does.
   NAV_ITEMS, NAV_ITEMS_WITH_CHAT  the default item lists. */
(function () {
  const { useRef, useEffect } = React;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function icon(name, size) {
    const I = window.V2Kit.Icon;
    return <I name={name} size={size || 20} />;
  }

  // The last control focused anywhere, and whether it sat in a product window (.v2-frame). A pushed
  // screen reads it on mount: the control that pushed it has just gone, so focus is on the page.
  let last = null, lastInFrame = false;
  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('focusin', function (e) {
      last = e.target;
      lastInFrame = !!(last && last.closest && last.closest('.v2-frame'));
    }, true);
  }
  const nameOf = function (el) { return el && el.getAttribute ? (el.getAttribute('aria-label') || el.textContent || '').trim() : ''; };
  const focus = function (el) { window.V2Kit.focusEl(el); };
  function returnFocus(from) {
    if (from.el && from.el.isConnected) return focus(from.el);
    if (!from.root || !from.root.isConnected) return;
    const named = Array.prototype.find.call(from.root.querySelectorAll('button, a[href], [role="tab"]'), function (el) {
      return !!from.name && nameOf(el) === from.name;
    });
    focus(named || from.root.querySelector('.v2-screen-title'));
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

  function ScreenHeader({ title, onBack, trailing, titleId, focusOnMount, className }) {
    const K = window.V2Kit;
    const h1 = useRef(null);
    const from = useRef(null);
    useEffect(function () {
      const el = h1.current;
      if (!el || focusOnMount === false || !(focusOnMount || onBack)) return;
      const frame = el.closest('.v2-frame');
      const ae = document.activeElement;
      const held = !!(frame && ae && ae !== el && frame.contains(ae));
      const dropped = !!(frame && last && !last.isConnected && lastInFrame);
      if (!focusOnMount && !held && !dropped) return;
      const src = held ? ae : last;
      from.current = { el: src, name: nameOf(src), root: frame ? frame.parentNode : null };
      focus(el);
    }, [focusOnMount]);
    function back(e) {
      const f = from.current;
      const me = h1.current;
      if (onBack) onBack(e);
      if (!f) return;
      const later = window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function (fn) { setTimeout(fn, 0); };
      later(function () { if (!me || !me.isConnected) returnFocus(f); });
    }
    return (
      <div className={cx('v2-screen-header', onBack && 'v2-screen-header--back', className)}>
        {onBack ? <K.IconButton icon="back" label="Back" size={32} onClick={back} /> : null}
        <h1 className="v2-screen-title v2-text-title-lg" id={titleId} tabIndex={-1} ref={h1}>{title}</h1>
        {trailing ? <div className="v2-screen-header-trailing">{trailing}</div> : null}
      </div>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { BottomNav, ScreenHeader, NAV_ITEMS, NAV_ITEMS_WITH_CHAT });
})();
