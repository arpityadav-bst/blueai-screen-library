# blueAI — Evolution
Last updated: 2026-06-12 (S4 — discrepancy sweep + audit/health-check; recurring category #2 validated a 2nd time → codified as taste rules 23–24; designer_caught_count: 2)

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
- `rgba(8,10,31,…)` neutral-ink alpha — deferred tokenisation candidate (cross-file pass).
