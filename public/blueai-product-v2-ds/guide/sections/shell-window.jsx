/* Section 29: Window and app frame (shell slice). Parts: AppFrame (Changed), Window semantics and
   tray (New). Kit: kit/shell.jsx. Refs: guide/refs/shell.js. */
(function () {
  const G = window.V2Guide;
  const W = 419, H = 830, H_COMPACT = 640;

  // A specimen drawn at true size and scaled down, so a whole window fits a guide column.
  function Shot({ scale, w, h, children }) {
    return (
      <div style={{ width: w * scale, height: h * scale, overflow: 'hidden', flex: 'none', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-sm)', boxSizing: 'content-box' }}>
        <div style={{ width: w, height: h, transform: 'scale(' + scale + ')', transformOrigin: '0 0' }}>{children}</div>
      </div>
    );
  }
  function Block({ h, label }) {
    return (
      <div style={{ height: h, display: 'flex', alignItems: 'flex-end', padding: 'var(--v2-space-3) var(--v2-space-4)', background: 'var(--v2-surface)', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-lg)', color: 'var(--v2-ink-3)', fontSize: 'var(--v2-text-12)' }}>{label}</div>
    );
  }
  function Body({ signedOut }) {
    if (signedOut) {
      return <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--v2-ink-3)', fontSize: 'var(--v2-text-13)' }}>Welcome (section 67): no top bar, no nav</div>;
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)', padding: 'var(--v2-space-4) var(--v2-gutter) var(--v2-space-6)' }}>
        <Block h={72} label="Program strip" />
        <Block h={200} label="Worker card" />
        <Block h={180} label="Today" />
        <Block h={280} label="The content band scrolls; the bars stay pinned" />
      </div>
    );
  }
  function Frame({ compact, signedOut, scale }) {
    const K = window.V2Kit;
    const top = signedOut ? null : <K.TopBar signedIn status="scheduled" statusLabel="Next run 11 am" credits={2000} />;
    const nav = signedOut ? null : <K.BottomNav value="home" />;
    return (
      <Shot scale={scale} w={W} h={compact ? H_COMPACT : H}>
        <K.AppFrame compact={compact} landmark={false} topBar={top} nav={nav}><Body signedOut={signedOut} /></K.AppFrame>
      </Shot>
    );
  }

  function Tray(props) {
    const K = window.V2Kit;
    return <K.TrayMenu {...props} />;
  }

  // Window behaviours: V2 today against the system. V2 cells cite their refs.
  const BEHAVIOUR = [
    ['Close (the window ✕)', 'The whole app unmounts: nothing runs and nothing can notify.', ['shell.frame.close'], 'Hides to the tray; the worker keeps its schedule. The first time only, a Windows notification says so (proposed copy): "BlueAI is still running. Your next run is at 11 am."'],
    ['Minimize', 'Decorative: no handler.', ['shell.frame.decorative'], 'Minimizes to the taskbar; the running dash stays under the icon.'],
    ['Reopen (taskbar, tray, notification)', 'A cold start every time: the splash replays and the chat resets.', ['shell.frame.cold-start', 'shell.splash.every-open'], 'Restores the last screen at once, no splash. The Worker record and navigation outlive the window (P1).'],
    ['Tray icon', 'None.', null, 'Click opens BlueAI. Right-click opens the tray menu: status line, Open BlueAI, Skip today’s run (only while today’s run is still to come) or Resume runs (while paused), Quit BlueAI.'],
    ['Skip today’s run', 'None, though setup promises it.', ['shell.frame.promise'], 'Offered only while today’s run is still to come (scheduled, or it didn’t start). Asks first and says the cost: "Today won’t count toward your 20 days. Runs start again tomorrow." Pausing runs for days lives in Settings > Worker, with an end date; while paused the tray offers Resume runs.'],
    ['Quit BlueAI', 'None.', null, 'The only action that stops runs. Asks first and says what it costs today; no question when runs are paused.'],
    ['PC restarts', 'Not modelled.', null, 'BlueAI starts with Windows into the tray, without opening the window, so tomorrow’s run still happens (proposed; a switch in Settings > Worker).'],
    ['Sign out', 'Logout confirm returns to chat; the partner stays signed in.', ['shell.topbar.logout-noop'], 'Signs out and pauses the worker, and says so in the confirm (Account, section 64).'],
  ];
  function BehaviourTable() {
    return (
      <div className="g-table-wrap">
        <table className="g-table">
          <thead><tr><th scope="col">Event</th><th scope="col">V2 today</th><th scope="col">System</th></tr></thead>
          <tbody>
            {BEHAVIOUR.map(function (r) {
              return (
                <tr key={r[0]}>
                  <td>{r[0]}</td>
                  <td>{r[1]}{r[2] ? <div style={{ marginTop: 'var(--v2-space-1)' }}><G.RefCell refs={r[2]} /></div> : null}</td>
                  <td>{r[3]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  function WindowSection() {
    return (
      <G.Section id="window">
        <G.Part name="AppFrame" status="changed" role="The window's content box: top bar, one scrolling band, bottom nav, and the plane every overlay sits on.">
          <ul className="g-list">
            <li><strong>Top bar</strong>, 52 tall, pinned (section 30).</li>
            <li><strong>Content band</strong>, the only part that scrolls. Screens put their ScreenHeader and body here.</li>
            <li><strong>Bottom nav</strong>, 56 tall, pinned (section 31).</li>
            <li><strong>Overlay plane</strong>, the frame itself: dialogs, sheets, toasts and the splash position against it and never escape the window.</li>
          </ul>
          <G.StateGrid wide states={[
            { label: 'Full, 830 tall', note: 'content band 722', node: <Frame scale={0.5} /> },
            { label: 'Compact, 640 tall', note: 'content band 532 scrolls; top bar and nav stay pinned', node: <Frame compact scale={0.5} /> },
            { label: 'Signed out', note: 'chrome-free: no top bar, no nav', node: <Frame signedOut scale={0.5} /> },
          ]} />
          <div className="g-table-wrap">
            <table className="g-table">
              <thead><tr><th scope="col">Band</th><th scope="col">Full window</th><th scope="col">Compact window</th></tr></thead>
              <tbody>
                <tr><td>Top bar</td><td>52</td><td>52</td></tr>
                <tr><td>Content band (scrolls)</td><td>722</td><td>532</td></tr>
                <tr><td>Bottom nav</td><td>56</td><td>56</td></tr>
                <tr><td>Content box</td><td>419 x 830</td><td>419 x 640</td></tr>
              </tbody>
            </table>
          </div>
          <G.Note>The window opens at the content box plus the 34px Windows caption, capped to the screen's work area. On a 1366 x 768 laptop (about 720px usable) that is the compact frame; the window resizes in height only, never below 640.</G.Note>
          <G.CompareRow
            v2={<G.FrameState url="index.html?start=worker" label="V2 window, signed in (421 x 866 on the desktop scene)" height={900} />}
            system={<Frame scale={0.5} />}
            changed="V2's window is a fixed 866 tall, which does not fit a 1366 x 768 laptop or a 1080p screen at 125% scaling; the scene's auto-scale hides that. The system adds a compact 640 frame where only the content band scrolls. The chat column was 420 wide inside a 419 box; every band is now the box's width. The ground moves from slate #f8fafc to the site's canvas." />
          <G.SpecDrawer rows={[
            { part: 'Content box width', token: '--v2-shell-w', value: '419px', ref: ['shell.frame.content-box', 'shell.frame.chat-width'] },
            { part: 'Content box height', token: '--v2-shell-h', value: '830px', ref: 'shell.frame.win-size' },
            { part: 'Compact height', token: '--v2-shell-min-h', value: '640px' },
            { part: 'Ground', token: '--v2-canvas', value: '#fafbfb', ref: 'shell.frame.canvas' },
            { part: 'Top bar band', token: '--v2-topbar-h', value: '52px', ref: 'shell.topbar.bar' },
            { part: 'Nav band', token: '--v2-nav-h', value: '56px', ref: 'shell.nav.bar' },
            { part: 'Screen gutter', token: '--v2-gutter', value: '16px', ref: 'shell.frame.tab-gutter' },
            { part: 'Overlay plane', token: 'isolation: isolate', value: 'every overlay scoped to the frame', ref: 'shell.frame.overlay-plane' },
            { part: 'Windows caption (scene)', token: '--v2-titlebar-h', value: '34px', ref: 'shell.frame.titlebar' },
            { part: 'Window corner (scene)', token: 'none (scene)', value: '10px, OS chrome', ref: 'shell.frame.win-radius' },
            { part: 'Signed out', token: 'no topBar, no nav', value: 'chrome-free', ref: 'shell.frame.chrome-free' },
          ]} />
          <G.DoDont
            do={['Put every screen inside AppFrame and let its content band scroll.', 'Mount dialogs, sheets, toasts and the splash in overlays so they stay inside the window.', 'Design every screen for the compact 640 frame too.']}
            dont={['Use vh units inside the window: they measure the browser, not the frame.', 'Scroll the top bar or the nav away.', 'Give a band its own width; the box is 419.']} />
        </G.Part>

        <G.Part name="Window semantics and tray" status="new" role="What the window does when it is closed, minimized or quit, so a worker that runs unattended keeps running and can still reach the partner.">
          <G.Note><strong>Why the product needs it.</strong> BlueAI earns the partner a day by running on its own once a day. In V2 the window's ✕ unmounts the whole app, so nothing can run or raise a notification while it is closed, and Minimize does nothing. A daily worker has to outlive its window, and the partner needs one obvious place to see it, skip a day or quit it.</G.Note>
          <G.StateGrid wide states={[
            { label: 'Tray menu: scheduled', node: <Tray runStatus="scheduled" /> },
            { label: 'Tray menu: running', node: <Tray runStatus="running" /> },
            { label: 'Tray menu: done today', node: <Tray runStatus="done" statusLabel="Day 7 of 20, pending verification" /> },
            { label: 'Tray menu: paused', node: <Tray runStatus="paused" /> },
            { label: 'Skip asks first (today not run yet)', node: <Tray runStatus="scheduled" confirm="skip" /> },
            { label: 'Quit warns: today’s run will not happen', node: <Tray runStatus="running" confirm="quit" /> },
            { label: 'Quit after today is done', node: <Tray runStatus="done" confirm="quit" /> },
          ]} />
          <BehaviourTable />
          <G.SpecDrawer title="Tray menu spec" rows={[
            { part: 'Surface', token: '--v2-surface, --v2-line, --v2-shadow-1', value: 'white, 1px line, menu cast' },
            { part: 'Width', token: '--v2-dialog-sm', value: '320px (Windows sizes the real menu)' },
            { part: 'Corner', token: '--v2-radius-md', value: '10px' },
            { part: 'Item', token: '--v2-hit-min, --v2-radius-sm', value: '32 tall, 6 radius, 13/400 ink-2' },
            { part: 'Status line', token: '--v2-text-12, --v2-ink-3', value: 'dot in the status tone + words' },
            { part: 'Confirm', token: 'Button sm secondary + primary (Skip) / danger (Quit)', value: 'title 14/600, body 13 ink-3; confirm null | skip | quit' },
            { part: 'runStatus', token: 'RUN_STATUS (section 30)', value: 'any chip status; done reads as pending. The line uses the tray words unless statusLabel is passed' },
          ]} />
          <G.DoDont
            do={['Say the cost of Skip and Quit before the click, in the confirm.', 'Keep the status line in the tray the same words as the top bar chip.', 'Restore the last screen when the window comes back.']}
            dont={['Stop runs when the window closes.', 'Replay the splash on every reopen.', 'Hide Quit; it is the honest way to stop everything.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('window', WindowSection);
})();
