# blueAI — Taste
Last updated: 2026-06-10 (session 1 — seeded from the designer-authored blueai-modern DS README; build session)

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

## Open corrections log
*(Phase 1 seed — no designer corrections yet. The designer flagged "a few things aren't
right" on the Recommended hero (parked in `design-source/FIX-LATER.md`); enumerate +
promote here when reviewed. Future corrections accumulate here.)*
