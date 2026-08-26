'use client'

import { useState } from 'react'
import Modal from '../flow/Modal'
import { useCrx } from '../flow/CrxState'
import ProgramTile from './ProgramTile'
import {
  MOCK_ENROLLMENTS,
  PAST_ENROLLMENTS,
  isPast,
  programState,
  type Condition,
  type EnrolledProgram,
  type Program,
} from '../programs/programData'

// The dashboard's programs band, quest-tile shape (2026-08-24, Abhisht, after the game-quest
// convention: each program its own rectangular box, multiple bars allowed inside). Rewards came
// OFF the tiles in the same review — the amounts were louder than the progress, and progress is
// what a routine visit reads. Program terms live one click away instead: an info glyph in the
// tile's right slot opens the kit modal with the full sheet (description, reward, conditions,
// end date). Still no "overall progress" number and no raw condition names anywhere.
export default function EnrolledPrograms({
  enrollments = [...MOCK_ENROLLMENTS, ...PAST_ENROLLMENTS],
}: {
  enrollments?: EnrolledProgram[]
}) {
  // THE ENROLLMENT, not the program (2026-08-25, Appy: "these inner info popups should also be in
  // sync and updated according to the programs"). The sheet held a Program, which is the same object
  // for everyone enrolled — so it could describe the terms and nothing about THIS member's outcome,
  // and it went on saying "every month you meet the goal" and "Ends Feb 28" about a program that
  // closed in February. State lives on the enrollment; the sheet needs it to speak in the right
  // tense, never mind report a result.
  const [infoFor, setInfoFor] = useState<EnrolledProgram | null>(null)
  const [tab, setTab] = useState<'active' | 'past'>('active')
  const { setNav } = useCrx()

  // ONE LIST IN, TWO LISTS DERIVED. The caller passes every enrollment and isPast() splits them, so
  // the tab counts and the tab contents cannot disagree — which they would the moment a caller was
  // trusted to hand over two pre-sorted arrays and one of them went stale.
  const all = enrollments
  const active = all.filter((e) => !isPast(e))
  const past = all.filter(isPast)
  const shown = tab === 'active' ? active : past

  return (
    <div>
      <div className="crx-sect-head">
        {/* Plural whenever the member has more than one program IN TOTAL, not more than one in the
            open tab: the heading names the section, and it would otherwise flip to singular just
            because you clicked Past. */}
        <h2 className="crx-panel-title">{all.length === 1 ? 'Your program' : 'Your programs'}</h2>

        {/* THE TABS CARRY THE COUNTS, which is what retires the old "N COMPLETED" eyebrow that used
            to sit in this slot — "Past 2" IS the completed count, and stating it twice in one row
            was the redundancy this dashboard has been shedding all day. It also fixes the hollow
            zero: a lone "0 COMPLETED" spent the head's only note on nothing having happened yet,
            where "Past 0" is a destination that happens to be empty.
            ALWAYS BOTH TABS, including at launch with nothing in Past (Appy, 2026-08-25). The
            alternative was showing the switch only once Past filled up — cheaper, and it is what
            the burger and the footer nav do here — but this teaches the model instead: a new
            partner learns on day one that programs end and accumulate, rather than meeting a
            control that appears out of nowhere months later. The cost is a real one and it is paid
            in the empty state below, so that copy has to do actual work. */}
        <div className="crx-progtabs" role="tablist" aria-label="Programs">
          {(['active', 'past'] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={tab === t ? 'crx-progtab on' : 'crx-progtab'}
            >
              {t === 'active' ? 'Active' : 'Past'}
              <span className="crx-progtab-n">{t === 'active' ? active.length : past.length}</span>
            </button>
          ))}
        </div>
      </div>

      {shown.length > 0 ? (
        <div className="crx-progtiles">
          {shown.map((e) => (
            <ProgramTile key={e.program.id} enrollment={e} onInfo={() => setInfoFor(e)} />
          ))}
        </div>
      ) : (
        /* THE PRICE OF ALWAYS-ON TABS, so it has to earn its place. It says what will appear here
           rather than that nothing has — "no past programs" tells a new partner only that they
           clicked a dead tab, where naming the future turns the empty tab into an explanation of how
           programs work. No illustration and no button: nothing is broken and there is nothing to
           do about it yet.
           IT KEEPS A CONTAINER (Appy, 2026-08-25: "empty state is coming without the container, is
           that intentional?"). It shipped as bare prose on the argument that a bordered box would
           give nothing the same visual weight as a program. The concern is real and the conclusion
           was wrong twice over: switching tabs made the panel structure disappear, which reads as a
           render glitch rather than as a state, and this page already had the right answer — the
           dashed ghost .crx-prog-soon uses on the programs home for "a fact about the future, not a
           thing to press". Same idea here, so the same treatment: dashed, no fill, quieter than a
           tile but still the same shape as the thing that will fill it.
           The active tab has no empty state on purpose — a member with no active programs is a
           different screen entirely (the programs home, with offers to apply to), and inventing a
           second empty state here would be inventing a state the flow never reaches. */
        <div className="crx-progempty">
          <p>
            {tab === 'past'
              ? 'Nothing here yet. Programs you finish will show up here, with what each one earned.'
              : 'You are not in a program right now.'}
          </p>
          {/* THE WAY BACK (Abhisht item 2, 2026-08-25). A member with nothing active is sitting on
              the one screen that can do nothing for them, so the empty state carries the exit rather
              than leaving them to discover it in the account menu.
              ACTIVE TAB ONLY: an empty Past is a statement about the future and has nowhere to send
              anyone. A quiet button, not the gradient — this is a way out of a dead end, not the
              page's headline action.
              "JOIN A NEW PROGRAM", not "See open programs" (Appy, 2026-08-25). The first names what
              the member gets to do; the second names what the next screen contains, which is a
              description of navigation rather than an offer. It also reads correctly for the member
              this state is really about — someone who has finished a program and is between them.
              A MEDIUM PRIMARY, not a quiet ghost (Appy, 2026-08-25). I argued the opposite an hour
              ago — "a way out of a dead end, not the page's headline action" — and that reasoning
              was about the page, not about this state. In an empty Active tab there IS nothing else
              competing: joining a program is the only thing a member can do from here, so it is the
              primary action OF THIS STATE and the hierarchy says so. Medium rather than full size
              because it sits inside a dashed ghost box, not under a hero. */}
          {tab === 'active' && (
            <button type="button" className="btn crx-progempty-cta" onClick={() => setNav('programs')}>
              Join a new program
            </button>
          )}
        </div>
      )}

      <Modal open={infoFor !== null} onClose={() => setInfoFor(null)} label={infoFor ? `About ${infoFor.program.title}` : 'About this program'}>
        {infoFor && <ProgramInfo enrollment={infoFor} onClose={() => setInfoFor(null)} />}
      </Modal>
    </div>
  )
}

// The program sheet — everything the tile deliberately doesn't say. One sentence-shaped line per
// fact under mono section labels; the reward sentence carries the cadence (monthly vs at-end),
// which is exactly the nuance the tile's old "$30/mo" glyph compressed away.
function ProgramInfo({ enrollment, onClose }: { enrollment: EnrolledProgram; onClose: () => void }) {
  const { program } = enrollment
  const state = programState(enrollment)
  const past = state === 'ended-earned' || state === 'ended-missed'
  // Monthly programs pay per qualifying period, so the count is arithmetic on what was actually
  // paid rather than a number the mock has to remember and keep consistent with `earned`.
  const months =
    program.rewardModel.type === 'monthly' && program.rewardModel.amount > 0
      ? Math.round((enrollment.earned ?? 0) / program.rewardModel.amount)
      : null
  return (
    <div className="crx crx-modal">
      <div className="crx-proginfo">
        {/* NO ops description here (Abhisht, 2026-08-24): it restates what "What counts" already
            breaks down — on the offer card the description is the pitch, but this sheet IS the
            terms, so the one-line version above the long version said everything twice. */}
        <h2 className="crx-proginfo-title">{program.title}</h2>

        <div className="crx-proginfo-sect">
          <span className="crx-proginfo-k">Reward</span>
          {/* PAST TENSE ON A CLOSED WINDOW. "every month you meet the goal" is a promise, and a
              promise about a program that ended in February is the kind of copy a member reads as
              the product not knowing what happened to them. Same terms, same figures — only the
              verb moves. */}
          <p className="crx-proginfo-v">
            {program.rewardModel.type === 'monthly' && (
              <>
                <b>${program.rewardModel.amount}</b> {past ? 'for every month the goal was met' : 'every month you meet the goal'}, paid via PayPal.
              </>
            )}
            {program.rewardModel.type === 'fixed' && (
              <>
                <b>${program.rewardModel.amount}</b> {past ? 'on completion' : 'when the program ends'}, paid via PayPal.
              </>
            )}
            {program.rewardModel.type === 'per-task' && <>A fixed amount per verified job, paid via PayPal.</>}
          </p>
        </div>

        <div className="crx-proginfo-sect">
          <span className="crx-proginfo-k">{past ? 'What counted' : 'What counts'}</span>
          {program.conditions.map((c, i) => (
            <p key={i} className="crx-proginfo-v">
              <ConditionSentence condition={c} program={program} />
            </p>
          ))}
        </div>

        <div className="crx-proginfo-sect">
          <span className="crx-proginfo-k">{past ? 'Ended' : 'Ends'}</span>
          <p className="crx-proginfo-v">
            <b>{past ? (enrollment.endedLabel ?? program.endsLabel) : program.endsLabel}</b>
          </p>
        </div>

        {/* RESULT — the section the sheet could not have had while it only knew the Program. It is
            the reason someone opens the terms of a FINISHED program: not to re-read the rules, but
            to check what those rules paid them. Stating the arithmetic ("2 qualifying months at
            $30") rather than just the total is what makes the figure checkable against the ledger
            in the earnings section above.
            Active programs get no such section: the tile is already showing live progress, and a
            "result" for something still running would be a total that is about to be wrong. */}
        {past && (
          <div className="crx-proginfo-sect">
            <span className="crx-proginfo-k">Result</span>
            <p className="crx-proginfo-v">
              {state === 'ended-earned' ? (
                <>
                  <b>${enrollment.earned}</b> earned
                  {months !== null && months > 0 && (
                    <> — {months} qualifying {months === 1 ? 'month' : 'months'} at ${program.rewardModel.type === 'monthly' ? program.rewardModel.amount : 0}</>
                  )}
                  .
                </>
              ) : (
                <>No payout. The goal was not met before the window closed.</>
              )}
            </p>
          </div>
        )}

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
