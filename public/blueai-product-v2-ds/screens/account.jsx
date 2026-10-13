/* BlueAI Product V2 Design System: Account and privacy (section 64).
   Who is signed in, the program they are in, the account BlueAI acts on, what BlueAI keeps about
   them and what they agreed to, the way to leave, the legal documents, and a Sign out that signs
   out. V2's Profile shows a gradient banner, an emoji avatar and a real staff member's details
   (profile.jsx:7-34), and its Logout confirm only closes the dialog (index.html:1000). Pushed over
   Settings with Back; also opened from the top bar's More menu (Account).

   Account {worker, state, onBack, onNavigate, onSignOut, onLeave, onDeleteData, frame, compact,
            landmark, preview}
     state  'view' (default) | 'signout' | 'leave' | 'delete' (that confirm open) |
            'history-revoked' (watch history turned off in Connected apps) | 'signed-out' (signed
            out: the worker is paused and the window lands on Welcome's signed-out variant, 67).
     Watch history reads the record exactly: allowed is Allowed; notnow, revoked and not asked yet
     (a new partner) are Not allowed. The agreement record lists it with the day it was decided.
     Leaving the program and deleting data are the withdrawal the consent rules put here
     (section 53): danger AlertDialogs with CONFIRM_COPY (settings.jsx).
     onNavigate('connected-apps', {app}) | ('worker-settings'), plus every chrome event. */
(function () {
  const { useState } = React;
  const kit = function () { return window.V2Kit || {}; };
  const noop = function () {};
  // V2's legal page (terms_sheet.jsx:32) and its two anchors (terms_sheet.jsx:67-68).
  const TERMS_URL = '/onblue/terms';
  // The history line per record value: [Privacy row value, record line].
  const HISTORY = {
    allowed: ['Allowed', 'Watch history, allowed'],
    notnow: ['Not allowed', 'Watch history, not allowed'],
    revoked: ['Not allowed', 'Watch history, turned off'],
    none: ['Not allowed', 'Watch history, not asked yet'],
  };

  function fixture(state) {
    const f = kit().workerFixtures || {};
    const w = f.verified || {};
    if (state !== 'history-revoked') return w;
    if (f.revoked) return f.revoked;
    const yt = Object.assign({}, (w.apps || {}).youtube, { history: 'revoked', historyOn: 'Oct 11' });
    return Object.assign({}, w, { apps: Object.assign({}, w.apps, { youtube: yt }) });
  }

  class Fallback extends React.Component {
    constructor(p) { super(p); this.state = { failed: false }; }
    static getDerivedStateFromError() { return { failed: true }; }
    render() { return this.state.failed ? this.props.fallback : this.props.children; }
  }

  // Signed out: Welcome's signed-out variant (section 67), otherwise the same promise in one block.
  function SignedOut({ worker, compact, landmark }) {
    const K = kit();
    const W = (window.V2Screens || {}).Welcome;
    const email = (worker.account && worker.account.email) || 'the account you applied with';
    const own = K.AppFrame ? (
      <K.AppFrame compact={compact} landmark={landmark}>
        <div className="v2-acct-out">
          {K.EmptyState ? <K.EmptyState variant="locked" icon="sign-out" title="You’re signed out"
            body={'Your worker is paused, and days without a run don’t count toward your 20 days.'}
            primaryAction={{ label: 'Sign in as ' + email, onClick: noop }} /> : null}
        </div>
      </K.AppFrame>
    ) : null;
    return W ? <Fallback fallback={own}><W signedOut={email} compact={compact} landmark={landmark} /></Fallback> : own;
  }

  function Account(props) {
    const Scope = (window.V2Screens || {}).ToastScope;
    return Scope ? <Scope><AccountScreen {...props} /></Scope> : <AccountScreen {...props} />;
  }

  function AccountScreen(props) {
    const K = kit();
    const p = props;
    const w = p.worker || fixture(p.state);
    const [confirm, setConfirm] = useState({ signout: 'signout', leave: 'leave', delete: 'delete' }[p.state] || null);
    const [out, setOut] = useState(p.state === 'signed-out');
    const S = window.V2Screens || {};
    const toast = (S.useScreenToast || function () { return { show: noop }; })();
    const Frame = S.ScreenFrame;
    const Sec = K.SettingsSection;
    const Row = K.ListRow;
    if (!Sec || !Row || !Frame || !K.AppFrame) return <div className="v2-acct-note">The kit or screens/home.jsx is not loaded.</div>;
    if (out) return <SignedOut worker={w} compact={p.compact} landmark={p.landmark} />;

    const go = p.onNavigate || noop;
    const a = w.account || {};
    const yt = (w.apps && w.apps.youtube) || {};
    const n = K.numbers ? K.numbers(w) : { done: 7, target: 20, endsOn: 'Nov 1' };
    const auto = K.modeSummary ? K.modeSummary(w).mode === 'auto' : false;
    const hist = HISTORY[yt.history] || HISTORY.none;
    const histOn = yt.history ? (yt.historyOn || 'Oct 6') : '';
    const ic = function (name) { return K.Icon ? <K.Icon name={name} size={16} /> : null; };
    const copy = S.CONFIRM_COPY || {};
    function nav(id, opts) { if (id === 'sign-out') setConfirm('signout'); else go(id, opts); }

    // The confirm that is open: its copy, its primary's tone, and what confirming does.
    const confirms = {
      signout: [copy.signOut && copy.signOut(a.email), 'primary', function () { setConfirm(null); setOut(true); (p.onSignOut || noop)(); }],
      leave: [copy.leave && copy.leave(yt.handle || 'your YouTube account', n.endsOn), 'danger', function () {
        setConfirm(null); if (p.onLeave) p.onLeave(); else toast.show({ title: 'You’ve left the program.', tone: 'info' });
      }],
      delete: [copy.deleteData && copy.deleteData(), 'danger', function () {
        setConfirm(null); if (p.onDeleteData) p.onDeleteData(); else toast.show({ title: 'Your data is being deleted. We’ll email you when it’s done.', tone: 'info' });
      }],
    };
    const c = confirm && confirms[confirm];
    const dialog = c && c[0] && K.Dialog ? (
      <K.Dialog open preview={p.preview} variant="alert" title={c[0].title} description={c[0].body}
        onClose={function () { setConfirm(null); }}
        actions={[{ label: 'Cancel', onClick: function () { setConfirm(null); } }, { label: c[0].confirm, variant: c[1], onClick: c[2] }]} />
    ) : null;

    return (
      <Frame worker={w} tab="settings" frame={p.frame} compact={p.compact} landmark={p.landmark} overlays={dialog}
        onNavigate={nav}>
        <div className="v2-acct">
          {K.ScreenHeader ? <K.ScreenHeader title="Account" onBack={p.onBack || noop} /> : null}
          <div className="v2-acct-body">
            <div className="v2-acct-id">
              {K.Avatar ? <K.Avatar name={a.name} size={56} decorative /> : null}
              <div className="v2-acct-id-text">
                <p className="v2-acct-id-name">{a.name}</p>
                <p className="v2-acct-id-email">{a.email}</p>
              </div>
            </div>
            <Sec id="program" title="Program">
              <Row label="Partner Starter Program" description={n.done + ' of ' + n.target + ' days. Ends ' + n.endsOn + '.'}
                href={K.EARNINGS_URL} external />
            </Sec>
            <Sec id="connected" title="Connected account">
              <Row leading={K.Avatar ? <K.Avatar app="youtube" size={32} decorative /> : null} label="YouTube"
                description={yt.handle || 'Not connected'} onClick={function () { go('connected-apps', { app: 'youtube' }); }} />
            </Sec>
            <Sec id="privacy" title="Privacy" description="What BlueAI keeps about you, what you agreed to, and how to leave.">
              <Row label="Interest profile" description="4 topics from your watch history" onClick={function () { go('worker-settings'); }} />
              <Row label="Watch history" value={hist[0]} onClick={function () { go('connected-apps', { app: 'youtube' }); }} />
              <Row label="What you agreed to" expandable>
                <ul className="v2-acct-record">
                  <li><span>Program Terms, agreed</span><span>Oct 6</span></li>
                  <li><span>Privacy Policy, acknowledged</span><span>Oct 6</span></li>
                  <li><span>{hist[1]}</span><span>{histOn}</span></li>
                  <li><span>Automatic</span><span>{auto ? 'On for YouTube' : 'Off on every app'}</span></li>
                </ul>
              </Row>
              <Row label="Leave the program" danger onClick={function () { setConfirm('leave'); }} />
              <Row label="Delete my data" danger onClick={function () { setConfirm('delete'); }} />
            </Sec>
            <div className="v2-acct-links">
              {K.Link ? <K.Link href={TERMS_URL + '#program'} external>Program Terms</K.Link> : null}
              {K.Link ? <K.Link href={TERMS_URL + '#privacy'} external>Privacy Policy</K.Link> : null}
            </div>
            {K.Card ? (
              <K.Card padding="none">
                <Row label="Sign out" leading={ic('sign-out')} onClick={function () { setConfirm('signout'); }} />
              </K.Card>
            ) : null}
          </div>
        </div>
      </Frame>
    );
  }

  window.V2Screens = window.V2Screens || {};
  Object.assign(window.V2Screens, { Account });
})();
