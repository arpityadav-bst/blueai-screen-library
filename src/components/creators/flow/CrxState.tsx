'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

// /creators' signed-in state + the mock now.gg account behind it. Copied from the frozen
// creator-brand tree's ApplyState.tsx (never imported — that tree is read-only reference), with the
// storage keys re-namespaced to 'crx-*' so the two prototypes can't clobber each other's session.
//
// WHY A CONTEXT ABOVE THE PAGE'S SUBTREES: the header (account chip vs CTA), the top of the page
// (hero vs application/dashboard/notice) and the closing band all need the same answer at once.
//
// SESSION-BACKED, not local-backed: a reviewer reloads constantly, and being thrown to signed-out
// every reload makes the signed-in half tedious to reach. sessionStorage so closing the tab resets —
// a handoff prototype that remembers you for a week is one nobody sees the entry flow of.
//
// FIRST PAINT IS ALWAYS SIGNED OUT; stored values apply in an effect (ready flips true after).
// Reading storage during render makes server HTML and the client's first render disagree — a
// hydration error — and signed-out is the honest default for a fresh visitor anyway.
const KEY = 'crx-signed-in'
// `journey` answers a DIFFERENT question than `signedIn`: signedIn is "did they click through the
// sign-in dialog"; journey is "when they do, which of three accounts does it turn out to be" — a
// first-time applicant, a creator already earning, or someone arriving while BlueAI is full.
// THE HARD-WON RULE (creator-brand, 2026-08-14 fix): journey must NEVER be checked without signedIn
// alongside it. An earlier version let the equivalent flag take priority OVER signedIn and skip
// sign-in entirely — so signOut() (which only clears signedIn) couldn't undo it, and Log out from
// the dashboard did nothing. signedIn gates first, everywhere; journey only picks WHICH signed-in view.
const JOURNEY_KEY = 'crx-journey'
// Journeys added for the programs home (2026-08-24, Abhisht's program-workflow pass):
// 'applied' — signed in, application submitted, review underway; 'noPrograms' — signed in while
// nothing is open to apply to; 'multiPrograms' — the open home with SEVERAL programs accepting
// applications at once (same view as newUser, more inventory — a state ops will reach the day a
// second program activates, so the review kit has to show it). 'newUser' lands on the open home
// with the single launch program.
// 'appliedMulti' / 'enrolledMulti' (2026-08-24): the mixed homes — one program in review (or
// already active) while others stay open to apply to. 'returningUser' is the LAUNCH returning
// member (dashboard with the one creators program); 'returningMulti' is the future one (dashboard
// with several). The one-program journeys are the going-live set (2026-08-24 meeting).
// 'returningEmpty' (2026-08-25, Abhisht item 2): a member who is enrolled in NOTHING right now and
// opens the dashboard anyway. Its own journey rather than a variant of returningUser, because the
// thing being reviewed is what the screen does when it has no programs to show — and that is only
// visible if a reviewer can land on it.
export type Journey = 'newUser' | 'multiPrograms' | 'appliedMulti' | 'enrolledMulti' | 'applied' | 'returningUser' | 'returningEmpty' | 'returningMulti' | 'fullCapacity' | 'noPrograms'
const JOURNEYS: Journey[] = ['newUser', 'multiPrograms', 'appliedMulti', 'enrolledMulti', 'applied', 'returningUser', 'returningEmpty', 'returningMulti', 'fullCapacity', 'noPrograms']

/** Illustrative, like every other name and figure on this site. Not a real account. */
export const MOCK_ACCOUNT = {
  name: 'Maya Fernandes',
  handle: '@mayamakes',
  email: 'maya.fernandes@gmail.com',
  initials: 'MF',
}

// VERSION A/B (2026-08-26, Abhisht): 'programs' is the current build; 'original' is Version B —
// the v1 experience with no 'program' vocabulary anywhere (the term arrived late via engg and was
// never agreed internally, so both versions ship for review side by side). The variant gates which
// signed-in components render (CreatorsHome) and swaps the shared form's "Program Terms" strings.
export type Variant = 'programs' | 'original'

// The account menu's two nav rows (2026-08-24, Abhisht: show Dashboard AND Programs at once).
// 'auto' = the journey's own default view (returningUser opens the dashboard, everything else the
// programs home); a menu click overrides it for the session. In-memory only: it is navigation, not
// identity, and a reload going back to the journey default is the honest reset.
export type NavView = 'auto' | 'programs' | 'dashboard'

type Ctx = {
  signedIn: boolean
  /** True once storage has been read, so nothing animates the swap on first paint. */
  ready: boolean
  signIn: () => void
  signOut: () => void
  account: typeof MOCK_ACCOUNT
  /** Which signed-in persona a sign-in resolves to — see the JOURNEY_KEY note above. */
  journey: Journey
  setJourney: (v: Journey) => void
  /** Menu-driven view override — see the NavView note above. */
  nav: NavView
  setNav: (v: NavView) => void
  /** Which experience renders — see the Variant note above. */
  variant: Variant
  setVariant: (v: Variant) => void
}

const CrxCtx = createContext<Ctx | null>(null)

export function useCrx() {
  const ctx = useContext(CrxCtx)
  // Thrown rather than silently defaulted: a CTA rendered outside the provider would look wired up
  // and do nothing — the hardest kind of bug to spot in a design replica.
  if (!ctx) throw new Error('useCrx must be used inside <CrxProvider>')
  return ctx
}

export default function CrxProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(false)
  const [journey, setJourneyState] = useState<Journey>('newUser')
  const [nav, setNav] = useState<NavView>('auto')
  // In-memory like nav — a review switch, and reload returning to Version A is the honest default
  // UNLESS the URL asks for B (see the ?v= block in the mount effect below).
  const [variant, setVariant] = useState<Variant>('programs')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      setSignedIn(sessionStorage.getItem(KEY) === '1')
      const stored = sessionStorage.getItem(JOURNEY_KEY)
      if (stored && (JOURNEYS as string[]).includes(stored)) setJourneyState(stored as Journey)
    } catch {
      // Private-mode Safari throws on sessionStorage access. Staying signed out is the correct
      // fallback, and it must not take the page down with it.
    }
    // ?v= MAKES VERSION B A LINK (Appy, 2026-08-27: "make sure that we have a path to see the
    // default website, the brand website, and this new variant"). Until now B existed only behind
    // the gear — reachable, but not something you can send to anyone, which matters because these
    // surfaces get reviewed by people who are handed a URL and nothing else.
    // ?v=b (or ?v=original) opens on B, ?v=a (or ?v=programs) on A; anything else is ignored rather
    // than treated as B, so a stray query cannot silently change which build a reviewer is judging.
    // It SEEDS the initial value only — the toggler still overrides it in-session, and a reload with
    // no query goes back to A. Read outside the try above: URLSearchParams does not throw where
    // sessionStorage does, and a storage failure must not cost the URL its meaning.
    try {
      const v = new URLSearchParams(window.location.search).get('v')?.toLowerCase()
      if (v === 'b' || v === 'original') setVariant('original')
      else if (v === 'a' || v === 'programs') setVariant('programs')
    } catch {
      // Nothing to fall back to: the default state IS the fallback.
    }
    setReady(true)
  }, [])

  const write = useCallback((v: boolean) => {
    setSignedIn(v)
    // Signing in or out resets any menu-driven view override — the next session starts on the
    // journey's own default, same as a fresh visitor would.
    setNav('auto')
    try {
      if (v) sessionStorage.setItem(KEY, '1')
      else sessionStorage.removeItem(KEY)
    } catch {
      // Same as above — in-memory state drives the UI; storage is only the convenience.
    }
  }, [])

  const signIn = useCallback(() => write(true), [write])
  const signOut = useCallback(() => write(false), [write])

  const setJourney = useCallback((v: Journey) => {
    setJourneyState(v)
    // A journey flip is the reviewer changing persona — stale nav from the previous persona would
    // show the wrong screen under the new one's name.
    setNav('auto')
    try {
      sessionStorage.setItem(JOURNEY_KEY, v)
    } catch {
      // Same fallback as above.
    }
  }, [])

  const value = useMemo(
    () => ({ signedIn, ready, signIn, signOut, account: MOCK_ACCOUNT, journey, setJourney, nav, setNav, variant, setVariant }),
    [signedIn, ready, signIn, signOut, journey, setJourney, nav, variant],
  )

  return <CrxCtx.Provider value={value}>{children}</CrxCtx.Provider>
}
