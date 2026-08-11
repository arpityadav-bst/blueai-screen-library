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

2026-08-11 — NEW bs-install-dialog.js + index.html — Flow A: BlueStacks' own "Meet BlueAI" install dialog, ported byte-faithfully from blueai-product and EXCLUDED from the DS/style-guide/all gates — Why: designer's ruling; at that moment BlueAI isn't installed, so none of our DS exists on the machine and the software talking is BlueStacks. Ported vanilla (not the .jsx) because the two prototypes share no runtime — blueai-product is React+Babel+Tailwind CDN, blueai-desktop's contract is no build step, no deps.
2026-08-11 — bs-install-dialog.js — the dialog creates its own scrim/host and keeps EVERY style inline, incl. the host — Why: ds-drift-check §8 scans blueai-desktop.css AND index.html for raw font-size/border-radius px; the dialog legitimately has 8 of them at BlueStacks' values. Keeping them in a file §8 doesn't scan makes the exclusion structural (nothing to see) rather than an exemption list someone must remember. index.html gets one script tag.
2026-08-11 — icon-target-audit.js + radius-nesting-audit.js — skip `.bs-ui, #bsInstallHost, .bs-window` — Why: judging BlueStacks' 26×26 buttons against rule 48's floor, or its radius-0 card against rule 44, reports a conflict between two design systems as a defect in one. `.bs-*` is the boundary prefix: "not ours".
2026-08-11 — blueai-desktop.css — NEW `.bai-warnrow.info` + `.bai-donecard.working`, both colour-only MODIFIERS — Why: Flow B is BlueAI speaking in its own window, so it IS our design. Modifiers not new components because only the colour channel changes (rule 41). Info is blue not amber because nothing failed — the task just can't start until a dependency exists; amber would assert a problem with the request. `.working` because a green head reading "INSTALLING" claims completion.
2026-08-11 — blueai-desktop.css + index.html — EXTRACTED `.bai-progbar`/`.bai-progbar-fill` and migrated the Hybrid-download call site onto it — Why: Gate 3, threshold 2 — the recipe was inline in a JS template string and Flow B needed the same bar. Both call sites now share the class; only width stays inline, because it's data.
2026-08-11 — index.html — Flow B reuses `.bai-optg > .bai-opt-row` for "Get BlueStacks", NOT `.bai-sk-try` which I first reached for — Why: Gate 2 — opt-row is this app's established actionable-inside-a-message anatomy (renderUpload already uses the identical single-action shape); `.bai-sk-try` is the skill subpane's button and has never appeared in chat, so it would have invented a second in-chat action treatment.
2026-08-11 — index.html — `iconSvg(BAI_ICONS.plus, 12)` explicitly, replacing a `BAI_ICONS.download || BAI_ICONS.plus` fallback — Why: `download` doesn't exist in the set, so the `||` would have silently resolved to plus — a hidden default is the wrong-but-valid failure §9 exists for. plus is also the precedent (renderUpload puts a literal "+" in that slot).
2026-08-11 — style-guide.html — added `[data-icon-info]` hydration alongside `[data-icon-warn]` — Why: I used `data-icon-info` in the new specimen and only warn was hydrated, so the specimen would have shipped iconless; reusing data-icon-warn would have put the WRONG glyph in it.
2026-08-11 — index.html — install-state guard ported: turning the last flag off flips the other on — Why: "nothing installed" is a bare desktop with no way back — not a designed state. Three valid states, not four.
2026-08-11 — index.html — the checkbox row read BOTH flags as unchecked on load — Why: `var bsInstalled = true` sat ~117 lines BELOW `renderPreviewRows()`; var hoists the name, not the value, so both were `undefined` — falsy and indistinguishable from a deliberate `false`. Declaration moved above its first reader. Same family as the `d || DEFAULT` trap already in the KB: a value that can't express its own absence.
2026-08-11 — index.html — `bsInstallCard(app)` was missing its parameter and referenced `app` anyway — Why: threw ReferenceError INSIDE the rAF loop, so the card hit "Getting ready 100%" and silently stopped; the install looked finished and the scene payoff never ran. Nothing surfaced in the UI — only the console had it. Found by reading console errors rather than re-reading my own code.
2026-08-11 — index.html — wired BS_BOOT frame sequence + narration (bs-loading → bs-home → bs-play-youtube) — Why: I had COPIED the three PNGs and never referenced them; all three sat in assets/ with zero references while the install snapped the static player image back on. Designer caught it. Copying an asset feels like progress and an unused asset is indistinguishable from a used one until someone looks at the screen. Timing is ONE shared constant so chat narration can't announce a frame the window hasn't reached.
2026-08-11 — index.html — hiding the player exposed a blank unbooted drawer; applyInstallState now opens BlueAI whenever the player is absent — Why: `.drawer`'s closed state was never CSS-hidden, it was OCCLUDED by the opaque player 710px into the composition. Removing the cover exposed it. → reasonings.md "before painting over something that looks empty" now carries this as its MIRROR case (removing a layer something relied on to stay hidden). Also a dead end: the only opener is the player, so that state had no way out.
2026-08-11 — blueai-desktop.css/index.html — `.bai-warnrow.info` values CORRECTED to `--bai-accent-wash`/`--bai-accent-line` (were invented color-mix 20%/48%) — Why: designer asked where its DS came from; I'd copied the amber row's recipe and swapped the hue. Amber uses color-mix BECAUSE no amber token pair exists; the accent has had one all along. Measured: rendering at 2× the saturation of every other accent surface. Gate 0/Gate 1 fail — token existed, value invented anyway.
2026-08-11 — blueai-desktop.css/index.html/ds-drift-check.js — NEW `.bai-chat-cta` in a declared §12 FILLED-ACTION family with `.bai-newitem-create`; replaced `.bai-opt-row` — Why: designer — "doesn't even look like a button unless I hover". I'd matched the SHAPE (single action in a message) and ignored the ROLE: opt-row is a pick-one LIST ROW, white card at rest by design, accent only on hover. Filled not `.bai-sk-try`'s outline because it sits under an accent-washed note and would dissolve into it.
2026-08-11 — blueai-desktop.css/index.html — Preview install toggles: two `previewSegRow`s → one `previewCheckRow` — Why: designer asked for checkboxes in a single row, and the reason generalises — No/Yes is a segmented control, the shape for a choice BETWEEN options; installed-ness is a fact that's true or not, and there were two independent facts sharing one label. Gate 8.2: unchecked box keeps a visible edge, the recurring blind spot on this primitive.

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
