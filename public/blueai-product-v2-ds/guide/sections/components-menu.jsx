/* Section 27: Menu and popover (overlays slice). Kit: V2Kit.Menu, V2Kit.Popover (kit/menu.jsx). */
(function () {
  const G = window.V2Guide;
  const { useState } = React;
  const noop = function () {};
  const FAQ_URL = 'https://bluestacks.ai/getting-started#ai-credits';
  // V2 copy, quoted: FAQ, Earnings (index.html:355, 368); the footnote (agent_permissions.jsx:144).
  // Proposed copy (glossary): Report a problem (V2: Report Issue), Account (V2: Profile), Sign out (V2: Logout).
  const FOOTNOTE = 'Automatic starts and finishes that app’s jobs without asking. Each app has its own setting, and a new app starts on Always ask.';
  const HEADER = 'Paid jobs, per app'; // proposed: V2's "Mode, per app" uses Mode as a label, which the glossary retires
  const APPS = [
    { id: 'youtube', name: 'YouTube', icon: 'youtube' },
    { id: 'instagram', name: 'Instagram', icon: 'instagram', status: 'coming-soon' },
  ];

  function Win({ h, align, justify, children }) {
    return (
      <div data-v2-bounds="" style={{
        position: 'relative', width: '100%', height: h, overflow: 'hidden', display: 'flex',
        alignItems: align || 'flex-start', justifyContent: justify || 'flex-end', padding: 'var(--v2-space-3)',
        background: 'var(--v2-canvas)', border: 'var(--v2-stroke) solid var(--v2-line-hair)', borderRadius: 'var(--v2-radius-md)',
      }}>{children}</div>
    );
  }
  function helpItems(mark) {
    return [
      { icon: 'help', label: 'FAQ', href: FAQ_URL, external: true, className: mark && mark.faq },
      { icon: 'alert', label: 'Report a problem' },
    ];
  }
  function moreItems(mark) {
    const K = window.V2Kit;
    const m = mark || {};
    return [
      { icon: 'user', label: 'Account', className: m.account },
      { icon: 'earnings', label: 'Earnings', href: K.EARNINGS_URL, external: true, className: m.earnings },
      { separator: true },
      { icon: 'sign-out', label: 'Sign out' },
    ];
  }
  function Bar({ icon, label, items, open, placement }) {
    const K = window.V2Kit;
    const forced = open ? { open: true, onOpenChange: noop } : {};
    return (
      <K.Menu label={label} items={items} align="end" placement={placement || 'down'} {...forced}
        trigger={function (t) { return <K.IconButton icon={icon} label={label} size={32} {...t} />; }} />
    );
  }
  function ModeContent({ modes, onChange }) {
    const K = window.V2Kit;
    return K.ModeRows ? <K.ModeRows apps={APPS} modes={modes} onChange={onChange} note={false} /> : null;
  }
  function ModePopover({ open, placement, modes, onChange }) {
    const K = window.V2Kit;
    const forced = open ? { open: true, onOpenChange: noop } : {};
    const label = modes && modes.youtube === 'auto' ? 'Automatic' : 'Always ask';
    return (
      <K.Popover header={HEADER} footnote={FOOTNOTE} placement={placement || 'down'} align="start" {...forced}
        trigger={function (t) { return <K.Button size="sm" icon={label === 'Automatic' ? 'zap' : 'shield-check'} iconRight="chevron-down" {...t}>{label}</K.Button>; }}>
        <ModeContent modes={modes || { youtube: 'always' }} onChange={onChange || noop} />
      </K.Popover>
    );
  }

  function TryIt() {
    const [modes, setModes] = useState({ youtube: 'always' });
    return (
      <Win h={330} align="stretch" justify="stretch">
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--v2-space-1)' }}>
            <Bar icon="help" label="Help" items={helpItems()} />
            <Bar icon="more" label="More" items={moreItems()} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
            <ModePopover modes={modes} onChange={function (app, m) { setModes(Object.assign({}, modes, { [app]: m })); }} />
            <Bar icon="more" label="Run options" items={[{ icon: 'eye', label: 'View run' }, { icon: 'alert', label: 'Report a problem' }]} />
          </div>
        </div>
      </Win>
    );
  }

  function MenuSection() {
    const AP = window.AgentPermissions;
    const open = function (items, label, icon) { return <Win h={230}><Bar icon={icon || 'more'} label={label || 'More'} items={items} open /></Win>; };
    return (
      <G.Section id="menu">
        <G.Part name="Menu" status="changed"
          role="A short list of actions off a button: the header's help and more menus, a row's overflow. Keyboard first, mouse equal.">
          <G.StateGrid wide states={[
            { label: 'Closed', node: <Win h={230}><Bar icon="more" label="More" items={moreItems()} /></Win>, note: 'The button says it opens a menu, and whether it is open.' },
            { label: 'Open', node: open(moreItems()), note: 'Focus is on the first row; Sign out sits last, after a rule.' },
            { label: 'Row hover', node: open(moreItems({ account: 'is-hover' })) },
            { label: 'Row pressed', node: open(moreItems({ account: 'is-active' })), note: 'A deeper wash while held.' },
            { label: 'Row focus-visible', node: open(moreItems({ earnings: 'is-focus' })), note: 'Arrows move, Home and End jump, Esc returns focus to the button.' },
            { label: 'Row disabled', node: open([{ icon: 'link', label: 'Connect Instagram', disabled: true, hint: 'Coming soon' }], 'Instagram options'), note: 'Still reachable, so its reason is read.' },
            { label: 'Danger row', node: open([{ icon: 'refresh', label: 'Reconnect' }, { separator: true }, { icon: 'x-circle', label: 'Disconnect', danger: true }], 'YouTube options'), note: 'Opens the destructive confirm (section 25).' },
            { label: 'External row', node: open(helpItems({ faq: 'is-hover' }), 'Help', 'help'), note: 'The external icon, and "opens in a new tab" for screen readers.' },
          ]} />
          <G.Note>Try it with the mouse and the keyboard: the help and more menus at the top, a run row's menu at the
            bottom right (asked to open down, it opens up), and the per-app popover at the bottom left.</G.Note>
          <G.Stage width="shell"><TryIt /></G.Stage>
          <G.CompareRow
            v2={<G.FrameState url="index.html?start=worker" label="V2 signed in: open the ? or the three dots" height={760} />}
            system={<Win h={260}><Bar icon="more" label="More" items={moreItems()} open /></Win>}
            changed="V2's two header menus close only on an outside mousedown: no role, no Esc, no arrow keys, hover painted by onMouseEnter. Rows are 14px #1f2937 with 18px #64748b icons, a red Report Issue glyph and a 14px #94a3b8 external arrow; the panel is min 190, radius 10, its own shadow, z 60. The system menu is the keyboard menu ModeChip already half-implements: role menu, aria-haspopup and aria-expanded on the button, arrows, Home, End, Esc returning focus, Tab closing. Rows are 36px, radius 6, 13/500 ink-2 with 16px ink-3 icons, one hover wash and a visible focus ring; danger only for a row that destroys; external rows carry the icon. Words follow the glossary: Sign out, Account, Report a problem." />
          <G.SpecDrawer rows={[
            { part: 'Panel', token: '--v2-surface, --v2-line, --v2-radius-md, --v2-shadow-1', value: 'white, 1px 10% line, 10px, the float cast', ref: 'overlays.menu.panel' },
            { part: 'Width', token: null, value: 'min 200px, max 280px', ref: 'overlays.menu.panel' },
            { part: 'Padding', token: '--v2-space-1', value: '4px', ref: 'overlays.menu.panel' },
            { part: 'Placement', token: '--v2-space-15', value: '6px off the button; down or up, start or end; flips and swaps to stay in the window' },
            { part: 'Layer', token: '--v2-z-popover', value: '30', ref: 'overlays.menu.panel' },
            { part: 'Row', token: '--v2-control-md, --v2-radius-sm', value: '36px, radius 6', ref: ['overlays.menu.item', 'overlays.menu.item-radius'] },
            { part: 'Row label', token: '--v2-text-13, --v2-weight-medium, --v2-ink-2', value: '13/500, #3c4049', ref: 'overlays.menu.item' },
            { part: 'Row icon', token: '--v2-icon-sm, --v2-ink-3', value: '16px, #5f636b', ref: ['overlays.menu.icon', 'overlays.menu.warn-icon'] },
            { part: 'Hover', token: '--v2-wash-hover', value: 'rgba(0,0,0,0.045), label to ink', ref: 'overlays.menu.hover' },
            { part: 'Focus-visible', token: '--v2-focus-outline', value: '2px blue ring inside the row, plus the wash' },
            { part: 'Danger row', token: '--v2-danger-ink', value: '#c03a40, label and icon' },
            { part: 'External row', token: '--v2-ink-4', value: 'trailing external icon, 16px #6e737c', ref: 'overlays.menu.external' },
            { part: 'Disabled row', token: '--v2-opacity-disabled', value: '0.45, focusable, with a hint saying why' },
            { part: 'Button while open', token: null, value: 'IconButton aria-expanded state', ref: 'overlays.menu.trigger-active' },
            { part: 'Keyboard', token: null, value: 'Enter, Space or Down opens (Up: last row); arrows, Home, End; Esc returns focus; Tab closes', ref: 'overlays.menu.outside' },
            { part: 'Motion', token: '--v2-dur-3, --v2-ease-out', value: 'fade-up 240ms' },
            { part: 'V2 rows', token: null, value: 'help: FAQ, Report Issue; more: Chat History, Profile, Earnings, Logout', ref: ['overlays.menu.copy-faq', 'overlays.menu.copy-report', 'overlays.menu.copy-history', 'overlays.menu.copy-profile', 'overlays.menu.copy-earnings', 'overlays.menu.copy-logout'] },
            { part: 'V2 state', token: null, value: '?start=worker opens signed in with both menus', ref: 'overlays.menu.frame' },
          ]} />
          <G.DoDont
            do={['Keep a menu to actions and destinations; put Sign out last, after a rule.',
              'Mark rows that leave the app with the external icon.',
              'Show a disabled row with the reason it is off.']}
            dont={['Put settings or choices in a menu; that is a Popover.',
              'Hide the only route to something important (Earnings, Sign out) in hover.',
              'Use danger for anything that does not destroy or cost a day.']} />
        </G.Part>

        <G.Part name="Popover" status="changed"
          role="A small panel with its own controls, anchored to a button: the per-app Always ask / Automatic choice.">
          <G.StateGrid wide states={[
            { label: 'Open down', node: <Win h={300} justify="flex-start"><ModePopover open placement="down" /></Win>, note: 'Focus moves to its first control.' },
            { label: 'Open up', node: <Win h={300} align="flex-end" justify="flex-start"><ModePopover open placement="up" /></Win>, note: 'From the ribbon above the composer.' },
          ]} />
          <G.CompareRow
            v2={<Win h={300} justify="flex-start"><G.Live label="AgentPermissions.ModeChip" get={function () { return AP && AP.ModeChip; }} props={{ placement: 'down' }} /></Win>}
            system={<Win h={300} justify="flex-start"><ModePopover open placement="down" /></Win>}
            changed={'Click the chip on the left. V2 calls this a menu (role menu around two radio groups) at a fixed width of 364 with left -4; Esc and an outside click close it but focus is not given back. Its header and footnote are #9ca3af (2.54:1). The system makes it what it is: a non-modal dialog that takes focus on open, gives it back on Esc, and closes on an outside click or when focus leaves. It fits the window (width up to 364, flips and swaps), the footnote rises to ink-3 (6.0:1), the header to the eyebrow style, and the header loses the word Mode, which the glossary retires as a label: "' + HEADER + '" is proposed copy. The footnote is V2\'s, word for word.'} />
          <G.SpecDrawer rows={[
            { part: 'Panel', token: '--v2-surface, --v2-line, --v2-radius-md, --v2-shadow-1', value: 'the Menu panel', ref: 'overlays.popover.panel' },
            { part: 'Width', token: '--v2-shell-w, --v2-gutter', value: 'min(364px, window less two gutters)', ref: 'overlays.popover.panel' },
            { part: 'Placement', token: null, value: 'down or up, start or end; fits the window', ref: 'overlays.popover.placement' },
            { part: 'Header', token: '.v2-text-eyebrow (--v2-text-11, --v2-ink-3)', value: 'eyebrow 11/500 uppercase, the one eyebrow recipe', ref: 'overlays.popover.header' },
            { part: 'Footnote', token: '--v2-text-12, --v2-ink-3', value: '12px, #5f636b (6.0:1)', ref: ['overlays.popover.footnote', 'overlays.popover.faint'] },
            { part: 'Role', token: null, value: 'dialog (non-modal), named by its header; button aria-haspopup dialog', ref: ['overlays.popover.role', 'overlays.popover.trigger'] },
            { part: 'Closes', token: null, value: 'Esc (focus back to the button), outside click, focus leaving', ref: ['overlays.popover.esc', 'overlays.popover.outside'] },
            { part: 'Modes', token: null, value: 'Always ask / Automatic, per app', ref: ['overlays.popover.mode-always', 'overlays.popover.mode-auto'] },
          ]} />
        </G.Part>
      </G.Section>
    );
  }

  G.register('menu', MenuSection);
})();
