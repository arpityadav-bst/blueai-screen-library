/* Section 05 Space and layout (foundations slice). The 4px scale, the one gutter, the window's
   vertical budget (full and compact), and the layout utilities in kit/base.css. */
(function () {
  const G = window.V2Guide;
  const SCALE = [
    ['--v2-space-05', 'hairline gaps: day-bar segments, track padding'],
    ['--v2-space-1', 'icon to text in chips'],
    ['--v2-space-15', 'tight stacks'],
    ['--v2-space-2', 'row gaps, button icon gap'],
    ['--v2-space-3', 'card stack gap, chip row gap'],
    ['--v2-space-4', 'card padding and the screen gutter'],
    ['--v2-space-5', 'dialog padding'],
    ['--v2-space-6', 'section gap, sheet padding'],
    ['--v2-space-8', 'empty-state padding'],
    ['--v2-space-10', 'large empty-state padding'],
  ];
  const UTIL = [
    ['.v2-stack', 'column, gap 12; add .v2-gap-0..6 to change the gap'],
    ['.v2-hstack', 'row, centred, gap 8; --top, --baseline, --between, --end; .v2-wrap'],
    ['.v2-grow', 'takes the remaining width, can shrink (min-width 0)'],
    ['.v2-screen', 'fills the content band, canvas ground'],
    ['.v2-screen-body', 'the only scroller: gutter 16, top 16, bottom 24, gap 12'],
    ['.v2-divider', '1px hair line between blocks in a card'],
    ['.v2-sr-only', 'text for screen readers only'],
    ['.v2-tabular / .v2-truncate', 'tabular figures / one line with an ellipsis'],
    ['.v2-prose', 'running text with list markers (the AskCard body)'],
    ['.v2-root', 'the kit root: Inter, 14/1.5, ink-2 on canvas'],
  ];
  const tile = { background: 'var(--v2-surface)', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-md)', padding: 'var(--v2-space-2) var(--v2-space-3)' };
  const S = 0.42;
  function band(h, label, bg, extra) {
    return <div style={Object.assign({ height: 'calc(' + h + ' * ' + S + ')', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: 'var(--v2-stroke) solid var(--v2-line)' }, extra || {})}><span className="v2-text-meta">{label}</span></div>;
  }
  function Window({ compact }) {
    const h = compact ? 'var(--v2-shell-min-h)' : 'var(--v2-shell-h)';
    const content = compact ? '532 content, scrolls' : '722 content';
    return (
      <div className="v2-stack v2-gap-1" style={{ alignItems: 'center' }}>
        <div style={{ width: 'calc(var(--v2-shell-w) * ' + S + ')', border: 'var(--v2-stroke) solid var(--v2-line-strong)', borderRadius: 'var(--v2-radius-sm)', overflow: 'hidden', background: 'var(--v2-canvas)' }}>
          {band('var(--v2-titlebar-h)', '34 titlebar (scene)', 'var(--v2-surface-sunken)')}
          <div style={{ height: 'calc(' + h + ' * ' + S + ')', display: 'flex', flexDirection: 'column' }}>
            {band('var(--v2-topbar-h)', '52 top bar', 'var(--v2-surface)')}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: compact ? 'var(--v2-blue-tint)' : 'var(--v2-canvas)', borderBottom: 'var(--v2-stroke) solid var(--v2-line)' }}><span className="v2-text-meta">{content}</span></div>
            <div style={{ height: 'calc(var(--v2-nav-h) * ' + S + ')', background: 'var(--v2-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="v2-text-meta">56 nav</span></div>
          </div>
        </div>
        <span className="v2-text-meta v2-tabular">{compact ? '419 x 640 compact' : '419 x 830 full'}</span>
      </div>
    );
  }

  function SpaceSection() {
    return (
      <G.Section id="space-layout">
        <G.Part name="Space scale" status="changed" role="A 4px scale with one 2px step, one 16px gutter and one card padding; the same token sits on both sides of anything it separates.">
          <div className="v2-stack v2-gap-2">
            {SCALE.map(function (s) {
              const v = G.tokenValue(s[0]);
              return (
                <div key={s[0]} className="v2-hstack v2-gap-3">
                  <code className="g-code" style={{ width: 120, flex: 'none' }}>{s[0]}</code>
                  <span className="v2-text-meta v2-tabular" style={{ width: 36, flex: 'none' }}>{v}</span>
                  <span aria-hidden="true" style={{ width: 'var(' + s[0] + ')', height: 12, flex: 'none', background: 'var(--v2-blue)', borderRadius: 'var(--v2-radius-xs)' }} />
                  <span className="v2-text-body-sm">{s[1]}</span>
                </div>
              );
            })}
          </div>
          <G.Stage width="shell" ground="canvas">
            <div className="v2-stack">
              <div style={Object.assign({}, tile, { padding: 'var(--v2-space-4)', borderRadius: 'var(--v2-radius-lg)' })} className="v2-stack v2-gap-1">
                <span className="v2-text-title">Card padding 16</span>
                <span className="v2-text-body-sm">The window gutter and the card padding are the same token, so text lines up down the screen.</span>
              </div>
              <div className="v2-hstack v2-hstack--between" style={tile}><span className="v2-text-label">.v2-hstack--between</span><span className="v2-text-meta">gap 8</span></div>
              <hr className="v2-divider" />
              <div className="v2-hstack v2-gap-2"><span style={tile} className="v2-text-label">.v2-grow</span><span style={Object.assign({}, tile, { flex: 1 })} className="v2-text-meta">fills the rest</span></div>
            </div>
          </G.Stage>
          <div className="g-table-wrap">
            <table className="g-table">
              <thead><tr><th scope="col">Utility (kit/base.css)</th><th scope="col">What it does</th></tr></thead>
              <tbody>{UTIL.map(function (u) { return <tr key={u[0]}><td><code className="g-code">{u[0]}</code></td><td>{u[1]}</td></tr>; })}</tbody>
            </table>
          </div>
          <G.CompareRow
            v2={<div className="v2-stack"><G.Live get={function () { return window.ChatBubbles && window.ChatBubbles.UserBubble; }} props={{ content: (window.MoneyMaker && window.MoneyMaker.PROMPT) || 'Run this to begin' }} label="ChatBubbles.UserBubble" /><G.Live get={function () { return window.WorkerDayDone && window.WorkerDayDone.EarningsStrip; }} label="WorkerDayDone.EarningsStrip" /></div>}
            system={<div className="v2-stack">
              <div style={{ alignSelf: 'flex-end', maxWidth: 'var(--v2-bubble-max)', background: 'var(--v2-blue-tint)', borderRadius: 'var(--v2-radius-lg)', padding: 'var(--v2-space-3) var(--v2-space-4)' }} className="v2-text-body">{(window.MoneyMaker && window.MoneyMaker.PROMPT) || 'Run this to begin'}</div>
              <div style={Object.assign({}, tile, { padding: 'var(--v2-space-4)', borderRadius: 'var(--v2-radius-lg)' })} className="v2-hstack v2-hstack--between"><span className="v2-text-label" style={{ color: 'var(--v2-ink)' }}>Day 7 of 20</span><span className="v2-text-label" style={{ color: 'var(--v2-ink)' }}>13 to go</span></div>
            </div>}
            changed="59% of V2's 927 spacing values sit off the 4px grid and card padding alone has eight recipes ('11px 14px 8px', '12px 15px 11px', 16, 18 on the same settings screen). Every bubble pads 12 by 16, every card 16, every screen gutter 16." />
          <G.SpecDrawer rows={[
            { part: 'Bubble padding', token: '--v2-space-3 / --v2-space-4', value: '12 16', ref: 'foundations.space.bubble-padding' },
            { part: 'Card padding', token: '--v2-space-4', value: '16', ref: ['foundations.space.strip-padding', 'foundations.space.card-18', 'foundations.space.card-16'] },
            { part: 'Screen gutter', token: '--v2-gutter', value: '16', ref: 'foundations.space.chat-gutter' },
            { part: 'Layout utilities', token: null, value: '.v2-stack, .v2-hstack, .v2-gap-*, .v2-screen, .v2-screen-body' },
          ]} />
        </G.Part>

        <G.Part name="Window budget" status="changed" role="Every screen is designed in a 419 x 830 content box with three bands; under 830 the content band scrolls and the bars stay pinned.">
          <G.StateGrid states={[
            { label: 'Full 830', note: 'top bar 52 + content 722 + nav 56', node: <Window /> },
            { label: 'Compact 640', note: 'a 1366 x 768 laptop: content scrolls', node: <Window compact /> },
          ]} />
          <G.Note>Overlays (dialogs, sheets, day done, the sign-in gate, the splash) cover the whole content box, not the browser: size them in % of the window or with the dialog tokens, never in vh. The titlebar belongs to the desktop scene, not the product.</G.Note>
          <G.CompareRow
            v2={<G.FrameState url="index.html?start=worker" label="V2 worker home in its 421 x 866 window" height={560} />}
            system={<div className="v2-hstack v2-gap-4" style={{ justifyContent: 'center' }}><Window /><Window compact /></div>}
            changed="The chat column is fixed at 420px inside a 419px box, modals size in vh (the browser, not the window), and the 866px window does not fit a 1366 x 768 laptop or 1080p at 125%. The content box is 419 wide by token, overlays size to the window, and a compact rule (640) keeps the composer and nav on screen." />
          <G.SpecDrawer rows={[
            { part: 'Content box', token: '--v2-shell-w / --v2-shell-h', value: '419 x 830', ref: ['foundations.shell.content-box', 'foundations.shell.window', 'foundations.shell.chat-width'] },
            { part: 'Compact height', token: '--v2-shell-min-h', value: '640' },
            { part: 'Titlebar (scene)', token: '--v2-titlebar-h', value: '34', ref: 'foundations.shell.titlebar' },
            { part: 'Top bar', token: '--v2-topbar-h', value: '52', ref: 'foundations.shell.topbar' },
            { part: 'Bottom nav', token: '--v2-nav-h', value: '56 (V2 64)', ref: 'foundations.shell.nav-height' },
            { part: 'Overlay sizing', token: '--v2-dialog-sm / --v2-dialog-md', value: '320 / 382, max-height in % of the window', ref: 'foundations.shell.vh' },
          ]} />
        </G.Part>
      </G.Section>
    );
  }
  G.register('space-layout', SpaceSection);
})();
