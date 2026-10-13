## 70 Copy and voice

**Status:** New (glossary); In V2 (PM copy register).

**Why:** A partner moves between the onBlue site and the app every day. V2 names one thing several ways: "BlueAI Worker v57 skill" (`worker_flow.jsx:63`), "Loading your skills…" (`boot_splash.jsx:25`), "tasks" and "earn rewards" for paid jobs (`worker_flow.jsx:45-46`), "Logout" beside "Sign out" (`index.html:369`, `profile.jsx:62`), "tokens" for AI credits (`ai_mode.jsx:109`). The same thing named five ways reads as five things, and the money words drift most.

### Glossary (New)

- **Purpose:** one word per thing, shared with the site, with the words that must not stand in for it.
- **Anatomy (term: use; never):**
  - BlueAI: the product and brand on screen; never onBlue (internal), "BlueAI Worker v57".
  - BlueAI worker (lowercase worker): the thing that runs, pending D2 (worker or agent); never BlueAI Worker, AI worker, MoneyMaker, skill, blueai-worker, agent (until D2).
  - job, paid job: one paid unit of work; never task (for paid work), campaign, gig, opportunity.
  - run, today's run: the daily session; never routine, session, scheduled task.
  - day, your 20 days: the program unit; never program days, qualifying day.
  - pending verification, verified: one tick, two ticks; never confirmed, approved, validated.
  - Always ask, Automatic: the mode per app (the PM's names); never Mode (as a label), auto mode, autopilot, Just this job (as a mode).
  - Sign in, Sign out: account entry and exit; never Log in, Login, Logout, Log out (the site should align), logging in.
  - AI credits: the daily allowance, sentence case; never tokens, coins, free credits, claim, earn (for credits), balance (say "left today").
  - Earnings: money, opened on the site's dashboard; never income, rewards, wallet, BCX, a ↗ character (use the external icon).
  - Program Terms: the agreement; never Terms of Use (unless that document changed), Terms & Conditions.
  - connected account, Disconnect: the accounts BlueAI uses; never Unlink, ID, enrolled or Not enrolled (say "in the program").
  - Try again: the system retry; never Retry (the PM's failed-day ask is flagged, not changed).
  - BlueStacks, App Player: the dependency; never emulator, player app.
- **Tone:** second person, present tense, short declaratives, a reason rather than an adjective; the consequence for today's day or money on the control, before the choice; errors say what happened, what it means for today and the one next step; empty states name what will appear, disabled states say what unlocks them; sentence case, uppercase only for 11px eyebrows; no emoji in headings, greet by first name or not at all; never promise income; no version strings, slugs or internal names; no em dash (use a comma, colon, full stop or brackets).
- **Formats:** dates "Nov 1", "Oct 12" (a year only when it is not this one); times "11 am", "9 pm", "9 am to 9 pm" in the partner's local time; days "7 of 20 days", "Day 7 of 20"; money "$1", "$30" in ink, never green while pending; credits "1,640 AI credits left today"; the … character only for work in progress ("Signing in…"), never three dots (`chat_product.jsx:266`) and never on a button; curly quotes and apostrophes.
- **Variants, Sizes, States, Props, Motion, Responsive:** n/a (a reference, not a part).
- **Accessibility:** plain words are the accessible version; a label is the same word everywhere, so screen-reader users meet one name per thing.
- **Do / Don't:** Do look a word up here before writing it; use the site's word when the site has one; mark new copy "Proposed copy" until the PM approves it. Don't invent synonyms for variety; don't put versions or slugs on screen; don't use money words for AI credits.

### PM copy register (In V2)

- **Purpose:** the strings the PM or legal own. Design may restyle them, never rewrite them; changes go to the owner as proposals.
- **Anatomy (string; owner; where; status):**
  - "I only run a paid job after you say yes to that specific job."; PM; `worker_flow.jsx:67` (kept live by his call, `:18`); live, conflicts with Automatic (R11).
  - "Today’s run is done.", "No paid job today, but your run counts.", "Day 20 done." / "That’s every day for this month.", "Pending verification", "We check every run within a day. The tick doubles once it’s verified."; PM; `worker_day_done.jsx:91-98`; DRAFT until the PM approves (`:8`).
  - "Run this to begin" / "Okay"; PM; `moneymaker_home.jsx:36, 154`; live, settled after three rounds.
  - "An AI that turns your social accounts into income."; PM; `moneymaker.jsx:154`; live, decision D3.
  - "Sign in with the same account you applied with.", "Run the BlueAI worker: it finds jobs and runs them for you.", "Sign in to get started"; PM; `moneymaker.jsx:51, 55, 187`; live.
  - "Use the account you applied with"; PM; `login.jsx:239`; live.
  - "By continuing, you agree to the Program Terms and acknowledge the Privacy Policy and Cookie Policy."; legal; `terms_sheet.jsx:67-69` (wording rule `:49-53`); legal.
  - "Agree and continue"; PM; `terms_sheet.jsx:71` (`:60`); live.
  - "Run YouTube jobs automatically?" / "By turning this on, you agree to let BlueAI do this for you on YouTube. You can turn it off anytime." / "I agree, turn on"; PM; `agent_permissions.jsx:159, 176, 179`; live.
  - "Always ask" / "Automatic"; PM; `worker_flow.jsx:78`; live.
- **States:** live, DRAFT, legal.
- **Do / Don't:** Do quote these exactly in every part marked In V2; send a proposed change to the owner with the reason. Don't fix a typo or a tone in them silently; don't move legal wording between contexts without legal.
