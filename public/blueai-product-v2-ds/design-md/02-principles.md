## 02 Principles

**Status:** Meta (no parts).

**Why:** Every part in the system argues from one of these. When a new screen and a principle disagree, the principle wins, or the principle changes here first, with its reason.

### P1 The worker is the product; chat is a window onto it

- **Rule:** Home shows the worker and today's run first. A run, its waiting question and its result live in one Worker record above any screen; no navigation can erase them.
- **Why:** V2 unmounts the chat (and the run) when the partner opens Credits, History, Profile or another tab (index.html:955-971, chat_product.jsx:33, 79); the failed-day toast then opens a screen with no Retry (worker_day_done.jsx:203, index.html:1053). A worker that runs unattended needs a state that outlives its views.
- **Prevents:** Lost runs, lost Retry, a day count that goes backwards overnight (worker_day_done.jsx:39 vs :173).

### P2 Money and days are said once, the same way everywhere

- **Rule:** One ledger, one grant constant, one Earnings URL. Green means a state that was reached (verified, done); dollar figures stay in ink. Pending is never painted as verified.
- **Why:** Four credit numbers (2,000, 2,500, 500, 300), two Earnings URLs, green dollars on a pending day, and three money models across site and app (inv-dna findings) are the fastest way to lose a paid partner's trust.
- **Prevents:** 'Where is my $1' support tickets and the feeling of being shorted.

### P3 Say the consequence before the choice

- **Rule:** Any control that can cost a day, money or account control states that cost on or beside the control (Skip, Stop, Sign out, Disconnect, turning Automatic on). Disabled controls say why.
- **Why:** 'Not now' on the job ask silently forfeits the day and is only explained afterwards (worker_flow.jsx:121, 149; worker_day_done.jsx:118). The site already follows 'disabled with a reason' (onblue/apply.html:408-416).
- **Prevents:** Choices that feel like traps.

### P4 Every promise has a control

- **Rule:** 'Pause, stop, or disconnect anytime' and 'turn it off anytime' each map to a findable control in Settings > Worker and Connected apps, reachable from the home in two taps.
- **Why:** The promises exist in live copy (worker_flow.jsx:67, agent_permissions.jsx:176) but no screen delivers them (settings.jsx:129-143).
- **Prevents:** Consent that cannot be withdrawn.

### P5 Quiet by default

- **Rule:** Surfaces separate with 1px alpha-black lines, not shadows; shadows only on things that float (menus, dialogs). One action blue. The brand gradient only on the BlueAI mark and the credits glyph. Colour inside the thread is carried by icons, plus one attention tone for 'the worker needs you'.
- **Why:** V2 carries 154 shadow declarations (55 recipes, 15 coloured glows), three competing accents and eight tinted message surfaces (inv-foundations, inv-chat). The partner sits on this screen daily; the one thing that matters must stand out.
- **Prevents:** A UI where everything competes and nothing reads as the next action.

### P6 One family with onBlue Agentic

- **Rule:** Share the site's neutrals, line weights, blue, greens, error reds, card radius, easing, focus ring, sign-in gate scrim, reduced-motion rule and vocabulary. Do not share its marketing ladder, ambient effects, header or footer.
- **Why:** The partner moves site, app, site daily; V2 already contains the site's language in window.SiteKit (blueai/site_kit.jsx:12-20) but the app itself speaks a third style.
- **Prevents:** The journey reading as three companies at the moment trust is asked for.

### P7 Accessible baseline, not an afterthought

- **Rule:** Text 4.5:1 or better (including the primary button label), visible :focus-visible on every control, keyboard menus and dialogs with focus moved in and returned, hit targets 24px minimum and 32px for anything touching consent or money, role=log on the thread, and one global reduced-motion rule.
- **Why:** White on #1990FF is 3.24:1 on every primary button; faint caveats sit at 2.5:1; one :focus rule ships (index.html:57); no overlay moves focus.
- **Prevents:** Partners who cannot read the caveat that explains their money.

### P8 Real parts, measured values, nothing dead carried

- **Rule:** Every V2 value the guide prints cites its V2 file:line and needle and is re-checked by tools/ds-check.js. Parts marked In V2 render V2's own window.X where possible. Dead code is listed, never specimened as product.
- **Why:** About 3,000 of V2's 11,042 lines never render; harvesting them would import an abandoned violet 'earn credits' language (credits_widget.jsx holds 57 of 112 #7B4CFF uses).
- **Prevents:** The PM building from code that does not ship, and docs drifting from source.

### One family with onBlue Agentic (P6 in detail)

Shared means the same value as the site; adapted means the same idea tuned for a 419px daily tool; not shared is marketing the app leaves behind.

| Rule | Relation | Why |
|---|---|---|
| Neutral ink ramp #0b0b0d / #3c4049 / #5f636b | shared | Same text colours on the site and in the app (onblue.css:300-309). |
| Meta ink #6e737c (site dim #767b85) | adapted | One step darker so 12px captions clear 4.5:1; the site's dim measures about 4.2:1. |
| Alpha-black 1px lines 10/15/8/20% | shared | The site's clearest DNA, same values (onblue.css:274-275, 319, 376). |
| Lines alone separate in-flow surfaces | adapted (shadow dropped) | The site's light theme also casts a faint resting shadow on cards, panels and ghost buttons (onblue.css:388, 993, 1486; apply.html:85-90); the product drops it, so a shadow only ever means 'this floats'. |
| Surfaces a fraction apart, alternating card / panel / row | shared | Depth reads as structure, not murk. |
| Brand blue #156efe for focus, selection and progress | shared | One blue across the journey. |
| Action blue #1268f0 and blue ink #0d5ad6 | adapted | #156efe is 4.47:1 with white; the product needs 4.5:1 on every primary label. |
| Selection = 12% blue fill + 50% blue border + ink label | shared | One 'chosen' look on site and app. |
| Green means reached; money stays in ink | shared | Verified days look the same on the dashboard; pending money is not painted as paid. |
| Error red #c03a40 / #d0454a / ring 16% | shared | One danger set; also the destructive fill (5.36:1). |
| Card radius 16, controls 6, pills 999 | shared | Strongest single 'same family' cue is the button shape. |
| Site near-step radii 7/9/11/12/14 | not shared | Too many near steps for a 419px tool. |
| Inter only; weights to 600; negative tracking scales with size; uppercase only for eyebrows | shared | Calm hierarchy from size and ink, not weight. |
| Dashboard working-screen type tier | adapted | The app is a working screen like the dashboard; scaled for a 419px window. |
| Marketing type ladder and responsive ladder | not shared | The product is a fixed desktop window. |
| Ease cubic-bezier(0.16,1,0.3,1), symmetric departures, nothing loops unattended, global reduced motion | shared | Nearly identical to V2's house curve; costs nothing. |
| 0.35s marketing transition standard | adapted | App state changes run at 120 to 240ms. |
| Focus: 2px blue outline offset 2; fields border + 3px 16% ring | shared | Keyboard users meet one system across site and app. |
| Sign-in gate scrim rgba(248,249,251,0.88) + 14px blur | shared | 'Sign in' looks the same on the site and in the app. |
| Frosted veil for every dialog | not shared | Blur costs on partner PCs; a solid dim veil elsewhere. |
| Navy-tinted casts at low alpha, no glows | adapted | Three levels only (none, popover, dialog). |
| Button ladder: one primary per view, secondary, quiet, link; disabled with a reason | shared | Ranks Run, Got it, Try again, Allow, Not now. |
| Underlined ink links that turn blue on hover | shared | Frees blue for selection. |
| Recessed tabs with one raised chip and counts | adapted (shadow dropped) | Activity and Notifications need tabs; take the family's shape without the lit tab's card shadow (apply.html:467-473; section 28). |
| Ledger rows with a fixed date column; empty copy names what will appear | shared | The run log and the site's transactions read as one record. |
| Muted note with one bold ink figure | shared | Pending verification lines, credit notes. |
| Payout pill (green receipt) | adapted (plain line) | 'Yesterday's run verified.' is its job, drawn as a plain 12 ink-3 line with its tick (section 43): the site's pill (green line, 10% green fill, onblue.css:2102-2115) would put a second green box on a small strip whose bar is already green. |
| Progress bar toward a goal | adapted | Merged with the product's segmented DayBar, which adds the pending state the site lacks. |
| Sheet anatomy and motion | adapted | Solid dim veil instead of frost outside sign-in. |
| Grain, glyph field, aberration, WebGL model, card sheen, terminal, badge, band note, header, footer | not shared | Marketing ambience competes with a daily tool and costs GPU. |
| Copy voice and vocabulary | shared | Same words on both sides; conflicts go to the PM as decisions. |
| 'Log out' on the site | adapted | Product uses 'Sign out' to pair with 'Sign in'; recommend the site align. |
| 'Reward' and 'campaigns and tasks' on the site | adapted | The program card and its sheet say 'Reward' (apply.html:1280, 1470), How it works says 'its own reward' and 'its reward is added to your earnings' (:1434, 1436), the agent intro says 'completes campaigns and tasks' (:1849). The product says Earnings for money and job for paid work (section 70); recommend the site align, or the PM accepts the site's word for both. |
| Review dock convention (onblue-dev.js) | shared | Review controls live outside the product and add no tokens; V2's Preview panel follows it. |
| window.SiteKit inside V2 | adapted | Seed for one family token object; it has drifted (48 vs 44 height, 0.12s vs 0.18s press, 32 vs 38 mark). |
