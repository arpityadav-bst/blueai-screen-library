/* Section 01: The product concept (compose slice). The concept paragraph, the partner journey
   (site, app daily, site) and the product's three jobs, as the frame every decision is judged
   against. Program numbers are V2's and carry refs (guide/refs/worker.js, credits-settings.js,
   entry-patterns.js). */
(function () {
  const G = window.V2Guide;

  function Go({ id }) {
    const s = window.V2Catalog && window.V2Catalog.byId(id);
    return <a className="g-link" href={G.hashHref(id)}>{s ? s.number + ' ' + s.title : id}</a>;
  }
  function Src({ at }) { return <code className="g-code">{at}</code>; }

  const JOURNEY = [
    ['1. The site', 'onBlue Agentic', [
      'The partner applies on the site and is accepted.',
      'Installs BlueAI from the dashboard link.',
      'Same greys, blue, lines, type and words as the app (P6).',
    ]],
    ['2. The app, every day', 'BlueAI on the partner’s Windows PC', [
      'Signs in with the account they applied with.',
      'Sets the worker up once, in a short conversation.',
      'From then on the worker runs once a day on its own: warms up YouTube, checks the jobs board, takes a paid job (asking first on Always ask, on its own on Automatic) and submits it.',
      'Each day shows one tick while pending, two ticks once verified.',
    ]],
    ['3. The site again', 'The dashboard', [
      'Days and money read the same as in the app (P2).',
      'Cash out happens here, never in the app.',
    ]],
  ];
  const JOBS = [
    ['Show what the worker is doing today and whether the day counts.', ['home', 'worker-card', 'run-card', 'program-progress', 'activity']],
    ['Keep the partner in control: consent per app, pause, disconnect, see exactly what was posted.', ['permissions', 'job-ask', 'worker-settings', 'connected-apps', 'run-detail']],
    ['Make money and days read the same in the app and on the site.', ['worker-model', 'day-done', 'credits-balance', 'copy-voice']],
  ];

  function ConceptSection() {
    return (
      <G.Section id="concept">
        <G.Part name="The concept">
          <div className="g-prose">
            <p>BlueAI is a paid worker that lives on the partner’s Windows PC. A partner is accepted on the onBlue Agentic site, installs BlueAI, signs in with the account they applied with, sets the worker up once in a short conversation, and from then on the worker runs once a day on its own.</p>
            <p>Every successful day is checked within a day: one tick while pending, two ticks once verified. Each verified day counts toward a 20-day program that ends on Nov 1, with cash out on the site’s dashboard. AI credits, granted every day, are the worker’s fuel, not money.</p>
            <p>So the product is not a chat assistant with a worker bolted on. It is a small, quiet control room for an agent acting on the partner’s own accounts.</p>
          </div>
        </G.Part>

        <G.Part name="The partner journey">
          <p className="g-role">Site, app daily, site. The app is the middle of a loop, so it has to look and speak like the two ends.</p>
          <div className="g-grid">
            {JOURNEY.map(function (j) {
              return (
                <div className="g-stage g-stage--surface" key={j[0]}>
                  <div className="g-eyebrow">{j[0]}</div>
                  <h3 className="g-h2">{j[1]}</h3>
                  <ul className="g-list">{j[2].map(function (t) { return <li key={t}>{t}</li>; })}</ul>
                </div>
              );
            })}
          </div>
        </G.Part>

        <G.Part name="The product’s three jobs">
          <p className="g-role">Everything else (chat, settings, credits) serves these. A feature that serves none of them needs a reason before it gets a screen.</p>
          <G.Table head={['Job', 'Where the system does it']} rows={JOBS.map(function (j) {
            return [j[0], <span>{j[1].map(function (id, i) { return <span key={id}>{i ? ', ' : ''}<Go id={id} /></span>; })}</span>];
          })} />
        </G.Part>

        <G.Part name="The numbers, as V2 has them today">
          <p className="g-role">The system reads these from one Worker record (section 41), never from a second constant.</p>
          <G.Table head={['What', 'V2 today', 'Source']} rows={[
            ['Program', '20 days, ends Nov 1 (V2 dropped its rate and bonus constants on 2026-10-14)', <Src at={G.refText('worker.rule.const')} />],
            ['Cash out', 'From $10; no period lock since 2026-10-14 (the site’s one rule is the minimum)', <Src at={G.refText('worker.rule.cash-out')} />],
            ['The site’s program', 'At least 20 days each month to earn $30', <Src at={G.refText('entry-patterns.family.pay')} />],
            ['AI credits', '2,000 granted every day', <Src at={G.refText('credits-settings.grant.daily')} />],
            ['Modes', 'Always ask and Automatic (V2: YouTube only)', <Src at={G.refText('entry-patterns.copy.modes')} />],
            ['Ticks', 'Pending verification, then verified', <Src at={G.refText('entry-patterns.copy.pending')} />],
          ]} />
          <G.Warn>The money model is decision D3: the app’s former $1 a day plus a $10 bonus (gone from V2 since 2026-10-14), or the site’s $30 for 20 days. Until the PM picks one, the system shows days, not dollars (section 73). The $10 cash-out minimum holds under both, so it is stated wherever cash out is.</G.Warn>
        </G.Part>
      </G.Section>
    );
  }
  G.register('concept', ConceptSection);
})();
