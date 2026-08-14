'use client'

import { useMemo, useState } from 'react'
import Modal, { ModalHeader } from '../../Modal'
import { TickIcon } from '../../controls/choiceIcons'
import { INPUT, LABEL } from '../../controls/fieldClasses'
import { FieldError, isEmail, withErr } from '../../forms'
import { MOCK_ACCOUNT } from '../ApplyState'

// Translated from the two reference screenshots into this site's own language — see the plan
// discussion for what was deliberately NOT carried over:
//   · the "Submit Feedback > Get Payout" breadcrumb (chrome from a flow this site doesn't have a
//     prior step to)
//   · the Amazon/gift-card/"choose from more" row (Appy: "only PayPal... we don't need to show any
//     other option right now") — one payout method shown, not a selector with everything else
//     greyed out, since a selector implying choices that don't exist yet is worse than one that's
//     honest about there being one
//   · the reference's own support address — real contact info for a different product; invented an
//     illustrative BlueAI one instead rather than publish someone else's real inbox into a mock
//
// WIDENED, size="xs" -> "md" (2026-08-14, direct feedback: "the width of the pop up is too narrow").
// A PayPal row, a full email field and two confirmations were fighting a 360px panel meant for
// SignInDialog's much shorter card.
//
// NEVER DISABLED-UNTIL-VALID, same as every other form on this site (forms.tsx's own note on this):
// Withdraw stays clickable and answers with a reason instead of just refusing silently.
export default function CashOutModal({
  open,
  balance,
  onClose,
  onWithdrawn,
}: {
  open: boolean
  balance: number
  onClose: () => void
  onWithdrawn: () => void
}) {
  const [email, setEmail] = useState(MOCK_ACCOUNT.email)
  const [confirmCorrect, setConfirmCorrect] = useState(false)
  const [confirmFinal, setConfirmFinal] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [forced, setForced] = useState(false)
  // null = the form; a string = the submitted request's id, i.e. "done". Reset on close so a second
  // cash-out later doesn't reopen straight to the last one's confirmation.
  const [requestId, setRequestId] = useState<string | null>(null)

  const errors = {
    email: !email.trim() ? 'Add the PayPal email to receive this into.' : !isEmail(email) ? 'That doesn’t look like an email. Check for a typo.' : undefined,
    confirmCorrect: !confirmCorrect ? 'Confirm the details above are correct.' : undefined,
    confirmFinal: !confirmFinal ? 'Confirm you understand this before withdrawing.' : undefined,
  }
  const visible = (key: keyof typeof errors) => (touched[key] || forced ? errors[key] : undefined)
  const touch = (key: string) => setTouched((p) => ({ ...p, [key]: true }))

  // Stable per OPEN, not per render — a real id generated on every keystroke would be a tell that
  // it's decorative. Regenerated each time the dialog opens fresh (requestId is null then).
  const previewId = useMemo(() => `BAI${Math.random().toString(36).slice(2, 10).toUpperCase()}`, [open])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (errors.email || errors.confirmCorrect || errors.confirmFinal) {
      setForced(true)
      return
    }
    setRequestId(previewId)
  }

  function handleClose() {
    onClose()
    if (requestId) onWithdrawn()
    // Reset for next time, after the callbacks above have read the current values.
    setRequestId(null)
    setForced(false)
    setTouched({})
  }

  return (
    <Modal open={open} onClose={handleClose} size="md" label="Cash out">
      {requestId ? (
        <div className="flex flex-col items-center px-8 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-circle bg-status-success-soft">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-status-success">
              <path d="M4.5 12.5l5 5L19.5 6.5" />
            </svg>
          </div>
          <h2 className="mt-5 font-head text-[20px] font-bold text-ink-display">Request submitted</h2>
          <p className="mt-3 max-w-[40ch] text-[14px] leading-relaxed text-ink-body-2">
            Your withdrawal request <span className="cb-tabular font-semibold text-ink-heading">{requestId}</span> of{' '}
            <span className="font-semibold text-ink-heading">${balance}</span> is received. Funds will transfer in
            7-10 business days, and you&apos;ll get an email notification.
          </p>
          <p className="mt-4 text-[12.5px] text-ink-muted">
            Reach out to us on{' '}
            <span className="font-medium text-[var(--cb-accent)]">creator-support@blueai.now.gg</span> for any
            queries.
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="mt-7 w-full max-w-[280px] rounded-pill border border-transparent bg-cta-gradient px-5 py-3 text-[14px] font-semibold text-white shadow-cta transition-all duration-base ease-out-bai hover:-translate-y-0.5 hover:shadow-cta-hover"
          >
            Close
          </button>
        </div>
      ) : (
        <>
          <ModalHeader
            title={
              <div className="flex w-full items-center justify-between">
                <h2 className="font-head text-[18px] font-bold text-ink-display">Cash out</h2>
                <span className="rounded-pill bg-surface px-3 py-1 text-[12.5px] font-semibold text-ink-body-2">
                  Balance <span className="cb-tabular text-ink-heading">${balance}</span>
                </span>
              </div>
            }
          />

          <form noValidate onSubmit={submit} className="px-7 py-6 sm:px-8">
            <span className={LABEL}>Choose your payout method</span>
            {/* ONE method, shown as the same "selected card" language ChoiceGroup's cards variant
                already uses elsewhere on this site, not a real ChoiceGroup — there's nothing else to
                choose between yet, so a working radio group would be answering a question nobody is
                being asked. */}
            <div
              className="mt-2 flex items-center gap-3 rounded-field border p-3.5"
              style={{ borderColor: 'rgba(var(--cb-accent-rgb),0.38)', background: 'rgba(var(--cb-accent-rgb),0.06)' }}
            >
              <span className="flex h-8 w-11 shrink-0 items-center justify-center rounded-[6px] bg-[#003087] text-[11px] font-bold italic text-white">
                Pay<span className="text-[#009cde]">Pal</span>
              </span>
              <span className="text-[14px] font-semibold text-ink-heading">PayPal</span>
              <span
                className="ml-auto flex h-[18px] w-[18px] items-center justify-center rounded-circle text-white"
                style={{ background: 'var(--cb-accent)' }}
              >
                <TickIcon size={11} />
              </span>
            </div>

            <label className="mt-5 block">
              <span className={LABEL}>PayPal email to receive ${balance}</span>
              <input
                type="text"
                inputMode="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => touch('email')}
                placeholder="you@example.com"
                className={withErr(INPUT, visible('email'))}
              />
              <FieldError>{visible('email')}</FieldError>
            </label>

            {/* MINIMAL ON PURPOSE (2026-08-14, direct feedback: "just a checkmark, a simple line in
                front of them") — deliberately NOT CheckField, even its `subtle` variant still carries
                a bit of box (padding, its own row). These two are the plainest control on this whole
                site: a 16px box and one line, no card, no background, no vertical padding to speak
                of. There's nowhere left to go quieter than this without losing the checkbox itself. */}
            <div className="mt-5 flex flex-col gap-3">
              <MiniCheck checked={confirmCorrect} onChange={(v) => { touch('confirmCorrect'); setConfirmCorrect(v) }} err={visible('confirmCorrect')}>
                I confirm all the details are correct.
              </MiniCheck>
              <MiniCheck checked={confirmFinal} onChange={(v) => { touch('confirmFinal'); setConfirmFinal(v) }} err={visible('confirmFinal')}>
                I understand my order is non-refundable.
              </MiniCheck>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-pill border border-transparent bg-cta-gradient px-5 py-3.5 text-[15px] font-semibold text-white shadow-cta transition-all duration-base ease-out-bai hover:-translate-y-0.5 hover:shadow-cta-hover"
            >
              Withdraw
            </button>
          </form>
        </>
      )}
    </Modal>
  )
}

function MiniCheck({
  checked,
  onChange,
  err,
  children,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  err?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-2.5 select-none">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
        <span
          style={checked ? { background: 'var(--cb-accent)', borderColor: 'var(--cb-accent)' } : undefined}
          className={`mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border text-white transition-colors duration-base ease-out-bai peer-focus-visible:ring-2 peer-focus-visible:ring-[rgba(var(--cb-accent-rgb),0.3)] peer-focus-visible:ring-offset-2 ${
            checked ? '' : err ? 'border-status-danger' : 'border-stroke-warm'
          }`}
        >
          {checked && <TickIcon size={9} />}
        </span>
        <span className="text-[13px] leading-snug text-ink-body-2">{children}</span>
      </label>
      <FieldError>{err}</FieldError>
    </div>
  )
}
