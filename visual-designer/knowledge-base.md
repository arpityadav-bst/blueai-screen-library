# blueAI — Knowledge Base
Last updated: 2026-06-13 (S6 audit — motion/stacking/clone mechanics: framer snaps clip-path · double-spread clobbers animate · ancestor z-index caps fixed children · scale-don't-reflow · redirect-not-rewrite for relative iframe src · dev server dies silently)

## Motion, stacking, and clone mechanics (S6 — live-demo-v2)
- **framer-motion does NOT reliably interpolate `clip-path` strings — it SNAPS to the target.** For a clip-path wipe/reveal, use a CSS `@keyframes` + a class toggle; keep framer for `pathLength`, opacity, transform. (Confirmed: animating `clipPath: inset(0%)→inset(100%)` via framer jumped instantly.)
- **A double object-spread clobbers the framer `animate` prop.** `<motion.x {...drawA} {...drawB} />` where both define `animate`/`transition` → the second wins, the first's keyframes silently vanish. Merge into ONE `animate`. (This — not `var()` — was the blank-blueprint bug. **`var()` in SVG presentation attributes `stroke=`/`fill=` DOES work in Chrome**; the earlier "doesn't resolve" note is retracted. Still prefer CSS for SVG color so framer owns only motion.)
- **A fixed/floating child can NEVER escape an ancestor's stacking context.** A `z-index` on any ancestor (e.g. `main { z-index:1 }`) caps a `position:fixed` descendant at that ancestor's level — so a later sibling (the footer) paints over it. Fix: give ancestors NO z-index (DOM order alone layers content above a z-0 backdrop); raise only the few elements that must win (nav). Audit every ancestor `z-index` whenever fixed/docked UI exists.
- **Miniaturize a live view by SCALING the designed layout (`transform: scale`), never by reflowing it** to a width it wasn't built for (reflow at miniature = cropped/cramped). Keep the designed canvas size, scale the whole thing.
- **`/route` REDIRECT (not rewrite) when a static page uses RELATIVE asset paths** (an iframe `src="app.html"`): a rewrite keeps the URL at `/route` so the relative path 404s; a redirect lands the browser on `/route/index.html` where it resolves. Static clone = byte-copy into `public/` (hash-verify), strip any nested `.git` (an embedded repo breaks `git add`).
- **The dev server can die SILENTLY** (browser shows an error page, the log just stops — no crash trace). Before debugging a "broken" route, CHECK THE PORT (`Get-NetTCPConnection -LocalPort 3000`); restart if down. Happened ~5× in S6 — a process-stability quirk, not the code.
- **Verifying a transient (~1-2s) animation through high-latency tooling:** screenshots race the animation and usually land after it finishes. To SEE a phase: temporarily HOLD the component there (drop the advance-timeouts / lengthen the duration), screenshot, revert. For endpoints, a settle check + a mid-animation DOM sample (computed style) is enough.

## Style-guide architecture + verification traps (S5)
- **`form-kit.tsx` molecules** (`components/agent/form-kit.tsx`) — the layer between the `.jmf-*` atoms (agent.css) and the 4 form components: `Field` (generic label+control+hint, `<div>` because controls may contain buttons) · `TextField`/`TextAreaField`/`SelectField` (label-wrapped natives) · `PillsField` (single OR multi — `value: string | string[]`) · `Tabs<K>` (generic key type) · `FormHead` · `Agree` · `Submit` (always carries `<Arrow size={18}/>`). No form hand-writes field markup. Documented standalone in SG "Form field molecules".
- **SG anatomy primitives** (`components/style-guide/Anatomy.tsx`): `Anatomy` (per-row recipe table) · `Tok` (mono token name linking to a `tok-*` id) · `PreviewAnatomy` (`layout='split'` for narrow components, `'stack'` for full-width ones like the header — a half-width column would distort a full-bleed preview). Token focus ring: `[id^='tok-']:target` in `style-guide.css` draws an iris ring + brief pulse on the linked swatch (reduced-motion gated).
- **NEVER wrap a contained SG showcase in a PAGE-ROOT scope class without the reset.** `.v-site`/`.v-seo`/`.bai-home`/`.v-rewards` carry `min-height:100vh` + a page background — a demo wrapped in one balloons to a full viewport. `.sg-demo` (style-guide.css) neutralises both while keeping the scoped descendant CSS working.
- **A hash-only navigation (`/page#x`) is a same-document scroll, NOT a reload — the browser keeps serving the originally-loaded CSS/JS.** Cost ~10 cycles: every rebuild looked like it "did nothing" (the `text-2xs` rule "missing" after a config add, an @layer add, a plain-CSS add — ALL actually worked). Before re-measuring a CSS/token change in the browser, force `location.reload()` or navigate to a genuinely different path. Corollary: never ship a comment asserting a mechanism "doesn't work" until verified under a true reload (the Tailwind `2xs` fontSize key works fine).
- **Reading DOM state synchronously after `.click()` races React's re-render** — `className` checks right after a click read the PRE-update DOM and falsely report "no toggle." Await ~100ms (or a `requestAnimationFrame`) before asserting.
- **Anatomy/doc rows must be grep-verified against the real CSS** — I wrote `.jmf-label` from memory; the class is `.jmf-lbl`. Recipes are quotes, not recollections.
- **Neutral + page channel tokens (S5):** `--bai-ink-rgb: 8,10,31` (every neutral scrim/hairline/shadow rgba derives from it) · `--bai-shadow-hairline` (+ `shadow-hairline` utility — resting cards) · `--bai-page-rgb`/`--bai-page`/`--bai-page-grad` (the marketing page surface + gradient; frosted bars = `rgba(var(--bai-page-rgb), .8)`). Tailwind `float`/`overlay` point at the `--shadow-*` vars (SSOT). Known boundary (unchanged): SVG `<stop>` attrs can't take `var()` — FinanceLegacy's two gradient stops stay literal.

## Agent demo form kit (`.jmf-*`) + interactive demo primitives (S4 — the discrepancy sweep)
The 4 agent pages' hero demos are FAITHFUL INTERACTIVE replicas of the live bluestacks.ai forms (design-only — submits `preventDefault`), built on one shared CSS kit + a few client components:
- **`.jmf-*` kit** (in `agent.css`): `jmf-card` (panel) · `jmf-head`/`jmf-title`/`jmf-sub` · `jmf-field`/`jmf-lbl`/`jmf-opt` · `jmf-input`(+`jmf-textarea`,`jmf-select` w/ data-URI chevron) · `jmf-tabs`/`jmf-tab` (segmented toggle) · `jmf-pills`/`jmf-pill.is-on`/`jmf-check` (single- OR multi-select) · `jmf-upload`/`jmf-file-*` · `jmf-agree` (checkbox) · `jmf-hint` · `jmf-submit` (full-width CTA + `<Arrow>`). Accent = solid `--bai-mkt-blue` (matches the live's solid blue, NOT the brand gradient); focus ring `rgba(var(--bai-mkt-blue-rgb),.15)`.
- **`components/agent/`**: `CareerForm` (8 fields incl. multi-select Location + Seniority `<select>` + Resume upload + agree), `CreatorForm` (textarea + Style/Platforms/Length pills), `FinanceForm` + `MarketsForm` (TABBED — Upload/Ask, Watch/Ask), `FileUpload` (stateful — see below), `VideoCard` (click-to-play), `glyphs.tsx` (`Check`/`UploadIcon`).
- **`FileUpload`** — the all-states control (taste rule 24): hidden native `<input type=file>` triggered by a custom "Choose file" button; EMPTY = upload icon + Choose file + "No file chosen"; FILLED = file icon + filename + remove (✕), box flips dashed→solid (`is-filled`); ✕ resets state + `input.value=''`. **Wrap it in a `<div>`, NOT a `<label>`** — a label would double-fire the picker alongside the trigger button.
- **`VideoCard`** — real `<video>` (poster + `loop`/`playsInline`/`preload=metadata`, no native controls), click toggles play/pause, overlay hides while playing; guard `el.play()?.catch(()=>{})` (autoplay-interruption rejects). Videos live in `public/videos/` (downloaded from the live site).
- **Tabs are styled toggle buttons** (`aria-pressed`), NOT a full ARIA tablist — a `role="tab"` without `role="tabpanel"`+`aria-controls` is a worse, incomplete contract; for a segmented control that swaps inline fields, `aria-pressed` is the honest semantic.
- **Documented in `/style-guide` → "Agent page components"** (S4 audit — `components/style-guide/AgentComponents.tsx`): live `CareerForm` (the kit) + tabbed `FinanceForm` + `FileUpload` (all states) + trade-log BUY/SELL badges + `VideoCard`, rendered REAL (wrapped in `.v-agent`) so the docs can't drift. **Tokenisation verdict (S4, mechanically grepped):** every color/radius/shadow uses `--bai-*` / `--radius-*` / channel-rgb tokens; the BUY/SELL badges reuse `--bai-success/danger-*`. The ONLY raw colors are **Tier-3 bespoke** (the VideoCard frame gradient `#2a2350…` + play glyph `#1b1340` — single-surface decoration, stays local per the tiering rule) + the **deferred neutral-ink alpha** `rgba(8,10,31,…)` (the file's established shadow/tint literal). No Tier-1/2 leaks; no new global token was needed. Literal px for type/spacing in scoped marketing CSS is the project convention (matches homepage/hero CSS), not a violation.

## CSS + shared-template gotchas (S4)
- **Descendant element selectors are specificity traps.** `.ag-more-card span` (0,2,1) OUT-SPECIFIES a `.ag-more-ic` class (0,2,0) — and an icon wrapper IS a span — so the text-styling rule (`display:block; 12px`) bled onto the emoji tile and cramped it top-left. **Scope text rules to the inner wrapper class** (`.ag-more-tx span`), never `.card span`. Any `.parent element` selector silently captures every matching descendant.
- **Shared-template copy must be data-driven, never hardcoded.** `AgentShell` hardcoded the how-it-works H2 as "From targets to done" (career's words) → it leaked onto creator/finance/markets. Fix: per-instance `hiwHeading` field on `AgentData` with a default. Any shared shell rendering instance-specific copy must read it from data.
- **When the in-page (Claude-in-Chrome) extension blocks a DOM read** with `[BLOCKED: Cookie/query string data]` (triggered by URL-bearing content — e.g. Polymarket/Kalshi links in the markets SEO copy), fall back to `node -e "fetch(url).then(r=>r.text())"` on the SSR HTML + strip tags. The SSR markup carries the same text.
- **A mobile dropdown menu must be OPAQUE + dim the page behind it (scrim)** — never translucent over live content (the hero text ghosts through; a 2nd CTA below competes). Opaque menu + a tap-to-close scrim (`top:100%` so the bar stays crisp) is the focused-overlay pattern.

> blueAI's reusable components, patterns, and token hygiene. blueAI's own — unrelated
> to WSUP/now.gg.

## Component library (BUILT — session 1)
**Foundation**
- `globals.css` — the `--bai-*` token layer (brand gradient + wash, cool neutral ramp,
  type/spacing/radii/shadow/motion vars) + the `.bai-*` semantic type classes (DS API).
- `tailwind.config.ts` — utilities mapped onto the vars (`bg-iris`, `text-ink-*`,
  `bg-bai-gradient`/`bg-bai-wash`, `rounded-card/field/pill/bubble-*`, `shadow-float/overlay`,
  `font-head`/`font-brand`, the px type scale).

**Homepage (`components/home/`)** — shared body under every hero, styles in `styles/homepage.css` (`.bai-home`).
- `BaiHome` — orchestrator (intro → features → skills → all-skills → powered-by → footer).
- `FeatureRows` — 5 alternating feature rows (data: `lib/home-data.ts` FEATURES).
- `AllSkills` — 15-card skill grid + "more on the way" tile (data: SKILLS).
- `DownloadCta` — the tri-stop gradient "Download BlueAI" pill (also the hero CTA via `HeroCta`).

**Hero (`components/hero/`)**
- `HeroStage` (rich, 2-col, Recommended) · `HeroCards` (legacy, 3-card) · `HeroStageOriginal` (legacy, big stage + rail).
- `HeroNav` (shared nav + logomark) · `HeroCta` · `HeroArrow`.
- Scenes — RICH: `scenes/{Career,Creator,Finance}Scene.tsx`. LEGACY (shared by 3-Cards + Stage Original): `scenes/{Career,Creator,Finance}Legacy.tsx`.
- Hooks: `useTypewriter` (typed text) · `useCountUp` (eased number count).

**Style guide (`components/style-guide/` + `app/style-guide/`)**
- `ComponentsSection` (buttons · ✦ pills · feature cards · message bubbles · composer · panel header) + the page (Colors · Type · Scales · Components).

## Patterns
- **Phase-driven Framer scene** (codified S1): a `STEPS` array of setTimeouts advances a
  `phase` int on mount; `motion` components animate off `phase` (no GSAP). Scene replays
  by remounting (AnimatePresence key / conditional render on activation). Reusable for any
  multi-step demo animation.
- **Per-route scoped hero CSS + full-nav `<a>`** (codified S1): variants that reuse generic
  class names at different sizes stay isolated by route; cross-route links must be full-page.
- **Gradient text** — `.text-gradient` utility (background-clip:text on `--bai-gradient`)
  for inline "BlueAI" / "BlueStacks AI" highlights + the credits count.
- **Spotlight animation loop** (S2) — multi-instance demo scenes (the 3-card grid, the
  rail-of-agents) animate ONE at a time. Each scene takes an `active` prop and only runs its
  phase timeline when active; inactive scenes rest at the FINAL/completed phase
  (`useState(active ? 0 : FINAL)`; `useCountUp` got an `instant` flag so resting counters show
  the end value). The active scene replays from scratch via a KEYED REMOUNT (bump a `gen`/`key`
  on activation). Hover pauses the loop + restarts the hovered scene; leave resumes. Never let
  all scenes auto-play on mount.

## Motion (framer-motion) — load-bearing gotchas (S2)
A whole family of bugs traces to **framer owning two things React doesn't expect**:
- **It owns the `transform` property.** Centering a `motion.*` element with CSS
  `transform: translate(-50%,-50%)` FAILS — framer overwrites transform with its animated value
  (e.g. `scale`), leaving the element offset. Center with `position:absolute; inset:0;
  margin:auto` (definite size) or flex/grid on the parent. (Hit on `.cv-play`.)
- **It replays `initial → animate` on EVERY mount.** A keyed component that remounts in a
  "should-not-animate" state still plays its entrance. Pass `initial={false}` to mount straight
  at the resting state. (Hit when the spotlight handed off — just-left cards re-animated.)
- **Type the `initial`/`animate` helpers as `TargetAndTransition`, not `object`.** `object` is
  too wide for framer's prop union and FAILS the prod `next build` typecheck (passes in dev).
  (S2 deploy fix — the `init(v?: object)` helper in the 3 legacy scenes.)
- **Animated footers over flowing content** — don't absolutely-pin them (they overlap when
  content grows); let them flow with `margin-top:auto` in a flex column. MEASURE gaps in-browser
  (`getBoundingClientRect`), don't eyeball — a by-eye estimate was 3× off.

## CSS architecture — production chunking can leak generic class rules (S2, important)
The per-route-scoped hero stylesheets reuse generic global class names (`.hero`, `.pane-title`,
`.hero-screen`). The "isolated by route + full-page `<a>` nav" mitigation holds in DEV (CSS
injected in import order) but NOT in the production bundle: Next chunked **hero-cards.css's
`.hero{text-align:center}` onto the `/hero/stage` route**, so the Stage `.hero` (no text-align)
resolved to center and `.hero-right` inherited it → heading/scene centered on Vercel, left in dev.
Confirmed by fetching the live CSS chunks.
- **Cheap guard (used):** never rely on INHERITANCE for a property a sibling stylesheet sets on
  a shared class — set it explicitly on a uniquely-named descendant. An own declaration beats an
  inherited value regardless of chunk grouping/order (`.hero-right{text-align:left}`;
  `.hero-right` is Stage-only).
- **Proper fix (DONE, S2):** scoped each variant stylesheet under a unique root class —
  `.v-stage` / `.v-cards` / `.v-original` (added to each page wrapper), mirroring `.bai-home` /
  `.ho`. `.hero-page`/`.hero-screen` are shared by all 3 variants, so a NEW per-variant modifier
  class was added. Done via `.scripts/scope-css.js` (idempotent postcss transform — `:root` +
  `@keyframes` kept global). Verified: the built bundle has ZERO unscoped generic hero rules →
  cross-route leaks are now structurally impossible (also closes the `.hero` padding leak + the
  Stage-Original `.cv-trend` bug). The `.hero-right{text-align:left}` guard is now redundant-but-
  harmless. **If a 4th variant / new shared-name stylesheet is added, scope it from the start.**
- **`next build` runs STRICT TS; `next dev` does not.** Always `npx next build` before relying on
  a deploy — two prod build failures in S2 (the framer type + the CSS leak, the latter only
  visible in the prod bundle).
- **CSS-comment `*/` gotcha (S2 audit #2):** a `*/` sequence ANYWHERE inside a `/* … */` comment closes
  it early → postcss "Unclosed block (n:n)" build fail pointing at the next `{`. Bit me writing the
  literal `--seo-*/--green` in a token comment (the `*/` killed the comment, the rest became bad CSS).
  Never put `*/` — or a glob like `--x-*/…` — in CSS comment prose. `next dev` may not surface it; `next build` does.
- **NEVER run `npx next build` while `next dev` is running (S2 audit #2 — cost a confusing debug).** The
  prod build overwrites the dev server's `.next`, so dev then serves SSR HTML that references dev JS chunks
  which now 404 (`main-app.js`, `app-pages-internals.js`) → the page renders but **never hydrates**: looks
  perfect in screenshots, but no interactivity (a hamburger that won't open, dead framer animations). Tell-tale:
  404s on `/_next/static/chunks/*` in the dev log. Fix: kill dev → `rm -rf .next` → restart `npm run dev`.
  For a prod-build check while iterating, STOP dev first; for small changes, trust dev's compile + screenshots.

## Token / layout hygiene (S2)
- **Tailwind silently drops UNDEFINED utilities** (no error). `rounded-circle` was used 9× but
  `circle` wasn't in the config → all 9 rendered as squares. Verify a `rounded-*`/token key
  exists in `tailwind.config.ts`; a fabricated semantic name fails silently and visibly.
- **One shared content-width token across every full-width band** (`--bai-content: 1180px`, 40px
  gutter) so content edges align vertically down the page — inconsistent max-widths read as
  accidental. GOTCHA: a flex item with `margin:auto` won't stretch to its max-width (auto-margins
  disable flex stretch) — add `width:100%`.
- **`order`-swapped rows with asymmetric grid tracks size by POSITION, not element** — to keep
  one element (a feature image) consistently larger across alternating left/right rows, MIRROR
  `grid-template-columns` per direction (`.feat` vs `.feat.reverse`); verify by measuring EVERY
  instance, not just row 1.
- **Equal grid columns: use `minmax(0, 1fr)`, not `1fr`** (S2-cont). `1fr` = `minmax(auto,1fr)`, so
  an item with wide min-content (an SVG chart, nowrap text) balloons its track and squeezes the rest
  — the Finance card came out wider than its siblings. `minmax(0,1fr)` + `min-width:0` on the item =
  truly equal columns. *(Gate-8 miss — designer caught it on review.)*
- **Per-route width override via a scoped token** (S2-cont). To widen/narrow ONE route without
  touching the shared nav stylesheet or other routes, override the content-width custom property on
  that route's scope (`.v-cards .hero-screen { --bai-content: N }`) — the shared nav + hero inherit it.
- **Content-width model (refined S2-cont):** a wide/full-bleed NAV over a CONTAINED ~1280 content
  column (hero + sections + footer share one `--seo-content` token). Aligning ALL bands to the wide
  header read too wide (bad line length, sparse grids). Full-bleed nav + contained content is the
  standard pattern, NOT misalignment. → taste rule 20.

## Mobile (S2)
- **App-style split-pane** (fixed sidebar + independently-scrolling main, `h-screen
  overflow-hidden`) MUST be gated to a desktop breakpoint; on mobile collapse to single-column
  normal-scroll and hide/relocate the sidebar.
- **A fixed-height box holding responsive text overlaps its absolute children when the text grows
  on small screens** — bump the height (or drop content) at the breakpoint.
- **N-up rows of labeled items need a mobile plan** (stack icon-over-label, or drop secondary
  affordances like arrows).
- **Click-to-scroll + scroll-spy fight** — add a short (~700ms) lock after a click so the spy
  doesn't re-highlight mid-scroll; a sticky nav needs a matching scroll OFFSET (scrollIntoView
  can't offset).
- **Always screenshot mobile yourself** — can't eyeball it from the desktop live view.
- **A content page's section-anchor nav needs a real mobile MENU** (S2-cont) — a hamburger → the
  section links + CTA, never just `display:none` on the links (that strands the navigation). The
  menu OVERLAYS content (`position:absolute` below the sticky bar with a shadow), it does NOT push
  content down. CTAs go full-width on mobile for tap targets.

## Components (S2)
- **HeroNav = single source of truth** for the marketing/hero nav: one `<HeroNav/>` + one
  `hero-nav.css` (imported by the component so styles travel with it); per-variant diffs exposed
  as a token (`--nav-pad-y`). Showcased as a LIVE "Marketing nav" section in `/style-guide` (renders
  the real component → can't drift). A component duplicated across variants is a DS smell → extract.

## SEO homepage + brand primitives (S2-cont)
- **`/seo` page** (`app/seo/page.tsx` + `components/seo/*` + `lib/seo-data.ts` + `styles/seo-home.css`,
  ALL scoped `.v-seo`): a standalone content-rich, search-optimized homepage. Sections: nav · hero
  (2×2 animated agents) · What-is (featured-snippet def) · chatbot/assistant/worker frame · 8-card
  task hub (internal links) · 4 steps · FAQ accordion · CTA · footer. Reuses the legacy agent scenes
  (their CSS DUPLICATED under `.v-seo` — scene classes can't cross route scopes; the cost of strict
  per-route scoping).
- **SEO mechanics:** page-level `metadata` (title/description) + semantic H1/H2 + **FAQPage JSON-LD**
  rendered server-side in `page.tsx` from the SAME `FAQ` data as the visible accordion (can't drift)
  — the PM's key lever (competitors have FAQ copy, no schema). FAQ answers stay in the DOM
  (grid-rows 0fr→1fr animation) so they're crawlable.
- **Two brand primitives, both SSOT components** (S2 audit #2): **`<Wordmark/>`** (`components/Wordmark.tsx`
  + global `.bai-wordmark`): "BlueAI" in the full iris→cyan gradient (clip), one word, Bricolage 700 —
  every nav + both footers + style guide. **`<Sparkle/>`** (`components/Sparkle.tsx`): the canonical lucide
  "Sparkles" CTA icon — `size` prop OR `className="spark"` (CSS-sized). Was inlined in 6 files; now one
  source, used by all 5 Download CTAs (`DownloadCta`/`HeroCta`/`HeroStage`/`SeoHero`/`SeoCta`). The scene
  "generate" glyph (simpler, no accent marks — a DIFFERENT role) was intentionally NOT merged. Logo =
  official `public/blueai-icon-RzIisCsb.png`. Both documented in `/style-guide` (Foundations type +
  the "Download CTA" component card, which renders the REAL `<DownloadCta/>` under a `.bai-home` wrapper).
  → taste rule 19, reasonings "brand primitives as SSOT".
- **Root `/` = Screen Library index** (`app/page.tsx`): a light DS-styled directory linking every page
  via full-page `<a>`. Replaced the redirect-to-style-guide; the style guide is now DS-only.
- **Ambient backdrop** (`SeoBackdrop`): `position:fixed` layer behind content (content gets `z-index:1`).
  Soft iris/cyan/blue orbs drift via framer `useScroll`+`useTransform` (each a different path →
  recomposes per section) + a faint logo sparkle rotating ~720° across the scroll. On mobile it's
  pinned top-right (left-half visible, big) as a slow gear. All gated on `useReducedMotion`. → taste rule 21.
- **Scroll-reveal** (`useReveal`): one IntersectionObserver adds `is-in` to `[data-reveal]` (fade+rise
  once, then unobserve); reduced-motion reveals everything immediately.

## PM-supplement tokens (S1 — filled from the blueai-pm DS)
- `accent` (`#1990FF` + `accent-hover`) — interactive primary for **app** surfaces (the
  marketing site keeps the iris→cyan gradient). `bg-accent` / `text-accent`.
- `status` group — `status-{success,warning,danger,info,scheduled,jobs}` each with a `-soft`
  (badge bg) + `-ink` (badge text). Status badges = `rounded-sm` + soft bg + ink text. Shown
  in `/style-guide` → Components.
- Shadows: Tailwind defaults `shadow-sm/md/lg/xl` match PM's scale; modern's `float`/`overlay` are extras.
- Future blueAI **app** components (badges/inputs/nav/chat bubbles/credits modal/overview cards)
  + the Heroicons-outline icon set → spec in `design-source/blueai-pm/` (README + preview/ + ui_kits/webapp/).

## DS audit + PM app-components incorporated (S1 audit)
- **Radius scale (complete):** `rounded-badge 2 · card 8 · field 12 · chat 16 · credits 24 · pill 128 · circle` + `bubble-sent/recv`. (added chat/credits/badge in the audit.)
- **Shadow scale:** `shadow-float · overlay · cta · cta-hover · brand-sm` (the brand-glow `cta`/`cta-hover` + the `cta-gradient` were inlined on every Download CTA → tokenized; the 4 hero/home stylesheets now reference `var(--bai-cta-gradient)` / `var(--bai-shadow-cta)`). Tailwind defaults `shadow-sm/md/lg/xl` also available.
- **Badge system (3 shapes):** status chips (`rounded-badge`, soft fill, no border) · pill badges (`rounded-pill`, soft fill, outline on emphasis) · outline tags (`rounded-card` border-only) · credits gradient-border pill. See taste rule 12. Showcased in `/style-guide` → Status badges + Pill badges.
- **`indigo` token** (`indigo` / `-soft` / `-ink`, PM #4F46E5) — PM's secondary interactive (cards, nav hover, overview icon bg). Used by the app-component sections.
- **PM app-component sections** built into `/style-guide` (group "App components (PM)"): `components/style-guide/PmComponentsA.tsx` (Cards · Overview cards · Inputs & forms) + `PmComponentsB.tsx` (Navigation · Credits button/alerts/modal · Icons). These document the shipping web-app DS; the marketing site doesn't use them. The full webapp UI-kit *screens* remain the live product (not rebuilt).

## Token hygiene
- **Tokenisation TIERING (the operating rule — S2 audit #2):** "fully tokenised" ≠ "every hex is a
  token." **Tier 1** — a literal equal to a DS-primitive value (iris/cyan/ink/accent) is a LEAK → use
  the token. **Tier 2** — a color used on >1 surface → promote to a GLOBAL token. **Tier 3** — bespoke
  scene-illustration colors (fake-chart fills `#c9d3ee`/`#aab9e6`, creator-pink `#c2418a`, success-ink
  `#0f7a3b`, icon-tile tints) → stay LOCAL; promoting one-offs pollutes the DS. Tokenise design
  *decisions*, not decoration — and STATE the Tier-3 boundary out loud, don't silently skip it.
- **Marketing-surface palette is now GLOBAL** (`--bai-mkt-slate/blue/blue-2/green/green-wash` in
  globals.css; S2 audit #2 — this SUPERSEDES the earlier "keep marketing locals in the section
  stylesheets" guidance). It was duplicated identically across 7 files (`--bh-*`, `--seo-*`, the heroes'
  `--slate-900`/`--green`) → Tier 2 → one source; per-file locals now alias it. `--bh-orange` folded
  into `--bai-jobs` (same value). `--font-head`/`--font-mono` stay per-stylesheet locals — fonts, fine.
- **Alpha washes now tokenised via rgb-channel tokens** (S2 audit #2 — frontier CLOSED). `rgba()` can't
  take a solid `--bai-iris` token, so the RGB triple gets its own token: `--bai-iris-rgb: 123, 76, 255`
  → `rgba(var(--bai-iris-rgb), α)`. The solid DERIVES from it too (`--bai-iris: rgb(var(--bai-iris-rgb))`)
  → the numbers live in ONE place. Channel tokens: `--bai-{iris,cyan,glow}-rgb` (glow = #5F46FF brand
  shadow) + `--bai-mkt-{blue,blue-2,green}-rgb`. All 7 stylesheets + globals swept. **Pattern to reuse:**
  any color that appears BOTH solid and as an rgba wash → define the channel triple, derive both.
- **Still raw, by stated boundary:** `.tsx` rgba in SVG `<stop stop-color>`, Tailwind-arbitrary values
  (`shadow-[…rgba(…)]`), and one inline page-bg gradient — `var()` is unreliable in SVG/JS-driven values
  and fragile in Tailwind arbitrary syntax. Tailwind `bg-iris/10` alpha modifiers also DON'T work (vars
  aren't channel triples for Tailwind's opacity plugin) — use `bg-bai-wash` or explicit rgba.
