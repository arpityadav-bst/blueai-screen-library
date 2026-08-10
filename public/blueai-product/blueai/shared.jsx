// BlueAI — Shared components: NavBars, Modal, Toggle, Icons
// Loaded first; all function declarations become globally accessible.

const { useState, useRef, useEffect } = React;

/* ─── NAV ICONS ─────────────────────────────────────────────── */
function IcoBriefcase({ size = 22 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>;
}
function IcoLightbulb({ size = 22 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
}
function IcoChatBubble({ size = 22 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
}
function IcoCalendar({ size = 22 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
}
function IcoHistory({ size = 22 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>;
}
function IcoGear({ size = 22 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
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
function ModalOverlay({ isOpen, onClose, title, children }) {
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
      <div style={{ position: 'relative', width: '100%', maxWidth: 382, maxHeight: '88vh', overflowY: 'auto', background: 'white', borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'white', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4, borderRadius: 6 }}><IcoXClose size={18} /></button>
        </div>
        <div style={{ padding: '16px 20px 20px' }}>{children}</div>
      </div>
    </div>);

}

/* ─── TOP NAVBAR ─────────────────────────────────────────────── */
function TopNavbar({ onNewChat, isLoggedIn, creditsNudge = null, onEarnCredits, credits = 240, onCreditsClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const h = (e) => {if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);};
    if (menuOpen) document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [menuOpen]);

  const menuItems = [
  { label: 'Settings',     d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" },
  { label: 'Account',      d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { label: window.__isDark ? 'Light mode' : 'Dark mode', d: window.__isDark ? "M12 3v1m0 16v1M4.22 4.22l.71.71m12.73 12.73.71.71M1 12h1m18 0h1M4.22 19.78l.71-.71M18.36 5.64l.71-.71M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z" : "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" },
  { label: 'Report issue', d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
  { label: 'Logout',       d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }];


  const iconBtn = { background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8, color: '#374151', display: 'flex', alignItems: 'center' };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '2px solid #e2e8f0', background: 'white', flexShrink: 0, position: 'relative', zIndex: 20, borderWidth: "0px 0px 1px", borderBottomStyle: "solid", borderBottomColor: "rgb(226, 232, 240)" }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <img src="assets/Logo.png" alt="BlueAI" style={{ width: 32, height: 32 }} onError={(e) => {e.target.style.display = 'none';}} />
        <span style={{ background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: 22, fontWeight: 700, lineHeight: 1 }}>BlueAI</span>
      </div>
      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Credits pill — only when logged in */}
        {isLoggedIn &&
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* navglow: pulsing ring behind the pill */}
            {creditsNudge === 'navglow' &&
          <div onClick={onEarnCredits} style={{ position: 'absolute', inset: -5, borderRadius: 999, border: '2px solid rgba(123,76,255,0.5)', animation: 'ba-ring 1.6s ease-out infinite', cursor: 'pointer', pointerEvents: 'auto', zIndex: 1 }} />
          }
            {/* navhotspot: annotation-style pulsing dot on corner */}
            {creditsNudge === 'navhotspot' &&
          <>
                <div style={{ position: 'absolute', top: -3, right: -3, width: 22, height: 22, borderRadius: '50%', border: '2px solid #7B4CFF', animation: 'ba-ring 1.4s ease-out infinite', zIndex: 3, pointerEvents: 'none' }} />
                <div onClick={onEarnCredits} style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: '50%', background: '#7B4CFF', border: '2px solid white', zIndex: 4, cursor: 'pointer', boxShadow: '0 0 6px rgba(123,76,255,0.7)' }} />
              </>
          }

            {/* the pill itself */}
            <div
            onClick={creditsNudge && creditsNudge.startsWith('nav') ? onEarnCredits : onCreditsClick}
            style={{ background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', borderRadius: 24, padding: 1.5, cursor: 'pointer', position: 'relative', zIndex: 2 }}>
              {/* navribbon: diagonal FREE corner ribbon */}
              {creditsNudge === 'navribbon' &&
            <div style={{ position: 'absolute', top: -1, right: -1, width: 24, height: 24, overflow: 'hidden', borderRadius: '0 24px 0 0', zIndex: 5, pointerEvents: 'none' }}>
                  <div style={{ position: 'absolute', top: 3, right: -6, background: '#f59e0b', color: 'white', fontSize: 6.5, fontWeight: 900, padding: '2px 8px', transform: 'rotate(45deg)', transformOrigin: 'center', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>FREE</div>
                </div>
            }
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'white', borderRadius: 24, padding: '5px 10px' }}>
                <img src="assets/Credits.svg" alt="" style={{ width: 14, height: 14 }} onError={(e) => {e.target.style.display = 'none';}} />
                <span style={{ background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: 13, fontWeight: 700 }}>{credits}</span>
                {/* navplus: + button appended inside pill */}
                {creditsNudge === 'navplus' &&
              <button onClick={(e) => {e.stopPropagation();onEarnCredits?.();}} style={{ width: 16, height: 16, borderRadius: '50%', background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, flexShrink: 0 }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  </button>
              }
              </div>
            </div>

            {/* navtag: small tag below the pill */}
            {creditsNudge === 'navtag' &&
          <button onClick={onEarnCredits} style={{ marginTop: 3, background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', border: 'none', borderRadius: 999, padding: '2px 7px', fontSize: 9, fontWeight: 800, color: 'white', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', lineHeight: 1.4, display: 'flex', alignItems: 'center', gap: 3 }}>
                <span>✦</span><span>earn free</span>
              </button>
          }
            {/* navbubble: speech bubble below pill */}
            {creditsNudge === 'navbubble' &&
          <button onClick={onEarnCredits}
          style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 6, background: '#1e1b2e', border: 'none', borderRadius: 10, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', zIndex: 30, transition: 'background 0.15s, transform 0.15s', boxShadow: '0 3px 10px rgba(0,0,0,0.3)' }}
          onMouseEnter={(e) => {e.currentTarget.style.background = '#312e4a';e.currentTarget.style.transform = 'translateX(-50%) translateY(-1px)';}}
          onMouseLeave={(e) => {e.currentTarget.style.background = '#1e1b2e';e.currentTarget.style.transform = 'translateX(-50%) translateY(0)';}}>
                <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '5px solid #1e1b2e' }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: 'white', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: 5 }}>✦ earn free <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="3" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg></span>
              </button>
          }
          </div>
        }

        {/* navbadge: standalone chip next to credits pill */}
        {isLoggedIn && creditsNudge === 'navbadge' &&
        <button onClick={onEarnCredits} style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fef3c7', border: '1.5px solid #fbbf24', borderRadius: 999, padding: '4px 8px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#b45309', whiteSpace: 'nowrap' }}>✦ earn free</span>
          </button>
        }
        {/* New chat pill */}
        {/* New chat pill — or Help icon when __navHelp is set */}
        {typeof window !== 'undefined' && window.__navHelp ?
        <button onClick={() => window.__onNavHelp?.()} aria-label="Help"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, color: '#7A8499', padding: 0 }}
        onMouseEnter={(e) => {e.currentTarget.style.color = '#1990FF';}}
        onMouseLeave={(e) => {e.currentTarget.style.color = '#7A8499';}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          </button> :

        <button onClick={onNewChat}
        style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#1990FF', border: 'none', borderRadius: 999, padding: '6px 13px 6px 9px', fontSize: 13, fontWeight: 600, color: 'white', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.88'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          New chat
        </button>
        }
        {/* Settings icon or 3-dot menu */}
        <div ref={menuRef} style={{ position: 'relative' }}>
<button onClick={() => setMenuOpen((v) => !v)} style={iconBtn}>
            <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
          </button>
          {menuOpen &&
          <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', width: 182, background: 'white', borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 50, overflow: 'hidden' }}>
              {menuItems.map((item) =>
            <button key={item.label} onClick={() => { setMenuOpen(false); window.__onKebabItem?.(item.label); }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#374151', textAlign: 'left', fontFamily: 'inherit' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#eef2ff'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
                  <svg width="15" height="15" fill="none" stroke="#6b7280" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={item.d} /></svg>
                  {item.label}
                </button>
            )}
            </div>
          }
        </div>
      </div>
    </div>);

}

/* ─── BOTTOM NAVBAR ──────────────────────────────────────────── */
function BottomNavbar({ activeTab, onTabChange, compact }) {
  const NAV = [
  { id: 'jobs', label: 'Jobs', Icon: IcoBriefcase },
  { id: 'skills', label: 'Skills', Icon: IcoLightbulb },
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
      <nav ref={navRef} style={{ display: 'flex', height: 46, alignItems: 'center', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderBottom: '1px solid #e8edf2', flexShrink: 0, padding: '0 10px', gap: 2, background: 'rgba(255,255,255,0.6)', position: 'relative' }}>
        <style>{'@keyframes tipFade { from { opacity:0; transform:translateX(-50%) translateY(-4px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }'}</style>
        {/* Sliding underline indicator */}
        <div style={{ position: 'absolute', bottom: 0, height: 2, background: '#1990FF', borderRadius: 1, transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1), width 0.25s cubic-bezier(0.4,0,0.2,1)', left: indicator.left, width: indicator.width, pointerEvents: 'none', zIndex: 2 }} />

        {/* Rich tooltip */}
        {tooltip && tipData && (
          <div style={{ position: 'absolute', top: 50, left: tooltip.center, transform: 'translateX(-50%)', zIndex: 100, background: 'white', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.13)', border: '1px solid #e2e8f0', padding: '10px 14px', width: TOOLTIP_W, pointerEvents: 'none', animation: 'tipFade 0.12s ease' }}>
            {/* Outer caret (border) */}
            <div style={{ position: 'absolute', top: -8, left: `calc(50% + ${tooltip.caretOffset}px)`, transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '8px solid #e2e8f0' }} />
            {/* Inner caret (fill) */}
            <div style={{ position: 'absolute', top: -6, left: `calc(50% + ${tooltip.caretOffset}px)`, transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '9px solid white' }} />
            <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 3 }}>{tipData.label}</p>
            <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{tipData.desc}</p>
          </div>
        )}

        {NAV_TOP.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <button key={id} ref={el => { if (el) tabRefs.current[id] = el; }} onClick={() => { onTabChange(id); hideTip(); }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#1990FF'; showTip(id, e.currentTarget); } }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#64748b'; hideTip(); }}
              style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, border: 'none', background: 'transparent', cursor: 'pointer', padding: active ? '0 12px' : '0 9px', height: '100%', flexShrink: active ? 0 : 1, whiteSpace: 'nowrap', color: active ? '#1990FF' : '#64748b', fontSize: 12.5, fontWeight: active ? 700 : 500, fontFamily: 'inherit', transition: 'color 0.2s', zIndex: 1 }}>
              <Icon size={17} />
              {active && <span>{label}</span>}
            </button>);
        })}
      </nav>);
  }
  return (
    <nav style={{ display: 'flex', height: 64, alignItems: 'center', background: 'white', borderTop: '1px solid #e2e8f0', boxShadow: '0 -2px 8px rgba(0,0,0,0.06)', flexShrink: 0, padding: '0 4px' }}>
      {NAV.map(({ id, label, Icon }) => {
        const active = activeTab === id;
        return (
          <button key={id} onClick={() => onTabChange(id)}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, border: 'none', background: active ? '#eef2ff' : 'transparent', cursor: 'pointer', padding: '4px 2px', height: '82%', borderRadius: 12, color: active ? '#4f46e5' : '#64748b', fontSize: '10.5px', fontWeight: active ? 700 : 600, transition: 'color 0.15s, background 0.15s', fontFamily: 'inherit' }}>
            <Icon size={22} />
            <span>{label}</span>
          </button>);

      })}
    </nav>);

}

// Export everything so other Babel script files can use them
Object.assign(window, {
  Toggle, ModalOverlay,
  TopNavbar, BottomNavbar,
  IcoBriefcase, IcoLightbulb, IcoChatBubble, IcoCalendar, IcoGear, IcoHistory,
  IcoXClose, IcoTrashBin, IcoPencilEdit, IcoPlusSmall, IcoArrowLeft
});