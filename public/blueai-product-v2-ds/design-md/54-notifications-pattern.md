## 54 Notifications

**Status:** Changed from V2.

**Why:** V2 has good pointers with nothing to point at. The Windows notification leaves after 8 s and is the only record (`desktop_toast.jsx:12`); a click opens a cold-started home with no Retry (`index.html:1065`); and the most urgent moment, a paid job waiting for an Always ask partner, raises only an amber taskbar flash after 4 s (`chat_product.jsx:97`, `product-scene.css:141-142`), with no notification and no deadline, so the job waits forever and the day is lost unseen.

### Channel map (Changed from V2)

- **Purpose:** reach a partner who is not watching, by urgency, with one record for everything.
- **Anatomy (channels):**
  1. Windows notification: a pointer for a partner not looking at BlueAI. A click opens the entry's own place (for a waiting job, the job ask in Chat, Chat waiting, the same destination section 60 names; the run card with Try again; Activity; Earnings), never a cold home. It stays in the Windows action centre.
  2. Taskbar attention: a finite flash while something waits for an answer (job waiting, run failed).
  3. Notifications, the inbox (section 60): the record. Every event lands here, read or not. Pushed from the top bar's More menu.
  4. Badge: on Activity, the count of what needs the partner today (a waiting job; a run that failed, was stopped, didn't start or can't start) plus the latest day not counted. Never on Home.
  5. In-app toast: confirms what the partner just did in this window. Never an event.
- **Events (Windows title; when it expires; the Settings switch that turns its Windows notification off, section 61):**
  - Day done: "Today’s run is done." (V2, DRAFT); never; "Today’s run ends".
  - No job today: "Your run counts today." (V2); never; "Today’s run ends".
  - Job waiting (Always ask): "A paid YouTube job is waiting for your OK. Answer by 9 pm."; at 9 pm, the day's deadline (section 41), which closes the run with outcome `expired` and the day with status `notcounted` (a separate outcome from `skipped`, which means the partner declined; `kit/worker-data.jsx:145, 245`); "A paid job needs you". Also flashes the taskbar.
  - Run failed: "Today’s job didn’t finish." (V2); at 9 pm; "Today’s run ends". Also flashes the taskbar.
  - Run didn't start (missed: the PC was off or asleep at run time), raised when the PC wakes: "Today’s run didn’t start. Run it by 9 pm to count today."; at 9 pm; always on (it costs a day). A late start never begins on its own (section 42).
  - Run can't start (blocked: no YouTube, App Player signed out or no BlueStacks, `blockedBy`, section 41): "Today’s run can’t start: <reason>. Fix it by 9 pm.", the reason in the WorkerCard's words (section 42); at 9 pm; always on.
  - Out of credits for today's run (`creditsDay` 'stopped': the refill lands after 9 pm): "Not enough AI credits for today’s run. They refresh at 5:30 am, so today won’t count."; at 9 pm; always on. When the refill lands before 9 pm ('waiting') there is no event: the run starts once they are back.
  - Day verified: inbox only, so no switch.
  - Day not counted: "Oct 12 wasn’t counted. See why."; always on (a lost day).
  - Program ending: "3 days left in this program."; always on.
  - Cash out open, when the balance reaches $10 (`cashOutOpen` turns true, section 41), not tied to the program's end: "Cash out is open on Earnings."; always on.
  - Cash out, under $10 (the program has ended, the minimum not reached): the inbox row says "This program has ended. You need $10 to cash out." (the last sentence is the site's, `onblue/apply.html:2317`); inbox only, no Windows notification. Never tell a partner under the minimum that cash out is open.
  - Terms updated: inbox only; the terms sheet asks on the next open.
  Titles not marked V2 are proposed copy. The two switches only silence the Windows notification; every event still lands in the inbox. Events marked always on cost or pay the partner, so no switch hides them. Each event has its inbox kind, glyph, tone and target in section 60's kind table. An event that expires at 9 pm turns its inbox row into its result then (section 60).
- **Telegram:** not a notification channel. A linked Telegram (section 63) carries the partner's commands to BlueAI; it does not carry these events, and nothing here waits on it. Whether it should carry the day-losing events (job waiting, run didn't start, run can't start) to a partner away from the PC is a product call (section 76).
- **Variants:** pointer (Windows, taskbar), record (inbox row), count (badge), confirmation (toast).
- **Sizes:** inbox rows are section 60's rows (it owns their anatomy); the badge is the BottomNav badge.
- **States:** as section 60 draws them: unread (blue dot, 600 title, counted), read, actioned (once the ask is answered its row says what was chosen, 'You took the paid job' / 'Day 7 of 20, pending verification.' or 'You skipped the paid job' / 'Today didn’t count toward your 20 days.', and opens that run), expired (the waiting row turns into its result, 'Paid job expired' / 'No answer by 9 pm, so today didn’t count.', and still opens the run).
- **Props:** none of its own. The inbox is `V2Screens.Notifications {items, state}`; the count is `BottomNav items[].badge`.
- **Motion:** Windows draws its own notification; the taskbar flash is finite (seven times, then it holds); nothing in the app loops.
- **Accessibility:** unread rows are announced as unread first; the badge is read as ", 2 new"; a Windows notification makes sense without opening the app.
- **Responsive:** as section 60: a row wraps its body (one short sentence) and never truncates it; at 640 only the list scrolls.
- **Do / Don't:** Do put every event in Notifications; give anything that waits a deadline and its cost; open the place the notification is about. Don't make the Windows notification the only record; don't flash the taskbar without saying why anywhere; don't use an in-app toast for something the worker did while the partner was away.
