// BlueAI: Profile (in-app screen) + Logout confirm modal.
// Opened from the kebab → Profile. Matches the live product's content: avatar, name/email, an
// Account Information card, and a Sign out row that confirms via a modal. V3, Phase 5: in-flow
// cards with a 1px line, the account as the site's ledger, the green only on "Verified".
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

  // The site's ledger row: a muted label, the value in ink, a hairline between rows.
  function Row({ label, children }) {
    return (
      <div className="v3-ledger-row">
        <span className="v3-ledger-label">{label}</span>
        <div className="v3-ledger-value">{children}</div>
      </div>
    );
  }

  function ProfileScreen({ onSignOut }) {
    return (
      <div className="tab-anim v3-screen">
        <div className="v3-screen-body" style={{ flex: 'none' }}>
          {/* Identity: avatar, name, email. No banner: the person is the content. */}
          <section className="v3-card v3-prof-id">
            <div className="v3-prof-avatar" style={{ background: '#A3D977' /* avatar art placeholder, not UI colour */ }} aria-hidden="true">🦇</div>
            <div style={{ minWidth: 0 }}>
              <p className="v3-prof-name">{ACCOUNT.name}</p>
              <p className="v3-set-desc" style={{ overflowWrap: 'anywhere' }}>{ACCOUNT.email}</p>
            </div>
          </section>

          {/* Account Information */}
          <section className="v3-card">
            <h2 className="v3-set-title">Account Information</h2>
            <div className="v3-ledger">
              <Row label="Handle">{ACCOUNT.handle}</Row>
              <Row label="Email">
                <p style={{ margin: 0 }}>{ACCOUNT.email}</p>
                <span className="v3-badge v3-badge--ok">Verified</span>
              </Row>
              <Row label="Country">{ACCOUNT.country}</Row>
              <Row label="Mobile"><span className="v3-ledger-value--empty">{ACCOUNT.mobile}</span></Row>
            </div>
          </section>

          {/* Sign out: a pressable row; the confirm dialog carries the decision. */}
          <button type="button" onClick={onSignOut} className="v3-row">
            <svg className="v3-row-icon v3-ico" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span className="v3-row-main v3-row-title">Sign out</span>
            <span className="v3-row-end"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" className="v3-ico" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg></span>
          </button>
        </div>
      </div>
    );
  }

  // The shared dialog frame (worker.css .v3-dialog*) at the confirm width: one solid ink commit,
  // a ghost way back. Signing out is reversible, so it is not painted red.
  function LogoutModal({ isOpen, onCancel, onConfirm }) {
    if (!isOpen) return null;
    return (
      <div onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }} className="v3-dialog-scrim" style={{ zIndex: 'var(--v2-z-dialog)' }}>
        <div role="dialog" aria-modal="true" aria-label="Logout" className="v3-dialog v3-dialog--plain v3-dialog--sm">
          <div className="v3-dialog-body">
            <h2 className="v3-dialog-title">Logout</h2>
            <p className="v3-dlg-text">Are you sure you want to sign out?</p>
            <div className="v3-btn-row v3-dlg-actions">
              <button type="button" onClick={onCancel} className="v3-btn-ghost">Cancel</button>
              <button type="button" onClick={onConfirm} className="v3-btn-solid">Logout</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  window.Profile = { ProfileScreen, LogoutModal };
})();
