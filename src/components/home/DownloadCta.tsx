import { Sparkle } from '@/components/Sparkle'

// "Download BlueAI" gradient CTA — the shared button used by the hero + homepage (.dl-cta).
// Brand primitives: the canonical <Sparkle/> + the gradient pill (white label on it).
export function DownloadCta({ label = 'Download BlueAI', href = '#' }: { label?: string; href?: string }) {
  return (
    <a className="dl-cta" href={href}>
      <Sparkle className="spark" />
      {label}
      <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </a>
  )
}
