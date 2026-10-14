// BlueAI: Shared components: NavBars, Modal, Toggle (the switch), fields, the screen header, Icons
// Loaded first; all function declarations become globally accessible.
// Since review round 1 (2026-10-14) every part here is drawn by the design system's kit stylesheets
// (../blueai-product-v2-ds/kit/*.css): the icon box (.v2-icon), the switch, the field and select,
// the dialog overlay and the bottom nav. Names and props are unchanged, so callers read the same.

const { useRef } = React;

/* The kit's icon box (kit/base.css): 16, 20 or 24, the stroke rendering 1.75px at every size. */
function icoCls(size) {
  return 'v2-icon' + (size >= 24 ? ' v2-icon--24' : size >= 20 ? ' v2-icon--20' : '');
}

/* ─── ICONS ──────────────────────────────────────────────────── */
/* Every product glyph is the kit's icon set by name (kit/icons.jsx, review round 2); these keep
   their V2 names and default sizes, so callers read the same. Inline SVG is left for marks only
   (the spark, ticks, the spinner). */
function kitIcon(name, size) { return React.createElement(window.V2Kit.Icon, { name, size }); }
function IcoBriefcase({ size = 20 }) { return kitIcon('briefcase', size); }
function IcoChatBubble({ size = 20 }) { return kitIcon('chat', size); }
function IcoCalendar({ size = 20 }) { return kitIcon('calendar', size); }
function IcoGear({ size = 20 }) { return kitIcon('settings', size); }
function IcoXClose({ size = 20 }) { return kitIcon('close', size); }
function IcoTrashBin({ size = 16 }) { return kitIcon('trash', size); }
function IcoPencilEdit({ size = 16 }) { return kitIcon('edit', size); }
function IcoPlusSmall({ size = 16 }) { return kitIcon('plus', size); }

/* ─── SPINNER ────────────────────────────────────────────────── */
/* The kit's one spinner (kit/feedback.css .v2-spinner, the markup of kit/progress.jsx): a ring in
   currentColor on a line track, 16 by default, 24 inside a mark (review round 1). */
function Spinner({ size = 16, className }) {
  return (
    <span className={'v2-spinner v2-spinner--' + size + (className ? ' ' + className : '')} aria-hidden="true">
      <svg className="v2-anim-spin" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <circle className="v2-spinner-track" cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle className="v2-spinner-arc" cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="10.2 30.6" />
      </svg>
    </span>);
}

/* ─── SWITCH ─────────────────────────────────────────────────── */
/* The product's ONE switch is the kit's (kit/inputs.css .v2-switch: off a 20% fill the white knob
   reads on, on the action blue). Toggle keeps its V2 name and props, so a caller reads the same. */
function Toggle({ enabled, onToggle, label, describedBy }) {
  return (
    <button type="button" role="switch" aria-checked={enabled} aria-label={label} aria-describedby={describedBy} className={'v2-switch' + (enabled ? ' is-on' : '')}
      onClick={(e) => {e.stopPropagation();onToggle();}}>
      <span className="v2-switch-thumb" />
    </button>);
}

/* ─── FIELDS ─────────────────────────────────────────────────── */
/* The kit's field (kit/inputs.css): the label above, the 40px box with its 1px line, the blue edge
   and ring on focus. The control (input or textarea, class v2-field-input) is the child. A required
   field carries no mark (review round 2: no red asterisk; an optional one would say "Optional" in
   ink-4, the kit's flag); `helper` is the kit's caption line under the box. */
function Field({ id, label, helper, className, children }) {
  return (
    <div className={'v2-field' + (className ? ' ' + className : '')}>
      {label && <label htmlFor={id} className="v2-field-label">{label}</label>}
      <div className="v2-field-box">{children}</div>
      {helper && <div className="v2-field-foot"><span className="v2-field-msg v2-text-caption">{helper}</span></div>}
    </div>);
}
/* One select: the kit's Select box, the native arrow swapped for its quiet chevron. `empty` greys
   the value while it is still the placeholder option; className sizes the field (v3-field--md). */
function SelectField({ value, onChange, empty, className, label, children, ...rest }) {
  return (
    <div className={'v2-field v2-field--select' + (className ? ' ' + className : '')}>
      {label && <label htmlFor={rest.id} className="v2-field-label">{label}</label>}
      <div className="v2-field-box">
        <select value={value} onChange={onChange} className={'v2-field-input v2-field-select' + (empty ? ' is-placeholder' : '')} {...rest}>{children}</select>
        <span className="v2-field-chevron" aria-hidden="true">{kitIcon('chevron-down', 16)}</span>
      </div>
    </div>);
}

/* ─── SCREEN HEADER ──────────────────────────────────────────── */
/* One header for every pushed screen and tab: the kit's ScreenHeader (kit/shell.css, design-md 32,
   review round 2): the 24px title (.v2-text-greeting, 500, -0.04em) on a 36 line, 16 above, below
   and at the gutter, sticky to the top of its scroller, an optional trailing control. */
function ScreenHead({ title, children }) {
  return (
    <div className="v2-screen-header">
      <h1 className="v2-screen-title v2-text-greeting">{title}</h1>
      {children && <div className="v2-screen-header-trailing">{children}</div>}
    </div>);
}

/* ─── DIALOG PANEL ───────────────────────────────────────────── */
/* Every in-app overlay's panel (review round 1): the kit's one focus hook, V2Kit.useFocusTrap
   (../blueai-product-v2-ds/kit/dialog.jsx). Focus moves into the panel on open (or to initialFocus),
   Tab stays inside, the window under it goes inert (.ba-app is marked data-v2-bounds), and focus
   returns to the opener on close. Esc calls onEscape; a blocking overlay passes none. */
function DialogPanel({ onEscape, initialFocus, className, label, labelledBy, describedBy, children }) {
  const ref = useRef(null);
  window.V2Kit.useFocusTrap(ref, true, { initialFocus, onEscape });
  return (
    <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={labelledBy ? undefined : label}
      aria-labelledby={labelledBy} aria-describedby={describedBy} className={className}
      onKeyDown={(e) => {if (e.key === 'Escape' && onEscape) {e.stopPropagation();onEscape();}}}>
      {children}
    </div>);
}

/* ─── MODAL OVERLAY ──────────────────────────────────────────── */
function ModalOverlay({ isOpen, onClose, title, children, plain, describedBy, initialFocus }) {
  if (!isOpen) return null;
  /* ABSOLUTE, not fixed: these are IN-APP modals (schedule, Telegram, Hybrid setup, the consent)
     and they must be scoped to the product window, the way LoginModal / LogoutModal /
     OutOfCreditsModal already are. The scene's scaler carries a transform, so a fixed overlay
     would be positioned against the whole desktop and centre its dialog over the BlueStacks
     window instead of inside the app.
     Since review round 1 it is the kit's overlay (kit/overlays.css): the dim scrim (a click on it
     closes), a 382 dialog with one radius (--v2-radius-dialog), one edge and one entry, the 18px
     dialog title; `plain` drops the close button (the consent answers with its own buttons);
     a form passes initialFocus (its first field's selector), the kit's focus rule for a form dialog. */
  return (
    <div className="v2-overlay v2-overlay--center">
      <div className="v2-scrim" onClick={onClose} aria-hidden="true" />
      <DialogPanel onEscape={onClose} initialFocus={initialFocus} label={title} describedBy={describedBy} className="v2-dialog v2-dialog--md">
        <div className="v2-dialog-head">
          <h2 className="v2-dialog-title v2-text-title-dialog">{title}</h2>
          {!plain && <button type="button" onClick={onClose} aria-label="Close" className="v2-icon-button v2-ov-close"><IcoXClose /></button>}
        </div>
        <div className="v2-dialog-body">{children}</div>
      </DialogPanel>
    </div>);
}

/* ─── BOTTOM NAVBAR ──────────────────────────────────────────── */
function BottomNavbar({ activeTab, onTabChange }) {
  // 'skills' dropped 2026-09-09 (designer directive); the Skills screen itself was deleted in the V3 cleanup (2026-10-14).
  const NAV = [
  { id: 'jobs', label: 'Jobs', Icon: IcoBriefcase },
  { id: 'chat', label: 'Chat', Icon: IcoChatBubble },
  { id: 'schedule', label: 'Schedule', Icon: IcoCalendar },
  { id: 'settings', label: 'Settings', Icon: IcoGear }];

  /* The kit's bottom nav (design-md 31, kit/shell.css): 56 tall, surface, one top hairline, no
     shadow. Selected = a 2px blue bar on the line plus ink icon and label (no weight change, so
     labels never reflow); rest is ink-3, hover a wash, focus the 2px blue ring. activeTab null (a
     pushed screen open) still lights nothing, as before. */
  return (
    <nav className="v2-nav" aria-label="Main">
      {NAV.map(({ id, label, Icon }) => {
        const active = activeTab === id;
        return (
          <button key={id} type="button" className={'v2-nav-item' + (active ? ' is-selected' : '')}
            aria-current={active ? 'page' : undefined} onClick={() => onTabChange(id)}>
            <span className="v2-nav-icon"><Icon size={20} /></span>
            <span className="v2-nav-label">{label}</span>
          </button>);
      })}
    </nav>);
}

/* ─── DESTINATIONS ───────────────────────────────────────────── */
/* One of each (review round 1): Earnings (the top bar's menu and the 20-day strip) and the FAQ, on
   the kit's stand-in host (kit/worker-data.jsx EARNINGS_URL, SITE_FAQ_URL) until the product team
   names the real pages. */
const BlueAILinks = {
  dashboard: 'https://blueai-screen-library.vercel.app/experiments/onblue-vesper/apply.html',
  faq: 'https://blueai-screen-library.vercel.app/experiments/onblue-vesper/index.html#faqs'
};

// Export everything so other Babel script files can use them
Object.assign(window, {
  BlueAILinks, DialogPanel,
  Toggle, Field, SelectField, ScreenHead, ModalOverlay, Spinner,
  BottomNavbar, icoCls,
  IcoBriefcase, IcoChatBubble, IcoCalendar, IcoGear,
  IcoXClose, IcoTrashBin, IcoPencilEdit, IcoPlusSmall
});
