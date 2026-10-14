## 44 Day done

**Status:** Changed from V2.

**Why:** V2 adopted the minimal popup, as this system recommended (R28), and on 2026-10-14 drew it from this system's "V2 today" tokens (`v2_tokens.jsx`): dialog sm 320, dim scrim, radius 16, shadow-2, scale-in, a 56 badge, the title, one status line ('Day 7 of 20. Pending verification', no full stop; Day 20: 'All 20 days done. Pending verification'), and Got it (44); Day 1 shows it too, confetti plays on Day 20 only, and the verification note is gone (`worker_day_done.jsx:94-135`). Day-by-day progress moved to the partner dashboard. Still different: V2's badge is an outlined green circle with one green tick, so colour says reached while the words say not yet, and the panel (aria-modal) never takes focus. The system keeps the DayBar above its one count line and the note on every showing. 'Today’s run is done.' and the status line are approved (2026-10-14); the other titles are DRAFT strings, quoted, not rewritten.

### DayDone

- **Purpose:** the end-of-run moment: today's run is in, here is where the 20 days stand, and it is pending until checked.
- **Anatomy:** the kit Dialog, celebration variant, size sm (320), dim scrim, no close button. Badge 56 round, `--v2-blue-tint` with one tick 28 in `--v2-blue-ink` (the badge's colour; the tick inherits it instead of StatusTick's pending ink-4). One of the three blue exceptions to the neutral pending tone, with the DayBar's pending segment and the run chip's pending dot (section 03). Title 20/600 ink. Sub 13 ink-3 (Day 20 only). DayBar without legend, then one count line 13: '7 of 20 days' (figure 600 ink) and one tick 'Pending verification'. Note 13 ink-3 'We check every run within a day. The tick doubles once it’s verified.' One primary 'Got it', full width, 44.
- **Variants (copy is the PM's, `worker_day_done.jsx:65-70`):** job 'Today’s run is done.'; nojob 'No paid job today, but your run counts.'; day20 'Day 20 done.' + 'That’s every day for this month.' (V2's former line; V2 now: 'All 20 days done. Pending verification') + the proposed line 'Cash out on Earnings after {endsOn}, once your days are verified ($10 minimum).' (`kit/day-done.jsx:22, 57`; its period lock no longer applies since 2026-10-14). Failed and skipped have no moment: the run card and the worker card say those, with their action.
- **Sizes:** Dialog sm, 320.
- **States:** open (job, nojob, day20); dismissed by Got it, Esc or the scrim. In V2: `?day=next&end=job`, `?day=next&end=nojob`, `?day=next&end=day20`; the Preview panel's Day end row.
- **Props:** `end` (job | nojob | day20), `worker` (count from `numbers()`), `open`, `onClose`, `preview` (guide only: drawn open in place, no focus).
- **Motion:** the badge pops once over 450ms (`--v2-dur-celebrate`, site ease). Confetti only on Day 20: 12 fixed bits in blue and neutral only (`--v2-blue`, `--v2-action`, `--v2-ink-4`), never green or yellow while the day is pending, once, about 900ms; hidden entirely under reduced motion. No ring, no loop.
- **Accessibility:** aria-modal, labelled by the title (it sits under the badge, so `labelledBy`); focus moves in, Tab stays inside, focus returns to where it was; the note is ink-3 (V2's was 2.54:1).
- **Responsive:** centred in the window; fits the 640 compact height.
- **Do / Don't:** Do keep the badge blue with one tick and the count line's tick neutral until verified (section 03); say the count once; keep money off it (the days style ships). Don't paint a pending day green; don't celebrate every day; don't loop animation.
