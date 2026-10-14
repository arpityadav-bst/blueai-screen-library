// BlueAI: the in-app gate (ROB-21388): the app signed in, silently or through the browser, with
// an account that isn't the accepted one. Exports: window.AccountGate = { GateCard }
//
// Rendered by login.jsx as a step of the sign-in modal, inside its card. ONE case (PM, 2026-10-13),
// wherever the account came from (App Player or the browser): a switch-account mark, a title that
// names the fix, one sentence on what went wrong and what to do, the signed-in account as a
// recognisable row (avatar, name, email), the one way out. No pill, no App Player lines, no Apply
// button: the download link only goes to accepted people, so "not enrolled" always means "wrong
// account". Switch account signs the shared session out and the browser opens (signin_page.jsx);
// the site still holds its own session, so it shows that account first. The check runs after every
// sign-in, so a second wrong pick lands here again.
//
// V3: Target tokens and the site's language (entry.css .v3-*; kit avatar and button): the gate mark
// disc, the lined account row (as a static row), the primary button for the one action. The avatar
// fill is the kit's avatar hue the account names (account.hue, .v2-avatar--hue-N).

(function () {
  function GateCard({ account, onSwitch }) {
    return (
      <>
        <span className="v3-gate-mark" aria-hidden="true">
          <svg className="v2-icon v2-icon--24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
            <path d="M15 5.5h6M19 3.5l2 2-2 2" /><path d="M21 11h-6M17 9l-2 2 2 2" />
          </svg>
        </span>
        <div>
          <p className="v2-text-title-lg" data-step-title="" tabIndex={-1}>Let’s switch accounts</p>
          <p className="v2-text-body-sm v3-gate-body">We couldn’t find your application on this account. Sign in with the account you applied with.</p>
        </div>
        <div className="v3-account">
          <span className={'v2-avatar v2-avatar--hue-' + account.hue}>{account.name[0]}</span>
          <span style={{ minWidth: 0 }}>
            <span className="v3-account-name">{account.name}</span>
            <span className="v3-account-email">{account.email}</span>
          </span>
        </div>
        <button type="button" onClick={onSwitch} className="v2-button v2-button--primary v2-button--lg v2-button--full">Switch account</button>
      </>
    );
  }

  window.AccountGate = { GateCard };
})();
