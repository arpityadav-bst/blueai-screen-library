'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

// The brand-side session, lifted out of ModalHost (2026-08-18, FE review). It lived as local state
// inside the modal host, which meant the ONLY control that could see "this brand is signed in" was
// the campaign dialog itself: the header had no Sign in entry for a returning brand, no way to reach
// the campaigns dashboard without walking "Create a campaign", and no Log out anywhere. Same shape
// and reasoning as the creators' ApplyState.tsx: three subtrees (the header, the mobile menu, the
// campaign dialog) need the same answer at the same time, so the state lives at the layout level.
//
// localStorage, NOT sessionStorage, and the key is load-bearing: the static dashboard
// (public/creator-brand/campaign-report.html) reads and writes the same 'cb-brand-email' entry to
// personalize its account chip and skip its own sign-in gate. Changing either the store or the key
// here silently signs the brand out of that page.
//
// STORED VALUE SEMANTICS (inherited from the ModalHost version): absent = signed out; '' = signed
// in through the Google stub, where no email is known; anything else = the work email. Which is why
// `email` is nullable while signed in, and why the state is an object internally rather than a bare
// string.
//
// FIRST PAINT IS ALWAYS SIGNED OUT, storage applied in an effect: reading it during render would
// make the server HTML and the client's first render disagree (a hydration error), and signed out
// is the honest default for a fresh visitor anyway.
const KEY = 'cb-brand-email'

/** Storage only, no state flip. For the one caller that signs in and immediately does a full
 *  navigation (ModalHost's gate redirecting to the dashboard): flipping in-memory state there would
 *  swap the dialog's panel to the campaign form for a frame while the page unloads. The next page
 *  load hydrates from this write anyway. */
export function persistBrandSignIn(email?: string) {
  try {
    localStorage.setItem(KEY, email ?? '')
  } catch {
    // Private-mode Safari throws on storage access; nothing useful to do mid-navigation.
  }
}

type Ctx = {
  signedIn: boolean
  /** True once storage has been read, so nothing animates the signed-in swap on first paint. */
  ready: boolean
  /** The signed-in work email, or null when signed in through the Google stub (or signed out). */
  email: string | null
  signIn: (email?: string) => void
  signOut: () => void
}

const BrandCtx = createContext<Ctx | null>(null)

export function useBrandSession() {
  const ctx = useContext(BrandCtx)
  // Thrown rather than a silent default, same reasoning as useApply and useCBModal: a control
  // rendered outside the provider would look wired up and do nothing.
  if (!ctx) throw new Error('useBrandSession must be used inside <BrandSessionProvider>')
  return ctx
}

export default function BrandSessionProvider({ children }: { children: ReactNode }) {
  const [brand, setBrand] = useState<{ email: string | null } | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY)
      if (v !== null) setBrand({ email: v || null })
    } catch {
      // Private-mode Safari throws on storage access. Staying signed out is the correct fallback
      // and it must not take the page down with it.
    }
    setReady(true)
  }, [])

  const signIn = useCallback((email?: string) => {
    // In-memory state is what drives the UI; the storage write is the convenience.
    setBrand({ email: email ?? null })
    persistBrandSignIn(email)
  }, [])

  const signOut = useCallback(() => {
    setBrand(null)
    try {
      localStorage.removeItem(KEY)
    } catch {
      // Same fallback as above.
    }
  }, [])

  const value = useMemo(
    () => ({ signedIn: brand !== null, ready, email: brand?.email ?? null, signIn, signOut }),
    [brand, ready, signIn, signOut],
  )

  return <BrandCtx.Provider value={value}>{children}</BrandCtx.Provider>
}
