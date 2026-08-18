'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import Modal, { ModalHeader } from './Modal'
import BrandSignIn from './brands/BrandSignIn'
import { persistBrandSignIn, useBrandSession } from './brands/BrandSession'
import CampaignForm from './brands/CampaignForm'
import PricingTable from './brands/PricingTable'
import SignInDialog from './creators/SignInDialog'

// Every popup on this site, hosted once at the layout level, driven by a context any CTA can call.
//
// Why a host rather than local state in each CTA: the triggers are scattered across both heroes, both
// closing bands, the header and the footer. One host, one open dialog, always — which is also what
// stops two scroll locks and two focus traps from ever fighting.
//
// ── MERGE NOTE (2026-08-13) ─────────────────────────────────────────────────────────────────────
// This file was the one real conflict between PR #1 (brands campaign workflow) and the creators
// restructure landed the same day. Both sides rewrote it from different starting points and neither
// is a superset of the other, so this is a hand-merge — not "ours", not "theirs":
//
//   FROM THE CREATORS WORK — the dialog set. `lookup` and `waitlist` are gone, along with the
//   `lookupMode` state that existed only to drive the lookup's two outcomes. The handle lookup and
//   its earnings estimate were removed per the PM brief (LookupFlow, EarningsReveal, ManualDetails
//   and estimate.ts are all deleted), and the waitlist email capture is replaced by the application,
//   which collects a contact email as one of its own questions. PR #1 still carried both because it
//   branched before that work; re-adding them here would reference four files that no longer exist.
//
//   FROM PR #1 — everything about brands. The campaign dialog is GATED now: a brand signs in first
//   (BrandSignIn), the session persists in localStorage, and `?create=1` deep-links straight into the
//   dialog from the campaign report dashboard's "+ New campaign". The dialog's size and label follow
//   that gate, and CampaignForm receives the signed-in email.
//
//   `signin` is the creators-side equivalent and is deliberately SEPARATE from BrandSignIn: it is a
//   replica of now.gg's own card gating a creator application, where BrandSignIn is a work-email
//   panel gating a campaign. Same idea, two audiences, two designs — collapsing them into one would
//   force one surface's visual language onto the other.
//
// The application form itself is NOT a dialog — it renders inline at the top of the creators page
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
  // Brand-side session: lived here as local state (PR #1) until 2026-08-18, when the FE review
  // pointed out nothing outside this dialog could see it (no header Sign in, no Log out). It is now
  // the shared BrandSession context, same level as the creators' ApplyState; this host is just one
  // of its consumers.
  const { signedIn, email, signIn } = useBrandSession()
  const [createIntent, setCreateIntent] = useState(false)

  const open = useCallback((k: ModalKind) => {
    // Reset on OPEN, not on close: resetting on close would flip the panel back to white while the
    // dialog is still on screen.
    if (k === 'campaign') setCampaignDone(false)
    setKind(k)
  }, [])
  const close = useCallback(() => setKind(null), [])

  // Honour ?create=1 (the dashboard's "+ New campaign"): it opens the campaign dialog immediately,
  // at the form for a signed-in brand, at the gate otherwise. The stored sign-in itself hydrates in
  // BrandSessionProvider now, whose effect runs after this one (parent effects run after children's),
  // so the dialog opens first and lands on the right panel once both effects have run. In an effect
  // because location does not exist server-side.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('create') === '1') {
      setCreateIntent(true)
      open('campaign')
    }
  }, [open])

  const value = useMemo(() => ({ open, close }), [open, close])

  return (
    <ModalCtx.Provider value={value}>
      {children}

      {/* Each dialog is mounted only while it's the open one, so its contents start fresh: the
          campaign form reopens at step 1 rather than mid-flow on a second visit. */}
      <Modal
        open={kind === 'campaign'}
        onClose={close}
        size={signedIn ? 'lg' : 'sm'}
        variant={campaignDone ? 'band' : 'light'}
        label={signedIn ? 'Create a campaign' : 'Sign in to continue'}
      >
        {signedIn ? (
          <CampaignForm onClose={close} onDone={() => setCampaignDone(true)} email={email} />
        ) : (
          <BrandSignIn
            onSignedIn={(signedEmail) => {
              // Signed in FROM the dashboard's create button: stay put and show the form, via the
              // shared session so the header's account menu flips in the same render. Signed in
              // from the marketing page (the header's Sign in, or a create CTA): the dashboard is
              // the destination, so persist WITHOUT flipping state (see persistBrandSignIn for why
              // flipping here would flash the form mid-navigation) and go there.
              if (createIntent) {
                signIn(signedEmail)
              } else {
                persistBrandSignIn(signedEmail)
                window.location.assign(
                  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/creator-brand/campaign-report.html`,
                )
              }
            }}
          />
        )}
      </Modal>

      {/* xl — this table has three columns and six rows of real sentences; at the form's width its
          middle column wraps every cell. */}
      <Modal open={kind === 'pricing'} onClose={close} size="xl" label="How pricing works">
        {/* ModalHeader's subtitle is capped at 80ch. At the 62ch this used to carry, the
            150-character sentence broke over THREE lines inside a 1040px panel with the last one a
            stub — the column was a third of the width available to it. */}
        <ModalHeader
          title={<h2 className="font-head text-[20px] font-bold text-ink-display">How pricing works</h2>}
          sub="One flat rate per verified engagement. You set the budget and the window. BlueAI spreads it across real people and pays out only as each engagement clears."
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
