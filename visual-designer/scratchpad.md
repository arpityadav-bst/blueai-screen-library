# blueAI — Scratchpad
Inline correction-resolution log. One line per correction the moment it's
resolved. Promoted to decisions.md / taste.md at audit passes, then wiped.

Format: `YYYY-MM-DD HH:mm — <file> — <what changed> — Why: <one phrase>`

--- Pending audit entries ---
2026-08-01 (cont. 2) — blueai-desktop — designer, looking at the guide's live tally: 'Why are there Raw
values here?' All 8 amber rows (raw 6px ×3, 12px ×1, 9.5px ×1, 10.5px ×3) were the dev Preview panel —
exempted from tokenisation with the note 'position:fixed outside .drawer, tokens cannot resolve there;
do not re-apply'. That justification went STALE the day .bai-scope was created, and nobody re-derived
it — the exemption outlived its reason by a full session. Fixed: the panel wrapper now carries
bai-scope, all 8 literals tokenised (10.5→fs-sm is a 0.5px bump on a dev tool — the same half-step
merge the product got in tranche 1), the §8 exemption REMOVED (zero per-selector exemptions remain),
the stale do-not-re-apply note rewritten with its history, and the guide's 'Scale drift' known-gap
marked RESOLVED. §8 now reads 'zero raw px anywhere, longhands and the dev panel included'; the tally
shows no amber. Verified: preview panel still drives all 3 OOC modes; drift PASS. — Why: an exemption
is a claim with an expiry date, and nothing re-checks it — the amber rows in the guide were the ONLY
thing still telling the truth about it. The live tally surfacing what the gate excused is exactly the
guide working as designed. Confirms the pending principle above: an exemption list is a to-do list
wearing a scope statement.


2026-08-01 (cont.) — blueai-desktop — designer asked the three open gaps be CLOSED, not documented:
(1) The "26 unnamed glyphs" decomposed on inspection into 8 §6 false-positives (named splices,
iconSvg's own template, the credit-ring GAUGE — a data-viz component, not a glyph) and 18 real
anonymous glyphs. Named all 18 (chevronLeft/chevronDown/database/kebab/winMinimize/winMaximize/
winClose/gem/camera/droplet/envelope/listChecks/taskDone/frame/stopSquare + 2 re-encodings folded
into existing names: the onboarding calendar drawn as one path = module calendar's three <line>s,
the login-gate globe's M2 12h20 = module globe's equator <line>; + 2 anonymous static copies of the
catGames gift). Module 37 → 52; §6 now 52/52 consumed, 0 duplicated, 0 unnamed. Rendering proven
unchanged: 362-SVG before/after diff — the ONLY changed element is the calendar re-encoding, whose
line-vs-path geometry is stroke-identical. (2) The raw radius longhand (.bai-msg.user asymmetric
bubble corner, 4px) → var(--bai-r-xs); §8's regex now gates longhands too. (3) §9 coverage 10 → 33
of 58 by adding aria-label and specific-class anchors — with verdict logic split BY ANCHOR KIND
after the first version flagged two false positives: nearest-wins is right for labels (stops sibling
tabs validating each other) but wrong for classes, where one class legitimately carries several
icons (.bai-sk-pillbtn is Edit AND Delete) and the class token sits physically closer to the
PREVIOUS button's icon. Classes/aria use membership-within-element-span instead. Also fixed my own
checker's window-slice truncation (BAI_ICONS.thumbDown cut to "thum" = phantom mismatch). The
widened §9 then immediately caught SIX real wrong icons in specimens no check could previously see:
the chat-title and preview-collapse arrows (chevron→chevronDown — they point down in the product),
and the onboarding orbs/cards, whose whole composition was invented (clock/bolt/mail/calendar vs
the product's database/gift/camera/envelope, per-tint). Negative-tested both new anchor kinds
(deliberate wrong icon → FAIL, exit 1 → restored). The remaining 25 unanchored renders are almost
all the icon-set CATALOG, which is a catalog, not a usage claim — stated in §9's output. — Why:
"can't be checked" had been standing in for "didn't finish naming things"; once everything had a
name, the checkable surface tripled and the very first run at the new width found six real bugs.
→ candidate reasonings principle: an exemption list is a to-do list wearing a scope statement.

**All three threads were promoted at the 2026-08-01 pass:**

1. **The design-system thread** (2026-07-24 → 08-01) — promoted earlier that day: taste rules 38-41,
   4 decisions rows, 3 reasonings principles, 2 knowledge-base sections, Session 12.

2. **The tranches + switcher thread** (2026-08-01) — promoted this pass: taste rule 41 *widened* from
   text roles to component states, 5 decisions rows, 3 reasonings principles ("a measured number belongs
   only in the thing that measures it", "if a style is state-dependent, the state is a test dimension",
   "new verification tooling is wrong until diffed against something known-good"), Session 13, and the
   S9-S12 era written into evolution.md — which had been 4 weeks stale and still pointed at a
   /moneymaker build that never started.

3. **The parity-audit thread** (cont. 11-17) — its **method lessons** are now promoted, after being
   deferred across three sessions on the grounds that consolidating an in-progress audit risks recording
   it wrong. That reasoning held for its *findings* and still does. It did not hold for its *methods*,
   and deferring them had a measurable cost: the thread's single most-repeated lesson — a hand-written
   summary drifting from the generated data it summarises, hit three separate times — recurred a fourth
   time on 2026-08-01 in `blueai/CLAUDE.md`, in a different file, while the lesson sat unpromoted in
   this scratchpad. A lesson that is only written down where nobody reads it is not written down.

   > **The audit's FINDINGS remain open and are NOT closed by this promotion.** The state-machine
   > coverage matrix, the 220-instance manifest, and findings LB-01/02/05/06 (retained pending
   > re-confirmation) are all still in progress. Nothing here should be read as that work being done.

**Watch next session:** Gate 6.5 (Generalization Probe) did not run on rule 41, which is why a rule that
already covered a live bug never fired. Run 6.5 on every rule *promoted*, not only on new work.
