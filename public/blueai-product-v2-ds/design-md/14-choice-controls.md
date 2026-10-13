## 14 Switch, checkbox, radio card, segmented

**Status:** Switch, RadioCard, Segmented: Changed from V2. Checkbox: New.

**Why:** "Keep the partner in control" is one of the product's three jobs, and its controls are choices: Always ask or Automatic per app, own key on or off, when to run, which notifications. V2 has three switches (one of which deletes the saved key when turned off; the per-app mode switch, since 2026-10-14, is the one real role=switch) and an option card built from plain buttons (shared.jsx:49; byok_settings.jsx:26, 64; agent_permissions.jsx:108; ai_mode.jsx:47). Its segmented control, which declared a radiogroup without the keys it promised, became that mode switch on 2026-10-14. The system gives each a real role and keyboard, the site's one chosen look (blue 12% fill, blue 50% edge, ink; onblue/apply.html:930), and edges that clear 3:1 (P4, P6, P7).

### Switch (Changed from V2)

**Purpose.** On or off, applied at once. A switch enables or disables; it never deletes anything.

**Anatomy.** Track 36 by 20, pill. Off: 1px `--v2-ink-4` edge, white, a 12px ink-4 thumb at left 3. On: `--v2-action` fill and edge, a 16px white thumb at right 1. Row form: label 14/500 ink and an optional description 13/1.5 ink-3 on the left, the switch on the right, gap 16; the label is clickable.

**Variants.** With label row (default when `label` is visible); bare (`hideLabel`, for a list row that already names it).

**Sizes.** One, 36x20, with an invisible 32px target.

**States.** Off; on; hover (off: edge and thumb to ink-3; on: `--v2-action-hover`); focus-visible; disabled (0.45, `aria-disabled`, description says why); busy (`aria-busy`, held where it is, the thumb becomes a 12px spinner while a consent or a key check answers). In V2 today: the shared Toggle 32x18 with a spring (shared.jsx:49-51, only on the hidden Skills screen); Settings, Bring Your Own Key: 46x26, `aria-pressed`, and switching it off removes the saved key (byok_settings.jsx:25-26, 64).

**Props.** `checked`, `onChange(next)`, `label`, `hideLabel`, `description`, `disabled`, `busy`, `id`, `className`.

**Motion.** Thumb slides over `--v2-dur-2` (180ms) `--v2-ease-out`, no overshoot; colour over the same. Reduced motion: no transition.

**Accessibility.** role=switch, `aria-checked`, label by `label for` or `aria-label`, description by `aria-describedby`. Off is visible (the edge is 4.77:1; V2's grey tracks are 1.48:1).

**Responsive.** Row fills its column; long labels wrap, the switch stays top-right.

**Do / Don't.** Do apply at once. Do use busy while a consent decides. Don't delete data when switching off (R30: Remove is a separate, confirmed action). Don't use a switch inside a form that saves later: use Checkbox.

### Checkbox (New)

**Purpose.** Many-of-many inside a form that saves together: which notifications, include diagnostic info on Report a problem. Not for consent: in this product the agreement is the button ("I agree, turn on"), as V2 already does.

**Anatomy.** Row min 32, padding 6 0, gap 12: an 18px box (radius 4, 1px `--v2-ink-4`, white) aligned to the first line; label 14/1.35 ink; optional description 13/1.5 ink-3. A native checkbox sits under the drawn box. Group: `<fieldset className="v2-fieldset">` with `<legend className="v2-legend">` (13/500 ink).

**Variants.** Single; group (fieldset and legend).

**Sizes.** One.

**States.** Unchecked; hover (edge ink-3 + wash); focus-visible (outline on the box); checked (`--v2-action` fill, white tick); indeterminate (action fill, white bar); disabled and disabled checked (row at 0.45); invalid (edge `--v2-danger-edge` #d0454a, message in danger ink under the label). In V2 today: none in the product; the only checkbox is the review panel's install chip (index.html:923-926).

**Props.** `checked` / `defaultChecked`, `onChange(next, event)`, `label`, `description`, `disabled`, `indeterminate`, `required`, `error`, `name`, `value`, `id`, `className`.

**Motion.** Fill and edge over `--v2-dur-1`.

**Accessibility.** Native input, so Space, the form and screen readers work; description and error linked by `aria-describedby`. The whole row is the target.

**Responsive.** Full column width; label wraps.

**Do / Don't.** Do group related ones under a legend. Don't use it for a setting that applies at once (Switch). Don't use it to collect agreement.

### RadioCard (Changed from V2)

**Purpose.** One of a few options the partner compares, each with a line of why: AI mode (Cloud or Hybrid), the run window.

**Anatomy.** Card: radius 10, padding 12, 1px `--v2-line`, white. Head: title 14/600 ink, an optional Badge (`badge`, or the pending tag in attention), a 16px check in `--v2-blue-ink` at the right when selected. Sub 13/1.35 ink-3. Disabled reason: 12 ink-2 with a lock icon, under the sub.

**Variants.** `card` (side by side, equal widths); `list` (stacked, full width).

**Sizes.** One.

**States.** Rest; hover (20% edge + wash); selected (`--v2-select` fill, `--v2-select-line` edge at 1.5, check); pending (dashed select-line edge + attention tag such as "Setup needed": picked, not active yet); disabled with reason (sunken, title and sub at 0.45, the reason at full strength); focus-visible (outline on the card). In V2 today: Settings, AI Mode (ai_mode.jsx:45-67): plain buttons, radius 12, 1.5px #e3e7ee, selected #eef6ff with 1.5px #1990FF, pending dashed with an amber tag, disabled at 0.5 with the reason "This PC doesn't meet the requirements for Hybrid." only in a hover title.

**Props.** `label` (the group's name), `name`, `options` ([{value, title, sub, disabled, disabledReason, pending, badge}]), `value` / `defaultValue`, `onChange(value)`, `variant`, `className`.

**Motion.** Fill and edge over `--v2-dur-1`.

**Accessibility.** Native radios: one tab stop, arrow keys move and select, title is the name and sub plus reason the description. Element ids come from `useId`, never from `name`, and the radio `name` is made unique per instance (name + id), so two panels never share one radio group (`kit/choice.jsx:111-113`).

**Responsive.** `card` holds two options in the 419px window; three or more use `list`.

**Do / Don't.** Do print why an option is unavailable. Do keep subs to one line. Don't use it for more than four options (Select). Proposed copy: Hybrid's sub becomes "Uses your PC and saves AI credits." ("tokens" is a banned word); the run window options are "At a set time", "In a window", "Leave it to me" (the last is V2's).

### Segmented (Changed from V2)

**Purpose.** Two or three short, equal options in one line: the per-app Always ask / Automatic.

**Anatomy.** Track: `--v2-surface-sunken`, 1px `--v2-line`, radius 10, padding 2, gap 2. Segment: 32 tall, radius 6, padding 0 12, 13/500 ink-3, optional 16px icon (ModeRows passes shield-check for Always ask and zap for Automatic). Selected: the select fill (`--v2-select` over `--v2-surface`) with a 1.5px `--v2-blue` edge (`--v2-stroke-selected`; 4.15:1 on the track) and ink; no shadow (`kit/overlays.css:271-275`).

**Variants.** Text; icon and text.

**Sizes.** md 32, sm 28 (with an invisible 32 target).

**States.** Rest; hover (wash + ink); selected; focus-visible; disabled (0.45; say why beside it); gated (`beforeChange` is waiting: the target segment shows a dashed select-line edge, the group is `aria-busy`, the selection does not move until the answer). In V2 today: none since 2026-10-14; the composer chip at `?start=worker&v=1` opens a sheet with one switch per app (agent_permissions.jsx:98-116).

**Props.** `options` ([{value, label, icon, disabled}]), `value`, `onChange(value)`, `ariaLabel`, `beforeChange(value)` (return true, or a promise of true, to let the change through), `size`, `disabled`, `className`.

**Motion.** Colour over `--v2-dur-2`. The selected segment does not slide.

**Accessibility.** role=radiogroup and role=radio, one tab stop, arrows, Home and End. With a gate, arrows only move focus and Space or Enter asks, so a consent never opens from a stray key. Same weight selected and not, so nothing reflows.

**Responsive.** Inline beside a label; full width under it when the row is narrow.

**Do / Don't.** Do gate Automatic with the consent (beforeChange opens ConsentDialog, section 46). Don't use it to move between views (Tabs, section 28). Don't apply Automatic before the partner agrees.
