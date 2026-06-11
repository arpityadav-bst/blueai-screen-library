# blueAI — Knowledge Base
Last updated: 2026-06-11 (S2 audit — +Spotlight pattern, Motion/framer gotchas, CSS-architecture prod-chunking, mobile, token/layout hygiene, Components)

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

## Components (S2)
- **HeroNav = single source of truth** for the marketing/hero nav: one `<HeroNav/>` + one
  `hero-nav.css` (imported by the component so styles travel with it); per-variant diffs exposed
  as a token (`--nav-pad-y`). Showcased as a LIVE "Marketing nav" section in `/style-guide` (renders
  the real component → can't drift). A component duplicated across variants is a DS smell → extract.

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
- Resolve every value to a `--bai-*` token / Tailwind utility. Marketing-only locals
  (`--bh-slate #0F172A`, marketing blue `#2F6DFF/#3D7BFF`, `--green #16a34a`, `--font-head`,
  `--font-mono`) are scoped to the section/hero stylesheets — keep them there, don't leak
  into the DS token layer.
- Alpha modifiers on the var-based colors (`bg-iris/10`) DON'T work (vars aren't channel
  triples) — use the dedicated `bg-bai-wash` token or an arbitrary rgba for one-offs.
