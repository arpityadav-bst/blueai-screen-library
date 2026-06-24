import { Sparkle } from '@/components/Sparkle'

// Primary gradient CTA — the shared button used by the hero + homepage (.dl-cta). Pre-launch
// posture: default label is "Join the Waitlist". Brand primitives: the canonical <Sparkle/> + the gradient pill.
export function DownloadCta({ label = 'Join the Waitlist', href = '#' }: { label?: string; href?: string }) {
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
