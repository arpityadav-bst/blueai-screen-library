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

After building the design system I ran an independent audit over it — six agents with no stake in my
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

*(New entries accumulate at audit passes.)*
