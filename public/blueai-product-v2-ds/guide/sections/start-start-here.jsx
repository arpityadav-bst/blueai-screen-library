/* Section 00: Start here (compose slice). What the system is, who it is for, how to read a part's
   status, where things live and how to run the checks. No V2 values are printed here. */
(function () {
  const G = window.V2Guide;
  const DS = '../blueai-product-v2-ds/';

  function Go({ id }) {
    const s = window.V2Catalog && window.V2Catalog.byId(id);
    return <a className="g-link" href={G.hashHref(id)}>{s ? s.number + ' ' + s.title : id}</a>;
  }
  function Code({ children }) { return <code className="g-code">{children}</code>; }

  const PLACES = [
    ['index.html', 'This guide. Every section, live parts, V2 today next to the system.'],
    ['DESIGN.md', 'The same content as one Markdown file, generated from design-md/. Hand it to anyone building a screen.'],
    ['tokens.css', 'Every colour, size, radius, shadow, layer and timing as a --v2-* custom property. The only place raw values live.'],
    ['kit/', 'The parts, on window.V2Kit (button.jsx, run-card.jsx, ...) and their v2-* styles (actions.css, chat.css, ...).'],
    ['screens/', 'Whole screens composed from the kit, on window.V2Screens (Home, Activity, Settings, ...).'],
    ['guide/', 'This guide’s own chrome: catalog.jsx (the section list), sections/, refs/ (the V2 sources), app.jsx.'],
    ['design-md/', 'One Markdown partial per section; edit these, then rebuild DESIGN.md.'],
    ['tools/', 'ds-check.js (the gate; the named-colour half of check 6 and checks 8 to 10 live in ds-check-more.js) and build-design-md.js.'],
  ];
  const CHECKS = [
    'Every V2 value or string the guide quotes still sits on its V2 line (guide/refs/*.js).',
    'Every ref id a guide section names exists.',
    'No em dash anywhere, in any form.',
    'Every .jsx and .js file parses.',
    'Every .jsx, .js and .css file is 300 lines or fewer.',
    'The catalog, the section files, the design-md partials and index.html agree.',
    'No raw colour in kit/ or screens/: tokens only. No stylesheet but tokens.css defines a --v2- property.',
    'Every kit part and screen the catalog names is on window.V2Kit or window.V2Screens.',
    'The size lists the JSX copies (Icon and Avatar sizes) equal their tokens, and no kit or screens rule types a Size token’s value raw or borrows a Space token in its place.',
    'No .jsx in kit/, screens/ or guide/ uses object rest destructuring: Babel hoists its key list to one program-level _excluded that the next file overwrites, so use a local omit(props, KEYS).',
    'Files in kit/, screens/ and guide/ hold only IIFEs at top level (a refs file may also assign window.V2Refs), so nothing they declare lands on window and overwrites a V2 global the live parts read.',
  ];
  const RULES = [
    'Tokens only: every colour in kit/ or screens/ is a --v2-* token, and so is every size two parts share (the Size family); geometry one part owns stays px in its rule.',
    'Kit classes start v2-, guide classes g-. Hover, focus-visible, active, disabled, loading and error live in CSS, not in mouse handlers.',
    'Files are IIFEs for the browser’s Babel: no import or export. Kit parts go on window.V2Kit, screens on window.V2Screens.',
    'At most 300 lines per .jsx, .js or .css file. Split before you pass it.',
    'Copy: quote V2 exactly where a part is In V2; use the glossary (section 70): Always ask and Automatic, AI credits, Sign in and Sign out. New copy is marked Proposed until the PM approves it. No em dash.',
    'Accessibility floor: visible focus, labels on icon buttons, 4.5:1 for text, 32px targets, reduced motion respected.',
  ];

  function StartHereSection() {
    return (
      <G.Section id="start-here">
        <G.Part name="What this is">
          <div className="g-prose">
            <p>The target design system for BlueAI Product V2: the parts, colours, words and screens the next iterations of V2 are built from. It is minimal on purpose, every decision is argued from the product concept (section 01), and it is one family with the onBlue Agentic site the partner comes from and goes back to.</p>
            <p>It is built for the PM building V2 next, and for anyone who picks up a V2 screen after him. V2’s own files were not changed: the system sits next to V2 and shows V2 live where it can.</p>
          </div>
        </G.Part>

        <G.Part name="How to read a part">
          <p className="g-role">Every part carries one status. Section headers count them.</p>
          <G.Table head={['Status', 'What it means', 'What the section shows']} rows={[
            [<G.StatusTag status="in_v2" />, 'Carried from V2 as it is.', 'V2 rendered live where possible, its copy quoted exactly, with the V2 file and line.'],
            [<G.StatusTag status="changed" />, 'V2 has it, the system changes it.', '"V2 today" on the left, the system on the right, then what changed and why.'],
            [<G.StatusTag status="new" />, 'V2 has no equivalent.', 'Why the product needs it, and the copy marked Proposed.'],
          ]} />
          <G.Note>A value shown as <Code>file:line</Code> is a V2 source. The Spec drawer under a part lists each value, the token that now holds it and the V2 line it came from, and tools/ds-check.js proves that line still says it.</G.Note>
        </G.Part>

        <G.Part name="Where to start">
          <ol className="g-list">
            <li><Go id="concept" /> and <Go id="principles" />: the frame every decision is judged against.</li>
            <li><Go id="recommendations" />: every V2 difference as a fix list, P1 first, plus the decisions only the PM can make.</li>
            <li><Go id="how-to-add" />: from a new task to a screen merged into V2.</li>
            <li>Then the part or screen you need, from the left navigation. <Go id="coverage" /> says what exists; <Go id="known-gaps" /> says what the guide cannot prove.</li>
          </ol>
        </G.Part>

        <G.Part name="Where things live">
          <p className="g-role">All under <Code>public/blueai-product-v2-ds/</Code>. V2 itself is <Code>public/blueai-product-v2/</Code>.</p>
          <G.Table head={['Path', 'What it holds']} rows={PLACES.map(function (r) { return [<Code>{r[0]}</Code>, r[1]]; })} />
          <p className="g-role">
            <a className="g-link" href={DS + 'DESIGN.md'} target="_blank" rel="noopener">Open DESIGN.md</a>{'  '}
            <a className="g-link" href="index.html" target="_blank" rel="noopener">Open V2</a>
          </p>
        </G.Part>

        <G.Part name="How to run the checks">
          <p className="g-role">From <Code>public/blueai-product-v2-ds/</Code>, with Node and one dependency, Babel’s parser. ds-check looks for it in this repo’s <Code>node_modules</Code> (run <Code>npm install</Code> at the repo root), then in the main <Code>N:/Antigravity Main/blueai</Code> checkout’s, or takes a <Code>@babel/parser</Code> build named in the <Code>DS_BABEL_PARSER</Code> environment variable. With none of these the run fails with an error instead of skipping the parse step. The parser parses; it does not compile, so a transform error that only Babel standalone raises in the browser can still pass.</p>
          <G.Table head={['Command', 'When']} rows={[
            [<Code>node tools/ds-check.js</Code>, 'Before every hand-off. It must end with 0 errors. Add --missing-ok only while files are still being written.'],
            [<Code>node tools/build-design-md.js</Code>, 'After editing anything in design-md/. It rewrites DESIGN.md; never edit DESIGN.md by hand.'],
          ]} />
          <p className="g-role">What ds-check proves:</p>
          <ul className="g-list">{CHECKS.map(function (c) { return <li key={c}>{c}</li>; })}</ul>
          <G.Warn>The checks read files, not pixels. How a part looks is checked by eye in this guide (see <Go id="known-gaps" />).</G.Warn>
        </G.Part>

        <G.Part name="House rules">
          <ul className="g-list">{RULES.map(function (r) { return <li key={r}>{r}</li>; })}</ul>
        </G.Part>
      </G.Section>
    );
  }
  G.register('start-here', StartHereSection);
})();
