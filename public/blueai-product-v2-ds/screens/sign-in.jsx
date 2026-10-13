/* BlueAI Product V2 Design System: the in-app sign-in steps (section 68), the app's side of the
   ROB-21388 handoff (pattern: section 56). The kit Dialog on the frost scrim (the site's sign-in
   gate veil, the only frosted surface in the product) over the signed-out Welcome.
   Built only from kit parts: AppFrame, Dialog (scrim frost), Banner, Spinner, Icon, Avatar, Badge,
   Card, Link. Layout lives in screens/entry.css. Spec: design-md/68-sign-in-screens.md.

   SignIn {step 'browser' | 'signing' | 'success' | 'gate' | 'confirm', from 'browser' | 'player',
          account, otherAccount, onOpenBrowser, onCancel, onSwitch, onContinue, onDone, doneAfter,
          compact, reduced, preview, landmark, under}
     browser  the browser is open; one action, Open the browser again. Close cancels.
     signing  the account is being checked (V2: 1500 ms). Close cancels.
     success  says so and moves on by itself after doneAfter ms (900): no extra click.
     gate     signed in with an account that is not in the program. Blocking, one way out.
     confirm  option B (decision D5): App Player is signed in, so ask before using that account.
     from     where the gate's account came from: 'player' adds "from App Player on this PC".
     under    what the frost covers (default: the Welcome content, not interactive). */
(function () {
  const { useEffect, useId } = React;
  const K = () => window.V2Kit || {};
  const cx = function () { return Array.prototype.filter.call(arguments, Boolean).join(' '); };

  // One neutral identity (R39). The gate's account is the same person on another Google account.
  function accounts() {
    const fx = K().workerFixtures || {};
    const main = (fx.verified && fx.verified.account) || { name: 'Alex Morgan', first: 'Alex', email: 'alex@example.com' };
    return { main: main, other: { name: main.name, first: main.first, email: 'alex@morganmedia.example' } };
  }

  function Mark({ icon, tone }) {
    const I = K().Icon;
    return <span className={cx('v2-gate-mark', tone && 'v2-gate-mark--' + tone)} aria-hidden="true">{I ? <I name={icon} size={24} /> : null}</span>;
  }

  function Text({ titleId, title, body }) {
    return (
      <div className="v2-gate-text">
        <h2 className="v2-gate-title" id={titleId}>{title}</h2>
        {body ? <p className="v2-gate-body">{body}</p> : null}
      </div>
    );
  }

  // Copy: V2 where V2 has the line (login.jsx:230-275, account_gate.jsx:22-58), quoted exactly;
  // the rest is proposed copy, marked in design-md/68-sign-in-screens.md.
  function stepContent(p, ids, acc) {
    const k = K();
    switch (p.step) {
      case 'signing':
        return {
          closable: true,
          body: (
            <div className="v2-gate">
              <span className="v2-gate-mark v2-gate-mark--plain" aria-hidden="true">{k.Spinner ? <k.Spinner size={32} delay={0} /> : null}</span>
              <Text titleId={ids.title} title="Signing in…" body="Checking that this account is in the program." />
            </div>
          ),
        };
      case 'success':
        return {
          closable: false,
          body: (
            <div className="v2-gate v2-gate--top">
              <Mark icon="check" tone="success" />
              <Text titleId={ids.title} title="You’re signed in" body={acc.main.email} />
            </div>
          ),
        };
      case 'gate': {
        const a = p.account || acc.other;
        return {
          closable: false,
          actions: [{ label: 'Switch account', variant: 'primary', onClick: p.onSwitch }],
          body: (
            <div className="v2-gate v2-gate--top">
              {k.Avatar ? <k.Avatar name={a.name} id={a.email} size={56} decorative /> : null}
              <div className="v2-gate-text" id={ids.title}>
                <p className="v2-gate-body">Signed in as</p>
                <p className="v2-gate-email">{a.email}</p>
                {p.from === 'player' ? <p className="v2-gate-body">from App Player on this PC</p> : null}
              </div>
              {k.Badge ? <k.Badge tone="neutral">Not in the program</k.Badge> : null}
              <p className="v2-gate-body">BlueAI works with the account you applied with.</p>
              <p className="v2-gate-note">App Player will be signed out too.</p>
            </div>
          ),
        };
      }
      case 'confirm': {
        const a = p.account || acc.main;
        const Card = k.Card || 'button';
        return {
          closable: false,
          body: (
            <div className="v2-gate v2-gate--top">
              <Text titleId={ids.title} title="Continue to BlueAI" body="Signed in on App Player on this PC" />
              <Card className="v2-gate-account" padding="sm" onClick={p.onContinue}>
                {k.Avatar ? <k.Avatar name={a.name} id={a.email} size={32} decorative /> : null}
                <span className="v2-gate-account-text">
                  <span className="v2-gate-account-name">Continue as {a.first}</span>
                  <span className="v2-gate-account-email">{a.email}</span>
                </span>
                <span className="v2-gate-account-chev" aria-hidden="true">{k.Icon ? <k.Icon name="chevron-right" size={16} /> : null}</span>
              </Card>
              <p className="v2-gate-body">Not you? {k.Link ? <k.Link onClick={p.onSwitch}>Switch account</k.Link> : null}</p>
            </div>
          ),
        };
      }
      default: // browser
        return {
          closable: true,
          actions: [{ label: 'Open the browser again', variant: 'secondary', onClick: p.onOpenBrowser }],
          body: (
            <div className="v2-gate">
              <Mark icon="external" />
              <Text titleId={ids.title} title="Check your browser" body="Finish signing in from your web browser." />
              {k.Banner ? <k.Banner tone="info">Use the account you applied with</k.Banner> : null}
            </div>
          ),
        };
    }
  }

  function SignIn(props) {
    const p = Object.assign({ step: 'browser', from: 'browser', doneAfter: 900 }, props || {});
    const k = K();
    const uid = useId();
    const ids = { title: uid + '-t' };
    const acc = accounts();
    // Success moves on by itself: the browser already said "You're signed in" (ROB-21388), so a
    // second confirmation is a stop, not information. A timer, not motion: reduced motion keeps it.
    useEffect(function () {
      if (p.step !== 'success' || p.preview || !p.onDone) return undefined;
      const t = setTimeout(p.onDone, p.doneAfter);
      return function () { clearTimeout(t); };
    }, [p.step, p.preview]);

    const c = stepContent(p, ids, acc);
    const D = k.Dialog;
    const gate = D ? (
      <D open preview={p.preview} variant="task" size="md" scrim="frost" labelledBy={ids.title}
        dismissible={c.closable} onClose={p.onCancel} actions={c.actions}
        className={cx('v2-signin', 'v2-signin--' + p.step)}>
        <div aria-live="polite">{c.body}</div>
      </D>
    ) : null;
    const Body = window.V2Screens && window.V2Screens.Welcome && window.V2Screens.Welcome.Body;
    const under = p.under || (Body ? <div inert="" aria-hidden="true"><Body animate={false} /></div> : null);
    const Frame = k.AppFrame;
    if (!Frame) return gate;
    return (
      <Frame compact={p.compact} landmark={p.landmark} overlays={gate}
        className={cx('v2-root', p.reduced && 'v2-reduced-motion')}>
        {under}
      </Frame>
    );
  }

  window.V2Screens = window.V2Screens || {};
  Object.assign(window.V2Screens, { SignIn, SIGN_IN_STEPS: ['browser', 'signing', 'success', 'gate', 'confirm'] });
})();
