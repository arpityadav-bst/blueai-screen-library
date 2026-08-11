'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import Modal, { ModalHeader } from './Modal'
import CampaignForm from './brands/CampaignForm'
import PricingTable from './brands/PricingTable'
import WaitlistForm from './creators/WaitlistForm'
import LookupFlow from './creators/LookupFlow'

// Every popup on this site, hosted once at the layout level, driven by a context any CTA can call.
//
// Why a host rather than local state in each CTA: the triggers are scattered across both heroes,
// two closing bands, the header, the footer, the nav, the jobs preview and the lookup result — and
// two of them open a dialog from INSIDE another dialog ("Join the waitlist" on the earnings
// result). Per-CTA state would mean a dialog nested in the DOM of the dialog that opened it, with
// two scroll locks and two focus traps fighting. One host, one open dialog, always.

export type ModalKind = 'campaign' | 'pricing' | 'waitlist' | 'lookup'
export type LookupMode = 'auto' | 'manual'

type Ctx = {
  open: (kind: ModalKind, payload?: { handle?: string }) => void
  close: () => void
  /** Which lookup outcome the prototype should demonstrate — driven by the state toggler. */
  lookupMode: LookupMode
  setLookupMode: (m: LookupMode) => void
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
  const [state, setState] = useState<{ kind: ModalKind; handle?: string } | null>(null)
  const [lookupMode, setLookupMode] = useState<LookupMode>('auto')
  // The campaign dialog's SURFACE changes once submitted: the queued state is the CTA band. That
  // has to live out here rather than inside the form, because the panel's background and the close
  // button's colour are the dialog's, not the form's.
  const [campaignDone, setCampaignDone] = useState(false)

  const open = useCallback((kind: ModalKind, payload?: { handle?: string }) => {
    // Reset on OPEN, not on close: resetting on close would flip the panel back to white while the
    // dialog is still on screen.
    if (kind === 'campaign') setCampaignDone(false)
    setState({ kind, ...payload })
  }, [])
  const close = useCallback(() => setState(null), [])
  const value = useMemo(() => ({ open, close, lookupMode, setLookupMode }), [open, close, lookupMode])

  return (
    <ModalCtx.Provider value={value}>
      {children}

      {/* Each dialog is mounted only while it's the open one, so its contents start fresh: the
          campaign form reopens at step 1, the lookup re-runs its scan, the waitlist forgets a
          previous email. A kept-mounted dialog would reopen mid-flow on the second visit. */}
      <Modal
        open={state?.kind === 'campaign'}
        onClose={close}
        size="lg"
        variant={campaignDone ? 'band' : 'light'}
        label="Create a campaign"
      >
        <CampaignForm onClose={close} onDone={() => setCampaignDone(true)} />
      </Modal>

      {/* xl — this table has three columns and six rows of real sentences; at the form's width its
          middle column wraps every cell. */}
      <Modal open={state?.kind === 'pricing'} onClose={close} size="xl" label="How pricing works">
        {/* ModalHeader's subtitle is capped at 80ch. At the 62ch this used to carry, the
            150-character sentence broke over THREE lines inside a 1040px panel with the last one a
            stub — the column was a third of the width available to it. */}
        <ModalHeader
          title={<h2 className="font-head text-[20px] font-bold text-ink-display">How pricing works</h2>}
          sub="One flat rate per verified engagement. You set the budget and the window — BlueAI spreads it across real people and pays out only as each engagement clears."
        />
        <PricingTable />
      </Modal>

      {/* variant="band" is the designer's "same grid lines and colors in a popup": it renders the
          same CTAGrid the closing section does, on the same bg-cta-band. */}
      <Modal open={state?.kind === 'waitlist'} onClose={close} variant="band" size="sm" label="Join the waitlist">
        <div className="px-8 py-12 text-center sm:px-12">
          <h2 className="mx-auto max-w-[24ch] font-head text-3xl font-bold text-white">
            The jobs open soon.
            <span className="cb-text-gradient-dark block italic pr-[0.2em]">Be first in line.</span>
          </h2>
          <p className="bai-body-lg mx-auto mt-4 max-w-[36ch] text-white/70">
            Join 12,400+ creators waiting to start earning through BlueAI.
          </p>
          {/* autoFocus only in the dialog — the reader opened it to type, and the section version
              must never steal focus from someone merely scrolling past it. */}
          <WaitlistForm autoFocus />
        </div>
      </Modal>

      <Modal open={state?.kind === 'lookup'} onClose={close} size="sm" label="Your earnings estimate">
        {state?.kind === 'lookup' && <LookupFlow handle={state.handle ?? ''} mode={lookupMode} />}
      </Modal>
    </ModalCtx.Provider>
  )
}
