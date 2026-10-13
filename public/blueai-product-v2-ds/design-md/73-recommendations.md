## 73 Recommendations for V2

**Status:** Meta (no parts).

**Why:** Every difference between V2 today and the system, as the order to fix V2 in. The system’s sections show the fixed version. Each recommendation’s first V2 location, and every V2 string its "today" quotes exactly, is proved by `guide/refs/compose.js` (ids `compose.rNN.*`) through `tools/ds-check.js`.

- **P1:** breaks the concept, or costs a partner a day, money or control. Fix before the next iteration ships.
- **P2:** makes the product read as several systems, or hides the next action. Fix as screens are touched.
- **P3:** clean-up and polish: dead code, copy drift, review tooling.
- **Effort:** S is one part or one file; M touches several parts or a screen; L changes how state flows through the app.

**Do these first:** R01 (one Worker record, so nothing a partner opens can lose today’s run), R02 (one ledger for the day count), R07 (show the job, channel and exact comment before the partner agrees), R08 (a waiting job tells the partner, with a deadline), R03 (Sign out signs out).

### P1 (20)

#### R01 worker (effort L)

- **V2:** `index.html:965-981; blueai/chat_product.jsx:33, 79`
- **Today:** Opening Credits, History, Profile or any tab unmounts ChatScreen; the run, a waiting job ask, a failed-day Retry and today's result are lost.
- **Recommended:** Own the worker's day in one Worker record above the views; the chat, home card, RunCard and toast read it.
- **Why:** The product is an unattended daily worker; its state must outlive any screen (P1).

#### R02 worker (effort M)

- **V2:** `blueai/worker_day_done.jsx:40, 163; blueai/worker_flow.jsx:42, 168`
- **Today:** DONE_BEFORE=6 makes tonight's popup 'Day 7 of 20' and tomorrow's strip 'Day 6 of 20'; the strip appears right after Day 1 claiming 'Yesterday’s run verified.'
- **Recommended:** One ledger (verified, pending, missed, rejected days; target; ends Nov 1) feeding overlay, strip, toast, Activity and the site tile.
- **Why:** The day count is the partner's pay.

#### R03 shell (effort S)

- **V2:** `index.html:1010`
- **Today:** Logout confirm closes the modal and returns to chat; the partner stays signed in.
- **Recommended:** Confirm signs out, pauses the worker (say so in the confirm) and lands on the signed-out Welcome.
- **Why:** A destructive confirm that does nothing is a broken promise and a dead end for switching accounts.

#### R04 navigation (effort M)

- **V2:** `blueai/shared.jsx:222; blueai/jobs.jsx:140-142; index.html:375`
- **Today:** The first tab, Jobs, is 'Coming Soon'; Schedule shows Coin Master samples (schedule.jsx:5-8); the kebab's Chat History lists past chat sessions.
- **Recommended:** Nav = Home, Activity (run and verification log), Settings; Jobs and Schedule retire (the run window moves to Worker settings), and so does Chat History: runs live in Activity and the chat is one thread opened from Home.
- **Why:** Two of four tabs say nothing about the only thing a partner is here for, and a list of past chats is a second, weaker record of the runs Activity keeps.

#### R05 worker (effort M)

- **V2:** `blueai/settings.jsx:11-20, 144-159; blueai/worker_flow.jsx:67; blueai/agent_permissions.jsx:188`
- **Today:** 'Pause, stop, or disconnect anytime' has no control; 'turn this off anytime' has one since 2026-10-14, the Worker card in Settings (one switch per app). V2 adopted the minimal consent dialog on 2026-10-14 (title, one paragraph, Cancel / I agree, turn on), and it still makes the promise.
- **Recommended:** Settings > Worker (pause until, run window, mode per app, interest profile) and Connected apps (Disconnect).
- **Why:** Consent that cannot be found to revoke is weak consent (P4).

#### R06 worker (effort S)

- **V2:** `blueai/worker_flow.jsx:121, 149; blueai/worker_day_done.jsx:118`
- **Today:** 'Not now' on the job ask forfeits the day; the cost is told afterwards.
- **Recommended:** State the cost on the option ('Skip: today won’t count') or keep the job open until 9 pm, the day's deadline (section 41), with Undo. Decision D14.
- **Why:** Learning the cost after the click feels like a trap (P3).

#### R07 worker (effort M)

- **V2:** `blueai/worker_flow.jsx:49-52, 117-121, 136`
- **Today:** The ask shows only 'Watch the video and provide feedback.'; the comment posted under the partner's name is never shown; first chip bundles 'Yes' with switching to Automatic.
- **Recommended:** JobPreviewCard: video, channel, actions, exact comment text, consequence; primary 'Take this job', Automatic as a quiet link. Whether it replaces V2's AskCard for paid jobs is decision D17.
- **Why:** The riskiest moment in the product is agreeing blind to a public comment.

#### R08 notifications (effort M)

- **V2:** `blueai/chat_product.jsx:91-99; blueai/worker_day_done.jsx:191-205`
- **Today:** An unattended Always ask run waits forever behind a 7-flash taskbar cue; no toast, no expiry.
- **Recommended:** Windows notification 'A paid YouTube job is waiting for your OK' with the deadline; at the 9 pm deadline the run closes with outcome expired and the day with status notcounted (section 41; skipped means the partner declined); inbox entry.
- **Why:** Always ask is the default, so most partners would lose days silently.

#### R09 foundations (effort S)

- **V2:** `index.html:25, 351; blueai/credits_popup_parts.jsx:110`
- **Today:** White on #1990FF is 3.24:1 on every primary button; #1990FF links 3.24:1.
- **Recommended:** --v2-action #1268f0 for fills (4.92:1), --v2-blue-ink #0d5ad6 for blue text, --v2-blue #156efe for marks and focus.
- **Why:** Consent and Run are the least legible words on screen today (P7).

#### R10 foundations (effort S)

- **V2:** `blueai/chat_bubbles.jsx:124; blueai/account_gate.jsx:31; blueai/login.jsx:242; blueai/worker_day_done.jsx:147`
- **Today:** Caveats ('App Player will be signed out too.', 'We check every run within a day…', 'Working on it…') at 2.15 to 2.56:1.
- **Recommended:** ink-3 for anything the partner must read, ink-4 #6e737c (4.77:1) for pure meta; no warm link colour.
- **Why:** Unreadable caveats are not disclosure.

#### R11 copy (effort S)

- **V2:** `blueai/worker_flow.jsx:67 vs 76-78; blueai/worker_flow.jsx:46`
- **Today:** 'I only run a paid job after you say yes to that specific job.' then the same onboarding offers Automatic; PLAN step 2 promises 'a quick approval'.
- **Recommended:** Decision D15 for the PM (kept live by his call, worker_flow.jsx:18): a bullet that holds in both modes, for example 'You choose: I can ask before each paid job, or take them on my own. You can change this anytime in Settings.'
- **Why:** The first promise about the partner's account is broken minutes later.

#### R12 worker (effort S)

- **V2:** `blueai/worker_flow.jsx:171; blueai/worker_day_done.jsx:38`
- **Today:** The money rule (20 days, verification, end Nov 1, cash out) is never stated before the first day-done overlay; RULE.programEnd is never shown.
- **Recommended:** ProgramSummary in the onboarding close and behind an info tip on the strip; show 'Ends Nov 1' beside the count on the ProgramStrip (Home, Activity). The day-done moment keeps its bar without the date: it says the count once and nothing else (section 44).
- **Why:** Partners cannot plan around rules they have not been told.

#### R13 worker (effort M)

- **V2:** `blueai/needs_bluestacks.jsx:40; blueai/chat_product.jsx:64-66, 129-135; blueai/moneymaker_home.jsx:70`
- **Today:** The worker never checks for BlueStacks or App Player although the bare URL has neither and the copy narrates App Player.
- **Recommended:** Worker preflight: BlueStacks installed (DependencyCard), App Player signed in, YouTube linked, before every run.
- **Why:** The worker claims to drive an app that is not installed, then blames it.

#### R14 credits (effort M)

- **V2:** `index.html:730; blueai/credits_popup_parts.jsx:14, 105; blueai/login.jsx:160-167; blueai/chat_bubbles.jsx:188-189`
- **Today:** Grant 2000 vs 2500 vs 500 vs 300; 'enough for 4 to 5 jobs' vs '~10 tasks'; 'refreshed tomorrow' vs a countdown; nothing says whether a credits-dead run costs the day; a chat can spend the credits the paid run needs.
- **Recommended:** One DAILY_GRANT; one explainer sentence; countdown everywhere in local time; reserve credits for the worker's run or warn before chat dips into them (decision D6); every zero message states the day status.
- **Why:** Credits are the fuel for income; conflicting numbers make the meter untrustworthy.

#### R15 notifications (effort M)

- **V2:** `blueai/worker_day_done.jsx:188; index.html:1065, 780-787`
- **Today:** 'Open BlueAI to retry and count the day.' opens a cold-started home with no Retry.
- **Recommended:** Toast opens the persistent Today record; Retry lives on the WorkerCard and in Activity until 9 pm, the day's deadline (section 41), stated with it.
- **Why:** This is the exact moment money is at stake.

#### R16 settings (effort S)

- **V2:** `blueai/settings.jsx:30-32; index.html:268-272`
- **Today:** 'Connected to BlueStacks App Player' shows even when BlueStacks is not installed.
- **Recommended:** Bind the card to the real state: not installed (Get BlueStacks), installed and signed out (Open App Player), connected as {account}.
- **Why:** False status sits where a partner debugs a failed day.

#### R17 shell (effort M)

- **V2:** `index.html:943, 562-564, 1056`
- **Today:** Close unmounts the app; Minimize does nothing; no tray.
- **Recommended:** Close hides to tray (first-time notice with next run time), Minimize works, tray menu shows run state and Quit warns.
- **Why:** A worker that runs when nobody is watching cannot stop when its window closes.

#### R18 consent (effort M)

- **V2:** `blueai/worker_flow.jsx:80-82, 161`
- **Today:** Watch history, subscriptions and channel stats are read without being asked.
- **Recommended:** PermissionRequest card in onboarding (decision D16) and a Revoke row in Connected apps; list the interest profile under Account and privacy.
- **Why:** Reading viewing data is a separate permission from 'use your account like a fan'.

#### R19 worker (effort M)

- **V2:** `blueai/worker_day_done.jsx:54, 63-69, 73-83`
- **Today:** Verification has only pending and verified; a rejected day looks pending forever.
- **Recommended:** StatusTick and DayBar gain rejected (with reason), not counted and late; Activity row offers Report a problem.
- **Why:** The two-tick model implies a day can fail; the partner needs to know and dispute.

#### R51 consent (effort S)

- **V2:** `blueai/agent_permissions.jsx:188`
- **Today:** The Automatic consent says the worker will finish jobs 'including posting videos'; the worker never posts videos, and the comment it does post in the partner's name is not named. V2 adopted the minimal consent dialog on 2026-10-14 (title, one paragraph, Cancel / I agree, turn on), which dropped 'and other content' but kept 'posting videos'.
- **Recommended:** Name what a job does, from `WORKER_JOB.actions`: 'BlueAI will take YouTube jobs and do them on your account without asking first: watching, liking and posting comments in your name.' (section 46). Consent copy, so the PM and legal decide it; the record keeps the version shown (section 53).
- **Why:** On Automatic the job preview never appears, so this line is the partner's only notice that comments go out under their name.

### P2 (21)

#### R20 foundations (effort S)

- **V2:** `index.html:10-20, 34`
- **Today:** Body stack puts -apple-system first (Mac shows SF Pro); four typefaces in the first minute; weights 650/750/900 requested but not loaded.
- **Recommended:** Inter first in the stack, weights 400/500/600 (decision D11 if the PM prefers Plus Jakarta Sans).
- **Why:** Reviewers and partners see different products; one face reads as one family.

#### R21 foundations (effort M)

- **V2:** `blueai/chat_bubbles.jsx:30; blueai/settings.jsx:25; blueai/shared.jsx:300`
- **Today:** 154 shadow declarations, 15 coloured glows (user bubble 30% indigo).
- **Recommended:** In-flow surfaces: 1px line, no shadow; shadow-1 for floats, shadow-2 for dialogs.
- **Why:** Quiet surfaces let the next action stand out and match the site (P5, P6).

#### R22 shell (effort S)

- **V2:** `blueai/shared.jsx:305; blueai/login.jsx:256; blueai/settings.jsx:73`
- **Today:** Indigo #4f46e5 on nav active, sign-in spinner, Telegram code; blue elsewhere.
- **Recommended:** One accent: nav active = 2px blue indicator + ink label.
- **Why:** Selected and primary read as two systems.

#### R23 foundations (effort S)

- **V2:** `index.html:335, 342-346`
- **Today:** Gradient on wordmark, pill ring, pill number, balance numeral, bubbles, borders.
- **Recommended:** Gradient only on the mark and the credits glyph; numbers in ink.
- **Why:** Brand identity, not a UI fill.

#### R24 components (effort M)

- **V2:** `blueai/shared.jsx:57-82; blueai/profile.jsx:69-84; blueai/byok.jsx:76-89; blueai/worker_day_done.jsx:142`
- **Today:** Seven overlay builds, seven scrims, five widths, z tie at 120, no focus management.
- **Recommended:** One Dialog and one Sheet on one scrim and the named z-scale, with role, focus in, trap, return and a busy state.
- **Why:** Keyboard users act on content under the scrim; each dialog looks like another product.

#### R25 components (effort S)

- **V2:** `index.html:289-301, 359, 370`
- **Today:** Header menus close only on outside mousedown; no role, Esc, arrows or aria-expanded.
- **Recommended:** Menu component with role=menu, aria-haspopup, aria-expanded, arrows, Esc and focus return.
- **Why:** The only route to Earnings and Sign out is mouse-only.

#### R26 infrastructure (effort S)

- **V2:** `index.html:24; blueai/worker_cards.jsx:28, 49`
- **Today:** Unpinned Tailwind CDN used for one unreachable class; its preflight hides the Plan card's numbers and AskBubble bullets.
- **Recommended:** Remove Tailwind; add the explicit reset in kit/base.css with list markers on.
- **Why:** An unpinned script can change base styles any day.

#### R27 motion (effort S)

- **V2:** `index.html:63-112; blueai/moneymaker_home.jsx:122`
- **Today:** Reduced motion honoured in 4 components; border spin (which cannot animate), shimmer, bounce run for everyone (the day-done ring went with the minimal popup, 2026-10-14).
- **Recommended:** One global reduced-motion rule; remove the border spin.
- **Why:** Perpetual motion on the screens partners sit on.

#### R28 worker (effort S)

- **V2:** `blueai/worker_day_done.jsx:132-151`
- **Today:** V2 adopted the minimal popup on 2026-10-14 (one tick, title, one status line, Got it): the count is said once, no confetti, no ring, money in grey. Still open: the 44 badge is verified green while the day is pending.
- **Recommended:** Keep it minimal; badge in pending treatment (blue tint, one tick) until verified.
- **Why:** Colour says paid while words say not yet.

#### R29 copy (effort S)

- **V2:** `index.html:329; blueai/worker_day_done.jsx:169`
- **Today:** Kebab Earnings and strip 'Earnings ↗' go to two different URLs.
- **Recommended:** One EARNINGS_URL constant; one external glyph.
- **Why:** The partner's money lives behind this link.

#### R30 settings (effort S)

- **V2:** `blueai/byok_settings.jsx:54, 64, 74, 93`
- **Today:** Switching own key off deletes the key; Validate & Save makes up a key when empty; key in clear text; Remove and Unlink never confirm.
- **Recommended:** Switch only enables; Remove confirms or offers Undo; validating, invalid and unreachable states; secret field.
- **Why:** A switch reads as reversible.

#### R31 settings (effort M)

- **V2:** `blueai/settings.jsx:120-134; blueai/byok_settings.jsx:78; blueai/ai_mode.jsx:176-187`
- **Today:** Max Output Tokens, Max Steps, Timeout, VLM endpoint and two AI Model pickers lead the screen.
- **Recommended:** Partner sections first; developer controls under one Advanced disclosure with one model picker; 'tokens' becomes 'AI credits'.
- **Why:** Developer knobs signal 'not for you' and invite misconfiguration.

#### R32 chat (effort S)

- **V2:** `blueai/chat_product.jsx:78, 124, 284`
- **Today:** Composer clips at 120px with overflow hidden; zero credits revealed only after Send.
- **Recommended:** Scroll past the cap; ComposerNotice shows zero credits and refresh time before typing.
- **Why:** Work typed and then refused feels wasted.

#### R33 chat (effort M)

- **V2:** `blueai/worker_flow.jsx:88-94, 102-112; blueai/chat_product.jsx:161`
- **Today:** A daily run prints 6 to 15 status bubbles.
- **Recommended:** RunCard: live step, collapsed steps, outcome and day status.
- **Why:** The answer to 'did today count' is buried.

#### R34 shell (effort S)

- **V2:** `index.html:364-365`
- **Today:** FAQ and Report Issue only close the menu.
- **Recommended:** FAQ opens the site article; Report a problem opens a sheet prefilled from the last run.
- **Why:** Help is the escape hatch when a day or payout looks wrong.

#### R35 chat (effort S)

- **V2:** `blueai/chat_bubbles.jsx:15; blueai/chat_product.jsx:213`
- **Today:** Every user bubble shows 'Jun 12, 2026, 11:03 AM'; 'Your next run is at 11 am.' whatever was chosen.
- **Recommended:** Real times and day separators; greeting reads the saved run window.
- **Why:** Times decide when the worker acts on the account.

#### R36 shell (effort S)

- **V2:** `blueai/boot_splash.jsx:25, 80-114; index.html:745, 780-787`
- **Today:** 'Loading your skills…'; five-card skeleton collapses to one card; 3.5s splash on every window open.
- **Recommended:** Worker-true copy, worker-home skeleton, splash on true cold start only.
- **Why:** The first words on every launch name a hidden feature.

#### R37 shell (effort S)

- **V2:** `index.html:351`
- **Today:** The loudest header control is New Chat; run state is nowhere in the chrome.
- **Recommended:** WorkerStatusChip in the top bar; New chat moves into the chat screen header as an icon.
- **Why:** The partner opens the app to check today's run.

#### R38 navigation (effort S)

- **V2:** `index.html:966, 970, 992`
- **Today:** Kebab screens (Profile, AI Credits) have no Back and light no tab.
- **Recommended:** ScreenHeader with Back; pushed screens keep the parent tab lit.
- **Why:** The partner loses their place.

#### R39 copy (effort S)

- **V2:** `blueai/profile.jsx:8-10; blueai/chat_product.jsx:206; blueai/signin_page.jsx:26; blueai/worker_flow.jsx:71`
- **Today:** Three identities for one partner, including a real staff member's details in Profile.
- **Recommended:** One neutral fixture account everywhere; no real staff data in prototypes.
- **Why:** The gate's whole point is 'use the account you applied with'.

#### R40 worker (effort S)

- **V2:** `blueai/agent_permissions.jsx:55-57, 98-116`
- **Today:** Instagram can be switched to Automatic and consented to before Instagram jobs exist.
- **Recommended:** Coming soon row with no switch; consent only when the app goes live and is connected.
- **Why:** Consent to automation on an unused account is meaningless.

### P3 (10)

#### R41 cleanup (effort M)

- **V2:** `index.html:991; blueai/credits_widget.jsx; blueai/skills.jsx; blueai/shared.jsx:84-298; blueai/chat.jsx; tweaks-panel.jsx; blueai/login.jsx:88-223; blueai/product_home.jsx; blueai/onboarding.jsx; blueai/chat_compare.jsx`
- **Today:** About 3,000 lines unreachable; the hidden earn-credits sheet leaves invisible focus stops and writes localStorage.
- **Recommended:** Delete them (move IntroCard and ChatCatIcon into the chat module first); retire the Onboarding and Default sessions.
- **Why:** The PM cannot tell which screens are real; dead copy contradicts the credit model.

#### R42 screens (effort M)

- **V2:** `blueai/moneymaker.jsx:96-205; blueai/moneymaker_backdrop.jsx; blueai/moneymaker_logo.jsx`
- **Today:** Welcome on creator-brand theme (Space Grotesk, gradient CTA, grid, orbs, grain, cursor morph, 5.9s intro); Terms link does nothing.
- **Recommended:** Welcome on site DNA (Welcome screen) with the PM's two-step copy; Terms link opens the terms.
- **Why:** Three visual families in the first minute.

#### R43 copy (effort S)

- **V2:** `index.html:598`
- **Today:** Install dialog pitches 'finds deals, claims rewards'.
- **Recommended:** Worker pitch in BlueStacks' visual voice, or drop Flow A (decision D9).
- **Why:** First description of BlueAI on that path describes another product.

#### R44 copy (effort S)

- **V2:** `index.html:378; blueai/profile.jsx:62, 75-79; blueai/chat_product.jsx:266, 278; blueai/worker_flow.jsx:63-64; blueai/worker_cards.jsx:31`
- **Today:** Logout / Sign out / logging in; '...' vs '…'; 'Loading BlueAI Worker v57 skill…', 'Suggested skill: blueai-worker'; 'Let’s set up your BlueAI Worker.'; emoji in headings.
- **Recommended:** Glossary (Sign in, Sign out); the … character; no version or slug strings in partner copy (PM copy, flagged); 'BlueAI Worker' becomes 'BlueAI worker' (`worker_flow.jsx:64`); no emoji in headings.
- **Why:** Small drift makes the product read unfinished.

#### R45 shell (effort M)

- **V2:** `product-scene.css:71-76; blueai/shared.jsx:73; blueai/jobs.jsx:130`
- **Today:** Fixed 866px window; vh units inside it.
- **Recommended:** Compact rule (content 640 min, scrolls, bars pinned); size against the frame, not the viewport.
- **Why:** 1366x768 laptops cut off the composer and nav.

#### R46 review (effort S)

- **V2:** `index.html:753-775, 271, 723, 748`
- **Today:** Copy link omits credits, ask, terms, session, chat states, own key, hardware; three params only work in combination.
- **Recommended:** Copy link carries every state; each param self-sufficient (?bai=0 implies ?bs=1).
- **Why:** Review links open on the wrong state.

#### R47 copy (effort S)

- **V2:** `blueai/site_signin.jsx:27, 42; blueai/login.jsx:270-271`
- **Today:** Site gate says 'Sign in to start your application.' to accepted partners; its legal line says 'agree to … Privacy Policy' (legal rejected that wording); first sign-in says 'Welcome back!'.
- **Recommended:** App variant 'Sign in to continue to BlueAI.'; legal line aligned with the terms sheet (PM and legal); success auto-advances.
- **Why:** Mis-describes where the partner is; legally weaker wording.

#### R48 foundations (effort S)

- **V2:** `index.html:58-61, 984`
- **Today:** Grey #e2e8f0 scrollbar rail, two definitions.
- **Recommended:** Transparent track, one token set for both engines.
- **Why:** Visual noise beside every white column.

#### R49 sign-in (effort S)

- **V2:** `blueai/login.jsx:242-247`
- **Today:** 'Not seeing the browser tab?' (amber, 2.15:1) and 'Try again' do the same thing.
- **Recommended:** One action 'Open the browser again'.
- **Why:** Duplicate choices slow the decision.

#### R50 cleanup (effort S)

- **V2:** `blueai/schedule.jsx:10-17, 59, 137; blueai/jobs.jsx:43, 86`
- **Today:** 'Weekly ()', no-op Edit, BCX crypto rewards.
- **Recommended:** Remove with the Jobs and Schedule tabs (R04).
- **Why:** Inert controls teach that the app is unreliable; BCX contradicts dollar payouts.

### Decisions pending (D1 to D19)

Choices only the PM (and legal, where named) can make. The system builds the recommended option and keeps the other easy to switch to, with one exception: no part builds either option of D6 yet (section 76). A recommendation that waits on a choice names its decision (R06 D14, R07 D17, R11 D15, R14 D6, R18 D16).

| Decision | Option A | Option B | Recommended |
|---|---|---|---|
| **D1** Primary fill | Blue action #1268f0 (kit default) | Ink #0b0b0d like the site's commit button | A: blue already means the worker's actions in V2; links become underlined ink and selection a 12% tint, so blue no longer collides. |
| **D2** The noun: worker or agent | worker (V2) | agent (site, apply.html:1269-1274) | One noun across site and app, one capitalisation ('BlueAI worker'); PM call. |
| **D3** The money model | $1 per verified day + $10 day-20 bonus (worker_day_done.jsx:5-6) | $30 when the 20-day goal is met (apply.html:1285, 1471) | Pick one sentence and say it everywhere; if B, the app shows days, never partial dollars ('days' style is already the default). Rename the bonus 'day-20 bonus' if it stays. The $10 cash-out minimum is not part of the choice: it is V2's rule (worker_day_done.jsx:6) and the site's (apply.html:1360, 2292), so the app states it now (sections 01, 41, 43). Proposed strings that wait on this choice (PM and legal): the leave and delete line for a balance under the minimum ('a balance under $10 can’t be cashed out once you leave', `screens/settings.jsx` cashLine), and Home's dropped banner sentence 'Every day you run still counts.' (false under B). |
| **D4** Where the mode changes later | Version 1 chip in the composer | Version 2 ribbon (default) | B as the in-chat shortcut plus Settings > Worker as the permanent home either way. V2 added a Worker card to Settings on 2026-10-14; both versions now open one mode sheet. |
| **D5** Sign-in option | Check account (interrupt only on the wrong account) | Continue as (always confirm) | A for fewer stops; drop the losing code path. |
| **D6** Credits and the paid run | Reserve the worker's run cost from the daily grant | Warn before a chat would dip into it | A: a partner should never lose a paid day to an invisible meter. Not built yet: the composer locks only at zero (section 38) and the credits chip turns low once fewer than the run's cost are left (section 47), so a chat can still spend today's run (section 76). |
| **D7** Does Day 1 count | Setup continues into the first daily run and counts | Setup only; first counted day is tomorrow | Either, said in the onboarding close. |
| **D8** The family mark | BlueAI gradient wordmark | Site spark + two-tone 'BlueAI' | B in the long run (already in V2's sign-in pages); A until the PM decides. |
| **D9** Install from BlueStacks (Flow A) | Keep with worker copy and an 'Apply on onBlue' path for non-applicants | Drop from the partner target | B: partners install from the dashboard link after acceptance. |
| **D10** Platform promise | Site drops Mac and per-campaign approval | Product shows them | A until a Mac build exists. |
| **D11** Product face | Inter (site) | Plus Jakarta Sans (V2) | A; the scale and weights hold either way. |
| **D12** Chat as a tab | Three tabs, chat from Home | Four tabs with Chat | A: chat serves the worker. |
| **D13** Yellow for every worker question | Keep the live yellow on every ask (PM-confirmed) | Neutral asks in onboarding, yellow only for unattended job and retry asks | B so yellow keeps meaning 'needs you'. |
| **D14** Skipping a waiting job (R06) | The cost on the option, one tap: 'Skip: today won’t count' | Keep the job open until 9 pm with Undo | A, built in the JobPreviewCard (section 45): the cost is read before the tap, and nothing waits on a toast. |
| **D15** The setup promise (R11) | One bullet that holds in both modes ('You choose: I can ask before each paid job, or take them on my own.') | Keep 'I only run a paid job after you say yes to that specific job.' and drop Automatic from setup | A: Automatic stays a choice, and the first promise stays true. PM copy. |
| **D16** Reading watch history (R18) | Ask first: PermissionRequest in setup, Allow or Not now, revoked in Connected apps | Read it at setup as V2 does, listed under Account with a switch to stop it | A, built (section 46): reading viewing data is its own permission. PM copy. |
| **D17** The paid job ask (R07) | JobPreviewCard replaces V2's AskCard for paid jobs | Keep the AskCard and add the video, channel and exact comment to it | A, built: Chat's waiting state asks in the JobPreviewCard (section 45, screens/chat.jsx jobCard); B is one constant away (D17 = 'B'); the AskCard stays for every other question (section 37). |
| **D18** Feedback on a failed job (section 39) | Offer thumbs on failed jobs too | Successes only, as V2 (`chat_product.jsx:150`) | A: a failed job is where a partner most wants to say something; Report a problem stays the route for a dispute. |
| **D19** Turning an interest topic off (section 62) | A topic can be turned off, and BlueAI stops picking jobs about it | Topics are read only, from watch history | A, as Worker settings draws it; the PM confirms what it does to the jobs offered. |

### V2 strings changed as proposals

The PM's words are kept unless a change goes to the PM as a proposal (section 70's register). These are proposed in the system:

- The setup run window '9am–9pm' (`blueai/worker_flow.jsx:73-74`) becomes '9 am to 8 pm': runs start by 8 pm, so there is time to answer a job or try again before 9 pm (section 62), and times are written with spaces (section 70).
- The handle No line 'Okay. Sign in to the YouTube account you want me to use in App Player, then run the BlueAI worker again.' (`blueai/worker_flow.jsx:162`) invites another account, which section 56 and R39 rule out. Proposed: 'Okay. I can only use the YouTube account you applied with, or a channel under it. If you meant a different channel, report a problem and we’ll help.' with a Report a problem link (section 57).
- The failed-day ask 'Today’s job didn’t finish.' / 'Retry to count the day.' / 'Retry' (`blueai/worker_day_done.jsx:94`, `blueai/worker_flow.jsx:127`) becomes 'Try again' with the day's deadline on the RunCard and the WorkerCard, one string for both ('Today doesn’t count yet. Try again by 9 pm.', `DAY_COPY.failed`, `kit/job.jsx:47`; `kit/run-card.jsx:110`, `kit/worker-card.jsx:80-83`): one word for a retry everywhere (section 70), and the deadline the record keeps (section 41). The failed-day AskCard specimen (section 37) keeps the PM's words as the V2 reference.
- Chat's typed-message replies (section 57), none of which exist in V2: a status question answered from the record ('Did today count?': 'Today’s run is done. Day 7 of 20, pending verification. We check every run within a day.'); an action request, 'I don’t change settings from chat, so nothing has changed. You can set the run time in Worker settings.' with a Link 'Open Worker settings'; out of scope, 'That’s not something I can do here. I run your daily YouTube job, answer questions about your runs and days, and point you to the setting you need.' Chat's empty-state body becomes 'Ask about today’s run, your days, or where to change a setting.', since the worker never changes a setting from typed text.
- An AI credits explainer built around the daily run, an option for the PM and not shown anywhere: 'Your daily run and your chats use AI credits. You get a fresh set every day, and chats use the same set, so leave enough for today’s run.' (formerly `OOC_COPY.explain`). The AI credits screen keeps V2's 'BlueAI runs on credits' lines word for word (`index.html:534-546`, section 66).
