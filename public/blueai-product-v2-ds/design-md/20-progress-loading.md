## 20 Progress, spinner, skeleton

**Status:** ProgressBar: Changed from V2. Spinner: Changed from V2. Skeleton: Changed from V2.

**Why:** The worker does things the partner waits on: App Player installs, a key validates, a run moves through its steps, screens load. Each wait needs one honest signal. V2 draws the same 6px blue bar twice on two track blues (ai_mode.jsx:140, needs_bluestacks.jsx:138) and fakes "indeterminate" by pulsing a full bar (ai_mode.jsx:141); it has five busy marks in three colours (index.html:78, login.jsx:256, chat_bubbles.jsx:122, boot_splash.jsx:66, ai_mode.jsx:39); and its home skeleton draws a category list that never arrives (boot_splash.jsx:80-114). All loops come from kit/motion.css so one reduced-motion rule covers them.

### ProgressBar (Changed from V2)

**Purpose.** An amount done: a download or install, a setup, progress toward a goal.

**Anatomy.**
1. Label row: label 13/500 `--v2-ink` left; value 13 `--v2-ink-3` right, tabular ("45%", "12 of 20 days", "Download failed").
2. Rail: `--v2-surface-sunken`, pill radius, 6 tall (4 inline).
3. Fill: `--v2-blue`, width eases over `--v2-dur-3` `--v2-ease-out`.

**Variants.** Determinate. Indeterminate: a 40% segment slides across (`.v2-anim-indet`; V2's own idea, product-scene.css:110-116, at 38%). Success tone for a goal (the site's program bar, 20 pills since 2026-10-14, onblue/apply.html:582-584, in `--v2-success`).

**Sizes.** 6 (cards, notices), 4 (inline).

**States.**
- 0 to 100: blue. V2: the install card in chat (`?start=worker&ask=Watch%20a%20YouTube%20video`, then Get BlueStacks), or Settings > AI Mode > Hybrid > Auto.
- Complete (value = max): fill turns `--v2-success` (reached). In V2 the ring swaps to a check (needs_bluestacks.jsx:133).
- Indeterminate: sliding segment, no value. V2: "Checking…" in AI Mode.
- Error: fill `--v2-danger-ink`, frozen where it stopped, value says what failed. New.
- Paused: fill `--v2-ink-4`, value "Paused". New.
- Reduced motion: indeterminate becomes a full, quiet track (0.45 opacity).

**Props.** `ProgressBar { value, max = 100, indeterminate, tone = 'success' (for goals), size = 4 | 6, label, valueText, paused, error, 'aria-label' (when there is no label), className }`. `valueText` overrides the percentage.

**Motion.** Width ease `--v2-dur-3`; indeterminate `.v2-anim-indet` (`--v2-dur-shimmer`, loops while waiting).

**Accessibility.** The rail is `role="progressbar"` labelled by the label, with `aria-valuenow` (omitted when indeterminate) and `aria-valuetext` ("62%, failed"). The visible value is hidden from screen readers to avoid reading it twice. State never by colour alone: error and paused say so in the value.

**Responsive.** Full width of its container; the label truncates before the value does.

**Do / Don't.** Do say what is happening in the label ("Getting ready"). Do freeze an error where it stopped. Don't pulse a full bar to mean "unknown". Don't show a percentage you cannot measure.

### Spinner (Changed from V2)

**Purpose.** Working, where the result has no shape yet: a button that sent something, a key being checked, a run step in progress.

**Anatomy.** A ring in `currentColor`: track at 20%, a quarter-turn arc with round caps, turning `.v2-anim-spin` (`--v2-dur-spin`, linear).

**Variants.** Inherit (takes the text colour). On colour (`--v2-on-color`, inside a filled button). Done (a `check` in `--v2-success`).

**Sizes.** 12 (the Switch's busy thumb), 16 (buttons, rows, steps, beside text), 24 (a wait inside a mark, the sign-in card's signing step; review round 1, 2026-10-14), 32 (standalone). Stroke 1.5 / 2 / 3 / 4.

**States.**
- Delayed: hidden for the first 300ms, space held, so fast work never flashes. New.
- Spinning. V2: the install card's ring (same URL, then Get BlueStacks), the signing-in ring (`?signin=browser`).
- Done: swaps to the check, so a finished step never reads as stuck (V2's install card does this, needs_bluestacks.jsx:123-135).
- Reduced motion: turns at half speed (it only exists while the partner waits).

**Props.** `Spinner { size = 12 | 16 | 32, label (screen-reader text; makes it a status), delay = 300 (ms; 0 shows at once), done, variant = 'on-color', className }`.

**Motion.** `.v2-anim-spin`, loops only while shown.

**Accessibility.** Decorative by default (the button or row says "Sending" or "Working on it…"). With `label` it is a polite status that announces when it appears and says "Done" when done. In a button, the button carries `aria-busy`.

**Responsive.** Fixed sizes.

**Do / Don't.** Do keep words next to it. Do swap to the check when done. Don't use dots, indigo, or the boot bounce outside the splash. Don't show a spinner for a view that is loading: that is a skeleton.

### Skeleton (Changed from V2)

**Purpose.** A placeholder in the shape of what is on its way: rows of Activity, the worker card, a settings group.

**Anatomy.** `--v2-surface-sunken` shapes with the shared shimmer (`.v2-anim-shimmer`, `--v2-dur-shimmer`).

**Variants.** Line (12 tall, radius 4), title (16 tall, 60% wide), circle (32 by default, round), rect (64 tall, radius 10), lines (n lines, the last at 60%).

**Sizes.** Free: `width` and `height` props (numbers are px).

**States.**
- Shimmering. V2: every cold start shows HomeSkeleton for 850ms (index.html:745).
- Still under reduced motion (V2 has no rule, boot_splash.jsx:14).
- Replaced by content: the screen swaps the composite for the real thing in the same place.

**Props.** `Skeleton { shape = 'line' | 'title' | 'circle' | 'rect', width, height, lines, className }`.

**Motion.** Shimmer loops while loading; none under reduced motion.

**Accessibility.** Hidden from screen readers; the region that is loading carries `aria-busy="true"` and its heading stays real.

**Responsive.** Widths in % follow the container.

**Do / Don't.** Do build each screen's composite line for line from its content (the worker home's composite lives with Home, section 57). Don't show a skeleton for under 300ms of work. Don't reuse one screen's skeleton on another.
