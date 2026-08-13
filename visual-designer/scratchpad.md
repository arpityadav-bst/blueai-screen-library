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

*(EMPTY. The Session-18 audit pass, 2026-08-11, drained all 9 rows. Promoted to: **11 `decisions.md` rows**
under a "Session 18" heading (11 not 9 — three rows were split out because their lessons outlive the code:
the invented-`.info`-values correction, the structural-exclusion mechanism, and the three driven-only defects
grouped as one row. Count derived from `grep -c` on the finished table, not from the plan — see the
"a record that asserts a count" principle, which this pass exists partly because of); **taste rule 51** (a
control's shape is set by the shape of its DATA — a choice BETWEEN options is a seg, an independent boolean is
a checkbox, and two booleans are not a four-way choice); **1 new `reasonings.md` principle** (a preparatory
step that leaves an artifact behind feels like the work and stops being checked) plus **two existing entries
widened** — role-vs-family gained a THIRD shape where the false family was INTERACTION SHAPE and Gate 2 itself
pointed at the wrong component, and "before painting over something that looks empty" gained its MIRROR case
(removing an opaque layer something relied on to stay hidden); **1 new `knowledge-base.md` trap** (a throw
inside requestAnimationFrame surfaces nowhere in the UI) plus the `d || DEFAULT` trap widened to cover
declaration order, which is the same "cannot express its own absence" mechanism; and a new
**`project-insights.md`** section for the install state and the `.bs-*` boundary.

Gate 6.5 on every row. It produced one BOUNDARY: rule 51 vs rule 42 — 42 governs the COPY inside a choice
control, 51 governs which control to reach for, so 51 cross-references rather than restates. And one
deliberate NON-promotion: the switch-vs-checkbox distinction is recorded as a boundary clause inside rule 51
rather than its own rule, because both are semantically honest here and only the seg was wrong.)*

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

*(Nothing is carried forward from this section. **All four are now IN `decisions.md`** — promoted at the
Session-17 POST-CLOSE pass, verified by grep at the Session-18 pass rather than assumed. This line previously
read "live as pending rows above and promote at the next audit pass," which went stale the moment that
promotion ran: the rows it pointed at are gone and the promotion it predicted has happened. Caught by
checking, and worth leaving visible as a fourth instance of the same thing — a record that describes a FUTURE
step keeps asserting it after the step is taken.)*

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
