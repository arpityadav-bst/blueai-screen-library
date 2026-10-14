// BlueAI: the in-app gate (ROB-21388): the app signed in, silently or through the browser, with
// an account that isn't the accepted one. Exports: window.AccountGate = { GateCard, ConfirmCard }
//
// Rendered by login.jsx as a step of the sign-in modal, inside its card. Minimal on purpose
// (Abhisht, 2026-10-07): the account, where it came from, the pill, the one way out. No Apply
// button: the download link only goes to accepted people, so "not enrolled" always means "wrong
// account". Switch account signs the shared session out, which signs App Player out too, and the
// browser opens (signin_page.jsx).
//
// V3, Phase 2: Target tokens and the site's language (entry.css .v3-*): Inter, a lined account
// row, the solid dark button for the one action, an underlined ink link for the quiet one. The
// avatar fill is the account's own data (account.hue), not a theme colour.

(function () {
  function GateCard({ account, fromPlayer, onSwitch }) {
    return (
      <>
        <span className="v3-avatar" style={{ width: 'var(--v2-mark-xl)', height: 'var(--v2-mark-xl)', background: account.hue, fontSize: 'var(--v2-text-20)' }}>{account.name[0]}</span>
        <div>
          <p className="v3-note">Signed in as</p>
          <p className="v3-gate-email">{account.email}</p>
          {fromPlayer && <p className="v3-gate-body" style={{ marginTop: 'var(--v2-space-1)' }}>from App Player on this PC</p>}
        </div>
        <span className="v3-badge">Not enrolled</span>
        <button type="button" onClick={onSwitch} className="v3-btn-solid">Switch account</button>
        <p className="v3-note">App Player will be signed out too.</p>
      </>
    );
  }

  /* Option B (Abhisht, 2026-10-07): App Player is signed in, so BlueAI asks before using that
     account, enrolled or not. The button is Google's "Sign in as" shape, his reference. */
  function ConfirmCard({ account, onContinue, onSwitch }) {
    return (
      <>
        <div>
          <p className="v3-gate-title">Continue to BlueAI</p>
          <p className="v3-gate-body">Signed in on App Player on this PC</p>
        </div>
        <button type="button" onClick={onContinue} className="v3-account">
          <span className="v3-avatar" style={{ width: 'var(--v2-mark-md)', height: 'var(--v2-mark-md)', background: account.hue, fontSize: 'var(--v2-text-14)' }}>{account.name[0]}</span>
          <span style={{ minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 'var(--v2-text-14)', fontWeight: 'var(--v2-weight-semibold)', lineHeight: 'var(--v2-leading-snug)', color: 'var(--v2-ink)' }}>Continue as {account.first}</span>
            <span style={{ display: 'block', fontSize: 'var(--v2-text-13)', lineHeight: 'var(--v2-leading-snug)', color: 'var(--v2-ink-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{account.email}</span>
          </span>
        </button>
        <p className="v3-note">Not you?{' '}
          <button type="button" onClick={onSwitch} className="v3-link v3-link--ink">Switch account</button>
        </p>
      </>
    );
  }

  window.AccountGate = { GateCard, ConfirmCard };
})();
