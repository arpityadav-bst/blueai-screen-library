/* BlueAI Product V2 Design System: Account and privacy (section 64).
   Who is signed in, the program they are in, the account BlueAI acts on, what BlueAI keeps about
   them and what they agreed to, the legal documents, and a Sign out that signs out. V2's Profile
   shows a gradient banner, an emoji avatar and a real staff member's details (profile.jsx:7-34),
   and its Logout confirm only closes the dialog (index.html:1000). Pushed over Settings with Back;
   also opened from the top bar's More menu (Account).

   Account {worker, state, onBack, onNavigate, onSignOut, frame, compact, landmark, preview}
     state  'view' (default) | 'signout' (the confirm open) | 'signed-out' (signed out: the worker is
            paused and the window lands on Welcome, section 67).
     onNavigate('connected-apps', {app}) | ('worker-settings').  onSignOut() after the confirm. */
(function () {
  const { useState } = React;
  const kit = function () { return window.V2Kit || {}; };
  const noop = function () {};
  // V2's legal page (terms_sheet.jsx:32) and its two anchors (terms_sheet.jsx:67-68).
  const TERMS_URL = '/onblue/terms';

  function fixture() { const f = kit().workerFixtures || {}; return f.verified || {}; }

  class Fallback extends React.Component {
    constructor(p) { super(p); this.state = { failed: false }; }
    static getDerivedStateFromError() { return { failed: true }; }
    render() { return this.state.failed ? this.props.fallback : this.props.children; }
  }

  // Signed out: the system's Welcome when it is loaded, otherwise the same promise in one block.
  function SignedOut({ worker, compact, landmark }) {
    const K = kit();
    const W = (window.V2Screens || {}).Welcome;
    const email = worker.account && worker.account.email;
    const own = (
      <K.AppFrame compact={compact} landmark={landmark}>
        <div className="v2-acct-out">
          {K.EmptyState ? <K.EmptyState variant="locked" icon="sign-out" title="You’re signed out"
            body={'Your worker is paused. Sign in with ' + email + ' to pick up your 20 days.'}
            primaryAction={{ label: 'Sign in', onClick: noop }} /> : null}
        </div>
      </K.AppFrame>
    );
    return W ? <Fallback fallback={own}><W compact={compact} landmark={landmark} /></Fallback> : own;
  }

  function Account(props) {
    const K = kit();
    const p = props;
    const w = p.worker || fixture();
    const [confirm, setConfirm] = useState(p.state === 'signout');
    const [out, setOut] = useState(p.state === 'signed-out');
    const Frame = (window.V2Screens || {}).AccountFrame;
    const Sec = K.SettingsSection;
    const Row = K.ListRow;
    if (!Sec || !Row || !Frame || !K.AppFrame) return <div className="v2-acct-note">The kit is not loaded.</div>;
    if (out) return <SignedOut worker={w} compact={p.compact} landmark={p.landmark} />;

    const go = p.onNavigate || noop;
    const a = w.account || {};
    const yt = (w.apps && w.apps.youtube) || {};
    const n = K.numbers ? K.numbers(w) : { done: 7, target: 20, endsOn: 'Nov 1' };
    const auto = K.modeSummary ? K.modeSummary(w).mode === 'auto' : false;
    const ic = function (name) { return K.Icon ? <K.Icon name={name} size={16} /> : null; };
    function signOut() { setConfirm(false); setOut(true); (p.onSignOut || noop)(); }

    const dialog = confirm && K.Dialog ? (
      <K.Dialog open preview={p.preview} variant="alert" title="Sign out?" onClose={function () { setConfirm(false); }}
        description={'Your worker pauses while you’re signed out, and days without a run don’t count toward your 20 days. Sign in again with ' + a.email + ' to pick up where you left off.'}
        actions={[{ label: 'Cancel', onClick: function () { setConfirm(false); } }, { label: 'Sign out', variant: 'primary', onClick: signOut }]} />
    ) : null;

    return (
      <Frame worker={w} tab="settings" frame={p.frame} compact={p.compact} landmark={p.landmark} overlays={dialog}>
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
          <Sec id="privacy" title="Privacy" description="What BlueAI keeps about you, and what you agreed to.">
            <Row label="Interest profile" description="4 topics from your watch history" onClick={function () { go('worker-settings'); }} />
            <Row label="Watch history" value={yt.history === 'notnow' ? 'Not allowed' : 'Allowed'}
              onClick={function () { go('connected-apps', { app: 'youtube' }); }} />
            <Row label="What you agreed to" expandable>
              <ul className="v2-acct-record">
                <li><span>Program Terms, agreed</span><span>Oct 6</span></li>
                <li><span>Privacy Policy, acknowledged</span><span>Oct 6</span></li>
                <li><span>Watch history, allowed</span><span>Oct 6</span></li>
                <li><span>Automatic</span><span>{auto ? 'On for YouTube' : 'Off on every app'}</span></li>
              </ul>
            </Row>
          </Sec>
          <div className="v2-acct-links">
            {K.Link ? <K.Link href={TERMS_URL + '#program'} external>Program Terms</K.Link> : null}
            {K.Link ? <K.Link href={TERMS_URL + '#privacy'} external>Privacy Policy</K.Link> : null}
          </div>
          {K.Card ? (
            <K.Card padding="none">
              <Row label="Sign out" leading={ic('sign-out')} onClick={function () { setConfirm(true); }} />
            </K.Card>
          ) : null}
        </div>
      </Frame>
    );
  }

  window.V2Screens = window.V2Screens || {};
  Object.assign(window.V2Screens, { Account });
})();
