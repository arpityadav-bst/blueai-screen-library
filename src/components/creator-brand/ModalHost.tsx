'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import Modal, { ModalHeader } from './Modal'
import CampaignForm from './brands/CampaignForm'
import PricingTable from './brands/PricingTable'
import SignInDialog from './creators/SignInDialog'

// Every popup on this site, hosted once at the layout level, driven by a context any CTA can call.
//
// Why a host rather than local state in each CTA: the triggers are scattered across both heroes, both
// closing bands, the header and the footer. One host, one open dialog, always — which is also what
// stops two scroll locks and two focus traps from ever fighting.
//
// DOWN TO THREE KINDS (2026-08-13). `lookup` and `waitlist` are gone, and so is the `lookupMode`
// state that existed only to drive the lookup's two outcomes:
//   · `lookup` — the handle lookup and its earnings estimate were removed per the PM (screenshot item
//     1), along with LookupFlow, EarningsReveal, ManualDetails and estimate.ts. The application is the
//     hero's entry point now.
//   · `waitlist` — the email capture is replaced by the application, which collects a contact email as
//     one of its own questions.
// Both were deleted rather than left mounted-but-unreachable. An unreachable dialog is a dialog nobody
// reviews, and its data model quietly stops matching the product it claims to demonstrate.
//
// `signin` is the one addition: the minimal now.gg sign-in the creators journey opens before the
// application. The application form itself is NOT a dialog — it renders inline at the top of the page
// once signed in (creators/ApplySection.tsx), which is the designer's architecture.
export type ModalKind = 'campaign' | 'pricing' | 'signin'

type Ctx = {
  open: (kind: ModalKind) => void
  close: () => void
}

const ModalCtx = createContext<Ctx | null>(null)

export function useCBModal() {
  const ctx = useContext(ModalCtx)
  // A thrown error rather than a silent no-op: a CTA rendered outside the provider would otherwise
  // look wired up and do nothing, which is the hardest kind of bug to notice in a design replica.
  if (!ctx) throw new Error('useCBModal must be used inside <ModalHost>')
  return ctx
}

export default function ModalHost({ children }: { children: ReactNode }) {
  const [kind, setKind] = useState<ModalKind | null>(null)
  // The campaign dialog's SURFACE changes once submitted: the queued state is the CTA band. That has
  // to live out here rather than inside the form, because the panel's background and the close
  // button's colour are the dialog's, not the form's.
  const [campaignDone, setCampaignDone] = useState(false)

  const open = useCallback((k: ModalKind) => {
    // Reset on OPEN, not on close: resetting on close would flip the panel back to white while the
    // dialog is still on screen.
    if (k === 'campaign') setCampaignDone(false)
    setKind(k)
  }, [])
  const close = useCallback(() => setKind(null), [])
  const value = useMemo(() => ({ open, close }), [open, close])

  return (
    <ModalCtx.Provider value={value}>
      {children}

      {/* Each dialog is mounted only while it's the open one, so its contents start fresh: the
          campaign form reopens at step 1 rather than mid-flow on a second visit. */}
      <Modal
        open={kind === 'campaign'}
        onClose={close}
        size="lg"
        variant={campaignDone ? 'band' : 'light'}
        label="Create a campaign"
      >
        <CampaignForm onClose={close} onDone={() => setCampaignDone(true)} />
      </Modal>

      {/* xl — this table has three columns and six rows of real sentences; at the form's width its
          middle column wraps every cell. */}
      <Modal open={kind === 'pricing'} onClose={close} size="xl" label="How pricing works">
        {/* ModalHeader's subtitle is capped at 80ch. At the 62ch this used to carry, the
            150-character sentence broke over THREE lines inside a 1040px panel with the last one a
            stub — the column was a third of the width available to it. */}
        <ModalHeader
          title={<h2 className="font-head text-[20px] font-bold text-ink-display">How pricing works</h2>}
          sub="One flat rate per verified engagement. You set the budget and the window — BlueAI spreads it across real people and pays out only as each engagement clears."
        />
        <PricingTable />
      </Modal>

      {/* variant="dark" — a transparent panel, because SignInDialog is a replica of now.gg's own
          sign-in card and paints its own surface to the panel's rounded corners. Not `band`: that
          would lay this site's CTAGrid over another product's login screen. */}
      <Modal open={kind === 'signin'} onClose={close} size="xs" variant="dark" label="Sign in to apply">
        <SignInDialog onClose={close} />
      </Modal>
    </ModalCtx.Provider>
  )
}
