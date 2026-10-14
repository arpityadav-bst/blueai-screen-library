// BlueAI: the in-app gate (ROB-21388): the app signed in, silently or through the browser, with
// an account that isn't the accepted one. Exports: window.AccountGate = { GateCard, ConfirmCard }
//
// Rendered by login.jsx as a step of the sign-in modal, inside its card. Minimal on purpose
// (Abhisht, 2026-10-07): the account, where it came from, the pill, the one way out. No Apply
// button: the download link only goes to accepted people, so "not enrolled" always means "wrong
// account". Switch account signs the shared session out, which signs App Player out too, and the
// browser opens (signin_page.jsx).
//
// V3, Phase 2: Target tokens and the site's language (entry.css .v3-*; kit avatar, badge, button and
// link since review round 1): Inter, a lined account row, the primary button for the one action, an
// underlined ink link for the quiet one. The avatar fill is the account's own data (account.hue).

(function () {
  function GateCard({ account, fromPlayer, onSwitch }) {
    return (
      <>
        <span className="v2-avatar v2-avatar--56" style={{ background: account.hue }}>{account.name[0]}</span>
        <div>
          <p className="v2-text-body-sm">Signed in as</p>
          <p className="v3-gate-email">{account.email}</p>
          {fromPlayer && <p className="v2-text-body-sm v3-gate-body" style={{ marginTop: 'var(--v2-space-1)' }}>from App Player on this PC</p>}
        </div>
        <span className="v2-badge"><span className="v2-badge-dot" aria-hidden="true" /><span className="v2-badge-label">Not enrolled</span></span>
        <button type="button" onClick={onSwitch} className="v2-button v2-button--primary v2-button--lg">Switch account</button>
        <p className="v2-text-body-sm">App Player will be signed out too.</p>
      </>
    );
  }

  /* Option B (Abhisht, 2026-10-07): App Player is signed in, so BlueAI asks before using that
     account, enrolled or not. The button is Google's "Sign in as" shape, his reference. */
  function ConfirmCard({ account, onContinue, onSwitch }) {
    return (
      <>
        <div>
          <p className="v2-text-title-lg">Continue to BlueAI</p>
          <p className="v2-text-body-sm v3-gate-body">Signed in on App Player on this PC</p>
        </div>
        <button type="button" onClick={onContinue} className="v3-account">
          <span className="v2-avatar" style={{ background: account.hue }}>{account.name[0]}</span>
          <span style={{ minWidth: 0 }}>
            <span className="v3-account-name">Continue as {account.first}</span>
            <span className="v3-account-email">{account.email}</span>
          </span>
        </button>
        <p className="v2-text-body-sm">Not you?{' '}
          <button type="button" onClick={onSwitch} className="v2-link"><span className="v2-link-text">Switch account</span></button>
        </p>
      </>
    );
  }

  window.AccountGate = { GateCard, ConfirmCard };
})();
