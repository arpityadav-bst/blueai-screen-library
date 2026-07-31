# blueAI — Session Logs
(most recent at top)

---

## Session 13 — 2026-08-01 — size/radius tranches, the switcher rebuild, and closing the gate's blind spot
`designer_caught_count: 2` — (1) the skill-switcher reflow ("these tabs are not looking good right now…
Create with BlueAI wraps to 2 lines when selected otherwise not"), and (2) the meta-catch that followed:
asking whether the design system and product were *really* in sync, which is what surfaced everything below.

**What the designer decided, not me.** Tranche 3's six visible size/radius changes went out as an
accept/reject artifact; 4 accepted, 2 declined. Then the switcher: offered vertical option cards vs
"keep the tabs, shorten + explain" vs reflow-fix-only; designer chose the middle. Both times the
alternative was to just apply my preference, and both times the choice moved.

**The two real defects.** The switcher's `.on` state added `font-weight: 700` over `600` — on equal-width
`flex:1` options, that tips the longest label onto a second line, so *selecting a tab resized the tab row*.
And the pattern beneath it: only one of three methods explained itself, in the body, after you'd committed.
Fixed by encoding selection in colour only, one-word labels, and a shared explainer line.

**Taste rule 41 already covered the first one and never fired.** It was written as "two text roles a
half-step apart" — the width of the single example that taught it — so a component *state* never matched.
Widened to the mechanism (colour vs type metrics). This is the session's most useful finding: the notebook
is not short of rules, it is short of rules stated generally enough to catch the next instance. Gate 6.5
exists precisely for this and did not run.

**Infrastructure.** Named all 44 inline icon paths (0 left), which made `ds-drift-check.js` §9 possible —
the cross-check that catches a *wrong-but-valid* icon, the class of bug that let a `gear` sit on the
Ask-BlueAI tab for weeks with every check green. Added a scope footer so PASS stops over-claiming. §6
(icon duplication) is now closed at 0/30.

**Three of my own claims were false this session**, all in files whose job is preventing false claims:
`blueai-icons.js`'s header twice (first "neither file keeps its own copy", then "most sit in static
markup" — really 27 of 44 were ordinary JS literals, an estimate that made the migration look harder than
it was and left the hole open for weeks), and CLAUDE.md's token/coverage figures, written the same session
and already wrong. Also caught a real regression in my own migration (v1 rendered six icons empty) and a
false-alarm in my own comparison script (292 phantom diffs from re-sorting on an added attribute) — both
before they reached the designer, both only because the work was diffed against a known-good snapshot.

**Watch next session:** run Gate 6.5 on every rule *promoted*, not only on new work — that is the specific
habit missing. `evolution.md` re-pointed this session after being 4 weeks stale; the parity-audit thread is
finally promoted for its method lessons (its *findings* remain in progress and are NOT closed).

## Session 12 — 2026-07-24→08-01 — blueai-desktop's design system, built and then audited into shape
Freshness check: taste ✓ (+rules 38–41) | decisions ✓ (+8 rows) | reasonings ✓ (created this era, +3 principles) | knowledge-base ✓ (+2 sections) | project-insights ✓ | evolution ✗ NOT updated this pass (see Watch next) | session-logs (this entry)
**Screen:** `/blueai-desktop`. **Mode:** live-reviewed iteration for the UX work, then agent-assisted audit.
**The arc:** started as ordinary screen polish (AI Credits, OOC modal, Profile), which surfaced that blueai-desktop had **no design system at all** — every DS artifact in the repo documented the dormant marketing site. Designer directed a scope pivot (marketing + /blueai-product → dormant; blueai-desktop → active), then the DS build: CSS extraction → live style guide → 19 sections → size-scale consolidation.
**Built:** `blueai-desktop.css` (extracted, byte-verified), `blueai-icons.js` (29 icons, generated from the product's own paths), `style-guide.html` (19 sections, 77% self-measured coverage, every number computed at load), `ds-drift-check.js` (8 checks, gates the one part that can't be automatic), and a size-token scale (6 text steps + 4 display + 2 glyphs, 9 radii).
**Corrections — the pattern that defined this session.** Three escalating instances of ONE defect: invented icon paths (7 of 16 wrong, incl. a bolt I'd drawn myself), then invented button copy, then an entire invented UI state (the login gate is a real four-step flow; I'd documented one fictional screen with four fictional strings). Each time the mechanism was identical: I could produce something plausible without reading source, so I did. Fixed at the mechanism level, not case by case — the drift check now fails on any specimen string absent from index.html, and it immediately found 4 more cases nobody had reported.
**`designer_caught_count: 11`** — invented login/OOC/composer copy (3), sidebar nav bouncing to the product, theme not persisting, toggles not sticky, divider redundancy ×3 (one on my own fresh work), the missing BYOK path on the Prime branch, and the CTA-weight mismatch. Nearly all are *my* output, and most are the same root cause: writing from memory where I should have read from source.
**Learned (promoted this pass):** taste 39–41 (half-pixel ≠ hierarchy; tokenise every axis or it re-drifts; colour-carried hierarchy needs no size gap), reasonings ×3 (anything writable from imagination must be read from source; have something that didn't build it check the claims; verify at the layer where the failure lives), KB ×6 traps (base-href fragment rebasing, token scope vs fixed-position, the `.bai-scope` alias, pill-radius clamping, ellipsis false positives, pinned generators).
**The most valuable single finding** wasn't a bug in the product — it was that my own verification harnesses were each blind to exactly one thing (comments absent from `cssRules`; JS-rendered icons invisible to a CSS diff; wrapping invisible to a computed-style diff; invented names hidden by a `|| ''` fallback). A more thorough version of the same check would have caught none of them.
**Verified:** drift check green (8/8); fidelity harness 0 real mismatches across 19 appearance properties; scale migration proven as zero computed drift + pixel-identical pill radii + no new wrapping at 290/380/920px × both themes; zero JS errors throughout. Pushed through `4a0bb0d` + the tranche commits.
**Watch next:** (1) **evolution.md is now the stale file** — it hasn't been touched since S8 and this session was a genuine capability shift (agent-assisted auditing, mechanical gates); it needs a phase read. (2) Tranche 3 is with the designer as an artifact — apply exactly their selection, nothing more. (3) The `/blueai-product` 07-06→07-10 backlog is now THREE sessions overdue. (4) The parity-audit scratchpad thread (cont. 11–17) remains deliberately unpromoted and still needs its own pass.

---

## Session 11 — 2026-07-24→25 — /blueai-desktop AI Credits screen + OOC modal redesign, audit triggered by designer's own meta-question
Freshness check: taste ✓ (rule 38 added) | decisions ✓ | knowledge-base ✓ (first blueai-desktop section) | project-insights ✓ (first blueai-desktop section) | reasonings **CREATED — did not exist for blueAI before this session** | evolution NOT touched this pass (see gap below) | session-logs (this entry)
**Screen:** `/blueai-desktop` (the standalone "modern terminal" prototype — DS-unbound per taste.md's scope note, craft gates still apply). NOT the marketing site any other session-log entry covers.
**Mode:** live-reviewed iteration — designer watching the browser directly, screenshot-driven correction loop, no Playwright screenshots between rounds except for first-time-wiring verification (per the standing skip-screenshots rule) + one real-mouse-travel test for a hover-reachability bug.
**Built / changed:**
- AI Credits screen: rebuilt the Prime-upsell branch off a plain centered-text stack onto the header's own ring-gauge + bordered-card language, then extended that to all 3 other branches for consistency; added a `.bai-set-btn.hero` CTA-weight modifier; added a missing BYOK action to the Prime-member branch; removed 2 redundant dividers + fixed a real margin/gap-stacking proximity bug (measured, not eyeballed).
- Header credit hover-popover: fixed a wrong `cursor:default` on a genuinely-clickable element, added a "View details" affordance, fixed a real "closes before you can reach it" hover-gap bug (verified with real stepped mouse travel), then removed a redundant divider I'd added to my own fix in the same session.
- OOC (out-of-credits) modal: mode-specific titles + icons + inline-emphasized key facts, replacing one generic "Out of credits" title shared across all 3 modes; explicitly did NOT port the credits screen's ring/card treatment (different job — always-zero interrupt vs. variable-status dashboard).
- Full detail + reasoning for every item above: `decisions.md` rows dated 2026-07-24/25.
**Corrections (all designer-driven):** the 8 decisions.md rows above are each a direct designer catch or ask — no VDA-initiated redesign shipped without one.
**Learned — this is the entry that matters:** designer asked directly *"did VDA learn from all of this... is it learning the right things?"* — the exact documented Gate-6 hard-fail trigger (workflow.md: "the asking IS the failure," pointed at scratchpad during a session, decisions.md after). Honest accounting: scratchpad WAS being written correctly in real time all session (8 entries, one per correction, each with a "why") — Gate 6a held. But NO audit pass had run — Gate 6b was 0/1 until this entry. Ran it now, triggered by the question itself: promoted all 8 scratchpad entries to decisions.md, ran the Generalization Probe on each, promoted 2 to taste.md/reasonings.md (divider redundancy; role-vs-visual-family reuse), 2 to knowledge-base.md (flex-gap+margin stacking; hover-reachability testing technique), 1 to project-insights.md (BYOK/Prime coexistence). **Found reasonings.md never existed for blueAI at all** — created it this pass. **Scope of what did NOT get promoted this pass, stated honestly, not hidden:** the Session 10 backlog note ("07-06→07-10 backlog still pending") is STILL pending — that's `/blueai-product` work, a different area, untouched here; and the large `/blueai-desktop` parity-audit thread (scratchpad's "cont. 11–17" entries, its own multi-session body of work on a state-machine matrix, unrelated to this credit-screen/OOC-modal thread) is also still sitting unpromoted — deliberately left alone since consolidating someone else's in-progress multi-session audit without full context risks doing it wrong; it needs its own dedicated audit pass, flagged separately, not folded into this one.
**Recurring category confirmed 3× in ONE session (now codified, taste rule 38):** adding a divider where an existing signal (label margin, card border, color+weight+icon) already marks the boundary — caught on 3 different elements, including one I introduced AND redundantly decorated in the same session (the "View details" divider).
**designer_caught_count: 5** (2 dividers beyond the first I removed proactively; the label margin/gap-stacking inversion; the hover-popover gap-crossing bug introduced by my own "View details" addition; the redundant divider on that same addition) — all 5 are misses in work VDA itself shipped this session. Separately, NOT counted in that figure (pre-existing product observations, not VDA-shipped flaws): the header popover's wrong `cursor:default` and the OOC modal's generic title both predate this session's work — real, valuable catches, different category.
**Drift check (Check 10, VDA-HEALTH-CHECK):** all 8 promoted decisions are design/UX calls (reuse, hierarchy, spacing, role-matching) — 0 are process/git/build content. Passes clean.
**Verified:** Playwright used selectively — full multi-state sweeps for the credits-screen rebuild and the OOC modal (all branches/modes screenshotted + text-asserted), a dedicated real-mouse-travel test for the hover-reachability fix, `getBoundingClientRect` measurement (not eyeballing) for both divider/spacing questions. Zero JS errors across all verification passes.
**Watch next:** (1) the `/blueai-product` 07-06→07-10 backlog is now TWO sessions overdue for its own audit — flag again if a 3rd session passes without it. (2) The parity-audit scratchpad thread needs its own dedicated consolidation pass, separate from this one. (3) Apply the AUDIT-TRIGGER HABIT forcing function for real this time: don't wait for the designer to ask again — if 5+ scratchpad rows accumulate in a session with no audit, trigger one voluntarily before they have to.

---

## Session 10 — 2026-07-10 — Chat "Warning" state, PM design-file review, AI Mode (Hybrid) feature
Freshness check: taste ✓ | decisions ✓ | knowledge-base ✓ | project-insights ✓ | evolution ✓ | scratchpad NOT promoted (07-06→07-10 backlog still pending — getting long, audit due soon)
**Mode:** continuation of Session 9's `/blueai-product` thread (no fresh VDA bootstrap needed, same product/session lineage). Two pushes.
**Built / changed:**
- **Chat screen — genuine Warning state.** Found the amber tone existed but was dead code (mis-named `input`, never wired to render). First pass added an outcome-toggle-then-type flow; designer corrected it to a single "Chat states" toggle showing all tones at once (`ChatStatesPreview`) — cleaner UX, matches how other preview rows are direct state-pickers not "flag then go trigger manually." Caught a real WCAG fail on the error bubble (`#e07070`/`#fdecec` = 2.74:1) — fixed to `#991b1b` (7.28:1), measured not eyeballed. Then a PM Slack thread revealed the amber tone is actually the LIVE product's "Human input required" state (don't touch) — renamed it `needsInput`, and built a genuinely separate `WarningBubble` (orange, non-terminal status-style container, since a real warning shouldn't imply the exchange ended).
- **PM design-file review.** Diffed two Claude Design zip exports; UIUX project untouched since June 13 (one pasted reference image only). Onboarding project had 2 real findings — a new "Relax Onboarding" pitch (dropped, exploratory) and a new "AI Mode" Settings concept (confirmed live, implement it). Delivered as an Artifact.
- **AI Mode (Cloud/Hybrid) feature, new `ai_mode.jsx`.** Confirmed the "(standalone)" source file = v2's code re-bundled, not a further iteration, so v2 is latest — ported faithfully (Auto vs Custom method split, conflict detection, simulated download state machine). Card chrome matched to the PRODUCT's existing Settings-card style over the design source's flatter chrome; modal reuses shared `ModalOverlay`. Two states unreachable by clicking (hw support, model conflict) got 2 rows in the existing floating Preview panel, gated to the Settings tab — deliberately did not replicate the source's full internal scenario-tester (PM tooling, not shipped surface).
- **Two overflow bugs, both designer-caught from screenshots:** new Preview-panel rows overflowed the panel's fixed width (shortened labels to match the panel's existing terse convention); the Hybrid card's pending tag ("Choose a method") spilled past its border. First fix (`flexWrap`) stopped the overflow but caused a WORSE problem — the card visibly grew on click. Designer called this out directly ("changing container on click feels like a bad UI interaction, isn't changing the tag smarter?") — right instinct; measured the real margin (not an estimate) and landed on "Pick method" with genuine headroom, verified card height is byte-identical before/after click.
**Recurring category watched:** #2 (novel motion/interaction + faithful replication) plus a new one worth tracking — **interaction-triggered layout shift**. Two of this session's catches (chat-states-toggle correction, tag-overflow-then-reflow) were both "my fix technically works but changes something ELSE mid-interaction" — worth a taste rule if it recurs again.
**`designer_caught_count: 6`** (chat-states toggle model · error contrast · warning-vs-needsInput mislabel · preview-panel overflow · card-tag overflow · reflow-on-click pushback). None were Gate-8 stale-memory misses — all were either real accessibility/product-fact corrections or genuine UX refinements on brand-new work.
**Verified:** full Playwright coverage per feature (states, AI Mode Auto+Custom flows, both overflow fixes); `next build` green before both pushes; 0 real console errors. Pushed `7c554d5` + `0b5b648`.
**Watch next:** run the AUDIT PASS — scratchpad backlog now spans 07-06 through 07-10, it's overdue. Blue AI cinematic-homepage project (separate, non-notebook scope) untouched this session — still at spec+wireframe+shot-list, storyboard is the next step whenever the human returns to that thread.

---

## Session 9 — 2026-07-06→07 — /moneymaker variants finished + /blueai-product onboarding & BYOK-in-Settings
Freshness check: taste ✓ | decisions ✓ | knowledge-base ✓ | project-insights ✓ | evolution ✓ | scratchpad NOT promoted (07-06/07-07 entries pending next audit)
**Mode:** long active build across two areas; VDA bootstrap fired (blueAI). Two pushes.
**Built / changed:**
- **/moneymaker** — closed out the 2 new variants (Mission Control, Capital Shift): custody-arrow geometry fix (gap 8→34), and the Capital Shift hero "empty right" → tried center + right-presence, designer reverted to centered (clean revert, no dead code). Pushed `a715854`.
- **/blueai-product ONBOARDING** (logged-out) — chrome-free welcome picker (App-level `onbPhase`), `login.jsx` onboarding gate = the design's `creditsfirst` 500-hero, onboarding chat greeting + hint pill + prefilled composer, **auto-send after login** (designer correction), greeting clears on send, matched 1:1 to the cloud design ZIP (real BAILogo2 sparkle, deeper card palette, game/discover/social glyphs), hover sweep on all login CTAs.
- **/blueai-product BYOK** — relocated from inline popups into a **staged Settings section** (`byok_settings.jsx`, all geos), simplified OOC popup → routes to Settings + highlight, credits-screen context row. Then made BYOK **universal + a master switch** (PM insight): `byokActive = keyAdded && byokOn` → "Running on your own key" credit screen (credits PAUSED not consumed, any geo), send-not-gated, and the **preview toggler retains/mirrors** the byok state in every geo (progressive disclosure).
- **Independent UX audit loop** (designer-requested): ran a fresh-eyes auditor subagent over all updated screens; round 1 invalid (bad capture harness — fixed with per-shot state asserts), round 2 triaged (fixed 3 em-dashes; rejected hallucination + by-design + misread findings; flagged pre-existing/copy items).
**Recurring category watched:** #2 (novel motion/interaction + faithful replication) — held up well; the real misses were a broken-capture-harness (my tooling) and a couple genuine catches (custody arrows, hero-empty-right, footnote alignment).
**`designer_caught_count: 6`** (custody arrows · hero empty-right · auto-send-after-login spec · greeting-clears · footnote alignment · onboarding fidelity-vs-source drift). Most were design-match refinements from the uploaded ZIP, not stale-memory Gate-8 misses.
**Verified:** full Playwright coverage per feature; `next build` green before both pushes; 0 real console errors. Pushed `a715854` + `d82b4f0`.
**Watch next:** run the AUDIT PASS to promote the 07-06/07-07 scratchpad backlog; 2 flagged items await designer greenlight (default-flow em-dashes, lowDot<1000 threshold).
**Cont. (07-08, same session):** BYOK-screens PM-feedback loop, multiple rounds, all pushed (`b710bb1`, `1e39683`) — popup copy · delete-key-on-toggle-off (no "key-off" state) · per-sentence wrap (taste 14) · credits-screen BYOK cards redesigned to carry the screen · paused-note removed as redundant · invite card simplified (dropped 3 benefits; "square" = moderate not literal 1:1) · static radar halo on the key (absolute rings that overflow the badge → no layout shift). `designer_caught_count` for the day ≈ 7 (all PM copy/design refinements, no Gate-8 correctness misses). Also spun up a SEPARATE project (not blueAI-notebook scope): the Blue AI cinematic homepage bible + scrollytelling wireframe — see `blueai-homepage/` + memory `project_blueai_homepage_bible`.

---

## Session 8 — 2026-07-03 — THE OVERDUE AUDIT PASS + the /moneymaker directive
Freshness check: taste ✓ (updated this audit) | decisions ✓ | knowledge-base ✓ | project-insights ✓ | evolution ✓ | scratchpad WIPED (59 entries promoted)
**Mode:** designer-triggered audit ("complete the audit first"), then the /moneymaker build begins.
**Audit did:**
- Promoted the 06-13→06-24 backlog (~59 entries): **taste 34–37** (generation-time controls only · controls must respond · user-content areas quiet/app-like · nest-card-inside-wrap) + **rule-32 SCOPE CLAUSE** (island governs standalone funnels; hub conversion = conscious role change); **14 decisions rows** (clone scrapped · hub conversion · 1200/24 column · SG scope=marketing-DS-only · the whole creator-v2 concept saga · Pexels-not-scraping · freemium/share/install mock funnel · portaled dropdowns · sample-prompt library · scope cuts · mobile pass · waitlist · /moneymaker directive); **KB era section** (AnimatePresence orphan · popover escape kit · WebGL sizing · .next contention fix · verification traps · licensed stock · typewriter-as-placeholder); **project-insights** route-map truth (finalized homepage, deprecated-on-disk list, experiments, WAITLIST_URL) + parked-removal + copy-debt flags; **evolution** S6.5 backfill + S7 + S8 (category #2 → 5th validation).
- **Code:** removed the dead Ldv2Nav/Ldv2Footer CSS from live-demo-v2.css (flagged 06-16; zero .tsx usages verified) incl. its responsive rules. Build verified (see below).
- **Backfilled** the unlogged 06-16→06-18 interim (below) from the scratchpad.
**New scope decision (designer):** `/moneymaker` — a standalone, **DS-UNBOUND**, award-winning "BlueAI as moneymaker" homepage (lineup: Trading · Prediction-markets · Creator-monetize · Arbitrage; premium + trust; GSAP/three.js signature). Craft gates travel; the marketing-site taste does not.
**`designer_caught_count: 0`** (audit session).
**Watch next:** /moneymaker is 100% novel motion/interaction — category #2's home turf. Pre-present walk-through (all states × breakpoints × the designer's actual viewport) is mandatory.

---

## Interim sessions — 2026-06-16 → 06-18 (BACKFILLED at the S8 audit from the scratchpad)
Three working days that were never logged (S7's note flagged this). Summary: **06-16** — /live-demo-v2 promoted island→hub + declared the FINALIZED homepage (shared MarketingHeader/Footer, worker-card links, content column 1200/24); SG re-scoped to the surviving marketing DS (8 deprecated entries + the in-app Components/App-PM groups removed, worker card + header-override added); then the **creator-v2 studio concept** built end-to-end on /ai-video-creator-v2 (three.js gradient hero + typewriter placeholder + interactive pills/templates/generate, Pexels-licensed media, freemium login→library mock, share→publish→installer funnel, sample-prompt popups, portaled CreatorSelect dropdowns, sections added/cut on designer scope). **06-18** — creator-v2 mobile pass (banner nest, library 2-col, full-width CTAs, tap targets) + the desktop hero-padding follow-up. `designer_caught_count: ~9` for the era (see evolution S6.5 — interaction/overlay cluster again). All promotions for these days landed at the S8 audit.

---

## Session 7 — 2026-06-24 — Primary CTA → "Join the Waitlist" (site-wide, pushed)
Freshness check: taste (STALE 11d — pending-audit backlog, not rot) | decisions (STALE 11d — same) | scratchpad (60 pending entries — 06-16→18 creator-v2 + today; FLAGGED at bootstrap) | knowledge-base ✓ | evolution ✓ | project-insights ✓
**Note:** sessions 06-16/06-17/06-18 (creator-v2 overhaul, dropdowns, mobile pass) were never written here — their work lives in the scratchpad backlog. This entry continues the numbering from S6; treat the scratchpad as the source for the unlogged interim.
**Mode:** short active session — open dev server → single copy change → scope-clarify → site-wide swap → push.
**Built / changed:**
- Site-wide CTA copy **"Download BlueAI / Download for PC / Get BlueAI free / Hire a worker" → "Join the Waitlist"** across MarketingHeader, all 3 hero variants (HeroCta + HeroStage + DownloadCta×2 in BaiHome), the 4 agent pages, /seo, /live-demo-v2 header, and the style-guide demo.
- Added **`WAITLIST_URL` SSOT** (`#waitlist` placeholder) in site-data.ts; dropped external/new-tab on repointed CTAs.
- **Caught the deprecated-page mix-up myself:** the designer's screenshot was `/hero/3-cards` (deprecated), not the finalized `/live-demo-v2` — flagged before editing; designer then chose site-wide.
- **Flagged-not-changed (designer: "nothing more for now"):** contradicting body copy ("It is live", "Free to download", the ldv2 "Download BlueAI" step, agent "Download BlueAI to…"), /developer "Claim 25,000 Credits" CTA, /ai-video-creator-v2 install-flow CTA. Logged as known debt.
**Verified:** tsc EXIT 0 · all 7 surfaces SSR 200, no stale CTA labels · pre-push `next build` 19/19 · pushed `a0d97ea` → arpityadav-bst/blueai-screen-library main.
**Corrections (designer-caught): 0.** No Gate-8 misses — scope clarified upfront, deprecated-page catch was mine.
**`designer_caught_count: 0`.**
**Watch next:** the AUDIT PASS is overdue (60 scratchpad entries) — run it before more design work; wire the real waitlist URL.

---

## Session 6 — 2026-06-13 — live-demo clone + DS redesign (/live-demo-v2) + signature motion + audit
**Screens:** /live-demo (byte-exact PM clone) · /live-demo-v2 (DS redesign) · /style-guide (v2 coverage) · / (index)
**Mode:** clone → DS redesign → heavy iteration on signature motion → token pass + audit.
**Built / changed:**
- **/live-demo** — static passthrough clone of the PM's `blue-ai-demo` (2 HTML files in `public/`, hash-verified; redirect-not-rewrite). Exempt from DS.
- **/live-demo-v2** — DS redesign of the funnel: scoped `.ldv2`, `ldv2/` components + `ldv2-data.ts`, reused legacy scenes, framer motion (staged hero, parallax orbs, count-up stats, scroll-drawn how-it-works line, gradient-pan CTA band). **Docking widget** + **blueprint→beam-wipe assembly intro** signatures. Widget reskinned to DS (token-mirror :root; flow/login byte-identical). Trust row added; agent-mind lattice added then **removed** (designer call).
- **Token pass:** +`--bai-star`, `--bai-mkt-green-ink` (31 raw→token across 6 files), `--bai-cta-band`. **SG coverage:** 3 tokens in Foundations + v2 patterns (trust/stats/quote/why/motion) in Marketing-pages group.
- Mobile fixes (header declutter, badge clearance); logo→vector at orb sizes; many motion/overlay fixes.
**Corrections (designer-caught):** ~8 — logo circle-in-circle (×2), docked cropping, badge obstruction, badge too harsh, footer-over-widget z-order, two pulsing dots, lattice + blueprint-merge, mobile header + flag. + brief-scope (island/funnel, login wall is intentional).
**Learned:** taste 30 (signal lifecycle — retire, don't restyle) · 31 (hero-artifact label stays quiet; frosted over arbitrary bg) · 32 (landing = island funnel; product gates aren't friction) · 33 (re-verify floating/animated elements across all states+breakpoints). KB: framer snaps clip-path (use CSS) · double-spread clobbers `animate` · `var()` in SVG attrs DOES work (retracted prior claim) · ancestor z-index caps fixed children · scale-don't-reflow minis · redirect-not-rewrite for relative iframe src · dev server dies silently (check port).
**Files updated:** taste (30–33), decisions (6 rows), KB (S6 section), evolution (S6), project-insights (routes), shared reasonings (+3). Scratchpad wiped.
**`designer_caught_count: ~8`** (highest yet — clustered on NEW motion/floating/overlay work). **Recurring category #2 — 4th validation; growth edge sharpened to: walk every floating/animated/transient element through all states + breakpoints BEFORE presenting.** Build green (17 routes). **Watch next:** that pre-present walk-through; dev-server stability.

---

## Session 5 — 2026-06-12 (same day, post-S4) — Style-guide architecture + atomic-hierarchy directive + S3 token pass
**Screens:** /style-guide (the big build) · / (index) · all 12 stylesheets (token migration)
**Mode:** designer-led SG refinement (live review) → componentisation directive → audit-pass.
**Built / changed:**
- **SG documentation model:** trimmed ~30 verbose captions to terse roles → built `Anatomy`/`Tok`/`PreviewAnatomy` primitives → applied two-tier (7 heavy components incl. the stacked Marketing-header layout) → **Icons** Foundations section (9 glyphs) → `[id^='tok-']:target` focus rings → "where it's used" notes on radius/elevation.
- **`text-2xs` latent bug:** the SG's entire fine-print tier (129 elements) silently rendered 16px — the class was never defined. One type-scale token fixed all of it.
- **`form-kit.tsx` molecules** (Field/TextField/TextAreaField/SelectField/PillsField/Tabs/FormHead/Agree/Submit) — the field markup was hand-copied 26× across 4 forms; all refactored (Career 67→28 lines, agent bundles shrank ~50%). + SG "Form field molecules" section (all 10, standalone + interactive).
- **Index pared to 3** (SEO Homepage · Hero Options · Style Guide w/ distinct DS treatment, pinned bottom); logo/wordmark → `/seo`. Pushed `0df2090` mid-session.
- **S5 audit (this pass):** `--bai-ink-rgb` + `--bai-shadow-hairline` + `--bai-page-*` tokens, migrated 12 stylesheets (closed the S4 deferral); Tailwind float/overlay → var() SSOT; my own fresh leaks fixed (index iris ring, `text-[10/11px]` arbitraries); SG swatches for every new token; build green; computed values verified identical.
**Corrections (designer-caught): 5 visual + 4 process** — see evolution S5. Headline: the balloon/crush/centered-headers/footnote-cause/role-size were all first-pass SG-build misses (category #2, 3rd validation).
**Learned:** taste 26 (atomic hierarchy is law — the designer's standing directive) · 27 (role vs recipe; two-tier anatomy) · 28 (nav recedes; grouping axis by task) · 29 (width-by-role) · 13 amended (neutral channel + hairline). KB: hash-navigation isn't a reload (the 10-cycle misdiagnosis trap) · click-then-read races React · sg-demo page-root reset · anatomy rows are grep-verified quotes.
**Files updated:** taste (26–29 + 13), decisions (6 rows), KB (S5 section), evolution (S5), project-insights (SG architecture), shared reasonings (+3), scratchpad WIPED.
**`designer_caught_count: 5`** (visual, new SG build). **Watch next:** Gate-8 pre-present pass (3-for-3 now); apply taste 26 from line one; parked: SiteFaq/SeoFaq + the two CTA bands.

---

## Session 4 — 2026-06-12 — Discrepancy sweep across all 6 inner pages, videos, push, + audit/health-check
**Screens:** apply-to-jobs · ai-video-creator · ai-trading-agent · prediction-market-agent · social-rewards · developer
**Mode:** designer-directed fidelity sweep (live-vs-ours, page by page) → then audit-pass + health check.
**Built / changed:**
- **4 agent demos → faithful interactive forms** on a new shared `.jmf-*` kit (`CareerForm`/`CreatorForm`/`FinanceForm`/`MarketsForm`), each inspected element-by-element against the live DOM via the Chrome extension. New `FileUpload` (all-states), `VideoCard` (click-to-play), `glyphs`.
- **Per-agent `seoBlocks`** (always-visible SEO content, 5–7 each), **`hiwHeading`** (fixed hardcoded "From targets to done" leak), **`heroAside`** (apply-to-jobs openings list). Finance **"Every trade" trade-log** section. social-rewards **scattered hero collage** (was tidy columns). Real **videos** in `public/videos/`.
- Pushed to prod (commit `8fbad1a`). Audit cleanup: deleted dead `.jf`/`.ag-stage` CSS, tabs→`aria-pressed`, guarded `video.play()`.
**Corrections (designer-caught):**
- Header "Download for PC" CTA missing the → arrow (S3 debt).
- apply-to-jobs form was a stub diverging from the live (S3 debt) → full rebuild; same for SEO blocks + more-agents emoji/arrow.
- **social-rewards declared "faithful" on a copy-match — the hero composition (collage) was wrong** (genuine S4 Gate-8 miss).
- **FileUpload shipped empty-state-only** — no filled/remove (genuine S4 Gate-8 miss).
**Learned:** composition fidelity ≠ content fidelity (taste 23); render ALL states of a control (taste 24); faithful replication = inspect the SOURCE DOM, not eyeball a stub; shared-template copy must be data-driven (KB); descendant element selectors are specificity traps (KB); SSR-fetch fallback when the extension blocks URL reads (KB).
**Files updated:** taste (23–25), knowledge-base (form kit + 4 rules), decisions (11 rows), project-insights (interactive agent pages), evolution (recurring cat #2 validated 2×). Scratchpad wiped.
**`designer_caught_count: 2`** (social-rewards composition, FileUpload states). **Recurring category #2 (Gate-8 visual misses on new builds) — 2nd validation → codified as taste 23–24.** Watch next session: did I screenshot-verify composition + all control states BEFORE the designer saw it?
**Routing repairs:** none (no misrouted entries found in the health check).

---

## Session 3 — 2026-06-11 — Built the 6 bluestacks.ai inner pages (Social Rewards · Developer · 4 agent pages)
**Mode:** active build — live-site replication via Edge CDP.

Designer: replicate the live bluestacks.ai pages reached from the SEO nav (Social Rewards, Developer) and the
hero's 4 agent cards — "faithful look, our DS underneath," desktop + mobile, like /seo.
- **Inspection via an ISOLATED Edge over CDP** (port 9333, separate user-data-dir — the 2 existing Edge
  windows untouched; mirrors the jhunt pattern). Navigated bluestacks.ai, mapped routes, captured
  desktop+mobile shots + content outlines + exact copy per page (`.scripts/cdp-*.mjs`, gitignored). The live
  pages ARE our DS (it was extracted from this site) → re-expressed faithfully in `--bai-*` tokens + scoped CSS.
- **Shared chrome (scoped `.v-site`, site.css):** `SiteNav` (logo + links/social + Download CTA + the
  opaque-menu + scrim mobile pattern from /seo), `SiteFooter` (copy / links variants), `SiteReveal`,
  `SiteFaq` (accordion). `<Wordmark/>` + `<Sparkle/>` reused.
- **6 pages:** `/developer` (teaser), `/social-rewards` (Reddit collage + 5 steps + quality checklist + FAQ
  grid + dark CTA), and 4 agent pages on a shared **AgentShell** template (nav + hero[copy + per-agent demo]
  + feature + what-is + how-it-works(4) + FAQ + more-agents + dark CTA): `/apply-to-jobs` (job-matches form +
  openings grid), `/ai-video-creator` (video showcase + capability cards), `/ai-trading-agent` (4 paper
  portfolios + benchmark), `/prediction-market-agent` (Polymarket-vs-Kalshi odds table). Per-agent hero
  demos = faithful STATIC reps (design-only). Copy normalized **"Blue AI" → "BlueAI"** (one word);
  directional curly quotes throughout.
- **Wired:** SEO nav Social Rewards/Developer → internal routes (dropped the ↗ external — they're real pages
  now, same-tab, matching live); both hero agent grids (SeoAgentGrid + HeroCards) → agent pages (cards are
  now `<a>`; click navigates, hover still previews the scene); all 6 added to the root Screen Library index.
- **Verified:** every page screenshotted desktop + mobile; `npx next build` GREEN (16 routes; dev stopped
  first per the "never build over a running dev" lesson). **designer_caught_count: 0** (self-run build).

**Watching next:** agent-page hero demos are static — could wire our framer scenes if the designer wants them animated.

**— continued (same day): unified the header + restored the ↗.** Designer: "the header should be the same on
all pages, like the SEO homepage; and where did the ↗ on Social Rewards/Developer go?" → Extracted ONE shared
`<MarketingHeader/>` + `header.css` scoped to the header element (`.bai-hdr`, NOT a page root) so it renders
identically regardless of each page's `.v-*` scope. Put it on EVERY page (replaced SeoNav + the per-page SiteNav,
which differed). Section links resolve to `/seo#…` (work from any page); **Social Rewards + Developer restored as
↗ external / new-tab** per the designer. Deleted the dead SeoNav + SiteNav components + pruned site.css's nav
block (seo-home.css's `.seo-nav` rules left as inert dead CSS — flagged for a later prune). Build GREEN (16
routes); header verified pixel-identical on /seo and the agent pages. **Lesson:** per-page navs drift — one
shared header component is brand-SSOT for the nav, exactly like `<Wordmark/>`/`<Sparkle/>` for the brand marks.

---

## Session 2 — 2026-06-11 — Deployed to GitHub + Vercel; 2 prod build fixes; full audit
**Mode:** active (deploy + bug-fix + audit pass)

**Shipped:**
- **Deployed blueAI like WSUP** — GitHub `arpityadav-bst/blueai-screen-library` (public) + Vercel
  `blueai-screen-library.vercel.app`, git-connected auto-deploy (same Vercel team as WSUP). See
  project-insights → Deployment.
- **Fix 1 (build):** the 3 legacy scenes' `init(v?: object)` helper failed the prod `next build`
  typecheck (passed in dev) — typed it `TargetAndTransition`. Caught only by Vercel's strict TS.
- **Fix 2 (prod-only CSS):** Stage hero heading + agent-scene text rendered CENTER on Vercel, LEFT
  in dev. Root cause: production CSS chunking leaked hero-cards.css's generic `.hero{text-align:center}`
  onto `/hero/stage`; `.hero-right` inherited it. Guarded with `.hero-right{text-align:left}`
  (own-declaration → order/chunk-independent). Verified on the live bundle.

**designer_caught_count:** 1 — the Vercel text-align mismatch (a prod-only bug dev never showed).

**Audit (this session):** promoted the full 2026-06-10 build-session scratchpad (~20 entries) + the
S2 fixes → taste rules 14–18, knowledge-base (Spotlight + Motion/framer + CSS-architecture + mobile
+ token/layout hygiene + Components), decisions.md (6 rows), project-insights (CSS-arch finding +
Deployment). **Entered Phase 2** (Confirmed-correction era). Scratchpad wiped. Build green (no code
change since the verified-green build after Fix 2).

**— continued (rest of 2026-06-11, same session):** after the deploy, the day kept going —
- **Scoping refactor** (the morning audit's "watch") DONE — scoped all 3 hero stylesheets under
  `.v-stage`/`.v-cards`/`.v-original` via `.scripts/scope-css.js`; also fixed the Stage-Original
  `.cv-trend` leak. CSS-leak category structurally closed.
- **Markets = 4th agent card** in the 3-Cards hero (new `MarketsLegacy` scene; grid 3→4 `minmax(0,1fr)`).
- **NEW SEO Homepage `/seo`** — full content-rich search-optimized page from the PM mock (hero w/ 2×2
  animated agents · What-is · comparison · 8-card task hub · 4 steps · FAQ + **FAQPage JSON-LD** · CTA ·
  footer); scoped `.v-seo`; scroll-reveal + ambient `SeoBackdrop` (drifting orbs + rotating logo sparkle).
- **Brand canonicalized (SSOT)** — official logo PNG everywhere + both footers; single `<Wordmark/>`
  (full iris→cyan gradient, "BlueAI" one word); canonical Download-CTA sparkle.
- **Root `/` = Screen Library index** (replaced the redirect); style guide now DS-only.
- **SEO mobile pass** — hamburger overlay nav, top-right gear sparkle, full-width CTAs, frosted FAQ panel.
- **Content-width refined** — full-bleed nav over a contained 1280 column (aligning to the 1640 header read too wide).
All pushed to GitHub + Vercel across the day; everything live.

**designer_caught_count (full S2 day): ~6** (see evolution). The growth edge: my Gate-8 catch-rate on
NEW first-pass builds — I shipped unequal columns, a rule-14 wrap, a POLYMARKET clip, a mobile-nav
push, and a too-wide body, all designer-caught (recurring category #2, named in evolution).

**Close audit (this entry):** code-soundness sweep — removed 5 orphaned CSS blocks + 1 dead class;
no debug, no >300-line files; build GREEN. Promoted the full day's scratchpad → taste rules 19–22 +
rule-14 amendment + 7 decisions + KB (SEO/brand/hygiene/mobile) + project-insights; scratchpad wiped.

**— continued (audit #2, same day): tokenise / componentise / document gate ("every single thing").**
Designer asked to confirm all of today's work is fully tokenised, componentised, and documented — and fix
gaps. Ran a verify-by-reading audit (not assertion). Found + fixed:
- **Componentise:** the canonical Download-CTA sparkle (lucide Sparkles) was inlined in **6 files** →
  extracted `components/Sparkle.tsx` (2nd brand primitive beside `<Wordmark/>`); replaced all 5 CTA copies.
  The scene "generate" glyph (different role, simpler) left intentionally. Now the "ALWAYS this sparkle"
  brand contract is true by construction.
- **Tokenise (Tier 1):** DS-primitive literals hardcoded in scene CSS — `#7B4CFF`/`#0EA4C5` (iris/cyan),
  `#1B1E38` (ink-heading), `#1a90ff` (= `--bai-legacy-blue` exactly) — migrated to `var(--bai-*)` across
  all 7 stylesheets. Also tokenised the `--bai-cta-gradient` definition itself.
- **Tokenise (Tier 2):** the **marketing-surface palette** (slate/blue/blue-2/green/green-wash) was
  redefined identically in 7 files (`--bh-*`/`--seo-*`/`--slate-900`/`--green`) → promoted to global
  `--bai-mkt-*` tokens; per-file locals now alias them; `--bh-orange` folded into `--bai-jobs`.
- **Document:** added a "Download CTA" component card (renders the REAL `<DownloadCta/>`) + a "Marketing
  surface" color group to `/style-guide`. NAV entry added.
- **Tier 3 (deliberately NOT tokenised, stated):** bespoke scene-illustration colors (chart fills,
  creator-pink, success-ink, icon tints) stay local — promoting one-offs would pollute the DS.
- **Flagged frontier:** brand hues still appear as `rgba(123,76,255,α)` washes; needs rgb-channel tokens
  — optional, surfaced for the designer (not silently ballooned).
- **Build gotcha caught + fixed:** a `*/` inside a CSS comment (`--seo-*/--green`) closed the comment →
  "Unclosed block" build fail; reworded. **`npx next build` GREEN** (all 10 routes; zero visual change).
Verified: ZERO brand/marketing hex literals remain in any route stylesheet. Promoted to decisions (+5
rows), knowledge-base (tiering rule + marketing-global + Sparkle SSOT + the `*/` gotcha; superseded the
old "keep marketing locals" note), reasonings (4 cross-project design-thinking principles, the Gate-6.5 gap).
**designer_caught_count for audit #2: 0** — this was a self-run gate (no designer correction); the catches
were mine. Earlier blueAI gap addressed: reasonings.md had zero blueAI design-thinking → now 4 principles.

**Watching next session:** the rgba-wash → rgb-channel-token sweep (if designer green-lights); build the
`<SentenceLines>` helper; retune hero motion timing; keep running Gate 8 + screenshot mobile BEFORE presenting.

---

## Session 1 — 2026-06-10 — Project bootstrapped + full marketing site built
Bootstrap: notebook created this session (first blueAI touch). Taste seeded from the
Claude-design export's designer-authored DS README.

**designer_caught_count:** not yet itemized — designer reviewed the Recommended hero
("a few things aren't right", parked in `design-source/FIX-LATER.md`) and confirmed the
variant-animation handling, then asked me to complete the rest autonomously.

**What built (all verified — `next build` GREEN, 6 routes):**
- Scaffold (Next 14 + React 18 + Tailwind 3.4 + TS + framer-motion) + the blueai-modern
  DS ported to tokens (`globals.css` `--bai-*` + `.bai-*`; `tailwind.config.ts`).
- Homepage (`BaiHome`): intro → 5 feature rows → Skills + Download CTA → 15-card All
  Skills grid → Powered-by → footer. Scoped CSS (`styles/homepage.css`).
- 3 hero directions: **`/` Stage (Recommended, RICH 2-scene agents)**, `/hero/3-cards`
  (LEGACY), `/hero/stage-original` (LEGACY big stage + rail). Agent motion rebuilt
  React-native (framer-motion, phase-driven) — Career/Creator/Finance, rich + legacy.
- `/hero-options` chooser (schematic previews + UX pros/cons + ★Recommended).
- `/style-guide` (colors · type · spacing/radius/elevation · components).
- Handoff docs (README/HANDOFF) + registered blueAI in the root CLAUDE.md VDA bootstrap.

**Decisions (see decisions.md):** rich-vs-legacy split confirmed (Stage=rich; the other
two=legacy, shared scenes); React-native motion over GSAP; per-route-scoped hero CSS +
full-nav `<a>`; marketing sections as scoped CSS, DS as Tailwind tokens.

**Verification:** production build green (6 static routes); each route screenshotted at
1440 (homepage, all 3 heroes, options, style-guide) — all render faithfully.

**Watching for next session:** enumerate + fix the parked Recommended-hero items; retune
hero motion timing vs the original; first real correction cycle → promote taste from
DS-seed to confirmed.
