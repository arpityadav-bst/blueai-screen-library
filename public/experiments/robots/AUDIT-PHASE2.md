# Phase 2 visual UX audit — /creators (2026-08-19)

Produced by the PLAN.md Phase 2 workflow: 8 parallel dimension auditors (spacing · typography ·
color-contrast · interactive · icons · layout · anti-slop · mobile), source-only analysis (no
browser, contrast ratios and sizes computed from the CSS values), then a skeptical merger that
re-verified every finding against the files. 55 raw findings → 23 killed or merged → **32 final**.
Accessibility deliberately out of scope (Appy). Copy findings are marked **COPY** — those change
words, not just values, and need explicit sign-off.

Status legend: every finding below is PENDING until Appy approves the list; approved items get
applied by the Phase 2 fix workflow, batched by file.

---

## HIGH

**F1 · layout · mobile — the hero demo is illegible on phones**
`@media (max-width:880px) .crx .scene` scales the whole 980px scene by 0.62 with no font
compensation. Effective sizes at 390px: task rows 8.1px, laptop brand 8.9px, status 6.5px,
EARNED label 5.6px, amount 11.9px. The page's proof moment is unreadable.
Fix: counter-scale the inner type inside the same query (task 1.15rem, brand 1.3rem, status 1rem,
amount 1.8rem, label 0.9rem, chip 1.15rem → effective ~11.4/12.9/9.9/17.9/8.9/11.4px).

**F2 · interactive · mobile — menu CTA loses its gradient on tap**
`.crx-menu button:hover` (specificity 0,3,1) beats `.crx-menu-cta` (0,3,0), so the gradient pill
goes ghost-gray at the moment of interaction. Fix: `.crx .crx-menu button.crx-menu-cta:hover
{ background: var(--cta-grad); color:#fff; filter: brightness(1.08); }`.

**F3 · anti-slop · both — COPY: the money numbers contradict each other**
Demo pays $2–$30/task on a $118 balance climbing forever; couch chips show +$12/+$5/+$20; the copy
promises a flat "$30 every month". The animation contradicts the offer. Fix requires picking ONE
model: (a) rescale demo to cents-level per-task credits summing plausibly toward $30/mo
(PAYS [0.4,0.6,1,1.5], base $18, chips +$1.50/+$0.60/+$2.10), or (b) keep dollar-scale drama and
soften the copy to "collect what your worker earns each month". **Needs Appy's call between (a)/(b).**

## MEDIUM

**F4 · typography · both** — the h2 tier has no owned line-height (inherits ~1.5; loose against
h1's 1.12 when wrapping) and three different clamp recipes for one tier. Fix: line-height 1.15 on
all three h2s, 1.25 on .beat; unify sleep+below clamps; calm closer's midpoint to 4vw.

**F5 · layout · mobile** — fleet misses a 2×2 grid by 8px at 390px (168px slots + gap = 350.4 vs
342 available) → four stacked cards on every common phone. Fix: `.crx .slot { width: calc(50% -
0.45rem); max-width: 168px; }` in the 880px query.

**F6 · layout · mobile** — flyChip mixes transformed and untransformed coordinates under
scale(0.62): chips land at 0.62× their offsets (error up to ~110px). Fix: divide measured deltas by
`sceneBox.width / scene.offsetWidth`.

**F7 · layout · mobile** — `.scene` width 96vw overflows main's padded box below ~1200px (renders
off-center; the earnings pill's right edge lands past the viewport and is silently clipped by
overflow-x:hidden). Fix: `min(980px, 100%)`; re-anchor the pill `right: 8px; left: auto` under 880px.

**F8 · layout · both** — the time chip: (a) on mobile it's a near-edge-to-edge floating banner
permanently occluding content; (b) the clock computes once and is wrong within minutes. Fix: hide
the chip under 880px (the mini counter carries the dock there); wrap the time line in a function +
60s interval (cleanup already exists).

**F9 · layout · mobile** — `.steps` auto-fit produces a 3+1 orphan across the whole 710–935px range,
with "04 Collect" (the payoff) alone bottom-left. Fix: explicit 4 / 2 / 1 columns at 935px/520px.

**F10 · color-contrast · both** — the EARNED label is 8.96px at 3.77:1 on white — smallest,
faintest text on the page, captioning the money proof. Fix: 0.6rem + #5c6678 (~5.8:1).

**F11 · color-contrast · both** — "Soon" tags ~3.6:1 at 9.6px; "Click anywhere to skip" (the only
escape from the blocking intro) 3.17:1 at 10.9px. Fix: raise to rgba(214,224,255,0.58) and 0.55
respectively; the live slot's mint tag untouched.

**F12 · interactive · both** — no :active state on any button (hover lifts, press does nothing;
zero tap feedback on touch). Fix: add :active rules for .btn, .crx-cta.pill, burger, menu rows.

**F13 · interactive · desktop** — the header CTA's quiet→pill swap snaps its padding in one frame
then fades the gradient (two-stage glitch). Fix: equalize padding across both states so the swap is
a pure fill/shadow fade.

**F14 · anti-slop · both — COPY** — closer button says "Apply Now" while hero/header/menu say
"Join the first wave", and the header CTA scrolls you TO the mismatched button. Fix: closer →
"Join the first wave". (The port faithfully preserved this source inconsistency; already logged.)

**F15 · anti-slop · both — COPY** — the laptop demo never names a task ("Working on it…"),
undercutting "real work from brands". Fix: small TASKS array from the real job shape ("Watch: 3-min
product demo", "Like + comment: launch video", …), one per cycle.

**F16 · anti-slop · both** — gradient-italic-glow (.grad) on 5 of 6 headline payoffs = the canonical
AI-landing-page tell, diluted to nothing. Fix: keep h1 + the two intro beats; strip it from the two
section h2s (plain #fff/800 already carries them).

**F17 · typography · both** — mono micro-labels: five sizes × six trackings with no correlation.
Fix: collapse to three sizes (0.72/0.66/0.6rem) and two tracking tiers (0.2em eyebrows, 0.12em tags).

**F18 · icons · both** — the robot's eyes are r=0.4 (0.8px) — sub-pixel smudges. Fix: r=1.

**F19 · spacing · mobile** — the scaled scene's box is ~39px taller than its visual content
(phantom desk→fleet gap). Fix: mobile height 330px → 292px (= 470 × 0.62).

**F20 · mobile** — the burger's hit area is 37.6px, under the 44px floor its own menu rows meet.
Fix: padding 0.55rem → 0.75rem (= 44×44).

**F21 · layout · both** — no footer at all; the page just ends after the closer. Fix: one-line
footer in the page's mono-eyebrow voice ("© 2026 BlueAI · A now.gg product") + hairline top border.

## LOW

**F22 · spacing** — section breaks are 7/6.5/6rem drift, closer's stack rhythm differs from the
hero's. Fix: unify breaks on 7rem; match closer h2/p margins to hero (1.25rem/2.2rem).
**F23 · layout · desktop** — three content widths (1100/1000/unbounded). Fix: unify on 1100px.
**F24 · layout · mobile** — .sleep collapses at 780px while everything else is 880px, leaving a
cramped two-column in-between state. Fix: move to 880px.
**F25 · typography** — 0.88/0.9/0.92rem phantom steps; body leading drift (1.65/1.7/1.55). Fix:
collapse to 0.9rem; sleep p leading 1.7 → 1.65.
**F26 · icons** — the plus slot icon has ~1/3 the ink of its siblings; the CTA arrow renders at
1.5px next to a filled spark. Fix: circled plus (r=8.5 + strokes); arrow strokeWidth 2.4 → 3
(identically in HomeMain + HomeBelow — the component is duplicated).
**F27 · icons** — the ✓ tick is a font glyph in an all-SVG icon language (Windows fallback ignores
the 800 weight). Fix: 12px inline SVG check in the three innerHTML strings.
**F28 · anti-slop** — six position:fixed stars twinkle over EVERY section forever. Fix: .crx
position:relative + stars absolute, so they belong to the hero sky and scroll away.
**F29 · anti-slop** — three money chips bobbing in identical 5s loops = floating-notification
cliché; c2 can clip against the mask edge. Fix: two chips, desynced durations (6.5s/8s), travel
-10px → -5px.
**F30 · anti-slop — COPY** — "Whatever's next" tagged "Soon" (you can't schedule the unnamed);
"Soon"×3 reads templated. Fix: fourth tag → "Open slot".
**F31 · interactive · desktop** — the logo is the only interactive header element with no hover.
Fix: opacity 0.85 on hover.
**F32 · mobile** — 122px of dead space above the h1 at phone widths. Fix: mobile main padding-top
→ calc(2rem + 66px).

---

**Fix batching (Phase 2 workflow B, once approved):** creators.css carries most items and gets
sequenced batches (F-groups don't overlap selectors); useHomeFx.ts (F3a/F6/F8/F15), HomeMain.tsx
(F18/F26/F28/F30), HomeBelow.tsx (F14/F16/F21/F26/F29), HomeHeader.tsx (F20 CSS-side). Machine
gates (tsc + build) after every batch; Appy's eyes close the phase.
