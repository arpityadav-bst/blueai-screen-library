'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

// The prototype's signed-in state, and the mock now.gg account behind it.
//
// WHY A CONTEXT AT THE LAYOUT LEVEL rather than state inside the creators page: three separate
// subtrees need the same answer at the same time. The Header swaps its CTA for the account chip, the
// top of the page swaps the marketing hero for the application form, and the closing band swaps
// "opens the sign-in dialog" for "scrolls to the form". Lifting it any lower than the layout means
// the Header — which is rendered by each page, above <main> — can't see it.
//
// SESSION-BACKED, not local-backed. A designer reviewing this will reload the page constantly, and
// being thrown back to the signed-out state on every reload makes the signed-in half of the page
// tedious to look at. sessionStorage rather than localStorage so closing the tab genuinely resets it
// — a handoff prototype that remembers you for a week is a prototype nobody sees the entry flow of.
//
// FIRST PAINT IS ALWAYS SIGNED OUT, and the stored value is applied in an effect. Reading storage
// during render would make the server's HTML and the client's first render disagree, which is a
// hydration error — and the signed-out state is the honest default for a fresh visitor anyway.
const KEY = 'cb-creator-signed-in'
// A SECOND, INDEPENDENT flag (Appy, 2026-08-14), now a THREE-WAY `journey` rather than a boolean
// (widened 2026-08-14 to add the "full capacity" persona). It answers a different question than
// `signedIn`: signedIn is "did they click through the sign-in dialog"; `journey` is "when they do,
// which of three accounts does this turn out to be" — a first-time applicant, a creator who already
// downloaded BlueAI and is earning through it, or someone signing in while BlueAI isn't taking new
// creators. CreatorsTop.tsx reads BOTH — signedIn decides Hero vs. signed-in content, journey then
// decides WHICH signed-in content (application form / dashboard / the full-capacity notice). None of
// this is wired through a real sign-in interaction (nobody can walk any of these three for real — the
// dashboard means having actually completed jobs in BlueAI, and "full capacity" is a state of the
// product, not the account), so — same reasoning PreviewToggler.tsx already gives for `signedIn`
// itself — a persona nobody can select for real is a persona nobody reviews.
// journey must NEVER be checked without signedIn alongside it (2026-08-14 fix) — an earlier version
// let the equivalent flag take priority OVER signedIn and skip sign-in entirely, which meant
// signOut() (which only clears signedIn) couldn't undo it: Log out from the dashboard did nothing.
const JOURNEY_KEY = 'cb-creator-journey'
export type Journey = 'newUser' | 'returningUser' | 'fullCapacity'
const JOURNEYS: Journey[] = ['newUser', 'returningUser', 'fullCapacity']

/** Illustrative, like every other name and figure on this site. Not a real account. */
export const MOCK_ACCOUNT = {
  name: 'Maya Fernandes',
  handle: '@mayamakes',
  email: 'maya.fernandes@gmail.com',
  initials: 'MF',
}

type Ctx = {
  signedIn: boolean
  /** True once the stored value has been read, so nothing animates the swap on first paint. */
  ready: boolean
  signIn: () => void
  signOut: () => void
  account: typeof MOCK_ACCOUNT
  /** Which signed-in persona a sign-in resolves to — see the const above. */
  journey: Journey
  setJourney: (v: Journey) => void
}

const ApplyCtx = createContext<Ctx | null>(null)

export function useApply() {
  const ctx = useContext(ApplyCtx)
  // Thrown rather than a silent default: a CTA rendered outside the provider would look wired up and
  // do nothing, which is the hardest kind of bug to spot in a design replica.
  if (!ctx) throw new Error('useApply must be used inside <ApplyProvider>')
  return ctx
}

export default function ApplyProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(false)
  const [journey, setJourneyState] = useState<Journey>('newUser')
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
    setReady(true)
  }, [])

  const write = useCallback((v: boolean) => {
    setSignedIn(v)
    try {
      if (v) sessionStorage.setItem(KEY, '1')
      else sessionStorage.removeItem(KEY)
    } catch {
      // Same as above — the in-memory state is what drives the UI; storage is only the convenience.
    }
  }, [])

  const signIn = useCallback(() => write(true), [write])
  const signOut = useCallback(() => write(false), [write])

  const setJourney = useCallback((v: Journey) => {
    setJourneyState(v)
    try {
      sessionStorage.setItem(JOURNEY_KEY, v)
    } catch {
      // Same fallback as above.
    }
  }, [])

  const value = useMemo(
    () => ({ signedIn, ready, signIn, signOut, account: MOCK_ACCOUNT, journey, setJourney }),
    [signedIn, ready, signIn, signOut, journey, setJourney],
  )

  return <ApplyCtx.Provider value={value}>{children}</ApplyCtx.Provider>
}
