# blueAI — Taste
Last updated: 2026-06-12 (S4 audit — +rules 23–25 (composition≠content fidelity · render-all-states · curly quotes); all three sharpen recurring category #2 → the Gate-8 catch-rate edge)

> blueAI's design *language* — how it should feel — so VDA can design new blueAI
> surfaces from instinct. Seeded from the Claude-design export's DS README (which is a
> real designer spec, not inference) + the marketing-site export. **This is blueAI's
> house style and is unrelated to WSUP's or now.gg's.** Tokens live in
> `tailwind.config.ts` + `src/app/globals.css` (the `--bai-*` layer); see `/style-guide`.

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
    bubbles. Shadows: float · overlay + the brand **cta** glow (tokenized — never inline the
    `rgba(95,70,255,…)` CTA shadow again) + brand-sm + Tailwind sm/md/lg/xl. Reach for a token,
    not an arbitrary value.

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

> Motion (framer-motion) gotchas, the spotlight pattern, the CSS-chunking leak, the ambient
> backdrop, and mobile/layout/SSOT technical detail live in `knowledge-base.md`.

## Open corrections log
*S2 (2026-06-11) — full day PROMOTED (rules 11–22 + decisions + KB). Designer corrections this
day: balance→pretty body wrap; wordmark = full gradient (I'd misread it two-tone); body width
(full-bleed nav + 1280 contained content); + several Gate-8 visual misses I shipped that the
designer caught on review (Finance card wider than siblings, close-band heading wrapping through
the full stop, POLYMARKET clip, mobile nav pushing content) — all fixed + promoted. No OPEN
corrections pending. Watch: my Gate-8 catch-rate on NEW builds (see evolution).*
