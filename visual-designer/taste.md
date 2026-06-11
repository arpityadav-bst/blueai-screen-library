# blueAI — Taste
Last updated: 2026-06-11 (S2 audit — promoted rules 14–18 from the build-session scratchpad + the prod text-align fix; Phase 2 entered)

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

> Motion (framer-motion) gotchas, the spotlight-animation pattern, the production CSS-chunking
> leak, and mobile/layout rules from this session are TECHNICAL and live in `knowledge-base.md`.

## Open corrections log
*S2 (2026-06-11) — first substantive correction cycle PROMOTED. The parked Recommended-hero
items were resolved before this session; the 2026-06-10 build-session corrections + the S2
prod text-align fix are now promoted into rules 11–18 above + `decisions.md` + `knowledge-base.md`.
No OPEN corrections pending. The Recommended hero's prod/dev parity is fixed (see KB
"production CSS chunking can leak generic class rules"). Future corrections accumulate here.*
