import { type Condition, type EnrolledProgram, type Program, programState, required } from '../programs/programData'

// ONE TILE, FOUR STATES (2026-08-25, Appy: "what happens when the user reaches the goal, and what
// happens when the program ends... we also need completed state"). Split out of EnrolledPrograms.tsx
// in the same pass: that file owns the SECTION (tabs, lists, the terms modal) and this one owns a
// row, which is also what keeps both under the 300-line rule.
//
// The state itself is never decided here — programState() in programData.ts owns it, because a
// render site that works out "is this done?" for itself is how two surfaces start disagreeing about
// the same enrollment. This file only decides what each state SAYS.
//
// TWO RULES DRIVE THE WHOLE FILE:
//
//   1. A FULL BAR IS A DEAD END. At 20 of 20 the bar has nothing left to report and the member is
//      left guessing whether to keep running BlueAI. So goal-met keeps the filled bar — it is the
//      proof, and removing it would throw away the one satisfying thing on the row — but adds the
//      line the bar cannot say: what it earned, and when the count starts again.
//   2. TERMINAL STATES STOP PRETENDING TO BE LIVE. An ended program renders no bar at all. A bar
//      says "this can still move"; on a closed window that is a lie, however accurate the number
//      inside it. Ended tiles show the outcome instead.
export default function ProgramTile({
  enrollment,
  onInfo,
}: {
  enrollment: EnrolledProgram
  onInfo: () => void
}) {
  const { program, progress } = enrollment
  const state = programState(enrollment)
  const past = state === 'ended-earned' || state === 'ended-missed'

  return (
    <article className={past ? 'crx-progtile past' : 'crx-progtile'}>
      <div className="crx-progtile-id">
        <span className="crx-progtile-name">{program.title}</span>
        {/* ENDED, not Ends — past tense on a closed window. The same label reading "Ends Feb 28"
            next to a program that finished in February is the smallest possible lie and the one a
            member would notice first. */}
        <span className="crx-progtile-ends">
          {past ? `Ended ${enrollment.endedLabel ?? program.endsLabel}` : `Ends ${program.endsLabel}`}
        </span>
      </div>

      <div className="crx-progtile-conds">
        {past ? (
          <Outcome enrollment={enrollment} earned={state === 'ended-earned'} />
        ) : (
          <>
            {program.conditions.map((c, i) => (
              <ConditionLine key={i} condition={c} done={progress[String(i)] ?? 0} program={program} />
            ))}
            {state === 'goal-met' && <GoalMet enrollment={enrollment} />}
          </>
        )}
      </div>

      {/* The info button survives every state: the terms of a finished program are exactly what
          someone checks when they want to know why it paid what it paid. */}
      <button type="button" className="crx-progtile-info" aria-label={`About ${program.title}`} onClick={onInfo}>
        <InfoIcon />
      </button>
    </article>
  )
}

// GOAL REACHED, WINDOW STILL OPEN — the state the tile had no answer for.
// It says two things because the member has two questions at that moment: did this count, and is
// there anything left to do. Monthly programs answer the second with the reset date; a fixed-reward
// program has no next window, so it answers with when the money arrives instead.
function GoalMet({ enrollment }: { enrollment: EnrolledProgram }) {
  const { program, resetsLabel } = enrollment
  const monthly = program.rewardModel.type === 'monthly'
  const amount = program.rewardModel.type === 'per-task' ? null : program.rewardModel.amount
  return (
    <p className="crx-progtile-met">
      <span className="crx-progtile-met-ic" aria-hidden="true">
        <TickIcon />
      </span>
      <span>
        <b>
          {amount !== null ? `$${amount} earned` : 'Earned'}
          {monthly ? ' this month' : ''}
        </b>
        {monthly
          ? resetsLabel
            ? ` · Counting starts again ${resetsLabel}`
            : ' · The count starts again next month'
          : ' · Paid when the program ends'}
      </span>
    </p>
  )
}

// ENDED — the record, not the task. Two variants, and the difference in TONE is deliberate:
// "earned" states an amount, "missed" states a fact. It does not say "you failed to" or push the
// member toward a program that no longer exists; the window closed, which is not a thing they can
// act on, and a dashboard that scolds you for last quarter is a dashboard you stop opening.
function Outcome({ enrollment, earned }: { enrollment: EnrolledProgram; earned: boolean }) {
  return (
    <p className={earned ? 'crx-progtile-out earned' : 'crx-progtile-out'}>
      {earned ? (
        <>
          <b>${enrollment.earned} earned</b> from this program
        </>
      ) : (
        <>Closed without a payout — the goal was not met before the window ended</>
      )}
    </p>
  )
}

// One line per condition: label + count over a mint bar. Same rules as everywhere: skillId stays
// internal vocabulary ("Run BlueAI" is the user-facing verb), and monthly programs name the window
// that counts.
function ConditionLine({ condition, done, program }: { condition: Condition; done: number; program: Program }) {
  const need = required(condition)
  const label =
    condition.type === 'complete-jobs'
      ? 'Verified jobs'
      : program.rewardModel.type === 'monthly'
        ? 'Run BlueAI this month'
        : 'Days run'
  const unit = condition.type === 'complete-jobs' ? (need === 1 ? 'job' : 'jobs') : 'days'
  const pct = Math.max(0, Math.min(100, (done / need) * 100))
  return (
    <div className="crx-cond">
      <div className="crx-cond-line">
        <span className="crx-cond-label">{label}</span>
        <span className="crx-cond-count">
          <b>{done}</b> of {need} {unit}
        </span>
      </div>
      <div className="crx-bar" role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={need} aria-label={label}>
        <span className="crx-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function TickIcon() {
  return (
    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 12.5l5 5L19.5 6.5" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  )
}
