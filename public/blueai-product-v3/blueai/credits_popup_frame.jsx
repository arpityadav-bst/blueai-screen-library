// Out-of-credits popup options: the BlueAI window each option sits in.
//
// A rough, static stand-in for the Chat home (header, BlueAI Worker card, composer, bottom nav).
// It only has to read correctly through the popup's frosted backdrop, so it is not wired to any
// of the real prototype's state. Sizes follow the live window: 421 wide content box.
//
// Exposes window.CreditsPopupFrame.
(function () {
  const { useState } = React;
  const BLUE = '#1990FF';

  const NavIcon = ({ d }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
  );
  const NAV = [
    ['Jobs', 'M4 8h16v11H4zM9 8V5h6v3'],
    ['Skills', 'M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z'],
    ['Chat', 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z'],
    ['Schedule', 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4'],
    ['Settings', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12l2-1-2-4-2 .5-1.5-1L15 4h-6l-.5 2.5-1.5 1L5 7l-2 4 2 1-2 1 2 4 2-.5 1.5 1L9 20h6l.5-2.5 1.5-1 2 .5 2-4z'],
  ];

  function CreditsPill({ balance }) {
    return (
      <span style={{ position: 'relative', padding: 1.5, borderRadius: 999, background: 'linear-gradient(90deg,#0EA4C5,#7B4CFF)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'white', borderRadius: 999, padding: '4px 10px', fontSize: 13, fontWeight: 600, color: '#334155' }}>
          <img src="assets/Credits.svg" alt="" style={{ width: 14, height: 14 }} />{balance.toLocaleString()}
        </span>
        {balance < 1000 && <span style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: 999, background: '#ef4444', boxShadow: '0 0 0 1px white' }} />}
      </span>
    );
  }

  function Header({ balance }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <span style={{ width: 28, height: 28, borderRadius: 999, background: 'linear-gradient(135deg,#1990FF,#7B4CFF)' }} />
        <span style={{ fontSize: 20, fontWeight: 800, color: BLUE }}>BlueAI</span>
        <span style={{ flex: 1 }} />
        <CreditsPill balance={balance} />
        <span style={{ background: BLUE, color: 'white', fontSize: 12.5, fontWeight: 600, borderRadius: 999, padding: '6px 12px' }}>New Chat</span>
        <span style={{ width: 20, height: 20, borderRadius: 999, border: '1.6px solid #64748b' }} />
      </div>
    );
  }

  // `active` is the highlighted tab; the AI Credits page highlights none (it opens from the pill).
  function BottomNav({ active }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '8px 4px 10px', background: 'white', borderTop: '1px solid #e2e8f0' }}>
        {NAV.map(([label, d]) => (
          <span key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, fontSize: 11, color: label === active ? BLUE : '#475569' }}><NavIcon d={d} />{label}</span>
        ))}
      </div>
    );
  }

  // The OS window: titlebar plus the 421x720 content box every screen is laid out in.
  function Window({ children }) {
    return (
      <div style={{ width: 421, borderRadius: 10, overflow: 'hidden', boxShadow: '0 10px 40px rgba(15,23,42,0.18)', border: '1px solid #cbd5e1', background: 'white' }}>
        <div style={{ height: 32, background: '#1f2330', display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', color: '#cbd5e1', fontSize: 12 }}>
          <span style={{ width: 14, height: 14, borderRadius: 999, background: BLUE }} />BlueAI<span style={{ flex: 1 }} />
          <svg width="88" height="12" viewBox="0 0 88 12" fill="none" stroke="#94a3b8" strokeWidth="1.2"><path d="M2 6h10" /><rect x="38" y="1" width="10" height="10" /><path d="M76 1l10 10M86 1L76 11" /></svg>
        </div>
        <div style={{ position: 'relative', height: 720 }}>{children}</div>
      </div>
    );
  }

  function FakeHome({ balance }) {
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
        <Header balance={balance} />
        <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: 19, fontWeight: 800, color: '#0f172a' }}>Hi Abhisht &#128075;</p>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>You&rsquo;re all set. The BlueAI Worker is all it takes to start earning.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, background: '#dcfce7' }} />
            <span style={{ flex: 1 }}>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>BlueAI Worker</span>
              <span style={{ display: 'block', fontSize: 11, color: '#64748b' }}>Finds jobs that fit you and runs them on your account.</span>
            </span>
            <span style={{ background: BLUE, color: 'white', fontSize: 12, fontWeight: 700, borderRadius: 8, padding: '7px 12px' }}>Run</span>
          </div>
        </div>
        <span style={{ flex: 1 }} />
        <div style={{ margin: '0 12px 10px', border: '1.5px solid #bfdbfe', borderRadius: 14, background: 'white', padding: '14px', fontSize: 13, color: '#94a3b8' }}>Type your message...</div>
        <BottomNav active="Chat" />
      </div>
    );
  }

  /* One BlueAI window. The popup opens on mount, as the live one does on Chat. Closing it (X,
     backdrop, Got it) leaves a "Show the popup again" chip, so a reviewer can reopen it. */
  function Frame({ balance, render }) {
    const [open, setOpen] = useState(true);
    const close = () => setOpen(false);
    return (
      <Window>
          <FakeHome balance={balance} />
          {open ? (
            <div onClick={close} style={{ position: 'absolute', inset: 0, zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
              <button aria-label="Close" onClick={close} style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: 999, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#333" strokeWidth="1.5" strokeLinecap="round"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              {render(close)}
            </div>
          ) : (
            <button onClick={() => setOpen(true)} style={{ position: 'absolute', zIndex: 5, top: 120, left: '50%', transform: 'translateX(-50%)', background: '#0f172a', color: 'white', border: 'none', borderRadius: 999, padding: '8px 14px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Show the popup again</button>
          )}
      </Window>
    );
  }

  window.CreditsPopupFrame = { Frame, Window, Header, BottomNav };
})();
