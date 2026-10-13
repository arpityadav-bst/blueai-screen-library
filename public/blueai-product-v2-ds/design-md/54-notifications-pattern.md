## 54 Notifications

**Status:** Changed from V2.

**Why:** V2 has good pointers with nothing to point at. The Windows notification leaves after 8 s and is the only record (`desktop_toast.jsx:12`); a click opens a cold-started home with no Retry (`index.html:1053`); and the most urgent moment, a paid job waiting for an Always ask partner, raises only an amber taskbar flash after 4 s (`chat_product.jsx:97`, `product-scene.css:141-142`), with no notification and no deadline, so the job waits forever and the day is lost unseen.

### Channel map (Changed from V2)

- **Purpose:** reach a partner who is not watching, by urgency, with one record for everything.
- **Anatomy (channels):**
  1. Windows notification: a pointer for a partner not looking at BlueAI. A click opens the entry's own place (the job preview, the run card with Try again, Activity, Earnings), never a cold home. It stays in the Windows action centre.
  2. Taskbar attention: a finite flash while something waits for an answer (job waiting, run failed).
  3. Notifications, the inbox (section 60): the record. Every event lands here, read or not. Pushed from the top bar's More menu.
  4. Badge: on Activity, the count of what needs the partner (a waiting job, a day not counted). Never on Home.
  5. In-app toast: confirms what the partner just did in this window. Never an event.
- **Events (Windows title; when it expires):**
  - Day done: "Today’s run is done." (V2, DRAFT); never.
  - No job today: "Your run counts today." (V2); never.
  - Job waiting (Always ask): "A paid YouTube job is waiting for your OK. Answer by 9 pm."; at the end of the run window, which closes the day as skipped. Also flashes the taskbar.
  - Run failed: "Today’s job didn’t finish." (V2); at the end of the run window. Also flashes the taskbar.
  - Day verified: inbox only.
  - Day not counted: "Oct 12 wasn’t counted. See why."
  - Program ending: "3 days left in this program."
  - Cash out open: "Cash out is open on Earnings."
  - Terms updated: inbox only; the terms sheet asks on the next open.
  Titles not marked V2 are proposed copy.
- **Variants:** pointer (Windows, taskbar), record (inbox row), count (badge), confirmation (toast).
- **Sizes:** inbox rows are ListRows with a 20 icon; the badge is the BottomNav badge.
- **States:** new (Badge info "New", counted), seen, actioned, expired (Badge neutral "Expired", not pressable, says what it cost: "No answer by 9 pm, so today didn’t count.").
- **Props:** none of its own. The inbox is `V2Screens.Notifications {items, state}`; the count is `BottomNav items[].badge`.
- **Motion:** Windows draws its own notification; the taskbar flash is finite (seven times, then it holds); nothing in the app loops.
- **Accessibility:** unread rows are announced as unread first; the badge is read as ", 2 new"; a Windows notification makes sense without opening the app.
- **Responsive:** inbox rows keep the body to one line and truncate.
- **Do / Don't:** Do put every event in Notifications; give anything that waits a deadline and its cost; open the place the notification is about. Don't make the Windows notification the only record; don't flash the taskbar without saying why anywhere; don't use an in-app toast for something the worker did while the partner was away.
