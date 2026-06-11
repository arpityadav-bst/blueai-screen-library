import type { Metadata } from 'next'
import { SeoHome } from '@/components/seo/SeoHome'
import { SEO_META, FAQ } from '@/lib/seo-data'

// SEO Homepage (/seo) — standalone, content-rich, search-optimized homepage built on the
// blueai-modern design system. Page-level metadata overrides the layout default.
export const metadata: Metadata = {
  title: SEO_META.title,
  description: SEO_META.description,
}

// FAQPage structured data (the PM's key SEO lever — competitors have FAQ copy but no schema).
// Generated from the same source as the visible accordion so they never drift.
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.items.map((it) => ({
    '@type': 'Question',
    name: it.q,
    acceptedAnswer: { '@type': 'Answer', text: it.a },
  })),
}

export default function SeoHomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <SeoHome />
    </>
  )
}
