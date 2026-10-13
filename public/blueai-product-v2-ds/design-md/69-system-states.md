## 69 System and program states

**Status:** New.

**Why:** The worker runs on a schedule on the partner's PC, usually while nobody watches. When the PC is offline, the app is out of date, or the account is the wrong one, a day is at stake, and V2 designs none of these screens. After Day 20 V2's last words are "Day 20 done." and "That’s every day for this month." (`worker_day_done.jsx:93`), with nothing about cash out or what comes next, although the program has an end and a cash out (`worker_day_done.jsx:6, 38`).

### SystemStates (New)

- **Purpose:** what the app says when it cannot do its job, and around the program's end: what it means for today, and the one next step.
- **Anatomy:** AppFrame with the TopBar always (so the app is visibly alive) and the BottomNav whenever there is somewhere to go. The body is one column (`--v2-gutter`, 16 top), centred when it holds a single EmptyState (dashed ghost, icon 24 ink-3, title 16/600 as the page h1, body 13 ink-3, one primary). A condition banner is sticky under the top bar (`--v2-z-sticky`).
- **Variants (all copy proposed):**
  1. offline (nothing cached): chip Offline, no credits. EmptyState offline "You’re offline" / "BlueAI can’t reach the internet, so there’s nothing to show yet. Today’s run starts when you’re back online." + Try again.
  2. error (a screen failed): EmptyState error "Couldn’t load Home" / "Nothing is lost: today’s run and your days are not affected." + Try again, Report a problem.
  3. update optional: Banner info "An update is ready" / "It installs the next time BlueAI starts. Today’s run isn’t affected." + Restart now, over the normal home (WorkerCard, ProgramStrip).
  4. update required: chip Paused "Update needed". EmptyState locked, icon download, "Update BlueAI to keep running" / "This version can’t run jobs anymore, so runs are paused. Update now and today can still count. It takes about a minute." + Update now.
  5. not in the program: no chip, no credits, no nav. EmptyState locked, icon user, "This account isn’t in the program" / "You’re signed in as {email}. BlueAI runs on the account you applied with." + Switch account, then "App Player will be signed out too." (V2's consequence line).
  6. program complete (Day 20 verified, period not over): chip "All 20 days done"; WorkerCard complete and ProgramStrip.
  7. period ended, cash out open: no chip, no credits. EmptyState "This program ended on Nov 1" / "You finished 18 of 20 days. Cash out is open on the Earnings page." + Earnings (the one Earnings URL, opens the site).
  8. between programs: no chip, no credits. EmptyState "No program running right now" / "The next one starts Dec 1. Your BlueAI worker starts again then, with nothing to set up." + Earnings as the quiet action.
- **Sizes:** the 419 window; compact 640 keeps the bars pinned and centres the content.
- **States:** each variant; busy on its primary (Try again, Update now, Switch account: spinner in the button, label kept, `aria-busy`).
- **Props:** `SystemStates {state, worker, busy, compact, reduced, preview, landmark, onRetry, onReport, onUpdate, onRestart, onSwitch}`; `SYSTEM_STATES` lists the keys and labels in order.
- **Motion:** the EmptyState rises once (180 ms); nothing loops.
- **Accessibility:** the EmptyState title is the h1; error is `role=alert`, the update banner `role=status`; every primary has a 36 target and a verb label.
- **Responsive:** one column at any height.
- **Do / Don't:** Do keep the top bar; say what the state means for today's run or the 20 days; offer exactly one next step. Don't show a blank window or a wordless spinner; don't blame the partner's connection for a service problem; don't show money the program has not decided (D3).
