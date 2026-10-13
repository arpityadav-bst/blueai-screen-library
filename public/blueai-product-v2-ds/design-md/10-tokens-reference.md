## 10 Tokens reference

**Status:** Token table: New.

**Why:** V2 has five runtime CSS variables and none of them are design tokens; its values are typed inline, and local constants (ACCENT, INK, MUTED, FAINT, repeated across five files such as ai_mode.jsx:10-13 and agent_permissions.jsx:37) were the system trying to exist. A single token file the PM can read, with what each token replaces, is what lets the next iteration change a colour once (P8).

### Token table (New)

**Purpose.** Every `--v2-` token in one place: its live value, its role and the V2 values it absorbs.

**Anatomy.** One `:root` block in `tokens.css`, prefix `--v2-`, grouped by family: Ink, Surface, Line, Blue, Status, Brand, Type, Space, Radius, Stroke, Elevation, Overlay, Z, Motion, Focus, Opacity, Icon, Shell, Size, Scrollbar. Size holds the part sizes more than one part shares or that step as one set (`tokens.css:240-254`): `--v2-mark-sm` 24, `--v2-mark-md` 32, `--v2-mark-lg` 40, `--v2-mark-xl` 56 (avatars, tiles, discs), `--v2-badge-h` 22, `--v2-row-min-h` 48, `--v2-rail` 6 and `--v2-rail-thin` 4 (bars), `--v2-popover-w` 364, `--v2-measure` 280 and `--v2-measure-tip` 260 (line lengths and floating widths). The kit and screen stylesheets read them, never the raw values (ds-check). Each family comment states its role, its onBlue link and why; each token line ends with its role and "Absorbs" (the V2 values it replaces, with file:line). The guide reads the file as text for roles and reads values with `getComputedStyle`, so the table can never drift from the file.

**Variants.** Light theme only. V2 is white end to end and the site never ships its dark theme, so a dark set would be speculative; the names leave room for one.

**Sizes.** Not applicable.

**States.** Used; orphan. The orphan report lists tokens no kit or screen stylesheet reaches, directly or through another token (inline JSX styles are not scanned).

**Props.** Not applicable.

**Motion.** Not applicable.

**Accessibility.** Contrast for every colour token is in section 09.

**Responsive.** Not applicable.

**Do / Don't.** Do add a value to tokens.css first, with its role and what it absorbs, then use it. Do read the orphan list before adding a token: one may already exist. Don't write a raw colour in kit or screens (tools/ds-check.js fails it). Don't add a token for one use.
