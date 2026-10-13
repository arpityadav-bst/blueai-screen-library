/* Section 22 Empty state (display-feedback slice). Kit: window.V2Kit.EmptyState (kit/notice.jsx). */
(function () {
  const G = window.V2Guide;
  const noop = function () {};
  const full = { width: '100%' };

  function EmptySection() {
    const K = window.V2Kit || {};
    const E = K.EmptyState;
    const first = <E variant="first" title="No runs yet" body="Your first run starts today at 11 am. Each run shows up here, with what it did and whether the day counts." />;
    return (
      <G.Section id="empty-state">
        <G.Part name="EmptyState" status="changed" role="What a view shows with nothing in it: names what will appear, says why, and offers the one way forward.">
          <G.Stage ground="canvas" width="shell">{first}</G.Stage>
          <ul className="g-list">
            <li>The site's dashed ghost: 1px dashed --v2-line-strong, radius 16, panel fill, padding 32 24. A dashed edge says "a thing will be here".</li>
            <li>Icon 24 in ink-3, no disc, no colour.</li>
            <li>Title 16/600 ink (an h2 by default). Body 13 ink-3, at most 280 wide.</li>
            <li>At most one medium primary button, and only when there is a real next step; a secondary quiet one beside it if needed.</li>
            <li>Arrives with .v2-anim-fade-up (180ms, 6px rise); simply there under reduced motion.</li>
          </ul>

          <G.StateGrid wide states={[
            { label: 'First use', note: 'names what will appear', node: <div style={full}>{first}</div> },
            { label: 'No results', node: <div style={full}><E variant="noresults" title="No unread notifications" body="You're up to date. Earlier ones are under All." secondaryAction={{ label: 'Show all', onClick: noop }} /></div> },
            { label: 'Error', note: 'what failed, what it means, one step', node: <div style={full}><E variant="error" title="Couldn't load your runs" body="Nothing is lost: today's run and your days are not affected." primaryAction={{ label: 'Try again', onClick: noop }} /></div> },
            { label: 'Error, action loading', node: <div style={full}><E variant="error" title="Couldn't load your runs" body="Nothing is lost: today's run and your days are not affected." primaryAction={{ label: 'Try again', onClick: noop, loading: true }} /></div> },
            { label: 'Offline', node: <div style={full}><E variant="offline" title="You're offline" body="Activity updates when BlueAI is back online. Today's run starts then too." /></div> },
            { label: 'Locked', note: 'says what unlocks it', node: <div style={full}><E variant="locked" title="Activity starts after setup" body="Set up your worker once in a short chat. Every run then shows up here." primaryAction={{ label: 'Set up the worker', onClick: noop }} /></div> },
            { label: 'Copy only', note: "the site's Past tab", node: <div style={full}><E variant="first" icon={null} body="Nothing here yet. Programs you finish will show up here, with what each one earned." /></div> },
          ]} />

          <G.CompareRow
            v2={<G.FrameState url="index.html?start=worker" label="Worker home, then the Jobs tab (Coming Soon)" height={830} />}
            system={<div style={full}>{first}</div>}
            changed="Two looks with off-palette art: Schedule's purple icon on a purple disc inside a shadowed card, and Jobs' 120px disc with a brown briefcase over 'Coming Soon', standing in for a whole tab. Schedule's body reads at 2.54:1. The system follows the site's voice and its dashed ghost: name what will appear, one muted line of why, a neutral icon, and a button only when there is something to do. Jobs and Schedule give way to Activity (R04)." />

          <G.SpecDrawer rows={[
            { part: 'Edge', token: '--v2-line-strong', value: '1px dashed', ref: 'display-feedback.empty.site-ghost' },
            { part: 'Fill', token: '--v2-surface-panel', value: '#fdfdfd, no shadow', ref: 'display-feedback.empty.schedule' },
            { part: 'Radius', token: '--v2-radius-lg', value: '16px', ref: 'display-feedback.empty.schedule' },
            { part: 'Padding', token: '--v2-space-8 / --v2-space-6', value: '32px 24px', ref: ['display-feedback.empty.site-empty', 'display-feedback.empty.schedule'] },
            { part: 'Icon', token: '--v2-icon-lg / --v2-ink-3', value: '24px, no disc', ref: ['display-feedback.empty.schedule-disc', 'display-feedback.empty.schedule-icon', 'display-feedback.empty.jobs-disc', 'display-feedback.empty.jobs-icon'] },
            { part: 'Title', token: '--v2-text-16 / --v2-weight-semibold', value: '16px / 600 ink', ref: 'display-feedback.empty.jobs-title' },
            { part: 'Body', token: '--v2-text-13 / --v2-ink-3', value: '13px, 6.0:1, max 280px', ref: 'display-feedback.empty.schedule-body' },
            { part: 'Action', token: null, value: 'Button primary md (36), one', ref: 'display-feedback.empty.site-button' },
            { part: 'Arrival', token: '--v2-dur-2 / --v2-ease-out', value: '.v2-anim-fade-up: fade + 6px rise' },
            { part: 'Copy (V2, replaced)', token: null, value: 'No scheduled tasks', ref: 'display-feedback.empty.schedule-title' },
            { part: 'Copy (V2, replaced)', token: null, value: 'Coming Soon. We are working on this section to bring you new opportunities. Check back soon for updates!', ref: ['display-feedback.empty.jobs-title', 'display-feedback.empty.jobs-body'] },
            { part: 'Copy (the site)', token: null, value: 'Nothing here yet. Programs you finish will show up here, with what each one earned.', ref: 'display-feedback.empty.site-copy' },
            { part: 'Copy (proposed)', token: null, value: "No runs yet, Couldn't load your runs, You're offline, Activity starts after setup" },
          ]} />

          <G.DoDont
            do={['Name what will appear and when, in the site\'s words.', 'Offer the one action that fills the view, if there is one.', 'Say what unlocks a locked view.']}
            dont={["'Coming Soon' as a whole tab.", 'Coloured discs, mascots or illustrations.', 'Two primary buttons, or a button that does not fill the view.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('empty-state', EmptySection);
})();
