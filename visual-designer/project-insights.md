# blueAI — Project Insights
Last updated: 2026-08-11 (Session 17, POST-CLOSE amendment: the gutter question this file had flagged as
"⚠ OPEN, designer's call" since 2026-08-03 is now RESOLVED — 15px everywhere — and the form-width fact moved
264 → 260px as a direct result, its FOURTH revision. Both bullets rewritten in the layout-system section
rather than annotated, because a fact file that accumulates "actually, now it's…" is a fact file you stop
trusting. Earlier the same day, Session 17: +the overlay/z-layer inventory and the notification-surface taxonomy in the
layout-system section — the app now has THREE notification-weight tiers and a reader had no way to know which to
reach for; +the `#scaler` two-coordinate-space fact, which is a property of this surface's shell, not a bug.
Earlier: 2026-08-04 (+the boot-canvas fact in the layout-system section: `.bai-header`/`.bai-titlebar`
have no CSS background on purpose, because a continuously-repainted canvas underneath is what actually
renders there — an opaque background silently deletes it with no error, cost a designer round to catch.
Earlier: 2026-08-03, Session-15 audit pass: added the blueai-desktop LAYOUT SYSTEM section below — the active surface had almost no facts here, which is why today's container defect had nothing to check against. Corrected a false Index claim and marked the marketing-site sections as dormant-scope. NOTE ON THIS LINE: it said 2026-07-25 while the file already contained a 2026-08-01 correction — the previous audit reported this file "re-pointed" after patching one paragraph, and the wrong date meant the mandated freshness check would PASS on a stale file. Bump this on every touch; the check reads it.)

## blueai-desktop LAYOUT SYSTEM — the active surface's measurements (added 2026-08-03)

*Why this section exists: an audit found that of ~200 lines in this file, roughly 15 described the surface
VDA actually designs. Today's container defect — a wrapper double-paying a gutter — had no facts file to be
checked against, so it took the designer's eye. These are the numbers a design decision on this surface
needs, and they are recorded here, once, instead of being re-measured per session.*

- **Drawer width: 290px.** That is `.drawer`'s base width AND its detached `min-width`, so it is the
  narrowest layout anything here must survive. Default open state is a detached floating window
  (`360×640`); a `ResizeObserver` adds `.wide` at **≥600px**; detached `max-width` is 920px.
  **Design at 290 and verify at 290/380/920** — passing at 360 proves nothing about the floor.
- **ONE gutter: 15px, everywhere. RESOLVED 2026-08-11 by the designer** ("we should fix this match by 15px
  only"), closing a question open since 2026-08-03. `.bai-list-body` and `.bai-subpane-body` both now pay
  `sp-14` of side padding, so a **list view's and a subpane's content edge both sit at 15px** from the drawer
  edge (+1px drawer border). Previously the subpane paid `sp-12` → 13px, which was consistent across Skills and
  Scheduled (house behaviour, not drift) but meant tapping from a list into its own detail screen shifted every
  element 2px left. **Tops still differ and that is deliberate:** `.bai-subpane-body` keeps `sp-10` because a
  `.bai-subpane-head` sits above it, while `.bai-list-body`'s `sp-2` is half a gap shared with the toolbar above
  it (see `#baiSchedList`, which has no toolbar and therefore needs its own `sp-14` top).
- **A subpane form's usable content width is 260px** at the 290px drawer (`290 − 2px borders − 28px
  subpane-body padding`), as of the 2026-08-11 gutter unification — **it was 264px** while the subpane paid
  `sp-12`. **This number has now been wrong or stale FOUR times** — 210px (measured on a shorter form that
  didn't yet scroll), 179px (correct *for a form wrapped in a `.bai-newitem` card that double-paid the gutter*),
  264px once that wrapper was removed, and now 260px once the gutter was unified. Every one of those was
  honestly measured against the containment of the day. See `reasonings.md` *"A measured constraint inherits the
  wrongness of whatever produced the measurement"* — and note the corollary this fourth revision proves: the
  figure goes stale when the CONTAINER changes, not only when the measurement was sloppy.
- **What fits at 260px, re-measured 2026-08-11 at a 290px drawer** (not carried over from the 264px era): the
  4-across `.bai-seg.fill` (`Minutes/Daily/Weekly/Monthly`) is single-row with zero overflow, and the row of
  **7 day chips is single-row at 31px each = 217px of chips inside a 238px `.bai-daygrid`**, zero overflow, no
  text clipped. (`.bai-daygrid` is narrower than the form because `.bai-subfield` indents it.) Neither fits at
  179px, which is why intermediate versions had a 2×2 grid and a 4+3 wrap. The chip row remains the tightest
  known element in any subpane — **re-measure it if the day labels change, if the gutter moves again, or before
  adding anything to `.bai-subfield`.**
- **A scrollbar is layout, not chrome.** `.bai-newitem`'s `overflow-y: auto` scrollbar takes ~16px whenever
  its content is tall enough, and that silently changes every width derived inside it. When measuring a
  container's inner width, note whether it is scrolling at the time.
- **Forms live in subpanes, with no card wrapper.** Both create forms put `.bai-field-group` children
  straight into the subpane body. The subpane's own head row + full-screen background are the container;
  a bordered card inside one is redundant (rule 38) and misaligns (rule 46). Inter-group spacing comes from
  `.bai-field-group`'s own `margin-bottom`, never a `gap` on the parent — so both forms breathe identically.
- **Three independent overlay shells, and they are not a hierarchy.** `#baiSubpane` (Skills),
  `#baiSchedSubpane` (Scheduled), and GlobalRoute (cross-tab utilities — Chat History / Profile / AI Credits
  / compact Settings; starts below the header and covers the tab strip). A tab's own contextual need gets its
  own shell rather than a deeper nesting level of someone else's.
- **Nodes are MOVED between live parents, never detached.** `#baiSchedForm`, the shared date/time picker
  (parked in `#baiDtPickerHome`), the `+ New task` row (parked in `#baiSchedAddHome`) and `#paneSettings`'
  `.bai-set` are all relocated by `appendChild` between two always-attached parents. A detached node is
  invisible to `getElementById` and never returns — that shipped as a real bug twice. Any function that wipes
  a container's `innerHTML` must park the moved node FIRST.
- **`.bai-header` and `.bai-titlebar` have NO CSS background — on purpose, and it is load-bearing.** A canvas
  (`boot.js`, the `<canvas class="bai-cv">` inserted as `.canvas`'s first child) sits behind the entire drawer
  and continuously repaints: the live twinkling pixel logo (`drawLiveLogo`), ambient sparkle packets streaming
  right-to-left (`spawnPacket`/`ambientStep`), and a heartbeat ring every ~12s. It shows through ANYWHERE the
  DOM above it is transparent — which used to mean the whole header row. **Giving `.bai-header` an opaque CSS
  background silently deletes all of that with no error** (2026-08-04, cost a designer round to catch: "what
  happened to logo and traffic, I don't see it"). If the wide-mode nav shell ever needs a different tone here
  again, it must be painted INTO the canvas (`boot.js`'s `HDR_BG`/`HDR_H`, driven by `baiCtrl.setWide(isWide)`,
  which reads `--bai-shell-bg` live via `getComputedStyle` — never hardcode the hex), never as a DOM background
  on `.bai-header` itself. `HDR_H = 76` = 30px titlebar + 46px header; both are fixed regardless of drawer width.
  Two other canvas call sites exist and are unrelated to the header: `drawMini()` draws the chat "thinking"
  indicator's own small canvas, and (separately) the wide sidebar's own `#baiSideLogo` canvas — which is itself
  always invisible, since `.bai-side-brand{display:none}` is unconditional ("header carries the logo now" —
  meaning the titlebar's real logo.png, not this canvas).

- **THREE notification weights, and picking the wrong one is the recurring mistake.** They differ by whether
  they BLOCK and how long they LIVE, not by how important the message is:
  1. **`.bai-dialog`** — blocking (scrim + focus trap + `aria-modal`), persists until dismissed. For anything
     that ASKS A QUESTION: sign-out, close-window, delete-skill, delete-task (confirm shape), plus the
     key-saved ACK shape. Two shapes, one root; the ack is not "a confirm with Cancel hidden."
  2. **`.bai-tgmodal`** — also blocking, but owns a multi-step FLOW with its own header/body/footer (Telegram
     pairing, Hybrid setup). Reach for this only when the interaction has steps.
  3. **`.bai-toast`** — non-blocking, transient, self-dismissing (2.5–4s, content-scaled), top slide-down.
     For anything that STATES A FACT and asks nothing: credits arrived (`reward`), something failed (`alert`).
  **The test:** does it ask a question (→ 1), walk through steps (→ 2), or just report (→ 3)? A blocking scrim
  over information the user can't act on is the wrong weight — that was the original argument for building
  tier 3 at all, and it's the thing to re-check any time a new "notify the user" need appears.
- **`.bai-toast` is the app's ONLY non-blocking notification surface**, so it has no sibling to inherit from —
  which is exactly why its two variants (`reward`/`alert`) are states of ONE root rather than two components,
  and why both reuse existing chips (`.tgm-ic-ok`'s ok-wash recipe / the danger token at matching strength)
  instead of introducing new colour vocabulary. If a third variant is ever needed (info? progress?), it is a
  third state on this root, not a fourth component.
- **The z-layer inventory, in order, so a new overlay doesn't have to guess.** `--bai-z-5/6` (sidebar,
  menu-desc) · `30` (in-pane menus) · `45` (tour) · `50` (`.bai-subpane`) · `55` (`.bai-globalroute`) ·
  `58` (`.bai-header` — creates its own stacking context, so its children can't out-z anything outside it) ·
  **`59` (portaled floating overlays: `.bai-dt-picker`, `.bai-toast`)** — deliberately above header/subpane/
  globalroute, deliberately below · `60` (`.bai-titlebar`, so OS window controls always win) · `220`
  (`.bai-dialog`/`.bai-logingate`) · `230` (`.bai-tgmodal`) · `500` (dev Preview panel). **A new floating
  overlay anchored inside a pane belongs at 59;** a new blocking one belongs at 220+.
- **`#scaler` puts the whole app behind a CSS `transform: scale()`** (~0.33 at compact width, 1.0 at wide).
  This is a property of the demo shell, not a bug, and it means **`getBoundingClientRect()` and `offsetWidth`
  report in different coordinate spaces on this surface** — see `knowledge-base.md` for the two defects this
  has already caused and the measurement rule that prevents a third. Any code or harness that does px maths
  here must decide which space it is in, once, explicitly.

## blueai-desktop domain facts (2026-07-25 audit)
- **BYOK and Prime membership coexist — neither state should hide the other's UI.** A user with an
  active own-key AND an active Prime membership sees BOTH: the "Running on your own key · ACTIVE" card
  AND a separate "Prime credits · PAUSED" card (Prime isn't canceled, just not being drawn from). A
  full-credit Prime member should still see a path to add their own key — BYOK isn't exclusively a
  fallback for people without Prime. Confirmed on the AI Credits screen's Prime-member branch, which
  had omitted the "Add / manage own key" action entirely (an oversight, not an intentional exclusivity)
  until the designer caught it: "even when you have credits and you are a prime member... we should
  give an option to add your own key right?" Any new blueai-desktop screen surfacing credit/key state
  should default to assuming both can be true at once, not either/or.
- **`renderAiCreditsScreen(el)`'s actual container is `#baiGlobalRouteBody` (class `.bai-subpane-body`,
  `display:flex; flex-direction:column; gap:8px`), NOT `.bai-set`** (which has no uniform gap — spacing
  there is deliberately margin-driven). Any spacing math for this screen must account for the container's
  own 8px gap stacking with whatever margins its children carry — don't assume `.bai-set`'s "no gap"
  convention applies here just because the visual style looks similar.

## Style guide architecture (S5) — DORMANT SCOPE: this is the MARKETING site's guide
*(Scope note added 2026-08-03. Everything in this section describes the dormant marketing site's React `/style-guide` route. The ACTIVE surface's design-system reference is a different artifact entirely — `public/blueai-desktop/style-guide.html`, a single self-measuring page that links the product's own stylesheet and icon module. Do not apply this section's architecture to it.)*
- **Sidebar:** surface-grouped accordion (Foundations · Components · Site & patterns · Agent pages · Marketing pages · App (PM)) — only the active group's items render; sentence-case light headers + per-group counts + a tree-line. Section ids drive scroll-spy; `tok-*` ids are linkable token anchors that RING on `:target`.
- **Documentation model:** terse one-line ROLE notes everywhere; PREVIEW + ANATOMY (`components/style-guide/Anatomy.tsx`) only on the 7 heavy components (Download CTA · Marketing header · form kit · file upload · bubbles · credits pill · SEO task card). Molecules documented standalone in "Form field molecules".
- **Form molecules:** `components/agent/form-kit.tsx` — all 4 agent forms compose these; never hand-write `.jmf` field markup.
- **Index (`/`):** grouped ACTIVE-above-DORMANT since 2026-08-01, nine cards, with the pivot date in the dormant group's label — Terminal Modern (blueai-desktop) and its own Design System sit on top; the marketing site, /blueai-product, /moneymaker, /live-demo-v2, /clay and /blueai-creators sit below at reduced opacity. Grouping by status IS the information. *(This bullet previously read "exactly 3 entries — SEO Homepage, Hero Options, Style Guide". That was falsified on 2026-08-01, when the reorg found the active surface sitting sixth of nine and the pinned DS card pointing at the dormant marketing style guide. Recorded as a correction rather than silently swapped: an enumeration in prose goes stale the first time something is added — count nothing here that the page itself can show.)*

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
- **S4 (2026-06-12) — agent pages made faithful + interactive.** `AgentShell` now takes `demo`, `feature`,
  and two optional knobs: **`heroAside`** (apply-to-jobs swaps the default hero Download-CTA for a
  "Latest openings" mini-list) and per-agent data fields **`seoBlocks`** (always-visible H3 SEO content,
  rendered in the what-is section, or a standalone section before the FAQ when an agent has no `whatIs`)
  + **`hiwHeading`** (per-agent how-it-works H2 — was hardcoded). The 4 hero demos are now interactive
  client components on the shared `.jmf-*` form kit (`components/agent/{CareerForm,CreatorForm,FinanceForm,MarketsForm,FileUpload,VideoCard,glyphs}` — see KB "Agent demo form kit"). Finance adds an "Every trade"
  trade-log section. social-rewards hero = scattered Reddit collage (absolute, per-card transforms). Real
  "Made by the agent" videos in **`public/videos/`** (3 mp4 + posters, ~36MB, downloaded from the live site).
- **S6 (2026-06-13) — the PM's "hire a worker" homepage, two ways.** `/live-demo` = a byte-exact STATIC
  CLONE of `ashish-pathak-bst/blue-ai-demo` (2 HTML files in `public/live-demo/`; `/live-demo` REDIRECTs to
  `/index.html` so the relative `app.html` iframe resolves). **EXEMPT from the DS** — a PM artifact hosted
  as-is; pristine source kept in `design-source/blue-ai-demo/`. `/live-demo-v2` = the **DS REDESIGN** of the
  same funnel: scoped `.ldv2` (`styles/live-demo-v2.css`), `components/ldv2/*` (`Ldv2Hero`+`Ldv2WidgetIntro`,
  `Ldv2Nav`, `Ldv2Workers`, `Ldv2Proof`, `Ldv2Lower`) + `lib/ldv2-data.ts`. Anchor-only nav (island funnel,
  taste 32); reuses the legacy scenes; framer motion throughout. Signatures: docking widget + blueprint
  beam-wipe assembly intro. The hire WIDGET is the PM's `app.html`, copied to `public/live-demo-v2/widget.html`
  and reskinned to the DS via a `:root` token-MIRROR (iframe can't read app vars; flow/login byte-identical).
  v2's new patterns are documented in `/style-guide` (Marketing-pages group) under `.ldv2.sg-demo`.
- **S6.5→S8 era (06-13 → 07-03) — the route map's CURRENT truth:**
  - **`/live-demo-v2` = THE FINALIZED HOMEPAGE** (kept at its route; `/` stays the Screen Library index).
    Hub-converted: shared MarketingHeader (per-page `links`/`cta` props) + MarketingFooter; custom
    Ldv2Nav/Ldv2Footer deleted (CSS cleaned at S8). Worker cards link to the agent pages. Login gate stays.
  - **`/live-demo` (byte-exact clone) REMOVED** — pristine PM source kept in `design-source/blue-ai-demo/`.
  - **`/ai-video-creator-v2`** — the Studio CONCEPT page (bespoke `.v-creator`: three.js GradientCanvas
    hero, gsap marquee, freemium mock flow, portaled `CreatorSelect`). NOT SG-synced — concept pages sync
    only when finalized. The original `/ai-video-creator` agent page is untouched.
  - **DEPRECATED but on disk** (removal parked — designer: "later"): `/seo` · `/hero-options` · `/hero/*`
    + their components (seo/*, HeroNav [fully orphaned], HeroStage/Cards/StageOriginal, BaiHome/FeatureRows/
    AllSkills, rich scenes) + CSS (hero-*.css, seo-home.css, homepage.css, hero-nav.css) + orphaned tokens
    (--bai-accent/indigo/warning/info/scheduled/jobs, --bai-content).
  - **SUPERSEDED (2026-07-25 scope pivot — this sub-bullet kept as history):** the framing below described
    `/blueai-desktop` as a "DS-unbound experiment" and `/moneymaker` as the next build. Both are wrong now:
    **`/blueai-desktop` is the ACTIVE surface and has its own design system** — `blueai-desktop.css` (the
    tokens + components ARE the DS), `blueai-icons.js` (every glyph named), `style-guide.html` (a live VIEW
    onto them, self-measuring), `ds-drift-check.js` (the gate; run it before saying done). `/moneymaker`
    WAS built — three variants (Autonomy OS / Mission Control / Capital Shift) at src/app/moneymaker/,
    arrived in the other-machine sync; dormant. `/blueai-product` is dormant alongside the marketing site.
    - *Old text:* "Standalone DS-UNBOUND experiments: `/blueai-product` (CDN+Babel clone of the live app) ·
      `/blueai-desktop` (static terminal-drawer experiment, own dark/light theme system) · `/moneymaker`
      (S8, upcoming)."
  - **`WAITLIST_URL`** (site-data) = the acquisition-CTA SSOT everywhere (pre-launch posture, S7); real URL
    still TODO-handoff.

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
- **Two-session dev:** the second server runs on :3001 with `BLUEAI_DIST_DIR=.next-3001` (launch config
  `blueai-3001`) — isolates the build cache so parallel sessions can't corrupt each other (S6.5 fix).

## Known / flagged
- **PARKED REMOVAL PASS** (designer: "later"): delete the deprecated /seo + /hero routes/components/CSS +
  the orphaned tokens above + delist "SEO Homepage"/"Hero Options" from the root index. Blast radius mapped
  06-16 (see decisions row); KEEP the 4 Legacy scenes (homepage worker cards use them) + MarketingHeader/
  Footer + site-data.
- **Known copy debt (S7, flagged not changed):** body copy still says "It is live / free to download /
  Download BlueAI to…" on several surfaces while CTAs say "Join the Waitlist"; /developer in-body
  "Claim 25,000 Credits" CTA; creator-v2's share→publish Download flow kept (breaks its install narrative
  otherwise). Reconcile when the designer picks the launch posture.
- ✅ CSS-leak fix DONE (S2) — the 3 hero stylesheets are scoped under `.v-*`; the leak class
  (text-align + `.hero` padding + the Stage-Original `.cv-trend`) is structurally closed.
- Hero motion timing is a first-pass approximation of the original GSAP — retune on review.
- `design-source/FIX-LATER.md` — the parked Recommended-hero polish items were resolved before S2.
- Full blueai-modern DS zip ("BlueAI Modern.zip" in Downloads) holds deeper preview
  cards + the in-app panel ui-kit if we extend the /style-guide later.
