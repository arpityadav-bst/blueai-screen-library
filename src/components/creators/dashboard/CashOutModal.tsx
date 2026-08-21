'use client'

import { useMemo, useState } from 'react'
import Modal from '../flow/Modal'
import { MOCK_ACCOUNT } from '../flow/CrxState'

// Ported from the frozen creator-brand tree (creator-brand/creators/dashboard/CashOutModal.tsx).
// Copy, validation logic and flow verbatim; skin swapped to the /creators kit. The panel is this
// file's own card (the Modal contract centers a slot, children bring the surface), using the kit's
// .crx-modal.wide — the size the kit reserved for exactly this dialog ("CashOutModal's size='md'").
// The card carries className="crx" too, per creators.css's own note, so the kit tokens resolve on a
// portaled overlay.
//
// Decisions carried over from the light original (translated from two reference screenshots):
//   · no "Submit Feedback > Get Payout" breadcrumb (chrome from a flow this site doesn't have a
//     prior step to)
//   · only PayPal shown ("we don't need to show any other option right now") — one payout method,
//     not a selector with everything else greyed out, since a selector implying choices that don't
//     exist yet is worse than one that's honest about there being one
//   · the support address is REAL as of 2026-08-21 (Appy) — support@bluestacks.ai, which replaced
//     the invented creator-support@blueai.now.gg placeholder. It is the one real-world detail on
//     this design-only surface, so do not "fix" it back to a blueai.now.gg address to match the
//     product's own domain: it is the address the company actually answers on.
//
// WIDENED in the original (2026-08-14, "the width of the pop up is too narrow") — hence .wide here.
//
// NEVER DISABLED-UNTIL-VALID, same as every form in the flow (forms.tsx's rule in the frozen tree):
// Withdraw stays clickable and answers with a reason instead of just refusing silently.

// Validators copied from the frozen tree's forms.tsx (isEmail) — copied, not imported.
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())

function TickIcon({ size = 11 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 12.5l5 5L19.5 6.5" />
    </svg>
  )
}

// PayPal's brand colours live as SVG fills, not CSS: the kit rightly has no PayPal tokens, and
// these two hexes (#003087 / #009cde) are the brand's own, quoted from the light original.
function PayPalBadge() {
  return (
    <svg width="44" height="32" viewBox="0 0 44 32" aria-hidden="true" className="crx-cash-pp">
      <rect width="44" height="32" rx="6" fill="#003087" />
      <text x="22" y="20.5" textAnchor="middle" fontSize="11" fontWeight="700" fontStyle="italic" fill="#ffffff">
        Pay<tspan fill="#009cde">Pal</tspan>
      </text>
    </svg>
  )
}

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // Reset for next time, after the callbacks above have read the current values. ALL form state,
    // not just the flow flags (verifier catch): a cancelled attempt must not reopen with the
    // confirmations still ticked — pre-agreed consent boxes are the one thing a form must never
    // remember on the user's behalf.
    setRequestId(null)
    setForced(false)
    setTouched({})
    setConfirmCorrect(false)
    setConfirmFinal(false)
    setEmail(MOCK_ACCOUNT.email)
  }

  return (
    <Modal open={open} onClose={handleClose} label="Cash out">
      <div className="crx crx-modal wide">
        {requestId ? (
          <div className="crx-cash-done">
            {/* Mint circle + tick — the kit's success/money language (.crx-stat-icon.money). */}
            <span className="crx-stat-icon money">
              <TickIcon size={22} />
            </span>
            <h2 className="crx-panel-title crx-cash-done-title">Request submitted</h2>
            <p className="crx-cash-copy">
              Your withdrawal request <b className="crx-cash-id">{requestId}</b> of{' '}
              <b>${balance}</b> is received. Funds will transfer in 7-10 business days, and
              you&apos;ll get an email notification.
            </p>
            <p className="crx-cash-support">
              Reach out to us on <b className="crx-cash-mail">support@bluestacks.ai</b> for any
              queries.
            </p>
            <button type="button" onClick={handleClose} className="btn btn-block crx-cash-close">
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="crx-cash-head">
              <h2 className="crx-panel-title">Cash out</h2>
              <span className="crx-cash-balance">
                Balance <b>${balance}</b>
              </span>
            </div>

            <form noValidate onSubmit={submit} className="crx-cash-body">
              <span className="crx-label">Choose your payout method</span>
              {/* ONE method, shown in the kit's "chosen" language (.crx-check.on: iris border +
                  wash), not a real radio group — there's nothing else to choose between yet, so a
                  working selector would be answering a question nobody is being asked. A static div
                  on purpose: it is a statement, not a control. */}
              <div className="crx-check on crx-cash-method">
                <PayPalBadge />
                <span className="crx-cash-method-name">PayPal</span>
                <span className="crx-cash-method-tick">
                  <TickIcon size={11} />
                </span>
              </div>

              <label className="crx-cash-field">
                <span className="crx-label">PayPal email to receive ${balance}</span>
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
                  className={visible('email') ? 'crx-field err' : 'crx-field'}
                />
                <FieldError>{visible('email')}</FieldError>
              </label>

              {/* MINIMAL ON PURPOSE (2026-08-14, "just a checkmark, a simple line in front of
                  them") — the kit's .crx-check.subtle exists for exactly this: no card, no
                  background, just the drawn box and one line. Plainest control in the whole flow. */}
              <div className="crx-cash-confirms">
                <MiniCheck checked={confirmCorrect} onChange={(v) => { touch('confirmCorrect'); setConfirmCorrect(v) }} err={visible('confirmCorrect')}>
                  I confirm all the details are correct.
                </MiniCheck>
                <MiniCheck checked={confirmFinal} onChange={(v) => { touch('confirmFinal'); setConfirmFinal(v) }} err={visible('confirmFinal')}>
                  I understand my order is non-refundable.
                </MiniCheck>
              </div>

              <button type="submit" className="btn btn-block crx-cash-submit">
                Withdraw
              </button>
            </form>
          </>
        )}
      </div>
    </Modal>
  )
}

// Reserved-height error line, copied from the frozen tree's forms.tsx FieldError: the box always
// exists, so an appearing error swaps colour into it instead of reflowing the card. The kit's
// .crx-err carries the same min-height contract.
function FieldError({ children }: { children?: string }) {
  return (
    <span role={children ? 'alert' : undefined} aria-hidden={!children} className="crx-err">
      {children || ' '}
    </span>
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
  // Real checkbox stays in the DOM (sr-only), the kit's own pattern — its focus-visible ring
  // forwards from the hidden input to the painted .crx-check sibling (creators.css's selector).
  return (
    <div>
      <label className="crx-cash-mini">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
        <span className={`crx-check subtle${checked ? ' on' : ''}${err ? ' err' : ''}`}>
          <span className={`crx-check-box${checked ? ' on' : ''}`}>{checked && <TickIcon size={9} />}</span>
          <span>{children}</span>
        </span>
      </label>
      <FieldError>{err}</FieldError>
    </div>
  )
}
