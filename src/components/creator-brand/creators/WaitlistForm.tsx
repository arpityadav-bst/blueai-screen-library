'use client'

import { useState } from 'react'
import { FieldError, isEmail, withErr } from '../forms'

// The email capture, shared by the closing SECTION and the waitlist DIALOG — the designer asked
// for "the same title, input field and CTA with same grid lines and colors in a popup", and two
// hand-written copies of one form is exactly how the popup and the section end up with different
// validation, different placeholder text, and eventually different copy.
//
// Dark-surface only (both consumers sit on bg-cta-band), which is why every state here is written
// against cb-field-dark and the error variant is the lightened .cb-field-error-dark — #EF4444 on
// the near-black band measures ~3.3:1, under the contrast an error message has to clear.
export default function WaitlistForm({ autoFocus = false }: { autoFocus?: boolean }) {
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [joined, setJoined] = useState(false)

  const error = !email.trim()
    ? 'Enter your email so we know where to send it.'
    : !isEmail(email)
      ? 'That email doesn’t look right — check for a typo.'
      : undefined
  const err = touched && error ? error : undefined

  if (joined) {
    // Was a single translucent pill with two lines of text in it, which read as a disabled button
    // rather than as a result. Now the shape of a confirmation: a mark, a statement, and the
    // address it will actually go to — the last of these is the only new information the state
    // has, and echoing it back is how a reader catches the typo they just made.
    return (
      <div className="mx-auto mt-8 max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-circle bg-white/10 ring-1 ring-white/20">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4.5 12.5l5 5L19.5 6.5" />
          </svg>
        </div>
        <p className="mt-5 font-head text-[20px] font-bold text-white">You&apos;re on the list.</p>
        <p className="mt-1.5 text-[14px] text-white/70">
          We&apos;ll email <span className="font-semibold text-white">{email.trim()}</span> the moment jobs open.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-8 max-w-md">
      {/* Single flush pill — input and button share one border, exactly like the hero's handle
          lookup: `flex items-stretch rounded-pill border` with left padding only, so the button's
          own pill sits against the shell's inner right edge. Was two separate controls with a gap
          between them, which read as a form NEXT TO a button rather than as one field you complete.
          On mobile it stacks and the shell drops to rounded-credits: a 128px pill radius around a
          ~110px-tall stacked box reads as a lozenge rather than a field. */}
      <form
        noValidate
        className={withErr(
          'cb-field-dark flex flex-col items-stretch gap-1.5 rounded-credits border bg-white/10 p-1.5 sm:flex-row sm:gap-0 sm:rounded-pill sm:p-0 sm:pl-5',
          err,
          true
        )}
        onSubmit={(e) => {
          e.preventDefault()
          // noValidate + this: the browser's own bubble is unstyled OS chrome on a dark band, and
          // it can't say "check for a typo". Same enabled-CTA-that-answers rule as the campaign
          // form — nothing here is disabled until valid.
          setTouched(true)
          if (!error) setJoined(true)
        }}
      >
        <input
          type="email"
          // data-autofocus, not the autoFocus prop: Modal.tsx reads this attribute to decide where
          // focus lands, and React never renders autoFocus as an attribute — it calls focus()
          // during commit, which the dialog's own focus effect then undid.
          {...(autoFocus ? { 'data-autofocus': true } : {})}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="Enter your email here"
          aria-label="Email address"
          // No placeholder: utility — cb-field-dark sets it, and a utility would outrank the
          // stylesheet rule.
          className="w-full bg-transparent px-4 py-3 text-[14px] text-white outline-none sm:px-0 sm:py-3.5 sm:pr-2"
        />
        <button
          type="submit"
          className="flex shrink-0 items-center justify-center rounded-pill bg-white px-6 py-3 text-[14px] font-semibold text-ink-display transition-transform duration-base ease-out-bai hover:-translate-y-0.5 active:scale-[0.98] sm:py-0"
        >
          Join waitlist
        </button>
      </form>
      {/* Centred rather than left-aligned under the field: the pill is centred in a centred
          column, and a left-hung error line under it reads as belonging to the column, not the
          field. */}
      <div className="text-center">
        <FieldError dark>{err}</FieldError>
      </div>
    </div>
  )
}
