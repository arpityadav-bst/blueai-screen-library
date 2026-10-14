/* BlueAI: the Help menu's Report issue (review round 1, U16: no dead controls).
   A placeholder for the kit's ReportProblemSheet (design-md 65), its smallest useful part: the
   kit's dialog, who we reply to, one "What happened?" field, Cancel / Send. Send is the form's one
   solid action and waits for something written; it closes the dialog (no backend here). The words
   are the kit's (design-md 65), proposed to the PM; the menu row keeps V2's "Report issue".
   Review round 2 (R16): Send confirms before the dialog closes, "Sent. We'll reply to {email}." as a
   status, with Done; focus moves to Done when the form swaps out (the kit's in-place swap).
   Exposes window.Help = { ReportIssueDialog }. */
(function () {
  const { useState, useRef } = React;

  function ReportIssueDialog({ isOpen, onClose }) {
    const [text, setText] = useState('');
    const [sent, setSent] = useState(false);
    const doneRef = useRef(null);
    window.V2Kit.useSwapFocus(doneRef, sent);
    const close = () => { setText(''); setSent(false); onClose(); };
    const empty = !text.trim();
    const email = window.Profile.ACCOUNT.email;
    return (
      <ModalOverlay isOpen={isOpen} onClose={close} title="Report issue" describedBy="report-to" initialFocus="#report-text">
        {sent ? (
          <div className="v3-form">
            <p id="report-to" className="v2-text-body" role="status" style={{ overflowWrap: 'anywhere' }}>Sent. We’ll reply to {email}.</p>
            <div className="v3-btn-row v3-dlg-actions">
              <button ref={doneRef} type="button" onClick={close} className="v2-button v2-button--primary v2-button--lg">Done</button>
            </div>
          </div>
        ) : (
        <form className="v3-form" onSubmit={(e) => { e.preventDefault(); if (!empty) setSent(true); }}>
          <p id="report-to" className="v2-text-body-sm" style={{ overflowWrap: 'anywhere' }}>We reply by email to {email}.</p>
          <Field id="report-text" label="What happened?" className="v2-field--area">
            <textarea id="report-text" className="v2-field-input v2-field-input--area" rows={4} value={text} onChange={(e) => setText(e.target.value)} />
          </Field>
          <div className="v3-btn-row v3-dlg-actions">
            <button type="button" onClick={close} className="v2-button v2-button--secondary v2-button--lg">Cancel</button>
            <button type="submit" disabled={empty} aria-disabled={empty} className="v2-button v2-button--primary v2-button--lg">Send</button>
          </div>
        </form>)}
      </ModalOverlay>);
  }

  window.Help = { ReportIssueDialog };
})();
