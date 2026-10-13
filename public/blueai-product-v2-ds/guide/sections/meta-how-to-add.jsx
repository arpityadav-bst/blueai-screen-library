/* Section 74: How to add a feature (compose slice). From a new task to a screen merged into V2,
   using the kit, the tokens and DESIGN.md, step by step, plus one worked example. */
(function () {
  const G = window.V2Guide;

  function Go({ id }) {
    const s = window.V2Catalog && window.V2Catalog.byId(id);
    return <a className="g-link" href={G.hashHref(id)}>{s ? s.number + ' ' + s.title : id}</a>;
  }
  function Code({ children }) { return <code className="g-code">{children}</code>; }

  const STEPS = [
    ['Name the job it serves',
      <span>Write one line: which of the three jobs in <Go id="concept" /> this serves, and which principle in <Go id="principles" /> it leans on. If it serves none, question the feature before designing it.</span>],
    ['Find its state in the Worker record',
      <span>Everything about the worker’s day lives in one record (<Go id="worker-model" />). Name the fields the feature reads or writes and add them to the fixtures in <Code>kit/worker-data.jsx</Code>, never to a screen’s local state, so no navigation can lose them (P1).</span>],
    ['Place it',
      <span>Pick the level from the navigation model in <Go id="screen-header" />: a tab, a pushed screen with Back, a sheet or a dialog. Check <Go id="settings-model" /> if it is a setting and <Go id="notifications-pattern" /> if it has to reach a partner who is away.</span>],
    ['Compose it from the kit',
      <span>Use parts from Components, Shell, Chat, Worker and Credits. Each part’s DESIGN.md section lists its props, variants and states. Reach for a token, never a raw value. Add a kit part only when nothing fits (step 8).</span>],
    ['Write the copy',
      <span>Use the glossary in <Go id="copy-voice" />: Always ask and Automatic, AI credits, Sign in and Sign out, job and run. Say the consequence before the choice (P3). Mark every new string Proposed until the PM approves it. No em dash.</span>],
    ['Cover every state',
      <span>Loading (<Go id="loading-pattern" />), empty, error and offline (<Go id="errors-offline" />), confirm or undo (<Go id="confirm-destroy-undo" />), consent (<Go id="consent" />). Then the floor: visible focus, labels on icon buttons, 4.5:1 text, 32px targets, reduced motion.</span>],
    ['Add it to the guide',
      <span>A section file in <Code>guide/sections/</Code>, its entry in <Code>guide/catalog.jsx</Code>, a partial in <Code>design-md/</Code>, a script line in <Code>index.html</Code>, and a ref in <Code>guide/refs/</Code> for every V2 value or string it quotes.</span>],
    ['If it needs a new kit part',
      <span>One IIFE file <Code>kit/name.jsx</Code> that does <Code>Object.assign(window.V2Kit, {'{ Part }'})</Code>, read other parts lazily at render, <Code>v2-</Code> classes in a kit stylesheet, hover, focus, active, disabled, loading and error in CSS, tokens only, 300 lines at most.</span>],
    ['Run the checks',
      <span><Code>node tools/ds-check.js</Code> to 0 errors and <Code>node tools/build-design-md.js</Code>. Then look at it in this guide by eye: the checks read files, not pixels.</span>],
    ['Merge into V2',
      <span>V2 here is a port of the PM’s own source, so merge there. Load <Code>tokens.css</Code>, <Code>kit/base.css</Code>, <Code>kit/motion.css</Code> and the kit stylesheets you use, then the kit scripts after React and Babel and before the screens that use them. Build the screen with <Code>window.V2Kit</Code> parts, delete the V2 code the matching recommendation in <Go id="recommendations" /> names, and keep V2’s URL states working (<Go id="review-states" />) so review links still open the right state.</span>],
    ['Close the loop',
      <span>Once it ships in V2, change the part’s status to In V2, move its row out of Recommendations, and add a line to <Go id="changelog" />.</span>],
  ];

  function HowToAddSection() {
    return (
      <G.Section id="how-to-add">
        <G.Part name="From a new task to a screen in V2">
          <ol className="g-list">
            {STEPS.map(function (s) { return <li key={s[0]}><strong>{s[0]}.</strong> {s[1]}</li>; })}
          </ol>
        </G.Part>

        <G.Part name="Worked example: Pause until tomorrow">
          <p className="g-role">Proposed copy throughout. It is here to show the steps, not to decide the feature.</p>
          <dl className="g-facts">
            <dt>Job</dt><dd>Keep the partner in control (P4: every promise has a control). V2 promises “You can pause, stop, or disconnect anytime.” (<code className="g-code">{G.refText('shell.frame.promise')}</code>) and has no control for it (R05).</dd>
            <dt>State</dt><dd>The record’s pause field: paused until a time, or not. The home WorkerCard, the top bar status chip and the tray all read it.</dd>
            <dt>Place</dt><dd>A row in Settings, Worker (<Go id="worker-settings" />): a pushed screen, apply on change.</dd>
            <dt>Parts</dt><dd>ListRow with a Switch; a Dialog in its alert variant when pausing costs today’s day; a Toast with Undo.</dd>
            <dt>Copy</dt><dd>Confirm title “Pause today’s run?”, body “Today won’t count toward your 20 days.”, buttons Cancel and Pause.</dd>
            <dt>States</dt><dd>Running (pause stops the run, so confirm), done today (no cost, no confirm), paused (Resume), offline (the change waits and says so).</dd>
            <dt>Checks</dt><dd>Focus returns to the switch after the dialog; the switch has a visible label; ds-check to 0.</dd>
          </dl>
        </G.Part>

        <G.DoDont
          do={['Start from the Worker record and the job the feature serves.', 'Copy a kit part as it is and pass props.', 'Say what a choice costs before the partner makes it.', 'Run ds-check before handing anything over.']}
          dont={['Keep the worker’s state inside a screen.', 'Restyle a kit part in the screen with inline colours.', 'Invent a synonym for a glossary word.', 'Edit DESIGN.md by hand; edit the partial and rebuild.']} />
      </G.Section>
    );
  }
  G.register('how-to-add', HowToAddSection);
})();
