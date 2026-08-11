import Header from '@/components/creator-brand/Header'
import Footer from '@/components/creator-brand/Footer'
import Hero from '@/components/creator-brand/brands/Hero'
import HowItWorksBrand from '@/components/creator-brand/brands/HowItWorksBrand'
import PlatformsBrand from '@/components/creator-brand/brands/PlatformsBrand'
import OutcomePricing from '@/components/creator-brand/brands/OutcomePricing'
import TrustSectionBrand from '@/components/creator-brand/brands/TrustSectionBrand'
import FAQBrand from '@/components/creator-brand/brands/FAQBrand'
import ClosingCTA from '@/components/creator-brand/brands/ClosingCTA'

export default function BrandsPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorksBrand />
        <PlatformsBrand />
        {/* No campaign-form section any more (designer, 2026-08-11) — the form is a dialog opened
            by every "Create a campaign" CTA. It's mounted once in the layout's ModalHost. */}
        <OutcomePricing />
        <TrustSectionBrand />
        <FAQBrand />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  )
}
