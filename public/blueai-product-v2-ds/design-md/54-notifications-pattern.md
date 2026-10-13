## 54 Notifications

**Status:** Changed from V2.

**Why:** V2 has good pointers with nothing to point at. The Windows notification leaves after 8 s and is the only record (`desktop_toast.jsx:12`); a click opens a cold-started home with no Retry (`index.html:1053`); and the most urgent moment, a paid job waiting for an Always ask partner, raises only an amber taskbar flash after 4 s (`chat_product.jsx:97`, `product-scene.css:141-142`), with no notification and no deadline, so the job waits forever and the day is lost unseen.

### Channel map (Changed from V2)

- **Purpose:** reach a partner who is not watching, by urgency, with one record for everything.
- **Anatomy (channels):**
  1. Windows notification: a pointer for a partner not looking at BlueAI. A click opens the entry's own place (for a waiting job, the job ask in Chat, Chat waiting, the same destination section 60 names; the run card with Try again; Activity; Earnings), never a cold home. It stays in the Windows action centre.
  2. Taskbar attention: a finite flash while something waits for an answer (job waiting, run failed).
  3. Notifications, the inbox (section 60): the record. Every event lands here, read or not. Pushed from the top bar's More menu.
  4. Badge: on Activity, the count of what needs the partner (a waiting job, a day not counted). Never on Home.
  5. In-app toast: confirms what the partner just did in this window. Never an event.
- **Events (Windows title; when it expires; the Settings switch that turns its Windows notification off, section 61):**
  - Day done: "Today’s run is done." (V2, DRAFT); never; "Today’s run ends".
  - No job today: "Your run counts today." (V2); never; "Today’s run ends".
  - Job waiting (Always ask): "A paid YouTube job is waiting for your OK. Answer by 9 pm."; at the end of the run window, which closes the day as skipped; "A paid job needs you". Also flashes the taskbar.
  - Run failed: "Today’s job didn’t finish." (V2); at the end of the run window; "Today’s run ends". Also flashes the taskbar.
  - Day verified: inbox only, so no switch.
  - Day not counted: "Oct 12 wasn’t counted. See why."; always on (a lost day).
  - Program ending: "3 days left in this program."; always on.
  - Cash out open, only when the period has ended and `numbers().reachedMinimum` (section 41): "Cash out is open on Earnings."; always on.
  - Cash out, under $10 (the period has ended, the minimum not reached): the inbox row says "This program has ended. You need $10 to cash out. Your balance carries over to the next period." (the last two sentences are the site's, `onblue/apply.html:2292-2293`); inbox only, no Windows notification. Never tell a partner under the minimum that cash out is open.
  - Terms updated: inbox only; the terms sheet asks on the next open.
  Titles not marked V2 are proposed copy. The two switches only silence the Windows notification; every event still lands in the inbox. Events marked always on cost or pay the partner, so no switch hides them.
- **Variants:** pointer (Windows, taskbar), record (inbox row), count (badge), confirmation (toast).
- **Sizes:** inbox rows are section 60's rows (it owns their anatomy); the badge is the BottomNav badge.
- **States:** as section 60 draws them: unread (blue dot, 600 title, counted), read, actioned, expired (the waiting row turns into its result, 'Paid job expired' / 'No answer by 9 pm, so today didn’t count.', and still opens the run).
- **Props:** none of its own. The inbox is `V2Screens.Notifications {items, state}`; the count is `BottomNav items[].badge`.
- **Motion:** Windows draws its own notification; the taskbar flash is finite (seven times, then it holds); nothing in the app loops.
- **Accessibility:** unread rows are announced as unread first; the badge is read as ", 2 new"; a Windows notification makes sense without opening the app.
- **Responsive:** inbox rows keep the body to one line and truncate.
- **Do / Don't:** Do put every event in Notifications; give anything that waits a deadline and its cost; open the place the notification is about. Don't make the Windows notification the only record; don't flash the taskbar without saying why anywhere; don't use an in-app toast for something the worker did while the partner was away.
