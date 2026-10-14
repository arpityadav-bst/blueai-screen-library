// BlueAI: Profile (in-app screen) + Logout confirm modal.
// Opened from the kebab → Profile. Matches the live product's content: avatar, name/email, an
// Account Information card, and a Sign out row that confirms via a modal. V3, Phase 5: in-flow
// cards with a 1px line, the account as the site's ledger, the green only on "Verified". Review
// round 1: kit cards, badge, avatar and dialog; the screen header; a neutral avatar.
// Exposes window.Profile = { ProfileScreen, LogoutModal }. (Account values match live;
// the avatar art isn't in the export, so the avatar is the neutral initial disc.)
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
      <div className="v2-anim-fade-up v3-screen">
        <ScreenHead title="Profile" />
        <div className="v3-screen-body v3-screen-body--fit">
          {/* Identity: avatar, name, email. No banner: the person is the content. The avatar is the
             kit's neutral disc (the initial on the sunken surface): no placeholder art colour. */}
          <section className="v2-card v3-prof-id">
            <span className="v2-avatar v2-avatar--56 v2-avatar--app" aria-hidden="true">{ACCOUNT.name[0]}</span>
            <div style={{ minWidth: 0 }}>
              <p className="v2-text-title-lg v3-prof-name">{ACCOUNT.name}</p>
              <p className="v2-text-body-sm v3-set-desc" style={{ overflowWrap: 'anywhere' }}>{ACCOUNT.email}</p>
            </div>
          </section>

          {/* Account Information */}
          <section className="v2-card">
            <h2 className="v2-text-title v3-set-title">Account Information</h2>
            <div className="v3-ledger">
              <Row label="Handle">{ACCOUNT.handle}</Row>
              <Row label="Email">
                <p style={{ margin: 0 }}>{ACCOUNT.email}</p>
                <span className="v2-badge v2-badge--success"><span className="v2-badge-dot" aria-hidden="true" /><span className="v2-badge-label">Verified</span></span>
              </Row>
              <Row label="Country">{ACCOUNT.country}</Row>
              <Row label="Mobile"><span className="v3-ledger-value--empty">{ACCOUNT.mobile}</span></Row>
            </div>
          </section>

          {/* Sign out: a pressable row; the confirm dialog carries the decision. */}
          <button type="button" onClick={onSignOut} className="v3-row">
            <svg className="v2-icon v2-icon--20 v3-row-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span className="v3-row-main v3-row-title">Sign out</span>
            <span className="v3-row-end"><svg className="v2-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg></span>
          </button>
        </div>
      </div>
    );
  }

  // The kit's dialog (kit/overlays.css) at the confirm width: one solid ink commit, a secondary
  // way back. Signing out is reversible, so it is not painted red (design-md 25).
  function LogoutModal({ isOpen, onCancel, onConfirm }) {
    if (!isOpen) return null;
    return (
      <div className="v2-overlay v2-overlay--center">
        <div className="v2-scrim" onClick={onCancel} aria-hidden="true" />
        <div role="dialog" aria-modal="true" aria-label="Logout" className="v2-dialog v2-dialog--sm">
          <div className="v2-dialog-head"><h2 className="v2-dialog-title v2-text-title-dialog">Logout</h2></div>
          <div className="v2-dialog-body">
            <p className="v2-text-body">Are you sure you want to sign out?</p>
            <div className="v3-btn-row v3-dlg-actions">
              <button type="button" onClick={onCancel} className="v2-button v2-button--secondary v2-button--lg">Cancel</button>
              <button type="button" onClick={onConfirm} className="v2-button v2-button--primary v2-button--lg">Logout</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  window.Profile = { ProfileScreen, LogoutModal };
})();
