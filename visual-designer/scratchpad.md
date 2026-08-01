# blueAI — Scratchpad
Inline correction-resolution log. One line per correction the moment it's
resolved. Promoted to decisions.md / taste.md at audit passes, then wiped.

Format: `YYYY-MM-DD HH:mm — <file> — <what changed> — Why: <one phrase>`

--- Pending audit entries ---
2026-08-01 (cont. 11) — blueai-desktop — designer, on the new Scheduled row: does this feel right?
spacing around New task? Real, but not where I first guessed. Measured before touching anything: the
gap BELOW the row (8px) already matched the card-to-card gap exactly, so that part was correct. What was
off was the row's OWN vertical padding: 11px top/bottom around a SINGLE line of content, vs the same
13px the real cards spend across THREE stacked lines -- a much higher padding-to-content ratio, so the
row read as a padded banner/field (38px tall) rather than a slim list row. Designer then clarified: the
TOP margin specifically. Fixed by tightening padding sp-11 -> sp-9, landing the row at 34px -- close to
this exact system's own established 32px control-row height (the Skills search+pill toolbar, stretched
to equal heights earlier this session) -- a number picked from precedent, not by eye. Verified: gap below
unchanged (still 8px, matching cards); full create/delete/empty flow still clean; drift PASS; runtime
clean; overflow clean. -- Why: "spacing feels off" is rarely one measurement -- diagnosing WHICH box
model property (margin below vs padding within) before touching CSS is what separates a correct fix from
a plausible-looking one; measuring first is what let the designer's later one-word clarification
("top margin") land on the right property instantly instead of triggering another guess-and-check round.


2026-08-01 (cont. 10) — blueai-desktop — designer applied the ground theory from cont. 9 to Scheduled:
‘+ New task’ as the FIRST ROW of the list, not a header row. Ground rule stated once, for real this
time: a control never earns a row to itself; if the row has no OTHER persistent content to share it
with (search, nav chrome), the CTA is not chrome — it’s content, and belongs in the list’s own visual
rhythm as its first item. Styled with the house “clear secondary action” treatment already established
by .bai-upload-row (accent-wash + accent-line — that component’s own comment already rejected a dashed
look for the identical reason), sharing .bai-sched-card’s radius. Named a new icon (`plus`) rather than
hand-drawing it in the specimen — caught immediately by §11 (zero hand-authored svg bodies), which is
exactly the gate that exists to catch this.

TWO REAL BUGS caught building this, both about node lifetime across re-renders — worth writing down at
mechanism level since they will recur the next time ANY element needs to be shared between two container
states: (1) a bare `container.innerHTML = ''` DESTROYS any child currently inside it, including a node
another function cares about — the first fix (detach the node first) missed that (2) a bare `removeChild`
with nowhere to put the node back ORPHANS it: a detached node with no live parent is invisible to
getElementById and nothing re-attaches it, so it is gone forever the instant nothing else references it.
The actual fix needed a permanent, ALWAYS-ATTACHED “parking” element (#baiSchedAddHome) that the button
moves to/from — an appendChild MOVE between two live parents, never a bare removeChild. Also found and
fixed a SECOND wipe site (showSchedShimmerThenRender, the first-visit shimmer) that bypassed the first
fix entirely — factored into one shared helper (schedParkAddRow) called at both wipe sites, so a third
future wipe site fails loudly instead of silently. Verified through the real flow: 2 demo tasks → row
visible as first child; delete both → row hidden, stub CTA shown; create via the empty CTA → row
returns; create via the row itself → second task added, row still first child. Drift PASS (§1/§3/§6/§9/
§11 all touched by this change and all green); runtime clean; overflow clean; OOC unaffected. — Why:
node-lifetime bugs across re-renders are the DOM equivalent of dangling pointers — the fix is never
“detach and remember to reattach later,” it’s “never let it be un-attached, ever”. → candidate reasonings
principle: a shared DOM node needs a permanent home it can always be moved back to, not a detach-and-
hope-something-reattaches-it pattern.


2026-08-01 (cont. 9) — blueai-desktop — designer: 'similarly, what about the Scheduled tab pill?'
Right again — Scheduled was the PRE-FIX My Skills shape: an empty state ('Nothing scheduled yet') with
no action in it, and the '+ New task' row floating above it regardless. Same swap applied: empty → the
header row HIDES (display:none on the whole row, not just the pill — an empty row would still spend the
space) and the stub carries a centred '+ New task' opening the same form subpane; filled → row returns.
renderScheduled runs on every add/delete, so the swap is free. Verified through the real flow: 2 demo
tasks → row visible; deleted both via Delete→confirm → row gone, centred CTA; created 'Test task' from
the CTA → row back, one card. Drift PASS; guide prose extended with the Scheduled parity in the same
edit. — Why: this is the third surface of the same pattern in one thread (Skills toolbar, My Skills
subpane, Scheduled tab) — and the second time the designer had to point at a sibling surface I should
have swept after fixing the first. The pattern is now structural on all three; the process failure
(fix-one-forget-the-siblings) has cost two extra review rounds today and belongs in the next audit as
its own lesson: A FIX TO A PATTERN IS NOT DONE UNTIL EVERY INSTANCE OF THE PATTERN IS VISITED.

2026-08-01 (cont. 8) — blueai-desktop — designer, third pass on the create affordance: 'when EMPTY it
should be a clear centred CTA in the empty state; when filled, the header row — and the compact pill
feels too thin.' Both applied. (1) EMPTY/FILLED SWAP: the empty state now carries its own centred
'+ New skill' under the explanation copy (the eye is already there; a header pill above an empty body
makes it travel), and the header slot stays EMPTY until the list exists — the two placements swap with
list state, never stack (rule 38: two create buttons at once is a duplicated signal). actionFn runs per
paint, so the swap tracks state with no extra wiring — create a skill from the empty CTA, pop back, and
the header pill is simply there. (2) .bai-list-add.compact DELETED same-day: I had shrunk the pill to
fit the head row — backwards; a control keeps its touch-target size and the ROW grows to fit it.
Verified through the real flow: empty → centred CTA, no header pill; created 'Test skill' via the form →
back on My Skills with the header '+ New' at standard size, stub gone, one card. Drift PASS. Guide prose
re-synced (it named .compact, one hour old and already stale — retired with its reason recorded). — Why:
empty states are the one screen where the primary action has no competition for attention — that is
where it converts; once content exists, the action retreats to chrome so content leads. The swap encodes
that hierarchy; stacking both would have re-created the redundancy rule 38 exists to kill.

2026-08-01 (cont. 7) — blueai-desktop — designer, two more: 'what about the pill HERE (My Skills)?
and don’t you find it odd one is taller than the other (search vs pill)?' Both real. (1) My Skills’
'+ New' was the SAME orphan-row defect as cont. 6, one screen deeper — a flex-end div in the body
giving the pill a row of its own, directly above an empty state. The subpane HEAD grew a right-aligned
action slot (openSubpane takes an optional actionFn; paintSubpane clears + fills #baiSubpaneAction each
paint, so every other subpane stays clean); the pill (.bai-list-add.compact, padding scaled to the head
row) now sits beside the 'My Skills' title. The invariant, stated once and now true on all three
surfaces: CREATE ANCHORS THE TOP-RIGHT OF THE FIRST ROW — it never buys a row of its own. (2) Heights:
search was 34px, pill 28px, in one row — mismatched control heights read as unrelated things. The
toolbar is now align-items:stretch; both measure exactly 32px. Verified: pill in head row beside title,
no orphan div in body, empty state intact, create form opens from the head pill, toolbar heights EQUAL,
drift PASS, runtime clean. — Why: cont. 6’s principle (a control row groups controls) had a second
instance one level down that I did not sweep for after fixing the first — the designer found it in
minutes. When a defect is found on one surface, grep for its SHAPE everywhere before calling it fixed;
that is the same lesson as the icon batches, in layout form.

2026-08-01 (cont. 6) — blueai-desktop — designer, on the freshly-moved pill: 'does this pill look right
here according to UX? is this the best place for it?' Honest answer: no — the consistency fix created an
ORPHAN: a lone pill paying for a whole row. Refined: where a screen has a search field, search + create
share ONE toolbar row (.bai-list-head.with-search — search flex:1, both search and its input min-width:0
so the flex child can actually shrink, the pill white-space:nowrap + flex-shrink:0 so it NEVER pays the
squeeze). Two regressions caught during the fix itself, both at 290px: the pill wrapped to two lines
(the switcher-reflow defect class — third sighting today) and then, with nowrap, it overflowed the row
because a flex child defaults to min-width:auto and refuses to shrink below content. Verified 447+290,
one row, no wrap, no overflow; guide specimen now shows BOTH variants (with-search and pill-only) with
the refinement reasoning; drift PASS. — Why: consistency ('one operation, one location') and grouping
('controls of the same list share its toolbar') are BOTH true — the first fix satisfied one and violated
the other; the pill's anchor (top-right corner) is the invariant, the row it sits in is not. → feeds
rule 42's family: a control row exists to group controls, not to give each control a row.

2026-08-01 (cont. 5) — blueai-desktop — designer raised THREE UX findings, all fixed:
(1) REDUNDANT TITLES: Skills/Jobs/Scheduled repeated the active tab's own name as a grey heading below
the tab bar (the shared #baiMainTitle simply echoes the mode name outside chat). Rule 38: the tab
already says where you are; the row was a pure repeat costing ~30px of a 593px drawer. The title row
now hides on non-chat tabs; chat keeps it (there it carries real state — conversation title + history
dropdown + new-chat).
(2) CTA CONSISTENCY: creating an item is the SAME operation on every list screen, but Skills docked a
full-width "Build a custom skill" bar at the bottom while Scheduled and the My Skills subpane used a
top-right pill. Unified on the pill: Skills now has "+ New skill" top-right (same id, same handler, same
row position as "+ New task"); the sticky bar and its CSS deleted. Reasoning recorded in the specimen:
docked full-width CTAs are reserved for a flow's single COMMITMENT action (login gate, OOC) — list
management gets the pill; the bar also permanently spent ~60px promoting a secondary action, and its
removal + the title-row removal together let the whole category list fit without scrolling.
(3) NESTED RADII — designer taught the rule verbatim: "containers within containers, the inner radius
should be smaller, otherwise the curves mismatch and don't feel parallel." Codified as TASTE RULE 44
(concentric: r_inner = r_outer − inset; applies only where curves MEET — inner elements deeper than the
outer radius are exempt, which keeps the rule from outlawing every card in a panel; 50% circles exempt).
Built a runtime sweep (radius-nesting-audit.js, committed beside the drift check) — it found exactly TWO
real product mismatches: the Settings dark/light seg (the designer's own example: inner pill 6px =
container 6px at 2px inset → r-xs 4px) and the skill-create method switcher (selected tab 8px =
container 8px at 3px inset → r-xs) — WHICH I REBUILT THIS MORNING and shipped with the mismatch anyway:
the rule wasn't written down, so nothing fired. Both fixed with existing tokens; sweep re-run clean
(remaining hits are out-of-zone false positives; the tool's filter tightened to the perceptual rule).
Verified: drift check PASS all 11; runtime clean everywhere; chat keeps its title row; the new pill
opens the create form; screenshots reviewed. — Why: (1)+(2) are rule 38 and the one-operation-one-
location principle wearing new clothes; (3) is a genuinely NEW taste rule taught by the designer, and
its first sweep caught a same-day regression in my own rebuild — the fastest rule-to-catch cycle this
notebook has recorded.

2026-08-01 (cont. 4) — src/app/page.tsx (Screen Library index at /) — designer: "should we also
reorganise and reevaluate this index page?" Yes — it was the last surface still asserting the pre-pivot
world, and it is the FRONT DOOR: the active surface sat sixth of nine, described as a "Standalone canvas
+ JS experiment"; the pinned Design-System card pointed at the DORMANT marketing style guide; the active
prototype's own style guide wasn't linked at all; nothing told a visitor which pages are current vs
parked. Reorganised: ACTIVE group on top (Terminal Modern with an honest product description + its
Design System as the gradient-tile card, linking /blueai-desktop/style-guide.html), DORMANT group below
at reduced opacity with the pivot date in its label, and the marketing DS moved into the dormant group
with copy saying exactly what it governs. Nothing deleted. Verified: tsc clean, renders on next dev,
the DS link returns 200, zero page errors. — Why: an index that misstates which work is current
misleads every reviewer who lands on it; grouping by status IS the information, and the status labels
carry the pivot date so the grouping is traceable to the directive rather than an opinion.
ALSO — a false claim of MINE caught by this task: this morning I wrote "/moneymaker never started" into
evolution.md and project-insights.md, from the S8 plan instead of from `ls src/app` — three built
variants exist (arrived in the other-machine sync). Corrected in evolution, project-insights and the
earlier scratchpad entry, with the mistake recorded rather than silently swapped. Same write-from-memory
failure the notebook keeps cataloguing, committed WHILE cataloguing it.

2026-08-01 (cont. 3) — FINAL health check, designer-ordered: reaudit everything, confirm full
tokenisation ("every single thing, no exceptions"), confirm VDA learns like a junior designer, codify
rules over trust. Three independent auditors (code soundness / doc staleness / notebook quality) + my
own axis inventory. What they found and what was done:

FULL-AXIS TOKENISATION — the axes rule 40 itself named as open: spacing (300 declarations), line-height
(42), font-weight (73), letter-spacing (25), z-layers (12), motion durations+curves, 5 product shadows,
2 scrims, the light placeholder, 3 titlebar hover/close colours. All 1:1, NO value merges (merges are
visible = designer's, per the ownership principle) → ~91 provisional value-named tokens. PROOF: 118,018
computed styles diffed against the pre-migration baseline — ZERO drift. One self-caught bug on the way:
the ease-curve substitution used a global split/join that ignored the demo-scene boundary and broke
.composition's transition (caught by the baseline diff, the harness doing exactly its job). The demo
scene is now MARKED out-of-DS-scope in the stylesheet (it mimics an OS, and sits outside token scope);
the guide gained an "Other scales" live-tallied section; consolidating these into role-named scales is
the NEXT DESIGNER TRANCHE, said explicitly everywhere rather than implied done.

SIX MORE WRONG/INVENTED SPECIMENS found by auditors, all fixed: titlebar min/max were INVENTED 24×24
glyphs (the real 10×10 winMinimize/winMaximize existed in the module, unconsumed); titlebar close and
BOTH tgm-close specimens used the wrong close glyph (§9's pooled aria-"Close" anchor waved them through
— five product sites share that label across three glyphs); the kebab was still hand-copied; onboarding
card labels were crossed against their icon+tint pairs; guide aria-labels said "Minimise/Maximise"
(product spells "Minimize/Maximize"). Fixed §9's own weakness: aria anchors now nearest-per-site, class
anchors no longer suppressed behind aria ones — the tightened check then immediately caught the second
tgm-close my first fix had missed. §9 verified now 47/47 over 68 renders (was 10/58 this morning).

NEW GATES (codified, both negative-tested to FAIL + exit 1): §10 hydration position (the migration-v1
empty-icon bug had been prevented only by a comment — "a comment is a hope; this is a gate") and §11
guide glyph provenance (zero hand-authored <svg> bodies in specimens — the structural fix for invented
glyphs; 7 hand-copies converted to data-icon on its first run). Plus: nameOf no longer pollutes
verdicts with unmapped tokens; the dead `anchored` set removed; upload row div→button (its focus() was
a silent no-op and the row was never keyboard-operable); the hydration loop hoisted to the top of the
IIFE (was ~760 lines deep, coupled to everything above it).

DOC STALENESS: 13 further stale claims fixed across CLAUDE.md, the guide's flags (four-stroke-weights,
kebab "isn't in the set", onboarding icons "deliberately not in module", preview "ignores the token
system", "All 46", the What's-left paragraph rewritten to FIVE honest categories incl. the genuinely
undocumented families: Profile, parsecard, chat bubbles, tgm pairing set), icons.js TWO→THREE, and a
correction marker in decisions.md's dated four-weights row. Plus ONE LIVE BUG only a browser could
show: tokenising the preview panel broke the guide's preview SPECIMEN (its canvas lacked bai-scope) —
radius 0, sizes 16px — fixed and verified rendering 12px/11px.

VDA NOTEBOOK QUALITY (the "is it learning like a junior designer" question): auditor's verdict —
best material is genuinely designer-apprentice quality, self-corrections real not performed, BUT three
systemic drifts: engineering minutiae displacing design judgment in decisions/reasonings, the newest
lessons skipped generalization while old rules got it, and project-insights (the FACTS file) was the
stalest file in the notebook. Fixed this pass: ownership principle + wrong-but-valid-icon principle
promoted to reasonings (now 11); taste rules 42 (choice-control copy pattern) + 43 (deliberate one-offs
— the two DECLINED tranche-3 reasons rescued from a code comment into the notebook); Q2/Q3 answers
added to rules 38-40 per the promotion rule; KB's do-not-tokenise entry rewritten (it taught the move
the same day's work proved wrong); project-insights re-pointed. STILL OPEN for next audit: compress
rule 41's biography; slim decisions rows 114-115 of checker internals; pick one canonical home for the
fabrication saga (told ~5×); watch reasonings' 6:5 process:design ratio (agent.md's own drift check
names this trajectory).

VERIFIED END-TO-END: drift check PASS all 11 sections; zero computed drift vs baseline; runtime clean
(5 surfaces × 2 themes + 5 overlays + 3 OOC modes, 0 empty icons, 0 errors); overflow clean 3 widths ×
2 themes; guide renders 134 svgs clean, Other-scales live, no unlisted-token flood. — Why (the pattern
across everything): every "exception", "can't", and hard-coded count found today was unfinished work or
an expired claim wearing a scope statement. The codified answer is gates that fail loud + live tallies
+ prose that points at the thing that measures instead of restating it.


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
   /moneymaker build as the next step. *[correction, same day: moneymaker WAS in fact built — three variants exist at src/app/moneymaker/, arrived in the other-machine sync; it is dormant, not absent. The first version of this line said it never started — written from the S8 plan instead of from ls.]*

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
