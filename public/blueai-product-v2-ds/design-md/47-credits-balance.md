## 47 Credits balance and allowance

**Status:** Changed from V2 (CreditsChip); New (CreditsMeter, useCountdown).
**Why:** AI credits are the worker's fuel, not money (concept). A partner has one question about them: will today's run happen. V2 shows a bare number that is only ever 2,000 or 0 (index.html:721), paints it and its ring in the brand gradient (index.html:333, 337), fires a "low" dot under 1,000 that can therefore only mean empty (index.html:723), and keeps a second grant of 2,500 in the shared popup parts (credits_popup_parts.jsx:14). The system says the allowance in one place, in ink, against one grant read from the Worker record (section 41).

### CreditsChip (Changed from V2)
- **Purpose:** The top bar's quiet status of today's allowance, and the way into AI credits (section 66).
- **Anatomy:** A real `<button>` with a 32px hit area holding a 28px pill: 1px `--v2-line` on `--v2-surface`, radius pill, padding 0 12 0 8; credits glyph 16 (the brand gradient through V2's star, its one sanctioned use besides the mark); number 13/500 ink, tabular; an 8px dot at the top right with a 2px surface ring when low or empty.
- **Variants:** full (number), low (number + attention dot), empty (0 + danger dot), paused (glyph + "Own key" in ink-3).
- **Sizes:** One: pill 28, target 32.
- **States:** Full; low (less than one run's cost); empty; paused (running on your own key); hover (edge to `--v2-line-hover` + 4.5% wash); focus-visible (2px blue outline on the pill); active (7% wash). Forced with `.is-hover`, `.is-focus`, `.is-active`. V2: `index.html?start=worker` (2,000), `?start=worker&credits=0` (0 + red dot), Preview row "Own key: On" (still shows 2,000, dot hidden).
- **Props:** `balance`, `state` ('full' | 'low' | 'empty' | 'paused', derived from balance and runCost when absent), `runCost`, `onClick`, `className`. TopBar passes `{balance, state}`.
- **Motion:** Edge and wash 120ms (`--v2-dur-1`). Nothing else moves.
- **Accessibility:** Accessible name says the state in words ("AI credits: 120 left today, not enough for today’s run"), so the dot is never the only carrier. Number contrast 19:1; focus ring on the visible pill.
- **Responsive:** Fixed size in the 52px top bar; the number never wraps.
- **Do / Don't:** Do derive low from the Worker record (`credits.left < credits.runCost`). Do say "Own key" instead of a balance that is not being spent. Don't paint the number, ring or fill with the gradient. Don't use a raw threshold like 1,000.

### CreditsMeter (New)
- **Purpose:** Answer "will today's run fit": how much of today's grant is left, when it refreshes, and whether today's run is covered. Lives on AI credits (section 66) under the stat.
- **Anatomy:** 6px rail (`--v2-surface-sunken`, radius pill, role=meter) with a `--v2-blue` fill; caption row 12 ink-4: "1,250 of 2,000 left today" left, "Refreshes in 6h 42m" right; one covered line 13/500 ink-2 with a 16px icon: check in `--v2-success`, alert in `--v2-attention-ink`, x-circle in `--v2-danger-ink`.
- **Variants:** Covered line: "Enough for today’s run", "Not enough for today’s run", "Today’s run can’t start until credits refresh", "Today’s run is done" (when runDone).
- **Sizes:** Full width of its container.
- **States:** Full; partial; low (less than one run); empty; empty with today's run already done; refreshed (rail full, caption "Refreshed"). Not in V2: it is the unshipped comparison idea (credits_page_options.jsx:147-170, `credits-popup-options.html`).
- **Props:** `balance`, `grant`, `runCost`, `refillAt` (Date or ms; default the next 00:00 UTC), `now` (freezes the clock), `runDone`, `refreshed`, `figure` (default true; false, under a StatCard that already shows the balance, makes the caption "of 2,000 today" and keeps aria-valuetext whole), `className`.
- **Motion:** Fill width 240ms `--v2-ease-out`; the countdown text ticks once a second and stops at zero. Reduced motion: the global rule removes the width transition.
- **Accessibility:** role=meter with aria-valuemin 0, aria-valuemax grant, aria-valuenow balance and aria-valuetext "1,250 of 2,000 left today". The covered line is text, not colour. Caption ink-4 is 4.77:1 (meta only); the consequence sits in the ink-2 line.
- **Responsive:** Caption halves wrap to two lines below about 260px.
- **Do / Don't:** Do read grant and runCost from the Worker record (2,000 and 360 in the fixtures). Do keep the fill blue: the line carries the tone. Don't fill it with the brand gradient. Don't show the meter while your own key is in use.

**Proposed copy:** chip "Own key"; meter "{n} of {grant} left today" and "Refreshes in {6h 42m}" (from the unshipped comparison page), "Refreshed", "Enough for today’s run", "Not enough for today’s run", "Today’s run can’t start until credits refresh", "Today’s run is done".

### useCountdown and creditsTime (New helpers, V2 maths kept)
- **Purpose:** One clock for every zero-balance moment, so the chip, meter, dialog and notices say the same time.
- **Anatomy:** `useCountdown(target?, {now?})` returns `{ms, at, left, clock, done, underMinute}`. `creditsTime.formatLeft` is V2's (credits_popup_parts.jsx:27): "6h 42m", "42m", "6h", "8s". `formatClock` gives the partner's local time in the house format: "5:30 am tomorrow", "11 am today".
- **Variants:** Relative (countdown) and clock (local time).
- **Sizes:** n/a.
- **States:** Counting; under a minute (seconds appear); done (stops; components switch to refreshed). A display string such as "5:30 am" is ignored and the next 00:00 UTC is used.
- **Props:** `target` (Date or ms), `opts.now`.
- **Motion:** 1000ms tick (credits_popup_parts.jsx:46), no interval once done or when `now` is fixed.
- **Accessibility:** Counting text is not a live region; announce only the change to refreshed.
- **Responsive:** n/a.
- **Do / Don't:** Do show local time ("5:30 am") wherever a clock appears. Don't say "tomorrow" without a time.
