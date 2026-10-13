/* BlueAI Product V2 Design System: Tabs and TabPanel on window.V2Kit. Styles: kit/overlays.css.
   Spec: design-md/28-tabs.md.

   Sibling views of one screen (Activity: This program / Past; Notifications: All / Unread), in the
   onBlue family's recessed track with one raised chip (onblue/apply.html:443-475). Tabs switch a
   view inside a screen; they never navigate between screens (that is BottomNav).

   Tabs      {tabs [{id, label, count, disabled, className}], value, onChange(id), ariaLabel, idBase,
             full, className}  count renders even at 0, so a tab never changes width when it empties.
             Keyboard: one tab stop (the selected tab); Left / Right move and select (wrapping, disabled
             tabs skipped), Home / End jump. full stretches the track to its container.
   TabPanel  {idBase, id, hidden, className, children}  the view a tab controls; pass the same idBase
             to both so aria-controls and aria-labelledby resolve. */
(function () {
  const { useRef, useId } = React;

  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }

  function Tabs(p) {
    const auto = useId();
    const base = p.idBase || auto;
    const list = useRef(null);
    const tabs = p.tabs || [];
    const enabled = tabs.filter(function (t) { return !t.disabled; });
    const current = enabled.some(function (t) { return t.id === p.value; }) ? p.value : (enabled[0] && enabled[0].id);

    function go(id) {
      if (id !== p.value && p.onChange) p.onChange(id);
      const el = list.current && list.current.querySelector('[data-tab="' + id + '"]');
      if (el) el.focus();
    }
    function onKey(e) {
      if (!enabled.length) return;
      const at = enabled.findIndex(function (t) { return t.id === e.target.getAttribute('data-tab'); });
      const i = at < 0 ? 0 : at;
      let next = null;
      if (e.key === 'ArrowRight') next = enabled[(i + 1) % enabled.length];
      else if (e.key === 'ArrowLeft') next = enabled[(i - 1 + enabled.length) % enabled.length];
      else if (e.key === 'Home') next = enabled[0];
      else if (e.key === 'End') next = enabled[enabled.length - 1];
      if (next) { e.preventDefault(); go(next.id); }
    }

    return (
      <div ref={list} role="tablist" aria-label={p.ariaLabel} onKeyDown={onKey}
        className={cx('v2-tabs', p.full && 'v2-tabs--full', p.className)}>
        {tabs.map(function (t) {
          const on = t.id === p.value;
          return (
            <button key={t.id} type="button" role="tab" data-tab={t.id}
              id={base + '-tab-' + t.id} aria-controls={base + '-panel-' + t.id}
              aria-selected={on} tabIndex={t.id === current ? 0 : -1} disabled={t.disabled}
              className={cx('v2-tab', on && 'is-selected', t.className)}
              onClick={function () { if (!on && p.onChange) p.onChange(t.id); }}>
              <span className="v2-tab-label">{t.label}</span>
              {t.count != null ? <span className="v2-tab-count">{t.count}</span> : null}
            </button>
          );
        })}
      </div>
    );
  }

  function TabPanel(p) {
    return (
      <div role="tabpanel" id={p.idBase + '-panel-' + p.id} aria-labelledby={p.idBase + '-tab-' + p.id}
        tabIndex={0} hidden={p.hidden} className={cx('v2-tabpanel', p.className)}>
        {p.children}
      </div>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { Tabs, TabPanel });
})();
