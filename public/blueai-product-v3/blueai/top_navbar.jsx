// BlueAI: TopNavbar, the older header (moved out of shared.jsx in V3 Phase 1 to keep that file under
// 300 lines). Nothing in the product renders it today; credits_widget.jsx's nav-based nudges
// (navglow, navhotspot, navribbon, navplus, navtag, navbubble, navbadge) are written against it, so
// it stays exported and working. Shell look per the Target tokens: 52 tall, surface, one hairline,
// the onBlue BlueAI logo, a hairline credits chip. The nudge decorations keep their own colours
// until the credits phase restyles them.
// Exports: TopNavbar

(function () {
  const { useState, useRef, useEffect } = React;

  const MENU_ITEMS = [
    { label: 'Settings',     d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" },
    { label: 'Account',      d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { label: 'Report issue', d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
    { label: 'Logout',       d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }
  ];
  const THEME_ITEM = (dark) => ({ label: dark ? 'Light mode' : 'Dark mode', d: dark ? "M12 3v1m0 16v1M4.22 4.22l.71.71m12.73 12.73.71.71M1 12h1m18 0h1M4.22 19.78l.71-.71M18.36 5.64l.71-.71M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z" : "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" });
  const GRAD = 'linear-gradient(90deg,#0EA4C5,#7B4CFF)';   // nudge decorations only (credits phase)

  function TopNavbar({ onNewChat, isLoggedIn, creditsNudge = null, onEarnCredits, credits = 240, onCreditsClick }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
      const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
      if (menuOpen) document.addEventListener('mousedown', h);
      return () => document.removeEventListener('mousedown', h);
    }, [menuOpen]);

    const menuItems = [MENU_ITEMS[0], MENU_ITEMS[1], THEME_ITEM(window.__isDark), MENU_ITEMS[2], MENU_ITEMS[3]];

    return (
      <header className={'ba-topbar' + (isLoggedIn ? '' : ' ba-topbar--out')}>
        <div className="ba-topbar-actions">
          {/* Credits chip: only when logged in */}
          {isLoggedIn &&
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* navglow: pulsing ring behind the chip */}
            {creditsNudge === 'navglow' &&
              <div onClick={onEarnCredits} style={{ position: 'absolute', inset: -5, borderRadius: 999, border: '2px solid rgba(123,76,255,0.5)', animation: 'ba-ring 1.6s ease-out infinite', cursor: 'pointer', pointerEvents: 'auto', zIndex: 1 }} />}
            {/* navhotspot: annotation-style pulsing dot on corner */}
            {creditsNudge === 'navhotspot' &&
              <>
                <div style={{ position: 'absolute', top: -3, right: -3, width: 22, height: 22, borderRadius: '50%', border: '2px solid #7B4CFF', animation: 'ba-ring 1.4s ease-out infinite', zIndex: 3, pointerEvents: 'none' }} />
                <div onClick={onEarnCredits} style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: '50%', background: '#7B4CFF', border: '2px solid white', zIndex: 4, cursor: 'pointer', boxShadow: '0 0 6px rgba(123,76,255,0.7)' }} />
              </>}

            {/* the chip itself */}
            <button type="button" className="ba-credits-chip" aria-label="AI credits"
              onClick={creditsNudge && creditsNudge.startsWith('nav') ? onEarnCredits : onCreditsClick}
              style={{ position: 'relative', zIndex: 2 }}>
              {/* navribbon: diagonal FREE corner ribbon */}
              {creditsNudge === 'navribbon' &&
                <span style={{ position: 'absolute', top: -1, right: -1, width: 24, height: 24, overflow: 'hidden', borderRadius: '0 24px 0 0', zIndex: 5, pointerEvents: 'none' }}>
                  <span style={{ position: 'absolute', top: 3, right: -6, background: '#f59e0b', color: 'white', fontSize: 6.5, fontWeight: 600, padding: '2px 8px', transform: 'rotate(45deg)', transformOrigin: 'center', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>FREE</span>
                </span>}
              <img src="assets/Credits.svg" alt="" style={{ width: 16, height: 16 }} onError={(e) => { e.target.style.display = 'none'; }} />
              <span>{credits}</span>
              {/* navplus: + button appended inside the chip */}
              {creditsNudge === 'navplus' &&
                <span role="button" tabIndex={0} aria-label="Earn free credits" onClick={(e) => { e.stopPropagation(); onEarnCredits?.(); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onEarnCredits?.(); } }}
                  style={{ width: 16, height: 16, borderRadius: '50%', background: GRAD, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                </span>}
            </button>

            {/* navtag: small tag below the chip */}
            {creditsNudge === 'navtag' &&
              <button onClick={onEarnCredits} style={{ marginTop: 3, background: GRAD, border: 'none', borderRadius: 999, padding: '2px 7px', fontSize: 9, fontWeight: 600, color: 'white', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', lineHeight: 1.4, display: 'flex', alignItems: 'center', gap: 3 }}>
                <span>✦</span><span>earn free</span>
              </button>}
            {/* navbubble: speech bubble below the chip */}
            {creditsNudge === 'navbubble' &&
              <button onClick={onEarnCredits}
                style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 6, background: '#1e1b2e', border: 'none', borderRadius: 10, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', zIndex: 30, transition: 'background 0.15s, transform 0.15s', boxShadow: '0 3px 10px rgba(0,0,0,0.3)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#312e4a'; e.currentTarget.style.transform = 'translateX(-50%) translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#1e1b2e'; e.currentTarget.style.transform = 'translateX(-50%) translateY(0)'; }}>
                <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '5px solid #1e1b2e' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'white', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: 5 }}>✦ earn free <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="3" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg></span>
              </button>}
          </div>}

          {/* navbadge: standalone chip next to the credits chip */}
          {isLoggedIn && creditsNudge === 'navbadge' &&
            <button onClick={onEarnCredits} style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fef3c7', border: '1.5px solid #fbbf24', borderRadius: 999, padding: '4px 8px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: '#b45309', whiteSpace: 'nowrap' }}>✦ earn free</span>
            </button>}

          {/* New chat, or the Help icon when __navHelp is set */}
          {typeof window !== 'undefined' && window.__navHelp ?
            <button type="button" className="ba-iconbtn" onClick={() => window.__onNavHelp?.()} aria-label="Help">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            </button> :
            <button type="button" className="ba-newchat" onClick={onNewChat}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              New chat
            </button>}

          {/* More (kebab) menu */}
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button type="button" className="ba-iconbtn" aria-label="More options" aria-haspopup="menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
            </button>
            {menuOpen &&
              <div className="ba-menu" role="menu">
                {menuItems.map((item) =>
                  <button key={item.label} type="button" role="menuitem" className="ba-menu-item" onClick={() => { setMenuOpen(false); window.__onKebabItem?.(item.label); }}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" className="ba-menu-icon"><path strokeLinecap="round" strokeLinejoin="round" d={item.d} /></svg>
                    {item.label}
                  </button>)}
              </div>}
          </div>
        </div>
      </header>);
  }

  Object.assign(window, { TopNavbar });
})();
