// BlueAI PM — Navbar Component
// Matches frontend/src/components/Navbar.tsx

const { useState } = React;

function Navbar({ currentRoute, onNavigate, onNewChat }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navbarStyles = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: '#fff', borderBottom: '2px solid #E2E8F0',
    padding: '10px 20px', height: '56px',
  };

  const menuItems = [
    { label: 'Chat History', route: 'chat-history', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
    { label: 'Profile', route: 'profile', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> },
    { label: 'Report Issue', route: null, icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg> },
    { label: 'Logout', route: 'logout', icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg> },
  ];

  return (
    <div style={navbarStyles}>
      {/* Left — Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: 32, height: 32, borderRadius: 6, background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <span style={{ fontSize: 22, fontWeight: 700, background: 'linear-gradient(to right,#0EA4C5,#7B4CFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>BlueAI</span>
      </div>

      {/* Right — Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Credits */}
        <div style={{ background: 'linear-gradient(to right,#0EA4C5,#7B4CFF)', padding: '1.5px', borderRadius: 999, cursor: 'pointer' }}>
          <div style={{ background: '#fff', borderRadius: 999, padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1l1.236 2.507 2.764.403-2 1.95.472 2.752L6 7.373 3.528 8.612 4 5.86 2 3.91l2.764-.403L6 1z" fill="#0EA4C5"/></svg>
            <span style={{ fontSize: 13, fontWeight: 700, background: 'linear-gradient(to right,#0EA4C5,#7B4CFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>2,450</span>
          </div>
        </div>

        {/* Avatar */}
        <div onClick={() => onNavigate('profile')} style={{ width: 32, height: 32, borderRadius: '50%', background: '#E0E7FF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 200ms' }}>
          <svg width="18" height="18" fill="none" stroke="#4F46E5" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        </div>

        {/* Three-dot menu */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setMenuOpen(o => !o)} style={{ width: 36, height: 36, borderRadius: 8, background: menuOpen ? '#F3F4F6' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" fill="#374151" viewBox="0 0 24 24"><circle cx="12" cy="6" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="18" r="1.5"/></svg>
          </button>
          {menuOpen && (
            <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 8, width: 192, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.10)', overflow: 'hidden', zIndex: 50 }}>
              {menuItems.map(item => (
                <div key={item.label} onClick={() => { setMenuOpen(false); if (item.route) onNavigate(item.route); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', fontSize: 14, color: '#374151', cursor: 'pointer', transition: 'background 150ms' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#EEF2FF'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  {item.icon} {item.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New chat / edit */}
        <button onClick={onNewChat} style={{ width: 36, height: 36, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" fill="none" stroke="#6B7280" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { Navbar });
