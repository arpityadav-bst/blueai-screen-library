/* BlueAI Product V2 Design System: Help and Report a problem (section 65, New).
   Help is not a screen of its own: it is two entries that open from anywhere, the top bar's Help
   menu and Settings > Help. FAQ opens the site article in the browser; Report a problem opens one
   sheet, prefilled with the run when it starts from one (a failed run card, a rejected day in
   Activity). In V2 both menu rows only close the menu (index.html:355-356).

   Help {worker, state, about, frame, compact, landmark, preview}
     state  'menu' (the Help menu open) | 'draft' | 'sending' | 'sent' (toast) | 'failed'.
     about  the run the report is about, {label, detail}; true reads today's run from the worker.
     Shown over the Settings tab, the other place the same two entries live.
   ReportProblemSheet {open, state, about, text, email, preview, onClose, onSent}
     The sheet itself, used by Help, Settings, the run card and Activity. Send stays disabled until
     something is written; sending holds the sheet; a failure keeps the text and offers Try again. */
(function () {
  const { useState, useEffect } = React;
  const kit = function () { return window.V2Kit || {}; };
  const noop = function () {};

  const TOPICS = [
    { value: 'run', label: 'A run' },
    { value: 'verification', label: 'A day that wasn’t verified' },
    { value: 'payout', label: 'Earnings or cash out' },
    { value: 'account', label: 'My account or sign-in' },
    { value: 'app', label: 'Something else in the app' },
  ];
  const EXAMPLE = 'The run stopped after the second video and the day shows as not counted.';

  function fixture(key) { const f = kit().workerFixtures || {}; return f[key] || f.verified || {}; }
  function aboutRun(w) {
    const t = (w && w.today) || {};
    return { label: 'Today’s run, Oct 13', detail: t.error ? 'Didn’t finish: ' + t.error : 'Started ' + (t.startedAt || '11:02 am') + '.' };
  }

  function ReportProblemSheet(props) {
    const K = kit();
    const p = props;
    const about = p.about || null;
    const [topic, setTopic] = useState(about ? 'run' : '');
    const [text, setText] = useState(p.text != null ? p.text : (p.state && p.state !== 'draft' ? EXAMPLE : ''));
    const [diag, setDiag] = useState(true);
    const [status, setStatus] = useState(p.state === 'sending' || p.state === 'failed' ? p.state : 'draft');
    useEffect(function () {
      if (status !== 'sending' || p.preview) return undefined;
      const t = setTimeout(function () { setStatus('draft'); (p.onSent || noop)(); }, 1200);
      return function () { clearTimeout(t); };
    }, [status]);
    if (!K.Sheet || !(p.open || p.preview)) return null;
    const ready = !!text.trim();
    return (
      <K.Sheet open preview={p.preview} title="Report a problem" busy={status === 'sending'} onClose={p.onClose || noop}
        description={'We reply by email to ' + (p.email || 'alex@example.com') + '.'}
        actions={[
          { label: 'Cancel', onClick: p.onClose || noop },
          { label: status === 'failed' ? 'Try again' : 'Send', variant: 'primary', disabled: !ready, onClick: function () { if (ready) setStatus('sending'); } },
        ]}>
        <div className="v2-acct-report">
          {status === 'failed' && K.Banner ? (
            <K.Banner tone="danger" title="Couldn’t send your report">Check your connection and try again. What you wrote is kept.</K.Banner>
          ) : null}
          {about ? (
            <p className="v2-acct-about">
              {K.Icon ? <K.Icon name="activity" size={16} /> : <span />}
              <span><strong>{about.label}.</strong> {about.detail}</span>
            </p>
          ) : null}
          {K.Select ? <K.Select label="What is it about?" placeholder="Choose one" options={TOPICS} value={topic} onChange={setTopic} /> : null}
          {K.TextArea ? <K.TextArea label="What happened?" placeholder={'Example: ' + EXAMPLE} rows={4} maxLength={1000}
            value={text} onChange={setText} required /> : null}
          {K.Checkbox ? <K.Checkbox label="Include diagnostic info" checked={diag} onChange={setDiag}
            description="Today’s run log and the app version. Never your passwords or messages." /> : null}
        </div>
      </K.Sheet>
    );
  }

  function Help(props) {
    const K = kit();
    const p = props;
    const state = p.state || 'menu';
    const w = p.worker || fixture(p.about ? 'failed' : 'verified');
    const about = p.about === true ? aboutRun(w) : (p.about || null);
    const [sheet, setSheet] = useState(state === 'draft' || state === 'sending' || state === 'failed');
    const [sent, setSent] = useState(state === 'sent');
    const S = window.V2Screens || {};
    const Frame = S.AccountFrame;
    if (!Frame) return <div className="v2-acct-note">screens/settings.jsx is not loaded.</div>;
    const toast = sent && K.Toast ? (
      <div className="v2-toast-host">
        <K.Toast tone="success" title="Report sent. We’ll reply by email." duration={p.preview ? 0 : undefined} onClose={function () { setSent(false); }} />
      </div>
    ) : null;
    const overlays = (
      <React.Fragment>
        {sheet ? <ReportProblemSheet open preview={p.preview} state={state} about={about}
          email={w.account && w.account.email} onClose={function () { setSheet(false); }}
          onSent={function () { setSheet(false); setSent(true); }} /> : null}
        {toast}
      </React.Fragment>
    );
    return (
      <Frame worker={w} tab="settings" frame={p.frame} compact={p.compact} landmark={p.landmark} overlays={overlays}
        openMenu={state === 'menu' ? 'help' : undefined}
        onAction={function (id) { if (id === 'report') { setSent(false); setSheet(true); } }}>
        {S.Settings ? <S.Settings worker={w} frame={false} /> : null}
      </Frame>
    );
  }

  window.V2Screens = window.V2Screens || {};
  Object.assign(window.V2Screens, { Help, ReportProblemSheet });
})();
