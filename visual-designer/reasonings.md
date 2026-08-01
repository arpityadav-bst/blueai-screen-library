# blueAI — Reasonings
Last updated: 2026-07-25 (file created this session — blueAI never had one; see session-logs Session 11)

> The deeper WHY behind decisions — principles that explain a CLASS of decisions, not a
> single moment. `decisions.md` captures the moment; this file captures the generalization.
> Promoted from scratchpad at audit passes, same as taste.md/knowledge-base.md.

## Match the fix to the surface's ROLE, not its visual family

Two surfaces can look alike — similar accent-tinted card, similar icon, similar "credit-related"
subject matter — without playing the same JOB. A component's established visual treatment is only
safe to reuse when the ROLE matches, not just the surface area or color palette. Before reusing a
pattern because it "looks like" a good fit, ask: does this surface do the SAME THING as the one the
pattern was built for, or does it just resemble it?

**Where this came from (blueai-desktop, 2026-07-25):**
- Considered reusing `.bai-plancard` (accent-tinted card + label) for the AI Credits screen's
  Prime-upsell pitch — visually it was a close match. Rejected it: `.bai-plancard`'s established
  role is an AI chat-message bubble ("PLAN" = the assistant's own numbered step list), not a
  pricing/upsell card. Borrowing it would have been a false-friend reuse.
- Considered porting the credits screen's ring-gauge (built to show a BALANCE across a RANGE) onto
  the Out-of-Credits modal. Rejected it: that modal only ever renders at `credits === 0` — a gauge
  there would always show empty, informing nothing a gauge exists to communicate. Same subject
  (credits), different job (status dashboard vs. one-time blocking decision) — the modal needed a
  fix scoped to ITS job (mode-specific title + intention-matched CTA), not the dashboard's fix.

**How to apply:** when a new surface reminds you of an existing one, name what the existing one's
JOB actually is before reusing its treatment. If the jobs differ, the visual similarity is a
coincidence, not a precedent.

## A signal is a repeat, not a first, unless it earns its slot

See taste.md rule 38 for the codified visual rule — the reasoning behind it: before adding ANY new
signal (a literal divider line, a status badge, a tag), name what's ALREADY doing that same "here's a
fact/boundary" work — a label's own spacing, a card's own border, a color/weight change, an icon, or
even a plain neighboring text element. A new signal stacked on top of an existing one doesn't add
clarity, it adds noise disguised as structure. This started as "a divider is a third signal" (3
instances, all separators) and generalized on the 4th: the header credit popover's "★ PRIME" badge was
removed for the exact same reason, even though a badge and a divider share no CSS in common — the
redundancy was in the MEANING (both said "this account is Prime," one via a tag, one via the plan-line
text below it), not the markup shape. **The generalizable test:** when adding a new visual element,
ask "what fact is this stating?" — then check whether anything already visible states that same fact.
If yes, the new element is decoration wearing information's clothes.

## Front-load the one action a transient surface needs seen before it disappears

A hover popover, a toast, anything that can vanish before the user finishes reading it, should put its
most important actionable element where it's seen FIRST — near the title/header — not at the bottom of
a stack the user has to scan past the data to reach. Stacking the action last assumes the user will
read everything above it before it matters; a transient surface can't assume that. *(blueai-desktop,
2026-07-25: the credits hover-popover's "View details ›" moved from the bottom of the info stack to the
same row as the "CREDITS" title, top-right — designer's own reasoning: it should be visible the moment
the popover opens, not after scanning past balance/bar/plan-line.)* Distinct from the redundant-signal
rule above — this one is about ORDER/placement given a surface's lifespan, not about duplication.

## Anything I can write from imagination is the part I must read from source

The three worst defects of the design-system build were all the same shape, at escalating scale: an
invented icon path, then invented button copy, then an entire invented UI state (a four-step login flow
documented as one fictional screen). Each time the mechanism was identical — I could *produce* something
plausible without consulting the source, so I did, and it looked right.

The test that separates safe from unsafe work: **could I have written this without opening the file?**
CSS values, class names and computed styles fail loudly or get caught by diffing. Copy, state counts, and
"which classes participate" fail *silently and convincingly*, because a plausible invention is
indistinguishable from a correct quote at a glance. So those are exactly the parts that must be quoted,
never authored — and ideally machine-checked, which is what `ds-drift-check.js` now does.

Corollary for documentation of any kind: a specimen, a screenshot, a claim in a header comment, and a
number in prose are all the same risk class. If it can be typed from memory, it will eventually be wrong.

## Have something that didn't build it check the claims

After building the design system I ran an independent multi-agent audit over it — agents with no stake in my
prior conclusions. They found **two places where I had documented my own work more favourably than the
code supported**: a header comment claiming "neither file keeps its own copy" of the icon paths (23 of 29
were still duplicated inline), and a token list whose values were computed live but whose *names* were
hand-written, so a new token would have been invisible on the page forever.

Neither was catchable by self-review, because I wrote both claims and believed them. Self-review checks
whether work matches intent; it cannot check whether intent matched reality. So: **after building any
artifact that makes claims about itself, have something that didn't build it verify the claims.** The
independence is the mechanism, not the thoroughness.

## Verify at the layer where the failure lives

Each verification harness built for this project was blind to exactly one thing, and each blindness cost
a real defect:

- The parsed-CSS-rule diff was strong but **comments are not in `cssRules`**, so a lost design-reasoning
  comment would have passed silently → needed a byte-level diff.
- The computed-style baseline could not see **JS-rendered icons** → needed a functional pass counting
  empty SVGs.
- The computed-style diff could not see **wrapping or clipping**, only values → needed an overflow scan
  at the narrowest and widest widths.
- A `|| ''` fallback in the icon helper could not see **invented names** → needed a throw.

A more thorough version of the same check would not have caught any of these. Ask what *kind* of thing
could be wrong, then pick a check that can see that kind.

## A measured number belongs only in the thing that measures it

**Four instances, two different files, same mechanism.** The parity-audit thread hit it three times —
Layer A's §2 accounting table hand-written once and never re-derived after the data changed; an HTML
summary hand-typed to 256 when its own JSON said 240; evidence counts that were added when they
overlapped. Then, on 2026-08-01, `blueai/CLAUDE.md` was found asserting "46 tokens" (64) and "233 of
330 classes, 71%" (249/325, 77%) — **both written that same session** and both already wrong.

The tempting fix each time is "update it, and be more careful." That has now failed four times. The
real fix is that the transcription should not exist: CLAUDE.md was changed to point at the style guide
and `ds-drift-check.js`, which count on demand, and to say explicitly why no figure is written down.

**How to apply:** if a number can be computed, never also state it in prose. If prose genuinely needs
it, have the prose name the command that prints it. A hand-copied measurement is a correct statement
with an expiry date nobody records.

## If a style is state-dependent, the state is a test dimension

The skill-create switcher's selected tab carried `font-weight: 700`; the options are equal-width
`flex:1`, so the extra glyph width tipped the longest label onto a second line and **selecting a tab
resized the tab row.** The designer found it. My own wrap scan could not have: it swept viewport
widths and both themes while leaving selection at its default. I varied the dimensions I habitually
vary and held fixed the one the bug lived in.

**How to apply:** before sweeping, list what the property depends on — not what is easy to iterate.
Width and theme are the reflexive axes; hover, focus, selected, disabled, loading, empty, overflowing
and error are the ones that get skipped, and interactive state is where this project's recurring
defect category has now landed six times. A sweep that feels thorough is still blind along any axis
it never moved.

## New verification tooling is wrong until it is diffed against something known-good

Every verification harness this project has built contained at least one real bug on its first
*successful* run — the capture scripts, the manifest validator, both generator scripts, and on
2026-08-01 the icon migration itself, whose v1 tagged six JS-string SVGs for a boot-time hydration
pass that could never reach them, rendering them empty. The comparison script written to check that
migration was *also* wrong, in the opposite direction: it reported 292 differences that were purely an
artifact of adding an attribute and re-sorting on it.

So "it ran without throwing" proves nothing, and so does "the diff was clean." What works is diffing
against something independently known to be right: a pre-change snapshot, a second run for
idempotency, the DOM itself, or the file's own CSS as ground truth.

**And its sharpest form — negative-test the check.** `ds-drift-check.js` §9 was written to catch a
wrong-but-valid icon, so the bug it was written for was deliberately reintroduced to confirm it fails
and exits non-zero, then reverted. A check that has never failed is not a check that works; it is a
check that has never been asked.

## Provably-invisible changes are mine to make; anything visible is the designer's call

The size-scale consolidation split cleanly: tranches 1-2 (merging half-pixel steps, swapping literals
for tokens) were applied autonomously because a computed-style diff proved ZERO rendered change; the six
proposals that would move real pixels went to the designer as an accept/reject artifact — and the
designer took four and declined two, one of which ("the 16px modal corner") had a legitimate opposite
answer I could not have adjudicated alone.

**The line is not "small vs big" — it is "provable vs visible."** *Provable* means measured (a
before/after diff at the rendering layer), never assumed: an edit that "obviously changes nothing" is an
assumption wearing confidence. Anything that changes how the product LOOKS — even 2px on a corner — is a
taste call, and taste belongs to the designer until explicitly delegated.

**How to apply:** before touching shared styles, decide which side of the line the edit is on. Provable →
do it, attach the proof. Visible → propose it with a rendered comparison and wait. When one batch
contains both kinds, split the batch.

## An icon is the product's choice, not a plausible one

Six specimens rendered real, well-drawn, *wrong* icons: right-chevrons where the product points down, a
clock-and-bolt orbit composition where the product shows a database and a gift. Nothing was invented —
every glyph existed in the set — which is exactly why no existence check and no glance caught it.
**Wrong-but-valid is a different failure class from invented**, and it is invisible to any check (or any
reviewer) that only asks "is this a real icon?" instead of "is this THE icon the product uses here?"

**How to apply:** when documenting or reusing any asset choice (icon, illustration, glyph, emoji), quote
the product's choice for that exact site — never pick a plausible member of the same set from memory.
Plausibility is what makes the error durable.

## If two components share a treatment, the sharing lives in the selector, not in a comment

`.bai-sched-newrow` was written with a comment claiming it used "the house treatment already
established by `.bai-upload-row`". The colour/type layer did match — ten properties verbatim — but
alignment, padding, radius and gap had all quietly diverged, one of them (gap) with no design reason
at all. Nothing enforced the claimed sameness, so the first time one side was edited without the
other, they drifted, and only the designer comparing them side by side caught it. This is the same
defect this project keeps finding in icons and copy — a claim of sameness that nothing checks —
wearing CSS clothes.

**The taxonomy answer, since the question will recur:** two components that share a look are a
FAMILY — one base rule (the combined selector) owning the shared properties, plus each member's own
rule holding only its role-justified differences. That is a "base + variants" component model
expressed in plain CSS: the base rule IS the component, the member rules ARE the variants, and each
variant delta must carry its reason in place (here: alignment differs because one is a standalone
centred CTA and the other a flush-left list row; radius differs to match each one's surrounding
card family; padding differs to hit this system's 32px control-row height).

**How to apply:** when a new component "adopts" an existing one's treatment, do not copy the
declarations and note the kinship — add its selector to the base rule and declare the family in
`ds-drift-check.js` §12, which fails if any member ever re-declares a family property. The moment
you find yourself writing "matches X" in a comment, that sentence should be a selector instead.

*(New entries accumulate at audit passes.)*
