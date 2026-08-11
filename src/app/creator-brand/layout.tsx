import type { Metadata } from 'next'
import './creator-brand.css'
import Backdrop from '@/components/creator-brand/Backdrop'
import ModalHost from '@/components/creator-brand/ModalHost'

// Uses the shared blueai-modern design system loaded by the root layout (Inter/Space
// Grotesk/Bricolage Grotesque fonts, --bai-* tokens) — no separate token set here.

export const metadata: Metadata = {
  title: 'BlueAI — get paid for the content you already make',
  description:
    'Paste your handle, see what brands would pay you. BlueAI matches creators to brand jobs, verifies the work, and pays out automatically — no negotiating, no middleman.',
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
      {/* Hosts all four popups and the context every CTA calls to open them. At the LAYOUT level
          because the triggers are spread across both heroes, both closing bands, the header, the
          footer, the nav and the lookup result — and because one of them opens a dialog from
          inside another. See ModalHost.tsx. */}
      <ModalHost>{children}</ModalHost>
    </div>
  )
}
