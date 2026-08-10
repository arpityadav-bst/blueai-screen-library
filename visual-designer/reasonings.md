# blueAI — Reasonings
Last updated: 2026-08-11 (POST-CLOSE promotion: +4 more principles — a constant that is secretly a SUM breaks
when a term stops existing; fixing an unreproduced defect introduces one; a gate with standing false positives
has stopped being a gate; and a record asserting "open"/"all"/a count is a claim that expires. That last one
came from three false records found in a single session, all of them prose about my own bookkeeping and none of
them code — see `evolution.md`'s top recurring category. Earlier the same day: +6 principles —
content-pacing-as-designer-not-generator, reassurance-must-match-state, a-rejection-must-be-re-tested,
persistent-vs-transient rule scope, one-glance state legibility on transient surfaces, and a shared rule's
hidden sibling-dependency — Session 17. Earlier: 2026-08-04 (+2 principles: "a philosophy applied in one theme/mode and left out of the other
isn't applied" and "before painting over something that looks empty, check what relies on it staying that
way"; widened "match the fix to the surface's role" (adjacency is a family too) and "anything I can write
from imagination…" (external product precedent is the same risk class as an internal spec) with fresh
instances each. Earlier: 2026-08-03 (+2 principles: "a measured constraint inherits the wrongness of
whatever produced the measurement" and "inherit at every level of the composition". Header date was left
at 2026-07-25 through six additions made 2026-08-01 — an audit caught it; the date is now bumped on every
touch, because the mandated freshness check READS this line and a stale header makes the check pass on a
stale file.)

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

**A second shape of the same mistake (blueai-desktop, 2026-08-04):** the "family" being matched doesn't
have to be a component — it can be plain physical ADJACENCY. Landscape mode's header sits directly above
the chat pane, so I gave them the same background tone, treating "sits right above" as if it were a role
match. It wasn't: the header's actual job is nav chrome — the same job the sidebar does (logo, settings,
mode-switcher) — and chat's job is the workspace, the thing that changes per-conversation. The designer's
fix regrouped by role (header+sidebar, not header+chat) and named the missing piece explicitly: once
grouped correctly, depth (lighter vs. darker) is what expresses which group is chrome and which is
content — the group that reads lighter sits above/in front, the darker group recedes. → taste rule 47.
**Widened test:** before pairing two surfaces' treatment, ask whether the resemblance is ROLE (do they do
the same job?) or merely FAMILY — and adjacency, like visual similarity, is a family, not a role.

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

**The same test applies to EXTERNAL precedent, not just internal specs (blueai-desktop, 2026-08-03).**
Asked whether a color decision matched real products, I answered "ChatGPT/Notion/Linear do exactly this"
— confident, plausible, and unverified, because I had no screenshot in front of me, only a memory of
what those products are generally like. The designer posted two real references, and both showed the
opposite of my claim. Citing a competitor's pattern from memory is the same move as inventing a copy
string: something plausible standing in for something checked. **Widened test:** "could I have written
this without opening the file" now also reads "…without a screenshot of the thing I'm citing" — a
remembered impression of a product is not evidence about its current UI, any more than a remembered
impression of a spec is evidence about the code.

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

## A measured constraint inherits the wrongness of whatever produced the measurement

A number you measured yourself feels like bedrock, and "MEASURED, not preference" reads like the end of an
argument. It is not. A measurement is a fact **about the thing you measured** — and if that thing should not
have existed, the figure is faithful and the conclusion built on it is wrong. Measuring protects you from
guessing; it does not protect you from measuring the wrong subject.

**Where this came from (blueai-desktop, 2026-08-03).** Scheduled's form had 179px of usable width, and I
measured that honestly. From it I derived two layouts and wrote them into the CSS with the words *"MEASURED,
not preference"* as their defence: Repeat Type had to be a 2×2 grid because four labels measure 212px, and
the day chips had to wrap 4+3 because seven need 259px. Both derivations were arithmetically correct. Then
the designer asked why the form's container didn't match the rest of the screen's padding, the container
turned out to be a wrapper that should never have been there, and the width became 264px — at which point
both "forced" layouts became single rows. **The figure was right and the conclusion was wrong.** The same
width had by then been wrong three times in one day (210 → 179 → 264), each time because it was measured
against a containment that then changed.

**Distinct from *"A measured number belongs only in the thing that measures it"*** (above), and worth keeping
separate: that principle is about a correct figure going STALE in transcription — the cure is to point at the
thing that measures instead of restating it. This one is about a figure that is CURRENT and CORRECT and
measured against the wrong subject. Neither cure fixes the other; a live tally of 179px would have been just
as misleading.

**How to apply:** when a measurement becomes a constraint — especially one you are about to encode as "this
layout is forced" — name the subject it was taken against, in the same breath. *"179px, given the card
wrapper"* survives the wrapper's removal as an obviously-expired claim; *"179px"* does not. And when anything
in the containment chain changes, treat every constraint derived from it as unverified rather than inherited.
*Where else this applies:* a performance budget measured on a page that later dropped its heaviest component;
a line-length cap derived from a font that was then swapped; a touch-target minimum measured at a zoom level;
any "we can't, because it doesn't fit" whose fit was computed inside a container nobody questioned.
*What would stop it firing:* reading it as being about WIDTHS, or about arithmetic errors. The arithmetic is
right every time — that is what makes it dangerous.

## Inherit at every level of the composition, not just the level you were editing

Gate 2.2 says: before building a new surface, grep for sibling surfaces in the same role and inherit their
anatomy. The trap is that a surface has several levels at once — the container, the layout, the field
groups, the controls, the labels — and running the inheritance check on the level you happen to be thinking
about feels like running it.

**Where this came from (blueai-desktop, 2026-08-03).** Building Scheduled's form I *did* run Gate 2.2, and it
worked: I found Skills' create form and inherited its `.bai-field-group` + `.bai-set-field-label` pattern
rather than inventing a label treatment. The same sibling, at the level immediately above, has **no card
wrapper at all** — its field groups sit straight in the subpane body. I never asked the question at that
level, so I kept the wrapper the form already had. The evidence was in the file I was already reading, for
the reason I was already reading it.

**How to apply:** when a sibling surface answers one question, ask it the rest. Enumerate the levels
explicitly — container, layout, grouping, control, label, copy — and say what the sibling does at each. A
half-run inheritance check is more dangerous than a skipped one, because it produces the feeling of having
checked. *Where else this applies:* copying a card's internals while inventing its shell; matching a modal's
footer while inventing its header; adopting a list row's typography while inventing its spacing rhythm.
*What would stop it firing:* believing the check is a single act. It is one question per level, and finding
the right sibling is the cheap part.

## A philosophy applied in one theme/mode and left out of the other isn't applied — it's a one-off

"Verified" has a scope, and the scope is easy to understate. Fixing a surface's tone in dark mode and
reasoning that light mode's version of the same gap "wasn't the one screenshotted, and was already small"
feels like a proportionate, evidence-respecting call — it isn't. What the reference actually taught was a
PRINCIPLE (dock = canvas tone; contrast lives on the selected item, not the base panel), and a principle
that governs one theme but not its sibling was never really adopted — it was patched into the one place
someone happened to be looking.

**Where this came from (blueai-desktop, 2026-08-04):** dark theme's sidebar was split into its own token
and moved barely-dark, matching a design reference shown in dark theme. Light theme's identical structural
gap (a pure-white sidebar against a barely-tinted canvas) was left alone, reasoned as smaller in raw pixel
terms. The designer's correction wasn't "fix the other theme too" as a checklist item — it was pointing out
that the FIRST fix was never actually a principle if it only held in the theme that happened to be
screenshotted.

**How to apply:** whenever a fix is framed as "the reference/rule/pattern says X," ask immediately: does X
apply to every mode/theme/variant this surface has, or only the one currently in view? If a sibling
variant has the analogous gap and it's left alone, name explicitly why it's exempt (a real, stated reason)
rather than silently, or it will read exactly like this one did: an oversight wearing the shape of a
decision. *Where else this applies:* a spacing fix applied to desktop and "probably fine" on mobile without
checking; an accessibility fix applied to the primary flow and not its error state; a copy fix applied to
one locale.

## Before painting over something that "looks empty," check what relies on it staying that way

A DOM element with no CSS background is not always simply showing whatever is behind it by default — it
can be a deliberate window onto something else entirely, and the only way to know is to check, not to
infer from the fact that nothing is currently declared there.

**Where this came from (blueai-desktop, 2026-08-04):** `.bai-header` has never had a CSS background. It
looks, from the stylesheet alone, like a plain transparent element that would just show the canvas'
flat fill-color behind it — a safe thing to paint an opaque color onto. It wasn't: a canvas underneath it
continuously repaints a live twinkling logo, ambient sparkle packets, and heartbeat pulses, every frame,
and the ONLY reason any of that was ever visible is that nothing opaque sat on top of it. Giving the
header a flat background silently deleted that animation from the user's view, with no error anywhere —
the canvas kept rendering perfectly, just invisibly.

**How to apply:** before adding an opaque background/covering layer to an element that currently has
none, grep for what ELSE might be relying on that transparency — a canvas underneath, a positioned sibling
peeking through, a `mix-blend-mode` effect. "It's currently transparent" is not evidence that it's *safe*
to make opaque; it's only evidence that nothing is declared to stop you. **Sibling test, same shape:**
"new verification tooling is wrong until diffed against something known-good" (above) checks whether a
CHECK sees enough; this checks whether a CHANGE reaches further than what was verified — a fix that only
confirms the property it touched (background color) can still break a property it never thought to look
at (what renders behind that background).

## Scripted content that reads as a template is a pacing bug, not a content bug

A multi-step flow with uniform line lengths and evenly-spaced pauses reads as a template being filled in,
even when every line is individually well-written — the UNIFORMITY itself is the tell, independent of the
words. "plan my day" produced exactly one reply for one message, then five, and the fix that made it read
as real work wasn't better copy on any one line — it was varying line length and pause duration across the
sequence (a two-word beat, a sentence that has to explain something, a short result) so the rhythm itself
stopped signalling "generated."

**How to apply:** when authoring any multi-step scripted content (a demo flow, a chain of status updates,
a sequence of onboarding messages), audit the SHAPE of the sequence, not just each line's wording — same
length + same cadence across 3+ steps is itself a defect, the same way a uniform icon-button aspect is a
defect independent of which icon it is (taste rule 48's sibling principle, one level up from CSS).

## Reassurance copy is only reassurance if the thing it reassures about currently exists

A sentence that is TRUE IN GENERAL ("signing out won't stop your scheduled tasks") can be FALSE IN THIS
STATE (there are no scheduled tasks) — and copy that states a general truth without checking the specific
state doesn't just fail to reassure, it actively misleads: the user goes looking for the tasks the sentence
implied exist. This is a distinct failure from ordinary copy inaccuracy, because the sentence was never
factually wrong in the abstract — it was written for the common case and never re-checked against the
actual data at render time.

**How to apply:** any copy that names a consequence, a count, or an object ("your X will Y") must be
verified against the LIVE state that renders it, not assumed true because it usually is. If the object can
be empty/zero, write the empty-case sentence explicitly rather than letting the general sentence render
over nothing.

## A rejection reasoned as "X is impossible" must be re-tested before the next session inherits it as fact

A design decision that REMOVES a mechanism on the grounds that a constraint makes it impossible carries a
premise, and that premise can be wrong even when the decision that followed from it felt careful. Schedule's
empty-state create button was deleted with the stated reasoning "a permanently-docked bar cannot swap" —
which was simply false; nothing prevents a docked bar from hiding. The decision READ as principled (it
cited rule 38, named a mechanism, gave a reason) while resting on an unverified claim about what CSS/JS can
do.

**How to apply:** when a past decision's stated reason is "X is impossible" or "X cannot Y," that clause is
a claim, not a fact, and claims about mechanism (not taste) are cheap to re-test. Before inheriting a prior
rejection as settled, ask specifically: is the stated impossibility actually true, or was it true of the
IMPLEMENTATION at the time (a permanent bar) rather than the MECHANISM in general (a bar, full stop)? This
is the mirror case to *"a measured constraint inherits the wrongness of whatever produced the measurement"*
(above) — that principle is about a NUMBER staying attached to an expired subject; this one is about a
REJECTION staying attached to an expired argument.

## A rule scoped to a PERSISTENT surface does not automatically transfer to a TRANSIENT one

"No auto-dismiss timer, close button only" was the right call for a card the user reads at their own
pace — a timer there would half-duplicate the close button (rule 38's mechanism: two ways to end the same
state is one too many). The same reasoning, applied unchanged to a REDESIGNED version of that surface as a
transient top banner, would have been wrong: a banner whose entire premise is announce-then-leave needs a
timer, and the close button becomes the early-exit rather than the only exit. Same component's job, same
underlying event (credits arrived), but the surface's LIFETIME changed — persistent vs. transient — and
that is exactly the kind of change Gate 6.5's rule-conflict cross-check exists to catch before an old rule
gets silently reapplied to a new shape.

**How to apply:** before reapplying a codified rule to a redesigned or repurposed surface, name what the
rule's justification actually depended on. If it depended on the surface's LIFETIME (read-at-leisure vs.
glance-and-gone), re-derive the rule for the new lifetime rather than inheriting the old value. *Sibling to*
the rule-conflict cross-check itself (QUALITY-GATES.md Gate 6.5) — this is the specific shape that check
takes when the axis that changed is how long the surface stays on screen.

## A transient surface needs its state legible in ONE glance — a single faint channel is not enough

A reward toast and an alert toast were structurally identical apart from a 22px icon's fill colour — and
that fill was a 16% wash, faint by design (the same recipe an independent review had already measured at
~1.25:1 on a white card). Asked directly whether the two "look delightful," the honest answer named the
real gap: state was carried by exactly one channel, and that channel was weak. A card the user can linger
on can afford a subtle signal; a banner that is gone in 2.5–4 seconds cannot — it has to read correctly in
peripheral vision on the first frame, not on close inspection.

**How to apply:** for any surface with a short, uncontrolled lifespan (a toast, a flash message, anything
that can vanish before the user finishes looking), audit how many channels carry its most important
distinction and how strong each one is. If the answer is "one, and it's a 15% colour wash," add a second,
stronger channel — reuse whatever idiom this app already uses for state elsewhere (here: a coloured
border, already established on buttons at 40% strength) rather than inventing a new one. This is the
mirror case to rule 41 ("a distinction already carried by a non-layout channel must not be RE-encoded") —
41 is about too many channels stacking redundantly; this is about too few, and too weak, on a surface that
gets exactly one chance to be read.

## A shared rule's correctness can depend on an assumed sibling that isn't present at every call site

`.bai-list-body`'s 2px top padding is not a complete value — it was calibrated on the assumption that a
`.bai-list-head` toolbar sits above it and supplies the other 9px of the real gap itself. That assumption
was true everywhere the rule had been used (Skills), so nothing exposed it until a NEW call site (Schedule)
reused the same class with no toolbar above it, and inherited half a gap with no way to know the other half
was missing. The rule read as self-contained CSS; it was actually one half of a two-part contract with an
unstated partner element.

**How to apply:** before reusing a shared class/rule in a new context, ask not just "does this value look
right here" but "was this value derived assuming something ELSE is also present, and is that something
actually here?" This is the sibling-anatomy question (Gate 2.2) run in the other direction — 2.2 asks
whether a NEW surface should inherit an existing sibling's anatomy; this asks whether an EXISTING shared
rule secretly depends on a sibling that a new call site doesn't have. *Where else this applies:* any
padding/margin pair split across a parent and a expected-but-optional child (a card's own gap assuming a
header row; a form's field spacing assuming a label is always present); any two-part visual contract where
one half is a class and the other half is "whatever else happens to be in the DOM."

## A constant that is secretly a SUM breaks when one of its terms stops existing

`top: 84px` looks like a position. It is arithmetic — 46px header + 38px tab strip — and one of those terms
does not exist in every mode. Landscape hides the tab strip, so every subpane opened 38px too low and left a
strip-height band of the parent pane showing. Nothing was miscalculated; the sum was correct for the mode it
was written in and silently wrong in the mode that removes a term.

**This is now a three-instance family in this project, and the third is what makes it worth its own entry:**
`.bai-list-body`'s 2px top padding (half a gap, correct only when a toolbar sibling supplies the other half —
and `#baiSchedList` has no toolbar); `.bai-subpane`'s and `.bai-tour`'s 84px (header + a strip one mode
hides); and, one level up, S16's *"a philosophy applied in one theme and left out of the other isn't
applied."* All three are the same mechanism: **a value whose correctness depends on a condition that is true
where it was authored and false somewhere else it applies.**

**How to apply:** when you write or inherit a hard-coded dimension, ask what it is the sum OF, and write that
down beside it — `/* 84 = 46 header + 38 strip */` survives the strip's disappearance as an obviously-expired
claim, where a bare `84px` does not. Then ask which of those terms any mode, theme, breakpoint or state can
remove. **The tell is a number that no single element in the file actually has.** If a value equals A + B, it
belongs either in a `calc()` naming both, or in a rule scoped to the condition under which both exist.
*Where else this applies:* a `max-height` that assumes a footer is present; a scroll offset that assumes a
sticky header; a z-index chosen as "one above the thing that used to be there"; a width computed against a
sidebar that collapses. *What would stop it firing:* reading it as being about ARITHMETIC ERRORS. Every sum
here was correct. The failure is a correct sum outliving one of its addends.

## Fixing a defect you have not reproduced is how you introduce one

`.bai-dialog-cancel`'s background was changed from `--bai-input-bg` to `--bai-pill` to fix a light-theme bug
where the fill matched the card and the button was "invisible." The button carries a 1px border. It was an
OUTLINED button, the border defined it, and it was never invisible — the same recipe its sibling
`.bai-set-btn` has always used on the same white card. **The fix solved nothing, and it created the
inconsistency the designer had to point out a week later**, which then cost a ruling, a family declaration and
a negative test to undo.

The mechanism is that the defect was inferred from VALUES (`--bai-input-bg` equals `--bai-card` in light
theme — true) rather than observed in a RENDER (is the control actually indistinguishable? — no, its border
distinguishes it). A value-level inference about appearance skips every other property that also contributes
to appearance.

**How to apply:** before fixing a visual defect, render the state and confirm the defect. If the report came
from reasoning rather than from looking — "these two tokens are equal, therefore this is invisible" — that is
a hypothesis, not a finding. *Sibling, and worth reading together:* *"before painting over something that
looks empty, check what relies on it staying that way"* is this principle's mirror — that one is about a
change reaching further than you verified, this one is about a change fixing less than you assumed (nothing).
Both come from treating a stylesheet reading as equivalent to a rendered result.
*Where else this applies:* "this text must be unreadable, the contrast ratio is 3:1" on text that carries a
shadow or a weight change; "this is clipped, the parent is `overflow: hidden`" on a child that fits; any
accessibility or contrast fix derived from tokens rather than from the rendered pixel.

## A gate with standing false positives has already stopped being a gate

`radius-nesting-audit.js` had two permanent false findings — product components nested inside the style
guide's own documentation wrappers, one of them demanding a 1px radius on a sidebar row. It had therefore
never printed zero. Its output had become a thing to skim, and **a real rule-44 violation in that session's
own code was sitting directly underneath the noise.** Filtering the two false positives is what let the real
one be seen.

The cost of a false positive is not the false positive. It is that a reader who must mentally discount part
of a gate's output stops reading the whole of it, so the gate's true findings inherit the noise's credibility
rather than the reverse. **A check that cannot reach zero teaches you to ignore it.**

**How to apply:** treat "known false positives" as a bug in the gate with the same priority as a missed
detection, and fix them by narrowing the gate's scope explicitly (with the reason recorded in the gate), not
by remembering to ignore them. If a gate's clean state is not reachable, its findings are advisory at best.
*Where else this applies:* a lint rule disabled inline in forty files; a test suite with a known-flaky test;
a coverage report with an untracked exclusion list; any dashboard with a metric everyone knows to ignore.
*What would stop it firing:* judging a gate by whether its findings are TRUE rather than whether its clean
state is REACHABLE. Both false positives here were, in a narrow sense, accurately measured.

## A record that asserts "open", "all", or a count is a claim, and it expires

In one session three separate records in this notebook were false, and all three were of one shape: a
summary of my own bookkeeping asserting completeness. "Gates at close" named two of three gates — and the
unrun third immediately found a real violation in that session's code. "All 10 logged in scratchpad.md" was
false because two different groupings coincidentally both totalled 10. And a section headed **"Designer's
call — OPEN, carried forward (do NOT wipe without a decision)"** listed four questions the designer had
decided that same day.

The third is the expensive one, and it defines the category: **a stale FACT misleads a reader; a stale
OPEN-QUESTION marker spends the designer's time re-deciding what they already decided.** A do-not-wipe marker
is trusted precisely because it looks deliberate.

None of the three were code. Every mechanical check on the product held that session — three gates green by
exit code, CSS integrity balanced, every documented figure re-derived. **The asymmetry is the point: code has
gates and prose does not, so prose is where unchecked confidence accumulates.** All three were found by the
designer asking one question, which is the same mechanism as *"have something that didn't build it check the
claims"* — except the artifact being checked was the notebook itself.

**A fourth instance, and it is the most instructive, because it happened INSIDE the pass that wrote this
principle.** Promoting those rows, I wrote "9 `decisions.md` rows" in the scratchpad's promotion note and in
the commit message. The real number was 10. The arithmetic was: 10 scratchpad rows, the tour's two collapse
into one, therefore 9 — and then, while actually writing the table, I split one lesson into its own row on
purpose and never re-derived the total. **10 − 1 + 1 = 10.** The plan said 9; the artifact said 10; I reported
the plan. Caught by running `grep -c` over the table rather than re-reading my own sentence.

That sharpens the rule: the danger is not laziness about counting, it is that **a count computed BEFORE the
work is a forecast, and it keeps its authority after the work diverges from it.** Every earlier instance has
this shape too — "two of three gates" was true of the plan for the gate list, "all 10 logged" was true of one
grouping, "these four are open" was true when written.

**How to apply:** before writing a count, an "all", an "every", or a "nothing left" into any record, run the
command that proves it — **and run it against the finished artifact, not against your intent for it.** If a
number was decided before the work, treat it as void the moment the work changes. And treat every
carry-forward marker as re-checkable state: at each audit, verify each open question against what the designer
has since actually said, not against what the marker said when written. *Where else this applies:* a "known gaps" list in a style guide; a TODO block in a CLAUDE.md; a
"deferred" note in a decisions row; any freshness header. *What would stop it firing:* checking whether the
individual items are accurate rather than whether the SET is still the set — every item in that open-questions
section was accurately described; all four had simply been answered.

*(New entries accumulate at audit passes.)*
