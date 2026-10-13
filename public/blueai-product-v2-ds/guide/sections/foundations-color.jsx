/* Section 03 Colour (foundations slice). Ink, surfaces and lines, blue, status, brand.
   Every value is read live from tokens.css; contrast is computed from the live values (WCAG 2.x).
   The contrast helpers are shared with section 09 as window.V2Foundations. */
(function () {
  const G = window.V2Guide;

  function parse(c) {
    const s = String(c || '').trim();
    let m = s.match(/^#([0-9a-f]{3,8})$/i);
    if (m) {
      let h = m[1];
      if (h.length < 6) h = h.split('').map(function (x) { return x + x; }).join('');
      return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1 };
    }
    m = s.match(/^rgba?\(([^)]+)\)$/i);
    if (m) {
      const p = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat);
      return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
    }
    return null;
  }
  function over(top, base) {
    const a = top.a;
    return { r: top.r * a + base.r * (1 - a), g: top.g * a + base.g * (1 - a), b: top.b * a + base.b * (1 - a), a: 1 };
  }
  function lum(c) {
    const f = function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  }
  function tok(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  function val(x) { return x && x.indexOf('--') === 0 ? tok(x) : x; }
  // fg over bg over base (base defaults to the surface white); each may be a token name or a colour.
  function ratio(fg, bg, base) {
    const B0 = parse(val(base || '--v2-surface'));
    const Bg = parse(val(bg));
    const F0 = parse(val(fg));
    if (!B0 || !Bg || !F0) return 0;
    const B = over(Bg, B0);
    const F = over(F0, B);
    const l1 = lum(F), l2 = lum(B);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }
  function fmt(r) { return r ? r.toFixed(2) + ':1' : 'n/a'; }
  function grade(r) { return r >= 4.5 ? 'AA' : (r >= 3 ? 'Large only' : 'Fails'); }
  function Ratio({ fg, bg, base }) {
    const r = ratio(fg, bg, base);
    const ink = r >= 4.5 ? 'var(--v2-success-ink)' : (r >= 3 ? 'var(--v2-attention-ink)' : 'var(--v2-danger-ink)');
    return <span className="v2-tabular" style={{ color: ink, fontSize: 'var(--v2-text-12)', fontWeight: 500, whiteSpace: 'nowrap' }}>{fmt(r)} {grade(r)}</span>;
  }
  window.V2Foundations = Object.assign(window.V2Foundations || {}, { parse: parse, ratio: ratio, fmt: fmt, grade: grade, tok: tok, Ratio: Ratio });

  const plate = { background: 'var(--v2-surface)', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-lg)', padding: 'var(--v2-space-4)' };
  const ground = function (g) { return { background: 'var(' + g + ')', padding: 'var(--v2-space-3)', borderRadius: 'var(--v2-radius-md)', width: '100%' }; };
  const acct = function () { const A = window.SignInPage && window.SignInPage.ACCOUNTS; return (A && A.other) || { name: 'Alex Rivera', email: 'alex@riveramedia.co', hue: 'var(--v2-ink)' }; };
  const INKS = [
    ['--v2-ink', 'Titles, figures, money (money is ink, never green)'],
    ['--v2-ink-2', 'Body copy, button and row labels'],
    ['--v2-ink-3', 'Descriptions, notes, idle icons, every consequence line'],
    ['--v2-ink-4', 'Meta only: timestamps, counts. Never on sunken, never a consequence'],
    ['--v2-ink-placeholder', 'Placeholder, only under a visible label (not text that must be read)'],
  ];

  function InkStack({ g }) {
    return (
      <div className="v2-stack v2-gap-1" style={ground(g)}>
        {INKS.slice(0, 4).map(function (i) {
          return <div key={i[0]} className="v2-hstack v2-hstack--between"><span style={{ color: 'var(' + i[0] + ')', fontSize: 'var(--v2-text-13)' }}>{i[0].replace('--v2-', '')}</span><Ratio fg={i[0]} bg={g} /></div>;
        })}
      </div>
    );
  }

  function Tone({ t, label }) {
    const K = window.V2Kit || {};
    const tint = t === 'neutral' ? '--v2-surface-sunken' : (t === 'info' ? '--v2-blue-tint' : '--v2-' + t + '-tint');
    const line = t === 'neutral' ? '--v2-line' : (t === 'info' ? '--v2-blue-tint-line' : '--v2-' + t + '-line');
    const ink = t === 'neutral' ? '--v2-ink-2' : (t === 'info' ? '--v2-blue-ink' : '--v2-' + t + '-ink');
    return (
      <div className="v2-stack v2-gap-2" style={{ width: '100%' }}>
        <div className="v2-hstack" style={{ background: 'var(' + tint + ')', border: 'var(--v2-stroke) solid var(' + line + ')', borderRadius: 'var(--v2-radius-md)', padding: 'var(--v2-space-2) var(--v2-space-3)', color: 'var(' + ink + ')' }}>
          {K.Icon ? <K.Icon name={{ neutral: 'info', info: 'info', success: 'check-double', attention: 'alert', danger: 'x-circle' }[t]} /> : null}
          <span style={{ fontSize: 'var(--v2-text-13)', fontWeight: 500 }}>{label}</span>
        </div>
        {K.Badge ? <K.Badge tone={t} dot>{label}</K.Badge> : null}
        <Ratio fg={ink} bg={tint} />
      </div>
    );
  }

  function ColorSection() {
    const K = window.V2Kit || {};
    const btn = function (cls, extra) { return K.Button ? <K.Button variant="primary" className={cls} {...(extra || {})}>Switch account</K.Button> : <span className="g-missing">Button is not loaded</span>; };
    return (
      <G.Section id="color">
        <G.Part name="Ink ramp" status="changed" role="One ink hue in four steps for all text and idle icons, plus placeholder and on-colour; each step clears 4.5:1 where it is allowed.">
          <div className="g-table-wrap">
            <table className="g-table">
              <thead><tr><th scope="col">Token</th><th scope="col">Sample</th><th scope="col">Role</th><th scope="col">On surface</th><th scope="col">On canvas</th></tr></thead>
              <tbody>
                {INKS.map(function (i) {
                  return (
                    <tr key={i[0]}>
                      <td><code className="g-code">{i[0]}</code> <code className="g-code g-muted">{tok(i[0])}</code></td>
                      <td style={{ color: 'var(' + i[0] + ')', fontSize: 'var(--v2-text-14)' }}>Aa 2,000</td>
                      <td>{i[1]}</td>
                      <td><Ratio fg={i[0]} bg="--v2-surface" /></td>
                      <td><Ratio fg={i[0]} bg="--v2-canvas" /></td>
                    </tr>
                  );
                })}
                <tr>
                  <td><code className="g-code">--v2-on-color</code></td>
                  <td><span style={{ background: 'var(--v2-action)', color: 'var(--v2-on-color)', padding: '2px 6px', borderRadius: 'var(--v2-radius-xs)' }}>Aa</span></td>
                  <td>Label on action, danger and ink fills</td>
                  <td><Ratio fg="--v2-on-color" bg="--v2-action" /></td>
                  <td><Ratio fg="--v2-on-color" bg="--v2-danger-ink" /> on danger</td>
                </tr>
              </tbody>
            </table>
          </div>
          <G.StateGrid wide states={[
            { label: 'On surface', note: 'cards, bubbles, bars', node: <InkStack g="--v2-surface" /> },
            { label: 'On canvas', note: 'the window ground', node: <InkStack g="--v2-canvas" /> },
            { label: 'On sunken', note: 'ink-4 fails here: use ink-3', node: <InkStack g="--v2-surface-sunken" /> },
          ]} />
          <G.CompareRow
            v2={<div className="v2-stack"><G.Live get={function () { return window.ChatBubbles && window.ChatBubbles.ThinkingBubble; }} label="ChatBubbles.ThinkingBubble" /><G.Live get={function () { return window.AccountGate && window.AccountGate.GateCard; }} props={{ account: acct(), onSwitch: function () {} }} label="AccountGate.GateCard" /></div>}
            system={<div className="v2-stack">
              <div style={plate}><p className="v2-text-meta">Working on it…</p></div>
              <div style={plate}><p className="v2-text-body-sm">App Player will be signed out too.</p></div>
            </div>}
            changed="Gray, slate, navy and a private ai_mode set (two Tailwind ramps split 178/178 uses) become one hue in four steps shared with the site. The faint #94a3b8 and #9ca3af (2.5:1) become ink-4 #6e737c (4.77:1) for meta, and a line that tells a consequence ('signed out too') moves up to ink-3 (6.03:1), because the faintest text was carrying the most important caveats." />
          <G.SpecDrawer rows={[
            { part: 'Titles, figures', token: '--v2-ink', value: '#0b0b0d (19.67:1)', ref: ['foundations.ink.title', 'foundations.ink.onblue-ink'] },
            { part: 'Body', token: '--v2-ink-2', value: '#3c4049 (10.39:1)', ref: 'foundations.ink.onblue-lede' },
            { part: 'Muted body', token: '--v2-ink-3', value: '#5f636b (6.03:1)', ref: ['foundations.ink.muted', 'foundations.ink.onblue-muted'] },
            { part: 'Meta', token: '--v2-ink-4', value: '#6e737c (4.77:1)', ref: ['foundations.ink.thinking', 'foundations.ink.gate-caveat', 'foundations.ink.ai-mode-faint', 'foundations.ink.dd-constants', 'foundations.ink.onblue-dim'] },
            { part: 'Placeholder', token: '--v2-ink-placeholder', value: '#9ca2ad (2.57:1, decorative only)', ref: 'foundations.ink.onblue-placeholder' },
            { part: 'Copy shown', token: null, value: "'Working on it…', 'App Player will be signed out too.'", ref: ['foundations.ink.thinking-copy', 'foundations.ink.gate-caveat'] },
          ]} />
        </G.Part>

        <G.Part name="Surfaces and lines" status="changed" role="Grounds a fraction of a percent apart, separated by 1px alpha-black lines that sit right on any near-white ground.">
          <div style={{ background: 'var(--v2-canvas)', padding: 'var(--v2-space-4)', borderRadius: 'var(--v2-radius-md)', border: 'var(--v2-stroke) solid var(--v2-line-hair)' }}>
            <div className="v2-text-eyebrow" style={{ marginBottom: 'var(--v2-space-2)' }}>canvas</div>
            <div style={plate}>
              <div className="v2-text-title">surface: card</div>
              <div style={{ marginTop: 'var(--v2-space-3)', background: 'var(--v2-surface-panel)', border: 'var(--v2-stroke) solid var(--v2-line-hair)', borderRadius: 'var(--v2-radius-md)', padding: 'var(--v2-space-3)' }}>
                <div className="v2-text-body-sm">surface-panel: an inset panel inside a card</div>
                <div style={{ marginTop: 'var(--v2-space-2)', background: 'var(--v2-surface)', border: 'var(--v2-stroke) solid var(--v2-line-hair)', borderRadius: 'var(--v2-radius-md)', padding: 'var(--v2-space-2) var(--v2-space-3)' }} className="v2-text-label">surface: rows go back to white</div>
              </div>
            </div>
          </div>
          <G.StateGrid states={[
            { label: 'Rest', node: <div style={Object.assign({}, plate, { padding: 'var(--v2-space-3)' })} className="v2-text-label">Row</div> },
            { label: 'Hover wash', note: '--v2-wash-hover over the fill', node: <div style={Object.assign({}, plate, { padding: 'var(--v2-space-3)', background: 'linear-gradient(var(--v2-wash-hover), var(--v2-wash-hover)), var(--v2-surface)' })} className="v2-text-label">Row</div> },
            { label: 'Pressed', note: '--v2-wash-press', node: <div style={Object.assign({}, plate, { padding: 'var(--v2-space-3)', background: 'linear-gradient(var(--v2-wash-press), var(--v2-wash-press)), var(--v2-surface)' })} className="v2-text-label">Row</div> },
            { label: 'Pressable card hover', note: 'line firms up to --v2-line-hover', node: <div style={Object.assign({}, plate, { padding: 'var(--v2-space-3)', borderColor: 'var(--v2-line-hover)' })} className="v2-text-label">Card</div> },
          ]} />
          <div className="v2-hstack v2-wrap v2-gap-3">
            {[['--v2-line', 'every card, bubble, bar edge'], ['--v2-line-strong', 'fields, secondary buttons'], ['--v2-line-hair', 'dividers inside a card'], ['--v2-line-hover', 'hover firm-up']].map(function (l) {
              return <div key={l[0]} style={{ flex: '1 1 160px', border: 'var(--v2-stroke) solid var(' + l[0] + ')', borderRadius: 'var(--v2-radius-md)', padding: 'var(--v2-space-3)', background: 'var(--v2-surface)' }}><code className="g-code">{l[0]}</code><div className="v2-text-meta">{tok(l[0])}: {l[1]}</div></div>;
            })}
          </div>
          <G.CompareRow
            v2={<G.Live get={function () { return window.BluestacksCard; }} label="BluestacksCard (settings.jsx)" />}
            system={<div style={plate}><div className="v2-text-title">BlueStacks Instance</div><p className="v2-text-body-sm" style={{ marginTop: 'var(--v2-space-1)' }}>Same card: white, 1px line, radius 16, no shadow.</p></div>}
            changed="Four hex greys for one job (#e2e8f0, #e5e7eb, #e8edf3, rgba(0,0,0,0.06)) and a shadow on every card become alpha-black lines that sit on any near-white ground, the site's main move. Five sunken greys become one; hover becomes a wash instead of an opacity drop that lowers contrast." />
          <G.SpecDrawer rows={[
            { part: 'Window ground', token: '--v2-canvas', value: '#fafbfb', ref: 'foundations.surface.canvas' },
            { part: 'Card edge', token: '--v2-line', value: 'rgba(0,0,0,0.10)', ref: ['foundations.line.topbar', 'foundations.shadow.card', 'foundations.line.onblue-soft'] },
            { part: 'Field edge', token: '--v2-line-strong', value: 'rgba(0,0,0,0.15)', ref: ['foundations.line.dropdown', 'foundations.line.onblue-border'] },
            { part: 'Sunken well', token: '--v2-surface-sunken', value: '#f6f6f8', ref: 'foundations.surface.onblue-bar' },
            { part: 'Copy shown', token: null, value: "'BlueStacks Instance'", ref: 'foundations.type.card-title' },
          ]} />
        </G.Part>

        <G.Part name="Action blue" status="changed" role="One blue hue in roles: brand blue for focus, selection and progress; a one-step-deeper action blue for filled buttons; a deeper ink for blue text.">
          <div className="v2-hstack v2-wrap v2-gap-4">
            <G.Swatch token="--v2-blue" label="Blue" note={<span>focus, selected, progress. White on it: <Ratio fg="--v2-on-color" bg="--v2-blue" /></span>} />
            <G.Swatch token="--v2-action" label="Action" note={<span>button fill. <Ratio fg="--v2-on-color" bg="--v2-action" /></span>} />
            <G.Swatch token="--v2-action-hover" label="Action hover" note={<Ratio fg="--v2-on-color" bg="--v2-action-hover" />} />
            <G.Swatch token="--v2-blue-ink" label="Blue ink" note={<span>blue text on tints: <Ratio fg="--v2-blue-ink" bg="--v2-blue-tint" /></span>} />
            <G.Swatch token="--v2-blue-tint" label="Tint" note="info notice, user bubble" />
            <G.Swatch token="--v2-select" label="Selected" note="chip, choice card, segmented on" />
          </div>
          <G.StateGrid states={[
            { label: 'Rest', node: btn() },
            { label: 'Hover', note: '--v2-action-hover', node: btn('is-hover') },
            { label: 'Focus', note: '2px --v2-blue outline', node: btn('is-focus') },
            { label: 'Disabled', note: 'with its reason', node: btn(null, { disabled: true, disabledReason: 'Sign in first' }) },
          ]} />
          <G.CompareRow
            v2={<G.Live get={function () { return window.AccountGate && window.AccountGate.GateCard; }} props={{ account: acct(), onSwitch: function () {} }} label="AccountGate.GateCard" />}
            system={btn()}
            changed="White on #1990FF is 3.24:1 on every primary button and link. #1268f0 passes (4.92:1) and sits one step from the site's #156efe, which itself computes 4.47:1, so brand blue stays for focus, selection and progress only. The indigo nav (#4f46e5 on #eef2ff) is retired: one accent." />
          <G.SpecDrawer rows={[
            { part: 'Focus, selected, progress', token: '--v2-blue', value: '#156efe', ref: ['foundations.blue.onblue-blue', 'foundations.blue.field-focus'] },
            { part: 'Button fill', token: '--v2-action', value: '#1268f0 (4.92:1)', ref: ['foundations.blue.tailwind-accent', 'foundations.blue.new-chat', 'foundations.blue.gate-button'] },
            { part: 'Button hover', token: '--v2-action-hover', value: '#0f5ad4 (6.12:1)', ref: 'foundations.blue.hover-opacity' },
            { part: 'Blue text', token: '--v2-blue-ink', value: '#0d5ad6 (6.09:1)', ref: ['foundations.blue.link-const', 'foundations.blue.link-text', 'foundations.blue.onblue-notice'] },
            { part: 'Second accent, retired', token: '--v2-select', value: 'rgba(21,110,254,0.12)', ref: 'foundations.blue.indigo-nav' },
            { part: 'Copy shown', token: null, value: "'Switch account'", ref: 'foundations.blue.gate-label' },
          ]} />
        </G.Part>

        <G.Part name="Status tones" status="changed" role="Five tones (neutral, info, success, attention, danger), each a tint, a line and an ink, read by every badge, banner, notice, tick and run card.">
          <G.StateGrid states={[
            { label: 'Neutral', note: 'paused, skipped', node: <Tone t="neutral" label="Paused" /> },
            { label: 'Info', note: 'pending verification', node: <Tone t="info" label="Pending" /> },
            { label: 'Success', note: 'reached, verified', node: <Tone t="success" label="Verified" /> },
            { label: 'Attention', note: 'the worker needs you', node: <Tone t="attention" label="Needs you" /> },
            { label: 'Danger', note: 'failed, out of credits', node: <Tone t="danger" label="Didn’t finish" /> },
          ]} />
          <G.CompareRow
            v2={<G.Live get={function () { return window.ChatBubbles && window.ChatBubbles.ChatStatesPreview; }} label="ChatBubbles.ChatStatesPreview" />}
            system={K.Banner ? <div className="v2-stack"><K.Banner tone="attention" title="Needs you">Answer in the chat to start today’s job.</K.Banner><K.Banner tone="danger" title="Out of credits">Today’s run can’t start.</K.Banner></div> : <span className="g-missing">Banner is not loaded</span>}
            changed="Four parallel status maps (FINAL_STYLES, TONES, JOB_STATUS, FB_TONES) with 13 greens and 14 reds become one table. Success and danger are copied from the site so a verified day looks the same on the dashboard. The PM's needs-input yellow is kept as attention. Orange heads-up folds into a neutral notice whose icon carries the colour. Green means reached, never money: money is ink." />
          <G.DoDont do={['Use success for a reached state: verified, done, connected.', 'Put money in ink: $6, 2,000 credits.', 'Let the icon carry tone on a neutral notice.']} dont={['Paint dollars green.', 'Use a warm colour for link text (#f59e0b is 2.15:1).', 'Invent a sixth tone for one screen.']} />
          <G.SpecDrawer rows={[
            { part: 'Success', token: '--v2-success / -ink / -tint / -line', value: '#16a34a / #15803d / 10% / 32%', ref: ['foundations.status.success-icon', 'foundations.status.active-badge', 'foundations.status.tones-green', 'foundations.status.fb-success', 'foundations.status.onblue-green', 'foundations.status.onblue-green-ink'] },
            { part: 'Danger', token: '--v2-danger-ink / -line / -tint', value: '#c03a40 / #d0454a / #fdecec', ref: ['foundations.status.final-fail', 'foundations.status.danger-banner', 'foundations.status.tones-red', 'foundations.status.job-failed', 'foundations.status.logout-red'] },
            { part: 'Attention', token: '--v2-attention-ink / -tint / -line', value: '#8a6116 / #fdf6cf / #f3e8a8', ref: ['foundations.status.final-needs', 'foundations.status.tones-amber'] },
            { part: 'Money in green, retired', token: '--v2-ink', value: '#0b0b0d', ref: ['foundations.status.green-const', 'foundations.status.money-green'] },
            { part: 'The four maps', token: null, value: 'FINAL_STYLES, TONES, JOB_STATUS, FB_TONES', ref: ['foundations.status.final-styles', 'foundations.status.final-success', 'foundations.status.tones', 'foundations.status.job-status', 'foundations.status.fb-tones'] },
          ]} />
        </G.Part>

        <G.Part name="Brand gradient" status="changed" role="Identity, not action: the gradient lives on the BlueAI mark and the credits glyph, nowhere else.">
          <G.StateGrid states={[
            { label: 'Mark', node: K.BrandMark ? <K.BrandMark /> : <span className="v2-text-title-lg" style={{ background: 'var(--v2-gradient-brand)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BlueAI</span> },
            { label: 'Credits glyph', note: '16 / 20 / 24', node: K.Icon ? <div className="v2-hstack v2-gap-3"><K.Icon name="credits" /><K.Icon name="credits" size={20} /><K.Icon name="credits" size={24} /></div> : null },
            { label: 'Credits figure', note: 'number in ink', node: <div className="v2-hstack v2-gap-1">{K.Icon ? <K.Icon name="credits" /> : null}<span className="v2-text-label v2-tabular" style={{ color: 'var(--v2-ink)' }}>2,000</span></div> },
          ]} />
          <G.CompareRow
            v2={<div className="v2-stack"><G.FrameState url="index.html?start=worker" label="V2 top bar: gradient wordmark, gradient ring, gradient number" height={520} /><G.Live get={function () { return window.ChatBubbles && window.ChatBubbles.UserBubble; }} props={{ content: (window.MoneyMaker && window.MoneyMaker.PROMPT) || 'Run this to begin' }} label="ChatBubbles.UserBubble" /></div>}
            system={<div className="v2-stack"><div className="v2-hstack v2-hstack--between" style={plate}>{K.BrandMark ? <K.BrandMark /> : null}<span className="v2-hstack v2-gap-1">{K.Icon ? <K.Icon name="credits" /> : null}<span className="v2-text-label v2-tabular" style={{ color: 'var(--v2-ink)' }}>2,000</span></span></div><div style={{ alignSelf: 'flex-end', maxWidth: 'var(--v2-bubble-max)', background: 'var(--v2-blue-tint)', border: 'var(--v2-stroke) solid var(--v2-blue-tint-line)', borderRadius: 'var(--v2-radius-lg)', padding: 'var(--v2-space-3) var(--v2-space-4)' }} className="v2-text-body">{(window.MoneyMaker && window.MoneyMaker.PROMPT) || 'Run this to begin'}</div></div>}
            changed="The gradient appears three times in one 419px top bar (wordmark, pill ring, pill number) and fills the user bubble with a cousin gradient and an indigo glow. Fenced to identity: the wordmark and the credits glyph keep it; rings, numbers, bubbles, buttons and borders lose it. The credits number turns ink." />
          <G.SpecDrawer rows={[
            { part: 'Wordmark, credits glyph', token: '--v2-gradient-brand', value: 'linear-gradient(90deg, #0EA4C5, #7B4CFF)', ref: ['foundations.brand.wordmark', 'foundations.brand.star-mask', 'foundations.icon.credits-asset'] },
            { part: 'Pill ring, retired', token: '--v2-line', value: 'rgba(0,0,0,0.10)', ref: 'foundations.brand.pill-ring' },
            { part: 'Credits number', token: '--v2-ink', value: '#0b0b0d, 13/500 tabular', ref: 'foundations.brand.pill-number' },
            { part: 'User bubble', token: '--v2-blue-tint', value: 'rgba(21,110,254,0.08) + tint line, no shadow', ref: ['foundations.brand.user-bubble', 'foundations.shadow.user-bubble'] },
          ]} />
        </G.Part>
      </G.Section>
    );
  }
  G.register('color', ColorSection);
})();
