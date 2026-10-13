## 43 Program progress

**Status:** Changed from V2 (StatusTick, DayBar, ProgramStrip); New (ProgramSummary).

**Why:** the 20 days are the partner's pay. V2's strip says 'Day 6 of 20' the morning after the overlay said DAY 7 (R02), '14 to go' in green has no unit, a rejected day has no way to show (R19), the rules are never stated before the first day ends (R12), and its Earnings link goes somewhere other than the menu's (R29). The site's dashboard says '12 of 20 days' and 'Ends Nov 1, 2026' (`onblue/apply.html:1404, 1409`); the app now says it the same way.

### StatusTick

- **Purpose:** where one day stands, in V2's messaging-app model: one tick pending, two verified.
- **Anatomy:** polyline glyph, stroke 2.5, round caps; the double tick is 1.4 times as wide. Colour on the glyph only; optional label 12 ink-3; rejected adds its reason 12 in danger ink.
- **Variants:** pending (one tick, `--v2-ink-4`), verified (two ticks, `--v2-success`), notcounted (dash, ink-4: skipped or no run), rejected (cross, `--v2-danger-ink`, with reason), late (clock, ink-3: past the one-day promise).
- **Sizes:** 12, 14, 16 (28 inside the day-done badge).
- **States:** the five variants. V2 has pending and verified only (`worker_day_done.jsx:62-68`).
- **Props:** `status`, `size`, `label` (true prints the word, a string replaces it), `reason`.
- **Motion:** none.
- **Accessibility:** the glyph is role=img named 'Pending verification', 'Verified', 'Not counted' or 'Still checking'; with a label, the label is read and the glyph is hidden.
- **Responsive:** inline; wraps with its text.
- **Do / Don't:** Do pair a tick with words where the day matters. Don't colour a pending tick green.

### DayBar

- **Purpose:** the 20 days at a glance; the site's progress bar plus the pending state it lacks.
- **Anatomy:** 20 segments, height 6, radius 4, gap 2. Verified solid `--v2-success`; pending surface with a 1.5 inset `--v2-blue` outline (in progress, not reached); rejected `--v2-danger-tint` + 1px `--v2-danger-line`, in the slot it would have filled until the next run takes it; out of reach hatched `--v2-line-strong` (slots that can no longer be reached before the end); future `--v2-line`. Legend 12 ink-3 with ticks: '6 verified', '1 pending', '1 not counted', 'n days out of reach'.
- **Variants:** with or without legend; optional `bonusLabel` at the right end only if decision D3 keeps a day-20 bonus (V2's amber segment becomes a label).
- **Sizes:** fills its container.
- **States:** verified, pending, rejected, out of reach, future. V2: `?day=returning` (strip), `?day=next&end=job` (overlay).
- **Props:** `days` (segment states) or `worker` (derived by `numbers()`), `target`, `legend`, `bonusLabel`, `label`.
- **Motion:** none.
- **Accessibility:** role=progressbar, aria-valuenow = verified + pending, aria-valuetext '7 of 20 days, 1 pending verification'; the legend says it in words, so colour is never the only carrier.
- **Responsive:** segments shrink with the width.
- **Do / Don't:** Do use the same component for the site's tile. Don't add amber or a second green.

### ProgramStrip

- **Purpose:** the home's 'how many of my 20 days count', shown from day 0.
- **Anatomy:** card radius 16, 1px line, padding 16. Head: '6 of 20 days' 14 ink-3 with the figure 600 ink (the site's muted note with one bold figure), 'Ends Nov 1' 12 ink-4, and the ProgramSummary info tip (32). DayBar. Foot over a hairline: one receipt line 12 ink-3 with its tick, and 'Earnings' (underlined ink, blue on hover, external icon, `EARNINGS_URL`).
- **Variants (receipt line):** day 0 'No days counted yet.'; today pending 'Today’s run is pending verification.'; yesterday verified 'Yesterday’s run verified.' (V2); yesterday rejected 'Yesterday’s run wasn’t counted.' in danger ink + 'See why' (opens Activity); skipped 'Today doesn’t count toward your 20 days.' (V2); complete 'All 20 days verified. Cash out on Earnings after Nov 1.'
- **Sizes:** full width.
- **States:** the variants, from the record. V2: `?day=returning` only (returning partners).
- **Props:** `worker`, `onOpenActivity`.
- **Motion:** none.
- **Accessibility:** a section named 'Your 20 days'; Earnings and the info trigger are 32 tall and announce 'opens in a new tab' / 'How your 20 days work'.
- **Responsive:** foot wraps under 320.
- **Do / Don't:** Do say the count once, from the ledger. Don't show money or '14 to go' in green; don't use a second Earnings URL.

### ProgramSummary

- **Purpose:** the rules in four lines, before the first day ends (onboarding close, Help) and one tap away afterwards (strip info tip).
- **Anatomy:** title 13/600 'How your 20 days work'; four lines 13 ink-2, each with a 16 icon: 'Run on 20 days before Nov 1.' / 'A day counts when a job is verified, or when there was no job to take.' / 'We check every run within a day. One tick while pending, two once verified.' / 'Cash out on Earnings after the period ends.' Proposed copy built from V2's rule comment (`worker_day_done.jsx:5-7`); no amount until D3.
- **Variants:** full; compact (the kit Tooltip, info kind, behind a 32px info button).
- **Sizes:** full width; tip max 260.
- **States:** full; compact closed, hover, focus, pinned open, Esc closes.
- **Props:** `rule`, `compact`, `title`, `open` (review), `triggerClassName` (review).
- **Motion:** the tip's own (section 23).
- **Accessibility:** the trigger is named; the tip is aria-describedby.
- **Responsive:** the tip flips at the window edge.
- **Do / Don't:** Do show it in the onboarding close. Don't promise an amount before D3.
