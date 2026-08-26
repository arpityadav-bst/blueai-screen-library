'use client'

import { useState, type FormEvent } from 'react'
import { CBButton } from '../Button'
import { ModalHeader } from '../Modal'
import { INPUT, LABEL } from '../controls/fieldClasses'
import { FieldError, isEmail, withErr } from '../forms'
import type { BrandReg } from './BrandSession'

// THE STEP THAT WAS MISSING BETWEEN SIGN-IN AND THE DASHBOARD (Abhisht, 2026-08-26, after the call
// with Anmol). Signing in used to drop a brand straight onto the campaigns dashboard, which was the
// prototype quietly skipping the part where a brand is a thing BlueAI approves. It now goes
// sign in -> register -> in review, and the dashboard a new brand first sees is the review screen.
//
// WHY IT IS A SECOND DIALOG rather than three more fields on the sign-in form: they answer different
// questions and they are answered by different people at different times. Sign-in is "who are you",
// asked on every visit; this is "what is the brand", asked once and then reviewed by a human. Fusing
// them would also make the returning-brand path carry three fields it has already filled in.
//
// SAME FORM CONTRACT AS EVERY OTHER FORM ON THIS SITE, inherited deliberately rather than
// re-decided: the CTA is never disabled (clicking with a bad field shows the error instead of
// refusing), blur only counts once something has been typed so the dialog cannot open with an error
// already showing, and submit forces every error at once.
export default function BrandRegister({ onDone, email }: { onDone: (reg: BrandReg) => void; email: string | null }) {
  const [name, setName] = useState('')
  // Prefilled from the session when sign-in knew an address. It is still editable: the address you
  // sign in with and the address a brand wants review correspondence sent to are not always the
  // same, and silently binding them would be a decision made on the brand's behalf.
  const [work, setWork] = useState(email ?? '')
  const [site, setSite] = useState('')
  const [touched, setTouched] = useState(false)

  const errName = !name.trim() ? 'Add the agency name.' : undefined
  const errWork = !work.trim()
    ? 'Enter your work email.'
    : !isEmail(work)
      ? "That doesn't look like an email address."
      : undefined
  // NO VALIDATION ON THE WEBSITE FIELD, and that is the same call the campaign form's video URL
  // took on 2026-08-13: a design-only prototype should not hold a rule strict enough to reject
  // something a real person would type, for a field nothing here resolves. Optional and free-form.
  const vName = touched ? errName : undefined
  const vWork = touched ? errWork : undefined

  function submit(e: FormEvent) {
    e.preventDefault()
    if (errName || errWork) {
      setTouched(true)
      return
    }
    onDone({ name: name.trim(), email: work.trim(), site: site.trim() || undefined })
  }

  return (
    <>
      <ModalHeader
        title={<h2 className="font-head text-[20px] font-bold text-ink-display">Register your agency</h2>}
        sub="One quick step before you can create campaigns. We review every agency before approving it."
      />

      <form onSubmit={submit} className="px-6 py-6 sm:px-8" noValidate>
        <label className="block">
          <span className={LABEL}>Agency name</span>
          <input
            type="text"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => name && setTouched(true)}
            placeholder="Acme Games"
            className={withErr(INPUT, vName)}
          />
          <FieldError>{vName}</FieldError>
        </label>

        {/* NO mt-* HERE, and that is deliberate. FieldError above already reserves 6px + a 15px
            line under the previous input, so this label sits 21px below it with no margin at all -
            under the form's own 24px padding, which is the rule: spacing between fields never
            exceeds the spacing around them. Adding mt-5 back makes it 41px and the group falls
            apart into three floating rows. */}
        <label className="block">
          <span className={LABEL}>Work email</span>
          <input
            type="email"
            inputMode="email"
            value={work}
            onChange={(e) => setWork(e.target.value)}
            onBlur={() => work && setTouched(true)}
            placeholder="you@youragency.com"
            className={withErr(INPUT, vWork)}
          />
          <FieldError>{vWork}</FieldError>
        </label>

        <label className="block">
          {/* "(optional)" in the LABEL, not as placeholder text or a hint below. A reader deciding
              whether to stop and go find something needs that word before they read the field, not
              after — and a hint line under an optional field is one more line of 11px text in a
              dialog that is already three fields tall. */}
          <span className={LABEL}>
            Agency website <span className="font-normal text-ink-muted">(optional)</span>
          </span>
          <input
            type="text"
            inputMode="url"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            placeholder="https://youragency.com"
            className={INPUT}
          />
        </label>

        {/* size="lg" + w-full, the exact idiom BrandSignIn's own submit uses — the base class
            already centres, so justify-center would be a third opinion about the same thing. */}
        <CBButton type="submit" size="lg" className="mt-6 w-full">
          Continue
        </CBButton>
      </form>
    </>
  )
}
