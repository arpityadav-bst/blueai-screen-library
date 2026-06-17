// BlueAI — Profile (in-app screen) + Logout confirm modal.
// Opened from the kebab → Profile. Matches the live product: gradient banner + avatar,
// name/email, an Account Information card, and a Sign out card that confirms via a modal.
// Exposes window.Profile = { ProfileScreen, LogoutModal }. (Account values match live;
// the avatar art isn't in the export, so it's a best-effort placeholder.)
(function () {
  const ACCOUNT = {
    name: 'Arpit Yadav',
    email: 'arpit.yadav@bluestacks.com',
    handle: 'TriflingStandpoint',
    country: 'India',
    mobile: 'Not set',
  };

  function Row({ label, last, children }) {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: '14px 0', borderBottom: last ? 'none' : '1px solid #eef2f6' }}>
        <span style={{ fontSize: 14.5, color: '#64748b', flexShrink: 0 }}>{label}</span>
        <div style={{ textAlign: 'right', minWidth: 0 }}>{children}</div>
      </div>
    );
  }

  const valStyle = { fontSize: 14.5, fontWeight: 600, color: '#111827' };

  function ProfileScreen({ onSignOut }) {
    return (
      <div className="tab-anim" style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', padding: '14px 16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Identity card: gradient banner · avatar · name · email */}
        <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ height: 96, background: 'linear-gradient(100deg,#2f6fed,#7B4CFF)' }} />
          <div style={{ padding: '0 18px 18px' }}>
            <div style={{ width: 92, height: 92, borderRadius: '50%', background: '#A3D977', border: '4px solid white', marginTop: -54, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 46, lineHeight: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
              🦇
            </div>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#111827', letterSpacing: '-0.4px', marginTop: 12 }}>{ACCOUNT.name}</p>
            <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 2, wordBreak: 'break-all' }}>{ACCOUNT.email}</p>
          </div>
        </div>

        {/* Account Information */}
        <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)', padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#111827' }}>Account Information</h2>
          </div>
          <Row label="Handle"><span style={valStyle}>{ACCOUNT.handle}</span></Row>
          <Row label="Email">
            <p style={{ ...valStyle, wordBreak: 'break-all' }}>{ACCOUNT.email}</p>
            <span style={{ display: 'inline-block', marginTop: 6, background: '#dcfce7', color: '#16a34a', fontSize: 11.5, fontWeight: 700, borderRadius: 999, padding: '3px 10px' }}>Verified</span>
          </Row>
          <Row label="Country"><span style={valStyle}>{ACCOUNT.country}</span></Row>
          <Row label="Mobile" last><span style={{ ...valStyle, color: '#94a3b8' }}>{ACCOUNT.mobile}</span></Row>
        </div>

        {/* Sign out */}
        <button onClick={onSignOut}
          style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', background: 'white', borderRadius: 14, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', padding: '16px 18px', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.12s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={e => e.currentTarget.style.background = 'white'}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span style={{ flex: 1, textAlign: 'left', fontSize: 15, fontWeight: 600, color: '#374151' }}>Sign out</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>
    );
  }

  function LogoutModal({ isOpen, onCancel, onConfirm }) {
    if (!isOpen) return null;
    return (
      <div onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
        style={{ position: 'absolute', inset: 0, zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.45)', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 340, background: 'white', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', padding: '22px 22px 18px' }}>
          <h2 style={{ fontSize: 19, fontWeight: 800, color: '#111827', marginBottom: 8 }}>Logout</h2>
          <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.5, marginBottom: 20 }}>Are you sure you want to sign out?</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onCancel} style={{ flex: 1, borderRadius: 10, border: '1px solid #e2e8f0', background: 'white', padding: '11px', fontSize: 14, fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            <button onClick={onConfirm} style={{ flex: 1, borderRadius: 10, border: 'none', background: '#ef4444', padding: '11px', fontSize: 14, fontWeight: 700, color: 'white', cursor: 'pointer', fontFamily: 'inherit' }}>Logout</button>
          </div>
        </div>
      </div>
    );
  }

  window.Profile = { ProfileScreen, LogoutModal };
})();
