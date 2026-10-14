## 15 Chip

**Status:** Chip: Changed from V2.

**Why:** The worker asks and the partner answers with a tap (Yes, Not now), says what went wrong with a tap (Wrong result), and will filter Activity with a tap. V2's reply chips adopted this Chip on 2026-10-14 (worker_cards.jsx:53); it still draws two other looks: a dark #334155 selected reason and a grey back pill, with a hover that lifts but never changes colour (chat_feedback.jsx:77-84; index.html:100-101). One chip with the family's chosen look keeps blue meaning "chosen" and every label legible (P2, P5, P7).

**V3 restyle (2026-10-14).** Chips rest on the 2% navy wash (`--v2-wash-tint` over the surface) with a 10% line and ink-2 labels; hover is the wash plus a 20% line and ink; selected is `--v2-select` with `--v2-select-line`. Decision: chip and pill geometry (height, padding) stays in the Chip rule, not tokens: it belongs to one part (the tokens header rule).

### Chip (Changed from V2)

**Purpose.** One small pressable label for three jobs: a one-shot reply to the worker, a reason you toggle, a filter.

**Anatomy.** Pill, 28 tall (`--v2-control-sm`; an invisible extension makes the target 32), padding 0 12, 1px `--v2-line`, the surface under `--v2-wash-tint`. Label 13/500 ink-2, one line. Optional 16px icon before the label (zap marks the reply that turns on Automatic). Rows wrap with an 8px gap.

**Variants.** Reply (no `selected`: a plain button that answers once; the AskCard hides the row once answered). Reason and filter (`selected` true or false: a toggle with `aria-pressed`). One look for all three; only the behaviour differs. Review round 1 (2026-10-14): the label, the selected fill, edge and label and the lift read look hooks (`--v2-chip-ink`, `--v2-chip-selected-fill`, `-line`, `-ink`, `--v2-chip-shadow`): Target is unchanged, V2 today gets its slate-700 selected chip and faint lift back.

**Sizes.** One, 28.

**States.** Rest; hover (`--v2-wash-hover` + `--v2-line-hover` edge); focus-visible; active (`--v2-wash-press`); selected (`--v2-select` fill, `--v2-select-line` edge, `--v2-ink` label (16.75:1 on the fill) and a check icon before it); selected hover; disabled (native, 0.45). In V2 today: the job ask's chips at `?end=job` with Always ask (worker_cards.jsx:58: 1.5px #c7dcf5, #1990FF 12.5/700); thumbs down on a finished run shows the reasons, the picked one dark #334155 with white (chat_feedback.jsx:77).

**Props.** `selected` (undefined for a reply; true or false for a toggle), `onClick`, `icon`, `disabled`, `className`, `children`.

**Motion.** Fill, edge and label colour over `--v2-dur-2` (180ms). No lift and no shrink (V2: translateY -1px, scale 0.96). Reduced motion: no transitions.

**Accessibility.** A real button with a visible focus ring; toggles carry `aria-pressed`; a row of toggles sits in a `role="group"` named by its prompt ("What went wrong?"). Labels are ink at rest, never blue.

**Responsive.** Rows wrap inside the 300px bubble column and the 419px window.

**Do / Don't.** Do use reply chips for short answers to the worker. Do show what an answer costs before the chips (AskCard, section 37). Don't colour chip text blue at rest. Don't lift or shrink on hover or press. Don't make a chip the main action of a screen (Button). The pill is adapted: the site's application chips are radius-9 toggles (apply.html:944-949); the product keeps the pill so a reply reads as tap to answer in the bubble column.
