/* Section 40: Dependency card (chat slice). DependencyCard. */
(function () {
  const G = window.V2Guide;
  const { useState, useEffect, useRef } = React;
  const noop = function () {};

  /* needs -> installing (3000ms, V2's duration) -> done, then Reset. */
  function Playable() {
    const K = window.V2Kit;
    const [phase, setPhase] = useState('needs');
    const [pct, setPct] = useState(0);
    const raf = useRef(0);
    useEffect(function () {
      if (phase !== 'installing') return undefined;
      const start = Date.now();
      const tick = function () {
        const p = Math.min(100, Math.round((Date.now() - start) / 30));
        setPct(p);
        if (p >= 100) { setPhase('done'); return; }
        raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
      return function () { cancelAnimationFrame(raf.current); };
    }, [phase]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
        <K.DependencyCard app="YouTube" phase={phase} progress={pct} onGet={function () { setPct(0); setPhase('installing'); }} />
        {phase === 'done' ? <button type="button" className="g-btn" onClick={function () { setPhase('needs'); }}>Reset</button> : null}
      </div>
    );
  }

  function DependencySection() {
    const K = window.V2Kit;
    const NB = function () { return window.NeedsBluestacks || {}; };
    return (
      <G.Section id="dependency-card">
        <G.Part name="DependencyCard" status="changed" role="The reply where the question was when a run needs BlueStacks or App Player: what is missing, the fix as one button, install progress inline.">
          <G.StateGrid wide states={[
            { label: 'Needs install', note: 'V2 copy.', node: <K.DependencyCard app="YouTube" phase="needs" onGet={noop} /> },
            { label: 'Installing (ProgressBar)', node: <K.DependencyCard app="YouTube" phase="installing" progress={42} /> },
            { label: 'Done (check)', node: <K.DependencyCard app="YouTube" phase="done" /> },
            { label: 'App Player signed out', note: 'Proposed copy (R13, R16).', node: <K.DependencyCard app="YouTube" phase="signedOut" onOpen={noop} /> },
          ]} />
          <G.Note>Try it: Get BlueStacks runs the 3-second install inline, with nothing blocking the window.</G.Note>
          <Playable />
          <G.CompareRow
            v2={<G.Live get={function () { return NB().Bubble; }} props={{ app: 'YouTube', onGet: noop }} label="NeedsBluestacks.Bubble" />}
            system={<K.DependencyCard app="YouTube" phase="needs" onGet={noop} />}
            changed="Kept: the answer goes where the question was, as info, not warning, with the fix as a button and no modal. Restyled onto tokens: a neutral notice with the info icon instead of a fifth tinted surface, the shared primary Button (radius 6, 4.92:1) instead of #1990FF with an opacity hover, and the shared ProgressBar. It also becomes the worker's preflight: V2 never checks BlueStacks before a run." />
          <G.CompareRow
            v2Label="V2 today: installing"
            v2={<G.Live get={function () { return NB().ProgressBubble; }} props={{ app: 'YouTube', onDone: noop }} label="NeedsBluestacks.ProgressBubble" />}
            system={<K.DependencyCard app="YouTube" phase="installing" progress={42} />}
            changed="The uppercase 10px eyebrow becomes a sentence-case title; the bar is the shared ProgressBar with its label row." />
          <G.SpecDrawer rows={[
            { part: 'Surface', token: '--v2-surface, --v2-line, --v2-radius-lg', value: 'white, 1px line, radius 16, width 300 (was #eff6ff, #bfdbfe)', ref: 'chat.dependency.fill' },
            { part: 'Icon', token: '--v2-blue-ink, --v2-icon-sm', value: 'info 16 #0d5ad6', ref: 'chat.dependency.icon' },
            { part: 'Line', token: '--v2-text-14, --v2-ink-2', value: 'V2 copy, quoted', ref: 'chat.dependency.copy' },
            { part: 'Button', token: 'Button primary md, full', value: '"Get BlueStacks", 36px, radius 6, #1268f0', ref: ['chat.dependency.button', 'chat.dependency.button-label', 'chat.dependency.button-hover'] },
            { part: 'Installing title', token: '--v2-weight-semibold, --v2-ink', value: '"Installing BlueStacks" 14/600 (was a 10px uppercase eyebrow)', ref: 'chat.dependency.eyebrow' },
            { part: 'Progress', token: 'ProgressBar 6 (section 20)', value: 'label "Getting ready", value "42%", fill --v2-blue', ref: ['chat.dependency.progress-label', 'chat.dependency.bar', 'chat.dependency.bar-fill'] },
            { part: 'Duration', token: null, value: '3000ms in the prototype', ref: 'chat.dependency.duration' },
            { part: 'Done', token: '--v2-success-ink', value: 'success notice "BlueStacks is ready."', ref: ['chat.dependency.done-check', 'chat.dependency.ready'] },
            { part: 'Signed out', token: 'Button secondary md, full', value: '"Open App Player"', ref: 'chat.dependency.signed-out' },
            { part: 'Preflight', token: null, value: 'checked before every worker run (R13)', ref: 'chat.dependency.ungated' },
          ]} />
          <G.DoDont
            do={['Answer in the thread, with the fix as the one button.', 'Run the same check before every worker run.']}
            dont={['Open a modal for a missing dependency.', 'Narrate App Player steps when it is not installed.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('dependency-card', DependencySection);
})();
