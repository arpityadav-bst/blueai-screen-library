/* BlueAI Product V2 Design System: Toast, ToastHost, ToastRegion, useToast on window.V2Kit.
   Styles: kit/overlays.css. Spec: design-md/24-toast.md.

   The in-app confirmation of something the partner just did, with the one follow-up that matters
   (Undo, Try again). It is not the Windows notification (desktop_toast.jsx), which reaches a
   partner who is not looking at BlueAI: a toast only ever confirms an action taken in this window.

   ToastHost   {offset 'nav' | 'none', region, className, children}  holds the one toast and
               provides useToast(). It draws its own live region (bottom centre, above the bottom
               nav; 'none': 16px above the window's bottom edge) unless region={false}: then the
               AppFrame inside it draws the region in the window (kit/shell.jsx). AppFrame mounts
               its own host when there is none above it. One toast at a time: a new one replaces
               the current one (a 419px window cannot stack).
   ToastRegion {offset, className}  two always-mounted live regions, polite and assertive, with
               the current toast in the one its tone needs (an error goes to the assertive one).
               AppFrame renders it; screens never do.
   useToast()  {show(opts) -> id, update(id, opts), dismiss(id?)}
               opts: {tone 'success' | 'info' | 'error' | 'loading', title, action {label, onClick},
               duration ms}. A toast with an action never times out: it stays until Dismiss, its
               action, the next toast, or the screen that showed it calls dismiss() on leaving, so
               Undo and Try again can be reached by keyboard and screen reader at any pace (WCAG
               2.2.1). Without an action: LIFETIME.plain, LIFETIME.error for an error; loading stays
               until update() turns it into its result in place.
   useToastHost()  the host's api, or null when no ToastHost is above (AppFrame reads it).
   Toast       {tone, title, action, duration, leaving, onClose, className}  the presentational
               part. duration 0 shows it without a timer (guide specimens).
   The timer is a CSS animation on an invisible element, so pausing on hover and on keyboard focus
   is a CSS state (.v2-toast:hover, :focus-within, .is-paused), like every other state in the kit. */
(function () {
  const { useState, useEffect, useMemo, useContext, createContext } = React;
  const LEAVE_MS = 120; // --v2-dur-1: departures run one step shorter than the --v2-dur-2 arrival
  // Fixed internals (section 24): how long a toast without an action stays.
  const LIFETIME = { plain: 4000, error: 8000 };
  const ICON = { success: 'check-circle', info: 'info', error: 'alert' };
  const ApiCtx = createContext(null);
  const ToastCtx = createContext(null);
  let seq = 0;
  let warned = false;

  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function msFor(p) {
    if (p.duration != null) return p.duration;
    if (p.tone === 'loading' || p.action) return 0;
    return p.tone === 'error' ? LIFETIME.error : LIFETIME.plain;
  }

  function Toast(p) {
    const K = window.V2Kit;
    const tone = (ICON[p.tone] || p.tone === 'loading') ? p.tone : 'success';
    const ms = msFor(Object.assign({}, p, { tone: tone }));
    const timed = ms > 0 && isFinite(ms) && !p.leaving;
    function close(why) { if (p.onClose) p.onClose(why); }
    const icon = tone === 'loading' ? <K.Spinner size={16} delay={0} /> : <K.Icon name={ICON[tone]} size={16} />;
    return (
      <div className={cx('v2-toast', 'v2-toast--' + tone, p.leaving && 'is-leaving', p.className)}
        style={timed ? { '--toast-ms': ms + 'ms' } : undefined}>
        <span className="v2-toast-icon">{icon}</span>
        <span className="v2-toast-title">{p.title}</span>
        {p.action ? (
          <button type="button" className="v2-toast-action"
            onClick={function (e) { if (p.action.onClick) p.action.onClick(e); close('action'); }}>{p.action.label}</button>
        ) : null}
        {p.onClose ? <K.IconButton icon="close" label="Dismiss" size={32} onClick={function () { close('close'); }} className="v2-toast-close" /> : null}
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

  /* Two live regions, both always mounted: a region added together with its content is not
     announced, and switching aria-live on a node that already holds the toast is not reliable.
     The current toast goes into the one that matches its tone (an error into the assertive one). */
  function ToastRegion({ offset, className }) {
    const api = useContext(ApiCtx);
    const t = useContext(ToastCtx);
    const node = t && api ? (
      <Toast key={t.id} tone={t.tone} title={t.title} action={t.action} duration={t.duration}
        leaving={t.leaving} timerKey={t.rev} onClose={function () { api.dismiss(t.id); }} />
    ) : null;
    const urgent = !!(t && t.tone === 'error');
    return (
      <div className={cx('v2-toast-host', offset === 'none' && 'v2-toast-host--flush', className)}>
        <div className="v2-toast-live" aria-live="polite" aria-atomic="true">{urgent ? null : node}</div>
        <div className="v2-toast-live" aria-live="assertive" aria-atomic="true">{urgent ? node : null}</div>
      </div>
    );
  }

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
      }, window.V2Kit.reducedMotion() ? 0 : LEAVE_MS);
      return function () { clearTimeout(timer); };
    }, [leavingId]);
    return (
      <ApiCtx.Provider value={api}>
        <ToastCtx.Provider value={t}>
          {p.children}
          {p.region === false ? null : <ToastRegion offset={p.offset} className={p.className} />}
        </ToastCtx.Provider>
      </ApiCtx.Provider>
    );
  }

  function useToast() { return useContext(ApiCtx) || NOOP; }
  function useToastHost() { return useContext(ApiCtx); }

  Object.assign(window.V2Kit = window.V2Kit || {}, { Toast, ToastHost, ToastRegion, useToast, useToastHost });
})();
