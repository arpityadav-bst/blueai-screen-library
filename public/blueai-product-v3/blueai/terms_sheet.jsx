// BlueAI: Terms bottom sheet. One component, two modes, all mounted inside .ba-app like
// every other in-app overlay (login gate z100, boot splash z200, this sits between at z120,
// above the gate because acceptance conceptually precedes sign-in, below the splash so a cold
// start still boots on top of it):
//   'firstrun' : first cold start: "Before you start" + "Agree and continue".
//   'update'   : the terms changed: same sheet, update wording.
// BOTH modes are blocking, no close, no scrim dismiss, no Esc; the only way forward is the CTA.
// A dismissible notice-only variant (the X.com "Got it" pattern) existed and was REMOVED
// (Abhisht, 2026-09-24): every update re-collects acceptance, which is one click either way for
// the user, deletes the per-release "is this change material?" judgment call, and produces a
// fresh consent record for every version.
// Nothing here is invented fresh:
//   - overlay containment: login.jsx (absolute inset-0 against .ba-app)
//   - V3, Phase 2 look: Target tokens and the site's language, as the rest of the entry screens
//     (entry.css): surface sheet with a 1px top line, Inter 600 title, the solid dark CTA, ink
//     underlined legal links
//   - motion: the house curve cubic-bezier(0.22,1,0.36,1) used across this product's intros
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

  // V3, Phase 2: the site's underlined ink link (entry.css .v3-link--ink), not a blue one.
  const LegalLink = ({ anchor, children }) => (
    <a href={TERMS_URL + '#' + anchor} target="_blank" rel="noopener" className="v3-link v3-link--ink">
      {children}
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
    // 'leaving' drives the exit classes, the timeout matches their 0.32s duration.
    const [leaving, setLeaving] = useState(false);
    const close = () => { if (leaving) return; setLeaving(true); setTimeout(() => onDone?.(), 340); };

    return (
      <div role="dialog" aria-modal="true" aria-label={cfg.title}
        className={'tsh-scrim' + (leaving ? ' tsh-out' : '')}
        style={{ position: 'absolute', inset: 0, zIndex: 120, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'var(--v2-scrim)', fontFamily: 'var(--v2-font-ui)' }}>
        <style>{`
          @keyframes tshScrimIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes tshScrimOut { from { opacity: 1; } to { opacity: 0; } }
          @keyframes tshSheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
          @keyframes tshSheetDown { from { transform: translateY(0); } to { transform: translateY(100%); } }
          .tsh-scrim { animation: tshScrimIn 0.3s ease both; }
          .tsh-sheet { animation: tshSheetUp 0.45s cubic-bezier(0.22,1,0.36,1) both; }
          .tsh-scrim.tsh-out { animation: tshScrimOut 0.32s ease both; }
          .tsh-out .tsh-sheet { animation: tshSheetDown 0.32s cubic-bezier(0.5,0,0.75,0.4) both; }
          @media (prefers-reduced-motion: reduce) {
            .tsh-scrim, .tsh-sheet, .tsh-scrim.tsh-out, .tsh-out .tsh-sheet { animation: none !important; }
          }
        `}</style>

        <div className="tsh-sheet"
          style={{ background: 'var(--v2-surface)', borderRadius: 'var(--v2-radius-lg) var(--v2-radius-lg) 0 0', borderTop: 'var(--v2-stroke) solid var(--v2-line)', padding: 'var(--v2-space-6)' }}>
          <h2 className="v3-gate-title">
            {cfg.title}
          </h2>
          <p style={{ marginTop: 'var(--v2-space-2)', fontSize: 'var(--v2-text-14)', color: 'var(--v2-ink-2)', lineHeight: 'var(--v2-leading-body)' }}>
            {cfg.body()}
          </p>
          <button type="button" onClick={close} className="v3-btn-solid v3-btn-full" style={{ marginTop: 'var(--v2-space-5)' }}>
            {cfg.cta}
          </button>
        </div>
      </div>);
  }

  window.TermsSheet = { TermsSheet };
})();
