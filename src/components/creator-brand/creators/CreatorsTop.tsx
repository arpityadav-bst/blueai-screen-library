'use client'

import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hero from './Hero'
import ApplySection from './ApplySection'
import Dashboard from './dashboard/Dashboard'
import { useApply } from './ApplyState'

// The one thing on the creators page that differs between signed-out and signed-in: the top.
// Signed out it's the marketing hero; signed in it's the application. Everything below stays put, so
// page.tsx keeps its section list and only this swap is a client concern.
//
// THIRD STATE, 2026-08-14: isReturningUser TAKES PRIORITY over signedIn — a returning creator who
// already earns through BlueAI has nothing to apply for, so this isn't a third position alongside
// the other two, it's a short-circuit above both. See ApplyState.tsx for why this flag exists
// separately from signedIn rather than as a third value on it (no real interaction reaches it; it's
// a design-review switch, not a session).
//
// KNOWN, ACCEPTED ARTIFACT: on a RELOAD while signed in, the hero paints for a frame before the form
// replaces it. The signed-in flag lives in sessionStorage and can only be read in an effect — reading
// it during render would make the server's HTML disagree with the client's first render, which is a
// hydration error. Rendering nothing until the flag is known would trade this for a blank gap at the
// top of the page on every FIRST visit, which is the far more common case. So the flash stays, and it
// only ever happens on a reload of a state a real signed-in product would know server-side anyway.
export default function CreatorsTop() {
  const { signedIn, isReturningUser } = useApply()

  // MANDATORY, not a polish detail. The hero and the application are very different heights, so this
  // swap moves every section below it — and HowItWorks is a PINNED ScrollTrigger, which caches its
  // start/end against the document as it was when it was created. Without a refresh the pin engages
  // at the old offset: the title sticks early or late, and the cards' beats land against scroll
  // positions the page no longer has. It reads as the pin being broken, which is where the time would
  // go looking for it.
  //
  // In an effect keyed on both flags, so it runs AFTER React has committed the new subtree and the
  // document has its real height — refreshing during the same tick would just re-measure the old
  // layout. Reveal's own triggers are `once: true` and already fired, so they are unaffected either
  // way; this is entirely about the pin. (The dashboard has no pin of its own, but page.tsx removes
  // HowItWorks entirely in that state, so this still needs to fire on the way OUT of it too.)
  useEffect(() => {
    ScrollTrigger.refresh()
    // Backdrop measures #hero to decide where to fade in, and whether to gate itself at all. This swap
    // replaces that element, so it has to re-read both — see Backdrop.tsx.
    window.dispatchEvent(new Event('cb-top-change'))
  }, [signedIn, isReturningUser])

  if (isReturningUser) return <Dashboard />
  return signedIn ? <ApplySection /> : <Hero />
}
