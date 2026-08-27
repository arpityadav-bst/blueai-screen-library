'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import CrxProvider, { useCrx } from './flow/CrxState'
import Modal from './flow/Modal'
import SignInDialog from './flow/SignInDialog'
import PreviewToggler from './flow/PreviewToggler'
import FullCapacityNotice from './flow/FullCapacityNotice'
import ProgramsHome from './programs/ProgramsHome'
import { ALL_ENROLLED, MIXED_APPLIED, MIXED_ENROLLED, OPEN_MULTI_ITEMS, PAST_ENROLLMENTS,
  SINGLE_ENROLLMENT } from './programs/programData'
import type { Journey, NavView } from './flow/CrxState'
import ApplySectionV1 from './v1/ApplySectionV1'
import DashboardV1 from './v1/DashboardV1'
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
  const { signedIn, journey, nav, variant } = useCrx()
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
      ) : (
        <>
          {/* EVERY SIGNED-IN VIEW IS FLOW + FOOTER, NOTHING ELSE (Appy, 2026-08-20: "after the
              login pages, we can just show footer after the form and popup, and the completion").
              <main> gives every view the page grid and the fixed-header clearance .crx main
              defines. WHAT renders inside is now two decisions, not one (2026-08-24, the account
              menu's nav rows): the journey picks the persona's screens, and the menu's Dashboard /
              Programs rows can override WHICH of the persona's two surfaces is up — see
              SignedInView. */}
          <main>
            {variant === 'original' ? <SignedInViewV1 journey={journey} /> : <SignedInView journey={journey} nav={nav} />}
          </main>
          <HomeFooter />
        </>
      )}

      {/* SignedInView is declared below the component that renders it — reading order follows
          the switch above. */}
      {/* Both render in ALL states: the toggler is the reviewer's journey switch (z-110, above
          the modal on purpose), and the dialog must be able to open from any signed-out CTA. */}
      <PreviewToggler />
      <Modal open={signInOpen} onClose={closeSignIn} label="Sign in to now.gg">
        <SignInDialog onClose={closeSignIn} />
      </Modal>
    </div>
  )
}

// VERSION B's signed-in switch (2026-08-26, Abhisht: a variant with no "program" vocabulary —
// the term arrived late via engg and was never agreed internally, so both versions stay
// reviewable side by side). The v1 model has exactly three signed-in destinations: the
// application, the dashboard, the full-capacity notice. Journeys collapse onto them — every
// returning persona is the v1 dashboard, full capacity keeps its notice, everything else is a
// new applicant meeting the form.
function SignedInViewV1({ journey }: { journey: Journey }) {
  if (journey === 'returningUser' || journey === 'returningMulti' || journey === 'returningEmpty') {
    return <DashboardV1 />
  }
  if (journey === 'fullCapacity') return <FullCapacityNotice />
  return <ApplySectionV1 />
}

// The signed-in switch: journey = persona, nav = which of the persona's surfaces is up.
// 'auto' resolves to the persona's own landing (returning members open the dashboard, everyone
// else the programs home). With the menu's nav rows gone (2026-08-24 meeting: launch is one
// program, the menu is identity + exit), the only nav writer left is the enrolled card's "Track
// on dashboard" button in the future many-programs states. The programs surface per persona:
//   newUser        → one open program           multiPrograms → several open
//   appliedMulti   → one in review, rest open   enrolledMulti → one active, rest open
//   applied        → the single pending status  noPrograms    → the empty state
//   returningMulti → everything active (the fully-enrolled member's index)
//   fullCapacity   → the platform-wide notice (its programs surface IS the notice)
// The dashboard surface scales the same way: launch personas carry the ONE creators program and
// no completed-programs history; returningMulti carries the full multi-program mock.
function SignedInView({ journey, nav }: { journey: Journey; nav: NavView }) {
  const returning = journey === 'returningUser' || journey === 'returningMulti' || journey === 'returningEmpty'
  const view = nav === 'auto' ? (returning ? 'dashboard' : 'programs') : nav

  if (view === 'dashboard') {
    if (journey === 'returningMulti') return <Dashboard />
    // Nothing active, two finished: the realistic shape of "no program enrolled" for a member who
    // has been here a while. Past keeps its contents, so the empty ACTIVE tab is what is under
    // review rather than an empty dashboard.
    if (journey === 'returningEmpty') return <Dashboard enrollments={PAST_ENROLLMENTS} />
    return <Dashboard enrollments={SINGLE_ENROLLMENT} />
  }

  switch (journey) {
    case 'returningUser':
      return <ProgramsHome mode="open" items={[{ program: SINGLE_ENROLLMENT[0].program, relation: 'enrolled' }]} />
    // Where "See open programs" lands from the empty dashboard: the same offer, with no enrolled
    // relation on it, because this member is not in it.
    case 'returningEmpty':
      return <ProgramsHome mode="open" items={[{ program: SINGLE_ENROLLMENT[0].program, relation: 'open' }]} />
    case 'returningMulti':
      return <ProgramsHome mode="open" items={ALL_ENROLLED} />
    case 'fullCapacity':
      return <FullCapacityNotice />
    case 'applied':
      return <ProgramsHome mode="pending" />
    case 'noPrograms':
      return <ProgramsHome mode="none" />
    case 'multiPrograms':
      return <ProgramsHome mode="open" items={OPEN_MULTI_ITEMS} />
    case 'appliedMulti':
      return <ProgramsHome mode="open" items={MIXED_APPLIED} />
    case 'enrolledMulti':
      return <ProgramsHome mode="open" items={MIXED_ENROLLED} />
    default:
      return <ProgramsHome mode="open" />
  }
}
