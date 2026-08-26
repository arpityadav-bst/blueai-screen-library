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

// REGISTRATION IS A SECOND, SEPARATE FACT (2026-08-26). Signing in says who you are; registering
// says the brand exists and has been submitted for review. The flow now has three states, not two —
// signed out, signed in but unregistered, registered — and collapsing the last two into one flag
// would make "signed in" mean different things on different screens.
// SAME STORE AND THE SAME CONTRACT as cb-brand-email, because the static dashboard
// (public/creator-brand/campaign-report.html) has to read it too: it is what decides whether that
// page shows campaigns or the in-review screen. Changing this key without changing it there signs
// the brand out of its own review state.
// A JSON blob rather than a bare string: the review screen wants the brand's name, and a second
// bare key per field is how the pair drifts.
const REG_KEY = 'cb-brand-registered'

export type BrandReg = { name: string; email: string; site?: string }

function readReg(): BrandReg | null {
  try {
    const raw = localStorage.getItem(REG_KEY)
    if (!raw) return null
    const v = JSON.parse(raw) as BrandReg
    return v && typeof v.name === 'string' ? v : null
  } catch {
    // Unparseable or unreadable: treat as unregistered rather than throwing on a storage read.
    return null
  }
}

/** Storage only, no state flip — the registration submit navigates straight to the dashboard, and
 *  flipping in-memory state first would swap the dialog's panel for a frame while the page unloads.
 *  Exactly the reasoning persistBrandSignIn carries. */
export function persistBrandRegistration(reg: BrandReg) {
  try {
    localStorage.setItem(REG_KEY, JSON.stringify(reg))
  } catch {
    // Private-mode Safari throws; nothing useful to do mid-navigation.
  }
}

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
  /** The submitted brand, or null when signed in but not yet registered. */
  registration: BrandReg | null
  /** True once storage has been read, so nothing animates the signed-in swap on first paint. */
  ready: boolean
  /** The signed-in work email, or null when signed in through the Google stub (or signed out). */
  email: string | null
  signIn: (email?: string) => void
  signOut: () => void
  register: (reg: BrandReg) => void
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
  const [registration, setRegistration] = useState<BrandReg | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY)
      if (v !== null) setBrand({ email: v || null })
      setRegistration(readReg())
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

  const register = useCallback((reg: BrandReg) => {
    setRegistration(reg)
    persistBrandRegistration(reg)
  }, [])

  // Signing out clears BOTH: a session that kept its registration would put the next visitor
  // straight onto someone else's review screen.
  const signOut = useCallback(() => {
    setBrand(null)
    setRegistration(null)
    try {
      localStorage.removeItem(REG_KEY)
      localStorage.removeItem(KEY)
    } catch {
      // Same fallback as above.
    }
  }, [])

  const value = useMemo(
    () => ({ signedIn: brand !== null, registration, ready, email: brand?.email ?? null, signIn, signOut, register }),
    [brand, registration, ready, signIn, signOut, register],
  )

  return <BrandCtx.Provider value={value}>{children}</BrandCtx.Provider>
}
