// BlueAI — Login Modal
// 4 states: default → browser → signing → success

const { useState, useEffect } = React;

function LoginModal({ isOpen, onClose, onSuccess, variant }) {
  const [step, setStep] = useState('default');
  const v = variant || (typeof window !== 'undefined' && window.__loginVariant) || 'default';

  // Reset state when modal reopens
  useEffect(() => {if (isOpen) setStep('default');}, [isOpen]);

  useEffect(() => {
    const h = (e) => {if (e.key === 'Escape' && step === 'default') onClose?.();};
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [step, onClose]);

  if (!isOpen) return null;

  const handleSignIn = () => {
    setStep('browser');
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

  const card = (children) =>
  <div style={{ width: '100%', maxWidth: 288, background: 'white', borderRadius: 20, border: '1px solid #e5e7eb', padding: '40px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.14)' }}>
      {children}
    </div>;


  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
      <style>{`@keyframes loginSpin{to{transform:rotate(360deg)}} @keyframes cfGlow{0%,100%{opacity:.55}50%{opacity:.85}}`}</style>

      {/* Close — only in default state */}
      {step === 'default' &&
      <button onClick={onClose}
      style={{ position: 'absolute', top: 14, right: 14, width: 34, height: 34, borderRadius: '50%', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              <p style={{ marginTop: 7, fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>BlueAI runs on credits. Get <strong style={{ color: '#374151' }}>upto 300 free AI Credits</strong> on your first login — enough to put your AI worker to work right away.</p>
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
            <img src="assets/Browser.svg" alt="" style={{ width: 64, height: 64 }} onError={(e) => {e.target.style.display = 'none';}} />
            <div>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#111827' }}>Check your browser</p>
              <p style={{ marginTop: 5, fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>Finish logging in from your web browser</p>
            </div>
            <div style={{ width: '100%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(35,38,66,0.18),transparent)' }} />
            <button onClick={handleSignIn} {...linkHover('#f59e0b', '#d97706')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#f59e0b', fontWeight: 500, fontFamily: 'inherit', transition: 'color 0.15s ease' }}>
              Not seeing the browser tab?
            </button>
            <button onClick={handleSignIn} {...blueBtn('none')}
            style={{ background: '#1990FF', border: 'none', borderRadius: 999, padding: '10px 24px', fontSize: 14, fontWeight: 600, color: 'white', cursor: 'pointer', fontFamily: 'inherit', boxShadow: 'none', transition: BTN_TRANSITION }}>
              Try again
            </button>
          </>
        )}

        {/* ── SIGNING IN ── */}
        {step === 'signing' && card(
          <>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3.5px solid #e0e7ff', borderTopColor: '#4f46e5', animation: 'loginSpin 0.8s linear infinite' }} />
            </div>
            <div>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#111827' }}>Signing in…</p>
              <p style={{ marginTop: 5, fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>Please wait while we complete your sign-in</p>
            </div>
          </>
        )}

        {/* ── SUCCESS ── */}
        {step === 'success' && card(
          <>
            <img src="assets/CheckmarkGreen.svg" alt="" style={{ width: 64, height: 64 }} />
            <div>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#111827' }}>Logged in</p>
              <p style={{ marginTop: 5, fontSize: 13, color: '#6b7280' }}>Welcome back!</p>
            </div>
            <button onClick={() => onSuccess?.()} {...blueBtn('0 2px 8px rgba(25,144,255,0.3)')}
            style={{ background: '#1990FF', border: 'none', borderRadius: 999, padding: '10px 32px', fontSize: 14, fontWeight: 600, color: 'white', cursor: 'pointer', boxShadow: '0 2px 8px rgba(25,144,255,0.3)', fontFamily: 'inherit', transition: BTN_TRANSITION }}>
              Continue
            </button>
          </>
        )}

      </div>
    </div>);

}

// Export to window so other Babel script files can use it
Object.assign(window, { LoginModal });