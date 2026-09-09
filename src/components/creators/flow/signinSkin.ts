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

export const SKIN = {
  dark: {
    card: '#1F1F23',
    ink: '#fff',
    ink70: 'rgba(255,255,255,0.7)',   // sub-heading
    ink80: 'rgba(255,255,255,0.8)',   // field label
    ink40: 'rgba(255,255,255,0.4)',   // separator + legal
    rule: 'rgba(255,255,255,0.2)',    // hairlines
    tileLine: 'transparent',          // the white provider tiles need no edge on a dark card
    accent: '#7B4CFF',
    wash: 'rgba(123,76,255,0.16)',    // the tint behind an icon
    field:
      'border-white/50 bg-black/20 text-white placeholder:text-white/40 hover:border-white/80' +
      ' focus:border-[#7B4CFF] focus:shadow-[0_0_0_3px_rgba(123,76,255,0.25)]',
  },
  light: {
    card: '#ffffff',
    ink: 'rgb(8,10,31)',
    ink70: 'rgb(55,58,88)',
    ink80: 'rgb(43,46,76)',
    ink40: 'rgb(106,110,136)',
    rule: 'rgb(223,228,238)',
    // On white, the Apple and Google tiles ARE white - without an edge they are two invisible
    // buttons in a row of four. Discord and Facebook keep their brand fills and ignore this.
    tileLine: 'rgb(223,228,238)',
    accent: '#7B4CFF',
    wash: 'rgba(123,76,255,0.08)',
    field:
      'border-[#cdd4e2] bg-white text-[rgb(8,10,31)] placeholder:text-[rgb(106,110,136)] hover:border-[#7B4CFF]' +
      ' focus:border-[#7B4CFF] focus:shadow-[0_0_0_3px_rgba(123,76,255,0.18)]',
  },
} as const

export type Skin = (typeof SKIN)[keyof typeof SKIN]

/** The 0.8px ring around the card - the one visual the card kept from the now.gg original. */
export const RING = '#7B4CFF'

/** THE PAGE'S PRIMARY, not the replica's (Appy, 2026-09-02: "is it the same as the primary cta on
 *  hero page?" - it was not). The dialog carried now.gg's own auth button: a two-stop iris -> cyan
 *  gradient at 270deg, an 8px radius, 600 weight, no shadow. It survived because everything about
 *  the card was once a faithful copy; with the branding, the waves and the dark surface all gone, it
 *  was the last piece still speaking now.gg's design language.
 *  These three are creators.css's --cta-grad, .btn's radius and .btn's shadow, copied as literals
 *  because this card paints outside the .crx scope with inline styles and cannot reach a CSS token.
 *  THE TOKEN IS THE SOURCE OF TRUTH: if --cta-grad or .btn's shadow changes, change these with it. */
export const CTA = 'linear-gradient(105deg, #1a90ff 0%, #6b53ff 55%, #7b4cff 100%)'
export const CTA_SHADOW = '0 10px 30px -6px rgba(95, 70, 255, 0.65)'

/**
 * ONE WIDTH FOR BOTH LEVELS, and it has now moved twice for the same reason. 360 was the now.gg
 * original's measured width; 400 came on 2026-09-02 when level 1 needed room for three explained
 * rows; 480 comes on 2026-09-09 when those rows became three side-by-side cards. At 400 each card
 * had about 105px, which is a title and nothing else - and a title alone turned out to be too
 * little (Appy: "the messaging in this pop-up is pretty short"). 480 gives each card ~136px, which
 * is what a short qualifying line needs in order to sit on two lines rather than four.
 * BOTH LEVELS MOVE TOGETHER. A width that changed between them would jar as they slide.
 */
export const CARD_WIDTH = 'max-w-[480px]'

/** Poppins is the card's face because the now.gg original set it; both levels share it so the slide
 *  between them does not change typeface mid-dialog. Whether the dialog should move to the site's
 *  own Inter now that it is no longer a replica is a separate call, not made here. */
export const CARD_FONT = "'Poppins', sans-serif"
