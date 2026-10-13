// Out-of-credits popup options (2026-10-06): shared pieces for credits-popup-options.html.
//
// A standalone comparison page, kept apart from the main prototype (index.html) so the options
// can sit side by side in one review. Card values are copied from the live app's
// CreditsOverlay.tsx (ai-worker frontend), not from byok.jsx, so "Now" matches what users see
// today: frosted full-window backdrop, X in the window corner, 300px card.
//
// Exposes window.CreditsPopupParts.
(function () {
  const { useState, useEffect } = React;
  const BLUE = '#1990FF';
  // Deep link to the article's "AI credits" section (its <section id="ai-credits">), not the page top.
  const FAQ_URL = 'https://bluestacks.ai/getting-started#ai-credits';
  const DAILY = 2500;
  const GRAD = 'linear-gradient(270deg,#7B4CFF 0%,#0EA4C5 99.48%)';
  // The hover tooltip's tint. Plain white vanished against the white card; this is the (i)
  // icon's own highlight blue, so the tooltip reads as belonging to the icon.
  const TIP_BG = '#EEF6FF';
  const TIP_BORDER = '#BFDBFE';

  // ---- time
  // The daily refill is due at 00:00 UTC (token/handlers.py uses the UTC date as the day key).
  function nextUtcMidnight(now) {
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  }
  // "6h 42m", "42m", "8s". Seconds only in the last minute, so the copy stays calm.
  function formatLeft(ms) {
    const s = Math.max(0, Math.ceil(ms / 1000));
    if (s < 60) return s + 's';
    const m = Math.floor(s / 60), h = Math.floor(m / 60), mm = m % 60;
    if (h === 0) return m + 'm';
    return mm === 0 ? h + 'h' : h + 'h ' + mm + 'm';
  }
  // "5:30 AM tomorrow", in the viewer's own time zone.
  function formatClock(at, now) {
    // en-US pinned so it always reads "5:30 AM"; the real app would use the user's locale.
    const time = at.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const tmr = new Date(now); tmr.setDate(now.getDate() + 1);
    if (at.toDateString() === now.toDateString()) return time + ' today';
    if (at.toDateString() === tmr.toDateString()) return time + ' tomorrow';
    return time + ' ' + at.toLocaleDateString([], { weekday: 'long' });
  }
  // One clock for the whole page, so every card counts down in step.
  function useNow() {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
    return now;
  }

  // ---- card pieces (live CreditsOverlay values)
  const gradText = { background: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' };
  const CreditsIcon = ({ size = 44 }) => <img src="assets/Credits.svg" alt="" style={{ width: size, height: size, flexShrink: 0 }} />;
  const ClockIcon = ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <defs><linearGradient id="cpo-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0EA4C5" /><stop offset="1" stopColor="#7B4CFF" /></linearGradient></defs>
      <circle cx="12" cy="12" r="9" stroke="url(#cpo-g)" /><path d="M12 7v5l3 2" stroke="url(#cpo-g)" />
    </svg>
  );
  function Hero({ icon, value, label }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minHeight: 96, justifyContent: 'center' }}>
        {label && <span style={{ fontSize: 12, fontWeight: 600, color: '#565977' }}>{label}</span>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {icon}
          {value != null && <span style={{ ...gradText, fontSize: 56, fontWeight: 700, lineHeight: 1.5 }}>{value}</span>}
        </div>
      </div>
    );
  }
  const Rule = () => <hr style={{ width: '100%', border: 'none', borderTop: '1px solid rgba(182,184,204,0.4)' }} />;
  // A div, not a p: in B it holds the InfoTip, whose tooltip has block content.
  const Title = ({ children }) => (
    <div style={{ fontSize: 19, fontWeight: 700, color: '#080A1F', lineHeight: 1.5, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>{children}</div>
  );
  // Each line is its own block, as live, so a break never lands mid-sentence.
  const Body = ({ lines }) => (
    <p style={{ fontSize: 12, lineHeight: 1.5, color: '#565977', textAlign: 'center' }}>
      {lines.map((l, i) => <span key={i} style={{ display: 'block' }}>{l}</span>)}
    </p>
  );
  // nowrap: the bolded bit is always a time ("6h 42m", "5:30 AM tomorrow"), never split it.
  const Strong = ({ children }) => <strong style={{ color: '#080A1F', fontWeight: 700, whiteSpace: 'nowrap' }}>{children}</strong>;
  const GotIt = ({ onClick }) => (
    <button onClick={onClick} style={{ minHeight: 32, minWidth: 106, padding: '7px 16px', borderRadius: 40, background: BLUE, border: 'none', color: '#F7FAFF', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>Got it</button>
  );
  // `palette` 'red' is for the (i) inside the red out-of-credits banner and next to a red
  // title, where the blue highlight looked out of place. Idle is a muted red, open a deeper red
  // on a pale red circle, both from the banner's own palette.
  const PALETTES = {
    blue: { idle: '#94a3b8', open: BLUE, ring: '#e8f3ff' },
    red: { idle: '#b04a4a', open: '#991b1b', ring: '#f8d7d7' },
  };
  const InfoButton = ({ open, onClick, palette = 'blue' }) => (
    <button aria-label="What are credits?" aria-expanded={open} onClick={onClick}
      style={{ width: 22, height: 22, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', background: open ? PALETTES[palette].ring : 'transparent', color: open ? PALETTES[palette].open : PALETTES[palette].idle }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9.5" /><path d="M12 11v6" /><path d="M12 7.5h.01" /></svg>
    </button>
  );
  const TextLink = ({ children, onClick, open }) => (
    <button onClick={onClick} aria-expanded={open} style={{ background: 'none', border: 'none', cursor: 'pointer', color: BLUE, fontSize: 12.5, fontWeight: 600, padding: 2 }}>{children}</button>
  );
  // Approved 2026-10-06. The explainer copy, one paragraph, no number: the daily amount is set
  // per program, so naming it here would need a copy change (in 17 languages) whenever it moves.
  // "Limited credits each day" is also what the AI Credits page already says.
  const EXPLAIN_CREDITS = 'BlueAI runs on credits. Every job and chat uses some. You get limited credits each day, enough for 4 to 5 jobs.';
  const EXPLAIN_LIMIT = 'BlueAI has a daily limit. Every job and chat uses some of it. It’s enough for 4 to 5 jobs.';

  // The "Learn more" text link. Opens the website FAQ.
  const LearnLink = ({ style }) => (
    <a href={FAQ_URL} target="_blank" rel="noreferrer" style={{ display: 'inline-block', fontSize: 12.5, fontWeight: 600, color: BLUE, textDecoration: 'none', ...style }}>Learn more &#8599;</a>
  );

  // The explanation. `words` picks the vocabulary: 'credits' (A to C) or 'limit' (D).
  // `tone` 'panel' is the inline grey panel (C, D); 'tooltip' is the floating card (B).
  function Explainer({ words = 'credits', tone = 'panel' }) {
    const tip = tone === 'tooltip';
    return (
      <div style={{ width: '100%', textAlign: 'left', background: tip ? TIP_BG : '#f5f7fb', border: '1px solid ' + (tip ? TIP_BORDER : '#e3e8f0'), borderRadius: 10, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10, boxShadow: tip ? '0 8px 24px rgba(15,23,42,0.16)' : 'none' }}>
        <p style={{ fontSize: 12.5, lineHeight: 1.5, color: '#334155' }}>{words === 'credits' ? EXPLAIN_CREDITS : EXPLAIN_LIMIT}</p>
        <LearnLink />
      </div>
    );
  }

  /* The (i) with its hover tooltip. Opens on hover, keyboard focus or click (click pins it, for
     touchscreens). Closing waits 200ms, so the pointer can travel from the icon onto the tooltip
     and reach the FAQ link without it vanishing. Esc closes.

     `dir` says which way it opens. In the popup it opens UP, over the hero number, which carries
     nothing the reader needs while the tooltip is up; downward it covered the body copy and the
     button, the two things the person hovering is about to read. On the AI Credits page the
     banner sits near the top, so it opens DOWN, over the card that only holds the 0.
     Positioned for a centred title row: the icon sits about 220px across, so the 260px tooltip
     starts 189px left of the icon's centre and stays in the window. */
  function InfoTip({ dir = 'up', palette = 'blue' }) {
    const [hover, setHover] = useState(false);
    const [pinned, setPinned] = useState(false);
    const timer = React.useRef(null);
    const enter = () => { clearTimeout(timer.current); setHover(true); };
    const leave = () => { timer.current = setTimeout(() => setHover(false), 200); };
    const open = hover || pinned;
    return (
      <span style={{ position: 'relative', display: 'inline-flex' }} onMouseEnter={enter} onMouseLeave={leave}
        onFocus={enter} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) { setHover(false); setPinned(false); } }}
        onKeyDown={(e) => { if (e.key === 'Escape') { setHover(false); setPinned(false); } }}>
        <InfoButton open={open} onClick={() => setPinned(!pinned)} palette={palette} />
        {open && (
          <span role="tooltip" style={{ position: 'absolute', [dir === 'up' ? 'bottom' : 'top']: 'calc(100% + 10px)', left: -189, width: 260, zIndex: 20 }}>
            {/* The arrow is a bordered square behind the card, so only its outer two edges show. */}
            <span style={{ position: 'absolute', [dir === 'up' ? 'bottom' : 'top']: -6, left: 194, width: 12, height: 12, background: TIP_BG, border: '1px solid ' + TIP_BORDER, transform: 'rotate(45deg)', borderRadius: 2 }} />
            <span style={{ position: 'relative', display: 'block' }}><Explainer tone="tooltip" /></span>
          </span>
        )}
      </span>
    );
  }
  // The card shell, live CreditsOverlay sizes: max-w 300, pt-10 px-5 pb-12, gap 5.
  const Card = ({ children }) => (
    <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, background: 'white', border: '1px solid rgba(182,184,204,0.8)', borderRadius: 12, padding: '36px 20px 40px', boxShadow: '0 4px 32px rgba(0,0,0,0.10)' }}>{children}</div>
  );

  window.CreditsPopupParts = {
    BLUE, DAILY, nextUtcMidnight, formatLeft, formatClock, useNow,
    CreditsIcon, ClockIcon, Hero, Rule, Title, Body, Strong, GotIt, InfoButton, InfoTip, TextLink, Explainer, LearnLink, Card, gradText,
    EXPLAIN_CREDITS,
  };
})();
