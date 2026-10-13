/* BlueAI Product V2 Design System: Welcome, the signed-out start (section 67), and the Program
   Terms sheet that covers it on first run (consent pattern, section 53).
   Built only from kit parts: AppFrame (chrome-free), BrandMark, Card, Button, Link, Sheet, Banner.
   Layout lives in screens/entry.css. Spec: design-md/67-welcome.md, 53-consent.md.

   Welcome      {terms: null | 'firstrun' | 'update', termsBusy, termsError, headline 'pm' | 'proposed',
                signedOut, onSignIn, onAgree, compact, reduced, preview, landmark, animate}
                terms opens the blocking Program Terms sheet over the screen (first cold start, or a
                terms change). headline 'pm' is V2's line verbatim (decision D3 pending); 'proposed'
                is the system's line that promises no income. reduced forces the reduced-motion look
                (guide). preview draws overlays open without taking focus (guide). landmark false
                renders the content as a div, not <main> (guide specimens). signedOut (the account's
                email) is the variant after Sign out (section 64): not the cold-start pitch but what
                signing out means (the worker is paused, days don't count) and one way back, 'Sign in
                as <email>'. Proposed copy.
   Welcome.Body {headline, onSignIn, animate}  the content alone, for screens drawn over it (SignIn).
   TermsSheet   {mode 'firstrun' | 'update', open, busy, error, onAgree, preview}  the kit Sheet,
                blocking: no close, no Esc, no scrim; the button is the agreement. busy while the
                agreement record is written server-side; error says it was not saved, and the same
                button tries again. Copy is V2's and legal's, quoted exactly (terms_sheet.jsx:61-84). */
(function () {
  const K = () => window.V2Kit || {};
  const cx = function () { return Array.prototype.filter.call(arguments, Boolean).join(' '); };

  // V2's legal page (terms_sheet.jsx:32). Every legal link opens in a new tab, so the partner keeps
  // their place in the app.
  const TERMS_URL = '/onblue/terms';

  // PM copy, quoted exactly (moneymaker.jsx:51, 55, 154, 187).
  const STEPS = [
    'Sign in with the same account you applied with.',
    'Run the BlueAI worker: it finds jobs and runs them for you.',
  ];
  const HEADLINES = {
    pm: { lead: 'An AI that turns your social accounts ', em: 'into income.' },
    // Proposed copy: the site's "Get your agent hired." shape, no income promise (decision D3).
    proposed: { lead: 'Put your BlueAI worker ', em: 'to work.' },
  };

  function LegalLink({ anchor, children }) {
    const L = K().Link;
    const sr = <span className="v2-sr-only"> (opens in a new tab)</span>;
    if (!L) return <a href={TERMS_URL + '#' + anchor} target="_blank" rel="noopener">{children}{sr}</a>;
    return <L href={TERMS_URL + '#' + anchor} target="_blank" rel="noopener">{children}{sr}</L>;
  }

  // Body copy per mode, verbatim from terms_sheet.jsx:61-84 (agree to the contract, acknowledge
  // the notices: legal's wording split, terms_sheet.jsx:49-53).
  const MODES = {
    firstrun: {
      title: 'Before you start',
      body: function () {
        return (
          <>By continuing, you agree to the <LegalLink anchor="program">Program Terms</LegalLink> and
            acknowledge the <LegalLink anchor="privacy">Privacy Policy</LegalLink> and{' '}
            <LegalLink anchor="cookies">Cookie Policy</LegalLink>.</>
        );
      },
    },
    update: {
      title: 'Updates to our Terms of Use',
      body: function () {
        return (
          <>We've updated our <LegalLink anchor="terms">Terms of Use</LegalLink> and{' '}
            <LegalLink anchor="privacy">Privacy Policy</LegalLink>. Please review them and accept
            the updated terms to keep using BlueAI.</>
        );
      },
    },
  };

  function TermsSheet({ mode, open, busy, error, onAgree, preview }) {
    const S = K().Sheet;
    const B = K().Banner;
    const cfg = MODES[mode] || MODES.firstrun;
    if (!S) return null;
    return (
      <S open={open !== false} blocking busy={busy} preview={preview} title={cfg.title}
        actions={[{ label: 'Agree and continue', variant: 'primary', onClick: onAgree }]}>
        <p className="v2-terms-text">{cfg.body()}</p>
        {error && B ? (
          <B tone="danger" title="Your agreement wasn’t saved.">
            Check your connection, then press Agree and continue again.
          </B>
        ) : null}
      </S>
    );
  }

  function WelcomeBody({ headline, onSignIn, animate }) {
    const k = K();
    const h = HEADLINES[headline] || HEADLINES.pm;
    const anim = animate === false ? null : 'v2-anim-fade-up';
    const Brand = k.BrandMark;
    const Card = k.Card;
    const Btn = k.Button;
    const L = k.Link;
    const steps = (
      <ol className="v2-steps" aria-label="How it works">
        {STEPS.map(function (text, i) {
          return (
            <li className="v2-step" key={i}>
              <span className="v2-step-num" aria-hidden="true">{i + 1}</span>
              <p className="v2-step-text"><span className="v2-sr-only">Step {i + 1}: </span>{text}</p>
            </li>
          );
        })}
      </ol>
    );
    return (
      <div className="v2-welcome">
        <div className="v2-welcome-main">
          <div className={cx('v2-welcome-head', anim)}>
            {Brand ? <Brand size={48} wordmark={false} /> : null}
            <h1 className="v2-welcome-title">{h.lead}<em className="v2-serif-em">{h.em}</em></h1>
          </div>
          <div className={cx(anim, anim && 'v2-delay-1')}>
            {Card ? <Card>{steps}</Card> : steps}
          </div>
          <div className={cx(anim, anim && 'v2-delay-2')}>
            {Btn ? <Btn variant="primary" size="lg" full onClick={onSignIn}>Sign in to get started</Btn> : null}
          </div>
        </div>
        <div className="v2-welcome-foot">
          {L ? (
            <L href={TERMS_URL + '#program'} external tone="muted" standalone>Program Terms</L>
          ) : null}
        </div>
      </div>
    );
  }

  // After Sign out: the same window, the account to come back with, and what the pause costs.
  function SignedOutBody({ email, onSignIn, animate }) {
    const k = K();
    const anim = animate === false ? null : 'v2-anim-fade-up';
    const Btn = k.Button;
    return (
      <div className="v2-welcome">
        <div className="v2-welcome-main">
          <div className={cx('v2-welcome-head', anim)}>
            {k.BrandMark ? <k.BrandMark size={48} wordmark={false} /> : null}
            <h1 className="v2-welcome-title">You’re signed out</h1>
            <p className="v2-welcome-line">Your worker is paused, and days without a run don’t count toward your 20 days.</p>
          </div>
          <div className={cx(anim, anim && 'v2-delay-1')}>
            {Btn ? <Btn variant="primary" size="lg" full onClick={onSignIn}>{'Sign in as ' + email}</Btn> : null}
          </div>
        </div>
      </div>
    );
  }

  function Welcome(props) {
    const p = props || {};
    const Frame = K().AppFrame;
    const body = p.signedOut
      ? <SignedOutBody email={p.signedOut} onSignIn={p.onSignIn} animate={p.animate} />
      : <WelcomeBody headline={p.headline} onSignIn={p.onSignIn} animate={p.animate} />;
    const sheet = p.terms ? (
      <TermsSheet mode={p.terms} busy={p.termsBusy} error={p.termsError} onAgree={p.onAgree} preview={p.preview} />
    ) : null;
    if (!Frame) return body;
    return (
      <Frame compact={p.compact} landmark={p.landmark} overlays={sheet}
        className={cx('v2-root', p.reduced && 'v2-reduced-motion')}>
        {body}
      </Frame>
    );
  }
  Welcome.Body = WelcomeBody;

  window.V2Screens = window.V2Screens || {};
  Object.assign(window.V2Screens, { Welcome, TermsSheet, WELCOME_STEPS: STEPS, TERMS_URL });
})();
