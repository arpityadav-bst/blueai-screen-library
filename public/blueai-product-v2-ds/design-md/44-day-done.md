## 44 Day done

**Status:** Changed from V2.

**Why:** V2 adopted the minimal popup on 2026-10-14, as this system recommended (R28): a 44 green tick badge, the title, one status line ('Day 7 of 20 · Pending verification'; the money option leads with '+$1 · '; Day 20 drops the day part), the verification note only the first time it shows in a session, and Got it, on a 280 panel, radius 20 (`worker_day_done.jsx:132-151`). The eyebrow, the big green count, the 20-day bar and legend, the confetti and the pulsing ring are gone; the bar lives on the home strip. Still different: V2's badge is verified green while the day is pending, so colour says paid while the words say not yet, and the panel is a div with role=dialog that never takes focus. The system keeps the DayBar above its one count line, confetti once on Day 20 only, and the note on every showing. The PM's titles are DRAFT strings and are quoted, not rewritten.

### DayDone

- **Purpose:** the end-of-run moment: today's run is in, here is where the 20 days stand, and it is pending until checked.
- **Anatomy:** the kit Dialog, celebration variant, size sm (320), dim scrim, no close button. Badge 56 round, `--v2-blue-tint` with one tick 28 in `--v2-blue-ink` (the badge's colour; the tick inherits it instead of StatusTick's pending ink-4). One of the three blue exceptions to the neutral pending tone, with the DayBar's pending segment and the run chip's pending dot (section 03). Title 20/600 ink. Sub 13 ink-3 (Day 20 only). DayBar without legend, then one count line 13: '7 of 20 days' (figure 600 ink) and one tick 'Pending verification'. Note 13 ink-3 'We check every run within a day. The tick doubles once it’s verified.' One primary 'Got it', full width, 44.
- **Variants (copy is the PM's, `worker_day_done.jsx:87-89`):** job 'Today’s run is done.'; nojob 'No paid job today, but your run counts.'; day20 'Day 20 done.' + 'That’s every day for this month.' + the proposed line 'Cash out on Earnings after {endsOn}, once your days are verified ($10 minimum).' (`kit/day-done.jsx:22, 57`). Failed and skipped have no moment: the run card and the worker card say those, with their action.
- **Sizes:** Dialog sm, 320.
- **States:** open (job, nojob, day20); dismissed by Got it, Esc or the scrim. In V2: `?day=next&end=job`, `?day=next&end=nojob`, `?day=next&end=day20`; the Preview panel's Day end row.
- **Props:** `end` (job | nojob | day20), `worker` (count from `numbers()`), `open`, `onClose`, `preview` (guide only: drawn open in place, no focus).
- **Motion:** the badge pops once over 450ms (`--v2-dur-celebrate`, site ease). Confetti only on Day 20: 12 fixed bits in blue and neutral only (`--v2-blue`, `--v2-action`, `--v2-ink-4`), never green or yellow while the day is pending, once, about 900ms; hidden entirely under reduced motion. No ring, no loop.
- **Accessibility:** aria-modal, labelled by the title (it sits under the badge, so `labelledBy`); focus moves in, Tab stays inside, focus returns to where it was; the note is ink-3 (V2's was 2.54:1).
- **Responsive:** centred in the window; fits the 640 compact height.
- **Do / Don't:** Do keep the badge blue with one tick and the count line's tick neutral until verified (section 03); say the count once; keep money off it (the days style ships). Don't paint a pending day green; don't celebrate every day; don't loop animation.
