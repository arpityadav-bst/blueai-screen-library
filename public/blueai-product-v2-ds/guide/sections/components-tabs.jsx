/* Section 28: Tabs (overlays slice). Kit: V2Kit.Tabs, V2Kit.TabPanel (kit/tabs.jsx).
   Every label here is proposed copy (the part is New). */
(function () {
  const G = window.V2Guide;
  const { useState } = React;
  const noop = function () {};
  const ACTIVITY = [{ id: 'program', label: 'This program', count: 7 }, { id: 'past', label: 'Past', count: 0 }];
  const INBOX = [{ id: 'all', label: 'All', count: 12 }, { id: 'unread', label: 'Unread', count: 3 }];

  function Win({ h, children }) {
    return (
      <div style={{
        width: '100%', minHeight: h, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'var(--v2-space-4)', background: 'var(--v2-canvas)',
        border: 'var(--v2-stroke) solid var(--v2-line-hair)', borderRadius: 'var(--v2-radius-md)',
      }}>{children}</div>
    );
  }
  function mark(tabs, id, cls, extra) {
    return tabs.map(function (t) { return t.id === id ? Object.assign({}, t, { className: cls }, extra || {}) : t; });
  }
  function T(props) {
    const K = window.V2Kit;
    return <Win h={72}><K.Tabs ariaLabel="Runs" value="program" onChange={noop} tabs={ACTIVITY} {...props} /></Win>;
  }

  function TryIt() {
    const K = window.V2Kit;
    const [tab, setTab] = useState('program');
    const [box, setBox] = useState('all');
    const text = { color: 'var(--v2-ink-3)', fontSize: 'var(--v2-text-13)', margin: 'var(--v2-space-3) 0 0' };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-5)', width: '100%' }}>
        <div>
          <K.Tabs full ariaLabel="Runs" idBase="g-tabs-activity" tabs={ACTIVITY} value={tab} onChange={setTab} />
          <K.TabPanel idBase="g-tabs-activity" id="program" hidden={tab !== 'program'}><p style={text}>Seven days of this program, newest first.</p></K.TabPanel>
          <K.TabPanel idBase="g-tabs-activity" id="past" hidden={tab !== 'past'}><p style={text}>No past programs yet. They appear here when this one ends.</p></K.TabPanel>
        </div>
        <div>
          <K.Tabs ariaLabel="Notifications" idBase="g-tabs-inbox" tabs={INBOX} value={box} onChange={setBox} />
          <K.TabPanel idBase="g-tabs-inbox" id="all" hidden={box !== 'all'}><p style={text}>Everything the worker told you.</p></K.TabPanel>
          <K.TabPanel idBase="g-tabs-inbox" id="unread" hidden={box !== 'unread'}><p style={text}>Three you have not opened.</p></K.TabPanel>
        </div>
      </div>
    );
  }

  function TabsSection() {
    return (
      <G.Section id="tabs">
        <G.Part name="Tabs" status="new"
          role="Switches between sibling views of one screen. Never navigation between screens; that is the bottom nav.">
          <p><strong>Why the product needs it.</strong> Activity (This program / Past) and Notifications (All / Unread)
            each hold two views of one list. V2 has no tabs a partner can reach: the only ones sit on the hidden Skills
            screen, an indigo underline that is a second accent. The family already has the control: the onBlue
            dashboard switches Active and Past programs with a recessed track and one raised chip with counts. Using
            it here means the partner meets the same switch on the site and in the app.</p>
          <G.StateGrid wide states={[
            { label: 'Rest', node: <T />, note: 'Past is at rest: ink-3 on the track.' },
            { label: 'Hover', node: <T tabs={mark(ACTIVITY, 'past', 'is-hover')} /> },
            { label: 'Selected', node: <T />, note: 'This program: the raised chip, ink, 500.' },
            { label: 'Focus-visible', node: <T tabs={mark(ACTIVITY, 'program', 'is-focus')} />, note: 'One tab stop; Left and Right move and select.' },
            { label: 'Disabled', node: <T tabs={mark(ACTIVITY, 'past', null, { disabled: true })} />, note: 'Rare: prefer an enabled tab with 0.' },
            { label: 'Count 0 still shown', node: <T value="past" />, note: 'The tab keeps its width when it empties.' },
          ]} />
          <G.Note>Try it: click, or Tab into a set and use the arrow keys, Home and End.</G.Note>
          <G.Stage width="shell"><TryIt /></G.Stage>
          <G.SpecDrawer rows={[
            { part: 'Track', token: '--v2-surface-sunken, --v2-line, --v2-radius-md', value: 'recessed, 1px 10% line, 10px', ref: ['overlays.tabs.track-fill', 'overlays.tabs.track-line', 'overlays.tabs.track-radius'] },
            { part: 'Track padding, gap', token: '--v2-space-05', value: '2px', ref: 'overlays.tabs.track-padding' },
            { part: 'Tab', token: '--v2-hit-min, --v2-radius-sm, --v2-space-3', value: '32px tall, radius 6, 12px sides' },
            { part: 'Label', token: '--v2-text-13, --v2-ink-3, --v2-weight-regular', value: '13/400, #5f636b', ref: 'overlays.tabs.tab-size' },
            { part: 'Hover', token: '--v2-wash-hover, --v2-ink', value: 'wash, label to ink', ref: 'overlays.tabs.hover' },
            { part: 'Selected', token: '--v2-surface, --v2-line, --v2-weight-medium', value: 'white chip, 1px line, 13/500 ink, no shadow', ref: ['overlays.tabs.selected-fill', 'overlays.tabs.selected-line', 'overlays.tabs.selected-weight'] },
            { part: 'Count', token: '--v2-text-12, --v2-ink-3', value: '12/400 tabular, #5f636b (the site’s dimmest ink is 4.42:1 on the track)', ref: 'overlays.tabs.count' },
            { part: 'Focus', token: '--v2-focus-outline', value: '2px blue ring, offset 2' },
            { part: 'Disabled', token: '--v2-opacity-disabled', value: '0.45, skipped by the arrows' },
            { part: 'Roles', token: null, value: 'tablist (named), tab (aria-selected, aria-controls), tabpanel', ref: 'overlays.tabs.markup' },
            { part: 'Motion', token: '--v2-dur-1', value: 'colour and fill 120ms' },
            { part: 'V2 today', token: null, value: 'indigo #4f46e5 underline tabs, hidden Skills screen only', ref: 'overlays.tabs.v2-skills' },
          ]} />
          <G.Note>Adapted from the site: the label goes from 12.5 to 13 and the selected weight from 550 to 500 (the
            product's type ladder), the track radius from 9 to 10 and its padding from 3 to 2 (the product's scales),
            the chip's shadow goes (lines, not shadows), the count is one ink darker so it passes AA on the track, and the tab is 32px tall, the product's smallest target.</G.Note>
          <G.DoDont
            do={['Use tabs for two or three views of the same list or screen.',
              'Show the count on every tab, 0 included.',
              'Keep labels to one or two words.']}
            dont={['Use tabs to move between screens.',
              'Put a tab inside a tab.',
              'Hide a tab when it is empty.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('tabs', TabsSection);
})();
