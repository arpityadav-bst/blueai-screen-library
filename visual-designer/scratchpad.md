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

--- Designer's call — ALL FOUR RESOLVED 2026-08-11. Nothing open here. ---

> **This section previously read "OPEN, carried forward (do NOT wipe without a decision)" and listed four live
> questions. The designer decided every one of them on 2026-08-11 and this section was not updated** — so a
> future session would have read a do-not-wipe marker, believed four settled questions were still open, and
> re-raised them with the designer. **That is the most expensive shape of stale record in this notebook: it
> doesn't just mislead the reader, it spends the designer's time re-deciding what they already decided.**
> Found by checking when the designer asked whether anything was wrongly claimed — the THIRD stale-record catch
> of that one question, after the gates line and the "all 10 logged" claim. All three were prose summaries of
> my own bookkeeping; none were code. The code had gates and held up under every mechanical check. **The
> asymmetry is the lesson: this notebook's weak surface is not the product, it is the notebook.**

1. **Single-button ack width — RESOLVED: no change.** Designer: *"I like right aligned but since there is no
   other button needed here the full width is the right approach — but yes the major action can sit on the
   right side."* So the review's `min-width: 97px; margin-left: auto` proposal is DECLINED, and the confirm
   shape's existing Cancel-left/commit-right order is confirmed correct. Recorded so it cannot be re-flagged as
   drift. The designer also supplied a better general rule than the review had: **side-by-side vs stacked is
   decided by whether the labels FIT side by side at equal size, not by how many buttons there are.**
2. **Three Cancel treatments — RESOLVED and implemented.** Designer: *"use the hybrid AI popup one for popups
   and the plain text no border no fill grey one in forms."* `.bai-dialog-cancel` now joins `.bai-set-btn` as a
   declared §12 family (only the FILL had ever differed); forms keep `.bai-newitem-cancel`; the filled pill is
   retired. See the pending row above.
3. **`.bai-help-inline` radius — RESOLVED and implemented.** Designer: *"we should do that."* Now `--bai-r-md`,
   scoped to the toolbar context; the 24px instance beside the Hybrid subtitle keeps `--bai-r-sm`.
4. **The gutter split (open since 2026-08-03, Session 15) — RESOLVED and implemented.** Designer: *"we should
   fix this match by 15px only."* `.bai-subpane-body` now pays `sp-14`, so list and subpane content edges both
   sit at 15px. `project-insights.md`'s layout-system section has been rewritten accordingly, including the
   consequence: form width 264 → 260px, its fourth revision.

*(Nothing is carried forward from this section. The four decisions live as pending rows above and promote to
`decisions.md` at the next audit pass.)*

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
