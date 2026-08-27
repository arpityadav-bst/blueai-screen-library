'use client'

import { useCrx } from '../CrxState'
import { ChoiceGroup, CheckField, INPUT, LABEL } from './controls'
import { FieldError, withErr } from './forms'
import { FULL_RUN_OPTS, YES_NO_CHIPS } from './options'
import { choiceSetter, type Props } from './stepProps'

// THE LAST QUESTION STEP, moved out of Steps.tsx on 2026-08-27 for the 300-line rule: the Version B
// strings took that file to 318. This step is the natural cut - it is the only one carrying four
// groups (hence its own gap budget, documented inside), and it owns AgreeCopy, which nothing else
// uses. Steps.tsx re-exports it, so ApplyForm's single import is unchanged.

export function StepFour(p: Props) {
  const { d, setD, err } = p
  const pick = choiceSetter(p)
  // Versions B and C ban the word "program" (2026-08-26/27; only A keeps it) — the long-run
  // question is the one label on the question steps that says it. Found by the 2026-08-27
  // full-flow sweep; the first B pass only swept the three landing screens and this string sat
  // on a later step.
  // THE TEST IS `=== programs`, NOT `=== original`: with a third version the clean string is the
  // default and A is the exception, so a fourth variant inherits the clean copy instead of
  // silently inheriting A's noun.
  const { variant } = useCrx()
  const longRunLabel =
    variant === 'programs'
      ? 'Running BlueAI only takes a few minutes a day, but this is a long-term program. Are you in for the long run?'
      : 'Running BlueAI only takes a few minutes a day, but this is a long-term commitment. Are you in for the long run?'
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

// The closing agreement's copy reads the variant: Versions B and C (2026-08-26/27) ban the word
// "program", so their terms link says just "Terms" and the outreach clause names BlueAI instead
// of "the program". Only Version A keeps the original wording — same inversion as longRunLabel
// above, and for the same reason.
function AgreeCopy() {
  const { variant } = useCrx()
  if (variant === 'programs') {
    return (
      <>
        By applying, I agree to the <u>Program Terms</u> and I&apos;m okay with BlueStacks reaching
        out to me about the program.
      </>
    )
  }
  return (
    <>
      By applying, I agree to the <u>Terms</u> and I&apos;m okay with BlueStacks reaching out to me
      about BlueAI.
    </>
  )
}
