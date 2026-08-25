'use client'

import { useState } from 'react'
import Modal from '../flow/Modal'
import { MOCK_ENROLLMENTS, type Condition, type EnrolledProgram, type Program } from '../programs/programData'

// The dashboard's programs band, quest-tile shape (2026-08-24, Abhisht, after the game-quest
// convention: each program its own rectangular box, multiple bars allowed inside). Rewards came
// OFF the tiles in the same review — the amounts were louder than the progress, and progress is
// what a routine visit reads. Program terms live one click away instead: an info glyph in the
// tile's right slot opens the kit modal with the full sheet (description, reward, conditions,
// end date). Still no "overall progress" number and no raw condition names anywhere.
export default function EnrolledPrograms({ enrollments = MOCK_ENROLLMENTS }: { enrollments?: EnrolledProgram[] }) {
  const [infoFor, setInfoFor] = useState<Program | null>(null)

  return (
    <div>
      <div className="crx-progtiles-head">
        {/* Singular when there is one — the launch reality (2026-08-24 meeting) is exactly one
            program, and "Your programs · 1 ACTIVE" over a single tile reads as an inventory bug. */}
        <h2 className="crx-panel-title">{enrollments.length === 1 ? 'Your program' : 'Your programs'}</h2>
        {enrollments.length > 1 && <span className="crx-progtiles-count">{enrollments.length} active</span>}
      </div>
      <div className="crx-progtiles">
        {enrollments.map((e) => (
          <ProgramTile key={e.program.id} enrollment={e} onInfo={() => setInfoFor(e.program)} />
        ))}
      </div>

      <Modal open={infoFor !== null} onClose={() => setInfoFor(null)} label={infoFor ? `About ${infoFor.title}` : 'About this program'}>
        {infoFor && <ProgramInfo program={infoFor} onClose={() => setInfoFor(null)} />}
      </Modal>
    </div>
  )
}

function ProgramTile({ enrollment, onInfo }: { enrollment: EnrolledProgram; onInfo: () => void }) {
  const { program, progress } = enrollment
  return (
    <article className="crx-progtile">
      <div className="crx-progtile-id">
        <span className="crx-progtile-name">{program.title}</span>
        <span className="crx-progtile-ends">
          Ends {program.endsLabel}
        </span>
      </div>

      <div className="crx-progtile-conds">
        {program.conditions.map((c, i) => (
          <ConditionLine key={i} condition={c} done={progress[String(i)] ?? 0} program={program} />
        ))}
      </div>

      <button type="button" className="crx-progtile-info" aria-label={`About ${program.title}`} onClick={onInfo}>
        <InfoIcon />
      </button>
    </article>
  )
}

// The program sheet — everything the tile deliberately doesn't say. One sentence-shaped line per
// fact under mono section labels; the reward sentence carries the cadence (monthly vs at-end),
// which is exactly the nuance the tile's old "$30/mo" glyph compressed away.
function ProgramInfo({ program, onClose }: { program: Program; onClose: () => void }) {
  return (
    <div className="crx crx-modal">
      <div className="crx-proginfo">
        {/* NO ops description here (Abhisht, 2026-08-24): it restates what "What counts" already
            breaks down — on the offer card the description is the pitch, but this sheet IS the
            terms, so the one-line version above the long version said everything twice. */}
        <h2 className="crx-proginfo-title">{program.title}</h2>

        <div className="crx-proginfo-sect">
          <span className="crx-proginfo-k">Reward</span>
          <p className="crx-proginfo-v">
            {program.rewardModel.type === 'monthly' && (
              <>
                <b>${program.rewardModel.amount}</b> every month you meet the goal, paid via PayPal.
              </>
            )}
            {program.rewardModel.type === 'fixed' && (
              <>
                <b>${program.rewardModel.amount}</b> when the program ends, paid via PayPal.
              </>
            )}
            {program.rewardModel.type === 'per-task' && <>A fixed amount per verified job, paid via PayPal.</>}
          </p>
        </div>

        <div className="crx-proginfo-sect">
          <span className="crx-proginfo-k">What counts</span>
          {program.conditions.map((c, i) => (
            <p key={i} className="crx-proginfo-v">
              <ConditionSentence condition={c} program={program} />
            </p>
          ))}
        </div>

        <div className="crx-proginfo-sect">
          <span className="crx-proginfo-k">Ends</span>
          <p className="crx-proginfo-v">
            <b>{program.endsLabel}</b>
          </p>
        </div>

        <button type="button" className="crx-btn-quiet btn-block" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

function ConditionSentence({ condition, program }: { condition: Condition; program: Program }) {
  if (condition.type === 'complete-jobs') {
    return (
      <>
        Your AI completes <b>{condition.count} verified {condition.count === 1 ? 'job' : 'jobs'}</b> from brands on
        your YouTube account.
      </>
    )
  }
  return (
    <>
      Run BlueAI on at least <b>{condition.minDaysCompleted} {condition.minDaysCompleted === 1 ? 'day' : 'days'}</b>
      {program.rewardModel.type === 'monthly' ? ' each month.' : '.'}
    </>
  )
}

// One line per condition: label + count over a mint bar. Same rules as everywhere: skillId stays
// internal vocabulary ("Run BlueAI" is the user-facing verb), and monthly programs name the window
// that counts.
function ConditionLine({ condition, done, program }: { condition: Condition; done: number; program: Program }) {
  const required = condition.type === 'complete-jobs' ? condition.count : condition.minDaysCompleted
  const label =
    condition.type === 'complete-jobs'
      ? 'Verified jobs'
      : program.rewardModel.type === 'monthly'
        ? 'Run BlueAI this month'
        : 'Days run'
  const unit = condition.type === 'complete-jobs' ? (required === 1 ? 'job' : 'jobs') : 'days'
  const pct = Math.max(0, Math.min(100, (done / required) * 100))
  return (
    <div className="crx-cond">
      <div className="crx-cond-line">
        <span className="crx-cond-label">{label}</span>
        <span className="crx-cond-count">
          <b>{done}</b> of {required} {unit}
        </span>
      </div>
      <div className="crx-bar" role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={required} aria-label={label}>
        <span className="crx-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
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
