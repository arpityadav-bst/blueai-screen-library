## 13 Select

**Status:** Select: Changed from V2.

**Why:** The partner picks from a short plain list in two places (which provider, which model) and both live under Settings, Advanced (R31). The native select gives keyboard, screen readers and a list that fits a 419px window for free; it only needs to wear the field box. V2 shows three looks on one screen (radius 10 with a custom chevron, radius 8 with the OS arrow) and its provider select removes the focus outline with nothing in its place (byok_settings.jsx:31; settings.jsx:122; P2, P7).

**V3 restyle (2026-10-14).** The select is the field with the native arrow replaced by a 16px chevron in ink-3. Decision: its placeholder takes `--v2-ink-placeholder` like a field's (it always sits under a visible label), not ink-3. With `hideLabel` (`v2-field--bare`) the placeholder is the only name in the box, so it reads at `--v2-ink-4`, as a bare field's does (review round 2, 2026-10-14).

### Select (Changed from V2)

**Purpose.** One choice from a short plain list.

**Anatomy.** TextField's frame: label 13/500 above, the field box (40, radius 6, 1px `--v2-line-strong`), message line below. Inside: the native select spanning the box (padding 0 36 0 12, 14 ink), chevron-down 16 in ink-3 at right 12 (the whole box opens the list). Placeholder: a disabled first option in ink-3.

**Variants.** One: native with the shared chevron.

**Sizes.** md 40, sm 32.

**States.** Placeholder (`--v2-ink-placeholder`, "Add a provider"); rest; hover (edge 20%); focus (blue edge + 3px ring); filled; open (the operating system draws the list; options always ink); disabled (sunken, 0.45, helper says why); invalid (edge `--v2-danger-edge`, message, as TextField). In V2 today: Settings, Bring Your Own Key switched on: "Add a provider" at #9ca3af (2.54:1), radius 10, custom chevron, no focus style (byok_settings.jsx:31-32, 113-114); two cards below, AI Model with the OS arrow, radius 8, width 200 (settings.jsx:122).

**Props.** `label`, `hideLabel`, `value` / `defaultValue`, `options` ([{value, label, disabled}]), `placeholder`, `onChange(value, event)`, `helper`, `error`, `required`, `optional`, `disabled`, `size`, `width`, `id`, `className`.

**Motion.** Edge and ring over `--v2-dur-1`.

**Accessibility.** Native control: arrow keys, type-to-find and the screen reader's list come from the system. The placeholder sits under the visible label, so it takes the placeholder ink like a field's (V3 restyle). Always a visible label (V2's provider select has none).

**Responsive.** Fills its column; `width` only beside a label in a settings row.

**Do / Don't.** Do use it for a short plain list. Do give it a label even when the placeholder says what to do. Don't build a custom list for plain text options. Don't use it for two or three options the partner should compare: use RadioCard or Segmented (section 14). Options that need an icon or a second line belong in a Menu (section 27).
