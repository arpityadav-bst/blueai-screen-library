/* BlueAI: the Help menu's Report issue (review round 1, U16: no dead controls).
   A placeholder for the kit's ReportProblemSheet (design-md 65), its smallest useful part: the
   kit's dialog, who we reply to, one "What happened?" field, Cancel / Send. Send is the form's one
   solid action and waits for something written; it closes the dialog (no backend here). The words
   are the kit's (design-md 65), proposed to the PM; the menu row keeps V2's "Report issue".
   Exposes window.Help = { ReportIssueDialog }. */
(function () {
  const { useState } = React;

  function ReportIssueDialog({ isOpen, onClose }) {
    const [text, setText] = useState('');
    const close = () => { setText(''); onClose(); };
    const empty = !text.trim();
    return (
      <ModalOverlay isOpen={isOpen} onClose={close} title="Report issue" describedBy="report-to" initialFocus="#report-text">
        <form className="v3-form" onSubmit={(e) => { e.preventDefault(); if (!empty) close(); }}>
          <p id="report-to" className="v2-text-body-sm" style={{ overflowWrap: 'anywhere' }}>We reply by email to {window.Profile.ACCOUNT.email}.</p>
          <Field id="report-text" label="What happened?" className="v2-field--area">
            <textarea id="report-text" className="v2-field-input v2-field-input--area" rows={4} value={text} onChange={(e) => setText(e.target.value)} />
          </Field>
          <div className="v3-btn-row">
            <button type="button" onClick={close} className="v2-button v2-button--secondary v2-button--lg">Cancel</button>
            <button type="submit" disabled={empty} aria-disabled={empty} className="v2-button v2-button--primary v2-button--lg">Send</button>
          </div>
        </form>
      </ModalOverlay>);
  }

  window.Help = { ReportIssueDialog };
})();
