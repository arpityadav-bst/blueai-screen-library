/* Section 23: Tooltip and info tip (overlays slice). Kit: V2Kit.Tooltip (kit/menu.jsx). */
(function () {
  const G = window.V2Guide;
  // V2's approved explainer, quoted (credits_popup_parts.jsx:105, :110, :13).
  const EXPLAIN = 'BlueAI runs on credits. Every job and chat uses some. You get limited credits each day, enough for 4 to 5 jobs.';
  const FAQ = 'https://bluestacks.ai/getting-started#ai-credits';
  // Proposed copy: V2 names the trigger "What are credits?"; the glossary says "AI credits".
  const NAME = 'What are AI credits?';

  // A stand-in for the product window: tips fit to it the way they fit to AppFrame in the product.
  function Win({ h, align, justify, children }) {
    return (
      <div data-v2-bounds="" style={{
        position: 'relative', width: '100%', height: h, display: 'flex', alignItems: align || 'center',
        justifyContent: justify || 'center', padding: 'var(--v2-space-4)', background: 'var(--v2-canvas)',
        border: 'var(--v2-stroke) solid var(--v2-line-hair)', borderRadius: 'var(--v2-radius-md)',
      }}>{children}</div>
    );
  }
  function Explain() {
    const K = window.V2Kit;
    return <>{EXPLAIN} {K.Link ? <K.Link href={FAQ} external>Learn more</K.Link> : null}</>;
  }
  function Info(props) {
    const K = window.V2Kit;
    return <K.Tooltip kind="info" label={NAME} content={<Explain />} {...props} />;
  }
  function HelpTip({ tipClass, btnClass, placement }) {
    const K = window.V2Kit;
    return (
      <K.Tooltip kind="label" content="Help" placement={placement || 'down'} className={tipClass}>
        <K.IconButton icon="help" label="Help" size={32} className={btnClass} />
      </K.Tooltip>
    );
  }

  function TooltipSection() {
    const K = window.V2Kit;
    const CP = window.CreditsPopupParts;
    return (
      <G.Section id="tooltip">
        <G.Part name="Tooltip" status="changed"
          role="A label tip names an icon-only control; an info tip explains a concept beside its name, with at most one link.">
          <p>Two kinds on one float. <strong>Info</strong> keeps everything V2's credits (i) already does well:
            it opens on hover, on keyboard focus and on click (click pins it for touchscreens), waits 200ms before
            closing so the pointer can reach the link, and Esc closes it. <strong>Label</strong> is new: every
            icon-only button gets its name shown on hover or keyboard focus, after a short wait so a pointer
            crossing the top bar stays quiet.</p>
          <G.StateGrid wide states={[
            { label: 'Hidden', node: <Win h={190} align="flex-end"><Info /></Win>, note: 'A 24px mark in a 32px target.' },
            { label: 'Hover', node: <Win h={190} align="flex-end"><Info className="is-hover" /></Win> },
            { label: 'Keyboard focus', node: <Win h={190} align="flex-end"><Info className="is-focus" /></Win>, note: 'Tab reaches Learn more next.' },
            { label: 'Pinned by click', node: <Win h={190} align="flex-end"><Info open /></Win>, note: 'The (i) shows it is open; an outside click unpins.' },
            { label: 'Esc closes', node: <Win h={190} align="flex-end"><Info className="is-hover is-dismissed" /></Win>, note: 'Still hovered, but Esc was pressed: shut until the pointer leaves or focus moves.' },
            { label: 'Flips at the window edge', node: <Win h={190} align="flex-start" justify="flex-start"><Info open placement="up" /></Win>, note: 'Asked to open up in the top corner: it opens down and slides in 8px from the edge.' },
          ]} />
          <G.StateGrid states={[
            { label: 'Label tip, rest', node: <Win h={96} align="flex-start"><HelpTip /></Win> },
            { label: 'Label tip, hover', node: <Win h={96} align="flex-start"><HelpTip tipClass="is-hover" btnClass="is-hover" /></Win>, note: 'After a 400ms wait.' },
            { label: 'Label tip, focus', node: <Win h={96} align="flex-start"><HelpTip tipClass="is-focus" btnClass="is-focus" /></Win>, note: 'At once, keyboard only.' },
          ]} />
          <G.Note>Try it: hover, Tab to and click the controls in this window. The two top icons sit on the edge and
            open downward on their own.</G.Note>
          <G.Stage width="shell">
            <Win h={220} align="stretch">
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--v2-space-1)' }}>
                  <HelpTip placement="up" />
                  <K.Tooltip kind="label" content="More" placement="up"><K.IconButton icon="more" label="More" size={32} /></K.Tooltip>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--v2-space-2)', marginTop: 'auto', color: 'var(--v2-ink)', fontSize: 'var(--v2-text-14)' }}>
                  <span>2,000 AI credits left today</span><Info />
                </div>
              </div>
            </Win>
          </G.Stage>
          <G.CompareRow
            v2={<Win h={240} align="flex-start"><G.Live label="CreditsPopupParts.InfoTip" get={function () { return CP && CP.InfoTip; }} props={{ dir: 'down', palette: 'blue' }} /></Win>}
            system={<Win h={240} align="flex-start"><Info placement="down" /></Win>}
            changed={'Hover, focus or click the (i) on each side. Behaviour is kept. The position, hard-coded at left -189 for one centred title, now fits whatever window it is in. The blue-tint fill (#EEF6FF on #BFDBFE) becomes the one float surface menus use: white, the 10% line, shadow-1. The (i) rises from 22px to a 24px mark in a 32px target and its idle #94a3b8 (2.56:1) becomes ink-3 (6.0:1). The character arrow after Learn more becomes the external icon. The trigger is named "' + NAME + '" (proposed copy, glossary term). The label kind is new: no icon button in V2 shows its name.'} />
          <G.SpecDrawer rows={[
            { part: 'Info trigger', token: '--v2-hit-min, --v2-icon-sm', value: '24px mark in a 32px target, icon 16', ref: 'overlays.tooltip.trigger-size' },
            { part: 'Trigger colour', token: '--v2-ink-3; open --v2-blue-ink on --v2-select', value: '#5f636b; open #0d5ad6 on rgba(21,110,254,0.12)', ref: 'overlays.tooltip.idle' },
            { part: 'Trigger name', token: null, value: 'label prop; proposed "What are AI credits?"', ref: 'overlays.tooltip.trigger-label' },
            { part: 'Surface', token: '--v2-surface, --v2-line', value: '#ffffff, 1px rgba(0,0,0,0.10)', ref: ['overlays.tooltip.fill', 'overlays.tooltip.line'] },
            { part: 'Radius, padding', token: '--v2-radius-md, --v2-space-3', value: '10px, 12px', ref: 'overlays.tooltip.panel' },
            { part: 'Shadow', token: '--v2-shadow-1', value: 'the float cast (menus, popovers, toasts)', ref: 'overlays.tooltip.shadow' },
            { part: 'Text', token: '--v2-text-13, --v2-ink-2, --v2-leading-body', value: '13px / 1.5, #3c4049', ref: 'overlays.tooltip.text' },
            { part: 'Width', token: null, value: 'hugs, max 260px', ref: 'overlays.tooltip.position' },
            { part: 'Gap to trigger', token: '--v2-space-2', value: '8px, bridged so the pointer keeps it open', ref: 'overlays.tooltip.gap' },
            { part: 'Arrow (info only)', token: '--v2-surface, --v2-line', value: '8px square turned 45deg', ref: 'overlays.tooltip.arrow' },
            { part: 'Placement', token: null, value: 'up or down; flips when the side has no room, slides to stay 8px inside the window', ref: 'overlays.tooltip.position' },
            { part: 'Opens on', token: null, value: 'hover, keyboard focus, click (pins)', ref: ['overlays.tooltip.focus-open', 'overlays.tooltip.pin'] },
            { part: 'Closes', token: null, value: '200ms after the pointer leaves; Esc; an outside click when pinned', ref: ['overlays.tooltip.close-delay', 'overlays.tooltip.esc'] },
            { part: 'Layer', token: '--v2-z-popover', value: '30', ref: 'overlays.tooltip.position' },
            { part: 'Motion', token: '--v2-dur-3, --v2-ease-out', value: 'fade-up 240ms in, 120ms out' },
            { part: 'Label kind', token: '--v2-text-12, --v2-weight-medium, --v2-radius-sm', value: '12/500, padding 4 8, no arrow, 400ms hover wait, at once on keyboard focus' },
            { part: 'Copy', token: null, value: EXPLAIN + ' Learn more', ref: ['overlays.tooltip.copy', 'overlays.tooltip.learn-more', 'overlays.tooltip.faq-url'] },
          ]} />
          <G.DoDont
            do={['Give every icon-only button a label tip whose text is its aria-label.',
              'Put an info tip right after the name of the concept it explains (AI credits, how your 20 days work).',
              'Keep info content to two short sentences and at most one link.']}
            dont={['Put the only statement of a consequence in a tip; say it on the control.',
              'Put a second control in a tip; that is a Popover.',
              'Hard-code an offset; let it fit the window.']} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('tooltip', TooltipSection);
})();
