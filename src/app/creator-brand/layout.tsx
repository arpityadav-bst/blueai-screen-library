import type { Metadata } from 'next'
import './creator-brand.css'
import Backdrop from '@/components/creator-brand/Backdrop'
import ModalHost from '@/components/creator-brand/ModalHost'
import ApplyProvider from '@/components/creator-brand/creators/ApplyState'

// Uses the shared blueai-modern design system loaded by the root layout (Inter/Space
// Grotesk/Bricolage Grotesque fonts, --bai-* tokens) — no separate token set here.

// Rewritten 2026-08-13. The old description opened "Paste your handle, see what brands would pay
// you" — the handle lookup it described was removed, so the page's own summary was advertising a
// control that is no longer on it.
export const metadata: Metadata = {
  title: 'BlueAI — get paid for the content you already make',
  description:
    'Apply to run brand campaigns with BlueAI. It matches you with real campaigns, completes them on your account from your own PC, and pays you by PayPal each month.',
}

export default function CreatorBrandLayout({ children }: { children: React.ReactNode }) {
  return (
    // bg matches the sampled background of the hero artwork (~#F9F9FA,
    // not pure white) so the image's masked edges blend into the page with no visible
    // seam. Scoped to this layout only — the shared --bai-canvas token stays untouched.
    //
    // NO overflow-x-clip here. It was removed when the steps were a GSAP-pinned section
    // (a clip context can clip position:fixed descendants, which forced a transform-pin and
    // its sub-pixel jitter). That section is now a plain card row, so the pinning reason is
    // gone — but the OTHER reason it was dropped still stands on its own: it was redundant.
    // The only horizontal overflow on these pages is the heroes' negatively-offset edge
    // cards, and both hero <section>s already carry their own overflow-hidden. Measured at
    // 0px horizontal document overflow without it. So this stays off; re-adding it would
    // reintroduce a clip context to guard against nothing.
    <div className="cb-scope relative min-h-screen bg-[#F9F9FA]">
      <Backdrop />
      <div className="cb-grain" aria-hidden="true" />
      {/* ApplyProvider is OUTSIDE ModalHost, and the order is load-bearing: the sign-in dialog is
          hosted BY ModalHost and calls signIn() on the state this provides, so the state has to exist
          above it. It also has to sit above <Header/>, which each page renders as a sibling of
          <main> — the header swaps its CTA for the account chip, so the layout is the only level that
          can see both it and the page body. See creators/ApplyState.tsx.

          ModalHost hosts every popup and the context every CTA calls to open them, at the LAYOUT
          level because the triggers are spread across both heroes, both closing bands, the header and
          the footer, and because one of them opens a dialog from inside another. */}
      <ApplyProvider>
        <ModalHost>{children}</ModalHost>
      </ApplyProvider>
    </div>
  )
}
