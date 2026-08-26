import Header from '@/components/creator-brand/Header'
import Footer from '@/components/creator-brand/Footer'
import Hero from '@/components/creator-brand/brands/Hero'
import HowItWorksBrand from '@/components/creator-brand/brands/HowItWorksBrand'
import PlatformsBrand from '@/components/creator-brand/brands/PlatformsBrand'
import OutcomePricing from '@/components/creator-brand/brands/OutcomePricing'
import TrustSectionBrand from '@/components/creator-brand/brands/TrustSectionBrand'
import FAQBrand from '@/components/creator-brand/brands/FAQBrand'
import ClosingCTA from '@/components/creator-brand/brands/ClosingCTA'
import BrandPreview from '@/components/creator-brand/brands/BrandPreview'

export default function BrandsPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorksBrand />
        <PlatformsBrand />
        {/* No campaign-form section any more (designer, 2026-08-11), the form is a dialog opened
            by every "Create a campaign" CTA. It's mounted once in the layout's ModalHost. */}
        <OutcomePricing />
        <TrustSectionBrand />
        <FAQBrand />
        <ClosingCTA />
      </main>
      <Footer />
      {/* Brands only — it steps through the agency states (new / registered / approved), and the
          creators page has its own PreviewToggler for its own. Mounted by the page rather than the
          shared layout, which is what stops the two from stacking; see layout.tsx.
          Outside <main> and last, matching creators/page.tsx: it is design-handoff chrome, not part
          of the document. It still renders above any dialog — BrandPreview positions itself fixed
          and ModalHost's overlay does not cover it, so a switch stays reachable while a dialog it
          put you in is open. */}
      <BrandPreview />
    </>
  )
}
