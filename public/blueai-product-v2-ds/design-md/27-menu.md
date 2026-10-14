## 27 Menu and popover

**Status:** Menu, Popover: both Changed from V2.

**Why:** Earnings and Sign out live in a header menu, so the only route to the partner's money and account must work from the keyboard. V2's help and more menus close only on an outside mousedown, with no role, no Esc and no arrow keys, and paint hover with onMouseEnter (index.html:289-301). Until 2026-10-14 the per-app mode menu (ModeChip) handled Esc and outside clicks but called a panel of radio groups a menu and returned no focus; V2 now opens a bottom sheet for it instead (section 26). The system splits the two jobs: Menu for actions, Popover for a small panel with its own controls (P4, P7, R25).

### Menu (Changed from V2)

**Purpose.** A short list of actions or destinations off a button: the top bar's help and more menus, a row's overflow (View run, Report a problem, Disconnect).

**Anatomy.** Panel 6px off its button: `--v2-surface`, 1px `--v2-line`, radius 10, `--v2-shadow-1`, padding 4, min 200, max 280. Rows 36 (`--v2-control-md`), radius 6, icon 16 `--v2-ink-3`, label 13/500 `--v2-ink-2`, an optional hint 12 `--v2-ink-3` (the reason a row is off), a trailing external icon for rows that leave the app. A 1px `--v2-line-hair` rule before Sign out. Optional eyebrow header and 12px footnote. Layer `--v2-z-popover`.

**Variants.** Action rows; external rows (`href`, `external`); danger rows (`--v2-danger-ink`, only for a row that destroys); disabled rows (0.45, still focusable, with a hint).

**Sizes.** One.

**States.** Closed; open; row hover (`--v2-wash-hover`, label to ink); row focus-visible (2px blue ring inside the row plus the wash); row active (`--v2-wash-press`); row disabled; danger row; external row. Placement down or up, aligned to the button's end or start; it flips and swaps to stay in the window. In V2 today: `?start=worker`, then the ? (FAQ, Report Issue) or the three dots (Chat History, Profile, Earnings, Logout) (index.html:364-378).

**Props.** `trigger` (render prop receiving `aria-haspopup`, `aria-expanded`, `aria-controls`, `onClick`, or an element to clone them onto), `items` ([{icon, label, onSelect, href, external, danger, disabled, hint} | {separator: true}]; `icon` is a kit icon name or an element, so a product with its own glyphs keeps them in the kit's menu, V3 review round 1), `placement` ('down' | 'up'), `align` ('end' | 'start'), `header`, `footer`, `label`, `open` / `defaultOpen` / `onOpenChange`, `className`.

**Motion.** Fade-up `--v2-dur-3` on `--v2-ease-out`. Rows change colour over `--v2-dur-1`.

**Accessibility.** role menu with menuitems; the button carries `aria-haspopup` and `aria-expanded`. Enter, Space or Down opens on the first row (Up on the last); arrows move and wrap, Home and End jump, Esc closes and returns focus to the button, Tab closes; an outside click closes without moving focus. Choosing a row closes the menu and returns focus before the row acts, so a dialog it opens gives focus back to the button. External rows say "opens in a new tab" to screen readers.

**Responsive.** Fits the window it is in (nearest `[data-v2-bounds]` or AppFrame).

**Do / Don't.** Do keep Sign out last, after a rule. Do use glossary words (proposed: Account, Report a problem, Sign out; V2's FAQ and Earnings are kept). Do give a disabled row its reason (Instagram: Coming soon). Don't put choices or settings in a menu; that is a Popover. Don't use danger for Sign out.

### Popover (Changed from V2)

**Purpose.** A small panel anchored to a button with its own controls: the per-app Always ask / Automatic choice opened from the ribbon's Change or the composer chip.

**Anatomy.** The Menu's panel at min(364, window less two gutters) wide; eyebrow header `.v2-text-eyebrow` (11/500 uppercase `--v2-ink-3`, the one eyebrow recipe); a content slot (ModeRows, section 46); footnote 12/1.35 `--v2-ink-3`.

**Variants.** Anchored down or up, start or end.

**Sizes.** One.

**States.** Open down; open up; Esc (closes, focus back to the button); outside click (closes); focus leaving (closes). In V2 today: `?start=worker&v=1`, the mode chip in the composer; `&v=2` with Automatic on, the ribbon's Change (agent_permissions.jsx:113-156).

**Props.** `trigger`, `placement`, `align`, `header`, `footnote`, `label`, `open` / `defaultOpen` / `onOpenChange`, `className`, `children`.

**Motion.** As Menu.

**Accessibility.** A non-modal dialog named by its header; the button says `aria-haspopup="dialog"`. Focus moves to its first control on open. Header and footnote at 4.77:1 and 6.0:1 (V2's #9ca3af was 2.54:1).

**Responsive.** Never wider than the window less its gutters; flips and swaps to fit.

**Do / Don't.** Do keep the footnote word for word: "Automatic starts and finishes that app’s jobs without asking. Each app has its own setting, and a new app starts on Always ask." Do drop "Mode" from the header (the glossary retires it; proposed "Paid jobs, per app"). Don't let picking Automatic skip the consent dialog (section 46).
