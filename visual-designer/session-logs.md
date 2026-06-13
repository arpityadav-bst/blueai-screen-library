# blueAI — Session Logs
(most recent at top)

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
