## 48 Out of credits

**Status:** Changed from V2 (OutOfCreditsDialog); New (zero-credits notice and run end).
**Why:** Every zero-balance moment must say the same time and what zero means for today's day (R14). In V2 the popup counts down (byok.jsx:66) while the chat says "refreshed tomorrow" twice (chat_bubbles.jsx:188, 189), the main chat reveals zero only after Send (chat_product.jsx:124), and nothing says whether the day still counts. The popup's copy is right and stays; its chrome joins the one Dialog.

### OutOfCreditsDialog (Changed from V2)
- **Purpose:** Stop a send at zero, say when credits return, what today means, and what credits are. Dismiss only: there is nothing to buy.
- **Anatomy:** `V2Kit.Dialog` variant task, size sm (320): header title "Out of credits" 20/600 with the close button; body left-aligned: credits glyph 24 + "0" 40/600 ink (tracking -0.03em); V2's two lines 13 ink-2, kept word for word: "You’ve used all of today’s AI credits." / "Credits will be refreshed in **6h 42m**." (countdown 600 ink, nowrap); the day line 13/500 ink (Proposed copy); "What are AI credits?" trigger (info 16 + 13/500 ink-3, 32px target) opening `V2Kit.Tooltip` kind info with V2's explainer and Learn more; actions: Got it, primary, full width, 44.
- **Variants:** Out of credits; refreshed: title "New credits are here", "2,000", "You have 2,000 AI credits for today." (copy from the unshipped comparison page, credits_popup_options.jsx:29-30).
- **Sizes:** Dialog sm only.
- **States:** Open (6h 42m); countdown under a minute ("42s"); refreshed (the countdown reached zero while open). V2: `index.html?start=worker&credits=0`, type in the composer, press Send. V2 has no refreshed state and no keyboard handling.
- **Props:** `open`, `onClose`, `refillAt` (default next 00:00 UTC), `now`, `dayStatus` ('covered' | 'waiting' | 'stopped', from the Worker record), `grant`, `preview` (guide only), `className`.
- **Motion:** The Dialog's own: scale-in 320ms, exit 240ms, none under reduced motion.
- **Accessibility:** role=dialog, aria-modal, focus moves to Got it and returns to the opener; Esc, the close button and the scrim close it. The (i) has a visible name instead of a 22px bare icon. 13px ink-2 body 10.6:1.
- **Responsive:** 320 wide inside the 419 window; the overlay is absolute against AppFrame, never the page.
- **Do / Don't:** Do keep V2's two lines exactly. Do state the day line from the Worker record. Don't add a top-up or "earn credits" action. Don't paint the 0 in the gradient.

**Proposed copy (day line, pending D6):** covered "Today’s run isn’t affected." / waiting "Today’s run can’t start until then." / stopped "Today’s run stopped, so today won’t count." The PM confirms whether a run stopped for credits loses the day.

**Explainer:** "BlueAI runs on credits. Every job and chat uses some. You get limited credits each day, enough for 4 to 5 jobs." (credits_popup_parts.jsx:105, PM approved). It was written beside a 2,500 grant; at 2,000 it holds while a job costs 400 or less (fixture 360). PM to confirm.

### Zero-credits notice and run end (New)
- **Purpose:** Say zero before anyone types, and close a run that stopped for credits, with the same time and the day status.
- **Anatomy:** Composer variant: `V2Kit.ComposerNotice` tone neutral, clock 16, "Out of AI credits until **5:30 am tomorrow**." + day line. Run variant: x-circle 16 in `--v2-danger-ink`, day line 13/500 ink, then "AI credits refresh at 5:30 am tomorrow, in 6h 42m." 12 ink-4.
- **Variants:** `composer`, `run` (RunCard's out-of-credits end, section 36).
- **Sizes:** Full width of the composer or the card.
- **States:** Composer, run covered; composer, run still to come; run ended for credits. V2: Preview row "Scheduled job: Out of credits" (chat tab, signed in) plays the run that dies; its placeholder says "BlueAI is out of credits until tomorrow..." (chat_product.jsx:278).
- **Props:** `variant`, `refillAt`, `now`, `dayStatus`, `className`. Strings on `V2Kit.OOC_COPY` so RunCard and screens say exactly the same thing.
- **Motion:** None.
- **Accessibility:** role=status; the time is text in local time, not only a countdown.
- **Responsive:** Wraps to two lines in the 387px content width.
- **Do / Don't:** Do show the notice when the composer mounts at zero. Don't let the field accept a message the product will refuse. Don't say "tomorrow" without the time.
