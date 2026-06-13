# blueAI — Evolution
Last updated: 2026-06-13 (S6 — live-demo clone + DS redesign + signature motion; category #2 validated a 4TH time (~8 catches, clustered on motion/floating/overlay); growth edge sharpened to the per-state/per-breakpoint walk-through)

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
