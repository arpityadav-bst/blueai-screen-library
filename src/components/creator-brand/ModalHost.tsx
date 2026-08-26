'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import Modal, { ModalHeader } from './Modal'
import BrandRegister from './brands/BrandRegister'
import BrandSignIn from './brands/BrandSignIn'
import { persistBrandRegistration, persistBrandSignIn, useBrandSession } from './brands/BrandSession'
import BrandTransition from './brands/BrandTransition'
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
  const { signedIn, registration, email, signIn } = useBrandSession()
  const [createIntent, setCreateIntent] = useState(false)
  // The label of the navigation in flight, or null. Set immediately before window.location.assign
  // and never cleared — the page unloading is what clears it, which is exactly the property that
  // stops the loader from ever showing "done" over a navigation that did not happen.
  const [leaving, setLeaving] = useState<string | null>(null)

  // One place for the dashboard URL. It was written inline in two branches and is about to be three;
  // the basePath prefix is the part that silently breaks when a copy is missed.
  const DASH_URL = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/creator-brand/campaign-report.html`

  // THE COVER HAS TO PAINT BEFORE THE NAVIGATION STARTS, and that is why the loader was not
  // appearing on either navigating branch (Appy, 2026-08-26: "even sign in will have the same
  // loading as sign out"). setLeaving schedules a render; window.location.assign begins unloading in
  // the SAME tick. React never got a frame in between, so the state was set and the cover was never
  // drawn — the code was right and the sequencing was wrong.
  // Two rAFs, not one: the first fires before the commit paints, the second after it. One frame was
  // enough in Chrome and not in Safari, and this is a design prototype that gets opened in both.
  const leaveTo = useCallback((label: string, url: string) => {
    setLeaving(label)
    requestAnimationFrame(() => requestAnimationFrame(() => window.location.assign(url)))
  }, [])

  // The in-dialog variant. Nothing navigates here — the panel swaps from sign-in to Register — so
  // this one MUST resolve, unlike the navigating cover which is cleared by the page unloading. It
  // exists because a Google sign-in that returns instantly reads as nothing having happened: the
  // real thing involves a round trip, and the dialog swapping panels with no beat in between makes
  // the click feel unacknowledged.
  const signInThen = useCallback((label: string, run: () => void) => {
    setLeaving(label)
    window.setTimeout(() => {
      run()
      setLeaving(null)
    }, 620)
  }, [])

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
      {/* SIZE AND LABEL FOLLOW THE PANEL, not the session (Appy, 2026-08-26: "the register your
          brand popup is too wide"). `signedIn ? lg : sm` was written when signed-in meant exactly
          one thing — the campaign form, which has three steps and a two-column review and genuinely
          wants 720px. Registration is signed-in too, so it inherited that width for three short
          fields, and three fields in a 720px panel is what made it look wrong. Only the campaign
          FORM is lg now; sign-in and registration are both sm. The label carried the same bug — it
          announced "Create a campaign" over the registration dialog. */}
      <Modal
        open={kind === 'campaign'}
        onClose={close}
        size={signedIn && registration ? 'lg' : 'sm'}
        variant={campaignDone ? 'band' : 'light'}
        label={
          signedIn && registration
            ? 'Create a campaign'
            : signedIn
              ? 'Register your agency'
              : 'Sign in to continue'
        }
      >
        {/* THREE STATES NOW, not two (Abhisht, 2026-08-26, after the call with Anmol). Signed in is
            no longer enough to reach the campaign form: a brand is something BlueAI approves, and
            the prototype skipped that entirely by dropping a fresh sign-in onto the dashboard.
              signed out          -> BrandSignIn
              signed in, no brand -> BrandRegister, then the dashboard's in-review screen
              registered          -> CampaignForm, as before
            REGISTRATION GATES THE FORM, NOT THE DASHBOARD. A registered brand whose review is still
            pending can still open this dialog; what it sees when it lands on the dashboard is the
            review screen, and that is the dashboard's decision to make, not this host's. */}
        {signedIn && registration ? (
          <CampaignForm onClose={close} onDone={() => setCampaignDone(true)} email={email} />
        ) : signedIn ? (
          <BrandRegister
            email={email}
            onDone={(reg) => {
              // Persist without flipping state, then navigate — persistBrandSignIn's own reasoning:
              // flipping here would swap this panel to the campaign form for a frame mid-unload.
              persistBrandRegistration(reg)
              // "Setting up your agency", not "Signing you in": the wait a reader is looking at here
              // is their application being filed, and the next thing they see is the review screen.
              leaveTo('Setting up your agency\u2026', DASH_URL)
            }}
          />
        ) : (
          <BrandSignIn
            onSignedIn={(signedEmail) => {
              // Signed in FROM the dashboard's create button: stay put and show the form, via the
              // shared session so the header's account menu flips in the same render. Signed in from
              // the marketing page by a brand that HAS registered: the dashboard is the destination,
              // so persist WITHOUT flipping state (see persistBrandSignIn for why flipping here
              // would flash the form mid-navigation) and go there. That second rule used to have no
              // qualifier — see below for why it needed one.
              // AN UNREGISTERED BRAND IS NEVER NAVIGATED AWAY (Appy, 2026-08-26: "when the new
              // user toggle is selected, Create a campaign then Continue with Google opens the
              // dashboard directly").
              // That was a hole in the registration step, not an old bug. createIntent is only ever
              // true for ?create=1 — arriving from the dashboard's "+ New campaign" — and that was
              // RIGHT for a two-state flow, where signing in from the marketing page had nowhere to
              // go but the dashboard. Registration was added to the stay-put branch only, so the
              // navigate-away branch walked straight past it.
              // Registration decides first now; where the sign-in started decides second:
              //   no registration            -> stay put, the gate shows BrandRegister
              //   registered + createIntent  -> stay put, show the campaign form
              //   registered, from marketing -> the dashboard, as before
              // BOTH BRANCHES SHOW THE COVER NOW. The stay-put one had none, because nothing
              // navigates and the cover was built for navigations — but a sign-in that resolves in
              // the same frame it was clicked reads as a dead button whether or not the page moves.
              if (!registration || createIntent) {
                signInThen('Signing you in\u2026', () => signIn(signedEmail))
              } else {
                persistBrandSignIn(signedEmail)
                leaveTo('Signing you in\u2026', DASH_URL)
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

      {/* LAST, so it paints over every dialog above it without needing to out-specify their z-index
          one by one. Rendered rather than portalled for the same reason the modals are: this host is
          already at the layout level, so there is nothing above it to escape. */}
      {leaving && <BrandTransition label={leaving} />}
    </ModalCtx.Provider>
  )
}
