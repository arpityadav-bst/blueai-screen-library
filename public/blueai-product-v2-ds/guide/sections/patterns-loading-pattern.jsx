/* Section 50: Loading (entry-patterns slice). Part: Loading by duration (Changed).
   Composed from kit parts (Splash, Skeleton, Card, Button, Spinner, Banner, WorkerCard).
   Refs: guide/refs/entry-patterns.js. */
(function () {
  const G = window.V2Guide;

  const RULES = [
    ['Under 300 ms', 'Nothing. The Spinner waits 300 ms before it appears, so fast work never flashes.', 'A switch, a tab, a menu'],
    ['300 ms to 2 s', 'A spinner inside the control that started it (label kept, clicks ignored), or a Skeleton in the shape of what arrives.', 'Agree and continue; I agree, turn on; the Home card on reopen'],
    ['Over 2 s', 'Say what is happening, in words, next to the spinner.', '"Signing in…" with "Checking that this account is in the program."'],
    ['Over 10 s', 'Say it is still going and offer the way out: keep going in the background, or Cancel.', 'Installing BlueStacks (DependencyCard installing: "You can keep using BlueAI while it installs." and Cancel install, section 40); checking an API key'],
    ['A run (minutes)', 'Never block. The run card and the top bar status carry it; the partner can leave and come back.', 'Today’s run'],
  ];

  function Box({ children, w }) {
    return <div style={{ width: w || 300, display: 'flex', flexDirection: 'column', gap: 'var(--v2-space-3)' }}>{children}</div>;
  }
  // Home's own skeleton (screens/home.jsx), so the pattern shows the one the screen draws.
  function HomeSkeleton() {
    const C = (window.V2Screens || {}).HomeSkeleton;
    if (!C) return <div className="g-missing">V2Screens.HomeSkeleton is not loaded.</div>;
    return <Box w={340}><C /></Box>;
  }
  function ListSkeleton() {
    const C = (window.V2Screens || {}).ListSkeleton;
    if (!C) return <div className="g-missing">V2Screens.ListSkeleton is not loaded.</div>;
    return <Box w={340}><C rows={5} label="Loading your days" /></Box>;
  }
  function V2Skeleton() {
    const C = window.HomeSkeleton;
    if (!C) return <div className="g-missing">V2 HomeSkeleton is not loaded on this page.</div>;
    return <div className="g-live" style={{ width: 300 }}><G.Boundary><C /></G.Boundary></div>;
  }

  function LoadingSection() {
    const K = window.V2Kit;
    const fx = K.workerFixtures || {};
    return (
      <G.Section id="loading-pattern">
        <G.Part name="Loading by duration" status="changed" role="What the partner sees while waiting, chosen by how long the wait is, so fast work never flashes and slow work always says what it is doing.">
          <div className="g-table-wrap">
            <table className="g-table">
              <thead><tr><th scope="col">Wait</th><th scope="col">Show</th><th scope="col">For example</th></tr></thead>
              <tbody>{RULES.map(function (r) { return <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>; })}</tbody>
            </table>
          </div>
          <G.StateGrid wide states={[
            { label: 'Cold start', note: 'splash on a true cold start only (section 33)', node: <div style={{ position: 'relative', width: 240, height: 260, overflow: 'hidden', border: 'var(--v2-stroke) solid var(--v2-line)', borderRadius: 'var(--v2-radius-sm)' }}><K.Splash state="message-1" /></div> },
            { label: 'Screen', note: 'skeleton in the shape of the worker home', node: <HomeSkeleton /> },
            { label: 'List', note: 'the ledger’s rows (Activity, Notifications)', node: <ListSkeleton /> },
            { label: 'Action', note: 'spinner in the button, label kept', node: <K.Button variant="primary" size="lg" loading>Agree and continue</K.Button> },
            { label: 'Over 2 s', note: 'say what is happening', node: <Box w={260}><div className="v2-hstack v2-gap-2"><K.Spinner size={16} delay={0} /><span className="v2-text-body-sm">Checking that this account is in the program.</span></div></Box> },
            { label: 'Over 10 s', note: 'still going, with a way out', node: <Box><K.Banner tone="info" icon="clock" title="Still checking your key" action={{ label: 'Cancel', onClick: function () {} }}>This is taking longer than usual.</K.Banner></Box> },
            { label: 'Background run', note: 'never blocks; the card carries it', node: <Box w={340}><K.WorkerCard worker={fx.running} state="running" /></Box> },
          ]} />
          <G.CompareRow
            v2={<V2Skeleton />}
            system={<HomeSkeleton />}
            changed="V2 stages its cold start well (splash until 2650 ms, then an 850 ms skeleton), but the skeleton draws the retired category list, so it collapses into one worker card when content lands, and the splash replays on every window open. No button anywhere has a loading state: Agree and continue, I agree, turn on, Validate & Save and Save settings can all be pressed twice while their work is in flight, and the thread's Working on it… caveat sits at 2.56:1. The system ties what is shown to how long the wait is, draws skeletons in the shape of what arrives, and gives every action button a loading state." />
          <G.SpecDrawer rows={[
            { part: 'Spinner delay', token: null, value: '300 ms before it appears' },
            { part: 'Spinner in a button', token: 'Spinner 16, --v2-dur-spin', value: 'replaces the leading icon; label kept; aria-busy' },
            { part: 'Spinner alone', token: 'Spinner 32', value: 'with a sentence saying what is happening' },
            { part: 'Skeleton', token: '--v2-surface-sunken, --v2-dur-shimmer', value: 'shimmer 1400 ms; still under reduced motion', ref: 'entry-patterns.loading.skeleton-shape' },
            { part: 'Cold start, V2', token: null, value: 'second line 1050 ms, fade 2150 ms, done 2650 ms, skeleton 850 ms', ref: ['entry-patterns.loading.msg-time', 'entry-patterns.loading.fade-time', 'entry-patterns.loading.done-time', 'entry-patterns.loading.skeleton'] },
            { part: 'Buttons with no loading state, V2', token: null, value: 'Validate & Save, Save settings, I agree, turn on', ref: ['entry-patterns.loading.validate', 'entry-patterns.loading.save', 'entry-patterns.consent.agree'] },
            { part: 'Work said in words, V2', token: null, value: 'BlueAI is working…, Retrying the job…', ref: ['entry-patterns.loading.working', 'entry-patterns.loading.retrying'] },
            { part: 'Waiting caveat', token: '--v2-ink-3', value: '6.0:1 (V2 #94a3b8, 2.56:1)', ref: 'entry-patterns.loading.caveat' },
          ]} />
          <G.DoDont
            do={['Keep the label in a loading button, so the partner knows what is in flight.', 'Draw a skeleton in the shape of the content that replaces it.', 'After 2 s, say in words what is happening.']}
            dont={['Flash a spinner for work under 300 ms.', 'Block the window while today’s run plays.', 'Let a consent or save button be pressed twice.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('loading-pattern', LoadingSection);
})();
