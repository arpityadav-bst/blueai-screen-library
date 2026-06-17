import type { Metadata } from 'next'
import '@/styles/creator.css'
import { MarketingHeader } from '@/components/MarketingHeader'
import { MarketingFooter } from '@/components/MarketingFooter'
import { CreatorStudio } from '@/components/creator/CreatorStudio'
import { CreatorHero } from '@/components/creator/CreatorHero'
import { CreatorLibrary } from '@/components/creator/CreatorLibrary'
import { CreatorFormats } from '@/components/creator/CreatorFormats'
import { CreatorBanner } from '@/components/creator/CreatorBanner'
import { CreatorTemplates } from '@/components/creator/CreatorTemplates'
import { CreatorDrama } from '@/components/creator/CreatorDrama'
import { CreatorInfo } from '@/components/creator/CreatorInfo'

// AI Video Creator — "Studio" concept (v2). A creative-tool landing (invideo / Nim / Higgsfield
// -style) on the blueAI light DS: WebGL hero, GSAP marquees, parallax reel. Bespoke (off AgentShell),
// kept as a SEPARATE route from /ai-video-creator (which stays the original agent-page version).
export const metadata: Metadata = {
  title: 'AI Video Creator — Studio concept (v2) | BlueAI',
  description:
    'Creative-tool concept for the BlueAI Video Creator landing — prompt-first hero, format galleries, templates, models and an example reel, on the blueAI design system.',
}

export default function VideoCreatorV2Page() {
  return (
    <div className="v-creator">
      <MarketingHeader />
      <CreatorStudio>
        <main>
          <CreatorHero />
          <CreatorLibrary />
          <CreatorFormats />
          <CreatorBanner />
          <CreatorTemplates />
          <CreatorDrama />
          <CreatorInfo />
        </main>
      </CreatorStudio>
      <MarketingFooter />
    </div>
  )
}
