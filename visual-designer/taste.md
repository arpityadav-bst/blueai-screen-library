# blueAI — Taste
Last updated: 2026-08-11 (+rule 48 (box shape is an output; owe the travel axis a floor, not a shape — with
its own runtime gate, `icon-target-audit.js`) +rule 49 (align a mixed-height row on the axis that survives a
content-length change) +rule 50, added at the POST-CLOSE promotion (an action row's layout is decided by label
FIT, not button count; and "committing action sits right" is an ORDER rule, so it does not apply to a lone
action — designer-taught, and it overturned a well-argued independent-review finding) — Session 17.
Earlier: 2026-08-04 (+rule 47 (group by role not adjacency; depth as hierarchy — designer-taught over
two rounds) — header on every touch per the Session-15 lesson, since a stale date here is what let this file
go two sessions unread before). Earlier: 2026-08-03 (+rule 46 (a wrapper's correctness is a function of what
it wraps) + rule 38's fail-to-fire clause corrected — the Session-15 audit pass). 2026-08-01 (+rule 45 (create-affordance placement ground theory, designer-taught over five rounds); +rule 44 (concentric nested radii, designer-taught); +rules 42 (choice-control copy) & 43 (deliberate one-offs); Q2/Q3 answers added to 38-40 per the promotion rule; rule 41 restated as a MECHANISM — non-layout vs layout-affecting channels — after an independent audit judged the first widening had generalised the title but not the trigger; cross-linked to rule 38; rule 39's stale radius count corrected). 2026-07-25 (SCOPE PIVOT, designer directive — see note below. +rule 38 (divider redundancy),
now a primary cross-surface rule rather than a marketing-site-only exception.)

> **SCOPE PIVOT (2026-07-25, designer directive):** the marketing site (rules 1–37 below) and
> `/blueai-product` are both DORMANT — not deleted, not wrong, just not where active work is right
> now, and possibly not for a long time. **`/blueai-desktop` (the "modern terminal" prototype) is
> the active surface going forward** — this reverses the prior framing, where blueai-desktop was
> the DS-unbound exception to the marketing site's rules. Rules 1–37 stay on record (real, hard-won
> learning — re-derive nothing if the marketing site resumes) but are no longer what Gate 8 reviews
> new work against by default. blueai-desktop's own design system is being extracted into
> `public/blueai-desktop/style-guide.html` (live specimens + tokens, built from
> `index.html` itself, since none existed anywhere before 2026-07-25) — that file + **rules 38-45**
> below are what govern blueai-desktop work now. If the marketing site or /blueai-product ever resume,
> flip this note back — nothing here needs to be rebuilt, just re-prioritized.

> blueAI's design *language* — how it should feel — so VDA can design new blueAI
> surfaces from instinct. Seeded from the Claude-design export's DS README (which is a
> real designer spec, not inference) + the marketing-site export. **This is blueAI's
> house style and is unrelated to WSUP's or now.gg's.** Tokens live in
> `tailwind.config.ts` + `src/app/globals.css` (the `--bai-*` layer); see `/style-guide`.
> **(Marketing-site tokens/style-guide — see the scope pivot note above for blueai-desktop's own.)**

## What blueAI is
**BlueAI is the AI assistant built into BlueStacks App Player** — wordmark "BlueAI by
now.gg" (sits under the now.gg parent brand). The in-app product is a slim 294×593
right-side panel. **What we built here is the MARKETING/PRODUCT SITE** (hero directions
+ homepage) that sells it — design-only handoff replica, same philosophy as WSUP/now.gg.

## The core feeling
**Calm, modern, trustworthy utility.** Not playful, not loud. A cool near-black neutral
system on white, punctuated by ONE brand gradient. Motion is calm (150–240ms, no
springy bounces) — "a utility assistant, not a toy."

## Codified taste rules (seed from the DS — refine as the designer corrects)

1. **The gradient is the whole brand, and it only ever appears AS a gradient.**
   Iris `#7B4CFF` → Cyan `#0EA4C5` (0° top→bottom-right). NEVER use either stop as a
   solid fill on its own. It lives on: the logo tile, the send button, the ✦ sparkle,
   primary CTAs, and a 10%-alpha **wash** (`bg-bai-wash`) behind suggested-action pills.
   Overusing it kills it — most of the UI is white-on-cool-neutral.

2. **Cool near-black neutral ramp, white canvas, NO dark mode.** Text steps:
   display `#080A1F` → heading `#1B1E38` → body `#2B2E4C` → muted `#434664`. Surfaces:
   canvas white, `surface #F7FAFF` (1% blue-tinted), divider `#DFE4EE`, stroke `#B6B8CC`.
   Everything has a slight blue cast — never warm grays.

3. **Hairlines, not shadows.** Elevation is border-driven: `0.5px` on cards/composer,
   `1px` on the header. Shadows are reserved for floating/menu layers only
   (`shadow-float` / `shadow-overlay`). Don't reach for drop-shadows to separate things.

4. **Three typefaces, clear jobs.** Inter (SF Pro substitute) for UI/body; **Space
   Grotesk** for marketing display headings (`font-head`); **Bricolage Grotesque 700**
   for the wordmark only. No serif, no mono in the brand (JetBrains Mono appears only
   inside agent-demo data viz — tickers, match %, portfolio values). Tight scale.

5. **Rounded, soft, friendly geometry.** 8px (cards), 12px (composer/panels), 128px
   (pills, fully rounded), circle (send button). Message bubbles use an asymmetric
   `12 12 0 12` (sent) / `12 12 12 0` (received).

6. **Copy is warm, concise, sentence-case, second-person.** Almost every UI string ≤6
   words. Verb-first. Emoji are first-class category markers (🧠 Skills · 💼 Jobs · 🗓️
   Schedule · ⚙️ Personalize · 👋🏻 greeting). ✦ prefixes AI-suggested one-tap actions.
   BlueAI refers to itself in the third person ("Send a message to BlueAI"), never "I".
   No exclamation marks, no em-dashes, no corporate fluff. Button labels are Title Case.

## The marketing site (this export) — added layer over the in-app DS
7. **Marketing display = Space Grotesk, big and tight.** Hero/section headlines use
   `font-head` 600, `letter-spacing:-.03em`, clamp() sizes (≈34→60px). `text-wrap:balance`.
   A marketing slate `#0F172A` is used for these big headlines + a marketing blue
   `#2F6DFF`/`#3D7BFF` for in-card eyebrows/links (distinct from the brand iris).

8. **The hero sells by SHOWING an agent work, not by claiming.** The centerpiece is a
   live agent demo (Career / Creator / Finance) that plays its real process end-to-end
   (search→apply→"Applied ✓", describe→render→deliver, ask→data→email). "Watch a real
   agent work, then build your own." Proof over adjectives.

9. **The Download CTA is a warm tri-stop gradient pill**
   (`linear-gradient(105deg,#1a90ff,#6b53ff,#7B4CFF)`), 52–56px tall, lifts on hover.
   Distinct from the pure iris→cyan brand gradient — it leans bluer/friendlier for the
   primary marketing action.

10. **Feature rows alternate; one quote each.** Each homepage feature = number + category
    + Space-Grotesk title + one-line desc + a single chat-quote pill ("Find the latest
    codes for this game."). Real product PNGs on the opposite side, big radius (20px) +
    soft purple shadow. Rows alternate text-left / text-right.

11. **Agent-demo motion: instant swaps · hover to select · let each beat breathe.**
    Switching agents in the stage is INSTANT — no slide / cross-fade (overlapping panes
    read as a glitch, and inconsistent slide directions look broken). Selecting an agent
    happens on HOVER, not click. And each agent's demo paces slowly enough to read every
    beat (type → pause → next step) — calm utility, not a frantic reel. *(Designer
    corrections, S1 — first real correction cycle.)*

12. **Badges come in three shapes — pick by role (UX-audit, S1).** (a) **Status chips** —
    squared (2px), soft fill, NO border, lowercase (job states: assigned/completed/failed).
    (b) **Pill badges** — fully round, soft fill, **a 1px outline on emphasis** ones (Verified,
    Scheduled), icon-optional (Active/counts). (c) **Outline tags** — border-only, ~6–8px,
    colored border+text, uppercase (Admin/ENGG). The **credits** pill is a gradient-border
    round pill with gradient text (✦ 2,450). Don't flatten these into one generic badge.

13. **The DS carries a full radius + shadow scale (don't reach for arbitraries).** Radii:
    badge 2 · card 8 · field 12 · chat 16 · credits 24 · pill 128 · circle + the asymmetric
    bubbles. Shadows: **hairline** (resting cards) · float · overlay + the brand **cta** glow
    (tokenized — never inline the `rgba(95,70,255,…)` CTA shadow again) + brand-sm + Tailwind
    sm/md/lg/xl. Reach for a token, not an arbitrary value. **Amendment (S5):** every neutral
    rgba derives from the `--bai-ink-rgb` channel (scrims, hairlines, neutral shadows) and the
    marketing page surface from `--bai-page-rgb`/`--bai-page-grad` — same one-source rule the
    brand channels follow. No raw `rgba(8,10,31,…)` / `rgb(245,246,253)` anywhere.

## Codified taste rules (added S2 — promoted from the 2026-06-10 build session + S2 fixes)

14. **Text wrapping is a hierarchy decision — never let it happen by accident.** Default:
    size the font/container so text fits ONE line; don't accept a wrap unless there's
    genuinely no room (or the designer asks). When a wrap is unavoidable it must break
    SEMANTICALLY — headings & short marketing lines use `text-wrap: balance` (equalizes line
    length, good for 2–3-word display type); body/sentences use `text-wrap: pretty` and break
    at the FULL STOP (or next-best clause), never mid-phrase. Corollaries: never cap body
    width far below its container (`max-width:48ch` on a 560px pane forced an early mid-phrase
    break — wrap needs the REAL available width); and to keep a sentence whole, glue its words
    with ` ` (nbsp; prefer the visible JS escape). *(Designer corrected `balance`→`pretty`
    for body — `balance` split "submits it / for you" mid-phrase.)*
    **Amendment (S2-cont):** `balance` is for SINGLE-sentence headings ONLY. A MULTI-sentence
    heading/short line must break at the FULL STOP (one sentence per line) — split on
    `(?<=\.)\s+` + `<br>` (each sentence still wraps internally if narrow, so it's mobile-safe).
    `balance` on a 2-sentence heading splits straight THROUGH the full stop (the close-band
    "busywork. Start reviewing" bug). Candidate: a reusable `<SentenceLines>` helper.

15. **Equal padding on all sides is the default; flag the special cases.** And never let a
    trailing margin on the LAST child double-count the container's bottom padding — a card at
    `padding:22px` whose last child also had `margin-bottom:18px` read 40px at the bottom vs
    22px on the sides. Zero the trailing margin; let the container's padding own the gap.

16. **Optical sizing over box sizing; shared chrome is identical across variants.** Icons
    sharing one px box can still look unequal (a glyph with more internal padding reads
    smaller) — size to the GLYPH, not the box (the Reddit nav icon needed 23px beside others
    at 21px). And any chrome shared across variants (the hero nav) is ONE component, byte-
    identical everywhere — "navigation should reflect on all options."

17. **For highlight/hover emphasis, prefer ELEVATION over a tint OVERLAY.** A translucent
    gradient veil over an active card dulls the TEXT contrast too. Lift the card (shadow +
    position) and keep the surface clean — never veil content you still need to read.

18. **Demo a shape/radius on a representative element, not a square.** A "pill" radius swatch
    on a 56×56 square renders as a circle — indistinguishable from the circle swatch. Demo
    pill/stadium radii on a WIDE element so the radius reads as what it is. Generalizes: any
    token swatch must use a shape that actually exercises the token.

## Codified taste rules (added S2-cont — the SEO homepage + brand + mobile day)

19. **Brand primitives are ONE shared asset (SSOT) — never re-drawn per surface.** The wordmark
    is the `<Wordmark/>` component: "BlueAI" (always ONE word, no space) in the FULL primary
    iris→cyan gradient clipped left-to-right (Bricolage 700) — NOT two-tone, NOT solid. The logo
    is the official `blueai-icon` PNG (gradient circle + sparkle), in every nav + both footers.
    The Download CTA always carries the canonical sparkle (lucide Sparkles). The smell: the same
    primitive appearing in 3 places with 3 different treatments → extract to one component/asset.
    *(S2-cont: had 3 drifting wordmark treatments + a hand-drawn logo; unified. I first misread the
    wordmark as two-tone — designer corrected it to the full gradient.)*

20. **Content sits in a contained column; the nav can run full-bleed.** Cap the hero + every
    section band + footer at ONE shared content-width token (~1280px) so their edges align — but a
    wide/full-bleed NAV over that contained column is a deliberate, correct pattern (Stripe/Linear/
    Vercel), NOT misalignment. Too-wide body content hurts UX (line length >75ch, sparse card
    grids, more eye travel). The real "misaligned" smell is body SECTIONS disagreeing with EACH
    OTHER, not the nav being wider. *(S2-cont: aligned everything to the 1640 header → too wide;
    split into a full-bleed nav + a 1280 content column.)*

21. **Delight is ambient and on-brand, never literal.** To make a page feel alive, use a calm
    living backdrop — soft gradient orbs that drift/recompose on scroll + a faint logo sparkle that
    slowly rotates — NOT literal motifs (spinning gears, counting stats), which read as toy-like and
    undercut "trustworthy utility." Ground text over a backdrop with a frosted-glass container
    (semi-white + blur). All scroll-driven motion is gated on `prefers-reduced-motion`. *(S2-cont.)*

22. **Mobile is its own design pass — verify it by SCREENSHOT.** A content page's section-anchor
    nav needs a real mobile MENU (hamburger → the links), never just `display:none` on them; the
    menu must OVERLAY content (absolute), not push it down. CTAs go full-width for tap targets.
    You cannot eyeball mobile from the desktop live view — screenshot at 390px and audit. *(S2-cont.)*

## Codified taste rules (added S4 — the discrepancy-sweep day; all three sharpen recurring category #2)

23. **Composition fidelity ≠ content fidelity — verify the RENDERED result, not the text.** When
    replicating or auditing a surface as "faithful", a copy match does NOT prove a layout match.
    Screenshot-compare the COMPOSITION: card arrangement, rotation/scatter, opacity, edge-bleed,
    column vs collage, line-wrap, spacing rhythm. *(S4: I declared social-rewards "faithful" because
    the COPY matched verbatim — but our hero was two tidy upright columns while the live is a
    scattered, rotated, faded, edge-bleeding collage. The designer caught it. A content-check can
    never catch a composition gap.)* This is the actionable Gate-8 form of recurring category #2:
    **before declaring any build "done" or "faithful", read the rendered output as a designer —
    screenshot it when layout/composition is involved — don't sign off from the code or the copy.**

24. **Every control must render ALL its states — never ship only the empty/happy-path state.** An
    input has to visibly represent empty AND filled AND (where it applies) a way to undo. A file
    picker's "Choose file / No file chosen" must become "filename + remove (✕)" once a file is
    attached — the "choose" affordance disappears, the box reads as filled. A toggle shows selected
    vs unselected. A native control that lies about its state (a file input that still says "Choose
    File" after a file is picked, with no removal) is not done. *(S4: built the Resume/holdings
    upload with only the empty state; designer flagged "there should be a cancel option, and Choose
    File shouldn't stay once uploaded." → `FileUpload` with empty↔filled↔remove.)*

25. **Display/marketing copy uses directional curly quotes + apostrophes, never straight — and
    verify it in the actual font.** `" ' ' "` not `" '`. Space Grotesk renders the straight
    double-quote as two slanted "99" strokes, so a straight opening quote looks like an inverted
    closing quote — invisible in code, wrong on screen. Check the rendered glyph, not the source.
    *(S2-cont/S4.)*

## Codified taste rules (added S5 — the style-guide architecture + atomic-hierarchy day)

26. **Atomic hierarchy is LAW (designer directive, S5): atoms → molecules → components →
    patterns → pages, and EVERYTHING is tokenised — "even a space or padding."** Every value
    traces to a token; every repeated structure gets extracted at its layer. "Componentised"
    must be true at ALL THREE levels — token, CSS, **and React**: one CSS source with
    copy-pasted markup is a half-extracted molecule (the `.jmf` field pair was hand-copied 26×
    across 4 forms before the `form-kit.tsx` molecules). And **every layer gets its own
    style-guide home** — a molecule only visible inside a composed organism is undocumented
    for the dev who needs just the field. Test for any new UI: can I name its layer, and does
    every value trace to a token? If either fails, fix before shipping.

27. **A DS reference separates ROLE from RECIPE (learned from WSUP's style guide).** SHOW the
    live component; the caption is a terse one-line ROLE in plain English. The build recipe
    (classes, tokens, structure) lives in a structured PREVIEW + ANATOMY table — one build
    concern per row, literal recipe left / plain-English purpose right, token names
    cross-linked to (and ringing) the exact swatch. File paths are a grep target, not doc;
    design rationale belongs in this notebook, not the caption. **Two-tier discipline:**
    anatomy value ∝ structural complexity — reserve the heavy treatment for components whose
    recipe isn't self-evident (header, form kit, bubbles, credits-pill border trick); atoms
    keep show + terse note. Anatomizing everything is volume, not clarity. And anatomy rows
    are GREP-VERIFIED against the real CSS, never written from memory (`.jmf-label` ≠ `.jmf-lbl`).

28. **Navigation should recede; choose the grouping axis by the user's task.** Sidebar/nav
    labels are sentence-case, small, light — ALL-CAPS bold nav shouts and competes with the
    content it serves. Group a HANDOFF reference by surface (everything for a page together);
    group an exploration library by kind. Don't copy a reference's taxonomy that doesn't fit
    the content.

29. **Width-by-role: a caption/footnote bound to a table or figure takes the WIDTH OF THE
    ELEMENT IT ANNOTATES, not a prose measure.** The 50–75ch readability cap is for paragraphs
    read top-to-bottom; fine print attached to a figure aligns to the figure's edges. (The
    odds-table disclaimer at a 70ch cap wrapped to 4 cramped lines beside empty space.)

## Codified taste rules (added S6 — the live-demo-v2 redesign + signature-motion day)

30. **A signal has a LIFESPAN tied to a journey stage — retire it when its job is done.** Don't run
    two animated/pulsing indicators for the same meaning in proximity (pulse is the strongest
    attention draw; duplicating it dilutes both). An *invitation* ("Live, try it now") is useful only
    BEFORE engagement; once the user acts, the product's own presence signal takes over — so the
    invitation fades out on first interaction, it doesn't get restyled to coexist. *(S6: two pulsing
    green dots ~40px apart — our badge + the widget's worker-status dot. Fixed by lifecycle, not style.)*

31. **A label attached to the page's HERO artifact must be quieter than the artifact**, and floating UI
    that travels over arbitrary backgrounds needs an OPAQUE/frosted surface, never a tinted wash. The
    live widget is the star of its page; its "Live, try it now" tag is a whisper (frosted-white hairline
    pill, a small green dot carries "live"), not a loud black pill that out-shouts it. A translucent wash
    breaks when the element floats over a dark band — frosted-solid survives any backdrop. *(S6.)*

32. **A landing page is a focused FUNNEL: anchor-only nav, no outbound links, nothing imported.** An
    outbound link leaks conversion; the page is a self-contained island. And a product GATE (a login wall
    before the payoff) is a deliberate intent filter, not UX friction — ask "what is this gate FOR" before
    "removing" it. *(S6: designer corrected me — I'd read the anchor-only nav as a flaw and proposed
    softening the login wall; both were the point.)*
    **SCOPE CLAUSE (S8, from the 06-16 hub conversion):** rule 32 governs STANDALONE ad-funnels. When the
    designer promotes a page to a CONNECTED site member (the live-demo homepage got the shared
    MarketingHeader/Footer + outbound links), shared chrome + footer/in-content links are correct — what
    survives from the funnel is the intent GATE (the login wall stays). Island → hub is a page-ROLE change
    the designer makes consciously; treat any unprompted outbound link on a standalone funnel as drift.

33. **Re-verify every floating / negative-offset / animated element across ALL its states and breakpoints
    before presenting.** A `-36px`-above-the-panel badge is safe while siblings sit in separate desktop
    columns, but collides with whatever stacks above it on mobile; a fixed panel's z-order, a transient
    animation's mid-frame, and a label's clearance must each be checked in docked+hero, mobile+desktop,
    mid-motion+settled, and over every background it can travel over. This is the concrete Gate-8 checklist
    for motion/floating work (recurring category #2's 4th validation). *(S6: badge-over-trust-row on mobile,
    footer-over-docked-widget z-order, blueprint-vs-widget merge — all "looked fine in one state".)*

## Codified taste rules (added S8 — the creator-v2 studio-concept + hub-conversion audit)

34. **A prompt/hero bar holds GENERATION-TIME choices only.** Things you can't fix after the render
    (aspect ratio, art style) earn a slot; post-production layers (music, SFX, captions, voice) live in
    the editor or are AI-automated — they never stack as upfront dropdowns. A creative tool's first
    surface stays minimal; every extra control contradicts the "one shot, just describe it" promise.
    *(S8 ← creator-v2: Model dropped (engine jargon), Art style + Aspect kept; Sora/Higgsfield keep
    their bars minimal for the same reason.)*

35. **Every visible control must DO something believable — an inert control reads as broken.** Even in a
    design-only prototype: pills fill the prompt, templates seed it + scroll to it, Generate spins then
    reveals, a banner CTA focuses the input. If an element can't respond, don't render it as interactive.
    *(Extends rule 24 — 24 is "render all STATES", 35 is "answer every CLICK".)*

36. **User-content areas are quiet, dense, app-like — never marketing sections.** A "your generations"
    library = compact left-aligned header + count, dense grid, inside a contained surface panel
    (`--bai-surface` + divider + hairline on the white page). No hero headline, no centered pitch: the
    page sells, the library serves. *(S8 ← Google Flow reference; "big centered head + one lonely card"
    was the miss.)*

37. **Never combine the gutter wrapper and a styled card on ONE element — nest the card inside the wrap.**
    A section card carrying both the content-column class and its own padding overrides the outer gutter
    and goes full-bleed on mobile. The wrap owns max-width + gutters; the card owns its padding, inside.
    *(S8 ← the banner kissing both screen edges <1200px.)*

> Motion (framer-motion) gotchas, the spotlight pattern, the CSS-chunking leak, the ambient
> backdrop, and mobile/layout/SSOT technical detail live in `knowledge-base.md`.

## Codified taste rules (added blueai-desktop audit, 2026-07-25 — a CRAFT rule, applies beyond the marketing site)

38. **Any signal must earn its slot against what's ALREADY signaling the same thing** — a hairline
    divider is only the most common shape of this; it also covers whole badges/tags. Before adding a
    separator OR a status marker, check: does a label's own margin, a card's own border, an icon, a
    color/weight change, or a NEIGHBORING text element already say the same thing? A second element
    restating a fact the first already states is decoration, not information — remove it, don't add
    to it. *(blueai-desktop, 2026-07-25: caught 4 times in one session, 3 dividers + 1 badge — before a
    labeled section ("MORE WAYS TO GET AI CREDITS": the label's own 24px top-margin already does it,
    confirmed against 6 sibling labeled sections on the Settings home screen with zero dividers between
    any of them), between two already-bordered cards (their own edges already separate them), next to a
    "View details" link (its accent color + bold weight + trailing chevron already read as "this is the
    action"), and — the 4th, a different PRIMITIVE, same root cause — the header credit popover's "★
    PRIME" badge, redundant with the plan-line text ("Prime") already stated right below it; replaced
    with accent color ON that existing text rather than a second element beside it.)* **Amendment
    (2026-07-25):** originally scoped to dividers only; broadened after the 4th instance showed the same
    failure on a badge, a structurally different UI primitive — the rule is about REDUNDANT SIGNALS in
    general, dividers were just the first shape it kept showing up in. Sibling reasoning entry:
    `reasonings.md` "A signal is a repeat, not a first, unless it earns its slot."
    *Where else this applies (surfaces it has NOT bitten on yet):* an icon beside a label that names the
    same thing; a tooltip repeating a visible caption; an empty-state illustration captioned with the
    same sentence twice.

    **AMENDMENT (2026-08-03) — the fail-to-fire clause below was WRONG, and today proved it.**
    It read: *"reading it as a rule about SEPARATORS."* That is not how the rule failed. Every wording of
    it — here and in its `reasonings.md` sibling — is a gate on **addition**: *"before adding a separator
    OR a status marker"*, *"before adding ANY new signal"*, *"when adding a new visual element."* Today's
    redundant element was **inherited, not added**: the Scheduled form was wrapped in a bordered card that
    restated a boundary its own subpane already drew, and the card was months-old code I had simply kept
    while rebuilding everything inside it. Nothing was being added, so nothing fired, and the designer
    found it. **The real fail-to-fire is: a redundancy rule scoped to additions never fires on code you
    inherit.**
    *Restated so it can fire either way:* when you touch a surface, every element already on it is IN
    SCOPE, not background. The question is not "should I add this signal?" but "does each signal here
    still earn its slot, given what this surface now contains?" An element that earned its slot when it
    was written can stop earning it without anyone editing it — see rule 46, which is the same fact from
    the container's side.
    *Second width, same mechanism (also today):* redundancy by **ubiquity**, not adjacency. The live
    product asterisks six of seven field labels; a marker on almost every member of a set marks nothing,
    and the only informative marking would have been the one field whose requirement actually varies. A
    signal repeated across a whole set is as empty as a signal repeated beside its neighbour.
    *What would stop it firing NOW:* reading it as a rule about elements you are about to write (it covers
    what is already there), about SEPARATORS (it covers any primitive), or about a signal's NEIGHBOUR (it
    covers a signal repeated across a whole set).

## Codified taste rules (added 2026-08-01 — the design-system build; rules 39–41 are CRAFT, they apply on any surface)

39. **A half-pixel is not a hierarchy step.** If two values differ by less than roughly 1px at these
    sizes, they are not two levels — they are the residue of tuning things one at a time, and they make
    the system unpredictable to build against. Merge them. When merging TEXT at or below 11px, merge
    **up** (never shrink the smallest type — legibility floor beats tidiness); above that, merge toward
    whichever value has more declarations. *(blueai-desktop 2026-08-01: 20 font-sizes and 15 radii,
    including 9/9.5, 10/10.5, 11/11.5, 12/12.5, 13/13.5 pairs → 6 text steps + 4 display + 2 glyphs.
    The radius count in this note was left at 9 after tranche 3 retired three more the same day —
    corrected, and now deliberately not restated: `ds-drift-check.js` §8 prints the live figure.)*
    *Where else this applies:* any near-continuous axis — spacing (9 vs 10px gaps), line-height
    (1.4 vs 1.42), opacity steps, colour-ramp stops a few RGB points apart, motion durations 20-30ms
    apart. The test is effective rendered difference, not the unit. *What would stop it firing:* reading
    "px" literally — a 1.4/1.42 line-height pair is the same residue in a different unit.

40. **Tokenise sizes, not just colours — an untokenised axis drifts by default.** Colours here were
    fully tokenised while every size was a raw literal, so each new component picked its size by copying
    whatever neighbour was nearest. That is *how* you get 10 and 10.5 for one role: not carelessness, but
    the absence of anything to reach for. Any axis without a named vocabulary will re-drift no matter how
    many times it is cleaned. Give text steps ROLE names (the role is stable); give display sizes and
    optically-matched glyphs SIZE names, because naming 22px "avatar" is wrong the first time it's reused.
    *Where else this applies — the axes still open on this surface when this note was written:* spacing
    (25 raw values, zero tokens), line-height, font-weight, letter-spacing, z-index layers, shadows and
    motion durations. Each will re-drift until named. *What would stop it firing:* treating "sizes" as
    the rule's subject — the mechanism is ANY axis without a vocabulary, including ones with no px in
    them (weights, unitless line-heights, easing curves).

41. **A distinction already carried by a non-layout channel must not be re-encoded in a channel with
    layout side-effects.** Colour, fill, opacity, iconography and position-in-a-group cost nothing when
    they change. Font-size, weight, letter-spacing, padding and border-width all change how much room
    a thing takes — so re-encoding a distinction in one of those buys no clarity and can move the
    layout. **Whenever two things must read as different — two text roles, two states of one control,
    two tiers, two severities — ask which channel already separates them, and stop there.**

    *Where this applies beyond the instances below:* a "selected" list row that is both tinted and
    indented; an error field that is both red and bolded; a primary button that is both filled and
    larger than its sibling. None of those are text-role problems, and all three are this rule.

    *What would stop this rule firing:* reading it as being about **text**. It is about *channels*.
    The failure recorded below happened because an earlier wording said "two text roles a half-step
    apart", so a component STATE never matched it. If you find yourself deciding whether the thing in
    front of you counts as a "role", the rule already applies — check the channels.

    When two things differ, check what actually separates them before preserving a size or weight gap.
    - *Text roles:* caption-vs-body-small was already distinguished by the colour ramp (`--bai-dim` vs
      `--bai-text`), so the 0.5px difference was doing no work and merging cost nothing.
    - *Component STATES (added 2026-08-01):* the skill-create switcher's selected tab had a solid accent
      fill AND inverted ink AND `font-weight: 700`. The weight was the third signal, and it was the
      expensive one — the options are equal-width `flex:1`, so wider glyphs tipped the longest label onto
      a second line and **selecting a tab resized the tab row.** Encode state in colour; never in metrics.
    **Relationship to rule 38.** Rule 38 ("any signal must earn its slot against what's ALREADY
    signalling the same thing") is the general form; this rule is that test applied to the specific
    case where the redundant channel has layout side-effects. They were written separately and neither
    referenced the other, which is the same generalization failure one level up: two rules stating one
    mechanism at two widths. Read 38 first; reach for 41 when the redundant signal costs space.

    - **Why this rule got widened:** it was originally written only about "two text roles a half-step
      apart," so it never fired on a state change — the switcher bug sat in the product while the rule
      that covered it was already on record. A principle written at the width of the instance that
      taught it will not catch the next instance. When promoting a rule, state it at the level of the
      *mechanism* (colour vs metrics), not the example (captions vs body).

42. **In a choice control, labels NAME and one shared explainer DESCRIBES — no option may explain
    itself only after commit.** A segmented control's options get one word each (the icon plus an
    explainer line carry the description); the explainer sits under the control, swaps with the
    selection, and reserves its space so switching never reflows the form. The failure this codifies:
    three 17-19 character labels each trying to be both the option's name AND its description, while
    only one of the three explained itself — in the body, after you had already picked it. If an option
    needs a paragraph to justify itself once selected, that paragraph belonged at the moment of choice.
    *(blueai-desktop 2026-08-01, skill-create method switcher: 'Write' / 'Upload' / 'Ask BlueAI' + one
    hint line replaced 'Write instructions' / 'Upload a ZIP file' / 'Create with BlueAI' + a
    post-commit explanation.)* *Where else this applies:* plan pickers, payment-method choices, any
    radio-card group. *What would stop it firing:* treating it as a rule about tab strips — it is about
    any control where choosing precedes understanding.

43. **A size used once ON PURPOSE is not scale drift — record the purpose, and defend it.** Two
    Tranche-3 consolidation proposals were DECLINED by the designer, and the reasons are taste, not
    tidiness: the **wordmark stays 14px** because +1px buys nothing but costs width in the tightest row
    of a 290px panel (brand marks are set by fit, not by scale step); the **login-gate credit figure
    stays 38px** because re-tokenising it would rename a token without changing a decision — a display
    size used once is fine when the once is deliberate. The general form: consolidation pressure must
    not flatten deliberate one-offs; the cure for an undocumented one-off is documentation, not merging.
    *(Previously recorded only in a comment beside the token block — designer-taste data stored where no
    design session reads. Promoted here 2026-08-01.)*

44. **Nested rounded corners must be concentric: inner radius = outer radius − inset.** When a rounded
    element sits inside another rounded element near its corner, equal radii read as non-parallel curves
    — the inner corner visibly "pokes at" the outer one. The designer's rule, verbatim: "when used
    together, containers within containers, the round radius of the element inside should be smaller,
    otherwise the curves mismatch and don't feel parallel." Compute it: `r_inner ≈ r_outer − gap`
    (a 6px container with 2px padding wants a 4px pill inside). It only applies where curves MEET —
    once the inner element sits deeper than the outer radius, the corner zones never overlap and any
    radius is fine, which is what keeps this from outlawing every card in a panel.
    *(blueai-desktop 2026-08-01: a runtime sweep of every rounded-in-rounded pair found exactly two
    real product mismatches — the Settings dark/light segmented control (inner pill 6px = container
    6px; → 4px) and the skill-create method switcher (selected tab 8px = container 8px at 3px inset;
    → 4px). The switcher had been REBUILT that same day and the mismatch shipped anyway — the rule
    wasn't written down, so nothing fired. Sweep script: radius-nesting-audit.js beside the drift
    check.)*
    *Where else this applies:* chips inside inputs, avatars inside list rows, thumbnails inside cards,
    a progress fill inside its track — any composed control with visible nested corners.
    *What would stop it firing:* reading it as a segmented-control rule; it is geometry, and it fires
    on every rounded-in-rounded pair whose corners approach each other. `border-radius: 50%` circles
    are exempt — a circle is a shape, not a scale step.

45. **Create-affordance placement — the full ground theory (designer-taught, 2026-08-01, five rounds).**
    A control never earns a row to itself. Decide placement by asking two questions in order:
    - **Does the first row already have persistent content to share?** (a search field, nav chrome, a
      subpane's back+title head) → dock the affordance to that row's TOP-RIGHT CORNER. The corner is
      the invariant; the row it sits in is not. Controls sharing a row are ONE toolbar: equal heights
      (`align-items: stretch` — a 34px search beside a 28px pill reads as two unrelated things), and
      the pill never pays the squeeze (`white-space: nowrap` + `flex-shrink: 0`; the search shrinks
      and truncates its placeholder instead).
    - **No shareable row?** Then the affordance is not chrome — it is CONTENT: the list's own first
      item, in the same visual rhythm and radius family as the real rows below it, flush-left with
      them (centering it would break the shared scan line). Never manufacture a header band to hold
      one button: a row whose only occupant is a small corner control reads as an empty header with a
      stray control.
    - **Empty list?** The affordance moves INTO the empty state, centred under the explanation copy —
      the one screen where the primary action has no competition for attention. The two placements
      SWAP with list state; they never stack (rule 38: two create buttons at once is a duplicated
      signal).
    *(blueai-desktop 2026-08-01: one thread, four surfaces, five designer rounds — the Skills toolbar,
    the My Skills subpane head, the Scheduled first-row affordance, and both empty states. Each round
    fixed one surface and the designer had to point at the next sibling — see the fix-one-forget-the-
    siblings lesson in the scratchpad.)*
    *Where else this applies:* any future list screen (Jobs, when it becomes real), settings sections
    that grow an "add" action, the chat-history route — and non-create actions too: any singular
    affordance attached to a collection.
    *What would stop it firing:* reading it as a rule about "+ New pills". It is about ANY action
    affordance attached to a collection, whatever its label or shape.

46. **A wrapper's correctness is a function of what it wraps — so containment is part of the delta whenever
    content changes scale.** A container earns its slot against the content inside it: its border, its
    padding, its max-width, its scroll behaviour were all judged against a particular amount and shape of
    content. Change that content substantially and the container's justification expires *without anyone
    editing the container* — so when you add to or remove from a surface, re-review the box AROUND the
    content, not only the gaps between items inside it. Gate 8.4 already says "re-check spacing after a
    content change"; read it to include the containment.
    *(blueai-desktop 2026-08-03: Scheduled's task form was wrapped in `.bai-newitem`, a bordered
    accent-outlined card. At three short fields it read as a small form block and nobody questioned it. I
    rebuilt the form to seven field groups — and the same untouched element became a full-height box that
    was (a) redundant, restating a boundary its own full-screen subpane already drew, and (b) misaligned,
    because its 14px margin double-paid `.bai-subpane-body`'s existing 12px padding: card edge at 27px and
    its fields at 40px, against 13–15px for every other container on the screen. The designer caught it by
    eye in one look. Removing it also retired two layout workarounds I had built AND documented as forced
    constraints hours earlier — a 2×2 grid and a 4+3 chip wrap, both genuinely real at the 179px the card
    left, neither real at the 264px without it.)*
    *Where else this applies:* a settings card whose content shrank to a single row; a modal that grew past
    its scroll threshold and now needs a pinned footer; a section that lost items and whose `min-height`
    is now dead air; a `max-width` set for prose that now holds a table; a scroll container that no longer
    has anything to scroll. **Both directions** — shrinking content strands a wrapper just as growing
    content strains it.
    *What would stop it firing:* reading it as a rule about content that GREW (shrinking is the same
    fault), or reading "container" as only a visible card — a `max-width`, a padding wrapper, a scroll
    context and a flex parent are all the same element for this purpose, and three of those are invisible.
    *Sibling:* rule 38's 2026-08-03 amendment is this same fact from the signal's side — an element can
    stop earning its slot with nobody touching it. Read them together.

47. **Group surfaces by ROLE, not by physical adjacency — and let depth carry the hierarchy between the
    groups: lighter advances, darker recedes.** Two surfaces that happen to sit next to each other are not
    thereby the same kind of thing. Nav chrome (a header, a sidebar) shares a role — persistent, the same
    regardless of what content is showing — and a content pane (a chat, an editor, a document) is a
    different role: the thing that actually changes. Pair surfaces by which of those two groups they
    belong to, not by which one is drawn next to which. Once grouped, the tonal relationship between the
    two groups is itself a signal: the group that reads lighter feels like it sits ABOVE/in front of the
    group that reads darker, which recedes — so the chrome (the frame) is lighter, the content well (the
    thing you're looking into) is darker, matching how a physical bezel relates to the screen it frames.
    *(blueai-desktop, 2026-08-04: landscape header+sidebar+chat. First pass paired header with chat because
    they sit stacked on top of each other — ADJACENCY — landing the sidebar as the one barely-darker odd
    surface out. Designer corrected the grouping itself: header and sidebar are both nav chrome (logo,
    settings/help/account, mode-switcher, recents), chat is the workspace — regroup by role, and the
    designer's own follow-up supplied the direction: darker reads as more depth, which is why the chrome
    wants to sit slightly above the content well, not level with it. Second pass reversed both the pairing
    and the lightness direction on that single insight.)*
    *Where else this applies:* a toolbar + a status bar that happen to bracket a canvas (same chrome role,
    should share a tone, even though the canvas sits between them, not beside them); a card's header row and
    footer row (same "frame" role around the card's own content); any pair of controls that read as unrelated
    only because a third element happens to sit between them in the layout.
    *What would stop it firing:* checking only whether two elements *touch* or *sit near* each other. The
    question is never proximity — it's whether the two elements answer the same question ("where am I / what
    can I do from here" = chrome) or different ones (chrome vs. "what am I looking at right now" = content).

48. **A control's box shape is an OUTPUT of two decisions — the content and the row's cross-axis size — never
    a style choice of its own. What you owe every container is not a shape but a floor on the axis the
    pointer travels along: at least square for an icon-only control in a horizontal row, and never portrait.**
    The box is content + one uniform padding, with the cross-axis set by the row it sits in. So text →
    landscape (text is wide), a glyph as wide as the row allows → square, a *narrower* glyph under the same
    padding → portrait. Nobody picks "square" or "rectangle"; you pick the padding and the row height and
    the aspect falls out. The design act is choosing which axis to be generous on, and Fitts answers that:
    acquisition cost depends on the target's extent **along the direction the pointer approaches from**. In a
    horizontal toolbar the pointer arrives horizontally, so WIDTH decides whether the click lands and height
    is the cheap axis; in a vertical list it is exactly reversed. Hence: horizontal row → at least square,
    landscape welcome, **portrait is a defect** because it spends the free axis and starves the deciding one;
    vertical list → full width, comfortable height. Floor of 22px (this app's own smallest deliberate control,
    not an imported number) applies to the travel axis for every control and to *both* axes for icon-only
    ones — a text control's cheap axis is set by its row's typographic density, which is a different decision.
    *(blueai-desktop, 2026-08-10: designer, on the Skills toolbar — "why is this skill help icon NOT square?
    if we can reduce the width of the search bar a lil the icon can get its proper interaction size right?"
    It measured 24×32 — the ONLY portrait control in the app across 19 surfaces and 55 controls, because a
    previous fix released `height` so `align-items: stretch` could match the search field's 32px and left
    `width: 24px` behind. `aspect-ratio: 1` now ties width to whatever the row stretches height to, and the
    8px comes out of `.bai-search`, which is `flex: 1` — the designer's own remedy, exactly. The same designer
    asked WHY Claude's desktop shows a square box on the credits ring but rectangles on "Opus 5"/"High", and
    slightly portrait boxes on its mic and chevron: same law — text is wide, a full-width glyph is square, a
    narrow glyph under constant side padding goes portrait. Two more violations fell out of the census:
    `#baiTitleBtn` at 306×14 and `.bai-menu-help` at 18.7×16.)*
    *Where else this applies:* any icon button that inherits a stretched height without a matching width; a
    toolbar mixing text and icon controls; an icon added to an existing row (it takes the row's height, so
    check its width the same moment); a vertical nav item that is inset rather than full-width; a dense
    status strip where a control's cheap axis is capped by the strip itself.
    *What would stop it firing:* treating "square" as the goal rather than the by-product — a box can be
    square for the wrong reason (a hard-coded width that happens to match) and satisfy the letter of this
    while the padding is uneven. Also: applying the floor axis-blind. The first version of the machine gate
    did, and flagged `#baiModelBtn` at 61×20 in a 20px-tall status strip, where "make it taller" means
    "make the button taller than its own strip" — meaningless. A genuine exception exists and is *listed*
    rather than silently skipped: a control whose SHAPE IS ITS SEMANTICS (`.bai-tgl`, 28×16 — a switch
    depicts a track with a knob travelling along it, so that landscape IS the control, not padding).
    *Gate:* `icon-target-audit.js` — runtime, because this is a law about computed geometry that no static
    read of the stylesheet can see. Measures `offsetWidth/offsetHeight`, never `getBoundingClientRect`:
    `#scaler` transforms the whole app, so rect values are scaled and the first run produced 54 false
    failures at compact width. Same trap as `placeFloating`; see [[feedback_blueai_atomic_hierarchy]].
    *Sibling:* **rule 49** is this rule's other half — 48 sizes a control's own box, 49 places children of
    differing heights inside a row, and 49 carries the boundary clause against rule 45's `stretch`.

49. **In a row mixing a fixed-size element with a variable-length one, align on the axis that survives the
    content changing — which is almost always CENTRE, not START. If you find yourself adding a magic-number
    nudge to make an alignment look right, the alignment reference is wrong, not the number.**
    `align-items: flex-start` anchors every child to the row's top edge, so a fixed-height element (an icon
    chip, an avatar, a checkbox) and a text block that can be one line or three no longer share a reference
    point: the text grows downward from the top while the chip stays put, and the chip's true centre drifts
    further above the text block's centre with every added line. Centre alignment ties every child to the
    same optical middle regardless of how many lines the text runs to — so it is stable across content
    length by construction, where start-alignment is correct only for the one line count it was tuned on.
    **The diagnostic is the compensation:** a `padding-top: 1px` on the text, a negative margin pulling a
    button back toward a corner, a `margin-top: -4px` on an icon — each of those exists because the
    alignment reference is wrong, and each is calibrated to exactly one content length. Delete the
    compensations WITH the fix; leaving them is how a corrected alignment ends up 1px off in the other
    direction.
    *(blueai-desktop, 2026-08-11: the toast. Designer, twice — first "does this look aesthetic and
    delightful," then, after a colour/motion pass, "the elements inside those notification need to be
    properly aligned, positioned and resized." The row was `flex-start`; against a 2-line reward
    (title+subtitle) the 22px icon's centre sat ~6px above the text block's. Two hacks existed to paper over
    it — `.bai-toast-body { padding-top: 1px }` and negative margins on `.tgm-close` — both tuned for the
    ONE-line alert and neither holding for the two-line reward. `align-items: center` + deleting both hacks
    fixed 1-line and 2-line simultaneously with zero magic numbers. It also surfaced a second asymmetry the
    same pass: the 3px accent `border-left` had made the left inset 13px against 11px on the other three
    sides, because padding was set uniformly while the border was not.)*
    *Where else this applies:* any list row with an avatar + a title that can wrap; a checkbox beside a
    multi-line label; a status dot beside a variable-length message; an icon beside a heading that goes to
    two lines at a narrow width; a form label beside a control taller than its own text. **And the border
    corollary:** whenever an element carries asymmetric border widths, its padding must be set per-side to
    compensate, or the visual inset differs from the declared one by the border delta.
    *What would stop it firing:* only checking the alignment at the content length currently on screen —
    the failure is invisible at one line and grows with each additional line, so a row that looks correct in
    its most common state can be structurally misaligned. Also: reading it as a rule about ICONS. It fires on
    any fixed-size child beside a variable-height one, whatever either of them is.
    *Sibling:* rule 48 is the same family one axis over — 48 governs a control's own box shape (what the
    aspect ratio should be), 49 governs how children of differing heights relate INSIDE a row. Read 48 for
    "how big is this control," 49 for "where does it sit next to its neighbour."
    **BOUNDARY vs rule 45 — these two prescribe DIFFERENT `align-items` values and the distinction is the row's
    CONTENTS, not its shape (Gate 6.5 cross-check, 2026-08-11).** Rule 45 mandates `align-items: stretch` for a
    shared toolbar; this rule mandates `center`. Both are right, for different rows:
    - **Peer CONTROLS that must read as one toolbar → `stretch`** (rule 45). A 32px search field beside a 24px
      icon button reads as two unrelated things; equalising their heights is what makes the row one object. The
      children are all interactive, all want the same height, and none has variable-length content.
    - **A fixed-size element beside VARIABLE-LENGTH content → `center`** (this rule). An icon chip beside text
      that may run one line or three must not stretch — a 22px status chip pulled to two lines tall is absurd,
      and `flex-start` drifts as the text grows. Centre is the only reference stable across content length.
    *The test:* are the row's children peers competing for the same height (→ stretch), or is one of them a
    fixed marker annotating the other's variable content (→ centre)? If a row somehow has both (a toolbar that
    also holds a wrapping label), split it — the label is content, not a control.

50. **An action row's LAYOUT is decided by whether its labels fit, not by how many actions it has. Side by side
    at equal width is the default; stack only when equal-width side-by-side would compress or wrap a label.
    And "the committing action sits on the right" is a rule about ORDER — it has no meaning when there is only
    one action, so a lone action takes the full width rather than being pushed to a side.**
    Two mistakes hide inside "how should these buttons sit." The first is treating COUNT as the input: "two
    buttons → side by side, one button → full width" happens to be right most of the time and is right for the
    wrong reason, so it gives no answer at all for two buttons with long labels. The input is FIT — measure
    whether both labels survive at equal width in the available column, and go vertical only when they don't.
    The second is over-generalising the right-alignment convention: it exists so a user's muscle memory can
    find the committing action among SEVERAL, and a single dismissal has nothing to be ordered against.
    Right-aligning it buys no recognition and costs the target width that full-width gives for free.
    *(blueai-desktop, 2026-08-11: an independent review flagged the Key-saved acknowledgement's lone "Got it"
    as 202×32 = 2.08× the area of the delete confirm's own commit button (97×32) and sitting at a different
    x-position — arguing the harmless action out-weighed the irreversible one and contradicted the learned
    bottom-right position. The reasoning was sound and the conclusion was wrong. Designer: "since there is no
    other button needed here the full width is the right approach — but yes the major action can sit on the
    right side," i.e. the order rule holds for the PAIR, which already satisfies it, and full width is correct
    for the singleton. The designer then supplied the fit-based rule above, which the review had not
    considered at all.)*
    *Where else this applies:* a form's Cancel/Save pair whose labels grow under localisation (the same row is
    side-by-side in English and may need stacking in German); a three-action row, where fit fails much sooner;
    a confirm whose commit label is a verb phrase ("Delete 12 tasks") rather than a word; any narrow-column
    action row — this app's dialogs live in a 202px content column at the 290px drawer, so fit is a live
    constraint, not a theoretical one.
    *What would stop it firing:* reading it as a rule about BUTTON COUNT — count is the symptom the old
    heuristic keyed on, and it is exactly what makes that heuristic silently wrong for long labels. Also:
    applying the right-alignment convention to a singleton, which is how a review can produce a
    well-argued regression.
    *Sibling:* rule 41. Both concern a signal that only means something in contrast — 41 says don't re-encode a
    distinction a cheaper channel already carries; 50 says don't apply a POSITIONAL convention when there is
    nothing to contrast the position against.

## Open corrections log
*SCOPE PIVOT (2026-07-25, designer directive) — superseding the S8 standing scope note below: **the
marketing site AND /blueai-product are now BOTH DORMANT; /blueai-desktop is the active surface.** This
is the exact reverse of the S8 framing ("experiments are DS-unbound exceptions to the marketing site's
rules") — blueai-desktop is no longer the exception, it's the default. Rules 1–37 are preserved (not
deleted) for if the marketing site resumes; they are not what current work is reviewed against. Started
`public/blueai-desktop/style-guide.html` (didn't exist before — blueai-desktop had NO documented
design system anywhere, only the marketing site's) to give blueai-desktop the same kind of DS reference
WSUP has. This is a live, growing document — not expected to be exhaustive on day one.

Blueai-desktop audit (2026-07-25) — promoted the AI Credits screen redesign + OOC modal redesign work
(ring-gauge reuse, card-based restructure, mode-specific titles/icons, the divider-redundancy rule above)
from scratchpad to decisions.md/taste.md/reasonings.md/knowledge-base.md/project-insights.md. Created
`reasonings.md` for the first time this session (never existed for blueAI before). No OPEN corrections
pending on blueai-desktop as of this promotion.

S8 (2026-07-03, HISTORICAL — superseded by the scope pivot above) — the 06-13→06-24 backlog PROMOTED
(rules 34–37 + the rule-32 scope clause + decisions + KB). Former standing scope note: "/moneymaker,
/blueai-desktop and /blueai-product are DS-UNBOUND standalone experiments — rules 1–37 govern the
marketing site only." Craft gates + rule 38 still apply everywhere regardless of scope, since they're
process, not skin. Watch: Gate-8 pre-present walk-through on novel interactive/motion work (category #2,
5 validations) — this watch item is marketing-site-specific and dormant along with it.*
