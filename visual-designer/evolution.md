# blueAI — Evolution
Last updated: 2026-08-11 (S17 added — a 12-item batch + 3 critique rounds on one surface;
`designer_caught_count: 9`, the highest recorded, and the reason is diagnostic rather than alarming — see the
S17 section. Earlier: 2026-08-04 (S16 added — designer_caught_count: 5, the top recurring category changed; see the
new S16 section for what it is and why it matters). Earlier: 2026-08-03 (S13-S15 added — this file was TWO SESSIONS BEHIND and an audit caught it; the stale "rules 38-41" enumeration replaced with a pointer; the current top recurring category corrected. Earlier: S9-S12 era added

> VDA's growth + maturity timeline ON THE BLUEAI PROJECT. Separate from WSUP/now.gg —
> a fresh notebook starts at Phase 1.

## Phase 1 — Bootstrapping (current, entered 2026-06-10)
Session 1: notebook created; taste **seeded from the designer-authored blueai-modern DS
README** (a real spec, not live-site inference — a stronger Phase-1 start than now.gg had).
Full marketing site built in one session: foundation + homepage + 3 hero directions
(1 rich + 2 legacy) + options chooser + style-guide. Production build green.

**Phase 1 markers (all met → Phase 2):**
- [x] Site built and ready for designer review (homepage + 3 heroes + options + style-guide)
- [x] First designer correction cycle logged + promoted (S1 → taste rule 11; S2 build-session
      ~20 corrections + prod fixes → taste rules 14–18 + KB + 6 decisions)
- [x] Recurring correction category identified → see Phase 2

## Phase 2 — Confirmed-correction era (entered 2026-06-11, S2)
S2 met all three Phase-2 maturity markers:
- [x] 1+ designer review cycle with corrections logged + promoted (this audit promoted the
      2026-06-10 build session + the S2 prod text-align catch)
- [x] taste.md rules confirmed/OVERRIDDEN by real review (rule 14 = designer corrected
      `balance`→`pretty` for body — a DS-seed override, not just a seed)
- [x] A recurring correction category named (below)

**Recurring correction category: prod-vs-dev fidelity from shared generic CSS class names.**
The hero variant stylesheets reuse `.hero`/`.pane-title`/`.hero-screen`; production chunking
leaks one variant's rule onto another's route (text-align caught on Vercel; `.hero` padding still
latent). Will keep biting until the stylesheets are scoped under unique roots.

**Active gaps / watch for next session:**
- ✅ RESOLVED (S2): scoped the 3 hero stylesheets under `.v-stage`/`.v-cards`/`.v-original` — the
  CSS-leak category is structurally closed (zero unscoped generic hero rules; verified live). Watch
  the same trap if a 4th variant / shared-name stylesheet is added — scope it from the start.
- **Gate-8 catch-rate on NEW builds — the growth edge (see recurring category #2).** Run the visual
  self-review (and screenshot mobile/responsive) BEFORE presenting, not after the designer catches it.
- A reusable `<SentenceLines>` helper (full-stop wrapping) — candidate, not yet built.
- Hero motion timing is a first-pass approximation of the original GSAP — retune on review.

**Recurring category #2 (named S2-cont): Gate-8 visual misses on first-pass NEW builds.** Across the
4-card + SEO-homepage work I shipped several visual issues the designer caught on review that a
pre-present Gate-8 pass should have caught: the Finance card wider than its siblings (`1fr` vs
`minmax(0,1fr)`), the close-band heading wrapping through the full stop (rule 14), the POLYMARKET
clip, the mobile nav pushing content, and aligning the body too wide. Pattern: NEW builds get the
architecture right but skip the final "read it as a designer / screenshot it" pass. Remedy: Gate 8
is always-on — run it (and for layout/responsive, screenshot) before presenting.

**Count history:** S1 = N/A (build session). **S2 (full day) = `designer_caught_count: ~6`** — prod
text-align (Vercel), Finance card width, close-band wrap, POLYMARKET clip, mobile-nav push,
body-too-wide; + the two-tone wordmark misread (corrected to the full gradient). A heavy BUILD day
(Markets card · SEO homepage · brand SSOT · root Screen Library index · mobile pass · ambient
backdrop) — all shipped live; the growth edge is the Gate-8 catch-rate, not the building.

## S3 (2026-06-11) — inner-pages build
Built the 6 bluestacks.ai inner pages + shared MarketingHeader/Footer chrome. Self-run build, **`designer_caught_count: 0` at ship** — BUT in hindsight the agent demos shipped as simplified static STUBS (wrong fields, missing SEO blocks, omitted sections), which S4 then had to rebuild. Lesson: "build verified green" ≠ "faithful" — a green build with stub content is still incomplete. Counts as a latent completeness gap, surfaced S4.

## S4 (2026-06-12) — discrepancy sweep + audit/health-check (maintenance-heavy session)
Designer-directed full discrepancy sweep across all 6 inner pages: rebuilt the 4 agent demos as faithful interactive forms, added per-agent SEO blocks + hiwHeading + heroAside, real videos + finance trade-log, social-rewards collage, FileUpload. Then this audit-pass (promoted ~17 scratchpad entries → taste 23–25 / KB / decisions; dead-CSS cleanup; a11y + play() fixes) + health check.

**`designer_caught_count: 2`** (genuine NEW-build Gate-8 misses this session): (1) **social-rewards "faithful" on a copy-match alone** — the hero composition (scattered collage) was clearly different, caught on screenshot; (2) **FileUpload shipped empty-state-only** — no filled/remove states. *(The header arrow, the form stubs, the missing SEO blocks were S3-debt surfaced by the directed sweep, not fresh S4 ships — not counted here, but they reinforce the same theme.)*

**Recurring category #2 — VALIDATED A 2ND TIME + now CODIFIED as forcing rules.** Both S4 misses are the same root as the S2 catches: *NEW/audited work gets the architecture right but skips the final "read the RENDERED result as a designer" pass.* Sharpened from a watch-item into actionable Gate-8 taste rules: **23 (composition fidelity ≠ content fidelity — screenshot-verify the rendered layout)** + **24 (render ALL states of a control)**. These give Gate 8 a concrete checklist instead of a vague "review it." 

**Active gaps / watch next session:**
- **The Gate-8 catch-rate is STILL the growth edge** (3rd session running). The new rules 23–24 are the test: next NEW build, did I screenshot-verify composition + check every control's states BEFORE the designer saw it? If the designer still catches a composition/state gap at S5, the rules aren't yet internalized (codification ≠ habit — the same honest lesson WSUP's workflow.md reached).
- Phase 2 holds (not advancing toward Phase 3 until ≥3 consecutive low-caught sessions on NEW builds).
- ✅ RESOLVED (S5): `rgba(8,10,31,…)` neutral-ink tokenisation — `--bai-ink-rgb` channel + `--bai-shadow-hairline` + `--bai-page-*`, migrated across all 12 stylesheets, computed-value-verified identical.

## S5 (2026-06-12, same day as S4) — style-guide architecture day (heavy SG build + the atomic-hierarchy directive)
Built the SG's documentation architecture: notes/titles trim → PREVIEW+ANATOMY two-tier model (Anatomy/Tok primitives, 7 heavy components) → Icons section → token focus rings → the `text-2xs` latent-bug fix (the whole fine-print tier was silently 16px, 129 elements) → form-kit molecule extraction (designer's componentisation check exposed 26× duplicated field markup) → "Form field molecules" SG section → index pared to 3 + the Style Guide row's distinct treatment → this audit's S3 token pass (ink/page channels + hairline; closed the S4 deferral).

**`designer_caught_count: 5`** (visual, on the NEW SG build): (1) `.v-site` page-root balloon — a showcase card took a full viewport; (2) video card crushed to one-word-per-line; (3) sidebar group headers centered/wrapping; (4) the odds-note footnote — I fixed the orphan SYMPTOM (text-wrap) before the designer re-flagged the CAUSE (a prose cap on a table footnote); (5) the anatomy role text at body size (→ surfaced the text-2xs latent bug). Plus 4 process/completeness catches: "hero options" misread (chooser, not the 3 variants); SG captions over-explained (→ the trim + taste 27); fields only CSS-componentised (→ form-kit); molecules left undocumented after extraction (→ the SG section).

**Recurring category #2 — VALIDATED A 3RD TIME.** All 5 visual catches are first-pass NEW-build misses the rules 23–24 checklist should have caught before presenting. Codification ≠ habit, confirmed. **Counter-evidence of growth, same session:** the deferred S4 token pass was completed proactively at audit; my own audit caught MY OWN fresh leaks (the index ring, the type arbitraries, the `.jmf-label` memory-typo via grep); and the misdiagnosis loop (stale reload) was root-caused honestly instead of shipped as a false "Tailwind is broken" comment. The edge is specifically the PRE-PRESENT visual pass on new builds, not auditing discipline.

**New standing directive (designer, S5): atomic hierarchy is law** — taste 26. Every value tokenised, every layer extracted + documented at its level (token/CSS/React). This gives Gate 2/3 a sharper test than "use tokens": *name the layer; trace every value.*

**Watch next session:** (a) the same Gate-8 pre-present pass — category #2 is now 3-for-3; (b) apply taste 26 from the FIRST line of any new build, not at audit; (c) two parked designer decisions still open: SiteFaq-vs-SeoFaq consolidation, dark `.site-cta-band` vs bright `.seo-close` unification.

## S6 (2026-06-13) — live-demo: clone + DS redesign + the signature-motion day
Cloned the PM's homepage byte-exact (`/live-demo`, static passthrough — exempt from the DS), then built `/live-demo-v2` as the DS redesign of the same funnel (scoped `.ldv2`, reused legacy scenes, framer motion). Iterated heavily on two signature moments — the **widget assembly intro** (blueprint → beam-wipe reveal) and the **docking widget** — plus an agent-mind lattice (added, then removed on designer call). Closed with a token pass (--bai-star / --bai-mkt-green-ink / --bai-cta-band) + this audit (SG coverage for the v2 patterns + the 3 tokens; promotion).

**`designer_caught_count: ~8`** (the highest yet — almost all on the NEW v2 build + its animations): logo circle-in-circle (×2), docked widget cropping, badge obstructing the widget header, badge too harsh (black), footer painting over the docked widget, two pulsing dots, lattice "not good enough" + blueprint not merging, mobile header crowding + flag over the trust row. Plus brief-understanding catches (the island/funnel scope, the deliberate login wall) and the "is everything tokenised?" prompt.

**Recurring category #2 — VALIDATED A 4TH TIME, and sharper: novel MOTION/interaction work is where my first-pass misses cluster.** The static layout largely held; the catches were on the things that move/float/overlay (the docked panel z-order, the badge clearance in two layouts, the two animated dots, the blueprint-vs-widget merge). New self-rule for next session's Gate 8: for any floating/animated/transient element, **walk it through every state and every breakpoint BEFORE presenting** — docked + hero, mobile + desktop, mid-animation + settled, over each background it can travel over. That's the concrete checklist this category keeps demanding.

**Counter-evidence of growth:** the diagnoses got faster and more honest — root-caused the framer clip-path snap (→ CSS keyframe), the ancestor-stacking-context footer bug, the signal-redundancy (lifecycle not restyle), and RETRACTED my own wrong "var() in SVG attrs" claim when the lattice disproved it. The fixes addressed CAUSES (wipe-not-crossfade, retire-not-restyle, scale-not-reflow), not symptoms.

**Watch next session:** (a) the floating/animated/breakpoint walk-through above — category #2 is now 4-for-4, still the growth edge; (b) the dev server died silently ~5× this session (check the port before debugging a "broken" route — it's a process-stability issue, not the code); (c) the two parked CTA-band / FAQ consolidation decisions remain open.

## S6.5 (2026-06-16 → 06-18, backfilled at the S8 audit) — hub conversion + SG scope + the creator-v2 studio concept
Three unlogged working days, reconstructed from the scratchpad at S8. 06-16: /live-demo-v2 promoted
island→hub (shared chrome; taste 32 scope clause) + the SG re-scoped to the surviving marketing DS
(in-app groups removed) + the ENTIRE creator-v2 studio concept (WebGL hero, freemium mock, share→
publish→install funnel, sample-prompt library, portaled dropdowns). 06-18: the mobile pass (5 fixes).
**`designer_caught_count: ~9` across the era** — clipped/mis-stacked dropdowns (×2), banner empty→
image, micro-drama "empty", library too loud (→ minimal → panel), inert hero controls, off-theme
native selects, aspect popup crushing landscape, hero top-space (×2 — the second because I fixed the
WRONG BREAKPOINT: designer's screenshot was desktop, I patched mobile).
**Recurring category #2 — VALIDATED A 5TH TIME, same cluster:** novel INTERACTIVE/overlay work
(dropdowns, modals, popovers) is where first-pass misses live; static layout mostly held. New concrete
sub-rule from the era: *check WHICH viewport the designer is looking at before scoping a responsive fix.*
**Counter-evidence of growth:** caught + fixed my own mobile regression pre-present (worker-title wrap);
held the IP line on scraping twice; honest "the v1 videos never existed" finding; root-caused the
AnimatePresence orphan + portal traps into reusable KB patterns.

## S7 (2026-06-24) — waitlist swap
Short directed session, `designer_caught_count: 0` — scope clarified upfront, the deprecated-page
mix-up caught on my side. (Logged same-day in session-logs; counted here for the phase record.)

## S8 (2026-07-03) — the overdue audit + the /moneymaker directive
Promoted the 59-entry backlog: taste 34–37 + the rule-32 scope clause, 14 decision rows, the KB
creator-v2 era section, project-insights route-map truth, this file, the backfilled logs; dead
Ldv2Nav/Footer CSS removed; scratchpad wiped. **Phase 2 HOLDS** (S6 ~8 → S6.5 ~9 → S7 0: the low-caught
S7 was a copy swap, not a new build — the phase-3 bar stays "≥3 consecutive low-caught NEW builds").
**Next build = /moneymaker:** a DS-UNBOUND, award-winning standalone (designer directive). The craft
gates travel even though the skin doesn't — and it's ALL novel motion/interaction work, i.e. category
#2's home turf. The test for this build: walk every floating/animated/interactive element through all
states + breakpoints BEFORE presenting, and verify at the viewport the designer will actually view.

> **SUPERSEDED 2026-07-25 by the SCOPE PIVOT — see S9-S12 below.** /moneymaker WAS built — three
> variants exist at src/app/moneymaker/ (they arrived in the other-machine sync; a note here claimed
> "never started" for a few hours on 2026-08-01 because it was written from the S8 plan instead of
> from `ls src/app` — the exact write-from-memory failure this notebook keeps cataloguing). It is
> DORMANT with the rest of the marketing surfaces, and the
> "DS-unbound" framing above is now backwards: the active surface HAS a design system, and it is the
> one thing new work is bound to. Left in place as the record of what S8 believed, not as direction.

## S9-S12 (2026-07-25 → 2026-08-01) — the scope pivot and blueai-desktop's design system
**The project changed shape.** Designer directive: the marketing site and `/blueai-product` are both
dormant; **`/blueai-desktop` (the "modern terminal" prototype) is the only active surface.** Rules 1-37
of taste.md describe the dormant site and are no longer what Gate 8 reviews against; the CURRENT rule set in `taste.md` (deliberately NOT enumerated here — this line said "rules 38-41" while 42-45 were already live, which is the same stale-list defect `blueai/CLAUDE.md` diagnoses about itself; the file is the list) and
`public/blueai-desktop/style-guide.html` are.

**What got built:** blueai-desktop had no design system at all — every DS artifact in the repo
documented the dormant site. Extracted 918 lines of inline CSS into `blueai-desktop.css`, built
`style-guide.html` as a *view* onto it (links the real sheet, renders real components, computes every
number at load), documented 19 sections, then tokenised the size and radius scales (20 font-sizes → 12
tokens; 15 radii → 6) across three tranches, the last of which went to the designer as an accept/reject
artifact because those six changes were visible taste calls, not cleanups.

**The era's defining defect, three escalating instances:** invented icons → invented copy → a
four-state login flow documented as one invented state. All three had the same mechanism — a specimen
written from memory instead of read from source — and all three were caught by the designer comparing
screenshots, never by me. The structural answer was `ds-drift-check.js` plus inverting vda-core's
deferred-Gate-5 cadence: **here, specimen sync is inline/same-edit**, because deferring a hand-written
specimen doesn't produce staleness, it produces fabrication.

**Recurring category #2 (novel interactive/overlay work) — VALIDATED A 6TH TIME**, and it now has a
sharper edge: the skill-switcher reflow bug lived in an *interaction state*, and the reason my own
checks missed it is that they swept widths and themes while holding selection fixed. New sub-rule:
*if a style is state-dependent, the state IS a test dimension.*

**Counter-evidence of growth this era:** built the gate that makes the recurring defect machine-
catchable; corrected three of my own false claims in the very files meant to prevent false claims
(the icon header twice, the token list once); caught a real regression in my own icon migration before
it shipped by snapshotting 362 rendered SVGs; negative-tested the new check by reintroducing the bug it
was written for, rather than trusting a green run.

**Phase 2 still HOLDS, and the bar has not moved.** Phase 3 needs ≥3 consecutive low-caught NEW builds.
This era was infrastructure and correction work, not new builds — `designer_caught_count: 11` for S12.
Nothing here counts toward the phase-3 bar; recording it as progress would be exactly the kind of
self-flattering accounting the notebook exists to prevent.

**The honest maturity read (2026-08-01):** onboarded *structurally*, not yet *habitually*. Bootstrap,
operating contract, drift gate and notebook all exist and work. The gap is generalization — taste rule
41 already covered the switcher bug and never fired, because it had been written at the width of the
single example that taught it. **What Phase 3 actually requires here isn't more rules, it's rules
stated at the level of the mechanism.** Gate 6.5 (Generalization Probe) is the gate for this and it
did not run. Next session: promote the three pending scratchpad threads, and run 6.5 on every rule
promoted rather than only on new work.


## S13-S15 (2026-08-01 → 2026-08-03) — tranches, the Scheduled rebuild, and the first real self-audit

**The ledger this file was missing.** `designer_caught_count`: **S13 = 2**, **S14 = 11**, **S15 = 1**.
S14's 11 needs its shape, not just its number: NINE were the designer pointing at a SIBLING surface after
I fixed the first instance of a pattern — one process failure repeated, not nine separate misses.

**The current top recurring category is `fix-one-forget-the-siblings`** — a fix to a pattern is not done
until every instance of the pattern has been visited. This SUPERSEDES "recurring category #2" (Gate-8
visual misses on first-pass new builds), which this file had been re-validating up to a 6th time. Recording
the handover explicitly because a phase tracker two sessions behind hands the next session the wrong thing
to watch, which is exactly what happened.

**S15's single catch is that category's next relative, and worth naming as its own shape.** The designer
asked why Scheduled's form had gained a container whose width didn't match the rest of the screen. Both
halves were right. The wrapper was months-old code I had *inherited* while rebuilding everything inside it
— so the codified rule that governs it (38, redundant signals) could not fire, because every wording of it
gates *additions*. **Inherited code is not background; when you touch a surface, what is already on it is in
scope.** Fixed at the rule, not just the surface: 38's fail-to-fire clause was wrong and is now corrected,
and rule 46 states the same fact from the container's side.

**Counter-evidence of growth, S15.** The form's full field set, its conditional matrix and all 14 states
were built and self-verified without a designer round; four defects were caught by my own Gate-8 pass
before presenting (a solid-fill glyph beside stroke siblings, a two-line reservation under one-line copy,
a commitment action scrolling off a now-scrolling form, a footer hairline with dead air beneath it); a
self-inflicted CSS break was caught by an assertion on a *computed* value rather than by a screenshot; and
one shared-treatment claim I had written in prose was converted into an enforced `ds-drift-check.js` §12
family with both failure branches negative-tested.

**Phase 2 still HOLDS.** S15 was one substantive NEW build with `designer_caught_count: 1`, which is the
first genuinely low-caught new build of this era — but the Phase-3 bar is **≥3 consecutive**, so this is
one of three, not an arrival. Counting it as more would be the self-flattering accounting this file exists
to prevent.

**The honest maturity read (2026-08-03), updated.** Last session's read was "onboarded structurally, not
habitually," with generalization named as the gap. That diagnosis held and produced a measurable result:
the S15 catch was *itself* a generalization failure in a rule that had already been amended twice. The
newer gap is one level up — **promotion is stalled and biased.** An independent audit this session found
that the design reasoning is being captured well but almost entirely in `scratchpad.md`, while what reaches
the permanent files skews to checker internals; 17 entries had gone unpromoted across two sessions, and the
mandated per-5-session self-audit had never once been written. Both are addressed this session. **What
Phase 3 requires from here: promote every session, and route design reasoning to the design files.**

## S16 (2026-08-04) — landscape color pass: a real regression, and a caught_count worth being honest about

`designer_caught_count: 5` — no rounding down. In order: (1) Account hidden with no sign-in path when
logged out; (2) an external product claim ("ChatGPT/Notion/Linear do exactly this") cited from memory,
unverified, and wrong; (3) a fix applied to dark theme only, on reasoning that didn't survive contact with
"the reference was a philosophy, not a per-theme value"; (4) the wrong PAIR grouped (header+chat by
adjacency, not header+sidebar by role) AND the wrong direction (darker instead of lighter); (5) a real
regression — the wide-mode header's animated pixel logo silently stopped rendering, because an opaque CSS
background painted over a canvas that had been relying on staying visible through a transparent DOM layer.

**This is five, not one, and S15's "one of three toward Phase 3" resets rather than becomes "two of three."**
A session with `caught_count: 5` is not a low-caught session by any reading, and counting it as progress
toward the ≥3-consecutive-low-caught bar would be exactly the self-flattering accounting this file exists
to refuse. Phase 2 holds; the streak restarts at zero.

**What's actually new here, worth separating from the count:** catches (2)+(3)+(4) are instances of
mechanisms ALREADY named in this notebook (unverified claims, role-vs-family, a philosophy scoped to one
theme) — each got a fresh instance added to its existing reasonings entry rather than a new principle,
which is the notebook working as designed, not drifting. Catch (5) is genuinely new, and worth stating
plainly: **verification checked the property that was CHANGED (does the header's background color now
match the sidebar's?) and never asked what else might depend on that property's PREVIOUS value (a canvas
relying on the header staying transparent).** That is a sharper, more specific failure than
`fix-one-forget-the-siblings` (S14's top category) — this isn't forgetting a sibling surface, it's a
verification pass that is scoped to the stated change and blind to the change's blast radius. **New top
recurring category: verify the blast radius, not just the stated property.** `fix-one-forget-the-siblings`
is not retired — it simply wasn't what this session's catches were — but it stays the thing to watch
second, behind this one, until it recurs enough to reclaim the top slot.

**Counter-evidence of growth, still real:** the Account/login fix caught and fixed its own §10 violation
before shipping (a `data-bai-icon` attribute on dynamically-built markup — exactly what that gate exists to
fail on); once the design principle WAS understood correctly (round 2 of the color work), the reversal was
executed cleanly with full regression verification in one pass; and the regression itself, once reported,
was root-caused correctly on the first attempt (identified the canvas mechanism, not just "add a z-index and
hope") and fixed at the actual layer rather than patched around.

## S17 (2026-08-10 → 08-11) — a 12-item batch, two new taste rules with a machine gate, and the highest caught_count on record

`designer_caught_count: 9`. Highest ever recorded here, and the number needs reading correctly rather than
softening: **it is high because the session was mostly CRITIQUE, not mostly BUILD.** The 12-item batch itself
came in at 2 catches across 12 items; the other 7 came from four rounds where the designer looked at ONE
surface and asked, in escalating specificity, whether it was actually good — the help-icon aspect, the two
toast rounds ("does this look delightful," then "elements need to be properly aligned"), and the Schedule
gutter. That is a different activity from shipping features, and it produces catches by design. Recording it
as 9 anyway, un-normalised, because the alternative — inventing a "critique rounds don't count" carve-out —
is exactly the accounting this file exists to refuse.

**The 7 critique catches, and what they have in common.** (1) the Skills help icon was 24×32, the app's only
portrait control; (2) `#baiTitleBtn` at 306×14 and (3) `.bai-menu-help` at 18.7×16, both below every other
control in the app — found only because the designer's question forced a census; (4) the toast's two states
were differentiated by a single 16%-opacity channel; (5) the toast row was `flex-start` with two magic-number
hacks compensating; (6) Schedule's list sat 2px under the tab strip where every sibling surface sits at 14px;
(7) the Membership preview row overflowed its own panel. **Every one of these is a MEASURABLE property that no
gate measured.** None required taste to find — they required someone to look, or something to measure. Four of
the seven (1,2,3,7) are now machine-caught; two (5,6) are now codified as rules with stated diagnostics; one
(4) is a judgement call that stayed a judgement call.

**What's genuinely new: the first taste rule to ship WITH its own runtime gate.** Rule 48 (box shape is an
output; owe the travel axis a floor) is enforced by `icon-target-audit.js` — 18 surfaces × 2 widths, 110
control instances, exit-code-1 on violation. Previous rules were prose that a future session had to remember
to apply; this one fails a command. That is the shape the notebook has been reaching for since the `§12
family` work, and it arrived here without being asked for. **Rule 49** (align a mixed-height row on the axis
that survives a content-length change) is prose, but ships with an explicit *diagnostic* — "if you're adding a
magic-number nudge, the alignment reference is wrong" — which is the next best thing to a gate.

**And the gate got the trap it was built to catch.** `icon-target-audit.js`'s first run reported **54 false
failures** because it measured with `getBoundingClientRect()` against a px floor while `#scaler` was scaling
the whole app — the identical coordinate-space defect `placeFloating()` had produced 24 hours earlier. Two
instances, two different files, same mechanism → promoted to `knowledge-base.md` rather than left as two
decision rows, and stated on the SURFACE's fact sheet too (`project-insights.md`), because it is a property of
this shell that any future harness will meet. **The tooling-is-wrong-until-diffed principle held for the third
consecutive era: a brand-new gate's first green/red run was wrong, and only a cross-width comparison caught it.**

**A rule got fixed rather than bent, which is worth naming.** The audit's first version applied the 22px floor
axis-blind and flagged `#baiModelBtn` at 61×20 inside a 20px-tall status strip — where "make it bigger" means
"make a button taller than the strip containing it," i.e. meaningless. The response was to correct the RULE
(floor applies to the travel axis for everything, both axes for icon-only, text cross-axis reported as INFO)
rather than to whitelist the control. The one genuine exception (`.bai-tgl`, whose landscape shape IS its
semantics) is *listed by the audit on every run* rather than silently skipped. An exception that leaves no
trace is how a floor quietly dies.

**Two reversals of my own prior decisions, both correct, both from false premises I had written.** (a) The
2026-08-04 removal of Schedule's empty-state CTA was justified as "a permanently-docked bar cannot swap" —
false; nothing stops a bar from hiding. (b) The credits notification's "no timer, close button only" rule was
right for a card and wrong the moment the surface became a transient banner. Neither was drift; both were
principled decisions resting on a premise that went unexamined. → two new `reasonings.md` principles, one on
re-testing "X is impossible" rejections and one on persistent-vs-transient rule scope.

**Counter-evidence of growth, and it is substantial this session.** The independent Key-saved review's
findings were reproduced case-by-case rather than accepted on read — which caught that ONE of its findings
(the focus-ring contrast) was itself a measurement artifact, while confirming the rest; a half-done fix of my
own was caught by that same discipline (the focus-restore guard correctly declined to restore a destroyed
trigger, then dropped focus to `<body>` anyway — the exact outcome it existed to prevent); the toast redesign
deleted `positionCreditNote()` and its resize listener outright rather than leaving them as dead code beside
the replacement; and three separate harness-lies were caught and named this session (an empty-array
comparison reported as "no content shift," a scrolled-out-of-view row reported as unreachable, six contexts
silently yielding zero controls after an `Escape` closed the drawer) → all three are now a single KB entry,
because a harness returning nothing reads as good news and that is the dangerous part.

**Phase 2 HOLDS; the Phase-3 streak stays at zero.** `caught_count: 9` cannot be read as a low-caught session
under any framing. But the composition of the count has shifted in a way worth tracking: S16's catches were
mostly *reasoning* failures already named in this notebook, while S17's are mostly *unmeasured properties* —
and unmeasured properties are the failure mode that gates can actually close, which is why two of them now
have gates. **New top recurring category: a property nobody measured is a property nobody checked — if a
design rule can be expressed as a number, it needs a gate, not a paragraph.** S16's "verify the blast radius,
not just the stated property" is not retired and stays second — it simply wasn't what this session's catches
were made of.
