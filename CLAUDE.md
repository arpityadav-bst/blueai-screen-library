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
7. **Run `node public/blueai-desktop/ds-drift-check.js`** — 20 seconds, and it tells you the current
   truth about the design system (coverage, any invented copy, any raw sizes, dead CSS) instead of
   making you infer it. Do this at session start AND before declaring any change done.

**After reading, announce:** *"VDA bootstrap loaded — blueAI, Phase X, last session
caught_count: N, watching for [recurring category]. Scratchpad: [empty | N pending]."*

**Why:** skipping these is itself a Gate 6 fail — every blueAI edit made without them
operates on stale memory of blueAI's design system. The reading IS the reset.

---

## ⚡ VDA OPERATING CONTRACT for blueai-desktop (2026-08-01) — differs from WSUP on purpose

blueai-desktop has **no separate design-system implementation.** The DS *is* `blueai-desktop.css` +
`blueai-icons.js`; `style-guide.html` is a *view* onto them, not a second copy. That single fact
decides everything below, and it is why the inherited WSUP cadence is wrong here.

### The two directions are not symmetrical

**DS → product: unsynchronizable, by identity.** Change a token or a rule and the product has it on
reload, because it links the same file. Nothing to propagate, nothing to remember. The cost is the
mirror image: no staging layer, so **blast radius** replaces drift as the risk. Before touching a
shared rule, grep its consumers — a "let me soften `--bai-faint`" edit lands on 40 surfaces at once.

**Product → guide: automatic for APPEARANCE, manual for MEANING.** Automatic with zero memory
involved: token values (read via `getComputedStyle`), the type/radius tables (tallied from the live
sheet), the icon inventory, the coverage number, and any *restyle* of an already-specimen'd component.
**Not automatic:** a component's markup, its copy, and its set of states — because the guide
hand-writes specimens while the product builds most of its DOM in JS template strings.

**Every real defect so far has come out of that one gap.** Invented glyphs, then invented copy, then a
four-state login flow documented as one invented state. Nothing else has failed.

### Therefore: INVERT the deferred-Gate-5 cadence

`vda-core/workflow.md` defers style-guide sync to the audit pass. That is right for WSUP, where the
guide is a separate React route and syncing is expensive. **It is wrong here.** When specimens are
hand-written, deferring the sync does not produce staleness — it produces **fabrication**, because the
later pass writes what it remembers instead of what it reads. That is the exact mechanism behind every
invented-copy incident. Here the sync costs one edit in one file.

> **For blueai-desktop: specimen + prose sync is INLINE, same edit. Decisions promotion stays deferred.**

### The one rule that makes fabrication structurally impossible

> **Specimen copy is never authored. It is quoted.** Every user-facing string in a specimen must exist
> verbatim in `index.html`. If you cannot find it there, you are inventing it.

### Same-edit obligations, and what enforces each

| If the edit touches… | Same-edit obligation | Enforced by |
|---|---|---|
| a new CSS class | a specimen renders it | `ds-drift-check.js` §2 (coverage floor) |
| a new `--bai-*` token | a row in the guide's `GROUPS` | the guide self-reports omissions |
| a size or radius | a `--bai-fs-*` / `--bai-r-*` token, never a literal | §8 |
| an icon | added to `blueai-icons.js`, consumed via `BAI_ICONS.<key>` | §3 + §4 |
| a component's markup / copy / states | specimen re-derived from `index.html`, strings verbatim | §1 |
| a class removed from the product | its CSS rule removed too | §7 (reports dead CSS) |

**Run `node ds-drift-check.js` before saying done.** It is not a nicety: it is the only thing standing
between this project and the defect that has bitten three times.

### Notebook

Keep using `blueai/visual-designer/` — it is already blueAI-scoped and the SCOPE PIVOT note re-pointed
it at blueai-desktop. Do **not** create a second notebook; per-product separation exists to stop
WSUP/now.gg cross-contamination, and blueai-desktop is not a different product from blueAI.

---

## blueai-desktop — ACTIVE
- The "modern terminal" prototype replicating BlueAI (BlueStacks' in-app AI assistant). Plain
  HTML/CSS/vanilla-JS, no build step, no JS dependencies (one webfont `<link>` aside). Files in
  `public/blueai-desktop/`:
  - `index.html` — markup + the app's inline `<script>` (file-size-rule EXEMPT by established
    convention; a deliberate fast-iteration prototype, not a Next/React app)
  - `blueai-desktop.css` — **the design system**: every `--bai-*` token (defined on `.drawer`
    dark / `.drawer.light`, plus a `.bai-scope` tokens-only alias for the style guide) + every
    component family. Extracted from index.html 2026-08-01 so the style guide can LINK it and
    render the real components instead of re-implementing them.
    **Counts are deliberately not written down here** — the style guide tallies them live, and a
    number in this file went stale the same day it was written (it said 46; adding the type and
    radius scales made it 64). Open the guide, or run `ds-drift-check.js`, for the current figure.
  - `blueai-icons.js` — **the icon set.** `BAI_ICONS`, 29 named paths. Fully SSOT for the style
    guide (which renders every specimen from it and *throws* on an unknown name — it previously
    invented glyphs and that shipped looking fine). Only **partially** SSOT for the product:
    index.html consumes 10 named `*_PATH` constants from it, but 23 of 29 paths also exist as
    inline literals, mostly in static markup that can't reference a JS variable. `ds-drift-check.js`
    §6 reports that count so it stays visible.
  - `ds-drift-check.js` — **run this after any component change:** `node ds-drift-check.js`.
    Fails on invented specimen copy (every button label/placeholder must exist verbatim in
    index.html), coverage regression below a floor, unknown icon names, re-declared icon literals,
    and the guide restyling `.bai-*` itself. Also *reports* icon duplication and dead CSS. It exists
    because invented copy shipped twice and only a human comparing screenshots caught it.
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
- Design-system docs: `style-guide.html` (built 2026-08-01) — foundations (all tokens, live-tallied
  type/radius scales, the 29-icon set) + 19 sections across shell, components and full-screen
  states, house conventions, and a **self-measured** coverage figure computed at load rather than
  asserted. **Every component family has a section**; the remaining uncovered classes are the demo
  scene (documented but deliberately not specimen'd), mid-gesture modifier classes, and one-off
  descendants already visible inside their parent's specimen. The page lists every uncovered class
  by name, and prints the coverage percentage — **trust the page, not a number in this file.**
  (The figure quoted here was wrong within a week of being written. Live-tallied numbers belong in
  the thing that tallies them.)
- **Specimen fidelity is verified, not assumed.** `scratchpad`-logged audit compares every shared
  class between the guide and the running product across 19 appearance properties. Re-run it after
  adding specimens; it caught 4 real bugs on its first run, including this page's own body ink
  leaking into specimens and thereby masking components with no `color` of their own. Design reasoning lives in `visual-designer/` (taste.md,
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
