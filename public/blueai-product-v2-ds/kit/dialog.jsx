/* BlueAI Product V2 Design System: Scrim, Dialog, Sheet on window.V2Kit, plus the two hooks every
   blocking overlay shares. Styles: kit/overlays.css. Spec: design-md/25-dialog.md, 26-sheet.md.

   Overlays live inside the product window, never on the page: each is position: absolute against
   the nearest positioned ancestor, which in the product is AppFrame (its overlay plane), the rule
   V2 already states at blueai/shared.jsx:66-71. Two open dialogs stack by mount order on one
   layer (--v2-z-dialog); the frost gate sits one step up (--v2-z-gate).

   Scrim   {variant 'dim' | 'frost', onClick, className, style}  dim is every dialog and sheet;
           frost is the sign-in gate only (the onBlue gate veil).
   Dialog  {open, onClose, title, description, variant 'task' | 'alert' | 'consent' | 'celebration',
           size 'sm' (320) | 'md' (382), role, dismissible, busy, actions, footer, initialFocus,
           labelledBy, scrim, preview, className, children}
           variant sets the defaults below (role, size, close button, scrim click). actions is
           [{label, onClick, variant 'secondary' | 'primary' | 'danger' | 'quiet', disabled,
           disabledReason}], written secondary first and primary last; a disabled action prints its
           reason under it, as every Button does (P3). busy puts the primary in loading and holds
           Esc, the scrim and the close button, so a slow consent or delete cannot fire twice.
           dismissible={false} blocks: no close button, no Esc, no scrim.
           preview renders it open in place without taking focus (guide specimens only).
   Sheet   {open, onClose, title, description, blocking, busy, actions, footer, initialFocus,
           preview, className, children}  bottom sheet, full window width. blocking: no close,
           no Esc, no scrim dismiss (the Program Terms).
   useFocusTrap(ref, active, {initialFocus, returnFocus, onEscape})  makes the window under the
           overlay inert (every sibling of the overlay and of its ancestors up to the AppFrame:
           top bar, content, nav), moves focus in, keeps Tab inside, and returns focus to the
           opener. Tab, Esc and stray focus are handled at the document, so a click on a scrim
           that does not close cannot strand focus on the page; with two overlays only the top
           one acts. initialFocus is a ref or a selector; without one the panel itself takes
           focus, so nothing draws a ring until the partner presses Tab (the onBlue rule,
           onblue.css:929-942). returnFocus false skips the return; a ref, element or selector
           is where focus goes if the opener is gone, else the opener's nearest surviving
           ancestor's [data-v2-anchor] or first control (an AskCard chip is gone once answered).
   useSwapFocus(target, key)  the in-place swap rule (section 09): when key changes and focus
           was left on the page body, it moves to target (a ref, element or function): the new
           state's anchor (tabIndex -1, data-v2-anchor) or the next control. Real focus stays.
   usePresence(open, ms)  {mounted, closing}: keeps a part mounted while its exit plays. ms
           defaults to --v2-dur-3, read from tokens.css when the exit starts. */
(function () {
  const { useState, useEffect, useLayoutEffect, useRef, useId } = React;
  // Scrims, dialogs and sheets leave in --v2-dur-3, one step faster than they arrive. Read from the
  // token at run time, so a change in tokens.css reaches the unmount timer too (240 if unreadable).
  function exitMs() {
    try {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--v2-dur-3').trim();
      const n = parseFloat(v);
      if (isFinite(n)) return /ms$/.test(v) ? n : (/s$/.test(v) ? n * 1000 : n);
    } catch (e) { /* no stylesheet yet */ }
    return 240;
  }
  const VARIANTS = {
    task: { role: 'dialog', size: 'md', close: true, scrimCloses: true },
    alert: { role: 'alertdialog', size: 'sm', close: false, scrimCloses: false, focusAction: true },
    consent: { role: 'dialog', size: 'md', close: true, scrimCloses: false },
    celebration: { role: 'dialog', size: 'sm', close: false, scrimCloses: true, center: true },
  };

  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  // The kit's one focus and motion toolkit (FOCUSABLE, focusEl, reducedMotion) lives in kit/menu.jsx,
  // which loads after this file: read it at call time, never at load.
  const KT = function () { return window.V2Kit || {}; };
  function focusables(root) {
    return Array.prototype.filter.call(root.querySelectorAll(KT().FOCUSABLE), function (el) {
      return el.getClientRects().length > 0;
    });
  }
  function resolve(target, root) {
    if (!target) return null;
    if (typeof target === 'string') return root.querySelector(target);
    return target.current || null;
  }
  // Inert everything beside the overlay, level by level up to the AppFrame (or only the overlay's
  // own siblings outside a frame). Returns the undo; nodes already inert are left as they were.
  function inertAround(node) {
    const frame = node.closest('.v2-frame');
    const set = [];
    let el = node;
    while (el && el.parentElement && el !== frame && el !== document.body) {
      Array.prototype.forEach.call(el.parentElement.children, function (sib) {
        if (sib === el || sib.hasAttribute('inert') || sib.tagName === 'SCRIPT' || sib.tagName === 'STYLE') return;
        sib.setAttribute('inert', ''); set.push(sib);
      });
      if (!frame) break;
      el = el.parentElement;
    }
    return function () { set.forEach(function (sib) { sib.removeAttribute('inert'); }); };
  }
  const traps = []; // live traps, newest last: only the top one handles keys and focus

  function usePresence(open, ms) {
    const [mounted, setMounted] = useState(!!open);
    const [closing, setClosing] = useState(false);
    useEffect(function () {
      if (open) { setMounted(true); setClosing(false); return undefined; }
      if (!mounted) return undefined;
      setClosing(true);
      const t = setTimeout(function () { setMounted(false); setClosing(false); }, KT().reducedMotion() ? 0 : (ms || exitMs()));
      return function () { clearTimeout(t); };
    }, [open]);
    return { mounted: mounted || !!open, closing: closing && !open };
  }

  function onPage(el) { return !!(el && el !== document.body && document.contains(el)); }
  // Where focus goes back to: the opener; else the caller's target; else the nearest ancestor of
  // the opener that is still on the page, at its anchor or its first control.
  function returnTarget(opener, trail, target) {
    if (onPage(opener)) return opener;
    const given = typeof target === 'string' ? document.querySelector(target) : (target && (target.current || (target.nodeType ? target : null)));
    if (onPage(given)) return given;
    for (let i = 0; i < trail.length; i++) {
      if (!document.contains(trail[i])) continue;
      return trail[i].querySelector('[data-v2-anchor]') || focusables(trail[i])[0] || null;
    }
    return null;
  }

  function useSwapFocus(target, key) {
    const prev = useRef(key);
    useLayoutEffect(function () {
      if (prev.current === key) return;
      prev.current = key;
      if (onPage(document.activeElement)) return;
      const el = typeof target === 'function' ? target() : (target && (target.current || (target.nodeType ? target : null)));
      if (el) KT().focusEl(el);
    }, [key]);
  }

  function useFocusTrap(ref, active, opts) {
    const latest = useRef(opts || {});
    latest.current = opts || {};
    useEffect(function () {
      const root = ref.current;
      if (!active || !root) return undefined;
      const opener = document.activeElement;
      const trail = []; // the opener's ancestors, nearest first, for when the opener itself is gone
      for (let el = opener && opener.parentElement; el && el !== document.body; el = el.parentElement) trail.push(el);
      const token = {};
      const top = function () { return traps[traps.length - 1] === token; };
      traps.push(token);
      const release = inertAround(root.closest('.v2-overlay') || root);
      KT().focusEl(resolve(latest.current.initialFocus, root) || root);
      function onKey(e) {
        if (!top()) return;
        // Esc inside the panel is the panel's own handler; this catches focus that left it.
        if (e.key === 'Escape') { if (!root.contains(e.target) && latest.current.onEscape) latest.current.onEscape(); return; }
        if (e.key !== 'Tab') return;
        const list = focusables(root);
        if (!list.length) { e.preventDefault(); KT().focusEl(root); return; }
        const i = list.indexOf(document.activeElement);
        if (i < 0) { e.preventDefault(); KT().focusEl(e.shiftKey ? list[list.length - 1] : list[0]); }
        else if (e.shiftKey && i === 0) { e.preventDefault(); KT().focusEl(list[list.length - 1]); }
        else if (!e.shiftKey && i === list.length - 1) { e.preventDefault(); KT().focusEl(list[0]); }
      }
      function onFocusIn(e) { if (top() && !root.contains(e.target)) KT().focusEl(root); }
      document.addEventListener('keydown', onKey);
      document.addEventListener('focusin', onFocusIn);
      return function () {
        document.removeEventListener('keydown', onKey);
        document.removeEventListener('focusin', onFocusIn);
        traps.splice(traps.indexOf(token), 1);
        release();
        if (latest.current.returnFocus === false) return;
        KT().focusEl(returnTarget(opener, trail, latest.current.returnFocus));
      };
    }, [active]);
  }

  // The scrim is not focusable: pressing it must not move focus out of the panel to the page.
  function Scrim({ variant, onClick, className, style }) {
    return <div className={cx('v2-scrim', variant === 'frost' && 'v2-scrim--frost', className)} style={style} aria-hidden="true"
      onMouseDown={function (e) { e.preventDefault(); }} onClick={onClick} />;
  }

  // The close control: the kit's IconButton at the 32px target, a plain labelled button without it.
  function CloseButton({ onClick, disabled }) {
    const K = window.V2Kit || {};
    if (K.IconButton) return <K.IconButton icon="close" label="Close" size={32} onClick={onClick} disabled={disabled} className="v2-ov-close" />;
    return (
      <button type="button" className="v2-ov-close v2-ov-close--plain" aria-label="Close" onClick={onClick} disabled={disabled}>
        {K.Icon ? <K.Icon name="close" size={20} /> : null}
      </button>
    );
  }

  function Actions({ actions, busy }) {
    if (!actions || !actions.length) return null;
    const K = window.V2Kit || {};
    const Btn = K.Button || 'button';
    return (
      <div className={cx('v2-ov-actions', actions.length === 1 && 'v2-ov-actions--one')}>
        {actions.map(function (a, i) {
          const main = a.variant === 'primary' || a.variant === 'danger';
          return (
            <Btn key={a.label + i} variant={a.variant || 'secondary'} size="lg" full loading={!!(busy && main)}
              disabled={a.disabled || (busy && !main)} disabledReason={a.disabled ? a.disabledReason : undefined}
              onClick={a.onClick} className={a.className}>{a.label}</Btn>
          );
        })}
      </div>
    );
  }

  function Head({ id, title, showClose, onClose, busy }) {
    if (!title && !showClose) return null;
    return (
      <div className={cx('v2-dialog-head', !title && 'v2-dialog-head--bare')}>
        {title ? <h2 className="v2-dialog-title v2-text-title-lg" id={id}>{title}</h2> : null}
        {showClose ? <CloseButton onClick={onClose} disabled={busy} /> : null}
      </div>
    );
  }

  function Dialog(props) {
    const p = props;
    const v = VARIANTS[p.variant] || VARIANTS.task;
    const pres = usePresence(!!p.open);
    const panel = useRef(null);
    const uid = useId();
    const live = !!p.open && !p.preview;
    const dismissible = p.dismissible !== false;
    const canClose = dismissible && !p.busy;
    function close() { if (canClose && p.onClose) p.onClose(); }
    useFocusTrap(panel, live, { initialFocus: p.initialFocus || (v.focusAction ? '.v2-ov-actions button' : null), onEscape: close });
    useEffect(function () {
      const el = panel.current;
      if (p.busy && live && el && !el.contains(document.activeElement)) KT().focusEl(el);
    }, [p.busy]);
    if (!pres.mounted) return null;

    const tid = uid + '-title';
    const did = uid + '-desc';
    return (
      <div className={cx('v2-overlay', 'v2-overlay--center', p.scrim === 'frost' && 'v2-overlay--gate', pres.closing && 'is-closing', p.className)}>
        <Scrim variant={p.scrim} onClick={v.scrimCloses ? close : undefined} />
        <div ref={panel} tabIndex={-1}
          className={cx('v2-dialog', 'v2-dialog--' + (p.size === 'sm' || p.size === 'md' ? p.size : v.size), v.center && 'v2-dialog--center')}
          role={p.role || v.role} aria-modal={live ? 'true' : undefined}
          aria-labelledby={p.title ? tid : (p.labelledBy || p['aria-labelledby'])}
          aria-describedby={p.description ? did : undefined} aria-busy={p.busy ? 'true' : undefined}
          onKeyDown={function (e) { if (e.key === 'Escape') { e.stopPropagation(); close(); } }}>
          <Head id={tid} title={p.title} showClose={v.close && dismissible} onClose={close} busy={p.busy} />
          <div className="v2-dialog-body">
            {p.description ? <p className="v2-dialog-desc" id={did}>{p.description}</p> : null}
            {p.children}
          </div>
          <Actions actions={p.actions} busy={p.busy} />
          {p.footer ? <div className="v2-dialog-foot v2-text-caption">{p.footer}</div> : null}
        </div>
      </div>
    );
  }

  function Sheet(props) {
    const p = props;
    const pres = usePresence(!!p.open);
    const panel = useRef(null);
    const uid = useId();
    const live = !!p.open && !p.preview;
    const canClose = !p.blocking && !p.busy;
    function close() { if (canClose && p.onClose) p.onClose(); }
    useFocusTrap(panel, live, { initialFocus: p.initialFocus, onEscape: close });
    if (!pres.mounted) return null;

    const tid = uid + '-title';
    const did = uid + '-desc';
    return (
      <div className={cx('v2-overlay', 'v2-overlay--bottom', pres.closing && 'is-closing', p.className)}>
        <Scrim onClick={p.blocking ? undefined : close} />
        <div ref={panel} tabIndex={-1} className="v2-sheet" role="dialog" aria-modal={live ? 'true' : undefined}
          aria-labelledby={p.title ? tid : p.labelledBy} aria-describedby={p.description ? did : undefined}
          aria-busy={p.busy ? 'true' : undefined}
          onKeyDown={function (e) { if (e.key === 'Escape') { e.stopPropagation(); close(); } }}>
          <Head id={tid} title={p.title} showClose={!p.blocking} onClose={close} busy={p.busy} />
          <div className="v2-sheet-body">
            {p.description ? <p className="v2-dialog-desc" id={did}>{p.description}</p> : null}
            {p.children}
          </div>
          <Actions actions={p.actions} busy={p.busy} />
          {p.footer ? <div className="v2-dialog-foot v2-text-caption">{p.footer}</div> : null}
        </div>
      </div>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { Scrim, Dialog, Sheet, useFocusTrap, useSwapFocus, usePresence });
})();
