# DESIGN.md — "The Payout"
**The lock file. Re-read before designing any screen. If a screen violates this file, the screen is wrong.**

Blue AI Creators website, draft 1 (waitlist release). Parked/experimental surface — NOT on any
BlueAI design system, not VDA-governed. Self-contained on purpose.

---

## The one true thing

**Real cash, for real posts, by real people.** Every visual decision must trace back to that
sentence. When two options are equal, pick the one that feels more like money you can hold.

The emotional register: the moment a payout notification lands. Warm, grounded, slightly
giddy, completely believable. NOT: futuristic, techy, abstract, corporate.

## Palette — 60/30/10, black-and-white-plus-one-accent

Derived from paper money and receipt paper, not from a trend.

| Token | Value | Role |
|---|---|---|
| `--paper` | `#FAF8F2` | Ground. Warm receipt-paper white. NEVER `#fff`. |
| `--paper-2` | `#F3F0E7` | Raised/sunken sections — separate content with a 3–5% ground shift, not a border |
| `--ink` | `#1A1D18` | Text. Warm near-black. NEVER `#000`. |
| `--ink-2` | `#51554B` | Secondary text |
| `--ink-3` | `#666A5E` | Tertiary/meta. Darkened from `#8A8D80` — UI/UX Pro Max audit found the original failed WCAG AA (3.19:1 on `--paper`, 2.97:1 on `--paper-2`); this clears 4.5:1 on both. |
| `--cash` | `#0B7A48` | THE accent. Money green. Creator zone leads with it. |
| `--cash-deep` | `#075C36` | Hover/ink-on-light-green |
| `--cash-soft` | `#E2F0E4` | Wash |
| `--work` | `#1657C4` | Brand-zone accent (working blue). Same system, flipped emphasis. |
| `--work-deep` | `#0E4194` | |
| `--work-soft` | `#E4ECF9` | |
| `--flag` | `#B93D0B` | Warnings/exclusions only (the Reddit card). Semantic, not brand. Darkened from `#C2410C` — UI/UX Pro Max audit found the original failed 4.5:1 on `--flag-soft`. |

Rules: creator pages use `--cash` as accent and `--work` only for links to the brand zone;
brand pages the reverse. No third hue ever. No gradients ANYWHERE except photographic ones
inside generated assets. Dark mode: none — a decision, not an omission; receipt paper is the mood.

## Type — three families, three jobs

| Family | File | Job |
|---|---|---|
| **Crete Round** (400 + italic only) | `fonts/CreteRound-*.woff2` | Display only. Headlines, big numbers' labels. **Ships ONE weight — there is no bold.** Confidence comes from scale, not weight; never set `font-weight` above 400 on anything using `--f-display` (the browser fakes a bold by smearing the outline, which reads as blurry on a serif). Tracking near-normal, not tight (serifs carry their own visual spacing) — see the rule below. Replaced Cabinet Grotesk 2026-08-03 (designer: "don't like fonts with sharp edges"; two rounds of comparison sheets — softened grotesks didn't read as different enough, a rounded slab serif did). |
| **General Sans** (variable) | `fonts/GeneralSans-Variable.woff2` | Everything readable. ≥16px body, 60–75ch measure, weight 400/500/600. |
| **IBM Plex Mono** 400/600 | `fonts/IBMPlexMono-*.woff2` | **Money and machine facts ONLY.** Every dollar figure, every count, every timestamp, every "verified by" line. Tabular numerals. The mono is earned: payouts and receipts print in mono. Never decorative. |

Scale: editorial ×1.333. Display jumps are 3x+ body. Hierarchy by size + color, not weight — the
one thing a single-weight display face can't carry.

**Tracking rule, revised for a serif:** a grotesk display face wants tight negative tracking at
large sizes; a serif does not — its serifs already read as spacing. Site-wide display tracking
now sits between `0` and `-0.01em`, not the `-0.03em`-plus a grotesk would use. Don't reintroduce
tight tracking if this face ever changes back.

## Texture

One shared **grain** (SVG feTurbulence overlay, ~3% opacity, on hero bands and asset composites)
and one shared **warm grade** baked into every generated asset (assets/tools/grade.py). This is
what makes disparate props read as one art-directed system. Grain is subtle — visible on squint,
invisible on read.

## Assets

Tactile real-world props, photographic register: dollar notes, receipt, phone, soda can, iced
coffee, ring light, tripod, shopping bag, coin. Matted to RGBA, graded, exported webp+png.
- Text/logos/UI on props is ALWAYS a CSS overlay, never model-rendered (carousel rule).
- Cutout edges clean, no halo.
- Props bleed off edges; they overlap type zones deliberately; they never sit in tidy rows.

## Motion — four named mechanisms, not a blanket, and a budget

Revised 2026-08-04 (designer: "all the work was done only in the main hero"). The fix was not
"add more animation" — a blanket scroll-reveal system (class `.rv`, fade-up on every section)
was built and deleted earlier in this project for exactly the reason Ban #13 exists. Adding
motion to "every section" without recreating that has to come from what each section structurally
*is*, not from one reveal applied everywhere. Two background agents (an inventory of all 19
pages, an adversarial critique of a 7-item draft vocabulary) did that work; 3 of 7 drafted ideas
were cut as either a disguised `.rv` or motion that misrepresented real data — see the four that
survived below.

**The squint test that governs every addition here:** scroll the whole site once at reading
speed, then name every distinct motion from memory. If one mechanism accounts for more than
about a third of what's seen, it's a new blanket regardless of internal justification. **Budget:
≤2 scroll-triggered events per page, one of which is the hero where a hero exists.**

**1 — Numbers land.** Every dollar/stat figure site-wide counts up once via `[data-count]`
(`shared/site.js`), licensed directly by Ban #18. `data-from="X"` counts from a stated starting
value instead of zero, for "X → Y" copy that would otherwise discard the "up from" the sentence
already states (`about.html`'s spend-shift stats, `brands/compare.html`'s evidence row).
`data-rate-group="name"` locks counters sharing a comparison to the SAME COUNTING RATE, not the
same duration — `brands/index.html` and `brands/compare.html`'s "~4,400 vs ~770,000, 175× more"
pair lands the small number in ~0.15s and keeps the big one climbing for another ~1.5s, so the
reader physically waits out the ratio instead of watching two numbers arrive at the same instant
(which would visually assert they're comparable in size — the opposite of the point).

**2 — Sequence reveals in order, scoped to `.step-rail` ONLY.** A real ordered component
(`counter-reset`/`counter-increment` decimal-leading-zero numerals), on 4 pages (`index`,
`how-it-works`, `coach`, `waitlist`). `ScrollTrigger.batch` per rail, transform+opacity only.
**Do not generalize this to any other list or grid** (priority-action buttons, evidence cards,
filter chips) — those aren't ordered content, and staggering them "in order" would encode
something false. This is the one exception Ban #13 has to a blanket reveal, and it's an
exception precisely because it's this narrow — widening it is how you get `.rv` back.
`waitlist`'s rail is the one of the four that starts inside a `hidden` container, so it can't be
armed at load (a ScrollTrigger measuring a `display:none` box gets a zero-size rect and never
fires) — the page calls `window.BAI.revealSteps(queue)` when it unhides, same event-driven reason
as Mechanism 4. Only that function ever hides rail items, so an un-armed rail stays visible with
no reveal rather than stuck invisible. Any new rail placed inside a hidden container must arm
itself the same way, or it silently gets no motion.

**3 — Receipts get tense, not an entrance.** 10 receipt instances split by whether their numbers
are real: **statement receipts** (`index` ×2, `what-you-earn` ×2, `coach`, `how-it-works` — past
tense, hard-coded illustrative models) get Mechanism 1 on their `.total` only, nothing else
moves. **Forecast receipts** (`earnings` ×2, `brands/plan`, `brands/reserve` — future tense,
computed live from user input) never get an entrance; their numbers stay coupled to whatever
control produces them (Mechanism 4). A print/unroll entrance on a *static* receipt would
visually assert "this is being generated right now" — false, on a site that is otherwise
scrupulous about the opposite claim (the footer fine print, the "Indicative sample" badge,
`about.html`'s own "every dollar figure on this site is a model... not a researched rate card").
One addition: `brands/reserve.html`'s two `sessionStorage`-carried rows (the visitor's own
number, authored on `plan.html` two pages earlier) get a one-time background highlight the first
time they populate — provenance, not decoration; nothing on the six static spec rows beside them.

**4 — A number the user just caused to change tweens; a number that was always there doesn't.**
Public helper: `window.BAI.tweenNumber(el, toValue, formatFn, opts)` in `shared/site.js` —
event-driven (called from a click/input handler), **never ScrollTrigger**. Three of the pages
this covers (`earnings.html`, `brands/creators.html`'s result, `waitlist.html`'s queue) are
`hidden` at load and unhidden by inline script — a ScrollTrigger built against a `display:none`
box computes against a zero-size rect and silently never fires, so this has to be event-driven
regardless. Covers `brands/plan.html`'s live forecast (the "fleet" stats only — `budgetOut` and
the receipt's linear shares are a direct 1:1 echo of the slider and stay instant, tweening them
would lag behind the user's own drag), `waitlist.html`'s `#queuePos`/priority label (finishing
motion the `.meter` bar already half-had — its CSS transition existed before this, the number it
labels didn't), and `brands/creators.html`'s stat row (same idea, alongside the existing `.hood
.bar` width transition). **The page's own initial load is not "the user changed something"** —
every integration guards a `firstPaint` flag so the first computed value renders instantly, not
tweened from a stale hardcoded placeholder.

**Below-the-fold props, not a new reveal.** The complaint was literally that the hero's art
direction — not just "motion" — stopped at the fold. Fix: the *existing* `.prop`/`data-depth`
scroll-drift mechanism, extended to one prop per page on `brands/compare.html`, `about.html`,
`brands/plan.html` (new `.prop-band` section class in `shared/site.css` — same idea as
`.hero-band`, named separately since these aren't heroes). **No entrance, no pointer-parallax on
these** — `shared/site.js` scopes the entrance and parallax strictly to `.hero-band .prop`; only
scroll-drift applies to `.prop-band .prop`. They just exist and drift, the way hero props behave
once they've already assembled.

**Explicit no-motion, stated as restraint, not a gap.** Legal ×4, the footer, and mono captions
get nothing, on every page. **`about.html`'s four prose sections get nothing, deliberately** — it
contains the site's emotional core (the $10 Target gift card line the page calls "the entire
reason Blue AI pays cash"), and prose-first is the correct read; saying so is a real design
decision, not an oversight. **`brands/how-it-works.html` gets nothing, under any mechanism above**
— two `.rate-table`s, a `.tick-list`, prose — it's a reference/comparison page, not a moment. This
was a live option (drift-prop, like the three pages above) that was deliberately not taken; don't
add one later without re-reading why.

`prefers-reduced-motion`: every mechanism above renders final positions/values with zero motion,
not just the hero — verified per-mechanism, not assumed from the hero's existing handling.

## THE BAN LIST — hard review gate before any page is "done"

1. No indigo/violet/purple, no gradient of any kind in UI chrome
2. No gradient text
3. No ✨/pill badge floating above the H1
4. No centered-hero-plus-two-pill-CTAs formula
5. No exactly-three-equal-cards row
6. No uniform rounded-2xl + shadow card grid ("cardocalypse") — whitespace and ground shifts first, borders last
7. No colored left-border accent strips
8. No icon-in-pastel-rounded-square rows
9. No emoji as icons
10. No Inter / Poppins / Space Grotesk / Roboto
11. No serif-italic accent word in headlines
12. No all-caps tracked overline *as the only section label device* (mono labels are our device — used sparingly)
13. No same fade-up on every section (the ONE scoped exception is `.step-rail`'s batch reveal — Motion §2 — because it's a genuinely ordered component on 4 pages, not a blanket; do not widen it)
14. No stock-photo people; no fake dashboard mock
15. No cream+serif+sage editorial cliché
16. No headline a competitor could paste unchanged (Kale test: could getkale.com run this line?)
17. No pure #fff / #000
18. No hidden earnings — numbers are the content, show them (marketplace anti-pattern)

## Layout counter-moves

Real 12-col grid underneath; break it on purpose: one element bleeding off-edge per major
section AT MOST, varied section rhythm (a 2-up, a 5-up, one full-bleed moment per page),
whitespace as an active element. Receipt motif is the signature UI device: payout breakdowns,
estimates, and the campaign spec render as *receipts* (paper-2 ground, mono, dashed rules,
ragged bottom edge) — ownable, on-theme, replaces generic cards.

## Copy

The prototype's copy is the voice — carry it over near-verbatim. Second person, concrete
numbers, no exclamation marks. "AI agents take your money. Blue AI pays you." is the register.

## Accessibility floor

Contrast ≥4.5:1 body (check cash-green on paper: `#0B7A48` on `#FAF8F2` passes), visible focus
rings (2px `--ink` offset 2), 44px touch targets, keyboard-reachable everything, alt text on all
props (empty alt for purely decorative), reduced-motion honored.
