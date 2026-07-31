# blueAI — Claude Code project instructions

This file auto-loads when Claude Code's working directory is `blueai/`. The canonical
bootstrap rule lives in the parent `N:\Antigravity Main\CLAUDE.md`. This is the in-repo
mirror. **blueAI is a design-only handoff replica** of the BlueAI marketing/product site
(BlueAI = BlueStacks' in-app AI assistant; "BlueAI by now.gg") — same philosophy as
WSUP/now.gg: visual fidelity + handoff clarity, no real backend.

---

## ⚡ SCOPE PIVOT (2026-07-25, designer directive) — READ THIS FIRST

**`/blueai-desktop` (the "modern terminal" prototype) is the ACTIVE surface.** The marketing
site (all routes below under "Marketing site + /blueai-product — DORMANT") and the separate
`/blueai-product` thread are BOTH dormant — not deleted, not deprecated, just not where work
is happening, possibly for a long time. This reverses the prior framing, where blueai-desktop
was treated as a DS-unbound side experiment and the marketing site was the default. If either
dormant surface becomes active again, flip this note back — nothing needs to be rebuilt, only
re-prioritized.

**Practical effect:** Gate 8 (taste.md) now reviews new work against blueai-desktop's OWN
design system — **`public/blueai-desktop/style-guide.html`** (live specimens, built from the
product's own stylesheet + icon set; blueai-desktop had no documented DS at all before this
pivot) + taste rule 38 (a cross-surface craft rule) — not the marketing site's rules 1–37
(preserved on record, not currently load-bearing).

---

## VDA Bootstrap (mandatory on first blueAI touch)

VDA is one junior designer across products. Its CRAFT (gates, forcing functions) lives in
the shared `../agents/vda-core/`; blueAI's TASTE/decisions live here in `visual-designer/`.
**None of the gates fire if the files aren't read at session start.** Non-negotiable. **Do
NOT load WSUP's or now.gg's notebook for blueAI work — that's cross-contamination.**

**Trigger** — fire the FIRST time any of these are true in a session:
- Human message references *blueAI, blueai, "BlueAI by now.gg"*, the **blueai-desktop /
  "modern terminal" prototype** (the active surface — any of its components: credits screen,
  OOC modal, Settings cards, Telegram/AI-Mode/BYOK, Preview panel, etc.), or — for DORMANT
  work only if explicitly asked — the marketing-site hero (Stage / Stage Original / 3 Cards),
  homepage, or components (`HeroStage`, `HeroCards`, `HeroStageOriginal`, `HeroNav`, `BaiHome`,
  `FeatureRows`, `AllSkills`, the agent scenes, etc.)
- Human drags/pastes a file path under `blueai/`
- About to read/write a file under `blueai/`
- Human says "build", "design", "fix the layout", "update VDA"

**Mandatory reads on first blueAI touch, in this order** (craft = shared `../agents/vda-core/`; notebook = blueAI's `visual-designer/`):
1. `../agents/vda-core/agent.md` — re-anchor identity (think like a UX designer)
2. `../agents/vda-core/QUALITY-GATES.md` — 8 gates + dual-cadence + Gate 6.5 + routing table
3. `visual-designer/taste.md` — read the SCOPE PIVOT note at the top first, then rule 38;
   rules 1–37 are dormant-surface reference, not what Gate 8 reviews against right now
3b. `public/blueai-desktop/style-guide.html` — blueai-desktop's own DS reference (tokens,
   scales, icon set, component families). THIS is what Gate 8 reviews blueai-desktop work
   against. Skim its section list + "Known gaps"; open it in the browser when designing.
4. `visual-designer/decisions.md` — recent decisions so new work doesn't contradict them
5. `visual-designer/session-logs.md` — most recent entry only (top)
6. `visual-designer/scratchpad.md` — pending entries (flag if non-empty past the header)

**After reading, announce:** *"VDA bootstrap loaded — blueAI, Phase X, last session
caught_count: N, watching for [recurring category]. Scratchpad: [empty | N pending]."*

**Why:** skipping these is itself a Gate 6 fail — every blueAI edit made without them
operates on stale memory of blueAI's design system. The reading IS the reset.

---

## blueai-desktop — ACTIVE
- The "modern terminal" prototype replicating BlueAI (BlueStacks' in-app AI assistant). Plain
  HTML/CSS/vanilla-JS, no build step, no JS dependencies (one webfont `<link>` aside). Files in
  `public/blueai-desktop/`:
  - `index.html` — markup + the app's inline `<script>` (file-size-rule EXEMPT by established
    convention; a deliberate fast-iteration prototype, not a Next/React app)
  - `blueai-desktop.css` — **the design system**: all 46 `--bai-*` tokens (defined on `.drawer`
    dark / `.drawer.light`, plus a `.bai-scope` tokens-only alias for the style guide) + every
    component family. Extracted from index.html 2026-08-01 so the style guide can LINK it and
    render the real components instead of re-implementing them.
  - `blueai-icons.js` — **the icon set (SSOT).** `BAI_ICONS`, 29 named paths. index.html assigns
    its own `*_PATH` constants from this object and the style guide renders from it, so neither
    keeps a private copy. The guide *throws* on an unknown icon name rather than rendering blank —
    it previously invented glyphs (a wrong bolt, a fake sparkle) and that shipped looking fine.
  - `style-guide.html` — **the DS reference.** Open at
    `http://localhost:8410/blueai-desktop/style-guide.html`. Links the product stylesheet + icon
    set and renders real components inside `.bai-scope`, so it cannot drift. Everything numeric is
    computed at load — token values via `getComputedStyle`, type/radius scales tallied from the
    live stylesheet, and its own class coverage measured by diffing rendered classes against the
    stylesheet. Independent dark/light toggles for specimens and page.
    **When you add or change a component, add/update its specimen in the same edit.** Markup is
    the one thing still hand-written here (the product builds most of it in JS), so grep how
    `index.html` renders a component before writing its specimen — four were subtly wrong on day
    one from working off recall.
  - `boot.js` · `flows.js` — pre-existing extracted scripts
- **Tokens are `.drawer`-scoped on purpose** — the dormant marketing site in this same repo uses
  the same `--bai-*` namespace with completely different values. The scoping is what stops them
  colliding. Do not hoist them to `:root`, and do not assume a `--bai-*` name means the same
  thing in both products.
- Local preview: `.claude/launch.json`'s `blueai-desktop` config (`python -m http.server 8410
  --directory blueai/public`) → `http://localhost:8410/blueai-desktop/index.html`. Note: this
  server drops between sessions fairly often — check it before concluding something's broken.
- Design-system docs: `style-guide.html` (built 2026-08-01) — foundations (46 tokens, live-tallied
  type/radius scales, the 29-icon set) + 19 sections across shell, components and full-screen
  states, house conventions, and a **self-measured** coverage figure: currently 222 of 330 classes
  (67%), computed at load rather than asserted. Still undocumented: the boot animation, the outer
  demo scene (`.stage`/`.bs-window`/`.canvas` — demo scaffolding, not product UI) and the
  `.bai-sched-*` card family. The page lists every uncovered class by name, so trust that list
  over this sentence. Design reasoning lives in `visual-designer/` (taste.md,
  reasonings.md, decisions.md).
- Designer reviews live in-browser during iteration — skip Playwright screenshots for small/
  mechanical changes (see `feedback_skip_screenshots_when_watching` memory); verify with
  Playwright only for first-time-wiring new interactions or genuine logic/data-model changes.

## Marketing site + /blueai-product — DORMANT (see SCOPE PIVOT above)
- **Design-only:** no real backend; the agent demos are scripted/animated, not live.
- **Source:** a Claude-design HTML/CSS export in `design-source/homepage-rework/` (ported
  to Next + Tailwind). Full DS extras in "BlueAI Modern.zip" (Downloads) if extending.
- **Routes:** `/` (Screen Library index — links to every page) · `/seo` (SEO homepage) ·
  `/hero/stage` (★ Stage, Recommended) · `/hero/stage-original` · `/hero/3-cards` ·
  `/hero-options` (chooser) · `/style-guide`.
- **Two animation paths:** Stage = RICH multi-scene; Stage Original + 3 Cards = LEGACY
  single-scene (shared scenes). Motion is framer-motion, phase-driven. See
  `visual-designer/project-insights.md`.
- **CSS:** per-variant hero stylesheets are scoped-by-route; cross-route links use
  full-page `<a>`. DS tokens in `globals.css` (`--bai-*`) + `tailwind.config.ts`.
- **Parked fixes:** `design-source/FIX-LATER.md` (designer's Recommended-hero polish items).

## File size rule (inherited)
**Max 300 lines per `.tsx`/`.ts`.** `.md`, `package-lock.json`, `.css` config-style files
(globals.css, the scoped hero/homepage stylesheets) are pragmatic exceptions.
