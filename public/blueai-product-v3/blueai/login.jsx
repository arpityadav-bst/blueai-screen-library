// BlueAI: Login Modal. States: default → browser → signing → success | gate | confirm (ROB-21388,
// cards in account_gate.jsx). onOpenBrowser hands 'browser' to the desktop's browser window;
// browserResult finishes it. 'gate' / 'confirm' start from App Player's account (gateAccount).

const { useState, useEffect } = React;

function LoginModal({ isOpen, onClose, onSuccess, initialStep, onOpenBrowser, browserResult, onSwitchAccount, gateAccount, playerSwitch }) {
  const [step, setStep] = useState(initialStep || 'default');

  // Reset state when modal reopens. initialStep lets a caller skip straight past the 'default'
  // step (MoneyMaker's welcome page already IS that screen, full-page, see moneymaker.jsx).
  useEffect(() => {if (isOpen) setStep(initialStep || 'default');}, [isOpen, initialStep]);

  // Opening directly at 'browser' skips the click that normally starts handleSignIn, so start
  // the browser step here instead: open the desktop's browser window when the parent drives one,
  // else replay the old auto-advance timers.
  useEffect(() => {
    if (!isOpen || initialStep !== 'browser') return;
    if (onOpenBrowser) { onOpenBrowser(); return; }
    const t1 = setTimeout(() => setStep('signing'), 2200);
    const t2 = setTimeout(() => setStep('success'), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isOpen, initialStep]);

  // The browser page handed back an account: finish the sign-in with that account's status.
  useEffect(() => {
    if (!isOpen || !browserResult) return;
    setStep('signing');
    const t = setTimeout(() => setStep(browserResult.enrolled ? 'success' : 'gate'), 1500);
    return () => clearTimeout(t);
  }, [browserResult]);

  useEffect(() => {
    const h = (e) => {if (e.key === 'Escape' && step === 'default') onClose?.();};
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [step, onClose]);

  if (!isOpen) return null;

  const handleSignIn = () => {
    setStep('browser');
    if (onOpenBrowser) { onOpenBrowser(); return; }
    setTimeout(() => setStep('signing'), 2200);
    setTimeout(() => setStep('success'), 4000);
  };

  const handleContinue = () => {onSuccess?.();};

  // maxWidth widened 288→360 so the browser step's "Use the account you applied with" line fits
  // on one row instead of wrapping (shared by all three of this step's screens: browser/signing/
  // success: harmless there, just more breathing room around already-centered content).
  // V3, Phase 2: the card is the Target surface with a 1px line and no shadow (entry.css
  // .v3-gate-card), on the frost scrim, in the site's language like the welcome behind it.
  const card = (children) => <div className="v3-gate-card">{children}</div>;


  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column', fontFamily: 'var(--v2-font-ui)', background: 'var(--v2-scrim-frost)', backdropFilter: 'blur(var(--v2-scrim-blur))', WebkitBackdropFilter: 'blur(var(--v2-scrim-blur))' }}>
      <style>{`@keyframes loginSpin{to{transform:rotate(360deg)}}`}</style>

      {/* Close: on every step, as in the live app (ai-worker LoginModal.tsx renders it always),
         except the account check (ROB-21388), which blocks the home screen. */}
      {step !== 'gate' && step !== 'confirm' &&
      <button type="button" onClick={onClose} aria-label="Close" className="v3-icon-btn"
      style={{ position: 'absolute', top: 'var(--v2-space-3)', right: 'var(--v2-space-3)' }}>
          <IcoXClose size={18} />
        </button>
      }

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px' }}>

        {/* ── DEFAULT: the free-credits sign-in (logged out, opened from the onboarding chat's
             Send). V3, Phase 5: the same gate card as the steps after it, in the welcome's
             language: the spark, the grant as one ink figure beside the credits glyph (the only
             place its cyan to violet art lives), a muted tick line, the hairline, the solid ink
             claim button, and the underlined terms link. No glow orb, no gradient text. The
             three older sign-in layouts (credits-first, minimal, classic) were unreachable and are
             deleted; this is the only default step. ── */}
        {step === 'default' && card(
          <>
            <window.BlueAILogo wordmark={false} mark={38} label="" />
            <p className="v3-gate-body" style={{ margin: 0 }}>You need AI Credits to use BlueAI</p>
            <div>
              <div className="v3-cr-figure">
                <img src="assets/Credits.svg" alt="" className="v3-cr-glyph" />
                <span className="v3-cr-value">500</span>
              </div>
              <p className="v3-gate-title" style={{ marginTop: 'var(--v2-space-2)' }}>Free AI Credits</p>
              <p className="v3-gate-body">on your first login</p>
            </div>
            <p className="v3-signin-tick">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
              Enough for ~10 tasks
            </p>
            <hr className="v3-rule" />
            <button type="button" onClick={handleSignIn} className="v3-btn-solid v3-btn-full">
              Sign in to claim
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ strokeWidth: 'var(--v2-icon-stroke)' }}><path d="M9 5l7 7-7 7" /></svg>
            </button>
            <button type="button" className="v3-link v3-signin-terms">Terms &amp; Conditions</button>
          </>
        )}

        {/* ── CHECK BROWSER ── */}
        {step === 'browser' && card(
          <>
            <span className="v3-gate-mark" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ strokeWidth: 'var(--v2-icon-stroke)' }}>
                <rect x="3" y="4.5" width="18" height="15" rx="2.5" /><path d="M3 9h18" /><path d="M6.5 6.75h.01M9 6.75h.01" />
              </svg>
            </span>
            <div>
              <p className="v3-gate-title">Check your browser</p>
              <p className="v3-gate-body">Finish logging in from your web browser</p>
            </div>
            {/* A neutral notice: blue is held to focus, selection and the logo on these screens. */}
            <div className="v3-notice">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ strokeWidth: 'var(--v2-icon-stroke)' }}>
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Use the account you applied with</span>
            </div>
            <hr className="v3-rule" />
            <button type="button" onClick={handleSignIn} className="v3-link" style={{ fontSize: 'var(--v2-text-13)' }}>
              Not seeing the browser tab?
            </button>
            <button type="button" onClick={handleSignIn} className="v3-btn-solid">
              Try again
            </button>
          </>
        )}

        {/* ── SIGNING IN ── */}
        {step === 'signing' && card(
          <>
            <span className="v3-gate-mark" aria-hidden="true">
              <span style={{ width: 'var(--v2-icon-lg)', height: 'var(--v2-icon-lg)', borderRadius: 'var(--v2-radius-round)', border: '2.5px solid var(--v2-line)', borderTopColor: 'var(--v2-ink)', animation: 'loginSpin var(--v2-dur-spin) linear infinite' }} />
            </span>
            <div>
              <p className="v3-gate-title">Signing in…</p>
              <p className="v3-gate-body">Please wait while we complete your sign-in</p>
            </div>
          </>
        )}

        {/* ── SUCCESS ── */}
        {step === 'success' && card(
          <>
            <span className="v3-gate-mark v3-gate-mark--success" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
            </span>
            <div>
              <p className="v3-gate-title">Logged in</p>
              <p className="v3-gate-body">Welcome back!</p>
            </div>
            <button type="button" onClick={() => onSuccess?.()} className="v3-btn-solid">
              Continue
            </button>
          </>
        )}

        {/* ── GATE (ROB-21388): signed in, but not with the accepted account. From App Player's
             session at launch (gateAccount), or from a browser sign-in that picked the wrong one. ── */}
        {step === 'gate' && card(
          <window.AccountGate.GateCard account={browserResult || gateAccount} fromPlayer={!browserResult}
            onSwitch={() => { setStep('browser'); if (onSwitchAccount) onSwitchAccount(); }} />
        )}
        {/* ── CONFIRM (option B): App Player's account, confirmed before BlueAI uses it ── */}
        {step === 'confirm' && card(
          <window.AccountGate.ConfirmCard account={gateAccount} onContinue={() => (gateAccount.enrolled ? onSuccess?.() : setStep('gate'))}
            onSwitch={() => { setStep('browser'); if (playerSwitch) playerSwitch(); }} />
        )}

      </div>
    </div>);

}

// Export to window so other Babel script files can use it
Object.assign(window, { LoginModal });