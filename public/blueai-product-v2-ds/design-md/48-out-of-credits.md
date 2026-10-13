## 48 Out of credits

**Status:** Changed from V2 (out-of-credits popup, retired); New (zero-credits notice and run end).
**Why:** Every zero-balance moment must say the same time and what zero means for today's day (R14). In V2 the popup counts down (byok.jsx:66) while the chat says "refreshed tomorrow" twice (chat_bubbles.jsx:188, 189), the main chat reveals zero only after Send (chat_product.jsx:124), and nothing says whether the day still counts.

### Out-of-credits popup (retired) (Changed from V2)
- **Purpose:** none left. V2 lets the partner type at zero, then stops the send with a popup. The system locks the composer at zero and says so before anyone types (section 38), so the moment the popup answered never happens and there is no dialog to dismiss or buy from.
- **V2 today:** `index.html?start=worker&credits=0`, type in the composer, press Send. Width 300, radius 12, its own scrim rgba(15,23,42,0.5) at z 130, backdrop click only, no role, focus never moves in (byok.jsx:78-80); a gradient 38/800 zero (byok.jsx:51); an unlabelled 22px (i) "What are credits?" (credits_popup_parts.jsx:94); "You’ve used all of today’s AI credits." / "Credits will be refreshed in **6h 42m**." (byok.jsx:65-66).
- **Where its parts went:** the time and the day line to the composer notice (below); the explainer to the AI credits screen (section 66), which reads `V2Kit.OOC_COPY.explain`; the refreshed moment to the AI credits screen's success banner.
- **Do / Don't:** Do lock the field before anyone types. Don't reveal zero only after Send. Don't add a top-up or "earn credits" action.

**Proposed copy (day line, pending D6):** covered "Today’s run isn’t affected." / waiting "Today’s run starts once they’re back, so today can still count." / stopped "Today won’t count toward your 20 days." The PM confirms whether a run stopped for credits loses the day.

**Explainer (proposed):** "Your daily run and your chats use AI credits. You get a fresh set every day, enough for today’s run with room to chat." (`OOC_COPY.explain`), built around the daily run rather than a count of jobs: V2's approved line, "enough for 4 to 5 jobs" (credits_popup_parts.jsx:105), was written beside a 2,500 grant and holds at 2,000 only while a job costs 400 or less.

### Zero-credits notice and run end (New)
- **Purpose:** Say zero before anyone types, and close a run that stopped for credits, with the same time and the day status.
- **Anatomy:** Composer variant: `V2Kit.ComposerNotice` tone neutral, clock 16, "Out of AI credits until **5:30 am tomorrow**." + day line. This section owns the zero-credits wording (`V2Kit.OOC_COPY`); the composer (38), RunCard (36) and the guide read it. Run variant: x-circle 16 in `--v2-danger-ink`, day line 13/500 ink, then "AI credits refresh at 5:30 am tomorrow." 12 ink-4, a fixed local time, never a ticking countdown. In Chat each fact is said once: the run's end carries the day line only (`OOC_COPY.day`), the notice says until when, and the locked field's placeholder is neutral ("You can’t send messages right now").
- **Variants:** `composer`, `run` (RunCard's out-of-credits end, section 36).
- **Sizes:** Full width of the composer or the card.
- **States:** Composer, run covered; composer, run still to come; run ended for credits. V2: Preview row "Scheduled job: Out of credits" (chat tab, signed in) plays the run that dies; its placeholder says "BlueAI is out of credits until tomorrow..." (chat_product.jsx:278).
- **Props:** `variant`, `refillAt`, `now`, `dayStatus`, `className`. Strings on `V2Kit.OOC_COPY` so RunCard and screens say exactly the same thing.
- **Motion:** None.
- **Accessibility:** role=status; the time is text in local time, not only a countdown.
- **Responsive:** Wraps to two lines in the 387px content width.
- **Do / Don't:** Do show the notice when the composer mounts at zero. Don't let the field accept a message the product will refuse. Don't say "tomorrow" without the time.
