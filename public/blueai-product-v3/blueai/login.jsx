// BlueAI: Login Modal. States: default → browser → signing → success | gate | confirm (ROB-21388,
// cards in account_gate.jsx). onOpenBrowser hands 'browser' to the desktop's browser window;
// browserResult finishes it. 'gate' / 'confirm' start from App Player's account (gateAccount).

const { useState, useEffect } = React;

function LoginModal({ isOpen, onClose, onSuccess, variant, initialStep, onOpenBrowser, browserResult, onSwitchAccount, gateAccount, playerSwitch }) {
  const [step, setStep] = useState(initialStep || 'default');
  const v = variant || (typeof window !== 'undefined' && window.__loginVariant) || 'default';

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

  // Shared hover affordances so every button in the modal responds (a static export ships no
  // hover states; house rule = every clickable reacts). Solid-blue CTAs lift + brighten + deepen
  // their shadow; text links darken. restShadow restores each button's own resting elevation.
  const BTN_TRANSITION = 'transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease';
  const blueBtn = (restShadow) => ({
    onMouseEnter: (e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.filter = 'brightness(1.06)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(25,144,255,0.42)'; },
    onMouseLeave: (e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.filter = ''; e.currentTarget.style.boxShadow = restShadow; }
  });
  const linkHover = (base, hover) => ({
    onMouseEnter: (e) => e.currentTarget.style.color = hover,
    onMouseLeave: (e) => e.currentTarget.style.color = base
  });

  // maxWidth widened 288→360 so the browser step's "Use the account you applied with" line fits
  // on one row instead of wrapping (shared by all three of this step's screens: browser/signing/
  // success: harmless there, just more breathing room around already-centered content).
  // V3, Phase 2: the card is the Target surface with a 1px line and no shadow (entry.css
  // .v3-gate-card), on the frost scrim, in the site's language like the welcome behind it.
  const card = (children) => <div className="v3-gate-card">{children}</div>;


  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column', fontFamily: 'var(--v2-font-ui)', background: 'var(--v2-scrim-frost)', backdropFilter: 'blur(var(--v2-scrim-blur))', WebkitBackdropFilter: 'blur(var(--v2-scrim-blur))' }}>
      <style>{`@keyframes loginSpin{to{transform:rotate(360deg)}} @keyframes cfGlow{0%,100%{opacity:.55}50%{opacity:.85}}`}</style>

      {/* Close: on every step, as in the live app (ai-worker LoginModal.tsx renders it always),
         except the account check (ROB-21388), which blocks the home screen. */}
      {step !== 'gate' && step !== 'confirm' &&
      <button type="button" onClick={onClose} aria-label="Close" className="v3-icon-btn"
      style={{ position: 'absolute', top: 'var(--v2-space-3)', right: 'var(--v2-space-3)' }}>
          <IcoXClose size={18} />
        </button>
      }

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px' }}>

        {/* ── DEFAULT · credits-first ── */}
        {step === 'default' && v === 'creditsfirst' &&
        <div style={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
            {/* Big credits hero */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', WebkitMaskImage: 'url(assets/Credits.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskImage: 'url(assets/Credits.svg)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }} />
                <span style={{ fontSize: 56, fontWeight: 800, lineHeight: 1, background: 'linear-gradient(270deg,#7B4CFF,#0EA4C5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-1px' }}>300</span>
              </div>
              <span style={{ fontSize: 16, fontWeight: 700, background: 'linear-gradient(270deg,#7B4CFF,#0EA4C5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FREE AI Credits</span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: 21, fontWeight: 800, color: '#111827', letterSpacing: '-0.4px', lineHeight: 1.25 }}>Sign in to claim your credits</h1>
              <p style={{ marginTop: 7, fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>BlueAI runs on credits. Get <strong style={{ color: '#374151' }}>upto 300 free AI Credits</strong> on your first login, enough to put your AI worker to work right away.</p>
            </div>

            {/* What credits unlock */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: '13px 14px' }}>
              {['Automate daily game rewards', 'Schedule & draft social posts', 'Run tasks while you\u2019re away'].map((item) =>
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg>
                  <span style={{ fontSize: 12.5, color: '#374151', lineHeight: 1.3 }}>{item}</span>
                </div>
            )}
            </div>

            <button onClick={handleSignIn}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#1990FF', border: 'none', borderRadius: 999, padding: '13px 28px', fontSize: 15, fontWeight: 700, color: 'white', cursor: 'pointer', boxShadow: '0 4px 16px rgba(25,144,255,0.35)', fontFamily: 'inherit' }}>
              Sign in &amp; claim 300 credits
              <svg width="17" height="17" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>

            <button style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#9ca3af', fontFamily: 'inherit' }}>
              Terms &amp; Conditions
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        }

        {/* ── DEFAULT · minimal ── */}
        {step === 'default' && v === 'minimal' &&
        <div style={{ width: '100%', maxWidth: 288, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', WebkitMaskImage: 'url(assets/Credits.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center', maskImage: 'url(assets/Credits.svg)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }} />
                <span style={{ fontSize: 44, fontWeight: 800, lineHeight: 1, background: 'linear-gradient(270deg,#7B4CFF,#0EA4C5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-1px' }}>300</span>
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>free credits on sign in</p>
            </div>
            <button onClick={handleSignIn}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#1990FF', border: 'none', borderRadius: 999, padding: '13px 28px', fontSize: 15, fontWeight: 700, color: 'white', cursor: 'pointer', boxShadow: '0 4px 16px rgba(25,144,255,0.35)', fontFamily: 'inherit' }}>
              Sign in
              <svg width="17" height="17" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#9ca3af', fontFamily: 'inherit' }}>
              Terms &amp; Conditions
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        }

        {/* ── DEFAULT · onboarding (logged-out sign-in gate, opened from the onboarding chat's Send).
             Ported 1:1 from the cloud design's "creditsfirst" hero: glow orb behind a 100px
             3-stop-gradient "500", two gradient-fade dividers, wide gradient claim button. ── */}
        {step === 'default' && v === 'onboarding' &&
        <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, textAlign: 'center' }}>
            <div style={{ position: 'relative', marginBottom: 8 }}>
              {/* glow orb behind the number */}
              <div style={{ position: 'absolute', left: '50%', top: '50%', width: 180, height: 180, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,76,255,0.45) 0%, transparent 70%)', animation: 'cfGlow 3s ease-in-out infinite', pointerEvents: 'none' }} />
              <p style={{ fontWeight: 500, marginBottom: 16, color: 'rgb(98, 115, 139)', fontSize: 16 }}>You need AI Credits to use BlueAI</p>
              <div style={{ width: '100%', height: 1, background: 'linear-gradient(90deg, transparent, #b5bac0, transparent)', marginBottom: 20 }} />
              <div style={{ fontSize: 100, fontWeight: 900, lineHeight: 1, background: 'linear-gradient(135deg,#0EA4C5 0%,#7B4CFF 60%,#A855F7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-4px' }}>500</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginTop: 4, letterSpacing: '-0.3px' }}>Free AI Credits</div>
            </div>
            <p style={{ fontSize: 14, color: '#64748b', fontWeight: 500, marginBottom: 16 }}>on your first login</p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7B4CFF" strokeWidth="2.6" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" /></svg>
              <span style={{ fontSize: 12.5, fontWeight: 500, color: '#7c8a9c', whiteSpace: 'nowrap' }}>Enough for ~10 tasks</span>
            </div>

            <div style={{ width: '100%', height: 1, background: 'linear-gradient(90deg, transparent, #b5bac0, transparent)', marginBottom: 24 }} />
            <button onClick={handleSignIn}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(123,76,255,0.7)'; e.currentTarget.style.filter = 'brightness(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 28px rgba(123,76,255,0.55)'; e.currentTarget.style.filter = ''; }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'linear-gradient(90deg,#22ACE0,#7B4CFF)', border: 'none', borderRadius: 999, padding: '15px 28px', fontSize: 16, fontWeight: 800, color: 'white', cursor: 'pointer', boxShadow: '0 6px 28px rgba(123,76,255,0.55)', fontFamily: 'inherit', whiteSpace: 'nowrap', width: 230, transition: 'transform 0.16s ease, box-shadow 0.16s ease, filter 0.16s ease' }}>
              Sign in to claim
              <svg width="17" height="17" fill="none" stroke="white" strokeWidth="2.4" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>

            <button
          onMouseEnter={(e) => e.currentTarget.style.color = '#64748b'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
          style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5, color: '#94a3b8', fontFamily: 'inherit', fontWeight: 500, marginTop: 16, transition: 'color 0.15s ease' }}>
              Terms &amp; Conditions
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        }

        {/* ── DEFAULT · classic ── */}
        {step === 'default' && v !== 'creditsfirst' && v !== 'minimal' && v !== 'onboarding' &&
        <div style={{ width: '100%', maxWidth: 288, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <img src="assets/Logo.png" alt="BlueAI" style={{ width: 80, height: 80 }} />
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: 30, fontWeight: 700, lineHeight: 1 }}>BlueAI</h1>
              <p style={{ marginTop: 6, fontSize: 13, color: '#6b7280' }}>Your AI worker for BlueStacks</p>
            </div>
            <div style={{ width: '100%', height: 1, background: '#e5e7eb' }} />
            <p style={{ fontSize: 16, fontWeight: 500, color: '#111827' }}>Please sign in to continue</p>

            {/* Promo box */}
            <div style={{ width: '100%', borderRadius: 16, border: '1px solid #7B4CFF', background: 'linear-gradient(270deg,rgba(123,76,255,0.07),rgba(14,164,197,0.07))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 15, padding: '12px 14px' }}>
                <svg width="34" height="34" fill="none" stroke="#374151" strokeWidth="1.5" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
                </svg>
                <p style={{ fontSize: 12.5, fontWeight: 500, background: 'linear-gradient(270deg,#7B4CFF,#0EA4C5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.5 }}>
                  Get up to ✦ 300 AI Credits on your first login.
                </p>
              </div>
            </div>

            <button onClick={handleSignIn} {...blueBtn('0 2px 12px rgba(25,144,255,0.35)')}
          style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#1990FF', border: 'none', borderRadius: 999, padding: '11px 28px', fontSize: 15, fontWeight: 600, color: 'white', cursor: 'pointer', boxShadow: '0 2px 12px rgba(25,144,255,0.35)', fontFamily: 'inherit', transition: BTN_TRANSITION }}>
              Sign in
              <svg width="17" height="17" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>

            <button {...linkHover('#9ca3af', '#6b7280')} style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#9ca3af', fontFamily: 'inherit', transition: 'color 0.15s ease' }}>
              Terms &amp; Conditions
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        }

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