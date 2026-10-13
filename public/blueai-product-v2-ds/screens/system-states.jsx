/* BlueAI Product V2 Design System: system and program states (section 69, New). The screens no V2
   path designs: what the app says when it cannot reach the internet, when a screen fails, when an
   update is ready or required, when the account is not in the program, and around the program's
   end. Every state keeps the top bar (and the nav when there is somewhere to go), so the partner is
   never stranded, and says what it means for today and the one next step.
   Built from kit parts (EmptyState, Banner, WorkerCard, ProgramStrip, Button) inside
   V2Screens.ScreenFrame, the one window every signed-in screen uses; CHROME sets the chip, the
   credits and the nav per state. Layout lives in screens/entry.css. Copy is proposed copy except
   where a comment names V2. Spec: design-md/69-system-states.md.

   SystemStates {state, worker, screen, busy, compact, reduced, preview, landmark, onNavigate,
                onRetry, onReport, onUpdate, onRestart, onSwitch}
     state  offline | error | update-optional | update-required | not-in-program | complete |
            period-ended | period-under | between-programs (SYSTEM_STATES lists them)
     screen the screen that failed to load, for error ('Home' by default).
     Cash out follows the site's one rule (onblue/apply.html:2277-2296): it opens only when the
     period has ended AND the balance is at least $10; under it, the balance carries over, in the
     site's words. With a worker, period-ended picks the variant from numbers().reachedMinimum.
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
    ['period-ended', 'Period ended, cash out open'],
    ['period-under', 'Period ended, under $10'],
    ['between-programs', 'Between programs'],
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
    'period-ended': { status: null, credits: false, nav: true },
    'period-under': { status: null, credits: false, nav: true },
    'between-programs': { status: null, credits: false, nav: true },
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
      case 'period-under': { // under the minimum: the site's words, apply.html:2292-2293
        const open = state === 'period-ended';
        const n = k.numbers ? k.numbers(w || fixture(open ? 'ended' : 'endedBelow')) : { verified: open ? 18 : 6, target: 20, endsOn: 'Nov 1' };
        return {
          center: true,
          node: empty({
            variant: 'first', icon: 'calendar', title: 'This program ended on ' + n.endsOn,
            body: 'You finished ' + n.verified + ' of ' + n.target + ' days. ' + (open ? 'Cash out is open on the Earnings page.' : 'You need $10 to cash out. Your balance carries over to the next period.'),
            primaryAction: open ? earnings : null, secondaryAction: open ? null : earnings,
          }),
        };
      }
      default: // between-programs. Dec 1 is a PM-supplied value.
        return {
          center: true,
          node: empty({
            variant: 'first', icon: 'clock', title: 'No program running right now',
            body: 'The next one starts Dec 1. Your BlueAI worker starts it once you agree to its Program Terms.',
            secondaryAction: earnings,
          }),
        };
    }
  }

  // Cash out is open only when the period has ended and the balance reached the minimum.
  function resolve(state, w) {
    const k = K();
    if (state !== 'period-ended' || !w || !k.numbers) return state;
    return k.numbers(w).reachedMinimum === false ? 'period-under' : state;
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
