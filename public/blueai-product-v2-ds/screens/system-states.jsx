/* BlueAI Product V2 Design System: system and program states (section 69, New). The screens no V2
   path designs: what the app says when it cannot reach the internet, when a screen fails, when an
   update is ready or required, when the account is not in the program, and around the program's
   end. Every state keeps the top bar (and the nav when there is somewhere to go), so the partner is
   never stranded, and says what it means for today and the one next step.
   Built from kit parts (EmptyState, Banner, WorkerCard, ProgramStrip, Button) inside
   V2Screens.ScreenFrame, the one window every signed-in screen uses; CHROME sets the chip, the
   credits and the nav per state. Layout lives in screens/entry.css. Copy is proposed copy except
   where a comment names V2. Spec: design-md/69-system-states.md.

   SystemStates {state, worker, screen, busy, deleting, compact, reduced, preview, landmark,
                onNavigate, onRetry, onReport, onUpdate, onRestart, onSwitch}
     state  offline | error | update-optional | update-required | not-in-program | complete |
            period-ended | period-under | between-programs | left-program (SYSTEM_STATES)
     screen the screen that failed to load, for error ('Home' by default).
     Cash out follows the site's one rule (onblue/apply.html:1371, 2317): any time the balance is
     at least $10; under it, "You need $10 to cash out." It is not tied to the program's end.
     period-ended is the program ended with the balance at $10 or more, period-under the program
     ended with it under $10. With a worker, the site's numbers().cashOutOpen picks (null: where to look).
     The program-ended words are one set, V2Kit.endedCopy (section 41): the verified count, since
     the balance depends on it, and a last day still being checked said so.
     Home shows this state, not a card, once the program is over.
     not-in-program  Switch account, and a quiet Get help (the site's FAQ) for a partner who
            believes this is the account they applied with, or has lost access to it.
     left-program  after Leave the program or Delete my data (Account, section 64): the worker
            has stopped, what happens to the balance (the $10 minimum always stated), Earnings,
            and Apply again on the site.
            deleting adds that the data is being deleted.
     busy   the primary action is working (Try again, Update now, Switch account)
   SYSTEM_STATES [[key, label]] in the order the guide shows them. */
(function () {
  const K = () => window.V2Kit || {};
  const cx = function () { return Array.prototype.filter.call(arguments, Boolean).join(' '); };

  const SYSTEM_STATES = [
    ['offline', 'Offline, nothing cached'],
    ['error', 'Screen failed'],
    ['update-optional', 'Update ready'],
    ['update-required', 'Update required'],
    ['not-in-program', 'Not in the program'],
    ['complete', 'Program complete'],
    ['period-ended', 'Program ended, $10 or more'],
    ['period-under', 'Program ended, under $10'],
    ['between-programs', 'Between programs'],
    ['left-program', 'Left the program'],
  ];

  function fixture(key) {
    const fx = K().workerFixtures || {};
    return fx[key] || fx.verified || null;
  }

  // Chrome per state: which status the top bar says, whether credits and the nav make sense.
  const CHROME = {
    offline: { status: 'offline', credits: false, nav: true },
    error: { status: 'scheduled', label: 'Next run 11 am', credits: true, nav: true },
    'update-optional': { status: 'scheduled', label: 'Next run 11 am', credits: true, nav: true },
    'update-required': { status: 'paused', label: 'Update needed', credits: true, nav: true },
    'not-in-program': { status: null, credits: false, nav: false },
    complete: { status: 'verified', label: 'All 20 days done', credits: true, nav: true },
    'period-ended': { status: 'ended', credits: false, nav: true }, // section 30's one rule: 'Period ended'
    'period-under': { status: 'ended', credits: false, nav: true },
    'between-programs': { status: null, credits: false, nav: true },
    'left-program': { status: null, credits: false, nav: false },
  };

  function action(label, onClick, busy, extra) {
    return Object.assign({ label: label, onClick: onClick, loading: !!busy }, extra || {});
  }

  function body(state, p) {
    const k = K();
    const Empty = k.EmptyState;
    const B = k.Banner;
    const w = p.worker;
    const earnings = { label: 'Earnings', href: k.EARNINGS_URL, external: true };
    const empty = function (o) { return Empty ? <Empty headingLevel={1} {...o} /> : null; };
    switch (state) {
      case 'offline':
        return {
          center: true,
          node: empty({
            variant: 'offline', title: 'You’re offline',
            body: 'BlueAI can’t reach the internet, so there’s nothing to show yet. Today’s run starts when you’re back online.',
            primaryAction: action('Try again', p.onRetry, p.busy),
          }),
        };
      case 'error':
        return {
          center: true,
          node: empty({
            variant: 'error', title: 'Couldn’t load ' + (p.screen || 'Home'),
            body: 'Nothing is lost: today’s run and your days are not affected.',
            primaryAction: action('Try again', p.onRetry, p.busy),
            secondaryAction: action('Report a problem', p.onReport),
          }),
        };
      case 'update-optional':
        return {
          node: (
            <>
              {B ? (
                <B tone="info" icon="download" title="An update is ready" className="v2-sys-banner"
                  action={{ label: 'Restart now', onClick: p.onRestart }}>
                  It installs the next time BlueAI starts. Today’s run isn’t affected.
                </B>
              ) : null}
              {k.WorkerCard ? <k.WorkerCard worker={w || fixture('setUp')} state="scheduled" /> : null}
              {k.ProgramStrip ? <k.ProgramStrip worker={w || fixture('verified')} /> : null}
            </>
          ),
        };
      case 'update-required':
        return {
          center: true,
          node: empty({
            variant: 'locked', icon: 'download', title: 'Update BlueAI to keep running',
            body: 'This version can’t run jobs anymore, so runs are paused. Update now and today can still count. It takes about a minute.',
            primaryAction: action('Update now', p.onUpdate, p.busy),
          }),
        };
      case 'not-in-program':
        return {
          center: true,
          node: (
            <>
              {empty({
                variant: 'locked', icon: 'user', title: 'This account isn’t in the program',
                body: 'You’re signed in as alex@morganmedia.example. BlueAI runs on the account you applied with.',
                primaryAction: action('Switch account', p.onSwitch, p.busy),
                secondaryAction: { label: 'Get help', href: k.SITE_FAQ_URL, external: true },
              })}
              <p className="v2-sys-note">App Player will be signed out too.</p>
            </>
          ),
        };
      case 'complete':
        return {
          node: (
            <>
              {k.WorkerCard ? <k.WorkerCard worker={w || fixture('complete')} state="complete" /> : null}
              {k.ProgramStrip ? <k.ProgramStrip worker={w || fixture('complete')} /> : null}
            </>
          ),
        };
      case 'period-ended':
      case 'period-under': { // under the minimum: the site's words, apply.html:2317
        const open = state === 'period-ended';
        const base = k.numbers ? k.numbers(w || fixture(open ? 'ended' : 'endedBelow')) : { verified: open ? 18 : 6, pending: 0, target: 20, endsOn: 'Nov 1', cashOutMin: 10 };
        const cash = w ? base.cashOutOpen : open; // a worker: the site's answer; a specimen: its variant
        const c = k.endedCopy ? k.endedCopy(Object.assign({}, base, { cashOutOpen: cash })) : {};
        return {
          center: true,
          node: empty({
            variant: 'first', icon: 'calendar', title: c.title, body: c.body,
            primaryAction: cash === false ? null : earnings, secondaryAction: cash === false ? earnings : null,
          }),
        };
      }
      case 'left-program': { // proposed copy; the cash-out line is CONFIRM_COPY's (settings.jsx)
        const n = k.numbers ? k.numbers(w || fixture('verified')) : { cashOutOpen: null, endsOn: 'Nov 1', cashOutMin: 10 };
        const cash = n.cashOutOpen === true ? 'Your verified days stay on Earnings, and cash out is open there.'
          : n.cashOutOpen === false ? 'Your balance is under $' + n.cashOutMin + ', so it can’t be cashed out.'
            : 'You need $' + n.cashOutMin + ' to cash out. See your balance on Earnings.';
        return {
          center: true,
          node: empty({
            variant: 'first', icon: 'sign-out', title: 'You’ve left the program',
            body: 'Your worker has stopped and BlueAI no longer uses your accounts. ' + cash + (p.deleting ? ' Your data is being deleted. We’ll email you when it’s done.' : ''),
            primaryAction: n.cashOutOpen === false ? null : earnings,
            secondaryAction: { label: 'Apply again', href: String(k.SITE_FAQ_URL || '').split('#')[0], external: true },
          }),
        };
      }
      default: // between-programs. Dec 1 is a PM-supplied value.
        return {
          center: true,
          node: empty({
            variant: 'first', icon: 'clock', title: 'No program running right now',
            body: 'The next one starts Dec 1. We’ll ask you to agree to its Program Terms then, and your worker starts once you do.',
            secondaryAction: earnings,
          }),
        };
    }
  }

  // Cash out is open only when the site says the balance is at least $10 (cashOutOpen); false is under it.
  function resolve(state, w) {
    const k = K();
    if (state !== 'period-ended' || !w || !k.numbers) return state;
    return k.numbers(w).cashOutOpen === false ? 'period-under' : state;
  }

  function SystemStates(props) {
    const p = props || {};
    const Frame = (window.V2Screens || {}).ScreenFrame;
    const state = resolve(CHROME[p.state] ? p.state : 'offline', p.worker);
    const chrome = CHROME[state];
    const b = body(state, p);
    const content = <div className={cx('v2-sys', b.center && 'v2-sys--center')}>{b.node}</div>;
    if (!Frame) return content;
    return (
      <Frame worker={p.worker || fixture('verified')} tab="home" compact={p.compact} landmark={p.landmark}
        onNavigate={p.onNavigate} nav={chrome.nav} status={chrome.status} statusLabel={chrome.label || null}
        credits={chrome.credits ? undefined : null} className={cx('v2-root', p.reduced && 'v2-reduced-motion')}>
        {content}
      </Frame>
    );
  }

  window.V2Screens = window.V2Screens || {};
  Object.assign(window.V2Screens, { SystemStates, SYSTEM_STATES });
})();
