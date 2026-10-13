/* Section 04 Type (foundations slice). One face, twelve text styles (kit/base.css .v2-text-*),
   three weights, numerals. Sample copy is quoted from V2 (refs in guide/refs/foundations.js) except
   the display figure and the greeting, which are labelled proposed. */
(function () {
  const G = window.V2Guide;

  // [class, sample node, size/weight/leading/tracking, ink, use, ref id or null]
  const LADDER = [
    ['v2-text-display', '2,000', '40 / 600 / 1 / -0.03em, tabular', '--v2-ink', 'Credits balance numeral (proposed figure: the daily grant)', null],
    ['v2-text-greeting', 'Hi, Alex', '24 / 600 / 1.2 / -0.02em', '--v2-ink', "Home greeting, welcome title (proposed: V2's 'Hi, Alex' carries an emoji)", 'foundations.type.greeting'],
    ['v2-text-title-lg', 'AI Credits', '20 / 600 / 1.2 / -0.02em', '--v2-ink', 'Every screen title and dialog title', 'foundations.type.title-ai-credits'],
    ['v2-text-numeral-sm', '7', '20 / 600 / 1 / -0.02em, tabular', '--v2-ink', "Counts beside a label: '7 of 20 days'", 'foundations.type.day-count-copy'],
    ['v2-text-title', 'BlueStacks Instance', '16 / 600 / 1.2 / -0.01em', '--v2-ink', 'Card titles, section heads', 'foundations.type.card-title'],
    ['v2-text-mini-title', 'Balance', '13 / 600 / 1.35 / 0.02em', '--v2-ink', 'Label over a figure in a card (StatCard)', null],
    ['v2-text-body', 'You can pause, stop, or disconnect anytime.', '14 / 400 / 1.5 / 0', '--v2-ink-2', 'Bubbles, composer, paragraphs, fields', 'foundations.type.body-copy'],
    ['v2-text-body-sm', 'Every task and job BlueAI does uses credits.', '13 / 400 / 1.5 / 0', '--v2-ink-3', 'Descriptions, notes, consequences', 'foundations.type.body-sm-copy'],
    ['v2-text-label', 'Switch account', '13 / 500 / 1.35 / -0.01em', '--v2-ink-2', 'Buttons, chips, nav, menu rows', 'foundations.blue.gate-label'],
    ['v2-text-meta', 'Working on it…', '12 / 400 / 1.35 / 0', '--v2-ink-4', 'Timestamps, counts, hints', 'foundations.ink.thinking-copy'],
    ['v2-text-eyebrow', 'Plan', '11 / 500 / 1 / 0.08em, uppercase', '--v2-ink-3', 'Section labels only; status words are Badges', 'foundations.type.eyebrow'],
    ['v2-text-mono', 'claude-haiku-4-5', '13 / 400 / 1.35 / 0, mono', '--v2-ink-2', 'Keys, endpoints, model ids', 'foundations.type.mono-hint'],
  ];
  function sample(row) {
    if (row[0] === 'v2-text-numeral-sm') return <span className="v2-hstack v2-hstack--baseline v2-gap-1"><span className="v2-text-numeral-sm">7</span><span className="v2-text-body-sm">of 20 days</span></span>;
    return <span className={row[0]}>{row[1]}</span>;
  }

  // V2's seven page-title recipes, drawn from the cited lines in V2's own font stack.
  const TITLES = [
    ['AI Credits', { fontSize: 19, fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }, '19 / 800', 'foundations.type.title-ai-credits'],
    ['Chat History', { fontSize: 22, fontWeight: 800, color: '#111827', letterSpacing: '-0.4px' }, '22 / 800', 'foundations.type.title-history'],
    ['Scheduled tasks', { fontSize: 20, fontWeight: 700, color: '#111827' }, '20 / 700', 'foundations.type.title-schedule'],
    ['Coming Soon', { fontSize: 22, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.3px' }, '22 / 800', 'foundations.type.title-jobs'],
    ['Before you start', { fontSize: 20, fontWeight: 800, color: '#111827', letterSpacing: '-0.4px', lineHeight: 1.25 }, '20 / 800', 'foundations.type.title-terms'],
    ['Logout', { fontSize: 19, fontWeight: 800, color: '#111827' }, '19 / 800', 'foundations.type.title-logout'],
    ['Job details', { fontSize: 18, fontWeight: 600, color: '#111827' }, '18 / 600', 'foundations.type.title-modal'],
  ];

  function TypeSection() {
    const K = window.V2Kit || {};
    return (
      <G.Section id="type">
        <G.Part name="Type ladder" status="changed" role="Twelve text styles, one recipe per role: size, weight, leading, tracking and ink travel together, so a screen never re-decides how loud a line is.">
          <G.StateGrid wide states={LADDER.map(function (row) {
            return { label: '.' + row[0] + '  ' + row[2], note: row[4], node: <div style={{ width: '100%' }}>{sample(row)}</div> };
          })} />
          <div className="v2-hstack v2-wrap v2-gap-6">
            <div className="v2-stack v2-gap-1"><span className="v2-text-eyebrow">Face</span><span className="v2-text-title">Inter</span><span className="v2-text-mono">ui-monospace</span><span style={{ fontFamily: 'var(--v2-font-serif)', fontStyle: 'italic', fontSize: 'var(--v2-text-20)', color: 'var(--v2-ink)' }}>Instrument Serif</span></div>
            <div className="v2-stack v2-gap-1"><span className="v2-text-eyebrow">Weights</span><span className="v2-text-body" style={{ fontWeight: 'var(--v2-weight-regular)' }}>400 regular: body</span><span className="v2-text-body" style={{ fontWeight: 'var(--v2-weight-medium)' }}>500 medium: labels, buttons, nav</span><span className="v2-text-body" style={{ fontWeight: 'var(--v2-weight-semibold)', color: 'var(--v2-ink)' }}>600 semibold: titles, figures</span></div>
          </div>
          <G.CompareRow
            v2={<div className="v2-stack"><G.Live get={function () { return window.ChatCompare && window.ChatCompare.IntroCard; }} label="ChatCompare.IntroCard" /><G.Live get={function () { return window.WorkerCards && window.WorkerCards.PlanCard; }} label="WorkerCards.PlanCard" /></div>}
            system={<div className="v2-stack v2-gap-4"><span className="v2-text-greeting">Hi, Alex</span><div className="v2-stack v2-gap-2"><span className="v2-text-eyebrow">Plan</span><span className="v2-text-body">You can pause, stop, or disconnect anytime.</span><span className="v2-text-meta">Working on it…</span></div></div>}
            changed="V2 sets this in -apple-system first, so Macs show SF and Windows shows Plus Jakarta Sans, at 30 sizes with weight 800 for emphasis and a 10/700 pale-blue eyebrow. The system is Inter on both, eight sizes, three weights (400, 500, 600), and one recipe per role." />
          <G.Note>Row labels are 14/500 ink, set by ListRow (section 18), with no class of their own.</G.Note>
          <G.Note>Inter is the one UI face: the partner applies on, and comes back to, the onBlue site, which is Inter end to end, and putting it first in the stack ends the split where Macs render SF and Windows renders Plus Jakarta Sans. Instrument Serif italic appears only on the site-language sign-in pages. Decision D11 lets the PM keep Plus Jakarta Sans; the scale and weights hold either way.</G.Note>
          <G.SpecDrawer rows={[
            { part: 'UI face', token: '--v2-font-ui', value: "'Inter', system-ui, 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif", ref: 'foundation.font-stack' },
            { part: 'Welcome face, retired', token: '--v2-font-ui', value: 'Space Grotesk 27/700 becomes Inter 24/600', ref: 'foundations.type.welcome-face' },
            { part: 'Weights', token: '--v2-weight-*', value: '400 / 500 / 600 (V2: 800 used 71 times)', ref: ['foundations.type.title-history', 'foundations.type.title-logout'] },
          ].concat(LADDER.map(function (row) {
            return { part: '.' + row[0], token: row[3], value: row[2], ref: row[5] || undefined };
          }))} />
        </G.Part>

        <G.Part name="Page titles, V2 today" status="changed" role="Seven title recipes in V2 become one: every screen and dialog title is .v2-text-title-lg, 20/600.">
          <G.CompareRow
            v2={<div className="g-live v2-stack v2-gap-2">{TITLES.map(function (t) {
              return <div key={t[0]} className="v2-hstack v2-hstack--between v2-hstack--baseline"><span style={t[1]}>{t[0]}</span><span className="v2-text-meta v2-tabular">{t[2]}</span></div>;
            })}</div>}
            system={<div className="v2-stack v2-gap-2">{TITLES.map(function (t) {
              return <div key={t[0]} className="v2-hstack v2-hstack--between v2-hstack--baseline"><span className="v2-text-title-lg">{t[0]}</span><span className="v2-text-meta v2-tabular">20 / 600</span></div>;
            })}</div>}
            changed="AI Credits 19/800, Chat History 22/800, Scheduled tasks 20/700, Coming Soon 22/800 in a different ink, the terms sheet 20/800, Logout 19/800 and the modal 18/600: moving between tabs re-decided how loud a title is. One recipe, 20/600 in ink, ends that. The words are V2's here; copy changes (Logout becomes Sign out) live in section 70." />
          <G.FrameState url="index.html?start=worker" label="V2 worker home: open AI Credits and Chat History from the header to see two of the recipes in place" height={520} />
          <G.SpecDrawer rows={TITLES.map(function (t) {
            return { part: "'" + t[0] + "'", token: '--v2-text-20 / --v2-weight-semibold', value: 'V2 ' + t[2] + ', system 20 / 600', ref: t[3] };
          }).concat([
            { part: 'Copy shown', token: null, value: "'Chat History', 'Coming Soon', 'Before you start', 'Job details'", ref: ['foundations.type.title-history-copy', 'foundations.type.title-jobs-copy', 'foundations.type.terms-copy', 'foundations.type.modal-copy'] },
          ])} />
        </G.Part>

        <G.Part name="Numerals" status="changed" role="Figures that matter are ink and tabular: credits, day counts and money never take a gradient or a colour.">
          <G.StateGrid states={[
            { label: 'Credits balance', note: '.v2-text-display', node: <span className="v2-hstack v2-gap-2">{K.Icon ? <K.Icon name="credits" size={24} /> : null}<span className="v2-text-display">2,000</span></span> },
            { label: '7 of 20 days', note: '.v2-text-numeral-sm', node: <span className="v2-hstack v2-hstack--baseline v2-gap-1"><span className="v2-text-numeral-sm">7</span><span className="v2-text-body-sm">of 20 days</span></span> },
            { label: '$6', note: 'money in ink', node: <span className="v2-text-body-sm"><strong className="v2-tabular">$6</strong> earned</span> },
          ]} />
          <G.CompareRow
            v2={<div className="v2-stack"><G.Live get={function () { return window.Byok && window.Byok.OutOfCreditsCard; }} props={{ onDismiss: function () {} }} label="Byok.OutOfCreditsCard" /><G.Live get={function () { return window.WorkerDayDone && window.WorkerDayDone.EarningsStrip; }} label="WorkerDayDone.EarningsStrip" /></div>}
            system={<div className="v2-stack v2-gap-4"><span className="v2-hstack v2-gap-2">{K.Icon ? <K.Icon name="credits" size={24} /> : null}<span className="v2-text-display">0</span></span><span className="v2-hstack v2-hstack--between"><span className="v2-text-label" style={{ color: 'var(--v2-ink)' }}>Day 7 of 20</span><span className="v2-text-label v2-tabular" style={{ color: 'var(--v2-ink)' }}>$6 earned</span></span></div>}
            changed="Credits numbers drop the gradient (54/800 and 38/800 in V2) and become 40/600 ink. Dollars drop green: on the site, money is a figure, not a state, so green stays for verified days. Day counts drop the green-when-counted switch: the tick says counted." />
          <G.SpecDrawer rows={[
            { part: 'Credits balance', token: '--v2-text-40 / --v2-ink', value: '40 / 600, tabular', ref: ['foundations.type.balance', 'foundations.type.ooc-numeral'] },
            { part: 'Day count', token: '--v2-text-20 / --v2-ink', value: '20 / 600, tabular', ref: ['foundations.type.day-count', 'foundations.type.day-count-copy'] },
            { part: 'Money', token: '--v2-ink', value: 'ink, weight 600 inside a note', ref: ['foundations.type.money-earned', 'foundations.status.money-green'] },
          ]} />
        </G.Part>
      </G.Section>
    );
  }
  G.register('type', TypeSection);
})();
