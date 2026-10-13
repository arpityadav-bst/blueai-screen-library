## 44 Day done

**Status:** Changed from V2.

**Why:** V2's overlay says the same fact five times (eyebrow, title, hero count, pending line, legend), celebrates a pending day in verified green with confetti and a ring that pulses forever, and is a div with role=dialog that never takes focus (`worker_day_done.jsx:131-163`). Colour says paid while the words say not yet (R28). The PM's titles are DRAFT strings and are quoted, not rewritten.

### DayDone

- **Purpose:** the end-of-run moment: today's run is in, here is where the 20 days stand, and it is pending until checked.
- **Anatomy:** the kit Dialog, celebration variant, size sm (320), dim scrim, no close button. Badge 56 round, `--v2-blue-tint` with one tick 28 in blue ink. Title 20/600 ink. Sub 13 ink-3 (Day 20 only). DayBar without legend, then one count line 13: '7 of 20 days' (figure 600 ink) and one tick 'Pending verification'. Note 13 ink-3 'We check every run within a day. The tick doubles once it’s verified.' One primary 'Got it', full width, 44.
- **Variants (copy is the PM's, `worker_day_done.jsx:91-93`):** job 'Today’s run is done.'; nojob 'No paid job today, but your run counts.'; day20 'Day 20 done.' + 'That’s every day for this month.' Failed and skipped have no moment: the run card and the worker card say those, with their action.
- **Sizes:** Dialog sm, 320.
- **States:** open (job, nojob, day20); dismissed by Got it, Esc or the scrim. In V2: `?day=next&end=job`, `?day=next&end=nojob`, `?day=next&end=day20`; the Preview panel's Day end row.
- **Props:** `end` (job | nojob | day20), `worker` (count from `numbers()`), `open`, `onClose`, `preview` (guide only: drawn open in place, no focus).
- **Motion:** the badge pops once over 450ms (`--v2-dur-celebrate`, site ease). Confetti only on Day 20: 12 fixed bits in blue, green and pale yellow, once, about 900ms; hidden entirely under reduced motion. No ring, no loop.
- **Accessibility:** aria-modal, labelled by the title (it sits under the badge, so `labelledBy`); focus moves in, Tab stays inside, focus returns to where it was; the note is ink-3 (V2's was 2.54:1).
- **Responsive:** centred in the window; fits the 640 compact height.
- **Do / Don't:** Do keep pending blue with one tick until verified; say the count once; keep money off it (the days style ships). Don't paint a pending day green; don't celebrate every day; don't loop animation.
