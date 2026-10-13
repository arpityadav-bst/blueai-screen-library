/* BlueAI Product V2 Design System: Toast, ToastHost, useToast on window.V2Kit.
   Styles: kit/overlays.css. Spec: design-md/24-toast.md.

   The in-app confirmation of something the partner just did, with the one follow-up that matters
   (Undo, Try again). It is not the Windows notification (desktop_toast.jsx), which reaches a
   partner who is not looking at BlueAI: a toast only ever confirms an action taken in this window.

   ToastHost  {offset 'nav' | 'none', className, children}  wrap the app content in it (or mount it
              in AppFrame's overlays). It provides useToast() and draws one polite live region,
              bottom centre, above the bottom nav ('none': 16px above the window's bottom edge).
              One toast at a time: a new one replaces the current one (a 419px window cannot stack).
   useToast() {show(opts) -> id, update(id, opts), dismiss(id?)}
              opts: {tone 'success' | 'info' | 'error' | 'loading', title, action {label, onClick},
              duration ms}. Defaults: 4s; 6s with an action; 8s for an error; loading stays until
              update() turns it into its result in place.
   Toast      {tone, title, action, duration, leaving, onClose, className}  the presentational part
              ToastHost renders. duration 0 shows it without a timer (guide specimens).
   The timer is a CSS animation on an invisible element, so pausing on hover and on keyboard focus
   is a CSS state (.v2-toast:hover, :focus-within, .is-paused), like every other state in the kit. */
(function () {
  const { useState, useEffect, useMemo, useContext, createContext } = React;
  const LEAVE_MS = 120; // --v2-dur-1: departures run one step shorter than the --v2-dur-2 arrival
  const ICON = { success: 'check-circle', info: 'info', error: 'alert' };
  const Ctx = createContext(null);
  let seq = 0;
  let warned = false;

  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function msFor(p) {
    if (p.duration != null) return p.duration;
    if (p.tone === 'loading') return 0;
    if (p.tone === 'error') return 8000;
    return p.action ? 6000 : 4000;
  }

  function Close({ onClick }) {
    const K = window.V2Kit || {};
    if (K.IconButton) return <K.IconButton icon="close" label="Dismiss" size={32} onClick={onClick} className="v2-toast-close" />;
    return (
      <button type="button" className="v2-toast-close v2-ov-close--plain" aria-label="Dismiss" onClick={onClick}>
        {K.Icon ? <K.Icon name="close" size={16} /> : null}
      </button>
    );
  }

  function Toast(p) {
    const K = window.V2Kit || {};
    const tone = (ICON[p.tone] || p.tone === 'loading') ? p.tone : 'success';
    const ms = msFor(Object.assign({}, p, { tone: tone }));
    const timed = ms > 0 && isFinite(ms) && !p.leaving;
    function close(why) { if (p.onClose) p.onClose(why); }
    let icon = null;
    if (tone === 'loading') icon = K.Spinner ? <K.Spinner size={16} delay={0} /> : null;
    else if (K.Icon) icon = <K.Icon name={ICON[tone]} size={16} />;
    return (
      <div className={cx('v2-toast', 'v2-toast--' + tone, p.leaving && 'is-leaving', p.className)}
        style={timed ? { '--toast-ms': ms + 'ms' } : undefined}>
        <span className="v2-toast-icon">{icon}</span>
        <span className="v2-toast-title">{p.title}</span>
        {p.action ? (
          <button type="button" className="v2-toast-action"
            onClick={function (e) { if (p.action.onClick) p.action.onClick(e); close('action'); }}>{p.action.label}</button>
        ) : null}
        {p.onClose ? <Close onClick={function () { close('close'); }} /> : null}
        {timed ? (
          <span key={p.timerKey || 0} className="v2-toast-timer" aria-hidden="true"
            onAnimationEnd={function (e) { if (e.target === e.currentTarget) close('timeout'); }} />
        ) : null}
      </div>
    );
  }

  const NOOP = {
    show: function () {
      if (!warned && window.console) { warned = true; console.warn('[V2Kit.useToast] no ToastHost above this part; the toast was not shown.'); }
      return 0;
    },
    update: function () {},
    dismiss: function () {},
  };

  function ToastHost(p) {
    const [t, setT] = useState(null);
    const api = useMemo(function () {
      return {
        show: function (o) {
          seq += 1;
          const id = seq;
          setT(Object.assign({}, o, { id: id, rev: 0, leaving: false }));
          return id;
        },
        update: function (id, o) {
          setT(function (c) { return c && c.id === id ? Object.assign({}, c, o, { rev: c.rev + 1, leaving: false }) : c; });
        },
        dismiss: function (id) {
          setT(function (c) { return c && (id == null || c.id === id) ? Object.assign({}, c, { leaving: true }) : c; });
        },
      };
    }, []);
    const leavingId = t && t.leaving ? t.id : null;
    useEffect(function () {
      if (leavingId == null) return undefined;
      const timer = setTimeout(function () {
        setT(function (c) { return c && c.id === leavingId && c.leaving ? null : c; });
      }, reducedMotion() ? 0 : LEAVE_MS);
      return function () { clearTimeout(timer); };
    }, [leavingId]);
    return (
      <Ctx.Provider value={api}>
        {p.children}
        <div className={cx('v2-toast-host', p.offset === 'none' && 'v2-toast-host--flush', p.className)}
          aria-live={t && t.tone === 'error' ? 'assertive' : 'polite'} aria-atomic="true">
          {t ? (
            <Toast key={t.id} tone={t.tone} title={t.title} action={t.action} duration={t.duration}
              leaving={t.leaving} timerKey={t.rev} onClose={function () { api.dismiss(t.id); }} />
          ) : null}
        </div>
      </Ctx.Provider>
    );
  }

  function useToast() { return useContext(Ctx) || NOOP; }

  Object.assign(window.V2Kit = window.V2Kit || {}, { Toast, ToastHost, useToast });
})();
