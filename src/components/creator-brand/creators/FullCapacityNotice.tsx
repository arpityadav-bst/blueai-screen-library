import CTABand from '../CTABand'
import PixelRain from './PixelRain'
import { useApply } from './ApplyState'

// The "full capacity" persona (2026-08-14) — CreatorsTop's fourth branch alongside Hero, ApplySection
// and Dashboard. A creator signs in exactly like a first-time applicant (same Hero, same
// SignInDialog), but instead of the application form they land straight here: BlueAI isn't taking on
// new creators right now.
//
// REUSES ApplyForm's OWN submitted-confirmation TREATMENT rather than a new one — same CTABand
// (colour + the perspective grid top and bottom), same tick-in-a-ring mark, same min-height as the
// form it stands in for (514 mobile / 454 desktop — see ApplyForm.tsx for that number's derivation).
// Appy asked for "the same size as... the form" confirmation screen; sharing the actual component is
// the honest way to guarantee that rather than re-measuring it a second time here.
//
// SAME OUTER SHELL AS ApplySection.tsx (id="hero", data-cb-nogate, the same PixelRain, the same
// max-w-[620px] column) — this replaces the application at the top of the page, not a fourth kind of
// section, so it should feel like the same weight of thing sliding into the same slot.
//
// idPrefix UNIQUE (see CTABand.tsx) — cbGridFullCapacity, distinct from ApplyForm's cbGridApplied and
// ApplyCTA's cbGridClosing. Those two can never be on the page at the same time as this one anyway
// (different CreatorsTop branches, and ApplyCTA returns null for every signed-in state), but a name of
// its own costs nothing and stops that from ever being the thing holding this up.
export default function FullCapacityNotice() {
  const { account } = useApply()

  return (
    <section id="hero" data-cb-nogate="true" className="relative overflow-hidden px-6 pb-16 pt-10 sm:pt-14">
      <PixelRain className="z-0" />
      <div className="relative z-[1] mx-auto max-w-[620px]">
        <CTABand idPrefix="cbGridFullCapacity">
          <div className="flex min-h-[514px] flex-col items-center justify-center sm:min-h-[454px]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-circle bg-white/10 ring-1 ring-white/20">
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="white"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4.5 12.5l5 5L19.5 6.5" />
              </svg>
            </div>
            <h2 className="mt-5 font-head text-3xl font-bold text-white">Thanks for your interest.</h2>
            <p className="bai-body-lg mx-auto mt-3 max-w-[44ch] text-white/80">
              We&apos;re at full capacity right now and not onboarding new creators just yet.
              We&apos;ll email <b className="font-semibold text-white">{account.email}</b> the
              moment a spot opens up.
            </p>
          </div>
        </CTABand>
      </div>
    </section>
  )
}
