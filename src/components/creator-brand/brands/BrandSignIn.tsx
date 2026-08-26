'use client'

import { useState, type FormEvent } from 'react'
import { CBButton } from '../Button'
import { ModalHeader } from '../Modal'
import { INPUT, LABEL } from '../controls/fieldClasses'
import { FieldError, isEmail, withErr } from '../forms'

// The sign-in gate in front of the campaign dialog. Campaigns live on a brand account: the
// report page, the invoice and the review outcome all need somewhere to belong, so the dialog
// asks who you are before it asks what to promote.
//
// Design-only, like every form on this site: a valid email (or the Google button) "signs in"
// for the rest of the visit. ModalHost holds that flag and swaps this panel for the campaign
// form in place, one dialog, no second popup.

export default function BrandSignIn({ onSignedIn }: { onSignedIn: (email?: string) => void }) {
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)

  const err = !email.trim()
    ? 'Enter your work email.'
    : !isEmail(email)
      ? "That doesn't look like an email address."
      : undefined
  const visible = touched ? err : undefined

  function submit(e: FormEvent) {
    e.preventDefault()
    // Same rule as every CTA here: never disabled, clicking with a bad field shows the error.
    if (err) {
      setTouched(true)
      return
    }
    onSignedIn(email.trim())
  }

  return (
    <>
      <ModalHeader
        title={<h2 className="font-head text-[20px] font-bold text-ink-display">Sign in to continue</h2>}
        sub="Campaigns belong to your agency account: its reports, its invoices, its review status."
      />

      <form onSubmit={submit} className="px-6 py-6 sm:px-8" noValidate>
        <label className="block">
          <span className={LABEL}>Work email</span>
          <input
            type="email"
            inputMode="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            /* Blur only counts once something was typed: the dialog's focus trap re-focuses the
               panel right after autoFocus lands here, and an untouched form must not open with
               "Enter your work email." already showing. Submit still forces every error. */
            onBlur={() => email && setTouched(true)}
            placeholder="you@youragency.com"
            className={withErr(INPUT, visible)}
          />
          <FieldError>{visible}</FieldError>
        </label>

        <CBButton type="submit" size="lg" className="mt-5 w-full">
          Continue with email
        </CBButton>

        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-divider" />
          <span className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">or</span>
          <span className="h-px flex-1 bg-divider" />
        </div>

        <CBButton type="button" variant="secondary" size="lg" className="w-full" onClick={() => onSignedIn()}>
          <span className="flex items-center justify-center gap-2.5">
            {/* The standard four-color G, inline so the page stays self-contained. */}
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.46a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.58-5.17 3.58-8.82z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.1A12 12 0 0 0 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.29A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.57.38-2.29v-3.1H1.27a12 12 0 0 0 0 10.78l4.01-3.1z" />
              <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.59 1.79l3.44-3.44A11.98 11.98 0 0 0 12 0 12 12 0 0 0 1.27 6.61l4.01 3.1C6.22 6.88 8.87 4.77 12 4.77z" />
            </svg>
            Continue with Google
          </span>
        </CBButton>

        <p className="mt-5 text-center text-[11px] leading-relaxed text-ink-muted">
          New here? Continuing creates your agency account and accepts the advertiser terms.
        </p>
      </form>
    </>
  )
}
