/* BlueAI Product V2 Design System: Settings (section 61), and the confirm copy the account
   screens share. Partner topics first, in the order a partner looks for them (the worker, the
   accounts it uses, what it tells you, the app it drives, who you are, help), developer controls
   last behind one Advanced disclosure. Composed only from the kit; layout in screens/account.css.
   Every account screen (61 to 66) sits in V2Screens.ScreenFrame (home.jsx) inside one
   .v2-acct column, so the top bar, the menus and the nav behave the same on every screen.

   Settings {worker, state, bluestacks, telegram, highlight, onNavigate, onReport, onRetry, onFix, frame, compact, landmark, preview}
     worker      the Worker record (section 41); default V2Kit.workerFixtures.verified.
     state       'default' | 'advanced' (Advanced open) | 'no-bluestacks' (and scrolled to it) |
                 'report' (Help > Report a problem open: the sheet from help.jsx) | 'loading' |
                 'error' (pendingBody: the rows' shape, or LoadError with Try again).
     bluestacks  'connected' | 'not-installed' | 'signed-out': the worker's preflight (R13, R16),
                 never a fixed claim: without the prop, the record's blocked reason decides
                 (V2Screens.accountStates). telegram 'linked' | 'not-linked'.
     onFix(reason)  Open App Player and Get BlueStacks do what Home's fix does (fixBlocked).
     highlight   a section id ('worker', 'apps', 'notifications', 'bluestacks', 'account', 'help',
                 'advanced'): routed here. Scrolls it into view and holds the highlight; never
                 changes a value. With preview the look is forced and only the window scrolls.
     onNavigate(id, opts)  'worker-settings' | 'connected-apps' {app} | 'account', plus every chrome
                 event (ScreenFrame). The top bar's Report a problem opens the sheet here.
     preview     guide specimens: overlays draw in place without taking focus.
   CONFIRM_COPY  {signOut(email), disconnect(handle), leave(handle, endsOn, n), deleteData(n)} the
     one title, body, primary label and failure line per destructive confirm (section 52), read by
     Account, Connected apps and the guide, so a confirm is written once. n is numbers(record):
     leaving and deleting always state the $10 minimum; under it, what that means once you leave.
   useConfirmStep(forced)  {busy, failed, run(done), reset()}: a confirm's primary that does work,
     busy while it runs, then done or failed. forced 'busy' | 'failed' draws that cell (guide).
   ConfirmDialog {copy, step, preview, onCancel, onConfirm}  the AlertDialog for one
     CONFIRM_COPY entry; its commit is the solid primary named for what is lost (V3 restyle,
     2026-10-14: no red solid). busy holds Esc, the scrim and Cancel; a failure keeps the dialog, says so
     in a danger Banner and turns the primary into Try again.
   pendingBody(state, what, onRetry)  the account screens' 'loading' and 'error' bodies (section
     50), or null when the screen has its data.
   ConnectedAppRows (connected-apps.jsx) and ReportProblemSheet (help.jsx) are read at render. */
(function () {
  const { useState, useRef, useEffect } = React;
  const kit = function () { return window.V2Kit || {}; };
  const scr = function () { return window.V2Screens || {}; };
  const noop = function () {};

  function fixture(key) {
    const f = kit().workerFixtures || {};
    return f[key] || f.verified || {};
  }

  // Proposed copy, one owner per confirm (section 52). Each body says what changes, what is kept
  // and, where there is one, the way back. A disconnect is the partner's choice, so it is not
  // called a pause: the runs simply cannot start without the account (section 63).
  // Cash out after leaving follows the site's cashOutOpen (section 41, balance at least $10): open;
  // under the $10 minimum it cannot be cashed out once the partner leaves (PM and legal to confirm,
  // D3); null (every fixture today): the $10 rule only, never a claim about the balance.
  function cashLine(n) {
    const min = '$' + ((n && n.cashOutMin) || 10);
    if (n && n.cashOutOpen === false) return 'Your verified days stay on Earnings, but a balance under ' + min + ' can’t be cashed out once you leave.';
    if (n && n.cashOutOpen === true) return 'Verified days stay on Earnings, and cash out is open there.';
    return 'You need ' + min + ' to cash out. Check your balance on Earnings before you leave.';
  }
  const CONFIRM_COPY = {
    signOut: function (email) {
      return { title: 'Sign out of BlueAI?', confirm: 'Sign out', failed: 'Couldn’t sign out',
        body: 'Your worker pauses while you’re signed out, and days without a run don’t count toward your 20 days. Sign in again with ' + email + ' to pick up where you left off.' };
    },
    disconnect: function (handle) {
      return { title: 'Disconnect YouTube?', confirm: 'Disconnect', failed: 'Couldn’t disconnect YouTube',
        body: 'BlueAI stops using ' + handle + ', and daily runs can’t start until you connect YouTube again. Days without a run don’t count toward your 20 days.' };
    },
    leave: function (handle, endsOn, n) {
      return { title: 'Leave the program?', confirm: 'Leave the program', failed: 'Couldn’t leave the program',
        body: 'Your worker stops for good and BlueAI disconnects ' + handle + '. ' + cashLine(n) + ' To come back, apply again on the site.' };
    },
    deleteData: function (n) {
      return { title: 'Delete your data?', confirm: 'Delete my data', failed: 'Couldn’t delete your data',
        body: 'BlueAI deletes your run history, interest profile and agreement records, disconnects your accounts and takes you out of the program. ' + cashLine(n) + ' This can’t be undone.' };
    },
  };

  const WORK_MS = 900; // the prototype's stand-in for the server's answer
  function useConfirmStep(forced) {
    const [st, setSt] = useState(forced || null);
    const t = useRef(null);
    useEffect(function () { return function () { clearTimeout(t.current); }; }, []);
    return {
      busy: st === 'busy', failed: st === 'failed',
      run: function (done) { setSt('busy'); clearTimeout(t.current); t.current = setTimeout(function () { setSt(null); done(); }, WORK_MS); },
      reset: function () { clearTimeout(t.current); setSt(null); },
    };
  }

  function ConfirmDialog({ copy, step, preview, onCancel, onConfirm }) {
    const K = kit();
    if (!copy || !K.Dialog) return null;
    const s = step || {};
    return (
      <K.Dialog open preview={preview} variant="alert" title={copy.title} description={copy.body} busy={s.busy} onClose={onCancel}
        actions={[{ label: 'Cancel', onClick: onCancel }, { label: s.failed ? 'Try again' : copy.confirm, variant: 'primary', onClick: onConfirm }]}>
        {s.failed && K.Banner ? <K.Banner tone="danger" title={copy.failed}>Nothing changed. Try again in a moment.</K.Banner> : null}
      </K.Dialog>
    );
  }

  function pendingBody(state, what, onRetry) {
    const S = scr();
    if (state === 'loading') return S.ListSkeleton ? <S.ListSkeleton rows={4} label={'Loading ' + what} /> : null;
    if (state === 'error') return S.LoadError ? <S.LoadError what={what} onRetry={onRetry} /> : null;
    return null;
  }

  // One sentence for the worker row: when it runs and how it takes paid jobs, or that it is paused.
  function workerLine(w) {
    const K = kit();
    if (w.paused) return 'Paused until ' + w.paused.until + '. Paused days don’t count.';
    const r = w.runWindow || {};
    const when = r.kind === 'window' ? 'Runs daily between ' + r.label + '.'
      : r.kind === 'any' ? 'Runs once a day, at a time BlueAI picks.'
        : 'Runs daily at ' + (r.label || '11 am') + '.';
    return when + ' Paid jobs: ' + (K.modeSummary ? K.modeSummary(w).label : 'Always ask') + '.';
  }

  // The BlueStacks row says what is true on this PC (R16). V2 always says "Connected".
  const BLUESTACKS = {
    connected: { desc: 'To switch, open BlueAI from another instance.', badge: 'Connected' },
    'signed-out': { desc: 'App Player isn’t signed in to YouTube. Sign in there so today’s run can start.', act: 'Open App Player' },
    'not-installed': { desc: 'Not installed. BlueAI runs your jobs inside App Player, so today’s run can’t start without it.', act: 'Get BlueStacks', primary: true },
  };

  // Where a forced state scrolls the window to, so the state is in view (guide specimens).
  const SCROLL = { 'no-bluestacks': 'bluestacks', report: 'help', advanced: 'advanced' };

  const MODELS = [
    { value: 'auto', label: 'Auto' },
    { value: 'gemini-3.1-pro-preview', label: 'Gemini 3.1 Pro Preview' },
    { value: 'gpt-5.4-mini', label: 'GPT-5.4 Mini' },
    { value: 'claude-sonnet-4.6', label: 'Claude Sonnet 4.6' },
    { value: 'claude-opus-4.6', label: 'Claude Opus 4.6' },
    { value: 'gemini-3-flash-preview', label: 'Gemini 3 Flash Preview' },
    { value: 'gpt-5.4', label: 'GPT-5.4' },
  ];

  function Advanced({ open, onToggle }) {
    const K = kit();
    const [ai, setAi] = useState({ mode: 'cloud', status: 'idle' });
    const [byok, setByok] = useState({ on: false, keyInfo: null });
    const [model, setModel] = useState('auto');
    if (!K.AdvancedDisclosure) return null;
    return (
      <div data-section="advanced">
        <K.AdvancedDisclosure open={open} onToggle={onToggle}>
          {K.AiModePanel ? (
            <K.AiModePanel mode={ai.mode} status={ai.status} hwSupported conflict={false} pct={0}
              onPick={function (m) { setAi({ mode: m, status: 'idle' }); }} onMethod={noop} onDownload={noop}
              onCancel={function () { setAi({ mode: 'cloud', status: 'idle' }); }} onRetry={noop} />
          ) : null}
          {K.ByokPanel ? (
            <K.ByokPanel on={byok.on} keyInfo={byok.keyInfo}
              onToggle={function (on) { setByok(Object.assign({}, byok, { on: on })); }}
              onSave={function (k) { setByok({ on: true, keyInfo: { provider: k.provider, model: k.model, last4: String(k.key || '').slice(-4) } }); }}
              onRemove={function () { setByok({ on: false, keyInfo: null }); }} onCancel={noop} onModel={noop} />
          ) : null}
          {K.SettingsSection && K.Select ? (
            <K.SettingsSection title="Chat model" description="The model your chat replies use. Auto picks one for each message.">
              <K.Select label="Model" options={MODELS} value={model} onChange={setModel} />
            </K.SettingsSection>
          ) : null}
        </K.AdvancedDisclosure>
      </div>
    );
  }

  function Settings(props) {
    const Scope = scr().ToastScope;
    return Scope ? <Scope><SettingsScreen {...props} /></Scope> : <SettingsScreen {...props} />;
  }

  function SettingsScreen(props) {
    const K = kit();
    const p = props;
    const w = p.worker || fixture('verified');
    const [adv, setAdv] = useState(p.state === 'advanced' || p.highlight === 'advanced');
    const [report, setReport] = useState(p.state === 'report');
    const [notify, setNotify] = useState({ ask: true, end: true });
    const toast = (scr().useScreenToast || function () { return { show: noop }; })();
    const bs = p.bluestacks || (p.state === 'no-bluestacks' ? 'not-installed' : (scr().accountStates ? scr().accountStates(w).bluestacks : 'connected'));
    const hl = p.highlight || null;
    const go = p.onNavigate || noop;
    const Sec = K.SettingsSection;
    const Row = K.ListRow;
    const Frame = scr().ScreenFrame;
    if (!Sec || !Row || !Frame) return <div className="v2-acct-note">The kit or screens/home.jsx is not loaded.</div>;
    // Chrome events go to onNavigate; Report a problem opens this screen's own sheet, or the host's
    // (onReport) when Settings is drawn inside another screen's frame (Help).
    function openReport() { if (p.onReport) p.onReport(); else setReport(true); }
    function nav(id, opts) { if (id === 'report') openReport(); else go(id, opts); }

    function section(id, title, children, description) {
      return (
        <Sec id={id} title={title} description={description} highlight={!p.preview && hl === id}
          className={p.preview && hl === id ? 'is-highlighted' : undefined}>{children}</Sec>
      );
    }
    const b = BLUESTACKS[bs] || BLUESTACKS.connected;
    const fix = function () { if (scr().fixBlocked) scr().fixBlocked(bs === 'not-installed' ? 'no-bluestacks' : 'signed-out', p.onFix, toast); };
    const Apps = scr().ConnectedAppRows;
    const Report = scr().ReportProblemSheet;
    const ic = function (name) { return K.Icon ? <K.Icon name={name} size={16} /> : null; };
    const sw = function (key, label) {
      return K.Switch ? <K.Switch hideLabel label={label} checked={notify[key]}
        onChange={function (v) { setNotify(Object.assign({}, notify, { [key]: v })); }} /> : null;
    };
    const overlays = report && Report
      ? <Report open preview={p.preview} onClose={function () { setReport(false); }} onSent={function () { setReport(false); }} />
      : null;
    const pending = pendingBody(p.state, 'your settings', p.onRetry);

    return (
      <Frame worker={w} tab="settings" frame={p.frame} compact={p.compact} landmark={p.landmark} onNavigate={nav}
        loading={p.state === 'loading'} scrollTo={p.preview ? (hl || SCROLL[p.state] || null) : null} overlays={overlays}>
        <div className="v2-acct">
          {K.ScreenHeader ? <K.ScreenHeader title="Settings" /> : null}
          {pending ? <div className="v2-acct-body">{pending}</div> : <div className="v2-acct-body">
            {section('worker', 'Worker', (
              <Row label="BlueAI worker" description={workerLine(w)} leading={ic(w.paused ? 'pause' : 'calendar')}
                badge={w.paused && K.Badge ? <K.Badge tone="neutral">Paused</K.Badge> : null}
                onClick={function () { go('worker-settings'); }} />
            ))}
            {section('apps', 'Connected apps', Apps
              ? <Apps worker={w} telegram={p.telegram} onOpen={function (app) { go('connected-apps', { app: app }); }} />
              : null, 'The accounts BlueAI uses for you.')}
            {section('notifications', 'Notifications', [
              <Row key="ask" label="A paid job needs you" description="A job you don’t answer by 9 pm doesn’t count for today." trailing={sw('ask', 'A paid job needs you')} />,
              <Row key="end" label="Today’s run ends" description="Done, or stopped with a way to try again." trailing={sw('end', 'Today’s run ends')} />,
            ])}
            {section('bluestacks', 'BlueStacks', (
              <Row label="BlueStacks App Player" description={b.desc} mark={{ icon: 'monitor' }}
                badge={b.badge && K.Badge ? <K.Badge tone="success">{b.badge}</K.Badge> : null}
                trailing={b.act && K.Button ? <K.Button size="sm" variant={b.primary ? 'primary' : 'secondary'} onClick={fix}>{b.act}</K.Button> : null} />
            ))}
            {section('account', 'Account and privacy', (
              <Row label={(w.account && w.account.name) || 'Account'} description={w.account && w.account.email}
                leading={K.Avatar ? <K.Avatar name={w.account && w.account.name} size={32} decorative /> : null}
                onClick={function () { go('account'); }} />
            ))}
            {section('help', 'Help', [
              <Row key="faq" label="FAQ" leading={ic('help')} href={K.SITE_FAQ_URL} external />,
              <Row key="report" label="Report a problem" leading={ic('alert')} onClick={openReport} />,
            ])}
            <Advanced open={adv} onToggle={setAdv} />
          </div>}
        </div>
      </Frame>
    );
  }

  window.V2Screens = window.V2Screens || {};
  Object.assign(window.V2Screens, { Settings, CONFIRM_COPY, useConfirmStep, ConfirmDialog, pendingBody });
})();
