/* Section 73: Recommendations for V2 (compose slice). Every V2 difference as a prioritised fix for
   the PM (P1 to P3) with V2 file:line, today, recommended, why and effort; then Decisions pending
   (D1 to D19) and the V2 strings changed as proposals. Data from the architect plan. Each recommendation's V2 location (and any V2 string its
   "today" quotes exactly) is proved by guide/refs/compose.js (ids compose.rNN.*). The lists are
   also put on G.recommendations ({recs, decisions}) so section 75 tallies them instead of typing a count. */
(function () {
  const G = window.V2Guide;

  // [id, priority, area, effort, V2 file:line, today, recommended, why]
  const RECS = [
    ["R01","P1","worker","L","index.html:955-971; blueai/chat_product.jsx:33, 79","Opening Credits, History, Profile or any tab unmounts ChatScreen; the run, a waiting job ask, a failed-day Retry and today's result are lost.","Own the worker's day in one Worker record above the views; the chat, home card, RunCard and toast read it.","The product is an unattended daily worker; its state must outlive any screen (P1)."],
    ["R02","P1","worker","M","blueai/worker_day_done.jsx:39, 173; blueai/worker_flow.jsx:42, 168","DONE_BEFORE=6 makes tonight 'DAY 7 OF 20' and tomorrow's strip 'Day 6 of 20'; the strip appears right after Day 1 claiming 'Yesterday’s run verified.'","One ledger (verified, pending, missed, rejected days; target; ends Nov 1) feeding overlay, strip, toast, Activity and the site tile.","The day count is the partner's pay."],
    ["R03","P1","shell","S","index.html:1000","Logout confirm closes the modal and returns to chat; the partner stays signed in.","Confirm signs out, pauses the worker (say so in the confirm) and lands on the signed-out Welcome.","A destructive confirm that does nothing is a broken promise and a dead end for switching accounts."],
    ["R04","P1","navigation","M","blueai/shared.jsx:222; blueai/jobs.jsx:140-142; index.html:366","The first tab, Jobs, is 'Coming Soon'; Schedule shows Coin Master samples (schedule.jsx:5-8); the kebab's Chat History lists past chat sessions.","Nav = Home, Activity (run and verification log), Settings; Jobs and Schedule retire (the run window moves to Worker settings), and so does Chat History: runs live in Activity and the chat is one thread opened from Home.","Two of four tabs say nothing about the only thing a partner is here for, and a list of past chats is a second, weaker record of the runs Activity keeps."],
    ["R05","P1","worker","M","blueai/settings.jsx:129-143; blueai/worker_flow.jsx:67; blueai/agent_permissions.jsx:16, 176","'Pause, stop, or disconnect anytime' and 'turn it off anytime' have no control; mode changes only inside an open chat.","Settings > Worker (pause until, run window, mode per app, interest profile) and Connected apps (Disconnect).","Consent that cannot be found to revoke is weak consent (P4)."],
    ["R06","P1","worker","S","blueai/worker_flow.jsx:121, 149; blueai/worker_day_done.jsx:118","'Not now' on the job ask forfeits the day; the cost is told afterwards.","State the cost on the option ('Skip: today won’t count') or keep the job open until 9 pm, the day's deadline (section 41), with Undo. Decision D14.","Learning the cost after the click feels like a trap (P3)."],
    ["R07","P1","worker","M","blueai/worker_flow.jsx:49-52, 117-121, 136","The ask shows only 'Watch the video and provide feedback.'; the comment posted under the partner's name is never shown; first chip bundles 'Yes' with switching to Automatic.","JobPreviewCard: video, channel, actions, exact comment text, consequence; primary 'Take this job', Automatic as a quiet link. Whether it replaces V2's AskCard for paid jobs is decision D17.","The riskiest moment in the product is agreeing blind to a public comment."],
    ["R08","P1","notifications","M","blueai/chat_product.jsx:91-99; blueai/worker_day_done.jsx:191-205","An unattended Always ask run waits forever behind a 7-flash taskbar cue; no toast, no expiry.","Windows notification 'A paid YouTube job is waiting for your OK' with the deadline; expiry closes the run as skipped with its day status; inbox entry.","Always ask is the default, so most partners would lose days silently."],
    ["R09","P1","foundations","S","index.html:25, 342; blueai/credits_popup_parts.jsx:110","White on #1990FF is 3.24:1 on every primary button; #1990FF links 3.24:1.","--v2-action #1268f0 for fills (4.92:1), --v2-blue-ink #0d5ad6 for blue text, --v2-blue #156efe for marks and focus.","Consent and Run are the least legible words on screen today (P7)."],
    ["R10","P1","foundations","S","blueai/chat_bubbles.jsx:124; blueai/account_gate.jsx:31; blueai/login.jsx:242; blueai/worker_day_done.jsx:158","Caveats ('App Player will be signed out too.', 'We check every run within a day…', 'Working on it…') at 2.15 to 2.56:1.","ink-3 for anything the partner must read, ink-4 #6e737c (4.77:1) for pure meta; no warm link colour.","Unreadable caveats are not disclosure."],
    ["R11","P1","copy","S","blueai/worker_flow.jsx:67 vs 76-78; blueai/worker_flow.jsx:46","'I only run a paid job after you say yes to that specific job.' then the same onboarding offers Automatic; PLAN step 2 promises 'a quick approval'.","Decision D15 for the PM (kept live by his call, worker_flow.jsx:18): a bullet that holds in both modes, for example 'You choose: I can ask before each paid job, or take them on my own. You can change this anytime in Settings.'","The first promise about the partner's account is broken minutes later."],
    ["R12","P1","worker","S","blueai/worker_flow.jsx:171; blueai/worker_day_done.jsx:38","The money rule (20 days, verification, end Nov 1, cash out) is never stated before the first day-done overlay; RULE.programEnd is never shown.","ProgramSummary in the onboarding close and behind an info tip on the strip; show 'Ends Nov 1' beside the count on the ProgramStrip (Home, Activity). The day-done moment keeps its bar without the date: it says the count once and nothing else (section 44).","Partners cannot plan around rules they have not been told."],
    ["R13","P1","worker","M","blueai/needs_bluestacks.jsx:40; blueai/chat_product.jsx:64-66, 129-135; blueai/moneymaker_home.jsx:70","The worker never checks for BlueStacks or App Player although the bare URL has neither and the copy narrates App Player.","Worker preflight: BlueStacks installed (DependencyCard), App Player signed in, YouTube linked, before every run.","The worker claims to drive an app that is not installed, then blames it."],
    ["R14","P1","credits","M","index.html:720; blueai/credits_popup_parts.jsx:14, 105; blueai/login.jsx:160-167; blueai/chat_bubbles.jsx:188-189","Grant 2000 vs 2500 vs 500 vs 300; 'enough for 4 to 5 jobs' vs '~10 tasks'; 'refreshed tomorrow' vs a countdown; nothing says whether a credits-dead run costs the day; a chat can spend the credits the paid run needs.","One DAILY_GRANT; one explainer sentence; countdown everywhere in local time; reserve credits for the worker's run or warn before chat dips into them (decision D6); every zero message states the day status.","Credits are the fuel for income; conflicting numbers make the meter untrustworthy."],
    ["R15","P1","notifications","M","blueai/worker_day_done.jsx:203; index.html:1053, 770-777","'Open BlueAI to retry and count the day.' opens a cold-started home with no Retry.","Toast opens the persistent Today record; Retry lives on the WorkerCard and in Activity until 9 pm, the day's deadline (section 41), stated with it.","This is the exact moment money is at stake."],
    ["R16","P1","settings","S","blueai/settings.jsx:15-17; index.html:259-263","'Connected to BlueStacks App Player' shows even when BlueStacks is not installed.","Bind the card to the real state: not installed (Get BlueStacks), installed and signed out (Open App Player), connected as {account}.","False status sits where a partner debugs a failed day."],
    ["R17","P1","shell","M","index.html:933, 553-555, 1044","Close unmounts the app; Minimize does nothing; no tray.","Close hides to tray (first-time notice with next run time), Minimize works, tray menu shows run state and Quit warns.","A worker that runs when nobody is watching cannot stop when its window closes."],
    ["R18","P1","consent","M","blueai/worker_flow.jsx:80-82, 161","Watch history, subscriptions and channel stats are read without being asked.","PermissionRequest card in onboarding (decision D16) and a Revoke row in Connected apps; list the interest profile under Account and privacy.","Reading viewing data is a separate permission from 'use your account like a fan'."],
    ["R19","P1","worker","M","blueai/worker_day_done.jsx:53, 62-68, 83-87","Verification has only pending and verified; a rejected day looks pending forever.","StatusTick and DayBar gain rejected (with reason), not counted and late; Activity row offers Report a problem.","The two-tick model implies a day can fail; the partner needs to know and dispute."],
    ["R51","P1","consent","S","blueai/agent_permissions.jsx:161","The Automatic consent says the worker will finish jobs 'including posting videos and other content'; the worker never posts videos, and the comment it does post in the partner's name is not named.","Name what a job does, from WORKER_JOB.actions: 'BlueAI will take YouTube jobs and do them on your account without asking first: watching, liking and posting comments in your name.' (section 46). Consent copy, so the PM and legal decide it; the record keeps the version shown (section 53).","On Automatic the job preview never appears, so this line is the partner's only notice that comments go out under their name."],
    ["R20","P2","foundations","S","index.html:10-20, 34","Body stack puts -apple-system first (Mac shows SF Pro); four typefaces in the first minute; weights 650/750/900 requested but not loaded.","Inter first in the stack, weights 400/500/600 (decision D11 if the PM prefers Plus Jakarta Sans).","Reviewers and partners see different products; one face reads as one family."],
    ["R21","P2","foundations","M","blueai/chat_bubbles.jsx:30; blueai/settings.jsx:10; blueai/shared.jsx:300","154 shadow declarations, 15 coloured glows (user bubble 30% indigo).","In-flow surfaces: 1px line, no shadow; shadow-1 for floats, shadow-2 for dialogs.","Quiet surfaces let the next action stand out and match the site (P5, P6)."],
    ["R22","P2","shell","S","blueai/shared.jsx:305; blueai/login.jsx:256; blueai/settings.jsx:58","Indigo #4f46e5 on nav active, sign-in spinner, Telegram code; blue elsewhere.","One accent: nav active = 2px blue indicator + ink label.","Selected and primary read as two systems."],
    ["R23","P2","foundations","S","index.html:326, 333-337","Gradient on wordmark, pill ring, pill number, balance numeral, bubbles, borders.","Gradient only on the mark and the credits glyph; numbers in ink.","Brand identity, not a UI fill."],
    ["R24","P2","components","M","blueai/shared.jsx:57-82; blueai/profile.jsx:69-84; blueai/byok.jsx:76-89; blueai/worker_day_done.jsx:144","Seven overlay builds, seven scrims, five widths, z tie at 120, no focus management.","One Dialog and one Sheet on one scrim and the named z-scale, with role, focus in, trap, return and a busy state.","Keyboard users act on content under the scrim; each dialog looks like another product."],
    ["R25","P2","components","S","index.html:280-292, 350, 361","Header menus close only on outside mousedown; no role, Esc, arrows or aria-expanded.","Menu component with role=menu, aria-haspopup, aria-expanded, arrows, Esc and focus return.","The only route to Earnings and Sign out is mouse-only."],
    ["R26","P2","infrastructure","S","index.html:24; blueai/worker_cards.jsx:28, 49","Unpinned Tailwind CDN used for one unreachable class; its preflight hides the Plan card's numbers and AskBubble bullets.","Remove Tailwind; add the explicit reset in kit/base.css with list markers on.","An unpinned script can change base styles any day."],
    ["R27","P2","motion","S","index.html:63-104; blueai/worker_day_done.jsx:150; blueai/moneymaker_home.jsx:122","Reduced motion honoured in 4 components; infinite ring, border spin (which cannot animate), shimmer, bounce run for everyone.","One global reduced-motion rule; remove the border spin; ring pulses once.","Perpetual motion on the screens partners sit on."],
    ["R28","P2","worker","S","blueai/worker_day_done.jsx:131-163","Overlay says the count five times, celebrates a pending day in verified green with confetti, money in green.","One count, one status line, pending treatment (blue, one tick) until verified, confetti on Day 20 only, money in ink.","Colour says paid while words say not yet."],
    ["R29","P2","copy","S","index.html:320; blueai/worker_day_done.jsx:184","Kebab Earnings and strip 'Earnings ↗' go to two different URLs.","One EARNINGS_URL constant; one external glyph.","The partner's money lives behind this link."],
    ["R30","P2","settings","S","blueai/byok_settings.jsx:54, 64, 74, 93","Switching own key off deletes the key; Validate & Save makes up a key when empty; key in clear text; Remove and Unlink never confirm.","Switch only enables; Remove confirms or offers Undo; validating, invalid and unreachable states; secret field.","A switch reads as reversible."],
    ["R31","P2","settings","M","blueai/settings.jsx:105-119; blueai/byok_settings.jsx:78; blueai/ai_mode.jsx:176-187","Max Output Tokens, Max Steps, Timeout, VLM endpoint and two AI Model pickers lead the screen.","Partner sections first; developer controls under one Advanced disclosure with one model picker; 'tokens' becomes 'AI credits'.","Developer knobs signal 'not for you' and invite misconfiguration."],
    ["R32","P2","chat","S","blueai/chat_product.jsx:78, 124, 284","Composer clips at 120px with overflow hidden; zero credits revealed only after Send.","Scroll past the cap; ComposerNotice shows zero credits and refresh time before typing.","Work typed and then refused feels wasted."],
    ["R33","P2","chat","M","blueai/worker_flow.jsx:88-94, 102-112; blueai/chat_product.jsx:161","A daily run prints 6 to 15 status bubbles.","RunCard: live step, collapsed steps, outcome and day status.","The answer to 'did today count' is buried."],
    ["R34","P2","shell","S","index.html:355-356","FAQ and Report Issue only close the menu.","FAQ opens the site article; Report a problem opens a sheet prefilled from the last run.","Help is the escape hatch when a day or payout looks wrong."],
    ["R35","P2","chat","S","blueai/chat_bubbles.jsx:15; blueai/chat_product.jsx:213","Every user bubble shows 'Jun 12, 2026, 11:03 AM'; 'Your next run is at 11 am.' whatever was chosen.","Real times and day separators; greeting reads the saved run window.","Times decide when the worker acts on the account."],
    ["R36","P2","shell","S","blueai/boot_splash.jsx:25, 80-114; index.html:735, 770-777","'Loading your skills…'; five-card skeleton collapses to one card; 3.5s splash on every window open.","Worker-true copy, worker-home skeleton, splash on true cold start only.","The first words on every launch name a hidden feature."],
    ["R37","P2","shell","S","index.html:342","The loudest header control is New Chat; run state is nowhere in the chrome.","WorkerStatusChip in the top bar; New chat moves into the chat screen header as an icon.","The partner opens the app to check today's run."],
    ["R38","P2","navigation","S","index.html:956, 960, 982","Kebab screens (Profile, AI Credits) have no Back and light no tab.","ScreenHeader with Back; pushed screens keep the parent tab lit.","The partner loses their place."],
    ["R39","P2","copy","S","blueai/profile.jsx:8-10; blueai/chat_product.jsx:206; blueai/signin_page.jsx:26; blueai/worker_flow.jsx:71","Three identities for one partner, including a real staff member's details in Profile.","One neutral fixture account everywhere; no real staff data in prototypes.","The gate's whole point is 'use the account you applied with'."],
    ["R40","P2","worker","S","blueai/agent_permissions.jsx:51-53, 93-103","Instagram can be switched to Automatic and consented to before Instagram jobs exist.","Coming soon row with no switch; consent only when the app goes live and is connected.","Consent to automation on an unused account is meaningless."],
    ["R41","P3","cleanup","M","index.html:981; blueai/credits_widget.jsx; blueai/skills.jsx; blueai/shared.jsx:84-298; blueai/chat.jsx; tweaks-panel.jsx; blueai/login.jsx:88-223; blueai/product_home.jsx; blueai/onboarding.jsx; blueai/chat_compare.jsx","About 3,000 lines unreachable; the hidden earn-credits sheet leaves invisible focus stops and writes localStorage.","Delete them (move IntroCard and ChatCatIcon into the chat module first); retire the Onboarding and Default sessions.","The PM cannot tell which screens are real; dead copy contradicts the credit model."],
    ["R42","P3","screens","M","blueai/moneymaker.jsx:96-205; blueai/moneymaker_backdrop.jsx; blueai/moneymaker_logo.jsx","Welcome on creator-brand theme (Space Grotesk, gradient CTA, grid, orbs, grain, cursor morph, 5.9s intro); Terms link does nothing.","Welcome on site DNA (Welcome screen) with the PM's two-step copy; Terms link opens the terms.","Three visual families in the first minute."],
    ["R43","P3","copy","S","index.html:589","Install dialog pitches 'finds deals, claims rewards'.","Worker pitch in BlueStacks' visual voice, or drop Flow A (decision D9).","First description of BlueAI on that path describes another product."],
    ["R44","P3","copy","S","index.html:369; blueai/profile.jsx:62, 75-79; blueai/chat_product.jsx:266, 278; blueai/worker_flow.jsx:63-64; blueai/worker_cards.jsx:31","Logout / Sign out / logging in; '...' vs '…'; 'Loading BlueAI Worker v57 skill…', 'Suggested skill: blueai-worker'; 'Let’s set up your BlueAI Worker.'; emoji in headings.","Glossary (Sign in, Sign out); the … character; no version or slug strings in partner copy (PM copy, flagged); 'BlueAI Worker' becomes 'BlueAI worker' (worker_flow.jsx:64); no emoji in headings.","Small drift makes the product read unfinished."],
    ["R45","P3","shell","M","product-scene.css:71-76; blueai/shared.jsx:73; blueai/jobs.jsx:130","Fixed 866px window; vh units inside it.","Compact rule (content 640 min, scrolls, bars pinned); size against the frame, not the viewport.","1366x768 laptops cut off the composer and nav."],
    ["R46","P3","review","S","index.html:743-765, 262, 713, 738","Copy link omits credits, ask, terms, session, chat states, own key, hardware; three params only work in combination.","Copy link carries every state; each param self-sufficient (?bai=0 implies ?bs=1).","Review links open on the wrong state."],
    ["R47","P3","copy","S","blueai/site_signin.jsx:27, 42; blueai/login.jsx:270-271","Site gate says 'Sign in to start your application.' to accepted partners; its legal line says 'agree to … Privacy Policy' (legal rejected that wording); first sign-in says 'Welcome back!'.","App variant 'Sign in to continue to BlueAI.'; legal line aligned with the terms sheet (PM and legal); success auto-advances.","Mis-describes where the partner is; legally weaker wording."],
    ["R48","P3","foundations","S","index.html:58-61, 974","Grey #e2e8f0 scrollbar rail, two definitions.","Transparent track, one token set for both engines.","Visual noise beside every white column."],
    ["R49","P3","sign-in","S","blueai/login.jsx:242-247","'Not seeing the browser tab?' (amber, 2.15:1) and 'Try again' do the same thing.","One action 'Open the browser again'.","Duplicate choices slow the decision."],
    ["R50","P3","cleanup","S","blueai/schedule.jsx:10-17, 59, 137; blueai/jobs.jsx:43, 86","'Weekly ()', no-op Edit, BCX crypto rewards.","Remove with the Jobs and Schedule tabs (R04).","Inert controls teach that the app is unreliable; BCX contradicts dollar payouts."],
  ];
  // [id, title, option A, option B, recommendation]
  const DECISIONS = [
    ["D1","Primary fill","Blue action #1268f0 (kit default)","Ink #0b0b0d like the site's commit button","A: blue already means the worker's actions in V2; links become underlined ink and selection a 12% tint, so blue no longer collides."],
    ["D2","The noun: worker or agent","worker (V2)","agent (site, apply.html:1269-1274)","One noun across site and app, one capitalisation ('BlueAI worker'); PM call."],
    ["D3","The money model","$1 per verified day + $10 day-20 bonus, over one 20-day period that ends Nov 1 (worker_day_done.jsx:5-6, 38)","At least 20 days each month, $30 each month the goal is met (apply.html:1285, 1471)","Pick one sentence and say it everywhere. The choice is also the cadence (one period ending Nov 1, or every month) and the unit (verified days, or days run: apply.html never says verified). If B, the app shows days, never partial dollars ('days' style is already the default). Rename the bonus 'day-20 bonus' if it stays. The $10 cash-out minimum is not part of the choice: it is V2's rule (worker_day_done.jsx:6) and the site's (apply.html:1360, 2292), so the app states it now (sections 01, 41, 43). Proposed strings that wait on this choice (PM and legal): the leave and delete line for a balance under the minimum ('a balance under $10 can’t be cashed out once you leave', screens/settings.jsx cashLine), and Home's dropped banner sentence 'Every day you run still counts.' (false under B)."],
    ["D4","Where the mode changes later","Version 1 chip in the composer","Version 2 ribbon (default)","B as the in-chat shortcut plus Settings > Worker as the permanent home either way."],
    ["D5","Sign-in option","Check account (interrupt only on the wrong account)","Continue as (always confirm)","A for fewer stops; drop the losing code path."],
    ["D6","Credits and the paid run","Reserve the worker's run cost from the daily grant","Warn before a chat would dip into it","A: a partner should never lose a paid day to an invisible meter. Not built yet: the composer locks only at zero (section 38) and the credits chip turns low once fewer than the run's cost are left (section 47), so a chat can still spend today's run (section 76)."],
    ["D7","Does Day 1 count","Setup continues into the first daily run and counts","Setup only; first counted day is tomorrow","Either, said in the onboarding close."],
    ["D8","The family mark","BlueAI gradient wordmark","Site spark + two-tone 'BlueAI'","B in the long run (already in V2's sign-in pages); A until the PM decides."],
    ["D9","Install from BlueStacks (Flow A)","Keep with worker copy and an 'Apply on onBlue' path for non-applicants","Drop from the partner target","B: partners install from the dashboard link after acceptance."],
    ["D10","Platform promise","Site drops Mac and per-campaign approval","Product shows them","A until a Mac build exists."],
    ["D11","Product face","Inter (site)","Plus Jakarta Sans (V2)","A; the scale and weights hold either way."],
    ["D12","Chat as a tab","Three tabs, chat from Home","Four tabs with Chat","A: chat serves the worker."],
    ["D13","Yellow for every worker question","Keep the live yellow on every ask (PM-confirmed)","Neutral asks in onboarding, yellow only for unattended job and retry asks","B so yellow keeps meaning 'needs you'."],
    ["D14","Skipping a waiting job (R06)","The cost on the option, one tap: 'Skip: today won’t count'","Keep the job open until 9 pm with Undo","A, built in the JobPreviewCard (section 45): the cost is read before the tap, and nothing waits on a toast."],
    ["D15","The setup promise (R11)","One bullet that holds in both modes ('You choose: I can ask before each paid job, or take them on my own.')","Keep 'I only run a paid job after you say yes to that specific job.' and drop Automatic from setup","A: Automatic stays a choice, and the first promise stays true. PM copy."],
    ["D16","Reading watch history (R18)","Ask first: PermissionRequest in setup, Allow or Not now, revoked in Connected apps","Read it at setup as V2 does, listed under Account with a switch to stop it","A, built (section 46): reading viewing data is its own permission. PM copy."],
    ["D17","The paid job ask (R07)","JobPreviewCard replaces V2's AskCard for paid jobs","Keep the AskCard and add the video, channel and exact comment to it","A, built: Chat's waiting state asks in the JobPreviewCard (section 45, screens/chat.jsx jobCard); B is one constant away (D17 = 'B'); the AskCard stays for every other question (section 37)."],
    ["D18","Feedback on a failed job (section 39)","Offer thumbs on failed jobs too","Successes only, as V2 (chat_product.jsx:150)","A: a failed job is where a partner most wants to say something; Report a problem stays the route for a dispute."],
    ["D19","Turning an interest topic off (section 62)","A topic can be turned off, and BlueAI stops picking jobs about it","Topics are read only, from watch history","A, as Worker settings draws it; the PM confirms what it does to the jobs offered."],
  ];

  G.recommendations = { recs: RECS, decisions: DECISIONS };

  // [V2 today (file:line), proposed, why]: section 73's "V2 strings changed as proposals".
  const PROPOSALS = [
    ["'9am–9pm', the setup run window (blueai/worker_flow.jsx:73-74)", "'9 am to 8 pm'", "Runs start by 8 pm, so there is time to answer a job or try again before 9 pm (section 62); times are written with spaces (section 70)."],
    ["'Okay. Sign in to the YouTube account you want me to use in App Player, then run the BlueAI worker again.', the handle No line (blueai/worker_flow.jsx:162)", "'Okay. I can only use the YouTube account you applied with, or a channel under it. If you meant a different channel, report a problem and we’ll help.' with a Report a problem link (section 57)", "It invites another account, which section 56 and R39 rule out."],
  ];

  const PRIORITY = {
    P1: 'P1: breaks the concept, costs a partner a day, money or control. Fix before the next iteration ships.',
    P2: 'P2: makes the product read as several systems or hides the next action. Fix as screens are touched.',
    P3: 'P3: clean-up and polish: dead code, copy drift, review tooling.',
  };
  const EFFORT = { S: 'Small', M: 'Medium', L: 'Large' };
  const FIRST = [
    ['R01', 'Own the worker’s day in one Worker record, so nothing a partner opens can lose today’s run.'],
    ['R02', 'One ledger for the day count, so the app never says Day 7 tonight and Day 6 tomorrow.'],
    ['R07', 'Show the job before the partner agrees: the video, the channel and the exact comment.'],
    ['R08', 'Tell the partner when a job is waiting, with a deadline, so Always ask does not lose days silently.'],
    ['R03', 'Make Sign out sign out.'],
  ];

  function sources(id) {
    const pre = 'compose.' + id.toLowerCase() + '.';
    return (Array.isArray(window.V2Refs) ? window.V2Refs : []).filter(function (r) { return r.id.indexOf(pre) === 0; });
  }

  function Rec({ r }) {
    const src = sources(r[0]);
    return (
      <article className="g-part" id={'rec-' + r[0]}>
        <header className="g-part-head">
          <h2 className="g-h2">{r[0]} <span className="g-muted">{r[2]}</span></h2>
          <span className={'g-prio g-prio--' + r[1].toLowerCase()}>{r[1]}</span>
          <span className="g-prio">Effort {EFFORT[r[3]] || r[3]}</span>
        </header>
        <dl className="g-facts">
          <dt>V2 today</dt><dd>{r[5]}</dd>
          <dt>Recommended</dt><dd>{r[6]}</dd>
          <dt>Why</dt><dd>{r[7]}</dd>
          <dt>Where in V2</dt><dd><code className="g-code">{r[4]}</code></dd>
          {src.length ? <dt>Checked</dt> : null}
          {src.length ? (
            <dd>{src.map(function (s, i) {
              return <span key={s.id}>{i ? ' ' : ''}<code className="g-code" title={s.needle}>{s.file}:{s.line}</code></span>;
            })} <span className="g-muted">still say what this cites (ds-check).</span></dd>
          ) : null}
        </dl>
      </article>
    );
  }

  function RecommendationsSection() {
    const [prio, setPrio] = React.useState('all');
    const count = function (p) { return RECS.filter(function (r) { return r[1] === p; }).length; };
    const shown = RECS.filter(function (r) { return prio === 'all' || r[1] === prio; });
    return (
      <G.Section id="recommendations">
        <G.Part name="How to use this list">
          <p className="g-role">Each row is a difference between V2 today and the system, with the V2 line it lives on. The system’s sections show the fixed version; this list is the order to fix V2 in.</p>
          <G.Table head={['Priority', 'Count', 'Meaning']} rows={['P1', 'P2', 'P3'].map(function (p) { return [<span className={'g-prio g-prio--' + p.toLowerCase()}>{p}</span>, count(p), PRIORITY[p]]; })} />
          <p className="g-role">Effort: Small is one part or one file; Medium touches several parts or a screen; Large changes how state flows through the app.</p>
        </G.Part>

        <G.Part name="Do these first">
          <ol className="g-list">{FIRST.map(function (f) { return <li key={f[0]}><a className="g-link" href={G.hashHref('recommendations')} onClick={function (e) { e.preventDefault(); setPrio('all'); setTimeout(function () { const el = document.getElementById('rec-' + f[0]); if (el) el.scrollIntoView(); }, 0); }}>{f[0]}</a> {f[1]}</li>; })}</ol>
        </G.Part>

        <div className="g-filter" role="group" aria-label="Filter by priority">
          {['all', 'P1', 'P2', 'P3'].map(function (p) {
            return <button type="button" key={p} className="g-btn" aria-pressed={prio === p} onClick={function () { setPrio(p); }}>{p === 'all' ? 'All ' + RECS.length : p + ' ' + count(p)}</button>;
          })}
        </div>
        {shown.map(function (r) { return <Rec key={r[0]} r={r} />; })}

        <G.Part name={'Decisions pending (D1 to D' + DECISIONS.length + ')'}>
          <p className="g-role">Choices only the PM (and legal, where named) can make. The system builds the recommended option and keeps the other easy to switch to, with one exception: no part builds either option of D6 yet (section 76). A recommendation that waits on a choice names its decision (R06 D14, R07 D17, R11 D15, R14 D6, R18 D16).</p>
          <G.Table head={['Decision', 'Option A', 'Option B', 'Recommended']} rows={DECISIONS.map(function (d) {
            return [<span><strong>{d[0]}</strong> {d[1]}</span>, d[2], d[3], d[4]];
          })} />
        </G.Part>

        <G.Part name="V2 strings changed as proposals">
          <p className="g-role">The PM’s words are kept unless a change goes to the PM as a proposal (section 70’s register). These are proposed in the system:</p>
          <G.Table head={['V2 today', 'Proposed', 'Why']} rows={PROPOSALS} />
        </G.Part>
      </G.Section>
    );
  }
  G.register('recommendations', RecommendationsSection);
})();
