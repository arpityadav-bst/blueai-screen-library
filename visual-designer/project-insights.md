# blueAI — Project Insights
Last updated: 2026-06-10 (session 1 — initial build)

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
- `/` — **redirects to `/style-guide`** (the default address points at the DS while a hero
  direction is being chosen; when one is finalized, `/` will render that hero instead).
- `/style-guide` — the DS reference, **WSUP-style sidebar architecture**: left grouped nav
  (Foundations · Components · Pages) with scroll-to + scroll-spy active highlight; scrollable
  main. The "Pages" group links the homepage (hero-options) + the 3 heroes. blueai-modern + PM.
- `/hero-options` — the design-review **chooser = the "homepage" for now** (schematic previews
  + UX pros/cons; links the 3 variants; #3 Recommended → `/hero/stage`).
- `/hero/stage` — **★ Recommended Stage hero** (rich 2-scene agents) + homepage body. Becomes
  the canonical homepage once the designer finalizes this direction.
- `/hero/stage-original` · `/hero/3-cards` — the other two directions (legacy scenes) + homepage body.

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

## Known / flagged
- `design-source/FIX-LATER.md` — designer's parked polish items for the Recommended hero.
- Hero motion timing is a first-pass approximation of the original GSAP — retune on review.
- Full blueai-modern DS zip ("BlueAI Modern.zip" in Downloads) holds deeper preview
  cards + the in-app panel ui-kit if we extend the /style-guide later.
