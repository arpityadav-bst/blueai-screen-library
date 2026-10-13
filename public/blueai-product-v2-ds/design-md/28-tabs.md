## 28 Tabs

**Status:** Tabs: New.

**Why:** Activity (This program / Past) and Notifications (All / Unread) each hold two views of one list. V2 has no tabs a partner can reach: the only ones are on the hidden Skills screen, an indigo #4f46e5 underline that is a second accent (skills.jsx:238). The onBlue dashboard already switches Active and Past programs with a recessed track, one raised chip and counts (onblue/apply.html:443-475, 1390), so the product takes the family's control and the partner meets the same switch on the site and in the app (P6).

### Tabs (New)

**Purpose.** Switch between sibling views of one screen. Never navigation between screens (that is the bottom nav, section 31).

**Anatomy.** Track: `--v2-surface-sunken`, 1px `--v2-line`, radius 10, padding and gap 2. Tab: 32 tall (`--v2-hit-min`), radius 6, 12px sides, label 13/400 `--v2-ink-3`, optional count 12/400 tabular `--v2-ink-3`. Selected: a raised chip, `--v2-surface` with 1px `--v2-line`, label 13/500 `--v2-ink`; no shadow. Adapted from the site: label 12.5 to 13, selected 550 to 500, radius 9 to 10, padding 3 to 2, the chip's shadow dropped, and the count one ink darker (the site's dimmest ink on the recessed track is 4.42:1, under AA for 12px).

**Variants.** With counts (count 0 still shows, so a tab never changes width); `full` stretches the track and splits it evenly.

**Sizes.** One: 32px tabs.

**States.** Rest; hover (`--v2-wash-hover`, label to ink); selected; focus-visible (2px `--v2-blue` ring); active (`--v2-wash-press`); disabled (0.45, skipped by the arrows; rare: prefer an enabled tab with 0). Not in V2 (New): the guide forces each state and its Try it runs both sets.

**Props.** `Tabs {tabs: [{id, label, count, disabled}], value, onChange(id), ariaLabel, idBase, full, className}`. `TabPanel {idBase, id, hidden, children}`: pass the same `idBase` so the tab and its panel point at each other.

**Motion.** Colour, fill and edge over `--v2-dur-1` on `--v2-ease-standard`. The panel swap is instant.

**Accessibility.** tablist (named by `ariaLabel`), tabs with `aria-selected` and `aria-controls`, tabpanels labelled by their tab. One tab stop (the selected tab); Left and Right move and select, wrapping; Home and End jump. Label 6.0:1 at rest.

**Responsive.** Hugs its labels; `full` in a 419 window for two-tab screens like Activity. Labels stay one or two words so nothing wraps.

**Do / Don't.** Do use tabs for two or three views of the same list. Do show the count on every tab, 0 included. Do keep labels short (proposed copy: This program, Past; All, Unread). Don't use tabs to move between screens. Don't hide a tab when it is empty. Don't nest tabs.
