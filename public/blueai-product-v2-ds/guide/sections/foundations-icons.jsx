/* Section 08 Icons (foundations slice). Every name in window.V2Kit.Icon, the three sizes, colour by
   inheritance, and V2's per-file glyphs beside the registry. */
(function () {
  const G = window.V2Guide;
  const cell = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--v2-space-2)', padding: 'var(--v2-space-3) var(--v2-space-2)', background: 'var(--v2-surface)', border: 'var(--v2-stroke) solid var(--v2-line-hair)', borderRadius: 'var(--v2-radius-md)', color: 'var(--v2-ink-2)' };
  const V2_GLYPHS = [
    ['IcoGear', function () { return window.IcoGear; }, 'settings'],
    ['IcoChatBubble', function () { return window.IcoChatBubble; }, 'chat'],
    ['IcoCalendar', function () { return window.IcoCalendar; }, 'calendar'],
    ['IcoHistory', function () { return window.IcoHistory; }, 'clock'],
    ['IcoXClose', function () { return window.IcoXClose; }, 'close'],
    ['IcoShieldCheck', function () { return window.AgentPermissions && window.AgentPermissions.IcoShieldCheck; }, 'shield-check'],
    ['IcoZap', function () { return window.AgentPermissions && window.AgentPermissions.IcoZap; }, 'zap'],
  ];

  function IconsSection() {
    const K = window.V2Kit || {};
    if (!K.Icon) return <G.Section id="icons"><div className="g-missing">kit/icons.jsx is not loaded.</div></G.Section>;
    const I = K.Icon;
    const planned = I.planned || [];
    return (
      <G.Section id="icons">
        <G.Part name="Icon set" status="changed" role="One registry, one name per meaning: 24-unit glyphs, round caps, a 1.75px stroke at 16, 20 and 24, coloured by the text around them.">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 'var(--v2-space-2)' }}>
            {I.names.map(function (n) {
              return (
                <div key={n} style={cell}>
                  <I name={n} size={20} />
                  <code className="g-code" style={{ fontSize: 'var(--v2-text-11)' }}>{n}</code>
                  {planned.indexOf(n) < 0 ? <span className="v2-text-meta">added</span> : null}
                </div>
              );
            })}
          </div>
          <G.StateGrid states={[16, 20, 24].map(function (s) {
            return { label: s + 'px', note: { 16: '--v2-icon-sm: inline, chips, menu rows', 20: '--v2-icon-md: top bar, nav, list rows', 24: '--v2-icon-lg: empty states, dialog marks' }[s], node: (
              <div className="v2-hstack v2-gap-3" style={{ color: 'var(--v2-ink-2)' }}>
                <I name="shield-check" size={s} /><I name="zap" size={s} /><I name="check-double" size={s} /><I name="spark" size={s} /><I name="credits" size={s} />
              </div>
            ) };
          })} />
          <G.StateGrid states={[
            { label: 'Idle', note: '--v2-ink-3', node: <span className="v2-hstack v2-gap-2" style={{ color: 'var(--v2-ink-3)' }}><I name="help" size={20} /><I name="more" size={20} /></span> },
            { label: 'Active', note: '--v2-ink (or --v2-blue for the lit nav item)', node: <span className="v2-hstack v2-gap-2"><span style={{ color: 'var(--v2-ink)' }}><I name="home" size={20} /></span><span style={{ color: 'var(--v2-blue)' }}><I name="activity" size={20} /></span></span> },
            { label: 'On a tint', note: 'tone ink', node: <span className="v2-hstack v2-gap-2"><span style={{ color: 'var(--v2-blue-ink)' }}><I name="info" /></span><span style={{ color: 'var(--v2-success-ink)' }}><I name="check-double" /></span><span style={{ color: 'var(--v2-attention-ink)' }}><I name="alert" /></span><span style={{ color: 'var(--v2-danger-ink)' }}><I name="x-circle" /></span></span> },
            { label: 'On a fill', note: '--v2-on-color', node: <span className="v2-hstack" style={{ justifyContent: 'center', width: 36, height: 36, borderRadius: 'var(--v2-radius-round)', background: 'var(--v2-action)', color: 'var(--v2-on-color)' }}><I name="send" /></span> },
          ]} />
          <G.Note>
            Use: <code className="g-code">{'<K.Icon name="check" />'}</code> is decorative and hidden from screen readers; next to no text, name it: <code className="g-code">{'<K.Icon name="help" size={20} label="Help" />'}</code> (an IconButton names its icon for you). Colour comes from the parent's <code className="g-code">color</code>. Modes keep V2's glyphs: shield-check is Always ask, zap is Automatic. spark (the site's mark) is the one filled glyph; credits is the one painted with the brand gradient. Aliases such as {Object.keys(I.aliases || {}).slice(0, 6).join(', ')} resolve to the registry name.
          </G.Note>
          <G.CompareRow
            v2={<div className="v2-hstack v2-wrap v2-gap-3" style={{ color: 'var(--v2-ink-3)' }}>{V2_GLYPHS.map(function (g) { return <span key={g[0]} title={g[0]}><G.Live get={g[1]} label={g[0]} /></span>; })}</div>}
            system={<div className="v2-hstack v2-wrap v2-gap-3" style={{ color: 'var(--v2-ink-3)' }}>{V2_GLYPHS.map(function (g) { return <I key={g[0]} name={g[2]} size={20} />; })}</div>}
            changed="V2 draws glyphs per file at 14 to 22px with 16 stroke widths (1.9 in the nav, 2 in menus and mode chips, 2.5 on close) and hard-coded hexes such as #64748b in the menu. One registry draws each meaning once at one stroke and takes its colour from the text, so a menu row, a nav item and a chip never disagree." />
          <G.SpecDrawer rows={[
            { part: 'Sizes', token: '--v2-icon-sm / -md / -lg', value: '16 / 20 / 24', ref: 'foundations.icon.nav-glyph' },
            { part: 'Stroke', token: '--v2-icon-stroke', value: '1.75px rendered at every size (2.625 / 2.1 / 1.75 grid units)', ref: ['foundations.icon.nav-stroke', 'foundations.icon.close-stroke', 'foundations.icon.perm-stroke'] },
            { part: 'Colour', token: 'currentColor', value: 'inherited, never set on the icon', ref: ['foundations.icon.clock-hex', 'foundations.icon.faq'] },
            { part: 'Always ask / Automatic', token: null, value: "shield-check / zap, V2's drawings", ref: ['foundations.icon.shield', 'foundations.icon.zap'] },
            { part: 'App marks', token: null, value: "youtube / instagram, V2's stroke drawings", ref: 'foundations.icon.youtube' },
            { part: 'Spark (filled)', token: null, value: "the site's spark", ref: 'foundations.icon.onblue-spark' },
            { part: 'Credits (painted)', token: '--v2-gradient-brand', value: "V2's star as a mask", ref: ['foundations.icon.credits-asset', 'foundations.brand.star-mask'] },
            { part: 'Helpers retired', token: null, value: 'ChatCatIcon, the per-file stroke() helper', ref: 'foundations.icon.chat-cat' },
          ]} />
        </G.Part>
      </G.Section>
    );
  }
  G.register('icons', IconsSection);
})();
