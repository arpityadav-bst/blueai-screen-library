/* Section 19 Card and stat card (display-feedback slice). Kit: window.V2Kit.Card, StatCard
   (kit/display.jsx). */
(function () {
  const G = window.V2Guide;
  const noop = function () {};
  const full = { width: '100%' };
  const title = { display: 'block', color: 'var(--v2-ink)', fontSize: 'var(--v2-text-16)', fontWeight: 'var(--v2-weight-semibold)', letterSpacing: 'var(--v2-tracking-label)' };
  const body = { display: 'block', marginTop: 'var(--v2-space-1)', color: 'var(--v2-ink-3)', fontSize: 'var(--v2-text-13)', lineHeight: 'var(--v2-leading-body)' };

  function Content({ t, b }) { return <><span style={title}>{t}</span><span style={body}>{b}</span></>; }

  function CardSection() {
    const K = window.V2Kit || {};
    const Card = K.Card;
    const Stat = K.StatCard;
    const Row = K.ListRow;
    const Icon = K.Icon || function () { return null; };
    const earnings = K.Link
      ? <K.Link href="https://bluestacks.ai/dashboard" external>Earnings</K.Link>
      : <a className="g-link" href="https://bluestacks.ai/dashboard" target="_blank" rel="noopener">Earnings</a>;
    const ctx = <><b>6</b> verified, <b>1</b> pending.</>;
    return (
      <G.Section id="card">
        <G.Part name="Card" status="changed" role="The one surface. Static cards never answer hover; a pressable card is a real button or link whose line firms up.">
          <G.Stage ground="canvas" width="shell">
            <Card><Content t="BlueStacks" b="Connected to BlueStacks App Player. To switch, open BlueAI from another instance." /></Card>
          </G.Stage>
          <ul className="g-list">
            <li>Surface white, 1px --v2-line, radius 16, padding 16, no shadow (the site's move: lines, not casts).</li>
            <li>Padding md 16 (default), sm 12, none (for a list of rows; the card clips them).</li>
            <li>Inset panel: the panel step inside a card, radius 10, hairline, padding 12.</li>
            <li>Pressable only when the whole card goes somewhere: a button or a link, never a clickable div.</li>
          </ul>

          <G.StateGrid wide states={[
            { label: 'Static', note: 'no hover', node: <div style={full}><Card><Content t="Today’s run" b="Starts at 11 am." /></Card></div> },
            { label: 'Pressable: rest', node: <div style={full}><Card onClick={noop}><Content t="Today’s run" b="Starts at 11 am." /></Card></div> },
            { label: 'Pressable: hover', note: 'line firms up', node: <div style={full}><Card onClick={noop} className="is-hover"><Content t="Today’s run" b="Starts at 11 am." /></Card></div> },
            { label: 'Pressable: focus-visible', node: <div style={full}><Card onClick={noop} className="is-focus"><Content t="Today’s run" b="Starts at 11 am." /></Card></div> },
            { label: 'Pressable: pressed', node: <div style={full}><Card onClick={noop} className="is-active"><Content t="Today’s run" b="Starts at 11 am." /></Card></div> },
            { label: 'Inset panel', note: 'inside a card', node: <div style={full}><Card><Content t="Today’s run" b="Starts at 11 am." /><div style={{ marginTop: 'var(--v2-space-3)' }}><Card inset><span style={body}>BlueAI asks before it takes a paid job.</span></Card></div></Card></div> },
            { label: 'Padding none, with rows', node: <div style={full}><Card padding="none"><Row label="Paid jobs" value="Always ask" /><Row leading={<Icon name="user" size={20} />} label="Account" onClick={noop} /></Card></div> },
          ]} />

          <G.CompareRow
            v2={<G.Live label="BluestacksCard (settings.jsx)" get={function () { return window.BluestacksCard || null; }} />}
            system={<Card><Content t="BlueStacks" b="Connected to BlueStacks App Player. To switch, open BlueAI from another instance." /></Card>}
            changed="V2's in-flow cards carry seven shadow strengths on top of their lines (settings 8%, profile 6%, credits 4%; the EarningsStrip's 24px cast left with the strip on 2026-10-14) and a different line colour on each. The system card is the line alone, radius 16, padding 16, and only a card that goes somewhere answers hover, by firming its line (the site's rule for surfaces)." />

          <G.SpecDrawer rows={[
            { part: 'Fill', token: '--v2-surface', value: '#ffffff', ref: ['display-feedback.card.credits', 'display-feedback.card.settings'] },
            { part: 'Line', token: '--v2-line', value: 'black 10%', ref: ['display-feedback.card.credits', 'display-feedback.card.settings', 'display-feedback.card.profile'] },
            { part: 'Radius', token: '--v2-radius-lg', value: '16px', ref: ['display-feedback.card.settings', 'display-feedback.card.site-radius'] },
            { part: 'Padding', token: '--v2-space-4', value: '16px (sm 12, none)', ref: 'display-feedback.card.settings' },
            { part: 'Shadow', token: '--v2-shadow-0', value: 'none', ref: ['display-feedback.card.settings', 'display-feedback.card.profile', 'display-feedback.card.credits'] },
            { part: 'Hover (pressable)', token: '--v2-line-hover', value: 'black 20% line' },
            { part: 'Pressed', token: '--v2-wash-press', value: 'black 7% wash over the surface' },
            { part: 'Focus', token: '--v2-focus-outline', value: '2px blue, offset 2' },
            { part: 'Inset', token: '--v2-surface-panel / --v2-line-hair / --v2-radius-md', value: '#fdfdfd, black 8%, 10px' },
            { part: 'Copy', token: null, value: 'Connected to BlueStacks App Player', ref: 'display-feedback.card.bs-copy' },
            { part: 'Copy', token: null, value: 'To switch, open BlueAI from another instance.', ref: 'display-feedback.card.bs-copy-2' },
          ]} />

          <G.DoDont
            do={['Stack cards 12 apart on the canvas.', 'Make the whole card the target when it opens one place.']}
            dont={['A shadow on anything in the flow.', 'Hover on a card that does nothing.', 'Cards inside cards: use the inset panel.']} />
        </G.Part>

        <G.Part name="StatCard" status="changed" role="One figure that matters, in ink: credits left today, days this program. Label, figure, one line of context, one action.">
          <G.StateGrid wide states={[
            { label: 'Value (display)', node: <div style={full}><Stat label="AI credits left today" value={2000} context="Refills to 2,000 every day." /></div> },
            { label: 'Zero', note: 'same size; the banner above explains', node: <div style={full}><Stat label="AI credits left today" value={0} context={<>Back to 2,000 in <b>6h 42m</b>.</>} /></div> },
            { label: 'Loading', node: <div style={full}><Stat label="AI credits left today" loading /></div> },
            { label: 'Replaced (own key)', node: <div style={full}><Stat label="AI credits" size="compact" value="Running on your own key" context="No BlueAI credits are consumed while this is on." /></div> },
            { label: 'Compact, with action', node: <div style={full}><Stat label="Your 20 days" size="compact" value="Day 7" unit="of 20" context={ctx} action={earnings} /></div> },
          ]} />

          <G.CompareRow
            v2={<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)' }}>
              <G.FrameState url="index.html?start=worker" label="AI Credits screen: open the credits pill in the top bar" height={830} />
            </div>}
            system={<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)', width: '100%' }}>
              <Stat label="Your 20 days" size="compact" value="Day 7" unit="of 20" context={ctx} action={earnings} />
              <Stat label="AI credits left today" value={2000} context="Refills to 2,000 every day." />
            </div>}
            changed="The credits figure is 54/800 in the brand gradient (38 when zero) inside 28px padding, and V2's progress strip left the app on 2026-10-14. The system figure is ink, 40/600 tabular (20 compact), the same size at zero, one mini-title label per card (the site's .mini-title), and money and counts stay in ink: green means reached, a figure is not a state." />

          <G.SpecDrawer rows={[
            { part: 'Label', token: '.v2-text-mini-title (--v2-text-13, --v2-weight-semibold, --v2-ink)', value: '13 / 600, sentence case, 0.02em (the site’s .mini-title, onblue.css:1935-1942)', ref: 'display-feedback.stat.site-label' },
            { part: 'Figure', token: '--v2-text-40 / --v2-weight-semibold / --v2-ink', value: '40px / 600, -0.03em, tabular', ref: ['display-feedback.stat.figure', 'display-feedback.stat.gradient'] },
            { part: 'Figure (compact)', token: '--v2-text-20', value: '20px / 600, -0.02em' },
            { part: 'Unit', token: '--v2-text-14 / --v2-ink-3', value: '14px / 500' },
            { part: 'Context', token: '--v2-text-13 / --v2-ink-3', value: '13px; figures in it bold ink', ref: 'display-feedback.stat.site-note' },
            { part: 'Padding', token: '--v2-space-4', value: '16px (it is a Card)', ref: 'display-feedback.stat.padding' },
            { part: 'Copy', token: null, value: 'Running on your own key', ref: 'display-feedback.stat.own-key' },
            { part: 'Copy', token: null, value: 'No BlueAI credits are consumed while this is on.', ref: 'display-feedback.stat.own-key-copy' },
            { part: 'Link', token: null, value: 'Earnings: the partner dashboard', ref: 'worker.earnings.menu-url' },
            { part: 'Copy (proposed)', token: null, value: 'AI credits left today, Refills to 2,000 every day., Your 20 days' },
          ]} />

          <G.DoDont
            do={['One figure per card, with the words that make it mean something.', 'Keep the figure the same size at zero; let a Banner say why.']}
            dont={['Gradient or green figures.', 'Two label styles in one card.', "Credits as money: they are an allowance, 'left today', never 'earned'."]} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('card', CardSection);
})();
