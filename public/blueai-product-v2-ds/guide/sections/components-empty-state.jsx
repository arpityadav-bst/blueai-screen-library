/* Section 22 Empty state (display-feedback slice). Kit: window.V2Kit.EmptyState (kit/notice.jsx). */
(function () {
  const G = window.V2Guide;
  const noop = function () {};
  const full = { width: '100%' };

  function EmptySection() {
    const K = window.V2Kit || {};
    const E = K.EmptyState;
    // Each specimen quotes the screen that draws the state (Activity, Notifications, system states, section 69), so a
    // state has one proposed wording. Activity's body ends with V2Kit.nextRunText once the worker is set up.
    const LOAD_BODY = 'Nothing is lost: your runs and days are not affected. Try again in a moment.'; // V2Screens.LoadError
    const DAYS = 'Each run shows here with its verification: one tick while pending, two once verified.';
    const first = <E variant="first" title="No days yet" body={DAYS + ' Next run today at 11 am.'} />;
    return (
      <G.Section id="empty-state">
        <G.Note>V3 restyle (2026-10-14): a 56 sunken mark with the icon in muted ink, a 20/600 title, one 14 ink-3 line at --v2-measure (280, review round 2), at most one solid action; no box of its own. No serif em phrase in working tabs.</G.Note>
        <G.Part name="EmptyState" status="changed" role="What a view shows with nothing in it: names what will appear, says why, and offers the one way forward.">
          <G.Stage ground="canvas" width="shell">{first}</G.Stage>
          <ul className="g-list">
            <li>No box: a centred column, padding 40 20; the icon on a 56 sunken disc; title 20/600; body 14 ink-3 at 280 wide (--v2-measure).</li>
            <li>Icon 24 in ink-3, no disc, no colour.</li>
            <li>Title 16/600 ink (an h2 by default). Body 13 ink-3, at most 280 wide.</li>
            <li>At most one medium primary button, and only when there is a real next step; a secondary quiet one beside it if needed.</li>
            <li>Arrives with .v2-anim-fade-up (180ms, 6px rise); simply there under reduced motion.</li>
          </ul>

          <G.StateGrid wide states={[
            { label: 'First use', note: 'names what will appear', node: <div style={full}>{first}</div> },
            { label: 'First use, not set up', note: 'the one way forward', node: <div style={full}><E variant="first" title="No days yet" body={DAYS} primaryAction={{ label: 'Set up your worker', onClick: noop }} /></div> },
            { label: 'No results', note: 'Notifications, Unread', node: <div style={full}><E variant="noresults" icon="check" title="Nothing unread" body="You’ve seen everything your worker sent." /></div> },
            { label: 'Error', note: 'what failed, what it means, one step', node: <div style={full}><E variant="error" title="Couldn’t load your days" body={LOAD_BODY} primaryAction={{ label: 'Try again', onClick: noop }} /></div> },
            { label: 'Error, action loading', node: <div style={full}><E variant="error" title="Couldn’t load your days" body={LOAD_BODY} primaryAction={{ label: 'Try again', onClick: noop, loading: true }} /></div> },
            { label: 'Offline', note: 'system states, nothing cached', node: <div style={full}><E variant="offline" title="You’re offline" body="BlueAI can’t reach the internet, so there’s nothing to show yet. Today’s run starts when you’re back online." primaryAction={{ label: 'Try again', onClick: noop }} /></div> },
            { label: 'Locked', note: 'says what unlocks it; system states, update required', node: <div style={full}><E variant="locked" icon="download" title="Update BlueAI to keep running" body="This version can’t run jobs anymore, so runs are paused. Update now and today can still count. It takes about a minute." primaryAction={{ label: 'Update now', onClick: noop }} /></div> },
            { label: 'Copy only', note: "the site's Past tab", node: <div style={full}><E variant="first" icon={null} body="Nothing here yet. Programs you finish will show up here, with what each one earned." /></div> },
          ]} />

          <G.CompareRow
            v2={<G.FrameState url="index.html?start=worker" label="Worker home, then the Jobs tab (Coming Soon)" height={830} />}
            system={<div style={full}>{first}</div>}
            changed="Two looks with off-palette art: Schedule's purple icon on a purple disc inside a shadowed card, and Jobs' 120px disc with a brown briefcase over 'Coming Soon', standing in for a whole tab. Schedule's body reads at 2.54:1. The system follows the site's voice and its dashed ghost: name what will appear, one muted line of why, a neutral icon, and a button only when there is something to do. Jobs and Schedule give way to Activity (R04)." />

          <G.SpecDrawer rows={[
            { part: 'Mark', token: '--v2-mark-xl, --v2-surface-sunken, --v2-ink-3', value: '56 disc, 24 icon (V3 restyle; was a dashed box)', ref: 'display-feedback.empty.site-ghost' },
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
            { part: 'Copy (proposed)', token: null, value: "No days yet, Set up your worker, Nothing unread, Couldn’t load your days, You’re offline, Update BlueAI to keep running: the screens' own strings (sections 58, 60, 69)" },
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
