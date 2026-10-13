/* Section 26: Sheet (overlays slice). Kit: V2Kit.Sheet (kit/dialog.jsx). */
(function () {
  const G = window.V2Guide;
  const { useState } = React;
  const noop = function () {};
  const TERMS_URL = '/onblue/terms';
  // V2's Program Terms sheet, quoted exactly (terms_sheet.jsx:62-71); the legal wording never changes here.
  const TERMS = { title: 'Before you start', cta: 'Agree and continue' };
  // Proposed copy (R34: Report a problem opens a sheet prefilled from the run).
  const REPORT = {
    title: 'Report a problem',
    body: 'Tell us what went wrong. We’ll attach this run’s details so support can see what your worker did.',
  };

  // A stand-in for the product window: sheets rise from its bottom edge, as they do in AppFrame.
  function Win({ h, children }) {
    return (
      <div data-v2-bounds="" style={{
        position: 'relative', width: '100%', height: h, overflow: 'hidden', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: 'var(--v2-space-4)', background: 'var(--v2-canvas)',
        border: 'var(--v2-stroke) solid var(--v2-line-hair)', borderRadius: 'var(--v2-radius-md)',
      }}>{children}</div>
    );
  }
  function Legal({ anchor, children }) {
    const K = window.V2Kit;
    const href = TERMS_URL + '#' + anchor;
    return K.Link ? <K.Link href={href} target="_blank" rel="noopener">{children}</K.Link>
      : <a href={href} target="_blank" rel="noopener">{children}</a>;
  }
  function TermsBody() {
    return (
      <p>By continuing, you agree to the <Legal anchor="program">Program Terms</Legal> and acknowledge
        the <Legal anchor="privacy">Privacy Policy</Legal> and <Legal anchor="cookies">Cookie Policy</Legal>.</p>
    );
  }
  function ReportBody() {
    const K = window.V2Kit;
    return K.TextArea ? <K.TextArea label="What went wrong?" rows={3} /> : null;
  }
  function terms(extra) {
    return Object.assign({ blocking: true, title: TERMS.title, children: <TermsBody />, actions: [{ label: TERMS.cta, variant: 'primary' }] }, extra || {});
  }
  function report(extra) {
    return Object.assign({
      title: REPORT.title, description: REPORT.body, children: <ReportBody />,
      actions: [{ label: 'Cancel' }, { label: 'Send report', variant: 'primary' }],
    }, extra || {});
  }

  function TryIt() {
    const K = window.V2Kit;
    const [open, setOpen] = useState(null);
    const [busy, setBusy] = useState(false);
    function close() { setOpen(null); setBusy(false); }
    function slow() { setBusy(true); setTimeout(close, 900); }
    return (
      <Win h={480}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--v2-space-2)', justifyContent: 'center' }}>
          <K.Button onClick={function () { setOpen('terms'); }}>Program Terms</K.Button>
          <K.Button onClick={function () { setOpen('report'); }}>Report a problem</K.Button>
        </div>
        <K.Sheet open={open === 'terms'} onClose={close} busy={busy}
          {...terms({ actions: [{ label: TERMS.cta, variant: 'primary', onClick: slow }] })} />
        <K.Sheet open={open === 'report'} onClose={close} busy={busy}
          {...report({ actions: [{ label: 'Cancel', onClick: close }, { label: 'Send report', variant: 'primary', onClick: slow }] })} />
      </Win>
    );
  }

  function SheetSection() {
    const K = window.V2Kit;
    const TS = window.TermsSheet;
    const S = function (props) { return <Win h={380}><K.Sheet preview open {...props} /></Win>; };
    return (
      <G.Section id="sheet">
        <G.Part name="Sheet" status="changed"
          role="A panel that rises from the window's bottom edge: blocking for an agreement, dismissible for a longer panel.">
          <p><strong>Blocking</strong> is for an agreement the partner must give before going on (the Program Terms):
            no close button, no Esc, no scrim dismiss; the button is the only way forward. <strong>Dismissible</strong> is
            for a longer panel over the current screen (Report a problem; a run's detail on a short window): Close, Esc,
            the scrim and Cancel all close it. Both trap focus and give it back, like the Dialog.</p>
          <G.StateGrid wide states={[
            { label: 'Blocking', node: <S {...terms()} />, note: 'The legal wording is V2\'s, word for word.' },
            { label: 'Dismissible', node: <S {...report()} />, note: 'Proposed copy.' },
            { label: 'Busy', node: <S {...report({ busy: true })} />, note: 'The primary loads; Close, Esc, the scrim and Cancel wait.' },
            { label: 'Entering', node: <S {...terms({ className: 'is-snapshot' })} />, note: 'Slides up 320ms on the site ease.' },
            { label: 'Leaving', node: <S {...terms({ className: 'is-snapshot is-closing' })} />, note: 'Slides down 240ms, ease-in.' },
            { label: 'Reduced motion', node: <div className="v2-reduced-motion" style={{ width: '100%' }}><S {...terms()} /></div>, note: 'Arrives and leaves at once (motion.css, one rule).' },
          ]} />
          <G.Note>Try it: Agree and continue shows the busy state while the agreement is recorded, then closes.
            Report a problem closes on Close, Esc, the scrim or Cancel.</G.Note>
          <G.Stage width="shell"><TryIt /></G.Stage>
          <G.CompareRow
            v2={<Win h={360}><G.Live label="TermsSheet" get={function () { return TS && TS.TermsSheet; }} props={{ mode: 'firstrun', onDone: noop }} /></Win>}
            system={<S {...terms()} />}
            changed="V2's Terms sheet is the one overlay with a proper entrance, exit and reduced-motion rule, so it becomes the family sheet, and its legal wording stays exactly as it is. The shell changes: radius 20 becomes 16; the upward cast becomes the top line with shadow-2; the title goes from 20/800 to 20/600; the 15/700 #1990FF pill with a glow (3.24:1) becomes the 44px primary on action blue (4.92:1); body 13 #6b7280 becomes 14 in ink-2; the 0.45s entrance and 0.32s exit become 320ms and 240ms on the site ease; the rgba(8,10,31,0.44) scrim becomes the one veil; and its z 120, tied with Logout, becomes the one dialog layer, ordered by mount. The dismissible kind is new." />
          <G.SpecDrawer rows={[
            { part: 'Placement', token: null, value: 'full window width, on the bottom edge; up to the window height less 40px, then the body scrolls' },
            { part: 'Shape', token: '--v2-radius-lg, --v2-line, --v2-shadow-2', value: '16 16 0 0, 1px top line, the dialog cast', ref: 'overlays.sheet.panel' },
            { part: 'Padding', token: '--v2-space-6', value: '24px', ref: 'overlays.sheet.panel' },
            { part: 'Title', token: '--v2-text-20, --v2-weight-semibold, --v2-ink', value: '20/600', ref: 'overlays.sheet.title' },
            { part: 'Body', token: '--v2-text-14, --v2-ink-2, --v2-leading-body', value: '14px / 1.5, #3c4049', ref: 'overlays.sheet.body' },
            { part: 'Actions', token: '--v2-control-lg', value: '44px; one action spans the width, two share it (secondary, primary)', ref: 'overlays.sheet.cta' },
            { part: 'Scrim', token: '--v2-scrim', value: 'rgba(11,18,32,0.48), fades 240ms', ref: ['overlays.sheet.scrim', 'overlays.sheet.scrim-in'] },
            { part: 'Layer', token: '--v2-z-dialog', value: '100, ordered by mount', ref: 'overlays.sheet.scrim' },
            { part: 'Enter', token: '--v2-dur-4, --v2-ease-out', value: 'slide up 320ms', ref: 'overlays.sheet.in' },
            { part: 'Exit', token: '--v2-dur-3, --v2-ease-in', value: 'slide down 240ms', ref: 'overlays.sheet.out' },
            { part: 'Reduced motion', token: null, value: 'motion.css global rule: at once', ref: 'overlays.sheet.reduced' },
            { part: 'Blocking', token: null, value: 'no close, no Esc, no scrim dismiss', ref: 'overlays.sheet.blocking' },
            { part: 'Terms copy', token: null, value: TERMS.title + ' / By continuing, you agree to the Program Terms and acknowledge the Privacy Policy and Cookie Policy. / ' + TERMS.cta, ref: ['overlays.sheet.copy-title', 'overlays.sheet.copy-body-1', 'overlays.sheet.copy-body-2', 'overlays.sheet.copy-body-3', 'overlays.sheet.copy-cta'] },
            { part: 'Legal links', token: null, value: '/onblue/terms#program, #privacy, #cookies in a new tab', ref: 'overlays.sheet.terms-url' },
            { part: 'Reached in V2', token: null, value: 'a bare index.html (first run); Preview panel row Terms; ?start=worker hides it', ref: ['overlays.sheet.default-on', 'overlays.sheet.preview-row'] },
          ]} />
          <G.DoDont
            do={['Use the blocking sheet only for an agreement the partner must give to continue.',
              'Use the dismissible sheet for a panel longer than a dialog that belongs to the current screen.',
              'Keep legal wording exactly as legal approved it.']}
            dont={['Block for anything the partner could decline and come back to later.',
              'Put two sheets on screen at once.',
              'Reach for a sheet when a short question fits a dialog.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('sheet', SheetSection);
})();
