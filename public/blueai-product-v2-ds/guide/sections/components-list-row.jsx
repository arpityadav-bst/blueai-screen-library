/* Section 18 List row (display-feedback slice). Kit: window.V2Kit.ListRow (kit/display.jsx). */
(function () {
  const G = window.V2Guide;
  const noop = function () {};

  function ListRowSection() {
    const K = window.V2Kit || {};
    const Row = K.ListRow;
    const Card = K.Card;
    const Icon = K.Icon || function () { return null; };
    function inCard(node) { return <div style={{ width: '100%' }}><Card padding="none">{node}</Card></div>; }
    const sw = K.Switch ? <K.Switch checked onChange={noop} label="Automatic" /> : null;
    return (
      <G.Section id="list-row">
        <G.Part name="ListRow" status="changed" role="The line every settings, account, activity and notification list is made of. One shape, five variants.">
          <G.Stage ground="canvas" width="shell">
            <Card padding="none">
              <Row label="Next run" value="Today, 11 am" />
              <Row label="Run window" description="BlueAI starts once a day inside this window." value="9 am to 9 pm" />
              <Row leading={<Icon name="user" size={20} />} label="Account" onClick={noop} />
            </Card>
          </G.Stage>
          <ul className="g-list">
            <li>Min height 48, padding 12 16, gap 12; content centred on the row.</li>
            <li>Leading (optional): a 20px icon in ink-3, or an Avatar 32/40.</li>
            <li>Label 14/500 ink; description 13 ink-3 under it (also where a disabled row says why).</li>
            <li>Trailing, one of: a value (14 ink-2, tabular), a control, a Badge, a chevron (nav), an external mark.</li>
            <li>Divider: a 1px hairline between rows, inset 16, none after the last.</li>
          </ul>

          <G.StateGrid wide states={[
            { label: 'Value', node: inCard(<Row label="Next run" value="Today, 11 am" divider={false} />) },
            { label: 'Value with description', node: inCard(<Row label="Run window" description="BlueAI starts once a day inside this window." value="9 am to 9 pm" divider={false} />) },
            { label: 'Control', note: 'row is a div; the control is the target', node: inCard(<Row label="YouTube" description="Takes paid jobs without asking" trailing={sw} divider={false} />) },
            { label: 'Badge', note: 'an Activity day', node: inCard(<Row label="Oct 12" description="Commented on 1 video" badge={<K.Badge tone="success" icon="check-double">Verified</K.Badge>} divider={false} />) },
            { label: 'Nav: rest', node: inCard(<Row leading={<Icon name="user" size={20} />} label="Account" onClick={noop} divider={false} />) },
            { label: 'Nav: hover', node: inCard(<Row leading={<Icon name="user" size={20} />} label="Account" onClick={noop} divider={false} className="is-hover" />) },
            { label: 'Nav: focus-visible', node: inCard(<Row leading={<Icon name="user" size={20} />} label="Account" onClick={noop} divider={false} className="is-focus" />) },
            { label: 'Nav: pressed', node: inCard(<Row leading={<Icon name="user" size={20} />} label="Account" onClick={noop} divider={false} className="is-active" />) },
            { label: 'Nav: external', note: 'opens the site', node: inCard(<Row leading={<Icon name="link" size={20} />} label="Earnings" href="https://bluestacks.ai/dashboard" external divider={false} />) },
            { label: 'Expandable: closed', node: inCard(<Row label="Oct 11" description="1 job, 2 actions" expandable expanded={false} divider={false}>Watched the video, then liked it.</Row>) },
            { label: 'Expandable: open', note: 'aria-expanded', node: inCard(<Row label="Oct 11" description="1 job, 2 actions" expandable expanded divider={false}>Watched the video, then liked it.</Row>) },
            { label: 'Destructive', node: inCard(<Row leading={<Icon name="sign-out" size={20} />} label="Disconnect YouTube" danger onClick={noop} divider={false} />) },
            { label: 'Disabled, with the reason', node: inCard(<Row leading={<Icon name="pause" size={20} />} label="Pause the worker" disabled disabledReason="Available after setup." onClick={noop} divider={false} />) },
            { label: 'A list', note: 'hairlines between rows only', node: inCard(<>
              <Row label="Paid jobs" value="Always ask" />
              <Row label="Run window" value="9 am to 9 pm" />
              <Row label="Next run" value="Today, 11 am" />
            </>) },
          ]} />

          <G.CompareRow
            v2={<G.Live label="AISettingsCard (settings.jsx)" get={function () { return window.AISettingsCard || null; }} />}
            system={
              <Card padding="none">
                <Row label="AI model" value="Auto" />
                <Row label="Max steps" description="Reasoning steps per run, 10 to 500." value="50" />
                <Row label="Timeout" value="20 min" />
                <Row leading={<Icon name="sign-out" size={20} />} label="Sign out" onClick={noop} />
              </Card>
            }
            changed="Four row shapes become one. Profile rows put a grey 14.5 label against a 14.5/600 value; Settings rows put a 15/700 label over a 12px hint that reads at 2.54:1; the Sign out card is a whole card with a hover set from a mouse handler; History rows are a card each, with a chevron that turns but no aria-expanded. The system row is 14/500 over a 13 description, hover only on rows that go somewhere, a hairline between rows, and expandable rows that say aria-expanded." />

          <G.SpecDrawer rows={[
            { part: 'Height', token: null, value: 'min 48px', ref: ['display-feedback.row.profile', 'display-feedback.row.settings'] },
            { part: 'Padding', token: '--v2-space-3 / --v2-space-4', value: '12px 16px', ref: ['display-feedback.row.profile', 'display-feedback.row.nav'] },
            { part: 'Label', token: '--v2-text-14 / --v2-weight-medium / --v2-ink', value: '14px / 500', ref: ['display-feedback.row.profile-label', 'display-feedback.row.settings-label'] },
            { part: 'Description', token: '--v2-text-13 / --v2-ink-3', value: '13px, 6.0:1', ref: 'display-feedback.row.settings-hint' },
            { part: 'Value', token: '--v2-text-14 / --v2-ink-2', value: '14px / 400, tabular', ref: 'display-feedback.row.profile-value' },
            { part: 'Divider', token: '--v2-line-hair', value: '1px, inset 16, between rows only', ref: ['display-feedback.row.profile', 'display-feedback.row.settings'] },
            { part: 'Hover (nav only)', token: '--v2-wash-hover', value: 'black 4.5% wash, in CSS', ref: 'display-feedback.row.nav-hover' },
            { part: 'Pressed', token: '--v2-wash-press', value: 'black 7% wash' },
            { part: 'Focus', token: '--v2-focus-outline', value: '2px blue, inset 2px (rows sit in clipped cards)' },
            { part: 'Chevron', token: '--v2-ink-4', value: '16px; turns 180 over --v2-dur-2 when expanded', ref: 'display-feedback.row.history-chevron' },
            { part: 'Expandable', token: null, value: 'button with aria-expanded + aria-controls', ref: ['display-feedback.row.history', 'display-feedback.row.history-toggle'] },
            { part: 'Danger', token: '--v2-danger-ink', value: 'label and leading icon' },
            { part: 'Disabled', token: '--v2-opacity-disabled', value: '0.45 on label and marks; the reason stays ink-3' },
            { part: 'Copy', token: null, value: 'AI model, Auto (sentence case)', ref: ['display-feedback.row.copy-model', 'display-feedback.row.copy-auto'] },
            { part: 'Copy', token: null, value: 'Max steps, 10 to 500, 50', ref: ['display-feedback.row.copy-steps', 'display-feedback.row.copy-steps-value'] },
            { part: 'Copy', token: null, value: 'Timeout, 20 min (V2 says 1200 in seconds)', ref: ['display-feedback.row.copy-timeout', 'display-feedback.row.copy-timeout-value'] },
            { part: 'Copy', token: null, value: 'Sign out', ref: 'display-feedback.row.copy-sign-out' },
            { part: 'Link', token: null, value: 'Earnings: https://bluestacks.ai/dashboard', ref: 'display-feedback.stat.earnings' },
            { part: 'Copy (proposed)', token: null, value: 'Next run, Run window, Paid jobs, Disconnect YouTube, Pause the worker' },
          ]} />

          <G.DoDont
            do={['Group rows in one Card with padding none.', 'Use a value row for facts and a nav row for places.', 'Give a disabled row its reason as the description.']}
            dont={['A control inside a nav row (two targets in one).', 'A card per row: that is History in V2, and it triples the edges.', 'Hover on rows that do nothing.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('list-row', ListRowSection);
})();
