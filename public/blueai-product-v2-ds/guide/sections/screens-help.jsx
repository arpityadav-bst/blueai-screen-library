/* Section 65: Help and Report a problem (screens-account slice). Screen: screens/help.jsx
   (V2Screens.Help, V2Screens.ReportProblemSheet). New: V2 has the two menu rows and nothing behind them. */
(function () {
  const G = window.V2Guide;
  const noop = function () {};
  const box = { position: 'relative', width: '100%', height: 560, overflow: 'hidden', borderRadius: 'var(--v2-radius-md)', background: 'var(--v2-canvas)' };

  function Screens({ states }) {
    return (
      <div className="g-states" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(453px, 1fr))', overflowX: 'auto' }}>
        {states.map(function (s, i) {
          return (
            <figure className="g-state" key={s.label + i}>
              <div className="g-state-stage">{s.node}</div>
              <figcaption className="g-state-label">{s.label}{s.note ? <span className="g-state-note">{s.note}</span> : null}</figcaption>
            </figure>
          );
        })}
      </div>
    );
  }

  function HelpSection() {
    const S = window.V2Screens || {};
    if (!S.Help || !S.ReportProblemSheet) return <G.Section id="help"><G.Warn>screens/help.jsx is not loaded.</G.Warn></G.Section>;
    const scr = function (p) { return <S.Help preview compact landmark={false} {...(p || {})} />; };
    const sheet = function (p) { return <div style={box}><S.ReportProblemSheet preview onClose={noop} {...(p || {})} /></div>; };
    return (
      <G.Section id="help">
        <G.Part name="Help" status="new"
          role="Two entries from anywhere: FAQ opens the site article, Report a problem opens one sheet, prefilled with the run it started from.">
          <G.Note>
            <strong>Why the product needs it. </strong>Help is the escape hatch when a day or a payout looks wrong, the moment
            money is at stake (R34). V2 draws a Help menu with "FAQ" and "Report Issue", and both rows only close the menu.
            Help is not a screen: it opens from the top bar on every screen and from Settings &gt; Help, and a failed run card
            or a rejected day in Activity opens the same sheet with that run already attached.
          </G.Note>
          <p><strong>Anatomy.</strong> The top bar's Help menu (FAQ, Report a problem) over any screen, here Settings. The
            Report a problem Sheet: the run it is about (when it has one), a topic Select, a required TextArea, a diagnostics
            Checkbox, then Cancel and Send. Sent closes the sheet into a toast; failed keeps the text under a danger Banner.</p>
          <Screens states={[
            { label: 'Menu', note: 'the top bar’s Help menu, keyboard reachable (section 27)', node: scr({ state: 'menu' }) },
            { label: 'Draft, from a run', note: 'the run attached, "A run" picked', node: scr({ state: 'draft', about: true }) },
            { label: 'Sending', note: 'the sheet holds; Send shows its spinner', node: scr({ state: 'sending', about: true }) },
            { label: 'Sent', note: 'the sheet closes; the toast confirms', node: scr({ state: 'sent' }) },
            { label: 'Failed', note: 'the text is kept; Try again', node: scr({ state: 'failed', about: true }) },
          ]} />
          <G.StateGrid wide states={[
            { label: 'Draft from Settings', note: 'nothing attached, Send disabled until something is written', node: sheet({ state: 'draft' }) },
            { label: 'Draft with text', note: 'Send enabled', node: sheet({ state: 'draft', text: 'The run stopped after the second video.' }) },
          ]} />
          <G.Warn>V2 today: open <code className="g-code">index.html?start=worker</code>, then the (?) in the header: "FAQ" and
            "Report Issue" close the menu and nothing else.</G.Warn>
          <G.FrameState url="index.html?start=worker" label="V2 signed in: open the (?) Help menu" height={760} />
          <G.DoDont
            do={['Open the FAQ in the browser at the site article.', 'Attach the run when the report starts from one, and say which run.',
              'Keep what was written when sending fails, and offer Try again.', 'Say where the reply goes (the partner’s email).']}
            dont={['Draw a menu row that does nothing.', 'Use a red warning glyph for a help entry.',
              'Make the partner retype which run went wrong.', 'Send diagnostics without saying what they contain.']} />
          <G.SpecDrawer rows={[
            { part: 'Menu', token: 'TopBar Help menu (Menu)', value: '"FAQ" (external), "Report a problem"; role=menu, arrows, Esc', ref: ['screens-account.help.faq', 'screens-account.help.report', 'screens-account.help.noop'] },
            { part: 'Glyphs', token: 'Icon help / alert, currentColor ink-3', value: 'no red', ref: 'screens-account.help.red-icon' },
            { part: 'FAQ', token: 'V2Kit.SITE_FAQ_URL', value: 'the site’s FAQ; the credits screen links its AI credits article', ref: 'screens-account.help.article' },
            { part: 'Sheet', token: 'Sheet, full window width', value: '"Report a problem", reply-to line 13 ink-3' },
            { part: 'From a run', token: '--v2-surface-sunken, --v2-radius-md, --v2-text-13', value: 'activity 16 + run label 600 + what happened' },
            { part: 'Topic', token: 'Select', value: 'A run / A day that wasn’t counted / Earnings or cash out / My account or sign-in / Something else' },
            { part: 'Details', token: 'TextArea, required, 4 rows', value: 'placeholder is an example, never the label' },
            { part: 'Diagnostics', token: 'Checkbox, on', value: '"Today’s run log and the app version. Never your passwords or messages."' },
            { part: 'Actions', token: 'Button secondary + primary lg, busy', value: 'Cancel / Send; Try again after a failure' },
            { part: 'Failed', token: 'Banner danger', value: '"Couldn’t send your report" + keep the text' },
            { part: 'Sent', token: 'Toast success', value: '"Report sent. We’ll reply by email."' },
          ]} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('help', HelpSection);
})();
