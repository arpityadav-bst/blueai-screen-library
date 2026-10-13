## 07 Motion

**Status:** Durations and curves: Changed from V2. Reduced motion: New. Choreography budgets: Changed from V2.

**Why:** The partner opens this app every day, so motion has to be quick, quiet and identical everywhere. V2 has 38 durations and 12 curves, honours reduced motion in four components only, loops the thinking dots for everyone (its day-done ring went with the minimal popup, 2026-10-14), and spends 3.5s of splash and skeleton on every window open and 5.9s of welcome intro behind the terms sheet. The site's ease is a near twin of V2's house curve, so the family match is free (P5, P6, P7).

### Durations and curves (Changed from V2)

**Purpose.** Five durations, three curves and nine keyframes that every part draws from.

**Anatomy.** Durations: `--v2-dur-1` 120ms (hover colour, press), `-2` 180ms (tab change, chips, toggles, message in), `-3` 240ms (popover, scrim, disclosure, departures), `-4` 320ms (dialog, sheet, window), `--v2-dur-celebrate` 450ms (day-done pop only). Loops: `--v2-dur-spin` 800ms, `--v2-dur-pulse` 1200ms, `--v2-dur-shimmer` 1400ms. Curves: `--v2-ease-out` cubic-bezier(0.16,1,0.3,1) (every arrival, the site's ease), `--v2-ease-in` cubic-bezier(0.5,0,0.75,0.4) (departures), `--v2-ease-standard` ease (colour, opacity). Keyframes in kit/motion.css: `v2-fade-up` (6px rise), `v2-scale-in` (from 0.98), `v2-sheet-up`, `v2-sheet-down`, `v2-fade`, `v2-pulse`, `v2-spin`, `v2-shimmer`, `v2-indet`. Six classes put one on an element (`kit/motion.css:65-77`): `.v2-anim-fade-up` (v2-fade-up at dur-2: EmptyState and Welcome), `.v2-anim-pop-in` (v2-fade-up at dur-3: the coach mark only), `.v2-anim-pulse` (Badge busy dot), `.v2-anim-spin` (Spinner, so the thinking bubble), `.v2-anim-shimmer` (Skeleton), `.v2-anim-indet` (ProgressBar); staggers `.v2-delay-1` and `.v2-delay-2` (120ms steps). There is no class for the overlays: their keyframe changes with their state (`.is-closing`, `.is-leaving`), so each names it in its own rule (`kit/overlays.css`): dialog v2-scale-in at dur-4, sheet v2-sheet-up at dur-4 and v2-sheet-down at dur-3 ease-in, scrim v2-fade at dur-3 (out: reversed, ease-in), toast v2-fade-up at dur-2 (out: v2-fade reversed at dur-1), menus and popovers v2-fade-up at dur-3, and the day-done badge v2-scale-in at `--v2-dur-celebrate` (`kit/worker.css:113`). The "Run by" table at the top of kit/motion.css (lines 7-21) lists every place each keyframe runs; read it before adding motion.

**Variants.** Arrival (ease-out), departure (ease-in, one step shorter), loop (only while the partner waits).

**Sizes.** Not applicable.

**States.** Fast, base, moderate, slow, celebrate. V2 today: tabFadeUp 0.18s (index.html:74), baMsgIn 0.22s (index.html:89), terms sheet up 0.45s and down 0.32s (terms_sheet.jsx:104, 106, bare URL), ddPop 0.45s (worker_day_done.jsx:142, `?end=job`).

**Props.** The six classes and the two stagger classes; an overlay names its keyframe in its own rule instead.

**Motion.** As above.

**Accessibility.** Covered by the reduced-motion rule below.

**Responsive.** Not applicable.

**Do / Don't.** Do ease arrivals out and departures in. Do animate opacity and transform only. Don't loop anything the partner is not waiting on. Don't add a keyframe for one part: the one celebration effect, Day 20's confetti (`v2-w-confetti`, the only local keyframe, `kit/worker.css:190`), lives in the day-done part and plays once.

### Reduced motion (New)

**Purpose.** When the partner asks Windows for less motion, every arrival is simply there and every loop stops, product-wide, from one rule.

**Anatomy.** One `@media (prefers-reduced-motion: reduce)` block in kit/motion.css: animation and transition durations 0.01ms, one iteration, no delay, no smooth scroll. Two exceptions keep meaning: `.v2-anim-spin` keeps turning at half speed (it only exists while a control is busy), and `.v2-anim-indet` becomes a full, quiet track. `.v2-reduced-motion` applies the same rule to one subtree (guide previews).

**Variants.** Normal, reduced.

**Sizes.** Not applicable.

**States.** Normal; reduced (Windows Settings > Accessibility > Visual effects > Animation effects off). V2 honours it only in the terms sheet, the welcome, its logo and the onboarding picker (terms_sheet.jsx:107, moneymaker.jsx:129, moneymaker_logo.jsx:87, onboarding.jsx:37).

**Props.** None. Parts must use the motion classes or tokens, so the one rule reaches them.

**Motion.** Not applicable.

**Accessibility.** Busy states always carry words ("Saving…", "Running today’s run"), so nothing depends on movement.

**Responsive.** Not applicable.

**Do / Don't.** Do rely on the global rule. Don't write per-component reduced-motion blocks. Don't run JS-timed animations that ignore it.

### Choreography budgets (Changed from V2)

**Purpose.** A time budget for every timed sequence, measured against a daily user.

**Anatomy.** Cold start: splash up to 1.2s, only when the app process starts; reopening the window restores the last screen at once, no splash, no skeleton. Welcome (signed out): title, steps and action fade up at `--v2-dur-2` (`.v2-anim-fade-up`, `.v2-delay-1`, `.v2-delay-2`), 120ms apart, about 0.42s, cap 1.2s, no logo drift (`screens/welcome.jsx:93, 136`). Day done: one pop at `--v2-dur-celebrate` (v2-scale-in), no ring; Day 20 adds its confetti once, none under reduced motion. Sheet: up 320ms ease-out, down 240ms ease-in.

**Variants.** Cold start, welcome, day done, sheet.

**Sizes.** Not applicable.

**States.** V2 today: splash messages at 1050ms, fade at 2150ms, done at 2650ms (boot_splash.jsx:31-33) then an 850ms skeleton (index.html:745) on every window open (bare URL); welcome CTA at 1.65s and terms finishing at 5.9s (moneymaker.jsx:107-110); day done `?end=job`.

**Props.** Splash `coldStart` (section 33).

**Motion.** As above.

**Accessibility.** Nothing interactive waits behind a choreography: controls are usable as soon as they appear.

**Responsive.** Not applicable.

**Do / Don't.** Do brand the first look only. Don't replay the splash on reopen. Don't make the partner wait for an animation to read terms.
