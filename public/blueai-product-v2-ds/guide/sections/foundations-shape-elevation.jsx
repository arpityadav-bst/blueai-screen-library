/* Section 06 Shape, stroke, elevation, layers (foundations slice). Radius ladder and strokes,
   three elevation levels, two scrims, the named z-scale. */
(function () {
  const G = window.V2Guide;
  const RADII = [
    ['--v2-radius-xs', '4', 'checkbox box, day-bar segment, tooltip arrow'],
    ['--v2-radius-sm', '6', 'buttons, fields, segmented items, menu rows, icon buttons'],
    ['--v2-radius-md', '10', 'rows, banners, composer, menus, tooltips'],
    ['--v2-radius-lg', '16', 'cards, bubbles, dialogs, sheet top corners'],
    ['--v2-radius-pill', 'pill', 'badges, quick-reply chips, credits chip, progress rail'],
    ['--v2-radius-round', 'round', 'avatars, discs, send button'],
  ];
  const Z = [
    ['--v2-z-raised', 'local lift inside a part'],
    ['--v2-z-sticky', 'sticky dialog or list header'],
    ['--v2-z-header', 'top bar'],
    ['--v2-z-popover', 'menus, popovers, tooltips'],
    ['--v2-z-dialog', 'every dialog and sheet, day done included (it opens as a Dialog); one dialog at a time; mount order only settles an unavoidable overlap'],
    ['--v2-z-gate', 'sign-in gate'],
    ['--v2-z-toast', 'in-app toast'],
    ['--v2-z-splash', 'boot splash'],
  ];
  const surf = { background: 'var(--v2-surface)', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-lg)', padding: 'var(--v2-space-4)' };
  function Elev({ level }) {
    const s = { 0: { boxShadow: 'var(--v2-shadow-0)' }, 1: { boxShadow: 'var(--v2-shadow-1)', borderRadius: 'var(--v2-radius-md)' }, 2: { boxShadow: 'var(--v2-shadow-2)' } }[level];
    const what = { 0: 'In flow: a 1px line, no shadow', 1: 'Floats over content: menu, popover, toast', 2: 'Blocks the window: dialog, sheet' }[level];
    return <div style={Object.assign({}, surf, s, { width: '100%' })}><div className="v2-text-label" style={{ color: 'var(--v2-ink)' }}>Level {level}</div><div className="v2-text-meta">{what}</div></div>;
  }
  function Veil({ frost }) {
    return (
      <div style={{ position: 'relative', width: '100%', height: 150, borderRadius: 'var(--v2-radius-md)', overflow: 'hidden', background: 'var(--v2-canvas)', border: 'var(--v2-stroke) solid var(--v2-line)' }}>
        <div className="v2-stack v2-gap-2" style={{ padding: 'var(--v2-space-3)' }}>
          <span className="v2-text-title">Home</span>
          <span className="v2-text-body-sm">Content under the veil</span>
          <span style={{ height: 24, borderRadius: 'var(--v2-radius-md)', background: 'var(--v2-blue-tint)' }} />
        </div>
        <div style={frost
          ? { position: 'absolute', inset: 0, background: 'var(--v2-scrim-frost)', backdropFilter: 'blur(var(--v2-scrim-blur))', WebkitBackdropFilter: 'blur(var(--v2-scrim-blur))' }
          : { position: 'absolute', inset: 0, background: 'var(--v2-scrim)' }} />
        <div style={{ position: 'absolute', left: '12%', right: '12%', top: '28%', background: 'var(--v2-surface)', borderRadius: 'var(--v2-radius-lg)', boxShadow: frost ? 'none' : 'var(--v2-shadow-2)', border: frost ? 'var(--v2-stroke) solid var(--v2-line)' : 0, padding: 'var(--v2-space-3)' }}>
          <span className="v2-text-label" style={{ color: 'var(--v2-ink)' }}>{frost ? 'Sign in' : 'Dialog'}</span>
        </div>
      </div>
    );
  }

  function ShapeSection() {
    const K = window.V2Kit || {};
    return (
      <G.Section id="shape-elevation">
        <G.Part name="Radius ladder" status="changed" role="Six radii, each with a job: 4 inner, 6 controls, 10 rows, 16 surfaces, pill, round. One button shape, the site's 6.">
          <div className="v2-hstack v2-wrap v2-gap-3">
            {RADII.map(function (r) {
              return (
                <div key={r[0]} className="v2-stack v2-gap-2" style={{ flex: '1 1 130px' }}>
                  <div style={{ height: 64, background: 'var(--v2-surface)', border: 'var(--v2-stroke-selected) solid var(--v2-blue)', borderRadius: 'var(' + r[0] + ')', width: r[1] === 'round' ? 64 : '100%' }} />
                  <code className="g-code">{r[0]}</code>
                  <span className="v2-text-meta">{r[1]}: {r[2]}</span>
                </div>
              );
            })}
          </div>
          <G.StateGrid states={[
            { label: 'Stroke 1px', note: '--v2-stroke: every edge', node: <div style={Object.assign({}, surf, { width: '100%' })} className="v2-text-label">Card</div> },
            { label: 'Stroke 1.5px', note: '--v2-stroke-selected: selected, focused composer, ring status dot, pending DayBar segment', node: <div style={Object.assign({}, surf, { width: '100%', border: 'var(--v2-stroke-selected) solid var(--v2-select-line)', background: 'var(--v2-select)' })} className="v2-text-label">Selected</div> },
          ]} />
          <G.Note>2px is mark geometry (tick and glyph strokes) and has no stroke token.</G.Note>
          <G.CompareRow
            v2={<div className="v2-stack"><G.Live get={function () { return window.TelegramCard; }} label="TelegramCard (settings.jsx)" /><G.Live get={function () { return window.AISettingsCard; }} label="AISettingsCard (settings.jsx)" /></div>}
            system={K.Button ? <div className="v2-stack" style={{ alignItems: 'flex-start' }}><K.Button variant="secondary">Connect Telegram</K.Button><K.Button variant="primary">Save settings</K.Button></div> : <span className="g-missing">Button is not loaded</span>}
            changed="Twenty radii in live code; buttons alone use 8, 9, 10, 20, 40 and 999, two of them on the same settings screen (Connect Telegram 20, Save settings 8). Six steps remain and every button is 6, the strongest single 'same family as the site' cue." />
          <G.SpecDrawer rows={[
            { part: 'Buttons, fields', token: '--v2-radius-sm', value: '6', ref: ['foundations.radius.save', 'foundations.radius.ai-mode', 'foundations.radius.telegram', 'foundations.blue.new-chat', 'foundations.radius.onblue-button'] },
            { part: 'Cards, bubbles, dialogs', token: '--v2-radius-lg', value: '16', ref: 'foundations.radius.onblue-card' },
            { part: 'Copy shown', token: null, value: "'Connect Telegram', 'Save settings'", ref: ['foundations.radius.telegram-copy', 'foundations.radius.save-copy'] },
          ]} />
        </G.Part>

        <G.Part name="Elevation" status="changed" role="Three levels with faint navy casts: in-flow things separate with a line; only what floats or blocks casts a shadow; no coloured glows.">
          <G.StateGrid states={[
            { label: '0', note: '--v2-shadow-0', node: <Elev level={0} /> },
            { label: '1', note: '--v2-shadow-1', node: <Elev level={1} /> },
            { label: '2', note: '--v2-shadow-2', node: <Elev level={2} /> },
          ]} />
          <G.CompareRow
            v2={<div className="v2-stack"><G.Live get={function () { return window.ChatBubbles && window.ChatBubbles.UserBubble; }} props={{ content: (window.MoneyMaker && window.MoneyMaker.PROMPT) || 'Run this to begin' }} label="ChatBubbles.UserBubble" /><G.Live get={function () { return window.BluestacksCard; }} label="BluestacksCard (settings.jsx)" /></div>}
            system={<div className="v2-stack"><div style={{ alignSelf: 'flex-end', maxWidth: 'var(--v2-bubble-max)', background: 'var(--v2-blue-tint)', borderRadius: 'var(--v2-radius-lg)', padding: 'var(--v2-space-3) var(--v2-space-4)' }} className="v2-text-body">{(window.MoneyMaker && window.MoneyMaker.PROMPT) || 'Run this to begin'}</div><div style={surf}><span className="v2-text-title">BlueStacks Instance</span></div></div>}
            changed="154 shadow declarations from 55 recipes, 15 of them coloured glows (the user bubble's indigo glow, the bottom nav casting upward, a 0.45 black cast on day done). Things in flow separate with a 1px line; menus and toasts get level 1; dialogs and sheets level 2." />
          <G.SpecDrawer rows={[
            { part: 'Cards, bubbles, nav', token: '--v2-shadow-0', value: 'none + 1px --v2-line', ref: ['foundations.shadow.card', 'foundations.shadow.bottom-nav', 'foundations.shadow.user-bubble'] },
            { part: 'Menus, popovers, toast', token: '--v2-shadow-1', value: '0 1px 2px rgba(18,32,64,0.04), 0 12px 32px -12px rgba(18,32,64,0.18)', ref: 'foundations.shadow.dropdown' },
            { part: 'Dialogs, sheets, day done', token: '--v2-shadow-2', value: '0 2px 6px rgba(18,32,64,0.06), 0 28px 64px -24px rgba(18,32,64,0.32)', ref: ['foundations.shadow.modal', 'foundations.shadow.day-done'] },
          ]} />
        </G.Part>

        <G.Part name="Scrims and layers" status="changed" role="Two veils (a dim one for every decision, the site's frosted gate for sign-in) and one named stack of layers inside the window.">
          <G.StateGrid wide states={[
            { label: 'Dim', note: '--v2-scrim: dialogs, sheets, day done', node: <Veil /> },
            { label: 'Frost', note: '--v2-scrim-frost + blur 14: sign-in gate only', node: <Veil frost /> },
          ]} />
          <div className="g-table-wrap">
            <table className="g-table">
              <thead><tr><th scope="col">Layer</th><th scope="col">z</th><th scope="col">Holds</th></tr></thead>
              <tbody>{Z.map(function (z) { return <tr key={z[0]}><td><code className="g-code">{z[0]}</code></td><td className="v2-tabular">{G.tokenValue(z[0])}</td><td>{z[1]}</td></tr>; })}</tbody>
            </table>
          </div>
          <G.CompareRow
            v2={<div style={{ position: 'relative', height: 280, overflow: 'hidden', borderRadius: 'var(--v2-radius-md)' }}><G.Live get={function () { return window.Profile && window.Profile.LogoutModal; }} props={{ isOpen: true, onCancel: function () {}, onConfirm: function () {} }} label="Profile.LogoutModal" /></div>}
            system={<Veil />}
            changed="Seven veil recipes for one idea (black 50%, slate 45% and 50%, navy 44%, 52%, 55%, white 55% with blur) and a z-index tie at 120 between the logout dialog and the terms sheet. One dim veil, the site's frost only where the site uses it (sign-in), and named layers; dialogs that share a layer stack by mount order." />
          <G.SpecDrawer rows={[
            { part: 'Dim veil', token: '--v2-scrim', value: 'rgba(11,18,32,0.48)', ref: ['foundations.scrim.modal', 'foundations.scrim.logout', 'foundations.scrim.byok', 'foundations.scrim.terms', 'foundations.scrim.day-done'] },
            { part: 'Sign-in gate', token: '--v2-scrim-frost / --v2-scrim-blur', value: 'rgba(248,249,251,0.88) / 14px', ref: ['foundations.scrim.login', 'foundations.scrim.onblue-gate'] },
            { part: 'Top bar', token: '--v2-z-header', value: '20', ref: 'foundations.z.topbar' },
            { part: 'Dialogs and sheets', token: '--v2-z-dialog', value: '100, day done included (V2 50 day done, 60, 120, 120, 130)', ref: ['foundations.scrim.modal', 'foundations.scrim.logout', 'foundations.scrim.terms', 'foundations.scrim.byok'] },
            { part: 'Splash', token: '--v2-z-splash', value: '200', ref: 'foundations.z.splash' },
            { part: 'Copy shown (V2)', token: null, value: "'Logout'", ref: 'foundations.type.title-logout' },
          ]} />
        </G.Part>
      </G.Section>
    );
  }
  G.register('shape-elevation', ShapeSection);
})();
