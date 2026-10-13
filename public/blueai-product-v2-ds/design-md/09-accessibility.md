## 09 Focus and accessibility

**Status:** Focus ring: Changed from V2. Contrast table: Changed from V2. Targets and keyboard: New.

**Why:** The partner agrees, through this app, to an agent acting on their own accounts and earning on their behalf, so every consent, money and control surface has to be readable and operable by everyone. V2 ships one focus rule (index.html:57) and removes the BYOK select's outline with nothing in its place (byok_settings.jsx:31); its primary labels are 3.24:1; its faintest text carries its caveats at 2.5:1; no overlay moves focus; the header menus work by mouse only (index.html:285); consent controls are 21 to 22px tall (P7).

### Focus ring (Changed from V2)

**Purpose.** One visible focus for every interactive part.

**Anatomy.** Outline `--v2-focus-outline` (2px solid `--v2-blue`) at `--v2-focus-offset` 2px, from one global `:focus-visible` rule in kit/base.css. Fields and the composer replace it with a `--v2-blue` border plus `--v2-focus-ring` (3px at 16%), the site's own values.

**Variants.** Outline (buttons, chips, tabs, links, rows, icon buttons); border plus ring (fields, selects, composer).

**Sizes.** 2px outline, 2px offset; 3px ring.

**States.** Focus-visible only (keyboard). Elements focused by script (`tabindex="-1"`: dialog and screen titles) show no ring. The guide forces it with `.is-focus`. V2 today: browser default ring on most controls, none on the BYOK select (Settings at `?start=worker`, then Tab).

**Props.** None. Parts never set `outline: none` without a replacement.

**Motion.** None: focus appears at once.

**Accessibility.** Outline clears 3:1 against canvas and surface; it sits outside the fill so it shows on a primary button too.

**Responsive.** Not applicable.

**Do / Don't.** Do let the global rule work. Don't remove an outline. Don't show focus on mouse click (that is what `:focus-visible` is for).

### Contrast table (Changed from V2)

**Purpose.** Every text token on every ground, computed live from tokens, so a pairing that fails is visibly forbidden.

**Anatomy.** Rows: ink, ink-2, ink-3, ink-4, blue-ink, success-ink, attention-ink, danger-ink. Columns: surface, canvas, panel, sunken, blue tint, selected, success tint, attention tint, danger tint. Plus on-colour on each fill.

**Variants.** Text (4.5:1), large text and icons (3:1).

**Sizes.** Not applicable.

**States.** Pass (AA), large only, fails. Rules it enforces: ink-4 is meta only and never on sunken (4.42:1 there); placeholder is never text that must be read (2.57:1); status inks go on their own tint or white; white labels go on action (4.92:1), never on brand blue (4.47:1). V2 pairs that fail: #94a3b8 'Working on it…' 2.56:1, #9ca3af 'App Player will be signed out too.' 2.54:1, #60a5fa 'PLAN' eyebrow, #f59e0b link 2.15:1, white on #1990FF 3.24:1, white on #ef4444 3.76:1.

**Props.** Not applicable.

**Motion.** Not applicable.

**Accessibility.** This is the accessibility rule for colour.

**Responsive.** Not applicable.

**Do / Don't.** Do check a new pairing in the guide's table before using it. Don't add a token without its contrast on every ground it will sit on.

### Targets and keyboard (New)

**Purpose.** Controls sized for a mouse in a small window, and one keyboard model for every overlay and list.

**Anatomy.** Targets: 24px absolute floor; `--v2-hit-min` 32px for consent, money and controls in a row; `--v2-control-md` 36px default; `--v2-control-lg` 44px for full-width dialog and sheet actions and the sign-in doors. Keyboard model:
- Menus: trigger has `aria-haspopup` and `aria-expanded`; Enter, Space or Down opens on the first item; Up, Down, Home, End move; Enter picks; Esc or Tab closes and focus returns to the trigger.
- Dialogs: focus moves in (first field, else the safest button); Tab stays inside; Esc closes unless the dialog blocks; focus returns to the opener; the title labels the dialog.
- Sheets: as dialogs; the blocking terms sheet has no close and no Esc, its one way out is the agreement button.
- Tabs: one tab stop, Left and Right move and select.
- Thread: `role="log"`, `aria-live="polite"`.
- Toast: `role="status"`; its action is also reachable elsewhere.
- Errors: field errors linked by `aria-describedby`; a run or screen error uses `role="alert"` once.

**Variants.** As listed.

**Sizes.** 24, 32, 36, 44.

**States.** V2 today: the coach 'Okay' about 21px (moneymaker_home.jsx:57, `?start=worker` first run), the mode 'Change' about 21px (agent_permissions.jsx:133), the info button 22px (credits_popup_parts.jsx:95, `?credits=0`).

**Props.** Overlay parts own their focus management (sections 25 to 27); the kit's IconButton requires `label`.

**Motion.** See section 07.

**Accessibility.** This is the keyboard rule.

**Responsive.** Targets do not shrink on the compact window.

**Do / Don't.** Do make every consent and money control at least 32px. Do return focus where it came from. Don't open a menu on hover only. Don't trap focus without a way out.
