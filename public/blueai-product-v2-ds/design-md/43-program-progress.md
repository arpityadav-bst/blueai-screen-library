## 43 Program progress

**Status:** Changed from V2 (StatusTick, DayBar, ProgramStrip); New (ProgramSummary).

**Why:** the 20 days are the partner's pay. V2's strip says 'Day 6 of 20' the morning after the popup said Day 7 (R02), '14 to go' in green had no unit (V2 dropped it on 2026-10-14), a rejected day has no way to show (R19), the rules are never stated before the first day ends (R12), and its Earnings link goes somewhere other than the menu's (R29). The site's dashboard says '12 of 20 days' and 'Ends Nov 1, 2026' (`onblue/apply.html:1404, 1409`); the app uses the same words and drops the year while it is the current one ('Ends Nov 1', section 70's date rule).

### StatusTick

- **Purpose:** where one day stands, in V2's messaging-app model: one tick pending, two verified.
- **Anatomy:** polyline glyph in a 24-unit box, round caps, its stroke compensated per size so it renders `--v2-icon-stroke` px at every size, as Icon does (`kit/worker.css:65-70`); the double tick is 1.4 times as wide. Colour on the glyph only; optional label 12 ink-3; rejected adds its reason 12 in danger ink.
- **Variants:** pending (one tick, `--v2-ink-4`: the neutral pending tone, section 03), verified (two ticks, `--v2-success`), notcounted (dash, ink-4: skipped or no run), rejected (cross, `--v2-danger-ink`, with reason), late (clock, ink-3: past the one-day promise).
- **Sizes:** `TICK_SIZES` [12, 14, 16, 28] (28 inside the day-done badge); any other size renders at 14.
- **States:** the five variants. V2 has pending and verified only (`worker_day_done.jsx:62-68`).
- **Props:** `status`, `size`, `label` (true prints the word, a string replaces it), `reason`. `tickWord(status)` returns the word StatusTick says ('Pending verification', 'Verified', 'Not counted', 'Still checking'), for any surface that prints it.
- **Motion:** none.
- **Accessibility:** the glyph is role=img named 'Pending verification', 'Verified', 'Not counted' or 'Still checking'; with a label, the label is read and the glyph is hidden.
- **Responsive:** inline; wraps with its text.
- **Do / Don't:** Do pair a tick with words where the day matters. Don't colour a pending tick green.

### DayBar

- **Purpose:** the 20 days at a glance; the site's progress bar plus the pending state it lacks.
- **Anatomy:** 20 segments, height 6, radius 4, gap 2. Verified solid `--v2-success-ink` (the site's goal-bar green); pending surface with a 1.5 inset `--v2-blue` outline (in progress, not reached: one of the three blue exceptions to the neutral pending tone, with the run chip's pending dot and the DayDone badge, section 03); rejected `--v2-danger-tint` with an inset 1px `--v2-danger-edge` (4.53:1, so it reads at 1px), in the slot it would have filled until the next run takes it; out of reach hatched `--v2-line-strong` (slots that can no longer be reached before the end); future `--v2-line`. Legend 12 ink-3 with ticks: '6 verified', '1 pending', '1 not counted', 'n days out of reach'. V2 since 2026-10-14: one continuous bar, height 4, radius 2, green fill for the verified share (`worker_day_done.jsx:155`), so a pending, rejected or missed day cannot show.
- **Variants:** with or without legend; optional `bonusLabel` at the right end only if decision D3 keeps a day-20 bonus (V2 had an amber segment until 2026-10-14).
- **Sizes:** fills its container.
- **States:** verified, pending, rejected, out of reach, future. V2: `?day=returning` (strip), `?day=next&end=job` (overlay).
- **Props:** `days` (segment states) or `worker` (derived by `numbers()`), `target`, `legend`, `bonusLabel`, `label`.
- **Motion:** none.
- **Accessibility:** role=progressbar, aria-valuenow = verified + pending, aria-valuetext '7 of 20 days, 1 pending verification' plus ', N out of reach' when slots can no longer be reached; the legend says it in words, so colour is never the only carrier. In forced colours every state keeps a shape of its own: verified solid, pending a 2px edge, rejected a 2px edge over hatching, out of reach a grey hatch, future a 1px edge (`kit/worker.css:90-101`).
- **Responsive:** segments shrink with the width.
- **Do / Don't:** Do use the same component for the site's tile. Don't add amber or a second green.

### ProgramStrip

- **Purpose:** the home's 'how many of my 20 days count', shown from day 0.
- **Anatomy:** card radius 16, 1px line, padding 16. Head: '6 of 20 days' 14 ink-3 with the figure 600 ink (the site's muted note with one bold figure), 'Ends Nov 1' 12 ink-4, and the ProgramSummary info tip (32). DayBar. Foot over a hairline, type `.v2-text-caption`: one receipt line 12 ink-3 with its tick, and 'Earnings' (`V2Kit.Link` standalone with `href: EARNINGS_URL`, external: underlined ink, blue on hover, external icon).
- **Variants (receipt line):** day 0 'No days counted yet.'; today pending 'Today’s run is pending verification.'; yesterday verified 'Yesterday’s run verified.' (V2); yesterday rejected 'Yesterday’s run wasn’t counted.' in danger ink + 'See why' (opens Activity); skipped 'Today doesn’t count toward your 20 days.' (V2); ended 'This program ended on Nov 1. Cash out on Earnings.' (no cash sentence when `cashOutOpen` is false); today failed, only with `onRetry` (a screen with no WorkerCard to say it, V3's Jobs tab and home): 'Today’s job didn’t finish.' in danger ink + 'Retry' (quiet, sm); complete: no receipt, since the WorkerCard says it once ('All 20 days verified.', cash out after Nov 1).
- **Sizes:** full width.
- **States:** the variants, from the record. V2: `?day=returning` only (returning partners).
- **Props:** `worker`, `onOpenActivity`, `onRetry` (given, a failed today takes the Retry receipt above; without it the WorkerCard's Try again is the home's action), `receipt` (default true; false drops the receipt line and leaves Earnings alone in the foot, for Home while the WorkerCard says today's status, section 57).
- **Motion:** none.
- **Accessibility:** a section named 'Your 20 days'; Earnings and the info trigger are 32 tall and announce 'opens in a new tab' / 'How your 20 days work'.
- **Responsive:** foot wraps under 320.
- **Do / Don't:** Do say the count once, from the ledger. Don't show money or a remaining count in green (V2 dropped both on 2026-10-14); don't use a second Earnings URL.

### ProgramSummary

- **Purpose:** the rules in five lines, before the first day ends (onboarding close, Help) and one tap away afterwards (strip info tip).
- **Anatomy:** title 13/600 'How your 20 days work'; five lines 13 ink-2, each with its own 16 icon: calendar 'Run on 20 days before Nov 1. Keep your PC on and awake at run time, and App Player open while a job runs.' / check 'A day counts when a job is verified, or when there was no job to take. Keep the comment up until it’s verified.' / check-double 'We check every run within a day. The tick doubles once it’s verified.' (the PM's line, `worker_day_done.jsx:98`) / earnings 'Cash out on Earnings after the period ends.' / lock 'You need $10 to cash out. Your balance carries over to the next period.' (`minimumCopy`, the site's two sentences, `onblue/apply.html:2292-2293`). Proposed copy built from V2's rule comment (`worker_day_done.jsx:5-7`) except those two. `programRules(rule)` is the one place a rule is written, and `programRule(id)` one rule's text (DayDone, Run detail and Chat read 'ticks'). The $10 minimum is in both D3 options, so it is the one amount shown before D3; no rate or bonus until then.
- **Variants:** full; compact (the kit Tooltip, info kind, behind a 32px info button).
- **Sizes:** full width; tip max 260.
- **States:** full; compact closed, hover, focus, pinned open, Esc closes.
- **Props:** `rule`, `compact`, `title`, `open` (review), `triggerClassName` (review).
- **Motion:** the tip's own (section 23).
- **Accessibility:** the trigger is named; the tip is aria-describedby.
- **Responsive:** the tip flips at the window edge.
- **Do / Don't:** Do show it in the onboarding close; do state the $10 minimum with cash out. Don't promise a rate or a bonus before D3.
