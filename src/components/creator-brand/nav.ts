// Shared per-audience nav data — every link here is a REAL in-page anchor (grep the section
// `id`s under creators/ and brands/ before adding one; there are no other routes under
// /creator-brand to link to). Extracted out of Header.tsx so Footer.tsx can reuse the exact
// same list rather than hand-authoring a second one that can silently drift from it — the
// same reasoning that pulled the platform-card logos into channels.ts.
export type NavAudience = 'creators' | 'brands'

export const NAV: Record<NavAudience, { label: string; href: string }[]> = {
  creators: [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Open jobs', href: '#jobs' },
    { label: 'Platforms', href: '#platforms' },
    { label: 'FAQ', href: '#faq' },
  ],
  brands: [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Platforms', href: '#platforms' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Post a job', href: '#post-a-job' },
    { label: 'FAQ', href: '#faq' },
  ],
}

export const OTHER: Record<NavAudience, NavAudience> = { creators: 'brands', brands: 'creators' }
