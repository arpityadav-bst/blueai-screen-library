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

## A divider is a THIRD signal, not a first one

See taste.md rule 38 for the codified visual rule — the reasoning behind it: before adding a literal
separator line, name what's ALREADY doing the "these are different things" work (a label's own
spacing, a card's own border, a color/weight change, an icon). A divider stacked on top of an
existing signal doesn't add clarity, it adds noise disguised as structure. This surfaced 3 times in
one session on the same screen family (blueai-desktop's AI Credits screen + its header popover) —
confirmed rule, not a one-off preference.

*(New entries accumulate at audit passes.)*
