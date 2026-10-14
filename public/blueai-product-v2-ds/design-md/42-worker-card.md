## 42 Worker card and coach mark

**Status:** Changed from V2 (both parts).

**Why:** the home card is the partner's daily answer to "what is my worker doing today". V2's card has an infinite gradient border that cannot animate, a green dollar tile, a whole-card role=button wrapped around a second button, and a Run that always says "my first paid job" and can complete the day again (`moneymaker_home.jsx:70, 122, 132, 141`).

### WorkerCard

- **Purpose:** the home's one card: today's state and the one action that matters now. Never a second Run once today's run has happened.
- **Anatomy:** card radius 16, 1px `--v2-line`, padding 16, no shadow. Tile 40, radius 10, `--v2-surface-sunken`, state icon 20 (tone only for running info, waiting and missed attention, failed and blocked danger, complete success; `kit/worker-card.jsx:24-29`). Title 'BlueAI worker' 16/600 ink. Status line 13 ink-3; optional second line 12 for the deadline or consequence. Mode line 12/500: shield-check 'Always ask', or zap 'Automatic · YouTube' in blue ink. One Button md (36) on the right.
- **Variants (state, copy, action):**
  - setup: 'Finds jobs that fit you and runs them on your account.' (V2) / primary 'Run' (V2), with the coach mark.
  - scheduled: 'Next run today at 11 am.' (from the record) / secondary 'Run now'.
  - running: spinner + the live step ('Watching a tech Short…') + the meta line 'Leave App Player open until it’s done.' (`RUN_COPY.keepOpen`) / quiet 'Details'.
  - waiting: 'A paid YouTube job is waiting for your OK.' + 'Since 11:04 am. Answer by 9 pm or today won’t count.' / primary 'Review job'.
  - done: 'Today’s run is done.' + one tick 'Pending verification' (V2 strings); no job: 'No paid job today, but your run counts.' (V2); skipped says 'You skipped today’s paid job.' + 'Today doesn’t count toward your 20 days.' (`DAY_COPY.notCounted`); expired (no answer by the deadline): 'No answer by 9 pm, so I skipped the job.' + 'Today doesn’t count toward your 20 days.' / quiet 'Details'.
  - stopped (proposed): 'You stopped today’s run.' + 'Today doesn’t count yet. Run again by 9 pm.' (`DAY_COPY.stopped`) / secondary 'Run again'.
  - failed: 'Today’s job didn’t finish.' (V2) + reason + 'Today doesn’t count yet. Try again by 9 pm.' (`DAY_COPY.failed`) / primary 'Try again'.
  - missed (proposed): 'Your PC was off or asleep at 11 am, so today’s run didn’t start.' + 'Run now by 9 pm to count today.' / primary 'Run now'. A late start never begins on its own: the partner may be using the PC when it wakes (P3).
  - blocked (proposed), one per reason from `blockedBy(worker)`, each 'Today’s run can’t start: ' + the reason, a deadline line and one fixing action that calls `onFix(reason)`: no-app 'YouTube isn’t connected.' / 'Connect it by 9 pm to count today.' / primary 'Connect YouTube' (also after a disconnect the partner chose: the same blocked 'no-app' card and Activity badge, and its copy says daily runs can’t start, never that they pause; section 41's decision, section 63); signed-out 'App Player isn’t signed in to YouTube.' / 'Sign in there by 9 pm to count today.' / primary 'Open App Player'; no-bluestacks 'BlueStacks isn’t installed.' / 'Install it by 9 pm to count today.' / primary 'Get BlueStacks'. Home routes them (section 57).
  - paused: 'Paused until Oct 16.' + 'Days don’t count while the worker is paused.' / secondary 'Resume'.
  - noCredits: 'Not enough AI credits for today’s run.' + `OOC_COPY.refreshAt` and the time ('AI credits refresh at 5:30 am.') + the day line `OOC_COPY.day[creditsDay(worker)]` ('Today’s run starts once they’re back, so today can still count.' or 'Today won’t count toward your 20 days.', section 48) / secondary 'AI credits'.
  - offline: 'You’re offline.' + 'Today’s run starts when you’re back online.' / secondary 'Try again'.
  - checking (all 20 done, at least one still pending, today idle): 'All 20 days done.' + a pending tick and 'One day is still being checked. I’ll run again only if it doesn’t count.' (`RUN_COPY.checking`) / secondary 'Earnings' (external); no mode line. The worker stops taking jobs and runs again only if a day is not counted.
  - complete: 'All 20 days verified.' + 'Your worker won’t run again until the next program. Cash out on Earnings.' / secondary 'Earnings' (external); no mode line. Twenty verified days clear the $10 cash-out minimum under either money model (D3; the site's answer is `cashOutOpen`, section 41), so this line needs no below-the-minimum variant.
  - ended (proposed; the program is over before all 20 were verified; cash out follows the $10 rule only): the `endedCopy(n)` words (section 69), 'This program ended on Nov 1.' + 'You finished 18 of 20 days. Your worker won’t run again until the next program. Cash out is open on Earnings.' (the verified count, then `RUN_COPY.over`), or under the minimum 'You finished 6 of 20 days. Your worker won’t run again until the next program. You need $10 to cash out.' / secondary 'Earnings' (external); no mode line. Home shows section 69's program-ended state instead of this card once the program is over; the state stays for review and other surfaces.
  - Everything not marked V2 is proposed copy.
- **Sizes:** full width of the content column (387 in the 419 window).
- **States:** the fifteen above (setup, scheduled, running, waiting, done, stopped, failed, missed, blocked, paused, noCredits, offline, checking, complete, ended), from `workerState(worker)` (section 41's priority order) or forced with `state`. In V2: `?start=worker` (setup, coach on); `?day=returning` was removed on 2026-10-14. The other states do not exist in V2.
- **Props:** `worker`, `state`, `onRun` (setup, scheduled, missed), `onOpenToday`, `onReview`, `onRetry` (failed, stopped, offline), `onResume`, `onOpenCredits`, `onFix(reason)` (blocked: 'no-app' | 'signed-out' | 'no-bluestacks'), `coaching`, `onDismissCoach`.
- **Motion:** none on the card; the spinner follows the global reduced-motion rule.
- **Accessibility:** an article named 'BlueAI worker'; the first status line is role=status while running or waiting; only the Button is interactive (36, 4.92:1 primary); the tile is decorative.
- **Responsive:** the body wraps; at compact height the card stays first in the scroll.
- **Do / Don't:** Do put the consequence for today on the card; make the action primary only when the partner is needed (setup, waiting, failed, missed, blocked). Don't offer Run after today's run; don't animate the border or paint money green; don't make the card one big button.

### CoachMark

- **Purpose:** point a brand-new partner at Run, once.
- **Anatomy:** ink fill, radius 10, no shadow (it is an in-flow note, not a float), caret 6 aimed at the action, padding 12/12/8/16. Title 13/500 on-colour 'Run this to begin' (PM copy). 'Okay' (PM copy): a 32px inverse button, radius 6, 13/500 ink on surface.
- **Variants:** one.
- **Sizes:** max width 260.
- **States:** visible until Okay or Run; dismissed (remembered as `coachSeen` on the record, so a remount never brings it back; V2 keeps it in local state, `moneymaker_home.jsx:105`). Okay unmounts, so focus moves to the card's action (Run), never to the page. Okay has rest, hover, focus-visible and pressed. In V2: `?start=worker`.
- **Props:** `title`, `onOkay`, `okayClassName` (review only). `coaching` on WorkerCard draws it under the card; nothing is dimmed or locked.
- **Motion:** rises 6px over 240ms with the site ease, once; none under reduced motion.
- **Accessibility:** role=note; Okay 32px at 19:1 (V2 about 21px at 3.24:1).
- **Responsive:** right-aligned under the card.
- **Do / Don't:** Do keep the PM's words; dismiss on Okay or Run. Don't add a body line or a promise; don't show it twice.
