'use client'
import '@/styles/seo-home.css'
import { useReveal } from './useReveal'
import { SeoBackdrop } from './SeoBackdrop'
import { MarketingHeader } from '@/components/MarketingHeader'
import { SeoHero } from './SeoHero'
import { SeoWhatIs } from './SeoWhatIs'
import { SeoCompare } from './SeoCompare'
import { SeoTasks } from './SeoTasks'
import { SeoSteps } from './SeoSteps'
import { SeoFaq } from './SeoFaq'
import { SeoCta } from './SeoCta'
import { MarketingFooter } from '@/components/MarketingFooter'

// SEO Homepage orchestrator. Everything scoped under .v-seo (leak-safe). useReveal() drives the
// scroll-reveal delight layer (sections fade + rise once on entry).
export function SeoHome() {
  useReveal()
  return (
    <div className="v-seo">
      <SeoBackdrop />
      <MarketingHeader />
      <main>
        <SeoHero />
        <SeoWhatIs />
        <SeoCompare />
        <SeoTasks />
        <SeoSteps />
        <SeoFaq />
        <SeoCta />
      </main>
      <MarketingFooter />
    </div>
  )
}
