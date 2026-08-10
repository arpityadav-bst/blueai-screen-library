import type { Metadata } from 'next'
import './creator-brand.css'
import Backdrop from '@/components/creator-brand/Backdrop'

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
    <div className="cb-scope relative min-h-screen overflow-x-clip bg-[#F9F9FA]">
      <Backdrop />
      <div className="cb-grain" aria-hidden="true" />
      {children}
    </div>
  )
}
