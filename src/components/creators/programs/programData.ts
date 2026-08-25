// Mock program for the signed-in home — SHAPED EXACTLY LIKE THE REAL API's program object
// (POST /api/v1/program on the ai-worker service), so the design maps 1:1 onto what the backend
// already serves and integration is a fetch swap, not a remodel. Figures mirror the engg test
// program seeded on 2026-08-24 (program_1787558630_4319d6fd): $5 fixed, 2 verified jobs, cap 100.
// Illustrative data, same convention as dashboard/mockData.ts — nothing here is fetched.
//
// endsLabel IS A DISPLAY STRING, not a formatted endAt: the mock lives in a fixed illustrative
// present (repo-wide convention) and formatting an epoch through the viewer's locale/timezone
// would let the reader's clock contradict the design. The real site formats endAt server-side.

// 'monthly' is a PROPOSED extension, not in the API today: the cookbook's rewardModel knows only
// fixed (one payment at settlement) and per-task, but the launch program pays $30 per qualifying
// month (2026-08-24, Abhisht) — the backend needs a cadence concept, or ops needs to ship one
// program per month. Flagged for the dev conversation; the card renders it either way.
export type RewardModel =
  | { type: 'fixed'; amount: number; currency: 'USD' }
  | { type: 'monthly'; amount: number; currency: 'USD' }
  | { type: 'per-task' }

export type Condition =
  | { type: 'complete-jobs'; count: number }
  | { type: 'run-skill'; skillId: string; minDaysCompleted: number; viaPublicJobs?: boolean }

export type Program = {
  id: string
  title: string
  description: string
  rewardModel: RewardModel
  conditions: Condition[]
  cap?: { type: 'first-n' | 'fixed'; value: number }
  enrolledCount: number
  endAt: number
  endsLabel: string
  status: 'active' | 'closed'
}

export const STARTER_PROGRAM: Program = {
  id: 'program_1787558630_4319d6fd',
  // The card renders whatever ops writes in the API — the mock must not editorialize (2026-08-24,
  // Abhisht's correction). Reward switched to the launch model the same day: $30 per qualifying
  // month, 20 run-days per month (the PM's canonical figures from StepIntro/the dashboard mock).
  // The description is the PM's own requirement line, since the ops copy for the monthly program
  // doesn't exist yet.
  // "Partner", finishing the 2026-08-24 rebrand (Appy, 2026-08-25) — it was the last user-visible
  // "Creator" left on this surface once the header wordmark changed. Worth a flag: the note above
  // says this field is ops-owned and the mock must not editorialize it. This is not editorialising
  // — it is keeping a mock program's name consistent with what the product now calls the people in
  // it — but if ops has already named the real program, their string wins over this one.
  title: 'Partner Starter Program',
  description: 'Run BlueAI on at least 20 days each month to earn $30',
  rewardModel: { type: 'monthly', amount: 30, currency: 'USD' },
  conditions: [{ type: 'run-skill', skillId: 'moneymaker', minDaysCompleted: 20 }],
  cap: { type: 'first-n', value: 100 },
  enrolledCount: 63,
  endAt: 1788163429000,
  endsLabel: 'Aug 31, 2026',
  status: 'active',
}

/** Spots remaining under the cap, or null when the program is uncapped. */
export function spotsLeft(p: Program): { left: number; of: number } | null {
  if (!p.cap) return null
  return { left: Math.max(0, p.cap.value - p.enrolledCount), of: p.cap.value }
}

/* ---- enrolled state (the returning member's dashboard) ---- */

// A second program so the dashboard demonstrates the "one or more programs" case (Abhisht,
// 2026-08-24). Fixed-reward + complete-jobs — the other reward shape, so the two cards exercise
// both. "Spring Launch" reuses the campaign name already live in the brand side's report mock,
// same one-world convention mockData.ts follows.
export const SPRING_PROGRAM: Program = {
  id: 'program_1786900000_c7e2ab10',
  title: 'Spring Launch Program',
  description: 'Complete 2 verified jobs to earn $5',
  rewardModel: { type: 'fixed', amount: 5, currency: 'USD' },
  conditions: [{ type: 'complete-jobs', count: 2 }],
  cap: { type: 'first-n', value: 250 },
  enrolledCount: 214,
  endAt: 1790755200000,
  endsLabel: 'Sep 30, 2026',
  status: 'active',
}

// A third program with TWO conditions — the dashboard has to prove it scales past two programs
// (Abhisht, 2026-08-24: "if we have multiple programs then? more than 2?") and that a
// multi-condition program renders as stacked rows, the case the dev build's sentence-templating
// duplicates on.
export const WEEKEND_PROGRAM: Program = {
  id: 'program_1787200000_9f31da22',
  title: 'Weekend Boost Program',
  description: 'Complete 3 verified jobs and run BlueAI on 5 days to earn $10',
  rewardModel: { type: 'fixed', amount: 10, currency: 'USD' },
  conditions: [
    { type: 'complete-jobs', count: 3 },
    { type: 'run-skill', skillId: 'moneymaker', minDaysCompleted: 5 },
  ],
  cap: { type: 'first-n', value: 150 },
  enrolledCount: 98,
  endAt: 1789372800000,
  endsLabel: 'Sep 14, 2026',
  status: 'active',
}

export type EnrolledProgram = {
  program: Program
  /** Done-counts keyed by condition index — the API's own contract (conditions[0] reports as
      progress["0"]); the required figure lives on the condition itself. */
  progress: Record<string, number>
  /** Monthly programs only: when the counting window rolls over. A DISPLAY STRING, same convention
      as endsLabel — the mock lives in a fixed illustrative present and formatting an epoch through
      the reader's clock would let it contradict the design. */
  resetsLabel?: string
  /** What this program has actually paid this member. Drives 'ended-earned' vs 'ended-missed' —
      see programState, and note it is what PAID, not what was met: a monthly program can qualify in
      March and miss in August, and it still earned. */
  earned?: number
  /** Ended programs: when it closed. Display string, like endsLabel. */
  endedLabel?: string
}

/* ---- program state (2026-08-25, Appy: "what happens when the user reaches the goal, and what
   happens when the program ends") ----

   THOSE ARE TWO DIFFERENT EVENTS, and the tile modelled neither. The launch program runs on two
   clocks: the MONTH ("run BlueAI on at least 20 days each month" — the goal recurs, which is why
   the dashboard balance is 5 x $30 for five qualifying months) and the WINDOW (endAt, after which
   the program is over for good). Reaching the goal is not the program ending, and one state cannot
   answer both.

   DERIVED IN ONE PLACE ON PURPOSE. Every render site asking "is this done?" for itself is how two
   surfaces end up disagreeing about the same enrollment. */
export type ProgramState = 'in-progress' | 'goal-met' | 'ended-earned' | 'ended-missed'

/** What a condition asks for. Shared so the tile, the sheet and goalMet cannot drift on it. */
export function required(c: Condition): number {
  return c.type === 'complete-jobs' ? c.count : c.minDaysCompleted
}

/** EVERY condition met — a multi-condition program is not "met" on the strength of one of them. */
export function goalMet(e: EnrolledProgram): boolean {
  return e.program.conditions.every((c, i) => (e.progress[String(i)] ?? 0) >= required(c))
}

export function programState(e: EnrolledProgram): ProgramState {
  // status 'closed' is the API's own word for a program past its window.
  if (e.program.status !== 'closed') return goalMet(e) ? 'goal-met' : 'in-progress'
  // Ended: what matters is whether it PAID, not whether the final period was met. A monthly
  // program that qualified in March and missed in August still earned, and telling that member
  // "missed" because of the last window would be false.
  return (e.earned ?? 0) > 0 ? 'ended-earned' : 'ended-missed'
}

/** Active vs past, the two tabs' contents. One predicate, so the counts and the lists agree. */
export function isPast(e: EnrolledProgram): boolean {
  return e.program.status === 'closed'
}

// Mid-progress on purpose: an all-zeros dashboard (the dev build's screenshot state) shows none of
// the design, and the mock's job is showing the design. Every bar partial, no two alike.
//
// END DATES ARE PER-ENROLLMENT IN THE LAUNCH MODEL (dev note, 2026-08-24 meeting): a 30-day
// program ends 30 days after EACH user joins — join 1 Aug, end 30 Aug; join 2 Aug, end 31 Aug.
// The mock keeps endsLabel on the program for simplicity, but on a real user's screen that label
// is THEIR window's end, not a shared date — and the current API cannot express it (one endAt,
// one sweep per program), which is flagged for the backend conversation.
// ONE ENROLLMENT PER STATE (2026-08-25) — a mock whose every card is mid-progress demonstrates one
// quarter of the design. Starter stays the in-progress case; Spring is at 2 of 2 so the goal-met
// treatment is on screen; Weekend keeps the two-condition partial. The two past programs below give
// the Past tab something to hold.
export const MOCK_ENROLLMENTS: EnrolledProgram[] = [
  { program: STARTER_PROGRAM, progress: { '0': 12 }, resetsLabel: 'Sep 1', earned: 150 },
  { program: SPRING_PROGRAM, progress: { '0': 2 }, earned: 0 },
  { program: WEEKEND_PROGRAM, progress: { '0': 2, '1': 3 } },
]

// PAST PROGRAMS — the two terminal states. Both are 'closed', which is the API's own word for a
// program past its window; what separates them is whether the member was ever paid.
// Deliberately not new Program objects with invented names: these reuse the shapes already
// established above with a closed status, so the Past tab cannot claim a program the rest of the
// mock has never heard of.
export const PAST_ENROLLMENTS: EnrolledProgram[] = [
  {
    // Earned: qualified twice at $30 before the window closed.
    program: { ...STARTER_PROGRAM, id: 'program_1782000000_a1b2c3d4', title: 'Winter Starter Program', endsLabel: 'Feb 28, 2026', status: 'closed' },
    progress: { '0': 20 },
    earned: 60,
    endedLabel: 'Feb 28, 2026',
  },
  {
    // Missed: the window closed one job short. Stated as a fact, not a failure — see ProgramTile.
    program: { ...SPRING_PROGRAM, id: 'program_1781000000_9e8d7c6b', title: 'New Year Boost Program', endsLabel: 'Jan 31, 2026', status: 'closed' },
    progress: { '0': 1 },
    earned: 0,
    endedLabel: 'Jan 31, 2026',
  },
]

// The launch returning member (2026-08-24 meeting: going live with exactly one program) — the
// same dashboard, one enrollment in it.
export const SINGLE_ENROLLMENT: EnrolledProgram[] = [MOCK_ENROLLMENTS[0]]

// The multi-program open home (the 'multiPrograms' journey): the same three programs, seen from
// the other side of enrollment — several openings at once, which is the state the day ops
// activates a second program.
export const OPEN_PROGRAMS_MULTI: Program[] = [STARTER_PROGRAM, SPRING_PROGRAM, WEEKEND_PROGRAM]
export const OPEN_MULTI_ITEMS: ProgramItem[] = OPEN_PROGRAMS_MULTI.map((program) => ({ program, relation: 'open' as const }))

/* ---- per-user program relations (the mixed home states, 2026-08-24) ----
   A member's home is rarely homogeneous: they can be IN one program, WAITING on another, and
   still free to apply to a third — all on one screen. The relation is per (user, program). */

export type ProgramRelation = 'open' | 'applied' | 'enrolled'
export type ProgramItem = { program: Program; relation: ProgramRelation }

// Applied to the starter, review pending, while the other two stay open to apply to.
export const MIXED_APPLIED: ProgramItem[] = [
  { program: STARTER_PROGRAM, relation: 'applied' },
  { program: SPRING_PROGRAM, relation: 'open' },
  { program: WEEKEND_PROGRAM, relation: 'open' },
]

// Accepted into the starter (AI already working), the other two still open to apply to.
export const MIXED_ENROLLED: ProgramItem[] = [
  { program: STARTER_PROGRAM, relation: 'enrolled' },
  { program: SPRING_PROGRAM, relation: 'open' },
  { program: WEEKEND_PROGRAM, relation: 'open' },
]

// What the "Programs" menu row shows a fully-enrolled returning user (the dashboard persona):
// everything active, nothing left to apply to.
export const ALL_ENROLLED: ProgramItem[] = MOCK_ENROLLMENTS.map((e) => ({ program: e.program, relation: 'enrolled' as const }))
