'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import CrxProvider, { useCrx } from './flow/CrxState'
import Modal from './flow/Modal'
import SignInDialog from './flow/SignInDialog'
import PreviewToggler from './flow/PreviewToggler'
import ApplySection from './flow/ApplySection'
import FullCapacityNotice from './flow/FullCapacityNotice'
import Dashboard from './dashboard/Dashboard'
import HomeHeader from './HomeHeader'
import HomepageView from './HomepageView'
import HomeFooter from './HomeFooter'

// The /creators route root — Phase 3 of PLAN.md. Phase 0-2 history (the 1:1 mock port, the header,
// the audit) lives in HomepageView.tsx now, which carries the signed-out homepage AND its two
// hooks; this file became the provider + the branch, mirroring the frozen creator-brand tree's
// CreatorsTop: signedIn gates FIRST everywhere, journey only decides WHICH signed-in view
// (the 2026-08-14 hard-won rule in CrxState.tsx — journey checked without signedIn is how Log out
// once became a no-op). FROZEN-TREE RULE still holds: logic copied, never imported.
export default function CreatorsHome() {
  return (
    <CrxProvider>
      <CreatorsSwitch />
    </CrxProvider>
  )
}

function CreatorsSwitch() {
  const { signedIn, journey } = useCrx()
  const rootRef = useRef<HTMLDivElement>(null)

  // The sign-in dialog is owned here because three CTAs across three files open it: the header's
  // (HomeHeader onCta), the hero's (HomepageView's #hero-cta effect) and the closer's (HomeBelow
  // onCta). One open function passed down beats three private modals.
  const [signInOpen, setSignInOpen] = useState(false)
  const openSignIn = useCallback(() => setSignInOpen(true), [])
  const closeSignIn = useCallback(() => setSignInOpen(false), [])

  // REVEAL STATE ON SIGNED-IN VIEWS. The header (and every .rv element) is opacity:0 until the
  // root carries .revealed — a class the boot intro adds via direct DOM and its unmount cleanup
  // REMOVES. So when signing in unmounts HomepageView, the flow views would render under an
  // invisible header. This effect re-adds revealed+settled after that cleanup runs (React runs all
  // passive destroys before creates in a commit, so the ordering is guaranteed), and removes them
  // when signing out so the remounting intro starts from its un-revealed baseline and replays —
  // a signed-out visitor gets the homepage's full entrance, which is the honest state to return to.
  // The classes live in DOM only, NOT in this className string: className is the constant "crx"
  // every render, so React's diff never rewrites the attribute and never clobbers what the intro
  // (or this effect) added — the same contract the intro already relied on when this component
  // was stateless.
  useEffect(() => {
    if (!signedIn) return
    const root = rootRef.current
    root?.classList.add('revealed', 'settled')
    return () => root?.classList.remove('revealed', 'settled')
  }, [signedIn])

  // KNOWN ACCEPTED ARTIFACT: first paint is always signed-out (CrxState reads storage in an
  // effect, so server HTML and the client's first render agree), which means on a signed-in
  // reload the intro's backdrop can flash for a frame before this branch swaps. Same accepted
  // tradeoff as creator-brand's hero flash — the alternative (reading storage during render)
  // is a hydration error.
  return (
    <div className="crx" id="crx" ref={rootRef}>
      {/* Header renders in ALL states — it swaps its own CTA/nav/AccountMenu on signedIn. */}
      <HomeHeader onCta={openSignIn} />

      {!signedIn ? (
        <HomepageView onCta={openSignIn} />
      ) : journey === 'returningUser' ? (
        <>
          {/* EVERY SIGNED-IN VIEW IS FLOW + FOOTER, NOTHING ELSE (Appy, 2026-08-20: "after the
              login pages, we can just show footer after the form and popup, and the completion").
              The dashboard always worked this way; the application and full-capacity views used to
              carry the marketing sections underneath with only the closer suppressed, which put a
              pitch under someone who had already answered it. <main> gives all three the page grid
              and the fixed-header clearance .crx main defines. */}
          <main>
            <Dashboard />
          </main>
          <HomeFooter />
        </>
      ) : journey === 'fullCapacity' ? (
        <>
          <main>
            <FullCapacityNotice />
          </main>
          <HomeFooter />
        </>
      ) : (
        <>
          {/* newUser — the application. */}
          <main>
            <ApplySection />
          </main>
          <HomeFooter />
        </>
      )}

      {/* Both render in ALL states: the toggler is the reviewer's journey switch (z-110, above
          the modal on purpose), and the dialog must be able to open from any signed-out CTA. */}
      <PreviewToggler />
      <Modal open={signInOpen} onClose={closeSignIn} label="Sign in to now.gg">
        <SignInDialog onClose={closeSignIn} />
      </Modal>
    </div>
  )
}
