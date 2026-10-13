# BlueAI Product V2 Design System: the plan

Status: PLAN, awaiting Appy's go (2026-10-13). Nothing is built yet.

## 0. The purpose (Appy, 2026-10-13)

A design system and a DESIGN.md that the **PM builds V2's next iterations from**. Not a record of
V2 as it is. It:

- **starts from V2** and captures everything in it,
- **makes it better**: more user friendly, more minimal, every choice justified by the product's
  concept and logic,
- **covers what a pro-level system has even where V2 does not yet**: components, patterns and whole
  screens that do not exist in the product today,
- **is usable by the PM directly**: he reads DESIGN.md, builds a new feature or task from the
  system's parts and rules, and merges it into V2.

Modelled on the 6labs design system (`sixlabs/`, `/design-system` + `DESIGN.md`), built in three
workflow stages: a blind inventory with an architect, a parallel build, and blind review-and-fix
rounds until no high or medium issue was left. This plan keeps that shape, re-aimed at a target
system rather than a description.

---

## 1. What V2 is today, measured (at `c284779`)

- **11,042 lines**: `index.html` (1,244) plus 40 component files in `blueai/*.jsx`, React 18 with
  Babel in the browser, no build step. Components are exposed as `window.X` (35 of them). Four
  live only inside `index.html`: `ProductTitlebar`, `ProductTopBar`, `AICreditsScreen`, `App`.
- **No token layer.** 1,438 inline `style={{}}` objects, **264 distinct hex colours**, 7 CSS
  variables. Two grey ramps are mixed (Tailwind gray and slate side by side) and there are
  several blues. This is the first thing the system fixes.
- **More than one visual language**: the app's own light UI, the BlueAI worker onboarding
  re-skinned on creator-brand's theme, and the scenery around the app (Windows desktop, browser
  window, the website pages inside it).
- **States are reachable by URL** (about 20 params: `?end=`, `?mode=`, `?day=`, `?case=` ...) and
  by the dev panel, so real states can be shown, not redrawn.
- **Comparison variants sit beside the real UI** (`credits_popup_options`, `credits_page_options`,
  `chat_compare`); some are explicitly not shipping.
- **The PM owns the code** and every port overwrites it, so the system never edits V2's files.
  Improvements reach V2 through the PM's next iterations, built from the system.

---

## 2. What the PM gets

1. **DESIGN.md**: the PM's working spec, written so he (and any AI tool he builds with) can make a
   new feature that fits. It opens with the **product concept** (a partner hands a worker their
   accounts and their PC's time; trust, consent, the daily run, verification, credits) and the
   **principles** that follow from it, then every foundation, component, pattern and screen with
   its purpose, anatomy, states, rules, do and don't, and the reason behind it. It ends with
   **"How to add a feature"**: a step-by-step recipe from a new task to a merged screen.
2. **The live guide**: every part rendered and interactive, each state shown, every value in a
   drawer. Parts carry a status: **In V2**, **Changed from V2** (with what changed and why), or
   **New** (not in the product yet).
3. **A component kit in V2's own tech**: tokens as CSS variables plus components written the way
   V2's are (React 18, Babel in the browser, `window.X`), so the PM drops them straight into V2
   instead of re-implementing a picture of them.
4. **Recommendations for V2**: every place V2 differs from the system (file, line, what it is
   today, what the system recommends, why), prioritised. V2 itself is not changed: it stays exactly
   as the PM made it, and he decides what to adopt in his next iterations.
5. **New screens** a product like this will need, designed in the system: for example an earnings
   and payouts screen, a notifications list, account and connected-apps management, full empty,
   loading, offline and error states. The architect proposes the list; you approve it.

---

## 2b. One family with onBlue Agentic (Appy, 2026-10-13)

The product and onBlue Agentic are one journey: a partner finds onBlue Agentic, applies, runs the
product every day, and comes back to the site's dashboard to cash out. Their styles stay different
(the site is a cinematic marketing surface, the product is a working desktop tool), but they should
read as one family. The system adopts the site's DNA wherever it carries over, and says so per
rule. That is the direction, not a checklist: the six below are examples, and stage 1's reader 9
looks for every other way the two should feel related.

1. **Stroke, not shadow.** Surfaces separate with a very subtle 1px stroke. Nothing that sits in
   the flow (chat bubbles, cards, rows, chips) carries a shadow. Today V2 has 168 shadows, the
   user's chat bubble among them (`chat_bubbles.jsx:30`, a 30% indigo glow). A soft shadow is kept
   only for layers that truly float above the screen (dialogs, menus, toasts), where it says "this
   is on top". For reference, onBlue's light theme does the same work with 1px strokes at 10 to 15%
   ink, and keeps only a whisper of ambient shadow on cards and its solid button.
2. **Restraint in colour**: ink plus one accent; gradients and glows only where they mean
   something (the credits mark), not as decoration.
3. **The button ladder**: one solid button for the action that commits you; quiet buttons for
   routine actions (the site's own reasoning on its Cash out button).
4. **Shared shapes**: the same radius family (card, button, pill) unless the product has a reason
   to differ.
5. **One vocabulary and the same numbers**: program, partner, run, verified, balance, cash out,
   the $10 minimum, the 20-day period. The site's dashboard and the product must never describe the
   same fact in two ways.
6. **Calm motion and the muted note style** for secondary facts.

Candidates the inventory checks rather than assumes: the typeface (the site uses Inter, V2 uses the
Windows system font, which may be right for a desktop tool) and the accent blue.

## 3. Decisions (my recommendation first)

1. **Where it lives**: a sibling folder, `public/blueai-product-v2-ds/` (guide, kit, DESIGN.md),
   outside the PM's V2 folder so his ports never touch it. He copies it alongside V2. Index row
   **"BlueAI Product V2 Design System"** directly under BlueAI Product V2.
2. **Tokens**: one minimal set (one neutral ramp, one primary, the credits gradient, a short type
   scale, spacing, radii, elevation, motion), each mapped back to the raw values V2 uses today.
3. **Scope**: the BlueAI app in full, plus new parts and screens. The scenery (desktop, browser,
   website pages) gets a short Scene chapter. Comparison variants are left out, with a note on which
   one ships.
4. **Where the system and V2 disagree, the system shows the better way and says why**, and V2
   stays untouched. Where the PM's spec is explicit (his copy, his vocabulary: "Always ask" and
   "Automatic"), the system follows him unless it finds a real UX problem, which goes to him as a
   recommendation.

---

## 4. How it gets built: four stages

Same rules as 6labs throughout: agents read source only (no browser, no screenshots), cite
`file:line` for every value, write no em dashes, and never edit V2's files.

### Stage 1. Inventory and UX audit (read-only, blind), then the architect

Nine readers, each blind to the others:

1. **Foundations**: every colour, type value, spacing, radius, shadow, z-index and motion value,
   clustered into candidate roles, near-duplicates flagged.
2. **Shell**: window frame, titlebar, top bar, tabs, kebab menu, boot splash, skeletons.
3. **Chat**: composer, every bubble kind, choice chips, task progress, feedback, history.
4. **Worker**: sign-in, account gate, terms, per-app permissions, modes and consent, the ribbon,
   the run, run-complete and verification ticks, the 20-day bar, notifications.
5. **Credits and settings**: credits screen, out-of-credits, countdown, BYOK, AI mode, profile,
   settings rows, install dialogs.
6. **States and flows**: every URL param and dev-panel switch mapped to the state it produces, and
   every user journey end to end.
7. **UX audit**: friction, confusion, dead ends, unclear copy, missing feedback, consent and trust
   moments, accessibility, all with evidence. This is where "make it better" starts.
8. **Gaps**: what a pro-level product system has that V2 lacks, components, patterns and screens.
9. **onBlue Agentic DNA**: what the site does (strokes, elevation, colour restraint, button
   ladder, radii, type, motion, vocabulary) and which of it the product should share, plus what to
   inherit from the 6labs, onBlue Agentic and Terminal Modern guides' structure.

Then **one architect** turns the nine reports into the target system: concept and principles, the
token set, the section list, each part's status (In V2 / Changed / New) with its reason, the new
screens, the state matrices, the DESIGN.md chapters and the review lenses.

**Checkpoint 1, Appy:** the concept and principles, the token set, the list of changes to V2 and
the list of new parts and screens, before anything is built.

### Stage 2. Build

1. **Foundation**: the guide shell, the catalog, the values drawer, the state grid, the
   real-state viewer, and the tokens as CSS variables.
2. **Kit and sections**: about ten builders in parallel, each owning one slice: the kit
   components for it, its guide section and its DESIGN.md chapter.
3. **Screens**: the new screens and the improved versions of existing ones, built from the kit.
4. **Compose**: Start here, concept, principles, "How to add a feature", the recommendations for V2, coverage,
   known gaps.
5. **Gate**: every script parses, every value assertion holds, no em dash anywhere, the 300-line
   rule per script.

### Stage 3. Blind review-and-fix rounds

- **Twelve blind reviewers**, one lens each: concept fit, UX and usability, minimalism (anything
  that could be removed), family resemblance with onBlue Agentic, anatomy, states, tokens and scales, copy and voice, accessibility,
  usability of DESIGN.md for the PM (could he build a new feature from it alone?), completeness,
  runtime safety and code hygiene together.
- **Triage** checks every finding against the code and drops the false ones; **fixers** work in
  non-overlapping areas; the gate runs again.
- Rounds repeat until no high or medium issue is left, at most three. Then a **senior product
  designer** scores the system out of 100 and lists what stands between it and 95.

**Checkpoint 2, Appy:** you review the guide in the browser. I do not look at it myself.

### Stage 4. Hand-over

- Index row under BlueAI Product V2; push only after your go.
- The PM receives the folder, DESIGN.md and the recommendations for V2.
- After each PM port, a check shows which mapped values in V2 changed, so the recommendations stay true.

---

## 5. Cost, plainly

6labs-level depth: about 10 agents in stage 1, about 15 in the build, about 22 per review round
(up to three), so roughly 60 to 110 agent runs end to end. A lighter version (fewer readers, one
review round) costs about a third and catches less.
