'use client'

import type { Dispatch, SetStateAction } from 'react'
import { useCrx } from '../CrxState'
import { ChoiceGroup, CheckField, INPUT, LABEL } from './controls'
import { FieldError, withErr } from './forms'
import type { Draft } from './spec'
import { DESCRIBES_OPTS, FULL_RUN_OPTS, HAS_YT_OPTS, PC_HOURS_OPTS, RUN_DAYS_OPTS, YES_NO_CHIPS } from './options'
import Long from './Long'
import StepIntro from './StepIntro'

// The four question steps — ported from creator-brand/creators/apply/Steps.tsx: every question,
// option set, hint and validation-visibility rule verbatim; only the skin moved to the .crx kit.
// Re-exported so ApplyForm keeps one `import { StepIntro, StepOne, … } from './Steps'`.
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

// ONE GAP VALUE BETWEEN DISTINCT QUESTIONS, EVERYWHERE IN THIS FILE — EXCEPT STEP 5 (designer,
// 2026-08-13, source file). Same distance for "this belongs together" and "this is a new question"
// is what makes two things look like one; crx-qgap (28px) is the one value, deliberately looser than
// any gap INSIDE a question. StepFour is the deliberate exception: it carries four groups against
// every other step's two or three, so its own gaps come down (crx-qgap-tight, 20px) plus the `tight`
// label gap on its two groups — a height concession bought on one screen. Don't copy the tight
// values into another step without the same pressure.

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

      <div className="crx-qgap">
        {/* CARDS, THREE-UP NOT ONE-PER-ROW (designer, 2026-08-13) — five options 2-up (mobile) / 3-up
            (desktop, ChoiceGroup's cols-3) so "Student" keeps the icon and the weight a "who you are"
            question deserves without costing a whole extra screen of height. */}
        {/* EVERY QUESTION SAYS WHY IT'S ASKED (Ashish, 2026-08-27 sync: "her question is a drop
            off point... it should be clear from your end why we need this information"). The
            PayPal group's hint was already this pattern; the three questions he flagged as
            unexplained (this one, YouTube, PC hours) now carry one each. One honest sentence,
            not legalese. */}
        <ChoiceGroup
          label="What best describes you?"
          hint="Helps us get to know applicants. It doesn't decide your application."
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
      {/* The hint ties this back to the intro's own claim ("campaigns... on your YouTube
          account"), so the question lands as a continuation rather than the cold "do you play
          cricket" swerve Ashish called out (2026-08-27 sync). */}
      <ChoiceGroup
        label="Do you have a YouTube account?"
        hint="The campaigns BlueAI completes run on your YouTube account."
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
        <label className="crx-ctl crx-qgap">
          {/* "(optional)" in the label, not just silently unvalidated (PM, 2026-08-14) — an unmarked
              field reads as required, so skipping it would still feel like leaving the form
              incomplete even though validate() no longer checks it. */}
          <span className={LABEL}>
            Paste your channel or handle link <span className="crx-label-opt">(optional)</span>
          </span>
          <input
            // iOS otherwise gives the default keyboard and autocapitalises this to "Youtube.com/@…",
            // and autocorrect mangles handles.
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
          <p className="crx-aside crx-qgap">
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
          form of "to earn money" — a question's worth of friction spent on zero signal. These two
          capacity questions are what a reviewer actually needs to predict the program's own
          requirement (20 days a month, step 1's terms): the first asks whether the PC can deliver,
          the second whether the person will. Chips, not text — four fixed ranges per question keep
          the effort below the paragraph they replaced and make applications comparable at review. */}
      <ChoiceGroup
        label="How many hours a day is your PC on and connected to the internet?"
        hint="BlueAI can only work while your PC is on and online."
        name="apply-pc-hours"
        value={d.pcHours}
        options={PC_HOURS_OPTS}
        onChange={pick('pcHours')}
        err={err.pcHours}
      />

      {/* The source's mt-4 sm:mt-7 mobile trims here were tuned against the light build's fixed
          480px card; this port keeps the plain question gap — re-tune at the gate if a fixed-height
          card contract lands on this page too. */}
      <div className="crx-qgap">
        <ChoiceGroup
          label="How many days a week could you run BlueAI?"
          name="apply-run-days"
          value={d.runDays}
          options={RUN_DAYS_OPTS}
          onChange={pick('runDays')}
          err={err.runDays}
        />
      </div>

      <div className="crx-qgap">
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
  // Version B bans the word "program" (2026-08-26) — the long-run question is the one label on
  // the question steps that says it. Found by the 2026-08-27 full-flow sweep; the first B pass
  // only swept the three landing screens and this string sat on a later step.
  const { variant } = useCrx()
  const longRunLabel =
    variant === 'original'
      ? 'Running BlueAI only takes a few minutes a day, but this is a long-term commitment. Are you in for the long run?'
      : 'Running BlueAI only takes a few minutes a day, but this is a long-term program. Are you in for the long run?'
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

      {/* THE STEP-5 GAP HIERARCHY (source file, Appy 2026-08-13/14 — kept because it is the step's
          design, not an accident): this step carries FOUR groups, so its gaps are deliberately
          UNEVEN. The PayPal → long-run gap below is the ONE Appy asked to keep its full weight
          (crx-qgap-tight = 20px, plus PayPal's own reserved hint slot ≈ 41px total), while the two
          gaps after it gave way (the email label sits nearly flush under the long-run group, and the
          consent line rides the email field's own reserved error slot). The `tight` prop on this
          step's two ChoiceGroups is the fourth gap in that budget — it halves each label→options
          gap. The step emphasises ONE break instead of spacing all three the same; do not "fix" this
          into a uniform rhythm without re-reading the source's budget arithmetic. */}
      <div className="crx-qgap-tight">
        {/* REWORDED 2026-08-14 (PM): "Jobs don't take much of your day" was the last user-facing
            "jobs" in the form — same cut as StepIntro's; "a few minutes a day" repeats the intro's
            own time claim rather than introducing a new noun. */}
        <ChoiceGroup
          label={longRunLabel}
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
      <label className="crx-ctl crx-qgap-min">
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

      {/* ONE CHECKBOX, NOT TWO (PM, 2026-08-13) — replaces both the old "okay to be contacted for
          feedback" question and the old "okay to be emailed about the program" checkbox. Program
          Terms is an underlined in-line mention, not a routed link — there is no Program Terms page
          in this design-only build yet, and an underline that goes nowhere is honest about that in a
          way a broken href would not be. `subtle` — boilerplate you tick on the way out, not a
          decision like the age gate (see CheckField). crx-qgap-min: the smallest gap on the step by
          design — this separates the last question from boilerplate, never its peer, and the email
          field's own reserved error slot sits between the two regardless. */}
      <div className="crx-qgap-min">
        <CheckField
          subtle
          checked={d.agree}
          onChange={(v) => {
            p.touch('agree')
            setD((prev) => ({ ...prev, agree: v }))
          }}
          err={err.agree}
        >
          <AgreeCopy />
        </CheckField>
      </div>
    </>
  )
}

// The closing agreement's copy reads the variant: Version B (2026-08-26) bans the word "program"
// everywhere, so its terms link says just "Terms" and the outreach clause names BlueAI instead of
// "the program". Version A keeps the original wording.
function AgreeCopy() {
  const { variant } = useCrx()
  if (variant === 'original') {
    return (
      <>
        By applying, I agree to the <u>Terms</u> and I&apos;m okay with BlueStacks reaching out to me
        about BlueAI.
      </>
    )
  }
  return (
    <>
      By applying, I agree to the <u>Program Terms</u> and I&apos;m okay with BlueStacks reaching out
      to me about the program.
    </>
  )
}
