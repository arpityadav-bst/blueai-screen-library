'use client'

import { useEffect, useRef } from 'react'
import { useCrx } from './flow/CrxState'
import HomeMain from './HomeMain'
import HomeBelow from './HomeBelow'
import HomeOverlay from './HomeOverlay'
import useHomeFx from './useHomeFx'
import useBootIntro from './useBootIntro'

// The SIGNED-OUT homepage — extracted from CreatorsHome.tsx (Phase 3) so the boot intro and the
// perpetual task loop only exist while a signed-out visitor is looking at them. Moving the two
// hooks HERE is the whole mechanism: hooks run only while their component is mounted, so signing
// in unmounts this view and useBootIntro/useHomeFx's own cleanups (rAF, timers, listeners, the
// body crx-lock) tear the show down — no new teardown code needed. CreatorsHome keeps the .crx
// root and the branching; this file is the homepage and nothing else.
export default function HomepageView({ onCta }: { onCta: () => void }) {
  const startLoop = useHomeFx()
  useBootIntro(startLoop)

  // HERO CTA WIRING BY ID, not by prop: HomeMain is owned by another agent in this parallel build,
  // so its #hero-cta button (which today has no onClick at all) gets its handler attached from the
  // outside — the same addressing-static-markup-by-id idiom useHomeFx already uses on this page.
  // A follow-up can move this into an onCta prop on HomeMain once file ownership relaxes.
  // Ref-forwarded so a re-render with a new closure never re-binds the listener.
  //
  // #hero-signin (the "Already have an account?" door, PM 2026-08-20) is wired the same way, with
  // creator-brand Hero.tsx's exact semantics: someone clicking Sign in has an account by
  // definition, so the journey is set to returningUser BEFORE the dialog opens — that door
  // resolves to the dashboard, overriding the preview toggler's persona for this one click.
  const { setJourney } = useCrx()
  const onCtaRef = useRef(onCta)
  onCtaRef.current = onCta
  const setJourneyRef = useRef(setJourney)
  setJourneyRef.current = setJourney
  useEffect(() => {
    const el = document.getElementById('hero-cta')
    const door = document.getElementById('hero-signin')
    const open = () => onCtaRef.current()
    const openReturning = () => {
      setJourneyRef.current('returningUser')
      onCtaRef.current()
    }
    el?.addEventListener('click', open)
    door?.addEventListener('click', openReturning)
    return () => {
      el?.removeEventListener('click', open)
      door?.removeEventListener('click', openReturning)
    }
  }, [])

  return (
    <>
      <HomeMain />
      {/* The closer stays on the signed-out homepage (its ask — apply — is exactly right here),
          and its button opens the same sign-in dialog the header/hero CTAs do. */}
      <HomeBelow onCta={onCta} />
      <HomeOverlay />
    </>
  )
}
