/* Section 20 Progress, spinner, skeleton (display-feedback slice). Kit: window.V2Kit.ProgressBar,
   Spinner, Skeleton (kit/progress.jsx). */
(function () {
  const G = window.V2Guide;
  const full = { width: '100%' };
  const line = { display: 'inline-flex', alignItems: 'center', gap: 'var(--v2-space-2)', color: 'var(--v2-ink-3)', fontSize: 'var(--v2-text-13)' };
  const filled = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 'var(--v2-control-md)', height: 'var(--v2-control-md)', borderRadius: 'var(--v2-radius-sm)', background: 'var(--v2-action)' };

  function ProgressSection() {
    const K = window.V2Kit || {};
    const Bar = K.ProgressBar;
    const Spin = K.Spinner;
    const Sk = K.Skeleton;
    const Card = K.Card;
    function rowSkeleton(still) {
      return (
        <div className={still ? 'v2-reduced-motion' : undefined} style={{ display: 'flex', alignItems: 'center', gap: 'var(--v2-space-3)', padding: 'var(--v2-space-3) var(--v2-space-4)' }}>
          <Sk shape="circle" width={32} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-2)' }}>
            <Sk shape="line" width="46%" />
            <Sk shape="line" width="72%" />
          </div>
          <Sk shape="rect" width={64} height={22} />
        </div>
      );
    }
    return (
      <G.Section id="progress-loading">
        <G.Part name="ProgressBar" status="changed" role="An amount done: a download, a setup, a goal. Label and value on top, a sunken rail, one fill.">
          <G.StateGrid wide states={[
            { label: '0%', node: <div style={full}><Bar label="Getting ready" value={0} /></div> },
            { label: '45%', node: <div style={full}><Bar label="Getting ready" value={45} /></div> },
            { label: 'Complete', note: 'turns green: reached', node: <div style={full}><Bar label="Getting ready" value={100} valueText="Done" /></div> },
            { label: 'Indeterminate', note: 'a sliding segment', node: <div style={full}><Bar label="Checking…" indeterminate /></div> },
            { label: 'Indeterminate, reduced motion', note: 'a full, quiet track', node: <div style={full} className="v2-reduced-motion"><Bar label="Checking…" indeterminate /></div> },
            { label: 'Error', note: 'frozen where it stopped', node: <div style={full}><Bar label="Getting ready" value={62} error valueText="Download failed" /></div> },
            { label: 'Paused', node: <div style={full}><Bar label="Getting ready" value={30} paused valueText="Paused" /></div> },
            { label: 'Goal (success tone), 4px', note: "the site's program bar", node: <div style={full}><Bar label="Run BlueAI this month" value={12} max={20} tone="success" size={4} valueText="12 of 20 days" /></div> },
          ]} />

          <G.CompareRow
            v2={<G.Live label="NeedsBluestacks.ProgressBubble" get={function () { return window.NeedsBluestacks && window.NeedsBluestacks.ProgressBubble; }} props={{ app: 'YouTube', onDone: function () {} }} />}
            system={<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-4)', width: '100%' }}>
              <Bar label="Getting ready" value={45} />
              <Bar label="Checking…" indeterminate />
            </div>}
            changed="V2 draws the same 6px blue bar twice on two different track blues, and shows 'indeterminate' by pulsing a full bar at 0.6 opacity. The system has one bar: a sunken rail (6 in cards, 4 inline), a blue fill that eases, the sliding segment V2 already defines in product-scene.css for indeterminate (40% here, on the shared loop), green at max, red when it failed, grey when paused, and role=progressbar with a spoken value." />

          <G.SpecDrawer rows={[
            { part: 'Rail', token: '--v2-surface-sunken / --v2-radius-pill', value: '6px (4 inline), pill', ref: ['display-feedback.progress.ai-rail', 'display-feedback.progress.bs-rail', 'display-feedback.progress.site-bar'] },
            { part: 'Fill', token: '--v2-blue', value: '#156efe', ref: 'display-feedback.progress.bs-fill' },
            { part: 'Fill motion', token: '--v2-dur-3 / --v2-ease-out', value: 'width 240ms', ref: 'display-feedback.progress.ai-pulse' },
            { part: 'Indeterminate', token: '--v2-dur-shimmer', value: '.v2-anim-indet: 40% segment (V2 38%), 1400ms; reduced motion: full track at 0.45', ref: ['display-feedback.progress.indet-width', 'display-feedback.progress.indet-anim', 'display-feedback.progress.indet-keys'] },
            { part: 'Complete / goal', token: '--v2-success', value: '#16a34a' },
            { part: 'Error', token: '--v2-danger-ink', value: 'fill and value text' },
            { part: 'Paused', token: '--v2-ink-4', value: 'grey fill' },
            { part: 'Label row', token: '--v2-text-13', value: 'label 500 ink, value ink-3 tabular' },
            { part: 'Semantics', token: null, value: 'role=progressbar, labelled, aria-valuetext', ref: 'display-feedback.progress.site-aria' },
            { part: 'Copy', token: null, value: 'Getting ready', ref: 'display-feedback.progress.bs-copy' },
            { part: 'Copy', token: null, value: 'Checking…', ref: 'display-feedback.progress.ai-copy' },
            { part: 'Copy', token: null, value: 'Download failed', ref: 'display-feedback.progress.failed-copy' },
            { part: 'Copy', token: null, value: 'Paused', ref: 'display-feedback.progress.paused-copy' },
            { part: 'Copy', token: null, value: 'Run BlueAI this month, 12 of 20 days (the site)', ref: ['display-feedback.progress.site-label', 'display-feedback.progress.site-count'] },
          ]} />
        </G.Part>

        <G.Part name="Spinner" status="changed" role="Working, where the result has no shape yet: a button that sent something, a step in progress. One ring, currentColor.">
          <G.StateGrid states={[
            { label: '12', note: 'switch thumb, busy', node: <Spin size={12} delay={0} /> },
            { label: '16', note: 'buttons, rows, steps', node: <Spin size={16} delay={0} /> },
            { label: '32', note: 'standalone', node: <Spin size={32} delay={0} /> },
            { label: 'On colour', node: <span style={filled}><Spin size={16} delay={0} variant="on-color" /></span> },
            { label: 'Delayed', note: 'first 300ms: nothing, space held', node: <span style={line}><Spin size={16} delay={600000} />Sending</span> },
            { label: 'Done', note: 'swaps to a check', node: <span style={line}><Spin size={16} done />Done</span> },
            { label: 'With words', node: <span style={line}><Spin size={16} delay={0} label="Working" />Working on it…</span> },
            { label: 'Reduced motion', note: 'turns at half speed', node: <Spin size={32} delay={0} className="v2-reduced-motion" /> },
          ]} />

          <G.CompareRow
            v2={<G.Live label="ChatBubbles.ThinkingBubble" get={function () { return window.ChatBubbles && window.ChatBubbles.ThinkingBubble; }} />}
            system={<span style={line}><Spin size={16} delay={0} label="Working" />Working on it…</span>}
            changed="V2 has five busy marks in three colours: a 13px blue ring, a 36px indigo ring, three indigo dots, the boot bounce dots and a pulsing status dot. The system has one ring in currentColor at 12, 16 and 32, which waits 300ms so fast work never flashes and swaps to a check when done. The bounce dots stay on the splash only." />

          <G.SpecDrawer rows={[
            { part: 'Ring', token: null, value: 'currentColor, track at 20%, arc a quarter turn', ref: ['display-feedback.spinner.ring', 'display-feedback.spinner.login'] },
            { part: 'Sizes', token: null, value: '12, 16, 32 (stroke 1.5, 2, 4)', ref: ['display-feedback.spinner.ring', 'display-feedback.spinner.login'] },
            { part: 'Turn', token: '--v2-dur-spin', value: '.v2-anim-spin: 800ms linear; half speed under reduced motion', ref: 'display-feedback.spinner.ring' },
            { part: 'Delay', token: null, value: '300ms before it shows' },
            { part: 'Done', token: '--v2-success', value: 'check 16 (24 at 32)', ref: 'display-feedback.spinner.done-check' },
            { part: 'Removed', token: null, value: 'indigo dots, indigo ring', ref: ['display-feedback.spinner.dots', 'display-feedback.spinner.login'] },
            { part: 'Kept on the splash only', token: null, value: 'bounce dots', ref: 'display-feedback.spinner.boot-dots' },
            { part: 'Copy', token: null, value: 'Working on it…', ref: 'display-feedback.spinner.working-copy' },
          ]} />
        </G.Part>

        <G.Part name="Skeleton" status="changed" role="A placeholder in the shape of what is on its way. Four shapes; each screen composes its own.">
          <G.StateGrid wide states={[
            { label: 'Line', node: <div style={full}><Sk shape="line" /></div> },
            { label: 'Title', node: <div style={full}><Sk shape="title" /></div> },
            { label: 'Circle', node: <Sk shape="circle" width={40} /> },
            { label: 'Rect', node: <div style={full}><Sk shape="rect" /></div> },
            { label: 'Lines', note: 'last at 60%', node: <div style={full}><Sk lines={3} /></div> },
            { label: 'Composite: a list row', node: <div style={full}><Card padding="none">{rowSkeleton(false)}</Card></div> },
            { label: 'Reduced motion', note: 'still', node: <div style={full}><Card padding="none">{rowSkeleton(true)}</Card></div> },
          ]} />

          <G.CompareRow
            v2={<G.Live label="HomeSkeleton (boot_splash.jsx)" get={function () { return window.HomeSkeleton || null; }} />}
            system={<div style={full}><Card padding="none">{rowSkeleton(false)}{rowSkeleton(false)}</Card></div>}
            changed="V2's home skeleton draws four category cards and a fifth, then one worker card lands: the placeholder promises a different screen. The system gives four shapes on the sunken ground with the shared shimmer, which stops under reduced motion; each screen composes the shape of what will arrive (the worker home's lives with Home, section 57)." />

          <G.SpecDrawer rows={[
            { part: 'Ground', token: '--v2-surface-sunken', value: '#f6f6f8', ref: 'display-feedback.skeleton.gradient' },
            { part: 'Shimmer', token: '--v2-dur-shimmer', value: '.v2-anim-shimmer: a surface band, 1400ms', ref: 'display-feedback.skeleton.anim' },
            { part: 'Line / title', token: '--v2-radius-xs', value: '12px / 16px tall, radius 4' },
            { part: 'Circle / rect', token: '--v2-radius-round / --v2-radius-md', value: '32 default / 64 tall, radius 10' },
            { part: 'Reduced motion', token: null, value: 'no shimmer (V2 has no rule)', ref: 'display-feedback.skeleton.anim' },
            { part: 'Removed', token: null, value: 'category-list composite', ref: ['display-feedback.skeleton.home', 'display-feedback.skeleton.home-rows'] },
          ]} />

          <G.DoDont
            do={['Match the composite to the content, line for line.', 'Mark the region aria-busy while it loads; skeletons are hidden from screen readers.', 'Use a spinner for an action, a skeleton for a view.']}
            dont={['A skeleton for under 300ms of work.', 'A pulsing full bar as indeterminate.', 'A spinner frozen beside 100%: swap it for the check.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('progress-loading', ProgressSection);
})();
