/* BlueAI Product V2 Design System: Menu, Popover, Tooltip on window.V2Kit. Styles: kit/overlays.css.
   Spec: design-md/27-menu.md, 23-tooltip.md.

   All three float over content inside the product window and fit themselves to it: when the
   preferred side has no room they flip, when they would cross an edge they slide back in. The
   window is the nearest [data-v2-bounds] or AppFrame (.v2-frame), else the viewport.

   Menu     {trigger, items, placement 'down' | 'up', align 'end' | 'start', header, footer, label,
            open, defaultOpen, onOpenChange, className}
            trigger is a render prop (receives {aria-haspopup, aria-expanded, aria-controls, onClick}
            to spread on a button) or an element (the props are cloned on). items:
            [{icon, label, onSelect, href, external, danger, disabled, hint, className} | {separator}]
            Keyboard: Enter, Space or Down opens on the first item, Up on the last; arrows move,
            Home / End jump, Esc closes and returns focus to the trigger, Tab closes.
   Popover  {trigger, placement, align, header, footnote, label, open, defaultOpen, onOpenChange,
            className, children}  a non-modal dialog for rich content with its own controls (the
            per-app Always ask / Automatic choice). Focus moves in on open; Esc, an outside click or
            focus leaving closes it.
   Tooltip  {kind 'label' | 'info', content, placement 'up' | 'down', label, open, className,
            children}  label: names an icon-only control on hover or keyboard focus (the control
            keeps its own aria-label; the tooltip is the visible copy of it). info: explains a
            concept and may hold a link; opens on hover, focus or click (click pins it), closes 200ms
            after the pointer leaves so the pointer can reach the link, Esc closes. children is the
            trigger; an info tip without children draws the standard 24px (i) with a 32px target,
            named by label. Open / close is CSS (:hover, :focus-within, .is-open); JS only pins,
            dismisses and measures. */
(function () {
  const { useState, useEffect, useLayoutEffect, useRef, useId } = React;
  const EDGE = 8; // px a float keeps from the window edge
  const GAP = 6; // px between a trigger and its menu (--v2-space-15)
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function focusEl(el) {
    if (!el || !el.focus) return;
    try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
  }
  function boundsOf(el) {
    const b = el && el.closest ? el.closest('[data-v2-bounds], .v2-frame') : null;
    if (b) return b.getBoundingClientRect();
    return { top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight };
  }
  function Ic({ name, size }) {
    const I = window.V2Kit && window.V2Kit.Icon;
    return I ? <I name={name} size={size || 16} /> : null;
  }
  function makeTrigger(trigger, tprops) {
    if (typeof trigger === 'function') return trigger(tprops);
    return trigger ? React.cloneElement(trigger, tprops) : null;
  }

  // Which side and edge a menu or popover opens on, given the room the window leaves.
  function fit(anchor, panel, side, align) {
    const a = anchor.getBoundingClientRect();
    const p = panel.getBoundingClientRect();
    const b = boundsOf(anchor);
    const h = p.height + GAP;
    let s = side, al = align;
    if (s === 'down' && a.bottom + h > b.bottom - EDGE && a.top - h >= b.top + EDGE) s = 'up';
    else if (s === 'up' && a.top - h < b.top + EDGE && a.bottom + h <= b.bottom - EDGE) s = 'down';
    if (al === 'start' && a.left + p.width > b.right - EDGE && a.right - p.width >= b.left + EDGE) al = 'end';
    else if (al === 'end' && a.right - p.width < b.left + EDGE && a.left + p.width <= b.right - EDGE) al = 'start';
    return { side: s, align: al };
  }

  // Open state, outside click, fitting and focus-on-open, shared by Menu and Popover.
  function useFloat(props, defaults) {
    const side = props.placement || defaults.placement;
    const align = props.align || defaults.align;
    const controlled = props.open !== undefined;
    const [own, setOwn] = useState(!!props.defaultOpen);
    const open = controlled ? !!props.open : own;
    const [pos, setPos] = useState({ side: side, align: align });
    const anchor = useRef(null);
    const panel = useRef(null);
    const onOpen = useRef(null);
    function set(v) { if (!controlled) setOwn(v); if (props.onOpenChange) props.onOpenChange(v); }
    function close(returnFocus) {
      set(false);
      if (returnFocus && anchor.current) focusEl(anchor.current.querySelector(FOCUSABLE));
    }
    useLayoutEffect(function () {
      if (open && anchor.current && panel.current) setPos(fit(anchor.current, panel.current, side, align));
    }, [open, side, align]);
    useEffect(function () {
      if (!open) return undefined;
      if (onOpen.current) { const fn = onOpen.current; onOpen.current = null; fn(panel.current); }
      function down(e) { if (anchor.current && !anchor.current.contains(e.target)) set(false); }
      document.addEventListener('pointerdown', down);
      return function () { document.removeEventListener('pointerdown', down); };
    }, [open]);
    return { open: open, set: set, close: close, pos: pos, anchor: anchor, panel: panel, onOpen: onOpen };
  }

  function Menu(props) {
    const f = useFloat(props, { placement: 'down', align: 'end' });
    const uid = useId();
    const items = props.items || [];
    function list() {
      return f.panel.current ? Array.prototype.slice.call(f.panel.current.querySelectorAll('[role="menuitem"]')) : [];
    }
    function move(delta, to) {
      const l = list();
      if (!l.length) return;
      let i = l.indexOf(document.activeElement);
      if (to === 'first') i = 0;
      else if (to === 'last') i = l.length - 1;
      else i = (i + delta + l.length) % l.length;
      focusEl(l[i]);
    }
    function openOn(where) { f.onOpen.current = function () { move(0, where); }; f.set(true); }
    function onAnchorKey(e) {
      if (f.open || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return;
      e.preventDefault();
      openOn(e.key === 'ArrowUp' ? 'last' : 'first');
    }
    function onMenuKey(e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Home') { e.preventDefault(); move(0, 'first'); }
      else if (e.key === 'End') { e.preventDefault(); move(0, 'last'); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); f.close(true); }
      else if (e.key === 'Tab') f.close(true); // back on the button first, so Tab moves on from there
    }
    function choose(it, e) {
      if (it.disabled) { e.preventDefault(); return; }
      f.close(true);
      if (it.onSelect) it.onSelect(e);
    }
    function item(it, i) {
      if (it.separator) return <div key={'sep' + i} role="separator" className="v2-menu-sep" />;
      const body = (
        <>
          {it.icon ? <span className="v2-menu-icon"><Ic name={it.icon} /></span> : null}
          <span className="v2-menu-label">{it.label}</span>
          {it.hint ? <span className="v2-menu-hint">{it.hint}</span> : null}
          {it.external ? <span className="v2-menu-ext"><Ic name="external" /><span className="v2-sr-only"> (opens in a new tab)</span></span> : null}
        </>
      );
      const common = {
        role: 'menuitem', tabIndex: -1, 'aria-disabled': it.disabled ? 'true' : undefined,
        className: cx('v2-menu-item', it.danger && 'v2-menu-item--danger', it.className),
        onClick: function (e) { choose(it, e); },
      };
      if (it.href) {
        return <a key={it.label + i} {...common} href={it.disabled ? undefined : it.href}
          target={it.external ? '_blank' : undefined} rel={it.external ? 'noopener noreferrer' : undefined}>{body}</a>;
      }
      return <button key={it.label + i} type="button" {...common}>{body}</button>;
    }
    const tprops = {
      'aria-haspopup': 'menu', 'aria-expanded': f.open, 'aria-controls': f.open ? uid : undefined,
      onClick: function () { if (f.open) f.set(false); else openOn('first'); },
    };
    return (
      <span ref={f.anchor} className={cx('v2-float', props.className)} onKeyDown={onAnchorKey}>
        {makeTrigger(props.trigger, tprops)}
        {f.open ? (
          <div ref={f.panel} id={uid} role="menu" aria-label={props.label} onKeyDown={onMenuKey}
            className={cx('v2-menu', 'v2-float-panel', 'is-' + f.pos.side, 'is-' + f.pos.align)}>
            {props.header ? <div className="v2-float-header" role="presentation">{props.header}</div> : null}
            {items.map(item)}
            {props.footer ? <div className="v2-float-foot" role="presentation">{props.footer}</div> : null}
          </div>
        ) : null}
      </span>
    );
  }

  function Popover(props) {
    const f = useFloat(props, { placement: 'down', align: 'start' });
    const uid = useId();
    function onKey(e) {
      if (e.key === 'Escape' && f.open) { e.preventDefault(); e.stopPropagation(); f.close(true); }
    }
    function onBlur(e) {
      const to = e.relatedTarget;
      if (f.open && to && f.anchor.current && !f.anchor.current.contains(to)) f.set(false);
    }
    const tprops = {
      'aria-haspopup': 'dialog', 'aria-expanded': f.open, 'aria-controls': f.open ? uid : undefined,
      onClick: function () {
        if (f.open) { f.set(false); return; }
        f.onOpen.current = function (panel) { if (panel) focusEl(panel.querySelector(FOCUSABLE) || panel); };
        f.set(true);
      },
    };
    const name = props.label || (typeof props.header === 'string' ? props.header : undefined);
    return (
      <span ref={f.anchor} className={cx('v2-float', props.className)} onKeyDown={onKey} onBlur={onBlur}>
        {makeTrigger(props.trigger, tprops)}
        {f.open ? (
          <div ref={f.panel} id={uid} role="dialog" aria-label={name} tabIndex={-1}
            className={cx('v2-popover', 'v2-float-panel', 'is-' + f.pos.side, 'is-' + f.pos.align)}>
            {props.header ? <div className="v2-float-header">{props.header}</div> : null}
            <div className="v2-popover-body">{props.children}</div>
            {props.footnote ? <p className="v2-float-foot">{props.footnote}</p> : null}
          </div>
        ) : null}
      </span>
    );
  }

  function Tooltip(props) {
    const kind = props.kind === 'info' ? 'info' : 'label';
    const want = props.placement === 'down' ? 'down' : 'up';
    const [pinned, setPinned] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [pos, setPos] = useState({ side: want, shift: 0 });
    const wrap = useRef(null);
    const panel = useRef(null);
    const uid = useId();
    const forced = !!props.open;
    function place() {
      const w = wrap.current, p = panel.current;
      if (!w || !p) return;
      const t = w.getBoundingClientRect();
      const b = boundsOf(w);
      const pw = p.offsetWidth, ph = p.offsetHeight + 10;
      let side = want;
      if (side === 'up' && t.top - ph < b.top + EDGE && b.bottom - t.bottom > t.top - b.top) side = 'down';
      else if (side === 'down' && t.bottom + ph > b.bottom - EDGE && t.top - b.top > b.bottom - t.bottom) side = 'up';
      const left = t.left + t.width / 2 - pw / 2;
      const kept = Math.max(b.left + EDGE, Math.min(left, b.right - EDGE - pw));
      const shift = Math.round(kept - left);
      if (side !== pos.side || shift !== pos.shift) setPos({ side: side, shift: shift });
    }
    useLayoutEffect(function () { if (forced || pinned) place(); }, [forced, pinned, want]);
    useEffect(function () {
      if (!pinned) return undefined;
      function down(e) { if (wrap.current && !wrap.current.contains(e.target)) setPinned(false); }
      document.addEventListener('pointerdown', down);
      return function () { document.removeEventListener('pointerdown', down); };
    }, [pinned]);
    function toggle() { setDismissed(false); setPinned(function (v) { return !v; }); }
    const tid = uid + '-tip';
    let trigger;
    if (props.children) {
      const child = React.Children.only(props.children);
      trigger = kind === 'info'
        ? React.cloneElement(child, {
          'aria-describedby': tid, 'aria-expanded': pinned,
          onClick: function (e) { if (child.props.onClick) child.props.onClick(e); toggle(); },
        })
        : child;
    } else {
      trigger = (
        <button type="button" className="v2-tip-trigger" aria-label={props.label || 'More about this'}
          aria-expanded={pinned} aria-describedby={tid} onClick={toggle}><Ic name="info" /></button>
      );
    }
    return (
      <span ref={wrap} style={{ '--tip-shift': pos.shift + 'px' }}
        className={cx('v2-tip', 'v2-tip--' + kind, 'is-' + pos.side, (pinned || forced) && 'is-open', dismissed && 'is-dismissed', props.className)}
        onPointerEnter={place} onFocus={place} onPointerLeave={function () { setDismissed(false); }}
        onKeyDown={function (e) { if (e.key === 'Escape') { setPinned(false); setDismissed(true); } }}
        onBlur={function (e) { if (!wrap.current.contains(e.relatedTarget)) { setPinned(false); setDismissed(false); } }}>
        {trigger}
        <span ref={panel} className="v2-tip-panel" id={tid} role={kind === 'label' ? 'tooltip' : undefined}
          aria-hidden={kind === 'label' ? 'true' : undefined}>
          <span className="v2-tip-box">
            {props.content}
            {kind === 'info' ? <span className="v2-tip-arrow" aria-hidden="true" /> : null}
          </span>
        </span>
      </span>
    );
  }

  Object.assign(window.V2Kit = window.V2Kit || {}, { Menu, Popover, Tooltip });
})();
