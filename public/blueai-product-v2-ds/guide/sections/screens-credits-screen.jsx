/* Section 66: AI credits (screens-account slice). Screen: screens/credits.jsx (V2Screens.Credits).
   Every countdown is frozen 6h 42m before the 00:00 UTC refill, like section 47. */
(function () {
  const G = window.V2Guide;
  const noop = function () {};
  const REFILL = Date.UTC(2026, 9, 14);
  const NOW = REFILL - (6 * 60 + 42) * 60000;

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

  function CreditsScreenSection() {
    const S = window.V2Screens || {};
    const K = window.V2Kit || {};
    if (!S.Credits) return <G.Section id="credits-screen"><G.Warn>screens/credits.jsx is not loaded.</G.Warn></G.Section>;
    const f = K.workerFixtures || {};
    const scr = function (p) { return <S.Credits preview compact landmark={false} refillAt={REFILL} now={NOW} onBack={noop} onManageKey={noop} {...(p || {})} />; };
    return (
      <G.Section id="credits-screen">
        <G.Part name="Credits" status="changed"
          role="The daily allowance: what is left, whether today's run is covered, when it refreshes, and the own-key state. With Back.">
          <p><strong>Anatomy.</strong> ScreenHeader 'AI credits' with Back, the tab you came from still lit. A Banner only at zero
            or on refresh, then a StatCard (glyph + figure in ink) holding the CreditsMeter, or the own-key card instead, then
            V2's explainer and Learn more.</p>
          <Screens states={[
            { label: 'Healthy', note: '1,640 of 2,000, enough for today’s run', node: scr({ state: 'healthy' }) },
            { label: 'Low', note: 'less than one run (360)', node: scr({ state: 'low' }) },
            { label: 'Empty', note: 'V2’s banner; the meter says what it means for today', node: scr({ state: 'empty' }) },
            { label: 'Empty, run already done', note: 'the day is not affected', node: scr({ state: 'empty', worker: f.donePending }) },
            { label: 'Refreshed', note: 'the countdown reached zero', node: scr({ state: 'refreshed' }) },
            { label: 'Own key active', note: 'credits paused; manage in Settings', node: scr({ state: 'own-key' }) },
            { label: 'Loading', note: 'the figure’s skeleton', node: scr({ state: 'loading' }) },
            { label: 'Couldn’t load', note: 'said in place, with Try again', node: scr({ state: 'error' }) },
          ]} />
          <G.CompareRow
            v2={<G.FrameState url="index.html?start=worker&credits=0" height={760} label="V2 at 0 credits: open the credits pill (?start=worker alone shows 2,000)" />}
            system={scr({ state: 'empty' })}
            changed={'V2\'s AI Credits has no Back and lights no tab, so the only way out is another tab; its Refresh button has no '
              + 'handler; the balance is a 54/800 gradient numeral (38 at zero) under a centred red banner; and the screen never '
              + 'says the daily grant or when it refreshes until the balance is zero. On your own key it says "No BlueAI credits '
              + 'are consumed". The system pushes AI credits over the tab you came from with Back, drops Refresh, sets the figure '
              + 'in ink 40/600 on a StatCard with the CreditsMeter (left of the grant, refresh countdown, whether today\'s run is '
              + 'covered), keeps V2\'s banner and explainer copy word for word, adds what zero means for today\'s day, and says '
              + '"AI credits" for the allowance everywhere.'} />
          <G.Warn>The explainer says "Every task and job" and "your daily tasks" (V2 copy, kept). The glossary bans "task" for paid
            work; the PM decides whether these two lines move to "job" (decision D6 also asks whether the worker's run cost is
            reserved from the grant).</G.Warn>
          <G.DoDont
            do={['State the grant and the refresh time on the screen, not only at zero.',
              'Say what zero means for today’s day, from the Worker record.', 'Keep V2’s banner lines and explainer exactly.',
              'Offer Back; keep the tab you came from lit.']}
            dont={['Draw a Refresh control that does nothing.', 'Paint the figure in the gradient.',
              'Offer to buy or earn credits.', 'Show a balance while the own key is in use.']} />
          <G.SpecDrawer rows={[
            { part: 'Title', token: 'ScreenHeader with Back', value: '"AI credits" 24/500/-0.04em (.v2-text-greeting, review round 2), sentence case', ref: ['screens-account.credits.title', 'screens-account.credits.nav-off'] },
            { part: 'Refresh', token: null, value: 'removed: the meter counts down', ref: 'screens-account.credits.refresh' },
            { part: 'Figure', token: 'StatCard: --v2-text-40, --v2-weight-semibold, --v2-ink', value: 'credits glyph 24 + "1,640" in ink', ref: 'screens-account.credits.numeral' },
            { part: 'Meter', token: 'CreditsMeter (section 47)', value: '"of 2,000 today" (figure={false}: the stat says 1,640), "Refreshes in 6h 42m", covered line', ref: ['screens-account.credits.grant', 'screens-account.credits.refill'] },
            { part: 'Empty', token: 'Banner danger', value: 'V2’s title and two lines, kept; the day is the meter’s covered line', ref: ['screens-account.credits.banner', 'screens-account.credits.banner-title', 'screens-account.credits.used', 'screens-account.credits.refresh-in'] },
            { part: 'Refreshed', token: 'Banner success, dismissible', value: '"New credits are here" / "You have 2,000 AI credits for today."' },
            { part: 'Own key', token: 'SettingsSection + Badge success + ListRows', value: '"Running on your own key", "No AI credits are used while this is on.", Manage in Settings', ref: ['screens-account.credits.own-key', 'screens-account.credits.active', 'screens-account.credits.own-key-note', 'screens-account.credits.manage'] },
            { part: 'Explainer', token: '--v2-text-14 600, --v2-text-13 ink-3', value: 'V2 copy kept word for word', ref: ['screens-account.credits.explainer-title', 'screens-account.credits.explainer-1', 'screens-account.credits.explainer-2'] },
            { part: 'Learn more', token: 'Link external', value: 'the external icon replaces the arrow character', ref: ['screens-account.credits.learn', 'screens-account.help.article'] },
          ]} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('credits-screen', CreditsScreenSection);
})();
