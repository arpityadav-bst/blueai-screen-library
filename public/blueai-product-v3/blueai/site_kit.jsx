// BlueAI: bluestacks.ai's own page language, as primitives for the pages the app's Sign in opens
// in the browser (ROB-21388). Exports: window.SiteKit
//
// Transcribed from the live site's source (the vesper experiment's gate, light theme), not
// eyeballed from a screenshot: Inter for everything, Instrument Serif italic for the one <em>
// word in a title, an 11px letter-spaced eyebrow between two hairlines, the 38px spark mark,
// outline "door" buttons at radius 6 (the site's solid black commit button is the kit primary,
// .v2-button--primary, where a page needs one), and underlined inline links. Sizes are the site's own at this window's width,
// so the title is 40px here where the hero's is 64.

(function () {
  // The site's values, read from the Target tokens they equal (review round 1).
  const T = {
    font: 'var(--v2-font-ui)', serif: 'var(--v2-font-serif)',
    bg: 'var(--v2-surface-sunken)', card: 'var(--v2-surface-panel)',
    ink: 'var(--v2-ink)', ledeInk: 'var(--v2-ink-2)', muted: 'var(--v2-ink-3)', dim: 'var(--v2-ink-4)',
    border: 'var(--v2-line-strong)', borderHover: 'var(--v2-line-hover)', rule: 'var(--v2-link-underline)', hover: 'var(--v2-wash-hover)',
    underline: 'var(--v2-link-underline)', blue: 'var(--v2-blue)'
  };
  const hover = (on, off) => ({ onMouseEnter: (e) => Object.assign(e.currentTarget.style, on), onMouseLeave: (e) => Object.assign(e.currentTarget.style, off) });

  // The page: the site's pale ground with the soft blur its gate shows over it, content centred.
  const Shell = ({ children }) => (
    <div style={{ position: 'absolute', inset: 0, overflow: 'auto', fontFamily: T.font, color: T.ink, background: 'radial-gradient(420px 300px at 12% 30%, rgba(21,110,254,0.07), transparent 60%), radial-gradient(360px 260px at 85% 18%, rgba(0,0,0,0.045), transparent 60%), radial-gradient(520px 320px at 50% 105%, rgba(0,0,0,0.035), transparent 60%), ' + T.bg }}>
      <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '28px 40px' }}>
        {children}
      </div>
    </div>
  );
  // The spark: the product logo's own mark and glow (logo.jsx), at the site's 32.
  const Mark = () => <window.BlueAILogo wordmark={false} mark={32} label="" style={{ marginBottom: 14 }} />;
  const Eyebrow = ({ children }) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, color: T.dim, fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', whiteSpace: 'nowrap', marginBottom: 14 }}>
      <i style={{ display: 'block', width: 60, height: 1, background: 'linear-gradient(90deg, transparent, ' + T.rule + ')' }} />
      {children}
      <i style={{ display: 'block', width: 60, height: 1, background: 'linear-gradient(90deg, ' + T.rule + ', transparent)' }} />
    </span>
  );
  const Title = ({ children }) => <h1 style={{ fontSize: 40, fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.04em', color: T.ink }}>{children}</h1>;
  const Em = ({ children }) => <em style={{ fontFamily: T.serif, fontStyle: 'italic', fontWeight: 400, fontSize: '1.06em', letterSpacing: '-0.03em', color: T.blue, textShadow: 'var(--v2-em-glow)' }}>{children}</em>;
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
    <span className={'v2-avatar--hue-' + account.hue} style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.round(size * 0.42), fontWeight: 500, fontFamily: T.font }}>{account.name[0]}</span>
  );

  window.SiteKit = { T, Shell, Mark, Eyebrow, Title, Em, Lede, Opts, Opt, Link, Alt, Legal, U, Arrow, GoogleG, Avatar };
})();
