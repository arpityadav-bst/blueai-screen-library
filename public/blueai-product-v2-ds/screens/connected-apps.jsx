/* BlueAI Product V2 Design System: Connected apps (section 63, New).
   The accounts BlueAI acts on, how it uses each one, and the way to stop it. V2 confirms the
   YouTube account once in chat and never shows it again (worker_flow.jsx:71), lets Instagram be
   switched to Automatic before Instagram jobs exist (R40) and unlinks Telegram at once.
   Pushed over Settings with Back; Settings lists the same rows (ConnectedAppRows).

   ConnectedApps {worker, app, state, telegram, onBack, onNavigate, onRetry, onFix, frame, compact,
                  landmark, preview}
     app       null: the list; 'youtube' | 'telegram': that account's detail.
     state     'connected' | 'signed-out' (YouTube signed out in App Player) | 'disconnect' (the
               confirm open; 'disconnect-busy' working, 'disconnect-failed' said in the dialog
               with Try again) | 'disconnected' | 'tg-pairing' | 'tg-expired' | 'tg-failed' (the
               Telegram pairing dialog) | 'loading' | 'error'.  telegram 'linked' | 'not-linked'.
               Without a YouTube state the record decides (accountStates), so the fix route of a
               blocked run never lands on a row that says Connected.
     onFix(reason)  Open App Player does what Home's does (fixBlocked).
     Each Disconnect sits under its consequence. YouTube's costs days, so it is danger and opens
     the confirm (section 11); Telegram's costs nothing, so it is secondary and acts at once with
     Undo (section 52, rule 4). A swap that removes the pressed control (Connect, Disconnect,
     opening a detail) moves focus to the first control that replaced it (section 09).
     What BlueAI does here: the daily warm-up (every run, both modes) and Paid jobs (the mode).
     Watch history is a permission (section 46): allowed names the three things BlueAI reads, with
     its date, and turns off in one tap; not now or turned off is PermissionRequest's compact
     result with Allow, which opens the full request in place. Each answer records the date.
     Connect Telegram pairs first, as V2 does (settings.jsx:49-66): the code to send to the bot and
     a waiting line, with an expired and a failed variant. V2's QR placeholder is left out until
     there is a real code to scan.
     onNavigate('worker-settings') for the Paid jobs row, plus every chrome event.
   ConnectedAppRows {worker, youtube, telegram, onOpen(app)}  one ListRow per app: mark, name, the
     account or why there is none, one Badge. Instagram is a static Coming soon row, no chevron.
   accountStates(worker)  {youtube 'connected' | 'signed-out' | 'disconnected', bluestacks
     'connected' | 'signed-out' | 'not-installed'}: the record's apps and V2Kit.blockedBy reason.
   fixBlocked(reason, onFix, toast, go)  a blocked run's one fix behaviour (Home, Settings, here):
     the host's onFix acts in place; without one a toast stands in for the App Player launch and
     the BlueStacks download, and no app opens Connected apps through go. */
(function () {
  const { useState, useEffect, useRef } = React;
  const kit = function () { return window.V2Kit || {}; };
  const noop = function () {};
  const BOT = '@BlueAIBot';
  const CODE = '4829'; // V2's pairing code (settings.jsx:61)

  function fixture() { const f = kit().workerFixtures || {}; return f.verified || {}; }
  function ytOf(w) { return (w.apps && w.apps.youtube) || {}; }
  function modeLabel(a) { return a.mode === 'auto' ? 'Automatic' : 'Always ask'; }

  function accountStates(w) {
    const b = (kit().blockedBy && kit().blockedBy(w)) || {};
    const out = b.reason === 'signed-out' ? 'signed-out' : null;
    return {
      youtube: out || (b.reason === 'no-app' || ytOf(w).status !== 'connected' ? 'disconnected' : 'connected'),
      bluestacks: out || (b.reason === 'no-bluestacks' ? 'not-installed' : 'connected'),
    };
  }
  const FIX_TOAST = {
    'signed-out': 'Opening App Player. Sign in to YouTube there.',
    'no-bluestacks': 'BlueStacks is downloading. Open the installer when it’s done.',
  };
  function fixBlocked(reason, onFix, toast, go) {
    if (onFix) onFix(reason);
    else if (FIX_TOAST[reason]) { if (toast) toast.show({ tone: 'info', title: FIX_TOAST[reason] }); }
    else if (go) go('connected-apps', { app: 'youtube' });
  }

  function ConnectedAppRows({ worker, youtube, telegram, onOpen }) {
    const K = kit();
    const Row = K.ListRow;
    const B = K.Badge;
    if (!Row) return null;
    const w = worker || fixture();
    const yt = ytOf(w);
    const ys = youtube || accountStates(w).youtube;
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

  // Pairing: waiting (the code and a live waiting line), expired, failed. Proposed copy.
  const PAIR = {
    waiting: { text: 'In Telegram, open ' + BOT + ' and send this code.', act: null },
    expired: { text: 'This code expired before Telegram got it.', act: 'Get a new code' },
    failed: { text: 'Couldn’t connect Telegram. Check your connection and try again.', act: 'Try again' },
  };
  function PairDialog({ phase, preview, onRetry, onCancel }) {
    const K = kit();
    const c = PAIR[phase] || PAIR.waiting;
    if (!K.Dialog) return null;
    const actions = [{ label: 'Cancel', onClick: onCancel }].concat(c.act ? [{ label: c.act, variant: 'primary', onClick: onRetry }] : []);
    return (
      <K.Dialog open preview={preview} variant="task" title="Connect Telegram" onClose={onCancel} actions={actions}>
        <div className="v2-acct-stack">
          <p>{c.text}</p>
          {phase === 'waiting' ? (
            <p className="v2-acct-code"><span aria-hidden="true">{CODE}</span><span className="v2-sr-only">{'Pairing code ' + CODE.split('').join(' ')}</span></p>
          ) : null}
          <p className="v2-acct-wait" role="status">
            {phase === 'waiting' && K.Spinner ? <K.Spinner size={16} delay={0} /> : null}
            <span>{phase === 'waiting' ? 'Waiting for Telegram. The code works for 10 minutes.' : 'Nothing was linked.'}</span>
          </p>
        </div>
      </K.Dialog>
    );
  }

  // Watch history (proposed copy): what is read, with its date; one tap turns it off.
  function History({ hist, asking, onAsk, onAnswer }) {
    const K = kit();
    if (hist.state === 'allowed') {
      return <K.ListRow label={'Allowed on ' + hist.on} description="BlueAI sees your watch history, subscriptions and channel stats to pick jobs that fit you."
        trailing={<K.Button size="sm" variant="secondary" onClick={function () { onAnswer('revoked'); }}>Turn off</K.Button>} />;
    }
    if (!K.PermissionRequest) return null;
    return asking || !hist.state
      ? <K.PermissionRequest app="youtube" state="asked" onAllow={function () { onAnswer('allowed'); }} onNotNow={function () { onAnswer('notnow'); }} />
      : <K.PermissionRequest app="youtube" state={hist.state === 'revoked' ? 'revoked' : 'notnow'} decidedOn={hist.on} onAllow={onAsk} />;
  }

  function YouTube({ w, ys, hist, asking, onAsk, onHistory, onDisconnect, onConnect, onOpenPlayer, go }) {
    const K = kit();
    const yt = ytOf(w);
    const on = ys === 'connected' || ys === 'signed-out';
    const ic = K.Avatar ? <K.Avatar app="youtube" size={40} decorative /> : null;
    const account = ys === 'connected'
      ? <K.ListRow leading={ic} label={yt.handle} description="Signed in to App Player on this PC." badge={<K.Badge tone="success">Connected</K.Badge>} />
      : ys === 'signed-out'
        ? <K.ListRow leading={ic} label={yt.handle} description="App Player isn’t signed in to YouTube. Sign in there so today’s run can start."
            trailing={<K.Button size="sm" variant="secondary" onClick={onOpenPlayer}>Open App Player</K.Button>} />
        : <K.ListRow leading={ic} label="Not connected" description="Daily runs can’t start until BlueAI has a YouTube account to use."
            trailing={<K.Button size="sm" variant="primary" onClick={onConnect}>Connect</K.Button>} />;
    return (
      <React.Fragment>
        <K.SettingsSection id="account" title="Account">{account}</K.SettingsSection>
        {on ? (
          <K.SettingsSection id="use" title="What BlueAI does here">
            <K.ListRow label="Daily warm-up" description={(hist.state === 'allowed' ? 'Watches and likes videos that fit you' : 'Watches and likes general videos') + ', every run, in both modes.'} />
            <K.ListRow label="Paid jobs" value={modeLabel(yt)} onClick={function () { go('worker-settings'); }} />
          </K.SettingsSection>
        ) : null}
        {on ? (
          <K.SettingsSection id="history" title="Watch history">
            <History hist={hist} asking={asking} onAsk={onAsk} onAnswer={onHistory} />
          </K.SettingsSection>
        ) : null}
        {on ? (
          <div className="v2-acct-zone">
            <p>BlueAI stops using {yt.handle}, and daily runs can’t start until you connect YouTube again.</p>
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
            <K.Button variant="secondary" onClick={onDisconnect}>Disconnect Telegram</K.Button>
          </div>
        ) : (
          <div className="v2-acct-zone"><K.Button variant="primary" onClick={onConnect}>Connect Telegram</K.Button></div>
        )}
      </React.Fragment>
    );
  }

  function ConnectedApps(props) {
    const Scope = (window.V2Screens || {}).ToastScope;
    return Scope ? <Scope><ConnectedAppsScreen {...props} /></Scope> : <ConnectedAppsScreen {...props} />;
  }

  function ConnectedAppsScreen(props) {
    const K = kit();
    const S = window.V2Screens || {};
    const p = props;
    const w = p.worker || fixture();
    const yt = ytOf(w);
    const pairState = { 'tg-pairing': 'waiting', 'tg-expired': 'expired', 'tg-failed': 'failed' }[p.state] || null;
    const [app, setApp] = useState(p.app || (pairState ? 'telegram' : null));
    const [pushed, setPushed] = useState(false);
    const [ys, setYs] = useState(/^(connected|signed-out|disconnected)$/.test(p.state || '') ? p.state : accountStates(w).youtube);
    const [tg, setTg] = useState(p.telegram || 'not-linked');
    const [pair, setPair] = useState(pairState);
    const [confirm, setConfirm] = useState(/^disconnect(-busy|-failed)?$/.test(p.state || ''));
    const step = (S.useConfirmStep || function () { return { run: function (f) { f(); }, reset: noop }; })({ 'disconnect-busy': 'busy', 'disconnect-failed': 'failed' }[p.state] || null);
    const [hist, setHist] = useState({ state: yt.history || null, on: yt.historyOn || null });
    const [asking, setAsking] = useState(false);
    const toast = (S.useScreenToast || function () { return { show: noop }; })();
    const body = useRef(null);
    const first = function (sel) { return function () { return body.current && body.current.querySelector(sel); }; };
    if (K.useSwapFocus) {
      K.useSwapFocus(first('button, a[href]'), [app, ys, tg].join());
      K.useSwapFocus(first('[data-section="history"] button'), hist.state + (asking ? '?' : ''));
    }
    useEffect(function () { if (p.state === 'disconnected') say('YouTube disconnected'); }, []);
    // The prototype's stand-in for the bot reporting the code back: the waiting line resolves.
    useEffect(function () {
      if (pair !== 'waiting' || p.preview) return undefined;
      const t = setTimeout(function () { setPair(null); setTg('linked'); say('Telegram connected'); }, 3000);
      return function () { clearTimeout(t); };
    }, [pair]);
    const go = p.onNavigate || noop;
    const Frame = S.ScreenFrame;
    if (!K.SettingsSection || !K.ListRow || !K.Button || !K.Badge || !Frame) return <div className="v2-acct-note">The kit or screens/home.jsx is not loaded.</div>;

    function say(title, o) { toast.show(Object.assign({ title: title, duration: p.preview ? 0 : undefined }, o || {})); }
    function back() { if (pushed) { setApp(null); setPushed(false); } else (p.onBack || noop)(); }
    function disconnect() { step.run(function () { setConfirm(false); setYs('disconnected'); say('YouTube disconnected'); }); }
    function answerHistory(v) {
      setAsking(false);
      setHist({ state: v, on: (w.today && w.today.date) || hist.on });
      if (v === 'allowed') say('Watch history on');
      if (v === 'revoked') say('Watch history off. BlueAI no longer sees your watch history, subscriptions or channel stats.', { tone: 'info' });
    }
    const title = app === 'youtube' ? 'YouTube' : app === 'telegram' ? 'Telegram' : 'Connected apps';
    const c = S.CONFIRM_COPY ? S.CONFIRM_COPY.disconnect(yt.handle) : null;
    const dialog = confirm && S.ConfirmDialog ? (
      <S.ConfirmDialog copy={c} step={step} preview={p.preview} onConfirm={disconnect}
        onCancel={function () { step.reset(); setConfirm(false); }} />
    ) : null;
    const pending = S.pendingBody ? S.pendingBody(p.state, 'your connected apps', p.onRetry) : null;
    const pairing = pair ? <PairDialog phase={pair} preview={p.preview} onRetry={function () { setPair('waiting'); }} onCancel={function () { setPair(null); }} /> : null;

    let content;
    if (pending) {
      content = pending;
    } else if (app === 'youtube') {
      content = <YouTube w={w} ys={ys} hist={hist} asking={asking} go={go} onAsk={function () { setAsking(true); }} onHistory={answerHistory}
        onDisconnect={function () { setConfirm(true); }} onConnect={function () { setYs('connected'); say('YouTube connected'); }}
        onOpenPlayer={function () { fixBlocked('signed-out', p.onFix, toast); }} />;
    } else if (app === 'telegram') {
      content = <Telegram tg={tg} onConnect={function () { setPair('waiting'); }}
        onDisconnect={function () {
          setTg('not-linked');
          say('Telegram disconnected', { action: { label: 'Undo', onClick: function () { setTg('linked'); } } });
        }} />;
    } else {
      content = (
        <React.Fragment>
          <K.SettingsSection id="apps" title="Your accounts" description="BlueAI acts on these accounts for you. It never sees or types your passwords.">
            <ConnectedAppRows worker={w} youtube={ys} telegram={tg} onOpen={function (id) { setApp(id); setPushed(true); }} />
          </K.SettingsSection>
          <p className="v2-acct-note">A new app starts on Always ask. Instagram turns on here when its jobs go live.</p>
        </React.Fragment>
      );
    }
    return (
      <Frame worker={w} tab="settings" frame={p.frame} compact={p.compact} landmark={p.landmark} onNavigate={p.onNavigate}
        loading={p.state === 'loading'} overlays={<React.Fragment>{dialog}{pairing}</React.Fragment>}>
        <div className="v2-acct">
          {K.ScreenHeader ? <K.ScreenHeader title={title} onBack={back} /> : null}
          <div className="v2-acct-body" ref={body}>{content}</div>
        </div>
      </Frame>
    );
  }

  window.V2Screens = window.V2Screens || {};
  Object.assign(window.V2Screens, { ConnectedApps, ConnectedAppRows, accountStates, fixBlocked });
})();
