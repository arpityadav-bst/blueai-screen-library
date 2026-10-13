## 18 List row

**Status:** Changed from V2.

**Why:** Every screen the concept adds (Activity, Notifications, Worker settings, Connected apps, Account) is a list. V2 has four row shapes for one idea, with two label treatments: Profile rows (grey 14.5 label, 14.5/600 value, profile.jsx:17-24), Settings field rows (15/700 label over a 12px hint at 2.54:1, settings.jsx:82-87), the Sign out card (a whole card, hover from a mouse handler, profile.jsx:57-59) and History rows (a card each, a turning chevron, no aria-expanded, history.jsx:96-104). One row with variants replaces them.

### ListRow (Changed from V2)

**Purpose.** The repeated line of every list: a fact (label + value), a setting (label + control), a place (navigation), a day or run you can open (expandable), an irreversible action (destructive).

**Anatomy.**
1. Row: min 48 tall, padding 12 16 (`--v2-space-3` `--v2-space-4`), gap 12, items centred.
2. Leading (optional): a 20px icon in `--v2-ink-3`, or an Avatar 32 / 40.
3. Text: label 14/500 `--v2-ink`; description 13 `--v2-ink-3` under it (also where a disabled row says why).
4. Trailing, one of: value (14/400 `--v2-ink-2`, tabular, right-aligned), a control (Switch, Select), a Badge, a chevron (16, `--v2-ink-4`), or the external mark.
5. Divider: 1px `--v2-line-hair`, inset 16 on both sides, between rows only (none after the last).

**Variants.** Value. Control (the row is a plain div; the control is the only target). Nav (a button or a link; chevron-right, or `external` for the site). Expandable (chevron-down that turns 180; a panel below). Destructive (label and icon in `--v2-danger-ink`).

**Sizes.** One. Min 48; grows with a two-line description.

**States.**
- Rest: all variants. In V2: Kebab > Profile; Settings tab (Chat AI Settings card); Kebab > Chat History.
- Hover (nav and expandable only): `--v2-wash-hover`. In V2: the Sign out card.
- Focus-visible: 2px `--v2-blue` outline inset 2 (rows sit in cards that clip). New; V2 has none.
- Pressed: `--v2-wash-press`. New.
- Disabled: label, icon, value and chevron at `--v2-opacity-disabled`; the reason, as the description, stays readable. `aria-disabled`, still focusable. New.
- Expanded: `aria-expanded="true"`, chevron turned, panel shown. In V2: History (without the attribute).

**Props.** `ListRow { leading, label, description, value, trailing, badge, onClick, href, external, danger, expandable, expanded, onToggle, divider = true, disabled, disabledReason, children (the expandable panel), className }`. `onClick` makes a button, `href` a link, `expandable` a button with a panel; none makes a div. `expanded` controls it, or it keeps its own state.

**Motion.** Hover wash `--v2-dur-1`; chevron turn `--v2-dur-2` `--v2-ease-out`. Nothing under reduced motion.

**Accessibility.** One target per row. Expandable rows say `aria-expanded` and point at their panel with `aria-controls`. External links add "(opens in your browser)" for screen readers. Description text is 6.0:1. A control row labels its control with the row's words.

**Responsive.** Label and value wrap rather than truncate; the value takes at most half the row. At 419 wide a description of two lines is fine; three is a sign it belongs on its own screen.

**Do / Don't.** Do put a list in one Card with `padding="none"`. Do give a disabled row its reason. Do use a value row for facts and a nav row for places. Don't put a control in a nav row. Don't make a card per row. Don't add hover to rows that do nothing. Don't use bold labels as headings inside a list (that is the screen header's job).
