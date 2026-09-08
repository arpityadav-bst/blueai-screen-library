// THE SIGN-IN DIALOG'S PALETTE, shared by both of its levels (2026-09-02).
//
// It lived inside SignInDialog.tsx until the dialog grew a first level (Expectations.tsx) that has
// to look like the same card - same surface, same ink tiers, same field and CTA treatment - because
// the two slide into each other. Two components each holding a copy of these values is how the two
// halves of one dialog start disagreeing about what "muted" means.
//
// A PALETTE OBJECT RATHER THAN CSS TOKENS, still. Both levels paint with inline styles and Tailwind
// utilities rather than the .crx kit, so var(--sur) would resolve to nothing on most of these and
// CSS overrides would be fighting utility specificity. Two literal sets, taken from the same DS
// values the light block uses, is the honest shape for components built this way.

/* ONE SKIN, NOT TWO (2026-09-08). It was keyed by theme until the site went light-only; a map
   with one entry is a lookup that can only ever return the same thing, so the key went with the
   theme it was keyed on. The dark values are in git if a dark surface ever comes back. */
export const SKIN = {
  card: '#ffffff',
  ink: 'rgb(8,10,31)',
  ink70: 'rgb(55,58,88)',
  ink80: 'rgb(43,46,76)',
  ink40: 'rgb(106,110,136)',
  rule: 'rgb(223,228,238)',
  // On white, the Apple and Google tiles ARE white - without an edge they are two invisible
  // buttons in a row of four. Discord and Facebook keep their brand fills and ignore this.
  tileLine: 'rgb(223,228,238)',
  // THE PAGE'S SECONDARY ACCENT, which is the logo's own blue - onblue.css --accent, restated here
  // because this card paints with inline styles outside the .crx token scope.
  accent: '#2F6DFF',
  wash: 'rgba(47,109,255,0.08)',      // the tint behind an icon
  field:
    'border-[#cdd4e2] bg-white text-[rgb(8,10,31)] placeholder:text-[rgb(106,110,136)] hover:border-[#2F6DFF]' +
    ' focus:border-[#2F6DFF] focus:shadow-[0_0_0_3px_rgba(47,109,255,0.18)]',
} as const

export type Skin = typeof SKIN

/** The 0.8px ring around the card - the one visual the card kept from the now.gg original. It was
 *  the brand iris; it is the accent blue now, for the same reason every other flat accent moved. */
export const RING = '#2F6DFF'

/** THE PAGE'S PRIMARY, not the replica's (Appy, 2026-09-02: "is it the same as the primary cta on
 *  hero page?" - it was not). The dialog carried now.gg's own auth button: a two-stop iris -> cyan
 *  gradient at 270deg, an 8px radius, 600 weight, no shadow. It survived because everything about
 *  the card was once a faithful copy; with the branding, the waves and the dark surface all gone, it
 *  was the last piece still speaking now.gg's design language.
 *  These three are onblue.css's --cta-grad, .btn's radius and .btn's shadow, copied as literals
 *  because this card paints outside the .crx scope with inline styles and cannot reach a CSS token.
 *  THE TOKEN IS THE SOURCE OF TRUTH: if --cta-grad or .btn's shadow changes, change these with it. */
export const CTA = '#2E3138'
export const CTA_SHADOW = '0 10px 30px -10px rgba(8, 10, 31, 0.28)'

/**
 * ONE WIDTH FOR BOTH LEVELS. The card was 360 - the now.gg original's measured width. It is 400 now
 * (Appy, 2026-09-02): level 1 needs the room for three explained rows, and a width that changed
 * between the two levels would jar as they slide, so both moved together.
 */
export const CARD_WIDTH = 'max-w-[400px]'

/** Poppins is the card's face because the now.gg original set it; both levels share it so the slide
 *  between them does not change typeface mid-dialog. Whether the dialog should move to the site's
 *  own Inter now that it is no longer a replica is a separate call, not made here. */
export const CARD_FONT = "'Poppins', sans-serif"
