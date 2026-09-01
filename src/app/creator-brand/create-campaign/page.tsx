import type { Metadata } from 'next'
import CreateCampaignFlow from '@/components/creator-brand/brands/create/CreateCampaignFlow'

// /creator-brand/create-campaign - the agentic re-cut of the dev prototype's campaign builder
// (Appy, 2026-09-01). It sits BESIDE the existing 3-step campaign modal rather than replacing it:
// both are reviewable, the brand page is untouched, and the cutover is its own decision later.
//
// It inherits the creator-brand layout (Backdrop, grain, BrandSessionProvider, ModalHost) because
// it is part of that site, but it renders its own tool topbar instead of the marketing Header - see
// CreateCampaignFlow for why a signed-in builder should not wear a Create a campaign CTA.

export const metadata: Metadata = {
  title: 'New campaign · BlueAI for agencies',
  description:
    'Pick what you want to happen, see how the campaign works, and set it up. Nine campaign types across four outcomes, priced per checked result.',
}

export default function CreateCampaignPage() {
  return <CreateCampaignFlow />
}
