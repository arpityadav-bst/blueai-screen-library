## 42 Worker card and coach mark

**Status:** Changed from V2 (both parts).

**Why:** the home card is the partner's daily answer to "what is my worker doing today". V2's card has an infinite gradient border that cannot animate, a green dollar tile, a whole-card role=button wrapped around a second button, and a Run that always says "my first paid job" and can complete the day again (`moneymaker_home.jsx:70, 122, 132, 141`).

### WorkerCard

- **Purpose:** the home's one card: today's state and the one action that matters now. Never a second Run once today's run has happened.
- **Anatomy:** card radius 16, 1px `--v2-line`, padding 16, no shadow. Tile 40, radius 10, `--v2-surface-sunken`, state icon 20 (tone only for running info, waiting attention, failed danger, complete success). Title 'BlueAI worker' 16/600 ink. Status line 13 ink-3; optional second line 12 for the deadline or consequence. Mode line 12/500: shield-check 'Always ask', or zap 'Automatic · YouTube' in blue ink. One Button md (36) on the right.
- **Variants (state, copy, action):**
  - setup: 'Finds jobs that fit you and runs them on your account.' (V2) / primary 'Run' (V2), with the coach mark.
  - scheduled: 'Next run today at 11 am.' (from the record) / secondary 'Run now'.
  - running: spinner + the live step ('Watching a tech Short…') / quiet 'Details'.
  - waiting: 'A paid YouTube job is waiting for your OK.' + 'Since 11:04 am. Answer by 9 pm or today won’t count.' / primary 'Review job'.
  - done: 'Today’s run is done.' + one tick 'Pending verification' (V2 strings); skipped says 'Run finished without a job.' + 'Today doesn’t count toward your 20 days.' (V2) / quiet 'Details'.
  - failed: 'Today’s job didn’t finish.' (V2) + reason + 'Try again by 9 pm to count the day.' / primary 'Try again'.
  - paused: 'Paused until Oct 16.' + 'Days don’t count while the worker is paused.' / secondary 'Resume'.
  - noCredits: 'Not enough AI credits for today’s run.' + 'Credits refresh at 5:30 am.' / secondary 'AI credits'.
  - offline: 'You’re offline.' + 'Today’s run starts when you’re back online.' / secondary 'Try again'.
  - complete: 'All 20 days done.' + 'Cash out on Earnings after Nov 1.' / secondary 'Earnings' (external). Twenty verified days always clear the $10 cash-out minimum (section 41, `reachedMinimum`), so this line needs no below-the-minimum variant; it still waits for the period to end.
  - Everything not marked V2 is proposed copy.
- **Sizes:** full width of the content column (387 in the 419 window).
- **States:** the ten above, from `workerState(worker)` or forced with `state`. In V2: `?start=worker` (setup, coach on), `?day=returning` (scheduled). The other states do not exist in V2.
- **Props:** `worker`, `state`, `onRun`, `onOpenToday`, `onReview`, `onRetry`, `onResume`, `onOpenCredits`, `coaching`, `onDismissCoach`.
- **Motion:** none on the card; the spinner follows the global reduced-motion rule.
- **Accessibility:** an article named 'BlueAI worker'; the first status line is role=status while running or waiting; only the Button is interactive (36, 4.92:1 primary); the tile is decorative.
- **Responsive:** the body wraps; at compact height the card stays first in the scroll.
- **Do / Don't:** Do put the consequence for today on the card; make the action primary only when the partner is needed (setup, waiting, failed). Don't offer Run after today's run; don't animate the border or paint money green; don't make the card one big button.

### CoachMark

- **Purpose:** point a brand-new partner at Run, once.
- **Anatomy:** ink fill, radius 10, `--v2-shadow-1`, caret 6 aimed at the action, padding 12/12/8/16. Title 13/500 on-colour 'Run this to begin' (PM copy). 'Okay' (PM copy): a 32px inverse button, radius 6, 13/500 ink on surface.
- **Variants:** one.
- **Sizes:** max width 260.
- **States:** visible until Okay, a scrim click or Run; dismissed (remembered as `coachSeen` on the record, so a remount never brings it back; V2 keeps it in local state, `moneymaker_home.jsx:105`). Okay has rest, hover, focus-visible and pressed. In V2: `?start=worker`.
- **Props:** `title`, `onOkay`, `okayClassName` (review only). The screen draws `Scrim` (dim) at `--v2-z-coach` and passes `coaching` to WorkerCard, which lifts the card above it.
- **Motion:** rises 6px over 240ms with the site ease, once; none under reduced motion.
- **Accessibility:** role=note; Okay 32px at 19:1 (V2 about 21px at 3.24:1).
- **Responsive:** right-aligned under the card.
- **Do / Don't:** Do keep the PM's words; dismiss on Okay, scrim or Run. Don't add a body line or a promise; don't show it twice.
