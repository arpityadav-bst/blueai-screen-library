// BlueAI — bluestacks.ai's own page language, as primitives for the pages the app's Sign in opens
// in the browser (ROB-21388). Exports: window.SiteKit
//
// Transcribed from the live site's source (the vesper experiment's gate, light theme), not
// eyeballed from a screenshot: Inter for everything, Instrument Serif italic for the one <em>
// word in a title, an 11px letter-spaced eyebrow between two hairlines, the 38px spark mark,
// outline "door" buttons at radius 6 with the solid black button reserved for the one action
// that commits, and underlined inline links. Sizes are the site's own at this window's width,
// so the title is 40px here where the hero's is 64.

(function () {
  const T = {
    font: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
    serif: "'Instrument Serif', 'Times New Roman', Times, serif",
    bg: '#f7f7f9', card: '#fdfdfd',
    ink: '#0b0b0d', ledeInk: '#3c4049', muted: '#5f636b', dim: '#767b85',
    border: 'rgba(0,0,0,0.15)', borderHover: 'rgba(0,0,0,0.2)', rule: 'rgba(0,0,0,0.32)', hover: 'rgba(0,0,0,0.045)',
    underline: 'rgba(0,0,0,0.35)', blue: '#156efe'
  };
  const SPARK = 'M12 2.6C12.55 2.6 12.88 3.15 13.08 4.7c.62 4.7 1.52 5.6 6.22 6.22 1.55.2 2.1.53 2.1 1.08s-.55.88-2.1 1.08c-4.7.62-5.6 1.52-6.22 6.22-.2 1.55-.53 2.1-1.08 2.1s-.88-.55-1.08-2.1c-.62-4.7-1.52-5.6-6.22-6.22C3.15 12.88 2.6 12.55 2.6 12s.55-.88 2.1-1.08c4.7-.62 5.6-1.52 6.22-6.22C11.12 3.15 11.45 2.6 12 2.6Z';
  const hover = (on, off) => ({ onMouseEnter: (e) => Object.assign(e.currentTarget.style, on), onMouseLeave: (e) => Object.assign(e.currentTarget.style, off) });

  // The page: the site's pale ground with the soft blur its gate shows over it, content centred.
  const Shell = ({ children }) => (
    <div style={{ position: 'absolute', inset: 0, overflow: 'auto', fontFamily: T.font, color: T.ink, background: 'radial-gradient(420px 300px at 12% 30%, rgba(21,110,254,0.07), transparent 60%), radial-gradient(360px 260px at 85% 18%, rgba(0,0,0,0.045), transparent 60%), radial-gradient(520px 320px at 50% 105%, rgba(0,0,0,0.035), transparent 60%), ' + T.bg }}>
      <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '28px 40px' }}>
        {children}
      </div>
    </div>
  );
  const Mark = () => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill={T.blue} aria-hidden="true" style={{ display: 'block', marginBottom: 14, filter: 'drop-shadow(0 0 13px rgba(21,110,254,0.18))' }}><path d={SPARK} /></svg>
  );
  const Eyebrow = ({ children }) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, color: T.dim, fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', whiteSpace: 'nowrap', marginBottom: 14 }}>
      <i style={{ display: 'block', width: 60, height: 1, background: 'linear-gradient(90deg, transparent, ' + T.rule + ')' }} />
      {children}
      <i style={{ display: 'block', width: 60, height: 1, background: 'linear-gradient(90deg, ' + T.rule + ', transparent)' }} />
    </span>
  );
  const Title = ({ children }) => <h1 style={{ fontSize: 40, fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.04em', color: T.ink }}>{children}</h1>;
  const Em = ({ children }) => <em style={{ fontFamily: T.serif, fontStyle: 'italic', fontWeight: 400, fontSize: '1.06em', letterSpacing: '-0.03em', color: T.blue }}>{children}</em>;
  const Lede = ({ children }) => <p style={{ maxWidth: 440, marginTop: 14, color: T.ledeInk, fontSize: 15.5, fontWeight: 400, lineHeight: 1.55, letterSpacing: '-0.015em' }}>{children}</p>;
  const Opts = ({ children, top = 26 }) => <div style={{ width: '100%', maxWidth: 380, marginTop: top, display: 'grid', gap: 10 }}>{children}</div>;

  const BTN = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', height: 48, padding: '0 16px', borderRadius: 6, fontFamily: 'inherit', fontSize: 16, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1, cursor: 'pointer' };
  // The outline "door": the site gives every option the same box, so none claims to be the real way in.
  const Opt = ({ children, onClick, icon }) => (
    <button type="button" onClick={onClick} {...hover({ borderColor: T.borderHover, background: T.hover }, { borderColor: T.border, background: T.card })}
      style={{ ...BTN, border: '1px solid ' + T.border, background: T.card, color: T.ink, transition: 'background 0.35s ease, border-color 0.35s ease' }}>
      {icon}{children}
    </button>
  );
  // The solid button: the site's one shape for the action that commits. Presses down 1px, as its CTAs do.
  const Solid = ({ children, onClick }) => (
    <button type="button" onClick={onClick} {...hover({ transform: 'translateY(1px)' }, { transform: '' })}
      style={{ ...BTN, border: '1px solid ' + T.ink, background: T.ink, color: '#fff', transition: 'transform 0.12s ease' }}>
      {children}
    </button>
  );
  // "First time here? See how it works": a muted sentence carrying one underlined action.
  const Link = ({ children, onClick }) => (
    <button type="button" onClick={onClick} {...hover({ color: T.blue, textDecorationColor: T.blue }, { color: T.ink, textDecorationColor: T.underline })}
      style={{ border: 0, padding: 0, background: 'none', color: T.ink, font: 'inherit', letterSpacing: 'inherit', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3, textDecorationThickness: 1, textDecorationColor: T.underline, transition: 'color 0.3s ease, text-decoration-color 0.3s ease' }}>{children}</button>
  );
  const Alt = ({ children, top = 18 }) => <p style={{ marginTop: top, color: T.muted, fontSize: 13.5, letterSpacing: '-0.01em' }}>{children}</p>;
  const Legal = ({ children }) => <p style={{ marginTop: 14, maxWidth: 400, color: T.muted, fontSize: 12.5, lineHeight: 1.55 }}>{children}</p>;
  const U = ({ children }) => <span style={{ textDecoration: 'underline', textUnderlineOffset: 3, textDecorationThickness: 1, textDecorationColor: T.underline }}>{children}</span>;
  const Arrow = <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4.8 12h13.4M12.4 6.2 18.6 12l-6.2 5.8" /></svg>;
  // Google's G, the site's own copy of it (the gate's "Continue with Google" button).
  const GoogleG = (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.23c0-.73-.07-1.43-.19-2.1H12v3.98h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.89-1.74 2.98-4.3 2.98-7.41Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.59A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.41 13.9a5.99 5.99 0 0 1 0-3.8V7.51H3.06a10 10 0 0 0 0 8.98l3.35-2.59Z" />
      <path fill="#EA4335" d="M12 5.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.95 2.99 14.7 2 12 2a10 10 0 0 0-8.94 5.51l3.35 2.59C7.2 7.74 9.4 5.98 12 5.98Z" />
    </svg>
  );
  const Avatar = ({ account, size = 36 }) => (
    <span style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, background: account.hue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.round(size * 0.42), fontWeight: 500, fontFamily: T.font }}>{account.name[0]}</span>
  );

  window.SiteKit = { T, SPARK, Shell, Mark, Eyebrow, Title, Em, Lede, Opts, Opt, Solid, Link, Alt, Legal, U, Arrow, GoogleG, Avatar };
})();
