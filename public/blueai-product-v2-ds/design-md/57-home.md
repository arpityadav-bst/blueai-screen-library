## 57 Home (Today)

**Status:** Changed from V2 (Home and the Chat screen reached from it).

**Why:** the partner opens BlueAI to check one thing: is my worker on, did today happen, did the days count, is anything waiting for me. V2's home is the chat's empty state: 'Hi, Alex' with an emoji and "You're all set. The BlueAI worker is all it takes to start earning." above a coach that says 'Run this to begin' (`chat_product.jsx:204-213`); the progress strip shows only for a returning partner (`moneymaker_home.jsx:120`) and counts from a constant (`worker_day_done.jsx:39`); the next run time is typed into the copy. The chat itself unmounts on any other tab (`index.html:965`), taking a waiting job or a Retry with it.

### Home

- **Purpose:** today at a glance, answered from the Worker record (section 41), with the one action that matters now.
- **Anatomy:** inside `ScreenFrame` (AppFrame + TopBar + BottomNav, Home lit). ScreenHeader as the greeting: 'Hi, Alex' (the account's first name; 'Today' when there is none; no emoji, no second line). Then `.v2-screen-body` (padding 16 16 24, blocks 12 apart, the only part that scrolls): ProgramStrip (section 43), a Banner only for a program fact the card cannot say, WorkerCard (section 42), and one standalone Link 'Chat with BlueAI' (13/500, 32 target, left aligned). The top bar's run chip and credits come from `topBarProps(record)`: 'Next run 11 am', 'Running', 'Needs you', 'Day 7 of 20', 'Didn’t finish', 'Paused', 'Offline', 'Waiting for credits', 'All 20 days'.
- **Variants:** one screen; the content changes with the record. The only Banner: info, '20 days are out of reach' + '8 days done and 9 days left before Nov 1.' (proposed; no money until decision D3).
- **Sizes:** window 419 x 830, compact 640 (bars pinned, body scrolls). Content column 387.
- **States (`state` prop, or derived from `worker`):** new (day 0: Set up card, coach mark under a dim scrim over the whole window), returning before today's run ('Next run today at 11 am.', Run now secondary), running (live step), waiting for you (deadline and cost, Review job primary), done today pending (one tick, no second Run), failed today (reason, Try again by 9 pm), paused, out of credits (refresh time), offline (what happens to today), program complete (Earnings), out of reach (the banner), loading (the worker-home skeleton: a title, the strip card, the worker card; never V2's five-card skill list, `chat_product.jsx:222`).
- **Props:** `worker`, `state`, `loading`, `coaching` (force the coach on or off), `onNavigate(id)` (ids: `activity` from See why, `today` from Details and the run chip, `chat` from Review job, Try again and the link, `credits`, `notifications`, `account`, `report`, `sign-out`), `onRun`, `onRetry`, `onResume`, `onDismissCoach`, `compact`, `landmark` (false in specimens), `frame` (false: content only).
- **Motion:** none of its own. The coach mark rises once (section 42); skeleton shimmer stops under reduced motion.
- **Accessibility:** the greeting is the screen's h1 and the focus target when the app returns to Home; the coach scrim is decorative (aria-hidden) and Okay, a scrim click or Run dismisses it; dismissal is stored on the record (`coachSeen`), never local state (`moneymaker_home.jsx:105`). Loading is `aria-busy` with a 'Loading your worker' status.
- **Responsive:** at 640 the header and bars stay put and the column scrolls; nothing reflows sideways.
- **Do / Don't:** Do read every number and time from the record; keep one card with one action; use the banner only while a program fact holds. Don't add a second greeting line that repeats the card; don't hide the strip until the partner has been back once; don't make Home the chat.

### Chat (from Home)

- **Purpose:** the thread as a window onto the same Worker record; leaving it loses nothing.
- **Anatomy:** ScreenHeader 'Chat' with Back (to Home) and a 32px IconButton 'New chat' (plus), moved out of V2's top bar (`index.html:341-346`). Thread (section 34) filling the height; today's run as one RunCard (section 36); a question as an AskCard (section 37); Composer (section 38) on the bottom edge with its notice slot. Home stays lit in the nav.
- **Variants:** the job ask keeps the PM's words exactly: 'Paid job available', 'Watch the video and provide feedback.', 'Want me to take this one?', answers 'Yes, switch to Automatic' / 'Just this job' / 'Not now' (`worker_flow.jsx:50-51, 120-121`), plus the cost under the chips before the tap: 'Not now: Today won’t count toward your 20 days.' (proposed, R06).
- **Sizes:** as Home. Bubbles max 300 (section 35).
- **States:** empty (EmptyState 'Chat with BlueAI' / 'Ask about today’s run, or tell your worker what to change.'), running (field read-only, Send becomes Stop), waiting (the ask, Stop asks first), done (run card + See run details), out of credits (OutOfCreditsNotice above a locked field 'Out of AI credits until 5:30 am'), Automatic on (ComposerNotice info: 'Automatic is on for YouTube. BlueAI takes paid YouTube jobs without asking.' + 'Change', V2's ribbon words, `agent_permissions.jsx:197-198`).
- **Props:** `worker`, `state`, `steps` (renderMessage shape), `onBack`, `onNewChat`, `onSend`, `onStop`, `onAnswer`, `onChangeMode`, `onOpenRun`, `onOpenCredits`, `onNavigate`, `compact`, `landmark`, `frame`.
- **Motion:** the thread's own (smooth jump to latest, none under reduced motion).
- **Accessibility:** the thread is a polite log; New chat and Back are labelled icon buttons at 32; the notice is tied to the field with aria-describedby.
- **Responsive:** the thread takes the height left between header and composer; the composer grows to 6 lines, then scrolls.
- **Do / Don't:** Do show a run as one card that updates in place; say what an answer costs before the tap; put a condition that holds before typing in the notice slot. Don't make the chat the only record of a run; don't put New chat in the top bar; don't let the partner type a message credits will refuse.
