// BlueAI: Terms bottom sheet. One component, two modes, all mounted inside .ba-app like
// every other in-app overlay. It is the kit's sheet (review round 1: the same sheet as the mode
// sheet) on the gate layer (--v2-z-gate), mounted after the login gate so it sits above it, since
// acceptance conceptually precedes sign-in, and below the splash (--v2-z-splash) so a cold start
// still boots on top of it:
//   'firstrun' : first cold start: "Before you start" + "Agree and continue".
//   'update'   : the terms changed: same sheet, update wording.
// BOTH modes are blocking, no close, no scrim dismiss, no Esc; the only way forward is the CTA.
// A dismissible notice-only variant (the X.com "Got it" pattern) existed and was REMOVED
// (Abhisht, 2026-09-24): every update re-collects acceptance, which is one click either way for
// the user, deletes the per-release "is this change material?" judgment call, and produces a
// fresh consent record for every version.
// Nothing here is invented fresh:
//   - overlay containment: login.jsx (absolute inset-0 against .ba-app)
//   - look: the kit's sheet (kit/overlays.css): the light veil, radius 20 on top, the 1px line, the
//     upward cast, the 18px dialog title, the primary CTA, the kit's underlined ink legal links
//   - motion: the kit's sheet entry and exit (v2-sheet-up / v2-sheet-down, kit/motion.css)
//   - consent line: the website SignInDialog's approved sentence shape, re-pointed at the
//     BlueAI Partner Program Terms (see the note on MODES for why that document, not the TOU)
//   - links: the real legal page (same tabs/anchors the website links), new tab on purpose,
//     never cost the user their place in the app. Relative URL: resolves on the deployment
//     (blueai-screen-library.vercel.app/onblue/terms); 404s on a bare static file server, which
//     is fine: the prototype's job is the sheet, not the destination.
// HANDOFF: acceptance records (legal review, Ashish 2026-09-24, matching the Privacy Policy's
// own "consent records" section): every "Agree and continue" click must be recorded server-side
// with the user ID, a timestamp, the terms version accepted, the IP address, and the exact
// screen/copy the user saw. A material terms change re-collects acceptance, that is this
// sheet's 'update' mode. This prototype has no backend, so nothing here records anything.
// Exposes window.TermsSheet = { TermsSheet }.
(function () {
  const { useState } = React;

  const TERMS_URL = '/onblue/terms';

  // The kit's underlined ink link, not a blue one.
  const LegalLink = ({ anchor, children }) => (
    <a href={TERMS_URL + '#' + anchor} target="_blank" rel="noopener" className="v2-link">
      <span className="v2-link-text">{children}</span>
    </a>
  );

  // Body copy is JSX (it carries live anchors), so modes hold render functions, not strings.
  const MODES = {
    // The app's governing contract is the BlueAI Partner Program Terms (2026-09-14 legal set;
    // per its "order of documents" section it governs over the site TOU for anything
    // Program-related), so first-run acceptance names IT, not the site Terms of Use.
    // #program and #arbitration are the legal page's PLANNED anchors (Program Terms tab, its
    // Choice of Law; Arbitration section), the page rework is a separate task; until it lands
    // the links resolve to the page top, which is still the right page.
    // Wording split, per legal review (Ashish, 2026-09-24): the user AGREES to the contract
    // (Program Terms) and ACKNOWLEDGES the notices (Privacy + Cookie Policy), a privacy policy
    // is a notice, not a contract, and under GDPR conditioning product use on "agreeing" to it
    // is not valid consent. Cookie consent for non-essential cookies is likewise NOT collected
    // here (invalid inside a terms acceptance in the EU/UK); that is the site banner's job.
    // NO on-screen arbitration line, by legal's own call (Ashish, in writing, 2026-09-24): a
    // "These terms include binding arbitration and a class action waiver" note lived under the
    // consent line for one revision and was removed as unnecessary. Notice of the arbitration
    // clause rides on the linked documents themselves, which open with the all-caps IMPORTANT
    // NOTICE above the clause. If legal ever reverses (e.g. an opt-out window is added, which
    // the 2026-09-14 drafts don't have), the removed line is one commit back in history.
    // Button stays "Agree and continue" (Abhisht, 2026-09-18).
    firstrun: {
      title: 'Before you start',
      body: () => (
        // "Program Terms", not the full program name, the program's name can change, the
        // generic label can't go stale (Abhisht, 2026-09-24). The link still carries the reader
        // to the specific document.
        <>By continuing, you agree to the <LegalLink anchor="program">Program Terms</LegalLink> and
          acknowledge the <LegalLink anchor="privacy">Privacy Policy</LegalLink> and{' '}
          <LegalLink anchor="cookies">Cookie Policy</LegalLink>.</>
      ),
      cta: 'Agree and continue'
    },
    // The document names here are placeholders for whichever documents actually changed in that
    // update: in the real build they are data, not fixed copy. "Accept the updated terms", not
    // "accept them": the Privacy Policy in the sentence is acknowledged, never accepted.
    update: {
      title: 'Updates to our Terms of Use',
      body: () => (
        <>We've updated our <LegalLink anchor="terms">Terms of Use</LegalLink> and{' '}
          <LegalLink anchor="privacy">Privacy Policy</LegalLink>. Please review them and accept
          the updated terms to keep using BlueAI.</>
      ),
      cta: 'Agree and continue'
    }
  };

  function TermsSheet({ mode, onDone }) {
    const cfg = MODES[mode] || MODES.firstrun;
    // Accepting plays the exit (sheet slides back down, scrim fades) BEFORE unmounting,
    // 'leaving' sets the kit's .is-closing, whose exit (--v2-dur-3) the timeout outlasts.
    const [leaving, setLeaving] = useState(false);
    const close = () => { if (leaving) return; setLeaving(true); setTimeout(() => onDone?.(), 340); };

    return (
      <div className={'v2-overlay v2-overlay--bottom v2-overlay--gate' + (leaving ? ' is-closing' : '')}>
        <div className="v2-scrim" aria-hidden="true" />
        <div role="dialog" aria-modal="true" aria-label={cfg.title} className="v2-sheet">
          <div className="v2-dialog-head">
            <h2 className="v2-dialog-title v2-text-title-dialog">{cfg.title}</h2>
          </div>
          <div className="v2-sheet-body">
            <p className="v2-text-body">{cfg.body()}</p>
          </div>
          <div className="v2-ov-actions">
            <button type="button" onClick={close} className="v2-button v2-button--primary v2-button--lg v2-button--full">
              {cfg.cta}
            </button>
          </div>
        </div>
      </div>);
  }

  window.TermsSheet = { TermsSheet };
})();
