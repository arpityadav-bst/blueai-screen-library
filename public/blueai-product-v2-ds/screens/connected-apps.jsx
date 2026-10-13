/* BlueAI Product V2 Design System: Connected apps (section 63, New).
   The accounts BlueAI acts on, how it uses each one, and the way to stop it. V2 confirms the
   YouTube account once in chat and never shows it again (worker_flow.jsx:71), lets Instagram be
   switched to Automatic before Instagram jobs exist (R40) and unlinks Telegram at once.
   Pushed over Settings with Back; Settings lists the same rows (ConnectedAppRows).

   ConnectedApps {worker, app, state, telegram, onBack, onNavigate, frame, compact, landmark, preview}
     app       null: the list; 'youtube' | 'telegram': that account's detail.
     state     'connected' | 'signed-out' (YouTube signed out in App Player) | 'disconnect' (the
               confirm open) | 'disconnected'.  telegram 'linked' | 'not-linked'.
     onNavigate('worker-settings') for the Paid jobs row.
   ConnectedAppRows {worker, youtube, telegram, onOpen(app)}  one ListRow per app: mark, name, the
     account or why there is none, one Badge. Instagram is a static Coming soon row, no chevron. */
(function () {
  const { useState } = React;
  const kit = function () { return window.V2Kit || {}; };
  const noop = function () {};
  const BOT = '@BlueAIBot';

  function fixture() { const f = kit().workerFixtures || {}; return f.verified || {}; }
  function ytOf(w) { return (w.apps && w.apps.youtube) || {}; }
  function modeLabel(a) { return a.mode === 'auto' ? 'Automatic' : 'Always ask'; }

  function ConnectedAppRows({ worker, youtube, telegram, onOpen }) {
    const K = kit();
    const Row = K.ListRow;
    const B = K.Badge;
    if (!Row) return null;
    const w = worker || fixture();
    const yt = ytOf(w);
    const ys = youtube || (yt.status === 'connected' ? 'connected' : 'disconnected');
    const tg = telegram || 'not-linked';
    const open = function (id) { return function () { if (onOpen) onOpen(id); }; };
    const mark = function (app) { return K.Avatar ? <K.Avatar app={app} size={32} decorative /> : null; };
    const yDesc = ys === 'connected' ? yt.handle + ' · ' + modeLabel(yt)
      : ys === 'signed-out' ? 'Signed out in App Player' : 'Not connected';
    const yBadge = ys === 'connected' ? ['success', 'Connected'] : ys === 'signed-out' ? ['attention', 'Signed out'] : ['neutral', 'Not connected'];
    return [
      <Row key="youtube" leading={mark('youtube')} label="YouTube" description={yDesc}
        badge={B ? <B tone={yBadge[0]}>{yBadge[1]}</B> : null} onClick={open('youtube')} />,
      <Row key="telegram" leading={mark('telegram')} label="Telegram"
        description={tg === 'linked' ? 'Connected to ' + BOT : 'Send commands to BlueAI from any device.'}
        badge={B ? <B tone={tg === 'linked' ? 'success' : 'neutral'}>{tg === 'linked' ? 'Connected' : 'Not connected'}</B> : null}
        onClick={open('telegram')} />,
      <Row key="instagram" leading={mark('instagram')} label="Instagram" description="Instagram jobs aren’t available yet."
        badge={B ? <B tone="neutral">Coming soon</B> : null} />,
    ];
  }

  function Toast({ t, onClose, preview }) {
    const K = kit();
    if (!t || !K.Toast) return null;
    return (
      <div className="v2-toast-host">
        <K.Toast tone={t.tone || 'success'} title={t.title} action={t.action} duration={preview ? 0 : undefined} onClose={onClose} />
      </div>
    );
  }

  function YouTube({ w, ys, history, setHistory, onDisconnect, onConnect, go }) {
    const K = kit();
    const yt = ytOf(w);
    const on = ys === 'connected' || ys === 'signed-out';
    const ic = K.Avatar ? <K.Avatar app="youtube" size={40} decorative /> : null;
    const account = ys === 'connected'
      ? <K.ListRow leading={ic} label={yt.handle} description="Signed in to App Player on this PC." badge={<K.Badge tone="success">Connected</K.Badge>} />
      : ys === 'signed-out'
        ? <K.ListRow leading={ic} label={yt.handle} description="App Player isn’t signed in to YouTube. Sign in there so today’s run can start."
            trailing={<K.Button size="sm" variant="secondary" onClick={noop}>Open App Player</K.Button>} />
        : <K.ListRow leading={ic} label="Not connected" description="Daily runs are paused until BlueAI has a YouTube account to use."
            trailing={<K.Button size="sm" variant="primary" onClick={onConnect}>Connect</K.Button>} />;
    return (
      <React.Fragment>
        <K.SettingsSection id="account" title="Account">{account}</K.SettingsSection>
        {on ? (
          <K.SettingsSection id="use" title="What BlueAI does here">
            <K.ListRow label="Paid jobs" value={modeLabel(yt)} onClick={function () { go('worker-settings'); }} />
            <K.ListRow label="Watch history" description={history ? 'Used to pick jobs that fit what you watch.' : 'Off. BlueAI watches general videos instead.'}
              trailing={K.Switch ? <K.Switch hideLabel label="Use my watch history" checked={history} onChange={setHistory} /> : null} />
          </K.SettingsSection>
        ) : null}
        {on ? (
          <div className="v2-acct-zone">
            <p>BlueAI stops using {yt.handle} and pauses your daily runs until you connect YouTube again.</p>
            <K.Button variant="danger" onClick={onDisconnect}>Disconnect YouTube</K.Button>
          </div>
        ) : null}
      </React.Fragment>
    );
  }

  function Telegram({ tg, onConnect, onDisconnect }) {
    const K = kit();
    const ic = K.Avatar ? <K.Avatar app="telegram" size={40} decorative /> : null;
    return (
      <React.Fragment>
        <K.SettingsSection id="account" title="Account">
          {tg === 'linked'
            ? <K.ListRow leading={ic} label="Telegram" description={'Connected to ' + BOT} badge={<K.Badge tone="success">Connected</K.Badge>} />
            : <K.ListRow leading={ic} label="Telegram" description="Connect your Telegram account and send commands to BlueAI from any device." />}
        </K.SettingsSection>
        {tg === 'linked' ? (
          <div className="v2-acct-zone">
            <p>You won’t be able to send commands to BlueAI from Telegram. Your worker keeps running.</p>
            <K.Button variant="danger" onClick={onDisconnect}>Disconnect Telegram</K.Button>
          </div>
        ) : (
          <div className="v2-acct-zone"><K.Button variant="primary" onClick={onConnect}>Connect Telegram</K.Button></div>
        )}
      </React.Fragment>
    );
  }

  function ConnectedApps(props) {
    const K = kit();
    const p = props;
    const w = p.worker || fixture();
    const yt = ytOf(w);
    const [app, setApp] = useState(p.app || null);
    const [pushed, setPushed] = useState(false);
    const [ys, setYs] = useState(p.state === 'signed-out' || p.state === 'disconnected' ? p.state : 'connected');
    const [tg, setTg] = useState(p.telegram || 'not-linked');
    const [confirm, setConfirm] = useState(p.state === 'disconnect');
    const [history, setHistory] = useState(yt.history !== 'notnow');
    const [toast, setToast] = useState(p.state === 'disconnected' ? { title: 'YouTube disconnected' } : null);
    const go = p.onNavigate || noop;
    const Frame = (window.V2Screens || {}).AccountFrame;
    if (!K.SettingsSection || !K.ListRow || !K.Button || !K.Badge || !Frame) return <div className="v2-acct-note">The kit is not loaded.</div>;

    function back() { if (pushed) { setApp(null); setPushed(false); } else (p.onBack || noop)(); }
    function disconnect() { setConfirm(false); setYs('disconnected'); setToast({ title: 'YouTube disconnected' }); }
    const title = app === 'youtube' ? 'YouTube' : app === 'telegram' ? 'Telegram' : 'Connected apps';
    const dialog = confirm && K.Dialog ? (
      <K.Dialog open preview={p.preview} variant="alert" title="Disconnect YouTube?" onClose={function () { setConfirm(false); }}
        description={'BlueAI stops using ' + yt.handle + ' and pauses your daily runs. Days without a run don’t count toward your 20 days.'}
        actions={[{ label: 'Cancel', onClick: function () { setConfirm(false); } }, { label: 'Disconnect', variant: 'danger', onClick: disconnect }]} />
    ) : null;
    const overlays = <React.Fragment>{dialog}<Toast t={toast} preview={p.preview} onClose={function () { setToast(null); }} /></React.Fragment>;

    let body;
    if (app === 'youtube') {
      body = <YouTube w={w} ys={ys} history={history} go={go} onDisconnect={function () { setConfirm(true); }}
        onConnect={function () { setYs('connected'); setToast({ title: 'YouTube connected' }); }}
        setHistory={function (v) { setHistory(v); setToast({ title: v ? 'Watch history on' : 'Watch history off', tone: 'info' }); }} />;
    } else if (app === 'telegram') {
      body = <Telegram tg={tg} onConnect={function () { setTg('linked'); setToast({ title: 'Telegram connected' }); }}
        onDisconnect={function () {
          setTg('not-linked');
          setToast({ title: 'Telegram disconnected', action: { label: 'Undo', onClick: function () { setTg('linked'); } } });
        }} />;
    } else {
      body = (
        <React.Fragment>
          <K.SettingsSection id="apps" title="Your accounts" description="BlueAI acts on these accounts for you. It never sees or types your passwords.">
            <ConnectedAppRows worker={w} youtube={ys} telegram={tg} onOpen={function (id) { setApp(id); setPushed(true); }} />
          </K.SettingsSection>
          <p className="v2-acct-note">A new app starts on Always ask. Instagram turns on here when its jobs go live.</p>
        </React.Fragment>
      );
    }
    return (
      <Frame worker={w} tab="settings" frame={p.frame} compact={p.compact} landmark={p.landmark} overlays={overlays}>
        {K.ScreenHeader ? <K.ScreenHeader title={title} onBack={back} /> : null}
        <div className="v2-acct-body">{body}</div>
      </Frame>
    );
  }

  window.V2Screens = window.V2Screens || {};
  Object.assign(window.V2Screens, { ConnectedApps, ConnectedAppRows });
})();
