'use client'

import { Arrow } from '@/components/Arrow'
import { Sparkle } from '@/components/Sparkle'
import { useCBModal } from './ModalHost'
import { useApply } from './creators/ApplyState'
import AccountMenu from './creators/AccountMenu'
import type { NavAudience } from './nav'

// The header's right-hand slot. Pulled out of Header.tsx on 2026-08-13 — that file was at 269 lines
// against this project's 300-line rule and this slot grew a third state, so it needed to be somewhere
// rather than pushing the header over.
//
// THREE OUTCOMES, not two:
//   · brands            → "Create a campaign", opens the campaign dialog. Unchanged.
//   · creators, out     → "Apply Now", opens the sign-in dialog.
//   · creators, in      → the account chip. No CTA at all, because the action it would offer is
//                         already on the page: the application IS the top of the page once you're
//                         signed in, so a header button pointing at it competes with itself.
//
// The chip IS a menu now (designer, 2026-08-13): hover feedback on the trigger, and a click opens a
// popover carrying the account identity and Log out. It replaced an inert avatar+name row whose only
// route out of the signed-in state was the review-only PreviewToggler — which is fine for a reviewer
// and wrong for the flow being reviewed.
//
// THE TWO CTA BUTTONS ARE `hidden lg:...` NOW (2026-08-13) — MobileMenu.tsx is what shows below
// `lg`, carrying the same action inside its own popover alongside the nav row mobile never had.
// The AccountMenu branch is deliberately NOT hidden — it's compact enough to stay on screen at
// every width, and MobileMenu itself renders nothing in that state (see its own comment).
export default function HeaderCTA({
  active,
  pastHeroImage,
}: {
  active: NavAudience
  /** Once the hero image's top edge reaches the header, the quiet link becomes the primary button. */
  pastHeroImage: boolean
}) {
  const { open } = useCBModal()
  const { signedIn } = useApply()

  // Was an inert avatar+name row with no hover and no way out of the signed-in state. It is now a
  // real menu control (AccountMenu), following blueai-desktop's kebab pattern — see that file.
  //
  // signedIn ALONE covers both signed-in outcomes (2026-08-14) — "same header... just his profile
  // icon and the email and the logout, just how it is right now when signed in" was the explicit ask
  // for the dashboard, and CreatorsTop.tsx now only ever shows the dashboard when signedIn is true, so
  // there's no longer a separate isReturningUser check needed here: it's the same account chip either
  // way, which is also what makes Log out land on the same Hero from both places.
  if (active === 'creators' && signedIn) return <AccountMenu />

  return (
    <button
      type="button"
      onClick={() => open(active === 'creators' ? 'signin' : 'campaign')}
      className={
        pastHeroImage
          ? // Past the hero image, this becomes the primary CTA — the canonical Sparkle + label +
            // Arrow pattern (DownloadCta.tsx), same gradient pill as the hero's own button, so it
            // reads as THE action once that one scrolls by.
            'hidden items-center gap-1.5 rounded-pill bg-cta-gradient px-4 py-2 text-[14px] font-semibold text-white shadow-cta transition-all hover:-translate-y-0.5 hover:shadow-cta-hover lg:inline-flex'
          : // Over the hero, stay quiet — the hero's own CTA is already the focus. Hover is THIS
            // SITE'S ACCENT, --cb-accent via cb-accent-hover (creator-brand.css). Still not the
            // marketing DS's --bai-accent (#1990FF), which is load-bearing on the dormant pages — the
            // variable is .cb-scope-scoped for exactly that reason.
            // No opacity: ink-muted at 0.7 over this route's #F9F9FA composites to 3.90:1, and this is
            // the header's only action. The gradient pill state already carries the hierarchy, so the
            // quiet state does not need quietening twice. whitespace-nowrap stops "Create a campaign"
            // wrapping inside its own row at 320.
            'cb-accent-hover -mr-2 hidden min-h-[44px] items-center gap-1.5 whitespace-nowrap px-2 py-2.5 text-[14px] font-normal text-ink-body-2 transition-all lg:inline-flex sm:text-[15px]'
      }
    >
      {pastHeroImage && <Sparkle size={13} />}
      {active === 'creators' ? 'Apply Now' : 'Create a campaign'}
      <Arrow size={13} />
    </button>
  )
}
