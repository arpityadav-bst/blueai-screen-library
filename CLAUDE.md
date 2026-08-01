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
pivot) + taste **rules 38-44** (the cross-surface craft rules) — not the marketing site's rules 1–37
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
3. `visual-designer/taste.md` — read the SCOPE PIVOT note at the top first, then **rules 38-44**
   (this list said "rule 38" while 39, 40 and 41 were already live — including 41, the one the
   2026-08-01 switcher bug turned on); rules 1–37 are dormant-surface reference
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

**The worst-repeating defect comes out of that one gap** — invented glyphs, then invented copy, then a
four-state login flow documented as one invented state, then (2026-08-01) a specimen paragraph left
behind after its product copy was deleted. *Failing to delete* is the same defect as inventing.

This paragraph used to end "Nothing else has failed," which was false and worth keeping as a caution:
the skill-switcher `font-weight` reflow was a CSS metrics bug, the icon migration's first version
rendered six glyphs empty, and the hover-popover, `cursor: default` and divider-redundancy corrections
were none of them specimen gaps. A sentence that flatters one's own model of the failure mode is how
the *other* failure modes stay unwatched.

### Therefore: INVERT the deferred-Gate-5 cadence

`vda-core/workflow.md` defers style-guide sync to the audit pass. That is right for WSUP, where the
guide is a separate React route and syncing is expensive. **It is wrong here.** When specimens are
hand-written, deferring the sync does not produce staleness — it produces **fabrication**, because the
later pass writes what it remembers instead of what it reads. That is the exact mechanism behind every
invented-copy incident. Here the sync costs one edit in one file.

> **For blueai-desktop: specimen + prose sync is INLINE, same edit. Decisions promotion stays deferred.**

### The rule that makes fabrication rare (not impossible — see the table)

> **Specimen copy is never authored. It is quoted.** Every user-facing string in a specimen must exist
> verbatim in `index.html`. If you cannot find it there, you are inventing it.

This is a discipline, not a mechanism. It was previously headed "makes fabrication structurally
impossible," which was wrong: §1 samples `<button>` text and `placeholder=`, and the 2026-08-01 stale
`<p>` sat in a specimen for exactly as long as it took an audit to read it. Assume it is on you.

### Same-edit obligations, and how much of each is really enforced

**Read the "gap" column before trusting a row.** An audit found this table over-claiming on three of
six; the check now prints its own scope footer, which is authoritative over anything written here.

| If the edit touches… | Same-edit obligation | Partly caught by | The gap you still own |
|---|---|---|---|
| a new CSS class | a specimen renders it | §2 coverage **floor** | a floor, not a check — several classes can ship uncovered before it trips |
| a new `--bai-*` token | a row in the guide's `GROUPS` | the guide self-reports omissions | none known — this one genuinely works |
| a size / radius / spacing / weight / line-height / letter-spacing / z-layer / motion value | the matching `--bai-*` token | §8 (sizes+radii incl. longhands, zero exemptions) | spacing/weight/etc. have tokens but no gate yet; widths and rem are invisible; the *right* token is never checked |
| an icon | named in `blueai-icons.js`, consumed by name | §4 (literals), §6 (duplication+unnamed), §9 (right glyph, via label/aria/class anchors), §10 (hydration position), §11 (no hand-drawn guide glyphs) | specimens with NO anchor of any kind are still unverified — §9 prints how many |
| a component's **markup / copy / states** | specimen re-derived from `index.html` | §1, for `<button>` text + placeholders | **markup and states are not checked at all** — which is exactly where the four-state login flow defect lived |
| a class removed from the product | its CSS rule removed too | §7 **reports**, never fails | nothing stops a dead rule landing |

**Run `node ds-drift-check.js` before saying done** — then read its scope footer, not just PASS. It
narrows the gap that has bitten four times; it does not close it, and it has itself printed a false OK
before now. Where the table says you own the gap, you own it.

### Notebook

Keep using `blueai/visual-designer/` — it is already blueAI-scoped and the SCOPE PIVOT note re-pointed
it at blueai-desktop. Do **not** create a second notebook; per-product separation exists to stop
WSUP/now.gg cross-contamination, and blueai-desktop is not a different product from blueAI.

### Promotion rule: state the mechanism, not the instance (added 2026-08-01)

**Gate 6.5 (Generalization Probe) runs on every rule PROMOTED, not only on new work.** This is a
blueAI-scoped addition to the shared cadence; `agents/vda-core/` is protected and unchanged.

It exists because of a measured failure. Taste rule 41 — *hierarchy carried by colour does not also
need to be carried by size* — already covered the skill-switcher reflow bug. It never fired, because it
had been written as "two text roles a half-step apart": the width of the single example that taught it.
A component **state** never matched that description, so a live bug sat in the product while the rule
governing it sat in the notebook. Widening it was a one-line edit that should have happened at
promotion time, months earlier, for free.

**Before writing any rule into `taste.md` or `reasonings.md`, answer three questions in the rule itself:**

1. **What is the mechanism, stripped of this instance?** Rule 41's mechanism is *colour vs type
   metrics*. Its instance was *captions vs body-small*. Write the first; cite the second as an example.
2. **Where else does this mechanism apply?** Name at least one surface the originating instance did not
   touch. If none can be named, the rule may genuinely be a one-off — say so explicitly, so the next
   reader doesn't have to re-derive whether it generalizes.
3. **What would make this rule fail to fire?** Usually a noun that is too specific ("text roles",
   "dividers", "modals"). Replace it or the rule catches exactly one bug: the one that already happened.

**The notebook's problem has never been volume.** The taste file alone runs to hundreds of lines
(counting it here would repeat the very mistake this section is about). Every recurring defect this project has had was already covered by something written
down. The failure mode is rules phrased so narrowly they only match their own origin story.

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
  - `blueai-icons.js` — **the icon set.** SSOT for the style guide (which renders every specimen
    from it and *throws* on an unknown name). For the product: every path **that is in the module**
    is now reached by name, via three call shapes documented in its header. Since batch 3
    (2026-08-01), §6 counts ZERO unnamed inline glyphs — every icon the product draws is named;
    the only svg outside the module is the credits ring gauge, a runtime data-viz component.
    **No counts here on purpose** — `ds-drift-check.js` §6 prints them (module size, duplication,
    and unnamed-glyph count) every run. Four numbers written in this bullet were wrong at once
    before they were deleted; the header of that file records three separate versions of the same
    mistake. Read §6.
  - `ds-drift-check.js` — **run this after any component change:** `node ds-drift-check.js`.
    Fails on invented specimen copy (every button label/placeholder must exist verbatim in
    index.html), coverage regression below a floor, unknown icon names, re-declared icon literals,
    and the guide restyling `.bai-*` itself. Also *reports* icon duplication and dead CSS. It exists
    because invented copy shipped twice and only a human comparing screenshots caught it.
  - `style-guide.html` — **the DS reference.** Open at
    `http://localhost:8410/blueai-desktop/style-guide.html`. Links the product stylesheet + icon
    set and renders real components inside `.bai-scope`, so their **styling** cannot drift (markup and
    copy still can, and have — the guide's own page says "that's a real drift vector"). Everything numeric is
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
- Local preview: the workspace-root `../.claude/launch.json`'s `blueai-desktop` config (NOT
  `blueai/.claude/`, which does not exist) (`python -m http.server 8410
  --directory blueai/public`) → `http://localhost:8410/blueai-desktop/index.html`. Note: this
  server drops between sessions fairly often — check it before concluding something's broken.
- Design-system docs: `style-guide.html` (built 2026-08-01) — foundations (tokens, live-tallied
  type/radius scales, the icon set) + sections across shell, components and full-screen
  states, house conventions, and a **self-measured** coverage figure computed at load rather than
  asserted. Every component family has a section. **The page lists every uncovered class by name and
  prints the coverage percentage — trust the page, never a summary here.**
  This bullet used to characterise the uncovered set as "the demo scene, mid-gesture modifiers, and
  one-off descendants." An audit found that list wrong: it also contains component ROOTS
  (`.bai-logingate`, `.bai-tgmodal`, `.bai-onb`, `.bai-tour`, the `tgm-*` pairing family) and the
  handful §7 reports as dead CSS — a category the sentence didn't mention at all. The guide's own
  version of this paragraph ends "Trust the list above over this paragraph"; whoever copied it here
  dropped that hedge, which is the whole reason the copy went wrong.
- **Specimen fidelity checking:** `ds-drift-check.js` is the live tool — run it. (A one-off
  computed-style comparison harness was used during the 2026-08-01 build and caught 4 real bugs,
  including this page's own body ink leaking into specimens and masking components with no `color`
  of their own. It was never committed, so "re-run it" is not actionable; rebuild it if you need
  that class of check again.) Design reasoning lives in `visual-designer/` (taste.md, reasonings.md,
  decisions.md).
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
