# blueAI — Scratchpad
Inline correction-resolution log. One line per correction the moment it's
resolved. Promoted to decisions.md / taste.md at audit passes, then wiped.

Format: `YYYY-MM-DD HH:mm — <file> — <what changed> — Why: <one phrase>`

> **KEEP THIS FILE CHEAP.** The format above is the whole spec, and QUALITY-GATES puts its cost at
> 5–10 seconds. It had drifted into ~65-line narrative entries and reached 530 lines / 47KB across 17
> un-promoted rows spanning two sessions — at which point it had become a second `decisions.md`, the
> audit pass that drains it became expensive, and so the audit stopped running. That is the actual
> loop: an expensive capture file is a capture file whose promotion gets deferred, which is how the
> best design reasoning in the notebook ended up living only in the file scheduled for deletion.
> If a row wants to be an essay, that essay belongs in the `decisions.md` row at the audit — write the
> one line here and the prose there.

--- Pending audit entries ---

2026-08-11 — blueai-desktop.css — `.bai-ui.wide .bai-subpane { top: 46px }` (was inheriting the base 84px) — Why: 84 is a SUM (46px header + 38px tab strip) and wide mode hides the strip, so every subpane opened 38px too low and left exactly a strip-height band of the parent pane uncovered — designer's screenshot showed Skills' search toolbar visible above an open "My Skills". `.bai-globalroute` already used 46px, so the right value was in the file; the subpane was the outlier.
2026-08-11 — blueai-desktop.css — `.bai-ui.wide .bai-tour { top: 46px }`, the same sibling bug as the subpane above, fixed but FLAGGED as not making the tour work in landscape — Why: `tourHi()` targets `.bai-tab` and the card's arrow reads `tab.offsetLeft`, both dead when the strip is `display:none`; the tour is compact-only by construction. **SUPERSEDED the same day — see the `display: none` row at the bottom; `top: 46px` is NOT in the code.** Kept because the supersession is the lesson (a correctly-positioned scrim over a highlight pointing nowhere is a half-fix that reads as done), but do not read this row as describing current CSS.
2026-08-11 — blueai-desktop.css — `.bai-preview-seg button` radius `--bai-r-sm`(6) → `--bai-r-xs`(4) — Why: rule 44 concentric (track is r-sm with 2px padding); caught by radius-nesting-audit only after routing Membership to the `.stretch` variant made these buttons `flex:1` and reach the track's corners for the first time — rule 46's mechanism exactly.
2026-08-11 — radius-nesting-audit.js — skip `.sg-spec`/`.sg-canvas` as containers (walk past to the next real ancestor) — Why: the guide's own doc cards aren't product containers; they produced 2 permanent false "mismatches" demanding a 1px radius on a sidebar row, and standing noise in a gate's output teaches you to skim it.
2026-08-11 — blueai-desktop.css — toolbar `.bai-help-inline` radius --bai-r-sm → --bai-r-md, scoped to the toolbar context — Why: designer approved; it's a 32px box beside a 32px `.bai-search` on r-md, and this rule's own premise is that the two are ONE toolbar — a shared height with an unshared corner reads as two controls that happen to match in size. Beside the Hybrid subtitle it stays 24px/r-sm.
2026-08-11 — blueai-desktop.css + ds-drift-check.js — `.bai-dialog-cancel` joins `.bai-set-btn` as a declared §12 SECONDARY-ACTION family (outlined); fill `--bai-pill` → `--bai-input-bg`; hover unified; filled-pill retired — Why: designer's ruling (Hybrid-popup treatment for popups, plain text for forms). Only the FILL differed — border/colour/weight/radius already matched, the classic silent-drift state. Also: the `--bai-pill` fill came from a 2026-08-04 "fix" for a light-theme invisibility bug that wasn't real — the button has a 1px border, so it's OUTLINED and the border defines it. Gate negative-tested (injected the drift, confirmed FAIL, reverted).
2026-08-11 — blueai-desktop.css — `.bai-dialog-body` colour `--bai-muted-2` → `--bai-text`, matching `.tgm-body` — Why: designer noticed two blocking overlays in the same tier reading at different text weights; also a further contrast improvement, so it satisfies the consistency ask and the earlier WCAG finding at once. Font size deliberately still differs (denser surface).
2026-08-11 — blueai-desktop.css — `.bai-subpane-body` side+bottom padding sp-12 → sp-14, closing the 15px/13px gutter split open since 2026-08-03 — Why: designer's call, "fix this match by 15px only". ⚠ Narrows every subpane form 264 → 260px; RE-MEASURED at 290px rather than assumed — 7 day chips single-row (217px of chips in a 238px grid, zero overflow, no clipping) and the 4-across seg single-row. project-insights updated; the 264px figure is now the FOURTH revision of that number.
2026-08-11 — DECISION, no code change — single-button ack keeps its full width; "committing action sits right" applies only when there ARE two buttons — Why: designer resolved the review's finding #5 as already-correct ("since there is no other button needed here the full width is the right approach"), and supplied the general rule: side-by-side-vs-stacked is decided by whether the labels FIT side by side at equal size, not by button count. Recorded so it can't be re-proposed as drift.
2026-08-11 — blueai-desktop.css — `.bai-ui.wide .bai-tour { display: none }`, REPLACING the `top: 46px` fix made an hour earlier — Why: designer confirmed onboarding only ever runs in portrait and offered leave-or-remove; removing is better because the tour is compact-only by construction (`tourHi()` targets `.bai-tab`, hidden in wide), so a correctly-positioned scrim over a highlight pointing at nothing is a half-fix that READS as handled. Portrait untouched (selector needs `.wide`, added only ≥600px).

*(Above are POST-CLOSE fixes, logged after Session 17's audit pass had already run — they belong to the next promotion, not to the one recorded below. The three post-close items are all one family worth naming at that promotion: **a hardcoded constant that is secretly a SUM of terms, one of which a different mode removes.** That is the same shape as `.bai-list-body`'s 2px (half a gap assuming a toolbar sibling) promoted this session, and as the one-theme-philosophy principle from S16 — strong candidate for consolidating all three into one reasonings entry rather than a third fresh instance.)*

*(Session 17's audit pass, 2026-08-11, promoted 31 entries — 17 rows into `decisions.md`, taste rules
48 and 49 (48 shipping with its own runtime gate, `icon-target-audit.js`), 6 `reasonings.md` principles, 3
`knowledge-base.md` traps (first touch since 2026-08-01), the notification-surface taxonomy + z-layer
inventory + the `#scaler` coordinate-space fact into `project-insights.md`, and `evolution.md`/`session-logs.md`
brought current with `designer_caught_count: 9` and a new top recurring category — "a property nobody measured
is a property nobody checked; if a design rule can be expressed as a number, it needs a gate, not a paragraph."
`style-guide.html` was synced inline on every edit throughout, per this project's inverted-Gate-5 contract, so
the audit had no style-guide backlog to sweep — two documentation gaps found during the audit's own review were
fixed then: the toast's prose was stale after the last two critique rounds, and the Preview panel's `-stacked`
row variant had never been specimen'd despite predating this session.)*

--- Designer's call — OPEN, carried forward (do NOT wipe without a decision) ---

These are unresolved questions, not pending promotions. Per the Session-15 rule, anything still undecided at an
audit goes to a permanent file rather than the next scratchpad — but these three are all narrow, live, and
attached to code touched this session, so they are held here with an explicit carry-forward marker instead.

1. **The single-button ack's width.** `.bai-dialog-actions button:only-child` is full-width — 202×32 = 2.08× the
   area of the confirm shape's own commit button (97×32), and it sits at a different x-position, so muscle
   memory built on "the committing button is on the right" is contradicted by the shape that follows it. The
   independent review proposed `flex: 0 1 auto; min-width: 97px; margin-left: auto` (same column, same right
   edge as the confirm). Not applied: it changes how the dialog LOOKS, which is the designer's call, and the
   full-width single CTA has real precedent in this same overlay tier (`.lg-cta`).
2. **Three Cancel treatments coexist.** Ghost `.bai-newitem-cancel` (4 call sites, the most used), filled pill
   `.bai-dialog-cancel` (the shared dialog), outlined `.bai-set-btn` (2 full-width modal Cancels). Worth being
   honest about the dialog's: its fill was NOT a deliberate hierarchy choice — it began as `--bai-input-bg`
   like `.bai-set-btn` and was changed to `--bai-pill` on 2026-08-04 to fix a light-theme bug where
   `--bai-input-bg` is `#ffffff`, identical to the card, making the button invisible. There IS a defensible
   reason for a confirm's Cancel to differ from an inline form's (in a confirm the two buttons are the only
   choices and the other one is red), but the third treatment — a full-width outlined Cancel in the AI-Mode
   modal doing the same job as `.bai-dialog-cancel` — is a genuine inconsistency. Convergence direction is the
   designer's.
3. **`.bai-help-inline` radius vs its toolbar twin.** It uses `--bai-r-sm` while `.bai-search`, same height and
   the same row, uses `--bai-r-md`. The CSS explicitly calls them "ONE toolbar"; matching the radius would
   strengthen that, but it's a visible change nobody asked for.

*(Also still open, from Session 15, living in `project-insights.md`'s layout-system section with its own
designer's-call flag: the `.bai-list-body` 14px vs `.bai-subpane-body` 12px gutter split. Raised 2026-08-03,
not decided. Session 17 touched the adjacent `#baiSchedList` padding-top but deliberately did not fold this
question into that fix — they are different questions.)*

--- Prior audit history ---

*(Session 16's audit pass, 2026-08-04, promoted 6 entries — 6 rows into `decisions.md`, taste rule
47, 2 `reasonings.md` principles + 2 existing ones widened with fresh instances, the boot-canvas fact into
`project-insights.md`, and `evolution.md`/`session-logs.md` brought current with `designer_caught_count: 5`
and a new top recurring category — "verify the blast radius, not just the stated property." `knowledge-
base.md` deliberately not touched that pass: the regression's mechanism already had a home in reasonings
and its facts in project-insights; a fourth telling would have been exactly the duplication the Session-15
audit flagged as unhealthy.)*

*(The Session-15 audit pass, 2026-08-03, promoted 17 entries — 8 rows into `decisions.md`, taste rule 46 +
rule 38's corrected fail-to-fire clause, 2 `reasonings.md` principles, 5 `knowledge-base.md` traps, the
`project-insights.md` layout-system section, and `evolution.md` brought current through S13–S15. Gate 6.5
was run on every rule promoted, not only on new work.)*
