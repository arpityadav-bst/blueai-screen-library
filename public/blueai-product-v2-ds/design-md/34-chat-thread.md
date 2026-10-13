## 34 Chat thread

**Status:** Changed from V2 (Thread); New (DaySeparator and times, JumpToLatest).
**Why:** The thread is a window onto the Worker record, not the record itself (P1). V2 forces the scroll to the bottom on every step (chat_product.jsx:77), has no live region, and stamps every user bubble with the same fixed date (chat_bubbles.jsx:15). A partner checking a run needs to read back while it plays and to know when things happened, because a run is verified a day later.

### Thread (Changed from V2)
- **Purpose:** The conversation with the BlueAI worker: today's run card, its questions, replies and notices, grouped by day.
- **Anatomy:** Scroll region (role=log, aria-live=polite, label "Conversation with BlueAI", Tab-focusable) with 16px padding; inner list bottom-anchored (min-height 100%, flex-end), gap 8, plus 8 when the sender changes; JumpToLatest floats 12px above the bottom.
- **Variants:** Message kinds (V2's role map kept as canonical, plus run and notice): separator, user, status, thinking (last step only), plan, warning, final, notice, ask, needsbs, installing-bs, run. `daydone` no longer renders in the thread: the RunCard's day line and the DayDone moment (section 44) say it.
- **Sizes:** Fills its parent (the content region of the 419px window, compact 640 high).
- **States:** Empty (shows the Home body passed as `empty`); running; awaiting an answer; done; scrolled up with new steps (JumpToLatest with a count). V2: `index.html?day=next&end=job` plays a scheduled run in its own chat; `?start=worker` then Run plays onboarding.
- **Props:** `steps` (array of step objects), `renderStep` (defaults to `V2Kit.renderMessage`), `stickToBottom` (default true), `unseen` (force the count), `onJump`, `label`, `empty`, `className`.
- **Motion:** Jump scrolls smoothly; instant under reduced motion. No forced scroll while the reader is up.
- **Accessibility:** role=log announces additions politely; each bubble has a hidden "You:" / "BlueAI:" prefix; the region takes focus so arrow keys scroll it; focus ring is the shared 2px blue outline, inset.
- **Responsive:** Content region scrolls; top bar, composer and nav stay pinned at the compact 640 height.
- **Do / Don't:** Do keep whatever needs the partner last (the AskCard); otherwise the RunCard keeps the bottom, so answers land above it. Do derive the steps from the Worker record. Don't print each run step as its own bubble. Don't yank the scroll.

### DaySeparator and times (New)
- **Purpose:** Say when each thing happened.
- **Anatomy:** Centred label 12/500 ink-4 between day groups; one time (12 ink-4) under the last message of a group from the same sender.
- **Variants:** Today, Yesterday, a date ("Oct 12").
- **Sizes:** Text only, 12px.
- **States:** Static. Not in V2 (V2 shows "Jun 12, 2026, 11:03 AM" on every user bubble).
- **Props:** `DaySeparator {label}`; steps carry `time` ("11:05 am"); helpers `chatTime.day(date, now)` and `chatTime.time(date)`.
- **Motion:** None.
- **Accessibility:** Plain text inside the log, read in order. ink-4 is 4.77:1 (meta only).
- **Responsive:** Centred at any width.
- **Do / Don't:** Do use the partner's local time, "11 am" style. Don't stamp a time on every bubble.

### JumpToLatest (New)
- **Purpose:** Bring the reader back down after reading up during a run.
- **Anatomy:** Pill, white, 1px line, shadow-1 (it floats), chevron-down 16 + "3 new messages" 13/500 ink-2, min height 32.
- **Variants:** One.
- **Sizes:** 32px tall, hugs its label.
- **States:** Hidden (no new steps, renders nothing), visible with a count, hover (line firms + wash), focus-visible, pressed. Forced with `.is-hover`, `.is-focus`, `.is-active`.
- **Props:** `count`, `onClick`, `className`.
- **Motion:** Colour 120ms; the scroll it triggers is smooth unless reduced motion.
- **Accessibility:** Real button with a text label; the count is in the label.
- **Responsive:** Centred over the thread.
- **Do / Don't:** Do show it only when the reader is up and something arrived. Don't auto-scroll instead.
