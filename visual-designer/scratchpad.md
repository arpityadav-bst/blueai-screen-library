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

*(EMPTY. The Session-17 POST-CLOSE promotion pass, 2026-08-11, drained all 10 rows on the designer's request
for a second proper close. Promoted to: **10 `decisions.md` rows** under their own "Session 17 POST-CLOSE"
heading. **[COUNT CORRECTED — this said "9" when first written, and the pushed commit message still says 9.**
The arithmetic I did in my head was: 10 scratchpad rows, the tour's two collapse into one, therefore 9. I then
split the `--bai-pill`-fixed-a-defect-that-didn't-exist lesson into its own row *while writing the table* —
deliberately, because that lesson outlives the code — and never re-derived the total. So 10 − 1 + 1 = 10.
**This is the "a tidy number standing in for a checked one" failure, committed inside the very pass that
codified it as the top recurring category** — see `reasonings.md`'s "a record that asserts 'open', 'all', or a
count is a claim, and it expires." Found by running `grep -c` on the table instead of trusting the sentence.
The rule it proves: derive counts from the artifact, never from the plan you had for the artifact.]**
The tour's two rows DID collapse into one decision, since the second superseded the first and a decisions row
records the decision that stands, not the path to it; **taste rule 50** (an action row's layout
is decided by label FIT, not button count, and "committing action sits right" is an ORDER rule that cannot
apply to a lone action — this one overturned a well-argued independent-review finding, so it is recorded
against the review as well as the code); and **4 `reasonings.md` principles** — a constant that is secretly a
SUM breaks when one of its terms stops existing (a THREE-instance family: `.bai-list-body`'s 2px,
`.bai-subpane`/`.bai-tour`'s 84px, and S16's one-theme philosophy — consolidated into one entry rather than a
third fresh instance, exactly as this file's own note recommended); fixing an unreproduced defect introduces
one; a gate with standing false positives has already stopped being a gate; and a record asserting
"open"/"all"/a count is a claim that expires.

Gate 6.5 was run on every row. It produced one BOUNDARY that mattered: rule 50 versus rule 41 — both concern a
signal that only means something in contrast, so 50 cross-references 41 rather than restating it. It also
confirmed two rows needed NO new rule: `.bai-preview-seg`'s radius is rule 44 under rule 46's mechanism (a
nesting relationship whose correctness changed when a layout change made the buttons reach the track's
corners — the first time those two rules have interacted, noted on the decisions row instead of a new rule),
and the dialog-body colour is a plain consistency fix with no transferable principle beyond what rule 38's
family already covers.

`knowledge-base.md` deliberately not touched this pass: every mechanism promoted here has a home in
`reasonings.md`, and a fourth telling is the duplication the Session-15 audit already flagged as unhealthy.

Nothing is carried forward. The "Designer's call" section below is closed — all four of its questions were
decided 2026-08-11 and their decisions are now in `decisions.md`.)*

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
