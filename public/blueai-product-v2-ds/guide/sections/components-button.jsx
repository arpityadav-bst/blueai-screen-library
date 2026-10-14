/* Section 11: Button, icon button, link (actions-inputs slice). Kit: window.V2Kit.Button,
   IconButton, Link (kit/button.jsx, kit/actions.css). Spec: design-md/11-button.md. */
(function () {
  const G = window.V2Guide;
  const noop = function () {};
  const row = 'v2-hstack v2-wrap v2-gap-3';
  /* V2 copy, quoted (refs below). */
  const COPY = { agree: 'I agree, turn on', cancel: 'Cancel', notNow: 'Not now', remove: 'Remove', gotIt: 'Got it',
    apply: 'Apply', del: 'Delete', validate: 'Validate & Save', learn: 'Learn more', earnings: 'Earnings', notYou: 'Not you?', switchAcc: 'Switch account' };
  const FAQ = 'https://bluestacks.ai/getting-started#ai-credits';
  const DASH = 'https://bluestacks.ai/dashboard';
  const REASON = 'Add the endpoint and the model first.';
  const VARIANTS = [
    ['primary', COPY.agree, 'Primary'], ['secondary', COPY.cancel, 'Secondary'],
    ['quiet', COPY.notNow, 'Quiet'], ['danger', COPY.remove, 'Danger'], ['destructive', COPY.del, 'Destructive'],
  ];

  function statesFor(K, v) {
    const [variant, label, name] = v;
    return [
      { label: name + ': rest', node: <K.Button variant={variant}>{label}</K.Button> },
      { label: name + ': hover', node: <K.Button variant={variant} className="is-hover">{label}</K.Button> },
      { label: name + ': focus-visible', node: <K.Button variant={variant} className="is-focus">{label}</K.Button> },
      { label: name + ': active', note: '1px drop', node: <K.Button variant={variant} className="is-active">{label}</K.Button> },
      { label: name + ': disabled with reason', note: 'Proposed copy', node: <K.Button variant={variant} disabled disabledReason={REASON}>{variant === 'primary' ? COPY.apply : label}</K.Button> },
      { label: name + ': loading', node: <K.Button variant={variant} loading>{variant === 'primary' ? COPY.validate : label}</K.Button> },
    ];
  }

  function V2OutOfCredits() {
    const B = window.Byok;
    return B && B.OutOfCreditsCard ? <div style={{ maxWidth: '300px' }}><B.OutOfCreditsCard onDismiss={noop} /></div> : null;
  }

  function ButtonSection() {
    const K = window.V2Kit;
    let grid = [];
    VARIANTS.forEach(function (v) { grid = grid.concat(statesFor(K, v)); });
    return (
      <G.Section id="button">
        <G.Note>V3 restyle (2026-10-14): decision D1 is settled: primary is the site's solid ink button (--v2-solid, --v2-shadow-btn; hover --v2-solid-hover, 1px drop; active 2px). Secondary is the ghost (panel fill, 15% line; hover --v2-surface-sunken; pressed --v2-surface-press). No red solid: danger is the trigger skin, a ghost red on hover; a destructive confirm commits with the solid primary. Geometry: radius 6, 500, -0.02em, 44 / 36 / 28; lg labels 14.</G.Note>
        <G.Part name="Button" status="changed" role="The action ladder: one primary per view, secondary for the frequent second action, quiet for the third, danger for the trigger of one that destroys.">
          <G.Stage ground="surface">
            <div className={row}>
              {VARIANTS.map(function (v) { return <K.Button key={v[0]} variant={v[0]}>{v[1]}</K.Button>; })}
            </div>
          </G.Stage>
          <ul className="g-list">
            <li>Box: height 28 / 36 / 44 (sm / md / lg), radius 6, 1px edge, padding 12 / 16 / 20.</li>
            <li>Label: 13/500, tracking -0.01em, one line; an optional 16px icon before or after it, gap 8.</li>
            <li>Loading: a 16px spinner takes the leading icon's place; the label stays so nothing jumps.</li>
            <li>Disabled: dimmed to 0.45, still focusable, the reason in 12/ink-3 right under it.</li>
            <li>sm draws at 28 and reaches the 32px hit floor with an invisible extension.</li>
          </ul>
          <G.StateGrid states={grid} />
          <G.Stage ground="canvas">
            <div className="v2-stack">
              <div className={row}>
                <K.Button size="sm">{COPY.cancel}</K.Button>
                <K.Button size="md">{COPY.cancel}</K.Button>
                <K.Button size="lg">{COPY.cancel}</K.Button>
                <K.Button icon="refresh">Try again</K.Button>
                <K.Button variant="quiet" iconRight="external" href={DASH} external>{COPY.earnings}</K.Button>
              </div>
              <div style={{ width: 'var(--v2-shell-w)', maxWidth: '100%' }}>
                <K.Button variant="primary" size="lg" full>{COPY.gotIt}</K.Button>
              </div>
            </div>
          </G.Stage>
          <G.CompareRow
            v2={<G.FrameState url="index.html?start=worker" label="V2 home: New Chat is the loudest control in the window" height={830} />}
            system={<div className="v2-stack"><div className={row}><K.Button variant="primary">{COPY.agree}</K.Button><K.Button>{COPY.cancel}</K.Button></div><div className={row}><K.Button variant="quiet">{COPY.notNow}</K.Button><K.Button variant="danger">{COPY.remove}</K.Button></div></div>}
            changed="Six radii (999, 10 and 8 on the buttons cited here), three hover models (opacity, lift plus glow, brightness) and blue glows become one flat shape with a real 1px press, AA contrast, a visible focus ring and a loading state no V2 button has. A disabled button now says why (the site's rule), instead of fading with no reason." />
          <G.SpecDrawer rows={[
            { part: 'Shape', token: '--v2-radius-sm', value: 'radius 6 (V2: 999, 8, 10)', ref: ['actions-inputs.onblue.btn-radius', 'actions-inputs.button.new-chat', 'actions-inputs.button.settings-save', 'actions-inputs.button.day-done'] },
            { part: 'Height', token: '--v2-control-sm / -md / -lg', value: '28 / 36 / 44', ref: 'actions-inputs.button.terms' },
            { part: 'Label', token: '--v2-text-13, --v2-weight-medium', value: '13/500 (V2: 13 to 15, 600 to 700)', ref: ['actions-inputs.onblue.btn-weight', 'actions-inputs.button.pill', 'actions-inputs.button.consent-recipe'] },
            { part: 'Primary fill', token: '--v2-solid, --v2-shadow-btn', value: '#0b0b0d, white 19.6:1, three-stop cast (V2 #1990FF, 3.24:1)', ref: 'actions-inputs.button.blue' },
            { part: 'Primary hover', token: '--v2-solid-hover, --v2-shadow-btn-hover', value: '#26262b, cast pulled in, 1px drop (V2: opacity 0.88, opacity 0.9, lift + brightness)', ref: ['actions-inputs.button.new-chat-hover', 'actions-inputs.button.pill-hover', 'actions-inputs.button.terms-hover'] },
            { part: 'Glow', token: '--v2-shadow-0', value: 'none (V2: blue glows)', ref: 'actions-inputs.button.terms-glow' },
            { part: 'Secondary', token: '--v2-button-secondary-fill, -line, -hover-fill, -hover-line, --v2-surface-press', value: 'the ghost: panel, 1px 15% black, ink; hover sunken + 20% edge (look hooks, review round 2); pressed #e7eaf1', ref: ['actions-inputs.button.cancel', 'actions-inputs.onblue.ghost-hover'] },
            { part: 'Quiet', token: '--v2-ink-2, --v2-wash-hover', value: 'no box at rest, ink-2; hover wash + ink' },
            { part: 'Danger', token: '--v2-button-danger-hover-fill, -hover-line, -hover-ink (--v2-danger-tint, --v2-danger-edge, --v2-danger-ink)', value: 'a ghost that turns red on hover; only for the trigger that opens a destructive confirm (Disconnect YouTube); the commit is the destructive variant, section 52 (V2 Remove: #dc2626 outline, no confirm)', ref: 'actions-inputs.button.remove' },
            { part: 'Destructive', token: '--v2-button-destructive-fill, --v2-button-destructive-hover', value: 'the commit of a confirm that loses something (Delete, Remove key, Disconnect): the solid primary in Target, red in V2 today (review rounds 1 and 2, 2026-10-14). Sign out’s confirm commits with the primary' },
            { part: 'Press', token: '--v2-dur-1', value: 'translateY(1px), 120ms' },
            { part: 'Focus', token: '--v2-focus-outline, --v2-focus-offset', value: '2px #156efe, offset 2 (V2: none)' },
            { part: 'Disabled', token: '--v2-opacity-disabled', value: '0.45, aria-disabled, reason 12/ink-3 below', ref: ['actions-inputs.button.apply-disabled', 'actions-inputs.onblue.disabled', 'actions-inputs.onblue.disabled-why'] },
            { part: 'Loading', token: '--v2-dur-spin', value: 'spinner 16 in place of the icon, aria-busy, clicks ignored' },
            { part: 'Copy', token: null, value: 'specimen labels are V2 copy', ref: ['actions-inputs.button.consent', 'actions-inputs.button.cancel', 'actions-inputs.chip.job-options', 'actions-inputs.button.remove', 'actions-inputs.button.got-it', 'actions-inputs.button.validate-save', 'actions-inputs.button.apply'] },
          ]} />
          <G.Note>Decision D1, settled (Appy, V3 restyle 2026-10-14): the primary is the solid ink #0b0b0d like the site's commit button. The kit reads one token, --v2-solid.</G.Note>
          <G.DoDont
            do={['One primary per view: the action that commits.', 'Print the reason under a disabled button.', 'Keep the label while loading; the spinner says it is working.']}
            dont={['Two filled buttons side by side.', 'Hover by opacity: it lowers contrast that must hold.', 'A glow or a lift under a button.']} />
        </G.Part>

        <G.Part name="Primary in V2 today" status="changed" role="V2's out-of-credits card, live, next to the system's primary with the same words.">
          <G.CompareRow
            v2={<G.Live get={function () { return window.Byok && window.Byok.OutOfCreditsCard && V2OutOfCredits; }} label="Byok.OutOfCreditsCard" />}
            system={<div style={{ maxWidth: '300px' }}><K.Button variant="primary" full>{COPY.gotIt}</K.Button></div>}
            changed="Pill + 15/700 + a 3.24:1 label becomes radius 6 + 13/500 + 4.92:1. Same words, same place; it reads as the site's button and passes AA." />
          <G.SpecDrawer rows={[
            { part: 'Fill', token: '--v2-action', value: '#1990FF becomes #1268f0', ref: 'actions-inputs.button.blue' },
            { part: 'Shape and label', token: '--v2-radius-sm, --v2-text-13', value: 'pill 15/700 becomes radius 6, 13/500', ref: 'actions-inputs.button.pill' },
            { part: 'Copy', token: null, value: COPY.gotIt, ref: 'actions-inputs.button.got-it' },
          ]} />
        </G.Part>

        <G.Part name="IconButton" status="changed" role="A bare 20px glyph for the header and rows. It always carries a label, because the glyph is all a sighted user gets.">
          <G.StateGrid states={[
            { label: 'Rest', node: <K.IconButton icon="help" label="Help" /> },
            { label: 'Hover', note: 'wash + ink', node: <K.IconButton icon="help" label="Help" className="is-hover" /> },
            { label: 'Focus-visible', node: <K.IconButton icon="help" label="Help" className="is-focus" /> },
            { label: 'Active (menu open)', note: 'ink, not blue', node: <K.IconButton icon="more" label="More" active aria-haspopup="menu" aria-expanded={true} /> },
            { label: 'Disabled', node: <K.IconButton icon="refresh" label="Refresh" disabled /> },
            { label: 'Sizes 28 / 32 / 36', node: <div className="v2-hstack v2-gap-2"><K.IconButton icon="close" label="Close" size={28} /><K.IconButton icon="close" label="Close" size={32} /><K.IconButton icon="close" label="Close" /></div> },
            { label: 'Outlined', node: <K.IconButton icon="copy" label="Copy link" variant="outlined" /> },
            { label: 'Danger tone, hover', node: <K.IconButton icon="trash" label="Remove key" tone="danger" className="is-hover" /> },
          ]} />
          <ul className="g-list">
            <li>36 square (32 and 28 for dense rows; 28 grows an invisible 32 target), radius 6, no edge.</li>
            <li>Glyph 20 (16 at 28) in ink-3, 6.0:1. Hover adds the wash and turns ink; open or pressed holds a deeper wash.</li>
            <li>label is required and becomes aria-label. Pair it with a Tooltip (section 23) for sighted users.</li>
          </ul>
          <G.CompareRow
            v2={<G.FrameState url="index.html?start=worker" label="V2 top bar: help and more icon buttons" height={830} />}
            system={<div className="v2-hstack v2-gap-1"><K.IconButton icon="help" label="Help" /><K.IconButton icon="more" label="More" active aria-haspopup="menu" aria-expanded={true} /></div>}
            changed="Same idea as V2's iconBtn (padding 6, radius 8, #64748b) with the site's wash hover and a focus ring. Open is ink on a wash, not #1990FF: blue now means selection. The out-of-credits close at #94a3b8 (2.56:1) moves to ink-3." />
          <G.SpecDrawer rows={[
            { part: 'Box', token: '--v2-control-md, --v2-radius-sm', value: '36 square, radius 6 (V2: padding 6 around a 22 glyph, 34 square, radius 8)', ref: 'actions-inputs.icon-button.v2' },
            { part: 'Glyph', token: '--v2-icon-md, --v2-ink-3', value: '20, #5f636b 6.0:1 (V2 #64748b; close #94a3b8 2.56:1)', ref: ['actions-inputs.icon-button.v2', 'actions-inputs.icon-button.close'] },
            { part: 'Hover', token: '--v2-wash-hover, --v2-ink', value: 'wash + ink (V2: none, or a JS colour swap)', ref: 'actions-inputs.icon-button.close-hover' },
            { part: 'Open / pressed', token: '--v2-wash-press, --v2-ink', value: 'deeper wash + ink (V2 #1990FF)', ref: 'actions-inputs.icon-button.v2' },
            { part: 'Focus', token: '--v2-focus-outline', value: '2px #156efe, offset 2' },
            { part: 'Name', token: null, value: 'aria-label from the required label prop' },
          ]} />
        </G.Part>

        <G.Part name="Link" status="changed" role="An action inside a sentence, or a quiet way out on its own line: underlined ink that turns blue on hover, the site's link.">
          <G.StateGrid states={[
            { label: 'Rest, inside a sentence', node: <p className="v2-text-body">{COPY.notYou} <K.Link onClick={noop}>{COPY.switchAcc}</K.Link></p> },
            { label: 'Hover', note: 'blue-ink, underline full', node: <K.Link onClick={noop} className="is-hover">{COPY.switchAcc}</K.Link> },
            { label: 'Focus-visible', node: <K.Link onClick={noop} className="is-focus">{COPY.switchAcc}</K.Link> },
            { label: 'External, standalone', note: 'opens a new tab', node: <K.Link href={FAQ} external standalone>{COPY.learn}</K.Link> },
            { label: 'Muted tone', node: <K.Link href={DASH} external standalone tone="muted">{COPY.earnings}</K.Link> },
          ]} />
          <ul className="g-list">
            <li>Inline: inherits the sentence's size; ink text, 1px underline at offset 3 in --v2-link-underline (32% black, the site's link underline), blue-ink on hover.</li>
            <li>Standalone: 13/500 on its own line with a 32px target. External adds the external glyph 16 and says "opens in a new tab" to screen readers.</li>
            <li>No href renders a button drawn as a link (Switch account), so it is still a real control.</li>
          </ul>
          <G.CompareRow
            v2={<G.Live get={function () { return window.CreditsPopupParts && window.CreditsPopupParts.LearnLink; }} label="CreditsPopupParts.LearnLink" />}
            system={<K.Link href={FAQ} external standalone>{COPY.learn}</K.Link>}
            changed="Bold blue links at 3.24:1 with no underline become underlined ink (the site's rule), which frees blue for selection. One external glyph replaces a typed arrow character and a second hand-drawn SVG." />
          <G.SpecDrawer rows={[
            { part: 'Colour', token: '--v2-ink', value: 'ink (V2 #1990FF 3.24:1, 600 to 700)', ref: ['actions-inputs.link.learn-more', 'actions-inputs.link.switch-account'] },
            { part: 'Underline', token: '--v2-stroke, --v2-link-underline', value: '1px, offset 3, 32% black, the site’s --link-underline; every ink link uses it, kit links and hand-rolled ones alike', ref: 'actions-inputs.onblue.link' },
            { part: 'Hover', token: '--v2-blue-ink', value: '#0d5ad6, underline in the same colour', ref: 'actions-inputs.onblue.link-hover' },
            { part: 'External', token: '--v2-icon-sm', value: 'external glyph 16 (V2: a typed arrow, and an SVG)', ref: ['actions-inputs.link.learn-more-copy', 'actions-inputs.link.external-glyph'] },
            { part: 'Standalone', token: '--v2-text-13, --v2-hit-min', value: '13/500, min height 32' },
            { part: 'Copy and URLs', token: null, value: 'V2 copy and URLs', ref: ['actions-inputs.link.faq-url', 'actions-inputs.link.earnings-url', 'actions-inputs.link.not-you', 'actions-inputs.link.switch-account'] },
          ]} />
          <G.DoDont
            do={['Use a link for leaving (Learn more, Earnings) and for an action inside a sentence.', 'Mark every external link with the glyph.']}
            dont={['Colour a link blue at rest.', 'Use a link for the main action of a view.', 'Type an arrow character into the label.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('button', ButtonSection);
})();
