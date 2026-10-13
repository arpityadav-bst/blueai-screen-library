// BlueAI — the bluestacks.ai sign-in screen (what the app's redirect lands on when the browser
// holds no session) and Google's account chooser behind its Google button (ROB-21388).
// Exports: window.SiteSignIn = { Gate, GoogleChooser }
//
// The gate is the live site's own screen, copy and geometry included (its source is the vesper
// experiment's gate, level 2), drawn from SiteKit instead of its CSS. The one change this proposal
// makes to it is invisible on the page: the Google request carries prompt=select_account, so
// Google asks which account instead of reusing the last one. The chooser is drawn in the SHAPE of
// Google's page, not copied from it; the review is about the step, not the pixels.

(function () {
  const { useState } = React;
  const K = window.SiteKit;

  const MAIL = <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2.8" y="5.4" width="18.4" height="13.2" rx="2.6" /><path d="m3.7 7.3 7.2 5.1a2 2 0 0 0 2.2 0l7.2-5.1" /></svg>;

  /* The site's gate, verbatim. "Continue with email" becomes the field in place, as it does on
     the site; its arrow stands in for a sign-in with the applied account. */
  function Gate({ onGoogle, onEmail }) {
    const [mail, setMail] = useState(false);
    const [hint, setHint] = useState(false);
    return (
      <K.Shell>
        <K.Mark />
        <K.Eyebrow>Get started</K.Eyebrow>
        <K.Title>Sign in to <K.Em>BlueAI</K.Em>.</K.Title>
        <K.Lede>Sign in to start your application.</K.Lede>
        <K.Opts top={36}>
          {mail ? (
            <div style={{ position: 'relative', height: 48 }}>
              <input autoFocus placeholder="you@example.com" aria-label="Email"
                style={{ width: '100%', height: 48, padding: '0 58px 0 16px', border: '1px solid ' + K.T.blue, borderRadius: 6, background: K.T.card, color: K.T.ink, font: 'inherit', fontSize: 16, letterSpacing: '-0.02em', outline: 'none', boxShadow: '0 0 0 3px rgba(21,110,254,0.16)' }} />
              <button type="button" onClick={onEmail} aria-label="Continue"
                style={{ position: 'absolute', top: 5, right: 5, width: 38, height: 38, borderRadius: 6, border: 0, background: K.T.ink, color: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>{K.Arrow}</button>
            </div>
          ) : (
            <K.Opt icon={MAIL} onClick={() => setMail(true)}>Continue with email</K.Opt>
          )}
          <K.Opt icon={K.GoogleG} onClick={onGoogle}>Continue with Google</K.Opt>
        </K.Opts>
        <K.Alt>First time here? <K.Link onClick={() => setHint(true)}>See how it works</K.Link>{hint && <span style={{ marginLeft: 8, color: K.T.dim }}>(not in this mock)</span>}</K.Alt>
        <K.Legal>By signing up, you agree to the <K.U>Program Terms</K.U> and <K.U>Privacy Policy</K.U>, including <K.U>Cookie Use</K.U>.</K.Legal>
      </K.Shell>
    );
  }

  /* Google's "Choose an account". It appears at all only because the request carried
     prompt=select_account; without it, Google continues with the last account and never asks. */
  function GoogleChooser({ accounts, onPick }) {
    const [hint, setHint] = useState(false);
    const row = { display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '12px 24px', background: 'none', border: 'none', borderTop: '1px solid #e8eaed', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'background 0.12s ease' };
    const hov = { onMouseEnter: (e) => { e.currentTarget.style.background = '#f8f9fa'; }, onMouseLeave: (e) => { e.currentTarget.style.background = 'none'; } };
    return (
      <div style={{ position: 'absolute', inset: 0, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', Roboto, system-ui, sans-serif" }}>
        <div style={{ width: 420, border: '1px solid #dadce0', borderRadius: 8, padding: '36px 0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: 22, fontWeight: 600, color: '#5f6368', letterSpacing: '-0.3px' }}>Google</span>
          <p style={{ marginTop: 14, fontSize: 22, color: '#202124' }}>Choose an account</p>
          <p style={{ marginTop: 6, marginBottom: 22, fontSize: 14, color: '#5f6368' }}>to continue to <b style={{ fontWeight: 600 }}>bluestacks.ai</b></p>
          {accounts.map((a) => (
            <button key={a.id} type="button" onClick={() => onPick(a.id)} style={row} {...hov}>
              <K.Avatar account={a} size={32} />
              <span style={{ minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#202124' }}>{a.name}</span>
                <span style={{ display: 'block', fontSize: 13, color: '#5f6368' }}>{a.email}</span>
              </span>
            </button>
          ))}
          <button type="button" onClick={() => setHint(true)} style={{ ...row, borderBottom: '1px solid #e8eaed' }} {...hov}>
            <span style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #dadce0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5f6368', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#202124' }}>Use another account</span>
            {hint && <span style={{ marginLeft: 'auto', fontSize: 12, color: '#9aa0a6' }}>Not in this mock</span>}
          </button>
          <p style={{ margin: '18px 28px 0', fontSize: 12, color: '#5f6368', lineHeight: 1.5, textAlign: 'center' }}>To continue, Google will share your name, email address and profile picture with bluestacks.ai.</p>
        </div>
      </div>
    );
  }

  window.SiteSignIn = { Gate, GoogleChooser };
})();
