## 59 Run detail

**Status:** New.

**Why:** the worker acts on the partner's own YouTube account while nobody watches. In V2 the only record of a run is the chat thread, step by step as bubbles (`chat_product.jsx:159`), gone when another tab opens; the comment it posts under the partner's name is never shown ('Leaving a comment…', `worker_flow.jsx:136`); nothing says when a day was checked or why it did not count.

### RunDetail

- **Purpose:** what the worker did in one run, the job and its exact comment, whether the day counted, and the credits it used.
- **Anatomy:** pushed over Activity (also opened from Home's Details and the run chip); Activity stays lit. ScreenHeader 'Run details' with Back. Body (padding 16 16 24, 12 apart): RunCard (section 36) full width, steps open, no day line; JobPreviewCard receipt (section 45) when a paid job ran: video, channel, what was done, the exact comment; Verification card (radius 16, 1px line, padding 16): title 'Verification' 14/600, StatusTick 16 with its word, one sentence 13 ink-2, and on a rejected day 'Report a problem' (secondary md); Details card (padding none): 'Job mode' ('Always ask' / 'Automatic · YouTube') and, for a paid job, 'AI credits used' (360); a standalone Link 'Report a problem' under every run that was not rejected.
- **Variants:** the RunCard title says which run: 'Today’s run', 'Oct 11 run'. The day is said once, in Verification.
- **Sizes:** window 419 x 830 or 640; cards full column width (387).
- **States:** job done ('Pending verification' / 'We check every run within a day. One tick while pending, two once verified.'), no job (RunCard 'No paid job on the board today.', pending), skipped ('Not counted' / 'Today doesn’t count toward your 20 days.'), failed (RunCard reason 'App Player closed during the job.' + Try again; 'Not counted yet' / 'Try again by 9 pm to count the day.'), stopped (Run again; not counted), pending past a day ('Still checking' / 'This one is taking longer than a day. There is nothing to do; the day counts once it’s verified.'), verified ('Checked Oct 12, 7:02 am. Day 6 of 20 counts.'), rejected (reason in danger ink + Report a problem). Copy is proposed except the V2 lines cited.
- **Props:** `worker`, `state` (RUN_STATES), `run` overrides {card, title, job, verify, text, checkedAt, reason, day}, `onBack`, `onRetry`, `onRunAgain`, `onReport`, `onChangeMode`, `onOpenCredits`, `onNavigate`, `compact`, `landmark`, `frame`.
- **Motion:** none of its own; the RunCard's disclosure follows the global reduced-motion rule.
- **Accessibility:** Verification and Details are labelled sections; the tick is always paired with its word; the rejected reason uses danger ink at 5.4:1 on white; every action is 32 or taller.
- **Responsive:** at 640 the header stays and the cards scroll.
- **Do / Don't:** Do say the day once, with the reason when it did not count; show the exact comment that went out; keep the run after the chat moves on. Don't repeat the day line in the RunCard; don't drop Report a problem from runs that counted; don't show money before decision D3.
- **Known gap:** JobPreviewCard's receipt always offers 'Ask me first next time'; on an Always ask run it should not render (kit, section 45).
