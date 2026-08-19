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
  /** True once storage has been read, so nothing animates the swap on first paint. */
  ready: boolean
  signIn: () => void
  signOut: () => void
  account: typeof MOCK_ACCOUNT
  /** Which signed-in persona a sign-in resolves to — see the JOURNEY_KEY note above. */
  journey: Journey
  setJourney: (v: Journey) => void
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
      // Same as above — in-memory state drives the UI; storage is only the convenience.
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

  return <CrxCtx.Provider value={value}>{children}</CrxCtx.Provider>
}
