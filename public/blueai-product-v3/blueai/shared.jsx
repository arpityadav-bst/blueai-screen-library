// BlueAI: Shared components: NavBars, Modal, Toggle (the switch), SelectField, Icons
// Loaded first; all function declarations become globally accessible.

const { useState, useRef, useEffect } = React;

/* ─── NAV ICONS ─────────────────────────────────────────────── */
function IcoBriefcase({ size = 22, stroke = 1.9 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>;
}
function IcoChatBubble({ size = 22, stroke = 1.9 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
}
function IcoCalendar({ size = 22, stroke = 1.9 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
}
function IcoGear({ size = 22, stroke = 1.9 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
}

/* ─── UTIL ICONS ─────────────────────────────────────────────── */
function IcoXClose({ size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
}
function IcoTrashBin({ size = 14 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>;
}
function IcoPencilEdit({ size = 14 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
}
function IcoPlusSmall({ size = 12, color = "white" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
}

/* ─── SWITCH ─────────────────────────────────────────────────── */
/* V3, Phase 5: the product's ONE switch is worker.css's .v3-switch (off: a sunken track with a 15%
   line; on: the selection blue). Toggle keeps its V2 name and props, so a caller reads the same. */
function Toggle({ enabled, onToggle, label }) {
  return (
    <button type="button" role="switch" aria-checked={enabled} aria-label={label} className="v3-switch"
      onClick={(e) => {e.stopPropagation();onToggle();}} />);
}

/* ─── SELECT ─────────────────────────────────────────────────── */
/* One select for Settings: the .v3-field look, the native arrow swapped for a quiet chevron.
   `empty` greys the value while it is still the placeholder option. */
function SelectField({ value, onChange, empty, className, children, ...rest }) {
  return (
    <div className="v3-select">
      <select value={value} onChange={onChange} className={'v3-field' + (className ? ' ' + className : '') + (empty ? ' is-empty' : '')} {...rest}>{children}</select>
      <svg className="v3-select-chev v3-ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
    </div>);
}

/* ─── MODAL OVERLAY ──────────────────────────────────────────── */
function ModalOverlay({ isOpen, onClose, title, children, plain }) {
  useEffect(() => {
    const h = (e) => {if (e.key === 'Escape') onClose();};
    if (isOpen) document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <div onClick={(e) => {if (e.target === e.currentTarget) onClose();}}
    /* ABSOLUTE, not fixed: these are IN-APP modals (job details, schedule, Telegram, Hybrid
       setup) and they must be scoped to the product window, the way LoginModal / LogoutModal /
       OutOfCreditsModal already are. It was `fixed` while the page was a single centred card,
       where the difference didn't show. It shows now: the scene's scaler carries a transform, so
       a fixed overlay would be positioned against the whole desktop and centre its dialog over
       the BlueStacks window instead of inside the app.
       V3 (phase 4, worker.css .v3-dialog*): the Target dim veil, a white panel with a 1px line and
       the floating cast, the sheet title type, a quiet round X; `plain` keeps its 20px corners. */
    className="v3-dialog-scrim">
      <div role="dialog" aria-modal="true" aria-label={title} className={'v3-dialog' + (plain ? ' v3-dialog--plain' : '')}>
        {!plain && <div className="v3-dialog-head">
          <h2 className="v3-dialog-title">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="v3-icon-btn"><IcoXClose size={18} /></button>
        </div>}
        <div className="v3-dialog-body">{plain && <h2 className="v3-dialog-title">{title}</h2>}{children}</div>
      </div>
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

  /* V3 Phase 1, the Target bottom nav (design-md 31): 56 tall, surface, one top hairline, no shadow.
     Selected = a 2px blue bar on the line plus ink icon and label (no fill, no weight change, so
     labels never reflow); rest is ink-3, hover a wash, focus a 2px blue ring. Styles: .ba-nav in
     index.html. activeTab null (a pushed screen open) still lights nothing, as before. */
  return (
    <nav className="ba-nav" aria-label="Main">
      {NAV.map(({ id, label, Icon }) => {
        const active = activeTab === id;
        return (
          <button key={id} type="button" className={'ba-nav-item' + (active ? ' is-selected' : '')}
            aria-current={active ? 'page' : undefined} onClick={() => onTabChange(id)}>
            <Icon size={20} stroke={1.75} />
            <span className="ba-nav-label">{label}</span>
          </button>);
      })}
    </nav>);
}

// Export everything so other Babel script files can use them
Object.assign(window, {
  Toggle, SelectField, ModalOverlay,
  BottomNavbar,
  IcoBriefcase, IcoChatBubble, IcoCalendar, IcoGear,
  IcoXClose, IcoTrashBin, IcoPencilEdit, IcoPlusSmall
});