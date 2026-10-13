/* BlueAI Product V2 Design System: settings blocks (section 49).

   SettingsSection     {id? (written as data-section, the routing key), title, description?, action?,
                       highlight?, className, children}
       One card per topic the partner thinks about: title 16/600, optional description 13, an
       optional header control (action), then rows. Pass ListRows directly: they run full-bleed
       and draw their own hairlines; any other block gets one hairline above it. highlight is a
       routing signal: when it turns truthy the section scrolls into view (instantly under
       reduced motion) and holds the highlighted look for 1900ms, V2's timing
       (byok_settings.jsx:47). It never changes a value. Force the look with the class
       is-highlighted for specimens.
   AdvancedDisclosure  {open?, onToggle?, defaultOpen?, label?, description?, className, children}
       The one place developer controls live (AI mode, own key, chat model). Controlled when open
       is passed, otherwise it keeps its own state. A real button with aria-expanded and
       aria-controls; the body stays in the DOM with hidden so the reference always resolves. */
(function () {
  const { useState, useEffect, useRef, useId } = React;
  const cx = function () { return Array.prototype.filter.call(arguments, Boolean).join(' '); };
  const HIGHLIGHT_MS = 1900;

  function Ic({ name, size }) {
    const K = window.V2Kit || {};
    return K.Icon ? <K.Icon name={name} size={size || 16} /> : null;
  }

  function reducedMotion() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }

  function SettingsSection({ id, title, description, action, highlight, className, children }) {
    const ref = useRef(null);
    const hid = useId();
    const [lit, setLit] = useState(false);
    useEffect(function () {
      if (!highlight) return undefined;
      const el = ref.current;
      if (el && el.scrollIntoView) el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' });
      setLit(true);
      const t = setTimeout(function () { setLit(false); }, HIGHLIGHT_MS);
      return function () { clearTimeout(t); };
    }, [highlight]);
    return (
      <section ref={ref} data-section={id} aria-labelledby={hid}
        className={cx('v2-settings-section', lit && 'is-highlighted', className)}>
        <header className="v2-settings-section-head">
          <div className="v2-settings-section-text">
            <h2 id={hid} className="v2-settings-section-title">{title}</h2>
            {description ? <p className="v2-settings-section-desc">{description}</p> : null}
          </div>
          {action ? <div className="v2-settings-section-action">{action}</div> : null}
        </header>
        {children ? <div className="v2-settings-section-body">{children}</div> : null}
      </section>
    );
  }

  function AdvancedDisclosure({ open, onToggle, defaultOpen, label, description, className, children }) {
    const [own, setOwn] = useState(!!defaultOpen);
    const bodyId = useId();
    const isOpen = open != null ? !!open : own;
    function toggle() {
      if (open == null) setOwn(!isOpen);
      if (onToggle) onToggle(!isOpen);
    }
    return (
      <div className={cx('v2-advanced', isOpen && 'is-open', className)}>
        <button type="button" className="v2-advanced-toggle" aria-expanded={isOpen} aria-controls={bodyId} onClick={toggle}>
          <span className="v2-advanced-text">
            <span className="v2-advanced-label">{label || 'Advanced'}</span>
            <span className="v2-advanced-desc">{description || 'AI mode, your own key and the chat model. Most partners never need these.'}</span>
          </span>
          <span className="v2-advanced-chev" aria-hidden="true"><Ic name="chevron-down" size={16} /></span>
        </button>
        <div id={bodyId} className="v2-advanced-body" hidden={!isOpen}>{children}</div>
      </div>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { SettingsSection, AdvancedDisclosure });
})();
