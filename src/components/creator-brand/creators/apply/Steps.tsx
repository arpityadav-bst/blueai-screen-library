'use client'

import type { Dispatch, SetStateAction } from 'react'
import ChoiceGroup from '../../controls/ChoiceGroup'
import CheckField from '../../controls/CheckField'
import { INPUT, LABEL } from '../../controls/fieldClasses'
import { FieldError, withErr } from '../../forms'
import type { Draft } from './spec'
import { DESCRIBES_OPTS, FULL_RUN_OPTS, HAS_YT_OPTS, PC_HOURS_OPTS, RUN_DAYS_OPTS, YES_NO_CHIPS } from './options'
import Long from './Long'
import StepIntro from './StepIntro'

// Re-exported so ApplyForm.tsx keeps its existing `import { StepIntro, StepOne, ... } from './Steps'`
// — StepIntro's own implementation moved to StepIntro.tsx (2026-08-13) to keep this file under the
// 300-line rule, same pattern as Long.tsx and options.tsx.
export { StepIntro }

type Props = {
  d: Draft
  setD: Dispatch<SetStateAction<Draft>>
  /** Only the errors that should currently be VISIBLE — the parent decides that, not the field. */
  err: Record<string, string | undefined>
  /** Marks a field touched, so its error can appear once the reader has left it. */
  touch: (k: string) => void
}

// A chip group answers on CLICK, so there is no blur to wait for — picking an option is both the
// answer and the departure. Touching on change is what lets a satisfied group stop showing its error
// the moment it's satisfied, instead of holding the red until the next Continue.
//
// Deliberately NOT named use* — it holds no state and calls no hook, and a `use` prefix would put it
// under the react-hooks lint rules it has no business being governed by.
function choiceSetter({ setD, touch }: Props) {
  return (k: keyof Draft) => (v: string) => {
    touch(k)
    setD((p) => ({ ...p, [k]: v }))
  }
}

// ONE GAP VALUE BETWEEN DISTINCT QUESTIONS, EVERYWHERE IN THIS FILE — EXCEPT STEP 4 (designer,
// 2026-08-13). Was a mix of mt-5 and mt-6 depending on which step you were looking at, with no reason
// for the difference — which is itself why step 5 read as a wall of text: an unrelated question
// started only 20px after the previous one's hint ended, the same distance as the hint sits from ITS
// OWN field (ChoiceGroup's internal mt-2/mt-2.5 gaps). Same distance for "this belongs together" and
// "this is a new question" is what makes two things look like one. mt-7 (28px) is that one value, on
// every wrapper that separates one question from the next — deliberately looser than any gap INSIDE a
// question, so the eye can tell the two kinds of space apart without reading the words.
//
// StepFour is the one deliberate exception (Appy, 2026-08-13): it carries four groups against every
// other step's two or three, which made it the one step whose own content ran past the shared
// min-height floor. Its own gaps were brought down to mt-5 (20px) specifically to buy that height
// back — still clearly looser than a gap INSIDE a question, just not as loose as the rest of the form.
// See StepFour's own comment for the reasoning; don't copy mt-5 into another step without the same
// height pressure that justified it here.

export function StepOne(p: Props) {
  const { d, setD, err } = p
  const pick = choiceSetter(p)
  return (
    <>
      {/* The gate first, and phrased as the reader's own statement ("I'm 18 or older") rather than as
          an instruction to confirm something. It is the one question that can end the application, so
          it is not buried under the profile question. */}
      <CheckField
        checked={d.adult}
        onChange={(v) => {
          p.touch('adult')
          setD((prev) => ({ ...prev, adult: v }))
        }}
        err={err.adult}
      >
        I&apos;m 18 or older.
      </CheckField>

      <div className="mt-7">
        {/* CARDS, THREE-UP NOT ONE-PER-ROW (designer, 2026-08-13) — five options arranged 2-up
            (mobile) / 3-up (desktop) rather than chips or a one-per-row stack, so "Student" keeps the
            icon and the weight a "who you are" question deserves without costing a whole extra screen
            of height. columns={3} is what drives 2-up on mobile via ChoiceGroup's own breakpoint table
            (not a new mechanism) — see the 'wide' fix in ChoiceGroup.tsx for the lone 5th card that
            falls out of that grid. */}
        <ChoiceGroup
          label="What best describes you?"
          name="apply-describes"
          variant="cards"
          columns={3}
          value={d.describes}
          options={DESCRIBES_OPTS}
          onChange={pick('describes')}
          err={err.describes}
        />
      </div>
    </>
  )
}

export function StepTwo(p: Props) {
  const { d, setD, err } = p
  const hasChannel = d.hasYouTube === 'Yes'
  return (
    <>
      <ChoiceGroup
        label="Do you have a YouTube account?"
        name="apply-has-youtube"
        variant="cards"
        value={d.hasYouTube}
        options={HAS_YT_OPTS}
        onChange={(v) => {
          // Answering "No" clears whatever was typed, so a link can't be submitted alongside a "No".
          // A stale value behind a changed answer is the kind of contradiction that reaches the
          // reviewer looking like real data.
          p.touch('hasYouTube')
          setD((prev) => ({ ...prev, hasYouTube: v, channel: v === 'Yes' ? prev.channel : '' }))
        }}
        err={err.hasYouTube}
      />

      {/* Rendered only when it applies. A disabled-but-visible field still reads as work left undone,
          and "paste your channel link" is unanswerable for someone who just said they don't have a
          channel. YouTube is the only live platform, so a "No" is not a rejection, and the copy below
          says so rather than leaving the reader to guess. */}
      {hasChannel ? (
        <label className="mt-7 block">
          {/* "(optional)" in the label, not just silently unvalidated (PM, 2026-08-14) — an
              unmarked field reads as required, so skipping it would still feel like leaving the
              form incomplete even though validate() no longer checks it. */}
          <span className={LABEL}>
            Paste your channel or handle link <span className="font-normal text-ink-muted">(optional)</span>
          </span>
          <input
            // iOS otherwise gives the default keyboard and autocapitalises this to "Youtube.com/@…",
            // and autocorrect mangles handles. The campaign form already solved it for its URL field.
            type="text"
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={d.channel}
            onChange={(e) => setD((prev) => ({ ...prev, channel: e.target.value }))}
            onBlur={() => p.touch('channel')}
            placeholder="youtube.com/@yourchannel"
            className={withErr(INPUT, err.channel)}
          />
          <FieldError>{err.channel}</FieldError>
        </label>
      ) : (
        d.hasYouTube === 'No' && (
          <p className="mt-7 rounded-field border border-divider bg-surface px-4 py-3.5 text-[13px] leading-relaxed text-ink-body-2">
            That&apos;s fine. YouTube is the only platform live today, so campaigns will be limited for
            now. Instagram, TikTok, X and Reddit are next.
          </p>
        )
      )}
    </>
  )
}

export function StepThree(p: Props) {
  const { d, setD, err } = p
  const pick = choiceSetter(p)
  return (
    <>
      {/* "Why do you want to join?" was CUT from this slot (PM, 2026-08-14). Every answer was some
          form of "to earn money", which gave a reviewer nothing to select on — a question's worth of
          friction spent on zero signal. These two capacity questions are what a reviewer actually
          needs to predict the program's own requirement (20 days a month, step 1's terms): the first
          asks whether the PC can deliver, the second whether the person will. Chips, not text —
          four fixed ranges per question keep the effort below the paragraph they replaced and make
          applications comparable side by side at review time. */}
      <ChoiceGroup
        label="How many hours a day is your PC on and connected to the internet?"
        name="apply-pc-hours"
        value={d.pcHours}
        options={PC_HOURS_OPTS}
        onChange={pick('pcHours')}
        err={err.pcHours}
      />

      {/* mt-4 BELOW sm ONLY (Appy, 2026-08-14) — this step is the one that exceeded the mobile card's
          fixed 480px (see ApplyForm's h-[480px] comment): at ~310px both chip groups wrap to two rows
          and the textarea keeps three lines, landing near 513px. These two gaps (24px back) plus the
          textarea's mobile cap (Long.tsx) are what bring it under 480. Desktop keeps mt-7 — that
          rhythm is signed off and this step never overflowed there. */}
      <div className="mt-4 sm:mt-7">
        <ChoiceGroup
          label="How many days a week could you run BlueAI?"
          name="apply-run-days"
          value={d.runDays}
          options={RUN_DAYS_OPTS}
          onChange={pick('runDays')}
          err={err.runDays}
        />
      </div>

      {/* mt-4 below sm for the same 480px budget as the gap above — desktop untouched. */}
      <div className="mt-4 sm:mt-7">
        <Long
          label="Have you earned money online before? What did you try and how did it go?"
          value={d.earnedBefore}
          onChange={(v) => setD((prev) => ({ ...prev, earnedBefore: v }))}
          onBlur={() => p.touch('earnedBefore')}
          // "Nothing yet" being an acceptable answer is said in the placeholder AND in the validation
          // message, because a reader who has never tried will otherwise read this as a requirement
          // they fail rather than as a question with a short answer.
          placeholder="Nothing yet is a perfectly good answer."
          err={err.earnedBefore}
        />
      </div>
    </>
  )
}

export function StepFour(p: Props) {
  const { d, setD, err } = p
  const pick = choiceSetter(p)
  return (
    <>
      <ChoiceGroup
        label="Do you have a PayPal account?"
        hint="Payouts go out via PayPal."
        name="apply-paypal"
        value={d.hasPaypal}
        options={YES_NO_CHIPS}
        onChange={pick('hasPaypal')}
        err={err.hasPaypal}
        tight
      />

      {/* OWN ROW, not the PayPal question's side-by-side partner — the framing sentence is too
          long for a half-width column without wrapping awkwardly and losing the "quick" read.
          REWORDED 2026-08-14 (PM): "Jobs don't take much of your day" was the last user-facing "jobs"
          in the form — same cut as StepIntro's, and the new framing ("a few minutes a day") repeats
          the intro's own time claim rather than introducing a new noun.
          STAYS mt-5 — this is the ONE gap on this step Appy asked to leave exactly as it was
          (2026-08-14), and everything else on the step was re-cut around that constraint.
          THE ARITHMETIC, because it is why the other two gaps are 4px and why ChoiceGroup grew a
          `tight` prop at all: step 5 runs ~30px past the 400px floor, and its three gaps held 48px
          between them (20+20+8). Holding this one at 20 leaves the other two needing to total -2px —
          i.e. zeroing both STILL lands ~2px over. The three step gaps alone cannot do it, so the
          remaining 12px is bought from a FOURTH gap instead: `tight` halves each group's label->
          options gap (10px -> 4px) on this step's two ChoiceGroups. Budget then reads 20+4+4 = 28
          against 30 available, which clears the floor with ~2px to spare — every step's box measures
          400px and all five cards match, with the button row untouched at mt-7.
          THE RESULT IS DELIBERATELY UNEVEN, which is the point: 41px between the first two questions
          (this gap plus PayPal's own 21px hint slot) and ~25px between the rest. Appy asked for the
          first boundary to keep its weight while the others gave — so the step now emphasises one
          break instead of spacing all three the same. Do not "fix" this into a uniform rhythm without
          re-reading the budget above; there is nothing left to pay for it with. */}
      <div className="mt-5">
        <ChoiceGroup
          label="Running BlueAI only takes a few minutes a day, but this is a long-term program. Are you in for the long run?"
          name="apply-full-run"
          value={d.fullRun}
          options={FULL_RUN_OPTS}
          onChange={pick('fullRun')}
          err={err.fullRun}
          tight
        />
      </div>

      {/* Pre-filled from the signed-in account and editable, because the question is which email the
          reader WANTS to be contacted on, which is not necessarily the one they signed in with.
          Pre-filling answers the common case without deciding it for them. */}
      <label className="mt-1 block">
        <span className={LABEL}>What email should we contact you on?</span>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={d.email}
          onChange={(e) => setD((prev) => ({ ...prev, email: e.target.value }))}
          onBlur={() => p.touch('email')}
          placeholder="you@example.com"
          className={withErr(INPUT, err.email)}
        />
        <FieldError>{err.email}</FieldError>
      </label>

      {/* ONE CHECKBOX, NOT TWO (PM, 2026-08-13) — this replaces both the old "okay to be contacted for
          feedback" question (step 3) and the old "okay to be emailed about the program" checkbox that
          used to sit right here. Program Terms is styled the same way SignInDialog treats "Terms of
          Use" / "Privacy Policy" elsewhere on this site — an underlined in-line mention, not a routed
          link — for the same reason: there is no Program Terms page in this design-only build yet, and
          an underline that goes nowhere is honest about that in a way a broken href would not be.
          subtle — this is boilerplate you tick on the way out, not a decision like the age gate; see
          CheckField's own comment on `subtle` for why it drops the bordered-card treatment.
          mt-1, one of the two gaps that gave so the PayPal -> long-run gap above could stay at mt-5 —
          see that group's comment for the full budget. This one has the least to lose from it: every
          other gap on the step separates one QUESTION from the next, while this separates the last
          question from boilerplate you tick on the way out, which was never its peer. The email
          field's own 21px reserved error slot sits between the two regardless, so the real distance
          here is ~25px, not 4px. */}
      <div className="mt-1">
        <CheckField
          subtle
          checked={d.agree}
          onChange={(v) => {
            p.touch('agree')
            setD((prev) => ({ ...prev, agree: v }))
          }}
          err={err.agree}
        >
          By applying, I agree to the <u>Program Terms</u> and I&apos;m okay with BlueStacks reaching
          out to me about the program.
        </CheckField>
      </div>
    </>
  )
}
