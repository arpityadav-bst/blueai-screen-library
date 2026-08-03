# VDA Self-Audit — Session 15 (2026-08-03)

**This artifact is mandated every 5 sessions by `agents/vda-core/agent.md`, and this is the first one that
has ever existed.** Sessions 5 and 10 were also due and were also never written. That is itself the audit's
first finding: a mandated artifact that has never once been produced was never going to be produced by the
same process that skipped it twice, so the cadence is now attached to the session-close procedure rather
than left to memory.

Ordered by `agent.md`'s own self-audit checklist.

---

## 1. Identity anchor — re-read

> *"Your purpose is to THINK LIKE A UX DESIGNER. Not a developer who follows checklists… If you follow every
> gate perfectly but ship something that looks wrong to a user, you failed."*

**Held this session, with one qualification.** The Scheduled rebuild's judgement calls were design calls:
declining four things the live product does because codified rules said otherwise, choosing a subpane over a
modal on precedent, compressing a seven-day cadence label because the full list out-weighs the task's own
name. Four defects were caught by my own eye before presenting (a solid-fill glyph beside stroke siblings, a
two-line reservation under one-line copy, a commitment action scrolling off, a footer hairline with dead air
beneath it) — all four are "does this look right to a user", not "does this pass".

The qualification: the single defect the *designer* caught was a container's width and redundancy — the most
purely visual property on the screen. I had measured everything inside the box and never looked at the box.
Gate 8 asks "is the spacing balanced?"; I read it as being about the gaps between things.

## 2. Freshness check — the mechanism had silently stopped

| File | Last updated (header) | Actually current? |
|---|---|---|
| `taste.md` | now 2026-08-03 | ✅ (+ rule 38 amendment, + rule 46) |
| `decisions.md` | now 2026-08-03 | ✅ (+8 rows) |
| `reasonings.md` | **said 2026-07-25, held six 2026-08-01 additions** | ✅ fixed, +2 principles |
| `project-insights.md` | **said 2026-07-25, held a 2026-08-01 correction** | ✅ fixed, + the layout-system section it never had |
| `knowledge-base.md` | 2026-08-01, nothing from S14 or S15 | ✅ fixed, +5 active-surface traps |
| `evolution.md` | 2026-08-01, **two sessions behind** | ✅ fixed, S13–S15 added |
| `session-logs.md` | 2026-08-01 | ✅ Session 15 added |
| `scratchpad.md` | 17 entries, 2 sessions unpromoted | ✅ promoted and wiped |

**Root cause, and it is mechanical.** `agent.md` requires a `Freshness check:` line at the top of every
session log and says *"if this line is missing from the session log, the check didn't happen."* Sessions 7–12
each have one. **Sessions 13 and 14 have none.** Nothing was watching, and two files rotted in exactly that
window. Worse: the check's first step is *"read the 'Last updated' date on each knowledge file"* — and two of
those dates were themselves wrong, so even a check that ran would have **passed on stale files**. Fixed at
both ends: the line is restored to Session 15's log, and the rule is now *bump the header on every touch*.

## 3. Contradictions found and resolved

1. **Raw px: "not a violation" vs. a CRAFT rule saying the opposite.** `knowledge-base.md` held *"Literal px
   for type/spacing in scoped marketing CSS is the project convention… not a violation"* while taste rule 40
   (declared surface-independent craft) says every size axis must be tokenised and rule 26 (a designer
   directive with no scope clause) says *"EVERYTHING is tokenised — even a space or padding."* Nothing on
   either side acknowledged the other. **Resolved as Gate 6.5 outcome #2** — a scope clause: the KB note is
   a frozen record of what the dormant marketing site already *is*, explicitly **not a precedent and not a
   defence for new work.**
2. **Two adjacent CSS comments describing the same element in opposite terms.** A comment block documenting
   `.bai-newitem` as shrink-to-fit-and-scroll-internally survived that rule's deletion, sitting directly
   above its replacement, which is grow-not-shrink and does not scroll. Marked historical, with the still-
   useful part (some ancestor must own the scrolling) preserved.
3. **A style-guide "What's left" entry contradicted by a specimen in the same file.** The new form specimen
   said *"previously named in 'What's left' as an undocumented family; documented 2026-08-03"* while the
   entry was still listed as an open gap — and the entry was additionally unactionable, since the class it
   named no longer exists. Cleared, with the retired text quoted.
4. **`.bai-seg`'s own role description**: *"Segmented control for 2–3 options"*, with a 4-across sentence and
   specimen appended below it. Corrected to 2–4.
5. **Rule 43 vs. rules 39/40** — *"a size used once on purpose is not scale drift"* against *"merge sub-1px
   pairs"* and *"tokenise every axis"*. Reconcilable (documented purpose vs. undocumented residue) but the
   reconciliation is stated nowhere, and 43 has no fail-to-fire clause, so it is quotable as a veto on any
   consolidation. **Left OPEN, deliberately** — see §7.

## 4. Stale content removed or corrected

- `project-insights.md`: *"Index (`/`): exactly 3 entries"* — falsified 2026-08-01 when the reorg found nine
  cards. An enumeration in prose goes stale the first time something is added.
- `project-insights.md`: its "Style guide architecture" section described the **dormant** marketing guide
  with nothing saying so; the active surface's guide is a different artifact entirely. Scope note added.
- `evolution.md`: *"rules 38-41 … are what Gate 8 reviews against"* while 42–45 were already live — the exact
  stale-enumeration defect `blueai/CLAUDE.md` diagnoses about itself. Replaced with a pointer to the file.
- `evolution.md` was still naming "recurring category #2" as the thing to watch, two sessions after
  `session-logs.md` had declared `fix-one-forget-the-siblings` the top category. A phase tracker two
  sessions behind hands the next session the wrong watch item.
- Six stale *code* comments and four stale style-guide claims, all falsified by this session's own changes
  and all found by an independent reaudit rather than by me — including two wrong measurements ("210px card
  row", "294px drawer"), a "reserves two lines" comment above a rule that reserves one, and a "no wrapper"
  claim about Skills that is false (it has an unclassed flex wrapper; what it lacks is card chrome).

## 5. Decisions archived

`decisions.md` is at ~124 rows, past `agent.md`'s 100-row pruning threshold. **Not pruned this pass, and that
is a deliberate deferral rather than an oversight:** pruning requires judging which rows have been absorbed
into `taste.md`/`knowledge-base.md`, and doing that in the same pass that just added 8 rows and rewrote four
files would mean deciding what to delete while the additions are unverified. Carried as the top item for
Session 16, when the additions have been read back at least once.

## 6. Drift assessment — design thinking vs. process thinking

**Verdict: DRIFTING on trajectory, not on absolute content — and the diagnosis is specific.
Capture is healthy; promotion is biased.**

An independent audit measured the ratio per file. `scratchpad.md` — the *temp* file — was the healthiest for
design content (~9–10 of 17 entries substantially design reasoning). What had been *promoted* on 2026-08-01
skewed hard the other way: of ten `decisions.md` rows, ~7.5 were process/tooling; `reasonings.md` had moved
from a recorded 6:5 process:design to roughly 8:4 — **the wrong direction, after being flagged.** Two rows
promoted that session (`114`, `115`) contain no sentence a designer would use; they describe checker
internals and belong in `ds-drift-check.js`'s own header.

So the failure is not that design judgment isn't being generated or written down. It is that **design
reasoning accumulated in the file scheduled for deletion while engineering reasoning got the permanent
homes** — and the bootstrap makes a future session read `decisions.md` and `reasonings.md`. Left alone, the
next session inherits a QA engineer's mind rather than a designer's.

This session's promotion was deliberately weighted to correct that: taste rule 46 and both new `reasonings.md`
principles are design/judgement rules, and the engineering findings went to `knowledge-base.md` and
`project-insights.md` instead of into the design files.

**Structural contributor, worth naming:** `blueai/CLAUDE.md`'s mandatory read list omits `reasonings.md`,
`knowledge-base.md`, `project-insights.md` and `evolution.md`, while `agents/vda-core/agent.md` says *"read
ALL — these ARE you for THIS project."* The four unread files are the four that rotted. Gate 6.5's
rule-conflict cross-check is also structurally unable to run, since it requires checking new rules against
`knowledge-base.md`, which is never loaded. **Fixed this session.**

## 7. Left open, deliberately

- **`decisions.md` pruning** (§5) — Session 16, once this pass's additions have been read back.
- **Rule 43's missing Q2/Q3 answers** and its scope clause against rules 39/40. It is the only rule ≥38 that
  would match nothing but its own origin story. Left open because writing a rule's boundary is a taste
  judgement about *which* one-offs are legitimate, and rule 43 exists to record two decisions the designer
  personally declined — so its boundary is the designer's to draw, not mine.
- **The 14px/12px list-vs-subpane gutter split.** Raised with the designer this session, not decided. Moved
  out of the scratchpad into `project-insights.md` so the wipe could not lose it.
- **Five duplicated narratives** (the fabrication saga told 5×, the switcher reflow ~7×, rule 41's biography
  telling its own origin twice inside one rule). Real, but compression is cosmetic next to the promotion
  backlog, and rewriting five files' prose in the same pass as substantive additions risks losing content
  that matters. Session 16.

## 8. Overall health

**DRIFTING → recovering.** Every mechanical gate is green and has been for three sessions; the gates
themselves grew four new sections this era, each born from a designer catch. The learning loop demonstrably
works at the level of *capture*. What had broken was the loop's second half — promotion — plus the two
mechanical habits that were supposed to catch that (the freshness line, this artifact). Both are repaired,
and both are repaired *structurally* (a bumped header on every touch; this file existing) rather than by
resolving to remember.

**Phase 2 HOLDS.** Session 15 is the first genuinely low-caught new build of this era
(`designer_caught_count: 1`), but the Phase-3 bar is ≥3 consecutive. One of three.
