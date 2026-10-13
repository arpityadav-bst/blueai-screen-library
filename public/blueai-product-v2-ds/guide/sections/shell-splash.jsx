/* Section 33: Splash and cold start (shell slice). Part: Splash (Changed). Kit: kit/splash.jsx.
   Refs: guide/refs/shell.js. */
(function () {
  const G = window.V2Guide;
  const { useState } = React;

  const BOX = { position: 'relative', width: 240, height: 300, overflow: 'hidden', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-sm)', background: 'var(--v2-canvas)' };
  // What sits under the splash: the home the partner lands on.
  function Under() {
    return <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--v2-ink-3)', fontSize: 'var(--v2-text-13)' }}>Home</div>;
  }
  function Box({ children }) {
    return <div style={BOX}><Under />{children}</div>;
  }
  function Replay({ render }) {
    const [k, setK] = useState(0);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-2)', alignItems: 'flex-start' }}>
        <Box key={k}>{render()}</Box>
        <button type="button" className="g-btn" onClick={function () { setK(k + 1); }}>Replay</button>
      </div>
    );
  }

  const TIMELINE = [
    ['First message', '0 ms: "Starting BlueAI…"', ['shell.splash.msg1'], '0 ms: "Starting BlueAI…" (kept)'],
    ['Second message', '1050 ms: "Loading your skills…", a hidden feature', ['shell.splash.msg-time', 'shell.splash.msg2'], '600 ms: "Checking today’s run…" (proposed), signed in only'],
    ['Fade', 'from 2150 ms, 500 ms ease', ['shell.splash.fade-time', 'shell.splash.fade'], 'from 900 ms, 320 ms ease-in (--v2-dur-4)'],
    ['Content', '2650 ms, then the skeleton for 850 ms: about 3.5 s', ['shell.splash.done-time', 'shell.splash.skeleton'], 'about 1.2 s; the worker-home skeleton only while the record loads'],
    ['When', 'on every window open', ['shell.splash.every-open'], 'on a true cold start only; reopening restores the last screen at once'],
    ['Reduced motion', 'dots bounce forever, no rule', ['shell.splash.bounce'], 'static dots, no fade, done at 900 ms'],
  ];

  function SplashSection() {
    const K = window.V2Kit;
    return (
      <G.Section id="splash">
        <G.Part name="Splash" status="changed" role="A short branded launch on a true cold start, in worker-true words, gone in about a second.">
          <G.StateGrid wide states={[
            { label: 'Message 1', note: '0 ms', node: <Box><K.Splash state="message-1" /></Box> },
            { label: 'Message 2', note: '600 ms, signed in only', node: <Box><K.Splash state="message-2" /></Box> },
            { label: 'Fading', note: 'shown half-way; 320 ms to the home', node: <Box><div style={{ position: 'absolute', inset: 0, opacity: 0.5 }}><K.Splash state="message-2" /></div></Box> },
            { label: 'Reduced motion', note: 'static dots, no fade', node: <Box><K.Splash state="message-1" reduced /></Box> },
          ]} />
          <G.CompareRow
            v2={<Replay render={function () { return <G.Live get={function () { return window.BootSplash; }} props={{ onDone: function () {} }} label="V2 BootSplash" />; }} />}
            system={<Replay render={function () { return <K.Splash />; }} />}
            changed="V2's splash says 'Loading your skills…', naming a feature the partner never sees, puts its status in #94a3b8 (2.56:1), bounces its dots with no reduced-motion rule, and replays for about 3.5 s every time the window opens. The system keeps the first line, says what the app is really doing, uses ink-3 (6.0:1), pulses blue dots that stop under reduced motion, and shows only on a true cold start." />
          <div className="g-table-wrap">
            <table className="g-table">
              <thead><tr><th scope="col">Moment</th><th scope="col">V2 today</th><th scope="col">System</th></tr></thead>
              <tbody>
                {TIMELINE.map(function (r) {
                  return <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}<div style={{ marginTop: 'var(--v2-space-1)' }}><G.RefCell refs={r[2]} /></div></td><td>{r[3]}</td></tr>;
                })}
              </tbody>
            </table>
          </div>
          <G.SpecDrawer rows={[
            { part: 'Ground', token: '--v2-surface', value: '#ffffff, fills the frame' },
            { part: 'Layer', token: '--v2-z-splash', value: '200, above every overlay', ref: 'shell.splash.z' },
            { part: 'Logo', token: 'BrandMark 48', value: '48px', ref: 'shell.splash.logo' },
            { part: 'Wordmark', token: '--v2-text-24, --v2-gradient-brand', value: '24/600, -0.02em, brand gradient', ref: 'shell.splash.wordmark' },
            { part: 'Dots', token: '--v2-blue, --v2-dur-pulse', value: 'three 6px blue dots, v2-pulse 1200 ms, staggered', ref: ['shell.splash.dot-colors', 'shell.splash.bounce'] },
            { part: 'Status line', token: '--v2-text-13, --v2-ink-3', value: '13/400, 6.0:1, role status', ref: 'shell.splash.status' },
            { part: 'Fade', token: '--v2-dur-4, --v2-ease-in', value: '320 ms', ref: 'shell.splash.fade' },
          ]} />
          <G.DoDont
            do={['Show it only when the app process starts.', 'Hand over to the worker-home skeleton if the record is still loading.']}
            dont={['Replay it when the window reopens.', 'Name features or versions in the status line.', 'Loop the dots under reduced motion.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('splash', SplashSection);
})();
