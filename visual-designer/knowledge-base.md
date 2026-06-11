# blueAI — Knowledge Base
Last updated: 2026-06-10 (session 1 — initial component library)

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
