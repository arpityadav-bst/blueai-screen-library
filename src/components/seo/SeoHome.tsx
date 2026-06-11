'use client'
import '@/styles/seo-home.css'
import { useReveal } from './useReveal'
import { SeoNav } from './SeoNav'
import { SeoHero } from './SeoHero'
import { SeoWhatIs } from './SeoWhatIs'
import { SeoCompare } from './SeoCompare'
import { SeoTasks } from './SeoTasks'
import { SeoSteps } from './SeoSteps'
import { SeoFaq } from './SeoFaq'
import { SeoCta } from './SeoCta'
import { SeoFooter } from './SeoFooter'

// SEO Homepage orchestrator. Everything scoped under .v-seo (leak-safe). useReveal() drives the
// scroll-reveal delight layer (sections fade + rise once on entry).
export function SeoHome() {
  useReveal()
  return (
    <div className="v-seo">
      <SeoNav />
      <main>
        <SeoHero />
        <SeoWhatIs />
        <SeoCompare />
        <SeoTasks />
        <SeoSteps />
        <SeoFaq />
        <SeoCta />
      </main>
      <SeoFooter />
    </div>
  )
}
