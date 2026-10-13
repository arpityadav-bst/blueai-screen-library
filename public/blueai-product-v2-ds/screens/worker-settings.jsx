/* BlueAI Product V2 Design System: Worker settings (section 62, New).
   Everything onboarding set, changeable later: whether daily runs are on, Always ask or Automatic
   per app, when the run happens, and the interest profile. V2 promises "You can pause, stop, or
   disconnect anytime." (worker_flow.jsx:67) and asks for the run time once in chat; none of it has
   a control afterwards (R05). Pushed over Settings with Back. Each change applies at once and says
   so in one toast once it settles; pausing says what it costs, for the date picked, before it
   happens (P3); Automatic asks for consent every time (section 46).

   WorkerSettings {worker, state, onBack, onNavigate, onRetry, frame, compact, landmark, preview}
     state  'ask' (Always ask everywhere, default) | 'auto' (Automatic on YouTube) | 'paused' (until
            a date) | 'window' (editing the run window) | 'consent' (the consent dialog open) |
            'pause' (the pause dialog open) | 'pause-busy' (pausing) | 'window-invalid' (To
            before From) | 'saving' (a switch's change in flight) | 'not-saved' (it failed: the
            switch goes back, an error toast offers Try again; section 55) | 'history-off' (watch
            history not allowed: the profile is general topics) | 'one-topic' (the last topic on
            cannot be turned off, and says why) | 'loading' | 'error'.
   Runs start by 8 pm: the ask and retry deadline is a fixed 9 pm (worker-data ASK, retryBy), so a
   later start could never be answered or retried in time. The interest profile keeps one topic
   on (the last one says why), and each topic change confirms in a toast. */
(function () {
  const { useState, useRef, useEffect, useId } = React;
  const kit = function () { return window.V2Kit || {}; };
  const noop = function () {};

  const LAST_START = '8 pm';
  const HOURS = ['6 am', '7 am', '8 am', '9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm', '7 pm', LAST_START]
    .map(function (h) { return { value: h, label: h }; });
  const hourIndex = function (h) { return HOURS.findIndex(function (x) { return x.value === h; }); };
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
    const key = { auto: 'automatic', paused: 'paused', 'history-off': 'revoked' }[state] || 'verified';
    return f[key] || f.verified || {};
  }
  function runFrom(w, state) {
    if (state === 'window') return { kind: 'window', time: '11 am', from: '9 am', to: '8 pm' };
    if (state === 'window-invalid') return { kind: 'window', time: '11 am', from: '7 pm', to: '9 am' };
    const r = w.runWindow || {};
    return { kind: r.kind || 'time', time: r.kind === 'time' && r.label ? r.label : '11 am', from: '9 am', to: '8 pm' };
  }
  function windowOk(r) { return r.kind !== 'window' || hourIndex(r.from) < hourIndex(r.to); }
  function runSummary(r) {
    if (r.kind === 'window') return 'between ' + r.from + ' and ' + r.to;
    if (r.kind === 'any') return 'at a time BlueAI picks';
    return 'at ' + r.time;
  }

  // What a pause costs, for the date picked: days skipped (today.date to the end date, dayGap)
  // against the days still needed.
  function pauseCost(until, w, n) {
    if (until === 'later') return 'Days you pause don’t count toward your 20 days. You need ' + n.toGo + ' more, and ' + n.daysLeft + ' days are left.';
    const gap = kit().dayGap ? kit().dayGap((w.today && w.today.date) || 'Oct 13', until) : null;
    const skip = Math.max(1, gap || 1);
    const left = Math.max(0, n.daysLeft - skip);
    const line = 'Pausing until ' + until + ' skips ' + skip + (skip === 1 ? ' day' : ' days') + '. You’d have ' + left + ' left for the ' + n.toGo + ' you need';
    return line + (left < n.toGo ? ', so ' + n.target + ' days would be out of reach.' : '.');
  }

  function WorkerSettings(props) {
    const Scope = (window.V2Screens || {}).ToastScope;
    return Scope ? <Scope><WorkerSettingsScreen {...props} /></Scope> : <WorkerSettingsScreen {...props} />;
  }

  function WorkerSettingsScreen(props) {
    const K = kit();
    const S = window.V2Screens || {};
    const p = props;
    const w0 = p.worker || fixture(p.state);
    const yt = (w0.apps && w0.apps.youtube) || {};
    const [modes, setModes] = useState({ youtube: yt.mode || 'always', instagram: 'always' });
    const [paused, setPaused] = useState(w0.paused ? w0.paused.until : null);
    const [pausing, setPausing] = useState(p.state === 'pause' || p.state === 'pause-busy');
    const pauseStep = (S.useConfirmStep || function () { return { run: function (f) { f(); } }; })(p.state === 'pause-busy' ? 'busy' : null);
    const [until, setUntil] = useState(UNTIL[0].value);
    const [consent, setConsent] = useState(p.state === 'consent' ? 'youtube' : null);
    const [run, setRun] = useState(runFrom(w0, p.state));
    const [boot, setBoot] = useState(true);
    const [topics, setTopics] = useState(TOPICS.reduce(function (o, t) { o[t] = p.state !== 'one-topic' || t === TOPICS[0]; return o; }, {}));
    const noteId = useId();
    const toast = (S.useScreenToast || function () { return { show: noop }; })();
    const pend = useRef(null);
    const timer = useRef(null);
    useEffect(function () { return function () { clearTimeout(timer.current); }; }, []);
    // Not saved (section 55): the switch shows its old value and an error toast offers Try again.
    useEffect(function () {
      if (p.state !== 'not-saved') return;
      toast.show({ tone: 'error', title: 'Couldn’t turn off Start with Windows. Nothing changed.', duration: p.preview ? 0 : undefined,
        action: { label: 'Try again', onClick: function () { setBoot(false); say('BlueAI won’t start with Windows.', 'info'); } } });
    }, []);
    const Frame = S.ScreenFrame;
    const Sec = K.SettingsSection;
    if (!Sec || !K.ListRow || !Frame) return <div className="v2-acct-note">The kit or screens/home.jsx is not loaded.</div>;

    // The record as it stands after this screen's edits, so the top bar, ModeRows and the consent
    // dialog all read one truth.
    const apps = Object.assign({}, w0.apps, { youtube: Object.assign({}, yt, { mode: modes.youtube }) });
    const w = Object.assign({}, w0, { apps: apps, paused: paused ? { until: paused } : null });
    const n = K.numbers ? K.numbers(w) : { toGo: 13, daysLeft: 18, target: 20 };
    const go = p.onNavigate || noop;
    function say(title, tone) { toast.show({ title: title, tone: tone, duration: p.preview ? 0 : undefined }); }
    const on = TOPICS.filter(function (t) { return topics[t]; });
    function toggleTopic(t) {
      const next = !topics[t];
      setTopics(Object.assign({}, topics, { [t]: next }));
      say(next ? 'BlueAI can pick ' + t + ' jobs again.' : 'BlueAI won’t pick ' + t + ' jobs.', next ? undefined : 'info');
    }

    // One toast once the run settles: a burst of picks (kind, then a time) says it once, and an
    // invalid window says nothing until it is fixed.
    function setRunWith(patch) {
      const next = Object.assign({}, run, patch);
      setRun(next);
      clearTimeout(timer.current);
      if (windowOk(next)) timer.current = setTimeout(function () { say('Daily run set ' + runSummary(next) + '.'); }, 700);
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
      pauseStep.run(function () {
        setPausing(false);
        setPaused(until === 'later' ? 'you turn them back on' : until);
        say('Daily runs paused.', 'info');
      });
    }

    const runRow = (
      <K.ListRow label="Daily runs"
        description={paused ? 'Paused until ' + paused + '. Paused days don’t count toward your 20 days.' : (K.nextRunText ? K.nextRunText(Object.assign({}, w, { runWindow: { kind: run.kind, label: run.kind === 'window' ? run.from + ' and ' + run.to : run.time } })) : '')}
        trailing={K.Switch ? <K.Switch hideLabel label="Daily runs" checked={!paused} busy={pausing}
          onChange={function (on) { if (on) { setPaused(null); say('Daily runs are back on.'); } else setPausing(true); }} /> : null} />
    );
    const bootRow = (
      <K.ListRow label="Start BlueAI with Windows" description="If it’s off, runs skip after a restart until you open BlueAI."
        trailing={K.Switch ? <K.Switch hideLabel label="Start BlueAI with Windows" checked={boot} busy={p.state === 'saving'}
          onChange={function (v) { setBoot(v); say(v ? 'BlueAI starts with Windows.' : 'BlueAI won’t start with Windows.', v ? undefined : 'info'); }} /> : null} />
    );
    const timeFields = run.kind === 'window' ? (
      <div className="v2-acct-pair">
        <K.Select label="From" options={HOURS} value={run.from} onChange={function (v) { setRunWith({ from: v }); }} />
        <K.Select label="To" options={HOURS} value={run.to} onChange={function (v) { setRunWith({ to: v }); }}
          error={windowOk(run) ? null : 'Pick a time after ' + run.from + '.'} />
      </div>
    ) : run.kind === 'time'
      ? <K.Select label="Start at" options={HOURS} value={run.time} onChange={function (v) { setRunWith({ time: v }); }} />
      : null;

    const pauseDialog = pausing && K.Dialog ? (
      <K.Dialog open preview={p.preview} variant="task" title="Pause daily runs?" busy={!!pauseStep.busy} onClose={function () { setPausing(false); }}
        actions={[{ label: 'Keep running', onClick: function () { setPausing(false); } }, { label: 'Pause', variant: 'primary', onClick: confirmPause }]}>
        <div className="v2-acct-stack">
          <p>{pauseCost(until, w, n)}</p>
          {K.Select ? <K.Select label="Pause until" options={UNTIL} value={until} onChange={setUntil} /> : null}
        </div>
      </K.Dialog>
    ) : null;
    const consentDialog = consent && K.ConsentDialog
      ? <K.ConsentDialog app={consent} open preview={p.preview} worker={w} onAgree={function () { settle(true); }} onCancel={function () { settle(false); }} />
      : null;

    const hist = yt.history === 'allowed';
    const pending = S.pendingBody ? S.pendingBody(p.state, 'your worker settings', p.onRetry) : null;
    return (
      <Frame worker={w} tab="settings" frame={p.frame} compact={p.compact} landmark={p.landmark} onNavigate={p.onNavigate}
        loading={p.state === 'loading'} scrollTo={p.preview && /^window/.test(p.state || '') ? 'run' : null}
        overlays={<React.Fragment>{pauseDialog}{consentDialog}</React.Fragment>}>
        <div className="v2-acct">
          {K.ScreenHeader ? <K.ScreenHeader title="Worker" onBack={p.onBack || noop} /> : null}
          {pending ? <div className="v2-acct-body">{pending}</div> : <div className="v2-acct-body">
            <Sec id="status" title="Pause and start-up">{runRow}{bootRow}</Sec>
            <Sec id="jobs" title="Paid jobs" description="Choose for each app whether BlueAI asks before every paid job.">
              {K.ModeRows ? <K.ModeRows worker={w} modes={modes} beforeChange={beforeChange}
                onChange={function (app, m) { setModes(Object.assign({}, modes, { [app]: m })); if (m === 'always') say('YouTube is back on Always ask.'); }} /> : null}
            </Sec>
            <Sec id="run" title="Run time" description={'Runs start by ' + LAST_START + ', so there’s time to answer a job or try again before 9 pm. Changes start tomorrow if today’s run has already begun.'}>
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
            <Sec id="interests" title="Interest profile" description={hist ? 'Built from your watch history. BlueAI picks jobs that fit these topics.'
              : 'General topics. BlueAI picks jobs that fit these topics.'}>
              <div className="v2-acct-stack">
                <div className="v2-acct-chips">
                  {TOPICS.map(function (t) {
                    const last = !!topics[t] && on.length === 1;
                    return K.Chip ? <K.Chip key={t} selected={!!topics[t]} icon={topics[t] ? 'check' : undefined} disabled={last}
                      aria-describedby={last ? noteId : undefined} onClick={function () { toggleTopic(t); }}>{t}</K.Chip> : null;
                  })}
                </div>
                <p className="v2-acct-note" id={noteId}>{on.length === 1 ? 'Keep at least one topic on, so BlueAI has jobs to pick from.' : 'Turn a topic off and BlueAI stops picking jobs about it.'}</p>
                {!hist && K.Link ? <K.Link standalone onClick={function () { go('connected-apps', { app: 'youtube' }); }}>Allow watch history to tailor jobs</K.Link> : null}
              </div>
            </Sec>
          </div>}
        </div>
      </Frame>
    );
  }

  window.V2Screens = window.V2Screens || {};
  Object.assign(window.V2Screens, { WorkerSettings });
})();
