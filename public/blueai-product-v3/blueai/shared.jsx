// BlueAI: Shared components: NavBars, Modal, Toggle, Icons
// Loaded first; all function declarations become globally accessible.

const { useState, useRef, useEffect } = React;

/* ─── NAV ICONS ─────────────────────────────────────────────── */
function IcoBriefcase({ size = 22, stroke = 1.9 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>;
}
function IcoLightbulb({ size = 22, stroke = 1.9 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
}
function IcoChatBubble({ size = 22, stroke = 1.9 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
}
function IcoCalendar({ size = 22, stroke = 1.9 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
}
function IcoHistory({ size = 22, stroke = 1.9 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>;
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
function IcoArrowLeft({ size = 15 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>;
}

/* ─── TOGGLE ─────────────────────────────────────────────────── */
function Toggle({ enabled, onToggle }) {
  return (
    <button
      onClick={(e) => {e.stopPropagation();onToggle();}}
      role="switch" aria-checked={enabled}
      style={{ width: 32, height: 18, borderRadius: 999, position: 'relative', cursor: 'pointer', background: enabled ? '#1990FF' : '#d1d5db', transition: 'background 0.2s', flexShrink: 0, border: 'none', padding: 0 }}>
      
      <span style={{ position: 'absolute', top: 2, left: enabled ? 16 : 2, width: 14, height: 14, borderRadius: '50%', background: 'white', transition: 'left 0.2s cubic-bezier(.34,1.4,.64,1)', boxShadow: '0 1px 3px rgba(0,0,0,0.22)', display: 'block' }} />
    </button>);

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
       the BlueStacks window instead of inside the app. */
    style={{ position: 'absolute', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', padding: '16px 20px 80px' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: 382, maxHeight: '88vh', overflowY: 'auto', background: 'white', borderRadius: plain ? 20 : 12, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        {!plain && <div style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'white', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4, borderRadius: 6 }}><IcoXClose size={18} /></button>
        </div>}
        <div style={{ padding: plain ? '22px 22px 20px' : '16px 20px 20px' }}>{plain && <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', lineHeight: 1.35, marginBottom: 10 }}>{title}</h2>}{children}</div>
      </div>
    </div>);

}

/* TopNavbar moved to top_navbar.jsx (V3 Phase 1), which exports it on window. */

/* ─── BOTTOM NAVBAR ──────────────────────────────────────────── */
function BottomNavbar({ activeTab, onTabChange, compact }) {
  // 'skills' dropped 2026-09-09 (designer directive), hide, not delete; see index.html's activeTab==='skills' note for what stayed. NAV_TOP below still lists it, but that branch is dead: nothing here ever passes `compact`.
  const NAV = [
  { id: 'jobs', label: 'Jobs', Icon: IcoBriefcase },
  { id: 'chat', label: 'Chat', Icon: IcoChatBubble },
  { id: 'schedule', label: 'Schedule', Icon: IcoCalendar },
  { id: 'settings', label: 'Settings', Icon: IcoGear }];

  if (compact) {
    const NAV_TOP = [
    { id: 'chat',     label: 'Chat',     Icon: IcoChatBubble, desc: 'Send messages and kick off tasks with BlueAI.' },
    { id: 'skills',   label: 'Skills',   Icon: IcoLightbulb,  desc: 'Browse and enable ready-made automations.' },
    { id: 'schedule', label: 'Schedule', Icon: IcoCalendar,   desc: 'View and manage your recurring tasks.' },
    { id: 'jobs',     label: 'Jobs',     Icon: IcoBriefcase,  desc: 'Track active and completed task runs.' },
    { id: 'history', label: 'History', Icon: IcoHistory,    desc: 'Browse your past chats and completed tasks.' }];

    const tabRefs = React.useRef({});
    const navRef = React.useRef(null);
    const [indicator, setIndicator] = React.useState({ left: 0, width: 0 });
    const [tooltip, setTooltip] = React.useState(null);
    const tooltipTimer = React.useRef(null);
    const TOOLTIP_W = 180;

    React.useEffect(() => {
      const el = tabRefs.current[activeTab];
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
      // Clear tooltip on tab change
      clearTimeout(tooltipTimer.current);
      setTooltip(null);
    }, [activeTab]);

    const showTip = (id, el) => {
      tooltipTimer.current = setTimeout(() => {
        if (!navRef.current) return;
        const navRect = navRef.current.getBoundingClientRect();
        const btnRect = el.getBoundingClientRect();
        const btnCenter = btnRect.left - navRect.left + btnRect.width / 2;
        const navW = navRect.width;
        const minLeft = TOOLTIP_W / 2 + 8;
        const maxLeft = navW - TOOLTIP_W / 2 - 8;
        const clampedCenter = Math.max(minLeft, Math.min(maxLeft, btnCenter));
        const caretOffset = btnCenter - clampedCenter;
        setTooltip({ id, center: clampedCenter, caretOffset });
      }, 300);
    };
    const hideTip = () => { clearTimeout(tooltipTimer.current); setTooltip(null); };

    const tipData = NAV_TOP.find(n => n.id === tooltip?.id);

    return (
      <nav ref={navRef} style={{ display: 'flex', height: 46, alignItems: 'center', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderBottom: 'var(--v2-stroke) solid var(--v2-line)', flexShrink: 0, padding: '0 10px', gap: 2, background: 'rgba(255,255,255,0.6)', position: 'relative' }}>
        <style>{'@keyframes tipFade { from { opacity:0; transform:translateX(-50%) translateY(-4px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }'}</style>
        {/* Sliding underline indicator */}
        <div style={{ position: 'absolute', bottom: 0, height: 2, background: 'var(--v2-blue)', borderRadius: 1, transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1), width 0.25s cubic-bezier(0.4,0,0.2,1)', left: indicator.left, width: indicator.width, pointerEvents: 'none', zIndex: 2 }} />

        {/* Rich tooltip */}
        {tooltip && tipData && (
          <div style={{ position: 'absolute', top: 50, left: tooltip.center, transform: 'translateX(-50%)', zIndex: 100, background: 'var(--v2-surface)', borderRadius: 'var(--v2-radius-md)', boxShadow: 'var(--v2-shadow-1)', border: 'var(--v2-stroke) solid var(--v2-line)', padding: '10px 14px', width: TOOLTIP_W, pointerEvents: 'none', animation: 'tipFade 0.12s ease' }}>
            {/* Outer caret (border) */}
            <div style={{ position: 'absolute', top: -8, left: `calc(50% + ${tooltip.caretOffset}px)`, transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '8px solid var(--v2-line-strong)' }} />
            {/* Inner caret (fill) */}
            <div style={{ position: 'absolute', top: -6, left: `calc(50% + ${tooltip.caretOffset}px)`, transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '9px solid var(--v2-surface)' }} />
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--v2-ink)', marginBottom: 3 }}>{tipData.label}</p>
            <p style={{ fontSize: 12, color: 'var(--v2-ink-3)', lineHeight: 1.5 }}>{tipData.desc}</p>
          </div>
        )}

        {NAV_TOP.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <button key={id} ref={el => { if (el) tabRefs.current[id] = el; }} onClick={() => { onTabChange(id); hideTip(); }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--v2-blue)'; showTip(id, e.currentTarget); } }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--v2-ink-3)'; hideTip(); }}
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, border: 'none', background: 'transparent', cursor: 'pointer', padding: active ? '0 12px' : '0 9px', height: '100%', flexShrink: active ? 0 : 1, whiteSpace: 'nowrap', color: active ? 'var(--v2-blue)' : 'var(--v2-ink-3)', fontSize: 12.5, fontWeight: active ? 600 : 500, fontFamily: 'inherit', transition: 'color 0.2s', zIndex: 1 }}>
              <Icon size={17} />
              {active && <span>{label}</span>}
            </button>);
        })}
      </nav>);
  }
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
  Toggle, ModalOverlay,
  BottomNavbar,
  IcoBriefcase, IcoLightbulb, IcoChatBubble, IcoCalendar, IcoGear, IcoHistory,
  IcoXClose, IcoTrashBin, IcoPencilEdit, IcoPlusSmall, IcoArrowLeft
});