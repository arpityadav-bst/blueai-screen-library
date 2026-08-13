'use client'

import type { Dispatch, SetStateAction } from 'react'
import ChoiceGroup from '../../controls/ChoiceGroup'
import CheckField from '../../controls/CheckField'
import { INPUT, LABEL } from '../../controls/fieldClasses'
import { FieldError, withErr } from '../../forms'
import { DESCRIBES, FULL_RUN, OPERATING_SYSTEMS, RAM, YES_NO, type Draft } from './spec'

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

export function StepOne(p: Props) {
  const { d, setD, err } = p
  const pick = choiceSetter(p)
  return (
    <>
      {/* The gate first, and phrased as the reader's own statement ("I'm 18 or older") rather than
          as an instruction to confirm something. It is the one question that can end the
          application, so it is not buried under the profile question. */}
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

      <div className="mt-6">
        <ChoiceGroup
          label="What best describes you?"
          name="apply-describes"
          value={d.describes}
          options={DESCRIBES}
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
        value={d.hasYouTube}
        options={YES_NO}
        onChange={(v) => {
          // Answering "No" clears whatever was typed, so a link can't be submitted alongside a
          // "No" — a stale value behind a changed answer is the kind of contradiction that reaches
          // the reviewer looking like real data.
          p.touch('hasYouTube')
          setD((prev) => ({ ...prev, hasYouTube: v, channel: v === 'Yes' ? prev.channel : '' }))
        }}
        err={err.hasYouTube}
      />

      {/* Rendered only when it applies. A disabled-but-visible field still reads as work left
          undone, and "paste your channel link" is unanswerable for someone who just said they
          don't have a channel. YouTube is the only live platform, so a "No" is not a rejection —
          the copy below says so rather than leaving the reader to guess. */}
      {hasChannel ? (
        <label className="mt-6 block">
          <span className={LABEL}>Paste your channel or handle link</span>
          <input
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
          <p className="mt-6 rounded-card border border-divider bg-white px-4 py-3 text-[13px] leading-relaxed text-ink-body-2">
            That&apos;s fine. YouTube is the only platform live today, so campaigns will be limited
            for now. Instagram, TikTok, X and Reddit are next.
          </p>
        )
      )}
    </>
  )
}

export function StepThree(p: Props) {
  const { d, err } = p
  const pick = choiceSetter(p)
  return (
    <>
      {/* Both hardware questions live together because they answer one thing: can this person
          actually run BlueAI. The RAM hint says why it is being asked, which is the difference
          between a reasonable question and a nosy one. */}
      <ChoiceGroup
        label="What operating system does your computer run?"
        name="apply-os"
        value={d.os}
        options={OPERATING_SYSTEMS}
        onChange={pick('os')}
        err={err.os}
      />

      <div className="mt-6">
        <ChoiceGroup
          label="How much RAM does it have?"
          hint="BlueAI runs on your own machine, so this tells us what it can handle."
          name="apply-ram"
          value={d.ram}
          options={RAM}
          onChange={pick('ram')}
          err={err.ram}
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
      <Long
        label="Why do you want to join?"
        value={d.why}
        onChange={(v) => setD((prev) => ({ ...prev, why: v }))}
        onBlur={() => p.touch('why')}
        placeholder="A couple of lines is plenty."
        err={err.why}
      />

      <div className="mt-6">
        <Long
          label="Have you earned money online before? What did you try and how did it go?"
          value={d.earnedBefore}
          onChange={(v) => setD((prev) => ({ ...prev, earnedBefore: v }))}
          onBlur={() => p.touch('earnedBefore')}
          // "Nothing yet" being an acceptable answer is said in the placeholder AND in the
          // validation message, because a reader who has never tried will otherwise read this as a
          // requirement they fail rather than as a question with a short answer.
          placeholder="Nothing yet is a perfectly good answer."
          err={err.earnedBefore}
        />
      </div>

      <div className="mt-6">
        <ChoiceGroup
          label="Are you okay with us reaching out to you for feedback if needed?"
          name="apply-feedback"
          value={d.feedbackOk}
          options={YES_NO}
          onChange={pick('feedbackOk')}
          err={err.feedbackOk}
        />
      </div>
    </>
  )
}

export function StepFive(p: Props) {
  const { d, setD, err } = p
  const pick = choiceSetter(p)
  return (
    <>
      <ChoiceGroup
        label="Do you have a PayPal account?"
        hint="Payouts go out via PayPal at the end of each month."
        name="apply-paypal"
        value={d.hasPaypal}
        options={YES_NO}
        onChange={pick('hasPaypal')}
        err={err.hasPaypal}
      />

      <div className="mt-6">
        <ChoiceGroup
          label="The program runs for about a month. Are you in for the full run?"
          name="apply-full-run"
          value={d.fullRun}
          options={FULL_RUN}
          onChange={pick('fullRun')}
          err={err.fullRun}
        />
      </div>

      {/* Pre-filled from the signed-in account and editable, because the question is which email
          the reader WANTS to be contacted on — which is not necessarily the one they signed in
          with. Pre-filling answers the common case without deciding it for them. */}
      <label className="mt-6 block">
        <span className={LABEL}>What email should we contact you on?</span>
        <input
          type="email"
          inputMode="email"
          value={d.email}
          onChange={(e) => setD((prev) => ({ ...prev, email: e.target.value }))}
          onBlur={() => p.touch('email')}
          placeholder="you@example.com"
          className={withErr(INPUT, err.email)}
        />
        <FieldError>{err.email}</FieldError>
      </label>

      <div className="mt-6">
        <CheckField
          checked={d.emailConsent}
          onChange={(v) => {
            p.touch('emailConsent')
            setD((prev) => ({ ...prev, emailConsent: v }))
          }}
          err={err.emailConsent}
        >
          I&apos;m okay with being contacted by email about the program.
        </CheckField>
      </div>
    </>
  )
}

// Shared long-text field. Four rows rather than three: both questions here invite two or three
// sentences, and a box that starts scrolling on the second line reads as smaller than the answer
// it's asking for.
function Long({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  err,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  onBlur: () => void
  placeholder: string
  err?: string
}) {
  return (
    <label className="block">
      <span className={LABEL}>{label}</span>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={withErr(`${INPUT} resize-none py-3 leading-relaxed`, err)}
      />
      <FieldError>{err}</FieldError>
    </label>
  )
}
