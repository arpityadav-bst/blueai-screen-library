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

/* ─── NAV ICONS ─────────────────────────────────────────────── */
function IcoBriefcase({ size = 20 }) {
  return <svg className={icoCls(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>;
}
function IcoChatBubble({ size = 20 }) {
  return <svg className={icoCls(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
}
function IcoCalendar({ size = 20 }) {
  return <svg className={icoCls(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
}
function IcoGear({ size = 20 }) {
  return <svg className={icoCls(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
}

/* ─── UTIL ICONS ─────────────────────────────────────────────── */
function IcoXClose({ size = 20 }) {
  return <svg className={icoCls(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
}
function IcoTrashBin({ size = 16 }) {
  return <svg className={icoCls(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>;
}
function IcoPencilEdit({ size = 16 }) {
  return <svg className={icoCls(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
}
function IcoPlusSmall({ size = 16 }) {
  return <svg className={icoCls(size)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
}

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
   and ring on focus. The control (input or textarea, class v2-field-input) is the child. */
function Field({ id, label, required, className, children }) {
  return (
    <div className={'v2-field' + (className ? ' ' + className : '')}>
      {label && <label htmlFor={id} className="v2-field-label">{label}{required && <span className="v3-req">*</span>}</label>}
      <div className="v2-field-box">{children}</div>
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
        <span className="v2-field-chevron" aria-hidden="true"><svg className="v2-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg></span>
      </div>
    </div>);
}

/* ─── SCREEN HEADER ──────────────────────────────────────────── */
/* One header for every pushed screen and tab (review round 1): the 24px title (.v2-text-greeting,
   500, -0.04em), 16 above and below, an optional trailing control. Styles: settings.css. */
function ScreenHead({ title, children }) {
  return (
    <div className="v3-screen-head">
      <h1 className="v2-text-greeting v3-screen-title">{title}</h1>
      {children}
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
