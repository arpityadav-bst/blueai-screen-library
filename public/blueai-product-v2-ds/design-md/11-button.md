## 11 Button, icon button, link

**Status:** Button, Primary in V2 today, IconButton, Link: all Changed from V2.

**Why:** The worker acts on the partner's own accounts, so every action needs a rank: the one that commits (I agree, turn on; Got it), the frequent second one (Cancel), the third (Not now), the one that destroys (Remove). V2 gives most of them the same blue fill in six radii with three hover models and blue glows, and white on its #1990FF is 3.24:1 (index.html:351, byok.jsx:22). The system takes the site's ladder and shape (radius 6, 13/500, a real press, disabled with a reason; onblue/onblue.css:959-999, onblue/apply.html:411) and an AA action blue (P2, P5, P6, P7).

**V3 restyle (2026-10-14).** The ladder is one component with three skins and Appy's decision D1 is settled: `primary` is the site's solid ink button (`--v2-solid`, hover `--v2-solid-hover` with the cast pulled in and a 1px drop, active 2px, `--v2-shadow-btn`), `secondary` is the ghost (`--v2-surface-panel`, 15% line, no cast; hover `--v2-surface-sunken`, pressed `--v2-surface-press`), `quiet` is unchanged. Geometry: radius 6, 500, tracking -0.02em, heights 44 / 36 (28 sm); lg labels are 14. Decision on destruction: no red solid. `danger` is now the trigger skin (a ghost whose red arrives on hover); the confirm's commit is `destructive` (the solid in Target), named for what is lost (section 52). The reason line under a disabled control is a pattern: 12 ink-3, an optional 16 icon, tied by `aria-describedby`.

### Button (Changed from V2)

**Purpose.** Every pressable action that is not inside a sentence. One primary per view: the action that commits.

**Anatomy.** Box: height 28 / 36 / 44, radius 6 (`--v2-radius-sm`), 1px edge, padding 0 12 / 16 / 24. Label: 13/500 (`--v2-text-13`, `--v2-weight-medium`; lg 14), tracking -0.02em (`--v2-tracking-title`), one line, ellipsis if it must. Optional 16px icon before (`icon`) or after (`iconRight`), gap 8 (6 at sm). Loading: a 16px Spinner takes the leading icon's place; the label stays. Disabled reason: 12/1.35 ink-3 under the button, 6 below.

**Variants.** `primary`: `--v2-solid` #0b0b0d fill and edge, white label (19.6:1), `--v2-shadow-btn`; hover `--v2-solid-hover` #26262b, `--v2-shadow-btn-hover`, 1px drop. `secondary` (default), the ghost: `--v2-surface-panel`, 1px `--v2-line-strong`, ink label, no cast; hover `--v2-surface-sunken` and `--v2-line-hover`; pressed `--v2-surface-press`. `quiet`: no box, ink-2 label; hover wash + ink. `danger`: the ghost at rest; on hover the label turns `--v2-danger-ink`, the edge `--v2-danger-edge`, the fill `--v2-danger-tint`. Use it for the trigger that opens a destructive confirm (Disconnect YouTube, Remove); the confirm's commit is `destructive`, named for what is lost; never for an action that costs nothing (section 52 is the rule). `destructive` (review rounds 1 and 2, 2026-10-14) is the commit of a confirm that loses something (Delete, Remove key, Disconnect): the solid primary in Target (`--v2-button-destructive-fill`, `--v2-button-destructive-hover`), red in V2 today. Sign out's confirm loses nothing (sign in again and pick up where you left off), so it commits with `primary`. Secondary and danger read look hooks at rest and on hover (`--v2-button-secondary-fill`, `-line`, `-ink`, `-hover-fill`, `-hover-line`; `--v2-button-danger-fill`, `-line`, `-ink`, `-hover-fill`, `-hover-line`, `-hover-ink`) so V2 today keeps its white outline buttons and its red Remove; danger hovers to `--v2-danger-tint`, `--v2-danger-edge` and `--v2-danger-ink`.

**Sizes.** sm 28 (`--v2-control-sm`) for dense rows; md 36 (`--v2-control-md`) default; lg 44 (`--v2-control-lg`) for full-width sheet and dialog actions (`full`). sm grows an invisible ::after to the 32px hit floor.

**States.** Rest; hover; focus-visible (2px `--v2-blue` outline, offset 2); active (translateY 1px, 2px on the solid; secondary and danger press to `--v2-surface-press`, quiet to `--v2-wash-press`); disabled (0.45, `aria-disabled`, still focusable, reason printed); loading (`aria-busy`, spinner, clicks ignored, cursor progress). In V2 today: New Chat at `?start=worker` (index.html:351); Save settings on the Settings tab (settings.jsx:138); Cancel and I agree, turn on in the Automatic consent (agent_permissions.jsx:205-208, open the mode chip at `?start=worker` and pick Automatic); Got it on the day-done card (worker_day_done.jsx:131, `?end=job`, the system's 44px primary on #1990FF since 2026-10-14) and the out-of-credits card (byok.jsx:26, `?credits=0` then send); Apply disabled at 0.45 with no reason (ai_mode.jsx:190, Settings, AI Mode, Hybrid, Custom).

**Props.** `variant` ('primary' | 'secondary' | 'quiet' | 'danger' | 'destructive', default 'secondary'), `size` ('sm' | 'md' | 'lg'), `icon`, `iconRight` (icon names, section 08), `loading`, `disabled`, `disabledReason` (string printed under it), `full`, `type` ('button'), `onClick`, `href` (renders an a), `external` (new tab, external glyph, "opens in a new tab" for screen readers), `className`, `children`.

**Motion.** Colour, edge and cast over `--v2-dur-1` (120ms) `--v2-ease-standard`; press 1px (the solid: 1px on hover, 2px active) over `--v2-dur-1` `--v2-ease-out`. Reduced motion: no transitions, no press travel. No glow, no lift, no brightness filter.

**Accessibility.** White labels only on `--v2-solid` (or `--v2-action` on a checked control). Disabled stays in the tab order with the reason linked by `aria-describedby`. Focus ring always visible. Targets at least 32px. The label is the action, in sentence case, no trailing ellipsis.

**Responsive.** Fixed 419px window: sheets and dialogs use `size="lg" full`; rows use sm or md. On the compact 640px window nothing changes size.

**Do / Don't.** Do keep one primary per view. Do print why a button is disabled. Do keep the label while loading. Don't put two filled buttons side by side. Don't hover by opacity (it lowers contrast that must hold). Don't add a glow, a lift or a pill. Don't put a red fill on a commit. Decision D1 is settled: the primary is the solid ink (V3 restyle, 2026-10-14).

### Primary in V2 today (Changed from V2)

**Purpose.** Shows the change where a partner meets it: the out-of-credits card's Got it.

**Anatomy.** V2: pill, 15/700, #1990FF, white at 3.24:1, opacity 0.9 hover (byok.jsx:26-27). System: radius 6, 13/500, the solid ink #0b0b0d, white at 19.6:1, `--v2-solid-hover` (V3 restyle).

**Variants.** None.

**Sizes.** md; full width inside the card.

**States.** Rest. Reached in V2 at `?credits=0`, then send a message.

**Props.** `<Button variant="primary" full>Got it</Button>`.

**Motion.** As Button.

**Accessibility.** Passes AA where V2 fails it.

**Responsive.** As Button.

**Do / Don't.** Do keep V2's words ("Got it"). Don't keep the pill.

### IconButton (Changed from V2)

**Purpose.** A bare glyph for the top bar, rows and dialog corners: help, more, close, copy, remove.

**Anatomy.** 36 square (32, 28), radius 6, no edge; glyph 20 (16 at 28) in `--v2-ink-3` (6.0:1). The `label` becomes `aria-label`.

**Variants.** `bare` (default); `outlined` (white, 1px `--v2-line-strong`); `tone="danger"` turns the glyph `--v2-danger-ink` on hover.

**Sizes.** 36 default, 32 for dense rows, 28 inside fields (the reveal button); 28 grows an invisible 32 target.

**States.** Rest; hover (`--v2-wash-hover`, ink glyph); focus-visible; active, menu open or pressed (`--v2-wash-press`, ink glyph, from `active`, `aria-expanded` or `aria-pressed`); disabled (0.45, `aria-disabled`). In V2 today: the help and more icons on the top bar at `?start=worker` (index.html:301, #64748b, #1990FF when open, no hover, no focus); the out-of-credits close at #94a3b8 (2.56:1, byok.jsx:81).

**Props.** `icon`, `label` (required), `size` (28 | 32 | 36), `variant`, `active`, `tone` ('default' | 'danger'), `disabled`, `tip` (default on: a label Tooltip showing the label, section 23; false opts out), `onClick`; `aria-expanded`, `aria-haspopup`, `aria-pressed` pass through.

**Motion.** Background and colour over `--v2-dur-1`.

**Accessibility.** Always a label; pair with a Tooltip (section 23) so sighted users see it too. Open is ink on a wash, not blue: blue means selection.

**Responsive.** Not applicable.

**Do / Don't.** Do use it for well-known glyphs only. Don't use it for an action that needs words (Disconnect, Sign out). Don't colour it blue when open.

### Link (Changed from V2)

**Purpose.** An action inside a sentence (Not you? Switch account), or a quiet way out on its own line (Learn more, Earnings).

**Anatomy.** Ink text with a 1px underline at offset 3 in `--v2-link-underline` (32%, the site's `--link-underline`, onblue/onblue.css:326); hover turns text and underline `--v2-blue-ink` (the site's link, onblue/onblue.css:1224-1232). External adds the external glyph 16 after the text.

**Variants.** Inline (inherits the sentence's size and weight); `standalone` (13/500, inline-flex, min height 32); `external`; `tone="muted"` (ink-3). Without `href` it renders a button drawn as a link.

**Sizes.** Inherits; standalone 13.

**States.** Rest; hover (blue-ink, underline in the same colour); focus-visible; external. In V2 today: Learn more at 12.5/600 #1990FF with a typed arrow (credits_popup_parts.jsx:110, the (i) on the AI Credits screen); Switch account at 600 #1990FF (account_gate.jsx:58, `?signin=browser&player=other`). All 3.24:1, none underlined.

**Props.** `href`, `external`, `tone` ('ink' | 'muted'), `standalone`, `onClick`, `children`.

**Motion.** Colour over `--v2-dur-1`.

**Accessibility.** The underline, not colour, says "link". External links say they open a new tab. One Earnings URL across the app (R29).

**Responsive.** Not applicable.

**Do / Don't.** Do use links for leaving and for in-sentence actions. Do mark external links with the glyph. Don't colour a link blue at rest. Don't type an arrow character into a label. Don't make the main action of a view a link.
