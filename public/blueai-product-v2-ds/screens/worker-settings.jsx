/* BlueAI Product V2 Design System: Worker settings (section 62, New).
   Everything onboarding set, changeable later: whether daily runs are on, Always ask or Automatic
   per app, when the run happens, and the interest profile. V2 promises "You can pause, stop, or
   disconnect anytime." (worker_flow.jsx:67) and asks for the run time once in chat; none of it has
   a control afterwards (R05). Pushed over Settings with Back. Each change applies at once and says
   so in a toast; pausing says what it costs before it happens (P3); Automatic asks for consent
   every time (section 46).

   WorkerSettings {worker, state, onBack, frame, compact, landmark, preview}
     state  'ask' (Always ask everywhere, default) | 'auto' (Automatic on YouTube) | 'paused' (until
            a date) | 'window' (editing the run window) | 'consent' (the consent dialog open) |
            'pause' (the pause dialog open). */
(function () {
  const { useState, useRef } = React;
  const kit = function () { return window.V2Kit || {}; };
  const noop = function () {};

  const HOURS = ['6 am', '7 am', '8 am', '9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm', '7 pm', '8 pm', '9 pm', '10 pm']
    .map(function (h) { return { value: h, label: h }; });
  // V2's interest profile (worker_flow.jsx:85), topic names only.
  const TOPICS = ['Tech & Smartphones', 'Automotive', 'Motivation & Finance', 'Entertainment'];
  const UNTIL = [
    { value: 'Oct 14', label: 'Tomorrow, Oct 14' },
    { value: 'Oct 16', label: 'Oct 16' },
    { value: 'Oct 20', label: 'Oct 20' },
    { value: 'later', label: 'Until I turn them back on' },
  ];

  function fixture(state) {
    const f = kit().workerFixtures || {};
    const key = state === 'auto' ? 'automatic' : state === 'paused' ? 'paused' : 'verified';
    return f[key] || f.verified || {};
  }
  function runFrom(w, state) {
    if (state === 'window') return { kind: 'window', time: '11 am', from: '9 am', to: '9 pm' };
    const r = w.runWindow || {};
    return { kind: r.kind || 'time', time: r.kind === 'time' && r.label ? r.label : '11 am', from: '9 am', to: '9 pm' };
  }
  function runSummary(r) {
    if (r.kind === 'window') return 'between ' + r.from + ' and ' + r.to;
    if (r.kind === 'any') return 'at a time BlueAI picks';
    return 'at ' + r.time;
  }

  function WorkerSettings(props) {
    const K = kit();
    const p = props;
    const w0 = p.worker || fixture(p.state);
    const yt = (w0.apps && w0.apps.youtube) || {};
    const [modes, setModes] = useState({ youtube: yt.mode || 'always', instagram: 'always' });
    const [paused, setPaused] = useState(w0.paused ? w0.paused.until : null);
    const [pausing, setPausing] = useState(p.state === 'pause');
    const [until, setUntil] = useState('Oct 16');
    const [consent, setConsent] = useState(p.state === 'consent' ? 'youtube' : null);
    const [run, setRun] = useState(runFrom(w0, p.state));
    const [topics, setTopics] = useState(TOPICS.reduce(function (o, t) { o[t] = true; return o; }, {}));
    const [toast, setToast] = useState(null);
    const pend = useRef(null);
    const Frame = (window.V2Screens || {}).AccountFrame;
    const Sec = K.SettingsSection;
    if (!Sec || !K.ListRow || !Frame) return <div className="v2-acct-note">The kit is not loaded.</div>;

    // The record as it stands after this screen's edits, so the top bar, ModeRows and the consent
    // dialog all read one truth.
    const apps = Object.assign({}, w0.apps, { youtube: Object.assign({}, yt, { mode: modes.youtube }) });
    const w = Object.assign({}, w0, { apps: apps, paused: paused ? { until: paused } : null });
    const n = K.numbers ? K.numbers(w) : { toGo: 13, daysLeft: 18, target: 20 };
    const say = function (title, tone) { setToast({ title: title, tone: tone }); };

    function setRunWith(patch) {
      const next = Object.assign({}, run, patch);
      setRun(next);
      say('Daily run set ' + runSummary(next) + '.');
    }
    function beforeChange(app, mode) {
      if (mode !== 'auto') return true;
      return new Promise(function (resolve) { pend.current = resolve; setConsent(app); });
    }
    function settle(ok) {
      const app = consent;
      if (pend.current) pend.current(ok); else if (ok) setModes(Object.assign({}, modes, { [app]: 'auto' }));
      pend.current = null;
      setConsent(null);
      if (ok) say('Automatic is on for YouTube.');
    }
    function confirmPause() {
      setPausing(false);
      setPaused(until === 'later' ? 'you turn them back on' : until);
      say('Daily runs paused.', 'info');
    }

    const runRow = (
      <K.ListRow label="Daily runs"
        description={paused ? 'Paused until ' + paused + '. Paused days don’t count toward your 20 days.' : (K.nextRunText ? K.nextRunText(Object.assign({}, w, { runWindow: { kind: run.kind, label: run.kind === 'window' ? run.from + ' and ' + run.to : run.time } })) : '')}
        trailing={K.Switch ? <K.Switch hideLabel label="Daily runs" checked={!paused} busy={pausing}
          onChange={function (on) { if (on) { setPaused(null); say('Daily runs are back on.'); } else setPausing(true); }} /> : null} />
    );
    const timeFields = run.kind === 'window' ? (
      <div className="v2-acct-pair">
        <K.Select label="From" options={HOURS} value={run.from} onChange={function (v) { setRunWith({ from: v }); }} />
        <K.Select label="To" options={HOURS} value={run.to} onChange={function (v) { setRunWith({ to: v }); }} />
      </div>
    ) : run.kind === 'time'
      ? <K.Select label="Start at" options={HOURS} value={run.time} onChange={function (v) { setRunWith({ time: v }); }} />
      : null;

    const pauseDialog = pausing && K.Dialog ? (
      <K.Dialog open preview={p.preview} variant="task" title="Pause daily runs?" onClose={function () { setPausing(false); }}
        actions={[{ label: 'Keep running', onClick: function () { setPausing(false); } }, { label: 'Pause', variant: 'primary', onClick: confirmPause }]}>
        <div className="v2-acct-stack">
          <p>{'Days you pause don’t count toward your 20 days. You need ' + n.toGo + ' more, and ' + n.daysLeft + ' days are left.'}</p>
          {K.Select ? <K.Select label="Pause until" options={UNTIL} value={until} onChange={setUntil} /> : null}
        </div>
      </K.Dialog>
    ) : null;
    const consentDialog = consent && K.ConsentDialog
      ? <K.ConsentDialog app={consent} open preview={p.preview} worker={w} onAgree={function () { settle(true); }} onCancel={function () { settle(false); }} />
      : null;
    const toastNode = toast && K.Toast ? (
      <div className="v2-toast-host">
        <K.Toast tone={toast.tone || 'success'} title={toast.title} duration={p.preview ? 0 : undefined} onClose={function () { setToast(null); }} />
      </div>
    ) : null;

    return (
      <Frame worker={w} tab="settings" frame={p.frame} compact={p.compact} landmark={p.landmark}
        scrollTo={p.preview && p.state === 'window' ? 'run' : null}
        overlays={<React.Fragment>{pauseDialog}{consentDialog}{toastNode}</React.Fragment>}>
        {K.ScreenHeader ? <K.ScreenHeader title="Worker" onBack={p.onBack || noop} /> : null}
        <div className="v2-acct-body">
          <Sec id="status" title="Runs">{runRow}</Sec>
          <Sec id="jobs" title="Paid jobs" description="Choose for each app whether BlueAI asks before every paid job.">
            {K.ModeRows ? <K.ModeRows worker={w} modes={modes} beforeChange={beforeChange}
              onChange={function (app, m) { setModes(Object.assign({}, modes, { [app]: m })); if (m === 'always') say('YouTube is back on Always ask.'); }} /> : null}
          </Sec>
          <Sec id="run" title="Daily run" description="Changes start tomorrow if today’s run has already begun.">
            <div className="v2-acct-stack">
              {K.RadioCard ? <K.RadioCard label="When BlueAI runs" variant="list" value={run.kind}
                onChange={function (v) { setRunWith({ kind: v }); }}
                options={[
                  { value: 'time', title: 'A set time', sub: 'BlueAI starts within that hour.' },
                  { value: 'window', title: 'A window', sub: 'BlueAI picks a different moment in it each day.' },
                  { value: 'any', title: 'Any time', sub: 'BlueAI picks the moment each day.' },
                ]} /> : null}
              {timeFields}
            </div>
          </Sec>
          <Sec id="interests" title="Interest profile" description="Built from your watch history. BlueAI picks jobs that fit these topics.">
            <div className="v2-acct-stack">
              <div className="v2-acct-chips">
                {TOPICS.map(function (t) {
                  return K.Chip ? <K.Chip key={t} selected={!!topics[t]} icon={topics[t] ? 'check' : undefined}
                    onClick={function () { setTopics(Object.assign({}, topics, { [t]: !topics[t] })); }}>{t}</K.Chip> : null;
                })}
              </div>
              <p className="v2-acct-note">Turn a topic off and BlueAI stops picking jobs about it.</p>
            </div>
          </Sec>
        </div>
      </Frame>
    );
  }

  window.V2Screens = window.V2Screens || {};
  Object.assign(window.V2Screens, { WorkerSettings });
})();
