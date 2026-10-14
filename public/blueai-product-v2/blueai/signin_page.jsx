// BlueAI: the bluestacks.ai pages the app's Sign in opens in the browser (ROB-21388), and the
// state machine that walks the browser window through them.
// Exports: window.SignInPage = { SignInBrowser, ACCOUNTS }
//
// One case (Abhisht, 2026-10-13): the account BlueAI signed in with isn't enrolled. The
// download link only goes to accepted people, so that always means the wrong account. BlueAI
// and App Player share one sign-in on the PC, and BlueAI checks enrolment after EVERY sign-in,
// wherever it came from (App Player silently, or this browser). A wrong account gets the in-app
// message (account_gate.jsx); its Switch account opens this browser. The site keeps its own
// session, so it shows the account it holds first ("Continue as" / "Not you? Continue with a
// different ID"); a different ID goes to the site's own sign-in (site_signin.jsx) with Google's
// chooser forced (prompt=select_account). The browser checks nothing: no enrolment pill.
// Whatever account BlueAI ends up with, App Player ends up on it too.
// Drawn in the site's own language (site_kit.jsx), because these ARE bluestacks.ai pages.

(function () {
  const { useState } = React;
  const K = window.SiteKit;

  // Two Google accounts in one browser: the accepted one, and a workspace account.
  const ACCOUNTS = {
    primary: { id: 'primary', name: 'Alex Rivera', first: 'Alex', email: 'alex.rivera@gmail.com', hue: '#156efe', enrolled: true },
    other:   { id: 'other',   name: 'Alex Rivera', first: 'Alex', email: 'alex@riveramedia.co',   hue: '#0b0b0d', enrolled: false }
  };

  /* The one control: Google's "Sign in as <name> / <email>" button shape, in the site's skin.
     Just the account the site holds: no Google G (Abhisht, 2026-10-13), so it reads the same
     for an email account. */
  function SignInAs({ account, onClick, verb = 'Sign in as' }) {
    const hov = {
      onMouseEnter: (e) => { e.currentTarget.style.borderColor = K.T.borderHover; e.currentTarget.style.background = K.T.hover; },
      onMouseLeave: (e) => { e.currentTarget.style.borderColor = K.T.border; e.currentTarget.style.background = K.T.card; }
    };
    return (
      <button type="button" onClick={onClick} {...hov}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 14, height: 54, padding: '0 20px 0 12px', border: '1px solid ' + K.T.border, borderRadius: 6, background: K.T.card, color: K.T.ink, fontFamily: 'inherit', cursor: 'pointer', textAlign: 'left', transition: 'background 0.35s ease, border-color 0.35s ease' }}>
        <K.Avatar account={account} size={30} />
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2, lineHeight: 1.2 }}>
          <span style={{ fontSize: 14.5, fontWeight: 600, letterSpacing: '-0.015em' }}>{verb} {account.first}</span>
          <span style={{ fontSize: 12.5, color: K.T.muted, letterSpacing: '-0.01em' }}>{account.email}</span>
        </span>
      </button>
    );
  }

  /* The page the app opens when the browser already holds a session: the button and the
     "Not you?" line. Nothing else (Abhisht, 2026-10-07). */
  function ContinueAs({ account, onContinue, onSwitch }) {
    return (
      <K.Shell>
        <K.Mark />
        <K.Eyebrow>Almost there</K.Eyebrow>
        <K.Title>Continue to <K.Em>BlueAI</K.Em>.</K.Title>
        <K.Lede>Sign in to continue to the app.</K.Lede>
        <div style={{ marginTop: 30 }}><SignInAs account={account} onClick={onContinue} verb="Continue as" /></div>
        <K.Alt>Not you? <K.Link onClick={onSwitch}>Continue with a different ID</K.Link></K.Alt>
      </K.Shell>
    );
  }

  /* The live success page, as it is today (Abhisht, 2026-10-07: "let's keep it like that"): the
     page BlueAI's sign-in lands on at moments.now.gg/login. Copied from his screenshot. */
  function Done() {
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: K.T.font, background: 'radial-gradient(260px 260px at 4% 6%, rgba(21,110,254,0.06), transparent 70%), radial-gradient(240px 240px at 97% 96%, rgba(21,110,254,0.05), transparent 70%), #f8f9fb' }}>
        <div style={{ width: 336, padding: '28px 32px 30px', background: '#fff', border: '1px solid #eceef2', borderRadius: 20, boxShadow: '0 14px 34px -14px rgba(15,23,42,0.14)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill={K.T.blue} aria-hidden="true"><path d={K.SPARK} /></svg>
            <span style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em', color: '#1f2937' }}>Blue<span style={{ color: K.T.blue }}>AI</span></span>
          </div>
          <div style={{ marginTop: 22, width: 52, height: 52, borderRadius: '50%', background: '#e9f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={K.T.blue} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          </div>
          <p style={{ marginTop: 18, fontSize: 21, fontWeight: 600, letterSpacing: '-0.02em', color: '#111827' }}>You're signed in</p>
          <p style={{ marginTop: 8, fontSize: 13, color: '#4b5563' }}>Return to the BlueAI app to continue.</p>
          <p style={{ marginTop: 14, fontSize: 11, color: '#9ca3af' }}>You can close this window.</p>
        </div>
      </div>
    );
  }

  const ICON = {
    blueai: <img src="assets/Logo.png" alt="" />,
    google: <svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="none" stroke="#4285f4" strokeWidth="2" /><text x="8" y="11.5" textAnchor="middle" fontSize="9" fontWeight="700" fill="#4285f4" fontFamily="Arial">G</text></svg>
  };
  // What the tab and omnibox show per page. The Google address spells out prompt=select_account
  // on purpose: that parameter is the whole reason the chooser appears.
  const PAGE = {
    continue: { host: 'bluestacks.ai', path: '/app/continue', title: 'Continue to BlueAI', icon: 'blueai' },
    done:     { host: 'moments.now.gg', path: '/login?code=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL25vdy5nZyIsInN1YiI6...', title: 'BlueAI', icon: 'blueai' },
    signin:   { host: 'bluestacks.ai', path: '/sign-in?continue=/app/continue', title: 'Sign in to BlueAI', icon: 'blueai' },
    chooser:  { host: 'accounts.google.com', path: '/o/oauth2/auth?client_id=bluestacks.ai&prompt=select_account', title: 'Sign in - Google Accounts', icon: 'google' }
  };

  /* start: what bluestacks.ai holds when the browser opens. 'accepted' | 'other' (a session as
     that account: the continue page) | 'out' (none: the site's sign-in). onContinue gets the
     account the app will use; the app decides what its enrolment means.
     Abhisht, 2026-10-13: the website keeps its own session, and BlueAI signing out does not end
     it, so whenever the site holds an account it shows that account first: "Continue as" or
     "Not you?". No enrolment pill; BlueAI does the one check. No session: straight to the site's
     sign-in, never a flash of it in front of the continue page. */
  function SignInBrowser({ start = 'accepted', onContinue, onClose }) {
    const [page, setPage] = useState(start === 'out' ? 'signin' : 'continue');
    const [acctId, setAcctId] = useState(start === 'other' ? 'other' : 'primary');
    const account = ACCOUNTS[acctId];
    const m = PAGE[page];
    const finish = (id) => { setAcctId(id); setPage('done'); if (onContinue) onContinue({ ...ACCOUNTS[id] }); };
    return (
      <window.BrowserWindow url={m} title={m.title} favicon={ICON[m.icon]} onClose={onClose}>
        {page === 'continue' && <ContinueAs account={account} onContinue={() => finish(acctId)} onSwitch={() => setPage('signin')} />}
        {page === 'done' && <Done />}
        {page === 'signin' && <window.SiteSignIn.Gate onGoogle={() => setPage('chooser')} onEmail={() => finish('primary')} />}
        {page === 'chooser' && <window.SiteSignIn.GoogleChooser accounts={[ACCOUNTS.primary, ACCOUNTS.other]} onPick={finish} />}
      </window.BrowserWindow>
    );
  }

  window.SignInPage = { SignInBrowser, ACCOUNTS };
})();
