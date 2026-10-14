// BlueAI: the in-app gate (ROB-21388): the app signed in, silently or through the browser, with
// an account that isn't the accepted one. Exports: window.AccountGate = { GateCard }
//
// Rendered by login.jsx as a step of the sign-in modal, inside its card. Minimal on purpose:
// the account, what is wrong, the one way out. No Apply button: the download link only goes to
// accepted people, so "not enrolled" always means "wrong account". Switch account signs the
// shared session out and the browser opens (signin_page.jsx); the site still holds its own
// session, so it shows that account first ("Continue as" / "Not you?"). The check runs after
// every sign-in, so a second wrong pick lands here again.

(function () {
  const BTN = 'transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease';
  const lift = {
    onMouseEnter: (e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.filter = 'brightness(1.06)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(25,144,255,0.42)'; },
    onMouseLeave: (e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.filter = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(25,144,255,0.3)'; }
  };

  /* Abhisht, 2026-10-13: one case, wherever the account came from (App Player or the browser).
     No pill, no App Player lines. Second pass the same day ("doesn't look user friendly"): a
     soft switch-account icon instead of the bare black initial, a warm title that names the fix,
     one plain sentence on what went wrong and what to do, and the signed-in account as a
     recognisable row (avatar, name, email) instead of an address buried in a sentence. Copy is
     a draft. */
  function GateCard({ account, onSwitch }) {
    return (
      <>
        <span style={{ width: 64, height: 64, borderRadius: '50%', background: '#eaf3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1990FF" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
            <path d="M15 5.5h6M19 3.5l2 2-2 2" /><path d="M21 11h-6M17 9l-2 2 2 2" />
          </svg>
        </span>
        <div>
          <p style={{ fontSize: 17, fontWeight: 700, color: '#111827', lineHeight: 1.35 }}>Let’s switch accounts</p>
          <p style={{ marginTop: 8, fontSize: 13.5, color: '#6b7280', lineHeight: 1.55, textWrap: 'balance' }}>
            We couldn’t find your application on this account. Sign in with the account you applied with.
          </p>
        </div>
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 12, background: '#f8fafc', textAlign: 'left', boxSizing: 'border-box' }}>
          <span style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: account.hue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700 }}>{account.name[0]}</span>
          <span style={{ minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#111827' }}>{account.name}</span>
            <span style={{ display: 'block', fontSize: 12.5, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{account.email}</span>
          </span>
        </div>
        <button type="button" onClick={onSwitch} {...lift}
          style={{ background: '#1990FF', border: 'none', borderRadius: 999, padding: '10px 24px', fontSize: 14, fontWeight: 600, color: 'white', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(25,144,255,0.3)', transition: BTN }}>
          Switch account
        </button>
      </>
    );
  }

  /* Option B (Abhisht, 2026-10-07): App Player is signed in, so BlueAI asks before using that
     account, enrolled or not. The button is Google's "Sign in as" shape, his reference. */
  function ConfirmCard({ account, onContinue, onSwitch }) {
    const hov = {
      onMouseEnter: (e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; },
      onMouseLeave: (e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e2e8f0'; }
    };
    return (
      <>
        <div>
          <p style={{ fontSize: 17, fontWeight: 700, color: '#111827' }}>Continue to BlueAI</p>
          <p style={{ marginTop: 5, fontSize: 13, color: '#6b7280' }}>Signed in on App Player on this PC</p>
        </div>
        <button type="button" onClick={onContinue} {...hov}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'background 0.15s ease, border-color 0.15s ease' }}>
          <span style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: account.hue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700 }}>{account.name[0]}</span>
          <span style={{ minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#111827' }}>Continue as {account.first}</span>
            <span style={{ display: 'block', fontSize: 12.5, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{account.email}</span>
          </span>
        </button>
        <p style={{ fontSize: 13, color: '#6b7280' }}>Not you?{' '}
          <button type="button" onClick={onSwitch} style={{ border: 0, padding: 0, background: 'none', font: 'inherit', fontWeight: 600, color: '#1990FF', cursor: 'pointer' }}>Switch account</button>
        </p>
      </>
    );
  }

  window.AccountGate = { GateCard, ConfirmCard };
})();
