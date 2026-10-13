// BlueAI: the in-app gate (ROB-21388): the app signed in, silently or through the browser, with
// an account that isn't the accepted one. Exports: window.AccountGate = { GateCard }
//
// Rendered by login.jsx as a step of the sign-in modal, inside its card. Minimal on purpose
// (Abhisht, 2026-10-07): the account, where it came from, the pill, the one way out. No Apply
// button: the download link only goes to accepted people, so "not enrolled" always means "wrong
// account". Switch account signs the shared session out, which signs App Player out too, and the
// browser opens (signin_page.jsx).

(function () {
  const BTN = 'transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease';
  const lift = {
    onMouseEnter: (e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.filter = 'brightness(1.06)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(25,144,255,0.42)'; },
    onMouseLeave: (e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.filter = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(25,144,255,0.3)'; }
  };

  function GateCard({ account, fromPlayer, onSwitch }) {
    return (
      <>
        <span style={{ width: 56, height: 56, borderRadius: '50%', background: account.hue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 600 }}>{account.name[0]}</span>
        <div>
          <p style={{ fontSize: 13, color: '#6b7280' }}>Signed in as</p>
          <p style={{ marginTop: 2, fontSize: 16, fontWeight: 700, color: '#111827' }}>{account.email}</p>
          {fromPlayer && <p style={{ marginTop: 4, fontSize: 13, color: '#6b7280' }}>from App Player on this PC</p>}
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', background: '#f1f5f9', borderRadius: 999, padding: '5px 10px' }}>Not enrolled</span>
        <button type="button" onClick={onSwitch} {...lift}
          style={{ background: '#1990FF', border: 'none', borderRadius: 999, padding: '10px 24px', fontSize: 14, fontWeight: 600, color: 'white', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(25,144,255,0.3)', transition: BTN }}>
          Switch account
        </button>
        <p style={{ fontSize: 12.5, color: '#9ca3af' }}>App Player will be signed out too.</p>
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
