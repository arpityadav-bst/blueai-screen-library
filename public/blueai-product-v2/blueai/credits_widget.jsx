// BlueAI — Free Credits widget
// 4 trigger styles: pill | fab | card | banner
// Panel: bottom sheet slides up from above the bottom nav
// Prerequisite: shared.jsx loaded first

(function () {
  const { useState, useEffect, useRef } = React;

  /* ── tasks ──────────────────────────────────────────────────── */
  const TASKS = [
    { id: 'x_follow',    platform: 'x',       label: 'Follow @BlueStacks on X',        sub: 'Stay up to date with the latest news',      credits: 50,  cta: 'Follow',    url: 'https://x.com/bluestacks' },
    { id: 'reddit_post', platform: 'reddit',   label: 'Share your experience on Reddit', sub: 'Post in r/BlueStacks or r/Android',          credits: 75,  cta: 'Post',      url: 'https://reddit.com/r/BlueStacks' },
    { id: 'discord',     platform: 'discord',  label: 'Join the BlueStacks Discord',     sub: 'Connect with the community',                credits: 30,  cta: 'Join',      url: 'https://discord.gg/bluestacks' },
    { id: 'review',      platform: 'star',     label: 'Leave a review for BlueStacks',   sub: 'Honest feedback helps us grow',             credits: 100, cta: 'Review',    url: 'https://bluestacks.com' },
    { id: 'refer',       platform: 'refer',    label: 'Refer a friend to BlueAI',        sub: 'Your friend gets 50 AI credits too',        credits: 150, cta: 'Share link', url: null },
  ];

  /* ── platform icons ─────────────────────────────────────────── */
  function PlatformIcon({ p, size = 18 }) {
    if (p === 'x') return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L2.25 2.25h6.891l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>;
    if (p === 'reddit') return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>;
    if (p === 'discord') return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.101 18.079.112 18.1.12 18.12a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>;
    if (p === 'star') return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
    if (p === 'refer') return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    return null;
  }

  const PLATFORM_STYLE = {
    x: { bg: '#000', fg: '#fff' }, reddit: { bg: '#FF4500', fg: '#fff' },
    discord: { bg: '#5865F2', fg: '#fff' }, star: { bg: '#F59E0B', fg: '#fff' }, refer: { bg: '#4F46E5', fg: '#fff' },
  };

  /* ── Credits icon (official SVG) ────────────────────────────── */
  function CreditsIcon({ size = 16, id = 'ci', white = false }) {
    const gid = `cg_${id}`;
    const fill = white ? 'white' : `url(#${gid})`;
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" fill="none">
        {!white && <defs><linearGradient id={gid} x1="14.824" y1="7.912" x2="1" y2="7.912" gradientUnits="userSpaceOnUse"><stop stopColor="#7B4CFF"/><stop offset="0.994792" stopColor="#0EA4C5"/></linearGradient></defs>}
        <path d="M7.516 14.824C7.396 14.044 7.048 13.204 6.472 12.304C5.908 11.404 5.104 10.558 4.06 9.766C3.004 8.962 1.984 8.464 1 8.272V7.516C1.996 7.288 2.962 6.844 3.898 6.184C4.834 5.524 5.626 4.738 6.274 3.826C6.922 2.902 7.336 1.96 7.516 1H8.272C8.38 1.612 8.596 2.23 8.92 2.854C9.256 3.478 9.682 4.078 10.198 4.654C10.714 5.218 11.284 5.728 11.908 6.184C12.856 6.856 13.828 7.3 14.824 7.516V8.272C14.152 8.404 13.462 8.674 12.754 9.082C12.058 9.49 11.41 9.97 10.81 10.522C10.21 11.074 9.718 11.656 9.334 12.268C8.746 13.204 8.392 14.056 8.272 14.824H7.516ZM7.768 14.392H8.02C8.08 13.768 8.176 13.144 8.308 12.52C8.452 11.884 8.614 11.296 8.794 10.756C8.986 10.216 9.184 9.772 9.388 9.424C9.796 9.196 10.282 8.986 10.846 8.794C11.422 8.602 12.016 8.44 12.628 8.308C13.252 8.176 13.828 8.092 14.356 8.056V7.804C13.828 7.756 13.246 7.666 12.61 7.534C11.986 7.39 11.386 7.222 10.81 7.03C10.234 6.826 9.76 6.616 9.388 6.4C9.184 6.04 8.986 5.596 8.794 5.068C8.614 4.528 8.452 3.952 8.308 3.34C8.176 2.716 8.08 2.092 8.02 1.468H7.768C7.72 2.032 7.63 2.62 7.498 3.232C7.378 3.832 7.222 4.408 7.03 4.96C6.838 5.512 6.628 5.992 6.4 6.4C6.016 6.616 5.542 6.826 4.978 7.03C4.414 7.222 3.82 7.39 3.196 7.534C2.572 7.666 1.984 7.756 1.432 7.804V8.056C1.984 8.092 2.566 8.176 3.178 8.308C3.79 8.44 4.378 8.602 4.942 8.794C5.506 8.986 5.992 9.196 6.4 9.424C6.628 9.808 6.832 10.282 7.012 10.846C7.204 11.398 7.366 11.986 7.498 12.61C7.63 13.222 7.72 13.816 7.768 14.392Z" fill={fill}/>
      </svg>
    );
  }

  /* ── credit badge ────────────────────────────────────────────── */
  function CreditBadge({ amount, idx = 0 }) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', borderRadius: 999, padding: '3px 8px', fontSize: 11, fontWeight: 700, color: 'white', whiteSpace: 'nowrap', flexShrink: 0 }}>
        <CreditsIcon size={11} id={`b${idx}`} white={true} />
        {amount}
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════════
     TRIGGER STYLES
  ══════════════════════════════════════════════════════════════ */

  /* 1 ── PILL ─────────────────────────────────────────────────── */
  function TriggerPill({ totalLeft, remaining, onClick }) {
    return (
      <button onClick={onClick} style={{ position: 'absolute', bottom: 148, right: 14, zIndex: 40, display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', border: 'none', borderRadius: 999, padding: '9px 13px 9px 10px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(123,76,255,0.4)', fontFamily: 'inherit', transition: 'transform 0.15s, box-shadow 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 26px rgba(123,76,255,0.55)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(123,76,255,0.4)'; }}>
        <CreditsIcon size={15} id="pill" white={true} />
        <span style={{ fontSize: 12.5, fontWeight: 700, color: 'white', lineHeight: 1 }}>Earn free credits</span>
        {remaining.length > 0 && (
          <span style={{ background: 'rgba(255,255,255,0.24)', borderRadius: 999, padding: '2px 7px', fontSize: 11, fontWeight: 800, color: 'white' }}>{totalLeft}</span>
        )}
      </button>
    );
  }

  /* 2 ── FAB ──────────────────────────────────────────────────── */
  function TriggerFAB({ remaining, onClick }) {
    return (
      <div style={{ position: 'absolute', bottom: 148, right: 16, zIndex: 40 }}>
        {/* glow ring */}
        <div style={{ position: 'absolute', inset: -7, borderRadius: '50%', border: '2px solid rgba(123,76,255,0.35)', animation: 'ba-ring 1.6s ease-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: -14, borderRadius: '50%', border: '1.5px solid rgba(14,164,197,0.2)', animation: 'ba-ring 1.6s ease-out 0.4s infinite', pointerEvents: 'none' }} />
        <button onClick={onClick} style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(123,76,255,0.45)', position: 'relative', transition: 'transform 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform = ''}>
          <CreditsIcon size={22} id="fab" white={true} />
          {remaining.length > 0 && (
            <span style={{ position: 'absolute', top: -2, right: -2, width: 18, height: 18, borderRadius: '50%', background: '#f59e0b', color: 'white', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>{remaining.length}</span>
          )}
        </button>
      </div>
    );
  }

  /* 3 ── CARD ─────────────────────────────────────────────────── */
  function TriggerCard({ totalLeft, remaining, allDone, onClick }) {
    return (
      <button onClick={onClick} style={{ position: 'absolute', bottom: 148, right: 14, zIndex: 40, display: 'flex', alignItems: 'center', gap: 10, background: 'white', border: '1px solid #e2e8f0', borderRadius: 14, padding: '10px 13px 10px 10px', boxShadow: '0 4px 24px rgba(0,0,0,0.13)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'transform 0.15s, box-shadow 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.16)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.13)'; }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <CreditsIcon size={19} id="card" white={true} />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.3 }}>
            {allDone ? 'Credits claimed!' : `${totalLeft} free AI credits`}
          </p>
          <p style={{ fontSize: 11, color: '#6b7280', margin: '1px 0 0', lineHeight: 1.3 }}>
            {allDone ? 'All tasks done' : `${remaining.length} task${remaining.length !== 1 ? 's' : ''} to complete`}
          </p>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" style={{ marginLeft: 2, flexShrink: 0 }}><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    );
  }

  /* 4 ── BANNER ───────────────────────────────────────────────── */
  function TriggerBanner({ totalLeft, allDone, onClick }) {
    return (
      <button onClick={onClick} style={{ position: 'absolute', bottom: 148, left: 12, right: 12, zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg,rgba(14,164,197,0.09),rgba(123,76,255,0.09))', border: '1px solid rgba(123,76,255,0.22)', borderRadius: 11, padding: '9px 13px', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(135deg,rgba(14,164,197,0.15),rgba(123,76,255,0.15))'}
        onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg,rgba(14,164,197,0.09),rgba(123,76,255,0.09))'}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CreditsIcon size={15} id="ban" />
          <span style={{ fontSize: 12.5, fontWeight: 700, background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {allDone ? "You've claimed all free credits!" : `Earn up to ${totalLeft} free AI credits`}
          </span>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7B4CFF" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    );
  }


  /* ══════════════════════════════════════════════════════════════
     10 MORE TRIGGER STYLES
  ══════════════════════════════════════════════════════════════ */

  /* 5 ── TOAST (centered, auto-collapses to orb after 4s) ─────── */
  function TriggerToast({ totalLeft, allDone, onClick }) {
    const [slim, setSlim] = useState(false);
    useEffect(() => { const t = setTimeout(() => setSlim(true), 4000); return () => clearTimeout(t); }, []);
    if (slim) return (
      <button onClick={() => { setSlim(false); onClick(); }}
        style={{ position: 'absolute', bottom: 148, left: '50%', transform: 'translateX(-50%)', zIndex: 40, width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(123,76,255,0.45)', transition: 'all 0.3s', fontFamily: 'inherit' }}>
        <CreditsIcon size={17} id="toast_s" white={true} />
      </button>
    );
    return (
      <div style={{ position: 'absolute', bottom: 148, left: '50%', transform: 'translateX(-50%)', zIndex: 40, width: 238, background: 'white', borderRadius: 15, padding: '11px 14px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #e2e8f0', animation: 'ba-slide-up 0.3s ease' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <CreditsIcon size={18} id="toast" white={true} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 12.5, fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.2 }}>{allDone ? 'All credits claimed!' : `${totalLeft} free AI credits`}</p>
          <p style={{ fontSize: 10.5, color: '#6b7280', margin: '2px 0 0' }}>available right now</p>
        </div>
        <button onClick={onClick} style={{ background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', border: 'none', borderRadius: 8, padding: '5px 11px', fontSize: 11, fontWeight: 700, color: 'white', cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>Claim</button>
      </div>
    );
  }

  /* 6 ── TOP STRIP (below navbar, full-width) ──────────────────── */
  function TriggerTopStrip({ totalLeft, allDone, onClick }) {
    return (
      <button onClick={onClick} style={{ position: 'absolute', top: 56, left: 0, right: 0, zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', border: 'none', padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CreditsIcon size={14} id="tstrip" white={true} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>{allDone ? "All credits claimed!" : `Earn up to ${totalLeft} free AI credits`}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>Tap to claim</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </button>
    );
  }

  /* 7 ── ORB (bottom-left, glowing pulse) ─────────────────────── */
  function TriggerOrb({ remaining, onClick }) {
    return (
      <div style={{ position: 'absolute', bottom: 148, left: 16, zIndex: 40 }}>
        <div style={{ position: 'absolute', inset: -10, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,164,197,0.3) 0%, transparent 70%)', animation: 'ba-breathe 2s ease-in-out infinite', pointerEvents: 'none' }} />
        <button onClick={onClick} style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', border: '2px solid rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 6px rgba(123,76,255,0.15), 0 4px 16px rgba(123,76,255,0.4)', position: 'relative', transition: 'transform 0.15s', fontFamily: 'inherit' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = ''}>
          <CreditsIcon size={20} id="orb" white={true} />
          {remaining.length > 0 && <span style={{ position: 'absolute', top: -3, right: -3, width: 16, height: 16, borderRadius: '50%', background: '#f59e0b', color: 'white', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>{remaining.length}</span>}
        </button>
      </div>
    );
  }

  /* 8 ── COIN (bouncing gold coin, bottom-right) ───────────────── */
  function TriggerCoin({ totalLeft, remaining, onClick }) {
    return (
      <button onClick={onClick} style={{ position: 'absolute', bottom: 148, right: 16, zIndex: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(145deg,#fbbf24,#d97706)', border: '3px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 0 #92400e, 0 6px 16px rgba(217,119,6,0.5)', animation: 'ba-bounce 1.8s ease-in-out infinite', position: 'relative' }}>
          <CreditsIcon size={22} id="coin" white={true} />
          {remaining.length > 0 && <span style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: '#ef4444', color: 'white', fontSize: 9.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>{remaining.length}</span>}
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, background: 'linear-gradient(90deg,#d97706,#f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: 'none', whiteSpace: 'nowrap' }}>FREE</span>
      </button>
    );
  }

  /* 9 ── SPARKLE (pill with orbiting dots) ────────────────────── */
  function TriggerSparkle({ totalLeft, onClick }) {
    return (
      <div style={{ position: 'absolute', bottom: 148, right: 14, zIndex: 40 }}>
        {/* orbiting dots */}
        {[0,1,2,3].map(i => (
          <div key={i} style={{ position: 'absolute', width: '100%', height: '100%', animation: `ba-orbit ${1.8 + i * 0.3}s linear infinite`, animationDelay: `${i * 0.45}s`, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: '50%', right: -6, width: 5, height: 5, borderRadius: '50%', background: i % 2 === 0 ? '#0EA4C5' : '#7B4CFF', transform: 'translateY(-50%)', opacity: 0.8 }} />
          </div>
        ))}
        <button onClick={onClick} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', border: 'none', borderRadius: 999, padding: '9px 14px 9px 10px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(123,76,255,0.4)', fontFamily: 'inherit', zIndex: 1 }}>
          <CreditsIcon size={15} id="spark" white={true} />
          <span style={{ fontSize: 12.5, fontWeight: 700, color: 'white' }}>{totalLeft} free credits</span>
        </button>
      </div>
    );
  }

  /* 10 ── PEEK (panel header peeking above bottom nav) ─────────── */
  function TriggerPeek({ totalLeft, done, allDone, onClick }) {
    return (
      <button onClick={onClick} style={{ position: 'absolute', bottom: 64, left: 0, right: 0, zIndex: 40, background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', border: 'none', borderRadius: '14px 14px 0 0', padding: '10px 18px 10px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 -4px 20px rgba(123,76,255,0.3)' }}>
        <CreditsIcon size={18} id="peek" white={true} />
        <div style={{ flex: 1, textAlign: 'left' }}>
          <p style={{ color: 'white', fontWeight: 800, fontSize: 13, margin: 0, lineHeight: 1.2 }}>{allDone ? 'All free credits claimed' : `Earn up to ${totalLeft} free AI credits`}</p>
          {!allDone && <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 10.5, margin: '2px 0 0' }}>{done.length} of 5 tasks completed</p>}
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>
      </button>
    );
  }

  /* 11 ── SIDE TAB (right edge vertical drawer) ───────────────── */
  function TriggerSideTab({ totalLeft, onClick }) {
    const [hovered, setHovered] = useState(false);
    return (
      <button onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ position: 'absolute', top: '42%', right: hovered ? 0 : -52, zIndex: 40, display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', border: 'none', borderRadius: '10px 0 0 10px', padding: '12px 12px 12px 14px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '-4px 0 20px rgba(123,76,255,0.35)', transition: 'right 0.25s cubic-bezier(0.34,1.2,0.64,1)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <CreditsIcon size={17} id="tab" white={true} />
          <span style={{ fontSize: 9.5, fontWeight: 800, color: 'white', writingMode: 'vertical-rl', textOrientation: 'mixed', letterSpacing: '0.05em', lineHeight: 1 }}>FREE</span>
        </div>
        {hovered && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingRight: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'white', whiteSpace: 'nowrap' }}>{totalLeft} credits</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.78)', whiteSpace: 'nowrap' }}>Tap to earn free</span>
          </div>
        )}
      </button>
    );
  }

  /* 12 ── BUBBLE (speech bubble from AI, bottom-right) ────────── */
  function TriggerBubble({ totalLeft, allDone, onClick }) {
    return (
      <button onClick={onClick} style={{ position: 'absolute', bottom: 148, right: 14, zIndex: 40, background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px 16px 4px 16px', padding: '10px 13px', maxWidth: 190, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 5, transition: 'box-shadow 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.16)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CreditsIcon size={11} id="bub" white={true} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#6b7280' }}>BlueAI</span>
        </div>
        <p style={{ fontSize: 12.5, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.35 }}>
          {allDone ? "You've claimed all free credits!" : `You can earn ${totalLeft} free credits!`}
        </p>
        <span style={{ fontSize: 11, color: '#1990FF', fontWeight: 600 }}>See how →</span>
      </button>
    );
  }

  /* 13 ── CORNER TAG (top-right content area) ─────────────────── */
  function TriggerCornerTag({ totalLeft, remaining, onClick }) {
    return (
      <button onClick={onClick} style={{ position: 'absolute', top: 68, right: 0, zIndex: 40, background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', border: 'none', borderRadius: '8px 0 0 8px', padding: '7px 10px 7px 12px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '-3px 2px 14px rgba(123,76,255,0.35)' }}>
        <CreditsIcon size={14} id="ctag" white={true} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: 'white', lineHeight: 1.1 }}>FREE</span>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.78)', lineHeight: 1.1, whiteSpace: 'nowrap' }}>{totalLeft} credits</span>
        </div>
        {remaining.length > 0 && <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#fbbf24', color: '#92400e', fontSize: 8.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{remaining.length}</span>}
      </button>
    );
  }

  /* 14 ── MARQUEE (scrolling text strip above input) ───────────── */
  function TriggerMarquee({ totalLeft, allDone, onClick }) {
    const msg = allDone
      ? '✦ All free credits claimed · Well done! · '
      : `✦ Earn ${totalLeft} free AI credits · Follow on X · Post on Reddit · Join Discord · Leave a review · Refer a friend · `;
    return (
      <button onClick={onClick} style={{ position: 'absolute', bottom: 134, left: 0, right: 0, zIndex: 40, background: 'linear-gradient(90deg, rgba(14,164,197,0.08), rgba(123,76,255,0.08))', border: 'none', borderTop: '1px solid rgba(123,76,255,0.15)', borderBottom: '1px solid rgba(123,76,255,0.15)', padding: '7px 0', cursor: 'pointer', overflow: 'hidden', fontFamily: 'inherit' }}>
        <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'ba-marquee 16s linear infinite' }}>
          {[msg, msg].map((t, i) => (
            <span key={i} style={{ fontSize: 11.5, fontWeight: 700, background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', paddingRight: 32 }}>{t}</span>
          ))}
        </div>
      </button>
    );
  }


  /* ══════════════════════════════════════════════════════════════
     STYLES 15–24
  ══════════════════════════════════════════════════════════════ */

  /* 15 ── STICKER (rotated sticky-note, bottom-left) ─────────── */
  function TriggerSticker({ totalLeft, allDone, onClick }) {
    return (
      <button onClick={onClick} style={{ position: 'absolute', bottom: 152, left: 16, zIndex: 40, background: 'linear-gradient(145deg,#fde68a,#fbbf24)', border: 'none', borderRadius: 4, padding: '10px 13px', transform: 'rotate(-3deg)', boxShadow: '3px 4px 12px rgba(0,0,0,0.18)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', maxWidth: 145 }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'rotate(-1deg) scale(1.04)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'rotate(-3deg)'; }}>
        <p style={{ fontSize: 13, fontWeight: 900, color: '#92400e', margin: '0 0 3px', lineHeight: 1.2 }}>Free AI credits!</p>
        <p style={{ fontSize: 10.5, color: '#b45309', margin: 0, lineHeight: 1.35 }}>{allDone ? 'All claimed 🎉' : `Earn up to ${totalLeft}`}</p>
        <p style={{ fontSize: 10, color: '#d97706', margin: '5px 0 0', fontWeight: 600 }}>tap to see tasks →</p>
      </button>
    );
  }

  /* 16 ── LEFT TAB (mirror of side tab) ───────────────────────── */
  function TriggerLeftTab({ totalLeft, onClick }) {
    const [hovered, setHovered] = useState(false);
    return (
      <button onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ position: 'absolute', top: '55%', left: hovered ? 0 : -52, zIndex: 40, display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#7B4CFF,#0EA4C5)', border: 'none', borderRadius: '0 10px 10px 0', padding: '12px 14px 12px 12px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '4px 0 20px rgba(123,76,255,0.35)', transition: 'left 0.25s cubic-bezier(0.34,1.2,0.64,1)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <CreditsIcon size={17} id="ltab" white={true} />
          <span style={{ fontSize: 9.5, fontWeight: 800, color: 'white', writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', letterSpacing: '0.05em', lineHeight: 1 }}>FREE</span>
        </div>
        {hovered && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'white', whiteSpace: 'nowrap' }}>{totalLeft} credits</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.78)', whiteSpace: 'nowrap' }}>Tap to earn free</span>
          </div>
        )}
      </button>
    );
  }

  /* 17 ── PROGRESS RING (SVG arc, bottom-right) ───────────────── */
  function TriggerRing({ done, totalLeft, allDone, onClick }) {
    const pct  = done.length / 5;
    const r    = 22;
    const circ = 2 * Math.PI * r;
    const dash = pct * circ;
    return (
      <button onClick={onClick} style={{ position: 'absolute', bottom: 148, right: 16, zIndex: 40, background: 'white', border: 'none', borderRadius: '50%', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.14)', padding: 0 }}>
        <svg width="60" height="60" viewBox="0 0 60 60" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
          <circle cx="30" cy="30" r={r} fill="none" stroke="#e2e8f0" strokeWidth="5" />
          <circle cx="30" cy="30" r={r} fill="none" stroke="url(#ring_g)" strokeWidth="5" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - dash} style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
          <defs><linearGradient id="ring_g" x1="0%" y1="0%" x2="100%" y2="0%"><stop stopColor="#0EA4C5"/><stop offset="1" stopColor="#7B4CFF"/></linearGradient></defs>
        </svg>
        <div style={{ textAlign: 'center', lineHeight: 1.1, position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 900, background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>{allDone ? '✓' : totalLeft}</p>
          <p style={{ fontSize: 8, fontWeight: 700, color: '#9ca3af', margin: 0 }}>{allDone ? 'done' : 'free'}</p>
        </div>
      </button>
    );
  }

  /* 18 ── GIFT BOX (shaking, bottom-left) ─────────────────────── */
  function TriggerGift({ remaining, onClick }) {
    return (
      <div style={{ position: 'absolute', bottom: 148, left: 16, zIndex: 40 }}>
        <button onClick={onClick} style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#7B4CFF,#0EA4C5)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 18px rgba(123,76,255,0.45)', animation: 'ba-wiggle 2.5s ease-in-out infinite', position: 'relative', fontFamily: 'inherit' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
          </svg>
          {remaining.length > 0 && <span style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: '#f59e0b', color: 'white', fontSize: 9.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>{remaining.length}</span>}
        </button>
        <p style={{ fontSize: 9.5, fontWeight: 700, color: '#7B4CFF', textAlign: 'center', margin: '4px 0 0', whiteSpace: 'nowrap' }}>Free credits!</p>
      </div>
    );
  }

  /* 19 ── CHIPS (horizontal task pills above input) ────────────── */
  function TriggerChips({ remaining, done, onClick }) {
    const shown = TASKS.slice(0, 4);
    return (
      <button onClick={onClick} style={{ position: 'absolute', bottom: 134, left: 0, right: 0, zIndex: 40, background: 'none', border: 'none', padding: '0 12px 0', cursor: 'pointer', fontFamily: 'inherit' }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', alignItems: 'center', paddingBottom: 2 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', whiteSpace: 'nowrap', flexShrink: 0 }}>Earn free:</span>
          {shown.map(task => {
            const isDone = done.includes(task.id);
            return (
              <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 4, background: isDone ? '#dcfce7' : 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', borderRadius: 999, padding: '4px 9px', flexShrink: 0, opacity: isDone ? 0.6 : 1 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: isDone ? '#15803d' : 'white', whiteSpace: 'nowrap' }}>{isDone ? '✓' : '+'}{task.credits}</span>
                <span style={{ fontSize: 10, color: isDone ? '#15803d' : 'rgba(255,255,255,0.85)' }}>{task.platform === 'x' ? 'X' : task.platform === 'reddit' ? 'Reddit' : task.platform === 'discord' ? 'Discord' : task.platform === 'star' ? 'Review' : 'Refer'}</span>
              </div>
            );
          })}
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'white', border: '1px solid #e2e8f0', borderRadius: 999, padding: '4px 9px', flexShrink: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#6b7280' }}>+more →</span>
          </div>
        </div>
      </button>
    );
  }

  /* 20 ── BIG NUMBER (bold credit count, centered bottom) ─────── */
  function TriggerBigNumber({ totalLeft, allDone, onClick }) {
    return (
      <button onClick={onClick} style={{ position: 'absolute', bottom: 148, right: 14, zIndex: 40, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, lineHeight: 1 }}>
          <span style={{ fontSize: 40, fontWeight: 900, lineHeight: 1, background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-2px' }}>{allDone ? '✓' : totalLeft}</span>
        </div>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: '#6b7280', letterSpacing: '0.06em', textTransform: 'uppercase' }}>free AI credits</span>
        <span style={{ fontSize: 10, fontWeight: 600, color: '#1990FF' }}>Tap to claim →</span>
      </button>
    );
  }

  /* 21 ── GLOW BAR (left edge pulsing gradient bar) ────────────── */
  function TriggerGlowBar({ totalLeft, allDone, onClick }) {
    return (
      <button onClick={onClick} style={{ position: 'absolute', top: 64, bottom: 64, left: 0, zIndex: 40, width: 5, background: 'linear-gradient(to bottom,#0EA4C5,#7B4CFF)', border: 'none', cursor: 'pointer', padding: 0, animation: 'ba-breathe 2s ease-in-out infinite', fontFamily: 'inherit' }}>
        <div style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%) rotate(-90deg)', transformOrigin: 'left center', display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
          <CreditsIcon size={11} id="gbar" white={false} />
          <span style={{ fontSize: 10, fontWeight: 700, background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{allDone ? 'All claimed' : `${totalLeft} free credits`}</span>
        </div>
      </button>
    );
  }

  /* 22 ── CONFETTI CARD (decorated card, bottom-right) ─────────── */
  function TriggerConfetti({ totalLeft, allDone, remaining, onClick }) {
    const dots = [{c:'#0EA4C5',x:12,y:8},{c:'#7B4CFF',x:90,y:6},{c:'#f59e0b',x:80,y:38},{c:'#0EA4C5',x:6,y:34},{c:'#f472b6',x:50,y:4},{c:'#7B4CFF',x:30,y:42}];
    return (
      <button onClick={onClick} style={{ position: 'absolute', bottom: 148, right: 14, zIndex: 40, background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: '11px 14px', boxShadow: '0 6px 24px rgba(0,0,0,0.12)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', position: 'absolute', bottom: 148, right: 14, overflow: 'hidden', minWidth: 160 }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.16)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.12)'}>
        {/* confetti dots */}
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} width="100%" height="100%" viewBox="0 0 100 50">
          {dots.map((d,i) => <circle key={i} cx={d.x} cy={d.y} r="3" fill={d.c} opacity="0.35"/>)}
        </svg>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditsIcon size={14} id="conf" white={true} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#111827' }}>AI Credits</span>
          </div>
          <p style={{ fontSize: 13, fontWeight: 800, color: '#111827', margin: '0 0 3px', lineHeight: 1.2 }}>{allDone ? 'All earned!' : `${totalLeft} waiting for you`}</p>
          <p style={{ fontSize: 10.5, color: '#6b7280', margin: 0 }}>{remaining.length} task{remaining.length !== 1 ? 's' : ''} left</p>
        </div>
      </button>
    );
  }

  /* 23 ── NUDGE TEXT (ultra-minimal text link) ─────────────────── */
  function TriggerNudge({ totalLeft, allDone, onClick }) {
    return (
      <button onClick={onClick} style={{ position: 'absolute', bottom: 138, left: '50%', transform: 'translateX(-50%)', zIndex: 40, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 0', whiteSpace: 'nowrap' }}>
        <CreditsIcon size={13} id="nudge" />
        <span style={{ fontSize: 12, fontWeight: 600, background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', borderBottom: '1.5px solid rgba(14,164,197,0.4)', paddingBottom: 1 }}>
          {allDone ? 'All free credits claimed' : `Earn ${totalLeft} free AI credits`}
        </span>
      </button>
    );
  }

  /* 24 ── AVATAR NUDGE (mini avatar + callout, bottom-right) ───── */
  function TriggerAvatarNudge({ totalLeft, allDone, onClick }) {
    return (
      <div style={{ position: 'absolute', bottom: 148, right: 12, zIndex: 40, display: 'flex', alignItems: 'flex-end', gap: 7, pointerEvents: 'none' }}>
        {/* bubble */}
        <button onClick={onClick} style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '14px 14px 0 14px', padding: '9px 13px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', pointerEvents: 'auto', display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 170, transition: 'box-shadow 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.16)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.3 }}>{allDone ? "Credits all claimed!" : `You have ${totalLeft} free credits waiting`}</p>
          <p style={{ fontSize: 10.5, color: '#1990FF', fontWeight: 600, margin: 0 }}>Complete tasks →</p>
        </button>
        {/* avatar */}
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(123,76,255,0.4)' }}>
          <CreditsIcon size={15} id="av" white={true} />
        </div>
      </div>
    );
  }



  /* ══════════════════════════════════════════════════════════════
     STYLES 25–44 — PM-designed trigger spectrum
  ══════════════════════════════════════════════════════════════ */

  /* 25 ── SPEED DIAL (FAB fans into 5 platform icons) ─────────── */
  function TriggerSpeedDial({ remaining, onClick }) {
    const [exp, setExp] = useState(false);
    const FANS = [
      { platform: 'x',      bottom: 215, right: 18 },
      { platform: 'reddit', bottom: 205, right: 62 },
      { platform: 'discord',bottom: 182, right: 86 },
      { platform: 'star',   bottom: 157, right: 90 },
      { platform: 'refer',  bottom: 136, right: 72 },
    ];
    return (
      <>
        {exp && <div onClick={() => setExp(false)} style={{ position: 'absolute', inset: 0, zIndex: 39 }} />}
        {exp && FANS.map((f, i) => {
          const ps = PLATFORM_STYLE[f.platform];
          return (
            <button key={f.platform} onClick={() => { onClick(); setExp(false); }}
              style={{ position: 'absolute', bottom: f.bottom, right: f.right, zIndex: 41, width: 42, height: 42, borderRadius: '50%', background: ps.bg, color: ps.fg, border: '2.5px solid white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 12px rgba(0,0,0,0.22)', fontFamily: 'inherit', animation: `ba-slide-up 0.18s ease ${i*0.04}s both` }}>
              <PlatformIcon p={f.platform} size={18} />
            </button>
          );
        })}
        <button onClick={() => setExp(v => !v)}
          style={{ position: 'absolute', bottom: 148, right: 16, zIndex: 42, width: 52, height: 52, borderRadius: '50%', background: exp ? '#1f2937' : 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(123,76,255,0.45)', transition: 'transform 0.2s, background 0.2s', transform: exp ? 'rotate(45deg)' : '', fontFamily: 'inherit', position: 'absolute' }}>
          {exp ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                : <CreditsIcon size={22} id="sd" white={true} />}
          {!exp && remaining.length > 0 && <span style={{ position: 'absolute', top: -3, right: -3, width: 18, height: 18, borderRadius: '50%', background: '#f59e0b', color: 'white', fontSize: 9.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>{remaining.length}</span>}
        </button>
      </>
    );
  }

  /* 26 ── FUEL METER (credits gauge, earn-free CTA) ────────────── */
  function TriggerFuelMeter({ done, totalLeft, onClick }) {
    const pct = done.length / 5;
    return (
      <button onClick={onClick} style={{ position: 'absolute', bottom: 148, left: 12, right: 12, zIndex: 40, background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '10px 14px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CreditsIcon size={13} id="fm" />
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#374151' }}>AI Credits</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>+{totalLeft} free available</span>
        </div>
        <div style={{ height: 7, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, rgba(14,164,197,0.15) 0px, rgba(123,76,255,0.15) 60px)', borderRadius: 999 }} />
          <div style={{ height: '100%', width: `${pct * 100}%`, background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', borderRadius: 999, transition: 'width 0.5s ease' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: `${(1-pct)*100}%`, background: 'repeating-linear-gradient(90deg,transparent,transparent 4px,rgba(255,255,255,0.5) 4px,rgba(255,255,255,0.5) 8px)' }} />
        </div>
        <p style={{ fontSize: 10, color: '#9ca3af', margin: '5px 0 0', fontWeight: 600 }}>{done.length} of 5 tasks done — complete more to refill free</p>
      </button>
    );
  }

  /* 27 ── SOCIAL PROOF (FOMO strip, bottom) ────────────────────── */
  function TriggerSocialProof({ totalLeft, onClick }) {
    return (
      <button onClick={onClick} style={{ position: 'absolute', bottom: 148, left: 12, right: 12, zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '9px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', cursor: 'pointer', fontFamily: 'inherit' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* avatar stack */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {['#0EA4C5','#7B4CFF','#f59e0b','#10b981'].map((c, i) => (
              <div key={i} style={{ width: 20, height: 20, borderRadius: '50%', background: c, border: '2px solid white', marginLeft: i > 0 ? -7 : 0, flexShrink: 0 }} />
            ))}
          </div>
          <div>
            <p style={{ fontSize: 11.5, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.2 }}>1,247 users earned credits this week</p>
            <p style={{ fontSize: 10, color: '#6b7280', margin: '1px 0 0' }}>You can earn {totalLeft} for free too</p>
          </div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    );
  }

  /* 28 ── XP BAR (gamified tasks-to-reward bar) ────────────────── */
  function TriggerXPBar({ done, totalLeft, onClick }) {
    const pct = done.length / 5;
    return (
      <button onClick={onClick} style={{ position: 'absolute', bottom: 134, left: 0, right: 0, zIndex: 40, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '0 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#7B4CFF', letterSpacing: '0.05em' }}>FREE CREDITS XP</span>
          <div style={{ flex: 1, height: 8, background: '#e0e7ff', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct * 100}%`, background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', borderRadius: 999, transition: 'width 0.5s ease', boxShadow: '0 0 6px rgba(123,76,255,0.5)' }} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 800, background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{done.length}/5</span>
        </div>
        <p style={{ fontSize: 10, color: '#6b7280', margin: 0, textAlign: 'center' }}>{done.length < 5 ? `Complete ${5 - done.length} more task${5 - done.length !== 1 ? 's' : ''} → earn +${totalLeft} AI credits free` : '🎉 All tasks done!'}</p>
      </button>
    );
  }

  /* 29 ── ACHIEVEMENT POP (badge slides in from corner) ─────────── */
  function TriggerAchievement({ totalLeft, allDone, remaining, onClick }) {
    const [dismissed, setDismissed] = useState(false);
    if (dismissed) return null;
    return (
      <button onClick={onClick} style={{ position: 'absolute', bottom: 148, right: 12, zIndex: 40, background: 'white', border: '1px solid #e0e7ff', borderRadius: 16, padding: '11px 13px', boxShadow: '0 4px 20px rgba(123,76,255,0.18)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, animation: 'ba-slide-up 0.3s ease', maxWidth: 120 }}>
        <button onClick={e => { e.stopPropagation(); setDismissed(true); }} style={{ position: 'absolute', top: 6, right: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', padding: 2, lineHeight: 1 }}>✕</button>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 4px rgba(123,76,255,0.15)' }}>
          <CreditsIcon size={22} id="ach" white={true} />
        </div>
        <p style={{ fontSize: 11, fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.2 }}>{allDone ? 'All done!' : 'Achievement'}</p>
        <div style={{ background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', borderRadius: 999, padding: '2px 8px' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'white' }}>+{totalLeft} free</span>
        </div>
      </button>
    );
  }

  /* 30 ── LOW BALANCE WARNING (shows urgency) ──────────────────── */
  function TriggerLowBalance({ totalLeft, onClick }) {
    return (
      <button onClick={onClick} style={{ position: 'absolute', bottom: 148, left: 12, right: 12, zIndex: 40, background: '#fffbeb', border: '1.5px solid #fbbf24', borderRadius: 12, padding: '10px 14px', boxShadow: '0 4px 16px rgba(245,158,11,0.2)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12.5, fontWeight: 800, color: '#92400e', margin: 0, lineHeight: 1.2 }}>Running low on credits?</p>
          <p style={{ fontSize: 10.5, color: '#b45309', margin: '2px 0 0' }}>Earn {totalLeft} more for free — no payment needed</p>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    );
  }

  /* 31 ── TYPEWRITER NUDGE (animated text, center bottom) ─────── */
  function TriggerTypewriter({ totalLeft, allDone, onClick }) {
    const MESSAGES = allDone
      ? ['All credits claimed!']
      : [`Psst... earn ${totalLeft} free credits`, 'No payment required', 'Takes under 2 minutes', 'Follow, post, refer →'];
    const [idx, setIdx] = useState(0);
    const [chars, setChars] = useState(0);
    const msg = MESSAGES[idx];
    useEffect(() => {
      if (chars < msg.length) {
        const t = setTimeout(() => setChars(c => c + 1), 38);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => { setChars(0); setIdx(i => (i + 1) % MESSAGES.length); }, 2200);
        return () => clearTimeout(t);
      }
    }, [chars, idx, msg]);
    return (
      <button onClick={onClick} style={{ position: 'absolute', bottom: 148, left: '50%', transform: 'translateX(-50%)', zIndex: 40, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px' }}>
        <CreditsIcon size={13} id="tw" />
        <span style={{ fontSize: 12.5, fontWeight: 700, background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{msg.slice(0, chars)}<span style={{ opacity: chars < msg.length ? 1 : 0, animation: 'ba-pulse 0.8s infinite' }}>|</span></span>
      </button>
    );
  }

  /* 32 ── SWIPE PEEK (card peeks from right edge) ──────────────── */
  function TriggerSwipePeek({ totalLeft, allDone, onClick }) {
    const [expanded, setExpanded] = useState(false);
    return (
      <div style={{ position: 'absolute', top: '38%', right: expanded ? 0 : -130, zIndex: 40, transition: 'right 0.3s cubic-bezier(0.34,1.1,0.64,1)' }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}>
        <button onClick={onClick} style={{ display: 'flex', alignItems: 'stretch', background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px 0 0 14px', boxShadow: '-4px 0 20px rgba(0,0,0,0.12)', overflow: 'hidden', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
          <div style={{ width: 5, background: 'linear-gradient(to bottom,#0EA4C5,#7B4CFF)', flexShrink: 0 }} />
          <div style={{ padding: '12px 14px 12px 12px' }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{allDone ? 'Credits earned!' : `+${totalLeft} free credits`}</p>
            <p style={{ fontSize: 10.5, color: '#6b7280', margin: '3px 0 0', whiteSpace: 'nowrap' }}>Complete tasks to claim</p>
            <div style={{ marginTop: 6, display: 'flex', gap: 4 }}>
              {TASKS.slice(0,4).map(t => {
                const ps = PLATFORM_STYLE[t.platform];
                return <div key={t.id} style={{ width: 18, height: 18, borderRadius: 5, background: ps.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><PlatformIcon p={t.platform} size={10} /></div>;
              })}
            </div>
          </div>
        </button>
      </div>
    );
  }

  /* 33 ── STATUS STRIP (ultra-thin top bar) ────────────────────── */
  function TriggerStatusStrip({ totalLeft, allDone, onClick }) {
    return (
      <button onClick={onClick} style={{ position: 'absolute', top: 56, left: 0, right: 0, zIndex: 40, height: 24, background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '0 16px' }}>
        <CreditsIcon size={11} id="ss" white={true} />
        <span style={{ fontSize: 10.5, fontWeight: 700, color: 'white', letterSpacing: '0.02em' }}>
          {allDone ? 'All free credits claimed' : `You can earn ${totalLeft} free AI credits`}
        </span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    );
  }

  /* 34 ── AMBIENT GLOW (subtle radial bottom gradient) ─────────── */
  function TriggerAmbientGlow({ totalLeft, allDone, onClick }) {
    return (
      <button onClick={onClick} style={{ position: 'absolute', bottom: 64, left: 0, right: 0, height: 110, zIndex: 40, background: 'radial-gradient(ellipse at 50% 100%, rgba(123,76,255,0.14) 0%, rgba(14,164,197,0.08) 50%, transparent 75%)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, animation: 'ba-breathe 3s ease-in-out infinite' }}>
        <CreditsIcon size={16} id="ag" />
        <span style={{ fontSize: 11.5, fontWeight: 700, background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {allDone ? 'All free credits earned!' : `+${totalLeft} free AI credits waiting`}
        </span>
      </button>
    );
  }

  /* 35 ── CHALLENGE CARD (weekly framing, higher commitment) ────── */
  function TriggerChallenge({ done, remaining, onClick }) {
    const DAYS = ['M','T','W','T','F','S','S'];
    const today = new Date().getDay();
    return (
      <button onClick={onClick} style={{ position: 'absolute', bottom: 148, right: 14, zIndex: 40, background: 'white', border: '1px solid #e2e8f0', borderRadius: 14, padding: '11px 13px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', width: 172 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 16 }}>🏆</span>
          <div>
            <p style={{ fontSize: 11.5, fontWeight: 800, color: '#111827', margin: 0 }}>Weekly challenge</p>
            <p style={{ fontSize: 9.5, color: '#6b7280', margin: '1px 0 0' }}>{5 - done.length} tasks left</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, justifyContent: 'space-between' }}>
          {DAYS.map((d, i) => {
            const done_day = i < done.length;
            const is_today = i === (today === 0 ? 6 : today - 1);
            return (
              <div key={i} style={{ width: 20, height: 20, borderRadius: 5, background: done_day ? 'linear-gradient(135deg,#0EA4C5,#7B4CFF)' : is_today ? '#e0e7ff' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: done_day ? 'white' : is_today ? '#4f46e5' : '#9ca3af' }}>{d}</span>
              </div>
            );
          })}
        </div>
        <p style={{ fontSize: 10, fontWeight: 600, color: '#7B4CFF', margin: '7px 0 0' }}>Earn free credits →</p>
      </button>
    );
  }

  /* 36 ── SAVINGS CARD (value-prop framing) ────────────────────── */
  function TriggerSavings({ totalLeft, onClick }) {
    return (
      <button onClick={onClick} style={{ position: 'absolute', bottom: 148, right: 14, zIndex: 40, background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '1.5px solid #86efac', borderRadius: 14, padding: '11px 14px', boxShadow: '0 4px 16px rgba(16,185,129,0.15)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', maxWidth: 175 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
          <span style={{ fontSize: 18 }}>💰</span>
          <p style={{ fontSize: 13, fontWeight: 900, color: '#15803d', margin: 0, lineHeight: 1.2 }}>Save real money</p>
        </div>
        <p style={{ fontSize: 11, color: '#166534', margin: '0 0 6px', lineHeight: 1.4 }}>You could earn {totalLeft} AI credits — completely free. No credit card.</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <CreditsIcon size={12} id="sv" />
          <span style={{ fontSize: 10.5, fontWeight: 700, color: '#059669' }}>Earn free now →</span>
        </div>
      </button>
    );
  }

  /* 37 ── BORDER PULSE (animated gradient screen border) ────────── */
  function TriggerBorderPulse({ onClick }) {
    return (
      <>
        <div style={{ position: 'absolute', inset: 0, zIndex: 38, pointerEvents: 'none', borderRadius: 0, boxShadow: 'inset 0 0 0 2.5px transparent', background: 'transparent', border: '2.5px solid transparent', backgroundClip: 'padding-box' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 37, pointerEvents: 'none', background: 'linear-gradient(white,white) padding-box, linear-gradient(135deg,#0EA4C5,#7B4CFF,#0EA4C5) border-box', border: '2.5px solid transparent', animation: 'ba-border-spin 3s linear infinite' }} />
        <button onClick={onClick} style={{ position: 'absolute', bottom: 148, right: 14, zIndex: 40, display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', border: 'none', borderRadius: 999, padding: '8px 13px 8px 10px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(123,76,255,0.38)', fontFamily: 'inherit' }}>
          <CreditsIcon size={14} id="bp" white={true} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>Earn free credits</span>
        </button>
      </>
    );
  }

  /* 38 ── CONFETTI BURST (credits icon, micro confetti on view) ── */
  function TriggerConfettiBurst({ totalLeft, allDone, onClick }) {
    const [burst, setBurst] = useState(true);
    useEffect(() => { const t = setTimeout(() => setBurst(false), 1800); return () => clearTimeout(t); }, []);
    const DOTS = [
      {x:-18,y:-22,c:'#0EA4C5',r:4,a:'ba-cfetti0'},
      {x:18,y:-20,c:'#7B4CFF',r:3,a:'ba-cfetti1'},
      {x:24,y:4,c:'#f59e0b',r:3.5,a:'ba-cfetti2'},
      {x:14,y:22,c:'#10b981',r:3,a:'ba-cfetti3'},
      {x:-14,y:20,c:'#f472b6',r:4,a:'ba-cfetti4'},
      {x:-24,y:2,c:'#7B4CFF',r:3,a:'ba-cfetti5'},
    ];
    return (
      <button onClick={onClick} style={{ position: 'absolute', bottom: 148, right: 16, zIndex: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', position: 'absolute' }}>
        <div style={{ position: 'relative', width: 56, height: 56 }}>
          {burst && DOTS.map((d,i) => (
            <div key={i} style={{ position: 'absolute', top: `calc(50% + ${d.y}px)`, left: `calc(50% + ${d.x}px)`, width: d.r*2, height: d.r*2, borderRadius: '50%', background: d.c, animation: 'ba-cfetti 0.6s ease-out forwards', animationDelay: `${i*0.05}s` }} />
          ))}
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(123,76,255,0.45)', position: 'absolute', inset: 0 }}>
            <CreditsIcon size={26} id="cb" white={true} />
          </div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', whiteSpace: 'nowrap' }}>{allDone ? 'All earned!' : `+${totalLeft} free`}</span>
      </button>
    );
  }

  /* 39 ── STREAK CARD (daily-habit framing) ────────────────────── */
  function TriggerStreak({ done, totalLeft, onClick }) {
    const streak = done.length;
    return (
      <button onClick={onClick} style={{ position: 'absolute', bottom: 148, right: 14, zIndex: 40, background: 'white', border: '1px solid #fed7aa', borderRadius: 14, padding: '10px 13px', boxShadow: '0 4px 18px rgba(249,115,22,0.15)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', width: 164 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
          <span style={{ fontSize: 26, lineHeight: 1 }}>🔥</span>
          <div>
            <p style={{ fontSize: 22, fontWeight: 900, color: '#ea580c', margin: 0, lineHeight: 1 }}>{streak}</p>
            <p style={{ fontSize: 9.5, fontWeight: 700, color: '#9a3412', margin: 0, letterSpacing: '0.04em' }}>TASK STREAK</p>
          </div>
        </div>
        <p style={{ fontSize: 11, color: '#374151', margin: '0 0 5px', lineHeight: 1.35 }}>{streak < 5 ? `${5-streak} tasks left → earn +${totalLeft} credits free` : 'Max streak! All free credits earned!'}</p>
        <div style={{ height: 4, background: '#ffedd5', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(streak/5)*100}%`, background: 'linear-gradient(90deg,#f97316,#ef4444)', borderRadius: 999 }} />
        </div>
      </button>
    );
  }

  /* 40 ── HOT BADGE ("HOT" framed as trending action) ──────────── */
  function TriggerHotBadge({ totalLeft, allDone, onClick }) {
    return (
      <button onClick={onClick} style={{ position: 'absolute', top: 58, right: 14, zIndex: 40, background: 'white', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 18px rgba(0,0,0,0.1)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'flex', alignItems: 'stretch', gap: 0 }}>
        <div style={{ background: 'linear-gradient(to bottom,#ef4444,#dc2626)', padding: '10px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>🔥</span>
          <span style={{ fontSize: 8, fontWeight: 900, color: 'white', letterSpacing: '0.08em', writingMode: 'vertical-rl' }}>HOT</span>
        </div>
        <div style={{ padding: '10px 13px' }}>
          <p style={{ fontSize: 12.5, fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.2 }}>{allDone ? 'Credits claimed!' : `+${totalLeft} free credits`}</p>
          <p style={{ fontSize: 10.5, color: '#6b7280', margin: '3px 0 0', lineHeight: 1.3 }}>Complete quick tasks →</p>
        </div>
      </button>
    );
  }

  /* 41 ── NAV BUBBLE (notification bubble on a nav item) ────────── */
  /* handled in TopNavbar via creditsNudge='navbubble' */

  /* 42 ── NAV PLUS ('+' button next to credits count) ─────────── */
  /* handled in TopNavbar via creditsNudge='navplus' */

  /* 43 ── NAV HOTSPOT (annotation circle on credits pill) ──────── */
  /* handled in TopNavbar via creditsNudge='navhotspot' */

  /* 44 ── INLINE STRIP (below navbar, full width) ─────────────── */
  function TriggerInlineStrip({ totalLeft, allDone, done, onClick }) {
    const [dismissed, setDismissed] = useState(false);
    if (dismissed) return null;
    return (
      <button onClick={onClick} style={{ position: 'absolute', top: 56, left: 0, right: 0, zIndex: 40, background: 'white', border: 'none', borderBottom: '1px solid #e2e8f0', padding: '9px 16px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#0EA4C5,#7B4CFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <CreditsIcon size={15} id="is" white={true} />
        </div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: '#111827', margin: 0 }}>{allDone ? 'All free credits claimed!' : `Earn up to ${totalLeft} free AI credits`}</p>
          <div style={{ marginTop: 3, height: 3, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden', width: 120 }}>
            <div style={{ height: '100%', width: `${(done.length/5)*100}%`, background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)', borderRadius: 999 }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#4f46e5' }}>See tasks →</span>
          <button onClick={e => { e.stopPropagation(); setDismissed(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', padding: 2, fontSize: 14, lineHeight: 1 }}>✕</button>
        </div>
      </button>
    );
  }


  /* ══════════════════════════════════════════════════════════════
     BOTTOM SHEET PANEL
  ══════════════════════════════════════════════════════════════ */
  function CreditsPanel({ open, onClose, done, setDone }) {
    const [copied, setCopied] = useState(false);
    const panelRef = useRef(null);

    useEffect(() => {
      if (!open) return;
      const h = e => { if (panelRef.current && !panelRef.current.contains(e.target)) onClose(); };
      setTimeout(() => document.addEventListener('mousedown', h), 0);
      return () => document.removeEventListener('mousedown', h);
    }, [open, onClose]);

    const remaining = TASKS.filter(t => !done.includes(t.id));
    const allDone   = remaining.length === 0;
    const markDone  = id => setDone(prev => prev.includes(id) ? prev : [...prev, id]);

    const handleCTA = task => {
      if (task.id === 'refer') {
        navigator.clipboard?.writeText('https://bluestacks.com/blueai?ref=YOU123').catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } else if (task.url) {
        window.open(task.url, '_blank', 'noopener');
      }
      setTimeout(() => markDone(task.id), 600);
    };

    return (
      <>
        {/* backdrop */}
        {open && <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 48, background: 'rgba(0,0,0,0.25)' }} />}

        {/* sheet */}
        <div ref={panelRef} style={{
          position: 'absolute', left: 0, right: 0,
          bottom: open ? 64 : -560,
          zIndex: 50,
          transition: 'bottom 0.32s cubic-bezier(0.34,1.06,0.64,1)',
          pointerEvents: open ? 'auto' : 'none',
        }}>
          <div style={{ margin: '0 8px', background: 'white', borderRadius: '20px 20px 0 0', boxShadow: '0 -6px 40px rgba(0,0,0,0.16)', overflow: 'hidden' }}>
            {/* drag handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: '#d1d5db' }} />
            </div>

            {/* gradient header */}
            <div style={{ background: 'linear-gradient(135deg,#0EA4C5 0%,#7B4CFF 100%)', padding: '14px 18px 14px', position: 'relative' }}>
              <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CreditsIcon size={20} id="hdr" white={true} />
                </div>
                <div>
                  <p style={{ color: 'white', fontWeight: 800, fontSize: 14.5, lineHeight: 1.2, margin: 0 }}>Earn free AI credits</p>
                  <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 11.5, margin: '2px 0 0' }}>
                    {allDone ? "All tasks complete — credits on their way!" : `Complete tasks below to earn free credits`}
                  </p>
                </div>
              </div>
              {!allDone && (
                <div style={{ marginTop: 11 }}>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.25)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(done.length / TASKS.length) * 100}%`, background: 'white', borderRadius: 999, transition: 'width 0.4s' }} />
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.68)', fontSize: 10, margin: '4px 0 0', fontWeight: 600 }}>{done.length} of {TASKS.length} completed</p>
                </div>
              )}
            </div>

            {/* task list */}
            <div style={{ padding: '8px 12px 12px', display: 'flex', flexDirection: 'column', gap: 7, maxHeight: 260, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.12) #e2e8f0' }}>
              {TASKS.map(task => {
                const isComplete = done.includes(task.id);
                const ps = PLATFORM_STYLE[task.platform];
                return (
                  <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', border: `1px solid ${isComplete ? '#dcfce7' : '#e2e8f0'}`, borderRadius: 11, background: isComplete ? '#f0fdf4' : 'white', opacity: isComplete ? 0.72 : 1, transition: 'all 0.2s' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: isComplete ? '#bbf7d0' : ps.bg, color: isComplete ? '#16a34a' : ps.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {isComplete
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        : <PlatformIcon p={task.platform} size={17} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: isComplete ? '#15803d' : '#111827', margin: 0, lineHeight: 1.25, textDecoration: isComplete ? 'line-through' : 'none' }}>{task.label}</p>
                      <p style={{ fontSize: 10.5, color: '#6b7280', margin: '1px 0 0', lineHeight: 1.3 }}>{task.sub}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                      <CreditBadge amount={task.credits} idx={task.id} />
                      {!isComplete && (
                        <button onClick={() => handleCTA(task)} style={{ fontSize: 10.5, fontWeight: 600, color: '#4f46e5', background: '#eef2ff', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s', whiteSpace: 'nowrap' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#e0e7ff'}
                          onMouseLeave={e => e.currentTarget.style.background = '#eef2ff'}>
                          {task.id === 'refer' && copied ? 'Copied!' : task.cta}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ padding: '0 12px 14px' }}>
              <p style={{ fontSize: 10, color: '#9ca3af', textAlign: 'center', lineHeight: 1.4, margin: 0 }}>Credits are added to your account automatically after verification.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ══════════════════════════════════════════════════════════════
     MAIN WIDGET — accepts triggerStyle prop
  ══════════════════════════════════════════════════════════════ */
  function FreeCreditsWidget({ triggerStyle = 'pill' }) {
    const [open, setOpen] = useState(false);
    const [done, setDone] = useState(() => {
      try { return JSON.parse(localStorage.getItem('ba_credits_done') || '[]'); }
      catch { return []; }
    });

    // Register global opener + resetter (for nav-based trigger styles and tweaks)
    useEffect(() => {
      window.__openEarnCredits  = () => setOpen(v => !v);
      window.__resetEarnCredits = () => { setDone([]); localStorage.removeItem('ba_credits_done'); };
      return () => { delete window.__openEarnCredits; delete window.__resetEarnCredits; };
    }, []);

    useEffect(() => {
      localStorage.setItem('ba_credits_done', JSON.stringify(done));
    }, [done]);

    const remaining = TASKS.filter(t => !done.includes(t.id));
    const totalLeft = remaining.reduce((s, t) => s + t.credits, 0);
    const allDone   = remaining.length === 0;
    const toggle    = () => setOpen(v => !v);

    return (
      <>
        {triggerStyle === 'pill'     && <TriggerPill      totalLeft={totalLeft} remaining={remaining} onClick={toggle} />}
        {triggerStyle === 'fab'      && <TriggerFAB       remaining={remaining} onClick={toggle} />}
        {triggerStyle === 'card'     && <TriggerCard      totalLeft={totalLeft} remaining={remaining} allDone={allDone} onClick={toggle} />}
        {triggerStyle === 'banner'   && <TriggerBanner    totalLeft={totalLeft} allDone={allDone} onClick={toggle} />}
        {triggerStyle === 'toast'    && <TriggerToast     totalLeft={totalLeft} allDone={allDone} onClick={toggle} />}
        {triggerStyle === 'topstrip' && <TriggerTopStrip  totalLeft={totalLeft} allDone={allDone} onClick={toggle} />}
        {triggerStyle === 'orb'      && <TriggerOrb       remaining={remaining} onClick={toggle} />}
        {triggerStyle === 'coin'     && <TriggerCoin      totalLeft={totalLeft} remaining={remaining} onClick={toggle} />}
        {triggerStyle === 'sparkle'  && <TriggerSparkle   totalLeft={totalLeft} onClick={toggle} />}
        {triggerStyle === 'peek'     && <TriggerPeek      totalLeft={totalLeft} done={done} allDone={allDone} onClick={toggle} />}
        {triggerStyle === 'sidetab'  && <TriggerSideTab   totalLeft={totalLeft} onClick={toggle} />}
        {triggerStyle === 'bubble'   && <TriggerBubble    totalLeft={totalLeft} allDone={allDone} onClick={toggle} />}
        {triggerStyle === 'cornertag'   && <TriggerCornerTag   totalLeft={totalLeft} remaining={remaining} onClick={toggle} />}
        {triggerStyle === 'marquee'     && <TriggerMarquee     totalLeft={totalLeft} allDone={allDone} onClick={toggle} />}
        {triggerStyle === 'sticker'     && <TriggerSticker     totalLeft={totalLeft} allDone={allDone} onClick={toggle} />}
        {triggerStyle === 'lefttab'     && <TriggerLeftTab     totalLeft={totalLeft} onClick={toggle} />}
        {triggerStyle === 'ring'        && <TriggerRing        done={done} totalLeft={totalLeft} allDone={allDone} onClick={toggle} />}
        {triggerStyle === 'gift'        && <TriggerGift        remaining={remaining} onClick={toggle} />}
        {triggerStyle === 'chips'       && <TriggerChips       remaining={remaining} done={done} onClick={toggle} />}
        {triggerStyle === 'bignumber'   && <TriggerBigNumber   totalLeft={totalLeft} allDone={allDone} onClick={toggle} />}
        {triggerStyle === 'glowbar'     && <TriggerGlowBar     totalLeft={totalLeft} allDone={allDone} onClick={toggle} />}
        {triggerStyle === 'confetti'    && <TriggerConfetti    totalLeft={totalLeft} allDone={allDone} remaining={remaining} onClick={toggle} />}
        {triggerStyle === 'nudge'       && <TriggerNudge       totalLeft={totalLeft} allDone={allDone} onClick={toggle} />}
        {triggerStyle === 'avatarnudge' && <TriggerAvatarNudge totalLeft={totalLeft} allDone={allDone} onClick={toggle} />}
        {/* floating styles 25-39 */}
        {triggerStyle === 'speeddial'    && <TriggerSpeedDial    remaining={remaining} onClick={toggle} />}
        {triggerStyle === 'fuelmeter'    && <TriggerFuelMeter    done={done} totalLeft={totalLeft} onClick={toggle} />}
        {triggerStyle === 'socialproof'  && <TriggerSocialProof  totalLeft={totalLeft} onClick={toggle} />}
        {triggerStyle === 'xpbar'        && <TriggerXPBar        done={done} totalLeft={totalLeft} onClick={toggle} />}
        {triggerStyle === 'achievement'  && <TriggerAchievement  totalLeft={totalLeft} allDone={allDone} remaining={remaining} onClick={toggle} />}
        {triggerStyle === 'lowbalance'   && <TriggerLowBalance   totalLeft={totalLeft} onClick={toggle} />}
        {triggerStyle === 'typewriter'   && <TriggerTypewriter   totalLeft={totalLeft} allDone={allDone} onClick={toggle} />}
        {triggerStyle === 'swipepeek'    && <TriggerSwipePeek    totalLeft={totalLeft} allDone={allDone} onClick={toggle} />}
        {triggerStyle === 'statusstrip'  && <TriggerStatusStrip  totalLeft={totalLeft} allDone={allDone} onClick={toggle} />}
        {triggerStyle === 'ambientglow'  && <TriggerAmbientGlow  totalLeft={totalLeft} allDone={allDone} onClick={toggle} />}
        {triggerStyle === 'challenge'    && <TriggerChallenge    done={done} remaining={remaining} onClick={toggle} />}
        {triggerStyle === 'savings'      && <TriggerSavings      totalLeft={totalLeft} onClick={toggle} />}
        {triggerStyle === 'borderpulse'  && <TriggerBorderPulse  onClick={toggle} />}
        {triggerStyle === 'confettiburst'&& <TriggerConfettiBurst totalLeft={totalLeft} allDone={allDone} onClick={toggle} />}
        {triggerStyle === 'streak'       && <TriggerStreak       done={done} totalLeft={totalLeft} onClick={toggle} />}
        {triggerStyle === 'hotbadge'     && <TriggerHotBadge     totalLeft={totalLeft} allDone={allDone} onClick={toggle} />}
        {triggerStyle === 'inlinestrip'  && <TriggerInlineStrip  totalLeft={totalLeft} allDone={allDone} done={done} onClick={toggle} />}
        {/* nav-based styles (navbubble, navplus, navhotspot): trigger lives in TopNavbar */}

        <CreditsPanel open={open} onClose={() => setOpen(false)} done={done} setDone={setDone} />
      </>
    );
  }

  Object.assign(window, { FreeCreditsWidget });
})();
