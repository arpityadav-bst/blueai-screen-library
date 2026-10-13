/* Section 07 Motion (foundations slice). Durations and curves with click-to-play tiles built on
   kit/motion.css, the reduced-motion rule with a toggle, and the choreography budgets. */
(function () {
  const { useState } = React;
  const G = window.V2Guide;
  const DURS = [
    ['Fast', '--v2-dur-1', 'hover colour, press'],
    ['Base', '--v2-dur-2', 'tab change, chips, toggles, message in'],
    ['Moderate', '--v2-dur-3', 'popover, scrim, disclosure, departures'],
    ['Slow', '--v2-dur-4', 'dialog, sheet, window'],
    ['Celebrate', '--v2-dur-celebrate', 'day-done pop only'],
  ];
  const KEYS = [
    ['v2-anim-fade-up', 'message, tab, toast'], ['v2-anim-pop-in', 'menu, popover, tooltip, coach mark'], ['v2-anim-scale-in', 'dialog, day-done badge'],
    ['v2-anim-sheet-up', 'sheet arrives'], ['v2-anim-sheet-down', 'sheet leaves'], ['v2-anim-fade', 'scrim arrives'],
    ['v2-anim-fade-out', 'scrim leaves'], ['v2-anim-pulse', 'busy dot, thinking'], ['v2-anim-spin', 'spinner'],
    ['v2-anim-shimmer', 'skeleton'], ['v2-anim-indet', 'indeterminate bar'],
  ];
  const CURVES = [
    ['--v2-ease-out', [0.16, 1, 0.3, 1], 'every arrival'],
    ['--v2-ease-in', [0.5, 0, 0.75, 0.4], 'departures'],
    ['--v2-ease-standard', [0.25, 0.1, 0.25, 1], 'colour and opacity'],
  ];
  const plate = { width: 56, height: 36, borderRadius: 'var(--v2-radius-md)', background: 'var(--v2-surface)', border: 'var(--v2-stroke) solid var(--v2-line)', boxShadow: 'var(--v2-shadow-1)' };
  const ring = { width: 16, height: 16, borderRadius: 'var(--v2-radius-round)', border: '2px solid var(--v2-blue-tint-line)', borderTopColor: 'var(--v2-blue)' };
  const track = { position: 'relative', width: 120, height: 4, borderRadius: 'var(--v2-radius-pill)', background: 'var(--v2-surface-sunken)', overflow: 'hidden' };

  function Specimen({ cls }) {
    if (cls === 'v2-anim-spin') return <span className={cls} style={ring} />;
    if (cls === 'v2-anim-pulse') return <span className="v2-hstack v2-gap-1">{[0, 1, 2].map(function (i) { return <span key={i} className={cls} style={{ width: 7, height: 7, borderRadius: 'var(--v2-radius-round)', background: 'var(--v2-ink-4)', animationDelay: (i * 120) + 'ms' }} />; })}</span>;
    if (cls === 'v2-anim-shimmer') return <span className={cls} style={{ width: 120, height: 12, borderRadius: 'var(--v2-radius-xs)' }} />;
    if (cls === 'v2-anim-indet') return <span style={track}><span className={cls} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '40%', background: 'var(--v2-blue)', borderRadius: 'var(--v2-radius-pill)' }} /></span>;
    if (cls === 'v2-anim-fade' || cls === 'v2-anim-fade-out') return <span className={cls} style={{ width: 96, height: 48, borderRadius: 'var(--v2-radius-md)', background: 'var(--v2-scrim)' }} />;
    if (cls === 'v2-anim-sheet-up' || cls === 'v2-anim-sheet-down') {
      return <span style={{ position: 'relative', width: 96, height: 56, overflow: 'hidden', borderRadius: 'var(--v2-radius-md)', border: 'var(--v2-stroke) solid var(--v2-line)', background: 'var(--v2-canvas)' }}><span className={cls} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 34, background: 'var(--v2-surface)', borderTop: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-lg) var(--v2-radius-lg) 0 0' }} /></span>;
    }
    return <span className={cls} style={plate} />;
  }
  function Curve({ c }) {
    const p = c[1];
    const d = 'M0 60 C' + (p[0] * 100) + ' ' + (60 - p[1] * 60) + ' ' + (p[2] * 100) + ' ' + (60 - p[3] * 60) + ' 100 0';
    return (
      <div className="v2-stack v2-gap-1">
        <svg viewBox="-4 -4 108 68" width="120" height="76" aria-hidden="true" style={{ overflow: 'visible' }}>
          <path d="M0 60 H100 M0 60 V0" style={{ stroke: 'var(--v2-line-strong)', fill: 'none' }} />
          <path d={d} style={{ stroke: 'var(--v2-blue)', strokeWidth: 2, fill: 'none' }} />
        </svg>
        <code className="g-code">{c[0]}</code>
        <span className="v2-text-meta">{G.tokenValue(c[0])}: {c[2]}</span>
      </div>
    );
  }

  function MotionSection() {
    const K = window.V2Kit || {};
    const [run, setRun] = useState(0);
    const [reduced, setReduced] = useState(false);
    const replay = function () { setRun(function (n) { return n + 1; }); };
    const BUDGET = [
      ['Cold start', 3500, 1200, 'Splash 2.65s then an 850ms skeleton on every window open', 'Splash up to 1.2s on a true cold start only; reopening restores at once'],
      ['Welcome (signed out)', 5900, 420, 'Five beats with a slow logo drift; terms finish fading at 5.9s', 'Title, steps, action fade up at --v2-dur-2 with 120ms staggers, about 0.42s; cap 1.2s; no logo drift'],
      ['Day done', 450, 450, 'Pop 0.45s, then the tick ring loops forever', 'One pop (v2-scale-in) at --v2-dur-celebrate; no ring'],
      ['Sheet', 450, 320, 'Up 0.45s, down 0.32s', 'Up --v2-dur-4 ease-out, down --v2-dur-3 ease-in'],
    ];
    const bar = function (ms, tone) { return <span style={{ display: 'block', height: 8, width: Math.max(2, ms / 6000 * 100) + '%', background: tone, borderRadius: 'var(--v2-radius-pill)' }} />; };
    return (
      <G.Section id="motion">
        <G.Part name="Durations and curves" status="changed" role="Five durations, three curves, nine shared keyframes (kit/motion.css) and one local, the Day 20 confetti (kit/worker.css): arrivals ease out, departures ease in one step shorter, nothing loops unless the partner is waiting on it.">
          <div><button type="button" className="g-btn" onClick={replay}>Play every tile</button></div>
          <G.StateGrid states={DURS.map(function (d) {
            return { label: d[0] + ' ' + G.tokenValue(d[1]), note: d[2], node: <span key={run} style={Object.assign({}, plate, { animation: 'v2-fade-up var(' + d[1] + ') var(--v2-ease-out) both' })} /> };
          })} />
          <div className="v2-hstack v2-wrap v2-gap-6">{CURVES.map(function (c) { return <Curve key={c[0]} c={c} />; })}</div>
          <G.StateGrid states={KEYS.map(function (k) {
            return { label: '.' + k[0], note: k[1], node: <span key={run} className="v2-hstack" style={{ justifyContent: 'center' }}><Specimen cls={k[0]} /></span> };
          })} />
          <G.CompareRow
            v2={<G.FrameState url="index.html?start=worker" label="V2 worker home: messages fade up 6px over 0.22s ease, tabs over 0.18s ease" height={560} />}
            system={<div key={'sys' + run} className="v2-anim-fade-up v2-text-body" style={{ maxWidth: 'var(--v2-bubble-max)', background: 'var(--v2-surface)', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-lg)', padding: 'var(--v2-space-3) var(--v2-space-4)' }}>Working on it…</div>}
            changed="38 durations and 12 curves become five and three. V2's house curve cubic-bezier(0.22,1,0.36,1) is a near twin of the site's cubic-bezier(0.16,1,0.3,1), so adopting the site's costs nothing visible. Four fade-up recipes and three spinners become one each; five dead keyframes are not carried." />
          <G.SpecDrawer rows={[
            { part: 'Message in, tab change', token: '--v2-dur-2 / --v2-ease-out', value: '180ms, v2-fade-up 6px', ref: ['foundations.motion.tab-fade', 'foundations.motion.tab-anim', 'foundations.motion.msg-in', 'foundations.motion.msg-in-class'] },
            { part: 'Arrival curve', token: '--v2-ease-out', value: 'cubic-bezier(0.16, 1, 0.3, 1)', ref: ['foundations.motion.house-curve', 'foundations.motion.onblue-ease'] },
            { part: 'Sheet', token: '--v2-dur-4 / --v2-dur-3', value: 'up 320ms ease-out, down 240ms ease-in', ref: ['foundations.motion.terms-up', 'foundations.motion.terms-down'] },
            { part: 'Day-done pop', token: '--v2-dur-celebrate', value: '450ms, v2-scale-in on the badge, once', ref: 'foundations.motion.dd-pop' },
            { part: 'Local keyframe', token: '--v2-dur-celebrate', value: 'kit/worker.css: v2-w-confetti (Day 20 only), once; the badge pops with the shared v2-scale-in, the coach mark rises with .v2-anim-pop-in' },
          ]} />
        </G.Part>

        <G.Part name="Reduced motion" status="new" role="One global rule: when the partner asks the operating system for less motion, every arrival is simply there and every loop stops, product-wide.">
          <G.Note>Why the product needs it: a worker that runs every day is opened every day, and only four V2 components honour the setting (the terms sheet, the welcome, its logo, the onboarding picker). The thinking dots, the day-done tick ring and the shimmer loop for everyone. The site's rule kills all motion; the product keeps two loops readable instead of frozen: the spinner turns at half speed and an indeterminate bar becomes a full quiet track.</G.Note>
          <div className="v2-hstack v2-gap-3">
            <button type="button" className="g-btn" aria-pressed={reduced} onClick={function () { setReduced(!reduced); replay(); }}>{reduced ? 'Showing reduced: switch to normal' : 'Showing normal: switch to reduced'}</button>
            <button type="button" className="g-btn" onClick={replay}>Replay</button>
          </div>
          <G.StateGrid states={[
            { label: reduced ? 'Reduced' : 'Normal', note: 'pulse, spinner, shimmer, indeterminate, fade-up', node: (
              <div key={run} className={G.cx('v2-hstack v2-wrap v2-gap-4', reduced && 'v2-reduced-motion')} style={{ justifyContent: 'center' }}>
                <Specimen cls="v2-anim-pulse" />
                {K.Spinner ? <K.Spinner size={16} delay={0} /> : <Specimen cls="v2-anim-spin" />}
                <Specimen cls="v2-anim-shimmer" />
                <Specimen cls="v2-anim-indet" />
                <Specimen cls="v2-anim-fade-up" />
              </div>
            ) },
          ]} />
          <G.Note>If this computer already asks for reduced motion, both settings look the same: the global rule in kit/motion.css is already on.</G.Note>
          <G.SpecDrawer rows={[
            { part: 'Global rule', token: '@media (prefers-reduced-motion: reduce)', value: 'animation and transition 0.01ms, one iteration, no delay', ref: 'foundations.motion.onblue-reduced' },
            { part: 'Spinner exception', token: '--v2-dur-spin', value: 'keeps turning at 1600ms' },
            { part: 'Indeterminate exception', token: '--v2-opacity-disabled', value: 'full-width track at 0.45' },
            { part: 'V2 honours it in 4 places', token: null, value: 'terms sheet, welcome, welcome logo, onboarding picker', ref: ['foundations.motion.rm-terms', 'foundations.motion.rm-welcome', 'foundations.motion.rm-logo', 'foundations.motion.rm-onboarding'] },
            { part: 'V2 loops that ignore it', token: null, value: 'thinking dots, day-done ring', ref: ['foundations.motion.thinking-loop', 'foundations.motion.ring-loop'] },
          ]} />
        </G.Part>

        <G.Part name="Choreography budgets" status="changed" role="Timed sequences get a budget measured against a partner who opens the app every day: the first look can be branded, every later look is instant.">
          <div className="g-table-wrap">
            <table className="g-table">
              <thead><tr><th scope="col">Moment</th><th scope="col" style={{ width: '38%' }}>V2 today</th><th scope="col" style={{ width: '38%' }}>System</th></tr></thead>
              <tbody>{BUDGET.map(function (b) {
                return (
                  <tr key={b[0]}>
                    <td className="v2-text-label" style={{ color: 'var(--v2-ink)' }}>{b[0]}</td>
                    <td><div className="v2-stack v2-gap-1">{bar(b[1], 'var(--v2-ink-4)')}<span className="v2-text-meta">{b[3]}</span></div></td>
                    <td><div className="v2-stack v2-gap-1">{bar(b[2], 'var(--v2-blue)')}<span className="v2-text-meta">{b[4]}</span></div></td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
          <G.CompareRow
            v2={<G.FrameState url="index.html" label="V2 bare URL: the splash, then the welcome intro behind the terms sheet" height={560} />}
            system={<G.Note>Cold start: up to 1.2s of splash, only when the app process starts. Reopening the window from the tray restores the last screen with no splash and no skeleton. Welcome: three beats, about 0.42s in all. Day done: one 450ms pop, no ring. Sheets: 320ms up, 240ms down.</G.Note>}
            changed="3.5s of splash plus skeleton on every window open, and a 5.9s welcome intro behind the terms sheet, cost a daily user time on every visit. Budgets cap both and keep the one celebratory beat (day done) at its V2 length." />
          <G.SpecDrawer rows={[
            { part: 'Splash', token: '--v2-dur-4', value: 'V2 1050 / 2150 / 2650ms; system up to 1200ms, cold start only', ref: ['foundations.motion.splash-msg', 'foundations.motion.splash-fade', 'foundations.motion.splash-done'] },
            { part: 'Skeleton after splash', token: null, value: 'V2 850ms; system none on reopen', ref: 'foundations.motion.skeleton' },
            { part: 'Welcome intro', token: '--v2-dur-2 + 120ms staggers', value: 'V2 5.9s; system about 0.42s (.v2-anim-fade-up, .v2-delay-1, .v2-delay-2), cap 1.2s', ref: ['foundations.motion.welcome-cta', 'foundations.motion.welcome-terms'] },
            { part: 'Day done', token: '--v2-dur-celebrate', value: '450ms pop (v2-scale-in), no ring (V2 loops one forever)', ref: ['foundations.motion.dd-pop', 'foundations.motion.ring-loop'] },
          ]} />
        </G.Part>
      </G.Section>
    );
  }
  G.register('motion', MotionSection);
})();
