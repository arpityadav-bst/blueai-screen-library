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
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      setSignedIn(sessionStorage.getItem(KEY) === '1')
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

  const value = useMemo(
    () => ({ signedIn, ready, signIn, signOut, account: MOCK_ACCOUNT }),
    [signedIn, ready, signIn, signOut],
  )

  return <ApplyCtx.Provider value={value}>{children}</ApplyCtx.Provider>
}
