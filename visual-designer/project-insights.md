# blueAI — Project Insights
Last updated: 2026-06-11 (S2 audit — +Deployment section, CSS-arch prod-chunking finding)

> Architecture, domain, asset rules, and conventions specific to the blueAI replica.
> Facts a developer/designer needs that aren't taste.

## What this project is
- A **design-only handoff replica** of the **blueAI marketing/product site** (BlueAI =
  BlueStacks' in-app AI assistant; wordmark "BlueAI by now.gg"). Sibling to `wsup/` +
  `nowgg/`. Same philosophy: visual fidelity + handoff clarity, no real backend.
- **Source:** a Claude-design (claude.ai/design) HTML/CSS/JS export — not Figma directly.
  Lives in `design-source/homepage-rework/`. The bundle's own README said to recreate it
  "in whatever tech fits (React…)", so we ported to Next + Tailwind.
- Stack: Next.js 14 (App Router) + React 18 + Tailwind 3.4 + TS + **framer-motion** (for
  the hero agent animations).

## Routes (S1 — restructured: the style guide is the default address during the design phase)
- `/` — **Screen Library index** (`app/page.tsx`) — the handoff directory (like WSUP's); links to
  every page (SEO homepage · hero-options · the 3 hero variants · style guide) as bordered rows via
  full-page `<a>`. Light DS wash + `<Wordmark/>`. Replaced the old redirect-to-style-guide (S2).
- `/style-guide` — the DS reference, **WSUP-style sidebar architecture**: left grouped nav
  (Foundations · Components) with scroll-to + scroll-spy; scrollable main. **DS-only** — page
  navigation moved to the root Screen Library index (S2-cont; the "Pages" group was removed). blueai-modern + PM.
- `/seo` — **SEO Homepage** (S2-cont) — standalone search-optimized page (scoped `.v-seo`):
  hero (2×2 animated agents) · What-is · chatbot/assistant/worker · 8-card task hub · 4 steps · FAQ
  (+ FAQPage JSON-LD) · CTA · footer. Full-bleed nav + a contained 1280 column; ambient `SeoBackdrop`
  + scroll-reveal; mobile hamburger nav. See KB "SEO homepage + brand primitives".
- `/hero-options` — the design-review **chooser** (schematic previews + UX pros/cons; links the 3
  variants; #3 Recommended → `/hero/stage`).
- `/hero/stage` — **★ Recommended Stage hero** (rich 2-scene agents) + homepage body.
- `/hero/stage-original` · `/hero/3-cards` — the other two directions (legacy scenes) + homepage body.
  `/hero/3-cards` now shows **4** agent cards (added Markets, S2-cont).
- **bluestacks.ai inner pages (S3 — replicated from the live site via Edge CDP):**
  `/social-rewards` · `/developer` · `/apply-to-jobs` (Career) · `/ai-video-creator` (Creator) ·
  `/ai-trading-agent` (Finance) · `/prediction-market-agent` (Markets). Routes match the live slugs so the
  wiring is natural. ONE shared header on EVERY page (SEO + inner): `components/MarketingHeader.tsx` +
  `styles/header.css` (scoped to the header element `.bai-hdr`, route-scope-independent). Other chrome:
  `SiteFooter`/`SiteReveal`/`SiteFaq` scoped `.v-site` via `styles/site.css`; the 4 agent pages run on `components/agent/AgentShell.tsx` +
  per-agent data in `lib/agents-data.ts` (+ `lib/rewards-data.ts`, `lib/site-data.ts`). Each page is a 2nd
  root class (`.v-rewards`/`.v-dev`/`.v-agent`) over `.v-site`. SEO nav + both hero agent grids link here.

## Hero architecture — TWO animation paths (critical)
The export's `hero-cards.js` branches per agent on which markup is present:
- **RICH multi-scene** (`.cr-find`/`.cv-brief`/`.fn-gather`) → used by the **Stage**
  (Recommended) hero. Each agent is a 2-scene flow (search→apply, describe→render,
  gather→deliver). Components: `hero/scenes/{Career,Creator,Finance}Scene.tsx`.
- **LEGACY single-scene** → used by **BOTH Stage Original AND 3 Cards**. Simpler
  (job→fill→submit, trend→storyboard→views, tickers→chart→marker→value). Components:
  `hero/scenes/{Career,Creator,Finance}Legacy.tsx`. SHARED across the two variants;
  identical markup, only CSS sizing differs (3-Cards small, Stage Original big — the
  `FinanceLegacy big` prop swaps chart geometry). **Don't merge rich + legacy.**
- Motion was **rebuilt React-native** (designer's call: lighter than porting GSAP). Each
  scene is **phase-driven**: a `STEPS` timeline of setTimeouts advances a `phase` int;
  Framer `motion` components animate off `phase`. Typewriter (`useTypewriter`) + count-up
  (`useCountUp`) hooks for typed text + numbers.

## CSS architecture — per-variant scoped-by-route stylesheets
- Each hero shell imports ONE stylesheet: `hero-stage.css` (rich), `hero-cards.css`
  (legacy small), `hero-stage-original.css` (legacy big). They reuse generic class names
  (`.nav`, `.hero`, `.cr-job`, `.eyebrow`…) at different sizes, so they would COLLIDE if
  co-loaded. **Mitigation:** each lives on its own route (Next loads route CSS per page)
  AND cross-hero/options links use full-page `<a>` (not `next/link`) so CSS never
  accumulates across routes. The options chooser CSS is scoped under `.ho`. The homepage
  CSS is scoped under `.bai-home`. Page background washes live on a `.hero-page` wrapper.
- The DS token layer (`--bai-*` + `.bai-*` type classes) is in `globals.css` (always
  loaded); `tailwind.config.ts` maps utilities (`bg-iris`, `text-ink-heading`,
  `bg-bai-gradient`…) onto those vars. Marketing sections use a scoped CSS layer
  (`src/styles/homepage.css`) rather than pure Tailwind — deliberate, for fidelity/speed.
- **⚠️ The scoped-by-route mitigation is INCOMPLETE in production (S2 finding).** It holds in
  dev (CSS injected in import order) but the prod bundle chunked hero-cards.css's generic
  `.hero{text-align:center}` onto the `/hero/stage` route → the Stage heading/scene centered on
  Vercel, left in dev. Patched with an own-declaration guard (`.hero-right{text-align:left}`);
  the PROPER fix — **DONE (S2)** — scoped each variant stylesheet under a unique root class
  `.v-stage`/`.v-cards`/`.v-original` (on each page wrapper), via the idempotent
  `.scripts/scope-css.js` postcss transform. Built bundle verified to have ZERO unscoped generic
  hero rules → cross-route leaks now structurally impossible (also closed the `.hero` padding leak
  + the Stage-Original `.cv-trend` bug). See `knowledge-base.md` → "CSS architecture".

## Assets
- Real product PNGs (feature previews) + logo + sparkle in `public/` (copied from the
  export's `assets/`). Game/agent demos are pure CSS/SVG (no external images).
- Fonts via `<link>` in `layout.tsx`: Inter + Bricolage Grotesque + Space Grotesk
  (+ JetBrains Mono is referenced for agent-demo data; loaded by the hero stylesheets'
  font stack fallback — confirm if a tighter mono is wanted).

## Design-system sources — there are TWO
blueAI has two DS extractions in `design-source/`, for two surfaces:
- **blueai-modern** (`design-source/homepage-rework/.../_ds/blueai-modern/`) — from the
  Figma "New UX" file; the in-app panel + the **brand/visual identity** (iris→cyan gradient,
  cool neutral ramp, Inter/Space Grotesk/Bricolage). **The marketing site is built on this**
  — it's the newer "New UX" direction. More mature on **brand polish**.
- **blueai-pm** (`design-source/blueai-pm/`) — extracted from the ACTUAL shipping web-app
  codebase (React 19 + Tailwind). More mature on **system coverage**: full semantic status
  colors, an interactive accent `#1990FF`, indigo/gray/slate neutrals, Plus Jakarta Sans,
  real component specs (badges · inputs · nav · chat bubbles · cards · credits modal ·
  overview cards) + a JSX ui-kit + Heroicons-outline icon set.

**Reconciliation rule (per designer, S1):** keep blueai-modern's brand identity for the
marketing site; FILL gaps from blueai-pm; on a real contradiction take the more mature.
- **FILLED from PM:** semantic **status** system (success/warning/danger/info/scheduled/jobs
  + soft-bg/ink badge pairs) + interactive **accent `#1990FF`** — modern had NEITHER. Added
  to `globals.css` `--bai-*` + `tailwind.config.ts` (`text-accent`, `bg-status-*`) + shown in
  `/style-guide`.
- **Lateral contradictions kept as modern** (don't churn a built site), PM noted: gradient
  *direction* (modern iris→cyan to-br vs PM cyan→purple to-r — same two colors); body-font
  substitute (modern Inter+Space Grotesk vs PM Plus Jakarta Sans).
- PM's app components + Heroicons set + app copy patterns (sentence case, no-emoji-in-app,
  BCX/"BlueStacks Credits" currency, two-line empty states) are the reference for any future
  blueAI **app** surfaces → `design-source/blueai-pm/`.

## Deployment (S2 — 2026-06-11)
- **GitHub:** `arpityadav-bst/blueai-screen-library` (public). Branch `main`. `.gitignore`
  mirrors WSUP's (ignores `node_modules`, `.next`, `.vercel`, `__preview/`). Full repo (incl.
  `design-source/`, ~48MB) — designer chose "everything as-is".
- **Vercel:** project `blueai-screen-library` in team `arpityadav-1136s-projects` (same as WSUP),
  **git-connected → every push to `main` auto-deploys.** Prod URL `blueai-screen-library.vercel.app`
  (`/` 307→`/style-guide` by design). Build = `next build` (Next auto-detected). No env vars.
- **Workflow:** push to `main` → Vercel rebuilds. Always run `npx next build` locally first —
  strict TS + the prod CSS bundle catch things `next dev` doesn't.

## Known / flagged
- ✅ CSS-leak fix DONE (S2) — the 3 hero stylesheets are scoped under `.v-*`; the leak class
  (text-align + `.hero` padding + the Stage-Original `.cv-trend`) is structurally closed.
- Hero motion timing is a first-pass approximation of the original GSAP — retune on review.
- `design-source/FIX-LATER.md` — the parked Recommended-hero polish items were resolved before S2.
- Full blueai-modern DS zip ("BlueAI Modern.zip" in Downloads) holds deeper preview
  cards + the in-app panel ui-kit if we extend the /style-guide later.
