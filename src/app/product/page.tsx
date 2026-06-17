import { Shell } from '@/components/product/Shell'

// The BlueAI in-app product — ported to the Next DS (real components on --bai-* tokens).
// Rendered in the ~421×830 panel frame, centered on a calm neutral backdrop.
export default function ProductPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-divider p-6 font-sans">
      <div className="relative flex h-[830px] w-[421px] shrink-0 flex-col overflow-hidden rounded-[16px] border border-stroke bg-surface shadow-overlay">
        <Shell />
      </div>
    </div>
  )
}
