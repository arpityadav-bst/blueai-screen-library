// BlueAI: Profile (in-app screen) + the Sign out confirm modal.
// Opened from the kebab → Profile. Matches the live product's content: avatar, name/email, an
// Account Information card, and a Sign out row that confirms via a modal. V3, Phase 5: in-flow
// cards with a 1px line, the account as the site's ledger, the green only on "Verified". Review
// round 1: kit cards, badge, avatar and dialog; the screen header; a neutral avatar. Round 2: the
// account is the kit's SettingsSection with ledger rows (a ListRow with a value: the label muted,
// the value in ink) and Sign out a kit nav row.
// Exposes window.Profile = { ProfileScreen, LogoutModal, ACCOUNT }. (Account values match live;
// the avatar art isn't in the export, so the avatar is the neutral initial disc.)
(function () {
  const ACCOUNT = {
    name: 'Arpit Yadav',
    email: 'arpit.yadav@bluestacks.com',
    handle: 'TriflingStandpoint',
    country: 'India',
    mobile: 'Not set',
  };

  // The site's ledger row, the kit's ListRow with a value: a muted label, the value in ink, a
  // hairline between rows.
  function Row({ label, children }) {
    return (
      <div className="v2-row v2-row--divider">
        <span className="v2-row-text"><span className="v2-row-label">{label}</span></span>
        <span className="v2-row-value">{children}</span>
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

          {/* Account information */}
          <section className="v2-settings-section">
            <h2 className="v2-settings-section-title v2-text-title">Account information</h2>
            <div className="v2-settings-section-body">
              <Row label="Handle">{ACCOUNT.handle}</Row>
              <Row label="Email">
                <span className="v3-value-stack">
                  <span>{ACCOUNT.email}</span>
                  <span className="v2-badge v2-badge--success"><span className="v2-badge-dot" aria-hidden="true" /><span className="v2-badge-label">Verified</span></span>
                </span>
              </Row>
              <Row label="Country">{ACCOUNT.country}</Row>
              <Row label="Mobile"><span className="v3-value-empty">{ACCOUNT.mobile}</span></Row>
            </div>
          </section>

          {/* Sign out: a kit nav row in a pad-none card; the confirm dialog carries the decision. */}
          <div className="v2-card v2-card--pad-none">
            <button type="button" onClick={onSignOut} className="v2-row v2-row--nav">
              <span className="v2-row-lead" aria-hidden="true"><window.V2Kit.Icon name="sign-out" size={20} /></span>
              <span className="v2-row-text"><span className="v2-row-label">Sign out</span></span>
              <span className="v2-row-chevron" aria-hidden="true"><window.V2Kit.Icon name="chevron-right" /></span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // The kit's dialog (kit/overlays.css) at the confirm width: one solid ink commit, a secondary
  // way back. Signing out is reversible, so it is not painted red (design-md 25). Review round 1
  // (U11): "Sign out" everywhere, the kit's sign-out words (design-md 64: what signing out costs),
  // the kit's focus hook (shared.jsx DialogPanel), and a confirm that signs out (index.html).
  function LogoutModal({ isOpen, onCancel, onConfirm }) {
    if (!isOpen) return null;
    return (
      <div className="v2-overlay v2-overlay--center">
        <div className="v2-scrim" onClick={onCancel} aria-hidden="true" />
        <DialogPanel onEscape={onCancel} labelledBy="signout-title" describedBy="signout-body" className="v2-dialog v2-dialog--sm">
          <div className="v2-dialog-head"><h2 id="signout-title" className="v2-dialog-title v2-text-title-dialog">Sign out of BlueAI?</h2></div>
          <div className="v2-dialog-body">
            <p id="signout-body" className="v2-text-body" style={{ overflowWrap: 'anywhere' }}>Your worker pauses while you’re signed out, and days without a run don’t count toward your 20 days. Sign in again with {ACCOUNT.email} to pick up where you left off.</p>
            <div className="v3-btn-row v3-dlg-actions">
              <button type="button" onClick={onCancel} className="v2-button v2-button--secondary v2-button--lg">Cancel</button>
              <button type="button" onClick={onConfirm} className="v2-button v2-button--primary v2-button--lg">Sign out</button>
            </div>
          </div>
        </DialogPanel>
      </div>
    );
  }

  window.Profile = { ProfileScreen, LogoutModal, ACCOUNT };
})();
