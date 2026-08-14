'use client'

import { CBButton } from '../Button'
import { Sparkle } from '@/components/Sparkle'
import { Arrow } from '@/components/Arrow'
import { useCBModal } from '../ModalHost'
import { useApply } from './ApplyState'

// THE Apply CTA. Every "Apply now" on the creators page is this component, and it is state-aware in
// one place rather than at each call site: signed out it opens the sign-in dialog, signed in it
// scrolls to the form that is already on the page.
//
// That branch is the whole reason this exists instead of a plain <ModalCTA kind="signin">. There are
// four of these on the page (hero, header, closing band, and the band again after submitting), and a
// signed-in reader clicking any of them must not be shown a sign-in dialog for an account they are
// already using — which is exactly what a fixed `kind` would do.
//
// Sparkle + label + Arrow is the canonical primary-CTA pattern on this site (DownloadCta.tsx), and
// the label is the PM's, unchanged: "Apply Now".
export default function ApplyButton({
  size = 'lg',
  label = 'Apply Now',
  className,
}: {
  size?: 'md' | 'lg'
  label?: string
  className?: string
}) {
  const { open } = useCBModal()
  const { signedIn } = useApply()

  function onClick() {
    if (!signedIn) {
      open('signin')
      return
    }
    // The top of the page, matching SignInDialog and the form's own step changes — the application
    // sits there once you're signed in, and landing on it with its heading intact beats landing on
    // the form's top edge with the heading scrolled away.
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <CBButton size={size} className={className} onClick={onClick}>
      <Sparkle size={size === 'lg' ? 15 : 13} />
      {label}
      <Arrow size={size === 'lg' ? 15 : 13} />
    </CBButton>
  )
}
